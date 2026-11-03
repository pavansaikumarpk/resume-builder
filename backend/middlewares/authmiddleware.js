const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const protect = async (req, res, next) => {
    let token;

    // 1. Look for the token in the Headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

    } 
    // 2. Fallback: Look for the token in cookies
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;

    }

    // 3. Verify the token
    if (token) {
        try {
            if (!process.env.JWT_SECRET) {

            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {

                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }

            next(); // Move to the route
        } catch (error) {

            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {

        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };