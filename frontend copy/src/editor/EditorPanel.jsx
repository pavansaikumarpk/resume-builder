
// import React, { useState, useRef } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { ChevronDown, ChevronUp, GripVertical, Trash2, Github, Linkedin, Mail, Phone, MapPin, User, Plus, Briefcase, GraduationCap, Code, Award, Upload, Loader2 } from 'lucide-react';
// import AddSectionModal from './AddSectionModal';
// import { AiInputField } from './AiInputField';

// export const EditorPanel = () => {
//   const { 
//     activeResume, updateResumeData, moveSectionUp, moveSectionDown, 
//     removeSection, renameSection, 
//     isImporting, importResumeFromPdf // 🚀 IMPORT PDF LOGIC
//   } = useResumeStore();
  
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [expandedSection, setExpandedSection] = useState('personalDetails');

//   // 🚀 NEW: Ref for the hidden file input
//   const fileInputRef = useRef(null);

//   // 🚀 NEW: File upload handler
//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
    
//     if (file.type !== 'application/pdf') {
//         return alert("Please upload a PDF file.");
//     }
    
//     await importResumeFromPdf(file);
//     // Reset the input so the user can upload the same file again if needed
//     e.target.value = null; 
//   };

//   if (!activeResume) return null;

//   const { resumeData } = activeResume;
//   const sections = resumeData.sections || [];

//   // Helper functions to update the global Zustand state
//   const handleUpdate = (field, value) => updateResumeData({ ...resumeData, [field]: value });
  
//   const updateArrayItem = (key, index, field, value) => {
//     const arr = [...(resumeData[key] || [])];
//     arr[index] = { ...arr[index], [field]: value };
//     handleUpdate(key, arr);
//   };
  
//   const addArrayItem = (key, defaultObj) => {
//     const arr = [...(resumeData[key] || [])];
//     arr.push(defaultObj);
//     handleUpdate(key, arr);
//   };
  
//   const removeArrayItem = (key, index) => {
//     const arr = [...(resumeData[key] || [])];
//     arr.splice(index, 1);
//     handleUpdate(key, arr);
//   };

//   return (
//     <div className="h-full overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
//       <div className="max-w-3xl mx-auto space-y-6 pb-32">
         
//         {/* Editor Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200">
//           <div>
//             <h1 className="text-2xl font-black text-slate-800 tracking-tight">Resume Editor</h1>
//             <p className="text-slate-500 text-sm mt-1">Fill in your details or let the AI Co-Pilot auto-tailor everything.</p>
//           </div>
//           <div className="flex items-center gap-3 w-full md:w-auto">
//             {/* 🚀 NEW: Hidden File Input */}
//             <input 
//               type="file" 
//               accept="application/pdf" 
//               className="hidden" 
//               ref={fileInputRef} 
//               onChange={handleFileChange} 
//             />
            
//             {/* 🚀 NEW: Magic Import Button */}
//             <button 
//               type="button" 
//               onClick={() => fileInputRef.current?.click()} 
//               disabled={isImporting}
//               className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 px-5 py-2.5 rounded-xl font-bold transition-all text-sm disabled:opacity-70"
//             >
//               {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
//               {isImporting ? 'Parsing PDF...' : 'Import PDF'}
//             </button>

//             <button type="button" onClick={() => setModalOpen(true)} className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black shadow-md transition-all text-sm">
//               <Plus size={18} /> Add Section
//             </button>
//           </div>
//         </div>

//         {/* Dynamic Sections Loop */}
//         {sections.map((section, index) => {
//           const isExpanded = expandedSection === section.key;
          
//           return (
//             <div key={section.key} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4 transition-all hover:border-slate-300">
              
//               {/* Accordion Header */}
//               <div 
//                 className="flex items-center justify-between p-4 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
//                 onClick={() => setExpandedSection(isExpanded ? null : section.key)}
//               >
//                 <div className="flex items-center gap-3 flex-1">
//                   <div className="text-slate-400 cursor-grab hover:text-slate-600" onClick={(e) => e.stopPropagation()}>
//                     <GripVertical size={20} />
//                   </div>
//                   <input 
//                     type="text" 
//                     value={section.title} 
//                     onChange={(e) => renameSection(section.key, e.target.value)}
//                     onClick={(e) => e.stopPropagation()}
//                     className="text-lg font-bold text-slate-800 uppercase tracking-wide bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full max-w-[250px] transition-all"
//                   />
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <button type="button" onClick={(e) => { e.stopPropagation(); moveSectionUp(index); }} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"><ChevronUp size={18}/></button>
//                   <button type="button" onClick={(e) => { e.stopPropagation(); moveSectionDown(index); }} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"><ChevronDown size={18}/></button>
//                   {section.isCustom && (
//                     <button type="button" onClick={(e) => { e.stopPropagation(); removeSection(section.key); }} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all ml-2"><Trash2 size={18}/></button>
//                   )}
//                 </div>
//               </div>

//               {/* Accordion Body */}
//               {isExpanded && (
//                 <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-6">
                  
//                   {/* PERSONAL DETAILS */}
//                   {section.key === 'personalDetails' && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                       <div className="col-span-1 md:col-span-2 space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.firstName || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, firstName: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
//                       <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="email" value={resumeData.personalInfo?.email || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, email: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
//                       <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.phone || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, phone: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
//                       <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.location || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, location: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
//                       <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn</label><div className="relative"><Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.linkedin || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, linkedin: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
//                       <div className="space-y-1.5 col-span-1 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub / Portfolio</label><div className="relative"><Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.github || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, github: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
//                     </div>
//                   )}

//                   {/* EXPERIENCE */}
//                   {section.key === 'experience' && (
//                     <div className="space-y-6">
//                       {(resumeData.experience || []).map((exp, idx) => (
//                         <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all">
//                           <button type="button" onClick={() => removeArrayItem('experience', idx)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                          
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                             <div><label className="text-xs font-bold text-slate-500 uppercase">Company</label><input type="text" value={exp.company || ''} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                             <div><label className="text-xs font-bold text-slate-500 uppercase">Position</label><input type="text" value={exp.position || exp.jobTitle || ''} onChange={(e) => updateArrayItem('experience', idx, 'position', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                             <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input type="text" value={exp.startDate || ''} onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                             <div><label className="text-xs font-bold text-slate-500 uppercase">End Date</label><input type="text" value={exp.endDate || ''} onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                           </div>
                          
//                           <div>
//                             <label className="text-xs font-bold text-slate-500 uppercase">Description (Hit Enter for new bullet)</label>
//                             <AiInputField 
//                                 value={Array.isArray(exp.description) ? exp.description.join('\n') : (exp.description || '')} 
//                                 onChange={(val) => updateArrayItem('experience', idx, 'description', val.split('\n'))} 
//                                 placeholder="Type your duties, or let the AI Rewrite them..." 
//                                 rows={4}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                       <button type="button" onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: [] })} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-slate-800 hover:bg-slate-100 transition-all flex justify-center items-center gap-2"><Briefcase size={18}/> Add Experience</button>
//                     </div>
//                   )}

//                   {/* EDUCATION */}
//                   {section.key === 'education' && (
//                     <div className="space-y-6">
//                       {(resumeData.education || []).map((edu, idx) => (
//                         <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all">
//                           <button type="button" onClick={() => removeArrayItem('education', idx)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                          
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Institution</label><input type="text" value={edu.institution || ''} onChange={(e) => updateArrayItem('education', idx, 'institution', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                             <div><label className="text-xs font-bold text-slate-500 uppercase">Degree</label><input type="text" value={edu.degree || ''} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                             <div><label className="text-xs font-bold text-slate-500 uppercase">Field of Study</label><input type="text" value={edu.fieldOfStudy || ''} onChange={(e) => updateArrayItem('education', idx, 'fieldOfStudy', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                             <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input type="text" value={edu.startDate || ''} onChange={(e) => updateArrayItem('education', idx, 'startDate', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                             <div><label className="text-xs font-bold text-slate-500 uppercase">End Date</label><input type="text" value={edu.endDate || ''} onChange={(e) => updateArrayItem('education', idx, 'endDate', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
//                           </div>
//                         </div>
//                       ))}
//                       <button type="button" onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-slate-800 hover:bg-slate-100 transition-all flex justify-center items-center gap-2"><GraduationCap size={18}/> Add Education</button>
//                     </div>
//                   )}

//                   {/* PROJECTS */}
//                   {section.key === 'projects' && (
//                     <div className="space-y-6">
//                       {(resumeData.projects || []).map((proj, idx) => (
//                         <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all">
//                           <button type="button" onClick={() => removeArrayItem('projects', idx)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
//                           <div className="mb-4">
//                             <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
//                             <input type="text" value={proj.name || proj.title || ''} onChange={(e) => updateArrayItem('projects', idx, 'name', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent font-bold text-slate-800 transition-colors" placeholder="Project Name"/>
//                           </div>
//                           <div>
//                             <label className="text-xs font-bold text-slate-500 uppercase">Description (Hit Enter for new bullet)</label>
//                             <AiInputField 
//                                 value={Array.isArray(proj.description) ? proj.description.join('\n') : (proj.description || '')} 
//                                 onChange={(val) => updateArrayItem('projects', idx, 'description', val.split('\n'))} 
//                                 placeholder="Built with React and Node... (Click AI Rewrite to optimize)" 
//                                 rows={3}
//                             />
//                           </div>
//                         </div>
//                       ))}
//                       <button type="button" onClick={() => addArrayItem('projects', { name: '', description: [] })} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-slate-800 hover:bg-slate-100 transition-all flex justify-center items-center gap-2"><Code size={18}/> Add Project</button>
//                     </div>
//                   )}

//                   {/* SUMMARY */}
//                   {section.key === 'summary' && (
//                     <div>
//                       <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Professional Summary</label>
//                       <AiInputField 
//                           value={resumeData.summary || ''} 
//                           onChange={(val) => handleUpdate('summary', val)} 
//                           placeholder="Type a quick summary of your career..." 
//                           rows={4}
//                       />
//                     </div>
//                   )}

//                   {/* SKILLS */}
//                   {section.key === 'skills' && (
//                     <div>
//                       <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Skills (Hit Enter for new line)</label>
//                       <textarea 
//                           rows="5" 
//                           value={Array.isArray(resumeData.skills) ? resumeData.skills.join('\n') : (resumeData.skills || '')} 
//                           onChange={(e) => handleUpdate('skills', e.target.value.split('\n'))} 
//                           className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none bg-slate-50 shadow-sm resize-y transition-all leading-relaxed" 
//                           placeholder="Frontend: HTML, CSS, React&#10;Backend: Node, Express, MongoDB"
//                       />
//                       <p className="text-[10px] text-slate-400 mt-2 italic">* Pro Tip: Use the AI Co-Pilot on the left to automatically inject skills directly from the Job Description.</p>
//                     </div>
//                   )}

//                   {/* CUSTOM DYNAMIC SECTIONS */}
//                   {section.isCustom && (
//                     <div>
//                       {section.type === 'text' ? (
//                         <AiInputField 
//                             value={resumeData[section.key] || ''} 
//                             onChange={(val) => handleUpdate(section.key, val)} 
//                             placeholder="Type your content here..." 
//                             rows={4}
//                         />
//                       ) : (
//                         <div className="space-y-6">
//                            {(resumeData[section.key] || []).map((item, idx) => (
//                               <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all">
//                                 <button type="button" onClick={() => removeArrayItem(section.key, idx)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                
//                                 <div className="grid grid-cols-2 gap-4 mb-4">
//                                   <div>
//                                     <label className="text-xs font-bold text-slate-500 uppercase">Item Title</label>
//                                     <input type="text" value={item.title || ''} onChange={(e) => updateArrayItem(section.key, idx, 'title', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none font-bold text-slate-800 transition-colors" placeholder="Title"/>
//                                   </div>
//                                   <div>
//                                     <label className="text-xs font-bold text-slate-500 uppercase">Date / Detail</label>
//                                     <input type="text" value={item.date || ''} onChange={(e) => updateArrayItem(section.key, idx, 'date', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none transition-colors" placeholder="Detail"/>
//                                   </div>
//                                 </div>
                                
//                                 <div>
//                                     <label className="text-xs font-bold text-slate-500 uppercase">Description (Hit Enter for new bullet)</label>
//                                     <AiInputField 
//                                         value={Array.isArray(item.bulletPoints) ? item.bulletPoints.join('\n') : (item.bulletPoints || '')} 
//                                         onChange={(val) => updateArrayItem(section.key, idx, 'bulletPoints', val.split('\n'))} 
//                                         placeholder="Add bullets here..." 
//                                         rows={3}
//                                     />
//                                 </div>
//                               </div>
//                            ))}
//                            <button type="button" onClick={() => addArrayItem(section.key, { title: '', date: '', bulletPoints: [] })} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-slate-800 hover:bg-slate-100 transition-all flex justify-center items-center gap-2"><Award size={18}/> Add Item</button>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//       <AddSectionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
//     </div>
//   );
// };









import React, { useState, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { ChevronDown, ChevronUp, GripVertical, Trash2, Github, Linkedin, Mail, Phone, MapPin, User, Plus, Briefcase, GraduationCap, Code, Award, Upload, Loader2, Wand2 } from 'lucide-react';
import AddSectionModal from './AddSectionModal';
import { AiInputField } from './AiInputField';

export const EditorPanel = () => {
  const { 
    activeResume, updateResumeData, moveSectionUp, moveSectionDown, 
    removeSection, renameSection, 
    isImporting, importResumeFromPdf 
  } = useResumeStore();
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState('personalDetails');

  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        return alert("Please upload a PDF file.");
    }
    
    await importResumeFromPdf(file);
    e.target.value = null; 
  };

  if (!activeResume) return null;

  const { resumeData } = activeResume;
  const sections = resumeData.sections || [];

  const handleUpdate = (field, value) => updateResumeData({ ...resumeData, [field]: value });
  
  const updateArrayItem = (key, index, field, value) => {
    const arr = [...(resumeData[key] || [])];
    arr[index] = { ...arr[index], [field]: value };
    handleUpdate(key, arr);
  };
  
  const addArrayItem = (key, defaultObj) => {
    const arr = [...(resumeData[key] || [])];
    arr.push(defaultObj);
    handleUpdate(key, arr);
  };
  
  const removeArrayItem = (key, index) => {
    const arr = [...(resumeData[key] || [])];
    arr.splice(index, 1);
    handleUpdate(key, arr);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-6 pb-32">
         
        {/* Editor Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Resume Editor</h1>
            <p className="text-slate-500 text-sm mt-1">Fill in your details or let the AI Co-Pilot auto-tailor everything.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            
            {/* 🚀 CRITICAL FIX: Making the Magic Import button pop with a vibrant gradient so it is unmissable! */}
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isImporting}
              className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/30 transition-all text-sm disabled:opacity-70"
            >
              {isImporting ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
              {isImporting ? 'Parsing PDF...' : 'Magic Import'}
            </button>

            <button type="button" onClick={() => setModalOpen(true)} className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black shadow-md transition-all text-sm">
              <Plus size={18} /> Add Section
            </button>
          </div>
        </div>

        {/* Dynamic Sections Loop */}
        {sections.map((section, index) => {
          const isExpanded = expandedSection === section.key;
          
          return (
            <div key={section.key} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4 transition-all hover:border-slate-300">
              
              {/* Accordion Header */}
              <div 
                className="flex items-center justify-between p-4 bg-white cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedSection(isExpanded ? null : section.key)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-slate-400 cursor-grab hover:text-slate-600" onClick={(e) => e.stopPropagation()}>
                    <GripVertical size={20} />
                  </div>
                  <input 
                    type="text" 
                    value={section.title} 
                    onChange={(e) => renameSection(section.key, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="text-lg font-bold text-slate-800 uppercase tracking-wide bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none w-full max-w-[250px] transition-all"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={(e) => { e.stopPropagation(); moveSectionUp(index); }} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"><ChevronUp size={18}/></button>
                  <button type="button" onClick={(e) => { e.stopPropagation(); moveSectionDown(index); }} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"><ChevronDown size={18}/></button>
                  {section.isCustom && (
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeSection(section.key); }} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all ml-2"><Trash2 size={18}/></button>
                  )}
                </div>
              </div>

              {/* Accordion Body */}
              {isExpanded && (
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-6">
                  
                  {/* PERSONAL DETAILS */}
                  {section.key === 'personalDetails' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="col-span-1 md:col-span-2 space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.firstName || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, firstName: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="email" value={resumeData.personalInfo?.email || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, email: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.phone || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, phone: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.location || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, location: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
                      <div className="space-y-1.5"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">LinkedIn</label><div className="relative"><Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.linkedin || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, linkedin: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
                      <div className="space-y-1.5 col-span-1 md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub / Portfolio</label><div className="relative"><Github className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input type="text" value={resumeData.personalInfo?.github || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, github: e.target.value })} className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none shadow-sm transition-all"/></div></div>
                    </div>
                  )}

                  {/* EXPERIENCE */}
                  {section.key === 'experience' && (
                    <div className="space-y-6">
                      {(resumeData.experience || []).map((exp, idx) => (
                        <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all">
                          <button type="button" onClick={() => removeArrayItem('experience', idx)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Company</label><input type="text" value={exp.company || ''} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Position</label><input type="text" value={exp.position || exp.jobTitle || ''} onChange={(e) => updateArrayItem('experience', idx, 'position', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input type="text" value={exp.startDate || ''} onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">End Date</label><input type="text" value={exp.endDate || ''} onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                          </div>
                          
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Description (Hit Enter for new bullet)</label>
                            <AiInputField 
                                value={Array.isArray(exp.description) ? exp.description.join('\n') : (exp.description || '')} 
                                onChange={(val) => updateArrayItem('experience', idx, 'description', val.split('\n'))} 
                                placeholder="Type your duties, or let the AI Rewrite them..." 
                                rows={4}
                            />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: [] })} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-slate-800 hover:bg-slate-100 transition-all flex justify-center items-center gap-2"><Briefcase size={18}/> Add Experience</button>
                    </div>
                  )}

                  {/* EDUCATION */}
                  {section.key === 'education' && (
                    <div className="space-y-6">
                      {(resumeData.education || []).map((edu, idx) => (
                        <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all">
                          <button type="button" onClick={() => removeArrayItem('education', idx)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase">Institution</label><input type="text" value={edu.institution || ''} onChange={(e) => updateArrayItem('education', idx, 'institution', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Degree</label><input type="text" value={edu.degree || ''} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Field of Study</label><input type="text" value={edu.fieldOfStudy || ''} onChange={(e) => updateArrayItem('education', idx, 'fieldOfStudy', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">Start Date</label><input type="text" value={edu.startDate || ''} onChange={(e) => updateArrayItem('education', idx, 'startDate', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                            <div><label className="text-xs font-bold text-slate-500 uppercase">End Date</label><input type="text" value={edu.endDate || ''} onChange={(e) => updateArrayItem('education', idx, 'endDate', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent transition-colors"/></div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-slate-800 hover:bg-slate-100 transition-all flex justify-center items-center gap-2"><GraduationCap size={18}/> Add Education</button>
                    </div>
                  )}

                  {/* PROJECTS */}
                  {section.key === 'projects' && (
                    <div className="space-y-6">
                      {(resumeData.projects || []).map((proj, idx) => (
                        <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all">
                          <button type="button" onClick={() => removeArrayItem('projects', idx)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                          <div className="mb-4">
                            <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
                            <input type="text" value={proj.name || proj.title || ''} onChange={(e) => updateArrayItem('projects', idx, 'name', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none bg-transparent font-bold text-slate-800 transition-colors" placeholder="Project Name"/>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Description (Hit Enter for new bullet)</label>
                            <AiInputField 
                                value={Array.isArray(proj.description) ? proj.description.join('\n') : (proj.description || '')} 
                                onChange={(val) => updateArrayItem('projects', idx, 'description', val.split('\n'))} 
                                placeholder="Built with React and Node... (Click AI Rewrite to optimize)" 
                                rows={3}
                            />
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => addArrayItem('projects', { name: '', description: [] })} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-slate-800 hover:bg-slate-100 transition-all flex justify-center items-center gap-2"><Code size={18}/> Add Project</button>
                    </div>
                  )}

                  {/* SUMMARY */}
                  {section.key === 'summary' && (
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Professional Summary</label>
                      <AiInputField 
                          value={resumeData.summary || ''} 
                          onChange={(val) => handleUpdate('summary', val)} 
                          placeholder="Type a quick summary of your career..." 
                          rows={4}
                      />
                    </div>
                  )}

                  {/* SKILLS */}
                  {section.key === 'skills' && (
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Skills (Hit Enter for new line)</label>
                      <textarea 
                          rows="5" 
                          value={Array.isArray(resumeData.skills) ? resumeData.skills.join('\n') : (resumeData.skills || '')} 
                          onChange={(e) => handleUpdate('skills', e.target.value.split('\n'))} 
                          className="w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none bg-slate-50 shadow-sm resize-y transition-all leading-relaxed" 
                          placeholder="Frontend: HTML, CSS, React&#10;Backend: Node, Express, MongoDB"
                      />
                      <p className="text-[10px] text-slate-400 mt-2 italic">* Pro Tip: Use the AI Co-Pilot on the left to automatically inject skills directly from the Job Description.</p>
                    </div>
                  )}

                  {/* CUSTOM DYNAMIC SECTIONS */}
                  {section.isCustom && (
                    <div>
                      {section.type === 'text' ? (
                        <AiInputField 
                            value={resumeData[section.key] || ''} 
                            onChange={(val) => handleUpdate(section.key, val)} 
                            placeholder="Type your content here..." 
                            rows={4}
                        />
                      ) : (
                        <div className="space-y-6">
                           {(resumeData[section.key] || []).map((item, idx) => (
                              <div key={idx} className="p-5 bg-white border border-slate-200 rounded-2xl relative shadow-sm hover:border-slate-300 transition-all">
                                <button type="button" onClick={() => removeArrayItem(section.key, idx)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={16}/></button>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Item Title</label>
                                    <input type="text" value={item.title || ''} onChange={(e) => updateArrayItem(section.key, idx, 'title', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none font-bold text-slate-800 transition-colors" placeholder="Title"/>
                                  </div>
                                  <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date / Detail</label>
                                    <input type="text" value={item.date || ''} onChange={(e) => updateArrayItem(section.key, idx, 'date', e.target.value)} className="w-full p-2.5 border-b-2 border-slate-100 focus:border-indigo-500 outline-none transition-colors" placeholder="Detail"/>
                                  </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description (Hit Enter for new bullet)</label>
                                    <AiInputField 
                                        value={Array.isArray(item.bulletPoints) ? item.bulletPoints.join('\n') : (item.bulletPoints || '')} 
                                        onChange={(val) => updateArrayItem(section.key, idx, 'bulletPoints', val.split('\n'))} 
                                        placeholder="Add bullets here..." 
                                        rows={3}
                                    />
                                </div>
                              </div>
                           ))}
                           <button type="button" onClick={() => addArrayItem(section.key, { title: '', date: '', bulletPoints: [] })} className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-600 font-bold rounded-2xl hover:border-slate-800 hover:bg-slate-100 transition-all flex justify-center items-center gap-2"><Award size={18}/> Add Item</button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
      <AddSectionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};