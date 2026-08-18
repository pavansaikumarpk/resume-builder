



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Terminal, Zap, ChevronRight, Clock, Sparkles, LayoutTemplate, CheckCircle2 } from 'lucide-react';

// // Animation configurations for staggered loading
// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.15 }
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30 },
//   show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
// };

// export const LandingPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500/30 text-slate-300">
      
//       {/* 1. Deep Tech Background */}
//       <div className="fixed inset-0 z-0 pointer-events-none">
//         <div className="absolute inset-0 bg-grid-pattern opacity-60" />
//         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] animate-pulse-glow" />
//       </div>

//       {/* 2. Floating Navbar */}
//       <nav className="fixed w-full z-50 top-6 px-6 flex justify-center">
//         <motion.div 
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="w-full max-w-5xl bg-black/50 border border-white/10 backdrop-blur-xl rounded-full px-5 py-3 flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.8)]"
//         >
//           <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
//             <div className="bg-cyan-500/20 p-1.5 rounded-lg border border-cyan-500/30">
//               <Terminal size={18} className="text-cyan-400" />
//             </div>
//             <span className="font-black text-lg tracking-tight text-white">resumn<span className="text-cyan-500">.</span></span>
//           </div>
//           <div className="flex items-center gap-4">
//             <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
//               Sign In
//             </button>
//             <button onClick={() => navigate('/editor/new')} className="px-5 py-2 bg-white text-black text-sm font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
//               Build Resume
//             </button>
//           </div>
//         </motion.div>
//       </nav>

//       {/* 3. Hero Centerpiece */}
//       <main className="relative z-10 pt-48 pb-32 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        
//         {/* Status Badge */}
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
//           className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2"
//         >
//           <Sparkles size={14} className="text-cyan-400" /> AI-Powered Builder
//         </motion.div>

//         {/* Simple, Catchy Typography */}
//         <motion.h1 
//           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
//           className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-white"
//         >
//           Build a winning resume.<br />
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
//             Fast and effortless.
//           </span>
//         </motion.h1>

//         <motion.p 
//           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mb-12 leading-relaxed"
//         >
//           Stop struggling with Word templates. Let our smart AI write your bullet points and auto-format your layout in under 5 minutes.
//         </motion.p>

//         {/* CTA */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
//           <button 
//             onClick={() => navigate('/editor/new')} 
//             className="group relative h-16 px-10 bg-cyan-500 hover:bg-cyan-400 text-black text-lg font-black rounded-full flex items-center gap-3 transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:-translate-y-1 overflow-hidden"
//           >
//             {/* Button Shimmer Effect */}
//             <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
//             Start for Free <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
//           </button>
//         </motion.div>

//         {/* 4. Animated App Preview */}
//         <motion.div 
//           initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
//           className="mt-20 w-full max-w-5xl relative perspective-[2000px]"
//         >
//           <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-indigo-500/20 blur-3xl transform rotate-x-12 translate-y-10" />
          
//           <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A] p-2 shadow-2xl animate-float transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 overflow-hidden cursor-pointer">
//             <div className="h-8 w-full border-b border-white/10 flex items-center px-4 gap-2 bg-[#111]">
//               <div className="w-3 h-3 rounded-full bg-red-500/80" />
//               <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
//               <div className="w-3 h-3 rounded-full bg-green-500/80" />
//             </div>
            
//             <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
//               <img 
//                 src="/hero.png" 
//                 alt="Resume Workspace" 
//                 className="w-full h-full object-cover object-top opacity-90"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
//             </div>
//           </div>
//         </motion.div>

//         {/* 5. Highlighted Features (Staggered Animation on Scroll) */}
//         <motion.div 
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, margin: "-100px" }}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-32 w-full text-left"
//         >
//           {/* Feature 1: Fast */}
//           <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-500/10">
//             <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
//               <Clock className="text-cyan-400 w-7 h-7" />
//             </div>
//             <h3 className="text-2xl font-black mb-3 text-white">Lightning Fast</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Don't spend hours aligning text. Import your PDF or LinkedIn profile, and we'll instantly generate a beautiful, formatted resume.
//             </p>
//           </motion.div>
          
//           {/* Feature 2: AI */}
//           <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-indigo-500/30 transition-all shadow-lg hover:shadow-indigo-500/10">
//             <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
//               <Sparkles className="text-indigo-400 w-7 h-7" />
//             </div>
//             <h3 className="text-2xl font-black mb-3 text-white">Smart AI Writer</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Stuck on what to write? Our AI perfectly rewrites your experience bullet points to match the exact job you are applying for.
//             </p>
//           </motion.div>

//           {/* Feature 3: Design */}
//           <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-fuchsia-500/30 transition-all shadow-lg hover:shadow-fuchsia-500/10">
//             <div className="bg-fuchsia-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
//               <LayoutTemplate className="text-fuchsia-400 w-7 h-7" />
//             </div>
//             <h3 className="text-2xl font-black mb-3 text-white">Easy Auto-Formatting</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Simply type in your details, and our engine automatically structures, aligns, and spaces everything perfectly. Zero design skills needed.
//             </p>
//           </motion.div>

//           {/* Feature 4: ATS */}
//           <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/10">
//             <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
//               <CheckCircle2 className="text-emerald-400 w-7 h-7" />
//             </div>
//             <h3 className="text-2xl font-black mb-3 text-white">Passes Resume Scanners</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Recruiters use Applicant Tracking Systems (ATS) to filter resumes. Our clean, code-based templates guarantee your resume gets read by humans.
//             </p>
//           </motion.div>
//         </motion.div>

//       </main>
//     </div>
//   );
// };



















// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Terminal, ChevronRight, Clock, Sparkles, LayoutTemplate, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

// const containerVariants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.15 }
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 30 },
//   show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
// };

// // Orchestrates the floating background particles
// const Particles = () => {
//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none">
//       {[...Array(20)].map((_, i) => (
//         <motion.div
//           key={i}
//           animate={{
//             y: [Math.random() * 100 - 50, Math.random() * -100 - 50],
//             x: [Math.random() * 50 - 25, Math.random() * -50 - 25],
//             opacity: [0, 0.5, 0],
//           }}
//           transition={{
//             duration: Math.random() * 5 + 5,
//             repeat: Infinity,
//             ease: "linear",
//             delay: Math.random() * 5,
//           }}
//           className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
//           style={{
//             top: `${Math.random() * 100}%`,
//             left: `${Math.random() * 100}%`,
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export const LandingPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="relative min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500/30 text-slate-300">
      
//       {/* Deep Tech Background */}
//       <div className="fixed inset-0 z-0 pointer-events-none">
//         <div className="absolute inset-0 bg-grid-pattern opacity-60" />
//         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] animate-pulse-glow" />
//       </div>

//       {/* Floating Navbar */}
//       <nav className="fixed w-full z-50 top-6 px-6 flex justify-center">
//         <motion.div 
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="w-full max-w-5xl bg-black/50 border border-white/10 backdrop-blur-xl rounded-full px-5 py-3 flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.8)]"
//         >
//           <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
//             <div className="bg-cyan-500/20 p-1.5 rounded-lg border border-cyan-500/30">
//               <Terminal size={18} className="text-cyan-400" />
//             </div>
//             <span className="font-black text-lg tracking-tight text-white">resumn<span className="text-cyan-500">.</span></span>
//           </div>
//           <div className="flex items-center gap-4">
//             <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
//               Sign In
//             </button>
//             <button onClick={() => navigate('/editor/new')} className="px-5 py-2 bg-white text-black text-sm font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
//               Build Resume
//             </button>
//           </div>
//         </motion.div>
//       </nav>

//       <main className="relative z-10 pt-48 pb-32 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        
//         {/* Status Badge */}
//         <motion.div 
//           initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
//           className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
//         >
//           <Sparkles size={14} className="text-cyan-400" /> AI-Powered Builder
//         </motion.div>

//         {/* Core Typography */}
//         <motion.h1 
//           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
//           className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-white"
//         >
//           Build a winning resume.<br />
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
//             Fast and effortless.
//           </span>
//         </motion.h1>

//         <motion.p 
//           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
//           className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mb-12 leading-relaxed"
//         >
//           Stop struggling with rigid Word templates. Let our proprietary AI engine synthesize your bullet points and execute pristine formatting in under 5 minutes.
//         </motion.p>

//         {/* Primary CTA */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
//           <button 
//             onClick={() => navigate('/editor/new')} 
//             className="group relative h-16 px-10 bg-cyan-500 hover:bg-cyan-400 text-black text-lg font-black rounded-full flex items-center gap-3 transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:-translate-y-1 overflow-hidden"
//           >
//             <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
//             Start for Free <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
//           </button>
//         </motion.div>

//         {/* 4. 3D Kinematic Holograph Showcase (Replacing static image) */}
//         <motion.div 
//           initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
//           className="mt-20 w-full max-w-4xl relative perspective-[2000px] h-[550px] flex items-center justify-center"
//         >
//           {/* Central Core Glow */}
//           <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 to-indigo-500/20 blur-[100px]" />
          
//           <Particles />

//           {/* Floating Orbiting Icon: Star */}
//           <motion.div
//             animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
//             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//             className="absolute left-[10%] top-[25%] z-20 w-16 h-16 bg-fuchsia-500/20 border border-fuchsia-400/40 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.5)]"
//           >
//             <Star className="text-fuchsia-300 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]" size={32} fill="currentColor" />
//           </motion.div>

//           {/* Floating Orbiting Icon: Check */}
//           <motion.div
//             animate={{ y: [0, 25, 0], rotate: [0, -10, 10, 0], scale: [1, 1.05, 1] }}
//             transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
//             className="absolute right-[10%] bottom-[25%] z-20 w-16 h-16 bg-cyan-500/20 border border-cyan-400/40 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.5)]"
//           >
//             <ShieldCheck className="text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" size={36} />
//           </motion.div>

//           {/* Centerpiece 3D Glass Resume */}
//           <motion.div
//             animate={{ 
//               rotateX: [10, 20, 10], 
//               rotateY: [-15, -5, -15], 
//               rotateZ: [2, -2, 2],
//               y: [-10, 10, -10]
//             }}
//             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//             className="relative w-[340px] h-[480px] bg-[#0A101D]/60 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-6 shadow-[0_20px_70px_rgba(6,182,212,0.3),inset_0_0_20px_rgba(6,182,212,0.1)] transform-style-3d z-10"
//           >
//             {/* Holographic layered backdrop behind resume */}
//             <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-2xl pointer-events-none" />
            
//             {/* Resume Structure Skeleton */}
//             <div className="flex gap-4 items-center mb-8 border-b border-cyan-500/30 pb-4">
//               <div className="w-14 h-14 rounded-full bg-cyan-500/20 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
//               <div className="space-y-3 flex-1">
//                 <div className="h-3 bg-cyan-400/50 w-3/4 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
//                 <div className="h-2 bg-cyan-500/30 w-1/2 rounded-full" />
//               </div>
//             </div>

//             <div className="space-y-6">
//               {/* Section 1 */}
//               <div>
//                 <div className="h-2 bg-indigo-500/50 w-1/3 rounded-full mb-3 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
//                 <div className="space-y-2">
//                   <div className="h-1.5 bg-slate-500/40 w-full rounded-full" />
//                   <div className="h-1.5 bg-slate-500/40 w-5/6 rounded-full" />
//                   <div className="h-1.5 bg-slate-500/40 w-4/6 rounded-full" />
//                 </div>
//               </div>
              
//               {/* Section 2 */}
//               <div>
//                 <div className="h-2 bg-indigo-500/50 w-1/4 rounded-full mb-3 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
//                 <div className="space-y-2">
//                   <div className="h-1.5 bg-cyan-400/40 w-full rounded-full shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
//                   <div className="h-1.5 bg-slate-500/40 w-11/12 rounded-full" />
//                   <div className="h-1.5 bg-slate-500/40 w-4/5 rounded-full" />
//                 </div>
//               </div>

//               {/* Glowing Tags */}
//               <div className="flex gap-2 mt-4">
//                 <div className="h-6 w-16 bg-cyan-500/30 border border-cyan-400/40 rounded-md" />
//                 <div className="h-6 w-20 bg-indigo-500/30 border border-indigo-400/40 rounded-md" />
//                 <div className="h-6 w-14 bg-fuchsia-500/30 border border-fuchsia-400/40 rounded-md" />
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* 5. Accelerated Feature Grid */}
//         <motion.div 
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, margin: "-100px" }}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 w-full text-left relative z-20"
//         >
//           <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group">
//             <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//               <Clock className="text-cyan-400 w-7 h-7" />
//             </div>
//             <h3 className="text-2xl font-black mb-3 text-white">Lightning Fast</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Cease wasting hours manipulating margins. Upload your existing profile, and our engine instantaneously renders a flawlessly formatted document.
//             </p>
//           </motion.div>
          
//           <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-indigo-500/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] group">
//             <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//               <Sparkles className="text-indigo-400 w-7 h-7" />
//             </div>
//             <h3 className="text-2xl font-black mb-3 text-white">Intelligent Telemetry</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Uncertain how to articulate your impact? Our embedded AI systematically reconstructs your experience into robust, quantifiable achievements.
//             </p>
//           </motion.div>

//           <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-fuchsia-500/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(217,70,239,0.15)] group">
//             <div className="bg-fuchsia-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//               <LayoutTemplate className="text-fuchsia-400 w-7 h-7" />
//             </div>
//             <h3 className="text-2xl font-black mb-3 text-white">Automated Architecture</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Input your fundamental data. The core engine autonomously aligns, structures, and spaces every component with mathematical precision.
//             </p>
//           </motion.div>

//           <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group">
//             <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//               <CheckCircle2 className="text-emerald-400 w-7 h-7" />
//             </div>
//             <h3 className="text-2xl font-black mb-3 text-white">ATS Immunity</h3>
//             <p className="text-slate-400 text-sm leading-relaxed">
//               Recruiters utilize Applicant Tracking Systems to filter candidates. Our code-based framework guarantees your telemetry is perfectly parsed.
//             </p>
//           </motion.div>
//         </motion.div>

//       </main>
//     </div>
//   );
// };




































import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight, Clock, Sparkles, LayoutTemplate, CheckCircle2, Star, ShieldCheck, User, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore'; 

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [Math.random() * 100 - 50, Math.random() * -100 - 50],
            x: [Math.random() * 50 - 25, Math.random() * -50 - 25],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,1)]"
          style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
        />
      ))}
    </div>
  );
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore(); 

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans selection:bg-cyan-500/30 text-slate-300">
      
      {/* Deep Tech Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-600/20 rounded-full blur-[150px] animate-pulse-glow" />
      </div>

      {/* Floating Navbar */}
       <nav className="fixed w-full z-50 top-6 px-6 flex justify-center">
        <motion.div 
          initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-5xl bg-black/50 border border-white/10 backdrop-blur-xl rounded-full px-5 py-3 flex items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.8)] relative"
        >
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="bg-cyan-500/20 p-1.5 rounded-lg border border-cyan-500/30">
              <Terminal size={18} className="text-cyan-400" />
            </div>
            <span className="font-black text-lg tracking-tight text-white">resumn<span className="text-cyan-500">.</span></span>
          </div>

          {user && (
            <div className="absolute left-1/2 -translate-x-1/2 hidden md:block text-slate-200 font-bold text-sm tracking-widest uppercase drop-shadow-lg">
              Hi, <span className="text-cyan-400">{user.username}</span> welcome back!
            </div>
          )}

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
              {user ? 'Dashboard' : 'Sign In'}
            </button>
            <button onClick={() => navigate('/editor/new')} className="px-5 py-2 bg-white text-black text-sm font-black rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Build Resume
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Hero Centerpiece */}
      <main className="relative z-10 pt-48 pb-32 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
          className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Sparkles size={14} className="text-cyan-400" /> AI-Powered Builder
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8 text-white"
        >
          Build a winning resume.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
            Fast and effortless.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mb-12 leading-relaxed"
        >
          Stop struggling with rigid Word templates. Let our proprietary AI engine synthesize your bullet points and execute pristine formatting in under 5 minutes.
        </motion.p>

        {/* Primary CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <button 
            onClick={() => navigate('/editor/new')} 
            className="group relative h-16 px-10 bg-cyan-500 hover:bg-cyan-400 text-black text-lg font-black rounded-full flex items-center gap-3 transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)] hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            Start for Free <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* 3D Kinematic Holograph Showcase (Laser removed, Name centered) */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 w-full max-w-4xl relative perspective-[2000px] h-[600px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/30 to-indigo-500/20 blur-[100px]" />
          <Particles />

          {/* Floating Orbiting Icons */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute left-[10%] top-[25%] z-20 w-16 h-16 bg-fuchsia-500/20 border border-fuchsia-400/40 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.5)]"
          >
            <Star className="text-fuchsia-300 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]" size={32} fill="currentColor" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 25, 0], rotate: [0, -10, 10, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-[10%] bottom-[25%] z-20 w-16 h-16 bg-cyan-500/20 border border-cyan-400/40 rounded-2xl backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.5)]"
          >
            <ShieldCheck className="text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" size={36} />
          </motion.div>

          {/* Centerpiece 3D Glass Resume */}
          <motion.div
            animate={{ 
              rotateX: [10, 20, 10], 
              rotateY: [-15, -5, -15], 
              rotateZ: [2, -2, 2],
              y: [-10, 10, -10]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-[360px] h-[520px] bg-[#0A101D]/70 backdrop-blur-xl border border-cyan-500/40 rounded-3xl p-6 shadow-[0_20px_70px_rgba(6,182,212,0.3),inset_0_0_20px_rgba(6,182,212,0.1)] transform-style-3d z-10 overflow-hidden flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-transparent pointer-events-none" />
            
            {/* Top Minimal Skeleton to push content down */}
            <div className="flex justify-between items-center w-full mb-auto relative z-10 opacity-50 pt-2">
              <div className="h-2 bg-cyan-500/30 w-1/3 rounded-full" />
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
                <div className="w-2 h-2 rounded-full bg-fuchsia-400/60" />
              </div>
            </div>

            {/* 1. Centered Personalized Greeting */}
            <div className="flex flex-col items-center justify-center relative z-10 my-auto text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                <User size={40} className="text-cyan-300" />
              </div>
              
              <div className="space-y-3 flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0.5 }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                  className="text-cyan-300 font-black text-3xl tracking-tight truncate w-full px-4"
                >
                  Hi, {user?.username?.split(' ')[0] || 'Welcome'}.
                </motion.div>
                
                <div className="h-1 bg-cyan-500/50 w-16 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                
                <motion.span 
                  animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="mt-2 text-[10px] text-cyan-200 font-black tracking-widest uppercase bg-cyan-500/20 border border-cyan-500/30 px-3 py-1 rounded-md inline-block"
                >
                  ATS Match: 99%
                </motion.span>
              </div>
            </div>

            {/* Glowing Skill Tags */}
            <div className="flex justify-center flex-wrap gap-2 mt-auto mb-6 relative z-10">
              <div className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-[9px] text-cyan-200 font-bold uppercase tracking-wider">React</div>
              <div className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/40 rounded-lg text-[9px] text-indigo-200 font-bold uppercase tracking-wider">Node.js</div>
              <div className="px-3 py-1 bg-fuchsia-500/20 border border-fuchsia-400/40 rounded-lg text-[9px] text-fuchsia-200 font-bold uppercase tracking-wider">Docker</div>
            </div>

            {/* 2. Bottom Fast-Loading Bar */}
            <div className="pt-5 border-t border-cyan-500/20 relative z-10">
               <div className="flex justify-between items-center text-[10px] text-cyan-400/80 mb-2 uppercase font-black tracking-widest">
                  <span className="flex items-center gap-1.5"><Zap size={12} className="text-cyan-300" /> Rendering PDF</span>
                  <span>100%</span>
               </div>
               <div className="h-1.5 w-full bg-cyan-900/50 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ['-100%', '0%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "circOut" }}
                    className="h-full w-full bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)]"
                  />
               </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 5. Highlighted Features Grid */}
        <motion.div 
          variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left relative z-20"
        >
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-500/10 group">
            <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="text-cyan-400 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">Lightning Fast</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Don't spend hours aligning text. Import your PDF or LinkedIn profile, and we'll instantly generate a beautiful, formatted resume.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-indigo-500/30 transition-all shadow-lg hover:shadow-indigo-500/10 group">
            <div className="bg-indigo-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="text-indigo-400 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">Smart AI Writer</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stuck on what to write? Our AI perfectly rewrites your experience bullet points to match the exact job you are applying for.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-fuchsia-500/30 transition-all shadow-lg hover:shadow-fuchsia-500/10 group">
            <div className="bg-fuchsia-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LayoutTemplate className="text-fuchsia-400 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">Easy Auto-Formatting</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Simply type in your details, and our engine automatically structures, aligns, and spaces everything perfectly. Zero design skills needed.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/10 group">
            <div className="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="text-emerald-400 w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-white">Passes Resume Scanners</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Recruiters use Applicant Tracking Systems (ATS) to filter resumes. Our clean, code-based templates guarantee your resume gets read by humans.
            </p>
          </motion.div>
        </motion.div>

      </main>
    </div>
  );
};