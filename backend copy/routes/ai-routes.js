const express = require('express');
const aiRouter = express.Router();
const { magicTailor, optimizeBullet } = require('../controllers/ai-controller');
const { protect } = require('../middlewares/authmiddleware');

aiRouter.post('/tailor-resume', protect, magicTailor);
aiRouter.post('/magic-tailor', protect, magicTailor);
aiRouter.post('/optimize-bullet', protect, optimizeBullet);

module.exports = aiRouter;