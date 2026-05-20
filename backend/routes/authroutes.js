const express = require('express');
const authRouter = express.Router();
const { registerUser, loginUser, googleAuth } = require('../controllers/authcontroller');

// 100% YOUR ORIGINAL ROUTES
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

// 🚀 ADDED GOOGLE ROUTE
authRouter.post('/google', googleAuth);

module.exports = authRouter;