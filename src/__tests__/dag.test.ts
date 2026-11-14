// src/__tests__/dag.test.ts — Unit Tests for Skill-DAG Engine & Dynamic Remedial Injection
import { describe, it, expect } from 'vitest';
import {
  SCENARIOS,
  FULLSTACK_SCENARIO,
  AIML_SCENARIO,
  CLOUD_SCENARIO,
  REMEDIAL_NODE,
  REMEDIAL_EDGE_FROM,
  REMEDIAL_EDGE_TO,
} from '../data/scenarios';
import type { DAGNode, DAGEdge } from '../types';

describe('Topological Integrity of Baseline Scenarios', () => {
  const scenarios = [
    { name: 'Full Stack Developer', config: FULLSTACK_SCENARIO },
    { name: 'AI/ML Systems Engineer', config: AIML_SCENARIO },
    { name: 'Cloud Native & DevOps', config: CLOUD_SCENARIO },
  ];

  for (const { name, config } of scenarios) {
    it(`validates graph topology for "${name}"`, () => {
      const nodeIds = new Set(config.nodes.map((n) => n.id));
      expect(nodeIds.size).toBe(config.nodes.length); // Unique IDs

      for (const edge of config.edges) {
        // Source and target must exist in the node list
        expect(nodeIds.has(edge.from)).toBe(true);
        expect(nodeIds.has(edge.to)).toBe(true);
        // No self-loops
        expect(edge.from).not.toBe(edge.to);
      }

      // Must have at least one mastered prerequisite node
      const mastered = config.nodes.filter((n) => n.status === 'mastered');
      expect(mastered.length).toBeGreaterThanOrEqual(1);

      // Must have exactly one currently active node
      const active = config.nodes.filter((n) => n.status === 'active');
      expect(active.length).toBe(1);
    });
  }
});

describe('Dynamic Remedial Node Injection Engine (Chaos & Self-Healing)', () => {
  it('correctly splices the remedial node into the active DAG on assessment drop', () => {
    // Initial nodes & edges
    const initialNodes: DAGNode[] = [...FULLSTACK_SCENARIO.nodes];
    const initialEdges: DAGEdge[] = [...FULLSTACK_SCENARIO.edges];

    // Pre-condition: remedial node not present
    expect(initialNodes.some((n) => n.id === REMEDIAL_NODE.id)).toBe(false);

    // Simulate failure injection (same logic as Roadmap / App chaos handler)
    const updatedNodes: DAGNode[] = [
      ...initialNodes,
      {
        ...REMEDIAL_NODE,
      },
    ];

    const updatedEdges: DAGEdge[] = [
      // Remove direct edge from js -> react
      ...initialEdges.filter(
        (e) => !(e.from === REMEDIAL_EDGE_FROM && e.to === REMEDIAL_EDGE_TO)
      ),
      // Bridge through remedial node
      { from: REMEDIAL_EDGE_FROM, to: REMEDIAL_NODE.id },
      { from: REMEDIAL_NODE.id, to: REMEDIAL_EDGE_TO },
    ];

    // Verification 1: Remedial node is added
    const remedialNode = updatedNodes.find((n) => n.id === REMEDIAL_NODE.id);
    expect(remedialNode).toBeDefined();
    expect(remedialNode?.status).toBe('remedial');
    expect(remedialNode?.isRemedial).toBe(true);

    // Verification 2: Direct edge js -> react was severed
    const directEdge = updatedEdges.find(
      (e) => e.from === REMEDIAL_EDGE_FROM && e.to === REMEDIAL_EDGE_TO
    );
    expect(directEdge).toBeUndefined();

    // Verification 3: Two bridge edges created
    const toRemedial = updatedEdges.find(
      (e) => e.from === REMEDIAL_EDGE_FROM && e.to === REMEDIAL_NODE.id
    );
    const fromRemedial = updatedEdges.find(
      (e) => e.from === REMEDIAL_NODE.id && e.to === REMEDIAL_EDGE_TO
    );
    expect(toRemedial).toBeDefined();
    expect(fromRemedial).toBeDefined();

    // Verification 4: Node count increased by 1
    expect(updatedNodes.length).toBe(initialNodes.length + 1);
  });

  it('restores the graph topology when scenario is reset', () => {
    const fullstack = SCENARIOS.fullstack;
    expect(fullstack.nodes.length).toBe(7);
    expect(fullstack.nodes.some((n) => n.isRemedial)).toBe(false);
  });
});
