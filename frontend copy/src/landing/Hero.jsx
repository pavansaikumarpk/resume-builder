// import React from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '../components/Button';
// import { Sparkles, ArrowRight, Play } from 'lucide-react';

// export const Hero = () => {
//   return (
//     <section className="relative pt-32 pb-20 overflow-hidden">
//       {/* Background Glows */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
      
//       <div className="max-w-7xl mx-auto px-6 text-center">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-bold mb-8 shadow-sm"
//         >
//           <Sparkles size={16} className="text-blue-600" />
//           <span className="tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
//             Powered by next-gen AI Extraction
//           </span>
//         </motion.div>

//         <motion.h1 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="text-6xl md:text-8xl font-[1000] text-slate-900 tracking-tighter mb-8 leading-[0.9]"
//         >
//           Build a resume that <br /> 
//           <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-900">gets you hired.</span>
//         </motion.h1>

//         <motion.p 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed mb-12"
//         >
//           The only AI co-pilot that analyzes job descriptions, extracts your best points, and builds a world-class resume in seconds.
//         </motion.p>

//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="flex flex-col sm:flex-row items-center justify-center gap-4"
//         >
//           <Button className="h-16 px-10 rounded-[2rem] text-lg shadow-2xl shadow-blue-500/30" onClick={() => window.location.href='/signup'}>
//             Get Started Free <ArrowRight size={20} />
//           </Button>
//           <Button variant="secondary" className="h-16 px-10 rounded-[2rem] text-lg">
//             Watch Demo <Play size={18} fill="currentColor" />
//           </Button>
//         </motion.div>
//       </div>
//     </section>
//   );
// };












import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, FileText, Target, Zap } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-[#0A0A0A] text-white flex flex-col items-center text-center font-sans">
      
      {/* Deep Background Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-8 shadow-2xl shadow-indigo-500/10"
        >
          <Sparkles size={14} /> AI-Powered Resume Builder
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] mb-6 max-w-4xl"
        >
          Stop getting rejected by <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
            faceless algorithms.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-10"
        >
          The only AI co-pilot that analyzes job descriptions, extracts your best points, and builds a world-class, ATS-friendly resume in seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <button 
            onClick={() => navigate('/editor/new')}
            className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-bold rounded-full flex items-center gap-2 transition-all shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:shadow-[0_0_60px_rgba(79,70,229,0.6)] hover:-translate-y-1"
          >
            Create My Resume <ChevronRight size={18} />
          </button>
          <p className="text-xs text-slate-500 font-medium sm:hidden">No credit card required. Free to export.</p>
        </motion.div>

        {/* Hero Product Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl relative"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-2 md:p-4 shadow-2xl backdrop-blur-md">
            <div className="rounded-[1.5rem] overflow-hidden border border-white/10 relative aspect-[16/9] bg-[#0f172a] shadow-inner">
              
              {/* Replace '/hero.png' with a screenshot of the Workspace Editor */}
              <img 
                src="/hero.png" 
                alt="Resumn Editor Interface" 
                className="w-full h-full object-cover object-top opacity-90"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
              
              {/* Floating Feature Badges over the image */}
              <div className="absolute bottom-6 left-6 flex items-center gap-3">
                 <div className="px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-2 text-xs font-bold text-white">
                    <Target size={14} className="text-emerald-400"/> ATS Optimized
                 </div>
                 <div className="px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-2 text-xs font-bold text-white">
                    <Zap size={14} className="text-indigo-400"/> 1-Click AI Tailoring
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};