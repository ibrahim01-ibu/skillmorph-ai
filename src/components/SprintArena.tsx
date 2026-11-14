// src/components/SprintArena.tsx — Apple / Material 3 Daylight 90-Second Skill Sprint Arena
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
  Sparkles,
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
async function handleRequest(req: Request, res: Response) {`,
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
        message: `Assessment PASSED for "${node.label}". Marking node as Mastered. Unlocking downstream nodes. Career readiness +8%.`,
        type: 'success',
        payload: JSON.stringify({ nodeId: node.id, result: 'pass', readinessDelta: 8 }),
      });
      onAgentLog({
        agent: 'GapArchitect-02',
        agentId: 2,
        message: `Received mastery unlock for "${node.label}". Recalculating career DAG roadmap.`,
        type: 'handoff',
      });
      setTimeout(() => onNodeMastered(node.id), 800);
    } else {
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `Assessment FAILED for "${node.label}". Socratic remedial bridge injected.`,
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
        message: `1-Line Live Code Patch PASSED with all unit tests green for "${node.label}". Node verified!`,
        type: 'success',
        payload: JSON.stringify({ nodeId: node.id, testCount: results.length }),
      });
      setTimeout(() => onNodeMastered(node.id), 900);
    } else {
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `1-Line Live Code Patch FAILED unit tests. Socratic hint available.`,
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden animate-slide-in-up mt-3">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">90-Second Skill Sprint</span>
              <span className="text-xs text-slate-500 font-medium">— {node.label}</span>
              {node.isRemedial && (
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-semibold rounded-md px-2 py-0.5">
                  🚑 Rescue Bridge
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500">Accelerated micro-learning & interactive verification</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Segmented Sprint Tabs */}
      <div className="flex border-b border-slate-200/80 bg-slate-50/30 px-3 pt-2">
        {[
          { id: 'braindiff' as Tab, label: 'Polyglot Brain Diff (30s)', icon: '🧠' },
          { id: 'resources' as Tab, label: 'Curated Mini-Build (15m)', icon: '📦' },
          { id: 'assessment' as Tab, label: 'Boss Fight & Live Patch (60s)', icon: '⚔️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="p-5 max-h-[420px] overflow-y-auto">
        {/* TAB 1: Polyglot Brain Diff */}
        {activeTab === 'braindiff' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="font-semibold text-slate-900">Transfer Learning Insight:</span>
              <span className="text-blue-700 font-mono font-medium">{content.brainDiff.existingLang}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-700 font-mono font-medium">{content.brainDiff.newLang}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600 font-medium">{content.brainDiff.concept}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Existing Language */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <div className="bg-slate-100/90 px-3.5 py-2 flex items-center justify-between border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold text-slate-800">
                      {content.brainDiff.existingLang} (You Know This)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Existing Mental Model</span>
                </div>
                <pre className="p-3.5 text-xs font-mono text-slate-800 overflow-x-auto leading-relaxed bg-white">
                  <code>{content.brainDiff.existingCode}</code>
                </pre>
              </div>

              {/* New Target Language */}
              <div className="rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/20">
                <div className="bg-emerald-50 px-3.5 py-2 flex items-center justify-between border-b border-emerald-200/80">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-950">
                      {content.brainDiff.newLang} (New Target)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold">1:1 Syntax Mapping</span>
                </div>
                <pre className="p-3.5 text-xs font-mono text-slate-800 overflow-x-auto leading-relaxed bg-white">
                  <code>{content.brainDiff.newCode}</code>
                </pre>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed font-medium">
                {content.brainDiff.explanation}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Resources & Output Micro-Spec */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-900 mb-2.5">Curated High-Signal Learning Artifacts</div>
              <div className="space-y-2">
                {content.resources.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3.5 p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-colors group shadow-2xs"
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        r.type === 'video'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : r.type === 'interactive'
                          ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                          : 'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}
                    >
                      {r.type === 'video' ? '▶' : r.type === 'interactive' ? '⚡' : '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {r.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {r.source} · {r.duration}
                      </div>
                    </div>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 group-hover:text-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro-Spec Card */}
            <div className="bg-gradient-to-tr from-emerald-50/60 to-blue-50/60 border border-emerald-200/80 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-950">Hands-on Portfolio Micro-Spec</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{content.microSpec.timeEstimate}</span>
                </div>
              </div>

              <div className="text-sm font-bold text-slate-900 mb-1">{content.microSpec.title}</div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{content.microSpec.description}</p>

              <div className="bg-white rounded-xl p-3 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Verified Portfolio Deliverable:
                </span>
                <span className="text-xs text-blue-700 font-mono font-semibold">{content.microSpec.artifact}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Boss Fight & 1-Line Live Code Patch */}
        {activeTab === 'assessment' && (
          <div className="space-y-4">
            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 max-w-sm">
              <button
                onClick={() => setAssessmentMode('mcq')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  assessmentMode === 'mcq'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                [1] Concept Boss Fight
              </button>
              <button
                onClick={() => setAssessmentMode('codepatch')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  assessmentMode === 'codepatch'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                [2] 1-Line Code Patch
              </button>
            </div>

            {/* Assessment Mode A: MCQ */}
            {assessmentMode === 'mcq' && (
              <div className="space-y-3.5">
                <div className="text-xs font-semibold text-slate-900 leading-relaxed">
                  {content.assessment.question}
                </div>

                {content.assessment.code && (
                  <pre className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-mono text-slate-800 overflow-x-auto leading-relaxed">
                    <code>{content.assessment.code}</code>
                  </pre>
                )}

                <div className="space-y-2">
                  {content.assessment.options.map((opt, i) => {
                    let optStyle =
                      'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                    if (submitted) {
                      if (i === content.assessment.correctIndex) {
                        optStyle = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold';
                      } else if (i === selectedAnswer && !correct) {
                        optStyle = 'border-red-300 bg-red-50 text-red-900';
                      } else {
                        optStyle = 'border-slate-200 bg-slate-50 text-slate-400';
                      }
                    } else if (selectedAnswer === i) {
                      optStyle = 'border-blue-500 bg-blue-50 text-blue-900 font-semibold';
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => !submitted && setSelectedAnswer(i)}
                        disabled={submitted}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-mono font-bold text-slate-600">
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="font-mono text-[11.5px]">{opt}</span>
                        </div>
                        {submitted && i === content.assessment.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                        {submitted && i === selectedAnswer && !correct && (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!submitted && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showHint ? 'Hide Socratic Hint' : 'Show Socratic Hint'}</span>
                  </button>
                )}
                {showHint && !submitted && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-relaxed animate-slide-in-up">
                    {content.assessment.hint}
                  </div>
                )}

                {submitted && (
                  <div
                    className={`rounded-xl p-4 border text-xs animate-slide-in-up ${
                      correct
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-red-50 border-red-200 text-red-900'
                    }`}
                  >
                    {correct ? (
                      <div>
                        <div className="font-bold text-emerald-950 mb-0.5">✅ Assessment Mastered!</div>
                        <div>Node marked verified. Career placement readiness +8%. Downstream milestones unlocked!</div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-bold text-red-950 mb-1">
                          ❌ Not quite — AdaptiveMentor-04 rerouting via rescue sprint...
                        </div>
                        <div className="mb-2 leading-relaxed">{content.assessment.wrongHint}</div>
                        <button
                          onClick={() => {
                            setSelectedAnswer(null);
                            setSubmitted(false);
                            setCorrect(null);
                          }}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          Try again
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!submitted && (
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => handleMcqSubmit(1)}
                      className="flex-1 py-2.5 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100/70 text-amber-900 text-xs font-semibold transition-colors shadow-2xs"
                    >
                      Simulate Wrong Answer (Test Adaptive AI)
                    </button>
                    <button
                      onClick={() => handleMcqSubmit(content.assessment.correctIndex)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      Submit Correct Fix ✓
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Assessment Mode B: 1-Line Live Code Patch */}
            {assessmentMode === 'codepatch' && (
              <div className="space-y-3.5">
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Task:</strong> Inspect the buggy code below. Repair the highlighted line with a valid 1-line patch to satisfy the automated test suite.
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-300 bg-slate-900 font-mono text-xs shadow-inner">
                  <div className="bg-slate-800/90 px-3.5 py-2 flex items-center justify-between border-b border-slate-700 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[11px] text-slate-400 ml-2">hotfix.ts — Live Patch Arena</span>
                    </div>
                    <div className="flex gap-2.5 text-[11px]">
                      <button
                        onClick={applyRecommendedPatch}
                        className="text-emerald-400 hover:underline font-sans font-medium"
                      >
                        Auto-fill Correct Patch
                      </button>
                      <button onClick={resetPatch} className="text-slate-400 hover:underline font-sans font-medium">
                        Reset Bug
                      </button>
                    </div>
                  </div>

                  <div className="p-4 text-slate-300 leading-relaxed overflow-x-auto">
                    <div className="opacity-60">{patchSnippet.contextBefore}</div>
                    <div className="my-2 p-1.5 rounded-lg bg-red-950/60 border border-red-500/40">
                      <div className="text-[10px] text-red-300 font-sans mb-1 flex items-center gap-1 font-semibold">
                        <AlertCircle className="w-3.5 h-3.5" /> Edit this 1-line patch:
                      </div>
                      <input
                        type="text"
                        value={userPatch}
                        onChange={(e) => setUserPatch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-600 rounded-md px-2.5 py-1 text-emerald-400 font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div className="opacity-60">{patchSnippet.contextAfter}</div>
                  </div>
                </div>

                {/* Automated Test Results */}
                {testResults && (
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Automated Test Runner Output:
                    </div>
                    {testResults.map((tr, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 p-2 rounded-lg text-[11.5px] ${
                          tr.passed
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {tr.passed ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold">{tr.name}: </span>
                          <span>{tr.passed ? 'PASS' : tr.msg}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleRunCodeTests}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" /> Run Automated Test Suite
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
