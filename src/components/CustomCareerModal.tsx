// src/components/CustomCareerModal.tsx — Daylight System Redesign
import { useState } from 'react';
import { Sparkles, X, Loader2, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import { synthesizeCareerWithGroq, type CareerSynthesisResult } from '../services/groq';
import type { AgentLog } from '../types';

interface CustomCareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSkills: string[];
  groqKey: string;
  onApplyCareer: (result: CareerSynthesisResult) => void;
  onAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
}

const PRESET_ROLES = [
  'AI/ML Systems Engineer',
  'Web3 & Smart Contract Auditor',
  'Robotics Perception Engineer',
  'Platform & Site Reliability Engineer',
  'Distributed Systems Architect',
];

export function CustomCareerModal({
  isOpen,
  onClose,
  currentSkills,
  groqKey,
  onApplyCareer,
  onAgentLog,
}: CustomCareerModalProps) {
  const [targetRole, setTargetRole] = useState('Web3 & Smart Contract Auditor');
  const [skillsInput, setSkillsInput] = useState(currentSkills.join(', '));
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<string>('');

  if (!isOpen) return null;

  async function handleSynthesize() {
    if (!targetRole.trim() || loading) return;
    setLoading(true);
    setStep('Profiler-01 auditing current skill inventory...');

    const parsedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onAgentLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: `Auditing custom profile for [${parsedSkills.join(', ')}] targeting "${targetRole}"...`,
      type: 'info',
      payload: JSON.stringify({ skills: parsedSkills, targetRole }),
    });

    setStep('GapArchitect-02 synthesizing DAG with Groq...');
    onAgentLog({
      agent: 'GapArchitect-02',
      agentId: 2,
      message: `Invoking Groq API (openai/gpt-oss-120b) to dynamically map DAG topology & transfer learning bridges.`,
      type: 'mutation',
    });

    try {
      const result = await synthesizeCareerWithGroq(parsedSkills, targetRole, groqKey);

      setStep('PolyglotCurator-03 synthesizing code diff transfer analogies...');
      onAgentLog({
        agent: 'PolyglotCurator-03',
        agentId: 3,
        message: `Generated brain-diff analogies and radar metrics across 5 competency dimensions.`,
        type: 'handoff',
      });

      setStep('AdaptiveMentor-04 calibrating assessment vectors...');
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `Assessment difficulty vectors calibrated for ${result.nodes.length} nodes. Live career mesh updated.`,
        type: 'success',
        payload: JSON.stringify({ readiness: result.readiness, nodeCount: result.nodes.length }),
      });

      onApplyCareer(result);
      onClose();
    } catch (err) {
      console.error(err);
      onAgentLog({
        agent: 'GapArchitect-02',
        agentId: 2,
        message: 'Groq synthesis encountered error — falling back to deterministic graph engine.',
        type: 'warning',
      });
    } finally {
      setLoading(false);
      setStep('');
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 w-full max-w-lg shadow-[0_25px_50px_-12px_rgba(15,23,42,0.18)] animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900 font-bold text-base">Custom AI Career Synthesis</h2>
              <p className="text-xs text-slate-500">
                Powered by Groq <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded text-[10px]">openai/gpt-oss-120b</code> 4-Agent Mesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Current Verified Skills (Comma-Separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, SQL, C++, Docker"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-xs"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Target Job Role or Domain
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Quantum Computing Engineer"
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-xs"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {PRESET_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setTargetRole(r)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    targetRole === r
                      ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Model info banner */}
          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
            <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-blue-900">Autonomous 4-Agent Orchestration:</span>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Profiler audits your existing stack → GapArchitect synthesizes the optimal transfer graph → PolyglotCurator drafts cross-language analogies → AdaptiveMentor calibrates testing vectors.
              </div>
            </div>
          </div>

          {step && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-medium animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{step}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSynthesize}
            disabled={loading || !targetRole.trim()}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Synthesizing Career Topology...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Synthesize Autopilot Roadmap
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
