export type IELTSSection = 'listening' | 'reading' | 'writing' | 'speaking';

export type ExamType = 'academic' | 'general';

export type QuestionType = 
  | 'multiple_choice'
  | 'true_false_not_given'
  | 'yes_no_not_given'
  | 'matching_headings'
  | 'sentence_completion'
  | 'form_filling';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  passageRef?: string;
  headingOptions?: { id: string; text: string }[];
}

export interface ListeningSection {
  part: 1 | 2 | 3 | 4;
  title: string;
  situation: string;
  audioPrompt: string; // Used for synthetic speech audio synthesis
  transcript: string;
  questions: Question[];
}

export interface ReadingPassage {
  part: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  content: string; // Multi-paragraph IELTS reading text
  questions: Question[];
}

export interface WritingTaskData {
  taskNumber: 1 | 2;
  examType: ExamType;
  title: string;
  prompt: string;
  chartType?: 'line' | 'bar' | 'pie' | 'table';
  chartData?: any;
  minWords: number;
  timeMinutes: number;
  sampleBand9Essay: string;
  examinerComment: string;
}

export interface SpeakingPartData {
  part: 1 | 2 | 3;
  title: string;
  instructions: string;
  prepTimeSeconds?: number;
  speakingTimeSeconds?: number;
  cueCard?: {
    topic: string;
    points: string[];
  };
  questions: string[];
}

export interface MockTest {
  id: string;
  title: string;
  examType: ExamType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  listening: ListeningSection[];
  reading: ReadingPassage[];
  writing: WritingTaskData[];
  speaking: SpeakingPartData[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  section: IELTSSection;
  examType: ExamType;
  date: string;
  timeSpentSeconds: number;
  rawScore?: number;
  totalQuestions?: number;
  bandScore: number;
  answers: Record<string, string>;
  writingSubmissions?: {
    task1?: { text: string; wordCount: number; band: number; feedback: WritingEvaluation };
    task2?: { text: string; wordCount: number; band: number; feedback: WritingEvaluation };
  };
  speakingAudioUrls?: Record<string, string>;
  speakingFeedback?: SpeakingEvaluation;
}

export interface WritingEvaluation {
  overallBand: number;
  taskAchievement: { band: number; feedback: string };
  coherenceCohesion: { band: number; feedback: string };
  lexicalResource: { band: number; feedback: string };
  grammaticalRange: { band: number; feedback: string };
  wordCount: number;
  strengths: string[];
  improvements: string[];
  isAutomatedEstimate: boolean;
}

export interface SpeakingEvaluation {
  overallBand: number;
  fluencyCoherence: { band: number; feedback: string };
  lexicalResource: { band: number; feedback: string };
  grammaticalAccuracy: { band: number; feedback: string };
  pronunciation: { band: number; feedback: string };
  speechRateWpm: number;
  totalDurationSeconds: number;
  transcriptSample: string;
  tips: string[];
  isAutomatedEstimate: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetBand: number;
  examType: ExamType;
  examDate?: string;
  studyStreakDays: number;
  lastActiveDate: string;
  completedTests: number;
  dailyGoalTests: number;
  todayCompletedTests: number;
  skillScores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
}

export interface Flashcard {
  id: string;
  word: string;
  phonetic: string;
  pos: string;
  definition: string;
  ieltsCollocations: string[];
  example: string;
  bandLevel: string;
  topic: string;
}

export interface SampleEssay {
  id: string;
  taskType: 'Task 1 Academic' | 'Task 1 General' | 'Task 2 Essay';
  title: string;
  prompt: string;
  bandScore: number;
  essay: string;
  breakdown: {
    taskAchievement: string;
    coherence: string;
    vocabulary: string;
    grammar: string;
  };
}
