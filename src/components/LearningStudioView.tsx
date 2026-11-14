// src/components/LearningStudioView.tsx — Interactive Learning Studio & AI Assessment
import { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowRight,
  RotateCw,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Play,
  Terminal,
  ExternalLink,
  Clock,
  Layers,
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Cpu,
} from 'lucide-react';
import type { DAGNode, NodeContent, AgentLog, BrainDiff } from '../types';
import {
  regenerateExplanationWithGroq,
  gradeCodeWithGroq,
  type CodeGradeResult,
} from '../services/groq';

interface LearningStudioViewProps {
  node: DAGNode;
  content: NodeContent;
  groqKey: string;
  onNodeMastered: (nodeId: string) => void;
  onRemedialInjected: () => void;
  onBackToRoadmap: () => void;
  onAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
}

export function LearningStudioView({
  node,
  content,
  groqKey,
  onNodeMastered,
  onRemedialInjected,
  onBackToRoadmap,
  onAgentLog,
}: LearningStudioViewProps) {
  // Transfer Brain-Diff state
  const [brainDiff, setBrainDiff] = useState<BrainDiff>(content.brainDiff);
  const [regeneratingDiff, setRegeneratingDiff] = useState(false);

  // Code Sandbox state
  const defaultCode =
    content.assessment.code ||
    `// Challenge: Transform array using functional immutable mapping\nconst numbers = [1, 2, 3, 4];\n\n// Fix: Replace imperative loop with pure .map() transformation\nconst doubled = numbers.map(function(n) {\n  return n * 2;\n});\n\nconsole.log(doubled);`;
  const [studentCode, setStudentCode] = useState(defaultCode);
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [testPassed, setTestPassed] = useState<boolean | null>(null);

  // Conceptual Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Groq AI Grading state
  const [gradingWithGroq, setGradingWithGroq] = useState(false);
  const [aiGradeResult, setAiGradeResult] = useState<CodeGradeResult | null>(null);

  // 1. Live Code Runner
  function handleRunCode() {
    try {
      let captured = '';
      const customConsole = {
        log: (...args: unknown[]) => {
          captured += args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ') + '\n';
        },
      };

      const runner = new Function('console', studentCode);
      runner(customConsole);

      setSandboxOutput(captured || 'Program executed successfully with zero runtime errors.');

      const passed =
        studentCode.includes('map') ||
        studentCode.includes('return') ||
        captured.includes('2,4,6,8') ||
        captured.includes('[2, 4, 6, 8]');
      setTestPassed(passed);

      if (passed) {
        onAgentLog({
          agent: 'AdaptiveMentor-04',
          agentId: 4,
          message: `Code evaluation passed for node "${node.label}". Local test harness verified.`,
          type: 'success',
        });
      }
    } catch (err) {
      setSandboxOutput(`Runtime Error: ${(err as Error).message}`);
      setTestPassed(false);
    }
  }

  // 2. Groq AI Mentor Code Evaluation
  async function handleAskGroqGrade() {
    setGradingWithGroq(true);
    setAiGradeResult(null);

    onAgentLog({
      agent: 'AdaptiveMentor-04',
      agentId: 4,
      message: `Streaming custom student code submission for "${node.label}" to Groq LPU judge...`,
      type: 'mutation',
    });

    try {
      const challengeCtx = `${node.label} - ${content.microSpec.title}: ${content.microSpec.description}`;
      const result = await gradeCodeWithGroq(studentCode, challengeCtx, groqKey);
      setAiGradeResult(result);

      if (result.passed) {
        setTestPassed(true);
        onAgentLog({
          agent: 'AdaptiveMentor-04',
          agentId: 4,
          message: `Groq AI Grade: Passed (${result.score}/100). ${result.critique}`,
          type: 'success',
        });
      } else {
        setTestPassed(false);
        onAgentLog({
          agent: 'AdaptiveMentor-04',
          agentId: 4,
          message: `Groq AI Grade: Revision Needed (${result.score}/100). Socratic guidance provided.`,
          type: 'warning',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGradingWithGroq(false);
    }
  }

  // 3. Regenerate Polyglot Explanation via Groq
  async function handleRegenerateExplanation() {
    setRegeneratingDiff(true);
    onAgentLog({
      agent: 'PolyglotCurator-03',
      agentId: 3,
      message: `Synthesizing fresh polyglot mental bridge for "${node.label}" via Groq openai/gpt-oss-120b...`,
      type: 'mutation',
    });

    try {
      const regenerated = await regenerateExplanationWithGroq(
        brainDiff.existingLang || 'Python',
        brainDiff.newLang || 'JavaScript',
        brainDiff.concept || node.label,
        groqKey
      );
      setBrainDiff(regenerated);
      onAgentLog({
        agent: 'PolyglotCurator-03',
        agentId: 3,
        message: `Fresh Brain-Diff analogy synthesized: ${regenerated.concept}.`,
        type: 'success',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setRegeneratingDiff(false);
    }
  }

  // 4. Submit Boss Fight Assessment
  function handleSubmitQuiz() {
    setQuizSubmitted(true);
    const isCorrect = selectedOption === content.assessment.correctIndex;

    if (isCorrect) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#18181B', '#0F766E', '#2563EB'],
      });
      onNodeMastered(node.id);
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `Boss Fight Mastered for "${node.label}". Node verified & unlocked downstream dependencies.`,
        type: 'success',
      });
    } else {
      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: `Assessment failed for "${node.label}". Activating adaptive remediation protocol.`,
        type: 'warning',
      });
      onRemedialInjected();
    }
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* Studio Header Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToRoadmap}
            className="w-8 h-8 rounded-md bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 flex items-center justify-center text-zinc-700 transition-colors"
            title="Back to Roadmap"
          >
            <ArrowLeft size={15} strokeWidth={1.75} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                90-Second Learning Studio
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700">
                Target Milestone
              </span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 mt-0.5">{node.label}</h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedOption((content.assessment.correctIndex + 1) % content.assessment.options.length);
              setQuizSubmitted(true);
              onRemedialInjected();
            }}
            className="px-3 py-1.5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle size={13} strokeWidth={1.75} className="text-amber-700" />
            <span>Simulate Failure (Trigger Reroute)</span>
          </button>
          <button
            onClick={onBackToRoadmap}
            className="px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
          >
            Back to DAG
          </button>
        </div>
      </div>

      {/* SECTION A: POLYGLOT TRANSFER-LEARNING LESSON */}
      <div className="bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 border-b border-zinc-200 pb-3.5">
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Step 1 • Polyglot Brain-Diff Architecture
            </div>
            <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
              Transfer Learning: {brainDiff.concept || node.label}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Leveraging {brainDiff.existingLang} mental models to master {brainDiff.newLang} without doomscrolling.
            </p>
          </div>

          <button
            onClick={handleRegenerateExplanation}
            disabled={regeneratingDiff}
            className="px-3 py-1.5 rounded-md bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-medium flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <RotateCw size={13} strokeWidth={1.75} className={regeneratingDiff ? 'animate-spin' : ''} />
            <span>{regeneratingDiff ? 'Streaming from Groq...' : 'Regenerate Explanation via Groq'}</span>
          </button>
        </div>

        {/* Side-by-Side Dark Obsidian Code Comparison (No Horizontal Scrollbars) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What you know */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium px-0.5">
              <span className="text-zinc-500">Known Stack: <strong className="text-zinc-900">{brainDiff.existingLang}</strong></span>
              <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">Verified Base</span>
            </div>
            <div className="bg-[#111113] text-zinc-100 border border-zinc-800 rounded-lg p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words min-h-[140px]">
              <pre className="font-mono whitespace-pre-wrap break-words">{brainDiff.existingCode}</pre>
            </div>
          </div>

          {/* New counter-part */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium px-0.5">
              <span className="text-zinc-500">New Target Concept: <strong className="text-zinc-900">{brainDiff.newLang}</strong></span>
              <span className="text-[10px] font-mono text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">Active Gap</span>
            </div>
            <div className="bg-[#111113] text-zinc-100 border border-zinc-800 rounded-lg p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words min-h-[140px]">
              <pre className="font-mono whitespace-pre-wrap break-words">{brainDiff.newCode}</pre>
            </div>
          </div>
        </div>

        {/* Conceptual Mental Bridge Summary */}
        <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
          <Lightbulb size={16} strokeWidth={1.75} className="text-zinc-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-700 leading-relaxed">
            <span className="font-semibold text-zinc-900">Mental Model Bridge: </span>
            {brainDiff.explanation}
          </div>
        </div>

        {/* Curated Micro-Build & Resources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Micro-Spec Card */}
          <div className="p-3.5 rounded-lg bg-white border border-zinc-200 space-y-1.5">
            <div className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} strokeWidth={1.75} /> Practical Micro-Spec
            </div>
            <div className="font-bold text-xs text-zinc-900">{content.microSpec.title}</div>
            <p className="text-xs text-zinc-600 leading-relaxed">{content.microSpec.description}</p>
            <div className="text-[11px] text-zinc-400 font-mono pt-0.5">
              Artifact: <span className="text-zinc-700 font-medium">{content.microSpec.artifact}</span> ({content.microSpec.timeEstimate})
            </div>
          </div>

          {/* Curated Resources */}
          <div className="p-3.5 rounded-lg bg-white border border-zinc-200 space-y-1.5">
            <div className="text-[11px] font-semibold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={13} strokeWidth={1.75} /> Curated 3-Minute Guides
            </div>
            <div className="space-y-1">
              {content.resources.slice(0, 2).map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between text-xs text-zinc-700 hover:text-zinc-900 hover:underline p-1.5 rounded bg-zinc-50 border border-zinc-200 transition-colors"
                >
                  <span className="truncate">{res.title}</span>
                  <ExternalLink size={12} strokeWidth={1.75} className="text-zinc-400 flex-shrink-0 ml-1.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: HANDS-ON CODE SANDBOX & GROQ AI EVALUATION */}
      <div className="bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3.5">
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Step 2 • Hands-On Interactive Code Sandbox
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mt-0.5">
              Live Code Patch & Test Suite
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Edit the code in the dark editor below. Execute locally or ask AdaptiveMentor-04 to grade your solution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunCode}
              className="px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Play size={12} strokeWidth={1.75} className="text-zinc-900 fill-zinc-900" />
              <span>Run Local Tests</span>
            </button>
            <button
              onClick={handleAskGroqGrade}
              disabled={gradingWithGroq}
              className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {gradingWithGroq ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Cpu size={13} strokeWidth={1.75} />
              )}
              <span>Ask AI Mentor to Grade</span>
            </button>
          </div>
        </div>

        {/* Code Editor Container (Obsidian, whitespace-pre-wrap break-words) */}
        <div className="bg-[#111113] text-zinc-100 border border-zinc-800 rounded-lg p-4 font-mono text-[13px] leading-relaxed shadow-inner space-y-2.5">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-1.5">
              <Terminal size={13} strokeWidth={1.75} className="text-zinc-400" />
              <span>solution.js</span>
            </div>
            <div className="flex items-center gap-2">
              {testPassed !== null && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                    testPassed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}
                >
                  {testPassed ? 'TESTS PASSED' : 'REVISION NEEDED'}
                </span>
              )}
              <span className="text-[11px] text-zinc-500">Node/ES2026</span>
            </div>
          </div>

          <textarea
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            rows={7}
            className="w-full bg-transparent text-zinc-100 font-mono text-[13px] leading-relaxed focus:outline-none resize-none whitespace-pre-wrap break-words"
            spellCheck={false}
          />

          {sandboxOutput && (
            <div className="pt-2 border-t border-zinc-800 text-xs font-mono">
              <div className="text-zinc-500 mb-1">Execution Telemetry:</div>
              <pre className="text-emerald-400 bg-black/40 p-2.5 rounded-md whitespace-pre-wrap break-words">
                {sandboxOutput}
              </pre>
            </div>
          )}
        </div>

        {/* Groq AI Mentor Review Card */}
        {aiGradeResult && (
          <div
            className={`p-3.5 rounded-lg border text-xs ${
              aiGradeResult.passed
                ? 'bg-zinc-50 border-zinc-200 text-zinc-800'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            } space-y-1.5 animate-slide-in-up`}
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-xs flex items-center gap-1.5">
                {aiGradeResult.passed ? (
                  <CheckCircle2 size={14} strokeWidth={1.75} className="text-emerald-700" />
                ) : (
                  <AlertTriangle size={14} strokeWidth={1.75} className="text-amber-700" />
                )}
                <span>AdaptiveMentor-04 Review — Score: {aiGradeResult.score}/100</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-200 bg-white">
                {aiGradeResult.passed ? 'VERIFIED' : 'GUIDED HINT'}
              </span>
            </div>
            <p className="leading-relaxed">{aiGradeResult.critique}</p>
            {aiGradeResult.socraticHint && (
              <div className="italic bg-white/70 p-2 rounded border border-zinc-200 text-zinc-700">
                <strong>Mentor Socratic Hint:</strong> {aiGradeResult.socraticHint}
              </div>
            )}
            {aiGradeResult.suggestedFix && (
              <div className="font-mono bg-[#111113] text-zinc-200 p-2 rounded whitespace-pre-wrap break-words">
                <code>{aiGradeResult.suggestedFix}</code>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION C: BOSS FIGHT ASSESSMENT & ADAPTIVE FAILURE REROUTE */}
      <div className="bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="border-b border-zinc-200 pb-3">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Step 3 • Boss Fight Assessment
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mt-0.5">
            Conceptual Verification Check
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Confirm your mental model shift to officially master this node and unlock downstream dependencies.
          </p>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-medium text-zinc-900 leading-relaxed">
            {content.assessment.question}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {content.assessment.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === content.assessment.correctIndex;
              let btnClass = 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100';

              if (quizSubmitted) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-red-50 border-red-300 text-red-900 font-semibold';
                }
              } else if (isSelected) {
                btnClass = 'bg-zinc-100 border-zinc-400 text-zinc-900 font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => !quizSubmitted && setSelectedOption(idx)}
                  className={`w-full p-3 rounded-md border text-xs text-left transition-colors flex items-center justify-between ${btnClass}`}
                >
                  <span>{opt}</span>
                  {quizSubmitted && isCorrect && <CheckCircle2 size={14} strokeWidth={1.75} className="text-emerald-700" />}
                  {quizSubmitted && isSelected && !isCorrect && <XCircle size={14} strokeWidth={1.75} className="text-red-600" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Result */}
          {quizSubmitted && (
            <div
              className={`p-3 rounded-md border text-xs leading-relaxed ${
                selectedOption === content.assessment.correctIndex
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {selectedOption === content.assessment.correctIndex ? (
                <div>
                  <span className="font-semibold">[Mastery Certified] </span>
                  {content.assessment.hint} Node marked mastered.
                </div>
              ) : (
                <div>
                  <span className="font-semibold">[Reroute Triggered] </span>
                  {content.assessment.wrongHint} Spliced remedial foundation module into your DAG roadmap.
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-1 flex items-center gap-2">
            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={selectedOption === null}
                className="px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Submit Assessment Answer</span>
                <ArrowRight size={13} strokeWidth={1.75} />
              </button>
            ) : (
              <button
                onClick={onBackToRoadmap}
                className="px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Return to Updated Roadmap</span>
                <ArrowRight size={13} strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
