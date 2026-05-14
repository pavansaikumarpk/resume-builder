// // const jwt = require('jsonwebtoken');
// // const User = require('../models/usermodel');
// // const protect = async (req, res, next) => {
// //     let token;

// //     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
// //         try {
// //             token = req.headers.authorization.split(' ')[1];
// //             const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //             req.user = await User.findById(decoded.id).select('-password');
// //             next();
// //         } catch (error) {
// //             console.error(error);
// //             res.status(401).json({ message: 'Not authorized, token failed' });
// //         }
// //     }

// //     if (!token) {
// //         res.status(401).json({ message: 'Not authorized, no token' });
// //     }
// // };

// // module.exports = { protect };






// // --- File: backend/middlewares/authmiddleware.js ---

// const jwt = require('jsonwebtoken');
// const User = require('../models/usermodel');

// const protect = async (req, res, next) => {
//     let token;

//     // Because we use cookie-parser in server.js, we can read the cookie directly
//     token = req.cookies.jwt;

//     if (token) {
//         try {
//             // Verify the token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             // Fetch the user and attach to the request object (excluding password)
//             req.user = await User.findById(decoded.id).select('-password');

//             if (!req.user) {
//                 return res.status(401).json({ message: 'Not authorized, user no longer exists' });
//             }

//             next(); // Move to the next middleware or controller
//         } catch (error) {
//             console.error("Auth Middleware Error:", error.message);
//             res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     } else {
//         res.status(401).json({ message: 'Not authorized, no token provided' });
//     }
// };

// module.exports = { protect };






const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

const protect = async (req, res, next) => {
    let token;

    // 1. Look for the token in the Headers (This is what your frontend sends)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // 2. Fallback: Look for the token in cookies (just in case)
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // 3. Verify the token
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user no longer exists' });
            }

            next(); // Handshake successful! Move to the route.
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };