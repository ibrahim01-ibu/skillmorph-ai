// src/components/AgentStepperBar.tsx — Multi-Agent Live Mesh Stepper (Daylight Minimalist)
import { CheckCircle2, Loader2, Bot } from 'lucide-react';
import type { Agent } from '../types';

interface AgentStepperBarProps {
  agents: Agent[];
  activeAgentId?: number;
  statusText?: string;
}

export function AgentStepperBar({ agents, activeAgentId, statusText }: AgentStepperBarProps) {
  return (
    <div className="w-full bg-white border border-zinc-200/90 rounded-xl px-5 py-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] mb-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center shadow-xs">
            <Bot size={14} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900">Autonomous 4-Agent Mesh</div>
            <div className="text-xs text-zinc-500">
              {statusText || 'Agents synchronized & monitoring live career state'}
            </div>
          </div>
        </div>

        {/* Stepper Pipeline */}
        <div className="flex items-center gap-2 flex-1 max-w-xl justify-end">
          {agents.map((agent, index) => {
            const isWorking = agent.status !== 'idle' || activeAgentId === agent.id;
            return (
              <div key={agent.id} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isWorking
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border border-zinc-200'
                  }`}
                >
                  {isWorking ? (
                    <Loader2 size={12} className="animate-spin text-white" />
                  ) : (
                    <CheckCircle2 size={12} strokeWidth={1.75} className="text-emerald-600" />
                  )}
                  <span>{agent.name.split('-')[0]}</span>
                </div>
                {index < agents.length - 1 && (
                  <div className={`w-3 h-0.5 ${isWorking ? 'bg-zinc-900' : 'bg-zinc-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
