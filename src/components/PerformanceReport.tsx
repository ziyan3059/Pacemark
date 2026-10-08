import React, { useState } from 'react';
import {
  Award,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingUp,
  Target,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  FileText,
  Download
} from 'lucide-react';
import { ExamPaperData, ExamAttemptResult, QuestionData } from '../types';
import { generatePdfReport } from '../utils/generatePdfReport';

interface PerformanceReportProps {
  report: ExamAttemptResult;
  paper: ExamPaperData;
  onLaunchDrills: (weakTopics: string[]) => void;
  onRetakePaper: () => void;
  onNewPaper: () => void;
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({
  report,
  paper,
  onLaunchDrills,
  onRetakePaper,
  onNewPaper
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    paper.questions[0]?.id || null
  );
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      // Small timeout to allow UI loading state to register
      await new Promise((resolve) => setTimeout(resolve, 60));
      generatePdfReport(report, paper);
    } catch (err) {
      console.error('Failed to generate PDF report:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const formatMinutesSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const getPacingBadge = (status: 'optimal' | 'rushed' | 'slow_trap' | 'panic_risk') => {
    switch (status) {
      case 'panic_risk':
        return (
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Time Trap (Panic)</span>
          </span>
        );
      case 'slow_trap':
        return (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Slow Pacing</span>
          </span>
        );
      case 'rushed':
        return (
          <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-md flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>Rushed Response</span>
          </span>
        );
      case 'optimal':
      default:
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Optimal Pace</span>
          </span>
        );
    }
  };

  // Extract weak topics list for fast drill launch
  const weakTopicNames = report.weakTopics.map((w) => w.topic);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Score & Executive Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>{report.subject}</span>
              <span>·</span>
              <span>Completed Exam Report</span>
              <span>·</span>
              <span>{paper.examBoard || 'Standard Academic'} Specification</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {report.paperTitle}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Save your results and examiner feedback offline as a PDF"
            >
              {isDownloadingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Report as PDF</span>
                </>
              )}
            </button>
            <button
              onClick={onRetakePaper}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Retake Paper</span>
            </button>
            <button
              onClick={onNewPaper}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>Upload New Notes</span>
            </button>
          </div>
        </div>

        {/* 4 Score KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">
                {report.totalMarksAwarded}
              </span>
              <span className="text-xs text-slate-500 font-mono-numbers">/ {report.maxPossibleMarks} marks</span>
            </div>
            <div className="text-xs text-slate-600 font-medium font-mono-numbers">
              {report.percentage}% overall
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Estimated Grade</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-blue-700">
                {report.gradeEstimated}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Standard academic scale
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Pacing Discipline</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-3xl font-black font-mono-numbers ${
                report.pacingDisciplineScore >= 80 ? 'text-emerald-700' : report.pacingDisciplineScore >= 60 ? 'text-amber-700' : 'text-rose-700'
              }`}>
                {report.pacingDisciplineScore}%
              </span>
            </div>
            <div className="text-xs text-slate-500">
              {report.panicTrapsCount === 0 ? 'No time traps encountered' : `${report.panicTrapsCount} potential panic trap(s)`}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Time Taken</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">
                {formatMinutesSeconds(report.totalTimeSpentSeconds)}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono-numbers">
              of {Math.round(report.allocatedTimeSeconds / 60)}m allowed
            </div>
          </div>
        </div>
      </div>

      {/* Time Management & Pacing Heatmap (The Core Innovation from User Project Analysis) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Question Time Pacing Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500">
              Comparing actual seconds spent vs the examiner-recommended benchmark for each mark tariff.
            </p>
          </div>
        </div>

        {/* Question Pacing Rows */}
        <div className="space-y-3">
          {paper.questions.map((q) => {
            const evaluation = report.questionEvaluations[q.id];
            const answer = report.studentAnswers[q.id];
            const timeSpent = answer?.timeSpentSeconds || 0;
            const recTime = q.recommendedMinutes * 60;
            const pacingRatio = recTime > 0 ? timeSpent / recTime : 1;
            const marksAwarded = evaluation?.marksAwarded ?? 0;

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Q{q.number}</span>
                    <span className="text-xs text-slate-600 truncate max-w-xs">{q.topic}</span>
                    <span className="text-xs font-mono-numbers font-medium bg-slate-200/80 px-2 py-0.5 rounded text-slate-800">
                      {q.marks} Marks
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Awarded: <strong className="text-slate-900 font-mono-numbers">{marksAwarded} / {q.marks}</strong>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="flex-1 w-full max-w-md space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 font-mono-numbers">
                    <span>Spent: {formatMinutesSeconds(timeSpent)}</span>
                    <span className="text-slate-400">Target: {q.recommendedMinutes}m</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        pacingRatio > 1.4
                          ? 'bg-rose-500'
                          : pacingRatio > 1.15
                          ? 'bg-amber-500'
                          : pacingRatio < 0.5
                          ? 'bg-purple-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(10, pacingRatio * 75))}%` }}
                    />
                  </div>
                </div>

                {/* Diagnostic Badge */}
                <div className="shrink-0 flex items-center gap-2">
                  {getPacingBadge(evaluation?.pacingEvaluation?.status || 'optimal')}
                  <button
                    onClick={() => setExpandedQuestionId(expandedQuestionId === q.id ? null : q.id)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    {expandedQuestionId === q.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakness Topic Analysis & Actionable Drills Generator */}
      {report.weakTopics.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" />
                <span>Identified Weak Topics & Panic Traps</span>
              </h2>
              <p className="text-xs text-slate-500">
                Topics where you dropped marks or spent disproportionate time over the benchmark.
              </p>
            </div>

            <button
              onClick={() => onLaunchDrills(weakTopicNames)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Launch Targeted Drills on These Topics</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.weakTopics.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Topic Gap {idx + 1}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {item.topic}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-mono-numbers">
                  <span className="text-rose-700 font-medium">
                    -{item.marksLost} Marks lost
                  </span>
                  <span className="text-slate-500">
                    {formatMinutesSeconds(item.timeLostSeconds)} spent
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Review & Examiner Mark Scheme Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-700" />
            <span>Examiner Mark Scheme & Response Audit</span>
          </h2>
          <p className="text-xs text-slate-500">
            Review your responses against the exact criteria used by official examiners.
          </p>
        </div>

        <div className="space-y-6">
          {paper.questions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const evalData = report.questionEvaluations[q.id];
            const answer = report.studentAnswers[q.id]?.answerText || '';
            const marksAwarded = evalData?.marksAwarded ?? 0;

            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-all ${
                  isExpanded ? 'border-slate-300 shadow-2xs bg-white' : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                {/* Collapsible Header */}
                <button
                  type="button"
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      Q{q.number}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <span className="text-slate-900">{q.topic}</span>
                        <span>·</span>
                        <span>{q.marks} Marks Tariff</span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-1 mt-0.5">
                        {q.questionText}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono-numbers px-2.5 py-1 rounded bg-slate-100 text-slate-900">
                      {marksAwarded} / {q.marks} Marks
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 border-t border-slate-100 space-y-6">
                    {/* Full Question Text */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs sm:text-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Question Prompt ({q.commandWord})
                      </span>
                      <p className="font-medium text-slate-900 leading-relaxed">
                        {q.questionText}
                      </p>
                    </div>

                    {/* Student's Answer */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Your Exam Script:</span>
                        <span className="font-mono-numbers">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
                      </div>
                      <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed whitespace-pre-wrap">
                        {answer.trim() || <em className="text-slate-400">No response written for this question.</em>}
                      </div>
                    </div>

                    {/* Official Mark Scheme Points */}
                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
                      <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                        Official Exam Board Mark Scheme Criteria
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                        {q.markScheme.points.map((pt, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">
                            {pt}
                          </li>
                        ))}
                      </ul>
                      {q.markScheme.indicativeContent && (
                        <div className="text-xs text-slate-600 pt-2 border-t border-blue-200/60 leading-relaxed">
                          <strong>Indicative Content: </strong>{q.markScheme.indicativeContent}
                        </div>
                      )}
                    </div>

                    {/* Examiner Feedback & Pacing Note */}
                    {evalData && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Awarded Points ({marksAwarded} Marks)</span>
                          </div>
                          <ul className="space-y-1 text-xs text-emerald-800">
                            {evalData.awardedPoints.map((pt, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="font-bold">✓</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900">
                            <XCircle className="w-4 h-4 text-rose-600" />
                            <span>Missed Points ({q.marks - marksAwarded} Marks)</span>
                          </div>
                          <ul className="space-y-1 text-xs text-rose-800">
                            {evalData.missedPoints.map((pt, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="font-bold">✗</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pacing Advice */}
                        <div className="md:col-span-2 p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-1 text-xs text-amber-900">
                          <span className="font-bold">Examiner Pacing Diagnostic: </span>
                          <span>{evalData.pacingEvaluation.feedback}</span>
                          {evalData.examinerTip && (
                            <div className="pt-2 text-amber-800 font-medium">
                              <strong>Examiner Pro-Tip: </strong>{evalData.examinerTip}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Want to save these detailed criteria and examiner feedback for revision notes?
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-xl transition-colors flex items-center gap-2 shadow-2xs"
          >
            {isDownloadingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download Report as PDF</span>
              </>
            )}
          </button>
          <button
            onClick={onRetakePaper}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Retake Paper</span>
          </button>
        </div>
      </div>
    </div>
  );
};
