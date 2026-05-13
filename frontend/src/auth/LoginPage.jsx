import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Loader2, FileText, AlertCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // UX state for Render Cold Starts
  const [isWakingServer, setIsWakingServer] = useState(false);
  
  const { login, googleAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleAction = async (actionFunction) => {
    setError('');
    setIsWakingServer(false);
    
    // Start a timer: If it takes >3 seconds, tell the user the server is waking up
    const timer = setTimeout(() => setIsWakingServer(true), 3000);
    
    const result = await actionFunction();
    
    clearTimeout(timer);
    setIsWakingServer(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAction(() => login(email, password));
  };

  const handleGoogleSuccess = (credentialResponse) => {
    handleAction(() => googleAuth(credentialResponse.credential));
  };

  return (
    /* 🚀 CRITICAL FIX: The outer div now forces the box to be perfectly centered on the screen */
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
        
      {/* Decorative background elements for a premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Premium Card Container */}
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-indigo-100/50 w-full max-w-md relative z-10 border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <FileText size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 mt-2 text-sm">Log in to continue building your resume.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Render Cold Start Warning UI */}
        {isWakingServer && (
          <div className="mb-6 p-4 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold flex items-start gap-3 border border-amber-200 animate-pulse">
            <Loader2 size={18} className="animate-spin mt-0.5 shrink-0" /> 
            <p>We are waking up the server for you! This usually takes ~45 seconds on our free tier. Please hold tight...</p>
          </div>
        )}

        {/* Google Login Button */}
        <div className="mb-6 flex justify-center">
           <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign In was unsuccessful.')}
              theme="filled_black"
              shape="pill"
              text="continue_with"
           />
        </div>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">Or login with email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm bg-slate-50 focus:bg-white" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm bg-slate-50 focus:bg-white" placeholder="••••••••" />
            </div>
          </div>

          <button disabled={isLoading} type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 cursor-pointer">
            {isLoading ? <><Loader2 size={18} className="animate-spin" /> {isWakingServer ? 'Waking Server...' : 'Authenticating...'}</> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-sm font-medium">
          Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}