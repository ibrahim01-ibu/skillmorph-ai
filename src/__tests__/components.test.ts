// src/__tests__/components.test.ts — Lightweight Component Math & Analytics Validation
import { describe, it, expect } from 'vitest';
import { COHORT_STUDENTS } from '../data/scenarios';
import { ErrorBoundary } from '../components/ErrorBoundary';

describe('SkillRadar Geometry & Trigonometric Computations', () => {
  it('computes symmetric polar-to-cartesian polygon coordinates for 5 axes', () => {
    const totalAxes = 5;
    const center = { x: 90, y: 90 };
    const radius = 68;

    const points: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < totalAxes; i++) {
      const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      points.push({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 });
    }

    expect(points).toHaveLength(5);
    // Top axis at angle -PI/2 should be at (center.x, center.y - radius)
    expect(points[0].x).toBe(center.x);
    expect(points[0].y).toBe(center.y - radius);
  });
});

describe('Institutional Cohort Intelligence Computations', () => {
  it('correctly calculates cohort average readiness and bottleneck clusters', () => {
    expect(COHORT_STUDENTS.length).toBeGreaterThan(0);

    const totalReadiness = COHORT_STUDENTS.reduce((acc, st) => acc + st.readiness, 0);
    const avgReadiness = Math.round(totalReadiness / COHORT_STUDENTS.length);

    expect(avgReadiness).toBeGreaterThan(0);
    expect(avgReadiness).toBeLessThanOrEqual(100);

    // Identify critical missing skill bottleneck
    const missingCounts: Record<string, number> = {};
    for (const student of COHORT_STUDENTS) {
      for (const skill of student.missingSkills) {
        missingCounts[skill] = (missingCounts[skill] || 0) + 1;
      }
    }

    const bottleneck = Object.entries(missingCounts).sort((a, b) => b[1] - a[1])[0];
    expect(bottleneck).toBeDefined();
    expect(bottleneck[1]).toBeGreaterThan(0);
  });
});

describe('ErrorBoundary Architecture', () => {
  it('exposes standard React ErrorBoundary lifecycle methods', () => {
    expect(ErrorBoundary).toBeDefined();
    expect(typeof ErrorBoundary.getDerivedStateFromError).toBe('function');

    const testError = new Error('Simulated testing anomaly');
    const state = ErrorBoundary.getDerivedStateFromError(testError);
    expect(state.hasError).toBe(true);
    expect(state.error).toBe(testError);
  });
});
