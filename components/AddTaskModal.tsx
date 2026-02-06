
import React from 'react';
import { Subject, Priority, TaskType } from '../types';
import { X, Save, AlertCircle, Book, Zap, GraduationCap } from 'lucide-react';

interface AddTaskModalProps {
  subjects: Subject[];
  onClose: () => void;
  onSave: (task: { title: string; subjectId: string; dueDate: string; priority: Priority; description: string; taskType: TaskType }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ subjects, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    subjectId: subjects[0]?.id || '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as Priority,
    taskType: 'homework' as TaskType,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200 dark:border-slate-800">
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">New Assignment</h2>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mt-1">Homework, tests, and exams all in one place.</p>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">What kind of task is this?</label>
            <div className="grid grid-cols-3 gap-3">
              {(['homework', 'test', 'exam'] as TaskType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, taskType: type })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                    formData.taskType === type
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400 dark:text-slate-500 hover:border-slate-200'
                  }`}
                >
                  {type === 'homework' && <Book size={20} />}
                  {type === 'test' && <Zap size={20} />}
                  {type === 'exam' && <GraduationCap size={20} />}
                  <span className="text-[10px] font-black uppercase tracking-wider">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Title</label>
            <input
              autoFocus
              required
              type="text"
              placeholder="e.g. Chapter 4 Quiz or Math Worksheet"
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white text-lg font-bold outline-none transition-all"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Subject</label>
              <select
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 text-slate-800 dark:text-white font-bold outline-none appearance-none"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Deadline Date</label>
              <input
                type="date"
                required
                className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 text-slate-800 dark:text-white font-bold outline-none"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    formData.priority === p 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Additional Notes</label>
            <textarea
              placeholder="Any extra details..."
              rows={3}
              className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 text-slate-700 dark:text-slate-300 font-medium outline-none resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </form>

        <div className="p-10 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-3xl transition-all active:scale-95"
          >
            <Save size={24} />
            Add to Planner
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
