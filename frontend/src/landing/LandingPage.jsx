import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, FileText, Menu, X } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#171717] font-sans">
      <header className="bg-[#f7f7f5] border-b border-black/10">
        <nav className="max-w-6xl mx-auto h-[68px] px-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-[19px]">
            <span className="w-8 h-8 rounded-md bg-[#171717] text-white flex items-center justify-center">
              <FileText size={15} />
            </span>
            resumn<span className="text-indigo-600">.</span>
          </Link>

          <div className="hidden sm:flex items-center gap-7 text-sm">
            <a href="#how-it-works" className="text-black/60 hover:text-black transition-colors">How it works</a>
            <Link to="/login" className="text-black/60 hover:text-black transition-colors">Sign in</Link>
            <button onClick={() => navigate('/signup')} className="px-4 py-2 rounded-md bg-[#171717] text-white font-medium hover:bg-black transition-colors">
              Create resume
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 text-black/60" aria-label="Toggle menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="sm:hidden border-t border-black/10 bg-[#f7f7f5] px-5 py-4 space-y-3">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block text-sm text-black/60">How it works</a>
            <Link to="/login" className="block text-sm text-black/60">Sign in</Link>
            <button onClick={() => navigate('/signup')} className="w-full py-2.5 rounded-md bg-[#171717] text-white text-sm font-medium">Create resume</button>
          </div>
        )}
      </header>

      <main>
        <section className="max-w-6xl mx-auto px-5 pt-20 pb-20 lg:pt-28 lg:pb-28">
          <div className="grid lg:grid-cols-[1fr_0.92fr] gap-14 lg:gap-20 items-center">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-black/45 mb-6">A SIMPLER WAY TO BUILD YOUR RESUME</p>
              <h1 className="text-[46px] sm:text-6xl lg:text-[68px] font-semibold tracking-[-0.045em] leading-[1.02] text-[#111]">
                Paste the job description.<br />
                <span className="text-black/45">Get your resume in a minute.</span>
              </h1>
              <p className="mt-7 max-w-xl text-[17px] leading-8 text-black/60">
                Start with the role you want, add your experience, and turn it into a clean resume that is ready to apply with.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/signup')} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#171717] text-white font-semibold hover:bg-black transition-colors">
                  Build my resume <ArrowRight size={17} />
                </button>
                <Link to="/login" className="inline-flex items-center justify-center px-5 py-3 rounded-md border border-black/15 bg-white text-black/70 font-semibold hover:bg-black/[0.03] transition-colors">
                  Sign in
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-black/50">
                <span className="flex items-center gap-2"><Check size={14} /> Clean layouts</span>
                <span className="flex items-center gap-2"><Check size={14} /> ATS-friendly</span>
                <span className="flex items-center gap-2"><Check size={14} /> PDF export</span>
              </div>
            </div>

            <div className="bg-white border border-black/10 shadow-[0_18px_50px_rgba(0,0,0,0.08)] rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-black/10 flex items-center justify-between">
                <span className="text-sm font-semibold">Start with a job description</span>
                <span className="text-xs text-black/35">Example</span>
              </div>
              <div className="p-5">
                <div className="border border-black/10 rounded-md p-4 bg-[#fafafa] min-h-[210px] text-sm leading-6 text-black/55">
                  <p className="font-semibold text-black/75 mb-2">Backend Developer</p>
                  <p>We are looking for a developer with experience in Java, Spring Boot, REST APIs, SQL and cloud services.</p>
                  <p className="mt-3">You will build reliable services, work with a team, and improve existing applications.</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-black/40">Paste your own job description after signing in.</span>
                  <button onClick={() => navigate('/signup')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Continue →</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-black/10 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-16 lg:py-20">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-bold tracking-[0.16em] text-black/40 mb-3">HOW IT WORKS</p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Less formatting. More applying.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                ['01', 'Paste the job description', 'Give us the role you are applying for and start from what the employer is actually asking for.'],
                ['02', 'Add your experience', 'Keep your work, projects and education in one place and edit them whenever you need.'],
                ['03', 'Review and apply', 'Make your final changes, download the PDF, and send your application.'],
              ].map(([number, title, text]) => (
                <div key={number} className="border-t border-black/20 pt-5">
                  <p className="text-xs font-bold text-black/30 mb-4">{number}</p>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm leading-6 text-black/55">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-5 py-16 lg:py-20">
          <div className="border border-black/10 bg-[#f1f1ee] rounded-lg px-7 py-9 sm:px-10 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-7">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Ready to build yours?</h2>
              <p className="mt-2 text-sm sm:text-base text-black/55">Create an account and start with the job you want.</p>
            </div>
            <button onClick={() => navigate('/signup')} className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#171717] text-white font-semibold hover:bg-black transition-colors">
              Create resume <ArrowRight size={17} />
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10 bg-white">
        <div className="max-w-6xl mx-auto px-5 py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-black/45">
          <span>© {new Date().getFullYear()} resumn.</span>
          <div className="flex gap-5">
            <Link to="/login" className="hover:text-black">Sign in</Link>
            <Link to="/signup" className="hover:text-black">Create account</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
