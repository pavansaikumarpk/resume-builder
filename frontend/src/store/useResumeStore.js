import { create } from 'zustand';
import api from '../utils/api';

export const useResumeStore = create((set, get) => ({
  resumes: [],
  activeResume: null,
  publicResume: null,
  isLoading: false,
  isSaving: false,
  isTailoring: false,
  isImporting: false,
  generatedBullets: null,
  documentStyle: { fontFamily: 'Helvetica', fontSize: 'standard' },
  generatedCoverLetter: null,
  isGeneratingLetter: false,

  updateDocumentStyle: (newStyle) => {
    set((state) => ({ documentStyle: { ...state.documentStyle, ...newStyle } }));
  },

  updateTemplateName: (newTemplateId) => {
    set((state) => ({
      activeResume: {
        ...state.activeResume,
        templateName: newTemplateId
      },
      isSaving: true
    }));
    get().triggerSave();
  },

  // 🚀 CRITICAL FIX: The Data Merge Logic
  importResumeFromPdf: async (file) => {
    set({ isImporting: true });
    try {
      const formData = new FormData();
      formData.append('resumeFile', file);

      const { data } = await api.post('/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.resumeData) {
        const { activeResume, updateResumeData } = get();
        
        // 1. Grab the existing UI blueprint so we don't accidentally erase the accordions
        const existingSections = activeResume?.resumeData?.sections || [
          { key: 'personalDetails', title: 'Personal Details', isCustom: false },
          { key: 'summary', title: 'Professional Summary', isCustom: false },
          { key: 'experience', title: 'Experience', isCustom: false },
          { key: 'education', title: 'Education', isCustom: false },
          { key: 'projects', title: 'Projects', isCustom: false },
          { key: 'skills', title: 'Skills', isCustom: false }
        ];

        // 2. Safely merge the AI data into the resume without destroying the sections
        const mergedData = {
            ...activeResume?.resumeData, // Keep existing background data
            ...data.resumeData,          // Inject the newly extracted AI data
            sections: existingSections   // Force the UI boxes to stay visible
        };

        // 3. Push it to the UI and save to database
        updateResumeData(mergedData);
      }
    } catch (err) {
      console.error("Import failed:", err);
      alert(err.response?.data?.message || "Failed to import resume. Please check the file and try again.");
    } finally {
      set({ isImporting: false });
    }
  },

  fetchResumes: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/resume');
      set({ resumes: data, isLoading: false });
    } catch (err) { set({ isLoading: false }); }
  },

  fetchActiveResume: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/resume/${id}`);
      
      if (!data.resumeData) {
        data.resumeData = {};
      }

      if (!data.resumeData.sections || data.resumeData.sections.length === 0) {
        data.resumeData.sections = [
          { key: 'personalDetails', title: 'Personal Details', isCustom: false },
          { key: 'summary', title: 'Professional Summary', isCustom: false },
          { key: 'experience', title: 'Experience', isCustom: false },
          { key: 'education', title: 'Education', isCustom: false },
          { key: 'projects', title: 'Projects', isCustom: false },
          { key: 'skills', title: 'Skills', isCustom: false }
        ];
      }
      set({ activeResume: data, isLoading: false });
      return true;
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
      return false;
    }
  },

  fetchPublicResume: async (slug) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/resume/public/${slug}`);
      set({ publicResume: data, isLoading: false });
    } catch (err) {
      set({ publicResume: null, isLoading: false });
    }
  },

  toggleResumeVisibility: async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await api.put(`/resume/${id}`, { isPublic: newStatus });
      set((state) => ({
        resumes: state.resumes.map(r => r._id === id ? { ...r, isPublic: newStatus } : r)
      }));
      const { activeResume } = get();
      if (activeResume && activeResume._id === id) {
        set({ activeResume: { ...activeResume, isPublic: newStatus } });
      }
      return newStatus;
    } catch (err) {
      return currentStatus;
    }
  },

  deleteResume: async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.delete(`/resume/${id}`);
      set((state) => ({ resumes: state.resumes.filter(r => r._id !== id) }));
    } catch (err) {
      alert("Failed to delete resume.");
    }
  },

  updateResumeData: (newData) => {
    set((state) => ({ activeResume: { ...state.activeResume, resumeData: newData }, isSaving: true }));
    get().triggerSave();
  },

  renameSection: (key, newTitle) => {
    set((state) => {
      const sections = state.activeResume.resumeData.sections.map(sec => sec.key === key ? { ...sec, title: newTitle } : sec);
      return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
    });
    get().triggerSave();
  },

  moveSectionUp: (index) => {
    if (index === 0) return;
    set((state) => {
      const sections = [...state.activeResume.resumeData.sections];
      const temp = sections[index - 1]; sections[index - 1] = sections[index]; sections[index] = temp;
      return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
    });
    get().triggerSave();
  },

  moveSectionDown: (index) => {
    set((state) => {
      const sections = [...state.activeResume.resumeData.sections];
      if (index === sections.length - 1) return state;
      const temp = sections[index + 1]; sections[index + 1] = sections[index]; sections[index] = temp;
      return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
    });
    get().triggerSave();
  },

  addCustomSection: (sectionDef) => {
    set((state) => {
      const sections = [...state.activeResume.resumeData.sections, sectionDef];
      return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
    });
    get().triggerSave();
  },

  removeSection: (key) => {
    set((state) => {
      const sections = state.activeResume.resumeData.sections.filter(s => s.key !== key);
      return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
    });
    get().triggerSave();
  },

  triggerSave: () => {
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(async () => {
      const { activeResume } = get();
      if(activeResume) {
        try {
          await api.put(`/resume/${activeResume._id}`, activeResume);
          set({ isSaving: false });
        } catch (error) {
          set({ isSaving: false });
        }
      }
    }, 1500);
  },

  generateBulletOptions: async (jdText, tone = 'impact') => {
    const { activeResume } = get();
    set({ isTailoring: true });
    try {
      const { data } = await api.post('/ai/tailor-resume', { resumeData: activeResume.resumeData, jobDescription: jdText, tone: tone });
      set({ generatedBullets: data });
    } catch (err) {
       alert("Failed to generate options. Ensure backend is running.");
    }
    finally { set({ isTailoring: false }); }
  },

  generateCoverLetter: async (jdText) => {
    const { activeResume } = get();
    set({ isGeneratingLetter: true });
    try {
      const { data } = await api.post('/ai/cover-letter', { resumeData: activeResume.resumeData, jobDescription: jdText });
      set({ generatedCoverLetter: data.coverLetter });
    } catch (err) {
       alert("Failed to generate cover letter.");
    }
    finally { set({ isGeneratingLetter: false }); }
  },

  clearGeneratedBullets: () => set({ generatedBullets: null }),
  clearCoverLetter: () => set({ generatedCoverLetter: null }),

  addSkillToResume: (newSkill) => {
    const { activeResume, updateResumeData } = get();
    const currentSkills = activeResume.resumeData.skills || [];
    if (!currentSkills.includes(newSkill)) {
      updateResumeData({ ...activeResume.resumeData, skills: [...currentSkills, newSkill] });
    }
  },

  removeSkillFromResume: (skillToRemove) => {
    const { activeResume, updateResumeData } = get();
    const currentSkills = activeResume.resumeData.skills || [];
    updateResumeData({ ...activeResume.resumeData, skills: currentSkills.filter(skill => skill.toLowerCase() !== skillToRemove.toLowerCase()) });
  },

  appendBulletToResume: (sectionKey, targetName, newBullet) => {
    const { activeResume, updateResumeData } = get();
    const newData = { ...activeResume.resumeData };
    const targetSection = sectionKey || 'experience';
    if (newData[targetSection] && Array.isArray(newData[targetSection])) {
      newData[targetSection] = newData[targetSection].map(item => {
        const currentTitle = item.company || item.name || item.title || item.institution;
        if (currentTitle?.toLowerCase() === targetName?.toLowerCase()) {
          const bulletField = item.description !== undefined ? 'description' : 'bulletPoints';
          const currentDesc = Array.isArray(item[bulletField]) ? item[bulletField] : (item[bulletField] ? item[bulletField].split('\n') : []);
          return { ...item, [bulletField]: [...currentDesc, newBullet] };
        }
        return item;
      });
    }
    updateResumeData(newData);
  }
}));