import React from 'react';
import { motion } from 'framer-motion';

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl shadow-slate-200 border border-white"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{title}</h1>
          <p className="text-slate-500 font-medium">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
};