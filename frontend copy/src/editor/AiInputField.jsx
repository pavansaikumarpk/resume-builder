

// // import React, { useState } from 'react';
// // import { Sparkles, Loader2 } from 'lucide-react';
// // import api from '../utils/api';

// // export const AiInputField = ({ value, onChange, placeholder, rows = 4 }) => {
// //   const [isImproving, setIsImproving] = useState(false);

// //   const handleImprove = async (e) => {
// //     e.preventDefault(); // Prevents page reload
// //     if (!value || value.trim().length < 10) {
// //       alert("Please type a rough draft (at least 10 characters) before using AI.");
// //       return;
// //     }
    
// //     setIsImproving(true);
// //     try {
// //       const { data } = await api.post('/ai/optimize-bullet', { bulletText: value });
// //       if (data && data.optimized) {
// //         onChange(data.optimized);
// //       }
// //     } catch (error) {
// //       console.error("AI Error:", error);
// //       alert("Failed to connect to AI. Ensure your backend is running.");
// //     } finally {
// //       setIsImproving(false);
// //     }
// //   };

// //   return (
// //     <div className="relative group w-full mt-2">
// //       <textarea 
// //         rows={rows}
// //         value={value}
// //         onChange={(e) => onChange(e.target.value)}
// //         className={`w-full p-4 pb-12 rounded-xl border focus:border-blue-500 outline-none resize-none transition-all shadow-sm ${
// //           isImproving ? 'bg-indigo-50/50 border-indigo-200 text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-700'
// //         }`}
// //         placeholder={placeholder}
// //         disabled={isImproving}
// //       />
      
// //       {/* The Magic Floating AI Button */}
// //       <button 
// //         type="button"
// //         onClick={handleImprove}
// //         disabled={isImproving}
// //         className="absolute bottom-3 right-3 px-3 py-1.5 bg-white border border-slate-200 text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-2 opacity-80 hover:opacity-100 disabled:opacity-50 text-xs font-bold z-10"
// //       >
// //         {isImproving ? <Loader2 size={14} className="animate-spin text-indigo-500" /> : <Sparkles size={14} />}
// //         {isImproving ? 'Improving...' : 'AI Rewrite'}
// //       </button>
// //     </div>
// //   );
// // };




// import React, { useState } from 'react';
// import { Sparkles, Loader2 } from 'lucide-react';
// import api from '../utils/api';

// export const AiInputField = ({ value, onChange, placeholder, rows = 4 }) => {
//   const [isImproving, setIsImproving] = useState(false);

//   const handleImprove = async (e) => {
//     e.preventDefault(); 
//     if (!value || value.trim().length < 10) return alert("Type at least 10 characters before using AI.");
//     setIsImproving(true);
//     try {
//       const { data } = await api.post('/ai/optimize-bullet', { bulletText: value });
//       if (data && data.optimized) onChange(data.optimized);
//     } catch (error) { alert("Failed to connect to AI."); } 
//     finally { setIsImproving(false); }
//   };

//   return (
//     <div className="relative w-full mt-2">
//       <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} disabled={isImproving} placeholder={placeholder}
//         className={`w-full p-4 pb-12 rounded-xl border outline-none resize-none transition-all shadow-sm ${
//           isImproving ? 'bg-indigo-50/50 border-indigo-200 text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-blue-500'
//         }`}
//       />
//       <button type="button" onClick={handleImprove} disabled={isImproving} className="absolute bottom-3 right-3 px-3 py-1.5 bg-white border border-slate-200 text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-xs font-bold z-10">
//         {isImproving ? <Loader2 size={14} className="animate-spin text-indigo-500" /> : <Sparkles size={14} />}
//         {isImproving ? 'Improving...' : 'AI Rewrite'}
//       </button>
//     </div>
//   );
// };








import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import api from '../utils/api';

export const AiInputField = ({ value, onChange, placeholder, rows = 4 }) => {
  const [isImproving, setIsImproving] = useState(false);

  const handleImprove = async (e) => {
    e.preventDefault(); 
    if (!value || value.trim().length < 10) return alert("Type at least 10 characters before using AI.");
    
    setIsImproving(true);
    try {
      const { data } = await api.post('/ai/optimize-bullet', { bulletText: value });
      if (data && data.optimized) onChange(data.optimized);
    } catch (error) { 
      alert("Failed to connect to AI. Check your backend."); 
    } finally { 
      setIsImproving(false); 
    }
  };

  return (
    <div className="relative w-full mt-2">
      <textarea 
        rows={rows} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        disabled={isImproving} 
        placeholder={placeholder}
        className={`w-full p-4 pb-12 rounded-xl border outline-none resize-none transition-all shadow-sm ${
          isImproving ? 'bg-indigo-50/50 border-indigo-200 text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500 focus:bg-white'
        }`}
      />
      <button 
        type="button" 
        onClick={handleImprove} 
        disabled={isImproving} 
        className="absolute bottom-3 right-3 px-3 py-1.5 bg-white border border-slate-200 text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-xs font-bold z-10 disabled:opacity-50"
      >
        {isImproving ? <Loader2 size={14} className="animate-spin text-indigo-500" /> : <Sparkles size={14} />}
        {isImproving ? 'Improving...' : 'AI Rewrite'}
      </button>
    </div>
  );
};