// src/components/OrgView.tsx — Warm Editorial Enterprise University & Talent Cloud
import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Check,
  Building2,
  GraduationCap,
  Search,
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
  if (sortKey !== col) return <ChevronDown className="w-3.5 h-3.5 opacity-30" />;
  return sortAsc ? (
    <ChevronUp className="w-3.5 h-3.5 text-[#EA580C]" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 text-[#EA580C]" />
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
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Executive Command Header */}
      <div className="bg-white rounded-3xl border border-[#E6E4DD] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-bold text-[#0F766E] bg-[#F0FDFA] border border-[#99F6E4] rounded-md px-2.5 py-0.5">
              Placement Dean & Talent Analytics Console
            </span>
            <span className="text-xs text-zinc-400">· Academic Year 2026-2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight">
            Institutional Skill Intelligence & Placement Command
          </h1>
          <p className="text-sm text-zinc-500 mt-1 max-w-3xl">
            Real-time cohort skill-gap telemetry, automated curriculum intervention deployment, and cryptographic verification for university placement cells and hiring partners.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {onSwitchToStudent && (
            <button
              onClick={onSwitchToStudent}
              className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3F1EC] border border-[#E6E4DD] text-xs font-bold text-zinc-700 flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4 text-[#EA580C]" />
              <span>Switch to Student View</span>
            </button>
          )}

          <button
            onClick={() => handleDeployBridge('Aarav Sharma')}
            disabled={deployed}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm whitespace-nowrap ${
              deployed
                ? 'bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4]'
                : 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-md shadow-[#EA580C]/20'
            }`}
          >
            {deployed ? (
              <>
                <Check className="w-4 h-4 text-[#0F766E]" />
                <span>Intervention Deployed to Aarav&apos;s Active Path!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white" />
                <span>⚡ Push Personalized Curriculum to Aarav</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Top KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl border border-[#E6E4DD] p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>Cohort Enrolled</span>
            <Building2 className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#18181B] font-mono">{totalLearners}</div>
          <div className="text-xs text-[#0F766E] font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>98.2% Active on Skill-DAG</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl border border-[#E6E4DD] p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>Average Readiness</span>
            <Sparkles className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-[#0F766E] font-mono">{avgReadiness}%</div>
          <div className="text-xs text-[#0F766E] font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% since polyglot sprints</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl border border-[#E6E4DD] p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>Primary Bottleneck</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-amber-900 leading-snug line-clamp-2">
            Async JS & Promises
          </div>
          <div className="text-xs text-zinc-500">
            68% of cohort trigger rescue routing
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl border border-[#E6E4DD] p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
            <span>Faculty Time Saved</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600 font-mono">{hoursSaved}</div>
          <div className="text-xs text-zinc-500">Autonomous Socratic mentoring</div>
        </div>
      </div>

      {/* Track Readiness Distribution & Department Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Track Readiness Distribution */}
        <div className="bg-white rounded-3xl border border-[#E6E4DD] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#18181B]">Track Readiness Distribution</h2>
              <p className="text-xs text-zinc-500">Live readiness benchmarks across target industry roles</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E6E4DD] text-zinc-600">
              3 Active Tracks
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              { track: 'Full Stack Web Developer', readiness: 48, students: 142, color: 'bg-[#EA580C]' },
              { track: 'AI/ML Systems Engineer', readiness: 71, students: 110, color: 'bg-indigo-600' },
              { track: 'Cloud Backend Architect', readiness: 59, students: 90, color: 'bg-[#0F766E]' },
            ].map((t) => (
              <div key={t.track} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-800">{t.track}</span>
                  <span className="font-mono text-zinc-500">
                    <strong className="text-zinc-900">{t.readiness}%</strong> avg readiness ({t.students} students)
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#FAF8F5] border border-[#E6E4DD] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${t.color} rounded-full transition-all duration-500`}
                    style={{ width: `${t.readiness}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E4DD] text-xs text-zinc-600 leading-relaxed mt-2">
            <strong>Key Dean Finding:</strong> {bottleneck}. Triggering batch polyglot transfer modules reduces remedial latency from 3 weeks to 90 seconds.
          </div>
        </div>

        {/* Department Skill-Gap Heatmap */}
        <div className="bg-white rounded-3xl border border-[#E6E4DD] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#18181B]">Department Skill-Gap Heatmap</h2>
              <p className="text-xs text-zinc-500">Competency saturation by engineering branch</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E6E4DD] text-zinc-600">
              AST Scanned
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            {[
              { dept: 'Computer Science (CS)', gap: 'Modern Reactive UI & SSR', score: '78% Ready', level: 'High' },
              { dept: 'Information Tech (IT)', gap: 'System Concurrency & Async', score: '62% Ready', level: 'Medium' },
              { dept: 'Data Science & AI', gap: 'Production Microservice APIs', score: '72% Ready', level: 'High' },
              { dept: 'Electronics (ECE)', gap: 'Web Backend & DB Indexing', score: '44% Ready', level: 'Remedial' },
            ].map((d) => (
              <div key={d.dept} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E6E4DD] space-y-1">
                <div className="font-bold text-zinc-800">{d.dept}</div>
                <div className="text-zinc-500 text-[11px]">Gap: {d.gap}</div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-bold text-[#0F766E]">{d.score}</span>
                  <span className="text-[10px] font-semibold text-zinc-400">[{d.level}]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cohort Student Directory & Intervention Trigger */}
      <div className="bg-white rounded-3xl border border-[#E6E4DD] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E4DD] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#18181B]">Cohort Student Roster & Live Interventions</h2>
            <p className="text-xs text-zinc-500">Sort by readiness, inspect skill gaps, and deploy targeted bridges</p>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or branch..."
                className="pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-xs text-zinc-800 focus:bg-white focus:outline-none"
              />
            </div>
            <select
              value={filterTrack}
              onChange={(e) => setFilterTrack(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl text-xs font-semibold text-zinc-700"
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
              <tr className="border-b border-[#E6E4DD] text-zinc-400 uppercase tracking-wider text-[10px]">
                <th onClick={() => toggleSort('name')} className="pb-3 cursor-pointer hover:text-zinc-700">
                  <div className="flex items-center gap-1">Student & Branch <SortIcon col="name" sortKey={sortKey} sortAsc={sortAsc} /></div>
                </th>
                <th className="pb-3">Verified Skills</th>
                <th className="pb-3">Critical Skill Gaps</th>
                <th onClick={() => toggleSort('readiness')} className="pb-3 cursor-pointer hover:text-zinc-700">
                  <div className="flex items-center gap-1">Readiness <SortIcon col="readiness" sortKey={sortKey} sortAsc={sortAsc} /></div>
                </th>
                <th className="pb-3 text-right">Dean Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E4DD]">
              {sorted.map((st) => (
                <tr key={st.id} className="hover:bg-[#FAF8F5] transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-[#18181B] text-sm">{st.name}</div>
                    <div className="text-[11px] text-zinc-500">{st.dept}</div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {st.verifiedSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#F0FDFA] text-[#0F766E] border border-[#99F6E4] text-[10px] font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-wrap gap-1">
                      {st.missingSkills.map((gap, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-orange-50 text-[#EA580C] border border-orange-200 text-[10px] font-medium"
                        >
                          {gap}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="font-mono font-bold text-sm text-[#0F766E]">{st.readiness}%</div>
                    <div className="h-1.5 w-16 bg-[#E6E4DD] rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#0F766E] rounded-full"
                        style={{ width: `${st.readiness}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => handleDeployBridge(st.name)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F3F1EC] border border-[#E6E4DD] text-xs font-bold text-zinc-800 hover:text-[#EA580C] transition-colors"
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
