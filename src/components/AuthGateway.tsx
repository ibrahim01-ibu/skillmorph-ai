// src/components/AuthGateway.tsx — Interactive Executive Pitch & Dual-Portal Launchpad (Daylight Minimalist)
import { useState } from 'react';
import {
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  GitBranch,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Lock,
  Plus,
  Trash2,
} from 'lucide-react';
import type { UserProfile, Skill, SkillLevel } from '../types';

interface AuthGatewayProps {
  onLogin: (user: UserProfile, initialSkills?: Skill[], targetCareer?: string) => void;
  onLaunchStudent: () => void;
  onLaunchInstitution: () => void;
}

export function AuthGateway({
  onLogin,
  onLaunchStudent,
  onLaunchInstitution,
}: AuthGatewayProps) {
  const [showAdvancedAuth, setShowAdvancedAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'institution'>('student');

  // Custom Student Form State
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [studentEmail, setStudentEmail] = useState('aarav.sharma@iitb.ac.in');
  const [studentUniversity, setStudentUniversity] = useState('Indian Institute of Technology Bombay');
  const [studentRoleTitle] = useState('Final Year B.Tech Computer Science');
  const [studentTargetRole, setStudentTargetRole] = useState('Full Stack Developer');
  const [studentProjects] = useState<string[]>([
    'Student Database CRUD CLI (Python + SQLite)',
    'Static Portfolio Page (HTML)',
  ]);
  const [studentCerts] = useState<string[]>([
    'Python for Data & Backend (NPTEL / Coursera)',
    'Relational SQL Foundations',
  ]);
  const [studentSkills, setStudentSkills] = useState<Skill[]>([
    { id: 'sk-1', name: 'Python', level: 'Advanced', category: 'Backend' },
    { id: 'sk-2', name: 'SQL & Relational DBs', level: 'Intermediate', category: 'Data' },
    { id: 'sk-3', name: 'HTML5 & CSS3', level: 'Foundation', category: 'Frontend' },
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');

  // Custom Institution Form State
  const [instName, setInstName] = useState('Dr. Vikram Nair');
  const [instEmail, setInstEmail] = useState('vikram.nair@iitb.ac.in');
  const [instOrg, setInstOrg] = useState('IIT Bombay — Office of Career Services & Talent Analytics');
  const [instRoleTitle, setInstRoleTitle] = useState('Dean of Placements & Industry Partnerships');

  function handleStudentSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin(
      {
        id: `user-student-${Date.now()}`,
        type: 'student',
        name: studentName,
        email: studentEmail,
        institution: studentUniversity,
        roleTitle: studentRoleTitle,
        githubUsername: studentName.toLowerCase().replace(/\s+/g, '-'),
        bio: `Aspiring ${studentTargetRole} at ${studentUniversity}.`,
        certifications: studentCerts,
        pastProjects: studentProjects,
      },
      studentSkills,
      studentTargetRole
    );
  }

  function handleInstitutionSubmit(e: React.FormEvent) {
    e.preventDefault();
    onLogin({
      id: `user-inst-${Date.now()}`,
      type: 'institution',
      name: instName,
      email: instEmail,
      institution: instOrg,
      roleTitle: instRoleTitle,
      bio: `Institutional administrator at ${instOrg}.`,
      certifications: ['University Placement Leadership Council'],
      pastProjects: ['2026 Engineering Cohort Placement Readiness'],
    });
  }

  function addSkill() {
    if (!newSkillName.trim()) return;
    setStudentSkills((prev) => [
      ...prev,
      {
        id: `sk-${Date.now()}`,
        name: newSkillName.trim(),
        level: newSkillLevel,
        category: 'Custom',
      },
    ]);
    setNewSkillName('');
  }

  function removeSkill(id: string) {
    setStudentSkills((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans antialiased flex flex-col justify-between selection:bg-zinc-200">
      {/* SECTION 1: MINIMALIST TOP NAV BAR */}
      <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Terminal size={15} strokeWidth={1.75} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-zinc-900">SkillMorph AI</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded border border-zinc-200 bg-white text-zinc-600 shadow-xs">
                PromptWars X RTC — Production Release
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onLaunchStudent}
              className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <GraduationCap size={15} strokeWidth={1.75} />
              <span>Launch Student App</span>
            </button>
            <button
              onClick={onLaunchInstitution}
              className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Building2 size={15} strokeWidth={1.75} />
              <span>Launch Institution App</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
        {/* SECTION 2: HERO SECTION + DUAL USER INTERACTIVE LAUNCHPAD (ABOVE THE FOLD) */}
        <section className="text-center pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-medium mb-6 shadow-xs">
            <ShieldCheck size={15} strokeWidth={1.75} className="text-zinc-900" />
            <span>Autonomous 4-Agent Groq LPU Mesh • Zero Tutorial Hell</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 max-w-4xl mx-auto leading-tight">
            The Autonomous Career Autopilot & Dynamic Skill-DAG Engine.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed mt-4">
            Traditional LMS platforms dump static 40-hour courses on every learner. SkillMorph AI uses a 4-Agent Groq LPU
            mesh to audit existing skills, bridge syntax gaps in 90 seconds, and dynamically reroute learning paths when
            assessments fail or career goals pivot.
          </p>

          {/* TWO PROMINENT, CLICKABLE ROLE CARDS SIDE-BY-SIDE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10 text-left">
            {/* Card 1: End-User Experience — Student Career Studio */}
            <div className="group bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl p-6 sm:p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
                    <GraduationCap size={14} strokeWidth={1.75} />
                    <span>Sample Scenario: Aarav Sharma (IIT Bombay)</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">End-User Experience</span>
                </div>

                <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <span>Student Career Studio</span>
                </h2>

                <p className="text-xs text-zinc-500 mt-1 mb-5">
                  Adaptive topological learning graph, polyglot syntax bridges, and live assessment boss fights.
                </p>

                {/* Live Preview Stack */}
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/90 text-xs space-y-3 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Current Verified Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                        Python (Advanced)
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                        SQL & DBs
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                        Basic HTML
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-200">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Target Goal & Missing Skill Delta
                    </span>
                    <div className="text-xs text-zinc-800 font-medium flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-zinc-900">Target: Full Stack Developer</span>
                      <span className="text-zinc-400">→</span>
                      <span className="text-amber-800 font-normal">Missing: JavaScript, React, Node.js</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-zinc-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Live topological Skill-DAG roadmap with dynamic edge calculation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>30-second Polyglot Brain-Diff syntax translation (Python to JS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Boss fight assessment with 1-line code patch unit tests</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onLaunchStudent}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-xs group-hover:shadow"
              >
                <span>Enter Student Profile & Learning Studio</span>
                <ArrowRight size={15} strokeWidth={1.75} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Card 2: Primary Buyer Experience — University & Enterprise Cloud */}
            <div className="group bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl p-6 sm:p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium">
                    <Building2 size={14} strokeWidth={1.75} />
                    <span>Institutional Admin: Dr. Vikram Nair (Placement Dean)</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-500">Primary Buyer</span>
                </div>

                <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <span>University & Enterprise Cloud</span>
                </h2>

                <p className="text-xs text-zinc-500 mt-1 mb-5">
                  Cohort skill-gap intelligence, bottleneck diagnosis, and 1-click remedial curriculum intervention.
                </p>

                {/* Live Preview Capabilities */}
                <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200/90 text-xs space-y-3 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      Institutional Scope & Live Metrics
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded bg-white border border-zinc-200">
                        <div className="text-xs text-zinc-500">Cohort Tracked</div>
                        <div className="font-semibold text-zinc-900 mt-0.5">342 Engineering Students</div>
                      </div>
                      <div className="p-2.5 rounded bg-white border border-zinc-200">
                        <div className="text-xs text-zinc-500">Curriculum Bottleneck</div>
                        <div className="font-semibold text-amber-800 mt-0.5">68% Async JS Drop-off</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-200">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                      1-Click Placement Dean Intervention
                    </span>
                    <div className="text-xs text-zinc-700">
                      Pushes accelerated remedial async sprint directly to struggling student nodes in real time.
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-zinc-600 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Cohort Skill-Gap Matrix across departmental batches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Bottleneck Radar with automated drop-off cluster identification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>1-Click Remedial Module Deployment directly to student DAGs</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onLaunchInstitution}
                className="w-full bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-semibold py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-xs group-hover:shadow"
              >
                <span>Enter University & Org Command Center</span>
                <ArrowRight size={15} strokeWidth={1.75} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW WE ARE DIFFERENT (THE 3-PILLAR TECHNICAL MOAT GRID) */}
        <section className="pt-8 border-t border-zinc-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Architectural Moat
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Why SkillMorph AI Wins
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              Replacing passive video watching with active neural graph translation and automated multi-agent rerouting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mb-4 font-mono text-xs font-bold">
                  01
                </div>
                <h4 className="text-base font-semibold text-zinc-900 tracking-tight mb-2">
                  Polyglot Brain-Diff Engine
                </h4>
                <div className="inline-block text-xs font-medium px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 mb-3">
                  vs. 40-Hour Tutorial Hell
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Maps existing neural pathways (<code className="text-zinc-800 font-mono">Python asyncio</code>, <code className="text-zinc-800 font-mono">SQL</code>) directly to target gaps (<code className="text-zinc-800 font-mono">JS Promises</code>, <code className="text-zinc-800 font-mono">React</code>, <code className="text-zinc-800 font-mono">Node.js</code>) in 30-second side-by-side code diffs—cutting learning time by 4x.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                <Cpu size={14} className="text-zinc-700" />
                <span>Zero redundant concept re-teaching</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mb-4 font-mono text-xs font-bold">
                  02
                </div>
                <h4 className="text-base font-semibold text-zinc-900 tracking-tight mb-2">
                  Self-Healing Topological Skill-DAG
                </h4>
                <div className="inline-block text-xs font-medium px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 mb-3">
                  vs. Static Syllabi
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Powered by 4 specialized agents (<code className="text-zinc-800 font-mono">Profiler-01</code>, <code className="text-zinc-800 font-mono">GapArchitect-02</code>, <code className="text-zinc-800 font-mono">PolyglotCurator-03</code>, <code className="text-zinc-800 font-mono">AdaptiveMentor-04</code>). Failing an assessment automatically splices a remedial foundation node into the graph.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                <GitBranch size={14} className="text-zinc-700" />
                <span>Dynamic topological edge healing</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center mb-4 font-mono text-xs font-bold">
                  03
                </div>
                <h4 className="text-base font-semibold text-zinc-900 tracking-tight mb-2">
                  Proof-of-Skill Execution
                </h4>
                <div className="inline-block text-xs font-medium px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200 mb-3">
                  vs. Unverified Video Certificates
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Combines live GitHub repository telemetry with 1-line interactive code patch unit tests to issue cryptographic Verified Skill Passports that engineering recruiters can trust.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-zinc-100 flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                <Award size={14} className="text-zinc-700" />
                <span>Cryptographic proof-of-work dossier</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PRACTICAL B2B2C BUSINESS MODEL & UNIT ECONOMICS STRIP */}
        <section className="pt-8 border-t border-zinc-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-1">
              Commercial Viability
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Unit Economics & Monetization Strategy
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 mt-2">
              Dual-revenue B2B2C monetization model paired with low-cost edge inference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recurring Enterprise</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-mono font-medium border border-emerald-200">
                  High LTV
                </span>
              </div>
              <h4 className="text-base font-bold text-zinc-900 mb-1">
                B2B Campus & Enterprise Licensing
              </h4>
              <div className="text-sm font-bold text-blue-600 mb-2">$18 / learner / year</div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Replaces low-completion bulk MOOC licenses for universities and corporate L&D teams with measurable placement readiness KPIs and automated student intervention tooling.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Hiring Marketplace</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-xs font-mono font-medium border border-blue-200">
                  Success Fee
                </span>
              </div>
              <h4 className="text-base font-bold text-zinc-900 mb-1">
                Verified Talent Placement Fee
              </h4>
              <div className="text-sm font-bold text-blue-600 mb-2">B2B Verified Hiring API</div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Employers pay per-candidate pipeline access to filter candidates by cryptographically verified DAG nodes and unit-tested bug fixes rather than unverified resumes.
              </p>
            </div>

            <div className="bg-white border border-zinc-200/90 rounded-xl p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Gross Margin</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-xs font-mono font-medium border border-purple-200">
                  92% Margin
                </span>
              </div>
              <h4 className="text-base font-bold text-zinc-900 mb-1">
                Zero-Infrastructure Edge Architecture
              </h4>
              <div className="text-sm font-bold text-emerald-600 mb-2">&lt; $0.0004 / query</div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Hybrid client-side DAG state + sub-second Groq LPU inference delivers extreme cost efficiency, near-instant user interaction, and 92% gross software margins.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: ADVANCED CUSTOM REGISTRATION & MANUAL CREDENTIALS (COLLAPSIBLE) */}
        <section className="pt-8 border-t border-zinc-200">
          <div className="bg-white border border-zinc-200/90 rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.02)] overflow-hidden">
            <button
              onClick={() => setShowAdvancedAuth(!showAdvancedAuth)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-50/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Layers size={16} strokeWidth={1.75} className="text-zinc-600" />
                <div>
                  <div className="text-xs font-semibold text-zinc-900">
                    Custom Credentials & Manual Onboarding Form (Optional)
                  </div>
                  <div className="text-xs text-zinc-500">
                    Register a new student profile or institutional admin account from scratch
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span>{showAdvancedAuth ? 'Hide form' : 'Show form'}</span>
                {showAdvancedAuth ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </button>

            {showAdvancedAuth && (
              <div className="p-6 sm:p-8 border-t border-zinc-200/80 bg-zinc-50/30">
                <div className="flex border-b border-zinc-200 pb-4 mb-6">
                  <div className="flex gap-2 p-1 bg-zinc-100 rounded-lg w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setActiveTab('student')}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                        activeTab === 'student'
                          ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <GraduationCap size={15} strokeWidth={1.75} />
                      <span>Student / Learner Registration</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('institution')}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors ${
                        activeTab === 'institution'
                          ? 'bg-white text-zinc-900 font-semibold shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      <Building2 size={15} strokeWidth={1.75} />
                      <span>Institution Registration</span>
                    </button>
                  </div>
                </div>

                {activeTab === 'student' ? (
                  <form onSubmit={handleStudentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={studentEmail}
                          onChange={(e) => setStudentEmail(e.target.value)}
                          className="w-full text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">University / College</label>
                        <input
                          type="text"
                          value={studentUniversity}
                          onChange={(e) => setStudentUniversity(e.target.value)}
                          className="w-full text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Target Job Role</label>
                        <input
                          type="text"
                          value={studentTargetRole}
                          onChange={(e) => setStudentTargetRole(e.target.value)}
                          className="w-full text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          required
                        />
                      </div>
                    </div>

                    {/* Skills Builder */}
                    <div className="pt-2">
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Initial Stack</label>
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {studentSkills.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-zinc-100 border border-zinc-200 text-zinc-800"
                          >
                            <span>{s.name}</span>
                            <span className="text-xs text-zinc-500 font-mono">({s.level})</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(s.id)}
                              className="text-zinc-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Skill name (e.g. Docker, TypeScript)"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          className="flex-1 text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                        <select
                          value={newSkillLevel}
                          onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                          className="text-xs px-3 py-2 rounded-md border border-zinc-300 bg-white"
                        >
                          <option value="Foundation">Foundation</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-3.5 py-2 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Lock size={14} strokeWidth={1.75} />
                        <span>Launch Custom Student Profile</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleInstitutionSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Administrator Name</label>
                        <input
                          type="text"
                          value={instName}
                          onChange={(e) => setInstName(e.target.value)}
                          className="w-full text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Official Email</label>
                        <input
                          type="email"
                          value={instEmail}
                          onChange={(e) => setInstEmail(e.target.value)}
                          className="w-full text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Institution / University</label>
                        <input
                          type="text"
                          value={instOrg}
                          onChange={(e) => setInstOrg(e.target.value)}
                          className="w-full text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Role Title</label>
                        <input
                          type="text"
                          value={instRoleTitle}
                          onChange={(e) => setInstRoleTitle(e.target.value)}
                          className="w-full text-xs px-3.5 py-2 rounded-md border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <Building2 size={14} strokeWidth={1.75} />
                        <span>Launch Custom Institution Portal</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200/90 py-6 px-4 sm:px-8 bg-white mt-12 text-center text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span>SkillMorph AI</span>
            <span>•</span>
            <span>Autonomous 4-Agent Groq LPU Mesh</span>
            <span>•</span>
            <span>W3C Proof-of-Skill Verifiable Credentials</span>
          </div>
          <div className="text-xs text-zinc-500 font-medium">
            PromptWars X RTC Hackathon Production Release
          </div>
        </div>
      </footer>
    </div>
  );
}
