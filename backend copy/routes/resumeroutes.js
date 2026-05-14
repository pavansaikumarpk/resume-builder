// // const express = require('express');
// // const router = express.Router();
// // const {
// //     getMyResumes,
// //     getResumeById,
// //     createResume,
// //     updateResume,
// //     deleteResume,
// //     generatePdfPreview,
// // } = require('../controllers/resumecontroller');
// // const { protect } = require('../middlewares/authmiddleware');

// // router.route('/').get(protect, getMyResumes).post(protect, createResume);

// // router
// //     .route('/:id')
// //     .get(protect, getResumeById)
// //     .put(protect, updateResume)
// //     .delete(protect, deleteResume);



// // router.post('/preview/:id', protect, generatePdfPreview);

// // module.exports = router;




// const express = require('express');
// const {
//     getMyResumes,
//     getResumeById,
//     getResumeBySlug, 
//     createResume,
//     updateResume,
//     deleteResume,
//     generatePdfPreview,
// } = require('../controllers/resumecontroller');
// const { protect } = require('../middlewares/authmiddleware'); //

// const router = express.Router();


// router.get('/public/:slug', getResumeBySlug);


// router.route('/')
//     .get(protect, getMyResumes)
//     .post(protect, createResume);

// router.route('/:id')
//     .get(protect, getResumeById)
//     .put(protect, updateResume)
//     .delete(protect, deleteResume);


// router.post('/preview/:id', protect, generatePdfPreview);

// module.exports = router;










const express = require('express');
const {
    getMyResumes,
    getResumeById,
    getResumeBySlug, 
    createResume,
    updateResume,
    deleteResume,
    generatePdfPreview,
} = require('../controllers/resumecontroller');
const { protect } = require('../middlewares/authmiddleware');

const router = express.Router(); // CRITICAL FIX: This must not be commented out!

// 🚀 NEW: Public route (No 'protect' middleware)
// This MUST come before the '/:id' route so Express doesn't confuse the slug for an ID.
router.get('/public/:slug', getResumeBySlug);

router.route('/')
    .get(protect, getMyResumes)
    .post(protect, createResume);

router.route('/:id')
    .get(protect, getResumeById)
    .put(protect, updateResume)
    .delete(protect, deleteResume);

router.post('/preview/:id', protect, generatePdfPreview);

module.exports = router;



