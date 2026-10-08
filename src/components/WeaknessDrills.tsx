import React, { useState, useEffect } from 'react';
import { Target, Zap, Clock, CheckCircle2, Play, RefreshCw, Send, AlertCircle, BookOpen } from 'lucide-react';
import { DrillItem } from '../types';

interface WeaknessDrillsProps {
  initialTopics?: string[];
  subject?: string;
}

export const WeaknessDrills: React.FC<WeaknessDrillsProps> = ({
  initialTopics = ['Enzyme Denaturation', 'Oxygen Debt'],
  subject = 'General Exam'
}) => {
  const [topics, setTopics] = useState<string[]>(initialTopics.length > 0 ? initialTopics : ['Enzyme Denaturation', 'CPU Registers']);
  const [newTopicInput, setNewTopicInput] = useState('');
  const [drills, setDrills] = useState<DrillItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Drill Test State
  const [activeDrillIndex, setActiveDrillIndex] = useState<number | null>(null);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillSecondsLeft, setDrillSecondsLeft] = useState<number>(180);
  const [isDrillRunning, setIsDrillRunning] = useState(false);
  const [showMarkScheme, setShowMarkScheme] = useState<Record<string, boolean>>({});

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    if (!topics.includes(newTopicInput.trim())) {
      setTopics([...topics, newTopicInput.trim()]);
    }
    setNewTopicInput('');
  };

  const handleRemoveTopic = (indexToRemove: number) => {
    setTopics(topics.filter((_, idx) => idx !== indexToRemove));
  };

  const fetchDrills = async () => {
    if (topics.length === 0) {
      setErrorMsg('Please specify at least one weak topic to drill.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/generate-weakness-drills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weakTopics: topics, subject }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate drills');
      }

      const data = await response.json();
      setDrills(data.drills || []);
      setActiveDrillIndex(0);
      if (data.drills && data.drills.length > 0) {
        setDrillSecondsLeft(data.drills[0].recommendedMinutes * 60);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Could not fetch drills. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Timer countdown for active drill
  useEffect(() => {
    if (!isDrillRunning || drillSecondsLeft <= 0) return;

    const interval = setInterval(() => {
      setDrillSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsDrillRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDrillRunning, drillSecondsLeft]);

  const startDrillTimer = (drill: DrillItem) => {
    setDrillSecondsLeft(drill.recommendedMinutes * 60);
    setIsDrillRunning(true);
  };

  const activeDrill = activeDrillIndex !== null && drills[activeDrillIndex] ? drills[activeDrillIndex] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Introduction */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Targeted Remediation</span>
          <span>·</span>
          <span>Speed Drills</span>
          <span>·</span>
          <span>Specification Demands</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Targeted Weakness & Speed Drills
        </h1>

        <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
          As students identified in our research, when you've already completed existing past papers, you need newly generated questions targeting your exact panic topics under strict 1-minute-per-mark pacing.
        </p>

        {/* Weak Topics Chips */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Target Weakness Topics to Practice:</span>
            <span className="text-slate-400 font-normal">{topics.length} topics selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {topics.map((t, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200 flex items-center gap-1.5"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(idx)}
                  className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Add custom topic input */}
          <div className="flex items-center gap-2 max-w-md pt-1">
            <input
              type="text"
              value={newTopicInput}
              onChange={(e) => setNewTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTopic()}
              placeholder="Add another weak topic (e.g. Mitosis, CPU Registers)..."
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="button"
              onClick={handleAddTopic}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Add Topic
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={fetchDrills}
            disabled={isLoading || topics.length === 0}
            className={`px-5 py-2.5 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 ${
              isLoading || topics.length === 0
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating New Specification Questions...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Generate Speed Drills ({topics.length} topics)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Drills List */}
      {drills.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Speed Challenge Arena</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono-numbers">
              {drills.length} Drills Generated
            </span>
          </div>

          <div className="space-y-4">
            {drills.map((drill, idx) => {
              const isSelected = activeDrillIndex === idx;
              const answerText = drillAnswers[drill.id] || '';
              const isSchemeOpen = !!showMarkScheme[drill.id];

              return (
                <div
                  key={drill.id || idx}
                  className={`bg-white rounded-xl border transition-all p-5 sm:p-6 space-y-4 ${
                    isSelected ? 'border-blue-400 shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900">Drill {idx + 1}</span>
                      <span>·</span>
                      <span className="text-blue-700 font-medium">{drill.topic}</span>
                      <span>·</span>
                      <span className="font-mono-numbers bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-semibold">
                        {drill.marks} Marks
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono-numbers">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pacing Target: {drill.recommendedMinutes}m ({drill.recommendedMinutes * 60}s)</span>
                      </div>

                      {!isDrillRunning && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDrillIndex(idx);
                            startDrillTimer(drill);
                          }}
                          className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-emerald-600" />
                          <span>Start Timer</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Countdown Timer Display if this drill is active */}
                  {isSelected && isDrillRunning && (
                    <div className="p-3 rounded-lg bg-slate-900 text-white flex items-center justify-between text-xs font-mono-numbers">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Speed Stopwatch Active</span>
                      </div>
                      <div className="text-base font-bold text-amber-300">
                        {Math.floor(drillSecondsLeft / 60)}:{(drillSecondsLeft % 60).toString().padStart(2, '0')} remaining
                      </div>
                    </div>
                  )}

                  <p className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed">
                    {drill.questionText}
                  </p>

                  {/* Student Answer Box */}
                  <div className="space-y-1.5">
                    <textarea
                      rows={4}
                      value={answerText}
                      onChange={(e) => setDrillAnswers({ ...drillAnswers, [drill.id]: e.target.value })}
                      placeholder="Type your rapid answer here... Focus on direct, concise sentences that hit mark scheme bullet points."
                      className="w-full p-3 text-xs sm:text-sm text-slate-900 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  {/* Mark Scheme Reveal Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setShowMarkScheme({ ...showMarkScheme, [drill.id]: !isSchemeOpen })}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isSchemeOpen ? 'Hide Mark Scheme' : 'Check Official Mark Scheme'}</span>
                    </button>

                    <span className="text-xs text-slate-400 font-mono-numbers">
                      {answerText.trim().split(/\s+/).filter(Boolean).length} words typed
                    </span>
                  </div>

                  {/* Revealed Mark Scheme */}
                  {isSchemeOpen && (
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs text-slate-800">
                      <div className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                        Mark Scheme Points ({drill.marks} Marks Available):
                      </div>
                      <ul className="space-y-1 list-disc list-inside">
                        {drill.markScheme.map((item, mIdx) => (
                          <li key={mIdx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
