
import React from 'react';
import { Subject } from './types';

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', color: 'bg-blue-600', teacher: 'Prof. Gauss' },
  { id: '2', name: 'English', color: 'bg-sky-500', teacher: 'Ms. Austen' },
  { id: '3', name: 'Physics', color: 'bg-indigo-600', teacher: 'Dr. Newton' },
  { id: '4', name: 'Chemistry', color: 'bg-emerald-400', teacher: 'Prof. Mendeleev' },
  { id: '5', name: 'Biology', color: 'bg-lime-500', teacher: 'Dr. Darwin' },
  { id: '6', name: 'Albanian', color: 'bg-red-700', teacher: 'Mjeshtër Hoxha' },
  { id: '7', name: 'Turkish', color: 'bg-rose-600', teacher: 'Öğretmen Yılmaz' },
  { id: '8', name: 'German', color: 'bg-yellow-400', teacher: 'Frau Schmidt' },
  { id: '9', name: 'History', color: 'bg-amber-600', teacher: 'Mr. Herodotus' },
  { id: '10', name: 'Geography', color: 'bg-green-600', teacher: 'Ms. Magellan' },
  { id: '11', name: 'Art', color: 'bg-fuchsia-500', teacher: 'Mr. Da Vinci' },
  { id: '12', name: 'Music', color: 'bg-violet-500', teacher: 'Ms. Mozart' },
  { id: '13', name: 'PE', color: 'bg-orange-500', teacher: 'Coach Jordan' },
  { id: '14', name: 'Citizenship', color: 'bg-cyan-600', teacher: 'Mr. Locke' },
  { id: '15', name: 'Character Education', color: 'bg-teal-600', teacher: 'Ms. Socrates' },
  { id: '16', name: 'Foxton Readers', color: 'bg-rose-800', teacher: 'Library Dept' },
];

export const PRIORITY_COLORS = {
  low: 'bg-slate-100 text-slate-600 border-slate-200',
  medium: 'bg-orange-50 text-orange-600 border-orange-200',
  high: 'bg-rose-50 text-rose-600 border-rose-200',
};

export const STATUS_LABELS = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};
