


const Resume = require('../models/resumeModel.js');
const crypto = require('crypto');

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

const getMyResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).select('-resumeData');
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching resumes.' });
    }
};

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

const createResume = async (req, res) => {
    try {
        const { templateName, resumeData, title } = req.body;
        const safeResumeData = resumeData || {};
        
        const name = safeResumeData.personalDetails?.name || safeResumeData.personalInfo?.firstName || 'resume';
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const uniqueID = crypto.randomBytes(3).toString('hex');
        const slug = `${baseSlug}-${uniqueID}`;

        const resume = new Resume({
            user: req.user._id,
            title: title || 'Untitled Resume',
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

const updateResume = async (req, res) => {
    try {
        const { resumeData, templateName, isPublic, slug } = req.body;
        const resume = await Resume.findById(req.params.id);

        if (resume && resume.user.toString() === req.user._id.toString()) {
            
            // 🚀 CRITICAL ARCHITECTURE FIX: Deep nested save protection
            if (resumeData) {
                resume.resumeData = resumeData;
                resume.markModified('resumeData'); // <--- Forces MongoDB to save nested array changes
            }

            if (templateName) resume.templateName = templateName;
            if (isPublic !== undefined) resume.isPublic = isPublic;
            
            if (slug && slug !== resume.slug) {
                resume.slug = slug.toLowerCase().replace(/[^a-z0-9]/g, '-');
            }

            const updatedResume = await resume.save();
            res.status(200).json(updatedResume);
        } else {
            res.status(404).json({ message: 'Resume not found' });
        }
    } catch (error) {
        console.error("Update Resume Error:", error);
        res.status(400).json({ message: 'Error updating resume.' });
    }
};

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

module.exports = {
    getMyResumes,
    getResumeById,
    getResumeBySlug,
    createResume,
    updateResume,
    deleteResume,
};