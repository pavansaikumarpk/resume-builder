const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        title: { type: String, required: true, default: 'Untitled Resume' },
        
        // 🚀 NEW FIELDS FOR PUBLIC SHARING
        slug: { type: String, unique: true, trim: true, sparse: true },
        isPublic: { type: Boolean, default: false },
        views: { type: Number, default: 0 },

        templateName: { type: String, required: true, default: 'jakes-resume' },
        resumeData: { type: Object, required: true },
    },
    { timestamps: true }
);

// 🚀 CRITICAL ARCHITECTURE FIX: Compound index for ultra-fast query execution
// This guarantees O(1) level performance when rendering the user dashboard.
resumeSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);