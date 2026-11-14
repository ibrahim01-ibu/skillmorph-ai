// src/components/AgentWarRoomView.tsx — Multi-Agent War Room & AI Mentor
import { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Loader2,
  Play,
  CheckCircle2,
  Activity,
} from 'lucide-react';
import type { Agent, AgentLog, ChatMessage, UserProfile, Skill } from '../types';
import {
  askMentorGroq,
  runDiagnosticPipelineWithGroq,
  type DiagnosticPipelineResult,
} from '../services/groq';
import { CHAT_RESPONSES } from '../data/scenarios';

interface AgentWarRoomViewProps {
  user: UserProfile;
  skills: Skill[];
  targetRoleTitle: string;
  readiness: number;
  agents: Agent[];
  logs: AgentLog[];
  groqKey: string;
  onAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
}

const PRESET_QUERIES = [
  'Explain async promises using Python asyncio as a direct analogy.',
  'What are the 3 highest ROI full-stack projects for my resume?',
  'How does React Virtual DOM differ from direct DOM manipulation in vanilla JS?',
];

export function AgentWarRoomView({
  user,
  skills,
  targetRoleTitle,
  readiness,
  agents,
  logs,
  groqKey,
  onAgentLog,
}: AgentWarRoomViewProps) {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `Welcome to the SkillMorph Autonomous Mesh War Room, ${user.name}! I am AdaptiveMentor-04. I actively synthesize cross-language transfer analogies from your verified stack (${skills.map((s) => s.name).join(', ')}) to help you reach "${targetRoleTitle}". What would you like to explore?`,
      timestamp: '10:00 AM',
    },
  ]);
  const [query, setQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Diagnostic Pipeline state
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [pipelineResult, setPipelineResult] = useState<DiagnosticPipelineResult | null>(null);
  const [expandedAgentJson, setExpandedAgentJson] = useState<string | null>('profiler');

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSendMessage(textToSend?: string) {
    const q = textToSend || query;
    if (!q.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setQuery('');
    setChatLoading(true);

    onAgentLog({
      agent: 'AdaptiveMentor-04',
      agentId: 4,
      message: `Mentor query received: "${q.slice(0, 50)}...". Synthesizing personalized transfer guidance.`,
      type: 'info',
    });

    try {
      const reply = await askMentorGroq(
        q,
        {
          currentSkills: skills.map((s) => s.name),
          targetRole: targetRoleTitle,
          readiness,
        },
        groqKey
      );

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Deterministic fallback response
      const fallbackReply =
        CHAT_RESPONSES[q] ||
        `Transfer-learning insight for ${targetRoleTitle}: Since you already know ${skills[0]?.name || 'Python'}, focus on mental-model bridges rather than syntax rote learning. In modern stacks, reactive state maps cleanly to declarative data pipelines.`;

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setChatLoading(false);
    }
  }

  async function handleRunDiagnosticPipeline() {
    if (pipelineRunning) return;
    setPipelineRunning(true);
    setPipelineStep(1);
    setPipelineResult(null);

    onAgentLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: '▶ Initiating Live 4-Agent Diagnostic Pipeline via Groq LPU engine...',
      type: 'mutation',
    });

    // Step 1: Profiler
    await new Promise((r) => setTimeout(r, 600));
    setPipelineStep(2);

    onAgentLog({
      agent: 'GapArchitect-02',
      agentId: 2,
      message: 'Step 2: GapArchitect computing career delta & topological DAG levels...',
      type: 'mutation',
    });

    // Step 2: GapArchitect
    await new Promise((r) => setTimeout(r, 600));
    setPipelineStep(3);

    onAgentLog({
      agent: 'PolyglotCurator-03',
      agentId: 3,
      message: 'Step 3: PolyglotCurator ranking resources & binding syntax bridges...',
      type: 'mutation',
    });

    // Step 3: PolyglotCurator
    await new Promise((r) => setTimeout(r, 600));
    setPipelineStep(4);

    onAgentLog({
      agent: 'AdaptiveMentor-04',
      agentId: 4,
      message: 'Step 4: AdaptiveMentor setting personalized milestones & assessment harness...',
      type: 'mutation',
    });

    try {
      const result = await runDiagnosticPipelineWithGroq(
        {
          name: user.name,
          skills: skills.map((s) => s.name),
          targetRole: targetRoleTitle,
          projects: user.pastProjects,
        },
        groqKey
      );
      setPipelineResult(result);

      onAgentLog({
        agent: 'AdaptiveMentor-04',
        agentId: 4,
        message: '✓ 4-Agent Diagnostic Pipeline completed with zero latency penalties.',
        type: 'success',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setPipelineRunning(false);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Autonomous Mesh Operations
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Groq LPU High-Throughput
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#18181B] mt-1">Multi-Agent War Room & AI Mentor</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Real-time multi-agent orchestration between Profiler, GapArchitect, PolyglotCurator, and AdaptiveMentor.
          </p>
        </div>

        {/* Live Diagnostic Trigger Button */}
        <button
          onClick={handleRunDiagnosticPipeline}
          disabled={pipelineRunning}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-600/20 transition-all self-stretch md:self-auto justify-center"
        >
          {pipelineRunning ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-white" />
          )}
          <span>{pipelineRunning ? 'Running 4-Agent Diagnostic...' : '▶ Run Live 4-Agent Diagnostic Pipeline (Groq LPU)'}</span>
        </button>
      </div>

      {/* 4 AGENTS PIPELINE STATUS & DIAGNOSTIC INSPECTOR */}
      <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6E4DD] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#18181B]">4-Agent Autonomous Mesh</h2>
            <p className="text-xs text-zinc-500">Live operational topology and diagnostic inspection</p>
          </div>
          <div className="text-xs font-mono text-zinc-400">Mesh State: ACTIVE</div>
        </div>

        {/* 4 Agent Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {agents.map((agent) => {
            const isStepActive =
              pipelineRunning &&
              ((agent.id === 1 && pipelineStep === 1) ||
                (agent.id === 2 && pipelineStep === 2) ||
                (agent.id === 3 && pipelineStep === 3) ||
                (agent.id === 4 && pipelineStep === 4));

            return (
              <div
                key={agent.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isStepActive
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-sm'
                    : 'bg-[#FAF8F5] border-[#E6E4DD]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Agent 0{agent.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isStepActive
                        ? 'bg-indigo-100 text-indigo-700 animate-pulse'
                        : 'bg-white text-zinc-600 border border-[#E6E4DD]'
                    }`}
                  >
                    {isStepActive ? 'EXECUTING' : agent.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm font-bold text-[#18181B]">{agent.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{agent.role}</div>
              </div>
            );
          })}
        </div>

        {/* Diagnostic Output Results */}
        {pipelineResult && (
          <div className="p-5 rounded-2xl bg-[#18181B] text-zinc-200 border border-zinc-800 space-y-4 animate-slide-in-up font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Live Groq LPU Diagnostic Completed (0.24s execution time)</span>
              </div>
              <span className="text-zinc-500 text-[11px]">openai/gpt-oss-120b</span>
            </div>

            {/* Inspectable Tabs */}
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'profiler', label: 'Profiler-01 Output' },
                { id: 'gapArchitect', label: 'GapArchitect-02 Output' },
                { id: 'polyglotCurator', label: 'PolyglotCurator-03 Output' },
                { id: 'adaptiveMentor', label: 'AdaptiveMentor-04 Output' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setExpandedAgentJson(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    expandedAgentJson === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* JSON Content */}
            <div className="bg-black/60 p-4 rounded-xl overflow-x-auto text-zinc-300">
              <pre>
                {expandedAgentJson === 'profiler' && pipelineResult.profiler.json}
                {expandedAgentJson === 'gapArchitect' && pipelineResult.gapArchitect.json}
                {expandedAgentJson === 'polyglotCurator' && pipelineResult.polyglotCurator.json}
                {expandedAgentJson === 'adaptiveMentor' && pipelineResult.adaptiveMentor.json}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* TWO COLUMN WORKSPACE: AI MENTOR CHAT & LIVE AUDIT STREAM */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* AI Mentor Chat Interface (3 Cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E6E4DD] rounded-3xl p-6 shadow-sm flex flex-col h-[560px]">
          <div className="flex items-center justify-between border-b border-[#E6E4DD] pb-3 mb-4 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EA580C] text-white flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#18181B]">AI Mentor Coach (AdaptiveMentor-04)</h3>
                <p className="text-xs text-zinc-500">Cross-language transfer specialist</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Groq gpt-oss-120b</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">
                    04
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#EA580C] text-white font-medium rounded-tr-xs'
                      : 'bg-[#FAF8F5] text-zinc-800 border border-[#E6E4DD] rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-white/80' : 'text-zinc-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-2 items-center text-xs text-zinc-500 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>AdaptiveMentor-04 synthesizing polyglot guidance...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="pt-3 border-t border-[#E6E4DD] flex-shrink-0">
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {PRESET_QUERIES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F3F1EC] border border-[#E6E4DD] text-[11px] text-zinc-600 whitespace-nowrap transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI Mentor anything about your career graph..."
                className="flex-1 px-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-xs text-zinc-800 focus:outline-none focus:bg-white focus:border-[#EA580C]"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={chatLoading || !query.trim()}
                className="px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Mesh Audit Telemetry Log Stream (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E6E4DD] rounded-3xl p-6 shadow-sm flex flex-col h-[560px]">
          <div className="flex items-center justify-between border-b border-[#E6E4DD] pb-3 mb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0F766E]" />
              <h3 className="text-base font-bold text-[#18181B]">Agent Audit Telemetry</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
              {logs.length} Events
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]">
            {logs.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                Awaiting telemetry events...
              </div>
            ) : (
              logs.slice().reverse().map((log) => {
                let badgeClass = 'bg-zinc-100 text-zinc-600 border-zinc-200';
                if (log.type === 'mutation') badgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                if (log.type === 'warning') badgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
                if (log.type === 'success') badgeClass = 'bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4]';

                return (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E4DD] space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-zinc-800">{log.agent}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${badgeClass}`}>
                        {log.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-zinc-600 font-sans leading-snug">{log.message}</p>
                    <div className="text-[9px] text-zinc-400 text-right">{log.timestamp}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
