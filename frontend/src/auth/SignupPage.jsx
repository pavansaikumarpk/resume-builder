import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

const AuthInput = ({ label, icon: Icon, type, value, onChange, minLength }) => (
  <div className="relative group w-full mb-4">
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" size={18} />
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      minLength={minLength}
      className="w-full bg-white border border-slate-200 rounded-xl pt-6 pb-2 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all peer shadow-sm"
      placeholder=" "
    />
    <label className="absolute left-11 text-slate-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ease-in-out pointer-events-none peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-3 peer-focus:-translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-indigo-600 top-3 -translate-y-0">
      {label}
    </label>
  </div>
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

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Failed to create account.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');

    if (!credentialResponse?.credential) {
      setError('Google did not return a login credential. Please try again.');
      return;
    }

    const result = await googleAuth(credentialResponse.credential);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Google Authentication failed.');
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Start building your ATS-optimized resume today for free.">
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="w-full mb-6 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Sign-Up failed. Please try again.')}
          useOneTap={false}
          width="350"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-slate-200 flex-1"></div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Or register with email</span>
        <div className="h-px bg-slate-200 flex-1"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <AuthInput label="Full Name" icon={User} type="text" value={username} onChange={(e) => setUsername(e.target.value)} minLength={2} />
        <AuthInput label="Email Address" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthInput label="Password (Min 6 chars)" icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Free Account'}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="mt-6 text-center text-xs font-medium text-slate-400 max-w-[250px] mx-auto">
        By continuing, you agree to Resumn's <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
      </p>

      <p className="mt-6 text-center text-sm font-medium text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
};
