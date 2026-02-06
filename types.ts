
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'completed';
export type TaskType = 'homework' | 'test' | 'exam';
export type AppView = 'dashboard' | 'subjects' | 'calendar' | 'progress' | 'grades' | 'schedule' | 'attendance';
export type AssessmentType = 'Assessment' | 'Class Engagement' | 'Homework';
export type GradingPeriod = 'VP-1' | 'VP-2';
export type AttendanceValue = 'Present' | 'Absent' | 'Tardy' | 'Excused';

export interface User {
  username: string;
  password?: string; // Stored in plain text for this local implementation
  avatar?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  teacher?: string;
  room?: string;
  credits?: number;
}

export interface HomeworkTask {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string;
  status: Status;
  priority: Priority;
  description: string;
  taskType: TaskType;
  aiBreakdown?: string[];
  estimatedMinutes?: number;
}

export interface Grade {
  id: string;
  subjectId: string;
  title: string;
  score: number; // percentage 0-100
  weight: number; // e.g., 0.2 for 20%
  type: AssessmentType;
  period: GradingPeriod;
  date: string;
}

export interface AttendanceRecord {
  id: string;
  subjectId: string;
  date: string;
  period: string;
  value: AttendanceValue;
}

export interface ScheduleEntry {
  id: string;
  subjectId: string;
  day: number; // 1-5 (Mon-Fri)
  startTime: string; // "09:00"
  endTime: string; // "10:30"
  room: string;
}

export interface AppState {
  tasks: HomeworkTask[];
  subjects: Subject[];
  grades: Grade[];
  schedule: ScheduleEntry[];
  attendance: AttendanceRecord[];
  darkMode: boolean;
  currentUser: User | null;
}
