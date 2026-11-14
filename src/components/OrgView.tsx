// src/components/OrgView.tsx — Precision Enterprise University & Talent Cloud
import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Check,
  Building2,
  GraduationCap,
  Search,
  Zap,
} from 'lucide-react';
import { COHORT_STUDENTS } from '../data/scenarios';
import type { CohortStudent } from '../types';

interface OrgViewProps {
  onDeployCohortBridge?: () => void;
  onSwitchToStudent?: () => void;
}

function SortIcon({
  col,
  sortKey,
  sortAsc,
}: {
  col: keyof CohortStudent;
  sortKey: keyof CohortStudent;
  sortAsc: boolean;
}) {
  if (sortKey !== col) return <ChevronDown size={13} className="opacity-30" />;
  return sortAsc ? (
    <ChevronUp size={13} className="text-zinc-900" />
  ) : (
    <ChevronDown size={13} className="text-zinc-900" />
  );
}

export function OrgView({ onDeployCohortBridge, onSwitchToStudent }: OrgViewProps) {
  const [sortKey, setSortKey] = useState<keyof CohortStudent>('readiness');
  const [sortAsc, setSortAsc] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalLearners = 342;
  const avgReadiness = 64;
  const bottleneck = '68% of Full Stack aspirants fail Async JS / Node.js concurrency';
  const hoursSaved = '4,820 hrs';

  const filtered = COHORT_STUDENTS.filter((st) => {
    const matchesSearch =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack =
      filterTrack === 'all' ||
      (filterTrack === 'high' && st.readiness >= 70) ||
      (filterTrack === 'remedial' && st.readiness < 60);
    return matchesSearch && matchesTrack;
  });

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') return sortAsc ? av - bv : bv - av;
    if (typeof av === 'string' && typeof bv === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    if (Array.isArray(av) && Array.isArray(bv)) return sortAsc ? av.length - bv.length : bv.length - av.length;
    return 0;
  });

  function toggleSort(key: keyof CohortStudent) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  function handleDeployBridge(studentName = 'Aarav Sharma') {
    setDeployed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cohort_bridge_deployed', 'true');
      localStorage.setItem('cohort_bridge_target', studentName);
    }
    if (onDeployCohortBridge) {
      onDeployCohortBridge();
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16">
      {/* Executive Command Header */}
      <div className="bg-white rounded-xl border border-zinc-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700">
              Placement Dean & Talent Analytics Console
            </span>
            <span className="text-xs text-zinc-400 font-mono">AY 2026-2027</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Institutional Skill Intelligence & Placement Command
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-3xl leading-relaxed">
            Real-time cohort skill-gap telemetry, automated curriculum intervention deployment, and cryptographic verification for university placement cells and hiring partners.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full md:w-auto">
          {onSwitchToStudent && (
            <button
              onClick={onSwitchToStudent}
              className="px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-xs font-medium text-zinc-800 flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <GraduationCap size={14} strokeWidth={1.75} />
              <span>Student View</span>
            </button>
          )}

          <button
            onClick={() => handleDeployBridge('Aarav Sharma')}
            disabled={deployed}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              deployed
                ? 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
            }`}
          >
            {deployed ? (
              <>
                <Check size={14} strokeWidth={1.75} className="text-emerald-600" />
                <span>Intervention Deployed to Aarav</span>
              </>
            ) : (
              <>
                <Zap size={14} strokeWidth={1.75} />
                <span>Deploy Personalized Module to Aarav</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Top KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Cohort Enrolled</span>
            <Building2 size={14} strokeWidth={1.75} className="text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{totalLearners}</div>
          <div className="text-[11px] text-zinc-600 font-medium flex items-center gap-1">
            <TrendingUp size={12} strokeWidth={1.75} className="text-emerald-600" />
            <span>98.2% Active on Skill-DAG</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Average Readiness</span>
            <Sparkles size={14} strokeWidth={1.75} className="text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{avgReadiness}%</div>
          <div className="text-[11px] text-zinc-600 font-medium flex items-center gap-1">
            <TrendingUp size={12} strokeWidth={1.75} className="text-emerald-600" />
            <span>+14% since polyglot sprints</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Primary Bottleneck</span>
            <AlertTriangle size={14} strokeWidth={1.75} className="text-amber-600" />
          </div>
          <div className="text-xs font-semibold text-zinc-900 leading-tight">
            Async JS & Promises
          </div>
          <div className="text-[11px] text-zinc-500">
            68% of cohort trigger rescue routing
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
            <span>Faculty Time Saved</span>
            <Clock size={14} strokeWidth={1.75} className="text-zinc-400" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{hoursSaved}</div>
          <div className="text-[11px] text-zinc-500">Autonomous Socratic mentoring</div>
        </div>
      </div>

      {/* Track Readiness Distribution & Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Track Readiness Distribution */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Track Readiness Distribution</h2>
              <p className="text-xs text-zinc-500">Live readiness benchmarks across target industry roles</p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-600">
              3 Active Tracks
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { track: 'Full Stack Web Developer', readiness: 48, students: 142 },
              { track: 'AI/ML Systems Engineer', readiness: 71, students: 110 },
              { track: 'Cloud Backend Architect', readiness: 59, students: 90 },
            ].map((t) => (
              <div key={t.track} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-zinc-800">{t.track}</span>
                  <span className="font-mono text-zinc-500">
                    <strong className="text-zinc-900">{t.readiness}%</strong> ({t.students} students)
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-zinc-900 rounded-full transition-all duration-300"
                    style={{ width: `${t.readiness}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-md bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 leading-relaxed mt-2">
            <strong>Key Dean Finding:</strong> {bottleneck}. Triggering batch polyglot transfer modules reduces remedial latency from 3 weeks to 90 seconds.
          </div>
        </div>

        {/* Department Skill-Gap Heatmap */}
        <div className="bg-white rounded-xl border border-zinc-200/90 p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Department Skill-Gap Heatmap</h2>
              <p className="text-xs text-zinc-500">Competency saturation by engineering branch</p>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-600">
              AST Scanned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs">
            {[
              { dept: 'Computer Science (CS)', gap: 'Modern Reactive UI & SSR', score: '78% Ready', level: 'High' },
              { dept: 'Information Tech (IT)', gap: 'System Concurrency & Async', score: '62% Ready', level: 'Medium' },
              { dept: 'Data Science & AI', gap: 'Production Microservice APIs', score: '72% Ready', level: 'High' },
              { dept: 'Electronics (ECE)', gap: 'Web Backend & DB Indexing', score: '44% Ready', level: 'Remedial' },
            ].map((d) => (
              <div key={d.dept} className="p-3 rounded-md bg-zinc-50 border border-zinc-200 space-y-0.5">
                <div className="font-semibold text-zinc-900">{d.dept}</div>
                <div className="text-zinc-500 text-[11px]">Gap: {d.gap}</div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-semibold text-zinc-900">{d.score}</span>
                  <span className="text-[10px] text-zinc-400">[{d.level}]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Student Directory & Intervention Trigger */}
      <div className="bg-white rounded-xl border border-zinc-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Cohort Student Roster & Live Interventions</h2>
            <p className="text-xs text-zinc-500">Sort by readiness, inspect skill gaps, and deploy targeted bridges</p>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search size={13} strokeWidth={1.75} className="text-zinc-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or branch..."
                className="pl-7 pr-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs text-zinc-900 focus:bg-white focus:outline-none"
              />
            </div>
            <select
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-md text-xs font-medium text-zinc-700"
            >
              <option value="all">All Cohort</option>
              <option value="high">Readiness &ge; 70%</option>
              <option value="remedial">Readiness &lt; 60%</option>
            </select>
          </div>
        </div>

        {/* Student Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-400 uppercase tracking-wider text-[10px]">
                <th onClick={() => toggleSort('name')} className="pb-2.5 cursor-pointer hover:text-zinc-700">
                  <div className="flex items-center gap-1">Student & Branch <SortIcon col="name" sortKey={sortKey} sortAsc={sortAsc} /></div>
                </th>
                <th className="pb-2.5">Verified Skills</th>
                <th className="pb-2.5">Critical Skill Gaps</th>
                <th onClick={() => toggleSort('readiness')} className="pb-2.5 cursor-pointer hover:text-zinc-700">
                  <div className="flex items-center gap-1">Readiness <SortIcon col="readiness" sortKey={sortKey} sortAsc={sortAsc} /></div>
                </th>
                <th className="pb-2.5 text-right">Dean Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {sorted.map((st) => (
                <tr key={st.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-semibold text-zinc-900 text-xs">{st.name}</div>
                    <div className="text-[11px] text-zinc-500">{st.dept}</div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {st.verifiedSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 text-[10px]"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {st.missingSkills.map((gap, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 text-[10px]"
                        >
                          {gap}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-mono font-semibold text-xs text-zinc-900">{st.readiness}%</div>
                    <div className="h-1 w-14 bg-zinc-200 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-zinc-900 rounded-full"
                        style={{ width: `${st.readiness}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDeployBridge(st.name)}
                      className="px-2.5 py-1 rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-800 transition-colors shadow-xs"
                    >
                      Push Bridge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
