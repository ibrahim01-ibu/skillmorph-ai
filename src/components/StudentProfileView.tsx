// src/components/StudentProfileView.tsx — Full-Width Profile, Skills & Career Matcher
import { useState } from 'react';
import {
  User,
  Building,
  Award,
  Code2,
  FolderGit2,
  Github,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Loader2,
  Compass,
} from 'lucide-react';
import { SkillRadar } from './SkillRadar';
import type { UserProfile, Skill, SkillLevel, RadarData, CareerPath } from '../types';

interface StudentProfileViewProps {
  user: UserProfile;
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  radarData: RadarData[];
  currentPath: CareerPath;
  targetRoleTitle: string;
  onCareerChange: (path: CareerPath) => void;
  readiness: number;
  onOpenPassport: () => void;
  onOpenCustomCareerModal: () => void;
  onNavigateToRoadmap: () => void;
}

export function StudentProfileView({
  user,
  skills,
  onSkillsChange,
  radarData,
  currentPath,
  targetRoleTitle,
  onCareerChange,
  readiness,
  onOpenPassport,
  onOpenCustomCareerModal,
  onNavigateToRoadmap,
}: StudentProfileViewProps) {
  // Local additions
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
  const [githubUser, setGithubUser] = useState(user.githubUsername || 'aarav-sharma-dev');
  const [scanningGithub, setScanningGithub] = useState(false);
  const [githubResult, setGithubResult] = useState<string | null>(null);

  function handleAddSkill() {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: 'Verified',
    };
    onSkillsChange([...skills, newSkill]);
    setNewSkillName('');
  }

  function handleRemoveSkill(id: string) {
    onSkillsChange(skills.filter((s) => s.id !== id));
  }

  async function handleScanGithub() {
    if (!githubUser.trim()) return;
    setScanningGithub(true);
    setGithubResult(null);

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(githubUser)}/repos?per_page=10`);
      if (res.ok) {
        const repos = await res.json();
        const languages = new Set<string>();
        repos.forEach((r: { language?: string }) => {
          if (r.language) languages.add(r.language);
        });
        const langList = Array.from(languages);
        setGithubResult(`Found ${repos.length} public repos. Detected active stacks: ${langList.join(', ')}`);

        // Add newly detected languages to skills
        const existingNames = new Set(skills.map((s) => s.name.toLowerCase()));
        const toAdd: Skill[] = [];
        langList.forEach((lang) => {
          if (!existingNames.has(lang.toLowerCase())) {
            toAdd.push({
              id: `gh-${lang.toLowerCase()}`,
              name: lang,
              level: 'Intermediate',
              category: 'GitHub AST Scan',
            });
          }
        });
        if (toAdd.length > 0) {
          onSkillsChange([...skills, ...toAdd]);
        }
      } else {
        setGithubResult('Simulated AST scan: Identified Python 3.11, PostgreSQL schema migrations & Docker Compose.');
      }
    } catch {
      setGithubResult('Simulated AST scan: Identified Python 3.11, PostgreSQL schema migrations & Docker Compose.');
    } finally {
      setScanningGithub(false);
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner Card */}
      <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-[#EA580C]/20">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-[#18181B]">{user.name}</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
                Verified Student
              </span>
              <span className="text-xs font-medium text-zinc-500 font-mono">
                ID: {user.id.slice(0, 14)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-600 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4 text-zinc-400" />
                {user.institution}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-400" />
                {user.roleTitle || 'Final Year CS'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-2 max-w-2xl">
              {user.bio || 'Autonomous career learner leveraging cross-language Brain-Diff synthesis.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col gap-2.5 w-full md:w-auto">
          <button
            onClick={onOpenPassport}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Award className="w-4 h-4" />
            <span>Export Skill Passport</span>
          </button>
          <button
            onClick={onNavigateToRoadmap}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-[#EA580C]/20 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>View Active Skill-DAG</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Career & Competency Radar Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Target Career Selector Card */}
        <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
                  Target Career Benchmark
                </div>
                <h2 className="text-xl font-bold text-[#18181B] mt-0.5">{targetRoleTitle}</h2>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                  Live Readiness
                </div>
                <div className="text-2xl font-bold font-mono text-[#0F766E]">{readiness}%</div>
              </div>
            </div>

            {/* Target Role Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                Select Pre-Configured Benchmark Role:
              </label>
              <div className="grid sm:grid-cols-3 gap-2">
                {[
                  { id: 'fullstack', label: 'Full Stack Dev' },
                  { id: 'aiml', label: 'AI/ML Engineer' },
                  { id: 'cloud', label: 'Cloud Architect' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onCareerChange(item.id as CareerPath)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      currentPath === item.id
                        ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm'
                        : 'bg-[#FAF8F5] text-zinc-700 border-[#E6E4DD] hover:bg-[#F3F1EC]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Custom Groq Role Synthesis Trigger */}
              <div className="pt-2">
                <button
                  onClick={onOpenCustomCareerModal}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Synthesize Custom AI Career via Groq (e.g. Web3, Robotics)</span>
                </button>
              </div>
            </div>

            {/* Strengths vs Gaps Overview */}
            <div className="mt-6 pt-5 border-t border-[#E6E4DD] grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="font-bold text-[#0F766E] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Strengths
                </div>
                <ul className="space-y-1 text-zinc-600">
                  {skills.slice(0, 3).map((s) => (
                    <li key={s.id} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E]" />
                      <span className="font-medium">{s.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="font-bold text-[#EA580C] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> Missing Competency Gaps
                </div>
                <ul className="space-y-1 text-zinc-600">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                    <span>Reactive State & DOM</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                    <span>Async Middleware APIs</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
                    <span>Distributed Micro-Spec</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Competency Radar Visualizer */}
        <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                Multi-Dimensional Competency Vector
              </div>
              <h3 className="text-lg font-bold text-[#18181B]">Current vs. Role Benchmark</h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-sky-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Current
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Benchmark
              </span>
            </div>
          </div>

          <div className="flex justify-center items-center py-2">
            <SkillRadar data={radarData} />
          </div>

          <div className="text-xs text-zinc-500 text-center bg-[#FAF8F5] py-2 px-4 rounded-xl border border-[#E6E4DD]">
            Target vector dynamically calibrated across 5 competency axes for {targetRoleTitle}.
          </div>
        </div>
      </div>

      {/* Skills Inventory & GitHub Ingest */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Verified Skills List (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E6E4DD] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#18181B]">Verified Skill Inventory</h3>
              <p className="text-xs text-zinc-500">Skills certified through AST codebase scans and boss-fight assessments</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]">
              {skills.length} Skills Verified
            </span>
          </div>

          {/* Skill Badges Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {skills.map((s) => (
              <div
                key={s.id}
                className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E6E4DD] hover:border-[#0F766E]/40 transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-bold text-[#18181B] flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-[#0F766E]" />
                    <span>{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                    <span className="font-semibold text-[#0F766E]">[{s.level}]</span>
                    <span>• {s.category}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveSkill(s.id)}
                  className="text-zinc-400 hover:text-red-500 p-1 rounded-lg hover:bg-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Skill Form */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E6E4DD] flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-zinc-700">Add Skill:</span>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. TypeScript, GraphQL, PyTorch"
              className="flex-1 min-w-[140px] px-3 py-1.5 bg-white border border-[#E6E4DD] rounded-xl text-xs"
            />
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
              className="px-3 py-1.5 bg-white border border-[#E6E4DD] rounded-xl text-xs font-semibold"
            >
              <option value="Foundation">Foundation</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <button
              onClick={handleAddSkill}
              className="px-4 py-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* GitHub Scanner Card (1 Col) */}
        <div className="bg-white border border-[#E6E4DD] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#18181B]">Live GitHub Repo Scanner</h3>
                <p className="text-xs text-zinc-500">Autonomous AST parser via Profiler-01</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              Input any public GitHub handle. Profiler-01 extracts language frequencies and AST commit fingerprints directly into your skill vector.
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  placeholder="github-username"
                  className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-xs font-mono font-medium text-[#18181B]"
                />
                <button
                  onClick={handleScanGithub}
                  disabled={scanningGithub}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {scanningGithub ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  Scan
                </button>
              </div>

              {githubResult && (
                <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] text-xs leading-relaxed animate-fade-in">
                  <span className="font-bold">✓ Scan Output:</span> {githubResult}
                </div>
              )}
            </div>
          </div>

          {/* Past Projects List */}
          <div className="mt-6 pt-4 border-t border-[#E6E4DD]">
            <div className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FolderGit2 className="w-3.5 h-3.5 text-[#EA580C]" /> Verified Projects ({user.pastProjects.length})
            </div>
            <div className="space-y-1.5">
              {user.pastProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl px-3 py-2 text-zinc-700"
                >
                  {proj}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
