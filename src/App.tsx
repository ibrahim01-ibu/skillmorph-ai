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
  Terminal,
  User,
  Compass,
  Code2,
  Bot,
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
      message: `Career pivot detected: "${s.targetRole}". Rebuilding skill DAG. Recalculating transfer pathways.`,
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
      colors: ['#18181B', '#0F766E', '#2563EB'],
    });
  }

  function handleResetScenario() {
    setSkills(DEFAULT_SKILLS);
    loadScenario('fullstack');
    setLogs([]);
    addLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: 'Scenario reset: Python + SQL + HTML -> Full Stack Developer. Baseline skill vector restored.',
      type: 'info',
    });
  }

  function handleSimulateFailure() {
    addLog({
      agent: 'AdaptiveMentor-04',
      agentId: 4,
      message: 'Assessment FAILED on "JavaScript ES6+" — incorrect answer detected. Invoking remediation protocol.',
      type: 'warning',
      payload: JSON.stringify({ nodeId: 'js', result: 'fail', trigger: 'simulate_failure' }),
    });
    handleRemedialInjection();
    addLog({
      agent: 'AdaptiveMentor-04',
      agentId: 4,
      message: 'Injected Remedial Module: Async Execution via Python Asyncio Analogy.',
      type: 'mutation',
    });
  }

  function handleNodeMastered(nodeId: string) {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) return { ...n, status: 'mastered' };
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

  const userInitials = currentUser
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AS';

  // 1. IF NO USER IS LOGGED IN -> RENDER AUTH GATEWAY
  if (!currentUser) {
    return <AuthGateway onLogin={handleLogin} />;
  }

  // 2. IF LOGGED IN AS INSTITUTION -> RENDER INSTITUTION PORTAL
  if (currentUser.type === 'institution') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col font-sans">
        {/* Institutional Top Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-zinc-200/90 px-4 sm:px-6 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold">
                <Building2 size={15} strokeWidth={1.75} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-zinc-900">SkillMorph AI</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700">
                    Enterprise Talent Cloud
                  </span>
                </div>
                <div className="text-xs text-zinc-500">
                  {currentUser.name} • {currentUser.institution}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
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
                className="px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-medium text-zinc-800 flex items-center gap-1.5 transition-colors"
              >
                <GraduationCap size={14} strokeWidth={1.75} />
                <span>Student View</span>
              </button>

              <button
                onClick={() => setIsGroqKeyOpen(true)}
                className="p-1.5 rounded-md border border-zinc-200 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
                title="Configure Groq API Key"
              >
                <Key size={14} strokeWidth={1.75} />
              </button>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white flex items-center gap-1.5 transition-colors"
              >
                <LogOut size={14} strokeWidth={1.75} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Institution Workspace */}
        <main className="flex-1 p-4 sm:p-6 pb-12">
          <OrgView
            onDeployCohortBridge={() => {
              handleRemedialInjection();
              addLog({
                agent: 'Profiler-01',
                agentId: 1,
                message: 'Dean Intervention: Pushed Accelerated Cohort Bridge Module to Aarav Sharma.',
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

  // 3. IF LOGGED IN AS STUDENT -> RENDER 4 DEDICATED FULL-WIDTH WORKSPACES WITH DESKTOP SIDEBAR + MOBILE DUAL NAV
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFAFA] text-zinc-900 font-sans antialiased">
      {/* Clean Left Sidebar Navigation (Desktop) */}
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
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Top Header (< md) */}
        <header className="flex md:hidden h-12 bg-white border-b border-zinc-200 px-4 items-center justify-between flex-shrink-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 text-white flex items-center justify-center">
              <Terminal size={13} strokeWidth={1.75} />
            </div>
            <span className="font-semibold text-xs tracking-tight text-zinc-900">SkillMorph AI</span>
            <span className="text-[10px] text-zinc-400 font-mono">[{activeRoleTitle.split(' ')[0]}]</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGroqKeyOpen(true)}
              className="p-1 rounded border border-zinc-200 text-zinc-600"
              title="Groq Settings"
            >
              <Key size={13} strokeWidth={1.75} />
            </button>
            <div className="w-7 h-7 rounded bg-zinc-100 border border-zinc-300 text-zinc-800 font-mono text-[11px] font-semibold flex items-center justify-center">
              {userInitials}
            </div>
          </div>
        </header>

        {/* Desktop Breadcrumb Header (md+) */}
        <header className="hidden md:flex h-12 bg-white border-b border-zinc-200 px-6 items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="font-medium text-zinc-800">Student Studio</span>
            <ChevronRight size={13} strokeWidth={1.75} className="text-zinc-400" />
            <span className="capitalize font-semibold text-zinc-900">
              {activeStudentTab === 'profile' && 'My Profile, Skills & Career Match'}
              {activeStudentTab === 'roadmap' && 'Adaptive Learning Roadmap (Skill-DAG)'}
              {activeStudentTab === 'studio' && 'Interactive Learning Studio & Assessment'}
              {activeStudentTab === 'agents' && 'Multi-Agent War Room & AI Mentor'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-[11px] font-medium text-zinc-700">
              <ShieldCheck size={13} strokeWidth={1.75} className="text-zinc-600" />
              <span>4-Agent Mesh Active</span>
            </span>

            <button
              onClick={() => setIsGroqKeyOpen(true)}
              className="px-2.5 py-1 rounded-md border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              <Key size={13} strokeWidth={1.75} className="text-zinc-500" />
              <span>Groq LPU:</span>
              <span className="font-mono text-zinc-500">{groqKey ? 'Active' : 'Demo Mesh'}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Viewport (pb-20 on mobile so bottom bar never obscures content) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-8">
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

        {/* Apple iOS-Style Bottom Navigation Bar (md:hidden) */}
        <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-zinc-200 flex justify-around py-2 z-40 md:hidden">
          {[
            { id: 'profile' as StudentTab, label: 'Profile', icon: <User size={18} strokeWidth={1.75} /> },
            { id: 'roadmap' as StudentTab, label: 'Roadmap', icon: <Compass size={18} strokeWidth={1.75} /> },
            { id: 'studio' as StudentTab, label: 'Studio', icon: <Code2 size={18} strokeWidth={1.75} /> },
            { id: 'agents' as StudentTab, label: 'Agents', icon: <Bot size={18} strokeWidth={1.75} /> },
          ].map((tab) => {
            const isActive = activeStudentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStudentTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[11px] transition-colors ${
                  isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-400'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
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
