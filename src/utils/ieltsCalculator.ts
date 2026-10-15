/**
 * Official IELTS Band Score Calculation and Conversion Utilities
 */

import { ExamType } from '../types';

/**
 * Rounds the average of 4 skills to the official IELTS overall band.
 * Rules:
 * - If average ends in .25, it rounds UP to the next half band (.5)
 * - If average ends in .75, it rounds UP to the next whole band (.0)
 * - If average is between .00 and .249, it rounds DOWN to .0
 * - If average is between .25 and .749, it rounds to .5
 * - If average is >= .75, it rounds to next whole number
 * 
 * Examples:
 * - 6.25 -> 6.5
 * - 6.125 -> 6.0
 * - 6.375 -> 6.5
 * - 6.75 -> 7.0
 * - 6.875 -> 7.0
 */
export function calculateOverallBand(scores: {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}): {
  average: number;
  roundedBand: number;
  roundingExplanation: string;
} {
  const { listening, reading, writing, speaking } = scores;
  const rawAverage = (listening + reading + writing + speaking) / 4;
  
  const wholePart = Math.floor(rawAverage);
  const remainder = rawAverage - wholePart;

  let roundedBand: number;
  let roundingExplanation = '';

  if (remainder < 0.25) {
    roundedBand = wholePart;
    roundingExplanation = `Decimal part (${remainder.toFixed(3)}) is less than .25, so it rounds down to ${wholePart.toFixed(1)}.`;
  } else if (remainder < 0.75) {
    roundedBand = wholePart + 0.5;
    roundingExplanation = `Decimal part (${remainder.toFixed(3)}) is between .25 and .749, so it rounds to ${roundedBand.toFixed(1)}.`;
  } else {
    roundedBand = wholePart + 1.0;
    roundingExplanation = `Decimal part (${remainder.toFixed(3)}) is .75 or higher, so it rounds up to ${roundedBand.toFixed(1)}.`;
  }

  // Ensure boundary [0, 9]
  roundedBand = Math.min(9.0, Math.max(0.0, roundedBand));

  return {
    average: Math.round(rawAverage * 1000) / 1000,
    roundedBand,
    roundingExplanation
  };
}

/**
 * Official IELTS Raw Mark (out of 40) to Band conversion tables
 */
export function convertRawScoreToBand(
  rawScore: number,
  section: 'listening' | 'reading',
  examType: ExamType = 'academic'
): number {
  const score = Math.max(0, Math.min(40, Math.round(rawScore)));

  if (section === 'listening') {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 32) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 26) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 18) return 5.5;
    if (score >= 16) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    if (score >= 6) return 3.5;
    if (score >= 4) return 3.0;
    return score > 0 ? 2.5 : 0;
  }

  // Reading Academic
  if (examType === 'academic') {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 19) return 5.5;
    if (score >= 15) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    if (score >= 8) return 3.5;
    if (score >= 6) return 3.0;
    if (score >= 4) return 2.5;
    return score > 0 ? 2.0 : 0;
  }

  // Reading General Training
  if (score >= 40) return 9.0;
  if (score >= 39) return 8.5;
  if (score >= 37) return 8.0;
  if (score >= 36) return 7.5;
  if (score >= 34) return 7.0;
  if (score >= 32) return 6.5;
  if (score >= 30) return 6.0;
  if (score >= 27) return 5.5;
  if (score >= 23) return 5.0;
  if (score >= 19) return 4.5;
  if (score >= 15) return 4.0;
  if (score >= 12) return 3.5;
  if (score >= 8) return 3.0;
  return score > 0 ? 2.5 : 0;
}

/**
 * Descriptor labels for band scores
 */
export function getBandDescriptor(band: number): {
  level: string;
  tag: string;
  description: string;
  colorClass: string;
} {
  if (band >= 8.5) {
    return {
      level: 'Expert User',
      tag: 'Band 9.0 / 8.5',
      description: 'Fully operational command of the language with complete accuracy, fluency, and appropriate sophistication.',
      colorClass: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    };
  }
  if (band >= 7.5) {
    return {
      level: 'Very Good User',
      tag: 'Band 8.0 / 7.5',
      description: 'Fully operational command with only occasional unsystematic inaccuracies and misunderstandings in unfamiliar situations.',
      colorClass: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10'
    };
  }
  if (band >= 6.5) {
    return {
      level: 'Good User',
      tag: 'Band 7.0 / 6.5',
      description: 'Generally effective command of language despite occasional inaccuracies, inappropriate usage, and misunderstandings.',
      colorClass: 'text-blue-400 border-blue-500/40 bg-blue-500/10'
    };
  }
  if (band >= 5.5) {
    return {
      level: 'Competent User',
      tag: 'Band 6.0 / 5.5',
      description: 'Generally effective command in familiar situations though errors occur. Can understand fairly complex language.',
      colorClass: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10'
    };
  }
  if (band >= 4.5) {
    return {
      level: 'Modest User',
      tag: 'Band 5.0 / 4.5',
      description: 'Partial command of language, coping with overall meaning in most situations, though likely to make frequent errors.',
      colorClass: 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    };
  }
  return {
    level: 'Limited User',
    tag: 'Band 4.0 or below',
    description: 'Basic competence is limited to familiar situations. Has frequent problems in understanding and expression.',
    colorClass: 'text-rose-400 border-rose-500/40 bg-rose-500/10'
  };
}
