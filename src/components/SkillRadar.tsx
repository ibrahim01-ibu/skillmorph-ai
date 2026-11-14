// src/components/SkillRadar.tsx — Custom SVG Polygon Radar Chart
import { useMemo } from 'react';
import type { RadarData } from '../types';

interface SkillRadarProps {
  data: RadarData[];
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return {
    x: cx + r * Math.sin(angleRad),
    y: cy - r * Math.cos(angleRad),
  };
}

function pointsToPath(points: { x: number; y: number }[]) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') + ' Z';
}

const RADAR_LEVELS = [0.2, 0.4, 0.6, 0.8, 1.0];

export function SkillRadar({ data, size = 220 }: SkillRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.38;
  const n = data.length;

  const angles = useMemo(() => Array.from({ length: n }, (_, i) => (2 * Math.PI * i) / n), [n]);

  const gridPolygons = useMemo(
    () =>
      RADAR_LEVELS.map((level) => {
        const pts = angles.map((a) => polarToCartesian(cx, cy, maxR * level, a));
        return pointsToPath(pts);
      }),
    [angles, cx, cy, maxR]
  );

  const currentPoints = useMemo(
    () => angles.map((a, i) => polarToCartesian(cx, cy, (maxR * data[i].current) / 100, a)),
    [angles, data, cx, cy, maxR]
  );

  const targetPoints = useMemo(
    () => angles.map((a, i) => polarToCartesian(cx, cy, (maxR * data[i].target) / 100, a)),
    [angles, data, cx, cy, maxR]
  );

  const axisPoints = useMemo(
    () => angles.map((a) => polarToCartesian(cx, cy, maxR, a)),
    [angles, cx, cy, maxR]
  );

  const labelPoints = useMemo(
    () => angles.map((a) => polarToCartesian(cx, cy, maxR + 22, a)),
    [angles, cx, cy, maxR]
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="select-none">
      {/* Grid circles */}
      {gridPolygons.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="rgba(71,85,105,0.3)" strokeWidth="0.5" />
      ))}

      {/* Axis lines */}
      {axisPoints.map((pt, i) => (
        <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="rgba(71,85,105,0.4)" strokeWidth="0.5" />
      ))}

      {/* Target benchmark (emerald dashed) */}
      <path
        d={pointsToPath(targetPoints)}
        fill="rgba(16,185,129,0.06)"
        stroke="rgba(16,185,129,0.6)"
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />

      {/* Current skill vector (cyan fill) */}
      <path
        d={pointsToPath(currentPoints)}
        fill="rgba(6,182,212,0.15)"
        stroke="rgba(6,182,212,0.8)"
        strokeWidth="2"
      />

      {/* Current dots */}
      {currentPoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={3} fill="#06b6d4" stroke="rgba(6,182,212,0.4)" strokeWidth="2" />
      ))}

      {/* Target dots */}
      {targetPoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r={2} fill="none" stroke="#10b981" strokeWidth="1.5" />
      ))}

      {/* Axis labels */}
      {labelPoints.map((pt, i) => {
        const lines = data[i].axis.split('\n');
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fill="rgba(148,163,184,0.9)"
            className="font-mono"
          >
            {lines.map((line, li) => (
              <tspan key={li} x={pt.x} dy={li === 0 ? 0 : 10}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}

      {/* Value labels on current points */}
      {currentPoints.map((pt, i) => (
        <text
          key={i}
          x={pt.x + (pt.x > cx ? 6 : pt.x < cx ? -6 : 0)}
          y={pt.y + (pt.y > cy ? 7 : pt.y < cy ? -7 : 0)}
          textAnchor="middle"
          fontSize="7"
          fill="#06b6d4"
          fontWeight="600"
        >
          {data[i].current}%
        </text>
      ))}

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={2} fill="rgba(71,85,105,0.6)" />

      {/* Legend */}
      <g transform={`translate(8, ${size - 24})`}>
        <rect x={0} y={0} width={8} height={2} fill="#06b6d4" rx="1" />
        <text x={12} y={6} fontSize="7" fill="rgba(148,163,184,0.8)">Current</text>
        <line x1={60} y1={1} x2={68} y2={1} stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x={72} y={6} fontSize="7" fill="rgba(148,163,184,0.8)">Target</text>
      </g>
    </svg>
  );
}
