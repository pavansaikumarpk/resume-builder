










































// import React, { useState, useEffect, useRef } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { Download, Share2, FileText } from 'lucide-react';
// import { TemplateSelector } from './TemplateSelector';
// import { pdf } from '@react-pdf/renderer';
// import { ResumePDF } from '../components/pdf/ResumePDF';

// const ScaledA4Viewer = ({ children }) => {
//   const containerRef = useRef(null);
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     const observer = new ResizeObserver((entries) => {
//       for (let entry of entries) {
//         if (entry.target === containerRef.current) {
//           const availableWidth = entry.contentRect.width - 40;
//           setScale(Math.min(availableWidth / 794, 1.1));
//         }
//       }
//     });

//     if (containerRef.current) observer.observe(containerRef.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div ref={containerRef} className="w-full flex justify-center pt-32 pb-32">
//       <div 
//         className="bg-white shadow-2xl rounded-sm"
//         style={{ 
//           width: '794px', 
//           minHeight: '1123px', 
//           transform: `scale(${scale})`, 
//           transformOrigin: 'top center',
//           paddingBottom: '50px' 
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };

// const renderSkillText = (text) => {
//     if (typeof text === 'string' && text.includes(':')) {
//       const parts = text.split(':');
//       return <><span style={{ fontWeight: 'bold', color: '#000' }}>{parts[0]}:</span>{parts.slice(1).join(':')}</>;
//     }
//     return typeof text === 'string' ? text : '';
// };

// const formatDates = (start, end) => {
//     if (start && end) return `${start} - ${end}`;
//     return start || end || '';
// };

// const DynamicTemplate = ({ data, documentStyle }) => {
//     const personal = data.personalInfo || data.personalDetails || {};
//     const sections = data.sections || [];
//     const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';
    
//     const lineSpacingMap = { tight: '1.15', standard: '1.3', loose: '1.5' };
//     const marginMap = { compact: '35px 45px', standard: '45px 55px', spacious: '65px 75px' };

//     const currentFontSize = `${documentStyle?.fontSize || 11}pt`;
//     const currentFontFamily = documentStyle?.fontFamily === 'Helvetica' ? 'Helvetica, Arial, sans-serif' : '"Times New Roman", Times, serif';
//     const currentLineHeight = lineSpacingMap[documentStyle?.lineSpacing] || '1.3';
//     const currentPadding = marginMap[documentStyle?.margins] || '45px 55px';

//     // 🚀 CTO FIX: Exact LaTeX replica section title style with crisp 1px borders and large top margins
//     let titleStyle = {
//         fontSize: '1.25em', 
//         fontWeight: 'bold', 
//         borderBottom: '1px solid #000', 
//         paddingBottom: '3px', 
//         marginBottom: '8px', 
//         marginTop: '18px', 
//         color: '#000',
//         textTransform: 'uppercase'
//     };

//     return (
//       <div id="resume-render-container" style={{ 
//           fontFamily: currentFontFamily, 
//           fontSize: currentFontSize, 
//           color: '#000', 
//           width: '100%', 
//           boxSizing: 'border-box', 
//           lineHeight: currentLineHeight, 
//           padding: currentPadding 
//       }}>
//         <div className="resume-section" style={{ textAlign: 'center', marginBottom: '10px' }}>
//           <div style={{ fontSize: '2.4em', fontWeight: 'bold', color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
//             {fullName}
//           </div>
//           <div style={{ fontSize: '0.95em', color: '#000', textAlign: 'center', lineHeight: '1.2' }}>
//             {[personal.phone, personal.email, personal.linkedin, personal.github, personal.location].filter(Boolean).join('\u00A0\u00A0|\u00A0\u00A0')}
//           </div>
//         </div>

//         {sections.map(section => {
//           if (section.key === 'personalDetails') return null;
          
//           if (section.key === 'summary' && data.summary) return (
//             <div key={section.key} className="resume-section">
//               <div style={titleStyle}>{section.title}</div>
//               <div style={{ textAlign: 'justify', paddingLeft: '4px' }}>{data.summary}</div>
//             </div>
//           );
          
//           // EDUCATION: School (Bold) / Loc (Reg) -> Degree (Italic) / Date (Italic)
//           if (section.key === 'education' && data.education?.length > 0) return (
//             <div key={section.key} className="resume-section">
//               <div style={titleStyle}>{section.title}</div>
//               {data.education.map((edu, i) => (
//                 <div key={i} style={{ marginBottom: '12px' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 'bold', color: '#000', fontSize: '1.05em' }}>
//                     <span>{edu.institution}</span>
//                     <span style={{ fontWeight: 'normal', fontSize: '0.95em', whiteSpace: 'nowrap' }}>{edu.location || ''}</span>
//                   </div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontStyle: 'italic', color: '#000' }}>
//                     <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
//                     <span>{formatDates(edu.startDate, edu.endDate)}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           );

//           // EXPERIENCE: Role (Bold) / Date (Reg) -> Company (Italic) / Loc (Italic)
//           if (section.key === 'experience' && data.experience?.length > 0) return (
//             <div key={section.key} className="resume-section">
//               <div style={titleStyle}>{section.title}</div>
//               {data.experience.map((exp, i) => (
//                 <div key={i} style={{ marginBottom: '12px' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 'bold', color: '#000', fontSize: '1.05em' }}>
//                     <span>{exp.position || exp.jobTitle}</span>
//                     <span style={{ fontWeight: 'normal', fontSize: '0.95em', whiteSpace: 'nowrap' }}>{formatDates(exp.startDate, exp.endDate)}</span>
//                   </div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontStyle: 'italic', marginBottom: '2px', color: '#000' }}>
//                     <span>{exp.company}</span>
//                     {exp.location && <span>{exp.location}</span>}
//                   </div>
//                   {exp.description && (
//                     <ul style={{ margin: '2px 0 0 0', paddingLeft: '24px', listStyleType: 'disc', listStylePosition: 'outside' }}>
//                       {(Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => (
//                         <li key={j} style={{ marginBottom: '3px', paddingLeft: '4px' }}>{d}</li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               ))}
//             </div>
//           );
          
//           if (section.key === 'projects' && data.projects?.length > 0) return (
//             <div key={section.key} className="resume-section">
//               <div style={titleStyle}>{section.title}</div>
//               {data.projects.map((proj, i) => (
//                 <div key={i} style={{ marginBottom: '12px' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
//                     <span style={{ fontWeight: 'bold', color: '#000', fontSize: '1.05em' }}>{proj.name}</span>
//                     {proj.date && <span style={{ fontSize: '0.95em' }}>{proj.date}</span>}
//                   </div>
//                   {proj.subtitle && (
//                       <div style={{ fontStyle: 'italic', marginBottom: '2px', color: '#000' }}>{proj.subtitle}</div>
//                   )}
//                   {proj.description && (
//                     <ul style={{ margin: '2px 0 0 0', paddingLeft: '24px', listStyleType: 'disc', listStylePosition: 'outside' }}>
//                       {(Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => (
//                          <li key={j} style={{ marginBottom: '3px', paddingLeft: '4px' }}>{d}</li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               ))}
//             </div>
//           );
          
//           if (section.key === 'skills' && data.skills?.length > 0) return (
//             <div key={section.key} className="resume-section">
//               <div style={titleStyle}>{section.title}</div>
//               <div style={{ paddingLeft: '4px' }}>
//                 {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skillGroup, j) => {
//                   if (typeof skillGroup === 'object' && skillGroup.category) {
//                     const skillNames = (skillGroup.items || []).map(item => typeof item === 'string' ? item : item.name).filter(Boolean).join(', ');
//                     return (
//                       <div key={j} style={{ marginBottom: '2px' }}>
//                         <span style={{ fontWeight: 'bold', color: '#000' }}>{skillGroup.category}: </span>{skillNames}
//                       </div>
//                     );
//                   }
//                   return <div key={j} style={{ marginBottom: '2px' }}>{renderSkillText(skillGroup)}</div>;
//                 })}
//               </div>
//             </div>
//           );
          
//           if (section.isCustom && data[section.key]) return (
//             <div key={section.key} className="resume-section">
//               <div style={titleStyle}>{section.title}</div>
//               {section.type === 'text' ? <div style={{ whiteSpace: 'pre-wrap', paddingLeft: '4px' }}>{data[section.key]}</div> : (
//                 section.title.toLowerCase() === 'languages' ? (
//                   <div style={{ paddingLeft: '4px' }}>{(Array.isArray(data[section.key]) ? data[section.key] : []).map(lang => typeof lang === 'string' ? lang : (lang.bulletPoints || []).join(' ')).join(' | ')}</div>
//                 ) : (
//                   Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
//                     <div key={i} style={{ marginBottom: '12px' }}>
//                       {(item.title || item.date) && (
//                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 'bold', color: '#000' }}>
//                             <span>{item.title || ''}</span>
//                             <span style={{ fontWeight: 'normal', whiteSpace: 'nowrap', fontSize: '0.95em' }}>{item.date || ''}</span>
//                           </div>
//                       )}
//                       {item.bulletPoints && (
//                         <ul style={{ margin: (item.title || item.date) ? '2px 0 0 0' : '0', paddingLeft: '24px', listStyleType: 'disc', listStylePosition: 'outside' }}>
//                           {(Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => (
//                             <li key={bIdx} style={{ marginBottom: '3px', paddingLeft: '4px' }}>{b}</li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   ))
//                 )
//               )}
//             </div>
//           );
//           return null;
//         })}
//       </div>
//     );
// };

// export const PreviewPanel = () => {
//   const { activeResume, toggleResumeVisibility, documentStyle, updateDocumentStyle } = useResumeStore();
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showShareMenu, setShowShareMenu] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);
//   const [copied, setCopied] = useState(false);

//   if (!activeResume) return null;
//   const { resumeData, templateName = 'jakes-resume' } = activeResume;

//   const handleCopyLink = () => {
//     const url = `${window.location.origin}/p/${activeResume.slug}`;
//     navigator.clipboard.writeText(url);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleDownload = async () => {
//     try {
//       setIsExporting(true);
//       const blob = await pdf(<ResumePDF data={resumeData} templateName={templateName} documentStyle={documentStyle} />).toBlob();
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a'); 
//       link.href = url; 
//       link.download = `${resumeData.personalInfo?.firstName || 'My'}_Resume.pdf`;
//       document.body.appendChild(link); 
//       link.click(); 
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url); 
//     } catch (error) {
//       alert("Failed to export PDF. Please try again.");
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   return (
//     <div className="h-full flex flex-col relative bg-[#18181b] overflow-hidden">
//       <div className="absolute top-4 w-full flex justify-center z-50 pointer-events-none px-4">
//         <div className="bg-[#18181b]/95 backdrop-blur-md shadow-2xl rounded-2xl border border-zinc-800 p-2 flex flex-col gap-2 pointer-events-auto w-full max-w-2xl">
//             <div className="flex items-center justify-between w-full px-1">
//                 <div className="flex items-center gap-2">
//                     <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Editor Settings</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <button onClick={() => setShowTemplates(true)} className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 px-3 py-1.5 rounded-xl transition-colors">
//                         <FileText size={14} /> <span className="hidden sm:inline">Templates</span>
//                     </button>
//                     <div className="relative">
//                         <button onClick={() => setShowShareMenu(!showShareMenu)} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${activeResume.isPublic ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'}`}>
//                             <Share2 size={14} className={activeResume.isPublic ? "text-indigo-400" : "text-zinc-400"}/>
//                             <span className="hidden sm:inline">Share</span>
//                         </button>
//                         {showShareMenu && (
//                             <div className="absolute right-0 mt-2 w-64 bg-[#18181b] border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
//                                 <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
//                                     <span className="text-xs font-semibold text-zinc-300">Public Link</span>
//                                     <input type="checkbox" checked={activeResume.isPublic} onChange={() => toggleResumeVisibility(activeResume._id, activeResume.isPublic)} className="accent-indigo-500 w-4 h-4 cursor-pointer" />
//                                 </div>
//                                 <div className="p-3">
//                                     {activeResume.isPublic ? (
//                                         <button onClick={handleCopyLink} className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-800 transition-colors">
//                                             {copied ? 'Link Copied!' : 'Copy Link'}
//                                         </button>
//                                     ) : (
//                                         <p className="text-xs text-zinc-500 text-center font-medium">Enable sharing to generate link.</p>
//                                     )}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     <button onClick={handleDownload} disabled={isExporting} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-70">
//                         <Download size={14}/> <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Download PDF'}</span>
//                     </button>
//                 </div>
//             </div>
//             <div className="h-px w-full bg-zinc-800"></div>
//             <div className="flex flex-wrap items-center gap-4 px-2 py-1">
//                 <div className="flex items-center gap-2">
//                   <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Font</span>
//                   <select value={documentStyle?.fontFamily || 'Times-Roman'} onChange={(e) => updateDocumentStyle({ fontFamily: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-zinc-800 transition-colors">
//                       <option value="Times-Roman">Classic Serif</option>
//                       <option value="Helvetica">Modern Sans</option>
//                   </select>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Size (pt)</span>
//                   <input type="number" min="8" max="18" value={documentStyle?.fontSize || 11} onChange={(e) => updateDocumentStyle({ fontSize: Number(e.target.value) })} className="bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-lg px-2 py-1 w-16 outline-none hover:bg-zinc-800 transition-colors" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Spacing</span>
//                   <select value={documentStyle?.lineSpacing || 'standard'} onChange={(e) => updateDocumentStyle({ lineSpacing: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-zinc-800 transition-colors">
//                       <option value="tight">Tight</option>
//                       <option value="standard">Normal</option>
//                       <option value="loose">Loose</option>
//                   </select>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Margins</span>
//                   <select value={documentStyle?.margins || 'standard'} onChange={(e) => updateDocumentStyle({ margins: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-zinc-800 transition-colors">
//                       <option value="compact">Narrow</option>
//                       <option value="standard">Normal</option>
//                       <option value="spacious">Wide</option>
//                   </select>
//                 </div>
//             </div>
//         </div>
//       </div>
//       <div className="flex-1 overflow-auto relative custom-scrollbar">
//         <ScaledA4Viewer>
//           <DynamicTemplate data={resumeData} documentStyle={documentStyle || {}} />
//         </ScaledA4Viewer>
//       </div>
//       <TemplateSelector isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
//     </div>
//   );
// };










import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { Download, Share2, FileText } from 'lucide-react';
import { TemplateSelector } from './TemplateSelector';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from '../components/pdf/ResumePDF';

const ScaledA4Viewer = ({ children }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === containerRef.current) {
          const availableWidth = entry.contentRect.width - 40;
          setScale(Math.min(availableWidth / 794, 1.1));
        }
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full flex justify-center pt-32 pb-32">
      <div 
        className="bg-white shadow-2xl rounded-sm"
        style={{ 
          width: '794px', 
          minHeight: '1123px', 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          paddingBottom: '50px' 
        }}
      >
        {children}
      </div>
    </div>
  );
};

const renderSkillText = (text) => {
    if (typeof text === 'string' && text.includes(':')) {
      const parts = text.split(':');
      return <><span style={{ fontWeight: 'bold', color: '#000' }}>{parts[0]}:</span>{parts.slice(1).join(':')}</>;
    }
    return typeof text === 'string' ? text : '';
};

const formatDates = (start, end) => {
    if (start && end) return `${start} - ${end}`;
    return start || end || '';
};

const DynamicTemplate = ({ data, documentStyle }) => {
    const personal = data.personalInfo || data.personalDetails || {};
    const sections = data.sections || [];
    const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';
    
    const lineSpacingMap = { tight: '1.15', standard: '1.3', loose: '1.5' };
    const marginMap = { compact: '35px 45px', standard: '45px 55px', spacious: '65px 75px' };

    const currentFontSize = `${documentStyle?.fontSize || 11}pt`;
    const currentFontFamily = documentStyle?.fontFamily === 'Helvetica' ? 'Helvetica, Arial, sans-serif' : '"Times New Roman", Times, serif';
    const currentLineHeight = lineSpacingMap[documentStyle?.lineSpacing] || '1.3';
    const currentPadding = marginMap[documentStyle?.margins] || '45px 55px';

    let titleStyle = {
        fontSize: '1.25em', 
        fontWeight: 'bold', 
        borderBottom: '1px solid #000', 
        paddingBottom: '3px', 
        marginBottom: '8px', 
        marginTop: '18px', 
        color: '#000',
        textTransform: 'uppercase'
    };

    return (
      <div id="resume-render-container" style={{ 
          fontFamily: currentFontFamily, 
          fontSize: currentFontSize, 
          color: '#000', 
          width: '100%', 
          boxSizing: 'border-box', 
          lineHeight: currentLineHeight, 
          padding: currentPadding 
      }}>
        <div className="resume-section" style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{ fontSize: '2.4em', fontWeight: 'bold', color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            {fullName}
          </div>
          {/* 🚀 CTO FIX: Styled specifically to mimic the Flexbox wrapping setup applied in the PDF generator */}
          <div style={{ fontSize: '0.95em', color: '#000', textAlign: 'center', lineHeight: '1.5', marginTop: '6px', marginBottom: '6px' }}>
            {[personal.phone, personal.email, personal.linkedin, personal.github, personal.location].filter(Boolean).join('\u00A0\u00A0|\u00A0\u00A0')}
          </div>
        </div>

        {sections.map(section => {
          if (section.key === 'personalDetails') return null;
          
          if (section.key === 'summary' && data.summary) return (
            <div key={section.key} className="resume-section">
              <div style={titleStyle}>{section.title}</div>
              <div style={{ textAlign: 'justify', paddingLeft: '4px' }}>{data.summary}</div>
            </div>
          );
          
          if (section.key === 'education' && data.education?.length > 0) return (
            <div key={section.key} className="resume-section">
              <div style={titleStyle}>{section.title}</div>
              {data.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 'bold', color: '#000', fontSize: '1.05em' }}>
                    <span>{edu.institution}</span>
                    <span style={{ fontWeight: 'normal', fontSize: '0.95em', whiteSpace: 'nowrap' }}>{edu.location || ''}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontStyle: 'italic', color: '#000' }}>
                    <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                    <span>{formatDates(edu.startDate, edu.endDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          );

          if (section.key === 'experience' && data.experience?.length > 0) return (
            <div key={section.key} className="resume-section">
              <div style={titleStyle}>{section.title}</div>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 'bold', color: '#000', fontSize: '1.05em' }}>
                    <span>{exp.position || exp.jobTitle}</span>
                    <span style={{ fontWeight: 'normal', fontSize: '0.95em', whiteSpace: 'nowrap' }}>{formatDates(exp.startDate, exp.endDate)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontStyle: 'italic', marginBottom: '2px', color: '#000' }}>
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <ul style={{ margin: '2px 0 0 0', paddingLeft: '24px', listStyleType: 'disc', listStylePosition: 'outside' }}>
                      {(Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => (
                        <li key={j} style={{ marginBottom: '3px', paddingLeft: '4px' }}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          );
          
          if (section.key === 'projects' && data.projects?.length > 0) return (
            <div key={section.key} className="resume-section">
              <div style={titleStyle}>{section.title}</div>
              {data.projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 'bold', color: '#000', fontSize: '1.05em' }}>{proj.name}</span>
                    {proj.date && <span style={{ fontSize: '0.95em' }}>{proj.date}</span>}
                  </div>
                  {proj.subtitle && (
                      <div style={{ fontStyle: 'italic', marginBottom: '2px', color: '#000' }}>{proj.subtitle}</div>
                  )}
                  {proj.description && (
                    <ul style={{ margin: '2px 0 0 0', paddingLeft: '24px', listStyleType: 'disc', listStylePosition: 'outside' }}>
                      {(Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => (
                         <li key={j} style={{ marginBottom: '3px', paddingLeft: '4px' }}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          );
          
          if (section.key === 'skills' && data.skills?.length > 0) return (
            <div key={section.key} className="resume-section">
              <div style={titleStyle}>{section.title}</div>
              <div style={{ paddingLeft: '4px' }}>
                {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skillGroup, j) => {
                  if (typeof skillGroup === 'object' && skillGroup.category) {
                    const skillNames = (skillGroup.items || []).map(item => typeof item === 'string' ? item : item.name).filter(Boolean).join(', ');
                    return (
                      <div key={j} style={{ marginBottom: '2px' }}>
                        <span style={{ fontWeight: 'bold', color: '#000' }}>{skillGroup.category}: </span>{skillNames}
                      </div>
                    );
                  }
                  return <div key={j} style={{ marginBottom: '2px' }}>{renderSkillText(skillGroup)}</div>;
                })}
              </div>
            </div>
          );
          
          if (section.isCustom && data[section.key]) return (
            <div key={section.key} className="resume-section">
              <div style={titleStyle}>{section.title}</div>
              {section.type === 'text' ? <div style={{ whiteSpace: 'pre-wrap', paddingLeft: '4px' }}>{data[section.key]}</div> : (
                section.title.toLowerCase() === 'languages' ? (
                  <div style={{ paddingLeft: '4px' }}>{(Array.isArray(data[section.key]) ? data[section.key] : []).map(lang => typeof lang === 'string' ? lang : (lang.bulletPoints || []).join(' ')).join(' | ')}</div>
                ) : (
                  Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      {(item.title || item.date) && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 'bold', color: '#000' }}>
                            <span>{item.title || ''}</span>
                            <span style={{ fontWeight: 'normal', whiteSpace: 'nowrap', fontSize: '0.95em' }}>{item.date || ''}</span>
                          </div>
                      )}
                      {item.bulletPoints && (
                        <ul style={{ margin: (item.title || item.date) ? '2px 0 0 0' : '0', paddingLeft: '24px', listStyleType: 'disc', listStylePosition: 'outside' }}>
                          {(Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => (
                            <li key={bIdx} style={{ marginBottom: '3px', paddingLeft: '4px' }}>{b}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                )
              )}
            </div>
          );
          return null;
        })}
      </div>
    );
};

export const PreviewPanel = () => {
  const { activeResume, toggleResumeVisibility, documentStyle, updateDocumentStyle } = useResumeStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!activeResume) return null;
  const { resumeData, templateName = 'jakes-resume' } = activeResume;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/p/${activeResume.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const blob = await pdf(<ResumePDF data={resumeData} templateName={templateName} documentStyle={documentStyle} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); 
      link.href = url; 
      link.download = `${resumeData.personalInfo?.firstName || 'My'}_Resume.pdf`;
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link);
      URL.revokeObjectURL(url); 
    } catch (error) {
      alert("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-[#18181b] overflow-hidden">
      <div className="absolute top-4 w-full flex justify-center z-50 pointer-events-none px-4">
        <div className="bg-[#18181b]/95 backdrop-blur-md shadow-2xl rounded-2xl border border-zinc-800 p-2 flex flex-col gap-2 pointer-events-auto w-full max-w-2xl">
            <div className="flex items-center justify-between w-full px-1">
                <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Editor Settings</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowTemplates(true)} className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 px-3 py-1.5 rounded-xl transition-colors">
                        <FileText size={14} /> <span className="hidden sm:inline">Templates</span>
                    </button>
                    <div className="relative">
                        <button onClick={() => setShowShareMenu(!showShareMenu)} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl transition-all ${activeResume.isPublic ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'}`}>
                            <Share2 size={14} className={activeResume.isPublic ? "text-indigo-400" : "text-zinc-400"}/>
                            <span className="hidden sm:inline">Share</span>
                        </button>
                        {showShareMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-[#18181b] border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
                                <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-zinc-300">Public Link</span>
                                    <input type="checkbox" checked={activeResume.isPublic} onChange={() => toggleResumeVisibility(activeResume._id, activeResume.isPublic)} className="accent-indigo-500 w-4 h-4 cursor-pointer" />
                                </div>
                                <div className="p-3">
                                    {activeResume.isPublic ? (
                                        <button onClick={handleCopyLink} className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-800 transition-colors">
                                            {copied ? 'Link Copied!' : 'Copy Link'}
                                        </button>
                                    ) : (
                                        <p className="text-xs text-zinc-500 text-center font-medium">Enable sharing to generate link.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={handleDownload} disabled={isExporting} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-70">
                        <Download size={14}/> <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Download PDF'}</span>
                    </button>
                </div>
            </div>
            <div className="h-px w-full bg-zinc-800"></div>
            <div className="flex flex-wrap items-center gap-4 px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Font</span>
                  <select value={documentStyle?.fontFamily || 'Times-Roman'} onChange={(e) => updateDocumentStyle({ fontFamily: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-zinc-800 transition-colors">
                      <option value="Times-Roman">Classic Serif</option>
                      <option value="Helvetica">Modern Sans</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Size (pt)</span>
                  <input type="number" min="8" max="18" value={documentStyle?.fontSize || 11} onChange={(e) => updateDocumentStyle({ fontSize: Number(e.target.value) })} className="bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-lg px-2 py-1 w-16 outline-none hover:bg-zinc-800 transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Spacing</span>
                  <select value={documentStyle?.lineSpacing || 'standard'} onChange={(e) => updateDocumentStyle({ lineSpacing: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-zinc-800 transition-colors">
                      <option value="tight">Tight</option>
                      <option value="standard">Normal</option>
                      <option value="loose">Loose</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wide">Margins</span>
                  <select value={documentStyle?.margins || 'standard'} onChange={(e) => updateDocumentStyle({ margins: e.target.value })} className="bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 rounded-lg px-2 py-1 outline-none cursor-pointer hover:bg-zinc-800 transition-colors">
                      <option value="compact">Narrow</option>
                      <option value="standard">Normal</option>
                      <option value="spacious">Wide</option>
                  </select>
                </div>
            </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto relative custom-scrollbar">
        <ScaledA4Viewer>
          <DynamicTemplate data={resumeData} documentStyle={documentStyle || {}} />
        </ScaledA4Viewer>
      </div>
      <TemplateSelector isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
    </div>
  );
};