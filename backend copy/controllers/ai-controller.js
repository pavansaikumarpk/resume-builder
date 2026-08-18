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

const optimizeArrayData = async (items, jd, sectionName) => {
  if (!items || !items.length) return items;
  const sys = `You are an ATS optimization algorithm. Enhance the bullet points for ${sectionName}. 
  Return JSON EXACTLY matching the input array length. Schema: { "optimized": [ { "_index": 0, "bullets": ["Metric-driven accomplishment"] } ] }`;
  
  const mapped = items.map((item, i) => ({
      _index: i, 
      title: item.title || item.company || item.name, 
      bullets: item.description || item.bulletPoints || [] 
  }));

  const prompt = `JD:\n${jd}\n\nItems:\n${JSON.stringify(mapped)}`;
  
  try {
    const out = await callAIEngineWithRetry(prompt, sys, { maxTokens: 4000 });
    const parsed = extractCleanJSON(out);

    return items.map((orig, i) => {
      const optimizedItem = parsed.optimized.find(o => o._index === i);
      if (!optimizedItem || !optimizedItem.bullets.length) return orig;
      
      if (orig.description !== undefined) return { ...orig, description: optimizedItem.bullets };
      return { ...orig, bulletPoints: optimizedItem.bullets };
    });
  } catch (err) {
    return items;
  }
};

// ============================================================================
// ENDPOINTS
// ============================================================================

const magicTailor = async (req, res) => {
  const { jobDescription, resumeData } = req.body;
  if (!jobDescription || !resumeData) return res.status(400).json({ success: false, error: "Insufficient parameters." });

  try {
    const customListSections = (resumeData.sections || []).filter(s => s.isCustom && s.type === 'list');
    
    const customPromises = customListSections.map(sec => 
       optimizeArrayData(resumeData[sec.key] || [], jobDescription, sec.title)
    );

    const allPromises = [
      optimizeSummary(resumeData.summary, jobDescription),
      optimizeArrayData(resumeData.experience, jobDescription, "Work Experience"),
      optimizeArrayData(resumeData.projects, jobDescription, "Projects"),
      organizeSkillsEngine(resumeData.skills, jobDescription),
      ...customPromises 
    ];

    const results = await Promise.allSettled(allPromises);
    const safeValue = (resItem, fallback) => resItem.status === 'fulfilled' ? resItem.value : fallback;

    const summaryOptions = safeValue(results[0], [resumeData.summary]);

    const tailoredData = {
      ...resumeData,
      summary: summaryOptions[0] || resumeData.summary,
      experience: safeValue(results[1], resumeData.experience),
      projects: safeValue(results[2], resumeData.projects),
      skills: safeValue(results[3], resumeData.skills),
    };

    customListSections.forEach((sec, index) => {
       const promiseIndex = 4 + index;
       tailoredData[sec.key] = safeValue(results[promiseIndex], resumeData[sec.key] || []);
    });

    return res.status(200).json({ 
        success: true, 
        tailoredData, 
        summaryOptions 
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