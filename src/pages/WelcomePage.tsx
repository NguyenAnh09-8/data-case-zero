import React from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Brain,
  FileSpreadsheet,
  Award,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Briefcase,
  Pin,
  Lock,
  User,
  LogIn,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CharacterAvatar } from '../components/npc/CharacterIllustrations';

interface WelcomePageProps {
  onStartInvestigation: () => void;
  onOpenLogin?: () => void;
  onStartGuest?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onStartInvestigation,
  onOpenLogin,
  onStartGuest,
}) => {
  const { profile, setShowAuthModal, setShowCharacterCreation, login } = useGame();

  const handleSignInClick = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleGuestClick = () => {
    if (onStartGuest) {
      onStartGuest();
    } else {
      login('guest');
      setShowCharacterCreation(true);
    }
  };

  const isAlreadyActive = Boolean(profile.onboardingCompleted);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#121820] via-[#1A1D24] to-[#12100E] text-[#EDE8DF]">
      {/* Background ambient lighting and subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:36px_36px] opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] desk-lamp-glow pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 flex-1 flex flex-col justify-center">
        {/* Bureau Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A2421]/90 border border-[#D4AF37]/50 text-xs font-mono tracking-wider text-[#E5A93C] mb-6 self-start shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>VĂN PHÒNG ĐIỀU TRA DỮ LIỆU • DỰ ÁN CASE: ZERO (19 HỒ SƠ DOANH NGHIỆP)</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            {/* The Core Manifesto Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2A2421] to-[#1A1D24] border-l-4 border-[#E5A93C] text-sm text-[#EDE8DF] font-serif italic shadow-md">
              &ldquo;Mỗi Dataset là một hiện trường vụ án. Đừng phỏng đoán theo cảm tính. Hãy học cách lắng nghe chứng cứ số liệu.&rdquo;
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Học Khoa học Dữ liệu <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E5A93C] to-[#D4AF37]">
                Bằng Cách Phá Án Kinh Doanh
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#9BA3AF] max-w-2xl leading-relaxed">
              Bạn vào vai một thám tử dữ liệu tập sự mới gia nhập cơ quan. Ở đây, chúng ta không học vẹt công thức. Chúng ta lắng nghe thân chủ, truy vết dữ liệu bảng 150–200 bản ghi, ghim manh mối trên bảng chỉ đỏ và giải quyết bài toán kinh doanh bằng chứng cứ thực tế.
            </p>

            {/* Core learning workflow pill list */}
            <div className="pt-1">
              <div className="text-xs uppercase font-mono tracking-wider text-[#E5A93C] mb-2 font-semibold">
                Quy trình điều tra 7 bước chuẩn:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#EDE8DF]">
                <span className="px-2.5 py-1 rounded-lg bg-[#1A1D24] border border-[#3A322C]">Nhận hồ sơ</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9BA3AF]" />
                <span className="px-2.5 py-1 rounded-lg bg-[#1A1D24] border border-[#3A322C]">Phỏng vấn thân chủ</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9BA3AF]" />
                <span className="px-2.5 py-1 rounded-lg bg-[#1A1D24] border border-[#3A322C]">Khám phá bảng dữ liệu</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9BA3AF]" />
                <span className="px-2.5 py-1 rounded-lg bg-[#1A1D24] border border-[#3A322C]">Ghim giả thuyết chỉ đỏ</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#9BA3AF]" />
                <span className="px-2.5 py-1 rounded-lg bg-[#E5A93C] text-[#121820] font-bold">Nộp báo cáo</span>
              </div>
            </div>

            {/* Figma-Aligned Welcome CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              {/* Primary Option 1: Đăng nhập / Sign In */}
              <button
                type="button"
                onClick={handleSignInClick}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-[#121820] font-bold shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập / Sign In</span>
              </button>

              {/* Primary Option 2: Trải nghiệm Guest / Guest Mode */}
              <button
                type="button"
                onClick={handleGuestClick}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#202630] hover:bg-[#2A3442] text-white border-2 border-[#3A322C] hover:border-[#E5A93C] font-bold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-sm"
              >
                <User className="w-4 h-4 text-[#E5A93C]" />
                <span>Trải Nghiệm Guest / Guest Mode</span>
              </button>

              {/* Returning User Option: Vào Văn Phòng Ngay */}
              {isAlreadyActive && (
                <button
                  type="button"
                  onClick={onStartInvestigation}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#2A2421] hover:bg-[#3A322C] text-[#EDE8DF] border border-[#D4AF37]/50 font-semibold text-xs transition cursor-pointer"
                >
                  <span>Vào Văn Phòng (Tiếp Tục Điều Tra)</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5A93C]" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#9BA3AF] font-mono pt-1">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Hoàn toàn miễn phí • Không yêu cầu kiến thức lập trình trước</span>
            </div>
          </div>

          {/* NPCs Greeting Preview Card */}
          <div className="lg:col-span-4">
            <div className="relative rounded-3xl bg-gradient-to-b from-[#1A1D24] to-[#12100E] border-2 border-[#D4AF37]/60 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-[#3A322C]">
                <span className="text-xs font-mono text-[#E5A93C] uppercase font-bold">
                  HỒ SƠ TIẾP NHẬN TÂN THÁM TỬ
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="flex items-center gap-4 my-5">
                <CharacterAvatar id="hoang_minh" size="lg" />
                <div>
                  <h2 className="text-base font-bold text-white">Trưởng phòng Hoàng Minh</h2>
                  <p className="text-xs text-[#9BA3AF]">Chỉ huy Cơ quan Điều tra Dữ liệu</p>
                  <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/30">
                    Đang đợi bạn tại Văn phòng 2.5D
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#3A322C] text-xs text-[#EDE8DF] leading-relaxed italic">
                &ldquo;Chào mừng đến với Văn phòng Điều tra Dữ liệu, thám tử mới. Ở đây, chúng ta không phỏng đoán. Chúng ta tìm câu trả lời từ chứng cứ.&rdquo;
              </div>

              <div className="mt-4 pt-3 border-t border-[#3A322C] flex items-center justify-between text-xs text-[#9BA3AF]">
                <span>Nhiệm vụ đầu tiên:</span>
                <span className="font-bold text-[#E5A93C]">Vụ án 00 - Căn tin Đại học</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          <div className="p-5 rounded-3xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#2A2421] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5A93C] mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1.5">19 Vụ Án Doanh Nghiệp Chuẩn Hóa</h2>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              Dữ liệu từ F&B, E-commerce, Chuỗi cung ứng, Y tế đến An ninh mạng và Đạo đức AI với cấu trúc bảng thực tế.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#1A1D24] border border-[#C93B2B]/40 flex items-center justify-center text-[#C93B2B] mb-3">
            <Pin className="w-5 h-5" />
          </div>
          <div className="p-5 rounded-3xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#2A2421] border border-[#C93B2B]/40 flex items-center justify-center text-[#C93B2B] mb-3">
              <Pin className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1.5">Bảng Điều Tra Chỉ Đỏ & Mindmap</h2>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              Tách biệt Quan sát (Observation), Giả thuyết (Hypothesis) và Kết luận (Conclusion). Ghim nối dây chỉ đỏ theo tư duy phản biện.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#2A2421] border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-1.5">Túi Đồ Nghề & Sổ Tay Cú Pháp</h2>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              Thu thập kính lúp soi dữ liệu, sổ tay câu lệnh SQL/Pandas và đạo cụ văn phòng tự động qua từng chiến công.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
