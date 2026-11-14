// ============================================================
// src/types.ts — All shared TypeScript types for SkillMorph AI
// ============================================================

export type SkillLevel = 'Foundation' | 'Intermediate' | 'Advanced' | 'Expert';
export type NodeStatus = 'mastered' | 'active' | 'locked' | 'remedial';
export type AgentStatus = 'idle' | 'thinking' | 'mutating';
export type ViewMode = 'learner' | 'org';
export type StudentTab = 'profile' | 'roadmap' | 'studio' | 'agents';
export type CareerPath = 'fullstack' | 'aiml' | 'cloud';
export type SprintTab = 'braindiff' | 'resources' | 'assessment';

export interface UserProfile {
  id: string;
  type: 'student' | 'institution';
  name: string;
  email: string;
  institution: string;
  roleTitle?: string; // e.g. "Final Year CS" or "Head of Career Cell"
  bio?: string;
  githubUsername?: string;
  certifications: string[];
  pastProjects: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: string;
}

export interface DAGNode {
  id: string;
  label: string;
  sublabel?: string;
  status: NodeStatus;
  x: number;
  y: number;
  skillId?: string;
  isRemedial?: boolean;
}

export interface DAGEdge {
  from: string;
  to: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agent: string;
  agentId: 1 | 2 | 3 | 4;
  message: string;
  type: 'info' | 'success' | 'warning' | 'mutation' | 'handoff';
  payload?: string;
}

export interface Agent {
  id: 1 | 2 | 3 | 4;
  name: string;
  role: string;
  status: AgentStatus;
  icon: string;
  color: string;
}

export interface BrainDiff {
  existingLang: string;
  newLang: string;
  concept: string;
  existingCode: string;
  newCode: string;
  explanation: string;
}

export interface Resource {
  title: string;
  source: string;
  duration: string;
  url: string;
  type: 'video' | 'article' | 'interactive';
}

export interface MicroSpec {
  title: string;
  description: string;
  artifact: string;
  timeEstimate: string;
}

export interface AssessmentQuestion {
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  hint: string;
  wrongHint: string;
}

export interface NodeContent {
  nodeId: string;
  brainDiff: BrainDiff;
  resources: Resource[];
  microSpec: MicroSpec;
  assessment: AssessmentQuestion;
}

export interface RadarData {
  axis: string;
  current: number;
  target: number;
}

export interface CohortStudent {
  id: string;
  name: string;
  dept: string;
  verifiedSkills: string[];
  missingSkills: string[];
  assessmentVelocity: number;
  readiness: number;
  aiIntervention: string;
}

export type AgentId = 1 | 2 | 3 | 4;
export type AgentKey = 'profiler' | 'gapArchitect' | 'polyglotCurator' | 'adaptiveMentor';
export type AgentTabType = 'auto' | AgentKey;

export interface AgentDomainInfo {
  key: AgentKey;
  id: AgentId;
  name: 'Profiler-01' | 'GapArchitect-02' | 'PolyglotCurator-03' | 'AdaptiveMentor-04';
  tabLabel: string;
  domain: string;
}

export interface StudentStateContext {
  learnerName: string;
  targetRole: string;
  readiness: number;
  currentSkills: string[];
  certifications?: string[];
  pastProjects?: string[];
  missingSkills?: string[];
  hasRemediation?: boolean;
  remedialTopic?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentId?: AgentId;
  agentName?: string;
}

export interface ScenarioConfig {
  id: CareerPath;
  label: string;
  description: string;
  nodes: DAGNode[];
  edges: DAGEdge[];
  radarData: RadarData[];
  targetRole: string;
  readiness: number;
}
