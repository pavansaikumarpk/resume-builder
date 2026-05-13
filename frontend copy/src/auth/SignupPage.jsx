import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Mail, Lock, User } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { signup, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // FIXED: Map 'name' from your state to 'username' for the backend
    const payload = {
      username: form.name,
      email: form.email,
      password: form.password
    };

    const success = await signup(payload);
    if (success) window.location.href = '/dashboard';
  };

  return (
    <AuthLayout title="Join the Elite" subtitle="Create your account to start building">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
              placeholder="Pavan Sai"
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
        </div>

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
              placeholder="Min. 8 characters"
              onChange={(e) => setForm({...form, password: e.target.value})}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}

        <Button type="submit" className="w-full py-4 rounded-2xl text-lg mt-4" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
        </Button>
        
        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account? <a href="/login" className="text-blue-600 font-bold hover:underline">Sign in</a>
        </p>
      </form>
    </AuthLayout>
  );
}