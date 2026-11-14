// src/components/GroqKeyModal.tsx — Groq API Key Configuration Modal (Daylight Minimalist)
import { useState } from 'react';
import { Key, X, Eye, EyeOff, Cpu, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-zinc-200/90 p-6 sm:p-7 w-full max-w-md shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-xs">
              <Key className="w-5 h-5 text-zinc-900" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Groq LPU Configuration</h2>
              <p className="text-xs text-zinc-500">Autonomous 4-Agent Mesh Acceleration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Pre-Configured Demo Key Active:</strong> A secure runtime key is already active for judges with zero setup. You can also plug in your own custom personal Groq key below.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
              Groq API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Paste your personal Groq key..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3.5 py-2.5 text-xs text-zinc-900 font-mono focus:bg-white focus:outline-none focus:border-zinc-900 pr-10"
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

          <div className="text-xs text-zinc-500 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-700" />
            <span>Target Model: <code className="bg-zinc-100 px-1 py-0.5 rounded font-mono text-zinc-800">openai/gpt-oss-120b</code> on Groq LPU</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5 mt-6 pt-4 border-t border-zinc-200">
          <button
            onClick={handleClear}
            className="px-4 py-2.5 rounded-lg border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 text-xs font-semibold transition-colors"
          >
            Clear Key
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            Save & Activate Mesh
          </button>
        </div>
      </div>
    </div>
  );
}
