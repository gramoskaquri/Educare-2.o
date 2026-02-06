
import React, { useState, useMemo } from 'react';
import { Grade, Subject, AssessmentType, GradingPeriod } from '../types';
import { Plus, Calculator, Trash2, ChevronDown, Award, Sparkles } from 'lucide-react';

interface GradesViewProps {
  grades: Grade[];
  subjects: Subject[];
  onAddGrade: (grade: Omit<Grade, 'id'>) => void;
  onDeleteGrade: (id: string) => void;
}

const CATEGORIES: { type: AssessmentType; weight: number; period: GradingPeriod; label: string; subLabel: string }[] = [
  { type: 'Assessment', weight: 0.20, period: 'VP-1', label: 'Assessment (Jan-Feb-Mar)', subLabel: '(20%) VP-1' },
  { type: 'Class Engagement', weight: 0.20, period: 'VP-1', label: 'Class Engagement (Jan-Feb-Mar)', subLabel: '(20%) VP-1' },
  { type: 'Homework', weight: 0.10, period: 'VP-1', label: 'Homework (Jan-Feb-Mar)', subLabel: '(10%) VP-1' },
  { type: 'Assessment', weight: 0.20, period: 'VP-2', label: 'Assessment (Apr-May-Jun)', subLabel: '(20%) VP-2' },
  { type: 'Class Engagement', weight: 0.20, period: 'VP-2', label: 'Class Engagement (Apr-May-Jun)', subLabel: '(20%) VP-2' },
  { type: 'Homework', weight: 0.10, period: 'VP-2', label: 'Homework (Apr-May-Jun)', subLabel: '(10%) VP-2' },
];

const GradesView: React.FC<GradesViewProps> = ({ grades, subjects, onAddGrade, onDeleteGrade }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    score: 85,
    type: 'Assessment' as AssessmentType,
    period: 'VP-1' as GradingPeriod,
    date: new Date().toISOString().split('T')[0]
  });

  const selectedSubject = subjects.find(s => s.id === selectedSubjectId);
  const subjectGrades = grades.filter(g => g.subjectId === selectedSubjectId);

  const tableData = useMemo(() => {
    let totalWeightedScore = 0;
    const rows = CATEGORIES.map(cat => {
      const catGrades = subjectGrades.filter(g => g.type === cat.type && g.period === cat.period);
      const count = catGrades.length;
      const avg = count > 0 ? Math.round(catGrades.reduce((acc, g) => acc + g.score, 0) / count) : null;
      
      if (avg !== null) {
        totalWeightedScore += (avg * cat.weight);
      }

      return { ...cat, count, avg };
    });

    return { rows, semesterAvg: totalWeightedScore > 0 ? Math.round(totalWeightedScore) : null };
  }, [subjectGrades]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !selectedSubjectId) return;
    const cat = CATEGORIES.find(c => c.type === formData.type && c.period === formData.period);
    onAddGrade({
      subjectId: selectedSubjectId,
      title: formData.title,
      score: formData.score,
      weight: cat?.weight || 0.1,
      type: formData.type,
      period: formData.period,
      date: formData.date
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <Award size={24} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight italic">Academic Record</h2>
          </div>
          <div className="relative inline-block w-full sm:w-80">
            <select 
              className="w-full appearance-none bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 font-black text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-md"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-3 transition-all active:scale-95"
        >
          <Plus size={20} />
          Record Score
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden ring-1 ring-slate-100 dark:ring-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800 w-1/2 text-center">Grading Weight</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800 text-center">Gradings</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-slate-800 text-center">Avg</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800 text-center bg-indigo-50/50 dark:bg-indigo-900/20">Semester II Avg.</th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 text-center bg-emerald-50/30 dark:bg-emerald-900/20">Year Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {tableData.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5 font-medium text-slate-600 dark:text-slate-400 border-r border-slate-50 dark:border-slate-800/50">
                    <span className="text-slate-900 dark:text-white font-black text-sm">{row.label}</span> 
                    <span className="text-[10px] font-black text-indigo-500 uppercase ml-2 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">{row.subLabel}</span>
                  </td>
                  <td className="px-8 py-5 text-center text-slate-500 font-bold border-r border-slate-50 dark:border-slate-800/50">{row.count || '-'}</td>
                  <td className="px-8 py-5 text-center font-black text-slate-800 dark:text-white border-r border-slate-50 dark:border-slate-800/50">
                    <span className={row.avg !== null ? 'px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg' : ''}>
                      {row.avg !== null ? `${row.avg}%` : '-'}
                    </span>
                  </td>
                  {idx === 0 && (
                    <td rowSpan={6} className="text-center bg-indigo-50/20 dark:bg-indigo-900/10 border-r border-slate-100 dark:border-slate-800/50">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="relative">
                           <div className="absolute -inset-4 bg-indigo-500/10 blur-xl rounded-full"></div>
                           <span className={`relative text-6xl font-black ${tableData.semesterAvg ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-700'}`}>
                            {tableData.semesterAvg !== null ? tableData.semesterAvg : '-'}
                          </span>
                        </div>
                        {tableData.semesterAvg !== null && <span className="text-[11px] font-black text-indigo-400 dark:text-indigo-500 uppercase mt-4 tracking-widest bg-white dark:bg-slate-800 px-4 py-1 rounded-full shadow-sm">Weighted Total</span>}
                      </div>
                    </td>
                  )}
                  {idx === 0 && (
                    <td rowSpan={6} className="text-center bg-emerald-50/10 dark:bg-emerald-900/10">
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className={`text-4xl font-black ${tableData.semesterAvg ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`}>
                          {tableData.semesterAvg !== null ? tableData.semesterAvg : '-'}
                        </span>
                        {tableData.semesterAvg !== null && <span className="text-[11px] font-black text-emerald-400 uppercase mt-3 tracking-widest opacity-60">Annual Avg</span>}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Detailed Assessment Log</h3>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-500">
            <Sparkles size={14} />
            Auto-calculated Results
          </div>
        </div>
        <div className="space-y-3">
          {subjectGrades.length > 0 ? subjectGrades.map(grade => (
            <div key={grade.id} className="flex items-center justify-between p-5 rounded-[2rem] border border-slate-50 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 group transition-all">
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg ${selectedSubject?.color || 'bg-indigo-500'}`}>
                  {grade.type[0]}
                </div>
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight">{grade.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{grade.period}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{grade.type}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(grade.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                   <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{grade.score}%</span>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Raw Score</span>
                </div>
                <button onClick={() => onDeleteGrade(grade.id)} className="p-3 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
               <Calculator size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
               <p className="text-slate-400 font-bold">No academic assessments recorded yet.</p>
               <button onClick={() => setIsAdding(true)} className="mt-4 text-xs font-black text-indigo-500 uppercase tracking-widest hover:underline underline-offset-4">Add your first grade</button>
            </div>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Log New Result</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Title</label>
                <input required className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-white font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Midterm Quiz" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Period</label>
                  <select className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none font-bold text-slate-800 dark:text-white" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value as GradingPeriod})}>
                    <option value="VP-1">VP-1 (Jan-Mar)</option>
                    <option value="VP-2">VP-2 (Apr-Jun)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <select className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none font-bold text-slate-800 dark:text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as AssessmentType})}>
                    <option value="Assessment">Assessment</option>
                    <option value="Class Engagement">Class Engagement</option>
                    <option value="Homework">Homework</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Score (%)</label>
                <input type="number" min="0" max="100" className="w-full px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white" value={formData.score} onChange={e => setFormData({...formData, score: parseInt(e.target.value)})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none transition-transform active:scale-95">Save Grade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesView;
