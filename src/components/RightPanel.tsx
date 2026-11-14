// src/components/RightPanel.tsx — Apple / Fluent Daylight Agent Pipeline Stack & AI Mentor
import { useState, useRef, useEffect } from 'react';
import {
  Scan,
  GitBranch,
  Code2,
  Bot,
  Send,
  Loader2,
  Cpu,
  Terminal,
} from 'lucide-react';
import type { Agent, AgentLog, ChatMessage } from '../types';
import { CHAT_RESPONSES } from '../data/scenarios';
import { askMentorGroq } from '../services/groq';

const AGENT_ICONS: Record<string, React.ReactNode> = {
  scan: <Scan className="w-4 h-4 text-cyan-600" />,
  'git-branch': <GitBranch className="w-4 h-4 text-emerald-600" />,
  'code-2': <Code2 className="w-4 h-4 text-indigo-600" />,
  bot: <Bot className="w-4 h-4 text-amber-600" />,
};

const AGENT_COLORS: Record<string, { bg: string; border: string; pill: string }> = {
  cyan: { bg: 'bg-cyan-50/50', border: 'border-cyan-200', pill: 'bg-cyan-100 text-cyan-800' },
  emerald: { bg: 'bg-emerald-50/50', border: 'border-emerald-200', pill: 'bg-emerald-100 text-emerald-800' },
  violet: { bg: 'bg-indigo-50/50', border: 'border-indigo-200', pill: 'bg-indigo-100 text-indigo-800' },
  amber: { bg: 'bg-amber-50/50', border: 'border-amber-200', pill: 'bg-amber-100 text-amber-800' },
};

const STATUS_PILLS: Record<string, { label: string; style: string }> = {
  idle: { label: 'Idle / Ready', style: 'bg-slate-100 text-slate-600' },
  thinking: { label: 'Active Turn', style: 'bg-blue-50 text-blue-700 animate-pulse font-semibold' },
  mutating: { label: 'Mutating DAG', style: 'bg-amber-50 text-amber-800 animate-pulse font-bold' },
};

function getSmartResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('react') && (q.includes('state') || q.includes('python'))) return CHAT_RESPONSES.react;
  if (q.includes('async') || q.includes('promise') || q.includes('event loop')) return CHAT_RESPONSES.async;
  if (q.includes('interview') || q.includes('prepare') || q.includes('prep')) return CHAT_RESPONSES.interview;
  return CHAT_RESPONSES.default;
}

interface RightPanelProps {
  agents: Agent[];
  logs: AgentLog[];
  groqKey?: string;
  targetRole?: string;
  currentSkills?: string[];
  readiness?: number;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '0',
    role: 'assistant',
    content:
      'Hi Aarav, I\'m your AI Career Coach powered by the 4-agent Groq mesh. Ask me anything — "Explain React state using Python analogies", "How do I prep for a Full Stack interview?", or "What\'s the JS equivalent of asyncio.gather?"',
    timestamp: '10:00 AM',
  },
];

export function RightPanel({
  agents,
  logs,
  groqKey,
  targetRole = 'Full Stack Developer',
  currentSkills = ['Python', 'SQL'],
  readiness = 50,
}: RightPanelProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatLoading, setChatLoading] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    const query = chatInput.trim();
    setChatInput('');
    setChatLoading(true);

    if (groqKey) {
      try {
        const text = await askMentorGroq(
          query,
          {
            currentSkills,
            targetRole,
            readiness,
          },
          groqKey
        );
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } catch (err) {
        console.warn('Groq mentor note:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: getSmartResponse(query),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } else {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: getSmartResponse(query),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
    setChatLoading(false);
  }

  return (
    <div className="flex flex-col gap-4 h-full pb-6">
      {/* 4-Agent Pipeline Stack */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <div>
              <div className="text-xs font-bold text-slate-900">Autonomous 4-Agent Pipeline</div>
              <div className="text-[10px] text-slate-500">Continuous collaborative mesh</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active
          </span>
        </div>

        {/* Vertical Pipeline Stack */}
        <div className="space-y-2">
          {agents.map((agent) => {
            const colors = AGENT_COLORS[agent.color] || AGENT_COLORS.violet;
            const statusInfo = STATUS_PILLS[agent.status] || STATUS_PILLS.idle;
            return (
              <div
                key={agent.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border ${colors.bg} ${colors.border} transition-all`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-xs">
                    {AGENT_ICONS[agent.icon]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-mono text-slate-900 truncate">
                      {agent.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">{agent.role}</div>
                  </div>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded-md border border-slate-200 flex-shrink-0 ml-2 ${statusInfo.style}`}>
                  {statusInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Collaboration Stream */}
      <div className="bg-white rounded-2xl border border-slate-200/90 flex flex-col flex-shrink-0 shadow-sm overflow-hidden" style={{ maxHeight: '210px' }}>
        <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-xs font-bold text-slate-800">Agent Collaboration Log</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">{logs.length} events</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono bg-slate-50/30">
          {logs.length === 0 && (
            <div className="text-[11px] text-slate-400 p-3 text-center">
              Agent mesh standby — click DAG nodes or scan repos to stream events...
            </div>
          )}
          {logs.map((log) => (
            <div key={log.id} className="text-[10px] text-slate-700 leading-relaxed border-b border-slate-100 pb-1">
              <span className="text-slate-400 mr-1.5">{log.timestamp}</span>
              <span className="font-bold text-blue-700 mr-1.5">[{log.agent}]</span>
              <span>{log.message}</span>
              {log.payload && (
                <details className="mt-0.5 text-slate-500">
                  <summary className="cursor-pointer hover:text-slate-800 text-[9px] text-blue-600">
                    Inspect JSON Handoff
                  </summary>
                  <pre className="bg-white p-2 rounded-lg border border-slate-200 text-[9px] mt-1 overflow-x-auto text-slate-700">
                    {JSON.stringify(JSON.parse(log.payload), null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* AI Mentor Chat */}
      <div className="bg-white rounded-2xl border border-slate-200/90 flex flex-col flex-1 shadow-sm overflow-hidden min-h-[340px]">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">AI Mentor Coach</div>
              <div className="text-[10px] text-slate-500">Polyglot mental model tutor</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md px-2 py-0.5">
            {groqKey ? 'Groq LPU Active' : 'Deterministic Engine'}
          </span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-in-up`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold font-mono flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-800 border border-zinc-300'
                }`}
              >
                {msg.role === 'user' ? 'AS' : 'AI'}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-50 border border-slate-200/90 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[9px] mt-1 ${
                    msg.role === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-300 flex items-center justify-center text-[11px] font-bold font-mono">
                AI
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <Loader2 className="w-3.5 h-3.5 text-zinc-700 animate-spin" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Prompt shortcuts */}
        <div className="px-4 py-2 flex gap-1.5 flex-wrap border-t border-slate-100 bg-slate-50/30">
          {[
            'Explain React state via Python',
            'Full Stack interview prep',
            'JS async vs Python asyncio',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setChatInput(prompt)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your mentor anything..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim() || chatLoading}
              className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
