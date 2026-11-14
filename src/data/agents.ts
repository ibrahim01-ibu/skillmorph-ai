// ============================================================
// src/data/agents.ts — Agent definitions
// ============================================================
import type { Agent } from '../types';

export const AGENTS: Agent[] = [
  {
    id: 1,
    name: 'Profiler-01',
    role: 'Skill & GitHub Auditor',
    status: 'idle',
    icon: 'scan',
    color: 'cyan',
  },
  {
    id: 2,
    name: 'GapArchitect-02',
    role: 'Career Delta & Transfer-Learning Mapper',
    status: 'idle',
    icon: 'git-branch',
    color: 'emerald',
  },
  {
    id: 3,
    name: 'PolyglotCurator-03',
    role: 'Brain-Diff & Resource Synthesizer',
    status: 'idle',
    icon: 'code-2',
    color: 'violet',
  },
  {
    id: 4,
    name: 'AdaptiveMentor-04',
    role: 'Assessment Evaluator & Dynamic Rerouter',
    status: 'idle',
    icon: 'bot',
    color: 'amber',
  },
];
