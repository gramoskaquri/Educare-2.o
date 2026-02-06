
import React, { useState } from 'react';
import { HomeworkTask, Subject, Status, GradingPeriod, AssessmentType } from '../types';
import { PRIORITY_COLORS, STATUS_LABELS } from '../constants';
import { Calendar, CheckCircle, Clock, Trash2, BrainCircuit, ChevronDown, ChevronUp, Book, Zap, GraduationCap, Percent, Save } from 'lucide-react';

interface TaskCardProps {
  task: HomeworkTask;
  subject?: Subject;
  onUpdateStatus: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onGetAIAction: (task: HomeworkTask) => void;
  onLogGrade?: (task: HomeworkTask, score: number, type: AssessmentType, period: GradingPeriod) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, subject, onUpdateStatus, onDelete, onGetAIAction, onLogGrade }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggingGrade, setIsLoggingGrade] = useState(false);
  const [gradeInput, setGradeInput] = useState({ score: 85, type: 'Assessment' as AssessmentType, period: 'VP-1' as GradingPeriod });

  const TypeIcon = () => {
    switch (task.taskType) {
      case 'test': return <Zap size={12} className="text-amber-500" />;
      case 'exam': return <GraduationCap size={12} className="text-rose-500" />;
      default: return <Book size={12} className="text-indigo-500" />;
    }
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogGrade) {
      onLogGrade(task, gradeInput.score, gradeInput.type, gradeInput.period);
      setIsLoggingGrade(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden group ${task.status === 'completed' ? 'opacity-90' : ''}`}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`w-2.5 h-2.5 rounded-full ${subject?.color || 'bg-slate-400'} ring-4 ring-slate-100 dark:ring-slate-900`}></span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                <TypeIcon />
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {task.taskType || 'homework'}
                </span>
              </div>
            </div>
            <h3 className={`text-xl font-black text-slate-800 dark:text-white leading-tight ${task.status === 'completed' ? 'line-through decoration-indigo-500/50 opacity-60' : ''}`}>
              {task.title}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-1 tracking-widest">{subject?.name || 'General'}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${PRIORITY_COLORS[task.priority]} dark:bg-opacity-10 dark:border-opacity-20`}>
              {task.priority}
            </span>
            <button 
              onClick={() => onDelete(task.id)}
              className="p-2 text-slate-300 hover:text-rose-500 transition-colors bg-slate-50 dark:bg-slate-700/50 rounded-xl opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-y-3 gap-x-5 text-xs font-bold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-full border border-slate-100 dark:border-slate-700">
            <Calendar size={14} className="text-indigo-500" />
            <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-full border border-slate-100 dark:border-slate-700">
            <Clock size={14} className="text-amber-500" />
            <span>{STATUS_LABELS[task.status]}</span>
          </div>
        </div>

        {isLoggingGrade && (
          <form onSubmit={handleGradeSubmit} className="mt-6 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-800/40 animate-in zoom-in-95">
            <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4 text-center">Record Test Result</h4>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Score (%)</label>
                <input 
                  type="number" 
                  min="0" max="100" 
                  className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white"
                  value={gradeInput.score}
                  onChange={e => setGradeInput({...gradeInput, score: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Period</label>
                  <select 
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white text-xs"
                    value={gradeInput.period}
                    onChange={e => setGradeInput({...gradeInput, period: e.target.value as GradingPeriod})}
                  >
                    <option value="VP-1">VP-1</option>
                    <option value="VP-2">VP-2</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Category</label>
                  <select 
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white text-xs"
                    value={gradeInput.type}
                    onChange={e => setGradeInput({...gradeInput, type: e.target.value as AssessmentType})}
                  >
                    <option value="Assessment">Assessment</option>
                    <option value="Class Engagement">Engagement</option>
                    <option value="Homework">Homework</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsLoggingGrade(false)} className="flex-1 py-2 text-[10px] font-black text-slate-400 uppercase hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-black text-[10px] uppercase rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2">
                <Save size={12} /> Save
              </button>
            </div>
          </form>
        )}

        {task.aiBreakdown && task.aiBreakdown.length > 0 && !isLoggingGrade && (
          <div className="mt-6 bg-indigo-50/40 dark:bg-indigo-900/20 rounded-2xl p-4 border border-indigo-100/50 dark:border-indigo-800/30">
            <div className="flex items-center gap-2 mb-3 text-indigo-700 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest">
              <BrainCircuit size={14} />
              AI Step-by-Step
            </div>
            <ul className="space-y-2">
              {task.aiBreakdown.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs font-medium text-indigo-900/70 dark:text-indigo-200/60 leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 dark:bg-indigo-600 shrink-0"></span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isLoggingGrade && (
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-5">
            <div className="flex gap-2">
              {task.status !== 'completed' && (
                <button
                  onClick={() => onUpdateStatus(task.id, 'completed')}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-100 dark:shadow-none"
                >
                  <CheckCircle size={14} />
                  Done
                </button>
              )}
              {task.status === 'completed' && (task.taskType === 'test' || task.taskType === 'exam') && (
                <button
                  onClick={() => setIsLoggingGrade(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  <Percent size={14} />
                  Log Score
                </button>
              )}
              {task.status === 'todo' && (
                <button
                  onClick={() => onUpdateStatus(task.id, 'in-progress')}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  Start
                </button>
              )}
              {task.status === 'completed' && (
                <button
                  onClick={() => onUpdateStatus(task.id, 'todo')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black rounded-xl transition-all"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="flex gap-2">
              {!task.aiBreakdown && task.status !== 'completed' && task.taskType === 'homework' && (
                <button
                  onClick={() => onGetAIAction(task)}
                  className="flex items-center justify-center w-9 h-9 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-xl transition-all border border-indigo-100 dark:border-indigo-800"
                  title="AI Breakdown"
                >
                  <BrainCircuit size={18} />
                </button>
              )}
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${isExpanded ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
              >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>
        )}

        {isExpanded && task.description && !isLoggingGrade && (
          <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-400 animate-in fade-in slide-in-from-top-4 duration-300">
            <h4 className="font-black text-slate-800 dark:text-slate-300 text-[10px] uppercase tracking-widest mb-2">Detailed Notes</h4>
            {task.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
