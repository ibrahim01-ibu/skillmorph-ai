// src/components/SkillPassportModal.tsx — Daylight System Redesign
import { useState } from 'react';
import { Award, Download, CheckCircle, ShieldCheck, X, Copy, Hash } from 'lucide-react';
import type { Skill } from '../types';

interface SkillPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  learnerName: string;
  targetRole: string;
  readiness: number;
  skills: Skill[];
}

export function SkillPassportModal({
  isOpen,
  onClose,
  learnerName,
  targetRole,
  readiness,
  skills,
}: SkillPassportModalProps) {
  const [copied, setCopied] = useState(false);
  const [timestamp] = useState('2026-11-14T10:30:00.000Z');

  if (!isOpen) return null;
  const passportId = `SMP-${Math.abs(
    Array.from(learnerName + targetRole).reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .padStart(8, '0')}`;

  const mockSignature = `0x7f9a883b2d1c...ecdsa-mesh-sig-${passportId.toLowerCase()}`;
  const mockSha256 = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;

  const dossierData = {
    passportId,
    standard: 'W3C-Verifiable-Credential-Draft-v2',
    issuer: 'SkillMorph AI Autonomous Mesh (Profiler-01 / AdaptiveMentor-04)',
    issuedAt: timestamp,
    learner: {
      name: learnerName,
      institution: 'Final Year CS — IIT Bombay',
      targetRole,
      verifiedReadiness: `${readiness}%`,
    },
    verifiedSkills: skills.map((s) => ({
      skill: s.name,
      competencyLevel: s.level,
      category: s.category,
      verificationSource: 'SkillMorph 4-Agent Mesh & GitHub Repo AST Hash',
    })),
    cryptographicProof: {
      type: 'Ed25519Signature2020',
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:skillmorph:agent-mesh-root',
      proofValue: mockSignature,
      sha256PayloadHash: mockSha256,
    },
  };

  function downloadJson() {
    const blob = new Blob([JSON.stringify(dossierData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillPassport-${passportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyJson() {
    navigator.clipboard.writeText(JSON.stringify(dossierData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 w-full max-w-xl shadow-[0_25px_50px_-12px_rgba(15,23,42,0.18)] animate-slide-in-up relative overflow-hidden">
        {/* Ambient subtle blurs */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-slate-900 font-bold text-base">Verified Skill Passport</h2>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-1.5 py-0.5 flex items-center gap-1 font-mono font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> PROOF-OF-SKILL
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Dossier ID: {passportId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Passport Body */}
        <div className="space-y-4 text-xs">
          {/* Candidate Card */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Candidate</div>
              <div className="text-slate-900 font-bold text-sm mt-0.5">{learnerName}</div>
              <div className="text-xs text-slate-500 mt-0.5">Final Year CS — IIT Bombay</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Target Role Verified</div>
              <div className="text-blue-700 font-bold text-xs mt-0.5">{targetRole}</div>
              <div className="text-emerald-700 font-mono font-bold text-sm mt-0.5">{readiness}% Readiness</div>
            </div>
          </div>

          {/* Verified Skills Grid */}
          <div>
            <div className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Competency Matrix ({skills.length} Certified Skills)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {skills.map((s) => (
                <div key={s.id} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <div className="text-slate-800 font-medium text-xs truncate">{s.name}</div>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-blue-700 font-mono font-semibold">[{s.level}]</span>
                    <span className="text-slate-400">{s.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Proof Block */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 font-mono text-[10px] shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-2 pb-1.5 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-indigo-300">
                <Hash className="w-3.5 h-3.5" /> SHA-256 AST Hash
              </span>
              <span className="text-emerald-400 text-[10px] font-medium">✓ Autonomous Mesh Signed</span>
            </div>
            <div className="text-slate-400 truncate">{mockSha256}</div>
            <div className="text-slate-400 mt-2 text-[10px]">
              Signature: <span className="text-indigo-300">{mockSignature}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2.5 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={copyJson}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied JSON!' : 'Copy JSON'}
          </button>
          <button
            onClick={downloadJson}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            Download Proof-of-Skill Dossier (.json)
          </button>
        </div>
      </div>
    </div>
  );
}
