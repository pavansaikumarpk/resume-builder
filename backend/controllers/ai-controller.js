const axios = require('axios');

// ============================================================================
// GROQ-ONLY MODEL CONFIGURATION
// ============================================================================

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODELS = [
  "openai/gpt-oss-120b", // Primary model.
  "openai/gpt-oss-20b"   // Backup model on the same Groq provider.
];

const extractCleanJSON = (rawText) => {
  if (!rawText || typeof rawText !== 'string') throw new Error("Empty payload received.");
  const cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON structure.");
  return JSON.parse(cleanText.substring(firstBrace, lastBrace + 1));
};

const getAIConfig = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY. Configure a Groq API key to enable AI features.");
  return { apiKey, baseUrl: GROQ_API_URL, models: GROQ_MODELS };
};

const isRetryableGroqError = (error) => {
  const status = error.response?.status;
  return !status || status === 404 || status === 429 || status >= 500;
};

const callAIEngineWithRetry = async (prompt, systemInstruction, options = {}, retries = 1) => {
  const { apiKey, baseUrl, models } = getAIConfig();
  let lastError;

  for (const modelName of models) {
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await axios.post(baseUrl, {
          model: modelName,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt }
          ],
          temperature: options.temperature ?? 0.4,
          response_format: options.jsonSchema
            ? {
                type: "json_schema",
                json_schema: {
                  name: options.schemaName || "resume_bullet_review",
                  strict: true,
                  schema: options.jsonSchema
                }
              }
            : (options.jsonMode !== false ? { type: "json_object" } : undefined),
          ...(modelName.startsWith("openai/gpt-oss-") && options.jsonMode !== false ? { reasoning_format: "hidden" } : {}),
          max_completion_tokens: options.maxTokens || 4096
        }, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          timeout: 25000
        });

        const responseContent = response?.data?.choices?.[0]?.message?.content;
        if (typeof responseContent !== 'string' || !responseContent.trim()) {
          throw new Error("Groq returned an empty AI response.");
        }
        return responseContent;
      } catch (error) {
        lastError = error;
        if (!isRetryableGroqError(error)) {
          if (error.response) {
            const status = error.response.status;
            const providerMessage = error.response.data?.error?.message || error.response.data?.message || error.message;
            error.message = `Groq API returned HTTP ${status}: ${providerMessage}`;
          }
          throw error;
        }

        const status = error.response?.status;
        // A retired model or exhausted per-model quota should immediately
        // fall through to the backup rather than retrying the same model.
        if (status === 404 || status === 429) {
          console.warn(`Groq model ${modelName} returned HTTP ${status}; switching to backup if available.`);
          break;
        }

        if (attempt === retries) {
          console.warn(`Groq model ${modelName} failed; moving to the next configured model.`, {
            status,
            message: error.message
          });
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  if (lastError?.response) {
    const status = lastError.response.status;
    const providerMessage = lastError.response.data?.error?.message || lastError.response.data?.message || lastError.message;
    lastError.message = `Groq API returned HTTP ${status}: ${providerMessage}`;
  }
  throw lastError || new Error("All configured Groq models failed.");
};

// ============================================================================
// CORE AI PROCESSORS (DECENTRALIZED ARCHITECTURE)
// ============================================================================

const organizeSkillsEngine = async (skillsArray, jd) => {
  if (!skillsArray || !skillsArray.length) return skillsArray;
  const sys = `You are a Principal Engineering Recruiter. Categorize the provided skills into strict industry-standard taxonomies (e.g., Languages, Frontend, Backend, Cloud & DevOps, Databases, Tools). 
  Return exactly this JSON schema: { "skills": [ { "category": "String", "items": [ { "id": "String", "name": "String" } ] } ] }`;
  const prompt = `Target JD context (for hierarchy prioritization):\n${jd}\n\nRaw Skills to group:\n${JSON.stringify(skillsArray)}`;
  
  try {
    const out = await callAIEngineWithRetry(prompt, sys, { maxTokens: 1500 });
    return extractCleanJSON(out).skills || skillsArray;
  } catch (err) {
    return skillsArray;
  }
};

const normalizeBulletList = (value) => {
  const values = Array.isArray(value) ? value : (typeof value === 'string' ? value.split(/\r?\n/) : []);
  return values.map((item) => {
    if (typeof item === 'string') return item.trim().replace(/^\s*[•*-]\s*/, '');
    if (item && typeof item === 'object') return String(item.text || item.description || item.content || item.name || '').trim();
    return '';
  }).filter(Boolean);
};

const BULLET_REVIEW_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    entries: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          _index: { type: 'integer', minimum: 0 },
          bullets: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                bulletIndex: { type: 'integer', minimum: 0 },
                action: { type: 'string', enum: ['keep', 'modify', 'remove'] },
                text: { type: 'string' },
                reason: { type: 'string' }
              },
              required: ['bulletIndex', 'action', 'text', 'reason'],
              additionalProperties: false
            }
          },
          additions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                reason: { type: 'string' }
              },
              required: ['text', 'reason'],
              additionalProperties: false
            }
          }
        },
        required: ['_index', 'bullets', 'additions'],
        additionalProperties: false
      }
    }
  },
  required: ['entries'],
  additionalProperties: false
};

const TEXT_SECTION_REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    review: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['keep', 'modify', 'remove', 'add'] },
        text: { type: 'string' },
        reason: { type: 'string' }
      },
      required: ['action', 'text', 'reason'],
      additionalProperties: false
    }
  },
  required: ['review'],
  additionalProperties: false
};

const SKILLS_REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    skills: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryIndex: { type: 'integer', minimum: 0 },
          skillIndex: { type: 'integer', minimum: 0 },
          action: { type: 'string', enum: ['keep', 'modify', 'remove'] },
          text: { type: 'string' },
          reason: { type: 'string' }
        },
        required: ['categoryIndex', 'skillIndex', 'action', 'text', 'reason'],
        additionalProperties: false
      }
    },
    additions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          name: { type: 'string' },
          reason: { type: 'string' }
        },
        required: ['category', 'name', 'reason'],
        additionalProperties: false
      }
    }
  },
  required: ['skills', 'additions'],
  additionalProperties: false
};

const optimizeArrayDataOnce = async (items, jd, sectionName, candidateContext = {}, retryFeedback = '') => {
  if (!Array.isArray(items) || !items.length) return { items: items || [], actions: [], changedCount: 0, reviewedCount: 0 };

  const mapped = items.map((item, index) => ({
    _index: index,
    title: item?.title || item?.company || item?.name || item?.position || item?.institution || (sectionName + ' entry ' + (index + 1)),
    role: item?.position || item?.jobTitle || item?.degree || '',
    bullets: normalizeBulletList(typeof item === 'string' ? [item] : (item?.description ?? item?.bulletPoints ?? item?.text))
  })).filter((item) => item.bullets.length);

  if (!mapped.length) return { items, actions: [], changedCount: 0, reviewedCount: 0 };

  const systemInstruction = [
    'You are a rigorous, high-quality resume editor and job-description analyst.',
    'Your job is to make the candidate resume as strong and relevant as truthfully possible for the exact job description supplied.',
    '',
    'For EVERY candidate bullet, make one explicit decision:',
    'KEEP: The bullet is already relevant and strong enough. Keep its wording exactly.',
    'MODIFY: Relevant evidence exists, but focus, clarity, specificity, or impact can be materially improved for this job. Write the improved bullet.',
    'REMOVE: Use only when the point is genuinely irrelevant to this target role, materially redundant, or misleading. Do not remove merely because its technology differs from the job description.',
    '',
    'Also suggest ADDITIONS only when a meaningful resume point can be assembled from facts explicitly present elsewhere in the supplied candidate data.',
    'Critical rules:',
    '- Actually compare candidate evidence with the job responsibilities and qualifications. Do not just paraphrase the original.',
    '- Do not return every bullet as KEEP to avoid doing the work. Actively look for truthful improvements.',
    '- Do not change a bullet merely to insert keywords. A modification must be better for THIS job.',
    '- Never invent technologies, tools, metrics, scale, outcomes, responsibilities, employers, qualifications, or years of experience.',
    '- Preserve factual meaning. Prefer KEEP or MODIFY when the point contains transferable evidence. REMOVE only genuinely irrelevant, redundant, or misleading points.',
    '- Review the complete entry and all supplied resume context before deciding. Do not judge a point in isolation.',
    '- Aim for 3–4 strong bullets per resume entry. Do not force the count: fewer are better than invented or weak points.',
    '- When an entry has more than 4 bullets, prioritize the strongest 3–4 for this job. REMOVE lower-value, off-target, or repetitive bullets only when doing so improves focus without discarding unique meaningful evidence.',
    '- If 5+ bullets are all distinct and materially valuable, preserve the unique evidence rather than deleting a good point just to hit a number.',
    '- Add only when the entry would otherwise have fewer than 3 strong bullets AND a distinct, relevant achievement is explicitly supported by supplied resume facts.',
    '- An added point must belong to THIS exact employer, project, or activity entry. Use the rest of the resume to cross-check facts and avoid duplication, never to transfer a project achievement into a job or another employer.',
    '- A skill listed elsewhere is not proof that the candidate used it in this entry. Never invent attribution, responsibilities, or context.',
    '- Never add a duplicate or split one achievement into multiple weak bullets. Do not exceed 4 bullets per entry in the final plan.',
    '- If the entry already has 3 or 4 strong bullets, do not add more.',
    '- A new addition must be directly supported by supplied resume facts. If none exists, return an empty additions array.',
    '- Use concise, strong, ATS-readable language. Avoid generic claims and keyword stuffing.',
    '- Every input bullet must appear exactly once, identified by its original bullet index.',
    '- Return valid JSON only, no markdown fences or commentary.',
    '',
    'Schema: {"entries":[{"_index":0,"bullets":[{"bulletIndex":0,"action":"keep|modify|remove","text":"original or modified text; empty for remove","reason":"short reason"}],"additions":[{"text":"new evidence-backed bullet","reason":"why it helps this JD"}]}]}'
  ].join('\n');

  const prompt = 'JOB DESCRIPTION (the only target for this tailoring run):\n' + jd +
    '\n\nADDITIONAL VERIFIED RESUME CONTEXT (use only to support relevant additions; do not infer unlisted experience):\n' + JSON.stringify(candidateContext) +
    '\n\nCANDIDATE RESUME FACTS FOR THIS SECTION:\n' + JSON.stringify(mapped) +
    '\n\nReview all entries and every bullet. Return exactly one KEEP, MODIFY, or REMOVE decision for every source bullet. ADDITIONS are separate new bullets, only when evidence-backed and needed to reach 3–4 strong bullets per entry; never exceed 4 total. ' + retryFeedback + ' The company and role can be from any industry; do not assume a specific company or technology.';

  const raw = await callAIEngineWithRetry(prompt, systemInstruction, { maxTokens: 4200, temperature: 0.25, jsonSchema: BULLET_REVIEW_RESPONSE_SCHEMA, schemaName: 'resume_bullet_review' });
  const parsed = extractCleanJSON(raw);
  if (!Array.isArray(parsed.entries)) throw new Error('AI returned an invalid ' + sectionName + ' action plan.');

  const actions = [];
  let changedCount = 0;
  let reviewedCount = 0;
  const returnedEntryIndexes = parsed.entries.map((candidate) => Number(candidate?._index));
  if (
    parsed.entries.length !== mapped.length ||
    returnedEntryIndexes.some((index) => !Number.isInteger(index) || index < 0 || index >= items.length) ||
    new Set(returnedEntryIndexes).size !== mapped.length
  ) {
    throw new Error('AI returned duplicate, missing, or invalid entry indexes for ' + sectionName + '.');
  }

  mapped.forEach((entry) => {
    const result = parsed.entries.find((candidate) => Number(candidate._index) === entry._index);
    if (!result || !Array.isArray(result.bullets)) throw new Error('AI omitted ' + sectionName + ' entry ' + (entry._index + 1) + '.');
    if (result.bullets.length !== entry.bullets.length) {
      throw new Error('AI returned ' + result.bullets.length + ' decisions for ' + entry.bullets.length + ' source bullets in ' + sectionName + ' entry ' + (entry._index + 1) + '.');
    }
    const returnedIndexes = result.bullets.map((candidate) => Number(candidate.bulletIndex));
    if (returnedIndexes.some((index) => !Number.isInteger(index) || index < 0 || index >= entry.bullets.length) || new Set(returnedIndexes).size !== entry.bullets.length) {
      throw new Error('AI returned duplicate or invalid bullet indexes for ' + sectionName + ' entry ' + (entry._index + 1) + '.');
    }
    const entryActions = [];
    entry.bullets.forEach((sourceText, bulletIndex) => {
      const decision = result.bullets.find((candidate) => Number(candidate.bulletIndex) === bulletIndex);
      if (!decision || !['keep', 'modify', 'remove'].includes(decision.action)) {
        throw new Error('AI returned an incomplete decision for ' + sectionName + ' bullet ' + (bulletIndex + 1) + '.');
      }
      reviewedCount += 1;
      const suggestedText = typeof decision.text === 'string' ? decision.text.trim() : '';
      if (decision.action === 'modify' && (!suggestedText || suggestedText.toLowerCase() === sourceText.toLowerCase())) {
        entryActions.push({ bulletIndex, action: 'keep', original: sourceText, text: sourceText, reason: 'No meaningful rewrite was produced.' });
        return;
      }
      if (decision.action === 'modify' || decision.action === 'remove') changedCount += 1;
      entryActions.push({
        bulletIndex,
        action: decision.action,
        original: sourceText,
        text: decision.action === 'modify' ? suggestedText : (decision.action === 'keep' ? sourceText : ''),
        reason: String(decision.reason || '').slice(0, 220)
      });
    });
    const retainedCount = entryActions.filter((item) => item.action !== 'remove').length;
    const additionCapacity = Math.max(0, Math.min(2, 4 - retainedCount));
    const additions = Array.isArray(result.additions)
      ? result.additions.filter((item) => typeof item?.text === 'string' && item.text.trim())
          .filter((item) => !entry.bullets.some((source) => source.toLowerCase() === item.text.trim().toLowerCase()))
          .slice(0, additionCapacity)
          .map((item) => ({ text: item.text.trim(), reason: String(item.reason || '').slice(0, 220) }))
      : [];
    changedCount += additions.length;
    actions.push({ sectionIndex: entry._index, itemTitle: entry.title, bullets: entryActions, additions });
  });
  return { items, actions, changedCount, reviewedCount };
};

const optimizeArrayData = async (items, jd, sectionName, candidateContext = {}) => {
  try {
    return await optimizeArrayDataOnce(items, jd, sectionName, candidateContext);
  } catch (error) {
    if (!/AI returned|AI omitted|Invalid JSON structure|Unexpected token|Expected property name|Empty payload/i.test(error.message || '')) throw error;
    return optimizeArrayDataOnce(items, jd, sectionName, candidateContext,
      `Your previous response failed validation: ${error.message}. Return every original bullet index exactly once, with no missing or duplicate decisions. Output valid JSON only.`);
  }
};

// ============================================================================
// ENDPOINTS
// ============================================================================

const magicTailor = async (req, res) => {
  const { jobDescription, resumeData } = req.body || {};
  if (typeof jobDescription !== 'string' || jobDescription.trim().length < 20 || jobDescription.length > 30000) {
    return res.status(400).json({ success: false, error: "Paste a job description between 20 and 30,000 characters." });
  }
  if (!resumeData || typeof resumeData !== 'object' || Array.isArray(resumeData)) {
    return res.status(400).json({ success: false, error: "A valid resume is required before tailoring." });
  }

  try {
    const sectionTasks = [];
    const seenKeys = new Set();
    const addSectionTask = (key, title, allowStringPoints = false) => {
      if (!key || seenKeys.has(key) || !Array.isArray(resumeData[key])) return;
      const items = resumeData[key];
      const hasBulletContent = items.some((item) =>
        (allowStringPoints && typeof item === 'string' && item.trim()) ||
        (item && typeof item === 'object' &&
          (item.description !== undefined || item.bulletPoints !== undefined || item.text !== undefined))
      );
      if (!hasBulletContent) return;
      seenKeys.add(key);
      sectionTasks.push({ key, title: title || key, items });
    };

    addSectionTask('experience', 'Work Experience');
    addSectionTask('projects', 'Projects');
    (Array.isArray(resumeData.sections) ? resumeData.sections : []).forEach((section) => {
      if (section?.isCustom && ['list', 'bullets'].includes(section.type)) {
        addSectionTask(section.key, section.title, section.type === 'bullets');
      }
    });

    const candidateContext = {
      summary: resumeData.summary || '',
      experience: resumeData.experience || [],
      projects: resumeData.projects || [],
      skills: resumeData.skills || [],
      education: resumeData.education || [],
      certifications: resumeData.certifications || []
    };

    // A review only succeeds when EVERY selected section has been analyzed.
    // Do not return a partial plan that could look complete to the user.
    const sectionResults = await Promise.all(
      sectionTasks.map((section) =>
        optimizeArrayData(section.items, jobDescription, section.title, candidateContext)
      )
    );

    const bulletActions = [];
    let reviewedBulletCount = 0;
    let changedBulletCount = 0;
    sectionResults.forEach((result, index) => {
      const section = sectionTasks[index];
      reviewedBulletCount += result.reviewedCount;
      changedBulletCount += result.changedCount;
      result.actions.forEach((entry) => {
        bulletActions.push({
          sectionKey: section.key,
          sectionTitle: section.title,
          itemIndex: entry.sectionIndex,
          itemTitle: entry.itemTitle,
          bullets: entry.bullets,
          additions: entry.additions
        });
      });
    });

    return res.status(200).json({
      success: true,
      tailoredData: resumeData,
      bulletActions,
      changedBulletCount,
      reviewedBulletCount,
      atsScore: null
    });
  } catch (error) {
    console.error("JD tailoring failure:", error);
    return res.status(500).json({
      success: false,
      error: "Resume review could not be completed. " + (error.message || "AI review failed.") + " No resume content was changed."
    });
  }
};

const optimizeBullet = async (req, res) => {
  const { bulletText, jobDescription } = req.body;
  if (!bulletText) return res.status(400).json({ success: false, error: "Insufficient text." });

  try {
    const systemInstruction = `You are a Tier-1 Executive ATS Resume Architect. 
    Transform the user's bullet point into exactly 3 highly optimized variations.
    Variation 1: Metric-Driven (Quantify impact aggressively).
    Variation 2: Strategic/Leadership (Focus on initiative, scale, and business value).
    Variation 3: Technical/Methodological (Focus on the specific tools, frameworks, and architecture).
    
    Return strictly JSON: { "options": ["variant 1", "variant 2", "variant 3"] }`;
    
    let prompt = `Original: "${bulletText}"\nTarget JD:\n${jobDescription || 'N/A'}`;
    const rawOutput = await callAIEngineWithRetry(prompt, systemInstruction, { maxTokens: 800 });
    const parsed = extractCleanJSON(rawOutput);

    return res.status(200).json({ success: true, options: parsed.options });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Bullet synthesis failure." });
  }
};

const organizeSkills = async (req, res) => {
  const { skills, jobDescription } = req.body;
  try {
    const groupedSkills = await organizeSkillsEngine(skills, jobDescription || "");
    return res.status(200).json({ success: true, skills: groupedSkills });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Skill mapping failure." });
  }
};

module.exports = { magicTailor, optimizeBullet, organizeSkills };