const User = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const registerUser = async (req, res) => {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    if (username.length < 2 || username.length > 80) {
        return res.status(400).json({ message: 'Name must be between 2 and 80 characters.' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists. Please log in.' });
        }

        const user = await User.create({
            username,
            email,
            password,
            authProvider: 'local',
        });

        return res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Server error during registration.' });
    }
};

const loginUser = async (req, res) => {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        }

        return res.status(401).json({ message: 'Invalid email or password.' });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Server error during login.' });
    }
};

const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'Google credential is missing.' });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            console.error('GOOGLE_CLIENT_ID is missing from the server environment.');
            return res.status(500).json({ message: 'Google authentication is not configured on the server.' });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const email = payload?.email?.trim().toLowerCase();
        const name = payload?.name?.trim() || email?.split('@')[0] || 'Google User';

        if (!email || payload?.email_verified !== true) {
            return res.status(401).json({ message: 'Google account email could not be verified.' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            // Google users do not use a local password. Generate an unusable random value
            // so the password field can still satisfy the database model.
            const randomPassword = `${crypto.randomBytes(32).toString('hex')}A1!`;
            user = await User.create({
                username: name,
                email,
                password: randomPassword,
                authProvider: 'google',
            });
        }

        return res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('Google Authentication Error:', error);
        return res.status(401).json({ message: 'Google authentication failed.' });
    }
};

module.exports = { registerUser, loginUser, googleAuth };
