// const axios = require('axios');
// const crypto = require('crypto');

// // ============================================================================
// // UTILITY: JSON SANITIZATION & NETWORK
// // ============================================================================

// const extractCleanJSON = (rawText) => {
//   if (!rawText || typeof rawText !== 'string') throw new Error("Empty payload received.");
//   let cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
//   const firstBrace = cleanText.indexOf('{');
//   const lastBrace = cleanText.lastIndexOf('}');
//   if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON structure.");
//   return JSON.parse(cleanText.substring(firstBrace, lastBrace + 1));
// };

// const getAIConfig = () => {
//   const apiKey = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
//   const baseUrl = process.env.AI_BASE_URL || "https://api.groq.com/openai/v1/chat/completions";
//   const modelName = process.env.AI_MODEL_NAME || "llama-3.3-70b-versatile";
//   if (!apiKey) throw new Error("Missing AI Authentication Keys.");
//   return { apiKey, baseUrl, modelName };
// };

// const callAIEngineWithRetry = async (prompt, systemInstruction, options = {}, retries = 2) => {
//   const { apiKey, baseUrl, modelName } = getAIConfig();
//   let attempt = 0;
//   while (attempt <= retries) {
//     try {
//       const response = await axios.post(baseUrl, {
//           model: modelName,
//           messages: [{ role: "system", content: systemInstruction }, { role: "user", content: prompt }],
//           temperature: options.temperature ?? 0.4,
//           response_format: options.jsonMode !== false ? { type: "json_object" } : undefined,
//           max_tokens: options.maxTokens || 4096,
//         }, { headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }, timeout: 25000 });
//       return response.data.choices[0].message.content;
//     } catch (error) {
//       attempt++;
//       if (attempt > retries) throw error;
//       await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
//     }
//   }
// };

// // ============================================================================
// // CORE AI PROCESSORS (DECENTRALIZED ARCHITECTURE)
// // ============================================================================

// const optimizeSummary = async (summary, jd) => {
//   if (!summary) return summary;
//   const sys = `You are an elite ATS architect. Synthesize a commanding executive summary. Return JSON: { "summary": "string" }`;
//   const prompt = `JD:\n${jd}\n\nCurrent:\n${summary}`;
//   const out = await callAIEngineWithRetry(prompt, sys, { maxTokens: 400 });
//   return extractCleanJSON(out).summary || summary;
// };

// // Orchestrates intelligent taxonomy mapping for skills
// const organizeSkillsEngine = async (skillsArray, jd) => {
//   if (!skillsArray || !skillsArray.length) return skillsArray;
//   const sys = `You are a Principal Engineering Recruiter. Categorize the provided skills into strict industry-standard taxonomies (e.g., Languages, Frontend, Backend, Cloud & DevOps, Databases, Tools). 
//   Return exactly this JSON schema: { "skills": [ { "category": "String", "items": [ { "id": "String", "name": "String" } ] } ] }`;
//   const prompt = `Target JD context (for hierarchy prioritization):\n${jd}\n\nRaw Skills to group:\n${JSON.stringify(skillsArray)}`;
  
//   const out = await callAIEngineWithRetry(prompt, sys, { maxTokens: 1500 });
//   return extractCleanJSON(out).skills || skillsArray;
// };

// // Processes arrays iteratively to circumvent truncation limits
// const optimizeArrayData = async (items, jd, sectionName, candidateContext = {}) => {
//   if (!items || !items.length) return items;
//   const sys = `You are an ATS optimization algorithm. Enhance the bullet points for ${sectionName}. 
//   Return JSON EXACTLY matching the input array length. Schema: { "optimized": [ { "_index": 0, "bullets": ["Metric-driven accomplishment"] } ] }`;
  
//   const mapped = items.map((item, i) => ({
//       _index: i, 
//       title: item.title || item.company || item.name, 
//       bullets: item.description || item.bulletPoints || [] 
//   }));

//   const prompt = `JD:\n${jd}\n\nItems:\n${JSON.stringify(mapped)}`;
//   const out = await callAIEngineWithRetry(prompt, sys, { maxTokens: 4000 });
//   const parsed = extractCleanJSON(out);

//   return items.map((orig, i) => {
//     const optimizedItem = parsed.optimized.find(o => o._index === i);
//     if (!optimizedItem || !optimizedItem.bullets.length) return orig;
    
//     if (orig.description !== undefined) return { ...orig, description: optimizedItem.bullets };
//     return { ...orig, bulletPoints: optimizedItem.bullets };
//   });
// };

// // ============================================================================
// // ENDPOINTS
// // ============================================================================

// const magicTailor = async (req, res) => {
//   const { jobDescription, resumeData } = req.body;
//   if (!jobDescription || !resumeData) return res.status(400).json({ success: false, error: "Insufficient parameters." });

//   try {
//     // 1. Disaggregate and execute parallel optimizations to prevent AI truncation
//     const [summaryRes, experienceRes, projectsRes, skillsRes] = await Promise.allSettled([
//       optimizeSummary(resumeData.summary, jobDescription),
//       optimizeArrayData(resumeData.experience, jobDescription, "Work Experience"),
//       optimizeArrayData(resumeData.projects, jobDescription, "Projects"),
//       organizeSkillsEngine(resumeData.skills, jobDescription) // Auto-groups skills during tailor
//     ]);

//     // 2. Synthesize results back into the AST safely
//     const tailoredData = {
//       ...resumeData,
//       summary: summaryRes.status === 'fulfilled' ? summaryRes.value : resumeData.summary,
//       experience: experienceRes.status === 'fulfilled' ? experienceRes.value : resumeData.experience,
//       projects: projectsRes.status === 'fulfilled' ? projectsRes.value : resumeData.projects,
//       skills: skillsRes.status === 'fulfilled' ? skillsRes.value : resumeData.skills,
//     };

//     return res.status(200).json({ success: true, tailoredData });
//   } catch (error) {
//     console.error("Pipeline Failure:", error);
//     return res.status(500).json({ success: false, error: "Optimization pipeline failure." });
//   }
// };

// const optimizeBullet = async (req, res) => {
//   const { bulletText, jobDescription } = req.body;
//   if (!bulletText) return res.status(400).json({ success: false, error: "Insufficient text." });

//   try {
//     // Generates 3 distinct multidimensional options
//     const systemInstruction = `You are a Tier-1 Executive ATS Resume Architect. 
//     Transform the user's bullet point into exactly 3 highly optimized variations.
//     Variation 1: Metric-Driven (Quantify impact aggressively).
//     Variation 2: Strategic/Leadership (Focus on initiative, scale, and business value).
//     Variation 3: Technical/Methodological (Focus on the specific tools, frameworks, and architecture).
    
//     Return strictly JSON: { "options": ["variant 1", "variant 2", "variant 3"] }`;
    
//     let prompt = `Original: "${bulletText}"\nTarget JD:\n${jobDescription || 'N/A'}`;
//     const rawOutput = await callAIEngineWithRetry(prompt, systemInstruction, { maxTokens: 800 });
//     const parsed = extractCleanJSON(rawOutput);

//     return res.status(200).json({ success: true, options: parsed.options });
//   } catch (error) {
//     return res.status(500).json({ success: false, error: "Bullet synthesis failure." });
//   }
// };

// const organizeSkills = async (req, res) => {
//   const { skills, jobDescription } = req.body;
//   try {
//     const groupedSkills = await organizeSkillsEngine(skills, jobDescription || "");
//     return res.status(200).json({ success: true, skills: groupedSkills });
//   } catch (error) {
//     return res.status(500).json({ success: false, error: "Skill mapping failure." });
//   }
// };

// module.exports = { magicTailor, optimizeBullet, organizeSkills };








































const axios = require('axios');
const crypto = require('crypto');

// ============================================================================
// UTILITY: JSON SANITIZATION & NETWORK
// ============================================================================


const extractCleanJSON = (rawText) => {
  if (!rawText || typeof rawText !== 'string') throw new Error("Empty payload received.");
  
  // FIXED: Ensure the regex is on a single line
  let cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON structure.");
  return JSON.parse(cleanText.substring(firstBrace, lastBrace + 1));
};

const getAIConfig = () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.AI_BASE_URL || "https://api.groq.com/openai/v1/chat/completions";
  const modelName = process.env.AI_MODEL_NAME || "llama-3.3-70b-versatile";
  if (!apiKey) throw new Error("Missing AI Authentication Keys.");
  return { apiKey, baseUrl, modelName };
};

const callAIEngineWithRetry = async (prompt, systemInstruction, options = {}, retries = 2) => {
  const { apiKey, baseUrl, modelName } = getAIConfig();
  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await axios.post(baseUrl, {
          model: modelName,
          messages: [{ role: "system", content: systemInstruction }, { role: "user", content: prompt }],
          temperature: options.temperature ?? 0.4,
          response_format: options.jsonMode !== false ? { type: "json_object" } : undefined,
          max_tokens: options.maxTokens || 4096,
        }, { headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" }, timeout: 25000 });
      return response.data.choices[0].message.content;
    } catch (error) {
      attempt++;
      if (attempt > retries) throw error;
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }
  }
};

// ============================================================================
// CORE AI PROCESSORS (DECENTRALIZED ARCHITECTURE)
// ============================================================================

const optimizeSummary = async (summary, jd, candidateContext = {}) => {
  const existingSummary = typeof summary === 'string' ? summary.trim() : '';
  const verifiedFacts = {
    experience: candidateContext.experience || [],
    projects: candidateContext.projects || [],
    skills: candidateContext.skills || [],
    education: candidateContext.education || [],
    certifications: candidateContext.certifications || []
  };
  const hasVerifiedFacts = Object.values(verifiedFacts).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
  if (!existingSummary && !hasVerifiedFacts) return [];

  const systemInstruction = `You are an evidence-grounded resume summary editor.
Create up to three concise professional-summary alternatives tailored to the target job description.
Use only facts explicitly supported by the supplied resume summary and verified resume sections.
When the original summary is empty, build a draft only from verified experience, project, skill, education, and certification facts.
Never invent metrics, years of experience, certifications, technologies, seniority, leadership, employers, or achievements.
Do not infer proficiency from a skill merely being listed. Do not claim a qualification just because it appears in the job description.
If there is insufficient evidence to write a meaningful summary, return an empty options array.
If an existing summary cannot be improved truthfully, return it unchanged as the only option.
Return only JSON: { "options": ["summary option 1", "summary option 2"] }`;
  const prompt = `TARGET JOB DESCRIPTION:\n${jd}\n\nEXISTING SUMMARY (may be empty):\n${existingSummary}\n\nVERIFIED RESUME FACTS (only source of truth):\n${JSON.stringify(verifiedFacts)}`;
  const out = await callAIEngineWithRetry(prompt, systemInstruction, { maxTokens: 900, temperature: 0.2 });
  const parsed = extractCleanJSON(out);
  if (!Array.isArray(parsed.options)) throw new Error('AI returned an invalid summary options list.');
  return parsed.options
    .filter((option) => typeof option === 'string' && option.trim())
    .map((option) => option.trim())
    .slice(0, 3);
};

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

const optimizeArrayData = async (items, jd, sectionName, candidateContext = {}) => {
  if (!Array.isArray(items) || !items.length) return { items: items || [], actions: [], changedCount: 0, reviewedCount: 0 };

  const mapped = items.map((item, index) => ({
    _index: index,
    title: item.title || item.company || item.name || item.position || item.institution || (sectionName + ' entry ' + (index + 1)),
    role: item.position || item.jobTitle || item.degree || '',
    bullets: normalizeBulletList(item.description ?? item.bulletPoints ?? item.text)
  })).filter((item) => item.bullets.length);

  if (!mapped.length) return { items, actions: [], changedCount: 0, reviewedCount: 0 };

  const systemInstruction = [
    'You are a rigorous, high-quality resume editor and job-description analyst.',
    'Your job is to make the candidate resume as strong and relevant as truthfully possible for the exact job description supplied.',
    '',
    'For EVERY candidate bullet, make one explicit decision:',
    'KEEP: The bullet is already relevant and strong enough. Keep its wording exactly.',
    'REPLACE: Relevant evidence exists, but focus, clarity, specificity, or impact can be materially improved for this job. Write the improved bullet.',
    'REMOVE: The bullet is irrelevant, redundant, misleading, or too weak to improve truthfully. Recommend removal, but never delete automatically.',
    '',
    'Also suggest ADDITIONS only when a meaningful resume point can be assembled from facts explicitly present elsewhere in the supplied candidate data.',
    'Critical rules:',
    '- Actually compare candidate evidence with the job responsibilities and qualifications. Do not just paraphrase the original.',
    '- Do not return every bullet as KEEP to avoid doing the work. Actively look for truthful improvements.',
    '- Do not change a bullet merely to insert keywords. A replacement must be better for THIS job.',
    '- Never invent technologies, tools, metrics, scale, outcomes, responsibilities, employers, qualifications, or years of experience.',
    '- Preserve factual meaning. A bullet may be unrelated to the JD; if it cannot be honestly improved, recommend REMOVE.',
    '- A new addition must be directly supported by supplied resume facts. If none exists, return an empty additions array.',
    '- Use concise, strong, ATS-readable language. Avoid generic claims and keyword stuffing.',
    '- Every input bullet must appear exactly once, identified by its original bullet index.',
    '- Return valid JSON only, no markdown fences or commentary.',
    '',
    'Schema: {"entries":[{"_index":0,"bullets":[{"bulletIndex":0,"action":"keep|replace|remove","text":"original or replacement text; empty for remove","reason":"short reason"}],"additions":[{"text":"new evidence-backed bullet","reason":"why it helps this JD"}]}]}'
  ].join('\n');

  const prompt = 'JOB DESCRIPTION (the only target for this tailoring run):\n' + jd +
    '\n\nADDITIONAL VERIFIED RESUME CONTEXT (use only to support relevant additions; do not infer unlisted experience):\n' + JSON.stringify(candidateContext) +
    '\n\nCANDIDATE RESUME FACTS FOR THIS SECTION:\n' + JSON.stringify(mapped) +
    '\n\nReview all entries and every bullet. Return a decision for every bullet and only evidence-backed additions. The company and role can be from any industry; do not assume a specific company or technology.';

  const raw = await callAIEngineWithRetry(prompt, systemInstruction, { maxTokens: 4200, temperature: 0.25 });
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
      if (!decision || !['keep', 'replace', 'remove'].includes(decision.action)) {
        throw new Error('AI returned an incomplete decision for ' + sectionName + ' bullet ' + (bulletIndex + 1) + '.');
      }
      reviewedCount += 1;
      const suggestedText = typeof decision.text === 'string' ? decision.text.trim() : '';
      if (decision.action === 'replace' && (!suggestedText || suggestedText.toLowerCase() === sourceText.toLowerCase())) {
        entryActions.push({ bulletIndex, action: 'keep', original: sourceText, text: sourceText, reason: 'No meaningful rewrite was produced.' });
        return;
      }
      if (decision.action === 'replace' || decision.action === 'remove') changedCount += 1;
      entryActions.push({
        bulletIndex,
        action: decision.action,
        original: sourceText,
        text: decision.action === 'replace' ? suggestedText : (decision.action === 'keep' ? sourceText : ''),
        reason: String(decision.reason || '').slice(0, 220)
      });
    });
    const additions = Array.isArray(result.additions)
      ? result.additions.filter((item) => typeof item?.text === 'string' && item.text.trim()).slice(0, 3)
          .map((item) => ({ text: item.text.trim(), reason: String(item.reason || '').slice(0, 220) }))
      : [];
    changedCount += additions.length;
    actions.push({ sectionIndex: entry._index, itemTitle: entry.title, bullets: entryActions, additions });
  });
  return { items, actions, changedCount, reviewedCount };
};// ============================================================================
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
    const addSectionTask = (key, title) => {
      if (!key || seenKeys.has(key) || !Array.isArray(resumeData[key])) return;
      const items = resumeData[key];
      const hasBulletContent = items.some((item) =>
        item && typeof item === 'object' &&
        (item.description !== undefined || item.bulletPoints !== undefined || item.text !== undefined)
      );
      if (!hasBulletContent) return;
      seenKeys.add(key);
      sectionTasks.push({ key, title: title || key, items });
    };

    addSectionTask('experience', 'Work Experience');
    addSectionTask('projects', 'Projects');
    // Only tailor known bullet-bearing sections. Do not infer that arbitrary
    // arrays (education, certifications, text blocks, metadata) are bullet lists.
    (Array.isArray(resumeData.sections) ? resumeData.sections : []).forEach((section) => {
      if (section?.isCustom && ['list', 'bullets'].includes(section.type)) {
        addSectionTask(section.key, section.title);
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
    const [summaryResult, ...sectionResults] = await Promise.allSettled([
      optimizeSummary(resumeData.summary, jobDescription, candidateContext),
      ...sectionTasks.map((section) => optimizeArrayData(section.items, jobDescription, section.title, candidateContext))
    ]);
    const warnings = [];
    let summaryOptions = [resumeData.summary].filter(Boolean);
    if (summaryResult.status === 'fulfilled') summaryOptions = summaryResult.value;
    else warnings.push('Summary could not be tailored: ' + (summaryResult.reason?.message || 'AI request failed'));

    const bulletActions = [];
    let reviewedBulletCount = 0;
    let changedBulletCount = 0;
    sectionResults.forEach((result, index) => {
      const section = sectionTasks[index];
      if (result.status !== 'fulfilled') {
        warnings.push(section.title + ' could not be analyzed: ' + (result.reason?.message || 'AI request failed'));
        return;
      }
      reviewedBulletCount += result.value.reviewedCount;
      changedBulletCount += result.value.changedCount;
      result.value.actions.forEach((entry) => {
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
      summaryOptions,
      bulletActions,
      changedBulletCount,
      reviewedBulletCount,
      warnings,
      atsScore: null
    });
  } catch (error) {
    console.error("JD tailoring failure:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "AI tailoring failed. No resume content was changed."
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