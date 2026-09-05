import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

const AuthInput = ({ label, icon: Icon, type, value, onChange, minLength }) => (
  <label className="block mb-4">
    <span className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</span>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        minLength={minLength}
        className="w-full h-12 bg-white border border-slate-300 rounded-md pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
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
    if (!credentialResponse?.credential) {
      setError('Google did not return a login credential. Please try again.');
      return;
    }
    const result = await googleAuth(credentialResponse.credential);
    if (result.success) navigate('/dashboard');
    else setError(result.message || 'Google Authentication failed.');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-slate-900 font-sans">
      <header className="h-16 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto h-full px-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg">
            <span className="w-8 h-8 rounded-md bg-slate-900 text-white flex items-center justify-center"><User size={15} /></span>
            resumn<span className="text-indigo-600">.</span>
          </Link>
          <p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-slate-900 hover:text-indigo-600">Sign in</Link></p>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-12 sm:py-16">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.15em] text-slate-400 mb-3">GET STARTED</p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-950">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Build your resume and keep it ready for your next application.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 shadow-[0_10px_35px_rgba(15,23,42,0.05)]">
          {error && <div className="mb-5 p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-100">{error}</div>}

          <div className="flex justify-center mb-5">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google Sign-Up failed. Please try again.')} useOneTap={false} width="350" />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-400">or continue with email</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <form onSubmit={handleSubmit}>
            <AuthInput label="Full name" icon={User} type="text" value={username} onChange={(e) => setUsername(e.target.value)} minLength={2} />
            <AuthInput label="Email address" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <AuthInput label="Password" icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
            <p className="-mt-2 mb-5 text-xs text-slate-400">Use at least 6 characters.</p>

            <button type="submit" disabled={isLoading} className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading ? <Loader2 size={17} className="animate-spin" /> : 'Create account'}
              {!isLoading && <ArrowRight size={17} />}
            </button>
          </form>

          <p className="mt-5 text-center text-xs leading-5 text-slate-400">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </main>
    </div>
  );
};
