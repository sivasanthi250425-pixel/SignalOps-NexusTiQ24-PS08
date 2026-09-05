import React from 'react';
import {
  Home,
  Plus,
  FolderArchive,
  Network,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'HOME' | 'NEW_INVESTIGATION' | 'CASES' | 'SUPPLY_NETWORK' | 'EVIDENCE' | 'SETTINGS' | 'INVESTIGATION_RESULT';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  caseCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  caseCount = 4,
}) => {
  const isNavActive = (tab: NavTab) => currentTab === tab;

  return (
    <aside
      className={`relative h-screen bg-[#fbfbfa] border-r border-[#e7e5e4] flex flex-col justify-between transition-all duration-300 select-none z-30 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#f0eee9]">
          <button
            onClick={() => onSelectTab('HOME')}
            className="flex items-center gap-3 cursor-pointer group text-left overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-[#18181b] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#f97316] transition-colors">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12h5l3 7 4-14 3 7h5" />
              </svg>
            </div>

            {!isCollapsed && (
              <div className="truncate">
                <div className="font-semibold text-sm tracking-tight text-[#18181b]">
                  SignalOps
                </div>
                <div className="text-[11px] text-[#71717a] truncate font-normal">
                  Supply Chain Disruption Intelligence
                </div>
              </div>
            )}
          </button>

          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-6 h-6 rounded-md hover:bg-[#eae8e3] text-[#71717a] hover:text-[#18181b] flex items-center justify-center transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Primary Action: NEW INVESTIGATION */}
        <div className="p-3">
          <button
            onClick={() => onSelectTab('NEW_INVESTIGATION')}
            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-xs transition-all cursor-pointer shadow-xs ${
              currentTab === 'NEW_INVESTIGATION'
                ? 'bg-[#18181b] text-white'
                : 'bg-[#18181b] text-white hover:bg-[#27272a]'
            }`}
            title="New Investigation"
          >
            <Plus className="w-4 h-4 text-white shrink-0" />
            {!isCollapsed && <span className="tracking-wide">NEW INVESTIGATION</span>}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="px-3 py-1 space-y-4 text-xs font-medium">
          {/* Main */}
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('HOME')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isNavActive('HOME')
                  ? 'bg-white text-[#18181b] shadow-xs font-semibold border border-[#e4e4e7]'
                  : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f2]'
              }`}
              title="Home"
            >
              <Home className="w-4 h-4 shrink-0 text-[#71717a]" />
              {!isCollapsed && <span>Home</span>}
            </button>
          </div>

          {/* Section: WORKSPACE */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-[#a1a1aa] uppercase">
                Workspace
              </div>
            )}

            <button
              onClick={() => onSelectTab('CASES')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isNavActive('CASES')
                  ? 'bg-white text-[#18181b] shadow-xs font-semibold border border-[#e4e4e7]'
                  : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f2]'
              }`}
              title="Cases"
            >
              <div className="flex items-center gap-2.5">
                <FolderArchive className="w-4 h-4 shrink-0 text-[#71717a]" />
                {!isCollapsed && <span>Cases</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#eae8e3] text-[#52525b] font-mono">
                  {caseCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('SUPPLY_NETWORK')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isNavActive('SUPPLY_NETWORK')
                  ? 'bg-white text-[#18181b] shadow-xs font-semibold border border-[#e4e4e7]'
                  : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f2]'
              }`}
              title="Supply Network"
            >
              <Network className="w-4 h-4 shrink-0 text-[#71717a]" />
              {!isCollapsed && <span>Supply Network</span>}
            </button>

            <button
              onClick={() => onSelectTab('EVIDENCE')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isNavActive('EVIDENCE')
                  ? 'bg-white text-[#18181b] shadow-xs font-semibold border border-[#e4e4e7]'
                  : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f2]'
              }`}
              title="Evidence"
            >
              <Database className="w-4 h-4 shrink-0 text-[#71717a]" />
              {!isCollapsed && <span>Evidence</span>}
            </button>
          </div>

          {/* Section: OTHER */}
          <div className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-[#a1a1aa] uppercase">
                Other
              </div>
            )}

            <button
              onClick={() => onSelectTab('SETTINGS')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                isNavActive('SETTINGS')
                  ? 'bg-white text-[#18181b] shadow-xs font-semibold border border-[#e4e4e7]'
                  : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f2]'
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4 shrink-0 text-[#71717a]" />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar Footer: NexusTiQ24 · PS08 badge */}
      <div className="p-3 border-t border-[#f0eee9] bg-[#faf9f7]">
        {!isCollapsed ? (
          <div className="rounded-xl p-2.5 bg-white border border-[#e4e4e7] space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#18181b]">
              <span>NexusTiQ24</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#18181b] text-white">
                PS08
              </span>
            </div>
            <p className="text-[10px] text-[#71717a] leading-tight">
              Deterministic Impact & Decision Engine
            </p>
          </div>
        ) : (
          <div className="flex justify-center" title="NexusTiQ24 Track PS08">
            <span className="w-7 h-7 rounded-lg bg-white border border-[#e4e4e7] flex items-center justify-center text-[10px] font-mono font-bold text-[#18181b]">
              P8
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
