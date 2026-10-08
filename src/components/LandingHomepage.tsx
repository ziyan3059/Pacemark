import React, { useState, useEffect } from 'react';
import {
  Timer,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Target,
  Download,
  BookOpen,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Play
} from 'lucide-react';
import { SAMPLE_NOTE_PACKS, SampleNotePack } from '../data/sampleNotes';

interface LandingHomepageProps {
  onStartWithNotes: (subject: string, notes: string) => void;
  onGoToApp: () => void;
}

export const LandingHomepage: React.FC<LandingHomepageProps> = ({
  onStartWithNotes,
  onGoToApp
}) => {
  // Interactive HUD card preview states
  const [hudStopwatchSecs, setHudStopwatchSecs] = useState<number>(165); // 2m 45s
  const [showMarkSchemePreview, setShowMarkSchemePreview] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'stopwatch' | 'audit' | 'analytics' | 'pdf'>('stopwatch');

  // Active exam simulation stopwatch ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setHudStopwatchSecs(prev => (prev >= 238 ? 145 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick Terminal state
  const [quickSubject, setQuickSubject] = useState('General Biology');
  const [quickNotes, setQuickNotes] = useState(SAMPLE_NOTE_PACKS[0].content);
  const [isQuickLaunching, setIsQuickLaunching] = useState(false);

  const formatStopwatch = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleQuickLaunch = async () => {
    setIsQuickLaunching(true);
    try {
      await onStartWithNotes(quickSubject, quickNotes);
    } finally {
      setIsQuickLaunching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Background Technical Grid Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Relative container for all sections */}
      <div className="relative z-10">

        {/* ========================================================= */}
        {/* SECTION 1: HERO & MATHEMATICAL HUD PREVIEW                */}
        {/* ========================================================= */}
        <section className="pt-8 pb-16 sm:pb-24 border-b border-slate-200 bg-white/80 backdrop-blur-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Top Headline Lockup */}
            <div className="max-w-4xl mx-auto text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 font-mono-numbers">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>ACADEMIC PACING ENGINE · STANDARD ACADEMIC & ADVANCED SPECIFICATION</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] text-balance">
                Stop losing grades to the clock. Turn your revision notes into real timed exams.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
                Content sites help you memorize. PaceMark trains you under realistic exam hall conditions. Convert uploaded notes into 1-mark to 9-mark past papers with live per-question stopwatch tracking and panic zone diagnostics.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('quick-terminal-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Drop Notes & Generate Free Mock</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={onGoToApp}
                  className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-slate-600 fill-slate-600" />
                  <span>Open Interactive Exam App</span>
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>1 Mark ≈ 1 Minute Pacing</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Per-Question Stopwatch HUD</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Official Examiner Mark Schemes</span>
                </span>
              </div>
            </div>

            {/* Floating Mathematical HUD Exam Hall Simulation Card */}
            <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-300 shadow-xl overflow-hidden">
              {/* HUD Top Bar */}
              <div className="bg-slate-900 px-5 py-3 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono-numbers font-bold tracking-wider text-slate-200">
                    EXAM ROOM ACTIVE · GENERAL BIOLOGY (STANDARD)
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Active Question Stopwatch with Subtle Focus Animation Border Pulse (Law of Feedback) */}
                  <div
                    className="px-3 py-1 rounded-lg bg-slate-800 border border-amber-400/50 animate-border-focus flex items-center gap-2 text-xs font-mono-numbers shadow-xs transition-all"
                    title="Active exam stopwatch with focus pulse (Law of Feedback)"
                  >
                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Q2 Elapsed: </span>
                    <strong className="text-amber-300 text-sm">{formatStopwatch(hudStopwatchSecs)}</strong>
                    <span className="text-slate-400 text-[11px]">/ 04:00 rec.</span>
                  </div>

                  {/* Overall Hall Timer */}
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 font-mono-numbers">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Exam Left: <strong>38:15</strong></span>
                  </div>
                </div>
              </div>

              {/* Progress Gauge Line */}
              <div className="w-full bg-slate-100 h-1.5">
                <div className="bg-blue-600 h-1.5 w-[68%]" />
              </div>

              {/* HUD Question Stage Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5 text-xs">
                    <span className="font-bold text-sm text-slate-900">Question 2</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-600 font-medium">Cellular Respiration & Bioenergetics</span>
                    <span className="text-slate-400">·</span>
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono-numbers font-bold">
                      6 MARKS
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>On-Target Pace</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Command Word: Compare & Explain
                  </span>
                  <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                    Compare aerobic and anaerobic respiration in human muscle tissue during vigorous exercise. Explain why an oxygen debt occurs and how it is subsequently repaid.
                  </p>
                </div>

                {/* Simulated Student Script Area */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono-numbers">
                    <span>Student Response (Live In-Browser):</span>
                    <span>114 words typed</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    Aerobic respiration uses oxygen to fully break down glucose into carbon dioxide and water, releasing 32 ATP. During intense sprinting, insufficient oxygen causes muscles to respire anaerobically, forming lactic acid and causing cellular fatigue. An oxygen debt builds up, which is the amount of oxygen required post-exercise to transport lactic acid to the liver and convert it back to glucose...
                  </p>
                </div>

                {/* Toggleable Mark Scheme Preview */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowMarkSchemePreview(!showMarkSchemePreview)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{showMarkSchemePreview ? 'Hide Examiner Criteria' : 'Inspect Official 6-Mark Scheme Criteria'}</span>
                  </button>

                  <span className="text-xs text-slate-400 font-mono-numbers">
                    Benchmark: 1.15 min / mark
                  </span>
                </div>

                {showMarkSchemePreview && (
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs text-slate-800 animate-in fade-in">
                    <span className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                      Standard Level 3 Indicative Content (5–6 Marks):
                    </span>
                    <ul className="space-y-1 list-disc list-inside text-slate-700">
                      <li>Full glucose oxidation comparison (high vs low ATP yield) [1 mark]</li>
                      <li>Incomplete breakdown producing lactic acid and acidosis [1 mark]</li>
                      <li>Rigorous definition of oxygen debt [1 mark]</li>
                      <li>Blood transport mechanism to liver and enzymatic oxidation [2 marks]</li>
                      <li>Post-exercise elevated breathing/heart rate linkage [1 mark]</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: THE EXAMINATION GAP (COMPARISON MATRIX)        */}
        {/* ========================================================= */}
        <section id="examination-gap" className="py-20 border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
                THE REVISION DILEMMA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Why knowing the content doesn't get you a Grade 9.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance">
                Most students drop grades not because of knowledge gaps, but because of poor exam pacing and time pressure panic.
              </p>
            </div>

            {/* 3-Pillar Architectural Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: Seneca / Bitesize */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Content Platforms (Seneca, Bitesize)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Excellent for breaking down syllabus points and micro-quizzes, but creates a false sense of security. They never test you under ticking 75-minute exam hall conditions.
                </p>
                <div className="pt-3 border-t border-slate-100 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Zero time management training</span>
                </div>
              </div>

              {/* Pillar 2: PMT PDFs */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Past Paper PDFs (Physics & Maths Tutor)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Offers downloadable papers, but you never track seconds spent per question. Students linger 5 minutes on a 2-mark question, running out of time before reaching high-tariff essays.
                </p>
                <div className="pt-3 border-t border-slate-100 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>No per-question diagnostics</span>
                </div>
              </div>

              {/* Pillar 3: PaceMark Revision */}
              <div className="p-6 rounded-2xl bg-blue-50/60 border-2 border-blue-600 space-y-4 shadow-sm relative">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  PaceMark Pacing Engine
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Direct browser exam room with millisecond question stopwatches, panic trap warnings, AI examiner mark schemes, and automatic drills on your exact time traps.
                </p>
                <div className="pt-3 border-t border-blue-200 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Real exam hall stamina mastery</span>
                </div>
              </div>
            </div>

            {/* Credibility Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">+18.4%</div>
                <div className="text-xs text-slate-500 font-medium">Avg Grade Mark Lift</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono-numbers">-65%</div>
                <div className="text-xs text-slate-500 font-medium">Exam Panic Trap Drop</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono-numbers">14.2m</div>
                <div className="text-xs text-slate-500 font-medium">Saved for 6 & 9 Markers</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono-numbers">100%</div>
                <div className="text-xs text-slate-500 font-medium">Based on User Notes</div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: HOW IT WORKS (3-STEP MATHEMATICAL ENGINE)      */}
        {/* ========================================================= */}
        <section id="how-it-works" className="py-20 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
                THE 3-STEP ENGINE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                From rough lecture notes to timed exam mastery in seconds.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance">
                Engineered for rapid daily revision sprints before school, during frees, or for comprehensive weekend mocks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 font-mono-numbers">01</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono-numbers">
                    INPUT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Upload or Paste Revision Notes
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Drop your notes, flashcard exports, or lecture summaries. PaceMark maps key definitions, processes, and essay themes into rigorous academic exam mark schemes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 font-mono-numbers">02</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono-numbers">
                    EXECUTE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Sit Under The Stopwatch
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Attempt the mock paper directly on-screen. Individual question timers enforce the 1-min-per-mark rule, alerting you before you fall into a time trap.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-slate-900 font-mono-numbers">03</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono-numbers">
                    AUDIT
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Diagnostic Pacing Report & Drills
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Receive instant examiner grading, panic zone heatmaps, and 1-click targeted speed drills on your weakest syllabus topics.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 4: THE DIAGNOSTIC SUITE (INTERACTIVE SHOWCASE)     */}
        {/* ========================================================= */}
        <section id="diagnostic-suite" className="py-20 border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
                THE DIAGNOSTIC SUITE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Exam telemetry you can't get from a PDF.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance">
                Every second you spend is recorded, audited, and matched against examiner rubrics.
              </p>
            </div>

            {/* Feature Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveFeatureTab('stopwatch')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeFeatureTab === 'stopwatch'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Per-Question Stopwatch HUD
              </button>

              <button
                type="button"
                onClick={() => setActiveFeatureTab('audit')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeFeatureTab === 'audit'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Examiner Mark Scheme Audit
              </button>

              <button
                type="button"
                onClick={() => setActiveFeatureTab('analytics')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeFeatureTab === 'analytics'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Recharts Progress Trendline
              </button>

              <button
                type="button"
                onClick={() => setActiveFeatureTab('pdf')}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeFeatureTab === 'pdf'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Offline PDF Report Export
              </button>
            </div>

            {/* Interactive Feature Display Card */}
            <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-300 p-6 sm:p-8 shadow-sm">
              {activeFeatureTab === 'stopwatch' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Per-Question Time Allocation Tracking</h4>
                      <p className="text-xs text-slate-500">Live indicators notify you when approaching time traps</p>
                    </div>
                    <span className="text-xs font-mono-numbers text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold">
                      ● Active Calibration
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                      <span className="text-xs font-bold text-emerald-900">● On Target (Under 100%)</span>
                      <p className="text-xs text-emerald-800 leading-relaxed">
                        Pacing matches the 1-min-per-mark tariff. Encourages steady momentum.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                      <span className="text-xs font-bold text-amber-900">▲ Approaching Cap (100–130%)</span>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        Yellow warning: conclude final sentences and prepare to transition forward.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
                      <span className="text-xs font-bold text-rose-900">⚠️ Panic Zone Alert (&gt;150%)</span>
                      <p className="text-xs text-rose-800 leading-relaxed">
                        Pacing alert flashes: alerts student to move on before starving upcoming 6/9-markers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'audit' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Point-by-Point Mark Scheme Evaluation</h4>
                      <p className="text-xs text-slate-500">Specific awarded and missed points with examiner feedback</p>
                    </div>
                    <span className="text-xs font-mono-numbers text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md font-bold">
                      Standard Level 3 Rubric
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>Awarded: 5 / 6 Marks</span>
                      <span className="text-emerald-700 font-mono-numbers">83% Pacing Discipline</span>
                    </div>
                    <div className="space-y-1 text-slate-600">
                      <p className="text-emerald-800">✓ Awarded: Accurate distinction of ATP yield between aerobic and anaerobic pathways.</p>
                      <p className="text-emerald-800">✓ Awarded: Precise definition of oxygen debt volume and blood transport.</p>
                      <p className="text-rose-700">✗ Missed: Did not mention specific role of heart rate in sustaining liver conversion.</p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 text-slate-700">
                      <strong>Examiner Tip: </strong>Always link the physiological mechanism (elevated pulse) to the biochemical destination (liver hepatocyte oxidation).
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">Dual-Line Score & Pacing Progression</h4>
                      <p className="text-xs text-slate-500">Visualizing academic gains alongside time management stamina</p>
                    </div>
                    <span className="text-xs font-mono-numbers text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-bold">
                      Recharts Engine
                    </span>
                  </div>

                  <div className="p-6 rounded-xl bg-slate-900 text-white space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono-numbers">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400 font-bold">● Marks Score (%)</span>
                        <span className="text-emerald-400 font-bold">● Pacing Discipline (%)</span>
                      </div>
                      <span className="text-slate-400">Mock #1 → Mock #5</span>
                    </div>

                    <div className="h-28 flex items-end justify-between gap-4 pt-4 border-b border-slate-800">
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center gap-1.5 h-20">
                          <div className="w-3 bg-blue-500 rounded-t h-[52%]" />
                          <div className="w-3 bg-emerald-500 rounded-t h-[45%]" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono-numbers">#1</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center gap-1.5 h-20">
                          <div className="w-3 bg-blue-500 rounded-t h-[64%]" />
                          <div className="w-3 bg-emerald-500 rounded-t h-[60%]" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono-numbers">#2</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center gap-1.5 h-20">
                          <div className="w-3 bg-blue-500 rounded-t h-[72%]" />
                          <div className="w-3 bg-emerald-500 rounded-t h-[75%]" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono-numbers">#3</span>
                      </div>

                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full flex items-end justify-center gap-1.5 h-20">
                          <div className="w-3 bg-blue-500 rounded-t h-[86%]" />
                          <div className="w-3 bg-emerald-500 rounded-t h-[90%]" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono-numbers">#4</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span>Started: 52% Marks (Grade 5)</span>
                      <span className="text-emerald-400 font-bold font-mono-numbers">+38% Pacing Stamina Growth</span>
                      <span className="text-white font-bold">Latest: 86% Marks (Grade 9)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureTab === 'pdf' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">1-Click Offline PDF Diagnostic Export</h4>
                      <p className="text-xs text-slate-500">Save full reports for tutors, parents, and offline revision folders</p>
                    </div>
                    <span className="text-xs font-mono-numbers text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-bold">
                      jsPDF Vector Engine
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-900">Standardized Academic Performance Record</span>
                      <p className="text-xs text-slate-500">
                        Includes score summary, estimated academic grade, question pacing table, and examiner script annotations.
                      </p>
                    </div>

                    <div className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-800 flex items-center gap-1.5 shadow-2xs">
                      <Download className="w-3.5 h-3.5 text-blue-600" />
                      <span>Saved as .PDF Offline</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: STUDENT CASE STUDIES & SOCIAL PROOF            */}
        {/* ========================================================= */}
        <section id="case-studies" className="py-20 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="max-w-3xl mx-auto text-center space-y-3">
              <span className="text-xs font-bold text-blue-700 tracking-wider uppercase">
                STUDENT TRANSFORMATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Tested by students tackling high-pressure academic exams.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-balance">
                Real feedback from students who mastered their exam pacing and stopped freezing under timed conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Case 1: Biology */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono-numbers">
                    <span className="font-bold text-slate-900">General Biology</span>
                    <span>Grade C → Grade A*</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "I always thought I was bad at 6-markers. PaceMark showed I was actually spending almost 6 minutes on 1-mark definitions earlier in the paper. Once I followed the per-question stopwatch, I had 15 minutes left for the essay."
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-slate-900">
                  Sarah K. · Pre-Med Track
                </div>
              </div>

              {/* Case 2: Computer Science */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono-numbers">
                    <span className="font-bold text-slate-900">Computer Science</span>
                    <span>Grade B → Grade A*</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "Other tools gave me past papers, but I never did them under timed conditions. PaceMark's panic zone diagnostic flagged that I froze on algorithm questions. The speed drills trained my reflexes to write within the 1-min-per-mark rule."
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-slate-900">
                  Marcus T. · College / AP
                </div>
              </div>

              {/* Case 3: Religious Studies / Ethics */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono-numbers">
                    <span className="font-bold text-slate-900">Ethics & Philosophy</span>
                    <span>Grade C → Grade A</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "Essay-based subjects are brutal for timing. PaceMark helped me plan bullet points in the scratchpad and write concise 9-mark evaluation responses in under 10 minutes without sacrificing marks."
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-xs font-semibold text-slate-900">
                  Daniel P. · University Prep
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: HIGH-CONVERSION QUICK TERMINAL & CLOSER        */}
        {/* ========================================================= */}
        <section id="quick-terminal-section" className="py-20 bg-slate-900 text-white border-t border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-mono-numbers">
                INSTANT ACTIVATION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Generate your first timed paper right now.
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-balance">
                Choose a pre-loaded exemplar pack below or paste your own notes. No credit card, no downloads, instant browser execution.
              </p>
            </div>

            {/* Quick-Launch Terminal Box */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-6 sm:p-8 space-y-5 shadow-2xl">
              {/* Exemplar Quick Selectors */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">
                  Select an Exemplar Revision Pack or Use Your Own:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_NOTE_PACKS.map((pack) => (
                    <button
                      key={pack.id}
                      type="button"
                      onClick={() => {
                        setQuickSubject(pack.subject);
                        setQuickNotes(pack.content);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        quickSubject === pack.subject
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xs'
                          : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold">{pack.subject}</div>
                      <div className="text-[11px] opacity-80 truncate">{pack.topicTitle}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Preview Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Revision Notes Buffer:</span>
                  <span className="font-mono-numbers">{quickNotes.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                  rows={5}
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  placeholder="Paste your revision notes here..."
                  className="w-full p-3.5 text-xs text-slate-200 bg-slate-900 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed resize-y"
                />
              </div>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400">
                  Generates 15–20 marks past paper with full mark schemes
                </div>

                <button
                  type="button"
                  onClick={handleQuickLaunch}
                  disabled={isQuickLaunching}
                  className={`w-full sm:w-auto px-7 py-3 text-sm font-bold text-slate-950 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group ${
                    isQuickLaunching
                      ? 'bg-amber-300 cursor-not-allowed opacity-90'
                      : 'bg-amber-400 hover:bg-amber-300 active:scale-[0.99]'
                  }`}
                >
                  {isQuickLaunching ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                      <span>Synthesizing Exam Paper...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>Generate & Start Exam Hall Mode</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer Trust Guarantee */}
            <div className="text-center text-xs text-slate-500 space-y-1">
              <div>Works seamlessly across desktop, iPad, and laptop browsers.</div>
              <div>Free for all students · Standard academic & collegiate exam criteria aligned.</div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
