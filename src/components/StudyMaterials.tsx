import React, { useState } from 'react';
import { vocabularyVault, sampleEssaysVault } from '../data/mockTests';
import { translations, Language } from '../utils/i18n';
import { 
  BookOpen, 
  Volume2, 
  Sparkles, 
  FileText, 
  Mic, 
  Layers, 
  CheckCircle, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

interface StudyMaterialsProps {
  currentLang: Language;
}

export const StudyMaterials: React.FC<StudyMaterialsProps> = ({ currentLang }) => {
  const t = translations[currentLang].materials;
  const [activeTab, setActiveTab] = useState<'vocab' | 'essays' | 'cueCards' | 'grammar'>('vocab');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  // Text to speech helper
  const playPronunciation = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-GB';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredVocab = vocabularyVault.filter(item => 
    item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>BAND 9 VAULT & PREPARATION SUITE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight mb-3">
          {t.title}
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md max-w-2xl mx-auto">
        <button
          onClick={() => setActiveTab('vocab')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'vocab'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.vocabTab}</span>
        </button>
        <button
          onClick={() => setActiveTab('essays')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'essays'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.essaysTab}</span>
        </button>
        <button
          onClick={() => setActiveTab('cueCards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'cueCards'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{t.cueCardsTab}</span>
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
            activeTab === 'grammar'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.grammarTab}</span>
        </button>
      </div>

      {/* Tab 1: Vocabulary Flashcards */}
      {activeTab === 'vocab' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Band 8+ words, topics, or definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocab.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition backdrop-blur-md flex flex-col justify-between group shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
                      {item.bandLevel}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{item.topic}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xl font-heading font-bold text-white group-hover:text-cyan-300 transition">
                      {item.word}
                    </h3>
                    <button
                      onClick={() => playPronunciation(item.word)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition cursor-pointer"
                      title="Listen British English Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5 mb-3">
                    {item.phonetic} • <span className="italic">{item.pos}</span>
                  </div>

                  <p className="text-sm text-slate-300 leading-relaxed mb-4">
                    {item.definition}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                      {t.collocations}
                    </div>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {item.ieltsCollocations.map((c, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs italic text-slate-400">
                  "{item.example}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Model Band 9 Essays */}
      {activeTab === 'essays' && (
        <div className="space-y-8">
          {sampleEssaysVault.map((essay) => (
            <div
              key={essay.id}
              className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md shadow-2xl space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs mb-2">
                    {essay.taskType}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                    {essay.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black font-heading text-emerald-400">
                    Band {essay.bandScore.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Official Examiner Score</div>
                </div>
              </div>

              {/* Prompt */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 font-semibold">
                  Official IELTS Prompt:
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {essay.prompt}
                </p>
              </div>

              {/* Model Essay Text */}
              <div className="p-6 rounded-2xl bg-[#090e24]/70 border border-cyan-500/20 font-serif text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {essay.essay}
              </div>

              {/* Examiner Criteria Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-heading font-semibold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Examiner Rubric Breakdown</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-semibold text-cyan-400 block mb-1">Task Response</span>
                    <span className="text-slate-300">{essay.breakdown.taskAchievement}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-semibold text-cyan-400 block mb-1">Coherence & Cohesion</span>
                    <span className="text-slate-300">{essay.breakdown.coherence}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-semibold text-purple-400 block mb-1">Lexical Resource</span>
                    <span className="text-slate-300">{essay.breakdown.vocabulary}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                    <span className="font-semibold text-purple-400 block mb-1">Grammatical Range & Accuracy</span>
                    <span className="text-slate-300">{essay.breakdown.grammar}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Speaking Cue Cards */}
      {activeTab === 'cueCards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs">
              PART 2 CUE CARD #01
            </div>
            <h3 className="text-lg font-bold font-heading text-white">
              Describe a technological innovation that improved your daily routine
            </h3>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-slate-200">You should say:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>What the device or system is</li>
                <li>How long you have utilized it</li>
                <li>How it integrates into your schedule</li>
                <li>And explain why it holds exceptional value to you.</li>
              </ul>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-cyan-400">Examiner Tip: </span>
              Spend your 60-second preparation time mapping out keywords: 1 background noun, 2 complex verbs, and 1 idiomatic idiom instead of writing full sentences.
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs">
              PART 2 CUE CARD #02
            </div>
            <h3 className="text-lg font-bold font-heading text-white">
              Describe an environmental initiative in your hometown
            </h3>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
              <p className="font-semibold text-slate-200">You should say:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>What the project or law was</li>
                <li>Who initiated and implemented it</li>
                <li>What positive transformations it achieved</li>
                <li>And explain your personal perspective on its sustainability.</li>
              </ul>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed">
              <span className="font-bold text-purple-400">Band 8+ Collocations: </span>
              "Biodegradable infrastructure", "mitigate carbon footprint", "civic engagement", "ubiquitous adoption".
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Grammar Booster */}
      {activeTab === 'grammar' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold font-heading text-white text-cyan-400">
              1. Inversion for Dramatic Emphasis (Writing Task 2)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inversion places negative or limiting adverbials at the start of the clause to immediately demonstrate Band 8+ grammatical range.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
              <div className="text-rose-400">Standard: "Automated systems rarely fail, but when they do, repercussions are severe."</div>
              <div className="text-emerald-400">Inverted: "Rarely do automated systems fail; however, when they do, the repercussions are catastrophic."</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold font-heading text-white text-cyan-400">
              2. Passive Voice for Academic Task 1 Reports
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Task 1 requires objective, impersonal reporting. Avoid first-person pronouns and use precise passive reporting verbs.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
              <div className="text-rose-400">Personal: "We can see that people bought more solar panels."</div>
              <div className="text-emerald-400">Academic: "A marked escalation was recorded in solar photovoltaics adoption, with consumption surging fourteen-fold."</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
