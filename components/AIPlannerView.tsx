
import React from 'react';
import { Sparkles, X, RefreshCcw } from 'lucide-react';

interface AIPlannerViewProps {
  content: string;
  onClose: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

const AIPlannerView: React.FC<AIPlannerViewProps> = ({ content, onClose, onRegenerate, isLoading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">AI Study Buddy</h2>
              <p className="text-xs font-bold text-indigo-600 uppercase">Personalized Schedule</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 leading-relaxed text-slate-700 prose prose-indigo max-w-none">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="font-bold text-slate-500 animate-pulse">Calculating your optimal study flow...</p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black text-slate-900 mb-4">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-slate-800 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-slate-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                if (line.startsWith('- ') || line.startsWith('* ')) return <div key={i} className="flex gap-2 ml-4 mb-2"><span className="text-indigo-500 font-bold">•</span><span>{line.substring(2)}</span></div>;
                return <p key={i} className="mb-4">{line}</p>;
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button 
            onClick={onRegenerate}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 font-bold rounded-2xl transition-all disabled:opacity-50"
          >
            <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
            Regenerate Plan
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all"
          >
            Got it, let's go!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPlannerView;
