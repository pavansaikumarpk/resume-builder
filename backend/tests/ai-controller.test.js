const test = require('node:test');
const assert = require('node:assert/strict');
const axios = require('axios');

// The controller validates AI configuration before making the HTTP request.
// Tests use a dummy key because axios is mocked and no external request is made.
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
  return JSON.parse(prompt.slice(start + marker.length, end));
};

const validSectionResponse = (prompt) => {
  const mapped = readMappedEntries(prompt);
  return JSON.stringify({
    entries: mapped.map((entry) => ({
      _index: entry._index,
      bullets: entry.bullets.map((text, bulletIndex) => ({
        bulletIndex, action: 'keep', text, reason: 'Already suitable.'
      })),
      additions: []
    }))
  });
};

const mockResponseForPrompt = (prompt) => {
  if (prompt.includes('VERIFIED RESUME FACTS (only source of truth):')) {
    return JSON.stringify({ options: ['Evidence-based summary for the target role.'] });
  }
  return validSectionResponse(prompt);
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

test('rejects missing or blank job descriptions without calling the model', async () => {
  let calls = 0;
  await withAxiosMock(async () => { calls += 1; throw new Error('must not call AI'); }, async () => {
    const response = makeResponse();
    await magicTailor({ body: { jobDescription: '   ', resumeData: {} } }, response.res);
    assert.equal(response.read().statusCode, 400);
    assert.equal(calls, 0);
  });
});

test('only analyzes experience, projects, and explicitly supported custom list/bullet sections', async () => {
  const prompts = [];
  await withAxiosMock(async (_url, body) => {
    const prompt = body.messages[1].content;
    prompts.push(prompt);
    return { data: { choices: [{ message: { content: mockResponseForPrompt(prompt) } }] } };
  }, async () => {
    const resumeData = {
      summary: '',
      experience: [{ company: 'Acme', description: ['Built an API'] }],
      projects: [{ title: 'Portfolio', bulletPoints: ['Created a portfolio'] }],
      education: [{ institution: 'University', description: 'Degree details' }],
      certifications: [{ name: 'Cloud cert', text: 'Certification details' }],
      customText: [{ title: 'About', text: 'A paragraph, not a bullet list' }],
      customList: [{ title: 'Volunteering', description: ['Helped organize events'] }],
      customBullets: [{ date: '2025', text: 'Mentored two students' }],
      skills: [{ category: 'Tools', items: [{ id: 's1', name: 'Git' }] }],
      sections: [
        { key: 'customText', title: 'About', isCustom: true, type: 'text' },
        { key: 'customList', title: 'Volunteering', isCustom: true, type: 'list' },
        { key: 'customBullets', title: 'Highlights', isCustom: true, type: 'bullets' }
      ]
    };
    const response = makeResponse();
    await magicTailor({ body: { jobDescription: 'A sufficiently long target job description', resumeData } }, response.res);
    const { statusCode, payload } = response.read();
    assert.equal(statusCode, 200);
    assert.equal(prompts.length, 5, 'summary plus experience, projects, custom list, and custom bullets');
    assert.equal(payload.bulletActions.length, 4);
    const keys = payload.bulletActions.map((entry) => entry.sectionKey).sort();
    assert.deepEqual(keys, ['customBullets', 'customList', 'experience', 'projects']);
    assert.equal(payload.reviewedBulletCount, 4);
    assert.deepEqual(payload.summaryOptions, ['Evidence-based summary for the target role.']);
    assert.equal(payload.atsScore, null);
    assert.equal(payload.warnings.length, 0);
    const summaryPrompt = prompts.find((prompt) => prompt.includes('VERIFIED RESUME FACTS'));
    assert.match(summaryPrompt, /Built an API/);
    assert.match(summaryPrompt, /Created a portfolio/);
    assert.match(summaryPrompt, /Git/);
  });
});

test('generates a summary draft from verified resume facts when the existing summary is empty', async () => {
  let summaryPrompt = '';
  await withAxiosMock(async (_url, body) => {
    const prompt = body.messages[1].content;
    if (prompt.includes('VERIFIED RESUME FACTS')) summaryPrompt = prompt;
    return { data: { choices: [{ message: { content: mockResponseForPrompt(prompt) } }] } };
  }, async () => {
    const response = makeResponse();
    await magicTailor({
      body: {
        jobDescription: 'Python backend engineer with API development experience',
        resumeData: {
          summary: '',
          experience: [{ company: 'Acme', description: ['Built REST APIs using Python'] }],
          projects: [],
          skills: [{ category: 'Languages', items: [{ name: 'Python' }] }]
        }
      }
    }, response.res);
    const { statusCode, payload } = response.read();
    assert.equal(statusCode, 200);
    assert.match(summaryPrompt, /Built REST APIs using Python/);
    assert.match(summaryPrompt, /Python/);
    assert.deepEqual(payload.summaryOptions, ['Evidence-based summary for the target role.']);
  });
});

test('isolates malformed section output to a warning while preserving valid summary and other sections', async () => {
  let calls = 0;
  await withAxiosMock(async (_url, body) => {
    calls += 1;
    const prompt = body.messages[1].content;
    if (prompt.includes('"title":"Broken"')) {
      return { data: { choices: [{ message: { content: 'not json' } }] } };
    }
    return { data: { choices: [{ message: { content: mockResponseForPrompt(prompt) } }] } };
  }, async () => {
    const response = makeResponse();
    await magicTailor({
      body: {
        jobDescription: 'A sufficiently long target job description',
        resumeData: {
          summary: 'Existing summary',
          experience: [{ company: 'Broken', description: ['Will fail parsing'] }],
          projects: [{ title: 'Good project', description: ['Still analyzed'] }]
        }
      }
    }, response.res);
    const { statusCode, payload } = response.read();
    assert.equal(statusCode, 200);
    assert.equal(calls, 3);
    assert.equal(payload.bulletActions.length, 1);
    assert.equal(payload.bulletActions[0].sectionKey, 'projects');
    assert.equal(payload.reviewedBulletCount, 1);
    assert.deepEqual(payload.summaryOptions, ['Evidence-based summary for the target role.']);
    assert.equal(payload.warnings.length, 1);
    assert.match(payload.warnings[0], /Work Experience could not be analyzed/);
  });
});

test('isolates malformed summary output without discarding successful bullet recommendations', async () => {
  await withAxiosMock(async (_url, body) => {
    const prompt = body.messages[1].content;
    if (prompt.includes('VERIFIED RESUME FACTS')) {
      return { data: { choices: [{ message: { content: 'invalid summary json' } }] } };
    }
    return { data: { choices: [{ message: { content: mockResponseForPrompt(prompt) } }] } };
  }, async () => {
    const response = makeResponse();
    await magicTailor({
      body: {
        jobDescription: 'A sufficiently long target job description',
        resumeData: {
          summary: 'Original summary',
          experience: [{ company: 'Acme', description: ['Built an API'] }]
        }
      }
    }, response.res);
    const { statusCode, payload } = response.read();
    assert.equal(statusCode, 200);
    assert.equal(payload.bulletActions.length, 1);
    assert.deepEqual(payload.summaryOptions, ['Original summary']);
    assert.equal(payload.warnings.length, 1);
    assert.match(payload.warnings[0], /Summary could not be tailored/);
  });
});

test('rejects duplicate and out-of-range bullet indexes instead of silently accepting malformed plans', async () => {
  await withAxiosMock(async (_url, body) => {
    const prompt = body.messages[1].content;
    if (prompt.includes('VERIFIED RESUME FACTS')) {
      return { data: { choices: [{ message: { content: JSON.stringify({ options: ['Summary'] }) } }] } };
    }
    const mapped = readMappedEntries(prompt);
    return {
      data: {
        choices: [{
          message: {
            content: JSON.stringify({
              entries: mapped.map((entry) => ({
                _index: entry._index,
                bullets: [
                  { bulletIndex: 0, action: 'keep', text: entry.bullets[0] },
                  { bulletIndex: 0, action: 'keep', text: entry.bullets[1] }
                ],
                additions: []
              }))
            })
          }
        }]
      }
    };
  }, async () => {
    const response = makeResponse();
    await magicTailor({
      body: {
        jobDescription: 'A sufficiently long target job description',
        resumeData: {
          summary: 'Original summary',
          experience: [{ company: 'Acme', description: ['First bullet', 'Second bullet'] }]
        }
      }
    }, response.res);
    const { statusCode, payload } = response.read();
    assert.equal(statusCode, 200);
    assert.equal(payload.bulletActions.length, 0);
    assert.equal(payload.warnings.length, 1);
    assert.match(payload.warnings[0], /duplicate or invalid bullet indexes/);
  });
});


test('does not invent a summary when the resume contains no verified facts', async () => {
  let calls = 0;
  await withAxiosMock(async () => {
    calls += 1;
    throw new Error('AI should not be called without source facts');
  }, async () => {
    const response = makeResponse();
    await magicTailor({
      body: {
        jobDescription: 'A sufficiently long target job description',
        resumeData: { summary: '', experience: [], projects: [], skills: [], education: [], certifications: [] }
      }
    }, response.res);
    const { statusCode, payload } = response.read();
    assert.equal(statusCode, 200);
    assert.equal(calls, 0);
    assert.deepEqual(payload.summaryOptions, []);
    assert.equal(payload.warnings.length, 0);
  });
});

test('rejects duplicate or missing resume entry indexes from the model', async () => {
  await withAxiosMock(async (_url, body) => {
    const prompt = body.messages[1].content;
    if (prompt.includes('VERIFIED RESUME FACTS')) {
      return { data: { choices: [{ message: { content: JSON.stringify({ options: ['Summary'] }) } }] } };
    }
    return {
      data: {
        choices: [{
          message: {
            content: JSON.stringify({
              entries: [
                { _index: 0, bullets: [{ bulletIndex: 0, action: 'keep', text: 'First' }], additions: [] },
                { _index: 0, bullets: [{ bulletIndex: 0, action: 'keep', text: 'Second' }], additions: [] }
              ]
            })
          }
        }]
      }
    };
  }, async () => {
    const response = makeResponse();
    await magicTailor({
      body: {
        jobDescription: 'A sufficiently long target job description',
        resumeData: {
          summary: 'Original summary',
          experience: [
            { company: 'Acme', description: ['First'] },
            { company: 'Beta', description: ['Second'] }
          ]
        }
      }
    }, response.res);
    const { statusCode, payload } = response.read();
    assert.equal(statusCode, 200);
    assert.equal(payload.bulletActions.length, 0);
    assert.equal(payload.warnings.length, 1);
    assert.match(payload.warnings[0], /duplicate, missing, or invalid entry indexes/);
  });
});


test('uses Groq only and falls back from GPT-OSS 120B to GPT-OSS 20B when the primary model is unavailable', async () => {
  const requests = [];
  const originalEnv = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    AI_BASE_URL: process.env.AI_BASE_URL,
    AI_MODEL_NAME: process.env.AI_MODEL_NAME
  };
  process.env.OPENAI_API_KEY = 'must-not-be-used';
  process.env.OPENROUTER_API_KEY = 'must-not-be-used';
  process.env.AI_BASE_URL = 'https://not-groq.example/v1/chat/completions';
  process.env.AI_MODEL_NAME = 'not-a-groq-model';

  try {
    await withAxiosMock(async (url, body, config) => {
      requests.push({ url, model: body.model, authorization: config.headers.Authorization });
      if (body.model === 'openai/gpt-oss-120b') {
        const error = new Error('Model not found');
        error.response = { status: 404 };
        throw error;
      }
      return {
        data: {
          choices: [{ message: { content: JSON.stringify({ options: ['Backup model summary'] }) } }]
        }
      };
    }, async () => {
      const response = makeResponse();
      await magicTailor({
        body: {
          jobDescription: 'A sufficiently long target job description',
          resumeData: { summary: 'Original summary', experience: [], projects: [] }
        }
      }, response.res);
      const { statusCode, payload } = response.read();
      assert.equal(statusCode, 200);
      assert.deepEqual(payload.summaryOptions, ['Backup model summary']);
    });

    assert.equal(requests.length, 2);
    assert.deepEqual(requests.map((request) => request.model), [
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b'
    ]);
    assert.ok(requests.every((request) => request.url === 'https://api.groq.com/openai/v1/chat/completions'));
    assert.ok(requests.every((request) => request.authorization === 'Bearer test-only-key'));
  } finally {
    for (const [key, value] of Object.entries(originalEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test('does not switch Groq models for invalid API credentials', async () => {
  let calls = 0;
  await withAxiosMock(async () => {
    calls += 1;
    const error = new Error('Unauthorized');
    error.response = { status: 401 };
    throw error;
  }, async () => {
    const response = makeResponse();
    await magicTailor({
      body: {
        jobDescription: 'A sufficiently long target job description',
        resumeData: { summary: 'Original summary', experience: [], projects: [] }
      }
    }, response.res);
    assert.equal(response.read().statusCode, 200);
    assert.equal(response.read().payload.warnings.length, 1);
    assert.equal(calls, 1);
  });
});
