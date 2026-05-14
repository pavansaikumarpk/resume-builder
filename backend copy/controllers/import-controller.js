// require('dotenv').config();
// const OpenAI = require('openai');
// const PDFParserModule = require('pdf2json');

// // 🚀 SHIELD: Protect against Babel's default export mangling
// const PDFParser = PDFParserModule.default || PDFParserModule;

// // Initialize Groq AI securely
// const openai = new OpenAI({
//   baseURL: "https://api.groq.com/openai/v1",
//   apiKey: process.env.GROQ_API_KEY, 
// });

// // Modern, Event-Driven PDF Extractor
// const extractTextFromPDF = (buffer) => {
//     return new Promise((resolve, reject) => {
//         // The '1' flag tells it to only extract raw text, keeping it blazing fast
//         const pdfParser = new PDFParser(null, 1);
        
//         pdfParser.on("pdfParser_dataError", errData => {
//             console.error("Parser Error:", errData.parserError);
//             reject(errData.parserError);
//         });
        
//         pdfParser.on("pdfParser_dataReady", () => {
//             const rawText = pdfParser.getRawTextContent();
//             resolve(rawText);
//         });

//         // Feed the Multer buffer directly into the parser
//         pdfParser.parseBuffer(buffer);
//     });
// };

// const importResume = async (req, res) => {
//     try {
//         // 1. Check if file exists
//         if (!req.file || !req.file.buffer) {
//             return res.status(400).json({ message: 'No valid PDF file uploaded.' });
//         }

//         // 2. Extract text natively using pdf2json
//         const rawText = await extractTextFromPDF(req.file.buffer);

//         if (!rawText || rawText.trim().length < 50) {
//             return res.status(400).json({ message: 'Could not extract enough text from the PDF.' });
//         }

//         // 3. Command the AI to map the unstructured text to our exact JSON schema
//         const systemInstruction = `You are a strict data-extraction API. Your job is to read raw, messy resume text from a PDF and map it EXACTLY to the provided JSON schema. 
//         - Do NOT invent information.
//         - If a field is missing in the raw text, leave it as an empty string or empty array.
//         - Break long paragraphs into concise bullet points for 'description' arrays.
//         - Return ONLY valid JSON.`;

//         const prompt = `Return a JSON object with this EXACT schema, populated with data from the RAW TEXT:
//         {
//           "personalInfo": {
//             "firstName": "", "lastName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": ""
//           },
//           "summary": "Professional summary paragraph...",
//           "experience": [
//             { "company": "", "position": "", "startDate": "", "endDate": "", "description": ["bullet 1", "bullet 2"] }
//           ],
//           "education": [
//             { "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "" }
//           ],
//           "projects": [
//             { "name": "", "description": ["bullet 1", "bullet 2"] }
//           ],
//           "skills": ["Skill 1", "Skill 2"]
//         }
        
//         RAW TEXT TO PARSE:
//         ${rawText}`;

//         // 4. Call Groq
//         const response = await openai.chat.completions.create({
//             model: "llama-3.3-70b-versatile",
//             messages: [
//               { role: "system", content: systemInstruction },
//               { role: "user", content: prompt }
//             ],
//             response_format: { type: "json_object" },
//             temperature: 0.2, // Low temperature for strict data extraction
//         });

//         const parsedJSON = JSON.parse(response.choices[0].message.content);

//         // 5. Send the perfectly formatted JSON back to the frontend
//         res.status(200).json({ resumeData: parsedJSON });

//     } catch (error) {
//         console.error("Magic Import Error:", error);
//         res.status(500).json({ message: 'Failed to process PDF import.', error: error.message });
//     }
// };

// module.exports = { importResume };











require('dotenv').config();
const OpenAI = require('openai');
const PDFParserModule = require('pdf2json');

// 🚀 SHIELD: Protect against Babel's default export mangling
const PDFParser = PDFParserModule.default || PDFParserModule;

// Initialize Groq AI securely
const openai = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY, 
});

// Modern, Event-Driven PDF Extractor
const extractTextFromPDF = (buffer) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, 1);
        
        pdfParser.on("pdfParser_dataError", errData => {
            console.error("Parser Error:", errData.parserError);
            reject(errData.parserError);
        });
        
        pdfParser.on("pdfParser_dataReady", () => {
            const rawText = pdfParser.getRawTextContent();
            resolve(rawText);
        });

        pdfParser.parseBuffer(buffer);
    });
};

const importResume = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'No valid PDF file uploaded.' });
        }

        const rawText = await extractTextFromPDF(req.file.buffer);

        if (!rawText || rawText.trim().length < 50) {
            return res.status(400).json({ message: 'Could not extract enough text from the PDF.' });
        }

        // 🚀 CRITICAL AI FIX: Draconian Rules to enforce categorized, horizontal skills
        const systemInstruction = `You are a strict data-extraction API. Read raw resume text and map it EXACTLY to the JSON schema. 
        RULES:
        1. Do NOT invent information. Leave missing fields empty.
        2. Break long paragraphs into concise bullet points for 'description' arrays.
        3. 🚨 STRICT SKILL FORMATTING 🚨: You MUST group skills by category. NEVER output a flat list of single words. 
           - CORRECT: ["Frontend: HTML, CSS, JavaScript", "Backend: Node.js, Java", "Tools: Git, Docker"]
           - WRONG: ["HTML", "CSS", "JavaScript", "Node.js", "Java"]
           If the original text has categories, preserve them. If it does not, you MUST invent logical categories (e.g., Languages, Frameworks, Tools) and group them horizontally.`;

        const prompt = `Return a JSON object with this EXACT schema, populated with data from the RAW TEXT:
        {
          "personalInfo": {
            "firstName": "", "lastName": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": ""
          },
          "summary": "Professional summary paragraph...",
          "experience": [
            { "company": "", "position": "", "startDate": "", "endDate": "", "description": ["bullet 1", "bullet 2"] }
          ],
          "education": [
            { "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "" }
          ],
          "projects": [
            { "name": "", "description": ["bullet 1", "bullet 2"] }
          ],
          "skills": [
            "Frontend: HTML, CSS, JavaScript, React",
            "Backend: Node.js, Java, Python",
            "Tools & AI: Git, Docker, TensorFlow"
          ]
        }
        
        RAW TEXT TO PARSE:
        ${rawText}`;

        // 4. Call Groq
        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1, // 🚀 LOWER TEMPERATURE: Forces the AI to strictly obey the format without hallucinating
        });

        const parsedJSON = JSON.parse(response.choices[0].message.content);

        // 5. Send the perfectly formatted JSON back to the frontend
        res.status(200).json({ resumeData: parsedJSON });

    } catch (error) {
        console.error("Magic Import Error:", error);
        res.status(500).json({ message: 'Failed to process PDF import.', error: error.message });
    }
};

module.exports = { importResume };