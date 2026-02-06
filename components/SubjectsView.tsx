
import React, { useState } from 'react';
import { Subject, HomeworkTask } from '../types';
import { Plus, GraduationCap, Users, BookOpen, Trash2, Edit3 } from 'lucide-react';

interface SubjectsViewProps {
  subjects: Subject[];
  tasks: HomeworkTask[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

const SubjectsView: React.FC<SubjectsViewProps> = ({ subjects, tasks, onAddSubject, onUpdateSubject, onDeleteSubject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({ name: '', teacher: '', color: 'bg-indigo-500' });

  const colors = [
    'bg-rose-500', 'bg-red-600', 'bg-blue-500', 'bg-sky-500', 
    'bg-emerald-500', 'bg-teal-500', 'bg-amber-500', 'bg-orange-500',
    'bg-indigo-500', 'bg-purple-500', 'bg-violet-500', 'bg-pink-500', 
    'bg-fuchsia-500', 'bg-yellow-400', 'bg-lime-500', 'bg-slate-500'
  ];

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({ name: '', teacher: '', color: 'bg-indigo-500' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name, teacher: subject.teacher || '', color: subject.color });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editingSubject) {
      onUpdateSubject({ ...editingSubject, ...formData });
    } else {
      onAddSubject(formData);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Academic Directory</h2>
          <p className="text-slate-500 dark:text-slate-400">Your currently active curriculum and faculty.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subjects.map(subject => {
          const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
          const pendingCount = subjectTasks.filter(t => t.status !== 'completed').length;
          
          return (
            <div key={subject.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm group hover:shadow-xl transition-all relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-16 h-16 ${subject.color} opacity-5 -mr-4 -mt-4 rounded-full blur-2xl group-hover:scale-150 transition-all`}></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${subject.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <BookOpen size={24} />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleOpenEdit(subject)}
                    className="p-2 text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit Professor/Subject"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteSubject(subject.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Subject"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1 line-clamp-1">{subject.name}</h3>
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs mb-4 font-bold uppercase tracking-widest">
                <Users size={12} />
                <span className="truncate">{subject.teacher || 'Assigned Staff'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks</p>
                  <p className="text-lg font-black text-slate-800 dark:text-slate-200">{subjectTasks.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due</p>
                  <p className={`text-lg font-black ${pendingCount > 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'}`}>{pendingCount}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 border border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 tracking-tight">
              {editingSubject ? 'Edit Subject' : 'New Subject'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Subject Name</label>
                <input 
                  autoFocus
                  required
                  className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-bold outline-none transition-all placeholder:text-slate-400"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Advanced Calculus"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Instructor / Professor</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-bold outline-none transition-all placeholder:text-slate-400"
                  value={formData.teacher}
                  onChange={e => setFormData({...formData, teacher: e.target.value})}
                  placeholder="e.g. Dr. Richards"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 ml-1">Identification Color</label>
                <div className="grid grid-cols-8 gap-3">
                  {colors.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({...formData, color: c})}
                      className={`w-7 h-7 rounded-full ${c} ${formData.color === c ? 'ring-4 ring-indigo-200 dark:ring-indigo-900 scale-125' : 'hover:scale-110'} transition-all`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-2xl text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none text-xs uppercase tracking-widest transition-transform active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectsView;
