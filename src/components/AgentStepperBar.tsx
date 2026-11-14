// src/components/AgentStepperBar.tsx — Multi-Agent Live Mesh Stepper
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import type { Agent } from '../types';

interface AgentStepperBarProps {
  agents: Agent[];
  activeAgentId?: number;
  statusText?: string;
}

export function AgentStepperBar({ agents, activeAgentId, statusText }: AgentStepperBarProps) {
  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl px-5 py-3 shadow-[0_2px_10px_-3px_rgba(15,23,42,0.05)] mb-3">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-800">Autonomous 4-Agent Mesh</div>
            <div className="text-[10px] text-slate-500">
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                    isWorking
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {isWorking ? (
                    <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  )}
                  <span>{agent.name.split('-')[0]}</span>
                </div>
                {index < agents.length - 1 && (
                  <div className={`w-3 h-0.5 ${isWorking ? 'bg-blue-400' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
