const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            // FIXED: Added 'token' to the JSON response so the frontend can save it
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: token 
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (user && isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

            // FIXED: Added 'token' to the JSON response here too
            res.status(200).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};