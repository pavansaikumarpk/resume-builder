import React, { useEffect, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Loader2, LogOut, FileEdit, Clock, Edit2, Mail } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';

export default function DashboardPage() {
  const { resumes, fetchResumes, isLoading, fetchActiveResume, deleteResume } = useResumeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [openingId, setOpeningId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

  const handleCreateNew = async () => {
    try {
      setIsCreating(true);
      const { data } = await api.post('/resume', { title: 'Untitled Resume', resumeData: {} });
      await fetchActiveResume(data._id);
      navigate(`/workspace/${data._id}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create resume.');
      setIsCreating(false);
    }
  };

  const handleOpenResume = async (id) => {
    setOpeningId(id);
    const success = await fetchActiveResume(id);
    if (success) navigate(`/workspace/${id}`);
    else { alert('Could not open this resume.'); setOpeningId(null); }
  };

  const startRenaming = (e, id, currentTitle) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle || 'Untitled Resume');
  };

  const handleRenameSubmit = async (id) => {
    if (!editTitle.trim()) { setEditingId(null); return; }
    try {
      await api.put(`/resume/${id}`, { title: editTitle.trim() });
      await fetchResumes();
    } catch (err) {
      console.error('Failed to rename resume', err);
      alert('Failed to rename resume.');
    }
    setEditingId(null);
  };

  const firstName = user?.username?.trim()?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#f5f9ff] text-slate-900 font-sans">
      <header className="h-[70px] bg-white border-b border-blue-100 sticky top-0 z-20">
        <nav className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 font-bold tracking-tight text-[20px] text-slate-950">
            <span className="w-8 h-8 rounded-[9px] bg-blue-600 text-white flex items-center justify-center"><FileText size={16} /></span>
            resumn<span className="text-blue-600">.</span>
          </button>
          <div className="flex items-center gap-3 sm:gap-5">
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=nahg9957@gmail.com&su=Resume%20Builder%20Feedback&body=Hi%2C%0A%0AI%20want%20to%20share%20a%20suggestion%20or%20report%20a%20problem%3A%0A" target="_blank" rel="noreferrer" className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
              <Mail size={16} /> Contact
            </a>
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Log out"><LogOut size={18} /></button>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-10 lg:py-14">
        <div className="mb-9">
          <p className="text-sm font-medium text-blue-600 mb-2">Welcome back, {firstName}</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-slate-950">Your resumes</h1>
              <p className="mt-2 text-sm text-slate-500">Pick up where you left off or start a new application.</p>
            </div>
            <button onClick={handleCreateNew} disabled={isCreating} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-60">
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={17} />}
              {isCreating ? 'Creating...' : 'New resume'}
            </button>
          </div>
        </div>

        {isLoading && resumes.length === 0 ? (
          <div className="flex justify-center py-24 text-blue-400"><Loader2 size={24} className="animate-spin" /></div>
        ) : resumes.length === 0 ? (
          <div className="bg-white border border-blue-100 rounded-2xl p-12 text-center shadow-[0_12px_35px_rgba(37,99,235,0.06)]">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><FileText size={22} /></div>
            <h2 className="font-semibold text-slate-800">No resumes yet</h2>
            <p className="text-sm text-slate-500 mt-1 mb-5">Create your first resume to get started.</p>
            <button onClick={handleCreateNew} className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Create resume</button>
          </div>
        ) : (
          <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-[0_12px_35px_rgba(37,99,235,0.06)]">
            <div className="hidden sm:grid grid-cols-[1fr_160px_120px] gap-4 px-5 py-3 bg-[#f8fbff] border-b border-blue-100 text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em]">
              <span>Resume</span><span>Last edited</span><span />
            </div>
            {resumes.map((resume, index) => {
              const isOpening = openingId === resume._id;
              const isEditingTitle = editingId === resume._id;
              return (
                <div key={resume._id} className={`grid grid-cols-1 sm:grid-cols-[1fr_160px_120px] gap-3 sm:gap-4 items-center px-5 py-4 ${index > 0 ? 'border-t border-blue-50' : ''} hover:bg-blue-50/30 transition-colors`}>
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-blue-100 bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><FileText size={18} /></div>
                    <div className="min-w-0">
                      {isEditingTitle ? (
                        <input autoFocus value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onBlur={() => handleRenameSubmit(resume._id)} onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(resume._id)} className="w-full max-w-sm h-9 px-2 border border-blue-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-sm" />
                      ) : (
                        <button onClick={(e) => startRenaming(e, resume._id, resume.title)} className="flex items-center gap-2 max-w-full text-left group/title">
                          <span className="font-semibold text-sm text-slate-800 truncate">{resume.title || 'Untitled Resume'}</span>
                          <Edit2 size={13} className="text-slate-300 group-hover/title:text-blue-600 shrink-0" />
                        </button>
                      )}
                      <p className="sm:hidden mt-1 flex items-center gap-1.5 text-xs text-slate-400"><Clock size={11} /> {new Date(resume.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500"><Clock size={13} /> {new Date(resume.updatedAt).toLocaleDateString()}</div>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleOpenResume(resume._id)} disabled={openingId !== null} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-60">
                      {isOpening ? <Loader2 size={14} className="animate-spin" /> : <FileEdit size={14} />}{isOpening ? 'Opening' : 'Open'}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteResume(resume._id); }} className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete resume"><Trash2 size={15} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
