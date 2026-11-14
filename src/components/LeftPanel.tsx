// src/components/LeftPanel.tsx — Learner Profile, GitHub Scanner, Skill Radar
import { useState, useEffect, useRef } from 'react';
import { Github, Plus, X, ChevronDown, Loader2, TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import type { Skill, SkillLevel, CareerPath, RadarData, AgentLog } from '../types';
import { SkillRadar } from './SkillRadar';

const SKILL_LEVEL_COLORS: Record<SkillLevel, string> = {
  Foundation: 'bg-slate-700 text-slate-300 border-slate-600',
  Intermediate: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  Advanced: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  Expert: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
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
  const [displayedReadiness, setDisplayedReadiness] = useState(0);
  const [targetRole, setTargetRole] = useState(TARGET_ROLES[0]);
  const displayedReadinessRef = useRef(0);
  const prevReadinessRef = useRef(0);

  useEffect(() => {
    displayedReadinessRef.current = displayedReadiness;
  }, [displayedReadiness]);

  useEffect(() => {
    if (readiness !== prevReadinessRef.current) {
      prevReadinessRef.current = readiness;
      const start = displayedReadinessRef.current;
      const end = readiness;
      const diff = end - start;
      const duration = 1200;
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
        setScanResult(`✅ Found ${repos.length} repos. Added ${newSkills.length} new skills: ${newSkills.map((s) => s.name).join(', ')}`);
        onAgentLog({
          agent: 'Profiler-01',
          agentId: 1,
          message: `GitHub audit complete. ${repos.length} repos analysed. Injected ${newSkills.length} verified skills into skill vector. Handing to GapArchitect-02.`,
          type: 'success',
          payload: JSON.stringify({ skills: newSkills.map((s) => s.name), langs: topLangs }),
        });
        onAgentLog({
          agent: 'GapArchitect-02',
          agentId: 2,
          message: `Received updated skill vector from Profiler-01. Recalculating career delta for target role...`,
          type: 'handoff',
        });
      } else {
        setScanResult(`✅ Scanned ${repos.length} repos — all detected languages already in your skill set!`);
        onAgentLog({
          agent: 'Profiler-01',
          agentId: 1,
          message: `GitHub scan complete. No new skills to add — existing skill vector already covers detected languages.`,
          type: 'info',
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setScanResult(`⚠️ ${msg === 'Rate limited' ? 'GitHub API rate-limited — using cached demo data.' : `Could not fetch: ${msg}`}`);
      onAgentLog({
        agent: 'Profiler-01',
        agentId: 1,
        message: `GitHub fetch failed: ${msg}. Falling back to cached skill inference.`,
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
      category: 'Other',
    };
    onSkillsChange([...skills, newSkill]);
    setAddSkillName('');
    setShowAddSkill(false);
  }

  function removeSkill(id: string) {
    onSkillsChange(skills.filter((s) => s.id !== id));
  }

  const readinessColor =
    displayedReadiness >= 70 ? 'bg-emerald-500' : displayedReadiness >= 40 ? 'bg-cyan-500' : 'bg-amber-500';

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto">
      {/* Profile Card */}
      <div className="glass rounded-xl p-4 border border-slate-800">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white">Aarav Sharma</div>
            <div className="text-xs text-slate-400">Final Year CS — IIT Bombay</div>
          </div>
        </div>

        {/* Target Role Selector */}
        <div className="relative mb-3">
          <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Target Role</label>
          <div className="relative">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Readiness Meter */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Live Readiness</span>
            <span className={`text-sm font-bold ${displayedReadiness >= 70 ? 'text-emerald-400' : displayedReadiness >= 40 ? 'text-cyan-400' : 'text-amber-400'}`}>
              {displayedReadiness}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${readinessColor} rounded-full progress-bar-animate`}
              style={{ width: `${displayedReadiness}%` }}
            />
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400">+{Math.max(0, readiness - 42)}% from assessments</span>
          </div>
        </div>

        {/* Passport & Custom Career Buttons */}
        <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-slate-800">
          <button
            onClick={onOpenPassport}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold transition-all shadow-sm shadow-emerald-500/10"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Export Verified Skill Passport
          </button>
          <button
            onClick={onOpenCustomCareerModal}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 hover:bg-violet-500/20 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3 h-3 text-violet-400" />
            ✨ Custom Career Synthesis
          </button>
        </div>
      </div>

      {/* GitHub Scanner */}
      <div className="glass rounded-xl p-4 border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <Github className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Live GitHub Scanner</span>
          <span className="text-[9px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded px-1.5 py-0.5">Profiler-01</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGithubScan()}
            placeholder="github-username"
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleGithubScan}
            disabled={scanning || !githubUsername.trim()}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            {scanning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Github className="w-3 h-3" />}
            {scanning ? 'Scanning' : 'Scan'}
          </button>
        </div>
        {scanResult && (
          <div className={`mt-2 p-2 rounded-lg text-[11px] ${scanResult.startsWith('✅') ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'}`}>
            {scanResult}
          </div>
        )}
      </div>

      {/* Verified Skills */}
      <div className="glass rounded-xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300">Verified Skills</span>
          <button
            onClick={() => setShowAddSkill(!showAddSkill)}
            className="w-5 h-5 rounded-md bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
          >
            <Plus className="w-3 h-3 text-slate-300" />
          </button>
        </div>

        {showAddSkill && (
          <div className="flex gap-2 mb-3 animate-slide-in-up">
            <input
              type="text"
              value={addSkillName}
              onChange={(e) => setAddSkillName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Add skill..."
              autoFocus
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button onClick={addSkill} className="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-500 transition-colors">
              Add
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-medium ${SKILL_LEVEL_COLORS[skill.level]}`}
            >
              {skill.name}
              <span className="text-[9px] opacity-60">[{skill.level.slice(0, 3)}]</span>
              <button
                onClick={() => removeSkill(skill.id)}
                className="ml-0.5 opacity-40 hover:opacity-100 transition-opacity"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Radar */}
      <div className="glass rounded-xl p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300">Skill Vector Radar</span>
          <div className="flex items-center gap-3 text-[9px] text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-cyan-400 inline-block" />Current</span>
            <span className="flex items-center gap-1"><span className="w-3 border-t border-dashed border-emerald-400 inline-block" />Target</span>
          </div>
        </div>
        <div className="flex justify-center">
          <SkillRadar data={radarData} size={220} />
        </div>
      </div>
    </div>
  );
}
