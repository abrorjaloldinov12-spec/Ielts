import React, { useState, useEffect } from 'react';
import { IELTSSection, MockTest, TestAttempt, UserProfile, ExamType } from './types';
import { mockTestsDatabase } from './data/mockTests';
import { translations, Language } from './utils/i18n';
import { ThreeHeroScene } from './components/ThreeHeroScene';
import { ScoreCalculator } from './components/ScoreCalculator';
import { Dashboard } from './components/Dashboard';
import { StudyMaterials } from './components/StudyMaterials';
import { ExamEngine } from './components/ExamEngine';
import { AuthModal } from './components/AuthModal';
import { 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Award, 
  CheckCircle2, 
  Flame, 
  Globe2, 
  Moon, 
  Sun, 
  ChevronRight, 
  Play, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Clock,
  Menu,
  X
} from 'lucide-react';

const INITIAL_USER: UserProfile = {
  id: 'usr-92841-ai',
  name: 'Alex Turner',
  email: 'alex.turner@cambridge.edu',
  targetBand: 7.5,
  examType: 'academic',
  studyStreakDays: 6,
  lastActiveDate: new Date().toISOString(),
  completedTests: 14,
  dailyGoalTests: 2,
  todayCompletedTests: 1,
  skillScores: {
    listening: 7.5,
    reading: 7.0,
    writing: 6.5,
    speaking: 7.0
  }
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'tests' | 'materials' | 'calculator' | 'progress' | 'about'>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // User state with LocalStorage
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ielts_mock_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Attempt history with LocalStorage
  const [attempts, setAttempts] = useState<TestAttempt[]>(() => {
    const saved = localStorage.getItem('ielts_mock_attempts');
    if (saved) return JSON.parse(saved);
    // Initial sample attempts for immediate rich visual feedback
    return [
      {
        id: 'att-101',
        testId: 'ielts-mock-01',
        testTitle: 'IELTS Academic Master Simulator — Set 1',
        section: 'reading',
        examType: 'academic',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        timeSpentSeconds: 3200,
        rawScore: 32,
        totalQuestions: 40,
        bandScore: 7.5,
        answers: {}
      },
      {
        id: 'att-102',
        testId: 'ielts-mock-01',
        testTitle: 'IELTS Academic Master Simulator — Set 1',
        section: 'listening',
        examType: 'academic',
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
        timeSpentSeconds: 1800,
        rawScore: 31,
        totalQuestions: 40,
        bandScore: 7.0,
        answers: {}
      }
    ];
  });

  // Active exam session
  const [activeExam, setActiveExam] = useState<{
    test: MockTest;
    section: IELTSSection;
  } | null>(null);

  // Auth modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Filter for practice tests
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedExamType, setSelectedExamType] = useState<'all' | 'academic' | 'general'>('all');

  // Sync user & attempts to localStorage
  useEffect(() => {
    localStorage.setItem('ielts_mock_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ielts_mock_attempts', JSON.stringify(attempts));
  }, [attempts]);

  const t = translations[currentLang];

  const handleStartSection = (section: IELTSSection) => {
    setActiveExam({
      test: mockTestsDatabase[0],
      section
    });
  };

  const handleSaveAttempt = (newAttempt: TestAttempt) => {
    setAttempts(prev => [newAttempt, ...prev]);
    // Update user stats
    setUser(prev => {
      const updatedScores = { ...prev.skillScores };
      updatedScores[newAttempt.section] = newAttempt.bandScore;
      return {
        ...prev,
        completedTests: prev.completedTests + 1,
        todayCompletedTests: prev.todayCompletedTests + 1,
        skillScores: updatedScores
      };
    });
  };

  const handleClearHistory = () => {
    if (confirm('Clear all local mock test history?')) {
      setAttempts([]);
    }
  };

  const handleLogin = (partialProfile: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...partialProfile
    }));
  };

  // If inside an active exam, render the full-screen exam engine
  if (activeExam) {
    return (
      <ExamEngine
        test={activeExam.test}
        initialSection={activeExam.section}
        currentLang={currentLang}
        onExit={() => setActiveExam(null)}
        onSaveAttempt={handleSaveAttempt}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-[#050713] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black ${theme === 'light' ? 'filter-none' : ''}`}>
      {/* Background Cyber Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Futuristic Navigation Bar */}
      <nav className="sticky top-0 z-40 h-20 border-b border-cyan-500/15 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition">
            <div className="w-full h-full bg-[#050713] rounded-[10px] flex items-center justify-center">
              <span className="font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-lg">
                IM
              </span>
            </div>
          </div>
          <div>
            <div className="font-heading font-black text-lg tracking-wider text-white flex items-center gap-1.5">
              <span>IELTS</span>
              <span className="text-cyan-400">MOCK</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-normal">3D</span>
            </div>
            <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              {t.nav.tagline}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'home' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'tests' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.nav.practiceTests}
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'calculator' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.nav.scoreCalculator}
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'materials' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.nav.studyMaterials}
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'progress' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.nav.progress}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === 'about' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.nav.about}
          </button>
        </div>

        {/* Right Action Tools: Language, Profile, CTA */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400 mr-1.5" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value as Language)}
              className="bg-transparent text-xs font-mono text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900 text-white">English (EN)</option>
              <option value="uz" className="bg-slate-900 text-white">O'zbekcha (UZ)</option>
              <option value="ru" className="bg-slate-900 text-white">Русский (RU)</option>
            </select>
          </div>

          {/* User Profile / Login */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{user.name.split(' ')[0]}</span>
          </button>

          {/* Quick Mock CTA */}
          <button
            onClick={() => handleStartSection('listening')}
            className="hidden md:flex px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-xs tracking-wide shadow-md shadow-cyan-500/20 transition cursor-pointer"
          >
            {t.hero.ctaMock}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 lg:hidden text-slate-400 hover:text-white cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-cyan-500/20 bg-slate-950/95 p-4 space-y-2 z-40">
          <button
            onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => { setActiveTab('tests'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t.nav.practiceTests}
          </button>
          <button
            onClick={() => { setActiveTab('calculator'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t.nav.scoreCalculator}
          </button>
          <button
            onClick={() => { setActiveTab('materials'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t.nav.studyMaterials}
          </button>
          <button
            onClick={() => { setActiveTab('progress'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t.nav.progress}
          </button>
          <button
            onClick={() => { setActiveTab('about'); setIsMobileMenuOpen(false); }}
            className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-900"
          >
            {t.nav.about}
          </button>
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => { setIsAuthOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 text-black font-bold text-center text-sm"
            >
              Candidate Profile ({user.name})
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 z-10">
        {/* TAB 1: HOMEPAGE */}
        {activeTab === 'home' && (
          <div className="space-y-20 pb-20">
            {/* HERO SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Hero Copy (Left 6 Columns) */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.hero.tag}</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-white tracking-tight leading-[1.1]">
                    {t.hero.heading}
                  </h1>

                  <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
                    {t.hero.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <button
                      onClick={() => handleStartSection('listening')}
                      className="px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-black text-sm tracking-wide shadow-xl shadow-cyan-500/25 transition flex items-center gap-3 cursor-pointer group"
                    >
                      <Play className="w-4 h-4 fill-black group-hover:scale-110 transition" />
                      <span>{t.hero.ctaMock}</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('tests')}
                      className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-heading font-bold text-sm tracking-wide transition flex items-center gap-2 cursor-pointer"
                    >
                      <span>{t.hero.ctaExplore}</span>
                      <ArrowRight className="w-4 h-4 text-cyan-400" />
                    </button>
                  </div>

                  {/* Real-time Telemetry Mini Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80">
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-xs text-slate-400 font-mono">Exam Audio</div>
                      <div className="text-sm font-bold text-cyan-400 mt-0.5">Accents UK/AU</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-xs text-slate-400 font-mono">Writing Engine</div>
                      <div className="text-sm font-bold text-purple-400 mt-0.5">IELTS Rubric</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                      <div className="text-xs text-slate-400 font-mono">Rounding Rule</div>
                      <div className="text-sm font-bold text-emerald-400 mt-0.5">Official .25/.75</div>
                    </div>
                  </div>
                </div>

                {/* 3D Holographic Visualizer (Right 6 Columns) */}
                <div className="lg:col-span-6 w-full">
                  <ThreeHeroScene
                    currentBand={user.targetBand}
                    onExploreClick={() => setActiveTab('calculator')}
                  />
                </div>
              </div>
            </section>

            {/* PLATFORM STATISTICS BAR */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-cyan-500/20 backdrop-blur-md shadow-2xl">
                <div className="text-center p-3">
                  <div className="font-heading font-black text-3xl sm:text-4xl text-cyan-400">
                    {t.stats.practiceTestsCount}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 uppercase">
                    {t.stats.practiceTestsLabel}
                  </div>
                </div>
                <div className="text-center p-3">
                  <div className="font-heading font-black text-3xl sm:text-4xl text-purple-400">
                    {t.stats.activeLearnersCount}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 uppercase">
                    {t.stats.activeLearnersLabel}
                  </div>
                </div>
                <div className="text-center p-3">
                  <div className="font-heading font-black text-3xl sm:text-4xl text-sky-400">
                    {t.stats.completedTestsCount}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 uppercase">
                    {t.stats.completedTestsLabel}
                  </div>
                </div>
                <div className="text-center p-3">
                  <div className="font-heading font-black text-3xl sm:text-4xl text-emerald-400">
                    {t.stats.targetAchievedRate}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 uppercase">
                    {t.stats.targetAchievedLabel}
                  </div>
                </div>
              </div>
            </section>

            {/* 4 CORE IELTS MODULE CARDS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-3">
                  <span>EXAM ARCHITECTURE</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                  Four Authentic Exam Practice Modules
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  Engineered strictly following the IELTS exam specifications. Choose any module to begin a timed simulation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Listening Card */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white mb-2">
                      {t.sections.listening}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t.sections.listeningDesc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono text-cyan-300">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">4 Sections</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">Audio Scenarios</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">30 Min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartSection('listening')}
                    className="w-full mt-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-heading font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-cyan-500/30"
                  >
                    <span>{t.common.startTest}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Reading Card */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white mb-2">
                      {t.sections.reading}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t.sections.readingDesc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono text-cyan-300">
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">3 Passages</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">True/False/NG</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">60 Min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartSection('reading')}
                    className="w-full mt-6 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-heading font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-cyan-500/30"
                  >
                    <span>{t.common.startTest}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Writing Card */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition">
                      <PenTool className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white mb-2">
                      {t.sections.writing}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t.sections.writingDesc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono text-purple-300">
                      <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">Task 1 & 2</span>
                      <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">AI Rubric</span>
                      <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">60 Min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartSection('writing')}
                    className="w-full mt-6 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-heading font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-purple-500/30"
                  >
                    <span>{t.common.startTest}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Speaking Card */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group shadow-xl">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition">
                      <Mic className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold font-heading text-white mb-2">
                      {t.sections.speaking}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t.sections.speakingDesc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono text-purple-300">
                      <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">Cue Card Prep</span>
                      <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">Audio Recorder</span>
                      <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">15 Min</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartSection('speaking')}
                    className="w-full mt-6 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-heading font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-purple-500/30"
                  >
                    <span>{t.common.startTest}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* WHY CHOOSE IELTS MOCK SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0c1333] via-[#080d24] to-[#040612] border border-cyan-500/20 shadow-2xl">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-3xl font-extrabold font-heading text-white">
                    {t.features.sectionTitle}
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    {t.features.sectionSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 h-fit">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-heading">{t.features.card1Title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{t.features.card1Desc}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0 h-fit">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-heading">{t.features.card2Title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{t.features.card2Desc}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 h-fit">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-heading">{t.features.card3Title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{t.features.card3Desc}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0 h-fit">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white font-heading">{t.features.card4Title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{t.features.card4Desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: PRACTICE TESTS REPOSITORY */}
        {activeTab === 'tests' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold font-heading text-white">
                Authentic IELTS Mock Tests Library
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Timed, complete exam sets covering Academic and General Training formats.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Difficulty:</span>
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                      selectedDifficulty === diff
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'text-slate-400 hover:text-white bg-slate-950'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Exam Type:</span>
                <button
                  onClick={() => setSelectedExamType('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                    selectedExamType === 'all' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 bg-slate-950'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedExamType('academic')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                    selectedExamType === 'academic' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 bg-slate-950'
                  }`}
                >
                  Academic
                </button>
                <button
                  onClick={() => setSelectedExamType('general')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition ${
                    selectedExamType === 'general' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 bg-slate-950'
                  }`}
                >
                  General Training
                </button>
              </div>
            </div>

            {/* Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTestsDatabase.map((testItem) => (
                <div
                  key={testItem.id}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition backdrop-blur-md space-y-4 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold uppercase">
                        {testItem.examType}
                      </span>
                      <span className="text-xs font-mono text-purple-400 font-medium">
                        {testItem.difficulty}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold font-heading text-white">
                      {testItem.title}
                    </h3>

                    <div className="mt-4 space-y-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Total Duration: 2 hours 40 minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                        <span>All 4 skills included (L, R, W, S)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleStartSection('listening')}
                      className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Headphones className="w-3 h-3" /> Listening
                    </button>
                    <button
                      onClick={() => handleStartSection('reading')}
                      className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" /> Reading
                    </button>
                    <button
                      onClick={() => handleStartSection('writing')}
                      className="py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <PenTool className="w-3 h-3" /> Writing
                    </button>
                    <button
                      onClick={() => handleStartSection('speaking')}
                      className="py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Mic className="w-3 h-3" /> Speaking
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SCORE CALCULATOR */}
        {activeTab === 'calculator' && (
          <ScoreCalculator
            currentLang={currentLang}
            targetBand={user.targetBand}
            onLaunchMock={() => handleStartSection('listening')}
          />
        )}

        {/* TAB 4: STUDY MATERIALS */}
        {activeTab === 'materials' && (
          <StudyMaterials currentLang={currentLang} />
        )}

        {/* TAB 5: PROGRESS & DASHBOARD */}
        {activeTab === 'progress' && (
          <Dashboard
            user={user}
            attempts={attempts}
            currentLang={currentLang}
            onStartSection={handleStartSection}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* TAB 6: ABOUT & FAQ */}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold font-heading text-white">
                About IELTS MOCK Platform
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Dedicated to providing high-fidelity IELTS mock testing powered by 3D visualization and authentic diagnostic rubrics.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-cyan-400 font-heading">
                How is the Overall Band Score Calculated?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The overall band score is calculated by taking the arithmetic average of the four component scores (Listening, Reading, Writing, Speaking). The result is rounded to the nearest whole or half band in accordance with the official standard: if the average ends in .25, it rounds up to .5; if it ends in .75, it rounds up to the next whole band.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-purple-400 font-heading">
                Writing and Speaking AI Diagnostic Notice
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Automated evaluations and band scores generated on this platform are diagnostic estimates based on published public IELTS band descriptors. They provide structured educational feedback on Task Response, Coherence & Cohesion, Lexical Resource, and Grammatical Accuracy, but do not replace an official IELTS test certificate issued by IELTS partners (British Council, IDP: IELTS Australia, Cambridge English).
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Futuristic Footer */}
      <footer className="border-t border-cyan-500/15 bg-slate-950/90 py-10 px-4 sm:px-8 mt-auto z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-heading font-black text-xs text-black">
              IM
            </div>
            <div>
              <div className="font-heading font-bold text-white text-sm">IELTS MOCK</div>
              <div className="text-[11px] font-mono text-slate-500">Practice. Improve. Achieve.</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            © 2026 IELTS MOCK Platform. Built with Google AI Studio. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <button onClick={() => setActiveTab('calculator')} className="hover:text-cyan-400 cursor-pointer">
              Calculator
            </button>
            <button onClick={() => setActiveTab('materials')} className="hover:text-cyan-400 cursor-pointer">
              Vocabulary
            </button>
            <button onClick={() => setActiveTab('about')} className="hover:text-cyan-400 cursor-pointer">
              Legal & Notice
            </button>
          </div>
        </div>
      </footer>

      {/* Auth & Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        currentLang={currentLang}
      />
    </div>
  );
}
