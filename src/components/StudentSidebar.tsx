// src/components/StudentSidebar.tsx — Apple / Linear / Vercel Geometric Sidebar
import {
  User,
  Compass,
  Code2,
  Bot,
  Building2,
  Key,
  LogOut,
  Award,
  Terminal,
  ArrowLeft,
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
  onOpenPitchGateway?: () => void;
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
  onOpenPitchGateway,
}: StudentSidebarProps) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const NAV_ITEMS: { id: StudentTab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'profile',
      label: 'Profile & Skills',
      icon: <User size={16} strokeWidth={1.75} />,
      desc: 'Competency vector & GitHub scan',
    },
    {
      id: 'roadmap',
      label: 'Adaptive Roadmap (DAG)',
      icon: <Compass size={16} strokeWidth={1.75} />,
      desc: 'Topological Skill-DAG graph',
    },
    {
      id: 'studio',
      label: 'Learning Studio (Brain-Diff & Sprints)',
      icon: <Code2 size={16} strokeWidth={1.75} />,
      desc: 'Brain-Diff & AI assessment',
    },
    {
      id: 'agents',
      label: 'Multi-Agent War Room',
      icon: <Bot size={16} strokeWidth={1.75} />,
      desc: 'Groq LPU pipeline & mentor',
    },
  ];

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-white border-r border-zinc-200 justify-between h-full p-4 flex-shrink-0 select-none">
      {/* Top Brand & Learner Card */}
      <div className="space-y-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center shadow-xs">
            <Terminal size={15} strokeWidth={1.75} />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight text-zinc-900">SkillMorph AI</div>
            <div className="text-xs text-zinc-400 font-mono tracking-wider uppercase">
              Career Autopilot
            </div>
          </div>
        </div>

        {/* Learner Summary Card */}
        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-zinc-100 border border-zinc-300 text-zinc-800 font-mono text-xs font-semibold flex items-center justify-center">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-xs text-zinc-900 truncate">{user.name}</div>
              <div className="text-xs text-zinc-500 truncate">{user.institution}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-zinc-600 truncate max-w-[120px]">{targetRoleTitle}</span>
              <span className="font-mono text-xs text-zinc-900 font-semibold">{readiness}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full transition-all duration-300"
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
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-colors text-xs ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 font-semibold border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 font-normal'
                }`}
              >
                <div className={isActive ? 'text-zinc-900' : 'text-zinc-500'}>{item.icon}</div>
                <div className="min-w-0">
                  <div className="leading-tight font-medium">{item.label}</div>
                  <div className="text-xs text-zinc-400 truncate">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Administrative & Session Controls */}
      <div className="space-y-1 pt-3 border-t border-zinc-200">
        {onOpenPitchGateway && (
          <button
            onClick={onOpenPitchGateway}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-zinc-800 hover:bg-zinc-100 transition-colors font-medium"
          >
            <ArrowLeft size={15} strokeWidth={1.75} className="text-zinc-600" />
            <span>Executive Overview & Pitch</span>
          </button>
        )}

        <button
          onClick={onOpenPassport}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <Award size={15} strokeWidth={1.75} className="text-zinc-500" />
          <span>Export Skill Passport</span>
        </button>

        <button
          onClick={onSwitchToOrg}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <Building2 size={15} strokeWidth={1.75} className="text-zinc-500" />
          <span>Institution Portal (Dean)</span>
        </button>

        <button
          onClick={onOpenGroqKeyModal}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          <Key size={15} strokeWidth={1.75} className="text-zinc-400" />
          <span>Groq LPU Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-zinc-500 hover:text-red-600 hover:bg-zinc-50 transition-colors"
        >
          <LogOut size={15} strokeWidth={1.75} />
          <span>Sign Out / Switch Portal</span>
        </button>
      </div>
    </aside>
  );
}
