const express = require('express');
const { registerUser, authUser, googleAuth } = require('../controllers/authcontroller'); // 🚀 Import it

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth); // 🚀 Add the new route

module.exports = router;