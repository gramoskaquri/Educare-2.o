
import React from 'react';
import { HomeworkTask, Subject } from '../types';
import { ChevronLeft, ChevronRight, Book, Zap, GraduationCap } from 'lucide-react';

interface CalendarViewProps {
  tasks: HomeworkTask[];
  subjects: Subject[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, subjects }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const days = Array.from({ length: daysInMonth(currentDate.getFullYear(), currentDate.getMonth()) }, (_, i) => i + 1);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{monthName} {currentDate.getFullYear()}</h2>
          <p className="text-slate-500 dark:text-slate-400">View all your upcoming homework, tests, and exams.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: startDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-32 border-r border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/20 dark:bg-slate-900/10"></div>
          ))}
          {days.map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayTasks = tasks.filter(t => t.dueDate === dateStr);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <div key={day} className={`h-40 p-2 border-r border-b border-slate-100 dark:border-slate-700/50 relative hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all group`}>
                <span className={`text-sm font-bold inline-flex items-center justify-center ${isToday ? 'w-7 h-7 bg-indigo-600 text-white rounded-full' : 'text-slate-400 dark:text-slate-500'}`}>
                  {day}
                </span>
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[100px] custom-scrollbar pr-1">
                  {dayTasks.map(task => {
                    const subject = subjects.find(s => s.id === task.subjectId);
                    return (
                      <div 
                        key={task.id} 
                        className={`px-1.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                          task.taskType === 'exam' 
                          ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30 text-rose-700 dark:text-rose-400' 
                          : task.taskType === 'test'
                          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                        }`}
                      >
                        <div className={`w-1 h-1 rounded-full shrink-0 ${subject?.color || 'bg-slate-400'}`} />
                        {task.taskType === 'exam' && <GraduationCap size={10} />}
                        {task.taskType === 'test' && <Zap size={10} />}
                        <span className="text-[9px] font-black truncate leading-none uppercase tracking-tighter">
                          {task.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800" /> Homework</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800" /> Tests</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-100 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800" /> Exams</div>
      </div>
    </div>
  );
};

export default CalendarView;
