// import React, { useState } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { Sparkles, Loader2, Plus, RotateCcw, Target, Check, X, CheckCircle2 } from 'lucide-react';

// export const AnalysisPanel = () => {
//   const { 
//     generateBulletOptions, 
//     isTailoring, 
//     generatedBullets, 
//     appendBulletToResume, 
//     updateResumeData, 
//     activeResume, 
//     clearGeneratedBullets,
//     addSkillToCategory,
//     removeSkillFromResume
//   } = useResumeStore();
  
//   const [jdText, setJdText] = useState('');
//   const [selectedTone, setSelectedTone] = useState('impact');
//   const [appliedItems, setAppliedItems] = useState(new Set());

//   const handleGenerate = async () => {
//     if (jdText.trim().length < 20) return alert("Paste a valid job description.");
//     await generateBulletOptions(jdText, selectedTone);
//   };

//   const handleReset = () => {
//     clearGeneratedBullets();
//     setJdText('');
//     setAppliedItems(new Set());
//   };

//   const handleApplySummary = (newSummary, idx) => {
//     updateResumeData({ ...activeResume.resumeData, summary: newSummary });
//     setAppliedItems(prev => new Set(prev).add(`summary-${idx}`));
//   };

//   const handleApplyBullet = (sectionKey, itemTitle, bullet, uniqueId) => {
//     appendBulletToResume(sectionKey, itemTitle, bullet);
//     setAppliedItems(prev => new Set(prev).add(uniqueId));
//   };

//   const hasGranularData = generatedBullets?.tailoredItems && generatedBullets.tailoredItems.length > 0;

//   return (
//     <div className="h-full flex flex-col bg-zinc-50 font-sans">
      
//       <div className="px-5 py-4 bg-white border-b border-zinc-200 flex justify-between items-center sticky top-0 z-10">
//         <div className="flex items-center gap-2">
//             <Sparkles className="text-zinc-900" size={18} />
//             <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">AI Copilot</h2>
//         </div>
//         {generatedBullets && (
//              <button onClick={handleReset} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors">
//                  <RotateCcw size={14}/> Reset
//              </button>
//         )}
//       </div>

//       <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 pb-20">
        
//         {!generatedBullets && (
//             <div className="space-y-6 animate-in fade-in duration-300">
//                 <div className="space-y-2">
//                     <label className="text-xs font-semibold text-zinc-800">Target Job Description</label>
//                     <textarea 
//                         value={jdText}
//                         onChange={(e) => setJdText(e.target.value)}
//                         className="w-full h-48 p-4 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 resize-none text-sm shadow-sm transition-all placeholder:text-zinc-400"
//                         placeholder="Paste the job requirements here..."
//                     />
//                 </div>
                
//                 <button 
//                     onClick={handleGenerate} 
//                     disabled={isTailoring}
//                     className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50"
//                 >
//                     {isTailoring ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
//                     {isTailoring ? 'Analyzing Resume...' : 'Generate Options'}
//                 </button>
//             </div>
//         )}

//         {generatedBullets && hasGranularData && (
//           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
//             <div className="bg-white border rounded-xl p-4 flex justify-between items-center shadow-sm">
//                <span className="text-sm font-medium">Potential ATS Match</span>
//                <div className="flex items-center gap-2">
//                  <span className="text-lg font-bold text-zinc-400 line-through">{generatedBullets.atsScoreBefore}%</span>
//                  <span className="text-2xl font-black text-emerald-600">{generatedBullets.atsScore}%</span>
//                </div>
//             </div>

//             {/* SUMMARY OPTIONS */}
//             {generatedBullets.summaryOptions && generatedBullets.summaryOptions.length > 0 && (
//                 <div className="space-y-3">
//                     <h3 className="text-xs font-semibold text-zinc-800 flex items-center gap-2 uppercase tracking-wider">
//                         Professional Summary
//                     </h3>
//                     <div className="space-y-3">
//                         {generatedBullets.summaryOptions.map((opt, idx) => {
//                             const isApplied = appliedItems.has(`summary-${idx}`);
//                             return (
//                                 <div key={idx} className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-zinc-300 transition-all group relative pr-14">
//                                     <p className="text-sm text-zinc-700 leading-relaxed">{opt}</p>
//                                     <button 
//                                         onClick={() => handleApplySummary(opt, idx)}
//                                         className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isApplied ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white opacity-0 group-hover:opacity-100'}`}
//                                     >
//                                         {isApplied ? <Check size={16} /> : <Plus size={16} />}
//                                     </button>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}

//             {/* TAILORED BULLET POINTS FOR ALL SECTIONS */}
//             {generatedBullets.tailoredItems.map((itemGroup, idx) => (
//               <div key={idx} className="space-y-3">
//                   <h3 className="text-xs font-semibold text-indigo-600 flex items-center gap-2 uppercase tracking-wider">
//                       {itemGroup.sectionKey}: {itemGroup.itemTitle}
//                   </h3>
                  
//                   {itemGroup.newSuggestions?.map((bullet, bIdx) => {
//                       const uniqueId = `new-${idx}-${bIdx}`;
//                       const isApplied = appliedItems.has(uniqueId);
//                       return (
//                           <div key={bIdx} className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-indigo-200 hover:shadow-md transition-all group relative pr-14 cursor-default">
//                               <span className="absolute top-4 left-3 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
//                               <p className="text-sm text-zinc-800 leading-relaxed pl-3">{bullet}</p>
//                               <button 
//                                   onClick={() => handleApplyBullet(itemGroup.sectionKey, itemGroup.itemTitle, bullet, uniqueId)}
//                                   className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isApplied ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white shadow-sm opacity-0 group-hover:opacity-100'}`}
//                               >
//                                   {isApplied ? <Check size={16} /> : <Plus size={16} />}
//                               </button>
//                           </div>
//                       );
//                   })}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };









import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { Sparkles, Loader2, Plus, RotateCcw, Check } from 'lucide-react';

export const AnalysisPanel = () => {
  const { generateBulletOptions, isTailoring, generatedBullets, appendBulletToResume, updateResumeData, activeResume, clearGeneratedBullets } = useResumeStore();
  const [jdText, setJdText] = useState('');
  const [appliedItems, setAppliedItems] = useState(new Set());

  const handleGenerate = async () => {
    if (jdText.trim().length < 20) return alert("Paste a valid job description.");
    // Tone fixed to 'impact' for this request flow
    await generateBulletOptions(jdText, 'impact');
  };

  const handleReset = () => {
    clearGeneratedBullets();
    setJdText('');
    setAppliedItems(new Set());
  };

  const handleApplySummary = (newSummary, idx) => {
    updateResumeData({ ...activeResume.resumeData, summary: newSummary });
    setAppliedItems(prev => new Set(prev).add(`summary-${idx}`));
  };

  const handleApplyBullet = (sectionKey, itemTitle, bullet, uniqueId) => {
    appendBulletToResume(sectionKey, itemTitle, bullet);
    setAppliedItems(prev => new Set(prev).add(uniqueId));
  };

  const hasGranularData = generatedBullets?.tailoredItems && generatedBullets.tailoredItems.length > 0;

  return (
    <div className="h-full flex flex-col bg-[#fbfdff] font-sans">
      
      <div className="px-5 py-4 bg-white border-b border-zinc-100 flex justify-between items-center sticky top-0 z-10 shadow-inner relative">
        <div className="flex items-center gap-2">
            <Sparkles className="text-zinc-900" size={18} />
            <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">AI Copilot</h2>
        </div>
        {generatedBullets && (
             <button onClick={handleReset} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 transition-colors bg-[#fbfdff] border border-zinc-100 px-3 py-1.5 rounded-lg">
                 <RotateCcw size={14}/> Reset
             </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 pb-20 relative z-0">
        
        {!generatedBullets && (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2 relative">
                    <label className="text-xs font-semibold text-zinc-800 ml-1">Target Job Description</label>
                    <textarea 
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        className="w-full h-48 p-4 bg-white border border-zinc-200 rounded-xl outline-none focus:border-cyan-300 transition-all resize-none text-sm shadow-inner placeholder:text-zinc-400 text-zinc-900"
                        placeholder="Paste the job requirements here..."
                    />
                </div>
                
                <button 
                    onClick={handleGenerate} 
                    disabled={isTailoring}
                    className="w-full bg-[#06b6d4] hover:bg-cyan-600 text-white text-sm font-bold py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                >
                    {isTailoring ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                    {isTailoring ? 'Analyzing Resume...' : 'Generate Options'}
                </button>
            </div>
        )}

        {generatedBullets && hasGranularData && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-0">
            
            <div className="bg-white border rounded-xl p-4 flex justify-between items-center shadow-md relative z-10">
               <span className="text-sm font-medium">Potential ATS Match</span>
               <div className="flex items-center gap-2">
                 <span className="text-lg font-bold text-zinc-400 line-through">{generatedBullets.atsScoreBefore}%</span>
                 <span className="text-2xl font-black text-[#06b6d4] drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">{generatedBullets.atsScore}%</span>
               </div>
            </div>

            {/* SUMMARY OPTIONS */}
            {generatedBullets.summaryOptions && generatedBullets.summaryOptions.length > 0 && (
                <div className="space-y-3 relative z-0">
                    <h3 className="text-xs font-semibold text-zinc-800 flex items-center gap-2 uppercase tracking-wider pl-1">
                        Professional Summary
                    </h3>
                    <div className="space-y-3">
                        {generatedBullets.summaryOptions.map((opt, idx) => {
                            const isApplied = appliedItems.has(`summary-${idx}`);
                            return (
                                <div key={idx} className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm hover:border-cyan-200 transition-all group relative pr-14 relative z-0">
                                    <p className="text-sm text-zinc-700 leading-relaxed">{opt}</p>
                                    <button 
                                        onClick={() => handleApplySummary(opt, idx)}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isApplied ? 'bg-cyan-50 text-[#06b6d4]' : 'bg-zinc-100 text-zinc-600 hover:bg-[#06b6d4] hover:text-white shadow-sm opacity-0 group-hover:opacity-100'}`}
                                    >
                                        {isApplied ? <Check size={16} /> : <Plus size={16} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAILORED BULLET POINTS */}
            {generatedBullets.tailoredItems.map((itemGroup, idx) => (
              <div key={idx} className="space-y-3 relative z-0">
                  <h3 className="text-xs font-semibold text-sky-600 flex items-center gap-2 uppercase tracking-wider pl-1">
                      {itemGroup.sectionKey}: {itemGroup.itemTitle}
                  </h3>
                  
                  {itemGroup.newSuggestions?.map((bullet, bIdx) => {
                      const uniqueId = `new-${idx}-${bIdx}`;
                      const isApplied = appliedItems.has(uniqueId);
                      return (
                          <div key={bIdx} className="p-4 bg-white border border-zinc-200 rounded-xl hover:border-cyan-200 hover:shadow-md transition-all group relative pr-14 cursor-default relative z-0">
                              <span className="absolute top-4 left-3 w-1.5 h-1.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
                              <p className="text-sm text-zinc-800 leading-relaxed pl-3">{bullet}</p>
                              <button 
                                  onClick={() => handleApplyBullet(itemGroup.sectionKey, itemGroup.itemTitle, bullet, uniqueId)}
                                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${isApplied ? 'bg-cyan-50 text-[#06b6d4]' : 'bg-zinc-100 text-zinc-600 hover:bg-[#06b6d4] hover:text-white shadow-sm opacity-0 group-hover:opacity-100'}`}
                              >
                                  {isApplied ? <Check size={16} /> : <Plus size={16} />}
                              </button>
                          </div>
                      );
                  })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};