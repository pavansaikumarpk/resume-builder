const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const protect = async (req, res, next) => {
    let token;

    // 1. Look for the token in the Headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log("🛡️ Auth: Found token in Bearer Header");
    } 
    // 2. Fallback: Look for the token in cookies
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
        console.log("🛡️ Auth: Found token in Cookies");
    }

    // 3. Verify the token
    if (token) {
        try {
            if (!process.env.JWT_SECRET) {
                console.error("🚨 CRITICAL ERROR: JWT_SECRET is missing from your .env or Render Environment Variables!");
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log("❌ Auth: Token is valid, but the user no longer exists in the database.");
                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }

            console.log("✅ Auth: Handshake successful for user:", req.user.email);
            next(); // Move to the route
        } catch (error) {
            console.error("❌ Auth Middleware Error (Verification Failed):", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log("❌ Auth: No token was provided in the request headers or cookies.");
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };