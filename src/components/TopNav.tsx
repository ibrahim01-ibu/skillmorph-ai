// src/components/TopNav.tsx
import { useState } from 'react';
import {
  Zap,
  ChevronDown,
  RotateCcw,
  AlertTriangle,
  Shuffle,
  Key,
  X,
  Eye,
  EyeOff,
  Sparkles,
  Cpu,
} from 'lucide-react';
import type { ViewMode, CareerPath } from '../types';

interface TopNavProps {
  viewMode: ViewMode;
  onViewChange: (v: ViewMode) => void;
  onResetScenario: () => void;
  onSimulateFailure: () => void;
  onPivotCareer: (path: CareerPath) => void;
  currentPath: CareerPath;
  groqKey: string;
  onGroqKeyChange: (k: string) => void;
  onOpenCustomCareerModal: () => void;
}

const PIVOT_PATHS: { label: string; path: CareerPath }[] = [
  { label: 'Full Stack Developer', path: 'fullstack' },
  { label: 'AI/ML Systems Engineer', path: 'aiml' },
  { label: 'Cloud Backend Architect', path: 'cloud' },
];

export function TopNav({
  viewMode,
  onViewChange,
  onResetScenario,
  onSimulateFailure,
  onPivotCareer,
  currentPath,
  groqKey,
  onGroqKeyChange,
  onOpenCustomCareerModal,
}: TopNavProps) {
  const [showPivot, setShowPivot] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(groqKey);
  const [showKey, setShowKey] = useState(false);

  return (
    <>
      <nav className="glass border-b border-slate-800 px-4 py-2 flex items-center gap-3 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-2 mr-2">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-none">SkillMorph AI</div>
            <div className="text-[10px] text-emerald-400 leading-none mt-0.5">4-Agent Autonomous Mesh Active</div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-slate-700 text-xs">
          <button
            onClick={() => onViewChange('learner')}
            className={`px-3 py-1.5 transition-colors ${
              viewMode === 'learner'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            [1] Learner Autopilot
          </button>
          <button
            onClick={() => onViewChange('org')}
            className={`px-3 py-1.5 transition-colors ${
              viewMode === 'org'
                ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            [2] University & Org Intel
          </button>
        </div>

        {/* Custom AI Career Synthesis Button */}
        <button
          onClick={onOpenCustomCareerModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600/30 to-cyan-600/30 border border-violet-500/40 text-xs text-violet-200 hover:text-white hover:border-cyan-400 transition-all shadow-sm shadow-violet-500/20"
          title="Synthesize any custom target career using 4-agent Groq mesh"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span className="font-semibold">✨ Custom AI Career Synthesis</span>
        </button>

        {/* Chaos Controls */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider hidden sm:block">Judge Sandbox</span>

          <button
            onClick={onResetScenario}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
            title="Reset to Sample Scenario"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Scenario</span>
          </button>

          <button
            onClick={onSimulateFailure}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 hover:bg-amber-500/20 transition-all neon-amber"
            title="Simulate Assessment Failure"
          >
            <AlertTriangle className="w-3 h-3" />
            <span className="hidden md:inline">Simulate Failure</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowPivot(!showPivot)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-xs text-violet-300 hover:bg-violet-500/20 transition-all"
            >
              <Shuffle className="w-3 h-3" />
              <span className="hidden md:inline">Pivot Career</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showPivot ? 'rotate-180' : ''}`} />
            </button>
            {showPivot && (
              <div className="absolute top-full right-0 mt-1 w-56 glass rounded-lg border border-slate-700 overflow-hidden z-50 animate-slide-in-up">
                {PIVOT_PATHS.map((p) => (
                  <button
                    key={p.path}
                    onClick={() => {
                      onPivotCareer(p.path);
                      setShowPivot(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-700 transition-colors ${
                      currentPath === p.path ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-300'
                    }`}
                  >
                    {currentPath === p.path ? '✓ ' : ''}
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Groq Key Modal Trigger */}
          <button
            onClick={() => {
              setKeyInput(groqKey);
              setShowKeyModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            title="Groq API Configuration"
          >
            <Key className="w-3 h-3 text-cyan-400" />
            <span className={`text-xs ${groqKey ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
              {groqKey ? 'Groq Active (gpt-oss-120b)' : 'Groq Key'}
            </span>
          </button>
        </div>
      </nav>

      {/* Groq Key Modal */}
      {showKeyModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="glass rounded-xl border border-slate-700 p-6 w-full max-w-md animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <div>
                  <h2 className="text-white font-semibold text-sm">Groq API Integration</h2>
                  <p className="text-[11px] text-slate-400">Model: `openai/gpt-oss-120b` (LPUs ultra-low latency)</p>
                </div>
              </div>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-500 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4 text-xs text-emerald-300 leading-relaxed">
              ⚡ <strong>Pre-Configured & Connected:</strong> Your live Groq API key is pre-loaded and ready for ultra-fast custom career graph generation & AI mentor responses.
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Groq API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter your Groq key..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 pr-10 font-mono"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Key is persisted securely to your browser&apos;s localStorage (`groq_api_key`).
              </p>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => {
                  onGroqKeyChange(keyInput);
                  setShowKeyModal(false);
                }}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
              >
                Save & Activate Groq
              </button>
              {groqKey && (
                <button
                  onClick={() => {
                    onGroqKeyChange('');
                    setKeyInput('');
                    setShowKeyModal(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                >
                  Clear Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
