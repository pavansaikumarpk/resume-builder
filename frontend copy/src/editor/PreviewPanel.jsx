









// import React, { useState, useEffect, useRef } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { FiDownload, FiLayers, FiShare2, FiGlobe, FiLock, FiCopy, FiType, FiMaximize } from 'react-icons/fi';
// import { TemplateSelector } from './TemplateSelector';
// import api from '../utils/api';

// const ScaledA4Viewer = ({ children }) => {
//   const containerRef = useRef(null);
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     const resizeObserver = new ResizeObserver((entries) => {
//       for (let entry of entries) {
//         const availableWidth = entry.contentRect.width - 64; 
//         const newScale = availableWidth / 794;
//         setScale(newScale > 1.2 ? 1.2 : newScale);
//       }
//     });
//     if (containerRef.current) resizeObserver.observe(containerRef.current);
//     return () => resizeObserver.disconnect();
//   }, []);

//   return (
//     <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', height: `${1123 * scale}px`, overflow: 'hidden' }}>
//       <div style={{ width: '794px', height: '1123px', transform: `scale(${scale})`, transformOrigin: 'top center', backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }}>
//         {children}
//       </div>
//     </div>
//   );
// };

// const renderSkillText = (text) => {
//   if (typeof text === 'string' && text.includes(':')) {
//     const parts = text.split(':');
//     return <><span style={{ fontWeight: 'bold' }}>{parts[0]}:</span>{parts.slice(1).join(':')}</>;
//   }
//   return text;
// };

// // 🚀 UPGRADED: DYNAMIC THEME ENGINE INJECTION
// const DynamicTemplate = ({ data, templateStyle, documentStyle }) => {
//   const personal = data.personalInfo || data.personalDetails || {};
//   const sections = data.sections || [];
//   const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';
//   const isHarvard = templateStyle === 'harvard-ats';
  
//   // Theme Engine Map
//   const sizeMap = { compact: '9pt', standard: '11pt', spacious: '13pt' };
//   const currentFontSize = sizeMap[documentStyle.fontSize] || '11pt';
//   const currentFontFamily = documentStyle.fontFamily || 'Helvetica';

//   const titleStyle = isHarvard
//     ? { fontSize: '1.1em', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #000', marginBottom: '8px', marginTop: '16px' }
//     : { fontSize: '1.2em', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px', marginTop: '16px' };

//   return (
//     <div style={{ fontFamily: currentFontFamily, fontSize: currentFontSize, color: '#000', padding: '40px', width: '100%', height: '100%', boxSizing: 'border-box' }}>
//       <div style={{ textAlign: 'center', marginBottom: '16px' }}>
//         <div style={{ fontSize: '2.2em', fontWeight: 'bold' }}>{fullName}</div>
//         <div style={{ fontSize: '0.9em', marginTop: '4px' }}>{[personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean).join(isHarvard ? '   ' : ' | ')}</div>
//       </div>

//       {sections.map(section => {
//         if (section.key === 'personalDetails') return null;

//         if (section.key === 'education' && data.education?.length > 0) return (
//           <div key={section.key}>
//             <div style={titleStyle}>{section.title}</div>
//             {data.education.map((edu, i) => (
//               <div key={i} style={{ marginBottom: '8px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>{edu.institution}</span><span style={{ fontWeight: 'normal' }}>{edu.startDate} - {edu.endDate}</span></div>
//                 <div>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</div>
//               </div>
//             ))}
//           </div>
//         );

//         if (section.key === 'experience' && data.experience?.length > 0) return (
//           <div key={section.key}>
//             <div style={titleStyle}>{section.title}</div>
//             {data.experience.map((exp, i) => (
//               <div key={i} style={{ marginBottom: '12px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>{isHarvard ? exp.company : (exp.position || exp.jobTitle)}</span><span style={{ fontWeight: 'normal' }}>{exp.startDate} - {exp.endDate}</span></div>
//                 <div style={{ fontStyle: 'italic' }}>{isHarvard ? (exp.position || exp.jobTitle) : exp.company}</div>
//                 {exp.description && <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>{(Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => <li key={j} style={{ marginBottom: '2px' }}>{d}</li>)}</ul>}
//               </div>
//             ))}
//           </div>
//         );

//         if (section.key === 'projects' && data.projects?.length > 0) return (
//           <div key={section.key}>
//             <div style={titleStyle}>{section.title}</div>
//             {data.projects.map((proj, i) => (
//               <div key={i} style={{ marginBottom: '8px' }}>
//                 <div style={{ fontWeight: 'bold' }}>{proj.name}</div>
//                 {proj.description && <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>{(Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => <li key={j} style={{ marginBottom: '2px' }}>{d}</li>)}</ul>}
//               </div>
//             ))}
//           </div>
//         );

//         if (section.key === 'summary' && data.summary) return (
//           <div key={section.key}><div style={titleStyle}>{section.title}</div><div>{data.summary}</div></div>
//         );

//         if (section.key === 'skills' && data.skills?.length > 0) return (
//           <div key={section.key}>
//             <div style={titleStyle}>{section.title}</div>
//             <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>
//               {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skill, j) => <li key={j} style={{ marginBottom: '2px' }}>{renderSkillText(skill)}</li>)}
//             </ul>
//           </div>
//         );

//         if (section.isCustom && data[section.key]) return (
//           <div key={section.key}>
//             <div style={titleStyle}>{section.title}</div>
//             {section.type === 'text' ? <div style={{ whiteSpace: 'pre-wrap' }}>{data[section.key]}</div> : (
//               Array.isArray(data[section.key]) && data[section.key].map((item, idx) => (
//                 <div key={idx} style={{ marginBottom: '8px' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>{item.title}</span><span style={{ fontWeight: 'normal' }}>{item.date}</span></div>
//                   {item.bulletPoints && <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>{(Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => <li key={bIdx}>{b}</li>)}</ul>}
//                 </div>
//               ))
//             )}
//           </div>
//         );
//         return null;
//       })}
//     </div>
//   );
// };

// export const PreviewPanel = () => {
//   const { activeResume, toggleResumeVisibility, documentStyle, updateDocumentStyle } = useResumeStore();
//   const [showTemplates, setShowTemplates] = useState(false);
//   const [showShareMenu, setShowShareMenu] = useState(false);
//   const [isExporting, setIsExporting] = useState(false);

//   if (!activeResume) return null;

//   const { resumeData, templateName = 'jakes-resume' } = activeResume;

//   const handleCopyLink = () => {
//     const url = `${window.location.origin}/p/${activeResume.slug}`;
//     navigator.clipboard.writeText(url);
//     alert("Public link copied to clipboard!");
//     setShowShareMenu(false);
//   };

//   const handleDownload = async () => {
//     try {
//       setIsExporting(true);
//       // 🚀 Pass the style choices to the backend generator!
//       const response = await api.post(`/resume/preview/${activeResume._id}`, { resumeData, templateName, documentStyle }, { responseType: 'blob' });
//       const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
//       const link = document.createElement('a'); link.href = url; link.setAttribute('download', `${resumeData.personalInfo?.firstName || 'My'}_Resume.pdf`);
//       document.body.appendChild(link); link.click(); document.body.removeChild(link);
//     } catch (error) { 
//       alert("Failed to export PDF."); 
//     } finally { 
//       setIsExporting(false); 
//     }
//   };

//   return (
//     <div className="h-full flex flex-col bg-[#1e1e1e]">
//       {/* 🚀 NEW DESIGN & SHARE TOOLBAR */}
//       <header className="h-auto py-2 px-4 bg-[#252526] border-b border-[#333333] flex flex-col shrink-0 shadow-md z-10 gap-2">
//         <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
//                 <FiLayers className="text-indigo-400"/> Live Render
//             </div>

//             <div className="flex items-center gap-2">
//                 <div className="relative">
//                     <button onClick={() => setShowShareMenu(!showShareMenu)} className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all border ${activeResume.isPublic ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' : 'bg-[#3c3c3c] text-slate-200 border-[#555]'}`}>
//                         <FiShare2 /> Share
//                     </button>
//                     {showShareMenu && (
//                         <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
//                             <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
//                                 <span className="text-xs font-bold text-slate-700 uppercase">Web Portfolio</span>
//                                 <input type="checkbox" checked={activeResume.isPublic} onChange={() => toggleResumeVisibility(activeResume._id, activeResume.isPublic)} />
//                             </div>
//                             <div className="p-4 flex flex-col gap-3">
//                                 {activeResume.isPublic ? (
//                                     <button onClick={handleCopyLink} className="w-full py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center justify-center gap-2"><FiCopy /> Copy Link</button>
//                                 ) : (
//                                     <p className="text-xs text-slate-500 text-center"><FiLock className="mx-auto mb-1"/>Make public to share link.</p>
//                                 )}
//                             </div>
//                         </div>
//                     )}
//                 </div>
                
//                 <button onClick={handleDownload} disabled={isExporting} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md shadow-lg flex items-center gap-1.5 transition-all">
//                     <FiDownload /> {isExporting ? 'Generating...' : 'Export PDF'}
//                 </button>
//             </div>
//         </div>

//         {/* 🚀 THEME ENGINE CONTROLS */}
//         <div className="flex items-center gap-4 border-t border-[#3c3c3c] pt-2">
//             <div className="flex items-center gap-2">
//                 <FiType className="text-slate-400 text-xs"/>
//                 <select value={documentStyle.fontFamily} onChange={(e) => updateDocumentStyle({ fontFamily: e.target.value })} className="bg-[#3c3c3c] text-slate-200 text-xs px-2 py-1 rounded border border-[#555] outline-none">
//                     <option value="Helvetica">Modern (Helvetica)</option>
//                     <option value="Times-Roman">Classic (Times)</option>
//                     <option value="Courier">Code (Courier)</option>
//                 </select>
//             </div>
//             <div className="flex items-center gap-2">
//                 <FiMaximize className="text-slate-400 text-xs"/>
//                 <select value={documentStyle.fontSize} onChange={(e) => updateDocumentStyle({ fontSize: e.target.value })} className="bg-[#3c3c3c] text-slate-200 text-xs px-2 py-1 rounded border border-[#555] outline-none">
//                     <option value="compact">Compact Size</option>
//                     <option value="standard">Standard Size</option>
//                     <option value="spacious">Spacious Size</option>
//                 </select>
//             </div>
//             <button onClick={() => setShowTemplates(true)} className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 font-bold underline">Change Template</button>
//         </div>
//       </header>

//       <div className="flex-1 overflow-y-auto p-8 relative flex justify-center custom-scrollbar">
//         <ScaledA4Viewer>
//           <DynamicTemplate data={resumeData} templateStyle={templateName} documentStyle={documentStyle} />
//         </ScaledA4Viewer>
//       </div>

//       <TemplateSelector isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
//     </div>
//   );
// };






import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { FiDownload, FiLayers, FiShare2, FiGlobe, FiLock, FiCopy, FiType, FiMaximize } from 'react-icons/fi';
import { TemplateSelector } from './TemplateSelector';
import api from '../utils/api';

const ScaledA4Viewer = ({ children }) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const availableWidth = entry.contentRect.width - 64; 
        const newScale = availableWidth / 794;
        setScale(newScale > 1.2 ? 1.2 : newScale);
      }
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center', height: `${1123 * scale}px`, overflow: 'hidden' }}>
      <div style={{ width: '794px', height: '1123px', transform: `scale(${scale})`, transformOrigin: 'top center', backgroundColor: '#ffffff', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }}>
        {children}
      </div>
    </div>
  );
};

const renderSkillText = (text) => {
  if (typeof text === 'string' && text.includes(':')) {
    const parts = text.split(':');
    return <><span style={{ fontWeight: 'bold' }}>{parts[0]}:</span>{parts.slice(1).join(':')}</>;
  }
  return text;
};

// 🚀 UPGRADED: Dynamic Template now supports LaTeX layout
const DynamicTemplate = ({ data, templateStyle, documentStyle }) => {
  const personal = data.personalInfo || data.personalDetails || {};
  const sections = data.sections || [];
  const fullName = personal.name || `${personal.firstName || ''} ${personal.lastName || ''}`.trim() || 'Your Name';
  
  const isHarvard = templateStyle === 'harvard-ats';
  const isLatex = templateStyle === 'latex-classic';
  
  const sizeMap = { compact: '9pt', standard: '11pt', spacious: '13pt' };
  const currentFontSize = sizeMap[documentStyle?.fontSize] || '11pt';
  const currentFontFamily = documentStyle?.fontFamily || 'Helvetica';

  let titleStyle = { fontSize: '1.2em', fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '6px', marginTop: '16px' };
  if (isHarvard) titleStyle = { fontSize: '1.1em', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #000', marginBottom: '8px', marginTop: '16px' };
  if (isLatex) titleStyle = { fontSize: '1.2em', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '6px', marginTop: '12px' };

  return (
    <div style={{ fontFamily: currentFontFamily, fontSize: currentFontSize, color: '#000', padding: isLatex ? '30px 40px' : '40px', width: '100%', height: '100%', boxSizing: 'border-box' }}>
      
      {/* HEADER LOGIC */}
      {isLatex ? (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4px' }}>
             <div style={{ fontSize: '2.4em', fontWeight: 'bold' }}>{fullName}</div>
             <div style={{ fontSize: '0.9em' }}>{personal.phone}</div>
          </div>
          <div style={{ fontSize: '0.9em', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span>{personal.email}</span>
            {personal.linkedin && <span>| {personal.linkedin}</span>}
            {personal.github && <span>| {personal.github}</span>}
            {personal.location && <span>| {personal.location}</span>}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '2.2em', fontWeight: 'bold' }}>{fullName}</div>
          <div style={{ fontSize: '0.9em', marginTop: '4px' }}>{[personal.email, personal.phone, personal.location, personal.linkedin, personal.github].filter(Boolean).join(isHarvard ? '   ' : ' | ')}</div>
        </div>
      )}

      {/* BODY SECTIONS */}
      {sections.map(section => {
        if (section.key === 'personalDetails') return null;

        if (section.key === 'education' && data.education?.length > 0) return (
          <div key={section.key}>
            <div style={titleStyle}>{section.title}</div>
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{isLatex ? `${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}` : edu.institution}</span>
                  <span style={{ fontWeight: isLatex ? 'bold' : 'normal' }}>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div>{isLatex ? edu.institution : `${edu.degree} ${edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}`}</div>
              </div>
            ))}
          </div>
        );

        if (section.key === 'experience' && data.experience?.length > 0) return (
          <div key={section.key}>
            <div style={titleStyle}>{section.title}</div>
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>{isHarvard ? exp.company : (exp.position || exp.jobTitle)}</span>
                  <span style={{ fontWeight: isLatex ? 'bold' : 'normal' }}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div style={{ fontStyle: 'italic' }}>{isHarvard ? (exp.position || exp.jobTitle) : exp.company}</div>
                {exp.description && <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>{(Array.isArray(exp.description) ? exp.description : [exp.description]).filter(Boolean).map((d, j) => <li key={j} style={{ marginBottom: '2px' }}>{d}</li>)}</ul>}
              </div>
            ))}
          </div>
        );

        if (section.key === 'projects' && data.projects?.length > 0) return (
          <div key={section.key}>
            <div style={titleStyle}>{section.title}</div>
            {data.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold' }}>{proj.name}</div>
                {proj.description && <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>{(Array.isArray(proj.description) ? proj.description : [proj.description]).filter(Boolean).map((d, j) => <li key={j} style={{ marginBottom: '2px' }}>{d}</li>)}</ul>}
              </div>
            ))}
          </div>
        );

        if (section.key === 'summary' && data.summary) return (
          <div key={section.key}><div style={titleStyle}>{section.title}</div><div>{data.summary}</div></div>
        );

        if (section.key === 'skills' && data.skills?.length > 0) return (
          <div key={section.key}>
            <div style={titleStyle}>{section.title}</div>
            <ul style={{ margin: '4px 0 0 0', paddingLeft: isLatex ? '0' : '20px', listStyleType: isLatex ? 'none' : 'disc' }}>
              {(Array.isArray(data.skills) ? data.skills : [data.skills]).filter(Boolean).map((skill, j) => <li key={j} style={{ marginBottom: '2px' }}>{renderSkillText(skill)}</li>)}
            </ul>
          </div>
        );

        if (section.isCustom && data[section.key]) return (
          <div key={section.key}>
            <div style={titleStyle}>{section.title}</div>
            {section.type === 'text' ? <div style={{ whiteSpace: 'pre-wrap' }}>{data[section.key]}</div> : (
              Array.isArray(data[section.key]) && data[section.key].map((item, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>{item.title}</span><span style={{ fontWeight: 'normal' }}>{item.date}</span></div>
                  {item.bulletPoints && <ul style={{ margin: '4px 0 0 0', paddingLeft: '20px', listStyleType: 'disc' }}>{(Array.isArray(item.bulletPoints) ? item.bulletPoints : [item.bulletPoints]).filter(Boolean).map((b, bIdx) => <li key={bIdx}>{b}</li>)}</ul>}
                </div>
              ))
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

  if (!activeResume) return null;

  const { resumeData, templateName = 'jakes-resume' } = activeResume;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/p/${activeResume.slug}`;
    navigator.clipboard.writeText(url);
    alert("Public link copied to clipboard!");
    setShowShareMenu(false);
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const response = await api.post(`/resume/preview/${activeResume._id}`, { resumeData, templateName, documentStyle }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', `${resumeData.personalInfo?.firstName || 'My'}_Resume.pdf`);
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } catch (error) { 
      alert("Failed to export PDF."); 
    } finally { 
      setIsExporting(false); 
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <header className="h-auto py-2 px-4 bg-[#252526] border-b border-[#333333] flex flex-col shrink-0 shadow-md z-10 gap-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                <FiLayers className="text-indigo-400"/> Live Render
            </div>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <button onClick={() => setShowShareMenu(!showShareMenu)} className={`px-3 py-1.5 text-xs font-bold rounded-md flex items-center gap-1.5 transition-all border ${activeResume.isPublic ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50 hover:bg-emerald-900/50' : 'bg-[#3c3c3c] text-slate-200 border-[#555] hover:bg-[#4d4d4d]'}`}>
                        <FiShare2 /> Share
                    </button>
                    {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-700 uppercase">Web Portfolio</span>
                                <input type="checkbox" checked={activeResume.isPublic} onChange={() => toggleResumeVisibility(activeResume._id, activeResume.isPublic)} />
                            </div>
                            <div className="p-4 flex flex-col gap-3">
                                {activeResume.isPublic ? (
                                    <button onClick={handleCopyLink} className="w-full py-2 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 flex items-center justify-center gap-2"><FiCopy /> Copy Link</button>
                                ) : (
                                    <p className="text-xs text-slate-500 text-center"><FiLock className="mx-auto mb-1"/>Make public to share link.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                <button onClick={handleDownload} disabled={isExporting} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-md shadow-lg flex items-center gap-1.5 transition-all">
                    <FiDownload /> {isExporting ? 'Generating...' : 'Export PDF'}
                </button>
            </div>
        </div>

        <div className="flex items-center gap-4 border-t border-[#3c3c3c] pt-2">
            <div className="flex items-center gap-2">
                <FiType className="text-slate-400 text-xs"/>
                <select value={documentStyle?.fontFamily || 'Helvetica'} onChange={(e) => updateDocumentStyle({ fontFamily: e.target.value })} className="bg-[#3c3c3c] text-slate-200 text-xs px-2 py-1 rounded border border-[#555] outline-none">
                    <option value="Helvetica">Modern (Helvetica)</option>
                    <option value="Times-Roman">Classic (Times)</option>
                    <option value="Courier">Code (Courier)</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <FiMaximize className="text-slate-400 text-xs"/>
                <select value={documentStyle?.fontSize || 'standard'} onChange={(e) => updateDocumentStyle({ fontSize: e.target.value })} className="bg-[#3c3c3c] text-slate-200 text-xs px-2 py-1 rounded border border-[#555] outline-none">
                    <option value="compact">Compact Size</option>
                    <option value="standard">Standard Size</option>
                    <option value="spacious">Spacious Size</option>
                </select>
            </div>
            <button onClick={() => setShowTemplates(true)} className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 font-bold underline">Change Template</button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 relative flex justify-center custom-scrollbar">
        <ScaledA4Viewer>
          <DynamicTemplate data={resumeData} templateStyle={templateName} documentStyle={documentStyle || {}} />
        </ScaledA4Viewer>
      </div>

      <TemplateSelector isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
    </div>
  );
};