// const Resume = require('../models/resumeModel.js'); //
// const { generatePdf } = require('../utils/pdfTemplate.js'); //
// const crypto = require('crypto'); // Built-in Node.js module for security

// // --- 1. GROWTH FEATURE: Get Public Resume ---
// // This allows sharing links like resumn.com/pavan-sai-a1b2c3
// const getResumeBySlug = async (req, res) => {
//     try {
//         const resume = await Resume.findOne({ slug: req.params.slug, isPublic: true });
        
//         if (resume) {
//             // "Retention Mechanic": Increment view count so the user sees engagement
//             resume.views = (resume.views || 0) + 1;
//             await resume.save();
//             res.status(200).json(resume);
//         } else {
//             res.status(404).json({ message: 'Resume not found or is private' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching public resume.' });
//     }
// }; 

// // --- 2. PERFORMANCE: Get My Resumes ---
// const getMyResumes = async (req, res) => {
//     try {
//         // WORLD-CLASS TIP: Only fetch what you need. 
//         // We exclude 'resumeData' because it's heavy and not needed for a list view.
//         const resumes = await Resume.find({ user: req.user._id }).select('-resumeData');
//         res.status(200).json(resumes);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error while fetching resumes.' });
//     }
// }; 

// // --- 3. SECURITY: Get Resume By ID ---
// const getResumeById = async (req, res) => {
//     try {
//         const resume = await Resume.findById(req.params.id);
//         // Strict ownership check: Only the creator can see the private data
//         if (resume && resume.user.toString() === req.user._id.toString()) {
//             res.status(200).json(resume);
//         } else {
//             res.status(404).json({ message: 'Resume not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Server error while fetching resume.' });
//     }
// };

// // --- 4. UX: Create Resume ---
// const createResume = async (req, res) => {
//     try {
//         const { templateName, resumeData } = req.body;
        
//         // AUTO-SLUG GENERATION: Makes the URL pretty and unique
//         const name = resumeData.personalDetails?.name || 'resume';
//         const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
//         const uniqueID = crypto.randomBytes(3).toString('hex'); // Prevents URL collisions
//         const slug = `${baseSlug}-${uniqueID}`;

//         const resume = new Resume({
//             user: req.user._id, //
//             templateName,
//             resumeData,
//             slug,
//         });
        
//         const createdResume = await resume.save();
//         res.status(201).json(createdResume);
//     } catch (error) {
//         res.status(400).json({ message: 'Error creating resume.' });
//     }
// };

// // --- 5. SCALABILITY: Update Resume ---
// const updateResume = async (req, res) => {
//     try {
//         const { resumeData, templateName, isPublic, slug } = req.body;
//         const resume = await Resume.findById(req.params.id);

//         if (resume && resume.user.toString() === req.user._id.toString()) {
//             resume.resumeData = resumeData || resume.resumeData;
//             resume.templateName = templateName || resume.templateName;
//             resume.isPublic = isPublic !== undefined ? isPublic : resume.isPublic;
            
//             // Allow users to choose their own "Brand" URL
//             if (slug && slug !== resume.slug) {
//                 resume.slug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
//             }

//             const updatedResume = await resume.save();
//             res.status(200).json(updatedResume);
//         } else {
//             res.status(404).json({ message: 'Resume not found' });
//         }
//     } catch (error) {
//         res.status(400).json({ message: 'Error updating resume.' });
//     }
// };

// // --- 6. CLEANUP: Delete Resume ---
// const deleteResume = async (req, res) => {
//     try {
//         const resume = await Resume.findById(req.params.id);
//         // Ownership check is critical to prevent malicious deletion
//         if (resume && resume.user.toString() === req.user._id.toString()) {
//             await resume.deleteOne();
//             res.status(200).json({ message: 'Resume removed' });
//         } else {
//             res.status(404).json({ message: 'Resume not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: 'Server error while deleting resume.' });
//     }
// };

// // --- 7. BOTTLENECK (Temporary): Generate PDF Preview ---
// const generatePdfPreview = async (req, res) => {
//     try {
//         const { resumeData, templateName } = req.body;
//         if (!resumeData) {
//             return res.status(400).json({ message: 'No resume data provided.' });
//         }
//         const stream = await generatePdf(resumeData, templateName);
//         res.setHeader('Content-Type', 'application/pdf');
//         stream.pipe(res);
//     } catch (error) {
//         res.status(500).json({ message: 'Error generating PDF preview.' });
//     }
// };

// module.exports = {
//     getMyResumes,
//     getResumeById,
//     getResumeBySlug,
//     createResume,
//     updateResume,
//     deleteResume,
//     generatePdfPreview,
// };









const Resume = require('../models/resumeModel.js');
const { generatePdf } = require('../utils/pdfTemplate.js');
const crypto = require('crypto'); // Built-in Node.js module for security

// --- 1. GROWTH FEATURE: Get Public Resume ---
const getResumeBySlug = async (req, res) => {
    try {
        const resume = await Resume.findOne({ slug: req.params.slug, isPublic: true });
        
        if (resume) {
            resume.views = (resume.views || 0) + 1;
            await resume.save();
            res.status(200).json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found or is private' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public resume.' });
    }
};

// --- 2. PERFORMANCE: Get My Resumes ---
const getMyResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).select('-resumeData');
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching resumes.' });
    }
};

// --- 3. SECURITY: Get Resume By ID ---
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume && resume.user.toString() === req.user._id.toString()) {
            res.status(200).json(resume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching resume.' });
    }
};

// --- 4. UX: Create Resume ---
const createResume = async (req, res) => {
    try {
        const { templateName, resumeData, title } = req.body;
        
        // 🚀 CRITICAL FIX: Ensure resumeData exists to prevent MongoDB crashes
        const safeResumeData = resumeData || {};
        
        const name = safeResumeData.personalDetails?.name || safeResumeData.personalInfo?.firstName || 'resume';
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const uniqueID = crypto.randomBytes(3).toString('hex');
        const slug = `${baseSlug}-${uniqueID}`;

        const resume = new Resume({
            user: req.user._id,
            title: title || 'Untitled Resume', // 🚀 FIX: Actually save the title
            templateName: templateName || 'jakes-resume',
            resumeData: safeResumeData,
            slug, 
            isPublic: false 
        });
        
        const createdResume = await resume.save();
        res.status(201).json(createdResume);
    } catch (error) {
        console.error("Create Resume Error:", error);
        res.status(400).json({ message: 'Error creating resume.', error: error.message });
    }
};

// --- 5. SCALABILITY: Update Resume ---
const updateResume = async (req, res) => {
    try {
        const { resumeData, templateName, isPublic, slug } = req.body;
        const resume = await Resume.findById(req.params.id);

        if (resume && resume.user.toString() === req.user._id.toString()) {
            resume.resumeData = resumeData || resume.resumeData;
            resume.templateName = templateName || resume.templateName;
            resume.isPublic = isPublic !== undefined ? isPublic : resume.isPublic;
            
            if (slug && slug !== resume.slug) {
                resume.slug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
            }

            const updatedResume = await resume.save();
            res.status(200).json(updatedResume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error updating resume.' });
    }
};

// --- 6. CLEANUP: Delete Resume ---
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (resume && resume.user.toString() === req.user._id.toString()) {
            await resume.deleteOne();
            res.status(200).json({ message: 'Resume removed' });
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting resume.' });
    }
};

// --- 7. BOTTLENECK (Temporary): Generate PDF Preview ---
const generatePdfPreview = async (req, res) => {
    try {
        const { resumeData, templateName } = req.body;
        if (!resumeData) {
            return res.status(400).json({ message: 'No resume data provided.' });
        }
        const stream = await generatePdf(resumeData, templateName);
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF preview.' });
    }
};

module.exports = {
    getMyResumes,
    getResumeById,
    getResumeBySlug,
    createResume,
    updateResume,
    deleteResume,
    generatePdfPreview,
};