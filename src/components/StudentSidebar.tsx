// src/components/StudentSidebar.tsx — Left Navigation Sidebar for Student Portal
import {
  User,
  Compass,
  Zap,
  Bot,
  Building2,
  Key,
  LogOut,
  Award,
} from 'lucide-react';
import type { StudentTab, UserProfile } from '../types';

interface StudentSidebarProps {
  user: UserProfile;
  activeTab: StudentTab;
  onTabChange: (tab: StudentTab) => void;
  readiness: number;
  targetRoleTitle: string;
  onSwitchToOrg: () => void;
  onOpenGroqKeyModal: () => void;
  onOpenPassport: () => void;
  onLogout: () => void;
}

export function StudentSidebar({
  user,
  activeTab,
  onTabChange,
  readiness,
  targetRoleTitle,
  onSwitchToOrg,
  onOpenGroqKeyModal,
  onOpenPassport,
  onLogout,
}: StudentSidebarProps) {
  const NAV_ITEMS: { id: StudentTab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'profile',
      label: 'Profile & Skills',
      icon: <User className="w-4 h-4" />,
      desc: 'Competency vector & GitHub scan',
    },
    {
      id: 'roadmap',
      label: 'Adaptive Roadmap',
      icon: <Compass className="w-4 h-4" />,
      desc: 'Topological Skill-DAG graph',
    },
    {
      id: 'studio',
      label: 'Learning Studio',
      icon: <Zap className="w-4 h-4" />,
      desc: 'Brain-Diff & AI assessment',
    },
    {
      id: 'agents',
      label: 'Multi-Agent War Room',
      icon: <Bot className="w-4 h-4" />,
      desc: 'Groq LPU pipeline & mentor',
    },
  ];

  return (
    <div className="w-64 bg-[#F3F1EC] border-r border-[#E6E4DD] flex flex-col justify-between h-full p-4 flex-shrink-0 select-none">
      {/* Top Brand & Learner Card */}
      <div className="space-y-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-xl bg-[#EA580C] text-white flex items-center justify-center font-bold shadow-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-[#18181B]">SkillMorph AI</div>
            <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
              Career Autopilot
            </div>
          </div>
        </div>

        {/* Learner Summary Card */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E6E4DD] shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-[#18181B] truncate">{user.name}</div>
              <div className="text-[10px] text-zinc-500 truncate">{user.institution}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E6E4DD] space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-zinc-600 truncate max-w-[120px]">{targetRoleTitle}</span>
              <span className="font-mono font-bold text-[#0F766E]">{readiness}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E6E4DD]">
              <div
                className="h-full bg-gradient-to-r from-[#EA580C] to-[#0F766E] rounded-full transition-all duration-500"
                style={{ width: `${readiness}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-white text-[#EA580C] font-bold shadow-xs border border-[#E6E4DD]'
                    : 'text-zinc-600 hover:text-[#18181B] hover:bg-white/60 font-medium'
                }`}
              >
                <div className={isActive ? 'text-[#EA580C]' : 'text-zinc-500'}>{item.icon}</div>
                <div className="min-w-0">
                  <div className="text-xs leading-none">{item.label}</div>
                  <div className="text-[10px] text-zinc-400 mt-1 truncate">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Administrative & Session Controls */}
      <div className="space-y-1.5 pt-4 border-t border-[#E6E4DD]">
        {/* Export Skill Passport button */}
        <button
          onClick={onOpenPassport}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0F766E] hover:bg-[#F0FDFA] transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>Export Skill Passport</span>
        </button>

        {/* Switch to Institution Portal (for judges) */}
        <button
          onClick={onSwitchToOrg}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:bg-white transition-colors"
        >
          <Building2 className="w-4 h-4 text-[#0F766E]" />
          <span>Institution Portal (Deans)</span>
        </button>

        {/* Groq Settings */}
        <button
          onClick={onOpenGroqKeyModal}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-white transition-colors"
        >
          <Key className="w-4 h-4 text-zinc-400" />
          <span>Groq LPU Settings</span>
        </button>

        {/* Sign Out / Switch Account */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-red-600 hover:bg-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out / Switch Portal</span>
        </button>
      </div>
    </div>
  );
}
