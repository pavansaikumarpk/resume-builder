import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, FileText, Menu, X } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-900 font-sans">
      <header className="border-b border-slate-200 bg-white/95">
        <nav className="max-w-6xl mx-auto h-16 px-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg">
            <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <FileText size={16} />
            </span>
            resumn<span className="text-indigo-600">.</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
            <Link to="/login" className="text-slate-600 hover:text-slate-900 transition-colors">Sign in</Link>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
            >
              Get started
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 text-slate-600"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-3">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-600">How it works</a>
            <Link to="/login" className="block text-sm text-slate-600">Sign in</Link>
            <button onClick={() => navigate('/signup')} className="w-full py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium">Get started</button>
          </div>
        )}
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-5 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-center">
            <div>
              <p className="text-sm font-semibold text-indigo-600 mb-5">RESUME BUILDER</p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.04em] leading-[1.02] text-slate-950">
                Paste a job description.<br />
                <span className="text-slate-500">Get a resume in a minute.</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
                Start with the job you want. Add your experience, and build a clean, ATS-friendly resume without fighting with Word formatting.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/signup')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
                >
                  Build my resume <ArrowRight size={17} />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  I already have an account
                </button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Check size={15} className="text-emerald-600" /> ATS-friendly layouts</span>
                <span className="flex items-center gap-2"><Check size={15} className="text-emerald-600" /> PDF export</span>
                <span className="flex items-center gap-2"><Check size={15} className="text-emerald-600" /> Start free</span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white border border-slate-200 rounded-xl shadow-[0_20px_60px_rgba(15,23,42,0.10)] overflow-hidden">
                <div className="h-11 border-b border-slate-200 flex items-center justify-between px-4 bg-slate-50">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </div>
                  <span className="text-xs text-slate-400">Resume workspace</span>
                </div>
                <img src="/hero.png" alt="Resume workspace" className="w-full block object-cover object-top" />
              </div>
              <div className="absolute -bottom-5 -left-5 hidden sm:block bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-lg">
                <p className="text-xs text-slate-400">Your resume</p>
                <p className="text-sm font-semibold text-slate-800">Ready to apply</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-16 lg:py-20">
            <div className="max-w-xl mb-12">
              <p className="text-sm font-semibold text-indigo-600 mb-3">HOW IT WORKS</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">From job post to application, without the busywork.</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                ['01', 'Paste the job description', 'Give us the role you are applying for so you can focus your resume on what actually matters.'],
                ['02', 'Build your resume', 'Add your experience and projects in the editor. Keep the parts that represent you best.'],
                ['03', 'Review and apply', 'Make your final edits, export a clean PDF, and send your application.'],
              ].map(([number, title, text]) => (
                <div key={number} className="border-t-2 border-slate-900 pt-5">
                  <p className="text-xs font-semibold text-slate-400 mb-4">{number}</p>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 py-16 lg:py-20">
          <div className="bg-slate-900 rounded-2xl px-7 py-10 sm:px-12 sm:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">Your next application can start now.</h2>
              <p className="mt-3 text-slate-300">Create your first resume and see how quickly you can get from a job post to a finished application.</p>
            </div>
            <button onClick={() => navigate('/signup')} className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
              Get started <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-5 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-500">
          <span>© {new Date().getFullYear()} resumn.</span>
          <div className="flex gap-5">
            <Link to="/login" className="hover:text-slate-900">Sign in</Link>
            <Link to="/signup" className="hover:text-slate-900">Create account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
