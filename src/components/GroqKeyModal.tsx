// src/components/GroqKeyModal.tsx — Groq API Key Configuration Modal
import { useState } from 'react';
import { Key, X, Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';

interface GroqKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  groqKey: string;
  onSaveKey: (key: string) => void;
}

export function GroqKeyModal({ isOpen, onClose, groqKey, onSaveKey }: GroqKeyModalProps) {
  const [keyInput, setKeyInput] = useState(groqKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  function handleSave() {
    onSaveKey(keyInput);
    onClose();
  }

  function handleClear() {
    setKeyInput('');
    onSaveKey('');
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[#E6E4DD] p-6 sm:p-7 w-full max-w-md shadow-2xl animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-[#E6E4DD] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#EA580C]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#18181B]">Groq LPU Configuration</h2>
              <p className="text-xs text-zinc-500">Autonomous 4-Agent Mesh Acceleration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-[#FAF8F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0F766E] flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Pre-Configured Demo Key Active:</strong> A secure runtime key is already active for judges with zero setup. You can also plug in your own custom personal Groq key below.
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
              Groq API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Paste your personal Groq key..."
                className="w-full bg-[#FAF8F5] border border-[#E6E4DD] rounded-xl px-3.5 py-2.5 text-xs text-[#18181B] font-mono focus:bg-white focus:outline-none focus:border-[#EA580C] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Target Model: <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">openai/gpt-oss-120b</code> on Groq LPU</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 mt-6 pt-4 border-t border-[#E6E4DD]">
          <button
            onClick={handleClear}
            className="px-3.5 py-2.5 rounded-xl border border-[#E6E4DD] text-zinc-600 hover:text-zinc-900 hover:bg-[#FAF8F5] text-xs font-semibold transition-colors"
          >
            Clear Key
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold transition-all shadow-md shadow-[#EA580C]/20"
          >
            Save & Activate Mesh
          </button>
        </div>
      </div>
    </div>
  );
}
