
import React, { useState } from 'react';
import { Sparkles, Loader2, Check, ChevronRight } from 'lucide-react';
import api from '../utils/api';

export const AiInputField = ({ value, onChange, placeholder, rows = 4, jdText = "" }) => {
  const [isImproving, setIsImproving] = useState(false);
  const [aiOptions, setAiOptions] = useState([]);

  const handleImprove = async (e) => {
    e.preventDefault(); 
    if (!value || value.trim().length < 10) return alert("Substantiate your input with at least 10 characters.");
    
    setIsImproving(true);
    setAiOptions([]);
    try {
      const { data } = await api.post('/ai/optimize-bullet', { 
          bulletText: value,
          jobDescription: jdText 
      });
      if (data && data.options) {
          setAiOptions(data.options);
      }
    } catch (error) { 
      alert("Failed to synthesize AI variations."); 
    } finally { 
      setIsImproving(false); 
    }
  };

  const applyOption = (selectedOption) => {
      onChange(selectedOption);
      setAiOptions([]); // Clear options after selection
  };

  return (
    <div className="relative w-full mt-2 flex flex-col gap-2">
      <div className="relative">
        <textarea 
          rows={rows} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          disabled={isImproving} 
          placeholder={placeholder}
          className={`w-full p-4 pb-12 rounded-xl border outline-none resize-none transition-all shadow-sm ${
            isImproving ? 'bg-indigo-50/50 border-indigo-200 text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500 focus:bg-white'
          }`}
        />
        <button 
          type="button" 
          onClick={handleImprove} 
          disabled={isImproving} 
          className="absolute bottom-3 right-3 px-3 py-1.5 bg-white border border-slate-200 text-indigo-600 rounded-lg shadow-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-xs font-bold z-10 disabled:opacity-50"
        >
          {isImproving ? <Loader2 size={14} className="animate-spin text-indigo-500" /> : <Sparkles size={14} />}
          {isImproving ? 'Synthesizing...' : 'Generate Variations'}
        </button>
      </div>

      {aiOptions.length > 0 && (
        <div className="flex flex-col gap-2 mt-2 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles size={12}/> Select an Optimized Variant
            </span>
            {aiOptions.map((opt, idx) => (
                <div 
                    key={idx} 
                    onClick={() => applyOption(opt)}
                    className="group flex items-start gap-3 p-3 bg-white border border-indigo-100 rounded-lg cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all"
                >
                    <div className="mt-0.5 p-1 bg-indigo-100 text-indigo-600 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed flex-1">{opt}</p>
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 mt-1" />
                </div>
            ))}
        </div>
      )}
    </div>
  );
};