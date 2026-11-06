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
  const [editedSuggestions, setEditedSuggestions] = useState({});

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

//         {generatedBullets && (
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
//                                   onClick={() => handleApplyBullet(itemGroup.targetSectionKey || itemGroup.sectionKey, itemGroup.itemTitle, bullet, uniqueId)}
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
import { Sparkles, Loader2, Plus, RotateCcw, Check, Trash2 } from 'lucide-react';

export const AnalysisPanel = () => {
  const {
    generateBulletOptions,
    isTailoring,
    generatedBullets,
    applyTailoredBullet,
    removeTailoredBullet,
    addTailoredBullet,
    updateResumeData,
    activeResume,
    clearGeneratedBullets
  } = useResumeStore();

  const [jdText, setJdText] = useState('');
  const [appliedItems, setAppliedItems] = useState(new Set());

  const handleGenerate = async () => {
    if (jdText.trim().length < 20) return alert('Paste a valid job description.');
    setAppliedItems(new Set());
    setEditedSuggestions({});
    await generateBulletOptions(jdText, 'impact');
  };

  const handleReset = () => {
    clearGeneratedBullets();
    setJdText('');
    setAppliedItems(new Set());
    setEditedSuggestions({});
  };

  const markApplied = (id) => setAppliedItems((previous) => new Set(previous).add(id));

  const handleApplySummary = (newSummary, idx) => {
    updateResumeData({ ...activeResume.resumeData, summary: newSummary });
    markApplied('summary-' + idx);
  };

  const handleReplace = (group, bullet, id) => {
    const ok = applyTailoredBullet(group.targetSectionKey, group.itemIndex, bullet.bulletIndex, bullet.original, editedSuggestions[id] ?? bullet.text);
    if (!ok) return alert('This bullet changed after analysis. Reset and run the Copilot again before applying this suggestion.');
    markApplied(id);
  };

  const handleRemove = (group, bullet, id) => {
    const ok = removeTailoredBullet(group.targetSectionKey, group.itemIndex, bullet.bulletIndex, bullet.original);
    if (!ok) return alert('This bullet changed after analysis. Reset and run the Copilot again before removing it.');
    markApplied(id);
  };

  const handleAdd = (group, addition, id) => {
    const ok = addTailoredBullet(group.targetSectionKey, group.itemIndex, editedSuggestions[id] ?? addition.text);
    if (!ok) return alert('Could not add this suggestion. The resume entry may have changed.');
    markApplied(id);
  };

  const recommendations = generatedBullets?.tailoredItems || [];
  const hasChanges = recommendations.length > 0 || (generatedBullets?.summaryOptions || []).length > 0;

  return (
    <div className="h-full flex flex-col bg-[#fbfdff] font-sans">
      <div className="px-5 py-4 bg-white border-b border-zinc-100 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="text-zinc-900" size={18} />
          <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">AI Copilot</h2>
        </div>
        {generatedBullets && (
          <button onClick={handleReset} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg">
            <RotateCcw size={14} /> New JD
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 pb-20">
        {!generatedBullets && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-800">Target Job Description</label>
              <textarea
                value={jdText}
                onChange={(event) => setJdText(event.target.value)}
                className="w-full h-56 p-4 bg-white border border-zinc-200 rounded-xl outline-none focus:border-cyan-400 resize-y text-sm shadow-sm placeholder:text-zinc-400 text-zinc-900"
                placeholder="Paste any job description here. The Copilot will compare it with every resume bullet..."
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isTailoring}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-3.5 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isTailoring ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {isTailoring ? 'Reviewing every resume point...' : 'Analyze and improve resume'}
            </button>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              The AI will recommend keeping, replacing, removing, or adding points. Nothing changes until you choose an action. No ATS score is fabricated.
            </p>
          </div>
        )}

        {generatedBullets && (
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-semibold text-zinc-900">Resume improvement plan</p>
              <p className="text-xs text-zinc-500 mt-1">
                Reviewed {generatedBullets.reviewedBulletCount || 0} existing points. {generatedBullets.changedBulletCount || 0} suggested actions are available.
              </p>
              <p className="text-[11px] text-zinc-500 mt-2">No automatic edits. No estimated ATS score. You control every change.</p>
            </div>

            {generatedBullets.warnings?.map((warning, index) => (
              <div key={index} role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
                {warning}
              </div>
            ))}

            {generatedBullets.summaryOptions?.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Professional summary</h3>
                {generatedBullets.summaryOptions.map((option, index) => {
                  const id = 'summary-' + index;
                  const applied = appliedItems.has(id);
                  return (
                    <div key={id} className="rounded-xl border border-zinc-200 bg-white p-3 space-y-3">
                      <p className="text-sm leading-relaxed text-zinc-800">{option}</p>
                      <button disabled={applied} onClick={() => handleApplySummary(option, index)} className="text-xs font-semibold rounded-lg px-3 py-2 bg-cyan-50 text-cyan-800 disabled:opacity-60">
                        {applied ? 'Applied' : 'Use this summary'}
                      </button>
                    </div>
                  );
                })}
              </section>
            )}

            {recommendations.map((group) => (
              <section key={group.targetSectionKey + '-' + group.itemIndex} className="space-y-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">{group.sectionKey}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{group.itemTitle}</p>
                </div>

                {group.bullets.map((bullet) => {
                  const id = group.targetSectionKey + '-' + group.itemIndex + '-' + bullet.bulletIndex + '-' + bullet.action;
                  const applied = appliedItems.has(id);
                  return (
                    <div key={id} className="rounded-xl border border-zinc-200 bg-white p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={'text-[10px] font-bold uppercase tracking-wider ' + (bullet.action === 'remove' ? 'text-red-600' : 'text-cyan-700')}>
                          {bullet.action === 'remove' ? 'Recommended removal' : 'Suggested improvement'}
                        </span>
                        {applied && <span className="text-[10px] font-semibold text-emerald-700">Applied</span>}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-zinc-400 mb-1">Current point</p>
                        <p className="text-sm text-zinc-600 leading-relaxed">{bullet.original}</p>
                      </div>
                      {bullet.action === 'replace' && (
                        <div>
                          <p className="text-[10px] uppercase font-semibold text-cyan-700 mb-1">Improved for this JD</p>
                          <textarea
                            value={editedSuggestions[id] ?? bullet.text}
                            onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                            rows={3}
                            className="w-full rounded-lg border border-cyan-200 bg-white p-2 text-sm leading-relaxed text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                            aria-label="Edit suggested replacement"
                          />
                        </div>
                      )}
                      {bullet.reason && <p className="text-[11px] text-zinc-500 leading-relaxed">{bullet.reason}</p>}
                      <div className="flex flex-wrap gap-2 justify-end">
                        {bullet.action === 'replace' && (
                          <button disabled={applied} onClick={() => handleReplace(group, bullet, id)} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-2 text-xs font-semibold disabled:opacity-50">
                            <Check size={13} /> {applied ? 'Replaced' : 'Replace point'}
                          </button>
                        )}
                        <button disabled={applied} onClick={() => handleRemove(group, bullet, id)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 text-xs font-semibold disabled:opacity-50">
                          <Trash2 size={13} /> {applied && bullet.action === 'remove' ? 'Removed' : 'Remove point'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {group.additions.map((addition, index) => {
                  const id = group.targetSectionKey + '-' + group.itemIndex + '-add-' + index;
                  const applied = appliedItems.has(id);
                  return (
                    <div key={id} className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 p-3 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Suggested new point</span>
                      <textarea
                        value={editedSuggestions[id] ?? addition.text}
                        onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                        rows={3}
                        className="w-full rounded-lg border border-emerald-200 bg-white p-2 text-sm leading-relaxed text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        aria-label="Edit suggested new point"
                      />
                      {addition.reason && <p className="text-[11px] text-zinc-500">{addition.reason}</p>}
                      <div className="flex justify-end">
                        <button disabled={applied} onClick={() => handleAdd(group, addition, id)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 text-xs font-semibold disabled:opacity-50">
                          <Plus size={13} /> {applied ? 'Added' : 'Add point'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </section>
            ))}

            {!hasChanges && (
              <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
                No changes were recommended. The AI kept the points it judged suitable for this job. If you expected suggestions, check the warning messages above or try again with the complete job description.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};