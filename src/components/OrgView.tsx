// src/components/OrgView.tsx — Apple / Fluent Executive University & Talent Cloud
import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';
import { COHORT_STUDENTS } from '../data/scenarios';
import type { CohortStudent } from '../types';

interface OrgViewProps {
  onDeployCohortBridge?: () => void;
}

export function OrgView({ onDeployCohortBridge }: OrgViewProps) {
  const [sortKey, setSortKey] = useState<keyof CohortStudent>('readiness');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [deployed, setDeployed] = useState(false);

  const totalLearners = 342;
  const avgReadiness = 64;
  const bottleneck = '68% of Full Stack aspirants fail Async JS / Node.js concurrency';
  const hoursSaved = '4,820 hrs';

  const sorted = [...COHORT_STUDENTS].sort((a, b) => {
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

  function handleDeployBridge() {
    setDeployed(true);
    if (onDeployCohortBridge) {
      onDeployCohortBridge();
    }
  }

  function SortIcon({ col }: { col: keyof CohortStudent }) {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-blue-600" /> : <ChevronDown className="w-3 h-3 text-blue-600" />;
  }

  return (
    <div className="max-w-[1720px] mx-auto space-y-6 pb-12">
      {/* Executive Command Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md px-2.5 py-0.5">
              Placement Dean & Talent Analytics Console
            </span>
            <span className="text-xs text-slate-400">· Academic Year 2026-2027</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Skill Intelligence & Placement Command
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Real-time cohort skill-gap telemetry, automated curriculum intervention deployment, and cryptographic verification for university placement cells and hiring partners.
          </p>
        </div>

        {/* Live Closed-Loop Intervention Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeployBridge}
            disabled={deployed}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              deployed
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
            }`}
          >
            {deployed ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Intervention Deployed to Aarav&apos;s Active Path!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white" />
                <span>⚡ Deploy Cohort Bridge Module to Aarav&apos;s Path</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Total Active Enrollees
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalLearners}</div>
          <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +12 new learners this week
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Cohort Job-Readiness
          </div>
          <div className="text-3xl font-extrabold text-blue-600">{avgReadiness}%</div>
          <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${avgReadiness}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm bg-amber-50/20">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Primary Bottleneck Alert
          </div>
          <div className="text-xs text-amber-950 font-bold leading-tight mt-1">{bottleneck}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-2">
            Auto-remedy: Python asyncio analogy
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" /> Polyglot Efficiency
          </div>
          <div className="text-3xl font-extrabold text-indigo-600">{hoursSaved}</div>
          <div className="text-xs text-slate-500 font-medium mt-2">Saved vs. conventional tutorial hell</div>
        </div>
      </div>

      {/* Department & Track Breakdown Progress Bars */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Department & Track Readiness Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-800">Full Stack Engineering Track</span>
              <span className="text-blue-600 font-bold">68% Avg Readiness</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '68%' }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">184 active aspirants · 128 verified</div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-800">AI/ML Systems Track</span>
              <span className="text-indigo-600 font-bold">62% Avg Readiness</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '62%' }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">96 active aspirants · 59 verified</div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-800">Cloud & DevOps Track</span>
              <span className="text-emerald-600 font-bold">54% Avg Readiness</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '54%' }} />
            </div>
            <div className="text-[11px] text-slate-500 mt-1">62 active aspirants · 33 verified</div>
          </div>
        </div>
      </div>

      {/* Cohort Skill Gap Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between flex-wrap gap-2 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Live Cohort Skill Gap Matrix</h2>
            <p className="text-xs text-slate-500">
              Interactive telemetry of enrolled students, certified AST proofs, and automated AI interventions
            </p>
          </div>
          <div className="text-xs text-slate-400">Click any candidate row to view detailed skill breakdown</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                {[
                  { key: 'name' as keyof CohortStudent, label: 'Student' },
                  { key: 'dept' as keyof CohortStudent, label: 'Enrolled Track' },
                  { key: 'verifiedSkills' as keyof CohortStudent, label: 'Verified Skills' },
                  { key: 'missingSkills' as keyof CohortStudent, label: 'Identified Skill Gaps' },
                  { key: 'assessmentVelocity' as keyof CohortStudent, label: 'Velocity' },
                  { key: 'readiness' as keyof CohortStudent, label: 'Placement Readiness' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="px-6 py-3.5 cursor-pointer hover:text-slate-900 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((student) => (
                <>
                  <tr
                    key={student.id}
                    onClick={() => setExpandedRow(expandedRow === student.id ? null : student.id)}
                    className={`cursor-pointer transition-colors ${
                      expandedRow === student.id ? 'bg-blue-50/40' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-[10px] text-slate-400">ID: {student.id.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{student.dept}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.verifiedSkills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                        {student.verifiedSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{student.verifiedSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.missingSkills.slice(0, 2).map((s) => (
                          <span
                            key={s}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-200 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                        {student.missingSkills.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-medium">
                            +{student.missingSkills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {student.assessmentVelocity.toFixed(1)}/5
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.readiness >= 70
                                ? 'bg-emerald-600'
                                : student.readiness >= 50
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${student.readiness}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900">{student.readiness}%</span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Detail View */}
                  {expandedRow === student.id && (
                    <tr key={`${student.id}-expanded`} className="bg-slate-50/70">
                      <td colSpan={6} className="px-8 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Certified Skills Portfolio
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {student.verifiedSkills.map((s) => (
                                <span
                                  key={s}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-semibold"
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
                            <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" /> AI Recommended Curriculum Action
                            </div>
                            <div className="text-xs text-slate-700 font-medium leading-relaxed">
                              {student.aiIntervention}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
