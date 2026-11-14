// src/components/SkillDAG.tsx — Custom SVG Interactive Skill DAG Roadmap
import { useMemo } from 'react';
import { CheckCircle2, Lock, AlertTriangle, Zap, Circle } from 'lucide-react';
import type { DAGNode, DAGEdge } from '../types';

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  mastered: {
    bg: 'rgba(16,185,129,0.15)',
    border: 'rgba(16,185,129,0.6)',
    text: '#6ee7b7',
    glow: 'node-mastered',
  },
  active: {
    bg: 'rgba(6,182,212,0.15)',
    border: 'rgba(6,182,212,0.7)',
    text: '#67e8f9',
    glow: 'node-active',
  },
  locked: {
    bg: 'rgba(30,41,59,0.6)',
    border: 'rgba(51,65,85,0.5)',
    text: '#94a3b8',
    glow: 'node-locked',
  },
  remedial: {
    bg: 'rgba(245,158,11,0.15)',
    border: 'rgba(245,158,11,0.7)',
    text: '#fcd34d',
    glow: 'node-remedial',
  },
};

interface SkillDAGProps {
  nodes: DAGNode[];
  edges: DAGEdge[];
  selectedNodeId: string | null;
  onNodeClick: (node: DAGNode) => void;
}

const NODE_W = 120;
const NODE_H = 44;
const SVG_W = 480;
const SVG_H = 620;

export function SkillDAG({ nodes, edges, selectedNodeId, onNodeClick }: SkillDAGProps) {
  const nodeMap = useMemo(() => {
    const m: Record<string, DAGNode> = {};
    nodes.forEach((n) => { m[n.id] = n; });
    return m;
  }, [nodes]);

  function getEdgePath(from: DAGNode, to: DAGNode) {
    const x1 = from.x;
    const y1 = from.y + NODE_H / 2;
    const x2 = to.x;
    const y2 = to.y - NODE_H / 2;
    const midY = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${midY} ${x2},${midY} ${x2},${y2}`;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-800" style={{ background: 'rgba(2,6,23,0.8)' }}>
      {/* Title */}
      <div className="absolute top-3 left-3 z-10">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Skill DAG Roadmap</div>
        <div className="text-[9px] text-slate-600">Click any node to open Sprint Arena</div>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {[
          { status: 'mastered', label: 'Mastered', color: '#6ee7b7' },
          { status: 'active', label: 'In Progress', color: '#67e8f9' },
          { status: 'locked', label: 'Locked', color: '#94a3b8' },
          { status: 'remedial', label: 'Rescue Sprint', color: '#fcd34d' },
        ].map((item) => (
          <div key={item.status} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[9px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="block"
        style={{ minHeight: 320, maxHeight: 440 }}
      >
        <defs>
          <marker id="arrowhead-locked" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill="rgba(71,85,105,0.5)" />
          </marker>
          <marker id="arrowhead-active" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill="rgba(6,182,212,0.6)" />
          </marker>
          <marker id="arrowhead-mastered" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill="rgba(16,185,129,0.6)" />
          </marker>
          <marker id="arrowhead-remedial" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M1,1 L7,4 L1,7 Z" fill="rgba(245,158,11,0.7)" />
          </marker>
          <filter id="glow-cyan">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-emerald">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-amber">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodeMap[edge.from];
          const to = nodeMap[edge.to];
          if (!from || !to) return null;
          const toStatus = to.status;
          const isRemedialEdge = to.isRemedial || from.isRemedial;
          const edgeColor = isRemedialEdge
            ? 'rgba(245,158,11,0.5)'
            : toStatus === 'mastered'
            ? 'rgba(16,185,129,0.4)'
            : toStatus === 'active'
            ? 'rgba(6,182,212,0.5)'
            : 'rgba(51,65,85,0.3)';
          const markerId = isRemedialEdge
            ? 'arrowhead-remedial'
            : toStatus === 'mastered'
            ? 'arrowhead-mastered'
            : toStatus === 'active'
            ? 'arrowhead-active'
            : 'arrowhead-locked';
          return (
            <path
              key={i}
              d={getEdgePath(from, to)}
              fill="none"
              stroke={edgeColor}
              strokeWidth={isRemedialEdge ? 2 : 1.5}
              strokeDasharray={isRemedialEdge ? '6,3' : toStatus === 'locked' ? '4,4' : undefined}
              markerEnd={`url(#${markerId})`}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const style = STATUS_STYLES[node.status];
          const isSelected = node.id === selectedNodeId;
          const halfW = NODE_W / 2;
          const halfH = NODE_H / 2;
          const glowFilter =
            node.status === 'remedial'
              ? 'url(#glow-amber)'
              : node.status === 'active'
              ? 'url(#glow-cyan)'
              : node.status === 'mastered'
              ? 'url(#glow-emerald)'
              : undefined;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x - halfW}, ${node.y - halfH})`}
              onClick={() => node.status !== 'locked' && onNodeClick(node)}
              style={{ cursor: node.status !== 'locked' ? 'pointer' : 'default' }}
              filter={glowFilter}
            >
              {/* Selection ring */}
              {isSelected && (
                <rect
                  x={-3}
                  y={-3}
                  width={NODE_W + 6}
                  height={NODE_H + 6}
                  rx={11}
                  fill="none"
                  stroke={node.status === 'remedial' ? 'rgba(245,158,11,0.8)' : 'rgba(6,182,212,0.8)'}
                  strokeWidth="1.5"
                  strokeDasharray={node.isRemedial ? '5,3' : undefined}
                />
              )}

              {/* Node body */}
              <rect
                x={0}
                y={0}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill={style.bg}
                stroke={isSelected ? style.border : style.border}
                strokeWidth={isSelected ? 2 : 1}
              />

              {/* Status icon */}
              <foreignObject x={8} y={12} width={18} height={18}>
                <div className="flex items-center justify-center w-full h-full">
                  {node.status === 'mastered' && <CheckCircle2 style={{ width: 14, height: 14, color: '#10b981' }} />}
                  {node.status === 'active' && <Zap style={{ width: 14, height: 14, color: '#06b6d4' }} />}
                  {node.status === 'locked' && <Lock style={{ width: 12, height: 12, color: '#475569' }} />}
                  {node.status === 'remedial' && <AlertTriangle style={{ width: 14, height: 14, color: '#f59e0b' }} />}
                </div>
              </foreignObject>

              {/* Label */}
              <text
                x={30}
                y={NODE_H / 2 - 3}
                fontSize="10"
                fontWeight="600"
                fill={style.text}
                dominantBaseline="middle"
              >
                {node.label.length > 14 ? node.label.slice(0, 13) + '…' : node.label}
              </text>

              {/* Sublabel */}
              {node.sublabel && (
                <text x={30} y={NODE_H / 2 + 9} fontSize="8" fill="rgba(148,163,184,0.6)" dominantBaseline="middle">
                  {node.sublabel.length > 18 ? node.sublabel.slice(0, 17) + '…' : node.sublabel}
                </text>
              )}

              {/* Animated pulse for active/remedial */}
              {(node.status === 'active' || node.status === 'remedial') && (
                <rect
                  x={-2}
                  y={-2}
                  width={NODE_W + 4}
                  height={NODE_H + 4}
                  rx={10}
                  fill="none"
                  stroke={node.status === 'remedial' ? 'rgba(245,158,11,0.3)' : 'rgba(6,182,212,0.25)'}
                  strokeWidth="1"
                  className="animate-pulse-glow"
                />
              )}

              {/* Locked overlay */}
              {node.status === 'locked' && (
                <rect x={0} y={0} width={NODE_W} height={NODE_H} rx={8} fill="rgba(2,6,23,0.3)" />
              )}
            </g>
          );
        })}

        {/* "WAZE-STYLE" path highlight */}
        {nodes.filter(n => n.status === 'active').map(activeNode => {
          const masteredNodes = nodes.filter(n => n.status === 'mastered');
          return masteredNodes.map(mn => {
            const edge = edges.find(e => e.from === mn.id && e.to === activeNode.id);
            if (!edge) return null;
            return (
              <path
                key={`highlight-${mn.id}-${activeNode.id}`}
                d={getEdgePath(mn, activeNode)}
                fill="none"
                stroke="rgba(6,182,212,0.15)"
                strokeWidth="10"
                strokeLinecap="round"
              />
            );
          });
        })}

        {/* Circular progress indicator for active node */}
        {nodes.filter(n => n.status === 'active').map(n => (
          <circle
            key={`progress-${n.id}`}
            cx={n.x + NODE_W / 2 - 10}
            cy={n.y - NODE_H / 2 + 5}
            r={4}
            fill="none"
            stroke="rgba(6,182,212,0.6)"
            strokeWidth="1.5"
            strokeDasharray="12.6"
            strokeDashoffset="8"
            strokeLinecap="round"
          />
        ))}

        {/* Unused Circle reference to avoid lint */}
        <circle cx={-100} cy={-100} r={0} fill="transparent" />
      </svg>
    </div>
  );
}

// suppress unused import warning
const _Circle = Circle;
void _Circle;
