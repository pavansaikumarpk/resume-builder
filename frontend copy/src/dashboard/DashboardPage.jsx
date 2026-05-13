import React, { useEffect, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Loader2, LogOut, FileEdit } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';

export default function DashboardPage() {
  const { resumes, fetchResumes, isLoading, fetchActiveResume, deleteResume } = useResumeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [openingId, setOpeningId] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreateNew = async () => {
    try {
      // 🚀 CRITICAL FIX: Pass an empty resumeData object so the backend schema doesn't fail
      const { data } = await api.post('/resume', { title: 'Untitled Resume', resumeData: {} });
      await fetchActiveResume(data._id);
      navigate(`/workspace/${data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create resume.");
    }
  };

  const handleOpenResume = async (id) => {
    setOpeningId(id);
    const success = await fetchActiveResume(id);
    if (success) {
      navigate(`/workspace/${id}`);
    } else {
      alert("Could not open this resume.");
      setOpeningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="text-indigo-600" /> ResumeAI
        </h1>
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-slate-600">Welcome, {user?.username || 'User'}</span>
          <button onClick={logout} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Your Documents</h2>
            <p className="text-slate-500 text-sm">Manage and edit your saved professional resumes.</p>
          </div>
          <button onClick={handleCreateNew} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md text-sm">
            <Plus size={18} /> Create New
          </button>
        </div>

        {isLoading && resumes.length === 0 ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <FileText size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">No resumes yet</h3>
            <p className="text-slate-500 text-sm mb-6">Create your first resume to get started.</p>
            <button onClick={handleCreateNew} className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm">Start Building</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <div key={resume._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-h-[220px] group">
                <div>
                  <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center mb-4">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 truncate">{resume.title || 'Untitled'}</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Edited: {new Date(resume.updatedAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => handleOpenResume(resume._id)} 
                    disabled={openingId === resume._id}
                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {openingId === resume._id ? <Loader2 size={16} className="animate-spin"/> : <FileEdit size={16} />} 
                    {openingId === resume._id ? 'Opening...' : 'Open Editor'}
                  </button>
                  <button onClick={() => deleteResume(resume._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}