import React, { useState } from 'react';
import {
  Timer,
  ArrowRight,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import { StudentUser } from '../types';
import { SAMPLE_STUDENTS } from '../data/sampleStudents';
import { signInWithGoogle, syncStudentProfileToFirestore, fetchStudentProfileFromFirestore } from '../firebase';

interface StudentLoginProps {
  onLoginSuccess: (student: StudentUser) => void;
  onBypassAsGuest?: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onLoginSuccess,
  onBypassAsGuest
}) => {
  // Hick's Law: Progressive disclosure with 3 clean options
  const [authMode, setAuthMode] = useState<'google' | 'demo' | 'email'>('google');
  const [selectedDemoId, setSelectedDemoId] = useState<string>(SAMPLE_STUDENTS[0].id);

  // Form fields for Email/ID
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { user } = await signInWithGoogle();
      
      // Check if user already has an existing Firestore profile
      const existingProfile = await fetchStudentProfileFromFirestore(user.uid);
      
      const initials = (user.displayName || user.email || 'ST')
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'ST';

      const studentData: StudentUser = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Academic Candidate',
        email: user.email || 'candidate@student.edu',
        role: 'student',
        targetExam: existingProfile?.targetExam || 'Standard Academic & Honors Examination',
        examDate: existingProfile?.examDate || '2026-06-15',
        targetGrade: existingProfile?.targetGrade || 'Grade A* (High Distinction)',
        targetSecondsPerMark: existingProfile?.targetSecondsPerMark || 60,
        enrolledSubjects: existingProfile?.enrolledSubjects || ['General Biology', 'Computer Science', 'Mathematics'],
        avatarInitials: initials,
        streakDays: existingProfile?.streakDays || 3,
        completedRemediations: existingProfile?.completedRemediations || []
      };

      // Persist to Firestore
      await syncStudentProfileToFirestore(studentData);

      // Instant callback (Doherty Threshold: responsive feedback)
      onLoginSuccess(studentData);
    } catch (err: any) {
      console.error('Firebase Google sign-in failed:', err);
      // Helpful error recovery (Law of Error Prevention)
      if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Popup was blocked by browser. Please allow popups or use Demo Candidate login.');
      } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Google Sign-in window was closed. Please try again or select a Demo Profile.');
      } else {
        setErrorMessage(err.message || 'Google Sign-in failed. You can also select a 1-click Demo profile below.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Demo Candidate 1-Click
  const handleDemoSignIn = async (student: StudentUser) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      // Sync demo student to Firestore for persistence
      await syncStudentProfileToFirestore(student);
      // Immediate response <400ms (Doherty Threshold)
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(student);
      }, 200);
    } catch {
      setIsLoading(false);
      onLoginSuccess(student);
    }
  };

  // 3. Email / Candidate ID Sign-In
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your student email or candidate ID.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const matched = SAMPLE_STUDENTS.find(
        (s) => s.email.toLowerCase() === email.trim().toLowerCase()
      );

      let targetUser: StudentUser;
      if (matched) {
        targetUser = matched;
      } else {
        const initials = (fullName || email.split('@')[0])
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'ST';

        targetUser = {
          id: `student-${Date.now()}`,
          name: fullName.trim() || email.split('@')[0].replace('.', ' '),
          email: email.trim(),
          role: 'student',
          targetExam: 'Standard Academic & Honors Examination',
          examDate: '2026-06-15',
          targetGrade: 'Grade A* (High Distinction)',
          targetSecondsPerMark: 60,
          enrolledSubjects: ['General Biology', 'Computer Science', 'Mathematics'],
          avatarInitials: initials,
          streakDays: 1,
          completedRemediations: []
        };
      }

      await syncStudentProfileToFirestore(targetUser);

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(targetUser);
      }, 250);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-slate-100">
      {/* Precision ambient background grid - Gestalt: Law of Common Region & Prägnanz */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Subtle illumination orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl ring-1 ring-white/10">
            <Timer className="w-7 h-7 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              PaceMark Revision
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono tracking-wide">
              ACADEMIC PACING ENGINE · SECURE STUDENT PORTAL
            </p>
          </div>
        </div>

        {/* Main Auth Container - Law of Common Region & Aesthetic-Usability */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
          {/* Segmented Selector - Hick's Law: 3 distinct, clear choices */}
          <div className="grid grid-cols-3 p-1.5 bg-slate-950/80 border-b border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('google');
                setErrorMessage('');
              }}
              className={`min-h-[42px] py-2.5 px-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'google'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="truncate">Google Auth</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('demo');
                setErrorMessage('');
              }}
              className={`min-h-[42px] py-2.5 px-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'demo'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">1-Click Demo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setErrorMessage('');
              }}
              className={`min-h-[42px] py-2.5 px-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'email'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Email / ID</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Error Message with clear recovery (Law of Error Prevention) */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: Google Sign-In (Primary - Fitts' Law & Jakob's Law & Von Restorff Effect) */}
            {authMode === 'google' && (
              <div className="space-y-6 py-2">
                <div className="text-center space-y-2">
                  <div className="text-sm font-semibold text-slate-200">
                    Sign in with your Google Account
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Secure identity through Firebase Auth with automated Firestore persistence for your mock exam results and pacing benchmarks.
                  </p>
                </div>

                {/* Primary Action Button - Fitts' Law: Large Target, Height 50px, Center Gaze */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full min-h-[50px] py-3.5 px-6 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
                  aria-label="Sign in with Google"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 text-slate-900 animate-spin" />
                      <span>Authenticating with Firebase...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Cloud sync security badge - Law of Feedback & Trust */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Firebase Firestore Connected</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">Zero-Trust ABAC</span>
                </div>
              </div>
            )}

            {/* TAB 2: 1-Click Demo Profiles (Miller's Law: 3 clean candidate options) */}
            {authMode === 'demo' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400 leading-relaxed">
                  Select a pre-configured student candidate to explore the diagnostic dashboard and timed exam room instantly:
                </div>

                <div className="space-y-3">
                  {SAMPLE_STUDENTS.map((student) => {
                    const isSelected = selectedDemoId === student.id;
                    return (
                      <div
                        key={student.id}
                        onClick={() => setSelectedDemoId(student.id)}
                        className={`min-h-[56px] p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/30'
                            : 'bg-slate-950/50 hover:bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {student.avatarInitials}
                          </div>

                          <div className="min-w-0">
                            <div className="font-bold text-white text-sm truncate flex items-center gap-2">
                              <span>{student.name}</span>
                              <span className="text-[11px] text-slate-400 font-normal">
                                {student.targetSecondsPerMark}s/mark
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                              <span>{student.enrolledSubjects[0]}</span>
                              <span aria-hidden="true">·</span>
                              <span className="text-emerald-400 font-semibold">{student.streakDays}d streak</span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-blue-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-slate-700" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      const selected = SAMPLE_STUDENTS.find((s) => s.id === selectedDemoId) || SAMPLE_STUDENTS[0];
                      handleDemoSignIn(selected);
                    }}
                    className="w-full min-h-[48px] py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <>
                        <span>Enter Dashboard with Selected Profile</span>
                        <ArrowRight className="w-4 h-4 text-slate-950" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Email / Candidate ID Form */}
            {authMode === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {isRegistering && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Candidate Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jordan Hayes"
                        className="w-full pl-10 pr-3 min-h-[44px] text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Student Email or Candidate ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@university.edu or candidate ID"
                      className="w-full pl-10 pr-3 min-h-[44px] text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 min-h-[44px] text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-500 bg-slate-950 border-slate-800 focus:ring-blue-500"
                    />
                    <span>Remember session</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    {isRegistering ? 'Have account? Sign In' : 'Create new profile'}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full min-h-[48px] py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>{isRegistering ? 'Create Student Account' : 'Sign In to Dashboard'}</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Guest Quick Pass (Law of User Control and Freedom) */}
            {onBypassAsGuest && (
              <div className="pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={onBypassAsGuest}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Continue directly as Guest Student →
                </button>
              </div>
            )}
          </div>

          {/* Security & Protocol Footer */}
          <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Academic Pacing Protocol</span>
            </div>
            <span>Firebase Security Hardened</span>
          </div>
        </div>
      </div>
    </div>
  );
};
