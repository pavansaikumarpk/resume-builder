const express = require('express');
const authRouter = express.Router();
const { registerUser, loginUser } = require('../controllers/authcontroller');


authRouter.post('/signup', registerUser);

authRouter.post('/login', loginUser);

module.exports = authRouter;