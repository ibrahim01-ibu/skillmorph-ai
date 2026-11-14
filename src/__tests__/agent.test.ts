// src/__tests__/agent.test.ts — Unit Tests for 4-Agent Autonomous Mesh Core Logic
import { describe, it, expect } from 'vitest';
import {
  classifyAgentIntent,
  isGreetingOrStatusQuery,
  generateLiveStateGreeting,
  sanitizeAiResponse,
  buildAgentSystemPrompt,
  AGENT_REGISTRY,
  synthesizeCareerFallback,
} from '../services/groq';
import { AGENTS } from '../data/agents';
import type { StudentStateContext } from '../types';

describe('Agent Registry & Topology Specification', () => {
  it('registers all 4 autonomous agents with unique IDs and roles', () => {
    expect(AGENTS).toHaveLength(4);
    const agentIds = AGENTS.map((a) => a.id);
    expect(new Set(agentIds).size).toBe(4);

    expect(AGENT_REGISTRY.profiler.id).toBe(1);
    expect(AGENT_REGISTRY.gapArchitect.id).toBe(2);
    expect(AGENT_REGISTRY.polyglotCurator.id).toBe(3);
    expect(AGENT_REGISTRY.adaptiveMentor.id).toBe(4);
  });
});

describe('Profiler-01 [Skills & AST Audit]', () => {
  it('classifies repository, commit, and audit queries to Profiler-01', () => {
    const profilerQueries = [
      'Can you audit my github repository and git commit history?',
      'Inspect my AST analysis and verified strengths vs weaknesses.',
      'What certifications and verified skills are on my passport profile?',
      'Scan my past projects and existing python stack on github.',
      'Review my resume and verified strengths.',
    ];

    for (const q of profilerQueries) {
      const routed = classifyAgentIntent(q);
      expect(routed.key).toBe('profiler');
      expect(routed.id).toBe(1);
      expect(routed.name).toBe('Profiler-01');
    }
  });

  it('correctly constructs domain-bounded system prompt for Profiler-01', () => {
    const ctx: StudentStateContext = {
      learnerName: 'Aarav Sharma',
      targetRole: 'Full Stack Developer',
      readiness: 42,
      currentSkills: ['Python', 'SQL', 'HTML'],
      missingSkills: ['JavaScript ES6+', 'React', 'Node.js'],
      hasRemediation: false,
    };

    const prompt = buildAgentSystemPrompt(AGENT_REGISTRY.profiler, ctx);
    expect(prompt).toContain('Profiler-01');
    expect(prompt).toContain('Skills & Audit');
    expect(prompt).toContain('Aarav Sharma');
    expect(prompt).toContain('Python, SQL, HTML');
  });
});

describe('GapArchitect-02 [Career Match & Topological DAG]', () => {
  it('classifies career delta and roadmap queries to GapArchitect-02', () => {
    const gapQueries = [
      'What is my career delta and target role requirements for full stack?',
      'Show my missing skill dependencies in the topological DAG roadmap.',
      'What is my current readiness percentage and career match path?',
      'Show the missing gaps and ROI for my target role.',
      'Analyze my market job path and dependency roadmap.',
    ];

    for (const q of gapQueries) {
      const routed = classifyAgentIntent(q);
      expect(routed.key).toBe('gapArchitect');
      expect(routed.id).toBe(2);
      expect(routed.name).toBe('GapArchitect-02');
    }
  });

  it('computes missing skill deltas and builds fallback DAG correctly', () => {
    const existing = ['Python', 'SQL'];
    const result = synthesizeCareerFallback(existing, 'Full Stack Developer');

    expect(result.roleTitle).toBe('Full Stack Developer');
    expect(result.readiness).toBeGreaterThanOrEqual(25);
    expect(result.readiness).toBeLessThanOrEqual(65);
    expect(result.nodes.length).toBeGreaterThanOrEqual(5);
    expect(result.edges.length).toBeGreaterThanOrEqual(4);

    // Verified nodes must be mastered
    const masteredNodes = result.nodes.filter((n) => n.status === 'mastered');
    expect(masteredNodes.length).toBeGreaterThanOrEqual(2);

    // Active missing node exists
    const activeNode = result.nodes.find((n) => n.status === 'active');
    expect(activeNode).toBeDefined();
  });
});

describe('PolyglotCurator-03 [Courses & Brain-Diff Bridge]', () => {
  it('classifies cross-language code translation and syntax queries to PolyglotCurator-03', () => {
    const polyglotQueries = [
      'Explain async promises using Python asyncio as a direct analogy.',
      'How does React Virtual DOM differ from direct DOM manipulation in JS?',
      'Explain closures, event loop, and middleware syntax.',
      'Give me courses, tutorials, and practical exercises comparing python to react.',
      'Show me the brain diff code comparison between python and javascript.',
    ];

    for (const q of polyglotQueries) {
      const routed = classifyAgentIntent(q);
      expect(routed.key).toBe('polyglotCurator');
      expect(routed.id).toBe(3);
      expect(routed.name).toBe('PolyglotCurator-03');
    }
  });
});

describe('AdaptiveMentor-04 [Assessment & Live Coaching]', () => {
  it('routes assessment debugging and coaching questions to AdaptiveMentor-04', () => {
    const adaptiveQueries = [
      'I failed the assessment quiz, can you help me debug my mistake?',
      'Give me a socratic hint for this evaluation error and bug.',
      'How should I prepare for my upcoming mock technical interview?',
      'What remedial adjustments should I make for my assessment grade?',
      'Guide my coaching sprint and interview prep.',
    ];

    for (const q of adaptiveQueries) {
      const routed = classifyAgentIntent(q);
      expect(routed.key).toBe('adaptiveMentor');
      expect(routed.id).toBe(4);
      expect(routed.name).toBe('AdaptiveMentor-04');
    }
  });

  it('routes conversational greetings and status inquiries directly to AdaptiveMentor-04 without dumping tutorials', () => {
    const greetings = ['hi', 'hello', 'hey', 'what is my status', "how's my progress"];
    for (const g of greetings) {
      expect(isGreetingOrStatusQuery(g)).toBe(true);
      const routed = classifyAgentIntent(g);
      expect(routed.key).toBe('adaptiveMentor');
    }
  });

  it('generates a clean 2-sentence conversational greeting referencing live student state', () => {
    const ctxWithRemediation: StudentStateContext = {
      learnerName: 'Aarav Sharma',
      targetRole: 'Full Stack Developer',
      readiness: 42,
      currentSkills: ['Python', 'SQL'],
      hasRemediation: true,
      remedialTopic: 'JavaScript ES6+',
    };

    const greeting = generateLiveStateGreeting(AGENT_REGISTRY.adaptiveMentor, ctxWithRemediation);
    expect(greeting).toContain('Hello Aarav');
    expect(greeting).toContain('Full Stack Developer');
    expect(greeting).toContain('42%');
    expect(greeting).toContain('JavaScript ES6+');
    expect(greeting).not.toContain('```');

    // Exactly 2 sentences
    const sentences = greeting.split(/(?<=[.?!])\s+/).filter(Boolean);
    expect(sentences).toHaveLength(2);
  });
});

describe('Sanitization & Security Guarantees', () => {
  it('purges all Unicode emojis and pictographs from text', () => {
    // Unicode escapes to avoid raw emoji characters in source files
    const messy = 'Hello Aarav \u{1F44B}! Great progress \u{1F680} on the \u{1F3DB} Dean track! Keep it up \u{1F4AF}.';
    const clean = sanitizeAiResponse(messy);
    expect(clean).toBe('Hello Aarav ! Great progress  on the  Dean track! Keep it up .');
    expect(/\p{Extended_Pictographic}/u.test(clean)).toBe(false);
  });
});
