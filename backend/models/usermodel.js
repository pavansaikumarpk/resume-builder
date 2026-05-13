// --- File: models/userModel.js ---

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // 🚀 FIX: Removed required: true for Google users
}, { timestamps: true });

// Password hashing middleware
userSchema.pre('save', async function (next) {
    // 🚀 FIX: Check if password exists before hashing it
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false; // Google users don't have passwords
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;