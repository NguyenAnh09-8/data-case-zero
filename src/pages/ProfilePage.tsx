import React, { useState } from 'react';
import {
  Shield,
  Award,
  Calendar,
  RotateCcw,
  CheckCircle2,
  FolderOpen,
  Pin,
  Bot,
  AlertTriangle,
  User,
  Sparkles,
  TrendingUp,
  Brain,
  ShieldCheck,
  Compass,
  BarChart,
  Clock,
  Flame,
  CheckCheck,
  LogOut,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CharacterAvatar } from '../components/npc/CharacterIllustrations';
import { CASE_FILES } from '../data/cases';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    completedCases,
    detectiveNotes,
    achievements,
    resetAllProgress,
    logout,
    exitGuestSession,
    setShowCharacterCreation,
    setShowAuthModal,
    setShowAiNamingModal,
    aiAssistantName,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'credentials' | 'skills' | 'history'>('credentials');
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const expPercentage = Math.min(100, Math.round((profile.currentExp / profile.nextLevelExp) * 100));

  const skillTracks = [
    {
      title: 'Thống kê mô tả (Descriptive Stats)',
      icon: BarChart,
      progress: completedCases.includes('case-00') ? 85 : 40,
      skills: ['Tổng (Sum)', 'Đếm (Count)', 'Trung bình (Average)', 'Phân vị'],
    },
    {
      title: 'Tư duy phản biện (Critical Thinking)',
      icon: Brain,
      progress: completedCases.includes('case-00') ? 90 : 30,
      skills: ['Giới hạn dữ liệu', 'Tương quan vs Nhân quả', 'Biến ẩn (Confounders)'],
    },
    {
      title: 'Kiểm định chất lượng (Data Integrity)',
      icon: ShieldCheck,
      progress: completedCases.includes('case-00') ? 80 : 35,
      skills: ['Kiểm tra Missing Values', 'Ràng buộc logic', 'Phát hiện ngoại lai'],
    },
    {
      title: 'Kể chuyện dữ liệu (Data Storytelling)',
      icon: Compass,
      progress: completedCases.includes('case-00') ? 75 : 25,
      skills: ['Báo cáo 4 phần', 'Đề xuất dựa trên bằng chứng', 'Trực quan hóa biểu đồ'],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#3A322C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#E5A93C] uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>THẺ CĂN CƯỚC THÁM TỬ & HỒ SƠ NGHIỆP VỤ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Hồ Sơ Thám Tử Dữ Liệu
            </h1>
            <p className="text-sm text-[#9BA3AF] mt-1">
              Quản lý căn cước cơ quan, chỉ số vận hành, cây kỹ năng và lịch sử phá án.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {profile.authProvider === 'guest' ? (
              <button
                type="button"
                onClick={() => {
                  exitGuestSession();
                  window.location.hash = 'welcome';
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2A2421] border border-amber-900/60 text-[#E5A93C] hover:bg-amber-950/40 text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Thoát phiên làm việc khách và xóa dữ liệu tạm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Thoát Phiên Khách (Exit Guest)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.hash = 'welcome';
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2A2421] border border-rose-900/60 text-rose-400 hover:bg-rose-950/40 text-xs font-semibold transition cursor-pointer shadow-sm"
                title="Đăng xuất khỏi tài khoản thám tử"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất (Sign Out)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2A2421] border border-[#3A322C] text-[#9BA3AF] hover:text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              title="Đặt lại toàn bộ tiến độ về trạng thái ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt Lại Tiến Độ</span>
            </button>
          </div>
        </div>

        {/* Profile Navigation Sub-tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#1A1D24] rounded-2xl border border-[#3A322C]">
          {[
            { id: 'credentials', label: 'Thẻ Căn Cước & Chỉ Số' },
            { id: 'skills', label: 'Cây Kỹ Năng & Tiến Trình' },
            { id: 'history', label: 'Nhật Ký 19 Vụ Án' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#E5A93C] text-[#121820] shadow-sm'
                  : 'text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: CREDENTIALS & STATS */}
        {activeTab === 'credentials' && (
          <div className="space-y-6">
            {/* Split ID Card Layout (Left: Physical Badge | Right: Operational Stats) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT: Physical Detective ID Badge */}
              <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#2A2421] via-[#1E1916] to-[#12100E] border-2 border-[#D4AF37]/80 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                {/* Lanyard Hole Clip */}
                <div className="w-12 h-2.5 rounded-full bg-[#12100E] border-2 border-[#D4AF37] mx-auto mb-4" />

                <div className="space-y-4">
                  {/* Agency Header & Holographic Seal */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#3A322C]">
                    <div>
                      <div className="text-[10px] font-mono tracking-widest text-[#E5A93C] uppercase font-bold">
                        AGENCY ID BADGE
                      </div>
                      <div className="text-xs font-bold text-white tracking-wide">
                        VĂN PHÒNG ĐIỀU TRA DỮ LIỆU
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#00E5FF] opacity-80 flex items-center justify-center shadow-inner">
                      <Sparkles className="w-4 h-4 text-[#121820]" />
                    </div>
                  </div>

                  {/* Photo & Core Bio */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="relative">
                      <div className="p-1 rounded-2xl border-2 border-[#D4AF37] bg-[#121820]">
                        <CharacterAvatar id={(profile.avatar as any) || 'player_detective'} size="lg" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#121820]" />
                    </div>

                    <div className="min-w-0">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#121820] text-[#E5A93C] border border-[#D4AF37]/40 font-bold block w-fit mb-1">
                        {profile.badgeNumber}
                      </span>
                      <h2 className="text-lg font-extrabold text-white truncate">
                        {profile.name}
                      </h2>
                      <p className="text-xs text-[#00E5FF] font-mono font-semibold">
                        {profile.title}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Fields */}
                  <div className="p-3 bg-[#121820]/90 rounded-2xl border border-[#3A322C] space-y-1.5 text-[11px] font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#9BA3AF]">Mật danh:</span>
                      <span className="text-white font-bold">{profile.codeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9BA3AF]">Cấp độ:</span>
                      <span className="text-[#E5A93C] font-bold">Cấp {profile.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9BA3AF]">Trợ lý AI đồng hành:</span>
                      <span className="text-[#00E5FF] font-bold">{aiAssistantName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9BA3AF]">Gia nhập:</span>
                      <span className="text-white">{profile.joinedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9BA3AF]">Cấp phép an ninh:</span>
                      <span className="text-emerald-400 font-bold">LEVEL-2 CLEARANCE</span>
                    </div>
                  </div>

                  {/* Quick Customization Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setShowCharacterCreation(true)}
                      className="p-2 rounded-xl bg-[#202630] hover:bg-[#2A3442] border border-[#3A322C] text-[#EDE8DF] font-semibold text-center transition cursor-pointer"
                    >
                      ✏️ Đổi Nhân Vật
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAiNamingModal(true)}
                      className="p-2 rounded-xl bg-[#1A2536] hover:bg-[#203147] border border-[#00E5FF]/40 text-[#00E5FF] font-semibold text-center transition cursor-pointer"
                    >
                      🤖 Đổi Tên AI
                    </button>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="mt-6 pt-3 border-t border-[#3A322C] flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-0.5 h-6">
                      {[2, 4, 1, 3, 2, 5, 2, 1, 4, 2, 3, 1, 5, 2, 4, 2, 1, 3, 4].map((w, idx) => (
                        <div
                          key={idx}
                          style={{ width: `${w}px` }}
                          className="h-full bg-white opacity-80"
                        />
                      ))}
                    </div>
                    <div className="text-[8px] font-mono text-[#9BA3AF] tracking-widest uppercase">
                      *{profile.badgeNumber || 'DCZ-9402'}*
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#D4AF37] font-bold">OFFICIAL</span>
                </div>
              </div>

              {/* RIGHT: Operations Statistics Panel */}
              <div className="lg:col-span-7 rounded-3xl bg-[#1A1D24] border border-[#3A322C] p-6 shadow-xl space-y-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#3A322C]">
                    <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                      BẢNG CHỈ SỐ VẬN HÀNH THÁM TỬ
                    </h3>
                    <span className="text-xs text-[#E5A93C] font-mono font-bold">
                      {profile.currentExp} / {profile.nextLevelExp} EXP
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#9BA3AF]">Tiến trình thăng cấp:</span>
                      <span className="text-white font-bold">{expPercentage}%</span>
                    </div>
                    <div className="w-full bg-[#121820] h-3 rounded-full overflow-hidden p-0.5 border border-[#3A322C]">
                      <div
                        className="bg-gradient-to-r from-[#D4AF37] to-[#E5A93C] h-full rounded-full transition-all duration-500"
                        style={{ width: `${expPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 6 Key Operational Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-1">
                    <FolderOpen className="w-5 h-5 text-[#E5A93C]" />
                    <span className="text-[#9BA3AF] block">Vụ án đã phá:</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {completedCases.length} / {CASE_FILES.length}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-1">
                    <CheckCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-[#9BA3AF] block">Tỷ lệ hoàn thành:</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {Math.round((completedCases.length / CASE_FILES.length) * 100)}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-1">
                    <Flame className="w-5 h-5 text-[#C93B2B]" />
                    <span className="text-[#9BA3AF] block">Chuỗi phá án:</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {profile.streakDays} Ngày
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-1">
                    <Brain className="w-5 h-5 text-[#00E5FF]" />
                    <span className="text-[#9BA3AF] block">Độ chính xác suy luận:</span>
                    <span className="text-xl font-bold font-mono text-[#00E5FF]">
                      {profile.accuracyRate}%
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-1">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#9BA3AF] block">Thời gian phá án:</span>
                    <span className="text-xl font-bold font-mono text-white">
                      {profile.totalStudyMinutes} Phút
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-1">
                    <Award className="w-5 h-5 text-[#E5A93C]" />
                    <span className="text-[#9BA3AF] block">Huân chương đạt:</span>
                    <span className="text-xl font-bold font-mono text-[#E5A93C]">
                      {Object.values(achievements).filter((a) => a.unlocked).length} Huy hiệu
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#2A2421]/60 border border-[#3A322C] text-xs text-[#EDE8DF] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E5A93C] shrink-0" />
                  <span>
                    <strong>Cột mốc tiếp theo:</strong> Hoàn thành 4 vụ án để mở khóa Trợ lý AI và huy hiệu Thám tử Cao cấp!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SKILL TREE & PROGRESS (INTEGRATED FROM PREVIOUS PROGRESS PAGE) */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider mb-2">
                CÂY KỸ NĂNG KHOA HỌC DỮ LIỆU
              </h3>
              <p className="text-xs text-[#9BA3AF]">
                Các nhánh năng lực được trui rèn và tích lũy thông qua giải quyết các vụ án thực địa.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {skillTracks.map((track, idx) => {
                  const Icon = track.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#2A2421] text-[#E5A93C] flex items-center justify-center border border-[#3A322C]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-xs font-bold text-white">{track.title}</h4>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#E5A93C]">
                          {track.progress}%
                        </span>
                      </div>

                      <div className="w-full bg-[#1A1D24] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#E5A93C] h-full rounded-full transition-all duration-500"
                          style={{ width: `${track.progress}%` }}
                        />
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {track.skills.map((s, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#1A1D24] border border-[#3A322C] text-[#9BA3AF]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOLVED CASES LOG */}
        {activeTab === 'history' && (
          <div className="bg-[#1A1D24] p-6 rounded-2xl border border-[#3A322C] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              NHẬT KÝ ĐIỀU TRA 19 VỤ ÁN
            </h3>
            {completedCases.length > 0 ? (
              <div className="space-y-3">
                {completedCases.map((caseId) => {
                  const caseFile = CASE_FILES.find((c) => c.id === caseId);
                  return (
                    <div
                      key={caseId}
                      className="p-3.5 rounded-xl bg-[#121820] border border-[#3A322C] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <div>
                          <span className="font-mono text-xs font-bold text-[#E5A93C] mr-2">
                            {caseFile?.code || caseId}
                          </span>
                          <span className="font-bold text-xs text-white">
                            {caseFile?.title || 'Vụ án đã phá thành công'}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#D4AF37]">
                        +{caseFile?.expReward || 150} EXP
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[#9BA3AF] italic py-4">
                Bạn chưa hoàn thành vụ án nào. Hãy quay về Văn phòng và mở hồ sơ Vụ án 00 trên bàn làm việc!
              </p>
            )}
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {confirmResetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
            <div className="max-w-md w-full rounded-3xl bg-[#1A1D24] border-2 border-rose-800 shadow-2xl p-6 text-[#EDE8DF]">
              <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-500 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h2 className="text-lg font-bold text-white">
                Xác nhận đặt lại toàn bộ tiến độ?
              </h2>
              <p className="text-xs text-[#9BA3AF] mt-2 leading-relaxed">
                Thao tác này sẽ xóa toàn bộ tiến trình lưu trong localStorage, đưa bạn về Cấp 1 (120 EXP) với Vụ án 00 chưa hoàn thành.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmResetOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#3A322C] text-xs font-semibold text-[#9BA3AF] hover:bg-[#2A2421]"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => {
                    resetAllProgress();
                    setConfirmResetOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Đồng ý đặt lại
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
