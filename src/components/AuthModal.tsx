import React, { useState } from 'react';
import { UserProfile, ExamType } from '../types';
import { translations, Language } from '../utils/i18n';
import { X, User, Lock, Mail, Target, Award, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (profile: Partial<UserProfile>) => void;
  currentLang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentLang
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetBand, setTargetBand] = useState<number>(7.5);
  const [examType, setExamType] = useState<ExamType>('academic');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name.trim() || 'Alex Turner',
      email: email.trim() || 'candidate@ieltsmock.ai',
      targetBand,
      examType
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-cyan-500/30 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>IELTS MOCK PORTAL</span>
          </div>
          <h3 className="text-2xl font-bold font-heading text-white">
            {isSignUp ? 'Create Candidate Profile' : 'Sign In to IELTS MOCK'}
          </h3>
          <p className="text-xs text-slate-400">
            {isSignUp ? 'Set up your diagnostic targets and streak tracking' : 'Access your test attempts and personalized score telemetry'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Turner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                defaultValue="••••••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
          </div>

          {isSignUp && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Target Band</label>
                <select
                  value={targetBand}
                  onChange={(e) => setTargetBand(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                >
                  {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map((b) => (
                    <option key={b} value={b}>Band {b.toFixed(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-300 block mb-1">Exam Type</label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as ExamType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                >
                  <option value="academic">Academic</option>
                  <option value="general">General Training</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-heading font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition cursor-pointer mt-2"
          >
            {isSignUp ? 'Create Profile & Start' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
          >
            {isSignUp ? 'Already registered? Sign In' : 'Need an account? Start Free Candidate Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
