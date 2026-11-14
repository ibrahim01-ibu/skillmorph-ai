// src/components/OrgView.tsx — University & Organization Skill Intelligence View
import { useState } from 'react';
import { Users, TrendingUp, AlertTriangle, CheckCircle2, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { COHORT_STUDENTS } from '../data/scenarios';
import type { CohortStudent } from '../types';

export function OrgView() {
  const [sortKey, setSortKey] = useState<keyof CohortStudent>('readiness');
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const totalLearners = 342;
  const avgReadiness = 64;
  const bottleneck = '68% of Full Stack aspirants fail Async JS / Node.js concurrency';
  const intervention = 'Auto-deploying Python-to-JS Bridge Modules';

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
    else { setSortKey(key); setSortAsc(false); }
  }

  function SortIcon({ col }: { col: keyof CohortStudent }) {
    if (sortKey !== col) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortAsc ? <ChevronUp className="w-3 h-3 text-cyan-400" /> : <ChevronDown className="w-3 h-3 text-cyan-400" />;
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="glass rounded-xl p-4 border border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-white">University & Org Skill Intelligence</h2>
          <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-0.5">Placement Cell Command View</span>
        </div>
        <p className="text-xs text-slate-400">Macro cohort analytics for placement officers and engineering managers</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Total Active Learners</div>
          <div className="text-3xl font-bold text-white">{totalLearners}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +12 this week
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Cohort Job-Readiness</div>
          <div className="text-3xl font-bold text-cyan-400">{avgReadiness}%</div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${avgReadiness}%` }} />
          </div>
        </div>

        <div className="glass rounded-xl p-4 border border-amber-500/20 neon-amber">
          <div className="text-[10px] text-amber-500 uppercase tracking-wider mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Critical Bottleneck
          </div>
          <div className="text-xs text-amber-200 font-medium leading-tight">{bottleneck}</div>
          <div className="text-[10px] text-emerald-400 mt-2">🤖 {intervention}</div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="glass rounded-xl p-4 border border-violet-500/20 bg-violet-500/5">
        <div className="flex items-start gap-3">
          <Zap className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-violet-300 mb-1">GapArchitect-02 Insight</div>
            <p className="text-xs text-slate-300">
              <strong>Root cause identified:</strong> Students transitioning from Python to Node.js struggle with the event loop mental model (single-threaded async vs Python's multi-threaded model).
              Recommended: inject Python-asyncio-to-JS-Promises bridge module for all Full Stack track students at the JavaScript ES6+ node.
              Projected readiness uplift: <strong className="text-emerald-400">+18% cohort average</strong> over 2 weeks.
            </p>
          </div>
        </div>
      </div>

      {/* Cohort Skill Gap Matrix */}
      <div className="glass rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-300">Interactive Cohort Skill Gap Matrix</div>
          <div className="text-[10px] text-slate-500">{COHORT_STUDENTS.length} students shown · Click row to expand</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50">
                {[
                  { key: 'name' as keyof CohortStudent, label: 'Student' },
                  { key: 'dept' as keyof CohortStudent, label: 'Track' },
                  { key: 'verifiedSkills' as keyof CohortStudent, label: 'Verified Skills' },
                  { key: 'missingSkills' as keyof CohortStudent, label: 'Missing Skills' },
                  { key: 'assessmentVelocity' as keyof CohortStudent, label: 'Velocity' },
                  { key: 'readiness' as keyof CohortStudent, label: 'Readiness' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 select-none"
                    onClick={() => toggleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((student) => (
                <>
                  <tr
                    key={student.id}
                    onClick={() => setExpandedRow(expandedRow === student.id ? null : student.id)}
                    className={`border-b border-slate-800/50 cursor-pointer transition-colors ${expandedRow === student.id ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'}`}
                  >
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-white">{student.name}</div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[10px] text-slate-400">{student.dept}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {student.verifiedSkills.slice(0, 3).map((s) => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                            {s}
                          </span>
                        ))}
                        {student.verifiedSkills.length > 3 && (
                          <span className="text-[9px] text-slate-500">+{student.verifiedSkills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {student.missingSkills.slice(0, 2).map((s) => (
                          <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-300 border border-red-500/20">
                            {s}
                          </span>
                        ))}
                        {student.missingSkills.length > 2 && (
                          <span className="text-[9px] text-slate-500">+{student.missingSkills.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-3 rounded-sm ${i < Math.round(student.assessmentVelocity) ? 'bg-cyan-500' : 'bg-slate-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400">{student.assessmentVelocity.toFixed(1)}/5</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${student.readiness >= 70 ? 'bg-emerald-500' : student.readiness >= 50 ? 'bg-cyan-500' : 'bg-amber-500'}`}
                            style={{ width: `${student.readiness}%` }}
                          />
                        </div>
                        <span className={`text-[11px] font-semibold ${student.readiness >= 70 ? 'text-emerald-400' : student.readiness >= 50 ? 'text-cyan-400' : 'text-amber-400'}`}>
                          {student.readiness}%
                        </span>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === student.id && (
                    <tr key={`${student.id}-expanded`} className="bg-slate-800/20">
                      <td colSpan={6} className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">All Verified Skills</div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {student.verifiedSkills.map((s) => (
                                <span key={s} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> {s}
                                </span>
                              ))}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Missing Skills (Gap)</div>
                            <div className="flex flex-wrap gap-1">
                              {student.missingSkills.map((s) => (
                                <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-red-500/15 text-red-300 border border-red-500/20">
                                  ✗ {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-2.5 max-w-xs">
                            <div className="text-[10px] text-violet-400 font-semibold mb-1">🤖 AI Recommended Intervention</div>
                            <div className="text-[11px] text-slate-300">{student.aiIntervention}</div>
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
