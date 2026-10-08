import React from 'react';
import { Timer, ArrowRight, Play, CheckCircle2, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { ExamPaperData } from '../types';
import { SAMPLE_EXAM_PAPER } from '../data/sampleReport';
import { SAMPLE_NOTE_PACKS } from '../data/sampleNotes';

interface ExamRoomLauncherProps {
  onLaunchPaper: (paper: ExamPaperData) => void;
  onGoToUpload: () => void;
}

export const ExamRoomLauncher: React.FC<ExamRoomLauncherProps> = ({
  onLaunchPaper,
  onGoToUpload,
}) => {
  // Pre-configured ready-to-test papers
  const handleLaunchSampleBiology = () => {
    onLaunchPaper(SAMPLE_EXAM_PAPER);
  };

  const handleLaunchCS = () => {
    const csPaper: ExamPaperData = {
      id: `paper-cs-${Date.now()}`,
      title: 'Computer Science: CPU Architecture, Memory & Algorithms',
      subject: 'Computer Science',
      examBoard: 'College / AP',
      totalMarks: 20,
      totalTimeMinutes: 23,
      pacingSecondsPerMark: 70,
      sourceType: 'sample_pack',
      createdAt: Date.now(),
      questions: [
        {
          id: 'cs-q1',
          number: '1(a)',
          topic: 'System Architecture',
          marks: 2,
          commandWord: 'State',
          questionText: 'State two components of the CPU that follow the Von Neumann architecture, and identify the primary role of the Program Counter (PC).',
          recommendedMinutes: 2,
          markScheme: {
            points: [
              'Any valid component: ALU / CU / Cache / Accumulator / MAR / MDR (1 mark)',
              'Role of PC: Holds the memory address of the next instruction to be fetched and executed (1 mark)'
            ],
            indicativeContent: 'Candidates must correctly identify a CPU register/component and clearly explain the increment/sequencing role of the PC.'
          }
        },
        {
          id: 'cs-q2',
          number: '1(b)',
          topic: 'Memory and Storage',
          marks: 4,
          commandWord: 'Explain',
          questionText: 'Explain the difference between volatile and non-volatile memory, using RAM and ROM as examples.',
          recommendedMinutes: 4.5,
          markScheme: {
            points: [
              'Volatile memory loses its contents when power is switched off, e.g. RAM (1 mark)',
              'Non-volatile memory retains data permanently even without electrical power, e.g. ROM (1 mark)',
              'RAM stores currently open programs/OS data during execution (1 mark)',
              'ROM holds the bootstrap loader / BIOS essential for starting up the machine (1 mark)'
            ],
            indicativeContent: 'Complete comparative explanation linking power dependency with specific functional use cases in modern computing.'
          }
        },
        {
          id: 'cs-q3',
          number: '2',
          topic: 'Algorithms & Computational Logic',
          marks: 6,
          commandWord: 'Compare',
          questionText: 'A developer needs to sort an array of 500 items. Compare the efficiency and working mechanics of a Bubble Sort algorithm with a Merge Sort algorithm. Refer to both time efficiency and memory usage.',
          recommendedMinutes: 7,
          markScheme: {
            points: [
              'Bubble sort compares adjacent pairs and swaps them repeatedly (1 mark)',
              'Merge sort is a divide-and-conquer algorithm splitting the list into sublists (1 mark)',
              'Bubble sort has average/worst case time complexity of O(n^2), becoming inefficient on 500 items (1 mark)',
              'Merge sort operates at O(n log n) efficiency, scaling significantly faster on larger datasets (1 mark)',
              'Memory comparison: Bubble sort operates in-place (O(1) auxiliary memory) (1 mark)',
              'Merge sort requires additional memory buffer space to merge arrays (1 mark)'
            ],
            indicativeContent: 'Level 3 response balances algorithmic operational steps with rigorous comparison of time scaling and memory overheads.'
          }
        },
        {
          id: 'cs-q4',
          number: '3',
          topic: 'Network Security & Protocols',
          marks: 8,
          commandWord: 'Evaluate',
          questionText: 'Evaluate the effectiveness of using encryption, firewalls, and multi-factor authentication (MFA) to protect a school database from unauthorized external access.',
          recommendedMinutes: 9.5,
          markScheme: {
            points: [
              'Encryption scrambles data using a cryptographic key; renders intercepted packets useless without cipher key (2 marks)',
              'Firewalls monitor incoming/outgoing network packets against rule sets; block unauthorised ports/IPs (2 marks)',
              'MFA prevents unauthorized sign-ins even if passwords are compromised via phishing/credential stuffing (2 marks)',
              'Evaluation/Synthesis: Layered defence is mandatory because firewalls protect network perimeter, encryption secures stored data, and MFA guards identity credentials (2 marks)'
            ],
            indicativeContent: 'Well-structured evaluation discussing strengths and limitations of each layer, concluding with the necessity of layered defence.'
          }
        }
      ]
    };
    onLaunchPaper(csPaper);
  };

  const handleLaunchRS = () => {
    const rsPaper: ExamPaperData = {
      id: `paper-rs-${Date.now()}`,
      title: 'Ethics & Philosophy: Medical Ethics, Sanctity of Life vs Quality of Life',
      subject: 'Ethics & Philosophy',
      examBoard: 'University / General',
      totalMarks: 20,
      totalTimeMinutes: 24,
      pacingSecondsPerMark: 72,
      sourceType: 'sample_pack',
      createdAt: Date.now(),
      questions: [
        {
          id: 'rs-q1',
          number: '1(a)',
          topic: 'Sanctity of Life',
          marks: 2,
          commandWord: 'Outline',
          questionText: 'Outline two religious beliefs about the sanctity of human life.',
          recommendedMinutes: 2,
          markScheme: {
            points: [
              'Life is created by God in His image (Imago Dei) and is intrinsically sacred (1 mark)',
              'Only God possesses divine authority to give and take life (Job 1:21) (1 mark)'
            ],
            indicativeContent: 'Clear statement of divine origin and sovereignty.'
          }
        },
        {
          id: 'rs-q2',
          number: '1(b)',
          topic: 'Euthanasia & Medical Ethics',
          marks: 4,
          commandWord: 'Explain',
          questionText: 'Explain the difference between active euthanasia and passive euthanasia. Refer to Christian teaching in your response.',
          recommendedMinutes: 4.5,
          markScheme: {
            points: [
              'Active euthanasia involves deliberate lethal medical action (e.g. fatal injection) to end life (1 mark)',
              'Passive euthanasia involves withholding or withdrawing burdensome treatments allowing natural death (1 mark)',
              'Catholic Church condemns active euthanasia as a violation of the 6th Commandment ("Thou shalt not kill") (1 mark)',
              'Doctrine of Double Effect permits heavy pain relief even if it foreseeably shortens life, as the intention is solely pain relief (1 mark)'
            ],
            indicativeContent: 'Explicit doctrinal distinction between commission and omission.'
          }
        },
        {
          id: 'rs-q3',
          number: '2',
          topic: 'Palliative Care & Hospices',
          marks: 5,
          commandWord: 'Explain',
          questionText: 'Explain how the hospice movement reflects religious teachings on compassion and human dignity.',
          recommendedMinutes: 6,
          markScheme: {
            points: [
              'Founded by Dame Cicely Saunders with Christian ethos to care for whole person (physical, emotional, spiritual) (1 mark)',
              'Fulfills Jesus’ teaching of the Good Samaritan and agape love (1 mark)',
              'Focuses on pain relief and dignity rather than premature termination of life (1 mark)',
              'Affirms the Sanctity of Life by valuing individuals until their natural end (1 mark)',
              'Supports grieving families, living out pastoral compassion (1 mark)'
            ],
            indicativeContent: 'Detailed explanation of holistic palliative principles aligned to religious compassion.'
          }
        },
        {
          id: 'rs-q4',
          number: '3',
          topic: 'Philosophy & Ethics Extended Essay',
          marks: 9,
          commandWord: 'Evaluate',
          questionText: '"The quality of a person\'s life is more important than the sanctity of their life." Evaluate this statement. In your answer, you should consider religious and non-religious points of view and reach a justified conclusion.',
          recommendedMinutes: 11,
          markScheme: {
            points: [
              'Arguments for Quality of Life: Utilitarian ethics (Peter Singer), human dignity, bodily autonomy, preventing cruel suffering (3 marks)',
              'Arguments for Sanctity of Life: Imago Dei, life is a gift/trust (Amanah in Islam), slippery slope arguments, palliative alternatives (3 marks)',
              'Critical synthesis: Weighing absolute divine morality against compassionate medical autonomy (3 marks)'
            ],
            indicativeContent: 'Level 4 response balances theological scriptural quotes with secular autonomy arguments, ending in a logically sustained personal verdict.'
          }
        }
      ]
    };
    onLaunchPaper(rsPaper);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono-numbers">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Exam Hall · Ready For Testing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Enter the Timed Exam Room
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Experience genuine timed hall conditions. The on-screen exam hall measures how many seconds you spend on every question, alerts you before you fall into panic traps, and enforces the standard 1 mark ≈ 1 minute pacing rule.
        </p>

        {/* 3 Core Rules */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-blue-600" />
              <span>Per-Question Stopwatch</span>
            </span>
            <p className="text-slate-500">
              Each question has its own live timer calculated from its mark tariff.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Panic Trap Warnings</span>
            </span>
            <p className="text-slate-500">
              Overspending on a 1-2 mark question triggers a visual pacing prompt.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Instant Examiner Audit</span>
            </span>
            <p className="text-slate-500">
              On submission, receive full mark scheme scoring and offline PDF export.
            </p>
          </div>
        </div>
      </div>

      {/* Select Paper to Start */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Choose an Exam Paper to Sit Now
            </h2>
            <p className="text-xs text-slate-500">
              Select an exemplar standard past paper or create one from your revision notes.
            </p>
          </div>

          <button
            onClick={onGoToUpload}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>Upload My Own Notes Instead</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: General Biology */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-numbers">
                <span className="font-bold text-blue-700">Standard Academic</span>
                <span className="text-slate-500">20 Marks · 24 Mins</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                General Biology: Respiration & Enzymes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tests cell structure recall, lock-and-key enzyme denaturation, 6-mark aerobic vs anaerobic essay, and leaf gas exchange adaptations.
              </p>
              <div className="text-[11px] text-slate-500 pt-1 font-mono-numbers">
                Tariffs: 2m, 4m, 6m, 8m questions
              </div>
            </div>

            <button
              onClick={handleLaunchSampleBiology}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Biology Mock Exam</span>
            </button>
          </div>

          {/* Card 2: Computer Science */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-numbers">
                <span className="font-bold text-purple-700">College / AP</span>
                <span className="text-slate-500">20 Marks · 23 Mins</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Computer Science: Architecture & Sorting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tests Von Neumann CPU registers, volatile vs non-volatile memory, 6-mark Bubble sort vs Merge sort comparison, and security protocols.
              </p>
              <div className="text-[11px] text-slate-500 pt-1 font-mono-numbers">
                Tariffs: 2m, 4m, 6m, 8m questions
              </div>
            </div>

            <button
              onClick={handleLaunchCS}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Computer Science Mock</span>
            </button>
          </div>

          {/* Card 3: Ethics & Philosophy */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono-numbers">
                <span className="font-bold text-emerald-700">University / General</span>
                <span className="text-slate-500">20 Marks · 24 Mins</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Ethics & Philosophy: Medical Ethics
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tests Sanctity of Life vs Quality of Life, active vs passive euthanasia doctrines, palliative hospice care, and 9-mark evaluation essay.
              </p>
              <div className="text-[11px] text-slate-500 pt-1 font-mono-numbers">
                Tariffs: 2m, 4m, 5m, 9m essay
              </div>
            </div>

            <button
              onClick={handleLaunchRS}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Ethics Mock Exam</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
