require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const PDFParserModule = require('pdf2json');
const PDFParser = PDFParserModule.default || PDFParserModule;

const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL_CACHE_TTL = 5 * 60 * 1000;
let cachedModels = null;
let cachedModelsAt = 0;

const PREFERRED_MODELS = ['llama-3.1-8b-instant', 'openai/gpt-oss-20b', 'llama-3.3-70b-versatile', 'openai/gpt-oss-120b'];

const getApiKey = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured on the server.');
  return apiKey;
};

const getConfiguredModel = () => {
  const value = process.env.AI_MODEL_NAME;
  return value && value.trim() ? value.trim() : null;
};

const isUsableTextModel = (model) => {
  if (!model || model.active === false || !model.id) return false;
  const id = model.id.toLowerCase();
  const owner = String(model.owned_by || '').toLowerCase();
  return !['whisper', 'guard', 'tts', 'orpheus', 'safeguard', 'embed'].some((term) => id.includes(term) || owner.includes(term));
};

const listAvailableModels = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cachedModels && now - cachedModelsAt < MODEL_CACHE_TTL) return cachedModels;
  const response = await axios.get(`${GROQ_BASE_URL}/models`, {
    headers: { Authorization: `Bearer ${getApiKey()}` },
    timeout: 10000,
  });
  const models = Array.isArray(response.data?.data) ? response.data.data.filter(isUsableTextModel) : [];
  if (!models.length) throw new Error('Groq returned no active text models for this API key.');
  cachedModels = models;
  cachedModelsAt = now;
  return models;
};

const selectModel = async (forceRefresh = false) => {
  const models = await listAvailableModels(forceRefresh);
  const available = new Set(models.map((model) => model.id));
  const configured = getConfiguredModel();
  if (configured && available.has(configured)) return configured;
  return PREFERRED_MODELS.find((id) => available.has(id)) || models[0].id;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractCleanJSON = (rawText) => {
  if (!rawText || typeof rawText !== 'string') throw new Error('AI returned an empty response.');
  const cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
  const firstBrace = cleanText.indexOf('{');
  const lastBrace = cleanText.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace <= firstBrace) throw new Error('AI returned invalid JSON.');
  return JSON.parse(cleanText.substring(firstBrace, lastBrace + 1));
};

const callAI = async (messages, options = {}) => {
  const apiKey = getApiKey();
  let model = await selectModel(false);
  let lastError = null;
  let jsonModeRetried = false;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const body = { model, messages, temperature: options.temperature ?? 0.05, max_tokens: options.maxTokens ?? 6000 };
      if (options.jsonMode !== false && !jsonModeRetried) body.response_format = { type: 'json_object' };
      const response = await axios.post(`${GROQ_BASE_URL}/chat/completions`, body, {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        timeout: 30000,
      });
      const content = response.data?.choices?.[0]?.message?.content;
      if (!content) throw new Error(`Model ${model} returned no content.`);
      return { content, usage: response.data?.usage || null, model: response.data?.model || model };
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status === 400 && options.jsonMode !== false && !jsonModeRetried) {
        jsonModeRetried = true;
        continue;
      }
      if ([401, 403, 404, 429].includes(status) || status >= 500) {
        try {
          const refreshed = await listAvailableModels(true);
          const nextModel = refreshed.map((item) => item.id).find((id) => id !== model);
          if (nextModel) {
            model = nextModel;
            jsonModeRetried = false;
            continue;
          }
        } catch (refreshError) {
          lastError = refreshError;
        }
      }
      if ((!status || status === 408 || status === 409 || status >= 500) && attempt < 3) {
        await sleep(750 * Math.pow(2, attempt));
        continue;
      }
      break;
    }
  }

  const providerMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Unknown AI provider error';
  const status = lastError?.response?.status;
  const finalError = new Error(`AI provider failed${status ? ` (${status})` : ''}: ${providerMessage}`);
  finalError.providerStatus = status;
  throw finalError;
};

const extractTextFromPDF = (filePath) => new Promise((resolve, reject) => {
  const pdfParser = new PDFParser(null, 1);
  pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError));
  pdfParser.on('pdfParser_dataReady', () => resolve(pdfParser.getRawTextContent()));
  pdfParser.loadPDF(filePath);
});

const importResume = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file || !req.file.path) return res.status(400).json({ message: 'No valid PDF file uploaded.' });
    filePath = req.file.path;
    const rawText = await extractTextFromPDF(filePath);
    if (!rawText || rawText.trim().length < 50) return res.status(400).json({ message: 'Could not extract enough text from this PDF.' });

    const systemInstruction = `You are an expert ATS resume data extraction API. Read raw resume text and map it exactly to the JSON schema.
MANDATORY RULES:
1. Preserve bullet points in the exact top-to-bottom order from the source.
2. Extract the full summary and every bullet point without truncation.
3. Put dates only in startDate/endDate fields and job locations in location.
4. Put sections that do not fit Experience, Education, Projects, or Skills into customSections.
5. Categorize skills accurately and preserve individual skills.
6. Never invent information. Use empty strings or empty arrays when information is absent.
7. Return ONLY a valid JSON object matching the requested schema.`;

    const prompt = `RAW TEXT TO PARSE:\n${rawText}\n\nReturn a JSON object populating this EXACT schema:
{
  "personalInfo": { "firstName": "", "lastName": "", "email": "", "phone": "", "linkedin": "", "github": "", "location": "" },
  "summary": "",
  "experience": [{ "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "description": ["bullet 1", "bullet 2"] }],
  "education": [{ "institution": "", "degree": "", "fieldOfStudy": "", "startDate": "", "endDate": "" }],
  "projects": [{ "name": "", "description": ["bullet 1", "bullet 2"], "link": "" }],
  "skills": [{ "category": "Programming Languages", "items": ["C", "Python"] }],
  "customSections": [
    { "title": "Leadership Activities", "items": ["Produced 5 films", "Managed content"] },
    { "title": "Relevant Coursework", "text": "Digital Electronics, Embedded Systems..." },
    { "title": "Languages", "items": ["English", "Telugu", "Hindi"] }
  ]
}`;

    const aiResult = await callAI([
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ], { maxTokens: 6000, temperature: 0.05 });

    const parsedJSON = extractCleanJSON(aiResult.content);
    return res.status(200).json({ resumeData: parsedJSON });
  } catch (error) {
    console.error('Import Error:', { message: error.message, status: error.providerStatus || error.response?.status, providerError: error.response?.data?.error || null });
    return res.status(500).json({ message: 'Failed to process PDF import.', error: error.message });
  } finally {
    if (filePath) fs.unlink(filePath, (err) => {
      if (err && err.code !== 'ENOENT') console.error('Temp PDF cleanup failed:', err.message);
    });
  }
};

module.exports = { importResume };
