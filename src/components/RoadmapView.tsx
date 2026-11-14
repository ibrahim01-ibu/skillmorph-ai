// src/components/RoadmapView.tsx — Precision Interactive Skill-DAG Workspace
import { useState } from 'react';
import { SkillDAG } from './SkillDAG';
import { AgentStepperBar } from './AgentStepperBar';
import type { DAGNode, DAGEdge, Agent, AgentLog } from '../types';
import { NODE_CONTENT } from '../data/scenarios';
import {
  Compass,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Lock,
  GitBranch,
} from 'lucide-react';

interface RoadmapViewProps {
  nodes: DAGNode[];
  edges: DAGEdge[];
  agents: Agent[];
  targetRoleTitle: string;
  readiness: number;
  onLaunchStudio: (node: DAGNode) => void;
  onSimulateFailure: () => void;
  onResetScenario: () => void;
  onAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
}

export function RoadmapView({
  nodes,
  edges,
  agents,
  targetRoleTitle,
  readiness,
  onLaunchStudio,
  onSimulateFailure,
  onResetScenario,
  onAgentLog,
}: RoadmapViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    nodes.find((n) => n.status === 'active')?.id || 'js'
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const nodeContent = selectedNode ? NODE_CONTENT[selectedNode.id] || NODE_CONTENT['js'] : null;

  const masteredCount = nodes.filter((n) => n.status === 'mastered').length;
  const totalCount = nodes.length;
  const progressPct = Math.round((masteredCount / totalCount) * 100);

  function handleNodeClick(node: DAGNode) {
    setSelectedNodeId(node.id);
    onAgentLog({
      agent: 'PolyglotCurator-03',
      agentId: 3,
      message: `Node selected on Roadmap: "${node.label}" (${node.status}). Calibrating Brain-Diff transfer specs.`,
      type: 'info',
    });
  }

  const activeAgent = agents.find((a) => a.status !== 'idle');

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      {/* 4-Agent Live Pipeline Bar */}
      <AgentStepperBar
        agents={agents}
        activeAgentId={activeAgent?.id}
        statusText={
          activeAgent
            ? `${activeAgent.name} is ${activeAgent.status} (${activeAgent.role})`
            : 'Autonomous 4-Agent Mesh synchronized and optimizing career graph'
        }
      />

      {/* Header Stats & Quick Chaos Bar */}
      <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Autonomous Skill-DAG Engine
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700">
              Topological Rerouting Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Adaptive Learning Graph: {targetRoleTitle}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-600 mt-1 max-w-2xl">
            Topological transfer learning roadmap. Master prerequisite nodes to unlock downstream milestones.
          </p>
        </div>

        {/* Progress & Chaos Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Progress widget */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-medium mb-1.5">
              <span className="text-zinc-600">Roadmap Progress</span>
              <span className="text-zinc-900 font-mono font-bold">{progressPct}% ({masteredCount}/{totalCount})</span>
            </div>
            <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-xs text-zinc-500 mt-1.5 text-right">
              Readiness: <span className="font-semibold text-zinc-900">{readiness}%</span>
            </div>
          </div>

          {/* Quick Chaos Buttons for Judges */}
          <div className="flex flex-col gap-2">
            <button
              onClick={onSimulateFailure}
              className="px-3.5 py-2 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-2xs"
            >
              <AlertCircle size={14} strokeWidth={1.75} className="text-amber-700" />
              <span>Simulate Failure (Splice Rescue Node)</span>
            </button>

            <button
              onClick={onResetScenario}
              className="px-3.5 py-2 rounded-md bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-2xs"
            >
              <RotateCcw size={14} strokeWidth={1.75} className="text-zinc-500" />
              <span>Reset Default Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Roadmap Canvas */}
      <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass size={18} strokeWidth={1.75} className="text-zinc-800" />
            <h2 className="text-lg font-semibold text-zinc-900">Topological Dependency Canvas</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 size={14} strokeWidth={1.75} /> Mastered
            </span>
            <span className="flex items-center gap-1 text-zinc-900">
              <GitBranch size={14} strokeWidth={1.75} /> Active / Unlocked
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Lock size={14} strokeWidth={1.75} /> Locked Prerequisite
            </span>
          </div>
        </div>

        {/* SVG DAG Component Container */}
        <div className="h-[480px] w-full rounded-xl bg-[#FAFAFA] border border-zinc-200 overflow-hidden flex items-center justify-center relative">
          <SkillDAG
            nodes={nodes}
            edges={edges}
            selectedNodeId={selectedNodeId}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>

      {/* Selected Node Action Drawer */}
      {selectedNode && (
        <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  Selected Node Inspector
                </span>
                {selectedNode.isRemedial && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-900 flex items-center gap-1">
                    <AlertCircle size={13} strokeWidth={1.75} />
                    <span>Remedial Module: Async Execution</span>
                  </span>
                )}
                <span
                  className={`text-xs font-mono font-medium px-2 py-0.5 rounded border ${
                    selectedNode.status === 'mastered'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : selectedNode.status === 'active'
                      ? 'border-zinc-300 bg-zinc-100 text-zinc-800'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-400'
                  }`}
                >
                  STATUS: {selectedNode.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900">{selectedNode.label}</h3>
              <p className="text-sm leading-relaxed text-zinc-600 max-w-2xl">
                {nodeContent?.brainDiff.explanation ||
                  'Transfer-learning milestone curated by PolyglotCurator-03 based on your existing skill inventory.'}
              </p>
            </div>

            {/* Launch Studio CTA */}
            <div className="w-full md:w-auto">
              <button
                onClick={() => onLaunchStudio(selectedNode)}
                disabled={selectedNode.status === 'locked'}
                className="w-full md:w-auto px-5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>
                  {selectedNode.status === 'locked'
                    ? 'Prerequisites Required to Unlock'
                    : 'Launch Interactive Learning Studio & AI Assessment'}
                </span>
                <ArrowRight size={15} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
