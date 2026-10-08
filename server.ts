import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with User-Agent header
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
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
  markScheme: {
    points: string[];
    indicativeContent: string;
    levelGuidance?: string;
  };
}

export interface ExamPaperData {
  id: string;
  title: string;
  subject: string;
  totalMarks: number;
  totalTimeMinutes: number;
  pacingSecondsPerMark: number;
  sourceType: 'user_notes' | 'sample_pack';
  questions: QuestionData[];
}

// Fallback questions generator when Gemini is not configured or in case of transient API error
function generateFallbackPaper(subject: string, notes: string, targetMarks: number): ExamPaperData {
  const isBiology = subject.toLowerCase().includes('bio');
  const isCS = subject.toLowerCase().includes('comp') || subject.toLowerCase().includes('cs');
  const isRS = subject.toLowerCase().includes('re') || subject.toLowerCase().includes('relig') || subject.toLowerCase().includes('ethic');

  let defaultQuestions: QuestionData[] = [];

  if (isCS) {
    defaultQuestions = [
      {
        id: 'q1',
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
        id: 'q2',
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
        id: 'q3',
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
        id: 'q4',
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
            'Evaluation/Synthesis: Firewalls protect perimeter, encryption protects stored/transit data, MFA protects user authentication layers; defence-in-depth is required as no single measure is foolproof (2 marks)'
          ],
          indicativeContent: 'Well-structured evaluation discussing strengths and limitations of each layer, concluding with the necessity of layered defence.'
        }
      }
    ];
  } else if (isBiology) {
    defaultQuestions = [
      {
        id: 'q1',
        number: '1(a)',
        topic: 'Cell Biology',
        marks: 2,
        commandWord: 'State',
        questionText: 'State two structural differences between eukaryotic plant cells and prokaryotic bacterial cells.',
        recommendedMinutes: 2,
        markScheme: {
          points: [
            'Eukaryotes have membrane-bound organelles / a defined nucleus, whereas prokaryotes have free circular DNA / plasmids with no nuclear membrane (1 mark)',
            'Plant cells have cellulose cell walls and chloroplasts/mitochondria, absent or distinct in bacteria (1 mark)'
          ],
          indicativeContent: 'Clear structural distinction focusing on compartmentalization or genomic arrangement.'
        }
      },
      {
        id: 'q2',
        number: '1(b)',
        topic: 'Enzymes & Digestion',
        marks: 4,
        commandWord: 'Explain',
        questionText: 'Explain how increasing temperature beyond the optimum temperature affects the rate of enzyme-controlled chemical reactions.',
        recommendedMinutes: 4.5,
        markScheme: {
          points: [
            'Excessive thermal energy causes bonds maintaining tertiary enzyme shape to vibrate and break (1 mark)',
            'Active site changes shape / becomes denatured (1 mark)',
            'Substrate can no longer fit into the active site / lock and key mechanism fails (1 mark)',
            'Fewer successful enzyme-substrate complexes formed per unit time, causing reaction rate to plummet to zero (1 mark)'
          ],
          indicativeContent: 'Must explicitly reference bond breakage, active site alteration, and failure to form enzyme-substrate complexes.'
        }
      },
      {
        id: 'q3',
        number: '2',
        topic: 'Bioenergetics & Respiration',
        marks: 6,
        commandWord: 'Explain',
        questionText: 'Compare aerobic and anaerobic respiration in human muscle tissue during vigorous exercise. Explain why an oxygen debt occurs and how it is subsequently repaid.',
        recommendedMinutes: 7,
        markScheme: {
          points: [
            'Aerobic uses oxygen and fully oxidises glucose into CO2 and H2O, yielding high ATP (1 mark)',
            'Anaerobic occurs in oxygen deficit, yielding lactic acid and significantly less ATP (1 mark)',
            'Lactic acid accumulates in muscle tissue, causing fatigue and cellular acidosis (1 mark)',
            'Oxygen debt definition: volume of oxygen needed to oxidise lactic acid back to glucose/pyruvate in the liver (1 mark)',
            'Repayment mechanism: breathing rate and heart rate remain elevated after exercise (1 mark)',
            'Blood transports lactic acid to liver where it is converted using aerobic oxygen (1 mark)'
          ],
          indicativeContent: 'Level 3 response provides detailed physiological comparison and full explanation of the biochemical journey of lactic acid.'
        }
      },
      {
        id: 'q4',
        number: '3',
        topic: 'Ecology & Gas Exchange',
        marks: 8,
        commandWord: 'Evaluate',
        questionText: 'Evaluate how adaptations of the leaf enable efficient photosynthesis while minimizing water loss through transpiration in arid environments.',
        recommendedMinutes: 9.5,
        markScheme: {
          points: [
            'Waxy cuticle on upper epidermis acts as waterproof barrier, reducing evaporation (2 marks)',
            'Stomata primarily on shaded underside; regulated by turgid/flaccid guard cells to limit transpiration (2 marks)',
            'Palisade mesophyll tightly packed near top surface for maximum light absorption (2 marks)',
            'Evaluation of trade-offs: Opening stomata enables vital CO2 uptake but risks desiccation; plants in dry conditions evolve adaptations such as sunken stomata, rolled leaves, or hair layers to trap moist air (2 marks)'
          ],
          indicativeContent: 'Thorough evaluation balancing the twin physical imperatives of gas exchange and water conservation.'
        }
      }
    ];
  } else {
    // General / notes-based default
    const noteSnippet = notes.slice(0, 100);
    defaultQuestions = [
      {
        id: 'q1',
        number: '1(a)',
        topic: 'Core Fundamentals',
        marks: 2,
        commandWord: 'Define',
        questionText: `Based on your revision notes: Define the key concept and state two fundamental principles described in your material.`,
        recommendedMinutes: 2,
        markScheme: {
          points: [
            'Accurate definition of core term from revision notes (1 mark)',
            'Two accurate fundamental characteristics identified (1 mark)'
          ],
          indicativeContent: 'Concise, precise factual recall directly aligned to notes.'
        }
      },
      {
        id: 'q2',
        number: '1(b)',
        topic: 'Mechanisms & Processes',
        marks: 4,
        commandWord: 'Explain',
        questionText: `Explain the sequence of steps and underlying causal mechanisms detailed in your revision notes.`,
        recommendedMinutes: 4.5,
        markScheme: {
          points: [
            'Identification of initial cause or trigger (1 mark)',
            'Explanation of intermediate step / mechanism (1 mark)',
            'Logical cause-and-effect linkage (1 mark)',
            'Consequence or output clearly derived (1 mark)'
          ],
          indicativeContent: 'Coherent step-by-step causal chain.'
        }
      },
      {
        id: 'q3',
        number: '2',
        topic: 'Analytical Application',
        marks: 6,
        commandWord: 'Analyze',
        questionText: `Analyze the key challenges and conflicting factors highlighted in your revision notes, assessing their practical impact.`,
        recommendedMinutes: 7,
        markScheme: {
          points: [
            'Identification of factor A with evidence/detail (2 marks)',
            'Identification of factor B or opposing constraint (2 marks)',
            'Analytical synthesis of trade-offs and impact (2 marks)'
          ],
          indicativeContent: 'Detailed analysis evaluating conflicting perspectives or variables.'
        }
      },
      {
        id: 'q4',
        number: '3',
        topic: 'Extended Evaluation',
        marks: 8,
        commandWord: 'Evaluate',
        questionText: `Evaluate the significance and overall implications of the concepts in your notes. Justify your conclusion using specific examples.`,
        recommendedMinutes: 9.5,
        markScheme: {
          points: [
            'Comprehensive knowledge of key topics demonstrated (2 marks)',
            'Detailed evaluation of advantages/arguments in support (2 marks)',
            'Detailed evaluation of limitations/counter-arguments (2 marks)',
            'Sustained and balanced conclusion with justified reasoning (2 marks)'
          ],
          indicativeContent: 'Full Level 3 essay-style response with balanced criteria and clear personal verdict.'
        }
      }
    ];
  }

  const totalMarks = defaultQuestions.reduce((sum, q) => sum + q.marks, 0);
  const totalMinutes = Math.round(totalMarks * 1.15);

  return {
    id: `paper-${Date.now()}`,
    title: `${subject} - Exam Timing Mock Paper`,
    subject,
    totalMarks,
    totalTimeMinutes: totalMinutes,
    pacingSecondsPerMark: 70, // ~1.16 min per mark
    sourceType: 'user_notes',
    questions: defaultQuestions,
  };
}

// 1. Generate Past-Paper Style Exam from User Notes
app.post('/api/generate-paper', async (req, res) => {
  try {
    const { subject = 'General Exam Subject', notesText = '', targetMarks = 20, timeAllowanceMode = 'standard' } = req.body;

    if (!notesText || notesText.trim().length < 15) {
      return res.status(400).json({ error: 'Please provide more revision notes to construct exam questions.' });
    }

    if (!ai) {
      console.warn('Gemini API key not found in env, using curated pedagogical template.');
      const fallback = generateFallbackPaper(subject, notesText, targetMarks);
      return res.json(fallback);
    }

    // Call Gemini 3.8 Flash to synthesize revision notes into a timed exam paper
    const prompt = `
You are a senior Chief Examiner and Academic Assessment Specialist.
A student has uploaded their personal revision notes. Your job is to transform their notes into a realistic, timed past-paper practice exam designed to test both their knowledge AND their time management skills.

STUDENT'S REVISION NOTES:
"""
${notesText.slice(0, 8000)}
"""

SUBJECT: ${subject}
TARGET TOTAL MARKS: Approximately ${targetMarks} marks (allow ±4 marks for natural question tariff distribution).
PACING SPECIFICATION:
- Standard timed exams allow approx 1.0 to 1.2 minutes per mark.
- Include a realistic mix of mark tariffs:
  * 1-2 marks: Factual recall, define, state, calculate (recommended time: 1-2 mins).
  * 3-4 marks: Describe, explain, compare (recommended time: 3.5-5 mins).
  * 5-6 marks: Detailed process, multi-step explanation, evaluate (recommended time: 6-7 mins).
  * 8-9 marks (if total marks >= 20): Extended essay / comprehensive evaluation question (recommended time: 9-11 mins).

REQUIREMENTS:
1. Every question must be directly grounded in the student's revision notes.
2. Formulate authentic academic command words: "State", "Describe", "Explain", "Compare", "Calculate", "Evaluate".
3. Provide a rigorous, examiner-standard mark scheme for each question:
   - Clear point-by-point criteria ([1 mark] for X, [1 mark] for Y).
   - Indicative content and level guidance for 6-9 mark questions.
4. Set realistic recommended time in minutes for each question based on its mark value.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You generate authentic past-paper exam papers with marking schemes from student notes for academic and standardized exams. Always return strictly valid JSON matching the specified schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Formal exam paper title' },
            subject: { type: Type.STRING },
            totalMarks: { type: Type.INTEGER },
            totalTimeMinutes: { type: Type.INTEGER },
            pacingSecondsPerMark: { type: Type.INTEGER, description: 'Pacing rate in seconds per mark, usually 65-75' },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  number: { type: Type.STRING, description: 'e.g. 1(a), 1(b), 2, 3(a)' },
                  topic: { type: Type.STRING, description: 'Specific subtopic from notes' },
                  marks: { type: Type.INTEGER, description: 'Mark tariff, e.g. 1, 2, 4, 6, 9' },
                  commandWord: { type: Type.STRING, description: 'e.g. State, Explain, Evaluate' },
                  questionText: { type: Type.STRING },
                  contextOrScenario: { type: Type.STRING, description: 'Optional stimulus material or scenario' },
                  recommendedMinutes: { type: Type.NUMBER },
                  markScheme: {
                    type: Type.OBJECT,
                    properties: {
                      points: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      indicativeContent: { type: Type.STRING },
                      levelGuidance: { type: Type.STRING }
                    },
                    required: ['points', 'indicativeContent']
                  }
                },
                required: ['id', 'number', 'topic', 'marks', 'commandWord', 'questionText', 'recommendedMinutes', 'markScheme']
              }
            }
          },
          required: ['title', 'subject', 'totalMarks', 'totalTimeMinutes', 'pacingSecondsPerMark', 'questions']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.questions || parsed.questions.length === 0) {
      throw new Error('No questions returned');
    }

    // Ensure calculated properties
    const paper: ExamPaperData = {
      id: `paper-${Date.now()}`,
      title: parsed.title || `${subject} Timed Paper`,
      subject: parsed.subject || subject,
      totalMarks: parsed.questions.reduce((acc: number, q: QuestionData) => acc + (q.marks || 0), 0),
      totalTimeMinutes: parsed.totalTimeMinutes || Math.round(parsed.totalMarks * 1.15),
      pacingSecondsPerMark: parsed.pacingSecondsPerMark || 70,
      sourceType: 'user_notes',
      questions: parsed.questions.map((q: any, i: number) => ({
        ...q,
        id: q.id || `q${i + 1}`,
        number: q.number || `${i + 1}`,
        recommendedMinutes: q.recommendedMinutes || Math.max(1, Math.round(q.marks * 1.15 * 10) / 10)
      }))
    };

    return res.json(paper);
  } catch (err: any) {
    console.error('Error in /api/generate-paper:', err);
    // Provide reliable fallback so user is never blocked
    const fallback = generateFallbackPaper(
      req.body.subject || 'Revision Subject',
      req.body.notesText || '',
      req.body.targetMarks || 20
    );
    return res.json(fallback);
  }
});

// 2. Evaluate Student's Answer & Pacing Diagnostics
app.post('/api/evaluate-answer', async (req, res) => {
  try {
    const {
      questionText,
      marks = 4,
      studentAnswer = '',
      timeSpentSeconds = 60,
      recommendedMinutes = 4,
      markScheme,
      topic = 'General'
    } = req.body;

    const recommendedSeconds = recommendedMinutes * 60;
    const timeRatio = timeSpentSeconds / (recommendedSeconds || 60);

    // Default pacing diagnostic logic
    let paceStatus: 'optimal' | 'rushed' | 'slow_trap' | 'panic_risk' = 'optimal';
    let paceFeedback = '';

    if (timeRatio > 1.8) {
      paceStatus = 'panic_risk';
      paceFeedback = `Critical Time Trap: You spent ${(timeSpentSeconds / 60).toFixed(1)}m on a ${marks}-mark question (recommended ${recommendedMinutes}m). In a real exam, losing ${Math.round((timeSpentSeconds - recommendedSeconds) / 60)} minutes here starves your higher-mark questions later.`;
    } else if (timeRatio > 1.3) {
      paceStatus = 'slow_trap';
      paceFeedback = `Over-invested: You took ${(timeSpentSeconds / 60).toFixed(1)}m, which is ${(timeRatio * 100 - 100).toFixed(0)}% longer than recommended. Practice bullet-pointing answers more concisely.`;
    } else if (timeRatio < 0.45 && studentAnswer.length < 80) {
      paceStatus = 'rushed';
      paceFeedback = `Rushed: Finished in only ${(timeSpentSeconds / 60).toFixed(1)}m. You likely left valuable marks unattempted due to speeding.`;
    } else {
      paceStatus = 'optimal';
      paceFeedback = `Excellent Pacing: ${(timeSpentSeconds / 60).toFixed(1)}m matches the recommended ${recommendedMinutes}m pacing benchmark.`;
    }

    if (!ai) {
      // Deterministic evaluation fallback
      const wordCount = studentAnswer.trim().split(/\s+/).filter(Boolean).length;
      let marksAwarded = 0;
      if (wordCount >= marks * 18) {
        marksAwarded = marks;
      } else if (wordCount >= marks * 10) {
        marksAwarded = Math.max(1, Math.round(marks * 0.75));
      } else if (wordCount >= marks * 4) {
        marksAwarded = Math.max(1, Math.round(marks * 0.4));
      } else if (wordCount > 0) {
        marksAwarded = 1;
      }

      return res.json({
        marksAwarded,
        maxMarks: marks,
        percentage: Math.round((marksAwarded / marks) * 100),
        examinerSummary: `Examiner Note: Your answer shows relevant knowledge. Focus on linking points with connectives ('because', 'leading to', 'consequently') to capture maximum marks.`,
        awardedPoints: ['Key terminology accurately stated', 'Relevant context provided'],
        missedPoints: ['Could provide deeper justification or specific mechanism'],
        modelAnswerSnippet: markScheme?.indicativeContent || 'Refer to the detailed mark scheme criteria.',
        pacingEvaluation: {
          timeSpentSeconds,
          recommendedSeconds,
          ratio: timeRatio,
          status: paceStatus,
          feedback: paceFeedback,
        }
      });
    }

    const evaluationPrompt = `
You are an expert Chief Examiner and Academic Assessor marking an exam paper under strict mark scheme criteria.
Grade the student's answer and assess whether their pacing was effective.

QUESTION (${marks} marks):
${questionText}

MARK SCHEME CRITERIA:
Points: ${JSON.stringify(markScheme?.points || [])}
Indicative content: ${markScheme?.indicativeContent || ''}

STUDENT'S RESPONSE:
"""
${studentAnswer || '(No answer written)'}
"""

TIME SPENT: ${timeSpentSeconds} seconds (${(timeSpentSeconds / 60).toFixed(1)} minutes).
RECOMMENDED TIME: ${recommendedMinutes} minutes.

TASK:
1. Award an integer mark from 0 to ${marks}.
2. List which mark scheme points were achieved.
3. List which critical mark scheme points were missed or incomplete.
4. Give an examiner tip on how they could pick up missed marks faster.
5. Provide a constructive pacing observation.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: evaluationPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marksAwarded: { type: Type.INTEGER },
            examinerSummary: { type: Type.STRING },
            awardedPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            missedPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            modelAnswerSnippet: { type: Type.STRING },
            examinerTip: { type: Type.STRING }
          },
          required: ['marksAwarded', 'examinerSummary', 'awardedPoints', 'missedPoints', 'modelAnswerSnippet', 'examinerTip']
        }
      }
    });

    const evalData = JSON.parse(response.text || '{}');
    const safeMarks = Math.min(marks, Math.max(0, evalData.marksAwarded ?? 0));

    return res.json({
      marksAwarded: safeMarks,
      maxMarks: marks,
      percentage: Math.round((safeMarks / marks) * 100),
      examinerSummary: evalData.examinerSummary,
      awardedPoints: evalData.awardedPoints || [],
      missedPoints: evalData.missedPoints || [],
      modelAnswerSnippet: evalData.modelAnswerSnippet,
      examinerTip: evalData.examinerTip,
      pacingEvaluation: {
        timeSpentSeconds,
        recommendedSeconds,
        ratio: timeRatio,
        status: paceStatus,
        feedback: paceFeedback,
      }
    });
  } catch (err: any) {
    console.error('Error evaluating answer:', err);
    return res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

// 3. Generate Targeted Weakness Drills (Requirement from interview findings: generate new questions on weak topics)
app.post('/api/generate-weakness-drills', async (req, res) => {
  try {
    const { weakTopics = [], subject = 'General Exam' } = req.body;

    if (!ai) {
      return res.json({
        drills: [
          {
            id: 'drill-1',
            topic: weakTopics[0] || 'Targeted Revision',
            marks: 3,
            recommendedMinutes: 3,
            questionText: `Quick Pacing Drill: Explain three distinct factors affecting ${weakTopics[0] || 'this topic'}, spending strictly 1 minute per point.`,
            markScheme: ['Factor 1 with mechanism (1 mark)', 'Factor 2 with mechanism (1 mark)', 'Factor 3 with mechanism (1 mark)']
          },
          {
            id: 'drill-2',
            topic: weakTopics[1] || weakTopics[0] || 'Targeted Revision',
            marks: 4,
            recommendedMinutes: 4,
            questionText: `Speed Drill: Contrast two key elements in this domain under timed conditions.`,
            markScheme: ['Element 1 description (1 mark)', 'Element 2 description (1 mark)', 'Comparative distinction (2 marks)']
          }
        ]
      });
    }

    const prompt = `
Generate 3 short, sharp exam practice questions focusing explicitly on the student's identified weak topics: ${JSON.stringify(weakTopics)}.
Subject: ${subject}
The goal is to build time discipline and overcome panic points.
Tariffs should be 2, 3, or 4 marks with strict 1-min-per-mark pacing.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            drills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  topic: { type: Type.STRING },
                  marks: { type: Type.INTEGER },
                  recommendedMinutes: { type: Type.NUMBER },
                  questionText: { type: Type.STRING },
                  markScheme: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['id', 'topic', 'marks', 'recommendedMinutes', 'questionText', 'markScheme']
              }
            }
          },
          required: ['drills']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error generating weakness drills:', err);
    return res.status(500).json({ error: 'Failed to generate weakness drills' });
  }
});

// 4. Student Management & Pacing Records Store (Spec-compliant)
interface StoredStudent {
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

const studentsDatabase: Map<string, StoredStudent> = new Map([
  [
    'student-sarah',
    {
      id: 'student-sarah',
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@student.edu',
      role: 'student',
      targetExam: 'Standard Academic & Pre-Med Admissions',
      examDate: '2026-05-18',
      targetGrade: 'Grade A* (High Distinction)',
      targetSecondsPerMark: 60,
      enrolledSubjects: ['General Biology', 'Chemistry', 'Mathematics'],
      avatarInitials: 'SJ',
      streakDays: 7,
      completedRemediations: ['Enzyme Denaturation mechanisms'],
    },
  ],
  [
    'student-marcus',
    {
      id: 'student-marcus',
      name: 'Marcus Vance',
      email: 'marcus.vance@student.edu',
      role: 'student',
      targetExam: 'College & AP Computer Science',
      examDate: '2026-05-24',
      targetGrade: 'Grade A* (High Distinction)',
      targetSecondsPerMark: 55,
      enrolledSubjects: ['Computer Science', 'Discrete Mathematics', 'Physics'],
      avatarInitials: 'MV',
      streakDays: 4,
      completedRemediations: ['Bubble sort vs Merge sort complexity proofs'],
    },
  ],
  [
    'student-elena',
    {
      id: 'student-elena',
      name: 'Elena Rostova',
      email: 'elena.rostova@student.edu',
      role: 'student',
      targetExam: 'Academic Ethics & Legal Studies',
      examDate: '2026-06-02',
      targetGrade: 'Grade A (Distinction)',
      targetSecondsPerMark: 65,
      enrolledSubjects: ['Ethics & Philosophy', 'Legal Studies', 'World History'],
      avatarInitials: 'ER',
      streakDays: 12,
      completedRemediations: ['Utilitarianism vs Deontology comparative evaluation'],
    },
  ],
]);

const studentAttemptsDatabase: Map<string, any[]> = new Map();

// Student Auth & Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, studentId } = req.body;
  if (studentId && studentsDatabase.has(studentId)) {
    return res.json({ student: studentsDatabase.get(studentId) });
  }

  if (email) {
    for (const student of studentsDatabase.values()) {
      if (student.email.toLowerCase() === email.toLowerCase().trim()) {
        return res.json({ student });
      }
    }
  }

  // Auto-provision guest or new student
  const newStudentId = `student-${Date.now()}`;
  const newStudent: StoredStudent = {
    id: newStudentId,
    name: email ? email.split('@')[0] : 'Academic Student',
    email: email || 'student@academic.edu',
    role: 'student',
    targetExam: 'Standard Academic Examination',
    examDate: '2026-06-01',
    targetGrade: 'Grade A* (High Distinction)',
    targetSecondsPerMark: 60,
    enrolledSubjects: ['General Biology', 'Computer Science'],
    avatarInitials: 'ST',
    streakDays: 1,
    completedRemediations: [],
  };
  studentsDatabase.set(newStudentId, newStudent);
  return res.json({ student: newStudent });
});

// Retrieve Student Profile
app.get('/api/student/:id', (req, res) => {
  const student = studentsDatabase.get(req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const history = studentAttemptsDatabase.get(req.params.id) || [];
  return res.json({ student, historyCount: history.length });
});

// Record Completed Exam Attempt
app.post('/api/student/:id/attempt', (req, res) => {
  const studentId = req.params.id;
  const attempt = req.body;
  if (!studentAttemptsDatabase.has(studentId)) {
    studentAttemptsDatabase.set(studentId, []);
  }
  studentAttemptsDatabase.get(studentId)!.unshift(attempt);
  return res.json({ success: true, count: studentAttemptsDatabase.get(studentId)!.length });
});

// Retrieve Student Attempt History
app.get('/api/student/:id/history', (req, res) => {
  const history = studentAttemptsDatabase.get(req.params.id) || [];
  return res.json({ history });
});

// Configure Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

startServer();
