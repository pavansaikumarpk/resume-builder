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
    clearGeneratedBullets
  } = useResumeStore();

  const [jdText, setJdText] = useState('');
  const [appliedItems, setAppliedItems] = useState(new Set());
  const [editedSuggestions, setEditedSuggestions] = useState({});

  const handleGenerate = async () => {
    if (jdText.trim().length < 20) return alert('Paste a valid job description.');
    setAppliedItems(new Set());
    setEditedSuggestions({});
    await generateBulletOptions(jdText, 'impact');
  };

  const handleReset = () => {
    clearGeneratedBullets();
    setAppliedItems(new Set());
    setEditedSuggestions({});
  };

  const markApplied = (id) => setAppliedItems((previous) => new Set(previous).add(id));

  const handleModify = (group, bullet, id) => {
    const replacement = (editedSuggestions[id] ?? bullet.text ?? '').trim();
    if (!replacement) return alert('The modified point cannot be empty.');
    const ok = applyTailoredBullet(group.targetSectionKey, group.itemIndex, bullet.bulletIndex, bullet.original, replacement);
    if (!ok) return alert('This point changed after analysis. Run the Copilot again before applying the modification.');
    markApplied(id);
  };

  const handleRemove = (group, bullet, id) => {
    const ok = removeTailoredBullet(group.targetSectionKey, group.itemIndex, bullet.bulletIndex, bullet.original);
    if (!ok) return alert('This point changed after analysis. Run the Copilot again before removing it.');
    markApplied(id);
  };

  const handleAdd = (group, addition, id) => {
    const text = (editedSuggestions[id] ?? addition.text ?? '').trim();
    if (!text) return alert('A new point cannot be empty.');
    const ok = addTailoredBullet(group.targetSectionKey, group.itemIndex, text);
    if (!ok) return alert('Could not add this point. The resume entry may have changed or the point already exists.');
    markApplied(id);
  };

  const recommendations = generatedBullets?.tailoredItems || [];
  const hasReviewablePoints = recommendations.some((group) => group.bullets.length || group.additions.length);

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
                placeholder="Paste the job description. The Copilot will review every existing point in your resume."
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isTailoring}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-3.5 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isTailoring ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {isTailoring ? 'Reviewing every point...' : 'Review resume'}
            </button>
          </div>
        )}

        {generatedBullets && (
          <div className="space-y-6">
            {recommendations.map((group) => (
              <section key={group.targetSectionKey + '-' + group.itemIndex} className="space-y-3">
                <div className="border-b border-zinc-200 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">{group.sectionKey}</h3>
                  <p className="text-xs text-zinc-500 mt-1">{group.itemTitle}</p>
                </div>

                {group.bullets.map((bullet) => {
                  const id = group.targetSectionKey + '-' + group.itemIndex + '-' + bullet.bulletIndex;
                  const applied = appliedItems.has(id);
                  const actionLabel = bullet.action === 'keep' ? 'KEEP' : (bullet.action === 'modify' ? 'MODIFY' : 'REMOVE');
                  const actionColor = bullet.action === 'keep'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : (bullet.action === 'modify' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-red-50 text-red-700 border-red-200');

                  return (
                    <article key={id} className="rounded-xl border border-zinc-200 bg-white p-3 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className={'inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider ' + actionColor}>
                          {actionLabel}
                        </span>
                        {applied && <span className="text-[10px] font-semibold text-emerald-700">Applied</span>}
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap">{bullet.original}</p>

                      {bullet.action === 'modify' && (
                        <div className="space-y-2">
                          <textarea
                            value={editedSuggestions[id] ?? bullet.text}
                            onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                            rows={3}
                            className="w-full rounded-lg border border-cyan-200 bg-white p-2 text-sm leading-relaxed text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                            aria-label="Modified resume point"
                          />
                          <div className="flex justify-end">
                            <button
                              disabled={applied}
                              onClick={() => handleModify(group, bullet, id)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white px-3 py-2 text-xs font-semibold disabled:opacity-50"
                            >
                              <Check size={13} /> {applied ? 'Modified' : 'Apply modification'}
                            </button>
                          </div>
                        </div>
                      )}

                      {bullet.action === 'remove' && (
                        <div className="flex justify-end">
                          <button
                            disabled={applied}
                            onClick={() => handleRemove(group, bullet, id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                          >
                            <Trash2 size={13} /> {applied ? 'Removed' : 'Remove point'}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}

                {group.additions.map((addition, index) => {
                  const id = group.targetSectionKey + '-' + group.itemIndex + '-add-' + index;
                  const applied = appliedItems.has(id);
                  return (
                    <article key={id} className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/30 p-3 space-y-3">
                      <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-700">
                        ADD
                      </span>
                      <textarea
                        value={editedSuggestions[id] ?? addition.text}
                        onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                        rows={3}
                        className="w-full rounded-lg border border-emerald-200 bg-white p-2 text-sm leading-relaxed text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        aria-label="New resume point"
                      />
                      <div className="flex justify-end">
                        <button
                          disabled={applied}
                          onClick={() => handleAdd(group, addition, id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 text-xs font-semibold disabled:opacity-50"
                        >
                          <Plus size={13} /> {applied ? 'Added' : 'Add point'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            ))}

            {!hasReviewablePoints && (
              <p className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                No bullet points were found in the supported resume sections.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
