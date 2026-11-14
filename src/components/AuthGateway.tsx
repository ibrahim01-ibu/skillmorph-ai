// src/components/AuthGateway.tsx — Student & Institution Authentication & Onboarding Portal
import { useState } from 'react';
import {
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Lock,
  User,
  Plus,
  Trash2,
  Terminal,
} from 'lucide-react';
import type { UserProfile, Skill, SkillLevel } from '../types';

interface AuthGatewayProps {
  onLogin: (user: UserProfile, initialSkills?: Skill[], targetCareer?: string) => void;
}

export function AuthGateway({ onLogin }: AuthGatewayProps) {
  const [activeTab, setActiveTab] = useState<'student' | 'institution'>('student');
  const [isSignUp, setIsSignUp] = useState(false);

  // Student Form State
  const [studentName, setStudentName] = useState('Aarav Sharma');
  const [studentEmail, setStudentEmail] = useState('aarav.sharma@iitb.ac.in');
  const [studentUniversity, setStudentUniversity] = useState('Indian Institute of Technology Bombay');
  const [studentRoleTitle, setStudentRoleTitle] = useState('Final Year B.Tech Computer Science');
  const [studentTargetRole, setStudentTargetRole] = useState('Full Stack Developer');
  const [studentProjects, setStudentProjects] = useState<string[]>([
    'Student Database CRUD CLI (Python + SQLite)',
    'Static Portfolio Page (HTML)',
  ]);
  const [newProject, setNewProject] = useState('');
  const [studentCerts, setStudentCerts] = useState<string[]>([
    'Python for Data & Backend (NPTEL / Coursera)',
    'Relational SQL Foundations',
  ]);
  const [newCert, setNewCert] = useState('');
  const [studentSkills, setStudentSkills] = useState<Skill[]>([
    { id: 'sk-1', name: 'Python', level: 'Advanced', category: 'Backend' },
    { id: 'sk-2', name: 'SQL & Relational DBs', level: 'Intermediate', category: 'Data' },
    { id: 'sk-3', name: 'HTML5 & CSS3', level: 'Foundation', category: 'Frontend' },
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');

  // Institution Form State
  const [instName, setInstName] = useState('Dr. Vikram Nair');
  const [instEmail, setInstEmail] = useState('vikram.nair@iitb.ac.in');
  const [instOrg, setInstOrg] = useState('IIT Bombay — Office of Career Services & Talent Analytics');
  const [instRoleTitle, setInstRoleTitle] = useState('Dean of Placements & Industry Partnerships');

  // Quick 1-Click Demo Logins
  function handleDemoStudentLogin() {
    onLogin(
      {
        id: 'user-student-aarav',
        type: 'student',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@iitb.ac.in',
        institution: 'IIT Bombay',
        roleTitle: 'Final Year CS',
        githubUsername: 'aarav-sharma-dev',
        bio: 'Backend & Data enthusiast transitioning into high-scale modern Full Stack & Distributed Systems.',
        certifications: [
          'Python for Data & Backend (NPTEL / Coursera)',
          'Relational SQL Foundations',
        ],
        pastProjects: [
          'Student Database CRUD CLI (Python + SQLite)',
          'Static Portfolio Page (HTML)',
        ],
      },
      [
        { id: 'skill-python', name: 'Python', level: 'Advanced', category: 'Backend' },
        { id: 'skill-sql', name: 'SQL', level: 'Intermediate', category: 'Data' },
        { id: 'skill-html', name: 'Basic HTML', level: 'Foundation', category: 'Frontend' },
      ],
      'Full Stack Developer'
    );
  }

  function handleDemoInstitutionLogin() {
    onLogin({
      id: 'user-dean-vikram',
      type: 'institution',
      name: 'Dr. Vikram Nair',
      email: 'vikram.nair@iitb.ac.in',
      institution: 'IIT Bombay — Career Services',
      roleTitle: 'Head of Placement Cell & Talent Analytics',
      bio: 'Leading placement readiness and curriculum alignment across 1,240 senior engineering students.',
      certifications: ['NAAC Accreditation Board Lead', 'IEEE Senior Member'],
      pastProjects: ['Institutional AI Career Gap & Placement Readiness Deployment 2026'],
    });
  }

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

  function addProject() {
    if (!newProject.trim()) return;
    setStudentProjects((prev) => [...prev, newProject.trim()]);
    setNewProject('');
  }

  function addCert() {
    if (!newCert.trim()) return;
    setStudentCerts((prev) => [...prev, newCert.trim()]);
    setNewCert('');
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Brand Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold">
            <Terminal size={15} strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-zinc-900">SkillMorph AI</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700">
                Enterprise Autopilot
              </span>
            </div>
            <p className="text-xs text-zinc-500">Autonomous 4-Agent Career & Placement Mesh</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600 bg-white border border-zinc-200 px-3 py-1 rounded-md shadow-xs">
          <ShieldCheck size={14} strokeWidth={1.75} className="text-emerald-600" />
          <span>W3C Verifiable Proof-of-Skill & Groq LPU Powered</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto my-6">
        {/* Judge 1-Click Fastlane Buttons */}
        <div className="bg-white border border-zinc-300 rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2.5">
            <Terminal size={14} strokeWidth={1.75} className="text-zinc-900" />
            <span>Judge Sandbox — Instant 1-Click Evaluation Gateways</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={handleDemoStudentLogin}
              className="group flex items-center justify-between p-3.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <GraduationCap size={16} strokeWidth={1.75} className="text-zinc-700" />
                  <span>Student Demo: Aarav Sharma</span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Python + SQL + HTML to Full Stack Dev (4-Node Gap)
                </div>
              </div>
              <ArrowRight size={15} strokeWidth={1.75} className="text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={handleDemoInstitutionLogin}
              className="group flex items-center justify-between p-3.5 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-colors"
            >
              <div>
                <div className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                  <Building2 size={16} strokeWidth={1.75} className="text-zinc-700" />
                  <span>Institution Demo: University Dean Portal</span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Dr. Vikram Nair to Placement Analytics & Interventions
                </div>
              </div>
              <ArrowRight size={15} strokeWidth={1.75} className="text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Student vs Institution */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-7 shadow-xs">
          <div className="flex border-b border-zinc-200 pb-4 mb-5">
            <div className="flex gap-1.5 p-1 bg-zinc-100 rounded-lg w-full sm:w-auto">
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
                <span>Student / Learner Portal</span>
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
                <span>University / Enterprise Portal</span>
              </button>
            </div>
          </div>

          {/* TAB A: STUDENT SIGN-IN & ONBOARDING */}
          {activeTab === 'student' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                    {isSignUp ? 'Create Comprehensive Learner Profile' : 'Student Career Autopilot Sign-In'}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {isSignUp
                      ? 'Define your existing skill vector, past projects, and target career for personalized transfer learning.'
                      : 'Sign in to access your Waze-style Skill-DAG, anti-doomscroll sprints, and verified skill passport.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-medium text-zinc-800 hover:underline whitespace-nowrap"
                >
                  {isSignUp ? 'Already registered? Sign In' : 'New student? Complete Profile'}
                </button>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={15} strokeWidth={1.75} className="text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Aarav Sharma"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                      Student Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="aarav.sharma@iitb.ac.in"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                      University / College / Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={studentUniversity}
                      onChange={(e) => setStudentUniversity(e.target.value)}
                      placeholder="IIT Bombay"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                      Current Academic Status / Year
                    </label>
                    <input
                      type="text"
                      value={studentRoleTitle}
                      onChange={(e) => setStudentRoleTitle(e.target.value)}
                      placeholder="Final Year CS"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                    Target Job Role / Career Goal
                  </label>
                  <select
                    value={studentTargetRole}
                    onChange={(e) => setStudentTargetRole(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                  >
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="AI/ML Systems Engineer">AI/ML Systems Engineer</option>
                    <option value="Cloud Backend Architect">Cloud Backend Architect</option>
                    <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
                  </select>
                </div>

                {/* Extended Profile Fields in Sign-Up Mode */}
                {isSignUp && (
                  <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200 space-y-3.5">
                    {/* Verified Skills Vector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-zinc-700 uppercase tracking-wider">
                          Existing Verified Skills ({studentSkills.length})
                        </label>
                        <span className="text-[11px] text-zinc-500">Languages, tools, frameworks</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {studentSkills.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-xs font-medium text-zinc-800"
                          >
                            <Code2 size={13} strokeWidth={1.75} className="text-zinc-600" />
                            <span>{s.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">[{s.level}]</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(s.id)}
                              className="text-zinc-400 hover:text-red-600 ml-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder="TypeScript, Docker, PyTorch"
                          className="flex-1 px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md text-xs"
                        />
                        <select
                          value={newSkillLevel}
                          onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                          className="px-2 py-1.5 bg-white border border-zinc-200 rounded-md text-xs font-medium"
                        >
                          <option value="Foundation">Foundation</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-3 py-1.5 bg-zinc-900 text-white rounded-md text-xs font-medium flex items-center gap-1"
                        >
                          <Plus size={13} strokeWidth={1.75} /> Add
                        </button>
                      </div>
                    </div>

                    {/* Past Projects */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                        Past Projects & GitHub Repos
                      </label>
                      <div className="space-y-1 mb-2">
                        {studentProjects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-white border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-700 flex items-center justify-between"
                          >
                            <span>{proj}</span>
                            <button
                              type="button"
                              onClick={() => setStudentProjects((p) => p.filter((_, i) => i !== idx))}
                              className="text-zinc-400 hover:text-red-600"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProject}
                          onChange={(e) => setNewProject(e.target.value)}
                          placeholder="Real-Time Chat App with WebSockets"
                          className="flex-1 px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md text-xs"
                        />
                        <button
                          type="button"
                          onClick={addProject}
                          className="px-3 py-1.5 bg-zinc-900 text-white rounded-md text-xs font-medium"
                        >
                          Add Project
                        </button>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                        Certifications & Honors
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {studentCerts.map((c, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-xs font-medium text-zinc-700"
                          >
                            <CheckCircle2 size={13} strokeWidth={1.75} className="text-zinc-600" />
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={() => setStudentCerts((certs) => certs.filter((_, i) => i !== idx))}
                              className="text-zinc-400 hover:text-red-600 ml-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCert}
                          onChange={(e) => setNewCert(e.target.value)}
                          placeholder="AWS Solutions Architect Associate"
                          className="flex-1 px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md text-xs"
                        />
                        <button
                          type="button"
                          onClick={addCert}
                          className="px-3 py-1.5 bg-zinc-900 text-white rounded-md text-xs font-medium"
                        >
                          Add Cert
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <span>{isSignUp ? 'Launch Personalized Skill-DAG' : 'Enter Student Studio'}</span>
                  <ArrowRight size={15} strokeWidth={1.75} />
                </button>
              </form>
            </div>
          ) : (
            /* TAB B: INSTITUTION / UNIVERSITY SIGN-IN */
            <div>
              <div className="mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
                  University & Enterprise Talent Portal
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Institutional access for Placement Deans, Department Heads, and Talent Directors to monitor cohort skill readiness and push targeted interventions.
                </p>
              </div>

              <form onSubmit={handleInstitutionSubmit} className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                      Administrator Name
                    </label>
                    <div className="relative">
                      <User size={15} strokeWidth={1.75} className="text-zinc-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={instName}
                        onChange={(e) => setInstName(e.target.value)}
                        placeholder="Dr. Vikram Nair"
                        className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                      Official Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      placeholder="dean.careers@university.edu"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                      Institution / University / Company
                    </label>
                    <input
                      type="text"
                      required
                      value={instOrg}
                      onChange={(e) => setInstOrg(e.target.value)}
                      placeholder="IIT Bombay — Placement Cell"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 uppercase tracking-wider mb-1">
                      Administrative Role / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={instRoleTitle}
                      onChange={(e) => setInstRoleTitle(e.target.value)}
                      placeholder="Head of Career Services & Talent Analytics"
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-md bg-zinc-50 border border-zinc-200 flex items-start gap-2.5">
                  <Lock size={15} strokeWidth={1.75} className="text-zinc-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-zinc-600 leading-relaxed">
                    <span className="font-medium text-zinc-900">Campus Placement Security & Compliance:</span>
                    <div className="mt-0.5 text-zinc-500">
                      Access aggregate cohort velocity, NAAC/NBA skill alignment reports, and push direct targeted curriculum interventions into individual student roadmaps.
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Building2 size={15} strokeWidth={1.75} />
                  <span>Enter University & Talent Cloud</span>
                  <ArrowRight size={15} strokeWidth={1.75} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-zinc-400 pt-3 border-t border-zinc-200">
        SkillMorph AI 4-Agent Mesh • Polyglot Brain-Diff Architecture • Zero-Doomscroll Guarantee
      </div>
    </div>
  );
}
