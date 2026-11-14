// src/components/RightPanel.tsx — Live 4-Agent War Room & AI Mentor Chat
import { useState, useRef, useEffect } from 'react';
import { Scan, GitBranch, Code2, Bot, Send, Loader2, Cpu } from 'lucide-react';
import type { Agent, AgentLog, ChatMessage } from '../types';
import { CHAT_RESPONSES } from '../data/scenarios';
import { askMentorGroq } from '../services/groq';

const AGENT_ICONS: Record<string, React.ReactNode> = {
  scan: <Scan className="w-3.5 h-3.5" />,
  'git-branch': <GitBranch className="w-3.5 h-3.5" />,
  'code-2': <Code2 className="w-3.5 h-3.5" />,
  bot: <Bot className="w-3.5 h-3.5" />,
};

const AGENT_COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; pill: string }> = {
  cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30', pill: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30', pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/30', pill: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30', pill: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  idle: { label: 'Idle', color: 'bg-slate-600 text-slate-300' },
  thinking: { label: 'Thinking', color: 'bg-blue-500/20 text-blue-300' },
  mutating: { label: 'Mutating Graph', color: 'bg-amber-500/20 text-amber-300 animate-pulse' },
};

const LOG_TYPE_STYLES: Record<string, string> = {
  info: 'text-slate-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
  mutation: 'text-violet-400',
  handoff: 'text-cyan-400',
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
    content: 'Hi Aarav! 👋 I\'m your AI Mentor powered by the 4-agent Groq mesh. Ask me anything — "Explain React state using Python analogies", "How do I prep for a Full Stack interview?", or "What\'s the JS equivalent of asyncio.gather?"',
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
      timestamp: new Date().toLocaleTimeString(),
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
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (err) {
        console.warn('Groq mentor failed, falling back:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: getSmartResponse(query),
            timestamp: new Date().toLocaleTimeString(),
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
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
    setChatLoading(false);
  }

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Agent Status Cards */}
      <div className="glass rounded-xl p-3 border border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">4-Agent Collaboration War Room</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400">Mesh Active</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {agents.map((agent) => {
            const colors = AGENT_COLOR_CLASSES[agent.color];
            const statusInfo = STATUS_LABELS[agent.status];
            return (
              <div key={agent.id} className={`rounded-lg p-2.5 border ${colors.bg} ${colors.border}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={colors.text}>{AGENT_ICONS[agent.icon]}</span>
                  <span className="text-[11px] font-mono font-semibold text-white whitespace-nowrap">{agent.name}</span>
                </div>
                <div className="text-[9px] text-slate-500 leading-tight mb-1.5">{agent.role}</div>
                <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Collaboration Stream */}
      <div className="glass rounded-xl border border-slate-800 flex flex-col flex-shrink-0" style={{ maxHeight: '220px' }}>
        <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-300">Live Agent Collaboration Stream</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono">
          {logs.length === 0 && (
            <div className="text-[10px] text-slate-600 p-2 text-center">Agents on standby — interact with the DAG to activate...</div>
          )}
          {logs.map((log) => {
            const color = AGENT_COLOR_CLASSES[agents.find(a => a.id === log.agentId)?.color ?? 'cyan'];
            return (
              <div key={log.id} className="flex gap-2 items-start animate-slide-in-up">
                <span className="text-[9px] text-slate-600 flex-shrink-0 mt-0.5">{log.timestamp}</span>
                <span className={`text-[9px] font-semibold flex-shrink-0 ${color.text}`}>[{log.agent}]</span>
                <span className={`text-[9px] leading-relaxed ${LOG_TYPE_STYLES[log.type]}`}>{log.message}</span>
                {log.payload && (
                  <details className="text-[8px] text-slate-600 ml-auto flex-shrink-0">
                    <summary className="cursor-pointer hover:text-slate-400">JSON</summary>
                    <pre className="bg-slate-900 rounded p-1 mt-1 text-[8px] text-slate-500 max-w-xs overflow-x-auto">{JSON.stringify(JSON.parse(log.payload), null, 2)}</pre>
                  </details>
                )}
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* AI Mentor Chat */}
      <div className="glass rounded-xl border border-slate-800 flex flex-col flex-1 overflow-hidden">
        <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2 flex-shrink-0">
          <Bot className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[11px] font-semibold text-slate-300">AI Mentor Chat</span>
          <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded border ${groqKey ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
            {groqKey ? 'Groq Live (gpt-oss-120b)' : 'Simulation Engine'}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-in-up`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${msg.role === 'user' ? 'bg-cyan-600' : 'bg-violet-600'}`}>
                {msg.role === 'user' ? 'A' : '🤖'}
              </div>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 ${msg.role === 'user' ? 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-100' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>
                <div className="text-[11px] leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                <div className="text-[9px] text-slate-600 mt-1">{msg.timestamp}</div>
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex gap-2 items-center animate-slide-in-up">
              <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-[10px]">🤖</div>
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
                <Loader2 className="w-3 h-3 text-violet-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-3 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
          {[
            'Explain React state via Python',
            'Full Stack interview prep',
            'JS async vs Python asyncio',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => { setChatInput(prompt); }}
              className="text-[9px] px-2 py-1 rounded border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 pb-3 flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask your AI mentor..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
            <button
              onClick={sendMessage}
              disabled={!chatInput.trim() || chatLoading}
              className="w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
