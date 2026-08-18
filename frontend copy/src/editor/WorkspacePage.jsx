







// import React, { useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useResumeStore } from '../store/useResumeStore';
// import { EditorPanel } from './EditorPanel';
// import { PreviewPanel } from './PreviewPanel';
// import { AnalysisPanel } from './AnalysisPanel';
// import { Loader2, ArrowLeft, Cloud, Sparkles } from 'lucide-react';
// import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
// import styles from './workspace.module.css';

// export default function WorkspacePage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { fetchActiveResume, isLoading, activeResume, isSaving } = useResumeStore();

//   const [isAiMode, setIsAiMode] = React.useState(false);
//   const aiPanelRef = useRef(null);

//   useEffect(() => {
//     if (id) fetchActiveResume(id);
//   }, [id, fetchActiveResume]);

//   const toggleAiMode = () => {
//     const nextState = !isAiMode;
//     setIsAiMode(nextState);
    
//     if (aiPanelRef.current) {
//       if (nextState) {
//         aiPanelRef.current.expand();
//       } else {
//         aiPanelRef.current.collapse();
//       }
//     }
//   };

//   if (isLoading || !activeResume) {
//     return (
//       <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
//         <Loader2 className="animate-spin text-indigo-600" size={32} />
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden font-sans">
      
//       {/* HEADER */}
//       <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shrink-0 shadow-sm">
//         <div className="flex items-center gap-3">
//           <button 
//             onClick={() => navigate('/dashboard')} 
//             className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
//           >
//             <ArrowLeft size={18} />
//           </button>
//           <div className="h-4 w-px bg-slate-300 mx-1"></div>
//           <h1 className="font-bold text-slate-800 text-sm tracking-tight truncate max-w-[300px]">
//             {activeResume.title || 'Untitled Resume'}
//           </h1>
//           {isSaving && (
//             <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md ml-2 uppercase tracking-wider">
//               <Cloud size={12} className="animate-pulse text-indigo-500" /> Saving
//             </span>
//           )}
//         </div>

//         {/* AI Toggle Button */}
//         <button 
//           onClick={toggleAiMode}
//           className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-200 ease-in-out ${
//             isAiMode 
//               ? "bg-indigo-50 border-indigo-200 shadow-inner" 
//               : "bg-white border-slate-200 hover:bg-slate-50 shadow-sm"
//           }`}
//         >
//           <Sparkles size={14} className={isAiMode ? "text-indigo-600" : "text-slate-400"} />
//           <span className={`text-xs font-bold tracking-wider uppercase ${isAiMode ? "text-indigo-700" : "text-slate-500"}`}>
//             AI Co-Pilot
//           </span>
//           <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isAiMode ? 'bg-indigo-500' : 'bg-slate-300'}`}>
//             <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isAiMode ? 'translate-x-4' : 'translate-x-0'}`} />
//           </div>
//         </button>
//       </header>

//       {/* THREE COLUMN FLEX RESIZABLE WORKSPACE */}
//       <div className="flex-1 overflow-hidden">
//         <PanelGroup direction="horizontal" autoSaveId="resumn-workspace-layout">
          
//           {/* 1. AI SLIDE-IN PANEL */}
//           <Panel 
//             ref={aiPanelRef}
//             collapsible={true} 
//             defaultSize={0}
//             collapsedSize={0}
//             minSize={20}
//             maxSize={35}
//             onCollapse={() => setIsAiMode(false)}
//             onExpand={() => setIsAiMode(true)}
//             className="transition-all duration-300 ease-in-out"
//           >
//             <div className="h-full bg-white flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-slate-200">
//               {isAiMode && <AnalysisPanel />}
//             </div>
//           </Panel>

//           {/* AI Panel Resize Handle */}
//           {isAiMode && (
//             <PanelResizeHandle className="w-1.5 group bg-transparent hover:bg-indigo-500/20 active:bg-indigo-500 transition-colors flex items-center justify-center cursor-col-resize">
//               <div className="h-8 w-1 bg-slate-300 group-hover:bg-indigo-500 rounded-full transition-colors" />
//             </PanelResizeHandle>
//           )}

//           {/* 2. MAIN EDITOR PANEL */}
//           <Panel minSize={35} defaultSize={45}>
//             <div className="h-full bg-slate-50 overflow-y-auto relative shadow-inner">
//               <EditorPanel />
//             </div>
//           </Panel>

//           {/* Editor/Preview Resize Handle */}
//           <PanelResizeHandle className="w-1.5 group bg-transparent hover:bg-indigo-500/20 active:bg-indigo-500 transition-colors flex items-center justify-center cursor-col-resize border-x border-slate-200/50">
//              <div className="h-8 w-1 bg-slate-300 group-hover:bg-indigo-500 rounded-full transition-colors" />
//           </PanelResizeHandle>

//           {/* 3. LIVE PREVIEW PANEL */}
//           <Panel minSize={35} defaultSize={45} maxSize={65}>
//             <div className="h-full bg-[#323639] flex flex-col relative shrink-0">
//               <PreviewPanel />
//             </div>
//           </Panel>

//         </PanelGroup>
//       </div>
//     </div>
//   );
// }













import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { EditorPanel } from './EditorPanel';
import { PreviewPanel } from './PreviewPanel';
import { AnalysisPanel } from './AnalysisPanel';
import { Loader2, ArrowLeft, Cloud, Sparkles } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function WorkspacePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchActiveResume, isLoading, activeResume, isSaving } = useResumeStore();
  const [isAiMode, setIsAiMode] = React.useState(false);
  const aiPanelRef = useRef(null);

  useEffect(() => {
    if (id) fetchActiveResume(id);
  }, [id, fetchActiveResume]);

  const toggleAiMode = () => {
    const nextState = !isAiMode;
    setIsAiMode(nextState);
    if (aiPanelRef.current) {
      if (nextState) aiPanelRef.current.expand();
      else aiPanelRef.current.collapse();
    }
  };

  if (isLoading || !activeResume) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-zinc-900" size={32} />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-white flex flex-col overflow-hidden font-sans text-zinc-900 selection:bg-zinc-900/5 selection:text-zinc-950">
      
      {/* HEADER */}
      <header className="h-14 bg-white border-b border-zinc-100 flex items-center justify-between px-4 z-20 shrink-0 shadow-inner relative">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="p-1.5 bg-[#fbfdff] border border-zinc-100 hover:bg-white rounded-md text-zinc-600 hover:text-zinc-900 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="h-4 w-px bg-zinc-100 mx-1"></div>
          <h1 className="font-semibold text-zinc-900 text-sm tracking-tight truncate max-w-[300px]">
            {activeResume.title || 'Untitled Resume'}
          </h1>
          {isSaving && (
            <span className="text-[10px] font-medium text-zinc-500 flex items-center gap-1.5 bg-[#fafafa] border border-zinc-100 px-2 py-0.5 rounded-md ml-2 uppercase tracking-widest">
              <Cloud size={12} className="animate-pulse text-zinc-400" /> Saving...
            </span>
          )}
        </div>

        <button onClick={toggleAiMode} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 text-xs font-semibold ${isAiMode ? "bg-[#e0f2fe] border-sky-300 text-sky-700 shadow-inner" : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-[#fafafa]"}`}>
          <Sparkles size={14} className={isAiMode ? "text-sky-600" : "text-zinc-400"} />
          AI Co-Pilot
          <div className={`ml-1 w-6 h-3.5 rounded-full p-0.5 transition-colors ${isAiMode ? 'bg-[#06b6d4]' : 'bg-zinc-300'}`}>
            <div className={`w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${isAiMode ? 'translate-x-2.5' : 'translate-x-0'}`} />
          </div>
        </button>
      </header>

      {/* THREE COLUMN FLEX RESIZABLE WORKSPACE */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" autoSaveId="resumn-workspace-layout-v8">
          
          <Panel 
            ref={aiPanelRef}
            collapsible={true} 
            defaultSize={0}
            collapsedSize={0}
            minSize={20}
            maxSize={35}
            onCollapse={() => setIsAiMode(false)}
            onExpand={() => setIsAiMode(true)}
            className="transition-all duration-300 ease-in-out"
          >
            {/* 1. LEFT PANEL (ICE BLUE TINT) */}
            <div className="h-full bg-[#fbfdff] flex flex-col border-r border-zinc-100 relative z-10 shadow-[0_0_24px_rgba(0,0,0,0.02)]">
              {isAiMode && <AnalysisPanel />}
            </div>
          </Panel>

          {isAiMode && (
            <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-sky-50 active:bg-sky-100 transition-colors cursor-col-resize z-20" />
          )}

          <Panel minSize={35} defaultSize={45}>
            {/* 2. MIDDLE PANEL (NEUTRAL OFF-WHITE) */}
            <div className="h-full bg-[#fafafa] overflow-y-auto relative shadow-inner z-0">
              <EditorPanel />
            </div>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-transparent hover:bg-[#fafafa] transition-colors cursor-col-resize border-x border-zinc-100/50 z-20" />

          <Panel minSize={35} defaultSize={45} maxSize={65}>
             {/* 3. RIGHT PANEL (WARM EGGSHELL) */}
            <div className="h-full bg-[#fcf8f2] flex flex-col relative shrink-0 z-0">
              <PreviewPanel />
            </div>
          </Panel>

        </PanelGroup>
      </div>
    </div>
  );
}