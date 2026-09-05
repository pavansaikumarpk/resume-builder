const express = require('express');
const { getAIUsage } = require('../controllers/usage-controller');
const { protect } = require('../middlewares/authmiddleware');

const usageRouter = express.Router();

usageRouter.get('/ai', protect, getAIUsage);

module.exports = usageRouter;
