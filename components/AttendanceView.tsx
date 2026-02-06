
import React, { useState, useMemo } from 'react';
import { AttendanceRecord, Subject, AttendanceValue } from '../types';
import { Filter, Search, Calendar, UserCheck, Info, Plus, ChevronDown } from 'lucide-react';

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  subjects: Subject[];
  onAddRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
}

const LESSON_TIMES = [
  { label: 'Lesson 1', time: '08:45 - 09:30' },
  { label: 'Lesson 2', time: '09:40 - 10:25' },
  { label: 'Lesson 3', time: '10:35 - 11:20' },
  { label: 'Lesson 4', time: '11:30 - 12:15' },
  { label: 'Lesson 5', time: '12:25 - 13:05' },
  { label: 'Lesson 6', time: '13:35 - 14:15' },
  { label: 'Lesson 7', time: '14:20 - 15:00' },
];

const AttendanceView: React.FC<AttendanceViewProps> = ({ attendance, subjects, onAddRecord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: subjects[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    period: `${LESSON_TIMES[0].label} (${LESSON_TIMES[0].time})`,
    value: 'Present' as AttendanceValue
  });

  const getAvailableLessons = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay(); // 0: Sun, 1: Mon, ..., 4: Thu, 5: Fri, 6: Sat
    // Thursday (4) and Friday (5) have only 6 classes
    if (day === 4 || day === 5) {
      return LESSON_TIMES.slice(0, 6);
    }
    return LESSON_TIMES;
  };

  const availableLessons = useMemo(() => getAvailableLessons(formData.date), [formData.date]);

  const months = useMemo(() => {
    const data: Record<string, { absent: number, tardy: number, excused: number }> = {
      '2026 / 01': { absent: 0, tardy: 0, excused: 0 },
      '2026 / 02': { absent: 0, tardy: 0, excused: 0 }
    };
    
    attendance.forEach(record => {
      const date = new Date(record.date);
      const key = `${date.getFullYear()} / ${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!data[key]) data[key] = { absent: 0, tardy: 0, excused: 0 };
      
      if (record.value === 'Absent') data[key].absent++;
      if (record.value === 'Tardy') data[key].tardy++;
      if (record.value === 'Excused') data[key].excused++;
    });
    
    return data;
  }, [attendance]);

  const stats = useMemo(() => {
    const total = attendance.length || 1; // avoid divide by zero
    const counts = {
      Present: attendance.filter(a => a.value === 'Present').length,
      Tardy: attendance.filter(a => a.value === 'Tardy').length,
      Excused: attendance.filter(a => a.value === 'Excused').length,
      Absent: attendance.filter(a => a.value === 'Absent').length,
    };
    return {
      ...counts,
      presentPercent: Math.round((counts.Present / total) * 10000) / 100,
      tardyPercent: Math.round((counts.Tardy / total) * 10000) / 100,
      excusedPercent: Math.round((counts.Excused / total) * 10000) / 100,
      totalCount: attendance.length
    };
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    return attendance.filter(a => {
      const subject = subjects.find(s => s.id === a.subjectId);
      return subject?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
             a.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.value.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [attendance, subjects, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord(formData);
    setIsAdding(false);
  };

  // Simplified SVG Donut Chart
  const renderDonut = () => {
    const total = 100;
    const p = stats.presentPercent || 0;
    const t = stats.tardyPercent || 0;
    const e = stats.excusedPercent || 0;
    
    const circumference = 2 * Math.PI * 40;
    const pDash = (p / total) * circumference;
    const tDash = (t / total) * circumference;
    const eDash = (e / total) * circumference;
    
    return (
      <svg viewBox="0 0 100 100" className="w-64 h-64 transform -rotate-90">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e2e8f0" strokeWidth="12" />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray={`${pDash} ${circumference}`} />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray={`${tDash} ${circumference}`} strokeDashoffset={-pDash} />
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray={`${eDash} ${circumference}`} strokeDashoffset={-(pDash + tDash)} opacity="0.6" />
      </svg>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Attendance Tracking</h2>
          <p className="text-slate-500 dark:text-slate-400">Detailed overview of your classroom presence.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl flex items-center gap-3 transition-all active:scale-95"
        >
          <Plus size={20} />
          Log Entry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest">Semester II : Summary</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-100/50 dark:bg-slate-800/30">
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 border-r border-slate-200 dark:border-slate-800">#</th>
                  {Object.keys(months).map(m => (
                    <th key={m} className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 border-r border-slate-200 dark:border-slate-800 text-center">{m}</th>
                  ))}
                  <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-bold text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="px-6 py-4 text-xs border-r border-slate-200 dark:border-slate-800">Absent</td>
                  {(Object.values(months) as any[]).map((m, i) => <td key={i} className="px-6 py-4 text-center border-r border-slate-200 dark:border-slate-800">{m.absent}</td>)}
                  <td className="px-6 py-4 text-center">{(Object.values(months) as any[]).reduce((acc: number, m) => acc + m.absent, 0)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-xs border-r border-slate-200 dark:border-slate-800">Tardy</td>
                  {(Object.values(months) as any[]).map((m, i) => <td key={i} className="px-6 py-4 text-center border-r border-slate-200 dark:border-slate-800">{m.tardy}</td>)}
                  <td className="px-6 py-4 text-center">{(Object.values(months) as any[]).reduce((acc: number, m) => acc + m.tardy, 0)}</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-xs border-r border-slate-200 dark:border-slate-800">Excused</td>
                  {(Object.values(months) as any[]).map((m, i) => <td key={i} className="px-6 py-4 text-center border-r border-slate-200 dark:border-slate-800">{m.excused}</td>)}
                  <td className="px-6 py-4 text-center">{(Object.values(months) as any[]).reduce((acc: number, m) => acc + m.excused, 0)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-8 flex flex-col items-center">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 tracking-tight">Absence Graph</h3>
            <div className="relative flex items-center justify-center">
              {renderDonut()}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.presentPercent}%</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Present</span>
              </div>
              
              {/* Labels mapping to stats */}
              <div className="absolute top-0 right-[-60px] flex items-center gap-2">
                <div className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black rounded">{stats.Tardy} ({stats.tardyPercent}%)</div>
                <div className="w-10 h-[1px] bg-blue-300"></div>
              </div>
              <div className="absolute bottom-20 right-[-60px] flex items-center gap-2">
                <div className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded">{stats.Excused} ({stats.excusedPercent}%)</div>
                <div className="w-10 h-[1px] bg-emerald-400"></div>
              </div>
            </div>
            <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500"></div> Present</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"></div> Tardy</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-800"></div> Excused</div>
            </div>
            <p className="mt-8 text-xl font-black text-slate-400">Total Course Count : <span className="text-slate-800 dark:text-white">{stats.totalCount}</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
           <div className="p-8 border-b border-slate-200 dark:border-slate-800">
             <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6">List of Attendance</h3>
             <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input 
                 type="text" 
                 placeholder="Filter courses, periods or values..."
                 className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-800 dark:text-white"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar">
             <table className="w-full text-left">
               <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                 <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <th className="px-6 py-4">Course</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4">Period</th>
                   <th className="px-6 py-4">Value</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                 {filteredAttendance.map(record => {
                   const subject = subjects.find(s => s.id === record.subjectId);
                   return (
                     <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <td className="px-6 py-5">
                         <div className="flex flex-col">
                           <span className="font-bold text-slate-800 dark:text-white text-sm">{subject?.name}</span>
                           <span className="text-[10px] text-slate-400 font-bold uppercase">{subject?.teacher}</span>
                         </div>
                       </td>
                       <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-400">{new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                       <td className="px-6 py-5 text-xs font-bold text-slate-500 dark:text-slate-500">{record.period}</td>
                       <td className="px-6 py-5">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           record.value === 'Present' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' :
                           record.value === 'Absent' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' :
                           record.value === 'Tardy' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                           'bg-slate-100 dark:bg-slate-800 text-slate-600'
                         }`}>
                           {record.value}
                         </span>
                       </td>
                     </tr>
                   );
                 })}
                 {filteredAttendance.length === 0 && (
                   <tr>
                     <td colSpan={4} className="px-6 py-20 text-center text-slate-400 italic font-bold">No attendance records found matching your query.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Log New Attendance</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Academic Subject</label>
                <select className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none outline-none font-bold text-slate-800 dark:text-white shadow-sm" value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})}>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                <input type="date" className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white shadow-sm" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value, period: `${availableLessons[0].label} (${availableLessons[0].time})`})} />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Period / Lesson</label>
                <select 
                  className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white shadow-sm outline-none" 
                  value={formData.period} 
                  onChange={e => setFormData({...formData, period: e.target.value})}
                >
                  {availableLessons.map((lesson, idx) => (
                    <option key={idx} value={`${lesson.label} (${lesson.time})`}>
                      {lesson.label} ({lesson.time})
                    </option>
                  ))}
                </select>
                {(new Date(formData.date).getDay() === 4 || new Date(formData.date).getDay() === 5) && (
                  <p className="text-[9px] font-black text-amber-500 uppercase mt-2 ml-1 tracking-widest flex items-center gap-1">
                    <Info size={10} /> Limited schedule for Thursday/Friday
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Present', 'Absent', 'Tardy', 'Excused'] as AttendanceValue[]).map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFormData({...formData, value: val})}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        formData.value === val 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceView;
