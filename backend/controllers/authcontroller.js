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

        // Explicitly hash the password here to guarantee it is secure
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

        let isMatch = false;

        // 🚀 THE FIX: Detect if the database has a plain text password
        if (user.password && !user.password.startsWith('$2')) {
            console.warn(`Plaintext password detected for user: ${email}`);
            isMatch = (password === user.password);
            
            // Auto-upgrade the user's password to a hash for the future
            if (isMatch) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
                await user.save();
                console.log("Successfully upgraded user password to bcrypt hash.");
            }
        } else if (user.password) {
            // Standard secure login
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password.' });
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
        
        // 🚀 THE FIX: Catch missing Environment Variables instantly
        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error("SERVER ERROR: GOOGLE_CLIENT_ID is missing from Render environment.");
            return res.status(500).json({ message: 'Server configuration error. Contact support.' });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const { email, name } = ticket.getPayload();

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ username: name, email });
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
        // 🚀 THE FIX: Return the EXACT Google error to the Network tab
        console.error("Google Auth Error:", error.message);
        res.status(401).json({ message: 'Google Authentication failed.', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    authUser: loginUser, 
    googleAuth
};