const express = require('express');
const multer = require('multer');
const os = require('os');
const { importResume } = require('../controllers/import-controller');
const { protect } = require('../middlewares/authmiddleware');
const { aiUsageMiddleware } = require('../middlewares/aiUsageMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, os.tmpdir()),
  filename: (req, file, cb) => cb(null, `resume-${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    return cb(new Error('Only .pdf files are allowed!'), false);
  },
});

router.post('/', protect, aiUsageMiddleware, upload.single('resumeFile'), importResume);

module.exports = router;
