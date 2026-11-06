const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');

process.env.GROQ_API_KEY = 'test-only-key';
const { magicTailor } = require('../controllers/ai-controller');

const makeResponse = () => {
  let statusCode = 200;
  let payload;
  return {
    res: {
      status(code) { statusCode = code; return this; },
      json(body) { payload = body; return this; }
    },
    read: () => ({ statusCode, payload })
  };
};

const readMappedEntries = (prompt) => {
  const marker = 'CANDIDATE RESUME FACTS FOR THIS SECTION:\n';
  const start = prompt.indexOf(marker);
  const end = prompt.indexOf('\n\nReview all entries', start);
  if (start < 0 || end < 0) throw new Error('Review prompt did not include the source entries.');
  return JSON.parse(prompt.slice(start + marker.length, end));
};

const validSectionResponse = (prompt) => {
  const mapped = readMappedEntries(prompt);
  return JSON.stringify({
    entries: mapped.map((entry) => ({
      _index: entry._index,
      bullets: entry.bullets.map((text, bulletIndex) => ({
        bulletIndex, action: 'keep', text, reason: 'Already relevant and clear.'
      })),
      additions: []
    }))
  });
};

const withAxiosMock = async (handler, run) => {
  const originalPost = axios.post;
  axios.post = handler;
  try {
    await run();
  } finally {
    axios.post = originalPost;
  }
};

const invoke = async (resumeData, handler, jobDescription = 'A sufficiently detailed target job description') => {
  const response = makeResponse();
  await withAxiosMock(handler, async () => {
    await magicTailor({ body: { jobDescription, resumeData } }, response.res);
  });
  return response.read();
};

test('rejects missing or blank job descriptions without calling Groq', async () => {
  let calls = 0;
  const response = makeResponse();
  await withAxiosMock(async () => { calls += 1; throw new Error('should not call AI'); }, async () => {
    await magicTailor({ body: { jobDescription: '  ', resumeData: {} } }, response.res);
  });
  assert.equal(response.read().statusCode, 400);
  assert.equal(calls, 0);
});

test('reviews experience, projects, and explicitly supported custom bullet sections only', async () => {
  const prompts = [];
  const { statusCode, payload } = await invoke({
    summary: 'Existing summary',
    experience: [{ company: 'Acme', description: ['Built an API'] }],
    projects: [{ title: 'Portfolio', bulletPoints: ['Created a portfolio'] }],
    education: [{ institution: 'University', description: 'Degree details' }],
    certifications: [{ name: 'Cloud cert', text: 'Certification details' }],
    customText: [{ title: 'About', text: 'This is prose, not a bullet list' }],
    customList: [{ title: 'Volunteering', description: ['Helped organize events'] }],
    customBullets: ['Mentored two students'],
    skills: [{ category: 'Tools', items: [{ name: 'Git' }] }],
    sections: [
      { key: 'customText', title: 'About', isCustom: true, type: 'text' },
      { key: 'customList', title: 'Volunteering', isCustom: true, type: 'list' },
      { key: 'customBullets', title: 'Highlights', isCustom: true, type: 'bullets' }
    ]
  }, async (_url, body) => {
    const prompt = body.messages[1].content;
    prompts.push(prompt);
    return { data: { choices: [{ message: { content: validSectionResponse(prompt) } }] } };
  });
  assert.equal(statusCode, 200);
  assert.equal(prompts.length, 4);
  assert.equal(payload.bulletActions.length, 4);
  assert.deepEqual(payload.bulletActions.map((entry) => entry.sectionKey).sort(), ['customBullets', 'customList', 'experience', 'projects']);
  assert.equal(payload.reviewedBulletCount, 4);
  assert.equal(Object.hasOwn(payload, 'summaryOptions'), false);
  assert.equal(Object.hasOwn(payload, 'warnings'), false);
  assert.ok(prompts.every((prompt) => !prompt.includes('VERIFIED RESUME FACTS')));
});

test('returns exactly one KEEP, MODIFY, or REMOVE decision for every source point, with ADD separate', async () => {
  const result = await invoke({
    experience: [{
      company: 'Acme',
      description: ['Built API endpoints', 'Designed database schema', 'Maintained an unrelated circuit']
    }]
  }, async (_url, body) => {
    const mapped = readMappedEntries(body.messages[1].content);
    return {
      data: {
        choices: [{
          message: {
            content: JSON.stringify({
              entries: mapped.map((entry) => ({
                _index: entry._index,
                bullets: [
                  { bulletIndex: 0, action: 'keep', text: entry.bullets[0], reason: 'Strong evidence.' },
                  { bulletIndex: 1, action: 'modify', text: 'Designed MongoDB schemas for the API service.', reason: 'Clearer relevance.' },
                  { bulletIndex: 2, action: 'remove', text: '', reason: 'Not relevant to this role.' }
                ],
                additions: [{ text: 'Implemented API authentication using JWT.', reason: 'Supported by this same project.' }]
              }))
            })
          }
        }]
      }
    };
  });
  assert.equal(result.statusCode, 200);
  assert.deepEqual(result.payload.bulletActions[0].bullets.map((bullet) => bullet.action), ['keep', 'modify', 'remove']);
  assert.equal(result.payload.bulletActions[0].bullets.length, 3);
  assert.equal(result.payload.bulletActions[0].additions.length, 1);
  assert.equal(result.payload.reviewedBulletCount, 3);
  assert.equal(result.payload.changedBulletCount, 3);
});

test('retries an incomplete bullet plan once, then accepts a complete review', async () => {
  let calls = 0;
  const result = await invoke({
    experience: [{ company: 'Acme', description: ['First point', 'Second point'] }]
  }, async (_url, body) => {
    calls += 1;
    if (calls === 1) {
      return {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                entries: [{ _index: 0, bullets: [{ bulletIndex: 0, action: 'keep', text: 'First point', reason: 'Good.' }], additions: [] }]
              })
            }
          }]
        }
      };
    }
    assert.match(body.messages[1].content, /previous response failed validation/i);
    return { data: { choices: [{ message: { content: validSectionResponse(body.messages[1].content) } }] } };
  });
  assert.equal(result.statusCode, 200);
  assert.equal(calls, 2);
  assert.equal(result.payload.reviewedBulletCount, 2);
});

test('fails the whole review instead of returning partial sections when one section fails twice', async () => {
  let calls = 0;
  const result = await invoke({
    experience: [{ company: 'Broken', description: ['This section fails'] }],
    projects: [{ title: 'Good project', description: ['This section would pass'] }]
  }, async (_url, body) => {
    calls += 1;
    const prompt = body.messages[1].content;
    if (prompt.includes('"title":"Broken"')) {
      return { data: { choices: [{ message: { content: 'not json' } }] } };
    }
    return { data: { choices: [{ message: { content: validSectionResponse(prompt) } }] } };
  });
  assert.equal(result.statusCode, 500);
  assert.equal(calls, 3);
  assert.equal(result.payload.success, false);
  assert.match(result.payload.error, /Resume review could not be completed/);
  assert.equal(Object.hasOwn(result.payload, 'bulletActions'), false);
});

test('uses strict GPT-OSS JSON schema and supported token parameter', async () => {
  let sentBody;
  const result = await invoke({
    experience: [{ company: 'Acme', description: ['Built API endpoints'] }]
  }, async (_url, body) => {
    sentBody = body;
    return { data: { choices: [{ message: { content: validSectionResponse(body.messages[1].content) } }] } };
  });
  assert.equal(result.statusCode, 200);
  assert.equal(sentBody.temperature, 0.25);
  assert.equal(sentBody.response_format.type, 'json_schema');
  assert.equal(sentBody.response_format.json_schema.strict, true);
  assert.equal(sentBody.response_format.json_schema.name, 'resume_bullet_review');
  assert.equal(sentBody.reasoning_format, 'hidden');
  assert.equal(sentBody.max_completion_tokens, 4200);
  assert.equal(Object.hasOwn(sentBody, 'max_tokens'), false);
});

test('falls back from GPT-OSS 120B to GPT-OSS 20B through Groq only', async () => {
  const requests = [];
  const result = await invoke({
    experience: [{ company: 'Acme', description: ['Built an API'] }]
  }, async (url, body, config) => {
    requests.push({ url, model: body.model, authorization: config.headers.Authorization });
    if (body.model === 'openai/gpt-oss-120b') {
      const error = new Error('Model not found');
      error.response = { status: 404 };
      throw error;
    }
    return { data: { choices: [{ message: { content: validSectionResponse(body.messages[1].content) } }] } };
  });
  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.reviewedBulletCount, 1);
  assert.deepEqual(requests.map((request) => request.model), ['openai/gpt-oss-120b', 'openai/gpt-oss-20b']);
  assert.ok(requests.every((request) => request.url === 'https://api.groq.com/openai/v1/chat/completions'));
  assert.ok(requests.every((request) => request.authorization === 'Bearer test-only-key'));
});

test('does not waste backup-model quota on invalid Groq credentials', async () => {
  let calls = 0;
  const result = await invoke({
    experience: [{ company: 'Acme', description: ['Built an API'] }]
  }, async () => {
    calls += 1;
    const error = new Error('Unauthorized');
    error.response = { status: 401, data: { error: { message: 'Invalid API key' } } };
    throw error;
  });
  assert.equal(result.statusCode, 500);
  assert.match(result.payload.error, /HTTP 401: Invalid API key/);
  assert.equal(calls, 1);
});

test('exposes Groq JSON validation errors and never returns a partial plan', async () => {
  let calls = 0;
  const result = await invoke({
    experience: [{ company: 'Acme', description: ['Built an API'] }]
  }, async () => {
    calls += 1;
    const error = new Error('Request failed with status code 400');
    error.response = { status: 400, data: { error: { message: 'Failed to validate JSON. Please adjust your prompt.' } } };
    throw error;
  });
  assert.equal(result.statusCode, 500);
  assert.match(result.payload.error, /HTTP 400: Failed to validate JSON/i);
  assert.equal(Object.hasOwn(result.payload, 'bulletActions'), false);
  assert.equal(calls, 1);
});

test('does not call the model when there are no bullet-bearing sections', async () => {
  let calls = 0;
  const result = await invoke({ summary: 'Only a summary', skills: ['Python'], education: [] }, async () => {
    calls += 1;
    throw new Error('AI should not be called');
  });
  assert.equal(result.statusCode, 200);
  assert.equal(calls, 0);
  assert.deepEqual(result.payload.bulletActions, []);
  assert.equal(result.payload.reviewedBulletCount, 0);
});

test('keeps transferable experience and does not recommend removal due only to technology mismatch', async () => {
  let systemPrompt = '';
  const result = await invoke({
    experience: [{ company: 'DRDO', description: ['Designed Verilog logic modules'] }]
  }, async (_url, body) => {
    systemPrompt = body.messages[0].content;
    return { data: { choices: [{ message: { content: validSectionResponse(body.messages[1].content) } }] } };
  }, 'Python backend engineer');
  assert.equal(result.statusCode, 200);
  assert.match(systemPrompt, /Do not remove merely because its technology differs/i);
});

test('caps additions and keeps their ownership tied to the exact employer or project entry', async () => {
  let systemPrompt = '';
  const result = await invoke({
    experience: [{ company: 'Acme', description: ['First', 'Second'] }],
    projects: [{ title: 'Personal project', description: ['A separate portfolio app'] }]
  }, async (_url, body) => {
    systemPrompt = body.messages[0].content;
    const mapped = readMappedEntries(body.messages[1].content);
    return {
      data: {
        choices: [{
          message: {
            content: JSON.stringify({
              entries: mapped.map((entry) => ({
                _index: entry._index,
                bullets: entry.bullets.map((text, bulletIndex) => ({
                  bulletIndex, action: 'keep', text, reason: 'Relevant.'
                })),
                additions: [
                  { text: 'Verified achievement A', reason: 'Supported by this exact entry.' },
                  { text: 'Verified achievement B', reason: 'Supported by this exact entry.' },
                  { text: 'Verified achievement C', reason: 'Supported by this exact entry.' }
                ]
              }))
            })
          }
        }]
      }
    };
  });
  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.bulletActions[0].additions.length, 2);
  assert.match(systemPrompt, /must belong to THIS exact employer, project, or activity entry/i);
  assert.match(systemPrompt, /Do not exceed 4 bullets per entry/i);
});
