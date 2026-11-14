// src/components/SkillRadar.tsx — Apple / Material 3 Daylight SVG Polygon Radar Chart
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

const RADAR_LEVELS = [0.25, 0.5, 0.75, 1.0];

export function SkillRadar({ data, size = 240 }: SkillRadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.36;
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
    () => angles.map((a) => polarToCartesian(cx, cy, maxR + 26, a)),
    [angles, cx, cy, maxR]
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox="-60 -25 360 270"
      className="select-none overflow-visible max-w-full"
    >
      {/* Background Polygon Web */}
      {gridPolygons.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={i === gridPolygons.length - 1 ? '#fafafa' : 'none'}
          stroke="#e4e4e7"
          strokeWidth="1"
        />
      ))}

      {/* Axis Spokes */}
      {axisPoints.map((pt, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={pt.x}
          y2={pt.y}
          stroke="#e4e4e7"
          strokeWidth="1"
        />
      ))}

      {/* Target Benchmark (Emerald Dashed Outline) */}
      <path
        d={pointsToPath(targetPoints)}
        fill="rgba(5, 150, 105, 0.05)"
        stroke="#059669"
        strokeWidth="1.75"
        strokeDasharray="4,4"
      />

      {/* Current Skill Vector (Dark Neutral Polygon) */}
      <path
        d={pointsToPath(currentPoints)}
        fill="rgba(24, 24, 27, 0.08)"
        stroke="#18181b"
        strokeWidth="2.25"
      />

      {/* Target Benchmark Dots */}
      {targetPoints.map((pt, i) => (
        <circle
          key={`target-${i}`}
          cx={pt.x}
          cy={pt.y}
          r={2.5}
          fill="#ffffff"
          stroke="#059669"
          strokeWidth="1.5"
        />
      ))}

      {/* Current Skill Dots with Core Center */}
      {currentPoints.map((pt, i) => (
        <g key={`cur-${i}`}>
          <circle
            cx={pt.x}
            cy={pt.y}
            r={4}
            fill="#18181b"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Numeric Badge */}
          <rect
            x={pt.x + (pt.x > cx ? 6 : pt.x < cx ? -28 : -12)}
            y={pt.y + (pt.y > cy ? 5 : pt.y < cy ? -16 : -5)}
            width={24}
            height={14}
            rx={4}
            fill="#f4f4f5"
            stroke="#e4e4e7"
            strokeWidth="0.75"
          />
          <text
            x={pt.x + (pt.x > cx ? 18 : pt.x < cx ? -16 : 0)}
            y={pt.y + (pt.y > cy ? 15 : pt.y < cy ? -6 : 5)}
            textAnchor="middle"
            fontSize="9.5"
            fill="#18181b"
            fontWeight="600"
          >
            {data[i].current}%
          </text>
        </g>
      ))}

      {/* Axis Labels */}
      {labelPoints.map((pt, i) => {
        const lines = data[i].axis.split('\n');
        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="#27272a"
            fontWeight="600"
          >
            {lines.map((line, li) => (
              <tspan key={li} x={pt.x} dy={li === 0 ? 0 : 12}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}

      {/* Center Origin Dot */}
      <circle cx={cx} cy={cy} r={2.5} fill="#a1a1aa" />

      {/* Legend Badge */}
      <g transform={`translate(${cx - 55}, ${size - 5})`}>
        <rect x={0} y={0} width={110} height={18} rx={9} fill="#ffffff" stroke="#e4e4e7" />
        <circle cx={14} cy={9} r={3.5} fill="#18181b" />
        <text x={22} y={12} fontSize="9" fill="#27272a" fontWeight="500">Current</text>
        <line x1={60} y1={9} x2={72} y2={9} stroke="#059669" strokeWidth="1.5" strokeDasharray="3,2" />
        <text x={76} y={12} fontSize="9" fill="#27272a" fontWeight="500">Target</text>
      </g>
    </svg>
  );
}
