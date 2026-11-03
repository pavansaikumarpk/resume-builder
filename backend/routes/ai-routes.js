const express = require('express');
const aiRouter = express.Router();
const { magicTailor, optimizeBullet, organizeSkills } = require('../controllers/ai-controller');
const { protect } = require('../middlewares/authmiddleware');
const { aiUsageMiddleware } = require('../middlewares/aiUsageMiddleware');

aiRouter.post('/tailor-resume', protect, aiUsageMiddleware, magicTailor);
aiRouter.post('/magic-tailor', protect, aiUsageMiddleware, magicTailor);
aiRouter.post('/optimize-bullet', protect, aiUsageMiddleware, optimizeBullet);
aiRouter.post('/organize-skills', protect, aiUsageMiddleware, organizeSkills);

module.exports = aiRouter;
