// src/components/RoadmapView.tsx — Spacious Interactive Skill-DAG Workspace
import { useState } from 'react';
import { SkillDAG } from './SkillDAG';
import { AgentStepperBar } from './AgentStepperBar';
import type { DAGNode, DAGEdge, Agent, AgentLog } from '../types';
import { NODE_CONTENT } from '../data/scenarios';
import {
  Compass,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Zap,
  CheckCircle2,
  Lock,
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

  // Active agent for stepper bar
  const activeAgent = agents.find((a) => a.status !== 'idle');

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
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
      <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
              Autonomous Skill-DAG Engine
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
              Waze-Style Dynamic Rerouting
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#18181B] mt-1">
            Adaptive Learning Graph: {targetRoleTitle}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Topological transfer learning roadmap. Master prerequisite nodes to unlock advanced milestones.
          </p>
        </div>

        {/* Progress & Chaos Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          {/* Progress widget */}
          <div className="bg-[#FAF8F5] border border-[#E6E4DD] rounded-2xl p-3.5 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-zinc-600">Roadmap Velocity</span>
              <span className="text-[#0F766E] font-bold font-mono">{progressPct}% ({masteredCount}/{totalCount})</span>
            </div>
            <div className="h-2 w-full bg-[#E6E4DD] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#EA580C] to-[#0F766E] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 text-right">
              Career Readiness: <span className="font-bold text-[#18181B]">{readiness}%</span>
            </div>
          </div>

          {/* Quick Chaos Buttons for Judges */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={onSimulateFailure}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Assessment Failure (Splice Rescue Node)</span>
            </button>

            <button
              onClick={onResetScenario}
              className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
              <span>Reset Default Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Roadmap Canvas */}
      <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#EA580C]" />
            <h2 className="text-lg font-bold text-[#18181B]">Topological Dependency Canvas</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-[#0F766E]">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
            </span>
            <span className="flex items-center gap-1 text-[#EA580C]">
              <Zap className="w-3.5 h-3.5" /> Active / Unlocked
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <Lock className="w-3.5 h-3.5" /> Locked Prerequisite
            </span>
          </div>
        </div>

        {/* SVG DAG Component Container */}
        <div className="h-[460px] w-full rounded-2xl bg-[#FAF8F5] border border-[#E6E4DD] overflow-hidden flex items-center justify-center relative">
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
        <div className="bg-white border-2 border-[#EA580C]/40 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  Selected Node Inspector
                </span>
                {selectedNode.isRemedial && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    🚑 Remedial Rescue Bridge
                  </span>
                )}
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    selectedNode.status === 'mastered'
                      ? 'bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]'
                      : selectedNode.status === 'active'
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                  }`}
                >
                  Status: {selectedNode.status.toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-[#18181B]">{selectedNode.label}</h3>
              <p className="text-sm text-zinc-600 max-w-2xl">
                {nodeContent?.brainDiff.explanation ||
                  'Transfer-learning milestone curated by PolyglotCurator-03 based on your existing skill inventory.'}
              </p>
            </div>

            {/* Launch Studio CTA */}
            <div className="w-full md:w-auto">
              <button
                onClick={() => onLaunchStudio(selectedNode)}
                disabled={selectedNode.status === 'locked'}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#EA580C]/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {selectedNode.status === 'locked'
                    ? 'Prerequisites Required to Unlock'
                    : 'Launch Interactive Learning Studio & AI Assessment'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
