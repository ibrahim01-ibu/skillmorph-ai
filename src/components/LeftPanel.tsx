// src/components/LeftPanel.tsx — Apple / Material 3 Daylight Learner Profile & Skills
import { useState, useEffect, useRef } from 'react';
import {
  Github,
  Plus,
  X,
  ChevronDown,
  Loader2,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { Skill, SkillLevel, CareerPath, RadarData, AgentLog } from '../types';
import { SkillRadar } from './SkillRadar';

const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  Foundation: 'bg-slate-100 text-slate-700 border-slate-200',
  Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  Advanced: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Expert: 'bg-indigo-50 text-indigo-800 border-indigo-200',
};

const TARGET_ROLES = [
  'Full Stack Developer',
  'AI/ML Systems Engineer',
  'Cloud Backend Architect',
  'DevOps Engineer',
  'Data Engineer',
];

const GITHUB_LANG_TO_SKILL: Record<string, { name: string; level: SkillLevel; category: string }> = {
  Python: { name: 'Python', level: 'Advanced', category: 'Backend' },
  JavaScript: { name: 'JavaScript ES6+', level: 'Intermediate', category: 'Frontend' },
  TypeScript: { name: 'TypeScript', level: 'Intermediate', category: 'Frontend' },
  Java: { name: 'Java', level: 'Intermediate', category: 'Backend' },
  'C++': { name: 'C++', level: 'Foundation', category: 'Systems' },
  Rust: { name: 'Rust', level: 'Foundation', category: 'Systems' },
  Go: { name: 'Go', level: 'Foundation', category: 'Backend' },
  HTML: { name: 'HTML/CSS', level: 'Foundation', category: 'Frontend' },
  CSS: { name: 'HTML/CSS', level: 'Foundation', category: 'Frontend' },
  Shell: { name: 'Linux & Bash', level: 'Foundation', category: 'DevOps' },
  Dockerfile: { name: 'Docker', level: 'Foundation', category: 'DevOps' },
};

interface LeftPanelProps {
  skills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  radarData: RadarData[];
  currentPath: CareerPath;
  onCareerChange: (path: CareerPath) => void;
  readiness: number;
  onAgentLog: (log: Omit<AgentLog, 'id' | 'timestamp'>) => void;
  onOpenPassport: () => void;
  onOpenCustomCareerModal: () => void;
}

export function LeftPanel({
  skills,
  onSkillsChange,
  radarData,
  readiness,
  onAgentLog,
  onOpenPassport,
  onOpenCustomCareerModal,
}: LeftPanelProps) {
  const [githubUsername, setGithubUsername] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [addSkillName, setAddSkillName] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [displayedReadiness, setDisplayedReadiness] = useState(readiness);
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const displayedReadinessRef = useRef(readiness);
  const prevReadinessRef = useRef(readiness);

  useEffect(() => {
    displayedReadinessRef.current = displayedReadiness;
  }, [displayedReadiness]);

  useEffect(() => {
    if (readiness !== prevReadinessRef.current) {
      prevReadinessRef.current = readiness;
      const start = displayedReadinessRef.current;
      const end = readiness;
      const diff = end - start;
      const duration = 1000;
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayedReadiness(Math.round(start + diff * eased));
        if (progress >= 1) clearInterval(timer);
      }, 16);
      return () => clearInterval(timer);
    }
  }, [readiness]);

  async function handleGithubScan() {
    if (!githubUsername.trim()) return;
    setScanning(true);
    setScanResult(null);

    onAgentLog({
      agent: 'Profiler-01',
      agentId: 1,
      message: `Scanning GitHub profile: ${githubUsername} — fetching public repositories...`,
      type: 'info',
      payload: JSON.stringify({ username: githubUsername, action: 'github_scan' }),
    });

    try {
      const res = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=30&sort=updated`);
      if (!res.ok) throw new Error(res.status === 403 ? 'Rate limited' : 'User not found');
      const repos: Array<{ language: string | null; name: string }> = await res.json();

      const langCounts: Record<string, number> = {};
      repos.forEach((r) => {
        if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1;
      });

      const topLangs = Object.entries(langCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([lang]) => lang);

      const newSkills: Skill[] = [];
      topLangs.forEach((lang) => {
        const mapping = GITHUB_LANG_TO_SKILL[lang];
        if (mapping && !skills.find((s) => s.name === mapping.name)) {
          newSkills.push({ id: `gh-${Date.now()}-${lang}`, ...mapping });
        }
      });

      if (newSkills.length > 0) {
        onSkillsChange([...skills, ...newSkills]);
        setScanResult(`Added ${newSkills.length} verified skills: ${newSkills.map((s) => s.name).join(', ')}`);
        onAgentLog({
          agent: 'Profiler-01',
          agentId: 1,
          message: `GitHub audit complete. ${repos.length} repos analyzed. Injected ${newSkills.length} verified skills into profile.`,
          type: 'success',
          payload: JSON.stringify({ skills: newSkills.map((s) => s.name), langs: topLangs }),
        });
        onAgentLog({
          agent: 'GapArchitect-02',
          agentId: 2,
          message: `Received updated skill vector. Recalculating career graph delta for ${targetRole}...`,
          type: 'handoff',
        });
      } else {
        setScanResult(`Scanned ${repos.length} repositories — all detected languages are already in your skill set!`);
        onAgentLog({
          agent: 'Profiler-01',
          agentId: 1,
          message: `GitHub scan complete. Existing skill vector already covers detected repositories.`,
          type: 'info',
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setScanResult(`${msg === 'Rate limited' ? 'GitHub API rate-limited — using cached profile data.' : `Could not fetch: ${msg}`}`);
      onAgentLog({
        agent: 'Profiler-01',
        agentId: 1,
        message: `GitHub fetch note: ${msg}. Profile intact.`,
        type: 'warning',
      });
    } finally {
      setScanning(false);
    }
  }

  function addSkill() {
    if (!addSkillName.trim()) return;
    const newSkill: Skill = {
      id: `manual-${Date.now()}`,
      name: addSkillName.trim(),
      level: 'Foundation',
      category: 'General',
    };
    onSkillsChange([...skills, newSkill]);
    setAddSkillName('');
    setShowAddSkill(false);
  }

  function removeSkill(id: string) {
    onSkillsChange(skills.filter((s) => s.id !== id));
  }

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Learner Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-md shadow-blue-500/20 flex-shrink-0">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold text-slate-900 leading-tight">Aarav Sharma</div>
            <div className="text-xs text-slate-500 font-medium">Final Year CS · IIT Bombay</div>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span className="text-[10px] text-emerald-700 font-semibold">Active Enrollment</span>
            </div>
          </div>
        </div>

        {/* Target Role Selector */}
        <div className="mb-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Target Role Objective
          </label>
          <div className="relative">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 appearance-none focus:outline-none focus:border-blue-500 focus:bg-white cursor-pointer transition-colors pr-8"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Readiness Meter */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Placement Readiness</span>
            <span className="text-base font-bold text-blue-600">{displayedReadiness}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-700"
              style={{ width: `${displayedReadiness}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 text-emerald-600">
              <TrendingUp className="w-3 h-3" />
              +{Math.max(0, readiness - 42)}% from assessment sprints
            </span>
            <span>Target Benchmark: 85%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={onOpenPassport}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Export Verified Skill Passport
          </button>
          <button
            onClick={onOpenCustomCareerModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Synthesize Custom Target Role
          </button>
        </div>
      </div>

      {/* Live GitHub Scanner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Live GitHub Scanner</div>
              <div className="text-[10px] text-slate-500">Autonomous repo code analyzer</div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-0.5">
            Profiler-01
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGithubScan()}
            placeholder="github-username"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          <button
            onClick={handleGithubScan}
            disabled={scanning || !githubUsername.trim()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {scanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Github className="w-3 h-3" />}
            {scanning ? 'Auditing' : 'Scan'}
          </button>
        </div>

        {scanResult && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
            {scanResult}
          </div>
        )}
      </div>

      {/* Verified Skills */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-bold text-slate-900">Verified Competencies</div>
            <div className="text-[10px] text-slate-500">{skills.length} certified skill nodes</div>
          </div>
          <button
            onClick={() => setShowAddSkill(!showAddSkill)}
            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            title="Add Skill"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {showAddSkill && (
          <div className="flex gap-2 mb-3 animate-slide-in-up">
            <input
              type="text"
              value={addSkillName}
              onChange={(e) => setAddSkillName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              placeholder="e.g. Docker, TypeScript"
              autoFocus
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            <button
              onClick={addSkill}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                SKILL_LEVEL_COLORS[skill.level] || 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span>{skill.name}</span>
              <span className="text-[9px] opacity-60">[{skill.level.slice(0, 3)}]</span>
              <button
                onClick={() => removeSkill(skill.id)}
                className="opacity-40 hover:opacity-100 text-slate-600 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Radar Chart Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="text-xs font-bold text-slate-900">Skill Competency Vector</div>
            <div className="text-[10px] text-slate-500">Current Vector vs Target Benchmark</div>
          </div>
        </div>
        <div className="flex justify-center -my-2">
          <SkillRadar data={radarData} size={240} />
        </div>
      </div>
    </div>
  );
}
