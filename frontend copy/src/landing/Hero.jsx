import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-bold mb-8 shadow-sm"
        >
          <Sparkles size={16} className="text-blue-600" />
          <span className="tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Powered by next-gen AI Extraction
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-[1000] text-slate-900 tracking-tighter mb-8 leading-[0.9]"
        >
          Build a resume that <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-600 to-blue-900">gets you hired.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-xl text-slate-500 font-medium leading-relaxed mb-12"
        >
          The only AI co-pilot that analyzes job descriptions, extracts your best points, and builds a world-class resume in seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button className="h-16 px-10 rounded-[2rem] text-lg shadow-2xl shadow-blue-500/30" onClick={() => window.location.href='/signup'}>
            Get Started Free <ArrowRight size={20} />
          </Button>
          <Button variant="secondary" className="h-16 px-10 rounded-[2rem] text-lg">
            Watch Demo <Play size={18} fill="currentColor" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};