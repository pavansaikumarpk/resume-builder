import React, { useState, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { ChevronDown, ChevronUp, GripVertical, Trash2, Github, Linkedin, Mail, Phone, MapPin, User, Plus, Briefcase, GraduationCap, Award, Loader2, Wand2, Link as LinkIcon } from 'lucide-react';
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
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    // Browser MIME values are not always populated consistently. The server
    // performs the authoritative PDF signature check.
    const looksLikePdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!looksLikePdf) {
      alert('Please select a PDF file.');
      input.value = '';
      return;
    }

    try {
      await importResumeFromPdf(file);
    } finally {
      // Allow the same file to be selected again after either success or failure.
      input.value = '';
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
                      <ModernInput
                        label="Full Name"
                        icon={User}
                        value={resumeData.personalInfo?.name || [resumeData.personalInfo?.firstName, resumeData.personalInfo?.lastName].filter(Boolean).join(' ')}
                        onChange={(e) => {
                          const fullName = e.target.value.trim();
                          const parts = fullName.split(/\s+/).filter(Boolean);
                          handleUpdate('personalInfo', {
                            ...resumeData.personalInfo,
                            name: fullName,
                            firstName: parts.shift() || '',
                            lastName: parts.join(' ')
                          });
                        }}
                      />
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

                {section.key === 'certifications' && (
                  <div>
                    {(resumeData.certifications || []).map((certification, idx) => (
                      <div key={idx} className={styles.dataBlock}>
                        <button type="button" onClick={() => removeArrayItem('certifications', idx)} aria-label={`Remove certification ${idx + 1}`} className={styles.deleteBlockBtn}>
                          <Trash2 size={16} />
                        </button>
                        <div className={styles.grid2}>
                          <ModernInput label="Certification Name" value={certification.name || ''} onChange={(e) => updateArrayItem('certifications', idx, 'name', e.target.value)} />
                          <ModernInput label="Issuing Organization" value={certification.issuer || ''} onChange={(e) => updateArrayItem('certifications', idx, 'issuer', e.target.value)} />
                          <ModernInput label="Date" placeholder="e.g. Oct 2026" value={certification.date || ''} onChange={(e) => updateArrayItem('certifications', idx, 'date', e.target.value)} />
                          <ModernInput label="Credential URL" icon={LinkIcon} placeholder="https://..." value={certification.link || ''} onChange={(e) => updateArrayItem('certifications', idx, 'link', e.target.value)} />
                        </div>
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '', link: '' })} className={styles.addBlockBtn}>
                      <Award size={16} /> Add Certification
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
                          placeholder="Write your section details..."
                          rows={4}
                          className={styles.textareaField}
                        />
                      </div>
                    ) : section.type === 'bullets' ? (
                      <div>
                        {(resumeData[section.key] || []).map((point, idx) => (
                          <div key={idx} className={styles.dataBlock}>
                            <button type="button" onClick={() => removeArrayItem(section.key, idx)} aria-label={`Remove point ${idx + 1}`} className={styles.deleteBlockBtn}><Trash2 size={16} /></button>
                            <div className={styles.grid2}>
                              <ModernInput
                                label="Date / Timeline"
                                placeholder="e.g. Oct 2026"
                                value={typeof point === 'object' ? (point.date || '') : ''}
                                onChange={(e) => {
                                  const points = [...(resumeData[section.key] || [])];
                                  points[idx] = { ...(typeof points[idx] === 'object' ? points[idx] : { text: points[idx] || '' }), date: e.target.value };
                                  handleUpdate(section.key, points);
                                }}
                              />
                            </div>
                            <div className={styles.inputGroup}>
                              <label className={styles.textareaLabel}>Point {idx + 1}</label>
                              <textarea
                                value={typeof point === 'string' ? point : (point.text || '')}
                                onChange={(e) => {
                                  const points = [...(resumeData[section.key] || [])];
                                  points[idx] = { ...(typeof points[idx] === 'object' ? points[idx] : {}), text: e.target.value };
                                  handleUpdate(section.key, points);
                                }}
                                placeholder="Enter a bullet point..."
                                rows={2}
                                className={styles.textareaField}
                              />
                            </div>
                          </div>
                        ))}
                        <button type="button" onClick={() => addArrayItem(section.key, { date: '', text: '' })} className={styles.addBlockBtn}>
                          <Plus size={16} /> Add Another Point
                        </button>
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