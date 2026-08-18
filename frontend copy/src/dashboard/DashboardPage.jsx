




// import React, { useEffect, useState } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { useNavigate } from 'react-router-dom';
// import { FileText, Plus, Trash2, Loader2, LogOut, FileEdit, LayoutTemplate, Clock, Edit2 } from 'lucide-react';
// import { useAuthStore } from '../store/useAuthStore';
// import api from '../utils/api';

// export default function DashboardPage() {
//   const { resumes, fetchResumes, isLoading, fetchActiveResume, deleteResume } = useResumeStore();
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();
  
//   const [openingId, setOpeningId] = useState(null);
//   const [isCreating, setIsCreating] = useState(false);
  
//   // States for inline renaming
//   const [editingId, setEditingId] = useState(null);
//   const [editTitle, setEditTitle] = useState('');

//   useEffect(() => {
//     fetchResumes();
//   }, [fetchResumes]);

//   const handleCreateNew = async () => {
//     try {
//       setIsCreating(true);
//       const { data } = await api.post('/resume', { title: 'Untitled Resume', resumeData: {} });
//       await fetchActiveResume(data._id);
//       navigate(`/workspace/${data._id}`);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create resume.");
//       setIsCreating(false);
//     }
//   };

//   const handleOpenResume = async (id) => {
//     setOpeningId(id);
//     const success = await fetchActiveResume(id);
//     if (success) {
//       navigate(`/workspace/${id}`);
//     } else {
//       alert("Could not open this resume.");
//       setOpeningId(null);
//     }
//   };

//   const startRenaming = (e, id, currentTitle) => {
//     e.stopPropagation();
//     setEditingId(id);
//     setEditTitle(currentTitle || 'Untitled Document');
//   };

//   const handleRenameSubmit = async (id) => {
//     if (!editTitle.trim()) {
//       setEditingId(null);
//       return;
//     }
    
//     try {
//       // Send the updated title to the backend
//       await api.put(`/resume/${id}`, { title: editTitle });
//       // Refresh the list to show the new name
//       fetchResumes();
//     } catch (err) {
//       console.error("Failed to rename resume", err);
//       alert("Failed to rename resume.");
//     }
//     setEditingId(null);
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
//       {/* Sleek App Header */}
//       <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
//         <div className="flex items-center gap-2 font-black text-xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
//             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-inner">
//               <FileText size={18} className="text-white" />
//             </div>
//             resumn<span className="text-indigo-500">.</span>
//         </div>
        
//         <div className="flex items-center gap-4">
//           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
//             {user?.username?.charAt(0).toUpperCase() || 'U'}
//           </div>
//           <button 
//             onClick={logout} 
//             className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
//             title="Logout"
//           >
//             <LogOut size={18} />
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto px-6 py-12">
        
//         <div className="mb-10">
//           <h2 className="text-3xl font-black tracking-tight mb-2">Projects</h2>
//           <p className="text-slate-500 text-sm font-medium">Create, edit, and manage your resumes.</p>
//         </div>

//         {isLoading && resumes.length === 0 ? (
//           <div className="flex justify-center py-32">
//              <div className="flex flex-col items-center gap-4">
//                <Loader2 className="animate-spin text-indigo-600" size={40} />
//                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Workspace...</p>
//              </div>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
//             {/* Action Card: Create New (Tactile & Inviting) */}
//             <button 
//               onClick={handleCreateNew} 
//               disabled={isCreating}
//               className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed border-slate-300 rounded-[1.5rem] min-h-[260px] text-slate-500 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isCreating ? (
//                 <Loader2 size={32} className="animate-spin text-indigo-500" />
//               ) : (
//                 <div className="w-14 h-14 bg-slate-100 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center transition-colors">
//                   <Plus size={28} />
//                 </div>
//               )}
//               <span className="font-bold text-sm tracking-wide">
//                 {isCreating ? 'Preparing Workspace...' : 'New Resume'}
//               </span>
//             </button>

//             {/* Document Cards */}
//             {resumes.map(resume => {
//               const isOpening = openingId === resume._id;
//               const isEditingTitle = editingId === resume._id;
              
//               return (
//                 <div 
//                   key={resume._id} 
//                   className="bg-white border border-slate-200 rounded-[1.5rem] p-5 flex flex-col justify-between min-h-[260px] group hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 relative overflow-hidden"
//                 >
//                   {/* Subtle top color bar based on template */}
//                   <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-200 to-slate-300 group-hover:from-indigo-400 group-hover:to-blue-500 transition-all duration-500" />

//                   <div className="mt-2">
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors shadow-sm">
//                         <LayoutTemplate size={24} strokeWidth={1.5} />
//                       </div>
                      
//                       <button 
//                         onClick={(e) => { e.stopPropagation(); deleteResume(resume._id); }} 
//                         className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors opacity-0 group-hover:opacity-100" 
//                         title="Delete Document"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
                    
//                     {/* INLINE RENAME LOGIC */}
//                     {isEditingTitle ? (
//                       <input 
//                         autoFocus
//                         value={editTitle}
//                         onChange={(e) => setEditTitle(e.target.value)}
//                         onBlur={() => handleRenameSubmit(resume._id)}
//                         onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(resume._id)}
//                         className="w-full font-black text-lg text-indigo-950 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500/50 -ml-2"
//                       />
//                     ) : (
//                       <div className="flex items-center gap-2 group/title cursor-pointer -ml-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors" onClick={(e) => startRenaming(e, resume._id, resume.title)}>
//                         <h3 className="font-black text-lg text-slate-800 tracking-tight truncate group-hover:text-indigo-950 transition-colors">
//                           {resume.title || 'Untitled Document'}
//                         </h3>
//                         <Edit2 size={14} className="text-slate-300 opacity-0 group-hover/title:opacity-100 hover:text-indigo-600 transition-all shrink-0" />
//                       </div>
//                     )}
                    
//                     <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mt-2 ml-1">
//                        <Clock size={12} />
//                        Edited {new Date(resume.updatedAt).toLocaleDateString()}
//                     </div>
//                   </div>
                  
//                   <button 
//                     onClick={() => handleOpenResume(resume._id)} 
//                     disabled={openingId !== null}
//                     className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all mt-6 ${
//                       isOpening 
//                         ? 'bg-indigo-50 text-indigo-600 cursor-not-allowed' 
//                         : 'bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-transparent'
//                     }`}
//                   >
//                     {isOpening ? <Loader2 size={16} className="animate-spin"/> : <FileEdit size={16} />} 
//                     {isOpening ? 'Loading Editor...' : 'Open Editor'}
//                   </button>

//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



























import React, { useEffect, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Loader2, LogOut, FileEdit, LayoutTemplate, Clock, Edit2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';

export default function DashboardPage() {
  const { resumes, fetchResumes, isLoading, fetchActiveResume, deleteResume } = useResumeStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [openingId, setOpeningId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // States for inline renaming
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleCreateNew = async () => {
    try {
      setIsCreating(true);
      const { data } = await api.post('/resume', { title: 'Untitled Resume', resumeData: {} });
      await fetchActiveResume(data._id);
      navigate(`/workspace/${data._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create resume.");
      setIsCreating(false);
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

  const startRenaming = (e, id, currentTitle) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle || 'Untitled Document');
  };

  const handleRenameSubmit = async (id) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    
    try {
      await api.put(`/resume/${id}`, { title: editTitle });
      fetchResumes();
    } catch (err) {
      console.error("Failed to rename resume", err);
      alert("Failed to rename resume.");
    }
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* Sleek App Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2 font-black text-xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-inner">
              <FileText size={18} className="text-white" />
            </div>
            resumn<span className="text-indigo-500">.</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button 
            onClick={logout} 
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tight mb-2">Projects</h2>
          <p className="text-slate-500 text-sm font-medium">Create, edit, and manage your resumes.</p>
        </div>

        {isLoading && resumes.length === 0 ? (
          <div className="flex justify-center py-32">
             <div className="flex flex-col items-center gap-4">
               <Loader2 className="animate-spin text-indigo-600" size={40} />
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Workspace...</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            
            {/* Action Card: Create New */}
            <button 
              onClick={handleCreateNew} 
              disabled={isCreating}
              className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed border-slate-300 rounded-[1.5rem] min-h-[260px] text-slate-500 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <Loader2 size={32} className="animate-spin text-indigo-500" />
              ) : (
                <div className="w-14 h-14 bg-slate-100 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center transition-colors">
                  <Plus size={28} />
                </div>
              )}
              <span className="font-bold text-sm tracking-wide">
                {isCreating ? 'Preparing Workspace...' : 'New Resume'}
              </span>
            </button>

            {/* Document Cards */}
            {resumes.map(resume => {
              const isOpening = openingId === resume._id;
              const isEditingTitle = editingId === resume._id;
              
              return (
                <div 
                  key={resume._id} 
                  className="bg-white border border-slate-200 rounded-[1.5rem] p-5 flex flex-col justify-between min-h-[260px] group hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-200 to-slate-300 group-hover:from-indigo-400 group-hover:to-blue-500 transition-all duration-500" />

                  <div className="mt-2">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors shadow-sm">
                        <LayoutTemplate size={24} strokeWidth={1.5} />
                      </div>
                      
                      {/* Overtly visible Trash Icon */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteResume(resume._id); }} 
                        className="p-2 text-slate-400 bg-slate-50 border border-transparent hover:border-red-200 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Inline Rename Input vs Title Display */}
                    {isEditingTitle ? (
                      <input 
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleRenameSubmit(resume._id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(resume._id)}
                        className="w-full font-black text-lg text-indigo-950 bg-indigo-50 border border-indigo-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500/50 -ml-2"
                      />
                    ) : (
                      <div className="flex items-center gap-2 group/title cursor-pointer -ml-2 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors" onClick={(e) => startRenaming(e, resume._id, resume.title)}>
                        <h3 className="font-black text-lg text-slate-800 tracking-tight truncate group-hover:text-indigo-950 transition-colors">
                          {resume.title || 'Untitled Document'}
                        </h3>
                        {/* Overtly visible Edit Icon */}
                        <div className="flex items-center justify-center p-1.5 rounded-md bg-slate-100 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-all shrink-0" title="Rename Document">
                          <Edit2 size={14} />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mt-2 ml-1">
                       <Clock size={12} />
                       Edited {new Date(resume.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleOpenResume(resume._id)} 
                    disabled={openingId !== null}
                    className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all mt-6 ${
                      isOpening 
                        ? 'bg-indigo-50 text-indigo-600 cursor-not-allowed' 
                        : 'bg-slate-50 text-slate-600 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-transparent'
                    }`}
                  >
                    {isOpening ? <Loader2 size={16} className="animate-spin"/> : <FileEdit size={16} />} 
                    {isOpening ? 'Loading Editor...' : 'Open Editor'}
                  </button>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}