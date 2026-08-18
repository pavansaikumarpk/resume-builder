




// require('dotenv').config();
// const fs = require('fs');
// const OpenAI = require('openai');
// const PDFParserModule = require('pdf2json');

// const PDFParser = PDFParserModule.default || PDFParserModule;

// const openai = new OpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_KEY, 
// });

// const extractTextFromPDF = (filePath) => {
//     return new Promise((resolve, reject) => {
//         const pdfParser = new PDFParser(null, 1);
//         pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
//         pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
//         pdfParser.loadPDF(filePath);
//     });
// };

// const importResume = async (req, res) => {
//     try {
//         if (!req.file || !req.file.path) {
//             return res.status(400).json({ message: 'No valid PDF file uploaded.' });
//         }

//         const rawText = await extractTextFromPDF(req.file.path);
//         fs.unlink(req.file.path, (err) => { if (err) console.error("Temp file cleanup failed:", err); });

//         if (!rawText || rawText.trim().length < 50) {
//             return res.status(400).json({ message: 'Could not extract enough text.' });
//         }

//         // 🚀 THE FIX: BULLETPROOF SYSTEM PROMPT
//         const systemInstruction = `You are an expert ATS data-extraction API. Read raw resume text and map it EXACTLY to the JSON schema.
        
//         MANDATORY RULES:
//         1. NO REVERSED BULLETS: Keep bullet points in the EXACT top-to-bottom chronological order as they appear in the source. DO NOT reverse them.
//         2. NO TRUNCATION: Extract the FULL professional summary and EVERY bullet point. Do not cut off sentences.
//         3. DATES: Ensure dates are placed in startDate/endDate fields. DO NOT place dates inside the description arrays.
//         4. CATCH ALL DATA: Any section that does not fit into Experience, Education, Projects, or Skills (e.g., "Leadership", "Relevant Coursework", "Certifications") MUST be extracted into the "customSections" array. Do not delete data.
//         5. LOCATION: Extract the user's location into personalInfo.location.`;

//         const prompt = `RAW TEXT TO PARSE:
//         ${rawText}
        
//         Return a JSON object populating this EXACT schema:
//         {
//           "personalInfo": {
//             "firstName": "", "lastName": "", "email": "", "phone": "", "linkedin": "", "github": "", "location": ""
//           },
//           "summary": "...",
//           "experience": [
//             { "company": "", "position": "", "startDate": "", "endDate": "", "description": ["bullet 1", "bullet 2"] }
//           ],
//           "education": [
//             { "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "" }
//           ],
//           "projects": [
//             { "name": "", "description": ["bullet 1", "bullet 2"], "link": "" }
//           ],
//           "skills": [
//             { "category": "Frontend", "items": ["HTML", "React"] }
//           ],
//           "customSections": [
//             { "title": "Leadership Activities", "items": ["Produced 5 films", "Managed content"] },
//             { "title": "Relevant Coursework", "text": "Digital Electronics, Embedded Systems..." }
//           ]
//         }`;

//         const response = await openai.chat.completions.create({
//             model: "llama-3.3-70b-versatile",
//             messages: [
//               { role: "system", content: systemInstruction },
//               { role: "user", content: prompt }
//             ],
//             response_format: { type: "json_object" },
//             temperature: 0.05, 
//             max_tokens: 8000, 
//         });

//         let rawResponseText = response.choices[0].message.content;
        
//         const first = rawResponseText.indexOf('{');
//         const last = rawResponseText.lastIndexOf('}');
//         rawResponseText = rawResponseText.substring(first, last + 1);

//         const parsedJSON = JSON.parse(rawResponseText);
        
//         res.status(200).json({ resumeData: parsedJSON });

//     } catch (error) {
//         console.error("Import Error:", error);
//         res.status(500).json({ message: 'Failed to process PDF import.', error: error.message });
//     }
// };

// module.exports = { importResume };




require('dotenv').config();
const fs = require('fs');
const OpenAI = require('openai');
const PDFParserModule = require('pdf2json');
const PDFParser = PDFParserModule.default || PDFParserModule;

const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY, 
});

const extractTextFromPDF = (filePath) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
        pdfParser.loadPDF(filePath);
    });
};

const importResume = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No valid PDF file uploaded.' });
        }

        const rawText = await extractTextFromPDF(req.file.path);
        fs.unlink(req.file.path, () => {});

        if (!rawText || rawText.trim().length < 50) {
            return res.status(400).json({ message: 'Could not extract enough text.' });
        }

        const systemInstruction = `You are an expert ATS data-extraction API. Read raw resume text and map it EXACTLY to the JSON schema.
        
        MANDATORY RULES:
        1. NO REVERSED BULLETS: Keep bullet points in the EXACT top-to-bottom chronological order.
        2. NO TRUNCATION: Extract the FULL professional summary and EVERY bullet point entirely.
        3. DATES & LOCATIONS: Isolate dates into startDate/endDate. Extract job locations into the location field.
        4. CATCH ALL DATA: Any section that does not explicitly fit into Experience, Education, Projects, or Skills MUST be extracted into the "customSections" array. 
        5. SKILLS: Categorize skills accurately. Do not squash them into a single string.`;

        const prompt = `RAW TEXT TO PARSE:\n${rawText}\n\nReturn a JSON object populating this EXACT schema:
        {
          "personalInfo": {
            "firstName": "", "lastName": "", "email": "", "phone": "", "linkedin": "", "github": "", "location": ""
          },
          "summary": "",
          "experience": [
            { "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "description": ["bullet 1", "bullet 2"] }
          ],
          "education": [
            { "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "" }
          ],
          "projects": [
            { "name": "", "description": ["bullet 1", "bullet 2"], "link": "" }
          ],
          "skills": [
            { "category": "Programming Languages", "items": ["C", "Python"] }
          ],
          "customSections": [
            { "title": "Leadership Activities", "items": ["Produced 5 films", "Managed content"] },
            { "title": "Relevant Coursework", "text": "Digital Electronics, Embedded Systems..." },
            { "title": "Languages", "items": ["English", "Telugu", "Hindi"] }
          ]
        }`;

        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.05, 
            max_tokens: 8000, 
        });

        let rawResponseText = response.choices[0].message.content;
        const first = rawResponseText.indexOf('{');
        const last = rawResponseText.lastIndexOf('}');
        rawResponseText = rawResponseText.substring(first, last + 1);

        const parsedJSON = JSON.parse(rawResponseText);
        res.status(200).json({ resumeData: parsedJSON });

    } catch (error) {
        res.status(500).json({ message: 'Failed to process PDF import.', error: error.message });
    }
};

module.exports = { importResume };