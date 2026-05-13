// import React from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { FiCheck, FiLayout, FiX } from 'react-icons/fi';
// import styles from './templateSelector.module.css';

// const TEMPLATES = [
//   { id: 'modern', name: 'Modern Elite', color: '#3b82f6', preview: 'https://placehold.co/400x600?text=Modern' },
//   { id: 'executive', name: 'Executive Suite', color: '#1e293b', preview: 'https://placehold.co/400x600?text=Executive' },
//   { id: 'minimal', name: 'Clean Slate', color: '#64748b', preview: 'https://placehold.co/400x600?text=Minimal' },
//   { id: 'creative', name: 'Creative Impact', color: '#ec4899', preview: 'https://placehold.co/400x600?text=Creative' },
// ];

// export const TemplateSelector = ({ isOpen, onClose }) => {
//   const { resume, setTemplate } = useResumeStore();
//   const activeTemplate = resume?.templateName || 'modern';

//   if (!isOpen) return null;

//   return (
//     <div className={styles.overlay}>
//       <div className={styles.drawer}>
//         <header className={styles.header}>
//           <div className={styles.title}>
//             <FiLayout />
//             <span>Select Template</span>
//           </div>
//           <button onClick={onClose} className={styles.closeBtn}><FiX /></button>
//         </header>

//         <div className={styles.grid}>
//           {TEMPLATES.map((tpl) => (
//             <div 
//               key={tpl.id} 
//               className={`${styles.templateCard} ${activeTemplate === tpl.id ? styles.active : ''}`}
//               onClick={() => setTemplate(tpl.id)}
//             >
//               <div className={styles.previewWrapper}>
//                 <img src={tpl.preview} alt={tpl.name} />
//                 {activeTemplate === tpl.id && (
//                   <div className={styles.activeBadge}>
//                     <FiCheck />
//                   </div>
//                 )}
//               </div>
//               <div className={styles.info}>
//                 <span className={styles.name}>{tpl.name}</span>
//                 <div className={styles.colorDot} style={{ background: tpl.color }} />
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <footer className={styles.footer}>
//           <button className={styles.applyBtn} onClick={onClose}>Apply Selection</button>
//         </footer>
//       </div>
//     </div>
//   );
// };







import React from 'react';
import { createPortal } from 'react-dom'; // 🚀 IMPORT REACT PORTALS
import { useResumeStore } from '../store/useResumeStore';
import { FiCheck, FiLayout, FiX } from 'react-icons/fi';
import styles from './templateSelector.module.css';

const TEMPLATES = [
  { 
    id: 'jakes-resume', 
    name: 'Clean Classic (Tech)', 
    color: '#3b82f6', 
    preview: '/jake.png' 
  },
  { 
    id: 'harvard-ats', 
    name: 'Elite Suite (Harvard ATS)', 
    color: '#1e293b', 
    preview: '/classic.png' 
  },
  { 
    id: 'latex-classic', 
    name: 'Academic (LaTeX)', 
    color: '#0f172a', 
    preview: '/academic.png' 
  }
];

export const TemplateSelector = ({ isOpen, onClose }) => {
  const { activeResume, updateTemplateName } = useResumeStore();
  
  if (!isOpen || !activeResume) return null;

  const activeTemplate = activeResume.templateName || 'jakes-resume';

  // 🚀 TELEPORT THE MODAL TO THE <body> TAG SO IT ESCAPES ALL Z-INDEX TRAPS
  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        <header className={styles.header}>
          <div className={styles.title}>
            <FiLayout size={20} className="text-indigo-500" />
            <span>Select Template Blueprint</span>
          </div>
          <button onClick={onClose} className={styles.closeBtn}><FiX size={24} /></button>
        </header>
        
        <div className={styles.grid}>
          {TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id} 
              className={`${styles.templateCard} ${activeTemplate === tpl.id ? styles.active : ''}`}
              onClick={() => updateTemplateName(tpl.id)}
            >
              <div className={styles.previewWrapper}>
                <img 
                  src={tpl.preview} 
                  alt={tpl.name} 
                  className={`w-full h-full object-cover transition-opacity ${activeTemplate === tpl.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`} 
                />
                {activeTemplate === tpl.id && (
                  <div className={styles.activeBadge}>
                    <FiCheck size={16} />
                  </div>
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{tpl.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        <footer className={styles.footer}>
          <button className={styles.applyBtn} onClick={onClose}>Apply & Close</button>
        </footer>
        
      </div>
    </div>,
    document.body // <-- The destination for the Portal
  );
};