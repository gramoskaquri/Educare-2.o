
import React, { useState, useMemo } from 'react';
import { ScheduleEntry, Subject } from '../types';
import { Plus, Clock, MapPin, Trash2, Info } from 'lucide-react';

interface ScheduleViewProps {
  schedule: ScheduleEntry[];
  subjects: Subject[];
  onAddEntry: (entry: Omit<ScheduleEntry, 'id'>) => void;
  onDeleteEntry: (id: string) => void;
}

const LESSON_TIMES = [
  { label: 'Lesson 1', startTime: '08:45', endTime: '09:30' },
  { label: 'Lesson 2', startTime: '09:40', endTime: '10:25' },
  { label: 'Lesson 3', startTime: '10:35', endTime: '11:20' },
  { label: 'Lesson 4', startTime: '11:30', endTime: '12:15' },
  { label: 'Lesson 5', startTime: '12:25', endTime: '13:05' },
  { label: 'Lesson 6', startTime: '13:35', endTime: '14:15' },
  { label: 'Lesson 7', startTime: '14:20', endTime: '15:00' },
];

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedule, subjects, onAddEntry, onDeleteEntry }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || '',
    day: 1, // 1-5 (Mon-Fri)
    selectedLessonIndex: 0,
    room: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getAvailableLessons = (day: number) => {
    // Thursday (4) and Friday (5) have only 6 classes
    if (day === 4 || day === 5) {
      return LESSON_TIMES.slice(0, 6);
    }
    return LESSON_TIMES;
  };

  const availableLessons = useMemo(() => getAvailableLessons(formData.day), [formData.day]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lesson = availableLessons[formData.selectedLessonIndex] || availableLessons[0];
    onAddEntry({
      subjectId: formData.subjectId,
      day: formData.day,
      startTime: lesson.startTime,
      endTime: lesson.endTime,
      room: formData.room
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Class Timetable</h2>
          <p className="text-slate-500 dark:text-slate-400">Weekly overview of your academic sessions at Educare 2.o.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {days.map((dayName, index) => {
          const dayIndex = index + 1;
          const dayEntries = schedule.filter(s => s.day === dayIndex).sort((a, b) => a.startTime.localeCompare(b.startTime));
          
          return (
            <div key={dayName} className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                <h3 className="font-black text-slate-800 dark:text-white tracking-widest uppercase text-xs">{dayName}</h3>
              </div>
              <div className="space-y-3">
                {dayEntries.map(entry => {
                  const subject = subjects.find(s => s.id === entry.subjectId);
                  return (
                    <div key={entry.id} className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm relative group transition-all hover:scale-[1.02]">
                      <div className={`w-2 h-10 absolute left-3 top-1/2 -translate-y-1/2 rounded-full ${subject?.color || 'bg-slate-300'}`} />
                      <div className="pl-4">
                        <h4 className="font-black text-slate-800 dark:text-white text-sm leading-tight mb-1">{subject?.name}</h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                            <Clock size={12} />
                            <span>{entry.startTime} - {entry.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                            <MapPin size={12} />
                            <span>Room {entry.room || 'TBD'}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => onDeleteEntry(entry.id)} className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
                {dayEntries.length === 0 && (
                  <div className="py-12 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">No Classes</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Schedule New Class</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Academic Subject</label>
                <select className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none font-bold text-slate-800 dark:text-white" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})}>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Day</label>
                  <select className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none font-bold text-slate-800 dark:text-white" value={formData.day} onChange={e => {
                    const newDay = parseInt(e.target.value);
                    setFormData({...formData, day: newDay, selectedLessonIndex: 0});
                  }}>
                    {days.map((d, i) => <option key={d} value={i+1}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Room No.</label>
                  <input className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} placeholder="302A" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lesson Hour</label>
                <select 
                  className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none font-bold text-slate-800 dark:text-white"
                  value={formData.selectedLessonIndex}
                  onChange={e => setFormData({...formData, selectedLessonIndex: parseInt(e.target.value)})}
                >
                  {availableLessons.map((lesson, idx) => (
                    <option key={idx} value={idx}>{lesson.label} ({lesson.startTime} - {lesson.endTime})</option>
                  ))}
                </select>
                {(formData.day === 4 || formData.day === 5) && (
                  <p className="text-[9px] font-black text-amber-500 uppercase mt-2 ml-1 tracking-widest flex items-center gap-1">
                    <Info size={10} /> 6-hour schedule on {days[formData.day-1]}s
                  </p>
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg">Save Session</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleView;
