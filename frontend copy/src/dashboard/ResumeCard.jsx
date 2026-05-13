import { motion } from 'framer-motion';
import { FileText, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { Button } from '../components/Button';

export const ResumeCard = ({ resume }) => {
  const deleteResume = useResumeStore(state => state.deleteResume);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white border border-slate-200 p-6 rounded-[2.5rem] hover:shadow-2xl hover:shadow-blue-900/5 transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <FileText size={24} />
        </div>
        <Button 
          variant="danger" 
          className="p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => deleteResume(resume.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>

      <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{resume.title || 'Untitled Resume'}</h3>
      
      <div className="flex items-center text-slate-400 text-xs font-bold gap-4 mb-6 uppercase tracking-widest">
        <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(resume.updatedAt).toLocaleDateString()}</span>
      </div>

      <div className="flex gap-2">
        <Button className="w-full py-3 rounded-xl bg-slate-100 text-slate-900 hover:bg-blue-600 hover:text-white" onClick={() => window.location.href=`/editor/${resume.id}`}>
          Edit <ExternalLink size={14} />
        </Button>
      </div>
    </motion.div>
  );
};