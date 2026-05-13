// const express = require('express');
// const aiRouter = express.Router();
// const { analyzeMatch, optimizeBullet, generateTailoredResume } = require('../controllers/ai-controller');
// const { protect } = require('../middlewares/authmiddleware');

// // Analyze resume against JD
// aiRouter.post('/analyze-match', protect, analyzeMatch);

// // Rewrite a specific bullet point
// aiRouter.post('/optimize-bullet', protect, optimizeBullet);

// // Tailor entire resume (Bonus feature from Claude)
// aiRouter.post('/tailor-resume', protect, generateTailoredResume);

// module.exports = aiRouter;





const express = require('express');
const aiRouter = express.Router();
const { analyzeMatch, optimizeBullet, generateTailoredResume, generateCoverLetter } = require('../controllers/ai-controller');
const { protect } = require('../middlewares/authmiddleware');

aiRouter.post('/analyze-match', protect, analyzeMatch);
aiRouter.post('/optimize-bullet', protect, optimizeBullet);
aiRouter.post('/tailor-resume', protect, generateTailoredResume);

// 🚀 NEW: Cover Letter Route
aiRouter.post('/cover-letter', protect, generateCoverLetter);

module.exports = aiRouter;