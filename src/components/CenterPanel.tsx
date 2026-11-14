// src/components/CenterPanel.tsx — Interactive Skill DAG + Sprint Arena (Daylight Redesign)
import { useState } from 'react';
import { SkillDAG } from './SkillDAG';
import { SprintArena } from './SprintArena';
import { AgentStepperBar } from './AgentStepperBar';
import type { DAGNode, DAGEdge, AgentLog, Agent } from '../types';
import { NODE_CONTENT } from '../data/scenarios';
import { ChevronDown, ChevronUp, Route, Sparkles } from 'lucide-react';

interface CenterPanelProps {
  nodes: DAGNode[];
  edges: DAGEdge[];
  agents: Agent[];
  onNodeMastered: (nodeId: string) => void;
  onAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  onRemedialInjected: () => void;
}

export function CenterPanel({
  nodes,
  edges,
  agents,
  onNodeMastered,
  onAgentLog,
  onRemedialInjected,
}: CenterPanelProps) {
  const [selectedNode, setSelectedNode] = useState<DAGNode | null>(null);
  const [arenaOpen, setArenaOpen] = useState(false);

  function handleNodeClick(node: DAGNode) {
    if (node.status === 'locked') return;
    setSelectedNode(node);
    setArenaOpen(true);
    onAgentLog({
      agent: 'PolyglotCurator-03',
      agentId: 3,
      message: `Learner selected node: "${node.label}". Synthesizing Brain-Diff and curating resources. Fetching ${node.isRemedial ? 'rescue' : 'standard'} sprint content...`,
      type: 'info',
      payload: JSON.stringify({ nodeId: node.id, nodeStatus: node.status }),
    });
  }

  const content = selectedNode ? (NODE_CONTENT[selectedNode.id] ?? NODE_CONTENT['js']) : null;

  const masteredCount = nodes.filter((n) => n.status === 'mastered').length;
  const totalCount = nodes.length;
  const progressPct = Math.round((masteredCount / totalCount) * 100);

  // Determine active agent for stepper bar
  const activeAgent = agents.find((a) => a.status !== 'idle');

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      {/* Multi-Agent Stepper Bar */}
      <div className="flex-shrink-0">
        <AgentStepperBar
          agents={agents}
          activeAgentId={activeAgent?.id}
          statusText={
            activeAgent
              ? `${activeAgent.name} is ${activeAgent.status} (${activeAgent.role})`
              : 'Autonomous 4-Agent Mesh active & monitoring live career state'
          }
        />
      </div>

      {/* Header Roadmap Progress Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between gap-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
            <Route className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Adaptive Career DAG</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {masteredCount} of {totalCount} Mastered
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Topological transfer learning graph with dynamic remedial rerouting
            </p>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xs">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700 min-w-[36px] text-right">
            {progressPct}%
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Click any active node to launch 90s Sprint</span>
        </div>
      </div>

      {/* Interactive DAG Canvas + Sprint Arena */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
        {/* DAG Roadmap Container */}
        <div
          className={`flex-shrink-0 transition-all duration-300 ${
            arenaOpen ? 'h-[280px]' : 'flex-1 min-h-[360px]'
          }`}
        >
          <SkillDAG
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNode?.id ?? null}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Sprint Arena Drawer */}
        {arenaOpen && selectedNode && content && (
          <div className="flex-1 overflow-y-auto rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)]">
            <SprintArena
              node={selectedNode}
              content={content}
              onClose={() => {
                setArenaOpen(false);
                setSelectedNode(null);
              }}
              onNodeMastered={(nodeId) => {
                onNodeMastered(nodeId);
                setArenaOpen(false);
                setSelectedNode(null);
              }}
              onAgentLog={onAgentLog}
              onRemedialInjected={onRemedialInjected}
            />
          </div>
        )}

        {/* Helpful hint when arena is closed */}
        {!arenaOpen && (
          <div className="text-center py-1">
            <div className="text-[11px] text-slate-500 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
              <ChevronDown className="w-3.5 h-3.5 text-blue-500 animate-bounce" />
              <span>Select any active or mastered node above to launch the 90-Second Anti-Doomscroll Sprint</span>
              <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
