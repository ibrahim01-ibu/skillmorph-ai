// src/components/TopNav.tsx — Apple / Google Daylight Header & Enterprise Controls
import { useState } from 'react';
import {
  Zap,
  ChevronDown,
  RotateCcw,
  AlertTriangle,
  Key,
  X,
  Eye,
  EyeOff,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
  Building2,
  Check,
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
  const [showChaosMenu, setShowChaosMenu] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(groqKey);
  const [showKey, setShowKey] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-6 py-2.5 transition-all">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">SkillMorph AI</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/80 rounded-full px-2 py-0.5 hidden sm:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  4-Agent Mesh Active
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Autonomous Career Autopilot & Skill-DAG Engine
              </div>
            </div>
          </div>

          {/* Center Apple-Style Segmented View Switcher */}
          <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => onViewChange('learner')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'learner'
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Learner Career Studio
            </button>
            <button
              onClick={() => onViewChange('org')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'org'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" /> University & Enterprise Talent Cloud
            </button>
          </div>

          {/* Right Actions & Judge Chaos Controls */}
          <div className="flex items-center gap-2.5">
            {/* Custom AI Career Synthesis Button */}
            <button
              onClick={onOpenCustomCareerModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all hover:shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Career Synthesis</span>
            </button>

            {/* Collapsible Demo & Chaos Pill Bar */}
            <div className="relative">
              <button
                onClick={() => setShowChaosMenu(!showChaosMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  showChaosMenu
                    ? 'bg-slate-100 border-slate-300 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Judge instant testing tools"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Demo Controls</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${showChaosMenu ? 'rotate-180' : ''}`} />
              </button>

              {showChaosMenu && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-slide-in-up space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                    Judge Sandbox Chaos Controls
                  </div>

                  <button
                    onClick={() => {
                      onResetScenario();
                      setShowChaosMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Reset to Sample Scenario</div>
                      <div className="text-[10px] text-slate-500">Python + SQL + HTML → Full Stack</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onSimulateFailure();
                      setShowChaosMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-amber-900 bg-amber-50/60 hover:bg-amber-50 border border-amber-200/80 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <div>
                      <div className="font-semibold text-amber-950">Simulate Assessment Failure</div>
                      <div className="text-[10px] text-amber-700">Trigger AdaptiveMentor Amber Reroute</div>
                    </div>
                  </button>

                  <div className="pt-1 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
                      Pivot Target Path
                    </div>
                    {PIVOT_PATHS.map((p) => (
                      <button
                        key={p.path}
                        onClick={() => {
                          onPivotCareer(p.path);
                          setShowChaosMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          currentPath === p.path
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {currentPath === p.path && <Check className="w-3 h-3 text-blue-600 inline mr-1" />}
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Groq Key Modal Trigger */}
            <button
              onClick={() => {
                setKeyInput(groqKey);
                setShowKeyModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors shadow-sm"
              title="Groq API key configuration"
            >
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline font-mono text-[11px]">
                {groqKey ? 'Groq Active' : 'API Key'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Groq Key Modal */}
      {showKeyModal && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowKeyModal(false)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 w-full max-w-md animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                  <Key className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-slate-900 font-bold text-sm">Groq API Configuration</h2>
                  <p className="text-[11px] text-slate-500">Fast inference powered by `openai/gpt-oss-120b`</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 mb-4 text-xs text-blue-900 leading-relaxed flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Zero Setup Required:</strong> A pre-configured demo key is active with runtime obfuscation. You can also plug in your personal Groq key (`gsk_...`) below.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Personal Groq Key (Optional)
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter your Groq key..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white pr-10 font-mono transition-colors"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => {
                  onGroqKeyChange(keyInput);
                  setShowKeyModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Save & Connect
              </button>
              {groqKey && (
                <button
                  onClick={() => {
                    onGroqKeyChange('');
                    setKeyInput('');
                    setShowKeyModal(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors"
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
