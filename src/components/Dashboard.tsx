import React from 'react';
import { UserProfile, TestAttempt, IELTSSection } from '../types';
import { translations, Language } from '../utils/i18n';
import { getBandDescriptor } from '../utils/ieltsCalculator';
import { 
  BarChart3, 
  Flame, 
  Target, 
  CheckCircle2, 
  Clock, 
  Award, 
  BookOpen, 
  ArrowUpRight, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  attempts: TestAttempt[];
  currentLang: Language;
  onStartSection: (section: IELTSSection) => void;
  onClearHistory?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  attempts,
  currentLang,
  onStartSection,
  onClearHistory
}) => {
  const t = translations[currentLang].dashboard;
  
  // Compute overall estimated band from current skill scores
  const skillAvg = (
    user.skillScores.listening +
    user.skillScores.reading +
    user.skillScores.writing +
    user.skillScores.speaking
  ) / 4;
  const estimatedOverallBand = Math.round(skillAvg * 2) / 2;
  const descriptor = getBandDescriptor(estimatedOverallBand);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome & Top Stats Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-900/90 via-[#0a102b]/80 to-slate-900/90 border border-cyan-500/20 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>CANDIDATE ID: {user.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">{user.name}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {t.subtitle}
            </p>
          </div>

          {/* Quick Streak & Target Badges */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Streak */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950/70 border border-orange-500/30 shadow-lg">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">{t.streak}</div>
                <div className="text-lg font-bold font-heading text-white">{user.studyStreakDays} Days 🔥</div>
              </div>
            </div>

            {/* Daily Goal */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950/70 border border-cyan-500/30 shadow-lg">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-mono">{t.dailyGoal}</div>
                <div className="text-lg font-bold font-heading text-white">
                  {user.todayCompletedTests} / {user.dailyGoalTests} Tests
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: 4 Skills + Overall Band */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Overall Band Card */}
        <div className="sm:col-span-2 lg:col-span-1 rounded-2xl p-5 bg-gradient-to-b from-[#111c47] to-[#070b1c] border-2 border-cyan-500/40 shadow-xl flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>{t.currentEstimatedBand}</span>
            <Target className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-3 text-center">
            <div className="text-5xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300">
              {estimatedOverallBand.toFixed(1)}
            </div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold mt-1">
              {descriptor.level}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center border-t border-slate-800 pt-2">
            Target Band: <span className="text-white font-bold">{user.targetBand.toFixed(1)}</span>
          </div>
        </div>

        {/* Listening Card */}
        <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>LISTENING</span>
            <span className="text-cyan-400 font-bold">L</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-heading text-cyan-400">
              {user.skillScores.listening.toFixed(1)}
            </div>
            <div className="text-xs text-slate-400">Last benchmark</div>
          </div>
          <button
            onClick={() => onStartSection('listening')}
            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3" /> Practice
          </button>
        </div>

        {/* Reading Card */}
        <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>READING</span>
            <span className="text-cyan-400 font-bold">R</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-heading text-cyan-400">
              {user.skillScores.reading.toFixed(1)}
            </div>
            <div className="text-xs text-slate-400">Academic passage test</div>
          </div>
          <button
            onClick={() => onStartSection('reading')}
            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3" /> Practice
          </button>
        </div>

        {/* Writing Card */}
        <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>WRITING</span>
            <span className="text-purple-400 font-bold">W</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-heading text-purple-400">
              {user.skillScores.writing.toFixed(1)}
            </div>
            <div className="text-xs text-slate-400">AI Rubric evaluated</div>
          </div>
          <button
            onClick={() => onStartSection('writing')}
            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3" /> Practice
          </button>
        </div>

        {/* Speaking Card */}
        <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>SPEAKING</span>
            <span className="text-purple-400 font-bold">S</span>
          </div>
          <div className="my-2">
            <div className="text-3xl font-extrabold font-heading text-purple-400">
              {user.skillScores.speaking.toFixed(1)}
            </div>
            <div className="text-xs text-slate-400">Audio acoustic test</div>
          </div>
          <button
            onClick={() => onStartSection('speaking')}
            className="w-full mt-2 py-1.5 px-3 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3" /> Practice
          </button>
        </div>
      </div>

      {/* Analytics & Diagnostic Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Priority Improvement Areas & Recommendations */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-4">
            <h3 className="text-base font-heading font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{t.weaknessesTitle}</span>
            </h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-amber-500/20 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Reading: True / False / Not Given precision</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Avoid assuming unmentioned information is False. If the text does not verify or contradict the premise, select Not Given.
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-cyan-500/20 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Writing Task 2: Cohesion & Discourse Variety</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Use higher-tier connectors such as "In stark contrast", "Consequently", and "Conversely" to reach Band 7.5+.
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-purple-500/20 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Speaking Part 2: 2-Minute Long Turn Stamina</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Structure the cue card narrative using past background, present status, and future outlook to speak smoothly without stopping early.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Drills */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-4">
            <h3 className="text-base font-heading font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{t.recommendationsTitle}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                onClick={() => onStartSection('writing')}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">20 MIN DRILL</div>
                  <div className="text-xs font-bold text-white mt-1">Academic Task 1 Chart Report</div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target: Band 7.5+</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>

              <div 
                onClick={() => onStartSection('reading')}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase">15 MIN DRILL</div>
                  <div className="text-xs font-bold text-white mt-1">Abyssal Ocean Passage Practice</div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>TFNG Mastery</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Mock Test Attempt History */}
        <div className="lg:col-span-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{t.recentTests}</span>
              </h3>
              {attempts.length > 0 && onClearHistory && (
                <button
                  onClick={onClearHistory}
                  className="text-xs font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer transition"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {attempts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-800 rounded-2xl">
                <BarChart3 className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-xs text-slate-400 max-w-sm">
                  {t.noAttemptsYet}
                </p>
                <button
                  onClick={() => onStartSection('listening')}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold cursor-pointer border border-cyan-500/30 transition"
                >
                  Start First Section
                </button>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase">{attempt.section} Mock</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                          {attempt.examType}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span>{new Date(attempt.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{Math.round(attempt.timeSpentSeconds / 60)} min</span>
                        {attempt.rawScore !== undefined && attempt.totalQuestions !== undefined && (
                          <>
                            <span>•</span>
                            <span>{attempt.rawScore}/{attempt.totalQuestions} marks</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black font-heading text-cyan-400">
                        Band {attempt.bandScore.toFixed(1)}
                      </div>
                      <div className="text-[10px] text-slate-500">IELTS Scaled</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
