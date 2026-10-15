import React, { useState } from 'react';
import { calculateOverallBand, convertRawScoreToBand, getBandDescriptor } from '../utils/ieltsCalculator';
import { ExamType } from '../types';
import { translations, Language } from '../utils/i18n';
import { Calculator, Award, TrendingUp, Sliders, Target, CheckCircle2, Info, ArrowRight } from 'lucide-react';

interface ScoreCalculatorProps {
  currentLang: Language;
  targetBand: number;
  onLaunchMock?: () => void;
}

export const ScoreCalculator: React.FC<ScoreCalculatorProps> = ({
  currentLang,
  targetBand,
  onLaunchMock
}) => {
  const t = translations[currentLang].calculator;
  const [examType, setExamType] = useState<ExamType>('academic');
  const [calcMode, setCalcMode] = useState<'band' | 'raw'>('band');

  // Band sliders (0 - 9.0)
  const [scores, setScores] = useState({
    listening: 7.0,
    reading: 7.0,
    writing: 6.5,
    speaking: 7.0
  });

  // Raw marks out of 40
  const [rawListening, setRawListening] = useState(30);
  const [rawReading, setRawReading] = useState(30);

  // If in raw mode, derive listening & reading from marks
  const activeScores = calcMode === 'raw' ? {
    listening: convertRawScoreToBand(rawListening, 'listening', examType),
    reading: convertRawScoreToBand(rawReading, 'reading', examType),
    writing: scores.writing,
    speaking: scores.speaking
  } : scores;

  const result = calculateOverallBand(activeScores);
  const descriptor = getBandDescriptor(result.roundedBand);
  const gap = Number((result.roundedBand - targetBand).toFixed(1));

  const handleScoreChange = (skill: keyof typeof scores, value: number) => {
    setScores(prev => ({ ...prev, [skill]: value }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-4">
          <Calculator className="w-3.5 h-3.5" />
          <span>OFFICIAL IELTS ROUNDING ALGORITHM</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-3">
          {t.title}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Mode & Exam Type Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md mb-8">
        {/* Academic vs General */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Exam:</span>
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setExamType('academic')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                examType === 'academic'
                  ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.academic}
            </button>
            <button
              onClick={() => setExamType('general')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                examType === 'general'
                  ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.general}
            </button>
          </div>
        </div>

        {/* Sliders vs Raw Marks */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Input:</span>
          <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setCalcMode('band')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                calcMode === 'band'
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Skill Bands</span>
            </button>
            <button
              onClick={() => setCalcMode('raw')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                calcMode === 'raw'
                  ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Raw Marks (40)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls vs Holographic Band Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Sliders */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-6">
            <h3 className="text-base font-heading font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Individual Skill Breakdown</span>
            </h3>

            {/* Listening */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-200">Listening</span>
                <span className="font-mono text-base font-bold text-cyan-400 bg-cyan-950/50 px-2.5 py-0.5 rounded-lg border border-cyan-800/40">
                  Band {activeScores.listening.toFixed(1)}
                  {calcMode === 'raw' && <span className="text-xs text-slate-400 font-normal ml-1">({rawListening}/40)</span>}
                </span>
              </div>
              {calcMode === 'raw' ? (
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={rawListening}
                    onChange={(e) => setRawListening(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>0 marks</span>
                    <span>23 (Band 6.0)</span>
                    <span>30 (Band 7.0)</span>
                    <span>40 (Band 9.0)</span>
                  </div>
                </div>
              ) : (
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={scores.listening}
                  onChange={(e) => handleScoreChange('listening', Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              )}
            </div>

            {/* Reading */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-200">Reading ({examType})</span>
                <span className="font-mono text-base font-bold text-cyan-400 bg-cyan-950/50 px-2.5 py-0.5 rounded-lg border border-cyan-800/40">
                  Band {activeScores.reading.toFixed(1)}
                  {calcMode === 'raw' && <span className="text-xs text-slate-400 font-normal ml-1">({rawReading}/40)</span>}
                </span>
              </div>
              {calcMode === 'raw' ? (
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={rawReading}
                    onChange={(e) => setRawReading(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>0 marks</span>
                    <span>{examType === 'academic' ? '23 (Band 6.0)' : '30 (Band 6.0)'}</span>
                    <span>{examType === 'academic' ? '30 (Band 7.0)' : '34 (Band 7.0)'}</span>
                    <span>40 marks</span>
                  </div>
                </div>
              ) : (
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={scores.reading}
                  onChange={(e) => handleScoreChange('reading', Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              )}
            </div>

            {/* Writing */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-200">Writing</span>
                <span className="font-mono text-base font-bold text-purple-400 bg-purple-950/50 px-2.5 py-0.5 rounded-lg border border-purple-800/40">
                  Band {scores.writing.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                step="0.5"
                value={scores.writing}
                onChange={(e) => handleScoreChange('writing', Number(e.target.value))}
                className="w-full accent-purple-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Speaking */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-slate-200">Speaking</span>
                <span className="font-mono text-base font-bold text-purple-400 bg-purple-950/50 px-2.5 py-0.5 rounded-lg border border-purple-800/40">
                  Band {scores.speaking.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="9"
                step="0.5"
                value={scores.speaking}
                onChange={(e) => handleScoreChange('speaking', Number(e.target.value))}
                className="w-full accent-purple-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Explanation Callout */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-300">Rounding Logic: </span>
              {result.roundingExplanation}
            </div>
          </div>
        </div>

        {/* Right Column: Holographic 3D Score Card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl p-7 bg-gradient-to-b from-[#0d1536] via-[#090e24] to-[#040612] border-2 border-cyan-500/30 shadow-[0_0_50px_-10px_rgba(6,182,212,0.25)] space-y-6">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
                <Award className="w-3.5 h-3.5" />
                <span>OVERALL RESULT</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Avg: <span className="text-white font-bold">{result.average.toFixed(3)}</span>
              </span>
            </div>

            {/* Giant Hologram Band Display */}
            <div className="text-center py-4 relative">
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
              <div className="relative font-heading font-black text-7xl sm:text-8xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-purple-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]">
                {result.roundedBand.toFixed(1)}
              </div>
              <div className="mt-2 text-sm font-mono text-cyan-300 uppercase tracking-widest font-semibold">
                {descriptor.level}
              </div>
              <p className="mt-2 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                {descriptor.description}
              </p>
            </div>

            {/* Radar / 4-Skill Mini Gauge */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
              <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">L</div>
                <div className="text-base font-bold text-cyan-400">{activeScores.listening.toFixed(1)}</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">R</div>
                <div className="text-base font-bold text-cyan-400">{activeScores.reading.toFixed(1)}</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">W</div>
                <div className="text-base font-bold text-purple-400">{activeScores.writing.toFixed(1)}</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400">S</div>
                <div className="text-base font-bold text-purple-400">{activeScores.speaking.toFixed(1)}</div>
              </div>
            </div>

            {/* Target Band Gap Analysis */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  Target Band {targetBand.toFixed(1)}
                </span>
                <span className={`font-mono font-bold ${gap >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {gap >= 0 ? `+${gap} Target Surpassed!` : `${gap} Needed`}
                </span>
              </div>
              {/* Progress bar towards 9.0 */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(result.roundedBand / 9) * 100}%` }}
                />
              </div>
            </div>

            {/* Action CTA */}
            {onLaunchMock && (
              <button
                onClick={onLaunchMock}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-sm tracking-wide transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.launchMock}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
