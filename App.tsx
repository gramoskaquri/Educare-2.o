
import React, { useState, useEffect, useMemo } from 'react';
import { HomeworkTask, Subject, AppState, Status, Priority, AppView, Grade, ScheduleEntry, TaskType, AssessmentType, GradingPeriod, AttendanceRecord, User } from './types';
import { DEFAULT_SUBJECTS } from './constants';
import { geminiService } from './services/geminiService';
import TaskCard from './components/TaskCard';
import AddTaskModal from './components/AddTaskModal';
import AIPlannerView from './components/AIPlannerView';
import SubjectsView from './components/SubjectsView';
import CalendarView from './components/CalendarView';
import ProgressView from './components/ProgressView';
import GradesView from './components/GradesView';
import ScheduleView from './components/ScheduleView';
import AttendanceView from './components/AttendanceView';
import LoginView from './components/LoginView';
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Filter,
  BarChart3,
  Moon,
  Sun,
  Menu,
  X as CloseIcon,
  Percent,
  ListOrdered,
  Award,
  UserCheck,
  LogOut,
  ChevronDown
} from 'lucide-react';

const App: React.FC = () => {
  const getInitialState = (): AppState => {
    const currentUser = JSON.parse(localStorage.getItem('educare_session') || 'null');
    
    if (currentUser) {
      const saved = localStorage.getItem(`educare_state_${currentUser.username}`);
      if (saved) {
        return JSON.parse(saved);
      }
    }

    return { 
      tasks: [], 
      subjects: DEFAULT_SUBJECTS,
      grades: [],
      schedule: [],
      attendance: [],
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      currentUser
    };
  };

  const [state, setState] = useState<AppState>(getInitialState);

  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIPlannerOpen, setIsAIPlannerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [aiSchedule, setAiSchedule] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem(`educare_state_${state.currentUser.username}`, JSON.stringify(state));
      localStorage.setItem('educare_session', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('educare_session');
    }

    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const handleLogin = (user: User) => {
    const savedState = localStorage.getItem(`educare_state_${user.username}`);
    if (savedState) {
      setState(JSON.parse(savedState));
    } else {
      // Strictly initialize NEW user data to be empty
      setState({
        tasks: [],
        subjects: [...DEFAULT_SUBJECTS], // Clone to avoid reference issues
        grades: [],
        schedule: [],
        attendance: [],
        darkMode: state.darkMode,
        currentUser: user
      });
    }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    // Reset memory state immediately to defaults
    setState({
      tasks: [],
      subjects: DEFAULT_SUBJECTS,
      grades: [],
      schedule: [],
      attendance: [],
      darkMode: state.darkMode,
      currentUser: null
    });
    setCurrentView('dashboard');
  };

  const addTask = (taskData: Omit<HomeworkTask, 'id' | 'status'>) => {
    const newTask: HomeworkTask = { ...taskData, id: crypto.randomUUID(), status: 'todo' };
    setState(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const addGrade = (gradeData: Omit<Grade, 'id'>) => {
    const newGrade: Grade = { ...gradeData, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, grades: [newGrade, ...prev.grades] }));
  };

  const handleLogTaskGrade = (task: HomeworkTask, score: number, type: AssessmentType, period: GradingPeriod) => {
    const weightMap: Record<AssessmentType, number> = {
      'Assessment': 0.20,
      'Class Engagement': 0.20,
      'Homework': 0.10
    };

    addGrade({
      subjectId: task.subjectId,
      title: task.title,
      score,
      weight: weightMap[type] || 0.1,
      type,
      period,
      date: new Date().toISOString().split('T')[0]
    });
    setCurrentView('grades');
  };

  const deleteGrade = (id: string) => {
    setState(prev => ({ ...prev, grades: prev.grades.filter(g => g.id !== id) }));
  };

  const addAttendanceRecord = (recordData: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = { ...recordData, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, attendance: [newRecord, ...prev.attendance] }));
  };

  const addScheduleEntry = (entryData: Omit<ScheduleEntry, 'id'>) => {
    const newEntry: ScheduleEntry = { ...entryData, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, schedule: [...prev.schedule, newEntry] }));
  };

  const deleteScheduleEntry = (id: string) => {
    setState(prev => ({ ...prev, schedule: prev.schedule.filter(s => s.id !== id) }));
  };

  const addSubject = (subData: Omit<Subject, 'id'>) => {
    const newSub: Subject = { ...subData, id: crypto.randomUUID() };
    setState(prev => ({ ...prev, subjects: [...prev.subjects, newSub] }));
  };

  const updateSubject = (updatedSub: Subject) => {
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === updatedSub.id ? updatedSub : s)
    }));
  };

  const deleteSubject = (id: string) => {
    setState(prev => ({ 
      ...prev, 
      subjects: prev.subjects.filter(s => s.id !== id),
      tasks: prev.tasks.filter(t => t.subjectId !== id),
      grades: prev.grades.filter(g => g.subjectId !== id),
      schedule: prev.schedule.filter(s => s.subjectId !== id),
      attendance: prev.attendance.filter(a => a.subjectId !== id)
    }));
  };

  const updateTaskStatus = (id: string, status: Status) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, status } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const handleAIBreakdown = async (task: HomeworkTask) => {
    const subject = state.subjects.find(s => s.id === task.subjectId);
    const breakdown = await geminiService.breakDownTask(task, subject);
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === task.id ? { ...t, aiBreakdown: breakdown } : t)
    }));
  };

  const handleGenerateSchedule = async () => {
    setIsAIPlannerOpen(true);
    setIsAILoading(true);
    const schedule = await geminiService.suggestStudySchedule(state.tasks, state.subjects);
    setAiSchedule(schedule);
    setIsAILoading(false);
  };

  const filteredTasks = useMemo(() => {
    return state.tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
      const matchesSubject = filterSubject === 'all' || t.subjectId === filterSubject;
      const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesSubject && matchesPriority;
    });
  }, [state.tasks, searchQuery, filterStatus, filterSubject, filterPriority]);

  const stats = useMemo(() => {
    const completed = state.tasks.filter(t => t.status === 'completed').length;
    const progress = state.tasks.length === 0 ? 0 : Math.round((completed / state.tasks.length) * 100);
    return { completed, progress };
  }, [state.tasks]);

  if (!state.currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'subjects':
        return <SubjectsView subjects={state.subjects} tasks={state.tasks} onAddSubject={addSubject} onUpdateSubject={updateSubject} onDeleteSubject={deleteSubject} />;
      case 'calendar':
        return <CalendarView tasks={state.tasks} subjects={state.subjects} />;
      case 'progress':
        return <ProgressView tasks={state.tasks} subjects={state.subjects} onViewGrades={() => setCurrentView('grades')} />;
      case 'grades':
        return <GradesView grades={state.grades} subjects={state.subjects} onAddGrade={addGrade} onDeleteGrade={deleteGrade} />;
      case 'schedule':
        return <ScheduleView schedule={state.schedule} subjects={state.subjects} onAddEntry={addScheduleEntry} onDeleteEntry={deleteScheduleEntry} />;
      case 'attendance':
        return <AttendanceView attendance={state.attendance} subjects={state.subjects} onAddRecord={addAttendanceRecord} />;
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Main Hub</h2>
                <p className="text-slate-500 dark:text-slate-400">Welcome back, {state.currentUser.username}. Your productivity is at {stats.progress}% this week.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                 <button 
                  onClick={() => setCurrentView('attendance')}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <UserCheck size={18} className="text-emerald-500" />
                  Attendance
                </button>
                 <button 
                  onClick={() => setCurrentView('grades')}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                  <Percent size={18} className="text-indigo-500" />
                  Grades
                </button>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  <Plus size={20} />
                  Add Task
                </button>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Completed</p>
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.completed}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center">
                  <Clock size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pending</p>
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{state.tasks.filter(t => t.status !== 'completed').length}</p>
                </div>
              </div>
              <div 
                onClick={() => setCurrentView('grades')}
                className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6 cursor-pointer hover:border-indigo-500 group transition-all"
              >
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Award size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Efficiency</p>
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.progress}%</p>
                </div>
              </div>
            </section>

            <section className="flex flex-wrap items-center gap-6 bg-white/50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 w-full overflow-x-auto">
               <div className="flex flex-col gap-2 min-w-[140px]">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
                 <div className="flex items-center gap-2">
                   {['all', 'todo', 'in-progress', 'completed'].map((status) => (
                     <button
                       key={status}
                       onClick={() => setFilterStatus(status as any)}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black capitalize transition-all border tracking-wider whitespace-nowrap ${
                         filterStatus === status 
                         ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-lg' 
                         : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                       }`}
                     >
                       {status.replace('-', ' ')}
                     </button>
                   ))}
                 </div>
               </div>

               <div className="flex flex-col gap-2 min-w-[180px]">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                 <div className="relative">
                   <select 
                     className="w-full appearance-none bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 pr-10 font-bold text-[10px] text-slate-700 dark:text-slate-200 uppercase tracking-widest outline-none focus:border-indigo-500 transition-all cursor-pointer"
                     value={filterSubject}
                     onChange={(e) => setFilterSubject(e.target.value)}
                   >
                     <option value="all">All Subjects</option>
                     {state.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                   </select>
                   <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                 </div>
               </div>

               <div className="flex flex-col gap-2 min-w-[160px]">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                 <div className="relative">
                   <select 
                     className="w-full appearance-none bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 pr-10 font-bold text-[10px] text-slate-700 dark:text-slate-200 uppercase tracking-widest outline-none focus:border-indigo-500 transition-all cursor-pointer"
                     value={filterPriority}
                     onChange={(e) => setFilterPriority(e.target.value as any)}
                   >
                     <option value="all">All Priorities</option>
                     <option value="high">High</option>
                     <option value="medium">Medium</option>
                     <option value="low">Low</option>
                   </select>
                   <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                 </div>
               </div>

               {(filterStatus !== 'all' || filterSubject !== 'all' || filterPriority !== 'all') && (
                 <button 
                   onClick={() => {
                     setFilterStatus('all');
                     setFilterSubject('all');
                     setFilterPriority('all');
                   }}
                   className="mt-6 text-[10px] font-black text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 uppercase tracking-[0.2em] underline underline-offset-4 decoration-2"
                 >
                   Reset Filters
                 </button>
               )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    subject={state.subjects.find(s => s.id === task.subjectId)}
                    onUpdateStatus={updateTaskStatus}
                    onDelete={deleteTask}
                    onGetAIAction={handleAIBreakdown}
                    onLogGrade={handleLogTaskGrade}
                  />
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-700 rounded-[3rem]">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6">
                    <BookOpen size={40} className="opacity-20" />
                  </div>
                  <p className="font-black text-2xl dark:text-slate-400">Rest Day!</p>
                  <p className="text-sm font-medium">No tasks found matching your filters.</p>
                </div>
              )}
            </section>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row`}>
      <div className="md:hidden flex items-center justify-between p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-xl font-black text-slate-800 dark:text-white italic">Educare 2.o</h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-500 dark:text-slate-400">
          {isSidebarOpen ? <CloseIcon /> : <Menu />}
        </button>
      </div>

      <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} fixed md:sticky top-0 left-0 h-screen w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col z-[60] transition-transform duration-500`}>
        <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
          <div className="hidden md:flex items-center gap-4 mb-14">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-300 dark:shadow-none">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 dark:text-white italic leading-none">Educare 2.o</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2">Professional Hub</p>
            </div>
          </div>

          <nav className="space-y-3">
            <NavItem active={currentView === 'dashboard'} icon={<LayoutDashboard size={20} />} label="Main Hub" onClick={() => { setCurrentView('dashboard'); setIsSidebarOpen(false); }} />
            <NavItem active={currentView === 'schedule'} icon={<ListOrdered size={20} />} label="Timetable" onClick={() => { setCurrentView('schedule'); setIsSidebarOpen(false); }} />
            <NavItem active={currentView === 'attendance'} icon={<UserCheck size={20} />} label="Attendance" onClick={() => { setCurrentView('attendance'); setIsSidebarOpen(false); }} />
            <NavItem active={currentView === 'subjects'} icon={<BookOpen size={20} />} label="Directory" onClick={() => { setCurrentView('subjects'); setIsSidebarOpen(false); }} />
            <NavItem active={currentView === 'calendar'} icon={<CalendarIcon size={20} />} label="Planner" onClick={() => { setCurrentView('calendar'); setIsSidebarOpen(false); }} />
            <NavItem active={currentView === 'grades'} icon={<Percent size={20} />} label="Grades" onClick={() => { setCurrentView('grades'); setIsSidebarOpen(false); }} />
            <NavItem active={currentView === 'progress'} icon={<BarChart3 size={20} />} label="Analytics" onClick={() => { setCurrentView('progress'); setIsSidebarOpen(false); }} />
          </nav>
        </div>

        <div className="p-10 space-y-6 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex gap-2">
            <button 
              onClick={toggleDarkMode}
              className="flex-1 flex items-center justify-center p-5 bg-white dark:bg-slate-800 rounded-[2rem] text-slate-600 dark:text-slate-300 hover:scale-[1.02] transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              {state.darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center p-5 bg-white dark:bg-slate-800 rounded-[2rem] text-rose-500 hover:scale-[1.02] transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200/80 mb-3">Next Milestone</p>
            <div className="flex items-end justify-between mb-4">
              <span className="text-4xl font-black">{stats.progress}%</span>
              <span className="text-[10px] font-bold text-indigo-100/70">{stats.completed} Done</span>
            </div>
            <div className="w-full h-2.5 bg-indigo-950/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000" 
                style={{ width: `${stats.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
        <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 p-8 flex flex-col sm:flex-row items-center justify-between gap-8 sticky top-0 z-40">
          <div className="relative w-full sm:max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search subjects, grades, or tasks..."
              className="w-full pl-16 pr-8 py-5 bg-slate-100 dark:bg-slate-800 border-none focus:ring-4 focus:ring-indigo-500/10 rounded-3xl outline-none transition-all text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col items-end">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Session 2025</span>
               <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{state.currentUser.username}'s Vault</span>
             </div>
             <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 overflow-hidden shadow-xl ring-1 ring-slate-100 dark:ring-slate-700 flex items-center justify-center text-indigo-600 font-black">
               {state.currentUser.username[0].toUpperCase()}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 pb-32 custom-scrollbar">
          {renderContent()}
        </div>
      </main>

      {isAddModalOpen && (
        <AddTaskModal 
          subjects={state.subjects} 
          onClose={() => setIsAddModalOpen(false)} 
          onSave={addTask} 
        />
      )}

      {isAIPlannerOpen && (
        <AIPlannerView 
          content={aiSchedule} 
          onClose={() => setIsAIPlannerOpen(false)} 
          onRegenerate={handleGenerateSchedule}
          isLoading={isAILoading}
        />
      )}
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-5 font-black rounded-[2rem] transition-all group ${
      active 
      ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-100 dark:shadow-none' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-100 dark:hover:border-slate-700'
    }`}
  >
    <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{icon}</span>
    <span className="text-xs uppercase tracking-widest">{label}</span>
    {active && <div className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />}
  </button>
);

export default App;
