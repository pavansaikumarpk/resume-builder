import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const AuthInput = ({ label, icon: Icon, type, value, onChange }) => (
  <div className="relative group w-full mb-4">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" size={18} />
    <input
      type={type} value={value} onChange={onChange} required
      className="w-full bg-white border border-slate-200 rounded-xl pt-6 pb-2 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all peer shadow-sm"
      placeholder=" "
    />
    <label className="absolute left-11 text-slate-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ease-in-out pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-indigo-600 top-3 -translate-y-0">
      {label}
    </label>
  </div>
);

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, googleAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Failed to login. Check your credentials.');
    }
  };

  const handleGoogleLogin = () => {
    setError('');

    if (!window.google?.accounts?.id) {
      setError('Google Sign-In is not available. Please refresh the page and try again.');
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google Sign-In is not configured.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        const result = await googleAuth(response.credential);

        if (result.success) {
          navigate('/dashboard');
        } else {
          setError(result.message || 'Google Authentication failed.');
        }
      },
    });

    window.google.accounts.id.prompt();
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Enter your credentials to access your workspace.">
      {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100">{error}</div>}

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold text-sm py-3 rounded-xl shadow-sm hover:bg-slate-50 transition-all mb-6 disabled:opacity-70"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
        Continue with Google
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or login with email</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <AuthInput label="Email Address" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="relative">
          <AuthInput label="Password" icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Link to="/forgot-password" className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors z-20">
            Forgot?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-medium text-slate-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          Create one now
        </Link>
      </p>
    </AuthLayout>
  );
};
