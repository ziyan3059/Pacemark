export interface SampleNotePack {
  id: string;
  subject: string;
  examBoard: string;
  topicTitle: string;
  description: string;
  tag: string;
  content: string;
}

export const SAMPLE_NOTE_PACKS: SampleNotePack[] = [
  {
    id: 'bio-respiration',
    subject: 'General Biology',
    examBoard: 'Standard Academic',
    topicTitle: 'Cell Biology, Enzymes & Respiration',
    description: 'Covers eukaryotic structures, lock-and-key enzyme denaturation, aerobic vs anaerobic respiration, and oxygen debt mechanics.',
    tag: 'Core Module',
    content: `# Biology Revision Notes: Cell Biology, Enzymes & Bioenergetics

## 1. Cell Structure & Organization
- Eukaryotic cells (plants and animals) contain membrane-bound organelles and a true nucleus enclosing genetic material.
- Plant cells have rigid cellulose cell walls (structural turgor support), permanent vacuoles with cell sap, and chloroplasts containing chlorophyll for photosynthesis.
- Prokaryotic cells (bacteria) lack a membrane-bound nucleus. DNA is a single circular chromosome in the cytoplasm plus extra small rings called plasmids. They have a cell membrane, cytoplasm, ribosomes, and a peptidoglycan cell wall.

## 2. Enzyme Action & Factors Affecting Rate
- Enzymes are biological catalysts made of proteins (chains of amino acids folded into specific 3D tertiary shapes).
- The active site has a specific complementary shape to its substrate (Lock and Key hypothesis).
- Temperature effect:
  * Low temp: molecules have low kinetic energy, fewer successful collisions between substrate and active site per second.
  * Optimum temp (around 37°C in humans): maximum rate of enzyme-substrate complexes formed.
  * Past optimum: excessive thermal vibration breaks weak hydrogen/ionic bonds holding the 3D tertiary structure. Active site denatures and changes shape permanently. Substrate can no longer bind. Rate falls to zero.
- pH effect: extreme pH alters charges on active site amino acids, causing denaturation.

## 3. Respiration & Oxygen Debt
- Aerobic respiration: exothermic reaction continuously occurring in mitochondria.
  Equation: Glucose + Oxygen -> Carbon Dioxide + Water (+ lots of ATP energy)
  Formula: C6H12O6 + 6O2 -> 6CO2 + 6H2O
- Anaerobic respiration in human muscle during intense exercise:
  Equation: Glucose -> Lactic Acid (+ small amount of energy)
  * Incomplete oxidation of glucose yields far less ATP per molecule.
  * Lactic acid builds up in muscles, lowering cellular pH and causing fatigue and cramp.
- Oxygen Debt:
  * The amount of extra oxygen required by the body after vigorous exercise to oxidise accumulated lactic acid back into glucose/pyruvate in the liver.
  * Heart rate and breathing depth remain high post-exercise to transport lactic acid via the bloodstream to the liver and replenish oxygen stores in blood and muscles.
`
  },
  {
    id: 'cs-architecture',
    subject: 'Computer Science',
    examBoard: 'College / AP',
    topicTitle: 'CPU Architecture, Memory & Algorithms',
    description: 'Von Neumann F-D-E cycle, MAR/MDR/PC registers, Cache memory hierarchy, Bubble sort vs Merge sort computational complexity.',
    tag: 'Systems & Logic',
    content: `# Computer Science Revision Notes: Systems Architecture & Algorithms

## 1. Von Neumann Architecture & CPU Registers
- The Von Neumann architecture features shared memory for both program instructions and data, connected via control, address, and data buses.
- Key CPU components:
  * Control Unit (CU): Decodes instructions, controls signal flow around the CPU, manages clock timing.
  * Arithmetic Logic Unit (ALU): Executes arithmetic operations (addition, subtraction) and logical comparisons (AND, OR, NOT).
  * Cache: Extremely fast, small SRAM storage located on or beside the CPU core; holds frequently accessed data/instructions to reduce RAM latency. Level 1 is fastest/smallest, Level 3 is larger/slower.
- Dedicated Special-Purpose Registers:
  * Program Counter (PC): Holds the memory address of the NEXT instruction to be fetched; automatically increments after every fetch cycle.
  * Memory Address Register (MAR): Holds the physical memory address currently being read from or written to via the address bus.
  * Memory Data Register (MDR): Holds the actual data or instruction just retrieved from or about to be written to memory via the data bus.
  * Current Instruction Register (CIR): Holds the instruction currently being decoded by the CU.
  * Accumulator (ACC): Stores temporary intermediate calculation results from the ALU.

## 2. Fetch-Decode-Execute Cycle
1. Fetch: PC address copied to MAR. Address bus queries RAM. Data/instruction fetched via data bus into MDR. PC increments by 1.
2. Decode: Instruction transferred to CIR and decoded by the CU into opcode and operand.
3. Execute: CU signals ALU or registers to perform calculation, load/store data, or branch.

## 3. Memory & Storage Types
- RAM (Random Access Memory): Primary memory. Read/write, high speed, volatile (loses all content when power is disconnected). Stores running OS, applications, and open files.
- ROM (Read Only Memory): Non-volatile (retains data when power is off), read-only. Stores factory bootstrap loader and BIOS needed to initialize hardware and boot OS.

## 4. Sorting Algorithms & Computational Time
- Bubble Sort:
  * Compares adjacent pairs and swaps if out of order. Repeats passes until no swaps occur.
  * Memory: In-place (O(1) extra space).
  * Time: O(n^2) worst/average case. Very inefficient on large lists; simple to implement.
- Merge Sort:
  * Divide-and-conquer strategy. Repeatedly divides list into halves until individual single-item lists remain, then repeatedly merges pairs in sorted order.
  * Memory: Requires O(n) auxiliary memory to hold merge buffers.
  * Time: O(n log n) in best, average, and worst case. Far faster than Bubble Sort for large datasets.
`
  },
  {
    id: 'rs-ethics',
    subject: 'Ethics & Philosophy',
    examBoard: 'University / General',
    topicTitle: 'Medical Ethics, Sanctity of Life vs Quality of Life',
    description: 'Philosophical, theological, and legal perspectives on bodily autonomy, active vs passive euthanasia, human dignity, and palliative care.',
    tag: 'Bioethics & Law',
    content: `# Ethics & Philosophy Revision Notes: Medical Ethics & The Value of Life

## 1. Core Principles: Sanctity of Life vs Quality of Life
- Sanctity of Life:
  * Life is sacred, inviolable, and endowed with intrinsic dignity.
  * The principle that human life possesses absolute value from conception until natural death, irrespective of disability, age, or suffering.
- Quality of Life:
  * The ethical proposition that human value is tied to experiential quality, consciousness, ability to experience joy, freedom from intolerable agony, and personal autonomy.
  * Secular utilitarians (e.g. Peter Singer) argue that forcing someone to endure agonizing, incurable suffering infringes their dignity and compassionate empathy.

## 2. Euthanasia Debate
- Types of Euthanasia:
  * Voluntary: Individual requests medical assistance to terminate life.
  * Involuntary / Non-voluntary: Individual is unable to express consent (e.g. persistent vegetative state), decision made on clinical grounds.
  * Active: Deliberate lethal intervention (e.g. administering lethal injection).
  * Passive: Withholding or withdrawing life-prolonging treatments (e.g. turning off life-support or Do Not Resuscitate orders).
- Ethical & Religious Perspectives:
  * Classical Deontology & Theological Prohibitions: Absolute prohibition of active euthanasia. Viewed as violation of fundamental moral law. However, the Doctrine of Double Effect permits high-dose palliative analgesia that may foreseeably shorten life if the sole intent is relieving agony.
  * Palliative Care & Hospice Movement (Dame Cicely Saunders): Championing palliative care offering physical, emotional, and psychological comfort without actively terminating life prematurely.
  * Autonomy & Right to Die: The principle that an individual owns their bodily sovereignty and should have the legal right to die with dignity when suffering is unbearable.

## 3. Extended Evaluative Essay Structure
- Formula for top-band analytical responses:
  * Intro: Define the debate and contextualize the conflict between Sanctity of Life and Autonomy/Quality of Life.
  * Perspective 1: Detailed deontological/theological viewpoint with philosophical rationale.
  * Counter-perspective 2: Opposing secular utilitarian perspective with real-world case law and clinical examples.
  * Critical evaluation & nuanced conclusion: Weigh which argument has greater ethical coherence and compassionate validity.
`
  }
];
