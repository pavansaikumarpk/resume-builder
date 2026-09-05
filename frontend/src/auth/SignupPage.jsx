import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, FileText, CheckCircle2 } from 'lucide-react';

const AuthInput = ({ label, icon: Icon, type, value, onChange, minLength }) => (
  <label className="block mb-4">
    <span className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</span>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
      <input type={type} value={value} onChange={onChange} required minLength={minLength} className="w-full h-12 bg-white border border-slate-200 rounded-lg pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" placeholder={`Enter your ${label.toLowerCase()}`} />
    </div>
  </label>
);

export const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, googleAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup(username, email, password);
    if (result.success) navigate('/dashboard');
    else setError(result.message || 'Failed to create account.');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    if (!credentialResponse?.credential) { setError('Google did not return a login credential. Please try again.'); return; }
    const result = await googleAuth(credentialResponse.credential);
    if (result.success) navigate('/dashboard');
    else setError(result.message || 'Google Authentication failed.');
  };

  return (
    <div className="min-h-screen bg-[#f5f9ff] text-slate-900 font-sans">
      <header className="h-[70px] bg-white/95 border-b border-blue-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-[20px] text-slate-950"><span className="w-8 h-8 rounded-[9px] bg-blue-600 text-white flex items-center justify-center"><FileText size={16} /></span>haveResume<span className="text-blue-600">.</span></Link>
          <p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link></p>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-5 py-12 lg:py-16 grid lg:grid-cols-[1fr_430px] gap-14 items-center">
        <div className="absolute -top-20 left-1/4 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden lg:block relative max-w-xl"><p className="text-[11px] font-bold tracking-[0.18em] text-blue-600 mb-5">START WITH YOUR NEXT JOB</p><h1 className="text-4xl xl:text-5xl font-bold tracking-[-0.035em] leading-[1.08] text-slate-950">Create your account and build your resume in minutes.</h1><p className="mt-5 text-lg leading-8 text-slate-600">Paste a job description, add your experience, and turn it into a resume that is ready to apply with.</p><div className="mt-8 space-y-4 text-sm text-slate-600">{['Clean, professional templates','Keep your resumes saved in one place','Export your finished resume as a PDF'].map((item) => (<div key={item} className="flex items-center gap-3"><CheckCircle2 size={18} className="text-blue-600 shrink-0" /><span>{item}</span></div>))}</div></div>
        <div className="relative bg-white border border-blue-100 rounded-2xl p-7 sm:p-8 shadow-[0_20px_55px_rgba(37,99,235,0.10)]">
          <div className="mb-7"><p className="text-[11px] font-bold tracking-[0.16em] text-blue-600 mb-2">GET STARTED</p><h2 className="text-2xl font-bold tracking-tight text-slate-950">Create your account</h2><p className="mt-2 text-sm leading-6 text-slate-500">Your resumes will be saved to your account.</p></div>
          {error && <div className="mb-5 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">{error}</div>}
          <div className="flex justify-center mb-5"><GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google Sign-Up failed. Please try again.')} useOneTap={false} width="350" /></div>
          <div className="flex items-center gap-3 mb-6"><div className="h-px bg-slate-200 flex-1" /><span className="text-xs text-slate-400">or continue with email</span><div className="h-px bg-slate-200 flex-1" /></div>
          <form onSubmit={handleSubmit}><AuthInput label="Full name" icon={User} type="text" value={username} onChange={(e) => setUsername(e.target.value)} minLength={2} /><AuthInput label="Email address" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><AuthInput label="Password" icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} /><p className="-mt-2 mb-5 text-xs text-slate-400">Use at least 6 characters.</p><button type="submit" disabled={isLoading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">{isLoading ? <Loader2 size={17} className="animate-spin" /> : 'Create account'}</button></form>
          <p className="mt-5 text-center text-xs leading-5 text-slate-400">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </main>
    </div>
  );
};
