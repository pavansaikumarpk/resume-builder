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
                secure: true,
                sameSite: 'none',
                maxAge: 30 * 24 * 60 * 60 * 1000,
            });

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

// @desc    Authenticate via Google
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
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

        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        res.cookie('jwt', jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: jwtToken,
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(401).json({ message: 'Google Authentication failed. Please try again.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    authUser: loginUser, 
    googleAuth
};