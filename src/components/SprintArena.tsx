// src/components/SprintArena.tsx — 90-Second Skill Sprint Arena with Live Code Patch & Boss Fight
import { useState } from 'react';
import {
  X,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  Package,
  Terminal,
  Play,
  Check,
  AlertCircle,
} from 'lucide-react';
import type { DAGNode, NodeContent, AgentLog } from '../types';

interface SprintArenaProps {
  node: DAGNode;
  content: NodeContent;
  onClose: () => void;
  onNodeMastered: (nodeId: string) => void;
  onAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  onRemedialInjected?: () => void;
}

type Tab = 'braindiff' | 'resources' | 'assessment';
type AssessmentMode = 'mcq' | 'codepatch';

interface CodePatchSnippet {
  contextBefore: string;
  buggyLine: string;
  contextAfter: string;
  correctPatchPattern: RegExp;
  recommendedPatch: string;
  testCases: Array<{ name: string; verify: (patch: string) => boolean; failureMsg: string }>;
}

const CODE_PATCHES: Record<string, CodePatchSnippet> = {
  js: {
    contextBefore: `// Scenario: Fetch multiple users concurrently from REST API
async function fetchAllUsers(userIds: number[]) {`,
    buggyLine: `  const users = userIds.forEach(async (id) => fetch('/api/users/' + id));`,
    contextAfter: `  return users;\n}`,
    correctPatchPattern: /await\s+Promise\.all\s*\(\s*userIds\.map/i,
    recommendedPatch: `  const users = await Promise.all(userIds.map((id) => fetch('/api/users/' + id)));`,
    testCases: [
      {
        name: 'Return Value Signature',
        verify: (p) => p.includes('await') && !p.includes('.forEach'),
        failureMsg: '.forEach returns undefined. Use .map to transform userIds into an array of Promises.',
      },
      {
        name: 'Concurrency Invariant',
        verify: (p) => p.includes('Promise.all'),
        failureMsg: 'Must wrap mapped Promises with Promise.all() for concurrent non-blocking execution.',
      },
      {
        name: 'Async Await Resolution',
        verify: (p) => p.includes('await'),
        failureMsg: 'Missing await keyword before Promise.all().',
      },
    ],
  },
  react: {
    contextBefore: `// Scenario: Updating nested user object in React state
function updateUserEmail(newEmail: string) {`,
    buggyLine: `  user.email = newEmail; setUser(user);`,
    contextAfter: `}`,
    correctPatchPattern: /setUser\s*\(\s*\{\s*\.\.\.user,\s*email:\s*newEmail\s*\}\s*\)/i,
    recommendedPatch: `  setUser({ ...user, email: newEmail });`,
    testCases: [
      {
        name: 'Immutability Preservation',
        verify: (p) => !p.includes('user.email =') && p.includes('...user'),
        failureMsg: 'Direct object mutation detected. React state must be treated as an immutable snapshot.',
      },
      {
        name: 'Object Reference Identity',
        verify: (p) => p.includes('setUser('),
        failureMsg: 'Must trigger reconciliation by calling setUser() with a fresh object reference.',
      },
    ],
  },
  default: {
    contextBefore: `// Scenario: Async error boundary handling
async function handleRequest(req, res) {`,
    buggyLine: `  const data = fetchBackendData(); res.send(data);`,
    contextAfter: `}`,
    correctPatchPattern: /await/i,
    recommendedPatch: `  const data = await fetchBackendData(); res.send(data);`,
    testCases: [
      {
        name: 'Promise Settlement Guard',
        verify: (p) => p.includes('await'),
        failureMsg: 'Response sent before Promise settled. Use await.',
      },
    ],
  },
};

export function SprintArena({
  node,
  content,
  onClose,
  onNodeMastered,
  onAgentLog,
  onRemedialInjected,
}: SprintArenaProps) {
  const [activeTab, setActiveTab] = useState<Tab>('braindiff');
  const [assessmentMode, setAssessmentMode] = useState<AssessmentMode>('mcq');

  // MCQ state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  // Live Code Patch state
  const patchSnippet = CODE_PATCHES[node.id] || CODE_PATCHES.default;
  const [userPatch, setUserPatch] = useState(patchSnippet.buggyLine);
  const [testResults, setTestResults] = useState<Array<{ name: string; passed: boolean; msg?: string }> | null>(null);

  function handleMcqSubmit(answerIdx: number) {
    if (submitted) return;
    setSelectedAnswer(answerIdx);
    setSubmitted(true);
    const isCorrect = answerIdx === content.assessment.correctIndex;
    setCorrect(isCorrect);

    if (isCorrect) {
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `Assessment PASSED for "${node.label}". Marking node as Mastered. Unlocking downstream nodes. Career match +8%. Handing unlock event to GapArchitect-02.`,
        type: 'success',
        payload: JSON.stringify({ nodeId: node.id, result: 'pass', readinessDelta: 8 }),
      });
      onAgentLog({
        agent: 'GapArchitect-02',
        agentId: 2,
        message: `Received mastery unlock for "${node.label}". Recalculating career DAG. Next recommended node: ${getNextNodeLabel(node.id)}`,
        type: 'handoff',
      });
      setTimeout(() => onNodeMastered(node.id), 800);
    } else {
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `Assessment FAILED for "${node.label}". Injecting Socratic remedial bridge. Rerouting via Python-to-JS analogy module.`,
        type: 'warning',
        payload: JSON.stringify({ nodeId: node.id, result: 'fail', intervention: 'remedial_node_injection' }),
      });
      if (onRemedialInjected) {
        setTimeout(onRemedialInjected, 600);
      }
    }
  }

  function handleRunCodeTests() {
    const results = patchSnippet.testCases.map((tc) => {
      const passed = tc.verify(userPatch);
      return {
        name: tc.name,
        passed,
        msg: passed ? 'Assertion satisfied' : tc.failureMsg,
      };
    });

    setTestResults(results);
    const allPassed = results.every((r) => r.passed);

    if (allPassed) {
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `1-Line Live Code Patch PASSED with all unit tests green for "${node.label}". Marking node as Mastered!`,
        type: 'success',
        payload: JSON.stringify({ nodeId: node.id, testCount: results.length }),
      });
      setTimeout(() => onNodeMastered(node.id), 900);
    } else {
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `1-Line Live Code Patch FAILED unit test suite. Socratic debugging advice dispatched.`,
        type: 'warning',
      });
    }
  }

  function applyRecommendedPatch() {
    setUserPatch(patchSnippet.recommendedPatch);
    setTestResults(null);
  }

  function resetPatch() {
    setUserPatch(patchSnippet.buggyLine);
    setTestResults(null);
  }

  return (
    <div className="glass-bright rounded-xl border border-slate-700 overflow-hidden animate-slide-in-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              node.status === 'remedial' ? 'bg-amber-400' : 'bg-cyan-400'
            } animate-pulse`}
          />
          <span className="text-sm font-semibold text-white">90-Second Sprint Arena</span>
          <span className="text-xs text-slate-400">— {node.label}</span>
          {node.isRemedial && (
            <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded px-1.5 py-0.5">
              🚑 Rescue Mode
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-200 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        {[
          { id: 'braindiff' as Tab, label: 'Polyglot Brain Diff', emoji: '🧠' },
          { id: 'resources' as Tab, label: 'Resources & Mini-Build', emoji: '📦' },
          { id: 'assessment' as Tab, label: '60s Boss Fight & Live Patch', emoji: '⚔️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-cyan-500 text-cyan-300 bg-cyan-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* TAB 1: Brain Diff */}
        {activeTab === 'braindiff' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xs text-slate-400">
                <span className="text-cyan-400 font-mono">{content.brainDiff.existingLang}</span>
                <ChevronRight className="w-3 h-3 inline mx-1" />
                <span className="text-emerald-400 font-mono">{content.brainDiff.newLang}</span>
                <span className="ml-2 text-slate-500">— {content.brainDiff.concept}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg overflow-hidden border border-slate-700">
                <div className="bg-slate-800 px-3 py-1.5 flex items-center gap-2 border-b border-slate-700">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span className="text-[11px] font-mono text-blue-300">
                    {content.brainDiff.existingLang} (You Know This)
                  </span>
                </div>
                <pre className="p-3 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-900">
                  <code>{content.brainDiff.existingCode}</code>
                </pre>
              </div>

              <div className="rounded-lg overflow-hidden border border-emerald-500/30">
                <div className="bg-emerald-900/20 px-3 py-1.5 flex items-center gap-2 border-b border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[11px] font-mono text-emerald-300">
                    {content.brainDiff.newLang} (New Target)
                  </span>
                </div>
                <pre className="p-3 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-900">
                  <code>{content.brainDiff.newCode}</code>
                </pre>
              </div>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-cyan-200">{content.brainDiff.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Resources & Mini-Build */}
        {activeTab === 'resources' && (
          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Curated Resources</div>
              {content.resources.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-900/50 mb-2 group"
                >
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                      r.type === 'video'
                        ? 'bg-red-500/20 text-red-400'
                        : r.type === 'interactive'
                        ? 'bg-violet-500/20 text-violet-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    <span className="text-[10px]">{r.type === 'video' ? '▶' : r.type === 'interactive' ? '⚡' : '📄'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium truncate">{r.title}</div>
                    <div className="text-[10px] text-slate-500">
                      {r.source} · {r.duration}
                    </div>
                  </div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-300">Output Micro-Spec</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span className="text-[10px] text-slate-400">{content.microSpec.timeEstimate}</span>
                </div>
              </div>
              <div className="text-sm font-medium text-white mb-1">{content.microSpec.title}</div>
              <p className="text-xs text-slate-300 mb-2">{content.microSpec.description}</p>
              <div className="bg-slate-900/60 rounded-lg px-3 py-2">
                <span className="text-[9px] text-slate-500 uppercase tracking-wider">Portfolio Artifact: </span>
                <span className="text-[11px] text-cyan-300 font-mono">{content.microSpec.artifact}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Boss Fight & Live Code Patch */}
        {activeTab === 'assessment' && (
          <div className="space-y-3">
            {/* Mode Switcher */}
            <div className="flex rounded-lg overflow-hidden border border-slate-700 text-xs mb-2">
              <button
                onClick={() => setAssessmentMode('mcq')}
                className={`flex-1 py-1 text-center font-medium transition-colors ${
                  assessmentMode === 'mcq'
                    ? 'bg-cyan-500/20 text-cyan-300 border-r border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                [1] Concept Boss Fight
              </button>
              <button
                onClick={() => setAssessmentMode('codepatch')}
                className={`flex-1 py-1 text-center font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  assessmentMode === 'codepatch'
                    ? 'bg-violet-500/20 text-violet-300'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3 h-3" />
                [2] 1-Line Live Code Patch
              </button>
            </div>

            {/* MODE A: MCQ */}
            {assessmentMode === 'mcq' && (
              <div className="space-y-3">
                <div className="text-xs font-medium text-white leading-relaxed">{content.assessment.question}</div>

                {content.assessment.code && (
                  <pre className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                    <code>{content.assessment.code}</code>
                  </pre>
                )}

                <div className="space-y-2">
                  {content.assessment.options.map((opt, i) => {
                    let optStyle = 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50';
                    if (submitted) {
                      if (i === content.assessment.correctIndex) {
                        optStyle = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                      } else if (i === selectedAnswer && !correct) {
                        optStyle = 'border-red-500/50 bg-red-500/10 text-red-300';
                      } else {
                        optStyle = 'border-slate-800 text-slate-500';
                      }
                    } else if (selectedAnswer === i) {
                      optStyle = 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300';
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => !submitted && setSelectedAnswer(i)}
                        disabled={submitted}
                        className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs transition-all ${optStyle}`}
                      >
                        <span className="text-slate-500 mr-2 font-mono">{String.fromCharCode(65 + i)}.</span>
                        <span className="font-mono">{opt}</span>
                        {submitted && i === content.assessment.correctIndex && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline ml-2" />
                        )}
                        {submitted && i === selectedAnswer && !correct && (
                          <XCircle className="w-3.5 h-3.5 text-red-400 inline ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!submitted && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <Lightbulb className="w-3 h-3" />
                    {showHint ? 'Hide hint' : 'Show Socratic hint'}
                  </button>
                )}
                {showHint && !submitted && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 animate-slide-in-up">
                    <p className="text-xs text-amber-300">{content.assessment.hint}</p>
                  </div>
                )}

                {submitted && (
                  <div
                    className={`rounded-lg p-3 border ${
                      correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
                    } animate-slide-in-up`}
                  >
                    {correct ? (
                      <div>
                        <div className="text-xs font-semibold text-emerald-300 mb-1">✅ Correct! Node Mastered!</div>
                        <div className="text-[11px] text-emerald-200/80">Career readiness +8%. Next node unlocked.</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs font-semibold text-red-300 mb-1">
                          ❌ Not quite — AdaptiveMentor-04 routing rescue sprint...
                        </div>
                        <div className="text-[11px] text-red-200/80 mb-1">{content.assessment.wrongHint}</div>
                        <button
                          onClick={() => {
                            setSelectedAnswer(null);
                            setSubmitted(false);
                            setCorrect(null);
                          }}
                          className="text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                        >
                          Try again
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!submitted && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleMcqSubmit(1)}
                      className="flex-1 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs hover:bg-amber-500/20 transition-colors"
                    >
                      Simulate Wrong Answer (Test Adaptive AI)
                    </button>
                    <button
                      onClick={() => handleMcqSubmit(content.assessment.correctIndex)}
                      className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                    >
                      Submit Correct Fix ✓
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MODE B: 1-Line Live Code Patch */}
            {assessmentMode === 'codepatch' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong>Task:</strong> Inspect the buggy code below. Fix the highlighted line with a valid 1-line patch to satisfy the unit test harness.
                </div>

                {/* Code Window */}
                <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-950 font-mono text-[11px]">
                  <div className="bg-slate-900 px-3 py-1.5 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                      <span className="text-[10px] text-slate-400 ml-2">hotfix.ts — Live Patch Arena</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={applyRecommendedPatch}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        Auto-fill Correct Patch
                      </button>
                      <button onClick={resetPatch} className="text-[10px] text-slate-500 hover:underline">
                        Reset Bug
                      </button>
                    </div>
                  </div>

                  <div className="p-3 text-slate-400 leading-relaxed overflow-x-auto">
                    <div className="opacity-70">{patchSnippet.contextBefore}</div>
                    <div className="my-2 p-1 rounded bg-red-500/10 border border-red-500/20">
                      <div className="text-[9px] text-red-400 font-sans mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Edit this 1-line patch:
                      </div>
                      <input
                        type="text"
                        value={userPatch}
                        onChange={(e) => setUserPatch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-300 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div className="opacity-70">{patchSnippet.contextAfter}</div>
                  </div>
                </div>

                {/* Test Results Output */}
                {testResults && (
                  <div className="space-y-1.5 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                      Automated Test Runner Output:
                    </div>
                    {testResults.map((tr, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-1.5 rounded ${
                          tr.passed ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
                        }`}
                      >
                        {tr.passed ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-semibold">{tr.name}: </span>
                          <span>{tr.passed ? 'PASS' : tr.msg}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleRunCodeTests}
                    className="flex-1 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    <Play className="w-3 h-3" /> Run Unit Test Suite
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getNextNodeLabel(nodeId: string): string {
  const next: Record<string, string> = {
    js: 'React UI Architecture',
    react: 'Full Stack Capstone',
    node: 'Full Stack Capstone',
    numpy: 'ML Fundamentals',
    ml: 'PyTorch Deep Learning',
    linux: 'Docker & Containers',
    docker: 'Kubernetes Orchestration',
  };
  return next[nodeId] || 'next milestone';
}
