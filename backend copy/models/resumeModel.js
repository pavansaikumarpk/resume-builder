// const mongoose = require('mongoose');

// const resumeSchema = mongoose.Schema(
//     {
//         user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
//         title: { type: String, required: true, default: 'Untitled Resume' }, 
//         slug: { type: String, unique: true, trim: true, sparse: true },
//         isPublic: { type: Boolean, default: false },
//         templateName: { type: String, required: true, default: 'Professional' },
//         resumeData: { type: Object, required: true },
//         views: { type: Number, default: 0 },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model('Resume', resumeSchema);




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

module.exports = mongoose.model('Resume', resumeSchema);