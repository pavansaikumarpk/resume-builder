import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-900 overflow-hidden">
      <div className="hidden lg:flex w-1/2 bg-[#0A0A0A] relative flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        </div>

        <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter z-10 w-max hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FileText size={20} className="text-white" />
          </div>
          resumn<span className="text-indigo-500">.</span>
        </Link>

        <div className="z-10 relative max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-indigo-300 uppercase tracking-widest mb-6 backdrop-blur-md">
            <Sparkles size={14} /> Build a better resume
          </div>

          <h1 className="text-4xl font-black leading-tight mb-8">
            Build a clean, ATS-friendly resume with less manual work.
          </h1>

          <p className="text-slate-400 max-w-md leading-relaxed">
            Create your resume, tailor content with AI, and export it when you are ready to apply.
          </p>
        </div>

        <div className="z-10 relative flex gap-6 text-sm font-medium text-slate-400 border-t border-white/10 pt-8">
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> ATS Optimized</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> AI Tailoring</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> 1-Click Export</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-slate-50 lg:bg-white">
        <Link to="/" className="lg:hidden absolute top-8 left-6 flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          resumn<span className="text-indigo-500">.</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8 mt-10 lg:mt-0">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">{title}</h2>
            <p className="text-slate-500 font-medium text-sm">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
};
