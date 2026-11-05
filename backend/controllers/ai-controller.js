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
// const optimizeArrayData = async (items, jd, sectionName) => {
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

const optimizeSummary = async (summary, jd) => {
  if (!summary) return [];
  const sys = `You are an elite ATS architect. Synthesize a commanding executive summary into exactly 3 highly optimized variations.
  Variation 1: Metric & Impact Driven.
  Variation 2: Strategic & Leadership Focus.
  Variation 3: Technical & Keyword Heavy.
  Return JSON: { "options": ["string1", "string2", "string3"] }`;
  const prompt = `JD:\n${jd}\n\nCurrent Summary:\n${summary}`;
  
  try {
    const out = await callAIEngineWithRetry(prompt, sys, { maxTokens: 800 });
    const parsed = extractCleanJSON(out);
    return parsed.options || [summary];
  } catch (err) {
    return [summary];
  }
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
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(/\r?\n/).map((item) => item.replace(/^\s*[•*-]\s*/, '').trim()).filter(Boolean);
  return [];
};

const optimizeArrayData = async (items, jd, sectionName) => {
  if (!Array.isArray(items) || !items.length) return { items: items || [], changedCount: 0, reviewedCount: 0, failed: false };

  const mapped = items.map((item, index) => ({
    _index: index,
    title: item.title || item.company || item.name || item.position || sectionName,
    role: item.position || item.jobTitle || '',
    bulletField: item.description !== undefined ? 'description' : (item.bulletPoints !== undefined ? 'bulletPoints' : 'text'),
    bullets: normalizeBulletList(item.description ?? item.bulletPoints ?? item.text)
  })).filter((item) => item.bullets.length);

  if (!mapped.length) return { items, changedCount: 0, reviewedCount: 0, failed: false, reason: 'No source bullets were available to tailor.' };

  const systemInstruction = \`You are an evidence-grounded resume tailoring specialist.
Tailor the candidate's existing resume bullets to the job description supplied in this request.
Rules:
- Evaluate EVERY source bullet independently against THIS job description. Do not stop after the strongest or easiest bullets.
- Attempt a rewrite for every bullet, but keep the exact original wording if no truthful, material improvement would make it more relevant, clearer, or stronger for this job.
- Keep bullets that are already strong and relevant unchanged. Do not rewrite merely to create the appearance of work.
- If a bullet has no truthful connection to the target role and cannot be improved without changing its meaning, return it unchanged.
- Preserve the candidate's actual responsibilities, tools, technologies, scope and results.
- Never invent employers, projects, tools, certifications, metrics, percentages, scale, leadership, outcomes, or experience.
- Do not copy job-description requirements as if the candidate has done them.
- A changed bullet must be materially better for this specific job, concise, ATS-readable, and start with a strong action verb where appropriate.
- Return exactly one result for every input bullet, in the same item and bullet order. Use the exact source text for any bullet you decide not to improve.
- The job description may describe ANY industry, role, seniority, or technology. Do not assume a particular company, job family, or technology stack.
Return only valid JSON in this exact schema:
{ "optimized": [ { "_index": 0, "bullets": ["rewritten or unchanged original bullet"] } ] }\`;

  const prompt = \`TARGET JOB DESCRIPTION:
\${jd}

CANDIDATE SOURCE DATA (the only source of candidate facts):
\${JSON.stringify(mapped)}

Evaluate every bullet. Rewrite only those with a truthful, material improvement for this job; return all other bullets exactly as written.\`;

  const raw = await callAIEngineWithRetry(prompt, systemInstruction, { maxTokens: 5000, temperature: 0.2 });
  const parsed = extractCleanJSON(raw);
  if (!Array.isArray(parsed.optimized)) throw new Error(\`AI returned an invalid \${sectionName} response.\`);

  let changedCount = 0;
  const optimizedItems = items.map((original, index) => {
    const source = mapped.find((entry) => entry._index === index);
    if (!source) return original;
    const result = parsed.optimized.find((entry) => entry._index === index);
    const bullets = normalizeBulletList(result?.bullets);
    if (bullets.length !== source.bullets.length) {
      throw new Error(\`AI returned an incomplete bullet set for \${sectionName} item \${index + 1}.\`);
    }
    const sourceBullets = source.bullets;
    const changedHere = bullets.filter((bullet, bulletIndex) =>
      bullet.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() !==
      sourceBullets[bulletIndex].toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    );
    if (!changedHere.length) return original;
    changedCount += changedHere.length;
    return { ...original, [source.bulletField]: bullets };
  });

  return {
    items: optimizedItems,
    changedCount,
    reviewedCount: mapped.reduce((total, item) => total + item.bullets.length, 0),
    failed: false
  };
};
// ============================================================================
// ENDPOINTS
// ============================================================================

const magicTailor = async (req, res) => {
  const { jobDescription, resumeData } = req.body;
  if (!jobDescription || !resumeData) return res.status(400).json({ success: false, error: "Insufficient parameters." });

  try {
    const customListSections = (resumeData.sections || []).filter((section) =>
      section.isCustom && (section.type === 'list' || section.type === 'bullets')
    );
    const customPromises = customListSections.map((section) =>
      optimizeArrayData(resumeData[section.key] || [], jobDescription, section.title)
    );

    const allPromises = [
      optimizeSummary(resumeData.summary, jobDescription),
      optimizeArrayData(resumeData.experience, jobDescription, 'Work Experience'),
      optimizeArrayData(resumeData.projects, jobDescription, 'Projects'),
      organizeSkillsEngine(resumeData.skills, jobDescription),
      ...customPromises
    ];
    const results = await Promise.allSettled(allPromises);
    const warnings = [];
    const readResult = (result, fallback, label) => {
      if (result.status === 'fulfilled') return result.value;
      warnings.push(\`\${label} could not be tailored: \${result.reason?.message || 'AI request failed'}\`);
      return fallback;
    };

    const summaryOptions = readResult(results[0], [resumeData.summary].filter(Boolean), 'Summary');
    const experienceResult = readResult(results[1], { items: resumeData.experience || [], changedCount: 0, reviewedCount: 0 }, 'Experience');
    const projectsResult = readResult(results[2], { items: resumeData.projects || [], changedCount: 0, reviewedCount: 0 }, 'Projects');
    const skillsResult = readResult(results[3], resumeData.skills || [], 'Skills');
    const tailoredData = {
      ...resumeData,
      summary: summaryOptions[0] || resumeData.summary,
      experience: experienceResult.items,
      projects: projectsResult.items,
      skills: skillsResult
    };
    customListSections.forEach((section, index) => {
      const result = readResult(results[4 + index], {
        items: resumeData[section.key] || [],
        changedCount: 0,
        reviewedCount: 0
      }, section.title);
      tailoredData[section.key] = result.items;
    });

    const customResults = customListSections.map((section, index) => results[4 + index]);
    const changedBulletCount = experienceResult.changedCount + projectsResult.changedCount +
      customResults.reduce((total, result) => total + (result.status === 'fulfilled' ? result.value.changedCount : 0), 0);
    const reviewedBulletCount = experienceResult.reviewedCount + projectsResult.reviewedCount +
      customResults.reduce((total, result) => total + (result.status === 'fulfilled' ? result.value.reviewedCount : 0), 0);

    return res.status(200).json({
      success: true,
      tailoredData,
      summaryOptions,
      changedBulletCount,
      reviewedBulletCount,
      warnings
    });
  } catch (error) {
    console.error("Pipeline Failure:", error);
    return res.status(500).json({ success: false, error: "Optimization pipeline failure." });
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