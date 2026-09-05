import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AuthLayout = ({ children, title, subtitle, variant = 'default' }) => {
  if (variant === 'signup') {
    return (
      <div className="min-h-screen bg-[#f5f9ff] text-slate-900 font-sans">
        <header className="h-[70px] bg-white border-b border-blue-100">
          <div className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-[20px] text-slate-950">
              <span className="w-8 h-8 rounded-[9px] bg-blue-600 text-white flex items-center justify-center"><FileText size={16} /></span>
              resumn<span className="text-blue-600">.</span>
            </Link>
            <p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link></p>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-5 py-12 lg:py-16 grid lg:grid-cols-[1fr_420px] gap-14 items-center">
          <div className="hidden lg:block max-w-xl">
            <p className="text-[11px] font-bold tracking-[0.18em] text-blue-600 mb-5">START YOUR RESUME</p>
            <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight text-slate-950">Get from job description to a finished resume faster.</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">Create your account, add your experience, and build a resume you can actually use for your next application.</p>
            <div className="mt-8 space-y-4 text-sm text-slate-600">
              {['Start with a clean resume structure', 'Keep your experience and projects organized', 'Export a professional PDF when you are ready'].map((item) => (
                <div key={item} className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-600 shrink-0" /><span>{item}</span></div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full bg-white border border-blue-100 rounded-2xl p-7 sm:p-8 shadow-[0_20px_55px_rgba(37,99,235,0.10)]">
            <div className="mb-7"><h2 className="text-2xl font-bold tracking-tight text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p></div>
            {children}
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex bg-[#f5f9ff] font-sans text-slate-900 overflow-hidden">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#eef5ff] via-white to-[#dceaff] relative flex-col justify-between p-12 text-slate-900 overflow-hidden border-r border-blue-100">
        <div className="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full bg-blue-200/50 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
        <Link to="/" className="relative flex items-center gap-2 font-bold text-2xl tracking-tight w-max">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><FileText size={20} className="text-white" /></div>
          resumn<span className="text-blue-600">.</span>
        </Link>
        <div className="relative max-w-lg">
          <p className="text-[11px] font-bold tracking-[0.18em] text-blue-600 mb-4">BUILD A BETTER RESUME</p>
          <h1 className="text-4xl font-bold leading-tight mb-5">Keep your resume ready for the next opportunity.</h1>
          <p className="text-slate-600 max-w-md leading-7">Create it once, tailor it when needed, and keep everything in one place.</p>
        </div>
        <div className="relative flex gap-6 text-sm font-medium text-slate-500 border-t border-blue-200 pt-7">
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-600" /> ATS friendly</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-600" /> Easy editing</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-600" /> PDF export</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white">
        <Link to="/" className="lg:hidden absolute top-8 left-6 flex items-center gap-2 font-bold text-xl tracking-tight"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><FileText size={16} className="text-white" /></div>resumn<span className="text-blue-600">.</span></Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <div className="text-center mb-8 mt-10 lg:mt-0"><h2 className="text-3xl font-bold tracking-tight text-slate-950 mb-2">{title}</h2><p className="text-slate-500 text-sm">{subtitle}</p></div>
          {children}
        </motion.div>
      </div>
    </div>
  );
};