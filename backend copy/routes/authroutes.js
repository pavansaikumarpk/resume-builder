const express = require('express');
const authRouter = express.Router();
const { registerUser, loginUser, googleAuth } = require('../controllers/authcontroller');

// 🚀 FIXED: Changed from '/register' to '/signup' to match your frontend useAuthStore.js!
authRouter.post('/signup', registerUser);

authRouter.post('/login', loginUser);
authRouter.post('/google', googleAuth);

module.exports = authRouter;