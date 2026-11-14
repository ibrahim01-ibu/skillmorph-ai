// src/components/AuthGateway.tsx — Student & Institution Authentication & Onboarding Portal
import { useState } from 'react';
import {
  GraduationCap,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Zap,
  Lock,
  User,
  Plus,
  Trash2,
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
    'Built Flask & PostgreSQL Inventory Microservice with JWT Auth',
    'Created Python Data Scraper for Public Academic Research',
  ]);
  const [newProject, setNewProject] = useState('');
  const [studentCerts, setStudentCerts] = useState<string[]>([
    'AWS Certified Cloud Practitioner (CLF-C02)',
    'Meta Front-End Developer Specialization',
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
          'AWS Certified Cloud Practitioner',
          'Meta Front-End Specialization',
        ],
        pastProjects: [
          'Built Flask & PostgreSQL Inventory Microservice with JWT Auth',
          'Python High-Throughput Scraper with Redis Caching',
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
    <div className="min-h-screen bg-[#FAF8F5] text-[#18181B] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Brand Bar */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 border-b border-[#E6E4DD]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EA580C] flex items-center justify-center text-white shadow-md shadow-[#EA580C]/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-[#18181B]">SkillMorph AI</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
                Enterprise Autopilot
              </span>
            </div>
            <p className="text-xs text-zinc-500">Autonomous 4-Agent Career & Placement Mesh</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600 bg-white border border-[#E6E4DD] px-3 py-1.5 rounded-full shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
          <span>W3C Verifiable Proof-of-Skill & Groq LPU Powered</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto my-8">
        {/* Judge 1-Click Fastlane Buttons */}
        <div className="bg-white border-2 border-[#EA580C]/30 rounded-2xl p-5 mb-8 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Judge Sandbox — Instant 1-Click Evaluation Gateways</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={handleDemoStudentLogin}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3F1EC] border border-[#E6E4DD] text-left transition-all"
            >
              <div>
                <div className="text-sm font-bold text-[#18181B] group-hover:text-[#EA580C] transition-colors flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#EA580C]" />
                  <span>Student Demo: Aarav Sharma</span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Python + SQL + HTML ➔ Full Stack Dev (4-Node Gap)
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#EA580C] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={handleDemoInstitutionLogin}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3F1EC] border border-[#E6E4DD] text-left transition-all"
            >
              <div>
                <div className="text-sm font-bold text-[#18181B] group-hover:text-[#0F766E] transition-colors flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0F766E]" />
                  <span>Institution Demo: University Dean Portal</span>
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Dr. Vikram Nair ➔ Placement Analytics & Live Interventions
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#0F766E] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Student vs Institution */}
        <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex border-b border-[#E6E4DD] pb-4 mb-6">
            <div className="flex gap-2 p-1 bg-[#F3F1EC] rounded-2xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('student')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'student'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-zinc-600 hover:text-[#18181B]'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#EA580C]" />
                <span>Student / Learner Portal</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('institution')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'institution'
                    ? 'bg-white text-[#18181B] shadow-xs'
                    : 'text-zinc-600 hover:text-[#18181B]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#0F766E]" />
                <span>University / Enterprise Portal</span>
              </button>
            </div>
          </div>

          {/* TAB A: STUDENT SIGN-IN & ONBOARDING */}
          {activeTab === 'student' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#18181B]">
                    {isSignUp ? 'Create Comprehensive Learner Profile' : 'Student Career Autopilot Sign-In'}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    {isSignUp
                      ? 'Define your existing skill vector, past projects, and target career for personalized transfer learning.'
                      : 'Sign in to access your Waze-style Skill-DAG, anti-doomscroll sprints, and verified skill passport.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-semibold text-[#EA580C] hover:underline whitespace-nowrap"
                >
                  {isSignUp ? 'Already registered? Sign In' : 'New student? Complete Profile'}
                </button>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                      Student Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="e.g. aarav.sharma@iitb.ac.in"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                      University / College / Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={studentUniversity}
                      onChange={(e) => setStudentUniversity(e.target.value)}
                      placeholder="e.g. IIT Bombay / Stanford University"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                      Current Academic Status / Year
                    </label>
                    <input
                      type="text"
                      value={studentRoleTitle}
                      onChange={(e) => setStudentRoleTitle(e.target.value)}
                      placeholder="e.g. Final Year CS"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                    Target Job Role / Career Goal
                  </label>
                  <select
                    value={studentTargetRole}
                    onChange={(e) => setStudentTargetRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-semibold text-[#EA580C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/20 focus:border-[#EA580C]"
                  >
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="AI/ML Systems Engineer">AI/ML Systems Engineer</option>
                    <option value="Cloud Backend Architect">Cloud Backend Architect</option>
                    <option value="Distributed Systems Engineer">Distributed Systems Engineer</option>
                  </select>
                </div>

                {/* Extended Profile Fields in Sign-Up Mode */}
                {isSignUp && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E4DD] space-y-4">
                    {/* Verified Skills Vector */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                          Existing Verified Skills ({studentSkills.length})
                        </label>
                        <span className="text-xs text-zinc-500">Add languages, tools, frameworks</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {studentSkills.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6E4DD] text-xs font-medium text-[#18181B] shadow-xs"
                          >
                            <Code2 className="w-3.5 h-3.5 text-[#0F766E]" />
                            <span>{s.name}</span>
                            <span className="text-[10px] text-zinc-500 font-mono">[{s.level}]</span>
                            <button
                              type="button"
                              onClick={() => removeSkill(s.id)}
                              className="text-zinc-400 hover:text-red-500 ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder="e.g. C++, Docker, PyTorch"
                          className="flex-1 px-3 py-2 bg-white border border-[#E6E4DD] rounded-xl text-xs"
                        />
                        <select
                          value={newSkillLevel}
                          onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                          className="px-3 py-2 bg-white border border-[#E6E4DD] rounded-xl text-xs font-medium"
                        >
                          <option value="Foundation">Foundation</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-3 py-2 bg-[#EA580C] text-white rounded-xl text-xs font-semibold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>

                    {/* Past Projects */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Past Projects & GitHub Repos
                      </label>
                      <div className="space-y-1.5 mb-2">
                        {studentProjects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-white border border-[#E6E4DD] rounded-xl px-3 py-2 text-zinc-700 flex items-center justify-between"
                          >
                            <span>• {proj}</span>
                            <button
                              type="button"
                              onClick={() => setStudentProjects((p) => p.filter((_, i) => i !== idx))}
                              className="text-zinc-400 hover:text-red-500"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProject}
                          onChange={(e) => setNewProject(e.target.value)}
                          placeholder="e.g. Built Real-Time Chat App with WebSockets"
                          className="flex-1 px-3 py-2 bg-white border border-[#E6E4DD] rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={addProject}
                          className="px-3 py-2 bg-zinc-800 text-white rounded-xl text-xs font-semibold"
                        >
                          Add Project
                        </button>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Certifications & Honors
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {studentCerts.map((c, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#E6E4DD] text-xs font-medium text-zinc-700"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" />
                            <span>{c}</span>
                            <button
                              type="button"
                              onClick={() => setStudentCerts((certs) => certs.filter((_, i) => i !== idx))}
                              className="text-zinc-400 hover:text-red-500 ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCert}
                          onChange={(e) => setNewCert(e.target.value)}
                          placeholder="e.g. AWS Solutions Architect Associate"
                          className="flex-1 px-3 py-2 bg-white border border-[#E6E4DD] rounded-xl text-xs"
                        />
                        <button
                          type="button"
                          onClick={addCert}
                          className="px-3 py-2 bg-zinc-800 text-white rounded-xl text-xs font-semibold"
                        >
                          Add Cert
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#EA580C]/20"
                >
                  <span>{isSignUp ? 'Launch Personalized Skill-DAG' : 'Enter Student Studio'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* TAB B: INSTITUTION / UNIVERSITY SIGN-IN */
            <div>
              <div className="mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#18181B]">
                  University & Enterprise Talent Portal
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Institutional access for Placement Deans, Department Heads, and Talent Directors to monitor cohort skill readiness and push targeted interventions.
                </p>
              </div>

              <form onSubmit={handleInstitutionSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                      Administrator Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={instName}
                        onChange={(e) => setInstName(e.target.value)}
                        placeholder="e.g. Dr. Vikram Nair"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                      Official Institutional Email
                    </label>
                    <input
                      type="email"
                      required
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      placeholder="e.g. dean.careers@university.edu"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                      Institution / University / Company
                    </label>
                    <input
                      type="text"
                      required
                      value={instOrg}
                      onChange={(e) => setInstOrg(e.target.value)}
                      placeholder="e.g. IIT Bombay — Placement Cell"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                      Administrative Role / Title
                    </label>
                    <input
                      type="text"
                      required
                      value={instRoleTitle}
                      onChange={(e) => setInstRoleTitle(e.target.value)}
                      placeholder="e.g. Head of Career Services & Talent Analytics"
                      className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-sm font-medium text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E4DD] flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#0F766E] flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-zinc-600 leading-relaxed">
                    <span className="font-semibold text-zinc-800">Campus Placement Security & Compliance:</span>
                    <div className="mt-0.5 text-zinc-500">
                      Access aggregate cohort velocity, NAAC/NBA skill alignment reports, and push direct targeted curriculum interventions into individual student roadmaps.
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0F766E]/20"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Enter University & Talent Cloud</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-zinc-400 pt-4 border-t border-[#E6E4DD]">
        SkillMorph AI 4-Agent Mesh • Polyglot Brain-Diff Architecture • Zero-Doomscroll Guarantee
      </div>
    </div>
  );
}
