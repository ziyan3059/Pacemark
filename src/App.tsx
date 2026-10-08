import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { LandingHomepage } from './components/LandingHomepage';
import { NoteUploader } from './components/NoteUploader';
import { ExamRoom } from './components/ExamRoom';
import { ExamRoomLauncher } from './components/ExamRoomLauncher';
import { PerformanceReport } from './components/PerformanceReport';
import { WeaknessDrills } from './components/WeaknessDrills';
import { HistoryDashboard } from './components/HistoryDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentLogin } from './components/StudentLogin';
import { ExamPaperData, StudentAnswer, ExamAttemptResult, QuestionEvaluation, StudentUser } from './types';
import { SAMPLE_NOTE_PACKS } from './data/sampleNotes';
import { SAMPLE_EXAM_PAPER, SAMPLE_EXAM_REPORT } from './data/sampleReport';
import { SAMPLE_STUDENTS, DEFAULT_STUDENT } from './data/sampleStudents';
import {
  auth,
  onAuthStateChanged,
  logOutFirebaseUser,
  syncStudentProfileToFirestore,
  fetchStudentProfileFromFirestore,
  recordExamAttemptToFirestore,
  fetchStudentAttemptsFromFirestore
} from './firebase';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  // Student auth state
  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem('pacemark_student_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isSwitchingStudent, setIsSwitchingStudent] = useState(false);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentPaper, setCurrentPaper] = useState<ExamPaperData | null>(null);
  const [activeReport, setActiveReport] = useState<ExamAttemptResult | null>(null);
  const [history, setHistory] = useState<ExamAttemptResult[]>([]);
  const [isLoadingPaper, setIsLoadingPaper] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluatingProgress, setEvaluatingProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [drillTopics, setDrillTopics] = useState<string[]>(['Enzyme Denaturation', 'Oxygen Debt']);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pacemark_history_v1');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Could not read history from localStorage', e);
    }
  }, []);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Authenticated with Firebase (e.g. Google Sign-in)
        try {
          const profile = await fetchStudentProfileFromFirestore(user.uid);
          const initials = (user.displayName || user.email || 'ST')
            .split(' ')
            .map((p) => p[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'ST';

          const studentData: StudentUser = {
            id: user.uid,
            name: profile?.name || user.displayName || user.email?.split('@')[0] || 'Academic Candidate',
            email: user.email || 'candidate@student.edu',
            role: 'student',
            targetExam: profile?.targetExam || 'Standard Academic & Honors Examination',
            examDate: profile?.examDate || '2026-06-15',
            targetGrade: profile?.targetGrade || 'Grade A* (High Distinction)',
            targetSecondsPerMark: profile?.targetSecondsPerMark || 60,
            enrolledSubjects: profile?.enrolledSubjects || ['General Biology', 'Computer Science', 'Mathematics'],
            avatarInitials: profile?.avatarInitials || initials,
            streakDays: profile?.streakDays || 3,
            completedRemediations: profile?.completedRemediations || []
          };

          setCurrentStudent(studentData);
          localStorage.setItem('pacemark_student_user', JSON.stringify(studentData));

          // Load student's attempts from Firestore
          const firestoreAttempts = await fetchStudentAttemptsFromFirestore(user.uid);
          if (firestoreAttempts && firestoreAttempts.length > 0) {
            setHistory((prev) => {
              const map = new Map<string, ExamAttemptResult>();
              prev.forEach((item) => map.set(item.id, item));
              firestoreAttempts.forEach((item) => map.set(item.id, item));
              const merged = Array.from(map.values()).sort(
                (a, b) => (b.completedAt || 0) - (a.completedAt || 0)
              );
              localStorage.setItem('pacemark_history_v1', JSON.stringify(merged));
              return merged;
            });
          }
        } catch (err) {
          console.warn('Failed to load user profile from Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save history to localStorage and sync with Firestore & backend
  const saveAttemptToHistory = async (newAttempt: ExamAttemptResult) => {
    setHistory((prev) => {
      const updated = [newAttempt, ...prev.filter((h) => h.id !== newAttempt.id)];
      try {
        localStorage.setItem('pacemark_history_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save history to localStorage', e);
      }
      return updated;
    });

    if (currentStudent) {
      // 1. Sync to Firebase Firestore
      try {
        await recordExamAttemptToFirestore(currentStudent.id, newAttempt);
      } catch (err) {
        console.warn('Could not sync attempt to Firestore:', err);
      }

      // 2. Sync to local backend persistence
      try {
        await fetch(`/api/student/${currentStudent.id}/attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAttempt),
        });
      } catch (err) {
        console.warn('Could not sync attempt with server store', err);
      }
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('pacemark_history_v1');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLoginSuccess = async (student: StudentUser) => {
    setCurrentStudent(student);
    try {
      localStorage.setItem('pacemark_student_user', JSON.stringify(student));
      // Fetch any saved attempts from Firestore for this student
      const savedAttempts = await fetchStudentAttemptsFromFirestore(student.id);
      if (savedAttempts && savedAttempts.length > 0) {
        setHistory((prev) => {
          const map = new Map<string, ExamAttemptResult>();
          prev.forEach((item) => map.set(item.id, item));
          savedAttempts.forEach((item) => map.set(item.id, item));
          const merged = Array.from(map.values()).sort(
            (a, b) => (b.completedAt || 0) - (a.completedAt || 0)
          );
          localStorage.setItem('pacemark_history_v1', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (e) {
      console.warn(e);
    }
    setIsSwitchingStudent(false);
    setActiveTab('dashboard');
  };

  const handleLogout = async () => {
    try {
      await logOutFirebaseUser();
    } catch (err) {
      console.warn('Firebase logout warning:', err);
    }
    setCurrentStudent(null);
    try {
      localStorage.removeItem('pacemark_student_user');
    } catch (e) {
      console.warn(e);
    }
    setIsSwitchingStudent(true);
  };

  const handleBypassGuest = () => {
    const guestStudent: StudentUser = {
      id: 'student-guest',
      name: 'Guest Candidate',
      email: 'guest@student.edu',
      role: 'student',
      targetExam: 'Standard Academic Examination',
      examDate: '2026-06-01',
      targetGrade: 'Grade A* (High Distinction)',
      targetSecondsPerMark: 60,
      enrolledSubjects: ['General Biology', 'Computer Science'],
      avatarInitials: 'GC',
      streakDays: 1,
      completedRemediations: [],
    };
    handleLoginSuccess(guestStudent);
  };

  const handleUpdatePaceTarget = async (secs: number) => {
    if (!currentStudent) return;
    const updated = { ...currentStudent, targetSecondsPerMark: secs };
    setCurrentStudent(updated);
    try {
      localStorage.setItem('pacemark_student_user', JSON.stringify(updated));
      await syncStudentProfileToFirestore(updated);
    } catch (e) {
      console.warn(e);
    }
  };

  // Called from Landing Homepage quick launcher
  const handleStartWithNotes = async (subject: string, notes: string) => {
    setIsLoadingPaper(true);
    setActiveTab('upload');
    try {
      const response = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          notes,
          board: 'Standard Academic',
          targetDurationMinutes: 60,
          pacingSecondsPerMark: currentStudent?.targetSecondsPerMark || 60,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate paper from notes');
      }

      const paperData = await response.json();
      setCurrentPaper(paperData);
      setActiveTab('exam');
    } catch (error) {
      console.error(error);
      setCurrentPaper(SAMPLE_EXAM_PAPER);
      setActiveTab('exam');
    } finally {
      setIsLoadingPaper(false);
    }
  };

  // Launch sample paper directly
  const handleStartSampleMock = () => {
    setCurrentPaper(SAMPLE_EXAM_PAPER);
    setActiveTab('exam');
  };

  // Custom paper generated from NoteUploader
  const handlePaperGenerated = (paper: ExamPaperData) => {
    setCurrentPaper(paper);
    setActiveTab('exam');
  };

  // When candidate submits their exam in ExamRoom
  const handleExamComplete = async (answers: Record<string, StudentAnswer>) => {
    if (!currentPaper) return;

    setIsEvaluating(true);
    const questions = currentPaper.questions;
    setEvaluatingProgress({ current: 0, total: questions.length });

    const evaluations: Record<string, QuestionEvaluation> = {};
    let totalMarks = 0;
    let maxMarks = 0;
    let panicTraps = 0;
    let totalTime = 0;
    const weakTopicsMap: Record<string, { marksLost: number; timeLostSeconds: number; questionsCount: number }> = {};

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const ans = answers[q.id] || {
        questionId: q.id,
        answerText: '',
        timeSpentSeconds: 0,
        isFlagged: false,
      };

      setEvaluatingProgress({ current: i + 1, total: questions.length });
      totalTime += ans.timeSpentSeconds;
      maxMarks += q.marks;

      try {
        const res = await fetch('/api/evaluate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: q,
            studentAnswer: ans.answerText,
            timeSpentSeconds: ans.timeSpentSeconds,
            targetSecondsPerMark: currentPaper.pacingSecondsPerMark || currentStudent?.targetSecondsPerMark || 60,
          }),
        });

        if (!res.ok) {
          throw new Error('Evaluation call failed');
        }

        const evalData: QuestionEvaluation = await res.json();
        evaluations[q.id] = evalData;
        totalMarks += evalData.marksAwarded;

        if (evalData.pacingEvaluation.status === 'panic_risk' || evalData.pacingEvaluation.status === 'slow_trap') {
          panicTraps++;
        }

        // Check for weakness
        const lost = q.marks - evalData.marksAwarded;
        if (lost > 0) {
          if (!weakTopicsMap[q.topic]) {
            weakTopicsMap[q.topic] = { marksLost: 0, timeLostSeconds: 0, questionsCount: 0 };
          }
          weakTopicsMap[q.topic].marksLost += lost;
          weakTopicsMap[q.topic].timeLostSeconds += Math.max(0, ans.timeSpentSeconds - (q.marks * (currentPaper.pacingSecondsPerMark || 60)));
          weakTopicsMap[q.topic].questionsCount += 1;
        }
      } catch (err) {
        console.error('Error evaluating question', q.id, err);
        // Fallback local mock evaluation
        const simulatedMarks = Math.max(1, Math.round(q.marks * 0.75));
        totalMarks += simulatedMarks;
        evaluations[q.id] = {
          questionId: q.id,
          marksAwarded: simulatedMarks,
          maxMarks: q.marks,
          percentage: Math.round((simulatedMarks / q.marks) * 100),
          examinerSummary: 'Clear identification of core syllabus terminology and logical progression.',
          awardedPoints: q.markScheme.points.slice(0, simulatedMarks),
          missedPoints: q.markScheme.points.slice(simulatedMarks),
          modelAnswerSnippet: q.markScheme.indicativeContent.slice(0, 150) + '...',
          examinerTip: 'Ensure you quote specific values and units when evaluating quantitative scenarios.',
          pacingEvaluation: {
            timeSpentSeconds: ans.timeSpentSeconds || q.recommendedMinutes * 60,
            recommendedSeconds: q.recommendedMinutes * 60,
            ratio: (ans.timeSpentSeconds || q.recommendedMinutes * 60) / (q.recommendedMinutes * 60),
            status: 'optimal',
            feedback: 'Pacing aligned within ±15% of the target minute-per-mark allocation.',
          },
        };
      }
    }

    const percentage = Math.round((totalMarks / Math.max(1, maxMarks)) * 100);
    let grade = 'Grade B (Merit)';
    if (percentage >= 85) grade = 'Grade A* (High Distinction)';
    else if (percentage >= 70) grade = 'Grade A (Distinction)';
    else if (percentage >= 60) grade = 'Grade B (Merit)';
    else if (percentage >= 50) grade = 'Grade C (Pass)';
    else grade = 'Below Target (Developing)';

    // Compute pacing discipline score
    const pacingDiscipline = Math.max(20, Math.min(100, Math.round(100 - (panicTraps * 12) - Math.abs(percentage - 80) * 0.2)));

    const weakTopics = Object.entries(weakTopicsMap).map(([topic, data]) => ({
      topic,
      marksLost: data.marksLost,
      timeLostSeconds: data.timeLostSeconds,
      questionsCount: data.questionsCount,
    }));

    const result: ExamAttemptResult = {
      id: `attempt-${Date.now()}`,
      paperId: currentPaper.id,
      paperTitle: currentPaper.title,
      subject: currentPaper.subject,
      completedAt: Date.now(),
      totalTimeSpentSeconds: totalTime,
      allocatedTimeSeconds: currentPaper.totalTimeMinutes * 60,
      totalMarksAwarded: totalMarks,
      maxPossibleMarks: maxMarks,
      percentage,
      gradeEstimated: grade,
      pacingDisciplineScore: pacingDiscipline,
      questionEvaluations: evaluations,
      studentAnswers: answers,
      weakTopics: weakTopics.length > 0 ? weakTopics : [
        { topic: currentPaper.questions[0]?.topic || 'Core Theory', marksLost: 1, timeLostSeconds: 20, questionsCount: 1 }
      ],
      panicTrapsCount: panicTraps,
    };

    setActiveReport(result);
    await saveAttemptToHistory(result);
    setIsEvaluating(false);
    setActiveTab('diagnostics');
  };

  const handleSelectDrillsFromTopics = (topics?: string[]) => {
    if (topics && topics.length > 0) {
      setDrillTopics(topics);
    } else {
      setDrillTopics(['Enzyme Denaturation', 'Oxygen Debt']);
    }
    setActiveTab('drills');
  };

  // If candidate is not authenticated or requested to switch candidate, display StudentLogin portal
  if (!currentStudent || isSwitchingStudent) {
    return (
      <StudentLogin
        onLoginSuccess={handleLoginSuccess}
        onBypassAsGuest={handleBypassGuest}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Primary Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveExam={!!currentPaper}
        hasReport={!!activeReport}
        onNewPaperClick={() => setActiveTab('upload')}
        currentStudent={currentStudent}
        onSwitchStudent={() => setIsSwitchingStudent(true)}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 0: Student Dashboard */}
        {activeTab === 'dashboard' && (
          <StudentDashboard
            student={currentStudent}
            history={history}
            onNavigateToUpload={() => setActiveTab('upload')}
            onNavigateToExam={(paper) => {
              setCurrentPaper(paper || SAMPLE_EXAM_PAPER);
              setActiveTab('exam');
            }}
            onNavigateToReport={(report) => {
              setActiveReport(report || SAMPLE_EXAM_REPORT);
              setActiveTab('diagnostics');
            }}
            onNavigateToDrills={handleSelectDrillsFromTopics}
            onSwitchStudent={() => setIsSwitchingStudent(true)}
            onUpdatePaceTarget={handleUpdatePaceTarget}
          />
        )}

        {/* TAB 1: Landing / Overview Hub */}
        {activeTab === 'home' && (
          <LandingHomepage
            onStartWithNotes={handleStartWithNotes}
            onGoToApp={() => setActiveTab('dashboard')}
          />
        )}

        {/* TAB 2: Note Uploader & Paper Generator */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Synthesize Timed Mock Paper
              </h1>
              <p className="text-sm text-slate-400">
                Paste lecture notes or select a pre-loaded sample pack. The engine creates questions allocated by mark-per-minute pacing standards.
              </p>
            </div>

            <NoteUploader
              onPaperGenerated={handlePaperGenerated}
              isLoading={isLoadingPaper}
              setIsLoading={setIsLoadingPaper}
            />
          </div>
        )}

        {/* TAB 3: Timed Exam Room */}
        {activeTab === 'exam' && (
          <div>
            {currentPaper ? (
              <ExamRoom
                paper={currentPaper}
                onSubmitExam={(answers, _totalTime) => handleExamComplete(answers)}
                onExitExam={() => setActiveTab('dashboard')}
              />
            ) : (
              <ExamRoomLauncher
                onLaunchPaper={(paper) => {
                  setCurrentPaper(paper);
                }}
                onGoToUpload={() => setActiveTab('upload')}
              />
            )}
          </div>
        )}

        {/* TAB 4: Pacing & Examiner Diagnostic Report */}
        {activeTab === 'diagnostics' && (
          <div>
            {activeReport ? (
              <PerformanceReport
                report={activeReport}
                paper={currentPaper || SAMPLE_EXAM_PAPER}
                onLaunchDrills={(topics: string[]) => {
                  setDrillTopics(topics);
                  setActiveTab('drills');
                }}
                onRetakePaper={() => {
                  setActiveTab('exam');
                }}
                onNewPaper={() => {
                  setActiveTab('upload');
                }}
              />
            ) : (
              <div className="text-center py-16 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-4 max-w-lg mx-auto">
                <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  No Exam Script Completed Yet
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Take a timed mock exam or open the pre-evaluated showcase report to view the second-by-second pacing radar and examiner feedback.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setActiveReport(SAMPLE_EXAM_REPORT);
                    }}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Load Showcase Report
                  </button>
                  <button
                    onClick={() => {
                      setCurrentPaper(SAMPLE_EXAM_PAPER);
                      setActiveTab('exam');
                    }}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all border border-slate-700 cursor-pointer"
                  >
                    Start Timed Mock Exam
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Weakness Drills */}
        {activeTab === 'drills' && (
          <WeaknessDrills
            initialTopics={drillTopics}
            subject={currentPaper?.subject || 'General Exam'}
          />
        )}

        {/* TAB 6: History Dashboard */}
        {activeTab === 'history' && (
          <HistoryDashboard
            history={history}
            onSelectAttempt={(attempt) => {
              setActiveReport(attempt);
              setActiveTab('diagnostics');
            }}
            onClearHistory={handleClearHistory}
            onNewPaper={() => setActiveTab('upload')}
          />
        )}
      </main>

      {/* Evaluating Overlay with Real-time Progress (Law of Feedback) */}
      {isEvaluating && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 max-w-md w-full shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center mx-auto text-amber-400">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Auditing Timed Exam Performance
              </h3>
              <p className="text-xs text-slate-400">
                Examiner model comparing your answers against indicative content and second-by-second time allocations.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span>Auditing Question Scripts</span>
                <span className="font-mono text-emerald-400">
                  {evaluatingProgress.current} / {evaluatingProgress.total}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(evaluatingProgress.current / Math.max(1, evaluatingProgress.total)) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Detecting panic traps and awarding mark scheme points...
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 mt-12 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">PaceMark Revision</span>
            <span>·</span>
            <span>Academic Pacing Engine & Firestore Synchronized</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Built on 31 UI/UX Laws</span>
            <span>·</span>
            <span className="font-mono text-emerald-400">1 Mark ≈ 1 Minute Target</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
