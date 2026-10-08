import React, { useState, useMemo } from 'react';
import {
  History,
  Award,
  Clock,
  ArrowRight,
  RotateCcw,
  Trash2,
  CheckCircle2,
  TrendingUp,
  Filter,
  Zap,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ExamAttemptResult } from '../types';

interface HistoryDashboardProps {
  history: ExamAttemptResult[];
  onSelectAttempt: (attempt: ExamAttemptResult) => void;
  onClearHistory: () => void;
  onNewPaper: () => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  history,
  onSelectAttempt,
  onClearHistory,
  onNewPaper
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');

  const totalAttempts = history.length;
  const avgScore = totalAttempts > 0
    ? Math.round(history.reduce((sum, h) => sum + h.percentage, 0) / totalAttempts)
    : 0;
  const avgPacing = totalAttempts > 0
    ? Math.round(history.reduce((sum, h) => sum + h.pacingDisciplineScore, 0) / totalAttempts)
    : 0;
  const totalMinutesStudied = Math.round(
    history.reduce((sum, h) => sum + h.totalTimeSpentSeconds, 0) / 60
  );

  // Available subjects for filtering
  const availableSubjects = useMemo(() => {
    const subs = Array.from(new Set(history.map((h) => h.subject)));
    return ['All Subjects', ...subs];
  }, [history]);

  // Chronological history (oldest first for trend line progression)
  const chronologicalHistory = useMemo(() => {
    return [...history].sort((a, b) => a.completedAt - b.completedAt);
  }, [history]);

  // Filtered chronological history
  const filteredHistory = useMemo(() => {
    if (selectedSubject === 'All Subjects') return chronologicalHistory;
    return chronologicalHistory.filter((h) => h.subject === selectedSubject);
  }, [chronologicalHistory, selectedSubject]);

  // Transform data for Recharts LineChart
  const chartData = useMemo(() => {
    return filteredHistory.map((item, index) => {
      const date = new Date(item.completedAt);
      const formattedDate = date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });

      return {
        attemptNumber: index + 1,
        attemptLabel: `Mock #${index + 1}`,
        date: formattedDate,
        title: item.paperTitle,
        subject: item.subject,
        marksScore: item.percentage,
        marksRatio: `${item.totalMarksAwarded}/${item.maxPossibleMarks}`,
        pacingScore: item.pacingDisciplineScore,
        grade: item.gradeEstimated,
        panicTraps: item.panicTrapsCount,
        timeMinutes: Math.round(item.totalTimeSpentSeconds / 60),
      };
    });
  }, [filteredHistory]);

  // Calculate delta improvements
  const trendDeltas = useMemo(() => {
    if (chartData.length < 2) return null;
    const first = chartData[0];
    const latest = chartData[chartData.length - 1];
    const marksDelta = latest.marksScore - first.marksScore;
    const pacingDelta = latest.pacingScore - first.pacingScore;
    return {
      marksDelta,
      pacingDelta,
      firstScore: first.marksScore,
      latestScore: latest.marksScore,
      firstPacing: first.pacingScore,
      latestPacing: latest.pacingScore,
    };
  }, [chartData]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl text-xs space-y-2 border border-slate-800 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-slate-100">{data.attemptLabel}</span>
            <span className="text-slate-400 font-mono-numbers">{data.date}</span>
          </div>

          <div className="text-slate-300 font-medium truncate max-w-xs">
            {data.title}
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                Marks Score:
              </span>
              <span className="font-mono-numbers font-bold text-white">
                {data.marksScore}% ({data.marksRatio})
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Pacing Discipline:
              </span>
              <span className="font-mono-numbers font-bold text-white">
                {data.pacingScore}%
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
              <span>Grade: <strong className="text-slate-200">{data.grade}</strong></span>
              <span>{data.timeMinutes}m spent</span>
            </div>

            {data.panicTraps > 0 && (
              <div className="text-rose-400 text-[11px] font-medium">
                ⚠️ {data.panicTraps} time trap{data.panicTraps > 1 ? 's' : ''} encountered
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Progress Analytics</span>
              <span>·</span>
              <span>Exam Stamina Track</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Revision & Exam Pacing History
            </h1>
          </div>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Completed Mocks</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">
              {totalAttempts}
            </div>
            <div className="text-xs text-slate-500">Timed sessions</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Average Mark</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono-numbers">
              {avgScore}%
            </div>
            <div className="text-xs text-slate-500">Across all attempts</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Avg Pacing Discipline</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono-numbers">
              {avgPacing}%
            </div>
            <div className="text-xs text-slate-500">Benchmark adherence</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Timed Revision</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">
              {totalMinutesStudied}m
            </div>
            <div className="text-xs text-slate-500">Under timed conditions</div>
          </div>
        </div>
      </div>

      {/* Progress Trend Line Chart Section (Recharts) */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span>Marks & Pacing Discipline Progress Trend</span>
              </h2>
              <p className="text-xs text-slate-500">
                Visualizing your score improvement and time management stamina across successive mock papers.
              </p>
            </div>

            {/* Subject Filter Pills (if multiple subjects exist) */}
            {availableSubjects.length > 2 && (
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-start sm:self-auto overflow-x-auto">
                {availableSubjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                      selectedSubject === sub
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delta Highlights if 2+ attempts exist */}
          {trendDeltas && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900">
                    Marks Progression
                  </span>
                  <div className="text-xs text-slate-600 font-mono-numbers">
                    Started at {trendDeltas.firstScore}% → Latest {trendDeltas.latestScore}%
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm font-black font-mono-numbers px-2 py-0.5 rounded ${
                      trendDeltas.marksDelta >= 0
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {trendDeltas.marksDelta >= 0 ? `+${trendDeltas.marksDelta}%` : `${trendDeltas.marksDelta}%`}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                    Pacing Discipline Progression
                  </span>
                  <div className="text-xs text-slate-600 font-mono-numbers">
                    Started at {trendDeltas.firstPacing}% → Latest {trendDeltas.latestPacing}%
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm font-black font-mono-numbers px-2 py-0.5 rounded ${
                      trendDeltas.pacingDelta >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {trendDeltas.pacingDelta >= 0 ? `+${trendDeltas.pacingDelta}%` : `${trendDeltas.pacingDelta}%`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Recharts Chart Area */}
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="attemptLabel"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  unit="%"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  dx={-4}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '12px',
                    paddingBottom: '12px',
                    fontWeight: 600,
                  }}
                  formatter={(value) => (
                    <span className="text-slate-700 ml-1">
                      {value === 'marksScore' ? 'Marks Score (%)' : 'Pacing Discipline (%)'}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="marksScore"
                  name="marksScore"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
                <Line
                  type="monotone"
                  dataKey="pacingScore"
                  name="pacingScore"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#047857' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {chartData.length === 1 && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
              1 mock paper attempt plotted. Complete additional mock exams to see continuous trend lines and pacing stamina over time.
            </div>
          )}
        </div>
      )}

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No Exam Attempts Recorded Yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Upload your revision notes or select one of our curated packs to sit your first timed past paper!
            </p>
          </div>
          <button
            onClick={onNewPaper}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
          >
            Generate First Mock Paper
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Past Papers & Pacing Records
            </h2>
            <span className="text-xs text-slate-500 font-mono-numbers">
              {filteredHistory.length} Record{filteredHistory.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {filteredHistory.slice().reverse().map((record) => {
              const dateStr = new Date(record.completedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={record.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{record.subject}</span>
                      <span>·</span>
                      <span>{dateStr}</span>
                      <span>·</span>
                      <span className="font-mono-numbers">
                        {Math.round(record.totalTimeSpentSeconds / 60)}m spent
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {record.paperTitle}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                      <span>
                        Marks: <strong className="text-slate-900 font-mono-numbers">{record.totalMarksAwarded}/{record.maxPossibleMarks}</strong> ({record.percentage}%)
                      </span>
                      <span>·</span>
                      <span>
                        Grade: <strong className="text-blue-700">{record.gradeEstimated}</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Pacing: <strong className="text-emerald-700 font-mono-numbers">{record.pacingDisciplineScore}%</strong>
                      </span>
                      {record.panicTrapsCount > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-rose-600 font-medium">
                            {record.panicTrapsCount} Time Trap{record.panicTrapsCount > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectAttempt(record)}
                      className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <span>View Diagnostics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
