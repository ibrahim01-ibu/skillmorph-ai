// src/App.tsx — SkillMorph AI Autonomous Career Autopilot & Placement Mesh
import { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AuthGateway } from './components/AuthGateway';
import { StudentSidebar } from './components/StudentSidebar';
import { StudentProfileView } from './components/StudentProfileView';
import { RoadmapView } from './components/RoadmapView';
import { LearningStudioView } from './components/LearningStudioView';
import { AgentWarRoomView } from './components/AgentWarRoomView';
import { OrgView } from './components/OrgView';
import { CustomCareerModal } from './components/CustomCareerModal';
import { SkillPassportModal } from './components/SkillPassportModal';
import { GroqKeyModal } from './components/GroqKeyModal';
import { getStoredGroqKey, setStoredGroqKey, type CareerSynthesisResult } from './services/groq';
import type {
  UserProfile,
  StudentTab,
  CareerPath,
  Skill,
  DAGNode,
  DAGEdge,
  AgentLog,
  Agent,
  RadarData,
} from './types';
import { SCENARIOS, REMEDIAL_NODE, REMEDIAL_EDGE_FROM, REMEDIAL_EDGE_TO, NODE_CONTENT } from './data/scenarios';
import { AGENTS } from './data/agents';
import {
  Building2,
  GraduationCap,
  Key,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

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
  // Session / Authentication state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('skillmorph_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to student demo on first load for immediate instant evaluation, or null for auth
    return {
      id: 'user-student-aarav',
      type: 'student',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@iitb.ac.in',
      institution: 'IIT Bombay',
      roleTitle: 'Final Year CS',
      githubUsername: 'aarav-sharma-dev',
      bio: 'Backend & Data enthusiast transitioning into high-scale modern Full Stack & Distributed Systems.',
      certifications: ['AWS Certified Cloud Practitioner', 'Meta Front-End Specialization'],
      pastProjects: [
        'Built Flask & PostgreSQL Inventory Microservice with JWT Auth',
        'Python High-Throughput Scraper with Redis Caching',
      ],
    };
  });

  // Navigation tab for Student Portal
  const [activeStudentTab, setActiveStudentTab] = useState<StudentTab>('roadmap');

  // Career & Skill state
  const [currentPath, setCurrentPath] = useState<CareerPath>('fullstack');
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [, setRemedialInjected] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cohort_bridge_deployed') === 'true';
    }
    return false;
  });
  const [nodes, setNodes] = useState<DAGNode[]>(() => {
    const isBridge = typeof window !== 'undefined' && localStorage.getItem('cohort_bridge_deployed') === 'true';
    if (isBridge) {
      return [...SCENARIOS.fullstack.nodes, { ...REMEDIAL_NODE }];
    }
    return SCENARIOS.fullstack.nodes;
  });
  const [edges, setEdges] = useState<DAGEdge[]>(() => {
    const isBridge = typeof window !== 'undefined' && localStorage.getItem('cohort_bridge_deployed') === 'true';
    if (isBridge) {
      return [
        ...SCENARIOS.fullstack.edges,
        { from: REMEDIAL_EDGE_FROM, to: REMEDIAL_NODE.id },
        { from: REMEDIAL_NODE.id, to: REMEDIAL_EDGE_TO },
      ];
    }
    return SCENARIOS.fullstack.edges;
  });
  const [readiness, setReadiness] = useState<number>(SCENARIOS.fullstack.readiness);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [groqKey, setGroqKey] = useState<string>(() => getStoredGroqKey());
  const [customTargetRole, setCustomTargetRole] = useState<string | null>(null);
  const [customRadarData, setCustomRadarData] = useState<RadarData[] | null>(null);

  // Active studio node
  const [selectedStudioNode, setSelectedStudioNode] = useState<DAGNode>(
    SCENARIOS.fullstack.nodes.find((n) => n.id === 'js') || SCENARIOS.fullstack.nodes[0]
  );

  // Modals
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isCustomCareerOpen, setIsCustomCareerOpen] = useState(false);
  const [isGroqKeyOpen, setIsGroqKeyOpen] = useState(false);

  const handleRemedialInjection = useCallback(() => {
    setRemedialInjected((already) => {
      if (already) return already;
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
      return true;
    });
  }, []);

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

  function handleLogin(user: UserProfile, initialSkills?: Skill[], targetCareer?: string) {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('skillmorph_current_user', JSON.stringify(user));
    }
    if (initialSkills && initialSkills.length > 0) {
      setSkills(initialSkills);
    }
    if (targetCareer) {
      setCustomTargetRole(targetCareer);
    }
    addLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: `User authenticated: ${user.name} (${user.type.toUpperCase()}). Session initialized.`,
      type: 'info',
    });
  }

  function handleLogout() {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skillmorph_current_user');
    }
  }

  function handleGroqKeyChange(key: string) {
    setStoredGroqKey(key);
    setGroqKey(key);
    addLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: key
        ? 'Groq API Key activated (openai/gpt-oss-120b). Live neural mesh enabled.'
        : 'Groq API Key cleared. Defaulting to local deterministic simulation engine.',
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
    setSelectedStudioNode(s.nodes.find((n) => n.status === 'active') || s.nodes[0]);
    addLog({
      agent: 'GapArchitect-02',
      agentId: 2,
      message: `Career pivot detected → "${s.targetRole}". Rebuilding skill DAG. Recalculating transfer-learning pathways.`,
      type: 'mutation',
      payload: JSON.stringify({ newPath: path, targetRole: s.targetRole }),
    });
  }

  function handleApplyCustomCareer(result: CareerSynthesisResult) {
    setNodes(result.nodes);
    setEdges(result.edges);
    setCustomRadarData(result.radarData);
    setCustomTargetRole(result.roleTitle);
    setReadiness(result.readiness);
    setRemedialInjected(false);
    setSelectedStudioNode(result.nodes.find((n) => n.status === 'active') || result.nodes[0]);

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#EA580C', '#0F766E', '#2563EB'],
    });
  }

  function handleResetScenario() {
    setSkills(DEFAULT_SKILLS);
    loadScenario('fullstack');
    setLogs([]);
    addLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: 'Scenario reset: Python + SQL + HTML → Full Stack Developer. Baseline skill vector restored.',
      type: 'info',
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
    addLog({
      agent: 'AdaptiveMentor-04',
      agentId: 4,
      message: '🚑 Injected Amber Rescue Sprint: "Async Promises & Event Loop via Python Asyncio Analogy".',
      type: 'mutation',
    });
  }

  function handleNodeMastered(nodeId: string) {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) return { ...n, status: 'mastered' };
        // Unlock downstream nodes whose prerequisites are now mastered
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
  }

  const handleAgentLog = useCallback((partial: Omit<AgentLog, 'id' | 'timestamp'>) => {
    addLog(partial);
  }, []);

  const scenario = SCENARIOS[currentPath];
  const activeRoleTitle = customTargetRole || scenario.targetRole;
  const activeRadar = customRadarData || scenario.radarData;

  // 1. IF NO USER IS LOGGED IN -> RENDER AUTH GATEWAY
  if (!currentUser) {
    return <AuthGateway onLogin={handleLogin} />;
  }

  // 2. IF LOGGED IN AS INSTITUTION -> RENDER INSTITUTION PORTAL
  if (currentUser.type === 'institution') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex flex-col font-sans">
        {/* Institutional Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-[#E6E4DD] px-6 py-3 shadow-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center font-bold shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-[#18181B]">SkillMorph AI</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
                    University & Enterprise Cloud
                  </span>
                </div>
                <div className="text-xs text-zinc-500">
                  {currentUser.name} • {currentUser.institution}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCurrentUser({
                    id: 'user-student-aarav',
                    type: 'student',
                    name: 'Aarav Sharma',
                    email: 'aarav.sharma@iitb.ac.in',
                    institution: 'IIT Bombay',
                    roleTitle: 'Final Year CS',
                    githubUsername: 'aarav-sharma-dev',
                    certifications: ['AWS Certified Cloud Practitioner'],
                    pastProjects: ['Built Flask & PostgreSQL Inventory Microservice'],
                  });
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F3F1EC] border border-[#E6E4DD] text-xs font-bold text-zinc-800 flex items-center gap-2 transition-colors shadow-xs"
              >
                <GraduationCap className="w-4 h-4 text-[#EA580C]" />
                <span>Switch to Student View</span>
              </button>

              <button
                onClick={() => setIsGroqKeyOpen(true)}
                className="px-3 py-2 rounded-xl border border-[#E6E4DD] text-xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                title="Configure Groq API Key"
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Institution Workspace */}
        <main className="flex-1 p-6">
          <OrgView
            onDeployCohortBridge={() => {
              handleRemedialInjection();
              addLog({
                agent: 'Profiler-01',
                agentId: 1,
                message: '🏛️ Dean Intervention: Pushed Accelerated Cohort Bridge Module to Aarav Sharma.',
                type: 'mutation',
              });
            }}
            onSwitchToStudent={() => {
              setCurrentUser({
                id: 'user-student-aarav',
                type: 'student',
                name: 'Aarav Sharma',
                email: 'aarav.sharma@iitb.ac.in',
                institution: 'IIT Bombay',
                roleTitle: 'Final Year CS',
                githubUsername: 'aarav-sharma-dev',
                certifications: ['AWS Certified Cloud Practitioner'],
                pastProjects: ['Built Flask & PostgreSQL Inventory Microservice'],
              });
            }}
          />
        </main>

        <GroqKeyModal
          isOpen={isGroqKeyOpen}
          onClose={() => setIsGroqKeyOpen(false)}
          groqKey={groqKey}
          onSaveKey={handleGroqKeyChange}
        />
      </div>
    );
  }

  // 3. IF LOGGED IN AS STUDENT -> RENDER 4 DEDICATED FULL-WIDTH WORKSPACES WITH LEFT SIDEBAR
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] text-[#18181B] font-sans antialiased">
      {/* Clean Left Sidebar Navigation */}
      <StudentSidebar
        user={currentUser}
        activeTab={activeStudentTab}
        onTabChange={setActiveStudentTab}
        readiness={readiness}
        targetRoleTitle={activeRoleTitle}
        onSwitchToOrg={() => {
          setCurrentUser({
            id: 'user-dean-vikram',
            type: 'institution',
            name: 'Dr. Vikram Nair',
            email: 'vikram.nair@iitb.ac.in',
            institution: 'IIT Bombay — Career Services',
            roleTitle: 'Head of Placement Cell & Talent Analytics',
            certifications: ['NAAC Accreditation Board Lead'],
            pastProjects: ['Institutional AI Career Gap Deployment 2026'],
          });
        }}
        onOpenGroqKeyModal={() => setIsGroqKeyOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Full-Width Content Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Breadcrumb / Top Bar */}
        <header className="h-14 bg-white border-b border-[#E6E4DD] px-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-800">Student Studio</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
            <span className="capitalize font-bold text-[#EA580C]">
              {activeStudentTab === 'profile' && 'My Profile, Skills & Career Match'}
              {activeStudentTab === 'roadmap' && 'Adaptive Learning Roadmap (Skill-DAG)'}
              {activeStudentTab === 'studio' && 'Interactive Learning Studio & Assessment'}
              {activeStudentTab === 'agents' && 'Multi-Agent War Room & AI Mentor'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4-Agent Mesh Synchronized</span>
            </span>

            <button
              onClick={() => setIsGroqKeyOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-[#E6E4DD] hover:bg-[#FAF8F5] text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-[#EA580C]" />
              <span className="hidden sm:inline">Groq LPU:</span>
              <span className="font-mono text-zinc-500">{groqKey ? 'Active' : 'Demo Mesh'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Full-Width Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeStudentTab === 'profile' && (
            <StudentProfileView
              user={currentUser}
              skills={skills}
              onSkillsChange={setSkills}
              radarData={activeRadar}
              currentPath={currentPath}
              targetRoleTitle={activeRoleTitle}
              onCareerChange={loadScenario}
              readiness={readiness}
              onOpenPassport={() => setIsPassportOpen(true)}
              onOpenCustomCareerModal={() => setIsCustomCareerOpen(true)}
              onNavigateToRoadmap={() => setActiveStudentTab('roadmap')}
            />
          )}

          {activeStudentTab === 'roadmap' && (
            <RoadmapView
              nodes={nodes}
              edges={edges}
              agents={agents}
              targetRoleTitle={activeRoleTitle}
              readiness={readiness}
              onLaunchStudio={(node) => {
                setSelectedStudioNode(node);
                setActiveStudentTab('studio');
              }}
              onSimulateFailure={handleSimulateFailure}
              onResetScenario={handleResetScenario}
              onAgentLog={handleAgentLog}
            />
          )}

          {activeStudentTab === 'studio' && (
            <LearningStudioView
              node={selectedStudioNode}
              content={NODE_CONTENT[selectedStudioNode.id] || NODE_CONTENT['js']}
              groqKey={groqKey}
              onNodeMastered={handleNodeMastered}
              onRemedialInjected={handleRemedialInjection}
              onBackToRoadmap={() => setActiveStudentTab('roadmap')}
              onAgentLog={handleAgentLog}
            />
          )}

          {activeStudentTab === 'agents' && (
            <AgentWarRoomView
              user={currentUser}
              skills={skills}
              targetRoleTitle={activeRoleTitle}
              readiness={readiness}
              agents={agents}
              logs={logs}
              groqKey={groqKey}
              onAgentLog={handleAgentLog}
            />
          )}
        </main>
      </div>

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
        learnerName={currentUser.name}
        targetRole={activeRoleTitle}
        readiness={readiness}
        skills={skills}
      />

      {/* Groq Key Modal */}
      <GroqKeyModal
        isOpen={isGroqKeyOpen}
        onClose={() => setIsGroqKeyOpen(false)}
        groqKey={groqKey}
        onSaveKey={handleGroqKeyChange}
      />
    </div>
  );
}
