import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Timer,
  AlertTriangle,
  Flag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  Edit3,
  Bookmark,
  ShieldAlert,
  Info
} from 'lucide-react';
import { ExamPaperData, QuestionData, StudentAnswer } from '../types';

interface ExamRoomProps {
  paper: ExamPaperData;
  onSubmitExam: (answers: Record<string, StudentAnswer>, totalTimeSpentSeconds: number) => void;
  onExitExam: () => void;
}

export const ExamRoom: React.FC<ExamRoomProps> = ({
  paper,
  onSubmitExam,
  onExitExam,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Overall Exam Timer (countdown in seconds)
  const totalAllocatedSeconds = paper.totalTimeMinutes * 60;
  const [examSecondsRemaining, setExamSecondsRemaining] = useState(totalAllocatedSeconds);
  const [isExamPaused, setIsExamPaused] = useState(false);

  // Per-Question Timers (records accumulated seconds spent on each question)
  const [questionTimers, setQuestionTimers] = useState<Record<string, number>>({});

  const currentQ = paper.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQ.id]?.answerText || '';
  const currentScratchpad = answers[currentQ.id]?.notesScratchpad || '';
  const isCurrentFlagged = !!answers[currentQ.id]?.isFlagged;
  const currentQSeconds = questionTimers[currentQ.id] || 0;

  // Recommended time for current question in seconds
  const currentRecommendedSeconds = Math.round(currentQ.recommendedMinutes * 60);
  const currentPacingRatio = currentRecommendedSeconds > 0 ? currentQSeconds / currentRecommendedSeconds : 1;

  // Interval timer tick
  useEffect(() => {
    if (isExamPaused || examSecondsRemaining <= 0) return;

    const interval = setInterval(() => {
      // 1. Decrement overall exam timer
      setExamSecondsRemaining((prev) => Math.max(0, prev - 1));

      // 2. Increment active question timer
      setQuestionTimers((prev) => ({
        ...prev,
        [currentQ.id]: (prev[currentQ.id] || 0) + 1,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQ.id, isExamPaused, examSecondsRemaining]);

  // Handle answering
  const handleAnswerChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        answerText: text,
        timeSpentSeconds: questionTimers[currentQ.id] || 0,
        isFlagged: prev[currentQ.id]?.isFlagged || false,
        notesScratchpad: prev[currentQ.id]?.notesScratchpad || '',
      },
    }));
  };

  // Handle scratchpad change
  const handleScratchpadChange = (text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        answerText: prev[currentQ.id]?.answerText || '',
        timeSpentSeconds: questionTimers[currentQ.id] || 0,
        isFlagged: prev[currentQ.id]?.isFlagged || false,
        notesScratchpad: text,
      },
    }));
  };

  // Toggle flag
  const toggleFlag = () => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        answerText: prev[currentQ.id]?.answerText || '',
        timeSpentSeconds: questionTimers[currentQ.id] || 0,
        isFlagged: !prev[currentQ.id]?.isFlagged,
        notesScratchpad: prev[currentQ.id]?.notesScratchpad || '',
      },
    }));
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const handleFinalSubmit = () => {
    // Update final times
    const totalSpent = totalAllocatedSeconds - examSecondsRemaining;
    const finalAnswers: Record<string, StudentAnswer> = {};

    paper.questions.forEach((q) => {
      finalAnswers[q.id] = {
        questionId: q.id,
        answerText: answers[q.id]?.answerText || '',
        timeSpentSeconds: questionTimers[q.id] || 0,
        isFlagged: !!answers[q.id]?.isFlagged,
        notesScratchpad: answers[q.id]?.notesScratchpad || '',
      };
    });

    onSubmitExam(finalAnswers, totalSpent);
  };

  // Answered stats
  const answeredCount = paper.questions.filter((q) => (answers[q.id]?.answerText || '').trim().length > 0).length;
  const flaggedCount = paper.questions.filter((q) => !!answers[q.id]?.isFlagged).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Top Exam HUD */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Exam Title & Subject */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>{paper.subject}</span>
                <span>·</span>
                <span className="font-semibold text-slate-700">{paper.examBoard || 'Standard Academic'}</span>
                <span>·</span>
                <span>{paper.totalMarks} Marks Total</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {paper.title}
              </h2>
            </div>
          </div>

          {/* Timing HUD: Overall Countdown + Active Question Stopwatch */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Active Question Stopwatch */}
            <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
              currentPacingRatio > 1.4
                ? 'bg-rose-50 border-rose-300 text-rose-900 animate-pulse'
                : currentPacingRatio > 1.0
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              <Timer className={`w-4 h-4 ${
                currentPacingRatio > 1.4 ? 'text-rose-600' : currentPacingRatio > 1.0 ? 'text-amber-600' : 'text-slate-600'
              }`} />
              <div className="text-xs">
                <span className="font-semibold">Q{currentQ.number} Time: </span>
                <span className="font-mono-numbers font-bold">{formatTime(currentQSeconds)}</span>
                <span className="text-slate-500 text-[11px] ml-1">/ {currentQ.recommendedMinutes}m rec.</span>
              </div>
            </div>

            {/* Overall Exam Timer */}
            <div className={`px-3.5 py-1.5 rounded-lg border flex items-center gap-2 ${
              examSecondsRemaining < 300
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-slate-900 border-slate-900 text-white'
            }`}>
              <Clock className="w-4 h-4 text-amber-400" />
              <div className="text-xs">
                <span className="text-slate-300 text-[11px]">Exam Left: </span>
                <span className="font-mono-numbers font-bold text-sm tracking-wide">
                  {formatTime(examSecondsRemaining)}
                </span>
              </div>
            </div>

            {/* Finish Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Paper</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / paper.questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Exam Hall Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Sidebar: Question Matrix */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Question Matrix</span>
              <span className="font-mono-numbers">{answeredCount} of {paper.questions.length} Attempted</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2">
              {paper.questions.map((q, idx) => {
                const isAnswered = (answers[q.id]?.answerText || '').trim().length > 0;
                const isFlagged = !!answers[q.id]?.isFlagged;
                const isActive = idx === currentQuestionIndex;
                const qTime = questionTimers[q.id] || 0;
                const isOvertime = qTime > q.recommendedMinutes * 60 * 1.3;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`relative p-2 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-1'
                        : isAnswered
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{q.number}</span>
                    <span className="text-[10px] opacity-75 font-normal">[{q.marks}m]</span>

                    {/* Flag indicator */}
                    {isFlagged && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                    )}

                    {/* Overtime warning dot */}
                    {isOvertime && !isActive && (
                      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" />
                <span>Answer written</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 ml-0.5" />
                <span>Flagged for review</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 ml-0.5" />
                <span>Over recommended time</span>
              </div>
            </div>
          </div>

          {/* Time Pacing Strategy Reminder */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2 text-amber-900">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>Exam Time Strategy</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              Rule of thumb: Spend ~1 minute per mark. If you get stuck on a 2-mark question for more than 3 minutes, write your best guess and move on. Protect your time for 6-mark and essay questions!
            </p>
          </div>
        </div>

        {/* Center / Right: Question Paper & Answer Canvas */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Question Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="text-slate-900 font-bold text-sm">Question {currentQ.number}</span>
                  <span>·</span>
                  <span className="text-slate-600">{currentQ.topic}</span>
                  <span>·</span>
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-mono-numbers">
                    {currentQ.marks} {currentQ.marks === 1 ? 'Mark' : 'Marks'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFlag}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
                    isCurrentFlagged
                      ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'text-amber-600 fill-amber-500' : 'text-slate-400'}`} />
                  <span>{isCurrentFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowScratchpad(!showScratchpad)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
                    showScratchpad
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{showScratchpad ? 'Hide Scratchpad' : 'Essay Scratchpad'}</span>
                </button>
              </div>
            </div>

            {/* Pacing Alert if student is falling into a time trap */}
            {currentPacingRatio > 1.5 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div>
                  <span className="font-bold">Pacing Alert: </span>
                  You've spent {formatTime(currentQSeconds)} on this {currentQ.marks}-mark question (recommended benchmark: {currentQ.recommendedMinutes}m). Avoid burning minutes needed for later questions!
                </div>
              </div>
            )}

            {/* Context/Stimulus Scenario if available */}
            {currentQ.contextOrScenario && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                {currentQ.contextOrScenario}
              </div>
            )}

            {/* Question Text */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Command Word: {currentQ.commandWord}
                </span>
              </div>
              <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                {currentQ.questionText}
              </p>
            </div>

            {/* Scratchpad Plan Area (collapsible) */}
            {showScratchpad && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span>Rough Scratchpad / Answer Plan (not assessed)</span>
                  <span className="text-[11px] font-normal text-slate-400">Jot 3-4 bullet points before typing full prose</span>
                </div>
                <textarea
                  rows={3}
                  value={currentScratchpad}
                  onChange={(e) => handleScratchpadChange(e.target.value)}
                  placeholder="e.g. Point 1: lock-and-key -> Point 2: tertiary shape -> Point 3: active site denaturation..."
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            )}

            {/* Student Answer Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">Your Exam Answer:</span>
                <span className="font-mono-numbers">
                  {currentAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                rows={currentQ.marks >= 6 ? 10 : currentQ.marks >= 4 ? 6 : 4}
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder={`Write your answer clearly in full sentences. Aim to address the command word '${currentQ.commandWord}' and allocate one distinct point per mark...`}
                className="w-full p-4 text-sm sm:text-base text-slate-900 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent leading-relaxed"
              />
            </div>

            {/* Navigation Bottom Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
                  currentQuestionIndex === 0
                    ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Question</span>
              </button>

              <div className="text-xs text-slate-400 font-mono-numbers">
                {currentQuestionIndex + 1} of {paper.questions.length}
              </div>

              {currentQuestionIndex < paper.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(paper.questions.length - 1, prev + 1))}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Review & Finish Exam</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Final Submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl border border-slate-200">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Submit Exam Paper?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once submitted, PaceMark will mark your responses against official criteria and calculate your full time management diagnostics.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Questions Attempted:</span>
                <span className="font-bold font-mono-numbers">{answeredCount} of {paper.questions.length}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Questions Flagged:</span>
                <span className="font-bold font-mono-numbers text-amber-700">{flaggedCount}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total Time Used:</span>
                <span className="font-bold font-mono-numbers">{formatTime(totalAllocatedSeconds - examSecondsRemaining)}</span>
              </div>
            </div>

            {answeredCount < paper.questions.length && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  You still have {paper.questions.length - answeredCount} unanswered questions. You can go back and complete them!
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Return to Paper
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
              >
                Confirm & View Diagnostics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
