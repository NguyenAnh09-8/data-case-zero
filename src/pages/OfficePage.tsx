import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Pin,
  Database,
  Award,
  HelpCircle,
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Bot,
  FileText,
  Lamp,
  Coffee,
  Search,
  BookOpen,
  Eye,
  Compass,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CharacterAvatar } from '../components/npc/CharacterIllustrations';
import { PageId } from '../components/navigation/HeaderNav';
import { CASE_FILES } from '../data/cases';
import { getRecommendedOfficeCase } from '../utils/progressionLogic';

interface OfficePageProps {
  onNavigate: (page: PageId) => void;
  onOpenCase: (caseId: string) => void;
}

export const OfficePage: React.FC<OfficePageProps> = ({ onNavigate, onOpenCase }) => {
  const {
    profile,
    tutorialSeen,
    setTutorialSeen,
    completedCases,
    activeCaseId,
    caseProgress,
    inventory,
    isChatbotUnlocked,
    aiAssistantName,
    setShowCharacterCreation,
    setShowAuthModal,
    isHotspotUnlocked,
  } = useGame();

  const [tutorialActive, setTutorialActive] = useState<boolean>(!tutorialSeen);
  const [tutorialStep, setTutorialStep] = useState<number>(0);
  const [activeNpcDialogue, setActiveNpcDialogue] = useState<{
    npcId: 'hoang_minh' | 'minh_khoa';
    name: string;
    role: string;
    text: string;
  } | null>(null);

  const activeProg = caseProgress[activeCaseId] || { currentTask: 1, completed: false };
  const recommended = React.useMemo(() => {
    return getRecommendedOfficeCase(
      activeCaseId,
      completedCases,
      activeProg.currentTask || 1
    );
  }, [activeCaseId, completedCases, activeProg.currentTask]);

  const targetCase = recommended.caseItem;
  const isCaseCompleted = completedCases.includes(targetCase.id);

  useEffect(() => {
    if (!tutorialSeen) {
      setTutorialActive(true);
    }
  }, [tutorialSeen]);

  const tutorialSteps = [
    {
      title: 'Chào mừng tân thám tử',
      speaker: 'hoang_minh',
      speakerName: 'Trưởng văn phòng Hoàng Minh',
      text: 'Chào mừng đến với Văn phòng Điều tra Dữ liệu, thám tử mới. Ở đây, chúng ta không phỏng đoán. Chúng ta tìm câu trả lời từ chứng cứ.',
    },
    {
      title: 'Bàn Làm Việc & Hồ Sơ Án Điểm',
      speaker: 'hoang_minh',
      speakerName: 'Trưởng văn phòng Hoàng Minh',
      text: 'Trên chiếc bàn gỗ chính là hồ sơ vụ án bạn đang phụ trách. Nhấp vào bàn hoặc tập hồ sơ để tiến hành điều tra ngay lập tức!',
    },
    {
      title: 'Tủ Hồ Sơ Gỗ (Filing Cabinet)',
      speaker: 'minh_khoa',
      speakerName: 'Thám tử Cấp cao Minh Khoa',
      text: 'Tủ tài liệu lưu trữ toàn bộ 19 vụ án theo các giai đoạn mở khóa. Bạn có thể mở tủ để duyệt qua các vụ án từ F&B, Logistics đến An ninh mạng.',
    },
    {
      title: 'Bảng Điều Tra Tường (Corkboard)',
      speaker: 'hoang_minh',
      speakerName: 'Trưởng văn phòng Hoàng Minh',
      text: 'Bảng ghim chỉ đỏ là nơi kết nối các manh mối dữ liệu, đối soát lời khai và giả thuyết. Mỗi vụ án đều có một bảng riêng biệt.',
    },
    {
      title: 'Máy Trạm AI & Kệ Vinh Danh',
      speaker: 'minh_khoa',
      speakerName: 'Thám tử Cấp cao Minh Khoa',
      text: 'Góc máy tính số là nơi kết nối với Trợ lý AI sau khi mở khóa. Kệ huân chương lưu giữ các chiến công và phần thưởng bạn đã đạt được.',
    },
  ];

  const handleNextStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setTutorialActive(false);
      setTutorialSeen(true);
    }
  };

  const handlePrevStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] p-3 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* Ambient Vignette & Warm Lighting Background */}
      <div className="absolute inset-0 pointer-events-none vignette-effect" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[400px] desk-lamp-glow pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full space-y-4 relative z-10">
        {/* Top Operational Status Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#1A1D24]/90 border border-[#3A322C] shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A2421] to-[#121820] border border-[#D4AF37]/60 flex items-center justify-center text-[#E5A93C] shadow-inner shrink-0">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Trụ Sở Văn Phòng Điều Tra Dữ Liệu
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40 uppercase font-semibold">
                  ROOM 204
                </span>
              </div>
              <p className="text-xs text-[#9BA3AF]">
                Thám tử trực ban: <strong className="text-white">{profile.name}</strong> • Cấp {profile.level} ({profile.title}) • {completedCases.length}/19 Vụ án đã phá
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end text-xs flex-wrap">
            <button
              onClick={() => setShowCharacterCreation(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2A2421] hover:bg-[#3A322C] text-[#EDE8DF] border border-[#3A322C] transition cursor-pointer"
              title="Tùy chỉnh diện mạo, danh xưng và mã hiệu thám tử"
            >
              <CharacterAvatar id={profile.avatar as any} size="sm" className="w-5 h-5 -my-1" />
              <span>Hồ Sơ & Nhân Vật</span>
            </button>

            <button
              onClick={() => {
                setTutorialStep(0);
                setTutorialActive(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2A2421] hover:bg-[#3A322C] text-[#EDE8DF] border border-[#3A322C] transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#E5A93C]" />
              <span>Hướng Dẫn Văn Phòng</span>
            </button>

            <button
              onClick={() => onNavigate('case-files')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] font-bold shadow-md transition cursor-pointer"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Tủ Hồ Sơ (19 Vụ)</span>
            </button>
          </div>
        </div>

        {/* 2.5D ISOMETRIC DETECTIVE OFFICE STAGE */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#1E232B] via-[#161A22] to-[#0F1318] border-2 border-[#3A322C] shadow-2xl overflow-hidden min-h-[580px] sm:min-h-[640px] flex items-center justify-center p-4 sm:p-8">
          {/* Wall Background & High Ceiling Window with Moonlight & Telescope */}
          <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#2A2421_1px,transparent_1px),linear-gradient(to_bottom,#2A2421_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Large Window overlooking rainy noir city with Brass Telescope */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-80 h-40 rounded-t-full bg-gradient-to-b from-[#0A192F]/90 via-[#0C1524]/70 to-transparent border-t-4 border-x-4 border-[#4A382E] shadow-2xl flex items-center justify-center overflow-hidden z-10">
            {/* Rainy drops animation effect */}
            <div className="absolute inset-0 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-amber-200/20 blur-lg absolute top-3 right-16" />
            
            {/* Brass Telescope Asset standing on tripod by the window */}
            <div className="absolute bottom-1 flex flex-col items-center pointer-events-none" title="Kính viễn vọng đồng thau hướng ra thành phố">
              <div className="w-20 h-4 bg-gradient-to-r from-[#B8972E] via-[#D4AF37] to-[#E5A93C] rounded-sm -rotate-25 shadow-lg border border-[#8C6D18]" />
              <div className="w-2 h-10 bg-[#8C6D18] shadow" />
              <div className="flex gap-4">
                <div className="w-1 h-8 bg-[#5A3F2C] rotate-20" />
                <div className="w-1 h-8 bg-[#5A3F2C] -rotate-20" />
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#00E5FF]/70 tracking-widest uppercase mt-20 font-bold drop-shadow">
              DISTRICT ZERO • RAIN 22:00
            </div>
          </div>

          {/* Classic Wooden Bookshelf (Giá Sách Nghiệp Vụ) */}
          <div className="absolute top-8 left-1/4 -translate-x-12 w-28 h-36 rounded-lg bg-[#2E1D14] border-2 border-[#4E3424] shadow-xl p-1.5 flex flex-col justify-between hidden md:flex z-10 pointer-events-none">
            <div className="text-[8px] font-mono text-[#D4AF37] text-center font-bold border-b border-[#4E3424] pb-0.5">
              TỦ SÁCH ÁN LỆ
            </div>
            {/* Shelf rows with book spines */}
            <div className="flex items-end justify-around gap-1 h-12 border-b-2 border-[#5A3F2C]">
              <div className="w-3 h-10 bg-amber-900 rounded-xs" />
              <div className="w-2.5 h-11 bg-rose-950 rounded-xs" />
              <div className="w-3 h-9 bg-slate-800 rounded-xs" />
              <div className="w-4 h-11 bg-emerald-950 rounded-xs" />
              <div className="w-2.5 h-8 bg-amber-800 rounded-xs" />
            </div>
            <div className="flex items-end justify-around gap-1 h-12">
              <div className="w-3.5 h-10 bg-blue-950 rounded-xs" />
              <div className="w-2.5 h-9 bg-[#C93B2B] rounded-xs" />
              <div className="w-3 h-11 bg-[#2A2421] rounded-xs" />
              <div className="w-3 h-8 bg-amber-700 rounded-xs" />
            </div>
          </div>

          {/* Floorboard Perspective Grid */}
          <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-[#1F1916] via-[#2A211D] to-transparent pointer-events-none border-t border-[#3A322C]/40" />

          {/* HOTSPOT 1: Wall Corkboard (Bảng Ghim Tường Chỉ Đỏ) */}
          <div
            onClick={() => onNavigate('detective-board')}
            className="group absolute top-8 left-4 sm:left-10 w-44 sm:w-56 h-36 sm:h-44 rounded-xl corkboard-texture wood-frame p-2 shadow-2xl cursor-pointer hover:scale-105 transition-all duration-300 z-20"
            title="Nhấp để mở Bảng Điều Tra Corkboard"
          >
            {/* Header label */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C93B2B] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
              BẢNG ĐIỀU TRA
            </div>

            {/* Pinned polaroids & red string threads */}
            <div className="relative w-full h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="w-12 h-14 bg-white/95 p-1 rounded shadow -rotate-6 border border-slate-300">
                  <div className="w-full h-8 bg-slate-800 rounded-xs flex items-center justify-center text-[7px] text-white font-mono">
                    CASE-00
                  </div>
                  <div className="h-0.5 bg-slate-300 my-1" />
                  <div className="text-[6px] text-slate-800 font-bold truncate">Chú Ba</div>
                </div>

                <div className="w-12 h-12 bg-[#F4E8C1] p-1 rounded shadow rotate-6 border border-amber-200 text-[6px] text-amber-950 font-mono leading-tight">
                  <Pin className="w-2.5 h-2.5 text-[#C93B2B] -mt-2 -ml-1" />
                  Doanh thu trưa 48.5%
                </div>
              </div>

              {/* Red String SVG Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 28 35 Q 80 50 140 30" stroke="#C93B2B" strokeWidth="2" fill="none" strokeDasharray="3 1" />
                <path d="M 140 30 Q 90 80 50 100" stroke="#C93B2B" strokeWidth="1.8" fill="none" />
              </svg>

              <div className="text-center bg-[#121820]/80 rounded p-1 text-[9px] text-[#E5A93C] font-mono group-hover:bg-[#E5A93C] group-hover:text-[#121820] font-bold transition">
                🔍 Xem Bảng Ghim
              </div>
            </div>
          </div>

          {/* HOTSPOT 2: Trophy Cabinet & Honor Display (Kệ Huân Chương) */}
          <div
            onClick={() => onNavigate('achievements')}
            className="group absolute top-8 right-4 sm:right-10 w-40 sm:w-48 h-48 sm:h-56 rounded-2xl bg-[#1A1614] border-4 border-[#3A281E] shadow-2xl p-2.5 cursor-pointer hover:scale-105 transition-all duration-300 z-20"
            title="Nhấp để xem Kệ Huân Chương & Thành Tựu"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#121820] text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
              KỆ HUÂN CHƯƠNG
            </div>

            {/* Glass shelves */}
            <div className="w-full h-full flex flex-col justify-between py-2 border border-[#4A382E]/50 rounded-lg p-2 bg-gradient-to-b from-[#2A201A]/80 to-[#12100E]">
              <div className="flex items-center justify-around pb-2 border-b border-[#4A382E]">
                <Award className="w-7 h-7 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] animate-bounce" />
                <Sparkles className="w-5 h-5 text-[#E5A93C]" />
              </div>
              <div className="flex items-center justify-around py-2 border-b border-[#4A382E]">
                <div className="w-7 h-7 rounded-full bg-[#2A2421] border border-[#D4AF37] flex items-center justify-center text-[10px] font-bold text-[#E5A93C]">
                  🏆
                </div>
                <BookOpen className="w-6 h-6 text-[#9BA3AF]" />
              </div>
              <div className="text-center text-[9px] font-mono text-[#D4AF37] font-bold group-hover:text-white transition">
                🎁 Nhận Thưởng
              </div>
            </div>
          </div>

          {/* HOTSPOT 3: Filing Cabinet (Tủ Hồ Sơ Gỗ Sồi) */}
          <div
            onClick={() => onNavigate('case-files')}
            className="group absolute bottom-16 left-4 sm:left-12 w-36 sm:w-44 h-48 sm:h-56 rounded-xl bg-gradient-to-b from-[#3D281D] to-[#24160E] border-2 border-[#5A3F2C] shadow-2xl p-2 cursor-pointer hover:-translate-y-1 transition-all duration-300 z-20"
            title="Nhấp để mở Tủ Hồ Sơ & Kho Dữ Liệu 19 Vụ Án"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/50 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
              TỦ TÀI LIỆU
            </div>

            {/* 3 Drawers */}
            <div className="space-y-2 pt-2">
              {[
                { label: 'CASE 00 - 03 (Nhập môn)', count: '4/4' },
                { label: 'CASE 04 - 09 (Trung cấp)', count: '6 Vụ' },
                { label: 'CASE 10 - 18 (Nâng cao)', count: '9 Vụ' },
              ].map((drawer, i) => (
                <div
                  key={i}
                  className="h-11 sm:h-13 rounded-lg bg-[#2E1D14] border border-[#4E3424] flex flex-col justify-center px-2 relative group-hover:border-[#E5A93C] transition"
                >
                  <div className="w-6 h-2 rounded-xs bg-[#D4AF37]/80 mx-auto mb-1 shadow-xs" />
                  <div className="text-[8px] font-mono text-[#D4AF37] font-semibold truncate">
                    {drawer.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-center text-[9px] font-mono text-[#9BA3AF] group-hover:text-white font-bold">
              📂 19 Vụ & Kho Data
            </div>
          </div>

          {/* HOTSPOT 4: Computer / Side Desk -> Opens DATASET WORKSPACE */}
          <div
            onClick={() => onNavigate('workspace')}
            className="group absolute bottom-16 right-4 sm:right-12 w-36 sm:w-44 h-44 sm:h-52 rounded-2xl bg-[#151D26] border-2 border-[#2A3F55] shadow-2xl p-2.5 cursor-pointer hover:-translate-y-1 transition-all duration-300 z-20"
            title="Nhấp để mở Không Gian Làm Việc Dữ Liệu (Dataset Workspace)"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0C1524] text-[#E5A93C] border border-[#E5A93C]/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
              BÀN WORKSPACE
            </div>

            <div className="w-full h-full flex flex-col justify-between items-center py-2">
              {/* Data Table Screen */}
              <div className="w-full h-24 rounded-lg bg-[#08121E] border border-[#E5A93C]/50 p-2 relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between text-[7px] font-mono text-[#E5A93C]">
                  <span>DATA: SPREADSHEET</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-center font-mono text-[9px] text-white font-bold">
                  BẢNG 150 & 200 ĐƠN
                </div>
                <div className="text-[7px] text-[#9BA3AF] font-mono truncate">
                  &gt; SELECT * FROM dataset...
                </div>
              </div>

              <div className="w-12 h-2 rounded bg-slate-600 mt-1" />
              <div className="text-[9px] font-mono text-[#E5A93C] font-bold group-hover:text-white transition">
                📊 Soi Tập Dữ Liệu
              </div>
            </div>
          </div>

          {/* HOTSPOT 6: AI Assistant Station Corner (Trợ Lý AI) */}
          <div
            onClick={() => onNavigate('chatbot')}
            className="group absolute top-8 right-52 sm:right-64 w-32 h-28 rounded-2xl bg-[#0F1C2B] border-2 border-[#00E5FF]/40 shadow-xl p-2 cursor-pointer hover:scale-105 transition hidden lg:flex flex-col justify-between items-center z-20"
            title={`Nhấp để trò chuyện với ${aiAssistantName}`}
          >
            <div className="absolute -top-2.5 bg-[#00E5FF] text-[#121820] text-[8px] font-mono font-bold px-1.5 py-0.5 rounded max-w-[110px] truncate">
              {aiAssistantName.toUpperCase()}
            </div>
            <div className="mt-2 flex flex-col items-center">
              <Bot className="w-8 h-8 text-[#00E5FF] animate-pulse" />
              <span className="text-[8px] font-mono text-[#00E5FF] font-bold mt-1">
                {isChatbotUnlocked ? 'SẴN SÀNG' : 'KHÓA (VỤ 04)'}
              </span>
            </div>
            <div className="text-[8px] font-mono text-[#9BA3AF] group-hover:text-white font-semibold truncate max-w-[110px]">
              {aiAssistantName}
            </div>
          </div>

          {/* HOTSPOT 5: MAIN INVESTIGATION DESK (BÀN ĐIỀU TRA CHÍNH) */}
          <div
            onClick={() => onOpenCase(targetCase.id)}
            className="group relative w-72 sm:w-96 md:w-[440px] rounded-3xl bg-gradient-to-br from-[#4A3222] via-[#2F1E14] to-[#1A100A] border-4 border-[#6E4B33] shadow-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 z-30 ring-8 ring-[#121820]/80"
            title={`Nhấp để mở: ${targetCase.title}`}
          >
            {/* Banker's Brass Lamp with Radiant Glow */}
            <div className="absolute -top-10 left-6 sm:left-10 flex flex-col items-center pointer-events-none">
              <div className="w-16 sm:w-20 h-7 rounded-t-xl bg-gradient-to-r from-[#184A8E] via-[#2E7D32] to-[#1B5E20] border-2 border-[#D4AF37] shadow-lg relative">
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-amber-300 rounded-full blur-xs opacity-90 animate-pulse" />
              </div>
              <div className="w-2.5 h-8 bg-[#D4AF37] shadow-md" />
              <div className="w-9 h-3 rounded-t-lg bg-[#B8972E] border border-[#8C6D18]" />
            </div>

            {/* Coffee Cup with Steam */}
            <div className="absolute top-4 right-6 sm:right-8 flex flex-col items-center pointer-events-none">
              <div className="w-1 h-3 rounded-full bg-slate-300/40 blur-xs -translate-y-1 animate-pulse" />
              <div className="w-7 h-8 rounded-b-xl bg-[#EDE8DF] border border-amber-900 shadow-md relative">
                <div className="w-5 h-1.5 rounded-full bg-[#3D281D] mx-auto mt-1" />
                <div className="absolute -right-2 top-2 w-2 h-3.5 rounded-r-full border-2 border-[#EDE8DF]" />
              </div>
            </div>

            {/* Main Desk Active Dossier Folder */}
            <div className="mt-8 bg-[#F4E8C1] rounded-2xl p-4 sm:p-5 border-2 border-[#D8C79D] shadow-xl text-[#1C1917] relative transform -rotate-1 group-hover:rotate-0 transition-transform">
              <div className="flex items-center justify-between pb-2 border-b-2 border-[#1C1917]/20 font-mono text-[10px] text-[#7A6A53]">
                <span className="font-bold">
                  {recommended.isNextNewCase ? 'VỤ ÁN MỚI ĐÃ MỞ KHÓA • ĐỀ XUẤT' : 'HỒ SƠ ÁN ĐIỂM ĐANG THỤ LÝ'}
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1C1917] text-[#E5A93C] font-bold">
                  {targetCase.code}
                </span>
              </div>

              <div className="my-2.5">
                <h3 className="text-base sm:text-lg font-extrabold text-[#1C1917] tracking-tight group-hover:text-[#C93B2B] transition">
                  {targetCase.title}
                </h3>
                <p className="text-xs font-semibold text-[#8C5828] mt-0.5">
                  {targetCase.subtitle}
                </p>
                <p className="text-xs text-[#5C4A38] mt-2 line-clamp-2 leading-relaxed">
                  {targetCase.summary}
                </p>
              </div>

              {/* Status & CTA */}
              <div className="pt-3 border-t border-[#1C1917]/15 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                  {recommended.isNextNewCase ? (
                    <span className="text-[#8C5828] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>{recommended.badgeLabel}</span>
                    </span>
                  ) : (
                    <span className="text-[#C93B2B] flex items-center gap-1 animate-pulse">
                      {recommended.badgeLabel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#C93B2B] hover:bg-[#A8281B] text-white text-xs font-bold shadow-md group-hover:scale-105 transition shrink-0">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{recommended.actionText}</span>
                </div>
              </div>
            </div>
          </div>

          {/* LIVING NPC 1: Trưởng văn phòng Hoàng Minh (Chief) */}
          <div
            onClick={() =>
              setActiveNpcDialogue({
                npcId: 'hoang_minh',
                name: 'Trưởng văn phòng Hoàng Minh',
                role: 'Chỉ huy Cơ quan Điều tra Dữ liệu',
                text: '“Chào thám tử! Một vụ án dữ liệu không bao giờ được phép suy đoán theo cảm tính. Hãy kiểm định tính toàn vẹn của bảng 150 đơn hàng trước khi đưa ra bất kỳ kết luận nào cho Chú Ba!”',
              })
            }
            className="group absolute bottom-28 left-40 sm:left-64 z-30 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
            title="Bấm để nói chuyện với Trưởng phòng Hoàng Minh"
          >
            <div className="px-2 py-0.5 rounded-full bg-[#121820]/90 text-[#E5A93C] border border-[#D4AF37]/50 text-[10px] font-mono font-bold mb-1 shadow-md group-hover:bg-[#E5A93C] group-hover:text-[#121820] transition whitespace-nowrap">
              Hoàng Minh (Trưởng phòng)
            </div>
            <CharacterAvatar id="hoang_minh" size="lg" className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]" />
            <span className="w-10 h-2 rounded-full bg-black/40 blur-xs mt-1" />
          </div>

          {/* LIVING NPC 2: Senior Detective Minh Khoa (Cố Vấn) */}
          <div
            onClick={() =>
              setActiveNpcDialogue({
                npcId: 'minh_khoa',
                name: 'Thám tử Minh Khoa',
                role: 'Cố vấn Nghiệp vụ & Phương pháp Phân tích',
                text: '“Chào đồng đội! Cần gợi ý về thống kê không? Đừng quên mở Túi đồ nghề ở góc dưới bên phải để xem Bản tra cứu cú pháp SQL hoặc lấy Thẻ chỉ đỏ nếu bị kẹt nhé!”',
              })
            }
            className="group absolute bottom-28 right-40 sm:right-64 z-30 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
            title="Bấm để nhận gợi ý từ Thám tử Minh Khoa"
          >
            <div className="px-2 py-0.5 rounded-full bg-[#121820]/90 text-[#00E5FF] border border-[#00E5FF]/40 text-[10px] font-mono font-bold mb-1 shadow-md group-hover:bg-[#00E5FF] group-hover:text-[#121820] transition whitespace-nowrap">
              Minh Khoa (Cố vấn)
            </div>
            <CharacterAvatar id="minh_khoa" size="lg" className="drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]" />
            <span className="w-10 h-2 rounded-full bg-black/40 blur-xs mt-1" />
          </div>
        </div>

        {/* NPC Interactive Dialogue Popup Modal */}
        {activeNpcDialogue && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
            <div className="max-w-lg w-full rounded-3xl bg-[#1A1D24] border-2 border-[#D4AF37] shadow-2xl p-6 text-[#EDE8DF] relative">
              <button
                onClick={() => setActiveNpcDialogue(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9BA3AF] hover:text-white hover:bg-[#2A2421] transition cursor-pointer"
                aria-label="Đóng đối thoại"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4 mb-4 pb-3 border-b border-[#3A322C]">
                <CharacterAvatar id={activeNpcDialogue.npcId} size="md" />
                <div>
                  <h3 className="text-base font-bold text-white">{activeNpcDialogue.name}</h3>
                  <p className="text-xs text-[#E5A93C] font-semibold">{activeNpcDialogue.role}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] text-sm text-[#EDE8DF] leading-relaxed italic">
                {activeNpcDialogue.text}
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                <button
                  onClick={() => onNavigate('detective-board')}
                  className="px-4 py-2 rounded-xl bg-[#2A2421] hover:bg-[#3A322C] text-xs font-semibold text-[#EDE8DF] border border-[#3A322C] transition cursor-pointer"
                >
                  Mở Bảng Điều Tra
                </button>
                <button
                  onClick={() => setActiveNpcDialogue(null)}
                  className="px-5 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-xs font-bold text-[#121820] transition cursor-pointer"
                >
                  Đã Rõ, Cảm Ơn!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Office Tutorial Modal Overlay */}
        {tutorialActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="max-w-xl w-full rounded-3xl bg-[#1A1D24] border-2 border-[#D4AF37] shadow-2xl p-6 text-[#EDE8DF] relative">
              <button
                onClick={() => {
                  setTutorialActive(false);
                  setTutorialSeen(true);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9BA3AF] hover:text-white hover:bg-[#2A2421] transition"
                aria-label="Đóng hướng dẫn"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Step Counter */}
              <div className="flex items-center justify-between pb-3 border-b border-[#3A322C] text-xs font-mono text-[#E5A93C]">
                <span>HƯỚNG DẪN BỐ TRÍ VĂN PHÒNG ĐIỀU TRA</span>
                <span>BƯỚC {tutorialStep + 1} / {tutorialSteps.length}</span>
              </div>

              {/* Speaker */}
              <div className="flex items-center gap-4 my-5">
                <CharacterAvatar id={tutorialSteps[tutorialStep].speaker as any} size="lg" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    {tutorialSteps[tutorialStep].speakerName}
                  </h3>
                  <p className="text-xs text-[#E5A93C] font-semibold">
                    {tutorialSteps[tutorialStep].title}
                  </p>
                </div>
              </div>

              {/* Text */}
              <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] text-sm text-[#EDE8DF] leading-relaxed">
                {tutorialSteps[tutorialStep].text}
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#3A322C]">
                <button
                  onClick={() => {
                    setTutorialActive(false);
                    setTutorialSeen(true);
                  }}
                  className="text-xs text-[#9BA3AF] hover:text-white font-medium underline underline-offset-4 cursor-pointer"
                >
                  Bỏ qua hướng dẫn
                </button>

                <div className="flex items-center gap-2">
                  {tutorialStep > 0 && (
                    <button
                      onClick={handlePrevStep}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2A2421] hover:bg-[#3A322C] text-xs font-semibold text-[#EDE8DF] border border-[#3A322C] transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Quay lại</span>
                    </button>
                  )}

                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-xs font-bold text-[#121820] shadow-md transition cursor-pointer"
                  >
                    <span>{tutorialStep === tutorialSteps.length - 1 ? 'Bắt Đầu Ngay' : 'Tiếp tục'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
