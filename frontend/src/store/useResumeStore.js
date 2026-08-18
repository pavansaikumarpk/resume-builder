





// import { create } from 'zustand';
// import api from '../utils/api';
// import { v4 as uuidv4 } from 'uuid';

// export const useResumeStore = create((set, get) => ({
//   resumes: [],
//   activeResume: null,
//   publicResume: null,
//   isLoading: false,
//   isSaving: false,
//   isTailoring: false,
//   isImporting: false,
//   generatedBullets: null,
//   documentStyle: { 
//     fontFamily: 'Helvetica', 
//     fontSize: 11,
//     lineSpacing: 'standard', 
//     margins: 'standard' 
//   },
//   generatedCoverLetter: null,
//   isGeneratingLetter: false,

//   updateDocumentStyle: (newStyle) => {
//     set((state) => ({ 
//       documentStyle: { ...state.documentStyle, ...newStyle },
//       isSaving: true 
//     }));
//     get().triggerSave();
//   },

//   updateTemplateName: (newTemplateId) => {
//     set((state) => ({
//       activeResume: {
//         ...state.activeResume,
//         templateName: newTemplateId
//       },
//       isSaving: true
//     }));
//     get().triggerSave();
//   },

//   importResumeFromPdf: async (file) => {
//     set({ isImporting: true });
//     try {
//       const formData = new FormData();
//       formData.append('resumeFile', file);
//       const { data } = await api.post('/import', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       if (data.resumeData) {
//         const { activeResume, updateResumeData } = get();
//         const existingSections = activeResume?.resumeData?.sections || [
//           { key: 'personalDetails', title: 'Personal Details', isCustom: false },
//           { key: 'summary', title: 'Professional Summary', isCustom: false },
//           { key: 'experience', title: 'Experience', isCustom: false },
//           { key: 'education', title: 'Education', isCustom: false },
//           { key: 'projects', title: 'Projects', isCustom: false },
//           { key: 'skills', title: 'Skills', isCustom: false }
//         ];

//         let dynamicSections = [...existingSections];
//         let customDataPayload = {};

//         if (data.resumeData.customSections && Array.isArray(data.resumeData.customSections)) {
//             data.resumeData.customSections.forEach((sec) => {
//                 const newKey = `custom_${uuidv4().substring(0, 8)}`;
//                 const isList = sec.items && Array.isArray(sec.items) && sec.items.length > 0;
                
//                 dynamicSections.push({
//                     key: newKey,
//                     title: sec.title || 'Custom Section',
//                     isCustom: true,
//                     type: isList ? 'list' : 'text'
//                 });

//                 if (isList) {
//                     customDataPayload[newKey] = [{ title: "", date: "", bulletPoints: sec.items, id: uuidv4() }];
//                 } else {
//                     customDataPayload[newKey] = sec.text || "";
//                 }
//             });
//         }

//         const finalData = { ...data.resumeData };
//         delete finalData.customSections;

//         const mergedData = {
//             ...activeResume?.resumeData, 
//             ...finalData,          
//             ...customDataPayload,  
//             sections: dynamicSections 
//         };

//         updateResumeData(mergedData);
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to import resume. Please check the file and try again.");
//     } finally {
//       set({ isImporting: false });
//     }
//   },

//   fetchResumes: async () => {
//     set({ isLoading: true });
//     try {
//       const { data } = await api.get('/resume');
//       set({ resumes: data, isLoading: false });
//     } catch (err) { set({ isLoading: false }); }
//   },

//   fetchActiveResume: async (id) => {
//     set({ isLoading: true });
//     try {
//       const { data } = await api.get(`/resume/${id}`);
      
//       if (!data.resumeData) {
//         data.resumeData = {};
//       }

//       if (!data.resumeData.sections || data.resumeData.sections.length === 0) {
//         data.resumeData.sections = [
//           { key: 'personalDetails', title: 'Personal Details', isCustom: false },
//           { key: 'summary', title: 'Professional Summary', isCustom: false },
//           { key: 'experience', title: 'Experience', isCustom: false },
//           { key: 'education', title: 'Education', isCustom: false },
//           { key: 'projects', title: 'Projects', isCustom: false },
//           { key: 'skills', title: 'Skills', isCustom: false }
//         ];
//       }
//       set({ activeResume: data, isLoading: false });
      
//       if (data.documentStyle) {
//         set({ documentStyle: { ...get().documentStyle, ...data.documentStyle }});
//       }

//       return true;
//     } catch (err) {
//       set({ isLoading: false });
//       return false;
//     }
//   },

//   fetchPublicResume: async (slug) => {
//     set({ isLoading: true });
//     try {
//       const { data } = await api.get(`/resume/public/${slug}`);
//       set({ publicResume: data, isLoading: false });
//     } catch (err) {
//       set({ publicResume: null, isLoading: false });
//     }
//   },

//   toggleResumeVisibility: async (id, currentStatus) => {
//     try {
//       const newStatus = !currentStatus;
//       await api.put(`/resume/${id}`, { isPublic: newStatus });
//       set((state) => ({
//         resumes: state.resumes.map(r => r._id === id ? { ...r, isPublic: newStatus } : r)
//       }));
//       const { activeResume } = get();
//       if (activeResume && activeResume._id === id) {
//         set({ activeResume: { ...activeResume, isPublic: newStatus } });
//       }
//       return newStatus;
//     } catch (err) {
//       return currentStatus;
//     }
//   },

//   deleteResume: async (id) => {
//     if (!window.confirm("Are you sure you want to delete this resume?")) return;
//     try {
//       await api.delete(`/resume/${id}`);
//       set((state) => ({ resumes: state.resumes.filter(r => r._id !== id) }));
//     } catch (err) {
//       alert("Failed to delete resume.");
//     }
//   },

//   updateResumeData: (newData) => {
//     set((state) => ({ activeResume: { ...state.activeResume, resumeData: newData }, isSaving: true }));
//     get().triggerSave();
//   },

//   renameSection: (key, newTitle) => {
//     set((state) => {
//       const sections = state.activeResume.resumeData.sections.map(sec => sec.key === key ? { ...sec, title: newTitle } : sec);
//       return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
//     });
//     get().triggerSave();
//   },

//   moveSectionUp: (index) => {
//     if (index === 0) return;
//     set((state) => {
//       const sections = [...state.activeResume.resumeData.sections];
//       const temp = sections[index - 1]; sections[index - 1] = sections[index]; sections[index] = temp;
//       return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
//     });
//     get().triggerSave();
//   },

//   moveSectionDown: (index) => {
//     set((state) => {
//       const sections = [...state.activeResume.resumeData.sections];
//       if (index === sections.length - 1) return state;
//       const temp = sections[index + 1]; sections[index + 1] = sections[index]; sections[index] = temp;
//       return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
//     });
//     get().triggerSave();
//   },

//   addCustomSection: (sectionDef) => {
//     set((state) => {
//       const sections = [...state.activeResume.resumeData.sections, sectionDef];
//       const initialData = sectionDef.type === 'list' ? [] : "";
//       return { 
//         activeResume: { 
//             ...state.activeResume, 
//             resumeData: { 
//                 ...state.activeResume.resumeData, 
//                 sections,
//                 [sectionDef.key]: initialData 
//             } 
//         }, 
//         isSaving: true 
//       };
//     });
//     get().triggerSave();
//   },

//   removeSection: (key) => {
//     set((state) => {
//       const sections = state.activeResume.resumeData.sections.filter(s => s.key !== key);
//       return { activeResume: { ...state.activeResume, resumeData: { ...state.activeResume.resumeData, sections } }, isSaving: true };
//     });
//     get().triggerSave();
//   },

//   triggerSave: () => {
//     clearTimeout(window.saveTimeout);
//     window.saveTimeout = setTimeout(async () => {
//       const { activeResume, documentStyle } = get();
//       if(activeResume) {
//         try {
//           await api.put(`/resume/${activeResume._id}`, { ...activeResume, documentStyle });
//           set({ isSaving: false });
//         } catch (error) {
//           set({ isSaving: false });
//         }
//       }
//     }, 1500);
//   },

//   organizeSkillsAi: async (jdText) => {
//     const { activeResume, updateResumeData } = get();
//     const currentSkills = activeResume?.resumeData?.skills || [];
//     if (!currentSkills.length) return;

//     set({ isTailoring: true }); 
//     try {
//       const { data } = await api.post('/ai/organize-skills', { 
//           skills: currentSkills, 
//           jobDescription: jdText || "" 
//       });
      
//       if (data.success && data.skills) {
//         updateResumeData({ ...activeResume.resumeData, skills: data.skills });
//       }
//     } catch (err) {
//       alert("Failed to organize skills.");
//     } finally {
//       set({ isTailoring: false });
//     }
//   },

//   generateBulletOptions: async (jdText, tone = 'impact') => {
//     const { activeResume } = get();
//     set({ isTailoring: true, generatedBullets: null });

//     try {
//       const response = await api.post('/ai/tailor-resume', {
//         resumeData: activeResume.resumeData,
//         jobDescription: jdText,
//         tone
//       });

//       const data = response.data;

//       if (!data?.success || !data?.tailoredData) {
//         throw new Error('Invalid AI response structure');
//       }

//       const tailoredItems = [];
//       const customSections = activeResume.resumeData.sections?.filter(s => s.isCustom && s.type === 'list').map(s => s.key) || [];
//       const allKeys = ['experience', 'projects', ...customSections];

//       allKeys.forEach(key => {
//         if (data.tailoredData[key]) {
//           data.tailoredData[key].forEach(item => {
//             tailoredItems.push({
//               sectionKey: key,
//               itemTitle: item.company || item.name || item.title || item.institution || 'Role',
//               newSuggestions: item.description || item.bulletPoints || []
//             });
//           });
//         }
//       });

//       set({
//         generatedBullets: {
//           success: true,
//           atsScore: data.atsScore || 95,
//           atsScoreBefore: data.atsScoreBefore || 35,
//           summaryOptions: data.summaryOptions || [],
//           tailoredItems
//         }
//       });

//     } catch (err) {
//       alert('Failed to analyze resume.');
//     } finally {
//       set({ isTailoring: false });
//     }
//   },

//   generateCoverLetter: async (jdText) => {
//     const { activeResume } = get();
//     set({ isGeneratingLetter: true });
//     try {
//       const { data } = await api.post('/ai/cover-letter', { resumeData: activeResume.resumeData, jobDescription: jdText });
//       set({ generatedCoverLetter: data.coverLetter });
//     } catch (err) {
//        alert("Failed to generate cover letter.");
//     }
//     finally { set({ isGeneratingLetter: false }); }
//   },

//   clearGeneratedBullets: () => set({ generatedBullets: null }),
//   clearCoverLetter: () => set({ generatedCoverLetter: null }),

//   addSkillCategory: (categoryName) => {
//     const { activeResume, updateResumeData } = get();
//     const currentSkills = activeResume.resumeData.skills || [];
//     updateResumeData({ ...activeResume.resumeData, skills: [...currentSkills, { id: uuidv4(), category: categoryName, items: [] }] });
//   },

//   addSkillToCategory: (categoryName, skillName) => {
//     const { activeResume, updateResumeData } = get();
//     const currentSkills = activeResume.resumeData.skills || [];
//     let updatedSkills = [...currentSkills];

//     const catIndex = updatedSkills.findIndex(c => c.category?.toLowerCase() === categoryName?.toLowerCase());

//     if (catIndex >= 0) {
//       const skillExists = updatedSkills[catIndex].items.some(i => i.name?.toLowerCase() === skillName?.toLowerCase());
//       if (!skillExists) {
//         updatedSkills[catIndex].items.push({ id: uuidv4(), name: skillName });
//       }
//     } else {
//       updatedSkills.push({
//         id: uuidv4(),
//         category: categoryName || 'General',
//         items: [{ id: uuidv4(), name: skillName }]
//       });
//     }

//     updateResumeData({ ...activeResume.resumeData, skills: updatedSkills });
//   },

//   removeSkillFromResume: (skillToRemove) => {
//     const { activeResume, updateResumeData } = get();
//     const currentSkills = activeResume.resumeData.skills || [];
    
//     const updatedSkills = currentSkills.map(cat => ({
//       ...cat,
//       items: (cat.items || []).filter(skill => {
//         const skillName = typeof skill === 'string' ? skill : skill.name;
//         return skillName?.toLowerCase() !== skillToRemove?.toLowerCase();
//       })
//     })).filter(cat => cat.items.length > 0 || cat.category);

//     updateResumeData({ ...activeResume.resumeData, skills: updatedSkills });
//   },

//   removeSkillFromCategory: (categoryId, skillId) => {
//     const { activeResume, updateResumeData } = get();
//     const currentSkills = activeResume.resumeData.skills || [];
//     const updatedSkills = currentSkills.map(cat => {
//       if (cat.id === categoryId) {
//         return { ...cat, items: cat.items.filter(skill => skill.id !== skillId) };
//       }
//       return cat;
//     });
    
//     const cleanedSkills = updatedSkills.filter(cat => cat.items.length > 0 || cat.category);
//     updateResumeData({ ...activeResume.resumeData, skills: cleanedSkills });
//   },

//   mergeAiSkills: (aiSkillsAddArray) => {
//     const { activeResume, updateResumeData } = get();
//     if (!aiSkillsAddArray || !Array.isArray(aiSkillsAddArray)) return;
    
//     let currentSkills = [...(activeResume.resumeData.skills || [])];

//     aiSkillsAddArray.forEach(aiCat => {
//       const existingCatIndex = currentSkills.findIndex(
//         c => c.category?.toLowerCase() === aiCat.category?.toLowerCase()
//       );
      
//       const newItemsWithIds = aiCat.items.map(name => ({ id: uuidv4(), name }));

//       if (existingCatIndex >= 0) {
//         currentSkills[existingCatIndex].items.push(...newItemsWithIds);
//       } else {
//         currentSkills.push({
//           id: uuidv4(),
//           category: aiCat.category,
//           items: newItemsWithIds
//         });
//       }
//     });

//     updateResumeData({ ...activeResume.resumeData, skills: currentSkills });
//   },

//   appendBulletToResume: (sectionKey, targetIdentifier, newBullet) => {
//     const { activeResume, updateResumeData } = get();
    
//     const newData = JSON.parse(JSON.stringify(activeResume.resumeData)); 
//     const targetSection = sectionKey || 'experience';
    
//     if (newData[targetSection] && Array.isArray(newData[targetSection])) {
//       let matched = false;

//       newData[targetSection] = newData[targetSection].map(item => {
//         const currentTitle = (item.company || item.name || item.title || item.institution || '').toLowerCase();
//         const targetTitle = (targetIdentifier || '').toLowerCase();
        
//         if (
//           item.id === targetIdentifier || 
//           currentTitle === targetTitle ||
//           (currentTitle && targetTitle && (currentTitle.includes(targetTitle) || targetTitle.includes(currentTitle)))
//         ) {
//           matched = true;
//           const bulletField = item.description !== undefined ? 'description' : 'bulletPoints';
          
//           const currentDesc = Array.isArray(item[bulletField]) ? item[bulletField] : (item[bulletField] ? String(item[bulletField]).split('\n') : []);
          
//           if (!currentDesc.includes(newBullet)) {
//             item[bulletField] = [...currentDesc, newBullet];
//           }
//         }
//         return item;
//       });

//       if (!matched && newData[targetSection].length > 0) {
//         const bulletField = newData[targetSection][0].description !== undefined ? 'description' : 'bulletPoints';
//         const currentDesc = Array.isArray(newData[targetSection][0][bulletField]) ? newData[targetSection][0][bulletField] : [];
        
//         if (!currentDesc.includes(newBullet)) {
//           newData[targetSection][0][bulletField] = [...currentDesc, newBullet];
//         }
//       }
//     }
    
//     updateResumeData(newData);
//   }
// }));























import { create } from 'zustand';
import api from '../utils/api';
import { v4 as uuidv4 } from 'uuid';

export const useResumeStore = create((set, get) => ({
  resumes: [],
  activeResume: null,
  publicResume: null,
  isLoading: false,
  isSaving: false,
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
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.resumeData) {
        const { activeResume, updateResumeData } = get();
        
        // 🚀 CTO FIX: ALWAYS use a clean slate on import to prevent section duplication!
        const baseSections = [
          { key: 'personalDetails', title: 'Personal Details', isCustom: false },
          { key: 'summary', title: 'Professional Summary', isCustom: false },
          { key: 'experience', title: 'Experience', isCustom: false },
          { key: 'education', title: 'Education', isCustom: false },
          { key: 'projects', title: 'Projects', isCustom: false },
          { key: 'skills', title: 'Skills', isCustom: false }
        ];

        let dynamicSections = [...baseSections];
        let customDataPayload = {};

        if (data.resumeData.customSections && Array.isArray(data.resumeData.customSections)) {
            data.resumeData.customSections.forEach((sec) => {
                const newKey = `custom_${uuidv4().substring(0, 8)}`;
                const isList = sec.items && Array.isArray(sec.items) && sec.items.length > 0;
                
                dynamicSections.push({
                    key: newKey,
                    title: sec.title || 'Custom Section',
                    isCustom: true,
                    type: isList ? 'list' : 'text'
                });

                if (isList) {
                    customDataPayload[newKey] = [{ title: "", date: "", bulletPoints: sec.items, id: uuidv4() }];
                } else {
                    customDataPayload[newKey] = sec.text || "";
                }
            });
        }

        const finalData = { ...data.resumeData };
        delete finalData.customSections;

        const mergedData = {
            ...activeResume?.resumeData, 
            ...finalData,          
            ...customDataPayload,  
            sections: dynamicSections 
        };

        updateResumeData(mergedData);
      }
    } catch (err) {
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
      
      if (data.documentStyle) {
        set({ documentStyle: { ...get().documentStyle, ...data.documentStyle }});
      }

      return true;
    } catch (err) {
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
      const initialData = sectionDef.type === 'list' ? [] : "";
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
    clearTimeout(window.saveTimeout);
    window.saveTimeout = setTimeout(async () => {
      const { activeResume, documentStyle } = get();
      if(activeResume) {
        try {
          await api.put(`/resume/${activeResume._id}`, { ...activeResume, documentStyle });
          set({ isSaving: false });
        } catch (error) {
          console.error("Autosave failed:", error);
          set({ isSaving: false });
        }
      }
    }, 1500);
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
      
      if (data.success && data.skills) {
        updateResumeData({ ...activeResume.resumeData, skills: data.skills });
      }
    } catch (err) {
      alert("Failed to organize skills. Check backend connection.");
    } finally {
      set({ isTailoring: false });
    }
  },

  generateBulletOptions: async (jdText, tone = 'impact') => {
    const { activeResume } = get();
    set({ isTailoring: true, generatedBullets: null });

    try {
      const response = await api.post('/ai/tailor-resume', {
        resumeData: activeResume.resumeData,
        jobDescription: jdText,
        tone
      });

      const data = response.data;

      if (!data?.success || !data?.tailoredData) {
        throw new Error('Invalid AI response structure');
      }

      const tailoredItems = [];
      const customSections = activeResume.resumeData.sections?.filter(s => s.isCustom && s.type === 'list').map(s => s.key) || [];
      const allKeys = ['experience', 'projects', ...customSections];

      allKeys.forEach(key => {
        if (data.tailoredData[key]) {
          data.tailoredData[key].forEach(item => {
            tailoredItems.push({
              sectionKey: key,
              itemTitle: item.company || item.name || item.title || item.institution || 'Role',
              newSuggestions: item.description || item.bulletPoints || []
            });
          });
        }
      });

      set({
        generatedBullets: {
          success: true,
          atsScore: data.atsScore || 95,
          atsScoreBefore: data.atsScoreBefore || 35,
          summaryOptions: data.summaryOptions || [],
          tailoredItems
        }
      });

    } catch (err) {
      alert('Failed to analyze resume.');
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

  addSkillToCategory: (categoryName, skillName) => {
    const { activeResume, updateResumeData } = get();
    const currentSkills = activeResume.resumeData.skills || [];
    let updatedSkills = [...currentSkills];

    const catIndex = updatedSkills.findIndex(c => c.category?.toLowerCase() === categoryName?.toLowerCase());

    if (catIndex >= 0) {
      const skillExists = updatedSkills[catIndex].items.some(i => i.name?.toLowerCase() === skillName?.toLowerCase());
      if (!skillExists) {
        updatedSkills[catIndex].items.push({ id: uuidv4(), name: skillName });
      }
    } else {
      updatedSkills.push({
        id: uuidv4(),
        category: categoryName || 'General',
        items: [{ id: uuidv4(), name: skillName }]
      });
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

  removeSkillFromCategory: (categoryId, skillId) => {
    const { activeResume, updateResumeData } = get();
    const currentSkills = activeResume.resumeData.skills || [];
    const updatedSkills = currentSkills.map(cat => {
      if (cat.id === categoryId) {
        return { ...cat, items: cat.items.filter(skill => skill.id !== skillId) };
      }
      return cat;
    });
    
    const cleanedSkills = updatedSkills.filter(cat => cat.items.length > 0 || cat.category);
    updateResumeData({ ...activeResume.resumeData, skills: cleanedSkills });
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