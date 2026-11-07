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

const extractEntries = (prompt) => {
  const marker = 'CANDIDATE RESUME FACTS FOR THIS SECTION:\n';
  const start = prompt.indexOf(marker);
  const end = prompt.indexOf('\n\nReview all entries', start);
  if (start < 0 || end < 0) throw new Error('Bullet-review prompt is missing mapped entries.');
  return JSON.parse(prompt.slice(start + marker.length, end));
};

const validBulletResponse = (prompt) => JSON.stringify({
  entries: extractEntries(prompt).map((entry) => ({
    _index: entry._index,
    bullets: entry.bullets.map((text, bulletIndex) => ({
      bulletIndex, action: 'keep', text, reason: 'Already clear and relevant.'
    })),
    additions: []
  }))
});

const validTextResponse = (action = 'keep', text = '') => JSON.stringify({
  review: {
    action,
    text,
    reason: action === 'keep'
      ? 'The section is already clear and relevant to the target role.'
      : 'This improves alignment with the target job using existing resume facts.'
  }
});

const extractSkillCategories = (prompt) => {
  const marker = 'EXISTING SKILLS (source of truth):\n';
  const start = prompt.indexOf(marker) + marker.length;
  const end = prompt.indexOf('\n\nINCLUDED RESUME EVIDENCE', start);
  if (start < marker.length || end < 0) throw new Error('Skills-review prompt is missing the source skills.');
  return JSON.parse(prompt.slice(start, end));
};

const validSkillsResponse = (prompt) => {
  const categories = extractSkillCategories(prompt);
  const skills = categories.flatMap((category) => category.items.map((item) => ({
    categoryIndex: category.categoryIndex,
    skillIndex: item.skillIndex,
    action: 'keep',
    text: item.name,
    reason: 'Relevant or transferable skill.'
  })));
  return JSON.stringify({ skills, additions: [] });
};

const withAxiosMock = async (handler, run) => {
  const originalPost = axios.post;
  axios.post = handler;
  try { await run(); } finally { axios.post = originalPost; }
};

const runReview = async (resumeData, handler, jobDescription = 'A sufficiently detailed target job description') => {
  const response = makeResponse();
  await withAxiosMock(handler, async () => {
    await magicTailor({ body: { jobDescription, resumeData } }, response.res);
  });
  return response.read();
};

const mockBySchema = async (_url, body) => {
  const prompt = body.messages[1].content;
  const schemaName = body.response_format?.json_schema?.name;
  if (schemaName === 'resume_bullet_review') {
    return { data: { choices: [{ message: { content: validBulletResponse(prompt) } }] } };
  }
  if (schemaName === 'resume_text_section_review') {
    return { data: { choices: [{ message: { content: validTextResponse() } }] } };
  }
  if (schemaName === 'resume_skills_review') {
    return { data: { choices: [{ message: { content: validSkillsResponse(prompt) } }] } };
  }
  throw new Error('Unexpected review schema: ' + schemaName);
};

test('rejects a missing job description before calling Groq', async () => {
  let calls = 0;
  const response = makeResponse();
  await withAxiosMock(async () => { calls += 1; throw new Error('must not call AI'); }, async () => {
    await magicTailor({ body: { jobDescription: ' ', resumeData: {} } }, response.res);
  });
  assert.equal(response.read().statusCode, 400);
  assert.equal(calls, 0);
});

test('reviews summary, experience, projects, skills, and every custom section type', async () => {
  const schemaCalls = [];
  const { statusCode, payload } = await runReview({
    summary: 'Backend developer building REST services.',
    experience: [{ company: 'Acme', description: ['Built a Node.js API'] }],
    projects: [{ name: 'Social platform', description: ['Built feeds and profiles'] }],
    skills: [{ category: 'Backend', items: [{ name: 'Node.js' }, { name: 'MongoDB' }] }],
    education: [{ institution: 'University', degree: 'B.Tech' }],
    certifications: [{ name: 'Cloud certification' }],
    customText: 'Won a department-level technical award.',
    customList: [{ title: 'Volunteering', bulletPoints: ['Organized a coding workshop'] }],
    customBullets: [{ date: '2025', text: 'Mentored two students' }],
    sections: [
      { key: 'summary', title: 'Summary' },
      { key: 'customText', title: 'Awards', isCustom: true, type: 'text' },
      { key: 'customList', title: 'Volunteering', isCustom: true, type: 'list' },
      { key: 'customBullets', title: 'Highlights', isCustom: true, type: 'bullets' }
    ]
  }, async (_url, body) => {
    const name = body.response_format?.json_schema?.name;
    schemaCalls.push(name);
    return mockBySchema(_url, body);
  });

  assert.equal(statusCode, 200);
  assert.equal(schemaCalls.filter((name) => name === 'resume_bullet_review').length, 4);
  assert.equal(schemaCalls.filter((name) => name === 'resume_text_section_review').length, 2);
  assert.equal(schemaCalls.filter((name) => name === 'resume_skills_review').length, 1);
  assert.deepEqual(payload.sectionReviews.map((item) => item.sectionKey).sort(), ['customText', 'summary']);
  assert.equal(payload.bulletActions.length, 4);
  assert.equal(payload.skillActions.length, 2);
  assert.equal(payload.reviewedBulletCount, 4);
  assert.equal(payload.reviewedSkillCount, 2);
  assert.equal(payload.reviewedTextSectionCount, 2);
  assert.equal(payload.reviewedPointCount, 8);
  assert.ok(!schemaCalls.includes('education'));
  assert.ok(!schemaCalls.includes('certifications'));
});

test('marks a strong existing summary KEEP and provides a reason without a rewrite', async () => {
  const { statusCode, payload } = await runReview({
    summary: 'Backend engineer experienced in Node.js APIs and MongoDB.',
    experience: [],
    projects: [],
    skills: []
  }, mockBySchema);
  assert.equal(statusCode, 200);
  assert.equal(payload.sectionReviews.length, 1);
  assert.equal(payload.sectionReviews[0].action, 'keep');
  assert.equal(payload.sectionReviews[0].text, '');
  assert.match(payload.sectionReviews[0].reason, /clear and relevant/i);
});

test('returns a MODIFY recommendation for a summary that can be improved', async () => {
  const improved = 'Backend engineer who builds Node.js REST APIs and MongoDB-backed services.';
  const { statusCode, payload } = await runReview({
    summary: 'I am hardworking and looking for a challenging job.',
    experience: [{ company: 'Acme', description: ['Built a Node.js REST API'] }],
    skills: []
  }, async (_url, body) => {
    if (body.response_format.json_schema.name === 'resume_text_section_review') {
      return { data: { choices: [{ message: { content: validTextResponse('modify', improved) } }] } };
    }
    return mockBySchema(_url, body);
  }, 'Node.js backend engineer');
  assert.equal(statusCode, 200);
  assert.equal(payload.sectionReviews[0].action, 'modify');
  assert.equal(payload.sectionReviews[0].text, improved);
});

test('creates a summary ADD suggestion only from supported resume facts when summary is empty', async () => {
  const draft = 'Backend developer with project experience building Node.js APIs and MongoDB services.';
  const { statusCode, payload } = await runReview({
    summary: '',
    experience: [{ company: 'Acme', description: ['Built Node.js REST APIs using MongoDB'] }],
    skills: []
  }, async (_url, body) => {
    if (body.response_format.json_schema.name === 'resume_text_section_review') {
      assert.match(body.messages[1].content, /Built Node\.js REST APIs using MongoDB/);
      return { data: { choices: [{ message: { content: validTextResponse('add', draft) } }] } };
    }
    return mockBySchema(_url, body);
  }, 'Node.js backend developer');
  assert.equal(statusCode, 200);
  assert.equal(payload.sectionReviews[0].action, 'add');
  assert.equal(payload.sectionReviews[0].original, '');
  assert.equal(payload.sectionReviews[0].text, draft);
});

test('reviews every skill individually and keeps evidence-backed skill additions separate', async () => {
  const { statusCode, payload } = await runReview({
    summary: '',
    skills: [{ category: 'Languages', items: [{ name: 'Python' }, { name: 'Verilog' }] }],
    experience: [{ company: 'Acme', description: ['Built Python automation scripts'] }]
  }, async (_url, body) => {
    if (body.response_format.json_schema.name === 'resume_skills_review') {
      const categories = extractSkillCategories(body.messages[1].content);
      return {
        data: { choices: [{ message: { content: JSON.stringify({
          skills: [
            { categoryIndex: 0, skillIndex: 0, action: 'keep', text: 'Python', reason: 'Used in project evidence.' },
            { categoryIndex: 0, skillIndex: 1, action: 'remove', text: 'Verilog', reason: 'Not relevant to this target job.' }
          ],
          additions: [{ category: 'Languages', name: 'Python scripting', reason: 'Directly evidenced in work/project content.' }]
        }) } }] }
      };
    }
    if (body.response_format.json_schema.name === 'resume_text_section_review') {
      return { data: { choices: [{ message: { content: validTextResponse('remove', '') } }] } };
    }
    return mockBySchema(_url, body);
  }, 'Python backend engineer');

  assert.equal(statusCode, 200);
  assert.deepEqual(payload.skillActions.map((item) => item.action), ['keep', 'remove']);
  assert.equal(payload.skillAdditions.length, 1);
  assert.equal(payload.skillAdditions[0].name, 'Python scripting');
});

test('reviews custom text sections with their own KEEP or MODIFY decision', async () => {
  const { statusCode, payload } = await runReview({
    summary: 'Engineer experienced in backend systems.',
    experience: [],
    skills: [],
    customAbout: 'Experienced with software tools.',
    sections: [{ key: 'customAbout', title: 'About Me', isCustom: true, type: 'text' }]
  }, async (_url, body) => {
    if (body.response_format.json_schema.name === 'resume_text_section_review') {
      const isCustom = body.messages[1].content.includes('SECTION TO REVIEW: About Me');
      return { data: { choices: [{ message: { content: validTextResponse(
        isCustom ? 'modify' : 'keep',
        isCustom ? 'Software engineer focused on backend systems and API development.' : ''
      ) } }] } };
    }
    return mockBySchema(_url, body);
  });
  assert.equal(statusCode, 200);
  const custom = payload.sectionReviews.find((item) => item.sectionKey === 'customAbout');
  assert.equal(custom.action, 'modify');
  assert.match(custom.text, /backend systems/);
});

test('does not send education, certifications, or personal contact details into review prompts', async () => {
  const prompts = [];
  const { statusCode } = await runReview({
    summary: '',
    experience: [],
    skills: [],
    personalInfo: { name: 'Candidate', email: 'private@example.com' },
    education: [{ institution: 'Example University', degree: 'B.Tech' }],
    certifications: [{ name: 'Private Certification' }]
  }, async (_url, body) => {
    prompts.push(body.messages[1].content);
    return mockBySchema(_url, body);
  });
  assert.equal(statusCode, 200);
  assert.equal(prompts.length, 1);
  assert.ok(prompts.every((prompt) => !prompt.includes('Example University')));
  assert.ok(prompts.every((prompt) => !prompt.includes('Private Certification')));
  assert.ok(prompts.every((prompt) => !prompt.includes('private@example.com')));
});

test('fails the entire analysis instead of returning a partial review when one section fails', async () => {
  const { statusCode, payload } = await runReview({
    summary: 'Backend developer.',
    experience: [{ company: 'Acme', description: ['Built an API'] }],
    projects: [{ name: 'Project', description: ['Built a dashboard'] }],
    skills: []
  }, async (_url, body) => {
    if (body.response_format.json_schema.name === 'resume_bullet_review' &&
        body.messages[1].content.includes('"company":"Acme"')) {
      const error = new Error('Invalid request');
      error.response = { status: 400, data: { error: { message: 'Invalid request for test' } } };
      throw error;
    }
    return mockBySchema(_url, body);
  });
  assert.equal(statusCode, 500);
  assert.match(payload.error, /full resume review could not be completed/i);
  assert.equal(Object.hasOwn(payload, 'bulletActions'), false);
});

test('does not call Groq for an empty skills section', async () => {
  let skillCalls = 0;
  const { statusCode } = await runReview({ summary: '', skills: [], experience: [] }, async (_url, body) => {
    if (body.response_format.json_schema.name === 'resume_skills_review') skillCalls += 1;
    return mockBySchema(_url, body);
  });
  assert.equal(statusCode, 200);
  assert.equal(skillCalls, 0);
});

test('rejects incomplete decisions for skills rather than silently omitting a skill', async () => {
  const { statusCode, payload } = await runReview({
    summary: '',
    skills: [{ category: 'Backend', items: [{ name: 'Node.js' }, { name: 'MongoDB' }] }]
  }, async (_url, body) => {
    if (body.response_format.json_schema.name === 'resume_skills_review') {
      return {
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                skills: [{ categoryIndex: 0, skillIndex: 0, action: 'keep', text: 'Node.js', reason: 'Relevant.' }],
                additions: []
              })
            }
          }]
        }
      };
    }
    return mockBySchema(_url, body);
  });
  assert.equal(statusCode, 500);
  assert.match(payload.error, /missing, duplicate, or invalid skill decisions/i);
});
test('includes every plain-string custom bullet in the review', async () => {
  const { statusCode, payload } = await runReview({
    summary: '',
    skills: [],
    customHighlights: ['Built an internal CLI tool'],
    sections: [{ key: 'customHighlights', title: 'Highlights', isCustom: true, type: 'bullets' }]
  }, mockBySchema);
  assert.equal(statusCode, 200);
  assert.equal(payload.bulletActions.length, 1);
  assert.equal(payload.bulletActions[0].bullets[0].original, 'Built an internal CLI tool');
});

test('uses strict JSON schema output for all review types', async () => {
  const seen = [];
  const { statusCode } = await runReview({
    summary: 'Backend engineer.',
    experience: [{ company: 'Acme', description: ['Built an API'] }],
    skills: [{ category: 'Backend', items: [{ name: 'Node.js' }] }]
  }, async (_url, body) => {
    seen.push(body.response_format?.json_schema);
    return mockBySchema(_url, body);
  });
  assert.equal(statusCode, 200);
  assert.ok(seen.every((schema) => schema && schema.strict === true));
  assert.deepEqual(seen.map((schema) => schema.name).sort(), [
    'resume_bullet_review', 'resume_skills_review', 'resume_text_section_review'
  ].sort());
});
