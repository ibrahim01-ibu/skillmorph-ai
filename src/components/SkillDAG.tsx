// src/components/SkillDAG.tsx — Apple / Material 3 Spacious Interactive Skill DAG
import { useMemo } from 'react';
import { CheckCircle2, Lock, AlertTriangle, Play, Sparkles } from 'lucide-react';
import type { DAGNode, DAGEdge } from '../types';

const STATUS_CONFIGS: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    pillBg: string;
    pillText: string;
    shadow: string;
  }
> = {
  mastered: {
    bg: '#ffffff',
    border: '#10b981',
    text: '#18181b',
    pillBg: '#ecfdf5',
    pillText: '#047857',
    shadow: 'drop-shadow(0 1px 3px rgba(16, 185, 129, 0.12))',
  },
  active: {
    bg: '#ffffff',
    border: '#18181b',
    text: '#18181b',
    pillBg: '#f4f4f5',
    pillText: '#18181b',
    shadow: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))',
  },
  locked: {
    bg: '#fafafa',
    border: '#e4e4e7',
    text: '#a1a1aa',
    pillBg: '#f4f4f5',
    pillText: '#71717a',
    shadow: 'none',
  },
  remedial: {
    bg: '#ffffff',
    border: '#f59e0b',
    text: '#18181b',
    pillBg: '#fef3c7',
    pillText: '#b45309',
    shadow: 'drop-shadow(0 2px 8px rgba(245, 158, 11, 0.16))',
  },
};

interface SkillDAGProps {
  nodes: DAGNode[];
  edges: DAGEdge[];
  selectedNodeId: string | null;
  onNodeClick: (node: DAGNode) => void;
}

const NODE_W = 196;
const NODE_H = 70;
const SVG_W = 600;
const SVG_H = 640;

function getNodeCoord(node: DAGNode) {
  // Scale x positions with ample breathing room (center 300)
  const scaledX = 300 + (node.x - 240) * 1.8;
  return { x: scaledX, y: node.y + 10 };
}

export function SkillDAG({ nodes, edges, selectedNodeId, onNodeClick }: SkillDAGProps) {
  const nodeMap = useMemo(() => {
    const m: Record<string, DAGNode> = {};
    nodes.forEach((n) => {
      m[n.id] = n;
    });
    return m;
  }, [nodes]);

  function getEdgePath(from: DAGNode, to: DAGNode) {
    const fromPos = getNodeCoord(from);
    const toPos = getNodeCoord(to);
    const x1 = fromPos.x;
    const y1 = fromPos.y + NODE_H / 2;
    const x2 = toPos.x;
    const y2 = toPos.y - NODE_H / 2;
    const midY = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-white border border-zinc-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] p-2">
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200/80 bg-zinc-50/60 rounded-lg mb-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-zinc-900" />
          <div>
            <span className="text-xs font-semibold text-zinc-900">Adaptive Skill-DAG Roadmap</span>
            <span className="text-xs text-zinc-500 ml-2 hidden sm:inline">
              Click any active node to launch the 90-second sprint
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Mastered
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-zinc-900 inline-block animate-pulse" /> Active
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Rescue
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="block select-none"
        style={{ minHeight: 350, maxHeight: 460 }}
      >
        <defs>
          {/* Subtle Grid Dot Pattern */}
          <pattern id="light-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#cbd5e1" opacity="0.4" />
          </pattern>

          {/* Markers */}
          <marker id="arrow-locked" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M1,1 L5,3 L1,5 Z" fill="#94a3b8" />
          </marker>
          <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill="#2563eb" />
          </marker>
          <marker id="arrow-mastered" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M1,1 L5,3 L1,5 Z" fill="#059669" />
          </marker>
          <marker id="arrow-remedial" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill="#d97706" />
          </marker>
        </defs>

        {/* Canvas Background Grid */}
        <rect width={SVG_W} height={SVG_H} fill="url(#light-grid)" />

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
          const toStatus = to.status;
          const isRemedialEdge = to.isRemedial || from.isRemedial;

          const edgeColor = isRemedialEdge
            ? '#d97706'
            : toStatus === 'mastered'
            ? '#10b981'
            : toStatus === 'active'
            ? '#2563eb'
            : '#cbd5e1';

          const markerId = isRemedialEdge
            ? 'arrow-remedial'
            : toStatus === 'mastered'
            ? 'arrow-mastered'
            : toStatus === 'active'
            ? 'arrow-active'
            : 'arrow-locked';

          return (
            <path
              key={i}
              d={getEdgePath(from, to)}
              fill="none"
              stroke={edgeColor}
              strokeWidth={toStatus === 'active' || isRemedialEdge ? 2.5 : 1.75}
              strokeDasharray={isRemedialEdge ? '6,4' : toStatus === 'active' ? '8,4' : undefined}
              className={toStatus === 'active' ? 'animate-flow' : undefined}
              markerEnd={`url(#${markerId})`}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const cfg = STATUS_CONFIGS[node.status] || STATUS_CONFIGS.locked;
          const isSelected = node.id === selectedNodeId;
          const pos = getNodeCoord(node);
          const halfW = NODE_W / 2;
          const halfH = NODE_H / 2;

          return (
            <g
              key={node.id}
              transform={`translate(${pos.x - halfW}, ${pos.y - halfH})`}
              onClick={() => node.status !== 'locked' && onNodeClick(node)}
              style={{
                cursor: node.status !== 'locked' ? 'pointer' : 'default',
                filter: cfg.shadow,
              }}
              className="transition-transform duration-200 hover:-translate-y-0.5"
            >
              {/* Active Selection Glow Ring */}
              {isSelected && (
                <rect
                  x={-4}
                  y={-4}
                  width={NODE_W + 8}
                  height={NODE_H + 8}
                  rx={16}
                  fill="none"
                  stroke={node.status === 'remedial' ? '#f59e0b' : '#2563eb'}
                  strokeWidth="2.5"
                  opacity="0.8"
                />
              )}

              {/* Node Card Body */}
              <rect
                x={0}
                y={0}
                width={NODE_W}
                height={NODE_H}
                rx={12}
                fill={cfg.bg}
                stroke={cfg.border}
                strokeWidth={node.status === 'active' ? 2 : 1.25}
              />

              {/* Left Color Accent Bar */}
              <rect
                x={0}
                y={0}
                width={5}
                height={NODE_H}
                rx={2}
                fill={cfg.border}
              />

              {/* Status Icon */}
              <foreignObject x={12} y={16} width={26} height={26}>
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: cfg.pillBg }}
                >
                  {node.status === 'mastered' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {node.status === 'active' && <Play className="w-4 h-4 text-blue-600 fill-blue-600" />}
                  {node.status === 'locked' && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                  {node.status === 'remedial' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                </div>
              </foreignObject>

              {/* Node Label Title */}
              <text
                x={48}
                y={28}
                fontSize="13"
                fontWeight="600"
                fill={cfg.text}
                dominantBaseline="middle"
              >
                {node.label}
              </text>

              {/* Sublabel / Status Pill */}
              <g transform="translate(48, 41)">
                <rect
                  x={0}
                  y={0}
                  width={Math.min(136, (node.sublabel?.length || 0) * 7 + 16)}
                  height={18}
                  rx={4}
                  fill={cfg.pillBg}
                />
                <text
                  x={8}
                  y={13}
                  fontSize="11"
                  fontWeight="500"
                  fill={cfg.pillText}
                >
                  {node.sublabel}
                </text>
              </g>

              {/* Institutional Priority Badge if remedial/injected */}
              {node.isRemedial && (
                <g transform={`translate(${NODE_W - 20}, 8)`}>
                  <circle cx={6} cy={6} r={7} fill="#f59e0b" />
                  <text x={6} y={9.5} textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="bold">!</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
