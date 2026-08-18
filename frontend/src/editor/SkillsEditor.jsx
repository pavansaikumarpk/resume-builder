






// import React, { useState } from 'react';
// import { useResumeStore } from '../store/useResumeStore';
// import { X, Wand2, Loader2 } from 'lucide-react';
// import { v4 as uuidv4 } from 'uuid';

// export const SkillsEditor = () => {
//   const { activeResume, addSkillCategory, addSkillToCategory, removeSkillFromCategory, organizeSkillsAi, isTailoring } = useResumeStore();

//   const rawSkills = activeResume?.resumeData?.skills || [];
//   const skills = rawSkills.map(skill =>
//     typeof skill === 'string'
//       ? { id: uuidv4(), category: 'General', items: [{ id: uuidv4(), name: skill }] }
//       : { ...skill, id: skill.id || uuidv4(), items: skill.items?.map(i => ({ ...i, id: i.id || uuidv4() })) || [] }
//   );

//   const [newCategory, setNewCategory] = useState('');
//   const [newSkillInputs, setNewSkillInputs] = useState({});

//   const handleAddCategory = (e) => {
//     if (e.key === 'Enter' && newCategory.trim()) {
//       e.preventDefault();
//       addSkillCategory(newCategory.trim());
//       setNewCategory('');
//     }
//   };

//   const handleAddSkill = (categoryId, e) => {
//     if (e.key === 'Enter' && newSkillInputs[categoryId]?.trim()) {
//       e.preventDefault();
//       addSkillToCategory(categoryId, newSkillInputs[categoryId].trim());
//       setNewSkillInputs(prev => ({ ...prev, [categoryId]: '' }));
//     }
//   };

//   const triggerAiOrganization = () => {
//     organizeSkillsAi(""); 
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-3">
//           <div className="relative flex-1">
//             <input
//               type="text"
//               placeholder="Add category (e.g. Frontend, DevOps) & press Enter..."
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//               onKeyDown={handleAddCategory}
//               className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
//             />
//           </div>
//           <button 
//              onClick={triggerAiOrganization}
//              disabled={isTailoring || skills.length === 0}
//              className="px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-colors whitespace-nowrap"
//           >
//               {isTailoring ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
//               Auto-Group Skills
//           </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {skills.map((cat, catIdx) => (
//           <div key={cat.id || `cat-${catIdx}`} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition-colors">
//             <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
//               <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">{cat.category || 'Skills'}</h4>
//             </div>

//             <div className="flex flex-wrap gap-2 mb-3">
//               {cat.items?.map((skill, skillIdx) => (
//                 <span key={skill.id || `skill-${skillIdx}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold">
//                   {skill.name}
//                   <button type="button" onClick={() => removeSkillFromCategory(cat.id, skill.id)} className="text-indigo-400 hover:text-indigo-600 transition-colors">
//                     <X size={12} />
//                   </button>
//                 </span>
//               ))}
//             </div>

//             <input
//               type="text"
//               placeholder={`Add to ${cat.category || 'Skills'}...`}
//               value={newSkillInputs[cat.id] || ''}
//               onChange={(e) => setNewSkillInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
//               onKeyDown={(e) => handleAddSkill(cat.id, e)}
//               className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-500 transition-all"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };














import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { X, Wand2, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const SkillsEditor = () => {
  const { activeResume, addSkillCategory, addSkillToCategory, removeSkillFromCategory, organizeSkillsAi, isTailoring } = useResumeStore();

  const rawSkills = activeResume?.resumeData?.skills || [];
  // Ensure every skill and every skill item has a unique client-side ID
  const skills = rawSkills.map(skill =>
    typeof skill === 'string'
      ? { id: uuidv4(), category: 'General', items: [{ id: uuidv4(), name: skill }] }
      : { ...skill, id: skill.id || uuidv4(), items: skill.items?.map(i => ({ ...i, id: i.id || uuidv4() })) || [] }
  );

  const [newCategory, setNewCategory] = useState('');
  const [newSkillInputs, setNewSkillInputs] = useState({});

  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault();
      addSkillCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleAddSkill = (categoryId, e) => {
    if (e.key === 'Enter' && newSkillInputs[categoryId]?.trim()) {
      e.preventDefault();
      addSkillToCategory(categoryId, newSkillInputs[categoryId].trim());
      setNewSkillInputs(prev => ({ ...prev, [categoryId]: '' }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Add category (e.g. Frontend, DevOps) & press Enter..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={handleAddCategory}
              className="w-full bg-[#fafafa] border border-zinc-200 rounded-xl py-3 px-4 text-sm font-semibold text-zinc-900 outline-none focus:bg-white focus:border-zinc-300 transition-all shadow-inner placeholder:text-zinc-400"
            />
          </div>
          <button 
             onClick={() => organizeSkillsAi("")}
             disabled={isTailoring || skills.length === 0}
             className="px-4 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black disabled:opacity-50 transition-colors whitespace-nowrap"
          >
              {isTailoring ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              Auto-Group Skills
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((cat, catIdx) => (
          <div key={cat.id || `cat-${catIdx}`} className="bg-white border border-zinc-100 rounded-xl p-4 shadow-sm hover:border-zinc-200 transition-colors">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-zinc-100/50">
              <h4 className="text-xs font-black text-zinc-700 uppercase tracking-wider">{cat.category || 'Skills'}</h4>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {cat.items?.map((skill, skillIdx) => (
                <span key={skill.id || `skill-${skillIdx}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#e0f2fe] text-sky-700 border border-sky-100 rounded-lg text-xs font-bold">
                  {skill.name}
                  <button type="button" onClick={() => removeSkillFromCategory(cat.id, skill.id)} className="text-sky-400 hover:text-sky-600 transition-colors">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            <input
              type="text"
              placeholder={`Add to ${cat.category || 'Skills'}...`}
              value={newSkillInputs[cat.id] || ''}
              onChange={(e) => setNewSkillInputs(prev => ({ ...prev, [cat.id]: e.target.value }))}
              onKeyDown={(e) => handleAddSkill(cat.id, e)}
              className="w-full bg-[#fafafa] border border-zinc-200 rounded-lg py-2 px-3 text-xs font-medium text-zinc-900 outline-none focus:bg-white focus:border-zinc-300 transition-all shadow-inner placeholder:text-zinc-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
};