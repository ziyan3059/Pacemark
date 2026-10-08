import { StudentUser } from '../types';

export const SAMPLE_STUDENTS: StudentUser[] = [
  {
    id: 'student-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@student.edu',
    role: 'student',
    targetExam: 'Standard Academic & Pre-Med Admissions',
    examDate: '2026-05-18',
    targetGrade: 'Grade A* (High Distinction)',
    targetSecondsPerMark: 60,
    enrolledSubjects: ['General Biology', 'Chemistry', 'Mathematics'],
    avatarInitials: 'SJ',
    streakDays: 7,
    completedRemediations: ['Enzyme Denaturation mechanisms', 'Active transport vs facilitated diffusion'],
  },
  {
    id: 'student-marcus',
    name: 'Marcus Vance',
    email: 'marcus.vance@student.edu',
    role: 'student',
    targetExam: 'College & AP Computer Science',
    examDate: '2026-05-24',
    targetGrade: 'Grade A* (High Distinction)',
    targetSecondsPerMark: 55,
    enrolledSubjects: ['Computer Science', 'Discrete Mathematics', 'Physics'],
    avatarInitials: 'MV',
    streakDays: 4,
    completedRemediations: ['Bubble sort vs Merge sort complexity proofs'],
  },
  {
    id: 'student-elena',
    name: 'Elena Rostova',
    email: 'elena.rostova@student.edu',
    role: 'student',
    targetExam: 'Academic Ethics & Legal Studies',
    examDate: '2026-06-02',
    targetGrade: 'Grade A (Distinction)',
    targetSecondsPerMark: 65,
    enrolledSubjects: ['Ethics & Philosophy', 'Legal Studies', 'World History'],
    avatarInitials: 'ER',
    streakDays: 12,
    completedRemediations: ['Utilitarianism vs Deontology comparative evaluation'],
  },
];

export const DEFAULT_STUDENT: StudentUser = SAMPLE_STUDENTS[0];
