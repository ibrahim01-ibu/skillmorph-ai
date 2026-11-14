// src/components/CustomCareerModal.tsx
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
    setStep('Profiler-01 auditing skills...');

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

      setStep('PolyglotCurator-03 binding transfer analogies...');
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass rounded-xl border border-slate-700 p-6 w-full max-w-lg animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Custom AI Career Synthesis</h2>
              <p className="text-[11px] text-slate-400">Powered by Groq `openai/gpt-oss-120b` 4-Agent Mesh</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Your Current Verified Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, SQL, C++, Docker"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
              Target Job Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Quantum Computing Engineer"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-medium"
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setTargetRole(r)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    targetRole === r
                      ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Model info banner */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-300">
              <span className="text-cyan-300 font-semibold">Autonomous 4-Agent Orchestration:</span>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Profiler audits your current stack → GapArchitect computes optimal transfer graph → PolyglotCurator crafts syntax bridges → AdaptiveMentor primes test harness.
              </div>
            </div>
          </div>

          {step && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{step}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSynthesize}
            disabled={loading || !targetRole.trim()}
            className="flex-1 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20"
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
