import React, { useCallback, useEffect, useState } from 'react';
import { Activity, ChevronDown, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

const formatTokens = (value = 0) => {
  if (value < 1000) return String(value);
  if (value < 1000000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return `${(value / 1000000).toFixed(1)}M`;
};

export default function AIUsageBadge() {
  const location = useLocation();
  const [usage, setUsage] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadUsage = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    try {
      setLoading(true);
      const { data } = await api.get('/usage/ai');
      setUsage(data);
    } catch (error) {
      console.error('Failed to load AI usage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsage();
    const interval = window.setInterval(loadUsage, 30000);
    window.addEventListener('focus', loadUsage);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', loadUsage);
    };
  }, [loadUsage, location.pathname]);

  if (!localStorage.getItem('token') || !usage) return null;

  const today = usage.today || {};
  const history = usage.history || [];

  return (
    <div className="fixed bottom-5 right-5 z-[100]">
      <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden w-[250px]">
        <button
          onClick={() => setOpen((value) => !value)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity size={16} />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">AI Usage Today</p>
              <p className="text-sm font-black text-slate-800">{formatTokens(today.totalTokens || 0)} tokens</p>
            </div>
          </div>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="border-t border-slate-100 px-4 py-3">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-50 rounded-xl p-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Input</p>
                <p className="text-sm font-black text-slate-700">{formatTokens(today.inputTokens || 0)}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Output</p>
                <p className="text-sm font-black text-slate-700">{formatTokens(today.outputTokens || 0)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recent days</p>
              <button onClick={loadUsage} disabled={loading} className="text-slate-400 hover:text-indigo-600">
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-auto">
              {history.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No AI usage recorded yet.</p>
              ) : history.slice(0, 7).map((day) => (
                <div key={day.date} className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">{day.date}</span>
                  <span className="font-bold text-slate-700">{formatTokens(day.totalTokens)}</span>
                </div>
              ))}
            </div>

            <p className="text-[9px] text-slate-400 mt-3">Counts are based on tokens reported by the AI provider.</p>
          </div>
        )}
      </div>
    </div>
  );
}
