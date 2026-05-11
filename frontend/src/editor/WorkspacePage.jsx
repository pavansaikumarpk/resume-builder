



// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useResumeStore } from '../store/useResumeStore';

// // 👇 FIX: Notice the curly braces around these imports!
// import { EditorPanel } from './EditorPanel';
// import { PreviewPanel } from './PreviewPanel';
// import { AnalysisPanel } from './AnalysisPanel';

// import { Loader2, ArrowLeft, Cloud, Sparkles } from 'lucide-react';
// import styles from './workspace.module.css';

// export default function WorkspacePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { fetchActiveResume, isLoading, activeResume, isSaving } = useResumeStore();

//   // THE MONETIZATION TOGGLE STATE (Default OFF)
//   const [isAiMode, setIsAiMode] = useState(false);

//   // DRAG HANDLE STATES
//   const [leftWidth, setLeftWidth] = useState(320); 
//   const [rightWidth, setRightWidth] = useState(350); 
  
//   const isDraggingLeft = useRef(false);
//   const isDraggingRight = useRef(false);

//   useEffect(() => {
//     if (id) fetchActiveResume(id);
//   }, [id, fetchActiveResume]);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (isDraggingLeft.current) {
//         let newWidth = e.clientX;
//         if (newWidth < 250) newWidth = 250;
//         if (newWidth > 600) newWidth = 600;
//         setLeftWidth(newWidth);
//       } else if (isDraggingRight.current) {
//         let newWidth = window.innerWidth - e.clientX;
//         if (newWidth < 300) newWidth = 300;
//         if (newWidth > 800) newWidth = 800;
//         setRightWidth(newWidth);
//       }
//     };

//     const handleMouseUp = () => {
//       isDraggingLeft.current = false;
//       isDraggingRight.current = false;
//       document.body.style.cursor = 'default';
//       document.body.style.userSelect = ''; 
//     };

//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);
//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, []);

//   if (isLoading || !activeResume) {
//     return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
//   }

//   return (
//     <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans">
      
//       {/* App Header */}
//       <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shrink-0">
//         <div className="flex items-center gap-3">
//           <button onClick={() => navigate('/dashboard')} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
//             <ArrowLeft size={18} />
//           </button>
//           <div className="h-4 w-px bg-slate-300 mx-1"></div>
//           <h1 className="font-bold text-slate-800 text-sm tracking-tight truncate max-w-[300px]">
//             {activeResume.title || 'Untitled Resume'}
//           </h1>
//           {isSaving && (
//             <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md ml-2 uppercase tracking-wider">
//               <Cloud size={10} className="animate-pulse" /> Saving
//             </span>
//           )}
//         </div>

//         {/* --- PRO AI TOGGLE UI --- */}
//         <div className="flex items-center gap-3 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700 shadow-inner">
//           <Sparkles size={14} className={isAiMode ? "text-indigo-400" : "text-slate-500"} />
//           <span className={`text-xs font-bold tracking-wider uppercase transition-colors ${isAiMode ? "text-white" : "text-slate-400"}`}>
//             AI Co-Pilot
//           </span>
//           <label className={styles.switch}>
//             <input type="checkbox" checked={isAiMode} onChange={(e) => setIsAiMode(e.target.checked)} />
//             <span className={styles.slider}></span>
//           </label>
//           {isAiMode && <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/20 px-2 py-0.5 rounded animate-pulse">PRO</span>}
//         </div>
//       </header>

//       {/* 3-Pane Layout with Drag Handles */}
//       <div className="flex-1 flex overflow-hidden">
        
//         {/* CONDITIONALLY RENDER LEFT PANEL: AI Co-Pilot */}
//         {isAiMode && (
//           <>
//             <div style={{ width: leftWidth }} className="bg-white flex flex-col z-10 shrink-0 border-r border-slate-200 shadow-xl">
//               <AnalysisPanel />
//             </div>

//             {/* LEFT DRAG HANDLE */}
//             <div 
//               className="w-1.5 bg-slate-200 hover:bg-indigo-500 cursor-col-resize z-20 transition-colors"
//               onMouseDown={() => { 
//                 isDraggingLeft.current = true; 
//                 document.body.style.cursor = 'col-resize';
//                 document.body.style.userSelect = 'none'; 
//               }}
//             />
//           </>
//         )}

//         {/* CENTER: Editor Panel */}
//         <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto relative shadow-inner min-w-[300px]">
//           <EditorPanel />
//         </div>

//         {/* RIGHT DRAG HANDLE */}
//         <div 
//           className="w-1.5 bg-[#2d2d2d] hover:bg-indigo-500 cursor-col-resize z-20 transition-colors"
//           onMouseDown={() => { 
//             isDraggingRight.current = true; 
//             document.body.style.cursor = 'col-resize';
//             document.body.style.userSelect = 'none';
//           }}
//         />

//         {/* RIGHT: Live PDF Preview */}
//         <div style={{ width: rightWidth }} className="bg-[#1e1e1e] flex flex-col z-10 relative shrink-0">
//           <PreviewPanel />
//         </div>

//       </div>
//     </div>
//   );
// }











import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { AnalysisPanel } from './AnalysisPanel';
import { Loader2, ArrowLeft, Cloud, Sparkles } from 'lucide-react';
import styles from './workspace.module.css';

export default function WorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchActiveResume, isLoading, activeResume, isSaving } = useResumeStore();

  const [isAiMode, setIsAiMode] = useState(false);

  // 🚀 CRITICAL FIX: Default to 45% of the screen width for a perfect layout balance
  const initialRightWidth = window.innerWidth * 0.40;
  const [leftWidth, setLeftWidth] = useState(320); 
  const [rightWidth, setRightWidth] = useState(initialRightWidth); 
  
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  useEffect(() => {
    if (id) fetchActiveResume(id);
  }, [id, fetchActiveResume]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingLeft.current) {
        let newWidth = e.clientX;
        if (newWidth < 250) newWidth = 250;
        if (newWidth > 600) newWidth = 600;
        setLeftWidth(newWidth);
      } else if (isDraggingRight.current) {
        let newWidth = window.innerWidth - e.clientX;
        if (newWidth < 300) newWidth = 300;
        // 🚀 Allow right panel to take up to 65% of the screen
        if (newWidth > window.innerWidth * 0.65) newWidth = window.innerWidth * 0.65; 
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      isDraggingLeft.current = false;
      isDraggingRight.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = ''; 
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isLoading || !activeResume) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  }

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans">
      
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="h-4 w-px bg-slate-300 mx-1"></div>
          <h1 className="font-bold text-slate-800 text-sm tracking-tight truncate max-w-[300px]">
            {activeResume.title || 'Untitled Resume'}
          </h1>
          {isSaving && (
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md ml-2 uppercase tracking-wider">
              <Cloud size={10} className="animate-pulse" /> Saving
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700 shadow-inner">
          <Sparkles size={14} className={isAiMode ? "text-indigo-400" : "text-slate-500"} />
          <span className={`text-xs font-bold tracking-wider uppercase transition-colors ${isAiMode ? "text-white" : "text-slate-400"}`}>
            AI Co-Pilot
          </span>
          <label className={styles.switch}>
            <input type="checkbox" checked={isAiMode} onChange={(e) => setIsAiMode(e.target.checked)} />
            <span className={styles.slider}></span>
          </label>
          {isAiMode && <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/20 px-2 py-0.5 rounded animate-pulse">PRO</span>}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {isAiMode && (
          <>
            <div style={{ width: leftWidth }} className="bg-white flex flex-col z-10 shrink-0 border-r border-slate-200 shadow-xl">
              <AnalysisPanel />
            </div>

            <div 
              className="w-1.5 bg-slate-200 hover:bg-indigo-500 cursor-col-resize z-20 transition-colors"
              onMouseDown={() => { 
                isDraggingLeft.current = true; 
                document.body.style.cursor = 'col-resize';
                document.body.style.userSelect = 'none'; 
              }}
            />
          </>
        )}

        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto relative shadow-inner min-w-[300px]">
          <EditorPanel />
        </div>

        <div 
          className="w-1.5 bg-[#2d2d2d] hover:bg-indigo-500 cursor-col-resize z-20 transition-colors"
          onMouseDown={() => { 
            isDraggingRight.current = true; 
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
        />

        <div style={{ width: rightWidth }} className="bg-[#1e1e1e] flex flex-col z-10 relative shrink-0">
          <PreviewPanel />
        </div>

      </div>
    </div>
  );
}