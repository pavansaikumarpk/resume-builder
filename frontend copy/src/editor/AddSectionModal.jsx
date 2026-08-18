import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { X } from 'lucide-react';

export default function AddSectionModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('list');
  const { addCustomSection } = useResumeStore();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const key = `custom_${Date.now()}`;
    // FIXED: Now saves 'type' (list or text) to determine how it renders
    addCustomSection({ key, title, isCustom: true, type });
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">New Custom Section</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Section Title</label>
            <input 
              type="text" autoFocus required value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Certifications, Awards, Languages"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Layout Style</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setType('list')} className={`p-4 border rounded-xl text-left transition-all ${type === 'list' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="font-bold text-slate-800 text-sm">List of Items</div>
                <div className="text-xs text-slate-500 mt-1">Like Experience (Title, Date, Description)</div>
              </button>
              <button type="button" onClick={() => setType('text')} className={`p-4 border rounded-xl text-left transition-all ${type === 'text' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className="font-bold text-slate-800 text-sm">Text Block</div>
                <div className="text-xs text-slate-500 mt-1">Like a Summary (One big paragraph)</div>
              </button>
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all">
            Add to Resume
          </button>
        </form>
      </div>
    </div>
  );
}