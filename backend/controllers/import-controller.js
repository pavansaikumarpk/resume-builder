const fs = require('fs');
const PDFParserModule = require('pdf2json');
const PDFParser = PDFParserModule.default || PDFParserModule;

const extractTextFromPDF = (filePath) => new Promise((resolve, reject) => {
  const pdfParser = new PDFParser(null, 1);
  pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError));
  pdfParser.on('pdfParser_dataReady', () => resolve(pdfParser.getRawTextContent()));
  pdfParser.loadPDF(filePath);
});

const SECTION_HEADINGS = new Set([
  'summary', 'professional summary', 'profile', 'objective', 'career objective',
  'experience', 'work experience', 'professional experience', 'employment history',
  'education', 'academic background', 'projects', 'personal projects',
  'skills', 'technical skills', 'core skills', 'certifications', 'licenses',
  'achievements', 'awards', 'publications', 'leadership', 'leadership activities',
  'volunteering', 'volunteer experience', 'languages', 'relevant coursework',
  'interests', 'references'
]);

const normalizeHeading = (line) => line
  .replace(/^[•*#\-\s]+|[：:]$/g, '')
  .trim()
  .toLowerCase();

const extractResumeSections = (rawText) => {
  const lines = rawText.replace(/\r/g, '\n').split('\n').map((line) => line.trim()).filter(Boolean);
  const sections = [];
  let current = { title: 'Imported Content', items: [] };

  lines.forEach((line) => {
    if (SECTION_HEADINGS.has(normalizeHeading(line))) {
      if (current.items.length) sections.push(current);
      current = { title: line.replace(/^[•*#\-\s]+|[：:]$/g, '').trim(), items: [] };
    } else {
      current.items.push(line);
    }
  });

  if (current.items.length) sections.push(current);
  return sections;
};

const importResume = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No valid PDF file uploaded.' });
    }

    filePath = req.file.path;
    const rawText = await extractTextFromPDF(filePath);
    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({
        message: 'Could not extract readable text from this PDF. Scanned PDFs require OCR before import.'
      });
    }

    // Deterministic import: no LLM rewriting, inference, or generated resume content.
    const resumeData = {
      personalInfo: {
        firstName: '', lastName: '', email: '', phone: '',
        linkedin: '', github: '', location: ''
      },
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: [],
      customSections: extractResumeSections(rawText),
      importedText: rawText
    };

    return res.status(200).json({ resumeData });
  } catch (error) {
    console.error('Import Error:', { message: error.message });
    return res.status(500).json({ message: 'Failed to process PDF import.', error: error.message });
  } finally {
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') console.error('Temp PDF cleanup failed:', err.message);
      });
    }
  }
};

module.exports = { importResume };
