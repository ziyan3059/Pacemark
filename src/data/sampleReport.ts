import { ExamPaperData, ExamAttemptResult } from '../types';

export const SAMPLE_EXAM_PAPER: ExamPaperData = {
  id: 'paper-sample-bio',
  title: 'Biology: Cell Biology, Enzymes & Respiration',
  subject: 'Biology',
  examBoard: 'Standard Academic',
  totalMarks: 20,
  totalTimeMinutes: 24,
  pacingSecondsPerMark: 70,
  sourceType: 'sample_pack',
  createdAt: Date.now() - 3600000,
  questions: [
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
      commandWord: 'Compare & Explain',
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
  ]
};

export const SAMPLE_EXAM_REPORT: ExamAttemptResult = {
  id: 'attempt-sample-01',
  paperId: SAMPLE_EXAM_PAPER.id,
  paperTitle: SAMPLE_EXAM_PAPER.title,
  subject: SAMPLE_EXAM_PAPER.subject,
  completedAt: Date.now() - 1800000,
  totalTimeSpentSeconds: 1350, // 22m 30s
  allocatedTimeSeconds: 1440, // 24m
  totalMarksAwarded: 16,
  maxPossibleMarks: 20,
  percentage: 80,
  gradeEstimated: 'Grade A (High Merit / 80%)',
  pacingDisciplineScore: 75,
  panicTrapsCount: 1,
  weakTopics: [
    {
      topic: 'Enzymes & Digestion',
      marksLost: 1,
      timeLostSeconds: 140, // spent over 6m on a 4-marker
      questionsCount: 1,
    },
    {
      topic: 'Ecology & Gas Exchange',
      marksLost: 2,
      timeLostSeconds: 30,
      questionsCount: 1,
    }
  ],
  studentAnswers: {
    q1: {
      questionId: 'q1',
      answerText: 'Plant cells have a cellulose cell wall and a true membrane-bound nucleus, whereas bacterial cells have circular loop DNA with plasmids and no nuclear membrane.',
      timeSpentSeconds: 110,
      isFlagged: false,
    },
    q2: {
      questionId: 'q2',
      answerText: 'When temperature increases above 40 degrees, the enzyme molecules gain so much kinetic energy that the bonds holding the active site vibrate excessively and break. The active site denatures and changes its tertiary shape. This means the lock and key mechanism fails because the substrate can no longer fit into the active site, stopping enzyme-substrate complexes from forming.',
      timeSpentSeconds: 395, // over 6.5 mins! (Time trap)
      isFlagged: true,
    },
    q3: {
      questionId: 'q3',
      answerText: 'Aerobic respiration uses oxygen to fully oxidize glucose into CO2 and water, releasing 32 ATP molecules. Anaerobic respiration occurs when muscles work vigorously without enough oxygen, producing lactic acid and only 2 ATP. Lactic acid builds up in muscles, lowering cellular pH and causing fatigue. Oxygen debt is the volume of oxygen required post-exercise to transport lactic acid via the bloodstream to the liver and convert it back to glucose. Breathing and heart rate stay elevated to deliver oxygen to repay this debt.',
      timeSpentSeconds: 380,
      isFlagged: false,
    },
    q4: {
      questionId: 'q4',
      answerText: 'Leaves have a waxy cuticle on top which is waterproof, preventing evaporation from the upper surface. The stomata are mostly located on the lower epidermis to reduce transpiration in sunlight. Palisade mesophyll is packed at the top with chloroplasts for maximum light capture. However, opening stomata for carbon dioxide intake inevitably causes water vapor loss. In arid conditions, adaptations like sunken stomata help trap humid air to reduce diffusion gradients.',
      timeSpentSeconds: 465,
      isFlagged: false,
    }
  },
  questionEvaluations: {
    q1: {
      questionId: 'q1',
      marksAwarded: 2,
      maxMarks: 2,
      percentage: 100,
      examinerSummary: 'Full marks awarded. Both structural distinctions accurately identified.',
      awardedPoints: ['Nucleus vs loop DNA / plasmids identified', 'Cellulose wall vs bacterial cell structure noted'],
      missedPoints: [],
      modelAnswerSnippet: 'Nucleus enclosure vs circular DNA/plasmids.',
      examinerTip: 'Concise, direct recall. Optimal pacing.',
      pacingEvaluation: {
        timeSpentSeconds: 110,
        recommendedSeconds: 120,
        ratio: 0.91,
        status: 'optimal',
        feedback: 'Optimal Pacing: 1.8m matches the recommended 2.0m mark benchmark.'
      }
    },
    q2: {
      questionId: 'q2',
      marksAwarded: 3,
      maxMarks: 4,
      percentage: 75,
      examinerSummary: 'Good chemical explanation of denaturation, but student spent disproportionate time over-explaining the lock-and-key analogy.',
      awardedPoints: ['Bonds vibrating and breaking described', 'Active site conformational change / denaturation noted', 'Substrate failing to fit into active site stated'],
      missedPoints: ['Could have explicitly linked to rate dropping to zero'],
      modelAnswerSnippet: 'Thermal vibration disrupts tertiary hydrogen bonds -> active site denatures -> fewer successful collisions.',
      examinerTip: 'Do not spend 6.5 minutes writing an essay on a 4-mark question. Bullet points would have secured full marks in 3 minutes.',
      pacingEvaluation: {
        timeSpentSeconds: 395,
        recommendedSeconds: 270,
        ratio: 1.46,
        status: 'panic_risk',
        feedback: 'Critical Time Trap: You spent 6.6m on a 4-mark question (recommended 4.5m). In a real exam, spending 2 extra minutes here steals time from Question 3 & 4.'
      }
    },
    q3: {
      questionId: 'q3',
      marksAwarded: 5,
      maxMarks: 6,
      percentage: 83,
      examinerSummary: 'Detailed, well-structured comparison with accurate biochemical and physiological terminology.',
      awardedPoints: ['Full glucose oxidation comparison (high vs low ATP)', 'Lactic acid accumulation and muscle acidosis explained', 'Definition of oxygen debt accurately stated', 'Liver conversion and elevated heart rate linked'],
      missedPoints: ['Could elaborate slightly more on the role of glycogen replenishment'],
      modelAnswerSnippet: 'Aerobic vs anaerobic ATP yield, lactic acid transport to liver, post-exercise elevated ventilation rate.',
      examinerTip: 'Excellent recovery of exam momentum after the Q2 time trap.',
      pacingEvaluation: {
        timeSpentSeconds: 380,
        recommendedSeconds: 420,
        ratio: 0.90,
        status: 'optimal',
        feedback: 'Excellent Pacing: 6.3m spent on a 6-mark essay question matches the pacing target.'
      }
    },
    q4: {
      questionId: 'q4',
      marksAwarded: 6,
      maxMarks: 8,
      percentage: 75,
      examinerSummary: 'Strong evaluation of waxy cuticle and stomatal distribution. Lacks deeper evaluation of xerophytic rolled leaf adaptations.',
      awardedPoints: ['Waxy cuticle reducing evaporation', 'Stomatal position and guard cell regulation', 'Trade-off between CO2 uptake and water loss evaluated'],
      missedPoints: ['Could discuss hair layers or CAM metabolic adaptations'],
      modelAnswerSnippet: 'Upper cuticle barrier, guard cell regulation, trade-off between gas exchange and desiccation.',
      examinerTip: 'For top-band 8-markers, conclude with an explicit evaluation weighing the effectiveness of structural vs behavioral adaptations.',
      pacingEvaluation: {
        timeSpentSeconds: 465,
        recommendedSeconds: 570,
        ratio: 0.81,
        status: 'optimal',
        feedback: 'Well-paced: 7.7m allowed student to finish before the total exam countdown expired.'
      }
    }
  }
};
