// "use strict";

// const OpenAI = require("openai");

// const CONFIG = {
//   model: "llama-3.3-70b-versatile",
//   timeoutMs: 30000, 
//   maxRetries: 1, 
//   retryDelayMs: 1000,
//   rateLimit: { windowMs: 60 * 1000, maxRequests: 30 },
// };

// if (!process.env.GROQ_API_KEY) {
//   console.error("CRITICAL ERROR: GROQ_API_KEY not set in .env");
// }

// const openai = new OpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_KEY,
// });

// const logger = {
//   error: (msg, meta) => console.error(JSON.stringify({ level: "error", msg, ...meta }, null, 2)),
//   warn: (msg, meta) => console.warn(JSON.stringify({ level: "warn", msg, ...meta }, null, 2))
// };

// const rateLimitStore = new Map();
// const isRateLimited = (ip) => {
//   const now = Date.now();
//   if (!rateLimitStore.has(ip)) rateLimitStore.set(ip, []);
//   const ts = rateLimitStore.get(ip).filter(t => t > now - CONFIG.rateLimit.windowMs);
//   if (ts.length >= CONFIG.rateLimit.maxRequests) return true;
//   ts.push(now); rateLimitStore.set(ip, ts); return false;
// };

// const sanitizeInput = (text) => typeof text === "string" ? text.replace(/[^\x20-\x7E\n\r\t]/g, "").trim() : text;
// const sanitizeResumeData = (data) => {
//   if (!data || typeof data !== "object") return data;
//   const s = {};
//   for (const [k, v] of Object.entries(data)) {
//     if (typeof v === "string") s[k] = sanitizeInput(v);
//     else if (Array.isArray(v)) s[k] = v.map(x => typeof x === "string" ? sanitizeInput(x) : x);
//     else s[k] = v;
//   }
//   return s;
// };

// const sleep = ms => new Promise(r => setTimeout(r, ms));

// const callAI = async (prompt, systemInstruction) => {
//   let lastError;
//   for (let attempt = 1; attempt <= CONFIG.maxRetries + 1; attempt++) {
//     try {
//       const response = await openai.chat.completions.create({
//         model: CONFIG.model,
//         messages: [
//           { role: "system", content: systemInstruction },
//           { role: "user", content: prompt }
//         ],
//         response_format: { type: "json_object" },
//         temperature: 0.7,
//       });
//       return JSON.parse(response.choices[0].message.content);
//     } catch (err) {
//       lastError = err;
//       logger.warn(`Groq API Rejected Attempt ${attempt}`, { message: err.message });
//       if (attempt <= CONFIG.maxRetries) await sleep(CONFIG.retryDelayMs * attempt);
//     }
//   }
//   throw lastError;
// };

// const getClientIp = (req) => req.headers["x-forwarded-for"]?.split(",")[0] || "unknown";

// const analyzeMatch = async (req, res) => { /* existing code */ };
// const optimizeBullet = async (req, res) => { /* existing code */ };

// // // 🚀 UPGRADED: Full-Resume Auto-Tailor with Alternatives & New Suggestions
// // const generateTailoredResume = async (req, res) => {
// //   if (isRateLimited(getClientIp(req))) return res.status(429).json({ error: "Too many requests" });
// //   try {
// //     const jd = sanitizeInput(req.body.jobDescription);
// //     const data = sanitizeResumeData(req.body.resumeData);
// //     const tone = req.body.tone || "impact"; 

// //     let toneInstruction = "";
// //     switch (tone) {
// //       case "authentic":
// //         toneInstruction = "TONE: Authentic, clear, and realistic. Focus on actual tasks and collaboration. Make it sound honest and easy to defend in an interview. No aggressive corporate jargon.";
// //         break;
// //       case "ats":
// //         toneInstruction = "TONE: Highly strategic, executive-level, and heavily optimized for ATS. Maximize keyword density from the JD. Focus aggressively on quantifiable metrics and systemic business impact.";
// //         break;
// //       case "impact":
// //       default:
// //         toneInstruction = "TONE: Professional, balanced, and results-oriented. Use strong action verbs to highlight achievements and technical execution.";
// //         break;
// //     }

// //     const systemInstruction = `You are an elite executive resume writer and ATS optimization expert. 
// //     Read the user's existing resume data and the target Job Description (JD). 
    
// //     TASKS:
// //     1. SUMMARY: Generate 3 distinct alternative options for their Professional Summary tailored to the JD.
// //     2. BULLETS: For EVERY item in their experience, projects, or custom sections:
// //        a) Rewrite their EXISTING bullets to better match the JD keywords.
// //        b) Generate 2-3 completely NEW, highly relevant "Suggested Bullets" that the user likely performed based on their job title, but forgot to include. These MUST target missing JD keywords.
    
// //     ${toneInstruction}

// //     CRITICAL RULE: Return ONLY valid JSON matching the exact schema below. Use the exact JSON key for 'sectionKey' (e.g., 'experience', 'projects', 'custom_123').`;

// //     const prompt = `Return a JSON object with this exact schema: 
// //     { 
// //       "summaryOptions": ["Option 1...", "Option 2...", "Option 3..."], 
// //       "tailoredItems": [ 
// //         { 
// //           "sectionKey": "experience", 
// //           "itemTitle": "Company Name or Project Name", 
// //           "rewrittenBullets": ["Rewritten bullet 1..."],
// //           "newSuggestions": ["Suggested new bullet targeting JD..."]
// //         } 
// //       ] 
// //     }
    
// //     JD: ${jd} 
    
// //     RESUME: ${JSON.stringify(data)}`;

// //     const result = await callAI(prompt, systemInstruction);
    
// //     // Safety check: Ensure the AI didn't hallucinate a bad structure
// //     if (!result.summaryOptions || !result.tailoredItems) {
// //       throw new Error("AI returned malformed JSON schema");
// //     }

// //     return res.status(200).json(result);
    
// //   } catch (err) { 
// //     logger.error("Tailoring Failed with Groq", { error: err.message });
    
// //     // PERFECT FALLBACK MOCK DATA: Matches the new schema so your UI never breaks
// //     const companies = req.body.resumeData?.experience?.map(e => e.company).filter(Boolean) || [];
// //     const targetName = companies.length > 0 ? companies[0] : "Your Experience/Project";

// //     return res.status(200).json({
// //       summaryOptions: [
// //         "✨ [MOCK] A highly motivated professional perfectly aligning with the target role, bringing proven expertise in driving measurable business growth and technical excellence.",
// //         "✨ [MOCK] Results-driven engineer with a strong track record of delivering scalable solutions.",
// //         "✨ [MOCK] Collaborative team player focused on building robust applications using modern frameworks."
// //       ],
// //       tailoredItems: [
// //         {
// //           sectionKey: "experience",
// //           itemTitle: targetName,
// //           rewrittenBullets: [
// //             "🔄 [REWRITE MOCK] Overhauled core system architecture, resulting in a 40% reduction in load times.",
// //             "🔄 [REWRITE MOCK] Spearheaded a cross-functional team to deliver the project 2 weeks ahead of schedule."
// //           ],
// //           newSuggestions: [
// //             "💡 [NEW MOCK] Implemented CI/CD pipelines using GitHub Actions to automate deployment processes.",
// //             "💡 [NEW MOCK] Integrated automated testing frameworks, increasing test coverage by 35%."
// //           ]
// //         }
// //       ]
// //     });
// //   }
// // };

// // // 🚀 UPGRADED: Full-Resume Auto-Tailor with Skills Audit & Grammar Fixes
// // const generateTailoredResume = async (req, res) => {
// //   if (isRateLimited(getClientIp(req))) return res.status(429).json({ error: "Too many requests" });
// //   try {
// //     const jd = sanitizeInput(req.body.jobDescription);
// //     const data = sanitizeResumeData(req.body.resumeData);
// //     const tone = req.body.tone || "impact"; 

// //     let toneInstruction = "";
// //     switch (tone) {
// //       case "authentic":
// //         toneInstruction = "TONE: Authentic, clear, and realistic. Focus on actual tasks and collaboration. Make it sound honest and easy to defend in an interview. No aggressive corporate jargon.";
// //         break;
// //       case "ats":
// //         toneInstruction = "TONE: Highly strategic, executive-level, and heavily optimized for ATS. Maximize keyword density from the JD. Focus aggressively on quantifiable metrics and systemic business impact.";
// //         break;
// //       case "impact":
// //       default:
// //         toneInstruction = "TONE: Professional, balanced, and results-oriented. Use strong action verbs to highlight achievements and technical execution.";
// //         break;
// //     }

// //     const systemInstruction = `You are an elite executive resume writer and ATS optimization expert. 
// //     Read the user's existing resume data and the target Job Description (JD). 
    
// //     TASKS:
// //     1. GRAMMAR & SPELLING: Identify and fix ALL spelling, grammar, and syntax errors in the user's existing text.
// //     2. SUMMARY: Generate 3 distinct alternative options for their Professional Summary tailored to the JD.
// //     3. SKILLS AUDIT: Analyze the user's current skills against the JD. Identify which skills they should explicitly ADD to pass the ATS, and which irrelevant/damaging skills they should REMOVE to declutter their resume.
// //     4. BULLETS: For EVERY item in their experience, projects, or custom sections:
// //        a) Rewrite their EXISTING bullets to fix grammar and better match the JD keywords.
// //        b) Generate 2 completely NEW, highly relevant "Suggested Bullets" that the user likely performed based on their job title, but forgot to include.
    
// //     ${toneInstruction}

// //     CRITICAL RULE: Return ONLY valid JSON matching the exact schema below. Use the exact JSON key for 'sectionKey' (e.g., 'experience', 'projects', 'custom_123').`;

// //     const prompt = `Return a JSON object with this exact schema: 
// //     { 
// //       "summaryOptions": ["Option 1...", "Option 2...", "Option 3..."], 
// //       "skillsAudit": {
// //         "add": ["Missing Skill 1", "Missing Skill 2"],
// //         "remove": ["Irrelevant Skill 1", "Irrelevant Skill 2"]
// //       },
// //       "tailoredItems": [ 
// //         { 
// //           "sectionKey": "experience", 
// //           "itemTitle": "Company Name or Project Name", 
// //           "rewrittenBullets": ["Grammar-fixed, rewritten bullet 1..."],
// //           "newSuggestions": ["Suggested new bullet targeting JD..."]
// //         } 
// //       ] 
// //     }
    
// //     JD: ${jd} 
    
// //     RESUME: ${JSON.stringify(data)}`;

// //     const result = await callAI(prompt, systemInstruction);

// //     if (!result.summaryOptions || !result.tailoredItems) {
// //         throw new Error("AI returned malformed JSON schema");
// //     }

// //     return res.status(200).json(result);
    
// //   } catch (err) { 
// //     logger.error("Tailoring Failed with Groq", { error: err.message });
    
// //     const companies = req.body.resumeData?.experience?.map(e => e.company).filter(Boolean) || [];
// //     const targetName = companies.length > 0 ? companies[0] : "Your Experience/Project";

// //     return res.status(200).json({
// //       summaryOptions: [
// //         "✨ [MOCK] A highly motivated professional perfectly aligning with the target role, bringing proven expertise in driving measurable business growth and technical excellence.",
// //         "✨ [MOCK] Results-driven engineer with a strong track record of delivering scalable solutions.",
// //         "✨ [MOCK] Collaborative team player focused on building robust applications using modern frameworks."
// //       ],
// //       skillsAudit: {
// //         add: ["Docker", "Kubernetes", "AWS (Mentioned in JD)"],
// //         remove: ["Microsoft Word", "Basic HTML (Too junior)"]
// //       },
// //       tailoredItems: [
// //         {
// //           sectionKey: "experience",
// //           itemTitle: targetName,
// //           rewrittenBullets: [
// //             "🔄 [REWRITE MOCK] Overhauled core system architecture, resulting in a 40% reduction in load times.",
// //             "🔄 [REWRITE MOCK] Spearheaded a cross-functional team to deliver the project 2 weeks ahead of schedule."
// //           ],
// //           newSuggestions: [
// //             "💡 [NEW MOCK] Implemented CI/CD pipelines using GitHub Actions to automate deployment processes.",
// //             "💡 [NEW MOCK] Integrated automated testing frameworks, increasing test coverage by 35%."
// //           ]
// //         }
// //       ]
// //     });
// //   }
// // };


// // 🚀 UPGRADED: Full-Resume Auto-Tailor with Skills Audit, Custom Sections & Tone Enforcement
// const generateTailoredResume = async (req, res) => {
//   if (isRateLimited(getClientIp(req))) return res.status(429).json({ error: "Too many requests" });
//   try {
//     const jd = sanitizeInput(req.body.jobDescription);
//     const data = sanitizeResumeData(req.body.resumeData);
    
//     // Grab the tone from the frontend (Defaults to 'impact')
//     const tone = req.body.tone || "impact"; 

//     // Define the specific persona based on the user's selection
//     let toneInstruction = "";
//     switch (tone) {
//       case "authentic":
//         toneInstruction = "TONE RULE: Authentic, clear, and realistic. Focus on actual tasks and collaboration. Make it sound honest and easy to defend in an interview. NO aggressive corporate jargon.";
//         break;
//       case "ats":
//         toneInstruction = "TONE RULE: Highly strategic, executive-level, and heavily optimized for ATS. Maximize keyword density from the JD. Focus aggressively on quantifiable metrics and systemic business impact.";
//         break;
//       case "impact":
//       default:
//         toneInstruction = "TONE RULE: Professional, balanced, and results-oriented. Use strong action verbs to highlight achievements and technical execution without sounding arrogant.";
//         break;
//     }

//     const systemInstruction = `You are an elite executive resume writer and ATS optimization expert. 
//     Read the user's existing resume data and the target Job Description (JD). 
    
//     TASKS:
//     1. GRAMMAR & SPELLING: Identify and fix ALL spelling, grammar, and syntax errors in the user's existing text.
//     2. SUMMARY: Generate 3 distinct alternative options for their Professional Summary tailored to the JD.
//     3. SKILLS AUDIT: Analyze the user's current skills against the JD. Identify which skills they should explicitly ADD to pass the ATS, and which irrelevant/damaging skills they should REMOVE to declutter their resume.
//     4. SECTION AUDIT (CRITICAL): You must analyze EVERY section provided in the resume data (including 'experience', 'projects', AND any dynamically named custom sections like 'custom_123').
//        For EVERY item in EVERY section:
//        a) Rewrite their EXISTING bullets to fix grammar and better match the JD keywords.
//        b) Generate 2 completely NEW, highly relevant "Suggested Bullets" that the user likely performed based on their job title, but forgot to include.
    
//     ${toneInstruction} <-- YOU MUST APPLY THIS TONE TO ALL SUMMARIES AND BULLETS.

//     CRITICAL RULE: Return ONLY valid JSON matching the exact schema below. Use the exact JSON key for 'sectionKey'.`;

//     const prompt = `Return a JSON object with this exact schema: 
//     { 
//       "summaryOptions": ["Option 1...", "Option 2...", "Option 3..."], 
//       "skillsAudit": {
//         "add": ["Missing Skill 1", "Missing Skill 2"],
//         "remove": ["Irrelevant Skill 1", "Irrelevant Skill 2"]
//       },
//       "tailoredItems": [ 
//         { 
//           "sectionKey": "experience", // Use the exact key from the input JSON (e.g., 'experience', 'projects', 'custom_168493')
//           "itemTitle": "Company Name or Project Name", 
//           "rewrittenBullets": ["Grammar-fixed, rewritten bullet 1..."],
//           "newSuggestions": ["Suggested new bullet targeting JD..."]
//         } 
//       ] 
//     }
    
//     JD: ${jd} 
    
//     RESUME: ${JSON.stringify(data)}`;

//     const result = await callAI(prompt, systemInstruction);

//     if (!result.summaryOptions || !result.tailoredItems) {
//         throw new Error("AI returned malformed JSON schema");
//     }

//     return res.status(200).json(result);
    
//   } catch (err) { 
//     logger.error("Tailoring Failed with Groq", { error: err.message });
    
//     // SAFE FALLBACK MOCK DATA
//     const companies = req.body.resumeData?.experience?.map(e => e.company).filter(Boolean) || [];
//     const targetName = companies.length > 0 ? companies[0] : "Your Experience/Project";

//     return res.status(200).json({
//       summaryOptions: [
//         "✨ [MOCK] A highly motivated professional perfectly aligning with the target role, bringing proven expertise in driving measurable business growth and technical excellence.",
//         "✨ [MOCK] Results-driven engineer with a strong track record of delivering scalable solutions.",
//         "✨ [MOCK] Collaborative team player focused on building robust applications using modern frameworks."
//       ],
//       skillsAudit: {
//         add: ["Docker", "Kubernetes", "AWS (Mentioned in JD)"],
//         remove: ["Microsoft Word", "Basic HTML (Too junior)"]
//       },
//       tailoredItems: [
//         {
//           sectionKey: "experience",
//           itemTitle: targetName,
//           rewrittenBullets: [
//             "🔄 [REWRITE MOCK] Overhauled core system architecture, resulting in a 40% reduction in load times.",
//             "🔄 [REWRITE MOCK] Spearheaded a cross-functional team to deliver the project 2 weeks ahead of schedule."
//           ],
//           newSuggestions: [
//             "💡 [NEW MOCK] Implemented CI/CD pipelines using GitHub Actions to automate deployment processes.",
//             "💡 [NEW MOCK] Integrated automated testing frameworks, increasing test coverage by 35%."
//           ]
//         }
//       ]
//     });
//   }
// };


// module.exports = { analyzeMatch, optimizeBullet, generateTailoredResume };























"use strict";

const OpenAI = require("openai");

const CONFIG = {
  model: "llama-3.3-70b-versatile",
  timeoutMs: 30000, 
  maxRetries: 1, 
  retryDelayMs: 1000,
  rateLimit: { windowMs: 60 * 1000, maxRequests: 30 },
};

if (!process.env.GROQ_API_KEY) {
  console.error("CRITICAL ERROR: GROQ_API_KEY not set in .env");
}

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const logger = {
  error: (msg, meta) => console.error(JSON.stringify({ level: "error", msg, ...meta }, null, 2)),
  warn: (msg, meta) => console.warn(JSON.stringify({ level: "warn", msg, ...meta }, null, 2))
};

const rateLimitStore = new Map();
const isRateLimited = (ip) => {
  const now = Date.now();
  if (!rateLimitStore.has(ip)) rateLimitStore.set(ip, []);
  const ts = rateLimitStore.get(ip).filter(t => t > now - CONFIG.rateLimit.windowMs);
  if (ts.length >= CONFIG.rateLimit.maxRequests) return true;
  ts.push(now); rateLimitStore.set(ip, ts); return false;
};

const sanitizeInput = (text) => typeof text === "string" ? text.replace(/[^\x20-\x7E\n\r\t]/g, "").trim() : text;
const sanitizeResumeData = (data) => {
  if (!data || typeof data !== "object") return data;
  const s = {};
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === "string") s[k] = sanitizeInput(v);
    else if (Array.isArray(v)) s[k] = v.map(x => typeof x === "string" ? sanitizeInput(x) : x);
    else s[k] = v;
  }
  return s;
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

const callAI = async (prompt, systemInstruction) => {
  let lastError;
  for (let attempt = 1; attempt <= CONFIG.maxRetries + 1; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: CONFIG.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });
      return JSON.parse(response.choices[0].message.content);
    } catch (err) {
      lastError = err;
      logger.warn(`Groq API Rejected Attempt ${attempt}`, { message: err.message });
      if (attempt <= CONFIG.maxRetries) await sleep(CONFIG.retryDelayMs * attempt);
    }
  }
  throw lastError;
};

const getClientIp = (req) => req.headers["x-forwarded-for"]?.split(",")[0] || "unknown";

const analyzeMatch = async (req, res) => { /* existing code */ };
const optimizeBullet = async (req, res) => { /* existing code */ };

const generateTailoredResume = async (req, res) => {
  if (isRateLimited(getClientIp(req))) return res.status(429).json({ error: "Too many requests" });
  try {
    const jd = sanitizeInput(req.body.jobDescription);
    const data = sanitizeResumeData(req.body.resumeData);
    const tone = req.body.tone || "impact"; 

    let toneInstruction = "";
    switch (tone) {
      case "authentic": toneInstruction = "TONE RULE: Authentic, clear, and realistic. Focus on actual tasks and collaboration. NO aggressive corporate jargon."; break;
      case "ats": toneInstruction = "TONE RULE: Highly strategic, executive-level, and heavily optimized for ATS. Maximize keyword density from the JD. Focus aggressively on quantifiable metrics."; break;
      case "impact": default: toneInstruction = "TONE RULE: Professional, balanced, and results-oriented. Use strong action verbs to highlight achievements."; break;
    }

    const systemInstruction = `You are an elite executive resume writer and ATS optimization expert. Read the user's existing resume data and the target Job Description (JD). 
    TASKS:
    1. SUMMARY: Generate 3 distinct alternative options for their Professional Summary tailored to the JD.
    2. SKILLS AUDIT: Analyze current skills against JD. Suggest additions and removals.
    3. SECTION AUDIT: Analyze EVERY item in EVERY section. Rewrite EXISTING bullets and generate 2 NEW highly relevant "Suggested Bullets" targeting the JD.
    ${toneInstruction}
    CRITICAL RULE: Return ONLY valid JSON matching the exact schema below. Use the exact JSON key for 'sectionKey'.`;

    const prompt = `Return a JSON object with this exact schema: 
    { 
      "summaryOptions": ["Option 1...", "Option 2...", "Option 3..."], 
      "skillsAudit": { "add": ["Skill 1"], "remove": ["Skill 2"] },
      "tailoredItems": [ { "sectionKey": "experience", "itemTitle": "Target Job Title", "rewrittenBullets": ["Bullet 1..."], "newSuggestions": ["Suggestion 1..."] } ] 
    }
    JD: ${jd} \n RESUME: ${JSON.stringify(data)}`;

    const result = await callAI(prompt, systemInstruction);
    if (!result.summaryOptions || !result.tailoredItems) throw new Error("Malformed JSON");
    return res.status(200).json(result);
  } catch (err) { 
    logger.error("Tailoring Failed", { error: err.message });
    return res.status(500).json({ error: "Failed" });
  }
};

// 🚀 NEW FEATURE: COVER LETTER GENERATOR
const generateCoverLetter = async (req, res) => {
    if (isRateLimited(getClientIp(req))) return res.status(429).json({ error: "Too many requests" });
    try {
        const jd = sanitizeInput(req.body.jobDescription);
        const data = sanitizeResumeData(req.body.resumeData);
        
        const systemInstruction = `You are an expert career coach. Write a highly persuasive, 3-paragraph cover letter based on the user's resume and the provided Job Description. Do not use generic placeholders like [Company Name] if the company is mentioned in the JD. Return ONLY valid JSON.`;
        
        const prompt = `Return a JSON object with this exact schema:
        { "coverLetter": "Dear Hiring Manager,\\n\\nParagraph 1...\\n\\nParagraph 2...\\n\\nParagraph 3...\\n\\nSincerely,\\n[User Name]" }
        JD: ${jd} \n RESUME: ${JSON.stringify(data)}`;

        const result = await callAI(prompt, systemInstruction);
        return res.status(200).json(result);
    } catch (err) {
        logger.error("Cover Letter Failed", { error: err.message });
        return res.status(500).json({ error: "Cover Letter generation failed" });
    }
};

module.exports = { analyzeMatch, optimizeBullet, generateTailoredResume, generateCoverLetter };