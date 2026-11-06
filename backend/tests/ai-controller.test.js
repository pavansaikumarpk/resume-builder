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

const validAIResponse = (prompt) => {
  const marker = 'CANDIDATE RESUME FACTS FOR THIS SECTION:\n';
  const start = prompt.indexOf(marker);
  const end = prompt.indexOf('\n\nReview all entries', start);
  const mapped = JSON.parse(prompt.slice(start + marker.length, end));
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

test('rejects missing or blank job descriptions without calling the model', async () => {
  const originalPost = axios.post;
  let calls = 0;
  axios.post = async () => { calls += 1; throw new Error('must not call AI'); };
  try {
    const response = makeResponse();
    await magicTailor({ body: { jobDescription: '   ', resumeData: {} } }, response.res);
    assert.equal(response.read().statusCode, 400);
    assert.equal(calls, 0);
  } finally {
    axios.post = originalPost;
  }
});

test('only analyzes experience, projects, and explicitly supported custom list/bullet sections', async () => {
  const originalPost = axios.post;
  const prompts = [];
  axios.post = async (_url, body) => {
    const prompt = body.messages[1].content;
    prompts.push(prompt);
    return { data: { choices: [{ message: { content: validAIResponse(prompt) } }] } };
  };
  try {
    const resumeData = {
      summary: '',
      experience: [{ company: 'Acme', description: ['Built an API'] }],
      projects: [{ title: 'Portfolio', bulletPoints: ['Created a portfolio'] }],
      education: [{ institution: 'University', description: 'Degree details' }],
      certifications: [{ name: 'Cloud cert', text: 'Certification details' }],
      customText: [{ title: 'About', text: 'A paragraph, not a bullet list' }],
      customList: [{ title: 'Volunteering', description: ['Helped organize events'] }],
      customBullets: [{ date: '2025', text: 'Mentored two students' }],
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
    assert.equal(prompts.length, 4, 'expected experience, projects, custom list, and custom bullets only');
    assert.equal(payload.bulletActions.length, 4);
    const keys = payload.bulletActions.map((entry) => entry.sectionKey).sort();
    assert.deepEqual(keys, ['customBullets', 'customList', 'experience', 'projects']);
    assert.equal(payload.bulletActions.reduce((n, entry) => n + entry.bullets.length, 0), 4);
    assert.equal(payload.reviewedBulletCount, 4);
    assert.equal(payload.atsScore, null);
    assert.equal(payload.warnings.length, 0);
  } finally {
    axios.post = originalPost;
  }
});

test('isolates malformed model output to a section warning and leaves other sections available', async () => {
  const originalPost = axios.post;
  let calls = 0;
  axios.post = async (_url, body) => {
    calls += 1;
    if (body.messages[1].content.includes('"title":"Broken"')) {
      return { data: { choices: [{ message: { content: 'not json' } }] } };
    }
    const prompt = body.messages[1].content;
    return { data: { choices: [{ message: { content: validAIResponse(prompt) } }] } };
  };
  try {
    const response = makeResponse();
    await magicTailor({
      body: {
        jobDescription: 'A sufficiently long target job description',
        resumeData: {
          summary: '',
          experience: [{ company: 'Broken', description: ['Will fail parsing'] }],
          projects: [{ title: 'Good project', description: ['Still analyzed'] }]
        }
      }
    }, response.res);
    const { statusCode, payload } = response.read();
    assert.equal(statusCode, 200);
    assert.equal(calls, 2);
    assert.equal(payload.bulletActions.length, 1);
    assert.equal(payload.bulletActions[0].sectionKey, 'projects');
    assert.equal(payload.reviewedBulletCount, 1);
    assert.equal(payload.warnings.length, 1);
    assert.match(payload.warnings[0], /Work Experience could not be analyzed/);
  } finally {
    axios.post = originalPost;
  }
});
