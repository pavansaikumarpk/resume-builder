import React from 'react';
import { Hero } from './Hero';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
      {/* Sticky Navbar Placeholder */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/20 rounded-[2rem] px-8 py-4 shadow-sm">
          <div className="text-2xl font-black tracking-tighter text-slate-900">
            RESUMN<span className="text-blue-600">.</span>
          </div>
          <div className="flex items-center gap-8 font-bold text-sm text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="/login" className="hover:text-blue-600 transition-colors">Sign In</a>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg" onClick={() => window.location.href='/signup'}>
              Join Now
            </button>
          </div>
        </div>
      </nav>

      <main>
        <Hero />
        
        {/* Social Proof Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-12">Trusted by builders at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale contrast-200">
            {['Google', 'Meta', 'Amazon', 'Apple', 'Netflix'].map(brand => (
              <span key={brand} className="text-2xl font-bold tracking-tighter text-slate-900">{brand}</span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}