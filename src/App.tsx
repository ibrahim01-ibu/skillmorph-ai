// src/App.tsx — SkillMorph AI Main Application with Groq API & Custom Career Engine
import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { TopNav } from './components/TopNav';
import { LeftPanel } from './components/LeftPanel';
import { CenterPanel } from './components/CenterPanel';
import { RightPanel } from './components/RightPanel';
import { OrgView } from './components/OrgView';
import { CustomCareerModal } from './components/CustomCareerModal';
import { SkillPassportModal } from './components/SkillPassportModal';
import { getStoredGroqKey, setStoredGroqKey, type CareerSynthesisResult } from './services/groq';
import type {
  ViewMode,
  CareerPath,
  Skill,
  DAGNode,
  DAGEdge,
  AgentLog,
  Agent,
  RadarData,
} from './types';
import { SCENARIOS, REMEDIAL_NODE, REMEDIAL_EDGE_FROM, REMEDIAL_EDGE_TO } from './data/scenarios';
import { AGENTS } from './data/agents';

const DEFAULT_SKILLS: Skill[] = [
  { id: 'skill-python', name: 'Python', level: 'Advanced', category: 'Backend' },
  { id: 'skill-sql', name: 'SQL', level: 'Intermediate', category: 'Data' },
  { id: 'skill-html', name: 'Basic HTML', level: 'Foundation', category: 'Frontend' },
];

function makeLog(partial: Omit<AgentLog, 'id' | 'timestamp'>): AgentLog {
  return {
    ...partial,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('learner');
  const [currentPath, setCurrentPath] = useState<CareerPath>('fullstack');
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [nodes, setNodes] = useState<DAGNode[]>(SCENARIOS.fullstack.nodes);
  const [edges, setEdges] = useState<DAGEdge[]>(SCENARIOS.fullstack.edges);
  const [readiness, setReadiness] = useState<number>(SCENARIOS.fullstack.readiness);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [groqKey, setGroqKey] = useState<string>(() => getStoredGroqKey());
  const [remedialInjected, setRemedialInjected] = useState(false);
  const [customTargetRole, setCustomTargetRole] = useState<string | null>(null);
  const [customRadarData, setCustomRadarData] = useState<RadarData[] | null>(null);

  // Modals
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isCustomCareerOpen, setIsCustomCareerOpen] = useState(false);

  const agentTimersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  function setAgentStatus(agentId: 1 | 2 | 3 | 4, status: Agent['status']) {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status } : a)));
    const existing = agentTimersRef.current.get(agentId);
    if (existing) clearTimeout(existing);
    if (status !== 'idle') {
      const t = setTimeout(() => {
        setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, status: 'idle' } : a)));
      }, 2500);
      agentTimersRef.current.set(agentId, t);
    }
  }

  function addLog(partial: Omit<AgentLog, 'id' | 'timestamp'>) {
    setLogs((prev) => [...prev.slice(-80), makeLog(partial)]);
    if (partial.agentId) {
      const statusMap: Record<string, Agent['status']> = {
        mutation: 'mutating',
        handoff: 'thinking',
        info: 'thinking',
        success: 'idle',
        warning: 'thinking',
      };
      setAgentStatus(partial.agentId, statusMap[partial.type] ?? 'thinking');
    }
  }

  function handleGroqKeyChange(key: string) {
    setStoredGroqKey(key);
    setGroqKey(key);
    addLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: key ? 'Groq API Key activated (openai/gpt-oss-120b). Live neural mesh enabled.' : 'Groq API Key cleared. Defaulting to local deterministic simulation engine.',
      type: 'info',
    });
  }

  // ── Scenario Management ──────────────────────────────────────
  function loadScenario(path: CareerPath) {
    const s = SCENARIOS[path];
    setNodes(s.nodes);
    setEdges(s.edges);
    setReadiness(s.readiness);
    setCustomTargetRole(null);
    setCustomRadarData(null);
    setRemedialInjected(false);
    setCurrentPath(path);
    addLog({
      agent: 'GapArchitect-02',
      agentId: 2,
      message: `Career pivot detected → "${s.targetRole}". Rebuilding skill DAG. Recalculating transfer-learning pathways from existing skill vector.`,
      type: 'mutation',
      payload: JSON.stringify({ newPath: path, targetRole: s.targetRole }),
    });
    addLog({
      agent: 'PolyglotCurator-03',
      agentId: 3,
      message: `Loading brain-diff content pack for "${s.targetRole}" path. ${s.nodes.length} nodes mapped.`,
      type: 'info',
    });
  }

  function handleApplyCustomCareer(result: CareerSynthesisResult) {
    setNodes(result.nodes);
    setEdges(result.edges);
    setCustomRadarData(result.radarData);
    setCustomTargetRole(result.roleTitle);
    setReadiness(result.readiness);
    setRemedialInjected(false);

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#a855f7', '#06b6d4', '#10b981'],
    });
  }

  function handleResetScenario() {
    setSkills(DEFAULT_SKILLS);
    loadScenario('fullstack');
    setLogs([]);
    addLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: 'Scenario reset to: Python + SQL + HTML → Full Stack Developer. Skill vector restored to baseline.',
      type: 'info',
    });
    addLog({
      agent: 'GapArchitect-02',
      agentId: 2,
      message: 'Rebuilding career gap analysis DAG from baseline skill vector. 4 missing core nodes identified.',
      type: 'mutation',
    });
  }

  function handleSimulateFailure() {
    addLog({
      agent: 'AdaptiveMentor-04',
      agentId: 4,
      message: 'Assessment FAILED on "JavaScript ES6+" — wrong answer detected. Invoking remediation protocol.',
      type: 'warning',
      payload: JSON.stringify({ nodeId: 'js', result: 'fail', trigger: 'simulate_failure' }),
    });
    handleRemedialInjection();
  }

  function handleRemedialInjection() {
    if (remedialInjected) return;
    setNodes((prev) => {
      if (prev.find((n) => n.id === REMEDIAL_NODE.id)) return prev;
      return [...prev, { ...REMEDIAL_NODE }];
    });
    setEdges((prev) => {
      const alreadyHas = prev.find((e) => e.from === REMEDIAL_EDGE_FROM && e.to === REMEDIAL_NODE.id);
      if (alreadyHas) return prev;
      return [
        ...prev,
        { from: REMEDIAL_EDGE_FROM, to: REMEDIAL_NODE.id },
        { from: REMEDIAL_NODE.id, to: REMEDIAL_EDGE_TO },
      ];
    });
    setRemedialInjected(true);
    addLog({
      agent: 'AdaptiveMentor-04',
      agentId: 4,
      message: '🚑 Injecting Amber Rescue Sprint node: "Async Promises & Event Loop via Python Asyncio Analogy". Routing learner through targeted remediation.',
      type: 'mutation',
      payload: JSON.stringify({ injectedNode: 'remedial-async', strategy: 'python_asyncio_analogy' }),
    });
    addLog({
      agent: 'PolyglotCurator-03',
      agentId: 3,
      message: 'Synthesizing rescue content: Python asyncio → JS Promise mapping. Cross-language transfer-learning module loaded.',
      type: 'handoff',
    });
  }

  function handleNodeMastered(nodeId: string) {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) return { ...n, status: 'mastered' };
        // Unlock nodes whose prerequisites are now mastered
        const prereqs = edges.filter((e) => e.to === n.id).map((e) => e.from);
        const updatedNodes = prev.map((x) => (x.id === nodeId ? { ...x, status: 'mastered' as const } : x));
        const allPrereqsMastered = prereqs.every((pid) => {
          const pn = updatedNodes.find((x) => x.id === pid);
          return pn?.status === 'mastered';
        });
        if (n.status === 'locked' && prereqs.length > 0 && allPrereqsMastered) {
          return { ...n, status: 'active' };
        }
        return n;
      })
    );

    setReadiness((prev) => Math.min(100, prev + 8));
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#a78bfa'],
    });
  }

  const handleAgentLog = useCallback((partial: Omit<AgentLog, 'id' | 'timestamp'>) => {
    addLog(partial);
  }, []);

  const scenario = SCENARIOS[currentPath];
  const activeRoleTitle = customTargetRole || scenario.targetRole;
  const activeRadar = customRadarData || scenario.radarData;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Top Navigation */}
      <TopNav
        viewMode={viewMode}
        onViewChange={setViewMode}
        onResetScenario={handleResetScenario}
        onSimulateFailure={handleSimulateFailure}
        onPivotCareer={loadScenario}
        currentPath={currentPath}
        groqKey={groqKey}
        onGroqKeyChange={handleGroqKeyChange}
        onOpenCustomCareerModal={() => setIsCustomCareerOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {viewMode === 'org' ? (
          <div className="h-full overflow-y-auto p-4">
            <OrgView />
          </div>
        ) : (
          <div
            className="h-full grid grid-cols-[280px_1fr_300px] gap-3 p-3 overflow-hidden"
            style={{ height: 'calc(100vh - 48px)' }}
          >
            {/* Left Panel */}
            <aside className="overflow-y-auto scrollbar-thin">
              <LeftPanel
                skills={skills}
                onSkillsChange={setSkills}
                radarData={activeRadar}
                currentPath={currentPath}
                onCareerChange={loadScenario}
                readiness={readiness}
                onAgentLog={handleAgentLog}
                onOpenPassport={() => setIsPassportOpen(true)}
                onOpenCustomCareerModal={() => setIsCustomCareerOpen(true)}
              />
            </aside>

            {/* Center Panel */}
            <section className="overflow-hidden flex flex-col">
              <CenterPanel
                nodes={nodes}
                edges={edges}
                onNodeMastered={handleNodeMastered}
                onAgentLog={handleAgentLog}
                onRemedialInjected={handleRemedialInjection}
              />
            </section>

            {/* Right Panel */}
            <aside className="overflow-hidden flex flex-col">
              <RightPanel
                agents={agents}
                logs={logs}
                groqKey={groqKey}
                targetRole={activeRoleTitle}
                currentSkills={skills.map((s) => s.name)}
                readiness={readiness}
              />
            </aside>
          </div>
        )}
      </main>

      {/* Custom Career Modal */}
      <CustomCareerModal
        isOpen={isCustomCareerOpen}
        onClose={() => setIsCustomCareerOpen(false)}
        currentSkills={skills.map((s) => s.name)}
        groqKey={groqKey}
        onApplyCareer={handleApplyCustomCareer}
        onAgentLog={handleAgentLog}
      />

      {/* Verified Skill Passport Modal */}
      <SkillPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        learnerName="Aarav Sharma"
        targetRole={activeRoleTitle}
        readiness={readiness}
        skills={skills}
      />
    </div>
  );
}
