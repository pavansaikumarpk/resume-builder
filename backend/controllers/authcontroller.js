const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

// @desc    Register new user
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

        // 🚀 MY MISTAKE CORRECTED: Passing the raw password. 
        // Your usermodel.js pre('save') hook will hash this securely.
        const user = await User.create({
            username,
            email,
            password: password, 
        });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '30d',
            });

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true, 
                sameSite: 'none', 
                maxAge: 30 * 24 * 60 * 60 * 1000, 
            });

            return res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: token 
            });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate a user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'User not found. Please sign up.' });
        }

        // Standard secure login
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Authenticate via Google
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error("SERVER ERROR: GOOGLE_CLIENT_ID is missing from Render environment.");
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        
        // 🚀 WE LOG THIS TO SEE IF VERIFICATION FAILS
        console.log("Attempting to verify Google Token for Audience:", process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const { email, name } = ticket.getPayload();
        console.log(`Google Token verified successfully for: ${email}`);

        let user = await User.findOne({ email });
        if (!user) {
            // For Google Auth, we create a random strong password since they don't use one
            const randomPassword = Math.random().toString(36).slice(-10) + "A1!";
            user = await User.create({ username: name, email, password: randomPassword });
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('jwt', jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: jwtToken,
        });
    } catch (error) {
        // 🚀 THIS WILL TELL US EXACTLY WHY GOOGLE FAILED IN THE RENDER LOGS
        console.error("GOOGLE AUTH FATAL ERROR:", error.message);
        res.status(401).json({ message: 'Google Authentication failed.', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    authUser: loginUser, 
    googleAuth
};