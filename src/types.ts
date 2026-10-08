export interface MarkSchemeData {
  points: string[];
  indicativeContent: string;
  levelGuidance?: string;
}

export interface QuestionData {
  id: string;
  number: string;
  topic: string;
  marks: number;
  commandWord: string;
  questionText: string;
  contextOrScenario?: string;
  recommendedMinutes: number;
  markScheme: MarkSchemeData;
}

export interface ExamPaperData {
  id: string;
  title: string;
  subject: string;
  examBoard?: 'Standard Academic' | 'College / AP' | 'University' | 'Professional' | 'General' | string;
  totalMarks: number;
  totalTimeMinutes: number;
  pacingSecondsPerMark: number;
  sourceType: 'user_notes' | 'sample_pack';
  sourceSnippet?: string;
  createdAt: number;
  questions: QuestionData[];
}

export interface StudentAnswer {
  questionId: string;
  answerText: string;
  timeSpentSeconds: number;
  isFlagged: boolean;
  notesScratchpad?: string;
}

export interface PacingDiagnostic {
  timeSpentSeconds: number;
  recommendedSeconds: number;
  ratio: number;
  status: 'optimal' | 'rushed' | 'slow_trap' | 'panic_risk';
  feedback: string;
}

export interface QuestionEvaluation {
  questionId: string;
  marksAwarded: number;
  maxMarks: number;
  percentage: number;
  examinerSummary: string;
  awardedPoints: string[];
  missedPoints: string[];
  modelAnswerSnippet: string;
  examinerTip: string;
  pacingEvaluation: PacingDiagnostic;
}

export interface ExamAttemptResult {
  id: string;
  paperId: string;
  paperTitle: string;
  subject: string;
  completedAt: number;
  totalTimeSpentSeconds: number;
  allocatedTimeSeconds: number;
  totalMarksAwarded: number;
  maxPossibleMarks: number;
  percentage: number;
  gradeEstimated: string;
  pacingDisciplineScore: number; // 0 - 100
  questionEvaluations: Record<string, QuestionEvaluation>;
  studentAnswers: Record<string, StudentAnswer>;
  weakTopics: Array<{
    topic: string;
    marksLost: number;
    timeLostSeconds: number;
    questionsCount: number;
  }>;
  panicTrapsCount: number;
}

export interface DrillItem {
  id: string;
  topic: string;
  marks: number;
  recommendedMinutes: number;
  questionText: string;
  markScheme: string[];
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'educator';
  targetExam: string;
  examDate: string;
  targetGrade: string;
  targetSecondsPerMark: number;
  enrolledSubjects: string[];
  avatarInitials: string;
  streakDays: number;
  completedRemediations: string[];
}
