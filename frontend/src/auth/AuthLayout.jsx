import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children, title, subtitle, variant = 'default' }) => {
  if (variant === 'signup') {
    return (
      <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans">
        <header className="h-16 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg">
              <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <FileText size={16} />
              </span>
              resumn<span className="text-indigo-600">.</span>
            </Link>
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-slate-900 hover:text-indigo-600">Sign in</Link>
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-5 py-12 lg:py-16 grid lg:grid-cols-[1fr_420px] gap-14 items-center">
          <div className="hidden lg:block max-w-xl">
            <p className="text-sm font-semibold text-indigo-600 mb-4">START YOUR RESUME</p>
            <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight leading-tight text-slate-950">
              Get from job description to a finished resume faster.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Create your account, add your experience, and build a resume you can actually use for your next application.
            </p>
            <div className="mt-8 space-y-4 text-sm text-slate-600">
              {['Start with a clean resume structure', 'Keep your experience and projects organized', 'Export a professional PDF when you are ready'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
          >
            <div className="mb-7">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
            </div>
            {children}
          </motion.div>
        </main>
      </div>
    );
  }

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
          <p className="text-sm font-semibold text-indigo-300 mb-4">RESUME BUILDER</p>
          <h1 className="text-4xl font-black leading-tight mb-6">Build a clean, ATS-friendly resume with less manual work.</h1>
          <p className="text-slate-400 max-w-md leading-relaxed">Create your resume, improve your content, and export it when you are ready to apply.</p>
        </div>
        <div className="z-10 relative flex gap-6 text-sm font-medium text-slate-400 border-t border-white/10 pt-8">
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> ATS friendly</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Easy editing</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> PDF export</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-slate-50 lg:bg-white">
        <Link to="/" className="lg:hidden absolute top-8 left-6 flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          resumn<span className="text-indigo-500">.</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
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
