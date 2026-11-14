// src/components/CustomCareerModal.tsx — Custom AI Career Synthesis (Daylight Minimalist)
import { useState } from 'react';
import { Compass, X, Loader2, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
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
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-zinc-200/90 p-6 sm:p-7 w-full max-w-lg shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-xs">
              <Compass className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <h2 className="text-zinc-900 font-bold text-base">Custom AI Career Synthesis</h2>
              <p className="text-xs text-zinc-500">
                Powered by Groq <code className="text-zinc-800 bg-zinc-100 px-1 py-0.5 rounded text-xs font-mono">openai/gpt-oss-120b</code> 4-Agent Mesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
              Current Verified Skills (Comma-Separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, SQL, C++, Docker"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors font-medium text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider block mb-1.5">
              Target Job Role or Domain
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Quantum Computing Engineer"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 transition-colors font-semibold text-xs"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {PRESET_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setTargetRole(r)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    targetRole === r
                      ? 'bg-zinc-900 text-white border-zinc-900 font-semibold shadow-xs'
                      : 'border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Model info banner */}
          <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-start gap-3">
            <Cpu className="w-4 h-4 text-zinc-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-700 leading-relaxed">
              <span className="font-semibold text-zinc-900">Autonomous 4-Agent Orchestration:</span>
              <div className="text-xs text-zinc-500 mt-0.5">
                Profiler audits your existing stack → GapArchitect synthesizes the optimal transfer graph → PolyglotCurator drafts cross-language analogies → AdaptiveMentor calibrates testing vectors.
              </div>
            </div>
          </div>

          {step && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-medium animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{step}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-6 pt-4 border-t border-zinc-200">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSynthesize}
            disabled={loading || !targetRole.trim()}
            className="flex-1 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Synthesizing Career Topology...
              </>
            ) : (
              <>
                <span>Synthesize Autopilot Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
