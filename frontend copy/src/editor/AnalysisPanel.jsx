// import React, { useState } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { Sparkles, Loader2, PlusCircle, RotateCcw, Briefcase, FileText, ChevronDown, ChevronUp, Target, Lightbulb } from 'lucide-react';

// export const AnalysisPanel = () => {
//   const { generateBulletOptions, isTailoring, generatedBullets, appendBulletToResume, updateResumeData, activeResume, clearGeneratedBullets } = useResumeStore();
  
//   const [jdText, setJdText] = useState('');
//   const [isJdExpanded, setIsJdExpanded] = useState(true);
//   const [selectedTone, setSelectedTone] = useState('impact');

//   const handleGenerate = async () => {
//     if (jdText.trim().length < 20) return alert("Please paste a valid job description.");
//     await generateBulletOptions(jdText, selectedTone);
//     setIsJdExpanded(false); // Collapse JD box when done
//   };

//   const handleReset = () => {
//     clearGeneratedBullets();
//     setJdText('');
//     setIsJdExpanded(true); 
//   };

//   const handleApplySummary = (newSummary) => {
//     updateResumeData({ ...activeResume.resumeData, summary: newSummary });
//   };

//   return (
//     <div className="h-full flex flex-col overflow-y-auto bg-white custom-scrollbar">
      
//       {/* HEADER */}
//       <div className="p-5 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between shadow-sm">
//         <div className="flex items-center gap-3">
//             <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
//             <Sparkles size={16} />
//             </div>
//             <div>
//             <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">AI Co-Pilot</h2>
//             <p className="text-[10px] text-slate-500 font-medium">JD Matching Wizard</p>
//             </div>
//         </div>
//         {generatedBullets && (
//              <button onClick={handleReset} className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase tracking-wider transition-colors"><RotateCcw size={10}/> Reset</button>
//         )}
//       </div>

//       <div className="p-5 flex-1 bg-slate-50/30 space-y-6">
        
//         {/* JD INPUT SECTION (COLLAPSIBLE) */}
//         <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
//             <button 
//                 onClick={() => setIsJdExpanded(!isJdExpanded)}
//                 className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
//             >
//                 <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
//                     <Briefcase size={14} className="text-indigo-500"/> Target Job Description
//                 </div>
//                 {isJdExpanded ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
//             </button>
            
//             {isJdExpanded && (
//                 <div className="p-4 border-t border-slate-100 space-y-5">
//                     <textarea 
//                         value={jdText}
//                         onChange={(e) => setJdText(e.target.value)}
//                         className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white resize-none text-xs shadow-inner transition-all leading-relaxed"
//                         placeholder="Paste the job requirements here..."
//                     />
                    
//                     {/* TONE SELECTION BUTTONS */}
//                     <div className="space-y-2">
//                         <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
//                             <Target size={12}/> Select AI Writing Style
//                         </label>
//                         <div className="flex flex-col gap-2">
//                             <button 
//                                 onClick={() => setSelectedTone('authentic')}
//                                 className={`text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all ${selectedTone === 'authentic' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
//                             >
//                                 Direct & Authentic <span className="block text-[10px] font-medium text-slate-400 mt-0.5">Honest phrasing, easy to defend in interviews.</span>
//                             </button>
//                             <button 
//                                 onClick={() => setSelectedTone('impact')}
//                                 className={`text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all ${selectedTone === 'impact' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
//                             >
//                                 Professional & Balanced <span className="block text-[10px] font-medium text-slate-400 mt-0.5">Strong action verbs and clear achievements.</span>
//                             </button>
//                             <button 
//                                 onClick={() => setSelectedTone('ats')}
//                                 className={`text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all ${selectedTone === 'ats' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
//                             >
//                                 Strategic & Optimized <span className="block text-[10px] font-medium text-slate-400 mt-0.5">Aggressive ATS keyword matching and impact metrics.</span>
//                             </button>
//                         </div>
//                     </div>

//                     <button 
//                         onClick={handleGenerate} disabled={isTailoring}
//                         className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-2"
//                     >
//                         {isTailoring ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
//                         {isTailoring ? 'Analyzing & Rewriting...' : 'Generate Tailored Content'}
//                     </button>
//                 </div>
//             )}
//         </div>

//         {/* RESULTS SECTION */}
//         {generatedBullets && (
//           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            
//             {/* WIZARD STEP 1: 3 SUMMARY OPTIONS */}
//             {generatedBullets.summaryOptions && generatedBullets.summaryOptions.length > 0 && (
//                 <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-md ring-1 ring-indigo-500/10">
//                     <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2">
//                         <FileText size={14} className="text-indigo-600" />
//                         <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider">Step 1: Summary Options</span>
//                     </div>
//                     <div className="divide-y divide-slate-100">
//                         {generatedBullets.summaryOptions.map((opt, idx) => (
//                             <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
//                                 <p className="text-xs text-slate-700 leading-relaxed mb-3">{opt}</p>
//                                 <button 
//                                     onClick={() => handleApplySummary(opt)}
//                                     className="w-full text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
//                                 >
//                                     <PlusCircle size={14} /> Use Option {idx + 1}
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* WIZARD STEP 2: EXPERIENCE & PROJECTS */}
//             {generatedBullets.tailoredItems && generatedBullets.tailoredItems.map((itemGroup, idx) => (
//               <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
//                 <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <Briefcase size={14} className="text-indigo-400" />
//                         <span className="text-[11px] font-black text-white uppercase tracking-wider">{itemGroup.itemTitle}</span>
//                     </div>
//                 </div>
                
//                 {/* Rewritten Existing Bullets */}
//                 {itemGroup.rewrittenBullets && itemGroup.rewrittenBullets.length > 0 && (
//                     <div className="border-b border-slate-200">
//                         <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
//                             Optimized Existing Bullets
//                         </div>
//                         <div className="divide-y divide-slate-100">
//                         {itemGroup.rewrittenBullets.map((bullet, bIdx) => (
//                             <div key={bIdx} className="p-4 hover:bg-slate-50 transition-colors group">
//                                 <p className="text-xs text-slate-700 leading-relaxed mb-3">{bullet}</p>
//                                 <button 
//                                     onClick={() => appendBulletToResume(itemGroup.sectionKey, itemGroup.itemTitle, bullet)}
//                                     className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-md transition-all w-full justify-center"
//                                 >
//                                     <PlusCircle size={12} /> Add to Editor
//                                 </button>
//                             </div>
//                         ))}
//                         </div>
//                     </div>
//                 )}
//                 {/* WIZARD STEP 1.5: SKILLS AUDIT */}
//             {generatedBullets.skillsAudit && (
//               <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
//                   <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
//                       <Target size={14} className="text-indigo-500" />
//                       <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Skills Audit (JD Match)</span>
//                   </div>
//                   <div className="p-4 space-y-4">
//                       {generatedBullets.skillsAudit.add?.length > 0 && (
//                           <div>
//                               <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">CRITICAL TO ADD (From JD)</p>
//                               <div className="flex flex-wrap gap-2">
//                                   {generatedBullets.skillsAudit.add.map((skill, i) => (
//                                       <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold">
//                                           + {skill}
//                                       </span>
//                                   ))}
//                               </div>
//                           </div>
//                       )}
                      
//                       {generatedBullets.skillsAudit.remove?.length > 0 && (
//                           <div className="pt-4 border-t border-slate-100">
//                               <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">RECOMMENDED TO REMOVE (Irrelevant)</p>
//                               <div className="flex flex-wrap gap-2">
//                                   {generatedBullets.skillsAudit.remove.map((skill, i) => (
//                                       <span key={i} className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md text-xs font-semibold line-through opacity-80">
//                                           - {skill}
//                                       </span>
//                                   ))}
//                               </div>
//                           </div>
//                       )}
//                   </div>
//               </div>
//             )}

//                 {/* Net-New Suggested Bullets */}
//                 {itemGroup.newSuggestions && itemGroup.newSuggestions.length > 0 && (
//                     <div>
//                         <div className="bg-indigo-50 px-4 py-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
//                             <Lightbulb size={12}/> AI Recommended Additions
//                         </div>
//                         <div className="divide-y divide-indigo-50">
//                         {itemGroup.newSuggestions.map((bullet, bIdx) => (
//                             <div key={bIdx} className="p-4 bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors group">
//                                 <p className="text-xs text-indigo-900 leading-relaxed mb-3">{bullet}</p>
//                                 <button 
//                                     onClick={() => appendBulletToResume(itemGroup.sectionKey, itemGroup.itemTitle, bullet)}
//                                     className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 hover:border-indigo-400 rounded-md transition-all w-full justify-center shadow-sm"
//                                 >
//                                     <PlusCircle size={12} /> Add Suggestion
//                                 </button>
//                             </div>
//                         ))}
//                         </div>
//                     </div>
//                 )}

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
import { Sparkles, Loader2, PlusCircle, RotateCcw, Briefcase, FileText, ChevronDown, ChevronUp, Target, Lightbulb } from 'lucide-react';

export const AnalysisPanel = () => {
  const { 
    generateBulletOptions, 
    isTailoring, 
    generatedBullets, 
    appendBulletToResume, 
    updateResumeData, 
    activeResume, 
    clearGeneratedBullets,
    addSkillToResume,        // <-- Re-added for interactive skills
    removeSkillFromResume    // <-- Re-added for interactive skills
  } = useResumeStore();
  
  const [jdText, setJdText] = useState('');
  const [isJdExpanded, setIsJdExpanded] = useState(true);
  const [selectedTone, setSelectedTone] = useState('impact');

  const handleGenerate = async () => {
    if (jdText.trim().length < 20) return alert("Please paste a valid job description.");
    await generateBulletOptions(jdText, selectedTone);
    setIsJdExpanded(false);
  };

  const handleReset = () => {
    clearGeneratedBullets();
    setJdText('');
    setIsJdExpanded(true); 
  };

  const handleApplySummary = (newSummary) => {
    updateResumeData({ ...activeResume.resumeData, summary: newSummary });
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-white custom-scrollbar">
      
      {/* HEADER */}
      <div className="p-5 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Sparkles size={16} />
            </div>
            <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">AI Co-Pilot</h2>
            <p className="text-[10px] text-slate-500 font-medium">JD Matching Wizard</p>
            </div>
        </div>
        {generatedBullets && (
             <button onClick={handleReset} className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 uppercase tracking-wider transition-colors"><RotateCcw size={10}/> Reset</button>
        )}
      </div>

      <div className="p-5 flex-1 bg-slate-50/30 space-y-6">
        
        {/* JD INPUT SECTION (COLLAPSIBLE) */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button 
                onClick={() => setIsJdExpanded(!isJdExpanded)}
                className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <Briefcase size={14} className="text-indigo-500"/> Target Job Description
                </div>
                {isJdExpanded ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
            </button>
            
            {isJdExpanded && (
                <div className="p-4 border-t border-slate-100 space-y-5">
                    <textarea 
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white resize-none text-xs shadow-inner transition-all leading-relaxed"
                        placeholder="Paste the job requirements here..."
                    />
                    
                    {/* TONE SELECTION BUTTONS */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                            <Target size={12}/> Select AI Writing Style
                        </label>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => setSelectedTone('authentic')}
                                className={`text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all ${selectedTone === 'authentic' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                Direct & Authentic <span className="block text-[10px] font-medium text-slate-400 mt-0.5">Honest phrasing, easy to defend in interviews.</span>
                            </button>
                            <button 
                                onClick={() => setSelectedTone('impact')}
                                className={`text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all ${selectedTone === 'impact' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                Professional & Balanced <span className="block text-[10px] font-medium text-slate-400 mt-0.5">Strong action verbs and clear achievements.</span>
                            </button>
                            <button 
                                onClick={() => setSelectedTone('ats')}
                                className={`text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all ${selectedTone === 'ats' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                            >
                                Strategic & Optimized <span className="block text-[10px] font-medium text-slate-400 mt-0.5">Aggressive ATS keyword matching and impact metrics.</span>
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={handleGenerate} disabled={isTailoring}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3.5 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 mt-2"
                    >
                        {isTailoring ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                        {isTailoring ? 'Analyzing & Rewriting...' : 'Generate Tailored Content'}
                    </button>
                </div>
            )}
        </div>

        {/* RESULTS SECTION */}
        {generatedBullets && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            
            {/* WIZARD STEP 1: 3 SUMMARY OPTIONS */}
            {generatedBullets.summaryOptions && generatedBullets.summaryOptions.length > 0 && (
                <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-md ring-1 ring-indigo-500/10">
                    <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center gap-2">
                        <FileText size={14} className="text-indigo-600" />
                        <span className="text-[11px] font-black text-indigo-900 uppercase tracking-wider">Step 1: Summary Options</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {generatedBullets.summaryOptions.map((opt, idx) => (
                            <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                                <p className="text-xs text-slate-700 leading-relaxed mb-3">{opt}</p>
                                <button 
                                    onClick={() => handleApplySummary(opt)}
                                    className="w-full text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                >
                                    <PlusCircle size={14} /> Use Option {idx + 1}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* WIZARD STEP 1.5: SKILLS AUDIT (Now correctly outside the map loop and fully interactive!) */}
            {generatedBullets.skillsAudit && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                      <Target size={14} className="text-indigo-500" />
                      <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">Step 2: Skills Audit</span>
                  </div>
                  <div className="p-4 space-y-4">
                      {generatedBullets.skillsAudit.add?.length > 0 && (
                          <div>
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">CRITICAL TO ADD (Click to Apply)</p>
                              <div className="flex flex-wrap gap-2">
                                  {generatedBullets.skillsAudit.add.map((skill, i) => (
                                      <button 
                                        key={i} 
                                        onClick={() => addSkillToResume(skill)}
                                        title="Click to add to your resume"
                                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 hover:border-emerald-400 rounded-md text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                          <PlusCircle size={10} /> {skill}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                      
                      {generatedBullets.skillsAudit.remove?.length > 0 && (
                          <div className="pt-4 border-t border-slate-100">
                              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">RECOMMENDED TO REMOVE (Click to Delete)</p>
                              <div className="flex flex-wrap gap-2">
                                  {generatedBullets.skillsAudit.remove.map((skill, i) => (
                                      <button 
                                        key={i} 
                                        onClick={() => removeSkillFromResume(skill)}
                                        title="Click to remove from your resume"
                                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-400 rounded-md text-xs font-semibold line-through opacity-80 hover:opacity-100 transition-colors cursor-pointer flex items-center gap-1"
                                      >
                                          <RotateCcw size={10} /> {skill}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
            )}

            {/* WIZARD STEP 2: EXPERIENCE & PROJECTS */}
            {generatedBullets.tailoredItems && generatedBullets.tailoredItems.map((itemGroup, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="bg-slate-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Briefcase size={14} className="text-indigo-400" />
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">{itemGroup.itemTitle}</span>
                    </div>
                </div>
                
                {/* Rewritten Existing Bullets */}
                {itemGroup.rewrittenBullets && itemGroup.rewrittenBullets.length > 0 && (
                    <div className="border-b border-slate-200">
                        <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Optimized Existing Bullets
                        </div>
                        <div className="divide-y divide-slate-100">
                        {itemGroup.rewrittenBullets.map((bullet, bIdx) => (
                            <div key={bIdx} className="p-4 hover:bg-slate-50 transition-colors group">
                                <p className="text-xs text-slate-700 leading-relaxed mb-3">{bullet}</p>
                                <button 
                                    onClick={() => appendBulletToResume(itemGroup.sectionKey, itemGroup.itemTitle, bullet)}
                                    className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-md transition-all w-full justify-center"
                                >
                                    <PlusCircle size={12} /> Add to Editor
                                </button>
                            </div>
                        ))}
                        </div>
                    </div>
                )}

                {/* Net-New Suggested Bullets */}
                {itemGroup.newSuggestions && itemGroup.newSuggestions.length > 0 && (
                    <div>
                        <div className="bg-indigo-50 px-4 py-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Lightbulb size={12}/> AI Recommended Additions
                        </div>
                        <div className="divide-y divide-indigo-50">
                        {itemGroup.newSuggestions.map((bullet, bIdx) => (
                            <div key={bIdx} className="p-4 bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors group">
                                <p className="text-xs text-indigo-900 leading-relaxed mb-3">{bullet}</p>
                                <button 
                                    onClick={() => appendBulletToResume(itemGroup.sectionKey, itemGroup.itemTitle, bullet)}
                                    className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 hover:border-indigo-400 rounded-md transition-all w-full justify-center shadow-sm"
                                >
                                    <PlusCircle size={12} /> Add Suggestion
                                </button>
                            </div>
                        ))}
                        </div>
                    </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};