


// import React, { useState } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { CheckCircle2, AlertCircle, ArrowRight, Copy, Check, Info } from 'lucide-react';

// export default function AnalysisResults({ results }) {
//   const { activeResume, updateResumeData } = useResumeStore();
//   const [copiedIndex, setCopiedIndex] = useState(null);

//   if (!results) return null;

//   // Premium ATS Score Ring Color Logic
//   const getScoreColor = (score) => {
//     if (score >= 80) return 'text-emerald-500 border-emerald-500';
//     if (score >= 60) return 'text-amber-500 border-amber-500';
//     return 'text-red-500 border-red-500';
//   };

//   const handleCopy = (text, index) => {
//     navigator.clipboard.writeText(text);
//     setCopiedIndex(index);
//     setTimeout(() => setCopiedIndex(null), 2000);
//   };

//   const handleApply = (section, recommendedText, originalText) => {
//     const normSection = section.toLowerCase();
//     let newData = { ...activeResume.resumeData };

//     try {
//       if (normSection === 'summary') {
//         newData.summary = recommendedText;
//       } else if (['experience', 'education', 'projects'].includes(normSection)) {
//         let applied = false;
//         // Search through the arrays to find the original text and replace it
//         if (newData[normSection]) {
//             newData[normSection] = newData[normSection].map(item => {
//               let updatedItem = { ...item };
//               if (updatedItem.description && updatedItem.description.includes(originalText)) {
//                 updatedItem.description = updatedItem.description.replace(originalText, recommendedText);
//                 applied = true;
//               }
//               return updatedItem;
//             });
//         }
//         if (!applied) {
//             alert("Could not automatically place this text. Please use the Copy button instead.");
//             return;
//         }
//       } else {
//         alert("Please copy and paste this recommendation manually into your layout.");
//         return;
//       }
      
//       updateResumeData(newData);
//     } catch (e) {
//       alert("Error applying change. Please copy the text manually.");
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6 pb-10">
      
//       {/* Score Header Card */}
//       <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex items-center gap-6">
//         <div className={`relative flex items-center justify-center w-20 h-20 rounded-full border-4 shrink-0 bg-slate-50 shadow-inner ${getScoreColor(results.score)}`}>
//           <span className="text-2xl font-black tracking-tighter">{results.score}</span>
//         </div>
//         <div>
//           <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">ATS Match Score</h3>
//           <p className="text-sm text-slate-500 leading-relaxed">{results.feedback}</p>
//         </div>
//       </div>

//       {/* Suggestions List */}
//       <div className="space-y-4">
//         <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider pl-1">Targeted Improvements</h4>
        
//         {results.suggestions?.map((suggestion, index) => {
//           const isSkill = suggestion.section?.toLowerCase().includes('skill');
//           const isCoreSection = ['summary', 'experience', 'education', 'projects'].includes(suggestion.section?.toLowerCase());

//           return (
//             <div key={index} className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 transition-all hover:shadow-lg group">
              
//               {/* Section Badge */}
//               <div className="flex items-center justify-between mb-4">
//                 <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
//                   {suggestion.section}
//                 </span>
//                 {isSkill && (
//                   <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md flex items-center gap-1">
//                     <Info size={12}/> Manual formatting required
//                   </span>
//                 )}
//               </div>

//               {/* Text Diffing */}
//               <div className="space-y-3 mb-5">
//                 {!isSkill && suggestion.original && (
//                   <div className="bg-red-50/50 p-3 rounded-xl border border-red-100/50 relative">
//                     <div className="absolute -left-1.5 top-3.5 w-3 h-3 bg-red-100 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div></div>
//                     <p className="text-sm text-red-900/70 line-through pl-2">{suggestion.original}</p>
//                   </div>
//                 )}
                
//                 <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 relative">
//                   <div className="absolute -left-1.5 top-3.5 w-3 h-3 bg-emerald-100 rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div></div>
//                   <p className="text-sm text-emerald-900 font-medium pl-2 leading-relaxed">{suggestion.recommended}</p>
//                 </div>
//               </div>

//               {/* Action Footer */}
//               <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
//                 <p className="text-xs text-slate-400 italic max-w-[60%] leading-relaxed">
//                   "{suggestion.reason}"
//                 </p>

//                 <div className="flex gap-2">
//                   <button 
//                     onClick={() => handleCopy(suggestion.recommended, index)}
//                     className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
//                     title="Copy to clipboard"
//                   >
//                     {copiedIndex === index ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
//                   </button>

//                   {/* 🚀 FIXED: Only show "Add to Editor" for safe core sections, NEVER for skills */}
//                   {!isSkill && isCoreSection && (
//                     <button 
//                       onClick={() => handleApply(suggestion.section, suggestion.recommended, suggestion.original)}
//                       className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 border border-indigo-100 hover:border-transparent shadow-sm"
//                     >
//                       Add to Editor <ArrowRight size={14} />
//                     </button>
//                   )}
//                 </div>
//               </div>

//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }














import React from 'react';
import styles from './analysis.module.css';
import { FiAlertCircle, FiCheckCircle, FiStar } from 'react-icons/fi';

export const AnalysisResults = ({ results }) => {
  return (
    <div className={styles.resultsContainer}>
      <div className={styles.scoreHeader}>
        <div className={styles.radialProgress} style={{'--value': results.score}}>
          {results.score}%
        </div>
        <h3>ATS Optimization</h3>
      </div>

      <div className={styles.feedbackSection}>
        <header><FiStar /> Strategic Advice</header>
        <p>{results.strategicFeedback}</p>
      </div>

      <div className={styles.keywordGrid}>
        <header>Missing Keywords</header>
        <div className={styles.chips}>
          {results.missingKeywords?.map(kw => (
            <span key={kw} className={styles.keywordChip}><FiAlertCircle /> {kw}</span>
          ))}
        </div>
      </div>
    </div>
  );
};