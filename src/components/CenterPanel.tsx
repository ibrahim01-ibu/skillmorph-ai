// src/components/CenterPanel.tsx — Interactive Skill DAG + Sprint Arena
import { useState } from 'react';
import { SkillDAG } from './SkillDAG';
import { SprintArena } from './SprintArena';
import type { DAGNode, DAGEdge, AgentLog } from '../types';
import { NODE_CONTENT } from '../data/scenarios';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CenterPanelProps {
  nodes: DAGNode[];
  edges: DAGEdge[];
  onNodeMastered: (nodeId: string) => void;
  onAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  onRemedialInjected: () => void;
}

export function CenterPanel({ nodes, edges, onNodeMastered, onAgentLog, onRemedialInjected }: CenterPanelProps) {
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

  const masteredCount = nodes.filter(n => n.status === 'mastered').length;
  const totalCount = nodes.length;
  const progressPct = Math.round((masteredCount / totalCount) * 100);

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Header Stats */}
      <div className="glass rounded-xl p-3 border border-slate-800 flex items-center gap-4 flex-shrink-0">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">DAG Progress</div>
          <div className="text-sm font-bold text-white">{masteredCount}/{totalCount} nodes</div>
        </div>
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full progress-bar-animate"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="text-sm font-bold text-emerald-400">{progressPct}%</div>
        <div className="text-[10px] text-slate-500 ml-2">
          <span className="text-cyan-400">●</span> Click any active node to begin sprint
        </div>
      </div>

      {/* DAG + Sprint split */}
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        {/* DAG */}
        <div className={`flex-shrink-0 transition-all duration-300 ${arenaOpen ? 'flex-none' : 'flex-1'}`}>
          <SkillDAG
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNode?.id ?? null}
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Sprint Arena */}
        {arenaOpen && selectedNode && content && (
          <div className="flex-1 overflow-y-auto">
            <SprintArena
              node={selectedNode}
              content={content}
              onClose={() => { setArenaOpen(false); setSelectedNode(null); }}
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

        {/* Collapse hint */}
        {!arenaOpen && (
          <div className="text-center py-2">
            <div className="text-[11px] text-slate-600 flex items-center justify-center gap-1">
              <ChevronDown className="w-3 h-3" />
              Select an active/mastered node to open the Sprint Arena below
              <ChevronUp className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
