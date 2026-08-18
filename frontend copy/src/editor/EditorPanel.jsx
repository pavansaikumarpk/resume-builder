
// import React, { useState, useRef } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { ChevronDown, ChevronUp, GripVertical, Trash2, Github, Linkedin, Mail, Phone, MapPin, User, Plus, Briefcase, GraduationCap, Loader2, Wand2 } from 'lucide-react';
// import AddSectionModal from './AddSectionModal';
// import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
// import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { SkillsEditor } from './SkillsEditor';
// import styles from './editor.module.css';

// // 1. CLEAN UI COMPONENT
// const ModernInput = ({ label, icon: Icon, value, onChange, type = "text", placeholder = "" }) => (
//   <div className={styles.inputGroup}>
//     <label className={styles.inputLabel}>
//       {Icon && <Icon size={12} />} {label}
//     </label>
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={styles.inputField}
//     />
//   </div>
// );

// // 2. DND-KIT WRAPPER
// const SortableSection = ({ section, isExpanded, onToggle, children, renameSection, removeSection }) => {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.key });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     zIndex: isDragging ? 50 : 1,
//   };

//   const cardStateClass = isDragging ? styles.sectionCardDragging : styles.sectionCardIdle;
//   const bodyStateClass = isExpanded ? styles.sectionBodyExpanded : styles.sectionBodyCollapsed;

//   return (
//     <div ref={setNodeRef} style={style} className={`${styles.sectionCard} ${cardStateClass}`}>
//       <div className={`${styles.sectionHeader} group`} onClick={onToggle}>
//         <div className={styles.sectionHeaderLeft}>
//           <div {...attributes} {...listeners} className={styles.dragHandle} onClick={(e) => e.stopPropagation()}>
//             <GripVertical size={18} />
//           </div>
//           <input
//             type="text"
//             value={section.title}
//             onChange={(e) => renameSection(section.key, e.target.value)}
//             onClick={(e) => e.stopPropagation()}
//             className={styles.sectionTitleInput}
//           />
//         </div>
//         <div className={styles.sectionHeaderRight}>
//           {section.isCustom && (
//             <button type="button" onClick={(e) => { e.stopPropagation(); removeSection(section.key); }} className={`${styles.iconBtn} ${styles.iconBtnDanger}`}>
//               <Trash2 size={16} />
//             </button>
//           )}
//           <div className={`${styles.iconBtn} ${styles.iconBtnNeutral}`}>
//             {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//           </div>
//         </div>
//       </div>
//       <div className={`${styles.sectionBody} ${bodyStateClass}`}>
//         {children}
//       </div>
//     </div>
//   );
// };

// // 3. MAIN EDITOR PANEL
// export const EditorPanel = () => {
//   const { activeResume, updateResumeData, removeSection, renameSection, isImporting, importResumeFromPdf } = useResumeStore();
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [expandedSection, setExpandedSection] = useState('personalDetails');
//   const fileInputRef = useRef(null);

//   const sensors = useSensors(
//     useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
//     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
//   );

//   if (!activeResume) return null;
//   const { resumeData } = activeResume;
//   const sections = resumeData.sections || [];

//   const handleUpdate = (field, value) => updateResumeData({ ...resumeData, [field]: value });
  
//   const updateArrayItem = (key, index, field, value) => {
//     const arr = [...(resumeData[key] || [])];
//     arr[index] = { ...arr[index], [field]: value };
//     handleUpdate(key, arr);
//   };

//   const addArrayItem = (key, defaultObj) => handleUpdate(key, [...(resumeData[key] || []), defaultObj]);
//   const removeArrayItem = (key, index) => {
//     const arr = [...(resumeData[key] || [])]; arr.splice(index, 1); handleUpdate(key, arr);
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     if (active.id !== over.id) {
//       const oldIndex = sections.findIndex((s) => s.key === active.id);
//       const newIndex = sections.findIndex((s) => s.key === over.id);
//       updateResumeData({ ...resumeData, sections: arrayMove(sections, oldIndex, newIndex) });
//     }
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       await importResumeFromPdf(file);
//       e.target.value = null;
//     }
//   };

//   return (
//     <div className={`${styles.container} custom-scrollbar`}>
//       <div className={styles.wrapper}>
        
//         {/* Header */}
//         <div className={styles.header}>
//           <div>
//             <h1 className={styles.title}>Editor</h1>
//             <p className={styles.subtitle}>Structure your content. AI acts on this data.</p>
//           </div>
//           <div className={styles.actions}>
//             <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isImporting}
//               className={styles.btnSecondary}
//             >
//               {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
//               {isImporting ? 'Parsing...' : 'PDF Import'}
//             </button>
//             <button 
//               type="button" 
//               onClick={() => setModalOpen(true)} 
//               className={styles.btnPrimary}
//             >
//               <Plus size={16} /> Add Section
//             </button>
//           </div>
//         </div>

//         {/* DND CONTEXT */}
//         <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//           <SortableContext items={sections.map(s => s.key)} strategy={verticalListSortingStrategy}>
            
//             {sections.map((section, index) => (
//               <SortableSection
//                 key={section.key}
//                 section={section}
//                 index={index}
//                 isExpanded={expandedSection === section.key}
//                 onToggle={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
//                 renameSection={renameSection}
//                 removeSection={removeSection}
//               >

//                 {section.key === 'personalDetails' && (
//                   <div className={styles.grid2}>
//                     <div className={styles.colSpan2}>
//                       <ModernInput label="Full Name" icon={User} value={resumeData.personalInfo?.firstName || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, firstName: e.target.value })} />
//                     </div>
//                     <ModernInput label="Email" type="email" icon={Mail} value={resumeData.personalInfo?.email || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, email: e.target.value })} />
//                     <ModernInput label="Phone" icon={Phone} value={resumeData.personalInfo?.phone || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, phone: e.target.value })} />
//                     <ModernInput label="Location" icon={MapPin} value={resumeData.personalInfo?.location || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, location: e.target.value })} />
//                     <ModernInput label="LinkedIn" icon={Linkedin} value={resumeData.personalInfo?.linkedin || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, linkedin: e.target.value })} />
//                     <div className={styles.colSpan2}>
//                       <ModernInput label="GitHub / Portfolio" icon={Github} value={resumeData.personalInfo?.github || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, github: e.target.value })} />
//                     </div>
//                   </div>
//                 )}

//                 {section.key === 'experience' && (
//                   <div>
//                     {(resumeData.experience || []).map((exp, idx) => (
//                       <div key={idx} className={styles.dataBlock}>
//                         <button type="button" onClick={() => removeArrayItem('experience', idx)} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
                        
//                         <div className={styles.grid2}>
//                           <ModernInput label="Company Name" value={exp.company || ''} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} />
//                           <ModernInput label="Job Title" value={exp.position || exp.jobTitle || ''} onChange={(e) => updateArrayItem('experience', idx, 'position', e.target.value)} />
//                           <ModernInput label="Start Date" placeholder="Jan 2022" value={exp.startDate || ''} onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)} />
//                           <ModernInput label="End Date" placeholder="Present" value={exp.endDate || ''} onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)} />
//                         </div>

//                         <div className={styles.inputGroup}>
//                           <label className={styles.textareaLabel}>Job Description</label>
//                           <textarea 
//                             value={Array.isArray(exp.description) ? exp.description.join('\n') : (exp.description || '')} 
//                             onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value.split('\n'))} 
//                             placeholder="• Developed X using Y resulting in Z..." 
//                             rows={4}
//                             className={styles.textareaField}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                     <button type="button" onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', description: [] })} className={styles.addBlockBtn}>
//                       <Briefcase size={16} /> Add Experience
//                     </button>
//                   </div>
//                 )}

//                 {section.key === 'education' && (
//                   <div>
//                     {(resumeData.education || []).map((edu, idx) => (
//                       <div key={idx} className={styles.dataBlock}>
//                         <button type="button" onClick={() => removeArrayItem('education', idx)} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
//                         <div className={styles.grid2}>
//                           <div className={styles.colSpan2}><ModernInput label="Institution" value={edu.institution || ''} onChange={(e) => updateArrayItem('education', idx, 'institution', e.target.value)} /></div>
//                           <ModernInput label="Degree" value={edu.degree || ''} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} />
//                           <ModernInput label="Field of Study" value={edu.fieldOfStudy || ''} onChange={(e) => updateArrayItem('education', idx, 'fieldOfStudy', e.target.value)} />
//                           <ModernInput label="Start Date" value={edu.startDate || ''} onChange={(e) => updateArrayItem('education', idx, 'startDate', e.target.value)} />
//                           <ModernInput label="End Date" value={edu.endDate || ''} onChange={(e) => updateArrayItem('education', idx, 'endDate', e.target.value)} />
//                         </div>
//                       </div>
//                     ))}
//                     <button type="button" onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })} className={styles.addBlockBtn}>
//                       <GraduationCap size={16} /> Add Education
//                     </button>
//                   </div>
//                 )}

//                 {section.key === 'projects' && (
//                   <div>
//                     {(resumeData.projects || []).map((proj, idx) => (
//                       <div key={idx} className={styles.dataBlock}>
//                         <button type="button" onClick={() => removeArrayItem('projects', idx)} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
//                         <div className={styles.grid2}>
//                           <div className={styles.colSpan2}><ModernInput label="Project Name" value={proj.name || proj.title || ''} onChange={(e) => updateArrayItem('projects', idx, 'name', e.target.value)} /></div>
//                         </div>
//                         <div className={styles.inputGroup}>
//                           <label className={styles.textareaLabel}>Project Details</label>
//                           <textarea 
//                             value={Array.isArray(proj.description) ? proj.description.join('\n') : (proj.description || '')} 
//                             onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value.split('\n'))} 
//                             placeholder="• Built a full-stack application..." 
//                             rows={4}
//                             className={styles.textareaField}
//                           />
//                         </div>
//                       </div>
//                     ))}
//                     <button type="button" onClick={() => addArrayItem('projects', { name: '', description: [] })} className={styles.addBlockBtn}>
//                       <Plus size={16} /> Add Project
//                     </button>
//                   </div>
//                 )}

//                 {section.key === 'summary' && (
//                   <div className={styles.inputGroup}>
//                     <label className={styles.textareaLabel}>Professional Summary</label>
//                     <textarea 
//                       value={resumeData.summary || ''} 
//                       onChange={(e) => handleUpdate('summary', e.target.value)} 
//                       placeholder="Highly motivated professional with..." 
//                       rows={5}
//                       className={styles.textareaField}
//                     />
//                   </div>
//                 )}

//                 {section.key === 'skills' && (
//                   <div className="mt-2">
//                     <SkillsEditor />
//                   </div>
//                 )}

//                 {/* CRITICAL ARCHITECTURAL FALLBACK FOR ALL CUSTOM USER-GENERATED SECTIONS */}
//                 {section.isCustom && (
//                   <div className="mt-2">
//                     {section.type === 'text' ? (
//                       <div className={styles.inputGroup}>
//                         <label className={styles.textareaLabel}>Details</label>
//                         <textarea
//                           value={resumeData[section.key] || ''}
//                           onChange={(e) => handleUpdate(section.key, e.target.value)}
//                           placeholder="Provide description..."
//                           rows={4}
//                           className={styles.textareaField}
//                         />
//                       </div>
//                     ) : (
//                       <div>
//                         {(resumeData[section.key] || []).map((item, idx) => (
//                           <div key={idx} className={styles.dataBlock}>
//                             <button type="button" onClick={() => removeArrayItem(section.key, idx)} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
//                             <div className={styles.grid2}>
//                               <ModernInput label="Entry Title" value={item.title || ''} onChange={(e) => updateArrayItem(section.key, idx, 'title', e.target.value)} />
//                               <ModernInput label="Date / Timeline" value={item.date || ''} onChange={(e) => updateArrayItem(section.key, idx, 'date', e.target.value)} />
//                             </div>
//                             <div className={styles.inputGroup}>
//                               <label className={styles.textareaLabel}>Bullet Items</label>
//                               <textarea
//                                 value={Array.isArray(item.bulletPoints) ? item.bulletPoints.join('\n') : (item.bulletPoints || '')}
//                                 onChange={(e) => updateArrayItem(section.key, idx, 'bulletPoints', e.target.value.split('\n'))}
//                                 placeholder="Provide bullet information..."
//                                 rows={3}
//                                 className={styles.textareaField}
//                               />
//                             </div>
//                           </div>
//                         ))}
//                         <button type="button" onClick={() => addArrayItem(section.key, { title: '', date: '', bulletPoints: [] })} className={styles.addBlockBtn}>
//                           <Plus size={16} /> Add Custom Entry
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}

//               </SortableSection>
//             ))}

//           </SortableContext>
//         </DndContext>
//       </div>
//       <AddSectionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
//     </div>
//   );
// };

// export default EditorPanel;


















import React, { useState, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { ChevronDown, ChevronUp, GripVertical, Trash2, Github, Linkedin, Mail, Phone, MapPin, User, Plus, Briefcase, GraduationCap, Loader2, Wand2, Link as LinkIcon } from 'lucide-react';
import AddSectionModal from './AddSectionModal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SkillsEditor } from './SkillsEditor';
import styles from './editor.module.css';

const ModernInput = ({ label, icon: Icon, value, onChange, type = "text", placeholder = "" }) => (
  <div className={styles.inputGroup}>
    <label className={styles.inputLabel}>
      {Icon && <Icon size={12} />} {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={styles.inputField}
    />
  </div>
);

const SortableSection = ({ section, isExpanded, onToggle, children, renameSection, removeSection }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  const cardStateClass = isDragging ? styles.sectionCardDragging : styles.sectionCardIdle;
  const bodyStateClass = isExpanded ? styles.sectionBodyExpanded : styles.sectionBodyCollapsed;

  return (
    <div ref={setNodeRef} style={style} className={`${styles.sectionCard} ${cardStateClass}`}>
      <div className={`${styles.sectionHeader} group`} onClick={onToggle}>
        <div className={styles.sectionHeaderLeft}>
          <div {...attributes} {...listeners} className={styles.dragHandle} onClick={(e) => e.stopPropagation()}>
            <GripVertical size={18} />
          </div>
          <input
            type="text"
            value={section.title}
            onChange={(e) => renameSection(section.key, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={styles.sectionTitleInput}
          />
        </div>
        <div className={styles.sectionHeaderRight}>
          {section.isCustom && (
            <button type="button" onClick={(e) => { e.stopPropagation(); removeSection(section.key); }} className={`${styles.iconBtn} ${styles.iconBtnDanger}`}>
              <Trash2 size={16} />
            </button>
          )}
          <div className={`${styles.iconBtn} ${styles.iconBtnNeutral}`}>
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>
      <div className={`${styles.sectionBody} ${bodyStateClass}`}>
        {children}
      </div>
    </div>
  );
};

export const EditorPanel = () => {
  const { activeResume, updateResumeData, removeSection, renameSection, isImporting, importResumeFromPdf } = useResumeStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState('personalDetails');
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!activeResume) return null;
  const { resumeData } = activeResume;
  const sections = resumeData.sections || [];

  const handleUpdate = (field, value) => updateResumeData({ ...resumeData, [field]: value });
  
  const updateArrayItem = (key, index, field, value) => {
    const arr = [...(resumeData[key] || [])];
    arr[index] = { ...arr[index], [field]: value };
    handleUpdate(key, arr);
  };

  const addArrayItem = (key, defaultObj) => handleUpdate(key, [...(resumeData[key] || []), defaultObj]);
  const removeArrayItem = (key, index) => {
    const arr = [...(resumeData[key] || [])]; arr.splice(index, 1); handleUpdate(key, arr);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.key === active.id);
      const newIndex = sections.findIndex((s) => s.key === over.id);
      updateResumeData({ ...resumeData, sections: arrayMove(sections, oldIndex, newIndex) });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      await importResumeFromPdf(file);
      e.target.value = null;
    }
  };

  return (
    <div className={`${styles.container} custom-scrollbar`}>
      <div className={styles.wrapper}>
        
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Editor</h1>
            <p className={styles.subtitle}>Structure your content. AI acts on this data.</p>
          </div>
          <div className={styles.actions}>
            <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className={styles.btnSecondary}
            >
              {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              {isImporting ? 'Parsing...' : 'PDF Import'}
            </button>
            <button 
              type="button" 
              onClick={() => setModalOpen(true)} 
              className={styles.btnPrimary}
            >
              <Plus size={16} /> Add Section
            </button>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map(s => s.key)} strategy={verticalListSortingStrategy}>
            
            {sections.map((section, index) => (
              <SortableSection
                key={section.key}
                section={section}
                index={index}
                isExpanded={expandedSection === section.key}
                onToggle={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
                renameSection={renameSection}
                removeSection={removeSection}
              >

                {section.key === 'personalDetails' && (
                  <div className={styles.grid2}>
                    <div className={styles.colSpan2}>
                      <ModernInput label="Full Name" icon={User} value={resumeData.personalInfo?.firstName || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, firstName: e.target.value })} />
                    </div>
                    <ModernInput label="Email" type="email" icon={Mail} value={resumeData.personalInfo?.email || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, email: e.target.value })} />
                    <ModernInput label="Phone" icon={Phone} value={resumeData.personalInfo?.phone || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, phone: e.target.value })} />
                    <ModernInput label="Location" icon={MapPin} value={resumeData.personalInfo?.location || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, location: e.target.value })} />
                    
                    <div className={styles.colSpan2}></div>

                    <ModernInput label="LinkedIn URL" icon={Linkedin} placeholder="https://linkedin.com/in/..." value={resumeData.personalInfo?.linkedin || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, linkedin: e.target.value })} />
                    <ModernInput label="LinkedIn Link Text" placeholder="e.g. LinkedIn" value={resumeData.personalInfo?.linkedinLabel || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, linkedinLabel: e.target.value })} />
                    
                    <ModernInput label="GitHub URL" icon={Github} placeholder="https://github.com/..." value={resumeData.personalInfo?.github || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, github: e.target.value })} />
                    <ModernInput label="GitHub Link Text" placeholder="e.g. GitHub" value={resumeData.personalInfo?.githubLabel || ''} onChange={(e) => handleUpdate('personalInfo', { ...resumeData.personalInfo, githubLabel: e.target.value })} />
                  </div>
                )}

                {section.key === 'experience' && (
                  <div>
                    {(resumeData.experience || []).map((exp, idx) => (
                      <div key={idx} className={styles.dataBlock}>
                        <button type="button" onClick={() => removeArrayItem('experience', idx)} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
                        
                        <div className={styles.grid2}>
                          <ModernInput label="Company Name" value={exp.company || ''} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} />
                          <ModernInput label="Job Title" value={exp.position || exp.jobTitle || ''} onChange={(e) => updateArrayItem('experience', idx, 'position', e.target.value)} />
                          <ModernInput label="Start Date" placeholder="Jan 2022" value={exp.startDate || ''} onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)} />
                          <ModernInput label="End Date" placeholder="Present" value={exp.endDate || ''} onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)} />
                          <ModernInput label="Link URL" icon={LinkIcon} placeholder="https://..." value={exp.link || ''} onChange={(e) => updateArrayItem('experience', idx, 'link', e.target.value)} />
                          <ModernInput label="Link Text" placeholder="e.g. View Company" value={exp.linkLabel || ''} onChange={(e) => updateArrayItem('experience', idx, 'linkLabel', e.target.value)} />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.textareaLabel}>Job Description</label>
                          <textarea 
                            value={Array.isArray(exp.description) ? exp.description.join('\n') : (exp.description || '')} 
                            onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value.split('\n'))} 
                            placeholder="• Developed X using Y resulting in Z..." 
                            rows={4}
                            className={styles.textareaField}
                          />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('experience', { company: '', position: '', startDate: '', endDate: '', link: '', linkLabel: '', description: [] })} className={styles.addBlockBtn}>
                      <Briefcase size={16} /> Add Experience
                    </button>
                  </div>
                )}

                {section.key === 'education' && (
                  <div>
                    {(resumeData.education || []).map((edu, idx) => (
                      <div key={idx} className={styles.dataBlock}>
                        <button type="button" onClick={() => removeArrayItem('education', idx)} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
                        <div className={styles.grid2}>
                          <div className={styles.colSpan2}><ModernInput label="Institution" value={edu.institution || ''} onChange={(e) => updateArrayItem('education', idx, 'institution', e.target.value)} /></div>
                          <ModernInput label="Degree" value={edu.degree || ''} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} />
                          <ModernInput label="Field of Study" value={edu.fieldOfStudy || ''} onChange={(e) => updateArrayItem('education', idx, 'fieldOfStudy', e.target.value)} />
                          <ModernInput label="Start Date" value={edu.startDate || ''} onChange={(e) => updateArrayItem('education', idx, 'startDate', e.target.value)} />
                          <ModernInput label="End Date" value={edu.endDate || ''} onChange={(e) => updateArrayItem('education', idx, 'endDate', e.target.value)} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })} className={styles.addBlockBtn}>
                      <GraduationCap size={16} /> Add Education
                    </button>
                  </div>
                )}

                {section.key === 'projects' && (
                  <div>
                    {(resumeData.projects || []).map((proj, idx) => (
                      <div key={idx} className={styles.dataBlock}>
                        <button type="button" onClick={() => removeArrayItem('projects', idx)} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
                        <div className={styles.grid2}>
                          <div className={styles.colSpan2}><ModernInput label="Project Name" value={proj.name || proj.title || ''} onChange={(e) => updateArrayItem('projects', idx, 'name', e.target.value)} /></div>
                          <ModernInput label="Link URL" icon={LinkIcon} placeholder="https://..." value={proj.link || ''} onChange={(e) => updateArrayItem('projects', idx, 'link', e.target.value)} />
                          <ModernInput label="Link Text" placeholder="e.g. Live Demo" value={proj.linkLabel || ''} onChange={(e) => updateArrayItem('projects', idx, 'linkLabel', e.target.value)} />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.textareaLabel}>Project Details</label>
                          <textarea 
                            value={Array.isArray(proj.description) ? proj.description.join('\n') : (proj.description || '')} 
                            onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value.split('\n'))} 
                            placeholder="• Built a full-stack application..." 
                            rows={4}
                            className={styles.textareaField}
                          />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('projects', { name: '', link: '', linkLabel: '', description: [] })} className={styles.addBlockBtn}>
                      <Plus size={16} /> Add Project
                    </button>
                  </div>
                )}

                {section.key === 'summary' && (
                  <div className={styles.inputGroup}>
                    <label className={styles.textareaLabel}>Professional Summary</label>
                    <textarea 
                      value={resumeData.summary || ''} 
                      onChange={(e) => handleUpdate('summary', e.target.value)} 
                      placeholder="Highly motivated professional with..." 
                      rows={5}
                      className={styles.textareaField}
                    />
                  </div>
                )}

                {section.key === 'skills' && (
                  <div className="mt-2">
                    <SkillsEditor />
                  </div>
                )}

                {section.isCustom && (
                  <div className="mt-2">
                    {section.type === 'text' ? (
                      <div className={styles.inputGroup}>
                        <label className={styles.textareaLabel}>Details</label>
                        <textarea
                          value={resumeData[section.key] || ''}
                          onChange={(e) => handleUpdate(section.key, e.target.value)}
                          placeholder="Provide description..."
                          rows={4}
                          className={styles.textareaField}
                        />
                      </div>
                    ) : (
                      <div>
                        {(resumeData[section.key] || []).map((item, idx) => (
                          <div key={idx} className={styles.dataBlock}>
                            <button type="button" onClick={() => removeArrayItem(section.key, idx)} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
                            <div className={styles.grid2}>
                              <ModernInput label="Entry Title" value={item.title || ''} onChange={(e) => updateArrayItem(section.key, idx, 'title', e.target.value)} />
                              <ModernInput label="Date / Timeline" value={item.date || ''} onChange={(e) => updateArrayItem(section.key, idx, 'date', e.target.value)} />
                              <ModernInput label="Link URL" icon={LinkIcon} placeholder="https://..." value={item.link || ''} onChange={(e) => updateArrayItem(section.key, idx, 'link', e.target.value)} />
                              <ModernInput label="Link Text" placeholder="e.g. View Credential" value={item.linkLabel || ''} onChange={(e) => updateArrayItem(section.key, idx, 'linkLabel', e.target.value)} />
                            </div>
                            <div className={styles.inputGroup}>
                              <label className={styles.textareaLabel}>Bullet Items</label>
                              <textarea
                                value={Array.isArray(item.bulletPoints) ? item.bulletPoints.join('\n') : (item.bulletPoints || '')}
                                onChange={(e) => updateArrayItem(section.key, idx, 'bulletPoints', e.target.value.split('\n'))}
                                placeholder="Provide bullet information..."
                                rows={3}
                                className={styles.textareaField}
                              />
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(section.key, { title: '', date: '', link: '', linkLabel: '', bulletPoints: [] })} className={styles.addBlockBtn}>
                          <Plus size={16} /> Add Custom Entry
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </SortableSection>
            ))}

          </SortableContext>
        </DndContext>
      </div>
      <AddSectionModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default EditorPanel;