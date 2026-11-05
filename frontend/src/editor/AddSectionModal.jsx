import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

export default function AddSectionModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('list');
  const { addCustomSection } = useResumeStore();

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const key = `custom_${Date.now()}`;
    addCustomSection({ key, title: cleanTitle, isCustom: true, type });
    setTitle('');
    setType('list');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setType('list');
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-custom-section-title"
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleClose} aria-label="Back to editor" className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <ArrowLeft size={18} />
            </button>
            <h2 id="new-custom-section-title" className="text-lg font-bold text-slate-800 sm:text-xl">New Custom Section</h2>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close dialog" className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 space-y-5 overflow-y-auto p-5 sm:p-6">
          <div className="space-y-2">
            <label htmlFor="custom-section-title" className="text-sm font-bold text-slate-700">Section Title</label>
            <input
              id="custom-section-title"
              type="text"
              autoFocus
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g., Certifications, Awards, Languages"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-bold text-slate-700">Layout Style</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { value: 'list', title: 'List of Items', description: 'Entries with a title, date, links and details' },
                { value: 'bullets', title: 'Simple Bullet Points', description: 'A date field and separate text boxes for each point' },
                { value: 'text', title: 'Text Block', description: 'One free-form paragraph or description' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={type === option.value}
                  onClick={() => setType(option.value)}
                  className={`rounded-xl border p-3 text-left transition-all sm:p-4 ${type === option.value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <span className="block text-sm font-bold text-slate-800">{option.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-500">{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
            <button type="button" onClick={handleClose} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-slate-900">
              Add to Resume
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}