import React, { useState } from 'react';
import { UploadCloud, Sparkles, BookOpen, Clock, AlertCircle, ArrowRight, CheckCircle2, FileText } from 'lucide-react';
import { ExamPaperData } from '../types';
import { SAMPLE_NOTE_PACKS, SampleNotePack } from '../data/sampleNotes';

interface NoteUploaderProps {
  onPaperGenerated: (paper: ExamPaperData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const NoteUploader: React.FC<NoteUploaderProps> = ({
  onPaperGenerated,
  isLoading,
  setIsLoading
}) => {
  const [subject, setSubject] = useState('General Biology');
  const [examBoard, setExamBoard] = useState<string>('Standard Academic');
  const [notesContent, setNotesContent] = useState('');
  const [targetMarks, setTargetMarks] = useState<number>(20);
  const [pacingMode, setPacingMode] = useState<'standard' | 'strict' | 'extra_time'>('standard');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const wordCount = notesContent.trim().split(/\s+/).filter(Boolean).length;

  const handleSelectSample = (pack: SampleNotePack) => {
    setSubject(pack.subject);
    setExamBoard(pack.examBoard);
    setNotesContent(pack.content);
    setErrorMsg(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File exceeds 5MB size limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setNotesContent(text);
        setErrorMsg(null);
        // Try to infer subject from file name
        const lowerName = file.name.toLowerCase();
        if (lowerName.includes('bio')) setSubject('Biology');
        else if (lowerName.includes('cs') || lowerName.includes('comp')) setSubject('Computer Science');
        else if (lowerName.includes('chem')) setSubject('Chemistry');
        else if (lowerName.includes('phys')) setSubject('Physics');
        else if (lowerName.includes('re') || lowerName.includes('relig') || lowerName.includes('ethic')) setSubject('Ethics & Philosophy');
        else if (lowerName.includes('hist')) setSubject('History');
        else if (lowerName.includes('econ')) setSubject('Economics');
        else if (lowerName.includes('psych')) setSubject('Psychology');
      }
    };
    reader.readAsText(file);
  };

  const handleGeneratePaper = async () => {
    if (!notesContent.trim() || wordCount < 30) {
      setErrorMsg('Please paste or upload at least 30-50 words of revision notes so our exam generator can extract questions.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      setLoadingStep('Analyzing revision notes and syllabus concepts...');
      const stepTimer1 = setTimeout(() => {
        setLoadingStep('Balancing question tariffs (1-mark recall to 6/9-mark analytical evaluation)...');
      }, 1400);

      const stepTimer2 = setTimeout(() => {
        setLoadingStep('Writing official exam board mark schemes and pacing benchmarks...');
      }, 3000);

      const response = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          notesText: notesContent,
          targetMarks,
          timeAllowanceMode: pacingMode,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!response.ok) {
        throw new Error(`Failed to generate exam paper (Status: ${response.status})`);
      }

      const paperData: ExamPaperData = await response.json();
      paperData.examBoard = examBoard;
      paperData.sourceSnippet = notesContent.slice(0, 160) + '...';
      paperData.createdAt = Date.now();

      onPaperGenerated(paperData);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to generate past paper. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>Past Paper Synthesis</span>
              <span>·</span>
              <span>Per-Question Timing</span>
              <span>·</span>
              <span>Panic Zone Diagnostics</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Turn your revision notes into realistic timed exam papers.
            </h1>

            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Knowing your content isn't enough if you run out of time in the exam.
              Upload your notes to generate authentic timed exam papers, track your seconds per question, and eliminate panic on high-mark tariffs.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1-Mark to 9-Mark Tariffs</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Per-Question Stopwatch</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Official Mark Schemes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-slate-100 border-t lg:border-t-0 lg:border-l border-slate-200">
            <img
              src="/src/assets/images/hero_revision_exam_1791358347035.jpg"
              alt="Revision notes desk with exam pacing timer"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 text-xs text-white/90 font-medium drop-shadow-sm flex items-center justify-between">
              <span>Exam hall conditions</span>
              <span>1 mark ≈ 1 minute discipline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Pre-load Curated Sample Notes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              1. Or start with curated exemplar revision packs
            </h2>
            <p className="text-xs text-slate-500">
              Tested exemplar notes designed to expose real exam pacing traps across key academic subjects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_NOTE_PACKS.map((pack) => (
            <button
              key={pack.id}
              type="button"
              onClick={() => handleSelectSample(pack)}
              className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 hover:shadow-xs transition-all flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{pack.subject}</span>
                  <span className="font-semibold text-slate-700">{pack.examBoard}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {pack.topicTitle}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {pack.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>{pack.tag}</span>
                <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Load Notes <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Note Upload and Customization */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              2. Upload or paste your revision notes
            </h2>
            <p className="text-xs text-slate-500">
              Paste class summaries, flashcard exports, textbook notes, or past mark schemes.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono-numbers">
            {wordCount} words loaded
          </div>
        </div>

        {/* Paper Configurations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Biology, History, Computer Science, Economics"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-slate-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Exam Standard / Level
            </label>
            <select
              value={examBoard}
              onChange={(e) => setExamBoard(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-slate-50 focus:bg-white"
            >
              <option value="Standard Academic">Standard Academic (Rigorous Command Words)</option>
              <option value="College / AP">College / AP (Analytical & Evidence Criteria)</option>
              <option value="University">University (Detailed Specification Logic)</option>
              <option value="Professional">Professional / Certification (Practical Assessment)</option>
              <option value="General">General Exam (Standard Assessment)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Exam Length & Marks
            </label>
            <select
              value={targetMarks}
              onChange={(e) => setTargetMarks(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-slate-50 focus:bg-white"
            >
              <option value={15}>Quick Sprint (15 Marks · ~18 mins)</option>
              <option value={20}>Standard Section (~20 Marks · ~24 mins)</option>
              <option value={35}>Half Mock Paper (~35 Marks · ~42 mins)</option>
              <option value={50}>Full Mock Paper (~50 Marks · ~60 mins)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pacing Rate
            </label>
            <select
              value={pacingMode}
              onChange={(e) => setPacingMode(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-slate-50 focus:bg-white"
            >
              <option value="standard">Standard Exam Pace (1.15 min / mark)</option>
              <option value="strict">Strict Speed Sprint (1.0 min / mark)</option>
              <option value="extra_time">25% Extra Time (1.45 min / mark)</option>
            </select>
          </div>
        </div>

        {/* Text Area and File Upload Dropzone */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              rows={9}
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              placeholder="Paste your revision notes here... (e.g. definitions, process steps, diagrams descriptions, essay points, formulas, or key terms)"
              className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50/70 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent font-sans leading-relaxed resize-y"
            />

            {/* Quick Upload Button on bottom right of textarea */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <label className="cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors">
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload Text / Notes File</span>
                <input
                  type="file"
                  accept=".txt,.md,.text"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Supports .txt, .md, pasted lecture/class notes, or syllabus summaries</span>
            {notesContent && (
              <button
                type="button"
                onClick={() => setNotesContent('')}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                Clear notes
              </button>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>
              Expected exam duration: ~{Math.round(targetMarks * (pacingMode === 'strict' ? 1.0 : pacingMode === 'extra_time' ? 1.45 : 1.15))} minutes
            </span>
          </div>

          <button
            type="button"
            onClick={handleGeneratePaper}
            disabled={isLoading || wordCount < 30}
            className={`w-full sm:w-auto px-6 py-3 text-sm font-semibold rounded-xl text-white transition-all shadow-xs flex items-center justify-center gap-2 ${
              isLoading || wordCount < 30
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Timed Paper...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Timed Past Paper</span>
              </>
            )}
          </button>
        </div>

        {/* Loading Steps Feedback */}
        {isLoading && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs space-y-2 animate-pulse">
            <div className="flex items-center gap-2 font-medium">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>{loadingStep || 'Generating exam questions from your notes...'}</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Extracting specific terminology, setting realistic mark allocations, and crafting examiner mark schemes.
            </p>
          </div>
        )}
      </div>

      {/* Stakeholder Value Highlights based on Project Analysis Document */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Real Timed Conditions
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Seneca and BBC Bitesize focus on content, but don't train your exam stamina. PaceMark runs actual countdown conditions so you don't freeze on exam day.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Per-Question Time Tracking
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Stop losing marks on 6-mark and 9-mark essay questions because you spent 5 minutes pondering a 1-mark recall question. See exactly where your seconds go.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Panic Zone Diagnostics
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            After submission, get a question-by-question breakdown identifying whether you rushed, took optimal time, or suffered a time-trap on specific topics.
          </p>
        </div>
      </div>
    </div>
  );
};
