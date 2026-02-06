
import React from 'react';
import { HomeworkTask, Subject } from '../types';
import { Target, TrendingUp, Award, Zap, Sparkles, ChevronRight } from 'lucide-react';

interface ProgressViewProps {
  tasks: HomeworkTask[];
  subjects: Subject[];
  onViewGrades?: () => void;
}

const ProgressView: React.FC<ProgressViewProps> = ({ tasks, subjects, onViewGrades }) => {
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const todo = tasks.filter(t => t.status === 'todo').length;
  const total = tasks.length;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  const subjectData = subjects.map(s => {
    const subTasks = tasks.filter(t => t.subjectId === s.id);
    const subCompleted = subTasks.filter(t => t.status === 'completed').length;
    return {
      name: s.name,
      total: subTasks.length,
      completed: subCompleted,
      rate: subTasks.length ? Math.round((subCompleted / subTasks.length) * 100) : 0,
      color: s.color
    };
  }).sort((a, b) => b.rate - a.rate);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Academic Performance</h2>
          <p className="text-slate-500 dark:text-slate-400">Track your progress and celebrate your wins.</p>
        </div>
        {onViewGrades && (
          <button 
            onClick={onViewGrades}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            Academic Records
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
            <Target size={24} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Completion Rate</p>
          <p className="text-3xl font-black text-slate-800 dark:text-white">{completionRate}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
            <Award size={24} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tasks Done</p>
          <p className="text-3xl font-black text-slate-800 dark:text-white">{completed}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">In Progress</p>
          <p className="text-3xl font-black text-slate-800 dark:text-white">{inProgress}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4">
            <TrendingUp size={24} />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Backlog</p>
          <p className="text-3xl font-black text-slate-800 dark:text-white">{todo}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Subject Distribution</h3>
          <div className="space-y-6">
            {subjectData.map(sub => (
              <div key={sub.name}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{sub.name}</span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{sub.completed}/{sub.total} ({sub.rate}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${sub.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${sub.rate}%` }}
                  />
                </div>
              </div>
            ))}
            {subjectData.length === 0 && (
              <div className="text-center py-10">
                 <p className="text-slate-400 italic mb-4">Add some subjects to see your breakdown!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
          <div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <Sparkles className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-black mb-3">Educare 2.o Insight</h3>
            <p className="text-indigo-100 font-medium leading-relaxed mb-8">
              {completionRate > 75 
                ? "You're absolutely crushing it! Your productivity is in the top 5% of students. Keep maintaining this momentum to excel in your exams."
                : completionRate > 40
                ? "Good steady progress. You're staying on top of most tasks, but focus on clearing that 'In Progress' list to avoid burnout."
                : "A bit of a slow start this week. Try breaking down your biggest task with AI to get some quick wins under your belt."}
            </p>
            {onViewGrades && (
              <button 
                onClick={onViewGrades}
                className="px-6 py-3 bg-white text-indigo-600 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
              >
                View Detailed Records
              </button>
            )}
          </div>
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-indigo-100">Joined by 1.2k other active students today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressView;
