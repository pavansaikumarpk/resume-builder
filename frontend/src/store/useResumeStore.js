import { create } from 'zustand';
import api from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

const resumeSaveOperations = new Map();
let activeResumeRequestSequence = 0;
let publicResumeRequestSequence = 0;

const flushResumeSave = async (resumeId, get, set) => {
  const operation = resumeSaveOperations.get(resumeId);
  if (!operation || operation.inFlight || !operation.dirty) return;

  operation.inFlight = true;
  operation.timer = null;
  const savingVersion = operation.version;
  const payload = operation.payload;
  operation.dirty = false;

  try {
    await api.put(`/resume/${resumeId}`, payload);
    if (operation.version !== savingVersion) {
      operation.dirty = true;
    } else if ((get().activeResume?._id || get().activeResume?.id) === resumeId) {
      set({ isSaving: false, saveError: null });
    }
  } catch (error) {
    console.error('Autosave failed:', error);
    if (operation.version !== savingVersion) {
      operation.dirty = true;
    } else if ((get().activeResume?._id || get().activeResume?.id) === resumeId) {
      set({
        isSaving: false,
        saveError: 'Could not save your latest changes. Check your connection and edit again to retry.'
      });
    }
  } finally {
    operation.inFlight = false;
    if (operation.dirty) {
      operation.timer = setTimeout(() => flushResumeSave(resumeId, get, set), 0);
    }
  }
};


export const useResumeStore = create((set, get) => ({
  resumes: [],
  activeResume: null,
  publicResume: null,
  isLoading: false,
  isSaving: false,
  saveError: null,
  loadError: null,
  isTailoring: false,
  isImporting: false,
  generatedBullets: null,
  documentStyle: { 
    fontFamily: 'Times-Roman', // Default to Classic Serif to match LaTeX
    fontSize: 10,             // Default to 10pt to match Overleaf density
    lineSpacing: 'tight', 
    margins: 'standard' 
  },
  generatedCoverLetter: null,
  isGeneratingLetter: false,

  updateDocumentStyle: (newStyle) => {
    set((state) => ({ 
      documentStyle: { ...state.documentStyle, ...newStyle },
      isSaving: true 
    }));
    get().triggerSave();
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

  importResumeFromPdf: async (file) => {
    set({ isImporting: true });
    try {
      const formData = new FormData();
      formData.append('resumeFile', file);
      const { data } = await api.post('/import', formData, {
        // Browser sets the multipart boundary for FormData automatically.
      });
      if (!data.resumeData) throw new Error('The PDF importer returned no resume data.');
      const imported = data.resumeData;
      const baseSections = [
        { key: 'personalDetails', title: 'Personal Details', isCustom: false },
        { key: 'summary', title: 'Professional Summary', isCustom: false },
        { key: 'experience', title: 'Experience', isCustom: false },
        { key: 'education', title: 'Education', isCustom: false },
        { key: 'projects', title: 'Projects', isCustom: false },
        { key: 'skills', title: 'Skills', isCustom: false },
        { key: 'certifications', title: 'Certifications', isCustom: false }
      ];
      const customDataPayload = {};
      const customSections = (Array.isArray(imported.customSections) ? imported.customSections : [])
        .map((section) => ({
          ...section,
          title: section.title || 'Imported Content',
          items: Array.isArray(section.items) ? section.items.map((item) => String(item)) : []
        }))
        .filter((section) => section.items.length > 0 || section.text);
      const dynamicSections = [...baseSections];

      // Keep the raw extracted text as private import metadata below.
      // Do not add it to the rendered section list: doing so duplicates the
      // structured resume content in the editor preview and exported resume.

      customSections.forEach((section) => {
        const key = 'custom_' + uuidv4().slice(0, 8);
        const isList = section.items.length > 0;
        dynamicSections.push({ key, title: section.title, isCustom: true, type: isList ? 'list' : 'text' });
        customDataPayload[key] = isList
          ? [{ title: '', date: '', bulletPoints: section.items, id: uuidv4() }]
          : (section.text || '');
      });
      const normalizedSkills = (Array.isArray(imported.skills) ? imported.skills : []).map((category) => ({
        id: category.id || uuidv4(),
        category: category.category || '',
        items: (Array.isArray(category.items) ? category.items : []).map((item) => ({
          id: typeof item === 'object' && item !== null && item.id ? item.id : uuidv4(),
          name: typeof item === 'string' ? item : (item?.name || '')
        })).filter((item) => item.name)
      }));
      const freshResumeData = {
        personalInfo: imported.personalInfo || {
          firstName: '', lastName: '', email: '', phone: '',
          linkedin: '', github: '', location: ''
        },
        summary: imported.summary || '',
        experience: (Array.isArray(imported.experience) ? imported.experience : []).map((item) => ({ ...item, id: item.id || uuidv4() })),
        education: (Array.isArray(imported.education) ? imported.education : []).map((item) => ({ ...item, id: item.id || uuidv4() })),
        projects: (Array.isArray(imported.projects) ? imported.projects : []).map((item) => ({ ...item, id: item.id || uuidv4() })),
        skills: normalizedSkills,
        certifications: (Array.isArray(imported.certifications) ? imported.certifications : []).map((item) => ({ ...item, id: item.id || uuidv4() })),
        ...customDataPayload,
        sections: dynamicSections,
        ...(imported.importedText ? { importedText: imported.importedText } : {}),
        ...(imported.importSource ? { importSource: imported.importSource } : {})
      };
      get().updateResumeData(freshResumeData);
      if (data.warning) alert(data.warning);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to import resume. Please check the file and try again.');
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
    const requestSequence = ++activeResumeRequestSequence;
    if (!id) {
      set({ activeResume: null, isLoading: false, loadError: 'A resume ID is required.' });
      return false;
    }

    set({ activeResume: null, isLoading: true, isSaving: false, saveError: null, loadError: null });
    try {
      const { data } = await api.get(`/resume/${id}`);
      if (requestSequence !== activeResumeRequestSequence) return false;

      const normalizedResume = {
        ...data,
        resumeData: data.resumeData && typeof data.resumeData === 'object' ? data.resumeData : {}
      };

      if (!Array.isArray(normalizedResume.resumeData.sections) || normalizedResume.resumeData.sections.length === 0) {
        normalizedResume.resumeData.sections = [
          { key: 'personalDetails', title: 'Personal Details', isCustom: false },
          { key: 'summary', title: 'Professional Summary', isCustom: false },
          { key: 'experience', title: 'Experience', isCustom: false },
          { key: 'education', title: 'Education', isCustom: false },
          { key: 'projects', title: 'Projects', isCustom: false },
          { key: 'skills', title: 'Skills', isCustom: false }
        ];
      }

      set({
        activeResume: normalizedResume,
        documentStyle: {
          fontFamily: 'Times-Roman',
          fontSize: 10,
          lineSpacing: 'tight',
          margins: 'standard',
          ...(data.documentStyle || {})
        },
        isLoading: false,
        loadError: null
      });
      return true;
    } catch (err) {
      if (requestSequence === activeResumeRequestSequence) {
        set({
          activeResume: null,
          isLoading: false,
          loadError: err.response?.data?.message || 'Could not load this resume. Please return to your dashboard and try again.'
        });
      }
      return false;
    }
  },

  fetchPublicResume: async (slug) => {
    const requestSequence = ++publicResumeRequestSequence;
    set({ publicResume: null, isLoading: true });
    try {
      const { data } = await api.get(`/resume/public/${encodeURIComponent(slug)}`);
      if (requestSequence === publicResumeRequestSequence) {
        set({ publicResume: data, isLoading: false });
      }
    } catch (err) {
      if (requestSequence === publicResumeRequestSequence) {
        set({ publicResume: null, isLoading: false });
      }
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
      set((state) => ({
        resumes: state.resumes.filter((resume) => (resume._id || resume.id) !== id),
        activeResume: (state.activeResume?._id || state.activeResume?.id) === id ? null : state.activeResume
      }));
    } catch (err) {
      alert("Failed to delete resume.");
    }
  },

  updateResumeData: (newData) => {
    if (!get().activeResume) return;
    set((state) => ({
      activeResume: { ...state.activeResume, resumeData: newData },
      isSaving: true,
      saveError: null
    }));
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
      const initialData = sectionDef.type === 'text' ? '' : [];
      return { 
        activeResume: { 
            ...state.activeResume, 
            resumeData: { 
                ...state.activeResume.resumeData, 
                sections,
                [sectionDef.key]: initialData 
            } 
        }, 
        isSaving: true 
      };
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
    const { activeResume, documentStyle } = get();
    const resumeId = activeResume?._id || activeResume?.id;
    if (!resumeId) return;

    let operation = resumeSaveOperations.get(resumeId);
    if (!operation) {
      operation = { timer: null, inFlight: false, dirty: false, version: 0, payload: null };
      resumeSaveOperations.set(resumeId, operation);
    }

    operation.version += 1;
    operation.dirty = true;
    operation.payload = { ...activeResume, documentStyle: { ...documentStyle } };
    if (operation.timer) clearTimeout(operation.timer);
    operation.timer = setTimeout(() => flushResumeSave(resumeId, get, set), 1500);
  },
  organizeSkillsAi: async (jdText) => {
    const { activeResume, updateResumeData } = get();
    const currentSkills = activeResume?.resumeData?.skills || [];
    if (!currentSkills.length) return;

    set({ isTailoring: true }); 
    try {
      const { data } = await api.post('/ai/organize-skills', { 
          skills: currentSkills, 
          jobDescription: jdText || "" 
      });
      
      const latestResume = get().activeResume;
      if (data.success && data.skills && latestResume?._id === activeResume?._id) {
        updateResumeData({ ...latestResume.resumeData, skills: data.skills });
      }
    } catch (err) {
      alert("Failed to organize skills. Check backend connection.");
    } finally {
      set({ isTailoring: false });
    }
  },

  generateBulletOptions: async (jdText, tone = 'impact') => {
    const { activeResume } = get();
    if (!activeResume?.resumeData) throw new Error('Load a resume before tailoring it.');
    set({ isTailoring: true, generatedBullets: null });
    try {
      const response = await api.post('/ai/tailor-resume', {
        resumeData: activeResume.resumeData,
        jobDescription: jdText,
        tone
      });
      const data = response.data;
      if (!data?.success || !data?.tailoredData) {
        throw new Error(data?.error || 'The AI returned an invalid tailoring response.');
      }

      if (!Array.isArray(data.bulletActions)) {
        throw new Error('The AI response did not include a complete bullet review.');
      }

      const tailoredItems = data.bulletActions.map((entry) => {
        if (!entry || !Array.isArray(entry.bullets) || !Number.isInteger(entry.itemIndex)) {
          throw new Error('The AI returned an incomplete section review. Run the Copilot again.');
        }
        if (entry.bullets.some((bullet) => !['keep', 'modify', 'remove'].includes(bullet?.action))) {
          throw new Error('The AI returned an unsupported action for a resume point. Run the Copilot again.');
        }
        return {
          sectionKey: entry.sectionTitle || entry.sectionKey,
          targetSectionKey: entry.sectionKey,
          itemTitle: entry.itemTitle || 'Resume entry',
          itemIndex: entry.itemIndex,
          bullets: entry.bullets,
          additions: Array.isArray(entry.additions) ? entry.additions : []
        };
      }).filter((entry) => entry.bullets.length || entry.additions.length);

      const reviewedBulletCount = tailoredItems.reduce((total, item) => total + item.bullets.length, 0);
      if (reviewedBulletCount !== Number(data.reviewedBulletCount || 0)) {
        throw new Error('The AI review was incomplete: not every existing point received a decision.');
      }
      const changedBulletCount = tailoredItems.reduce((total, item) =>
        total + item.bullets.filter((bullet) => bullet.action !== 'keep').length + item.additions.length, 0);

      set({
        generatedBullets: {
          success: true,
          tailoredItems,
          changedBulletCount,
          reviewedBulletCount,
          atsScore: null
        }
      });
      return true;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to analyze resume.';
      alert(message);
      return false;
    } finally {
      set({ isTailoring: false });
    }
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

  addSkillCategory: (categoryName) => {
    const { activeResume, updateResumeData } = get();
    const currentSkills = activeResume.resumeData.skills || [];
    updateResumeData({ ...activeResume.resumeData, skills: [...currentSkills, { id: uuidv4(), category: categoryName, items: [] }] });
  },

  addSkillToCategory: (categoryId, skillName, categoryName) => {
    const { activeResume, updateResumeData } = get();
    if (!activeResume || !skillName?.trim()) return;
    const currentSkills = activeResume.resumeData.skills || [];
    const normalizedName = skillName.trim();
    const categoryIndex = currentSkills.findIndex((category) =>
      (categoryId && category.id === categoryId) ||
      (categoryName && category.category?.trim().toLowerCase() === categoryName.trim().toLowerCase())
    );
    const updatedSkills = currentSkills.map((category) => ({
      ...category,
      items: Array.isArray(category.items) ? [...category.items] : []
    }));
    if (categoryIndex >= 0) {
      const target = updatedSkills[categoryIndex];
      const exists = target.items.some((item) =>
        (typeof item === 'string' ? item : item?.name)?.trim().toLowerCase() === normalizedName.toLowerCase()
      );
      if (!exists) target.items.push({ id: uuidv4(), name: normalizedName });
    } else {
      if (!categoryName?.trim()) return;
      updatedSkills.push({ id: uuidv4(), category: categoryName.trim(), items: [{ id: uuidv4(), name: normalizedName }] });
    }
    updateResumeData({ ...activeResume.resumeData, skills: updatedSkills });
  },

  removeSkillFromResume: (skillToRemove) => {
    const { activeResume, updateResumeData } = get();
    const currentSkills = activeResume.resumeData.skills || [];
    
    const updatedSkills = currentSkills.map(cat => ({
      ...cat,
      items: (cat.items || []).filter(skill => {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        return skillName?.toLowerCase() !== skillToRemove?.toLowerCase();
      })
    })).filter(cat => cat.items.length > 0 || cat.category);

    updateResumeData({ ...activeResume.resumeData, skills: updatedSkills });
  },

  removeSkillFromCategory: (categoryId, skillId, categoryName, skillName) => {
    const { activeResume, updateResumeData } = get();
    if (!activeResume) return;
    const currentSkills = activeResume.resumeData.skills || [];
    const updatedSkills = currentSkills
      .map((category) => {
        const matchesCategory =
          (categoryId && category.id === categoryId) ||
          (categoryName && category.category?.trim().toLowerCase() === categoryName.trim().toLowerCase());
        if (!matchesCategory) return category;
        return {
          ...category,
          items: (category.items || []).filter((item) => {
            if (typeof item === 'string') {
              return item.trim().toLowerCase() !== (skillName || '').trim().toLowerCase();
            }
            if (skillId && item?.id === skillId) return false;
            return (item?.name || '').trim().toLowerCase() !== (skillName || '').trim().toLowerCase();
          })
        };
      })
      .filter((category) => Array.isArray(category.items) && category.items.length > 0);
    updateResumeData({ ...activeResume.resumeData, skills: updatedSkills });
  },

  mergeAiSkills: (aiSkillsAddArray) => {
    const { activeResume, updateResumeData } = get();
    if (!aiSkillsAddArray || !Array.isArray(aiSkillsAddArray)) return;
    
    let currentSkills = [...(activeResume.resumeData.skills || [])];

    aiSkillsAddArray.forEach(aiCat => {
      const existingCatIndex = currentSkills.findIndex(
        c => c.category?.toLowerCase() === aiCat.category?.toLowerCase()
      );
      
      const newItemsWithIds = aiCat.items.map(name => ({ id: uuidv4(), name }));

      if (existingCatIndex >= 0) {
        currentSkills[existingCatIndex].items.push(...newItemsWithIds);
      } else {
        currentSkills.push({
          id: uuidv4(),
          category: aiCat.category,
          items: newItemsWithIds
        });
      }
    });

    updateResumeData({ ...activeResume.resumeData, skills: currentSkills });
  },

  applyTailoredBullet: (sectionKey, itemIndex, bulletIndex, expectedOriginal, replacement) => {
    const { activeResume, updateResumeData } = get();
    if (!activeResume?.resumeData || !sectionKey || !Number.isInteger(itemIndex) || !Number.isInteger(bulletIndex) || !String(replacement || '').trim()) return false;
    const currentItems = activeResume.resumeData[sectionKey];
    if (!Array.isArray(currentItems) || !currentItems[itemIndex]) return false;
    const section = (activeResume.resumeData.sections || []).find((entry) => entry.key === sectionKey);
    const expected = String(expectedOriginal || '').trim();

    if (section?.type === 'bullets') {
      const point = currentItems[itemIndex];
      const currentText = typeof point === 'string' ? point.trim() : String(point?.text ?? point?.description ?? '').trim();
      if (currentText !== expected) return false;
      const updatedItems = [...currentItems];
      if (point && typeof point === 'object' && !Array.isArray(point)) {
        const textField = ['text', 'description', 'content'].find((key) => typeof point[key] === 'string') || 'text';
        updatedItems[itemIndex] = { ...point, [textField]: replacement.trim() };
      } else {
        updatedItems[itemIndex] = replacement.trim();
      }
      updateResumeData({ ...activeResume.resumeData, [sectionKey]: updatedItems });
      return true;
    }

    const targetItem = currentItems[itemIndex];
    const field = targetItem.description !== undefined ? 'description' : (targetItem.bulletPoints !== undefined ? 'bulletPoints' : 'text');
    const currentValue = targetItem[field];
    const isArray = Array.isArray(currentValue);
    const bulletList = isArray ? [...currentValue] : String(currentValue || '').split('\n');
    const readText = (bullet) => typeof bullet === 'string' ? bullet.trim() : String(bullet?.text ?? bullet?.description ?? bullet?.content ?? bullet?.name ?? '').trim();
    let targetIndex = bulletIndex;
    if (readText(bulletList[targetIndex]) !== expected) {
      const matches = bulletList.map((bullet, index) => readText(bullet) === expected ? index : -1).filter((index) => index >= 0);
      if (matches.length !== 1) return false;
      targetIndex = matches[0];
    }
    const currentBullet = bulletList[targetIndex];
    if (currentBullet && typeof currentBullet === 'object' && !Array.isArray(currentBullet)) {
      const textField = ['text', 'description', 'content', 'name'].find((key) => typeof currentBullet[key] === 'string') || 'text';
      bulletList[targetIndex] = { ...currentBullet, [textField]: replacement.trim() };
    } else {
      bulletList[targetIndex] = replacement.trim();
    }
    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = { ...targetItem, [field]: isArray ? bulletList : bulletList.join('\n') };
    updateResumeData({ ...activeResume.resumeData, [sectionKey]: updatedItems });
    return true;
  },

  removeTailoredBullet: (sectionKey, itemIndex, bulletIndex, expectedOriginal) => {
    const { activeResume, updateResumeData } = get();
    if (!activeResume?.resumeData || !sectionKey || !Number.isInteger(itemIndex)) return false;
    const currentItems = activeResume.resumeData[sectionKey];
    if (!Array.isArray(currentItems) || !currentItems[itemIndex]) return false;

    const section = (activeResume.resumeData.sections || []).find((entry) => entry.key === sectionKey);
    if (section?.type === 'bullets') {
      const point = currentItems[itemIndex];
      const currentText = typeof point === 'string' ? point : String(point?.text || '');
      if (currentText.trim() !== String(expectedOriginal || '').trim()) return false;
      const updatedItems = [...currentItems];
      updatedItems.splice(itemIndex, 1);
      updateResumeData({ ...activeResume.resumeData, [sectionKey]: updatedItems });
      return true;
    }

    if (!Number.isInteger(bulletIndex)) return false;
    const targetItem = currentItems[itemIndex];
    const field = targetItem.description !== undefined ? 'description' : (targetItem.bulletPoints !== undefined ? 'bulletPoints' : 'text');
    const currentValue = targetItem[field];
    const isArray = Array.isArray(currentValue);
    const bulletList = isArray ? [...currentValue] : String(currentValue || '').split('\n');
    const readText = (bullet) => typeof bullet === 'string' ? bullet.trim() : String(bullet?.text ?? bullet?.description ?? bullet?.content ?? bullet?.name ?? '').trim();
    let targetIndex = bulletIndex;
    if (readText(bulletList[targetIndex]) !== String(expectedOriginal || '').trim()) {
      const matches = bulletList.map((bullet, index) => readText(bullet) === String(expectedOriginal || '').trim() ? index : -1).filter((index) => index >= 0);
      if (matches.length !== 1) return false;
      targetIndex = matches[0];
    }
    bulletList.splice(targetIndex, 1);
    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = { ...targetItem, [field]: isArray ? bulletList : bulletList.join('\n') };
    updateResumeData({ ...activeResume.resumeData, [sectionKey]: updatedItems });
    return true;
  },

  addTailoredBullet: (sectionKey, itemIndex, text) => {
    const { activeResume, updateResumeData } = get();
    if (!activeResume?.resumeData || !sectionKey || !text?.trim()) return false;
    const currentItems = activeResume.resumeData[sectionKey];
    if (!Array.isArray(currentItems)) return false;
    const section = (activeResume.resumeData.sections || []).find((entry) => entry.key === sectionKey);

    if (section?.type === 'bullets') {
      const exists = currentItems.some((point) => {
        const value = typeof point === 'string' ? point : point?.text;
        return String(value || '').trim().toLowerCase() === text.trim().toLowerCase();
      });
      if (exists) return false;
      const updatedItems = [...currentItems, { date: '', text: text.trim() }];
      updateResumeData({ ...activeResume.resumeData, [sectionKey]: updatedItems });
      return true;
    }

    const targetItem = currentItems[itemIndex];
    if (!targetItem) return false;
    const field = targetItem.description !== undefined ? 'description' : (targetItem.bulletPoints !== undefined ? 'bulletPoints' : 'text');
    const currentValue = targetItem[field];
    const isArray = Array.isArray(currentValue);
    const bulletList = isArray ? [...currentValue] : String(currentValue || '').split('\n').filter(Boolean);
    const readText = (bullet) => typeof bullet === 'string' ? bullet.trim() : String(bullet?.text ?? bullet?.description ?? bullet?.content ?? bullet?.name ?? '').trim();
    if (bulletList.some((bullet) => readText(bullet).toLowerCase() === text.trim().toLowerCase())) return false;
    bulletList.push(text.trim());
    const updatedItems = [...currentItems];
    updatedItems[itemIndex] = { ...targetItem, [field]: isArray ? bulletList : bulletList.join('\n') };
    updateResumeData({ ...activeResume.resumeData, [sectionKey]: updatedItems });
    return true;
  },

  appendBulletToResume: (sectionKey, targetIdentifier, newBullet) => {
    const { activeResume, updateResumeData } = get();
    
    const newData = JSON.parse(JSON.stringify(activeResume.resumeData)); 
    const targetSection = sectionKey || 'experience';
    
    if (newData[targetSection] && Array.isArray(newData[targetSection])) {
      let matched = false;

      newData[targetSection] = newData[targetSection].map(item => {
        const currentTitle = (item.company || item.name || item.title || item.institution || '').toLowerCase();
        const targetTitle = (targetIdentifier || '').toLowerCase();
        
        if (
          item.id === targetIdentifier || 
          currentTitle === targetTitle ||
          (currentTitle && targetTitle && (currentTitle.includes(targetTitle) || targetTitle.includes(currentTitle)))
        ) {
          matched = true;
          const bulletField = item.description !== undefined ? 'description' : 'bulletPoints';
          
          const currentDesc = Array.isArray(item[bulletField]) ? item[bulletField] : (item[bulletField] ? String(item[bulletField]).split('\n') : []);
          
          if (!currentDesc.includes(newBullet)) {
            item[bulletField] = [...currentDesc, newBullet];
          }
        }
        return item;
      });

      if (!matched && newData[targetSection].length > 0) {
        const bulletField = newData[targetSection][0].description !== undefined ? 'description' : 'bulletPoints';
        const currentDesc = Array.isArray(newData[targetSection][0][bulletField]) ? newData[targetSection][0][bulletField] : [];
        
        if (!currentDesc.includes(newBullet)) {
          newData[targetSection][0][bulletField] = [...currentDesc, newBullet];
        }
      }
    }
    
    updateResumeData(newData);
  }
}));