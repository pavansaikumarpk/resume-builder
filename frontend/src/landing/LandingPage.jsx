import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, FileText, Menu, X, BriefcaseBusiness } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f7faff] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="sticky top-0 z-40 border-b border-blue-100/80 bg-white/90 backdrop-blur-xl">
        <nav className="max-w-6xl mx-auto h-[70px] px-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-[20px] text-slate-950">
            <span className="w-8 h-8 rounded-[9px] bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <FileText size={16} strokeWidth={2.5} />
            </span>
            resumn<span className="text-blue-600">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</a>
            <a href="#templates" className="hover:text-blue-600 transition-colors">Templates</a>
            <Link to="/login" className="ml-3 hover:text-blue-600 transition-colors">Sign in</Link>
            <Link to="/signup" className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-sm">
              Sign up
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-600" aria-label="Toggle menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden border-t border-blue-100 bg-white px-5 py-4 space-y-4">
            <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-600">Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-600">How it works</a>
            <Link to="/login" className="block text-sm text-slate-600">Sign in</Link>
            <Link to="/signup" className="block w-full text-center py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold">Sign up</Link>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />
          <div className="absolute top-16 -right-40 w-[520px] h-[520px] rounded-full bg-sky-100/70 blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto px-5 pt-16 pb-20 lg:pt-24 lg:pb-24 relative">
            <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-14 lg:gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
                <p className="text-[11px] font-bold tracking-[0.18em] text-blue-600 mb-5">BUILD YOUR RESUME FASTER</p>
                <h1 className="text-[45px] sm:text-6xl lg:text-[64px] font-bold tracking-[-0.045em] leading-[1.04] text-slate-950">
                  Paste the job description.<br />
                  <span className="text-blue-600">Get your resume in a minute.</span>
                </h1>
                <p className="mt-6 max-w-xl text-[17px] leading-8 text-slate-600">
                  Start with the job you want. Add your experience once, tailor it to the role, and download a clean resume ready to apply.
                </p>

                <div className="mt-8">
                  <button onClick={() => navigate('/signup')} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-[0_8px_24px_rgba(37,99,235,0.22)] hover:-translate-y-0.5">
                    Build my resume <ArrowRight size={18} />
                  </button>
                </div>

                <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate-500">
                  <span className="flex items-center gap-1.5"><Check size={14} className="text-blue-600" /> ATS-friendly</span>
                  <span className="flex items-center gap-1.5"><Check size={14} className="text-blue-600" /> Clean templates</span>
                  <span className="flex items-center gap-1.5"><Check size={14} className="text-blue-600" /> PDF export</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }} className="relative">
                <div className="absolute -inset-5 bg-blue-200/35 rounded-[28px] blur-2xl" />
                <div className="relative bg-white border border-blue-100 rounded-2xl shadow-[0_20px_60px_rgba(30,64,175,0.12)] overflow-hidden">
                  <div className="h-12 px-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800"><BriefcaseBusiness size={16} className="text-blue-600" /> Job description</div>
                    <span className="text-[11px] text-slate-400">Example</span>
                  </div>
                  <div className="p-5">
                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-[13px] leading-6 text-slate-600 min-h-[170px]">
                      <p className="font-semibold text-slate-900 mb-1">Software Engineer</p>
                      <p>We are looking for a developer with experience in Java, Spring Boot, REST APIs, SQL and cloud services.</p>
                      <p className="mt-2">Build reliable services, work with the team, and improve existing applications.</p>
                    </div>
                    <div className="mt-5 flex items-center gap-4">
                      <div className="h-10 flex-1 rounded-lg bg-blue-600/10 border border-blue-100 flex items-center px-3">
                        <span className="text-[12px] text-blue-700 font-medium">Resume generated</span>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm"><ArrowRight size={17} /></div>
                    </div>
                  </div>
                </div>

                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-7 -left-7 hidden sm:block bg-white border border-blue-100 rounded-xl shadow-lg p-3 w-52">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><FileText size={17} /></div>
                    <div><p className="text-[11px] font-semibold text-slate-800">Your resume</p><p className="text-[10px] text-slate-400">Ready to download</p></div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="features" className="border-y border-blue-100 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-14 lg:py-16">
            <div className="grid md:grid-cols-3 gap-0 md:divide-x divide-blue-100">
              {[
                ['01', 'Start from the job', 'Use the actual job description as the starting point for your resume.'],
                ['02', 'Edit without fighting the layout', 'Keep your information organized while the resume stays clean.'],
                ['03', 'Download when ready', 'Review your final resume and export a professional PDF.'],
              ].map(([number, title, text]) => (
                <div key={number} className="px-0 md:px-8 first:pl-0 last:pr-0 py-5 md:py-1">
                  <p className="text-xs font-bold text-blue-600 mb-3">{number}</p>
                  <h3 className="text-[17px] font-semibold text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm leading-6 text-slate-500">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="max-w-6xl mx-auto px-5 py-16 lg:py-20">
          <div className="rounded-2xl bg-[#eef5ff] border border-blue-100 px-7 py-9 sm:px-10 sm:py-11 flex flex-col md:flex-row md:items-center md:justify-between gap-7">
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em] text-blue-600 mb-3">READY WHEN YOU ARE</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">Build the resume for your next application.</h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">Create your account and start with the job description.</p>
            </div>
            <button onClick={() => navigate('/signup')} className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
              Build my resume <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} resumn.</span>
          <Link to="/login" className="hover:text-blue-600 transition-colors">Sign in</Link>
        </div>
      </footer>
    </div>
  );
};