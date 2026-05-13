import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) window.location.href = '/dashboard';
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to manage your resumes">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" 
              required
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
              placeholder="name@company.com"
              onChange={(e) => setForm({...form, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="password" 
              required
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
              placeholder="••••••••"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

        <Button type="submit" className="w-full py-4 rounded-2xl text-lg mt-4" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Sign In'}
        </Button>
        
        <p className="text-center text-slate-500 text-sm mt-6">
          Don't have an account? <a href="/signup" className="text-blue-600 font-bold hover:underline">Create one</a>
        </p>
      </form>
    </AuthLayout>
  );
}