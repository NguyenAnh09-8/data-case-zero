import React, { useState } from 'react';
import {
  Building2,
  FolderOpen,
  Pin,
  Award,
  Sparkles,
  Bot,
  Bell,
  Menu,
  X,
  Lock,
  Compass,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CharacterAvatar } from '../npc/CharacterIllustrations';
import { CASE_FILES } from '../../data/cases';

export type PageId =
  | 'welcome'
  | 'office'
  | 'case-files'
  | 'case-detail'
  | 'workspace'
  | 'detective-board'
  | 'archive'
  | 'achievements'
  | 'profile'
  | 'chatbot';

interface HeaderNavProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ currentPage, onNavigate }) => {
  const { profile, notification, clearNotification, isChatbotUnlocked, activeCaseId, caseProgress } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Module Merger: "Kho dữ liệu" is merged into "Hồ sơ vụ án" (Case Files)
  const navItems = [
    { id: 'office', label: 'Văn phòng', icon: Building2 },
    { id: 'case-files', label: 'Hồ sơ vụ án', icon: FolderOpen },
    { id: 'detective-board', label: 'Bảng điều tra', icon: Pin },
    { id: 'workspace', label: 'Không gian dữ liệu', icon: Compass },
    { id: 'achievements', label: 'Thành tựu', icon: Award },
  ] as const;

  const activeCase = CASE_FILES.find((c) => c.id === activeCaseId) || CASE_FILES[0];
  const activeProg = caseProgress[activeCaseId] || { currentTask: 1, completed: false };

  const handleNavClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  const expPercentage = Math.min(100, Math.round((profile.currentExp / profile.nextLevelExp) * 100));

  return (
    <header className="sticky top-0 z-50 w-full bg-[#121820]/95 backdrop-blur-md border-b border-[#3A322C] shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* LEFT: Logo & Subtitle */}
        <button
          onClick={() => handleNavClick('office')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer shrink-0"
          aria-label="Về văn phòng DATA CASE: ZERO"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2A2421] to-[#121820] flex items-center justify-center shadow-inner border border-[#D4AF37]/60 group-hover:border-[#E5A93C] transition-all shrink-0">
            <span className="font-mono font-bold text-[#E5A93C] text-xs tracking-wider">DC:0</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs tracking-wider text-white uppercase font-mono whitespace-nowrap">
                DATA CASE: ZERO
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C] animate-pulse" />
            </div>
            <p className="text-[10px] text-[#9BA3AF] tracking-wide uppercase font-semibold whitespace-nowrap">
              Văn Phòng Điều Tra Dữ Liệu
            </p>
          </div>
        </button>

        {/* CENTER: Horizontal Navigation Bar (6 Core Pages) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'case-files' && currentPage === 'case-detail');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as PageId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E5A93C] text-[#121820] shadow-md font-bold'
                    : 'text-[#EDE8DF] hover:bg-[#2A2421] hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#121820]' : 'text-[#E5A93C]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Notifications, AI Shortcut, EXP bar, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* AI Assistant Shortcut with Custom Name */}
          <button
            onClick={() => handleNavClick('chatbot')}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              currentPage === 'chatbot'
                ? 'bg-[#00E5FF] text-[#121820] font-bold border-[#00E5FF]'
                : isChatbotUnlocked
                ? 'bg-[#1A2533] text-[#00E5FF] border-[#00E5FF]/40 hover:border-[#00E5FF]'
                : 'bg-[#1A1D24] text-[#9BA3AF] border-[#3A322C] hover:text-white'
            }`}
            title={
              isChatbotUnlocked
                ? `${profile.aiAssistantName || 'Trợ lý AI'} (Đã kích hoạt)`
                : 'Trợ lý AI Thám tử (Mở sau Vụ án 04)'
            }
          >
            <Bot className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span className="hidden md:inline font-mono">
              {profile.aiAssistantName || 'Trợ lý AI'}
            </span>
            {!isChatbotUnlocked && <Lock className="w-3 h-3 text-[#9BA3AF]" />}
            {isChatbotUnlocked && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationPopup(!showNotificationPopup)}
              className="relative p-2 rounded-xl bg-[#1A1D24] text-[#9BA3AF] hover:text-white hover:bg-[#2A2421] border border-[#3A322C] transition cursor-pointer"
              aria-label="Thông báo nhiệm vụ"
            >
              <Bell className="w-4 h-4 text-[#E5A93C]" />
              {notification && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C93B2B] ring-2 ring-[#121820] animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotificationPopup && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-2xl p-3.5 text-xs z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#3A322C]">
                  <span className="font-semibold text-white">Tin báo điều tra</span>
                  <button
                    onClick={() => {
                      clearNotification();
                      setShowNotificationPopup(false);
                    }}
                    className="text-[#9BA3AF] hover:text-white"
                  >
                    Đóng
                  </button>
                </div>
                <div className="py-2.5">
                  {notification ? (
                    <div className="p-2.5 rounded-xl bg-[#121820] border border-[#D4AF37]/40 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                      <p className="text-[#EDE8DF] font-medium leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  ) : (
                    <p className="text-[#9BA3AF] text-center py-2">
                      Không có thông báo mới. Hồ sơ đang cập nhật!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* EXP Indicator Pill */}
          <div
            onClick={() => handleNavClick('profile')}
            className="hidden sm:flex flex-col justify-center px-3 py-1 rounded-xl bg-[#1A1D24] border border-[#3A322C] cursor-pointer hover:border-[#E5A93C] transition min-w-[125px]"
            title={`Cấp ${profile.level}: ${profile.currentExp} / ${profile.nextLevelExp} EXP`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-white font-semibold">Cấp {profile.level}</span>
              <span className="text-[#E5A93C]">{profile.currentExp}/{profile.nextLevelExp} EXP</span>
            </div>
            <div className="w-full bg-[#121820] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#E5A93C] h-full rounded-full transition-all duration-500"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>

          {/* User Profile Avatar Trigger */}
          <button
            onClick={() => handleNavClick('profile')}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#1A1D24] border border-[#3A322C] hover:border-[#E5A93C] transition cursor-pointer"
            aria-label="Hồ sơ thám tử cá nhân"
          >
            <CharacterAvatar id={(profile.avatar as any) || 'player_detective'} size="sm" />
            <span className="hidden xl:inline text-xs font-medium text-white max-w-[85px] truncate">
              {profile.name}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-[#1A1D24] text-[#EDE8DF] hover:text-white border border-[#3A322C]"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Persistent Investigation Progress Bar across active sessions */}
      {activeCase && (
        <div className="bg-[#181D24] border-t border-[#2A2421] px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs shadow-inner">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] shadow-[0_0_6px_rgba(229,169,60,0.8)] animate-pulse shrink-0" />
            <div className="flex items-center gap-1.5 shrink-0 font-mono text-[11px]">
              <span className="text-[#9BA3AF] hidden sm:inline">ĐANG THỤ LÝ:</span>
              <span className="px-1.5 py-0.5 rounded bg-[#2A2421] text-[#E5A93C] font-bold border border-[#D4AF37]/40">
                {activeCase.code}
              </span>
            </div>
            <span className="text-white font-medium truncate text-xs">
              {activeCase.title}
            </span>
            <span className="text-[#9BA3AF] text-[11px] font-mono hidden md:inline">
              · {activeProg.completed ? '🏆 Đã hoàn thành' : `Tiến trình: Giai đoạn ${activeProg.currentTask || 1}/7`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentPage !== 'case-detail' ? (
              <button
                onClick={() => onNavigate('case-detail')}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-[#121820] font-bold text-[11px] shadow transition cursor-pointer"
              >
                <span>Tiếp tục điều tra</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            ) : (
              <span className="text-[11px] font-mono text-emerald-400 font-semibold hidden sm:inline flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Đang mở hồ sơ
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A1D24] border-b border-[#3A322C] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'case-files' && currentPage === 'case-detail');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as PageId)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-[#E5A93C] text-[#121820] font-bold'
                    : 'text-[#EDE8DF] hover:bg-[#2A2421]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#E5A93C]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
