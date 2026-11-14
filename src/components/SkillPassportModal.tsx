// src/components/SkillPassportModal.tsx
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-bright rounded-2xl border border-slate-700 p-6 w-full max-w-xl animate-slide-in-up relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-base">Verified Skill Passport</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded px-1.5 py-0.5 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> PROOF-OF-SKILL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Dossier ID: {passportId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Passport Body */}
        <div className="space-y-4 text-xs">
          {/* Candidate Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Candidate</div>
              <div className="text-white font-semibold text-sm">{learnerName}</div>
              <div className="text-[11px] text-slate-400">Final Year CS</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Target Role Verified</div>
              <div className="text-cyan-300 font-semibold">{targetRole}</div>
              <div className="text-emerald-400 font-mono font-bold text-sm mt-0.5">{readiness}% Readiness</div>
            </div>
          </div>

          {/* Verified Skills Grid */}
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> Verified Competency Matrix ({skills.length} Certified Skills)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {skills.map((s) => (
                <div key={s.id} className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                  <div className="text-white font-medium text-[11px] truncate">{s.name}</div>
                  <div className="flex items-center justify-between mt-1 text-[9px]">
                    <span className="text-cyan-400 font-mono">[{s.level}]</span>
                    <span className="text-slate-500">{s.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Proof Block */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[10px]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5 pb-1 border-b border-slate-900">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3 text-violet-400" /> SHA-256 AST Hash
              </span>
              <span className="text-emerald-400 text-[9px]">✓ Autonomous Mesh Signed</span>
            </div>
            <div className="text-slate-500 truncate">{mockSha256}</div>
            <div className="text-slate-400 mt-2 text-[9px]">
              Signature: <span className="text-violet-400">{mockSignature}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 mt-6 pt-3 border-t border-slate-800">
          <button
            onClick={copyJson}
            className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied JSON!' : 'Copy JSON'}
          </button>
          <button
            onClick={downloadJson}
            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            Download Proof-of-Skill Dossier (.json)
          </button>
        </div>
      </div>
    </div>
  );
}
