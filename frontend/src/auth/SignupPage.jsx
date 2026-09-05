import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from './AuthLayout';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';

const AuthInput = ({ label, icon: Icon, type, value, onChange, minLength }) => (
  <div className="relative w-full mb-4">
    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      minLength={minLength}
      className="w-full h-12 bg-white border border-slate-300 rounded-lg pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/5 transition-all"
      placeholder={label}
    />
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
    <AuthLayout
      variant="signup"
      title="Create your account"
      subtitle="Start building your resume for free."
    >
      {error && (
        <div className="mb-5 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="w-full mb-5 flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError('Google Sign-Up failed. Please try again.')}
          useOneTap={false}
          width="350"
        />
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="h-px bg-slate-200 flex-1" />
        <span className="text-xs text-slate-400">or use your email</span>
        <div className="h-px bg-slate-200 flex-1" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <AuthInput label="Full name" icon={User} type="text" value={username} onChange={(e) => setUsername(e.target.value)} minLength={2} />
        <AuthInput label="Email address" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthInput label="Password (6+ characters)" icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 mt-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={17} className="animate-spin" /> : 'Create account'}
          {!isLoading && <ArrowRight size={17} />}
        </button>
      </form>

      <p className="mt-5 text-center text-xs leading-5 text-slate-400">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-slate-900 hover:text-indigo-600">Sign in</Link>
      </p>
    </AuthLayout>
  );
};
