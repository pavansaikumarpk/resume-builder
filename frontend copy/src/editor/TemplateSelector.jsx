



// import React from 'react';
// import { createPortal } from 'react-dom'; // 🚀 IMPORT REACT PORTALS
// import { useResumeStore } from '../store/useResumeStore';
// import { FiCheck, FiLayout, FiX } from 'react-icons/fi';
// import styles from './templateSelector.module.css';

// const TEMPLATES = [
//   { 
//     id: 'jakes-resume', 
//     name: 'Clean Classic (Tech)', 
//     color: '#3b82f6', 
//     preview: '/jake.png' 
//   },
//   { 
//     id: 'harvard-ats', 
//     name: 'Elite Suite (Harvard ATS)', 
//     color: '#1e293b', 
//     preview: '/classic.png' 
//   },
//   { 
//     id: 'latex-classic', 
//     name: 'Academic (LaTeX)', 
//     color: '#0f172a', 
//     preview: '/academic.png' 
//   }
// ];

// export const TemplateSelector = ({ isOpen, onClose }) => {
//   const { activeResume, updateTemplateName } = useResumeStore();
  
//   if (!isOpen || !activeResume) return null;

//   const activeTemplate = activeResume.templateName || 'jakes-resume';

//   // 🚀 TELEPORT THE MODAL TO THE <body> TAG SO IT ESCAPES ALL Z-INDEX TRAPS
//   return createPortal(
//     <div className={styles.overlay}>
//       <div className={styles.modal}>
        
//         <header className={styles.header}>
//           <div className={styles.title}>
//             <FiLayout size={20} className="text-indigo-500" />
//             <span>Select Template Blueprint</span>
//           </div>
//           <button onClick={onClose} className={styles.closeBtn}><FiX size={24} /></button>
//         </header>
        
//         <div className={styles.grid}>
//           {TEMPLATES.map((tpl) => (
//             <div 
//               key={tpl.id} 
//               className={`${styles.templateCard} ${activeTemplate === tpl.id ? styles.active : ''}`}
//               onClick={() => updateTemplateName(tpl.id)}
//             >
//               <div className={styles.previewWrapper}>
//                 <img 
//                   src={tpl.preview} 
//                   alt={tpl.name} 
//                   className={`w-full h-full object-cover transition-opacity ${activeTemplate === tpl.id ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`} 
//                 />
//                 {activeTemplate === tpl.id && (
//                   <div className={styles.activeBadge}>
//                     <FiCheck size={16} />
//                   </div>
//                 )}
//               </div>
//               <div className={styles.info}>
//                 <span className={styles.name}>{tpl.name}</span>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <footer className={styles.footer}>
//           <button className={styles.applyBtn} onClick={onClose}>Apply & Close</button>
//         </footer>
        
//       </div>
//     </div>,
//     document.body // <-- The destination for the Portal
//   );
// };














import React from 'react';
import { createPortal } from 'react-dom';
import { useResumeStore } from '../store/useResumeStore';
import { Check, LayoutTemplate, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TEMPLATES = [
  { id: 'jakes-resume', name: 'Clean Classic (Tech)', preview: '/jake.png' },
  { id: 'harvard-ats', name: 'Elite Suite (Harvard ATS)', preview: '/classic.png' },
  { id: 'latex-classic', name: 'Academic (LaTeX)', preview: '/academic.png' }
];

export const TemplateSelector = ({ isOpen, onClose }) => {
  const { activeResume, updateTemplateName } = useResumeStore();
  
  if (!activeResume) return null;
  const activeTemplate = activeResume.templateName || 'jakes-resume';

  // Autocloses the modal 350ms after selection for a premium feel
  const handleSelect = (id) => {
    updateTemplateName(id);
    setTimeout(() => {
      onClose();
    }, 350); 
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <LayoutTemplate size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">Select Blueprint</h2>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Optimized for ATS systems</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </header>
            
            <div className="p-8 overflow-y-auto custom-scrollbar bg-[#fafafa]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TEMPLATES.map((tpl) => {
                  const isActive = activeTemplate === tpl.id;
                  return (
                    <div 
                      key={tpl.id} 
                      onClick={() => handleSelect(tpl.id)}
                      className={`group relative cursor-pointer rounded-2xl transition-all duration-300 ${
                        isActive ? 'ring-4 ring-sky-500 ring-offset-4 shadow-xl scale-[1.02]' : 'hover:shadow-xl hover:-translate-y-1'
                      }`}
                    >
                      <div className="aspect-[1/1.4] w-full rounded-2xl overflow-hidden border border-slate-200 bg-white relative">
                        <img 
                          src={tpl.preview} 
                          alt={tpl.name} 
                          className={`w-full h-full object-cover transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100 scale-105 group-hover:scale-100'}`} 
                        />
                        {isActive && (
                          <div className="absolute top-4 right-4 h-8 w-8 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-lg">
                            <Check size={18} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <span className={`text-sm font-bold transition-colors ${isActive ? 'text-sky-600' : 'text-slate-700 group-hover:text-slate-900'}`}>
                          {tpl.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};