const express = require('express');
const multer = require('multer');
const { importResume } = require('../controllers/import-controller');
const { protect } = require('../middlewares/authmiddleware');

const router = express.Router();

// Configure Multer to store the uploaded file temporarily in server RAM
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only .pdf files are allowed!'), false);
        }
    }
});

// The endpoint: POST /api/import
router.post('/', protect, upload.single('resumeFile'), importResume);

module.exports = router;