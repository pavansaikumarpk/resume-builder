import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { Sparkles, Loader2, Plus, RotateCcw, Check, Trash2 } from 'lucide-react';

const ACTION_LABEL = { keep: 'KEEP', modify: 'MODIFY', remove: 'REMOVE', add: 'ADD' };
const ACTION_STYLE = {
  keep: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  modify: 'border-amber-200 bg-amber-50 text-amber-800',
  remove: 'border-red-200 bg-red-50 text-red-700',
  add: 'border-sky-200 bg-sky-50 text-sky-800'
};

const Status = ({ action }) => (
  <span className={'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider ' + ACTION_STYLE[action]}>
    <span className={'h-2 w-2 rounded-full ' + (
      action === 'keep' ? 'bg-emerald-500' :
      action === 'modify' ? 'bg-amber-500' :
      action === 'remove' ? 'bg-red-500' : 'bg-sky-500'
    )} />
    {ACTION_LABEL[action]}
  </span>
);

export const AnalysisPanel = () => {
  const {
    generateBulletOptions,
    isTailoring,
    generatedBullets,
    applyTailoredBullet,
    removeTailoredBullet,
    addTailoredBullet,
    applySkillReviewDecision,
    addSkillToCategory,
    updateResumeData,
    activeResume,
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

  const applyTextReview = (review, id) => {
    const current = String(activeResume?.resumeData?.[review.sectionKey] || '').trim();
    if (current !== String(review.original || '').trim()) {
      return alert('This section changed after analysis. Run the Copilot again before applying the recommendation.');
    }
    const value = review.action === 'remove'
      ? ''
      : String(editedSuggestions[id] ?? review.text ?? '').trim();
    if (['modify', 'add'].includes(review.action) && !value) {
      return alert('The suggested content cannot be empty.');
    }
    updateResumeData({ ...activeResume.resumeData, [review.sectionKey]: value });
    markApplied(id);
  };

  const applyBulletDecision = (group, bullet, id) => {
    if (bullet.action === 'modify') {
      const value = String(editedSuggestions[id] ?? bullet.text ?? '').trim();
      if (!value) return alert('The modified point cannot be empty.');
      const ok = applyTailoredBullet(
        group.targetSectionKey, group.itemIndex, bullet.bulletIndex, bullet.original, value
      );
      if (!ok) return alert('This point changed after analysis. Run the Copilot again before applying the modification.');
      markApplied(id);
    } else if (bullet.action === 'remove') {
      const ok = removeTailoredBullet(
        group.targetSectionKey, group.itemIndex, bullet.bulletIndex, bullet.original
      );
      if (!ok) return alert('This point changed after analysis. Run the Copilot again before removing it.');
      markApplied(id);
    }
  };

  const applyBulletAddition = (group, addition, id) => {
    const value = String(editedSuggestions[id] ?? addition.text ?? '').trim();
    if (!value) return alert('A new point cannot be empty.');
    if (!addTailoredBullet(group.targetSectionKey, group.itemIndex, value)) {
      return alert('Could not add this point. The resume entry may have changed or the point already exists.');
    }
    markApplied(id);
  };

  const applySkillDecision = (skill, id) => {
    const replacement = String(editedSuggestions[id] ?? skill.text ?? '').trim();
    if (skill.action === 'modify' && !replacement) return alert('The modified skill cannot be empty.');
    const ok = applySkillReviewDecision(
      skill.categoryIndex,
      skill.skillIndex,
      skill.original,
      skill.action,
      replacement
    );
    if (!ok) return alert('This skill changed after analysis. Run the Copilot again before applying the recommendation.');
    markApplied(id);
  };

  const applySkillAddition = (skill, id) => {
    const name = String(editedSuggestions[id] ?? skill.name ?? '').trim();
    if (!name) return alert('A skill name cannot be empty.');
    addSkillToCategory(null, name, skill.category);
    markApplied(id);
  };

  const recommendations = generatedBullets?.tailoredItems || [];
  const sectionReviews = generatedBullets?.sectionReviews || [];
  const skillActions = generatedBullets?.skillActions || [];
  const skillAdditions = generatedBullets?.skillAdditions || [];
  const hasReviewableContent = sectionReviews.length || recommendations.length || skillActions.length || skillAdditions.length;

  return (
    <div className="h-full flex flex-col bg-[#fbfdff] font-sans">
      <div className="px-5 py-4 bg-white border-b border-zinc-100 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="text-zinc-900" size={18} />
          <h2 className="text-sm font-semibold text-zinc-900 tracking-tight">AI Resume Review</h2>
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
                placeholder="Paste the job description. The AI will review each relevant section and point."
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isTailoring}
              className="w-full bg-cyan-700 hover:bg-cyan-800 text-white text-sm font-semibold py-3.5 rounded-xl shadow-sm transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isTailoring ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {isTailoring ? 'Reviewing the full resume...' : 'Review full resume'}
            </button>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              Reviews summary, experience, projects, skills, and custom sections. Personal details, education, and certifications are left untouched.
            </p>
          </div>
        )}

        {generatedBullets && (
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <p className="text-sm font-semibold text-zinc-900">Resume review complete</p>
              <p className="mt-1 text-xs text-zinc-500">
                Reviewed {generatedBullets.reviewedPointCount || 0} points:
                {' '}{generatedBullets.reviewedTextSectionCount || 0} text sections,
                {' '}{generatedBullets.reviewedBulletCount || 0} experience/project/custom points,
                {' '}{generatedBullets.reviewedSkillCount || 0} skills.
              </p>
              <p className="mt-2 text-[11px] text-zinc-500">Green means no change is needed. Nothing is changed until you approve it.</p>
            </div>

            {sectionReviews.map((review) => {
              const id = 'text-' + review.sectionKey;
              const applied = appliedItems.has(id);
              return (
                <section key={review.sectionKey} className="rounded-xl border border-zinc-200 bg-white p-3 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">{review.sectionTitle}</h3>
                    <div className="flex items-center gap-2">
                      <Status action={review.action} />
                      {applied && <span className="text-[10px] text-emerald-700">Applied</span>}
                    </div>
                  </div>
                  {review.original ? (
                    <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">{review.original}</p>
                  ) : (
                    <p className="text-xs italic text-zinc-400">No current content in this section.</p>
                  )}
                  {['modify', 'add'].includes(review.action) && (
                    <textarea
                      value={editedSuggestions[id] ?? review.text}
                      onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                      rows={4}
                      className="w-full rounded-lg border border-amber-200 bg-white p-2 text-sm leading-relaxed text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-100"
                      aria-label={'Suggested ' + review.sectionTitle}
                    />
                  )}
                  {review.reason && <p className="text-xs leading-relaxed text-zinc-500">{review.reason}</p>}
                  {review.action !== 'keep' && (
                    <div className="flex justify-end">
                      <button
                        disabled={applied}
                        onClick={() => applyTextReview(review, id)}
                        className={'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ' + (
                          review.action === 'remove'
                            ? 'border border-red-200 bg-red-50 text-red-700'
                            : 'bg-cyan-700 text-white hover:bg-cyan-800'
                        )}
                      >
                        {review.action === 'remove' ? <Trash2 size={13} /> : <Check size={13} />}
                        {applied ? 'Applied' : review.action === 'remove' ? 'Remove content' : review.action === 'add' ? 'Add content' : 'Apply modification'}
                      </button>
                    </div>
                  )}
                </section>
              );
            })}

            {recommendations.map((group) => (
              <section key={group.targetSectionKey + '-' + group.itemIndex} className="space-y-3">
                <div className="border-b border-zinc-200 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">{group.sectionKey}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{group.itemTitle}</p>
                </div>
                {group.bullets.map((bullet) => {
                  const id = group.targetSectionKey + '-' + group.itemIndex + '-' + bullet.bulletIndex;
                  const applied = appliedItems.has(id);
                  return (
                    <article key={id} className="rounded-xl border border-zinc-200 bg-white p-3 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Status action={bullet.action} />
                        {applied && <span className="text-[10px] font-semibold text-emerald-700">Applied</span>}
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap">{bullet.original}</p>
                      {bullet.action === 'modify' && (
                        <textarea
                          value={editedSuggestions[id] ?? bullet.text}
                          onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                          rows={3}
                          className="w-full rounded-lg border border-amber-200 bg-white p-2 text-sm leading-relaxed text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-100"
                          aria-label="Modified resume point"
                        />
                      )}
                      {bullet.reason && <p className="text-xs leading-relaxed text-zinc-500">{bullet.reason}</p>}
                      {bullet.action !== 'keep' && (
                        <div className="flex justify-end">
                          <button
                            disabled={applied}
                            onClick={() => applyBulletDecision(group, bullet, id)}
                            className={'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ' + (
                              bullet.action === 'remove'
                                ? 'border border-red-200 bg-red-50 text-red-700'
                                : 'bg-cyan-700 text-white hover:bg-cyan-800'
                            )}
                          >
                            {bullet.action === 'remove' ? <Trash2 size={13} /> : <Check size={13} />}
                            {applied ? 'Applied' : bullet.action === 'remove' ? 'Remove point' : 'Apply modification'}
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
                      <Status action="add" />
                      <textarea
                        value={editedSuggestions[id] ?? addition.text}
                        onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                        rows={3}
                        className="w-full rounded-lg border border-emerald-200 bg-white p-2 text-sm leading-relaxed text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        aria-label="New resume point"
                      />
                      {addition.reason && <p className="text-xs text-zinc-500">{addition.reason}</p>}
                      <div className="flex justify-end">
                        <button
                          disabled={applied}
                          onClick={() => applyBulletAddition(group, addition, id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                        >
                          <Plus size={13} /> {applied ? 'Added' : 'Add point'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            ))}

            {(skillActions.length > 0 || skillAdditions.length > 0) && (
              <section className="space-y-3">
                <div className="border-b border-zinc-200 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Skills</h3>
                </div>
                {skillActions.map((skill) => {
                  const id = 'skill-' + skill.categoryIndex + '-' + skill.skillIndex;
                  const applied = appliedItems.has(id);
                  return (
                    <article key={id} className="rounded-xl border border-zinc-200 bg-white p-3 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Status action={skill.action} />
                        <span className="text-[10px] text-zinc-400">{skill.category}</span>
                        {applied && <span className="text-[10px] text-emerald-700">Applied</span>}
                      </div>
                      <p className="text-sm font-medium text-zinc-800">{skill.original}</p>
                      {skill.action === 'modify' && (
                        <input
                          value={editedSuggestions[id] ?? skill.text}
                          onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                          className="w-full rounded-lg border border-amber-200 bg-white p-2 text-sm text-zinc-900"
                          aria-label="Modified skill name"
                        />
                      )}
                      {skill.reason && <p className="text-xs text-zinc-500">{skill.reason}</p>}
                      {skill.action !== 'keep' && (
                        <div className="flex justify-end">
                          <button
                            disabled={applied}
                            onClick={() => applySkillDecision(skill, id)}
                            className={'rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ' + (
                              skill.action === 'remove'
                                ? 'border border-red-200 bg-red-50 text-red-700'
                                : 'bg-cyan-700 text-white'
                            )}
                          >
                            {applied ? 'Applied' : skill.action === 'remove' ? 'Remove skill' : 'Apply correction'}
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
                {skillAdditions.map((skill, index) => {
                  const id = 'skill-add-' + index;
                  const applied = appliedItems.has(id);
                  return (
                    <article key={id} className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/30 p-3 space-y-3">
                      <Status action="add" />
                      <p className="text-xs text-zinc-500">Category: {skill.category}</p>
                      <input
                        value={editedSuggestions[id] ?? skill.name}
                        onChange={(event) => setEditedSuggestions((previous) => ({ ...previous, [id]: event.target.value }))}
                        className="w-full rounded-lg border border-emerald-200 bg-white p-2 text-sm text-zinc-900"
                        aria-label="New evidence-backed skill"
                      />
                      {skill.reason && <p className="text-xs text-zinc-500">{skill.reason}</p>}
                      <div className="flex justify-end">
                        <button
                          disabled={applied}
                          onClick={() => applySkillAddition(skill, id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          <Plus size={13} /> {applied ? 'Added' : 'Add skill'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            )}

            {!hasReviewableContent && (
              <p className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600">
                There is no reviewable content in the included sections yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
