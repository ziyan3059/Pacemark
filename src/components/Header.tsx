import React, { useState } from 'react';
import {
  Timer,
  FileText,
  BarChart3,
  Target,
  History,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Users
} from 'lucide-react';
import { StudentUser } from '../types';

export type ActiveTab = 'dashboard' | 'home' | 'upload' | 'exam' | 'diagnostics' | 'drills' | 'history';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasActiveExam: boolean;
  hasReport: boolean;
  onNewPaperClick: () => void;
  currentStudent?: StudentUser | null;
  onSwitchStudent?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasActiveExam,
  hasReport,
  onNewPaperClick,
  currentStudent,
  onSwitchStudent,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick(currentStudent ? 'dashboard' : 'home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            title="PaceMark Revision Hub"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-white shadow-md group-hover:bg-slate-800 transition-colors">
              <Timer className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">
                PaceMark
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider uppercase hidden sm:inline">
                Pacing
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) - Fitts' Law & Jakob's Law */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5">
          {currentStudent && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick('home')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleNavClick('upload')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Upload Notes</span>
          </button>

          <button
            onClick={() => handleNavClick('exam')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'exam'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Timer className="w-4 h-4 text-amber-400" />
            <span>Exam Room</span>
            {hasActiveExam && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('diagnostics')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>Pacing Report</span>
            {hasReport && (
              <span className="w-2 h-2 rounded-full bg-blue-400 ml-0.5" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('drills')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'drills'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Target className="w-4 h-4 text-rose-400" />
            <span>Weakness Drills</span>
          </button>

          <button
            onClick={() => handleNavClick('history')}
            className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-800 text-white shadow-sm ring-1 ring-white/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>History</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions + Student Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onNewPaperClick}
            className="hidden sm:flex min-h-[38px] px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md items-center gap-1.5 whitespace-nowrap cursor-pointer active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-950" />
            <span>New Exam Paper</span>
          </button>

          {/* Student Profile dropdown */}
          {currentStudent && (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="min-h-[40px] flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl border border-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all focus:outline-none cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm">
                  {currentStudent.avatarInitials}
                </div>
                <span className="hidden md:inline truncate max-w-[110px]">{currentStudent.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <div className="font-bold text-white text-sm">{currentStudent.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentStudent.email}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Firebase Synchronized</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('dashboard');
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>Student Dashboard</span>
                  </button>

                  {onSwitchStudent && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSwitchStudent();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-800 flex items-center gap-2.5 text-slate-200 cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>Switch Student Profile</span>
                    </button>
                  )}

                  {onLogout && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-rose-950/40 text-rose-400 flex items-center gap-2.5 border-t border-slate-800 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-2 shadow-2xl">
          {currentStudent && (
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
                activeTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Student Dashboard</span>
            </button>
          )}

          <button
            onClick={() => handleNavClick('home')}
            className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'home' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            <span>Overview Hub</span>
          </button>

          <button
            onClick={() => handleNavClick('upload')}
            className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'upload' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Upload Notes</span>
          </button>

          <button
            onClick={() => handleNavClick('exam')}
            className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'exam' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            <Timer className="w-4 h-4 text-amber-400" />
            <span>Exam Room</span>
          </button>

          <button
            onClick={() => handleNavClick('diagnostics')}
            className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'diagnostics' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span>Pacing Report</span>
          </button>

          <button
            onClick={() => handleNavClick('drills')}
            className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'drills' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            <Target className="w-4 h-4 text-rose-400" />
            <span>Weakness Drills</span>
          </button>

          <button
            onClick={() => handleNavClick('history')}
            className={`w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 ${
              activeTab === 'history' ? 'bg-slate-800 text-white' : 'text-slate-400'
            }`}
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>History</span>
          </button>

          {onLogout && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-rose-400 border-t border-slate-800 pt-3"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
