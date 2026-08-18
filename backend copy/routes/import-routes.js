const express = require('express');
const multer = require('multer');
const os = require('os');
const { importResume } = require('../controllers/import-controller');
const { protect } = require('../middlewares/authmiddleware');

const router = express.Router();

// 🚀 CRITICAL FIX: Shifted from memoryStorage to diskStorage to prevent RAM asphyxiation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Uses the server's native temporary directory
        cb(null, os.tmpdir());
    },
    filename: (req, file, cb) => {
        cb(null, `resume-${Date.now()}-${Math.round(Math.random() * 1E9)}.pdf`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Hard cap at 5MB to prevent abuse
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf files are allowed!'), false);
        }
    }
});

router.post('/', protect, upload.single('resumeFile'), importResume);

module.exports = router;