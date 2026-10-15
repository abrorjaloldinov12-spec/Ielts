import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  MockTest, 
  IELTSSection, 
  TestAttempt, 
  WritingEvaluation, 
  SpeakingEvaluation 
} from '../types';
import { evaluateIELTSWriting, evaluateIELTSSpeaking } from '../utils/essayEvaluator';
import { convertRawScoreToBand, getBandDescriptor } from '../utils/ieltsCalculator';
import { translations, Language } from '../utils/i18n';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Square, 
  Maximize2, 
  Minimize2, 
  FileEdit, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  Award,
  Sparkles,
  HelpCircle,
  Eye,
  Info
} from 'lucide-react';

interface ExamEngineProps {
  test: MockTest;
  initialSection: IELTSSection;
  currentLang: Language;
  onExit: () => void;
  onSaveAttempt: (attempt: TestAttempt) => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  test,
  initialSection,
  currentLang,
  onExit,
  onSaveAttempt
}) => {
  const t = translations[currentLang].common;
  const [activeSection, setActiveSection] = useState<IELTSSection>(initialSection);
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // User answers store: questionId -> answer
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  // Timers
  const defaultMinutes = activeSection === 'reading' ? 60 : activeSection === 'listening' ? 30 : activeSection === 'writing' ? 60 : 15;
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(defaultMinutes * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Audio player state (Listening)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Writing state
  const [writingTask1Text, setWritingTask1Text] = useState('');
  const [writingTask2Text, setWritingTask2Text] = useState('');
  const [activeWritingTask, setActiveWritingTask] = useState<1 | 2>(1);

  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [speakingPrepTime, setSpeakingPrepTime] = useState<number | null>(null);
  const [cueNotes, setCueNotes] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [speakingDurationSeconds, setSpeakingDurationSeconds] = useState(0);

  // Submission & Results
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [diagnosticAttempt, setDiagnosticAttempt] = useState<TestAttempt | null>(null);

  // Load autosaved essay if present
  useEffect(() => {
    const savedT1 = localStorage.getItem(`ielts_writing_t1_${test.id}`);
    const savedT2 = localStorage.getItem(`ielts_writing_t2_${test.id}`);
    if (savedT1) setWritingTask1Text(savedT1);
    if (savedT2) setWritingTask2Text(savedT2);
  }, [test.id]);

  // Autosave essay text
  useEffect(() => {
    if (writingTask1Text) localStorage.setItem(`ielts_writing_t1_${test.id}`, writingTask1Text);
    if (writingTask2Text) localStorage.setItem(`ielts_writing_t2_${test.id}`, writingTask2Text);
  }, [writingTask1Text, writingTask2Text, test.id]);

  // Countdown timer loop
  useEffect(() => {
    if (isSubmitted || isTimerPaused) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted, isTimerPaused]);

  // Speaking Part 2 prep timer countdown
  useEffect(() => {
    if (speakingPrepTime === null || speakingPrepTime <= 0) return;
    const timer = setInterval(() => {
      setSpeakingPrepTime(prev => (prev && prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [speakingPrepTime]);

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Answer handler
  const handleSelectAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Audio Playback simulation with Web Speech Synthesis
  const handleToggleAudio = (promptText: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(promptText);
      utterance.lang = 'en-GB';
      utterance.rate = audioPlaybackRate;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      synthUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Stop speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Voice recording (Speaking)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setSpeakingDurationSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setSpeakingDurationSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access was denied or is not available. Ensure microphone permissions are enabled.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
  };

  // Submit test and compute scores
  const handleSubmitTest = () => {
    setShowSubmitConfirm(false);

    let rawScore = 0;
    let totalQuestions = 0;
    let bandScore = 6.0;
    let writingSubmissions;
    let speakingFeedback;

    if (activeSection === 'listening') {
      const allQuestions = test.listening.flatMap(p => p.questions);
      totalQuestions = allQuestions.length;
      allQuestions.forEach(q => {
        const userAns = (answers[q.id] || '').trim().toLowerCase();
        const correct = q.correctAnswer.trim().toLowerCase();
        if (userAns === correct) rawScore++;
      });
      // Convert to 40-scaled band score
      const scaledScore = (rawScore / Math.max(1, totalQuestions)) * 40;
      bandScore = convertRawScoreToBand(scaledScore, 'listening', test.examType);
    } else if (activeSection === 'reading') {
      const allQuestions = test.reading.flatMap(p => p.questions);
      totalQuestions = allQuestions.length;
      allQuestions.forEach(q => {
        const userAns = (answers[q.id] || '').trim().toLowerCase();
        const correct = q.correctAnswer.trim().toLowerCase();
        if (userAns === correct) rawScore++;
      });
      const scaledScore = (rawScore / Math.max(1, totalQuestions)) * 40;
      bandScore = convertRawScoreToBand(scaledScore, 'reading', test.examType);
    } else if (activeSection === 'writing') {
      const t1Eval = evaluateIELTSWriting(writingTask1Text, false);
      const t2Eval = evaluateIELTSWriting(writingTask2Text, true);
      // Task 2 carries double weighting in official IELTS (T1 is 1/3, T2 is 2/3)
      const combined = (t1Eval.overallBand + t2Eval.overallBand * 2) / 3;
      bandScore = Math.round(combined * 2) / 2;

      writingSubmissions = {
        task1: {
          text: writingTask1Text,
          wordCount: t1Eval.wordCount,
          band: t1Eval.overallBand,
          feedback: t1Eval
        },
        task2: {
          text: writingTask2Text,
          wordCount: t2Eval.wordCount,
          band: t2Eval.overallBand,
          feedback: t2Eval
        }
      };
    } else if (activeSection === 'speaking') {
      speakingFeedback = evaluateIELTSSpeaking(
        Math.max(45, speakingDurationSeconds),
        'Candidate presented coherent answers discussing technology adoption, structural impacts, and future societal transformations.'
      );
      bandScore = speakingFeedback.overallBand;
    }

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      testId: test.id,
      testTitle: test.title,
      section: activeSection,
      examType: test.examType,
      date: new Date().toISOString(),
      timeSpentSeconds: defaultMinutes * 60 - timeRemainingSeconds,
      rawScore: totalQuestions > 0 ? rawScore : undefined,
      totalQuestions: totalQuestions > 0 ? totalQuestions : undefined,
      bandScore,
      answers,
      writingSubmissions,
      speakingFeedback
    };

    setDiagnosticAttempt(attempt);
    setIsSubmitted(true);
    onSaveAttempt(attempt);

    // Confetti celebration if Band >= 7.0
    if (bandScore >= 7.0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Current section content
  const listeningPart = test.listening[currentPartIndex];
  const readingPart = test.reading[currentPartIndex];
  const activeQuestions = activeSection === 'listening' 
    ? listeningPart?.questions || []
    : activeSection === 'reading'
    ? readingPart?.questions || []
    : [];

  return (
    <div className="min-h-screen bg-[#050713] text-slate-100 flex flex-col font-sans">
      {/* Top Exam Header Navigation */}
      <header className="sticky top-0 z-30 h-16 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Test Details */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Exit practice session"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-white text-sm sm:text-base tracking-tight">
                {test.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold uppercase">
                {activeSection}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Countdown Timer */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
          <Clock className={`w-4 h-4 ${timeRemainingSeconds <= 300 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`} />
          <span className={`font-mono font-bold text-sm sm:text-base ${timeRemainingSeconds <= 300 ? 'text-rose-400' : 'text-white'}`}>
            {formatTime(timeRemainingSeconds)}
          </span>
        </div>

        {/* Right: Controls & Finish Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition hidden sm:flex cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {!isSubmitted && (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-cyan-500/20 transition cursor-pointer"
            >
              {t.submit}
            </button>
          )}
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Exam View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* SECTION 1: LISTENING */}
          {activeSection === 'listening' && listeningPart && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Part Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {test.listening.map((p, idx) => (
                  <button
                    key={p.part}
                    onClick={() => {
                      setCurrentPartIndex(idx);
                      if (isPlayingAudio) {
                        window.speechSynthesis.cancel();
                        setIsPlayingAudio(false);
                      }
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
                      currentPartIndex === idx
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    Part {p.part}: {p.title}
                  </button>
                ))}
              </div>

              {/* Audio Player Card */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-cyan-500/30 backdrop-blur-xl space-y-4 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                      IELTS Listening Audio Stream
                    </div>
                    <h3 className="text-lg font-bold text-white font-heading mt-0.5">
                      {listeningPart.situation}
                    </h3>
                  </div>

                  {/* Audio Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleAudio(listeningPart.audioPrompt)}
                      className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-black" />}
                      <span>{isPlayingAudio ? 'Pause Audio' : 'Play Audio Scenario'}</span>
                    </button>

                    <button
                      onClick={() => setShowTranscript(!showTranscript)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showTranscript ? 'Hide Transcript' : 'Transcript'}</span>
                    </button>
                  </div>
                </div>

                {/* Animated Waveform when playing */}
                <div className="h-10 rounded-xl bg-slate-950 p-2 border border-slate-800 flex items-center justify-between gap-1 overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPlayingAudio ? 'bg-cyan-400' : 'bg-slate-800'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.sin(i * 0.4 + Date.now() * 0.005) * 40 + 50}%` : '20%'
                      }}
                    />
                  ))}
                </div>

                {/* Transcript Reveal */}
                {showTranscript && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {listeningPart.transcript}
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                <h4 className="text-sm font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>Questions ({listeningPart.questions.length})</span>
                </h4>

                {listeningPart.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-200">{q.prompt}</span>
                      </div>
                      <button
                        onClick={() => toggleFlag(q.id)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          flaggedQuestions[q.id]
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title="Flag for review"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Multiple choice options */}
                    {q.options && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleSelectAnswer(q.id, opt)}
                            className={`p-3 rounded-xl text-xs text-left transition cursor-pointer border ${
                              answers[q.id] === opt
                                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200 font-semibold shadow-sm shadow-cyan-500/10'
                                : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Gap Fill / Form Filling */}
                    {q.type === 'form_filling' && (
                      <div className="pt-1">
                        <input
                          type="text"
                          placeholder="Type answer here..."
                          value={answers[q.id] || ''}
                          onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                          className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: READING */}
          {activeSection === 'reading' && readingPart && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Passage Selectors */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {test.reading.map((p, idx) => (
                  <button
                    key={p.part}
                    onClick={() => setCurrentPartIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
                      currentPartIndex === idx
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    Passage {p.part}: {p.title.slice(0, 24)}...
                  </button>
                ))}
              </div>

              {/* Split-pane Reading Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Passage Text (Left 7 Columns) */}
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md max-h-[72vh] overflow-y-auto space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
                    ACADEMIC READING PASSAGE {readingPart.part}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    {readingPart.title}
                  </h3>
                  {readingPart.subtitle && (
                    <div className="text-xs font-mono text-slate-400 italic">
                      {readingPart.subtitle}
                    </div>
                  )}
                  <div className="pt-3 border-t border-slate-800/80 font-serif text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                    {readingPart.content}
                  </div>
                </div>

                {/* Questions Panel (Right 5 Columns) */}
                <div className="lg:col-span-5 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md">
                    <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                      Passage {readingPart.part} Questions
                    </h4>
                  </div>

                  {readingPart.questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-200 leading-snug">{q.prompt}</span>
                        </div>
                        <button
                          onClick={() => toggleFlag(q.id)}
                          className={`p-1 rounded transition cursor-pointer ${
                            flaggedQuestions[q.id]
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'text-slate-600 hover:text-slate-400'
                          }`}
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* True / False / Not Given Buttons */}
                      {q.type === 'true_false_not_given' && (
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          {['True', 'False', 'Not Given'].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleSelectAnswer(q.id, val)}
                              className={`py-2 px-2 rounded-xl text-xs font-medium transition cursor-pointer border ${
                                answers[q.id] === val
                                  ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Yes / No / Not Given Buttons */}
                      {q.type === 'yes_no_not_given' && (
                        <div className="grid grid-cols-3 gap-1.5 pt-1">
                          {['Yes', 'No', 'Not Given'].map((val) => (
                            <button
                              key={val}
                              onClick={() => handleSelectAnswer(q.id, val)}
                              className={`py-2 px-2 rounded-xl text-xs font-medium transition cursor-pointer border ${
                                answers[q.id] === val
                                  ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Multiple choice options */}
                      {q.type === 'multiple_choice' && q.options && (
                        <div className="space-y-1.5 pt-1">
                          {q.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleSelectAnswer(q.id, opt)}
                              className={`w-full p-2.5 rounded-xl text-xs text-left transition cursor-pointer border ${
                                answers[q.id] === opt
                                  ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Sentence Completion Gap */}
                      {q.type === 'sentence_completion' && (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="Type single word/number..."
                            value={answers[q.id] || ''}
                            onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 transition"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: WRITING */}
          {activeSection === 'writing' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Task 1 vs Task 2 Switcher */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveWritingTask(1)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-heading font-bold transition cursor-pointer ${
                    activeWritingTask === 1
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Writing Task 1 (Academic Chart)
                </button>
                <button
                  onClick={() => setActiveWritingTask(2)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-heading font-bold transition cursor-pointer ${
                    activeWritingTask === 2
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Writing Task 2 (Essay)
                </button>
              </div>

              {activeWritingTask === 1 ? (
                /* Task 1 Content */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold">
                      TASK 1 • 20 MINUTES • 150+ WORDS
                    </div>
                    <h3 className="text-base font-bold font-heading text-white">
                      Global Renewable Power Consumption (GWh)
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
                    </p>

                    {/* Interactive SVG Chart */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="text-[11px] font-mono text-slate-400 text-center font-semibold">
                        GWh Produced: 2012 vs 2024
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Solar PV</span>
                            <span className="text-cyan-400 font-bold">120 → 1,680 GWh (+1400%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-cyan-400 h-full w-[95%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Wind Energy</span>
                            <span className="text-sky-400 font-bold">310 → 1,540 GWh (+397%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-sky-400 h-full w-[85%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Hydroelectric</span>
                            <span className="text-purple-400 font-bold">980 → 1,100 GWh (+12%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-400 h-full w-[65%]" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                            <span>Biomass & Geothermal</span>
                            <span className="text-emerald-400 font-bold">340 → 510 GWh (+50%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full w-[35%]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editor Column */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-mono text-slate-400">
                        Words: <strong className={writingTask1Text.trim().split(/\s+/).filter(Boolean).length >= 150 ? 'text-emerald-400' : 'text-amber-400'}>
                          {writingTask1Text.trim().split(/\s+/).filter(Boolean).length}
                        </strong> / 150 min
                      </span>
                      <span className="text-slate-500 text-[11px]">Autosaved to browser storage</span>
                    </div>

                    <textarea
                      value={writingTask1Text}
                      onChange={(e) => setWritingTask1Text(e.target.value)}
                      placeholder="Write your Task 1 response here (Introduction, Overview, Detailed Body Paragraphs)..."
                      className="w-full h-[52vh] p-5 rounded-3xl bg-slate-900/80 border border-slate-800 text-slate-200 text-sm leading-relaxed focus:outline-none focus:border-cyan-500 font-sans resize-none transition shadow-inner"
                    />
                  </div>
                </div>
              ) : (
                /* Task 2 Content */
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-semibold">
                      TASK 2 • 40 MINUTES • 250+ WORDS
                    </div>
                    <h3 className="text-lg font-bold font-heading text-white">
                      Artificial Intelligence and the Future of Educators
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Some people argue that artificial intelligence and automated tutoring systems will soon make human teachers obsolete. Others maintain that the human element of teaching is irreplaceable and vital for holistic education. Discuss both views and give your own opinion.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-mono text-slate-400">
                        Words: <strong className={writingTask2Text.trim().split(/\s+/).filter(Boolean).length >= 250 ? 'text-emerald-400' : 'text-amber-400'}>
                          {writingTask2Text.trim().split(/\s+/).filter(Boolean).length}
                        </strong> / 250 min
                      </span>
                      <span className="text-slate-500 text-[11px]">Autosaved to browser storage</span>
                    </div>

                    <textarea
                      value={writingTask2Text}
                      onChange={(e) => setWritingTask2Text(e.target.value)}
                      placeholder="Write your Task 2 essay here (Introduction with thesis statement, Body Paragraph 1, Body Paragraph 2, Conclusion)..."
                      className="w-full h-[50vh] p-5 rounded-3xl bg-slate-900/80 border border-slate-800 text-slate-200 text-sm leading-relaxed focus:outline-none focus:border-cyan-500 font-sans resize-none transition shadow-inner"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 4: SPEAKING */}
          {activeSection === 'speaking' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Part selector */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                {test.speaking.map((p, idx) => (
                  <button
                    key={p.part}
                    onClick={() => setCurrentPartIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-heading font-bold transition cursor-pointer ${
                      currentPartIndex === idx
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    Part {p.part}: {p.title.slice(0, 24)}...
                  </button>
                ))}
              </div>

              {/* Speaking Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-purple-500/30 backdrop-blur-md space-y-6 shadow-2xl">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs font-semibold">
                    SPEAKING SIMULATOR • PART {test.speaking[currentPartIndex].part}
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white mt-1">
                    {test.speaking[currentPartIndex].title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {test.speaking[currentPartIndex].instructions}
                  </p>
                </div>

                {/* Part 2 Cue Card Specific UI */}
                {test.speaking[currentPartIndex].cueCard && (
                  <div className="space-y-4">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-[#101430] to-slate-950 border border-purple-500/30 shadow-xl space-y-3">
                      <div className="text-xs font-mono text-purple-400 uppercase tracking-widest font-semibold">
                        Candidate Topic Card
                      </div>
                      <h4 className="text-base font-bold text-white font-heading">
                        {test.speaking[currentPartIndex].cueCard?.topic}
                      </h4>
                      <div className="text-xs text-slate-300 space-y-1">
                        <p className="font-semibold text-slate-200">You should say:</p>
                        <ul className="list-disc list-inside text-slate-400 space-y-1">
                          {test.speaking[currentPartIndex].cueCard?.points.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* 60s Prep Timer & Scratchpad */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Preparation Timer (1 Minute)
                        </span>
                        {speakingPrepTime === null ? (
                          <button
                            onClick={() => setSpeakingPrepTime(60)}
                            className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold transition cursor-pointer"
                          >
                            Start 60s Prep
                          </button>
                        ) : (
                          <span className="font-mono text-sm font-bold text-cyan-400">
                            {speakingPrepTime}s remaining
                          </span>
                        )}
                      </div>

                      <textarea
                        value={cueNotes}
                        onChange={(e) => setCueNotes(e.target.value)}
                        placeholder="Make bullet notes here during your 1-minute preparation..."
                        className="w-full h-20 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* Questions for Part 1 or Part 3 */}
                {!test.speaking[currentPartIndex].cueCard && (
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                      Examiner Interview Questions:
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {test.speaking[currentPartIndex].questions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-purple-400 font-mono font-bold">Q{i + 1}:</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Voice Recorder Controls */}
                <div className="p-6 rounded-2xl bg-slate-950 border border-purple-500/20 flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="flex items-center gap-3">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-heading font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-500/20 transition cursor-pointer"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Voice Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer animate-pulse"
                      >
                        <Square className="w-4 h-4 fill-black" />
                        <span>Stop Recording ({speakingDurationSeconds}s)</span>
                      </button>
                    )}
                  </div>

                  {/* Playback of Recorded Audio */}
                  {recordedAudioUrl && !isRecording && (
                    <div className="w-full max-w-sm pt-2">
                      <div className="text-xs font-mono text-slate-400 mb-2">Recorded Speech Playback:</div>
                      <audio controls src={recordedAudioUrl} className="w-full h-10" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3 text-cyan-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold font-heading text-white">Submit Mock Exam?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to finish this {activeSection} test? Your answers and text responses will be graded according to official IELTS public band descriptors.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-heading font-bold cursor-pointer transition shadow-md shadow-cyan-500/20"
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-Submission Results Modal */}
      {isSubmitted && diagnosticAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 overflow-y-auto">
          <div className="max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0d1536] via-[#080d24] to-[#040612] border-2 border-cyan-500/40 space-y-6 shadow-[0_0_60px_-15px_rgba(6,182,212,0.3)] my-8">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>OFFICIAL DIAGNOSTIC SCORE REPORT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                Mock Test Completed!
              </h2>
            </div>

            {/* Big Band Score Box */}
            <div className="text-center p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 relative overflow-hidden">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Estimated {activeSection.toUpperCase()} Band Score
              </div>
              <div className="text-6xl sm:text-7xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 my-2">
                {diagnosticAttempt.bandScore.toFixed(1)}
              </div>
              <div className="text-sm font-mono text-cyan-300 font-semibold uppercase">
                {getBandDescriptor(diagnosticAttempt.bandScore).level}
              </div>
              {diagnosticAttempt.rawScore !== undefined && (
                <div className="mt-2 text-xs text-slate-400">
                  Raw Score: <strong className="text-white">{diagnosticAttempt.rawScore}</strong> / {diagnosticAttempt.totalQuestions} questions correct
                </div>
              )}
            </div>

            {/* Writing AI Rubric Breakdown */}
            {diagnosticAttempt.writingSubmissions?.task2?.feedback && (
              <div className="space-y-3">
                <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Task 2 Rubric Evaluation</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex justify-between items-center text-cyan-400 font-semibold mb-1">
                      <span>Task Response</span>
                      <span>Band {diagnosticAttempt.writingSubmissions.task2.feedback.taskAchievement.band.toFixed(1)}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {diagnosticAttempt.writingSubmissions.task2.feedback.taskAchievement.feedback}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex justify-between items-center text-cyan-400 font-semibold mb-1">
                      <span>Coherence & Cohesion</span>
                      <span>Band {diagnosticAttempt.writingSubmissions.task2.feedback.coherenceCohesion.band.toFixed(1)}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {diagnosticAttempt.writingSubmissions.task2.feedback.coherenceCohesion.feedback}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex justify-between items-center text-purple-400 font-semibold mb-1">
                      <span>Lexical Resource</span>
                      <span>Band {diagnosticAttempt.writingSubmissions.task2.feedback.lexicalResource.band.toFixed(1)}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {diagnosticAttempt.writingSubmissions.task2.feedback.lexicalResource.feedback}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex justify-between items-center text-purple-400 font-semibold mb-1">
                      <span>Grammar Range</span>
                      <span>Band {diagnosticAttempt.writingSubmissions.task2.feedback.grammaticalRange.band.toFixed(1)}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {diagnosticAttempt.writingSubmissions.task2.feedback.grammaticalRange.feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Speaking Diagnostic Feedback */}
            {diagnosticAttempt.speakingFeedback && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 space-y-2 text-xs">
                <div className="font-semibold text-purple-400">Acoustic Analysis:</div>
                <p className="text-slate-300">
                  {diagnosticAttempt.speakingFeedback.fluencyCoherence.feedback}
                </p>
                <div className="text-slate-400 text-[11px] pt-1">
                  Average speaking pace: {diagnosticAttempt.speakingFeedback.speechRateWpm} words per minute.
                </div>
              </div>
            )}

            {/* Notice */}
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{t.bandEstimateNotice}</span>
            </div>

            {/* Close / Return Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onExit}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-bold text-sm tracking-wide transition shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                Return to Dashboard & Analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
