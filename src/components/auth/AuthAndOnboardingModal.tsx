import React, { useState } from 'react';
import {
  Shield,
  Key,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  X,
  Compass,
  FileText,
  Pin,
  Bot,
  Award,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CharacterAvatar, CharacterId } from '../npc/CharacterIllustrations';
import { generateDetectiveBadgeId } from '../../utils/progressionLogic';

interface AuthAndOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'login' | 'character' | 'prologue';
  onCompletePrologue?: () => void;
}

export const AuthAndOnboardingModal: React.FC<AuthAndOnboardingModalProps> = ({
  isOpen,
  onClose,
  initialStep = 'login',
  onCompletePrologue,
}) => {
  const {
    profile,
    updateProfile,
    login,
    completeOnboarding,
    unlockHotspot,
    awardExp,
    unlockAchievement,
  } = useGame();

  const [step, setStep] = useState<'login' | 'character' | 'prologue'>(initialStep);

  // Login form state
  const [email, setEmail] = useState(profile.email || '');
  const [password, setPassword] = useState('••••••••');
  const [authError, setAuthError] = useState('');

  // Character creation state
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | 'other'>(
    profile.gender || 'male'
  );
  const [selectedAvatar, setSelectedAvatar] = useState<CharacterId>(
    (profile.avatar as CharacterId) || 'player_detective'
  );
  const [detectiveName, setDetectiveName] = useState(profile.name || 'Alex Nguyễn');
  const [codeName, setCodeName] = useState(profile.codeName || 'Detective-07');
  const [badgeNumber] = useState<string>(() => {
    if (profile.badgeNumber && profile.badgeNumber.startsWith('DCZ-')) {
      return profile.badgeNumber;
    }
    return generateDetectiveBadgeId();
  });

  // Prologue dialogue sequence
  const [prologueIndex, setPrologueIndex] = useState(0);

  if (!isOpen) return null;

  const handleOAuthLogin = (provider: 'google' | 'github' | 'facebook') => {
    const demoNames: Record<string, string> = {
      google: 'Thám tử Google',
      github: 'Code Sleuth (GitHub)',
      facebook: 'Điều tra viên Meta',
    };
    login(provider, `${provider}.user@data-agency.vn`, demoNames[provider]);
    setStep('character');
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setAuthError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    setAuthError('');
    login('email', email, detectiveName || 'Tân Thám Tử');
    setStep('character');
  };

  const handleGuestLogin = () => {
    login('guest', 'guest.detective@data-agency.vn', 'Alex Nguyễn');
    setStep('character');
  };

  const handleSaveCharacter = () => {
    const cleanName = detectiveName.trim() || 'Alex Nguyễn';
    updateProfile({
      name: cleanName,
      gender: selectedGender,
      avatar: selectedAvatar,
      codeName: codeName.trim() || 'Detective-07',
      badgeNumber: badgeNumber.trim() || 'DCZ-9402',
    });
    setStep('prologue');
  };

  const prologueMessages = [
    {
      title: 'BÁO CÁO NHẬN VIỆC • NGÀY ĐẦU TIÊN',
      speakerName: 'Trưởng văn phòng Hoàng Minh',
      speakerRole: 'Chỉ huy Cơ quan Điều tra Dữ liệu',
      avatar: 'hoang_minh' as CharacterId,
      text: `Chào mừng thám tử ${detectiveName}! Hôm nay là ngày đầu tiên bạn bước chân vào Cục Điều tra Dữ liệu Trung tâm. Ở thế giới ngoài kia, người ta tranh cãi bằng cảm tính; nhưng tại cơ quan này, chúng ta tìm câu trả lời từ chứng cứ số liệu.`,
    },
    {
      title: 'NGUYÊN TẮC THÉP TRONG ĐIỀU TRA',
      speakerName: 'Trưởng văn phòng Hoàng Minh',
      speakerRole: 'Chỉ huy Cơ quan Điều tra Dữ liệu',
      avatar: 'hoang_minh' as CharacterId,
      text: `“Dữ liệu không bao giờ nói dối, nhưng người nhìn dữ liệu có thể bị đánh lừa bởi mẫu số khuyết thiếu, điểm ngoại lai hoặc sự trùng hợp ngẫu nhiên.” Bạn sẽ được giao các hồ sơ thực tế từ các doanh nghiệp đối tác, và chỉ những bản báo cáo có căn cứ chặt chẽ mới được phê duyệt.`,
    },
    {
      title: 'TRANG BỊ VĂN PHÒNG & MỞ KHÓA KHÔNG GIAN',
      speakerName: 'Thám tử Cấp cao Minh Khoa',
      speakerRole: 'Cố vấn Nghiệp vụ Phân tích',
      avatar: 'minh_khoa' as CharacterId,
      text: `Chào đàn em! Tôi là Minh Khoa. Chiếc bàn gỗ chính là nơi đặt hồ sơ vụ án đang xử lý. Bảng ghim chỉ đỏ giúp xâu chuỗi giả thuyết, và máy trạm Workspace cho phép bạn soi từng dòng dữ liệu. Chúng tôi đã mở sẵn quyền truy cập cho bạn. Bắt đầu ngay thôi!`,
    },
  ];

  const handleNextPrologue = () => {
    if (prologueIndex < prologueMessages.length - 1) {
      setPrologueIndex(prologueIndex + 1);
      // Sequentially unlock hotspots as story progresses
      if (prologueIndex === 0) unlockHotspot('desk');
      if (prologueIndex === 1) {
        unlockHotspot('corkboard');
        unlockHotspot('workspace');
      }
    } else {
      completeOnboarding();
      awardExp(50, 'Hoàn thành thủ tục nhận việc và tuyên thệ nghiệp vụ');
      unlockAchievement('ach-first-step');
      if (onCompletePrologue) onCompletePrologue();
      onClose();
    }
  };

  const avatarOptions: { id: CharacterId; label: string; desc: string }[] = [
    {
      id: 'player_detective',
      label: 'Trenchcoat Noir (Nam)',
      desc: 'Áo khoác dạ thám tử cổ điển, huy hiệu mạ vàng, phong thái điềm tĩnh.',
    },
    {
      id: 'detective_female',
      label: 'Nữ Thám Tử Sắc Bén',
      desc: 'Áo choàng thanh lịch, khăn lụa đỏ, ánh mắt tinh anh phân tích chi tiết.',
    },
    {
      id: 'detective_cyber',
      label: 'Cyber Data Sleuth',
      desc: 'Kính thực tế tăng cường Neon Cyan, tai nghe phân tích luồng dữ liệu.',
    },
    {
      id: 'detective_scholar',
      label: 'Học Giả Thống Kê',
      desc: 'Áo Tweed nâu, kính mắt tròn tri thức, chuyên gia thuật toán và mô hình.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#161A22] border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden text-[#EDE8DF]">
        {/* Top Bureau Classification Header */}
        <div className="bg-gradient-to-r from-[#1E232B] via-[#2A2421] to-[#1E232B] px-6 py-4 border-b border-[#3A322C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5A93C] text-[#121820] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#E5A93C] uppercase font-bold">
                DATA CASE: ZERO • HỆ THỐNG XÁC THỰC THÁM TỬ
              </div>
              <h3 className="text-sm font-bold text-white">
                {step === 'login' && 'Cổng Đăng Nhập An Ninh Nghiệp Vụ'}
                {step === 'character' && 'Thiết Lập Hồ Sơ & Nhân Vật Thám Tử'}
                {step === 'prologue' && 'Lễ Tiếp Nhận & Hướng Dẫn Ban Đầu'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9BA3AF] hover:text-white hover:bg-[#2A2F38] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {/* ==================================================== */}
          {/* STEP 1: DETECTIVE-THEMED LOGIN SCREEN */}
          {/* ==================================================== */}
          {step === 'login' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Yêu cầu Định danh Cấp 1</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  Đăng Nhập Thẻ Nghiệp Vụ
                </h2>
                <p className="text-xs text-[#9BA3AF] max-w-md mx-auto">
                  Đăng nhập để đồng bộ tiến độ 19 vụ án, lưu huy chương và tùy chỉnh Trợ lý AI đồng hành.
                </p>
              </div>

              {/* OAuth Providers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin('google')}
                  className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#202630] border border-[#3A322C] hover:border-[#E5A93C] hover:bg-[#28303C] text-xs font-semibold text-white transition cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('github')}
                  className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#202630] border border-[#3A322C] hover:border-[#E5A93C] hover:bg-[#28303C] text-xs font-semibold text-white transition cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin('facebook')}
                  className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#202630] border border-[#3A322C] hover:border-[#E5A93C] hover:bg-[#28303C] text-xs font-semibold text-white transition cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#3A322C] w-full" />
                <span className="bg-[#161A22] px-3 text-[10px] font-mono text-[#9BA3AF] uppercase">
                  hoặc dùng email nghiệp vụ
                </span>
              </div>

              {/* Email/Password form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                {authError && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
                    {authError}
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <label className="text-[#EDE8DF] font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>Email thám tử:</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="detective@data-agency.vn"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#202630] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C] text-xs font-mono"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-[#EDE8DF] font-semibold flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>Mật mã bảo an:</span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#202630] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C] text-xs font-mono"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-[#121820] text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Tiếp Tục Đăng Nhập</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleGuestLogin}
                    className="py-3 px-4 rounded-xl bg-[#2A2421] hover:bg-[#3A322C] border border-[#3A322C] text-xs font-bold text-[#E5A93C] transition cursor-pointer"
                    title="Vào ngay mà không cần mật khẩu"
                  >
                    Đăng Nhập Khách (Chơi Nhanh)
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: CHARACTER CREATION & CUSTOMIZATION */}
          {/* ==================================================== */}
          {step === 'character' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[11px] font-mono text-[#E5A93C] uppercase tracking-wider font-bold">
                  BƯỚC 2: KHỞI TẠO DANH TÍNH NGHIỆP VỤ
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Tạo Hình Thám Tử Của Bạn
                </h2>
                <p className="text-xs text-[#9BA3AF]">
                  Chọn diện mạo đại diện và đặt danh xưng chính thức được hiển thị trên toàn bộ hồ sơ phá án.
                </p>
              </div>

              {/* Avatar Selector Grid */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#E5A93C] uppercase font-bold block">
                  1. Chọn phong cách đại diện:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {avatarOptions.map((opt) => {
                    const isSelected = selectedAvatar === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedAvatar(opt.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                          isSelected
                            ? 'bg-[#2A2421] border-[#E5A93C] shadow-lg shadow-[#E5A93C]/10'
                            : 'bg-[#202630] border-[#3A322C] hover:border-[#5A4F45]'
                        }`}
                      >
                        <CharacterAvatar id={opt.id} size="md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{opt.label}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#9BA3AF] line-clamp-2 mt-0.5 leading-snug">
                            {opt.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Gender and Name Customization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-white">Giới tính nhân vật:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'male', label: 'Nam' },
                      { id: 'female', label: 'Nữ' },
                      { id: 'other', label: 'Khác' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGender(g.id as any)}
                        className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          selectedGender === g.id
                            ? 'bg-[#E5A93C] text-[#121820] border-[#E5A93C]'
                            : 'bg-[#202630] text-[#9BA3AF] border-[#3A322C] hover:bg-[#2A2F38]'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-white">Tên thám tử hiển thị:</label>
                  <input
                    type="text"
                    value={detectiveName}
                    onChange={(e) => setDetectiveName(e.target.value)}
                    placeholder="VD: Alex Nguyễn, Lâm Thám Tử..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202630] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C] text-xs font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-semibold text-white">Mật danh (Code Name):</label>
                  <input
                    type="text"
                    value={codeName}
                    onChange={(e) => setCodeName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#202630] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C] text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-white flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>Số hiệu thẻ (Badge ID):</span>
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.2 rounded">
                      🔒 Cấp ngẫu nhiên
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#121820] border border-[#3A322C] text-[#E5A93C] font-mono font-bold text-xs select-none">
                    <Lock className="w-3.5 h-3.5 text-[#9BA3AF]" />
                    <span>{badgeNumber}</span>
                    <span className="text-[10px] font-sans font-normal text-[#9BA3AF] ml-auto">
                      Mã cố định không thể sửa
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#3A322C]">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-xs text-[#9BA3AF] hover:text-white"
                >
                  ← Đổi phương thức đăng nhập
                </button>
                <button
                  type="button"
                  onClick={handleSaveCharacter}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-[#121820] text-xs font-bold transition flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>Báo Cáo Nhận Việc (Vào Văn Phòng)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 3: STORYLINE PROLOGUE & NPC WELCOME CUTSCENE */}
          {/* ==================================================== */}
          {step === 'prologue' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#121820] border-2 border-[#D4AF37]/40 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#3A322C]">
                  <div className="flex items-center gap-3">
                    <CharacterAvatar
                      id={prologueMessages[prologueIndex].avatar}
                      size="md"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {prologueMessages[prologueIndex].speakerName}
                      </h4>
                      <p className="text-[11px] text-[#E5A93C] font-mono">
                        {prologueMessages[prologueIndex].speakerRole}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2421] text-[#D4AF37] border border-[#D4AF37]/40">
                    BƯỚC {prologueIndex + 1} / {prologueMessages.length}
                  </span>
                </div>

                <div className="text-xs font-mono font-bold text-[#E5A93C]">
                  {prologueMessages[prologueIndex].title}
                </div>

                <div className="p-4 rounded-xl bg-[#1A1D24] text-xs sm:text-sm text-[#EDE8DF] leading-relaxed italic border border-[#3A322C]">
                  “{prologueMessages[prologueIndex].text}”
                </div>
              </div>

              {/* Bureau Hotspot Preview Tour */}
              <div className="p-4 rounded-2xl bg-[#202630] border border-[#3A322C] space-y-2 text-xs">
                <span className="font-mono text-[10px] text-[#9BA3AF] uppercase block font-bold">
                  DANH SÁCH KHÔNG GIAN BÀN GIAO:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-[#121820] border border-[#E5A93C]/40 flex items-center gap-1.5 text-white">
                    <FileText className="w-3.5 h-3.5 text-[#E5A93C]" />
                    <span>Bàn Làm Việc Án</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#121820] border border-[#3A322C] flex items-center gap-1.5 text-[#EDE8DF]">
                    <Pin className="w-3.5 h-3.5 text-[#C93B2B]" />
                    <span>Bảng Ghim Tường</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#121820] border border-[#3A322C] flex items-center gap-1.5 text-[#EDE8DF]">
                    <Compass className="w-3.5 h-3.5 text-[#00E5FF]" />
                    <span>Máy Trạm Workspace</span>
                  </div>
                </div>
              </div>

              {/* Progress and Finish Button */}
              <div className="flex items-center justify-between pt-4 border-t border-[#3A322C]">
                <button
                  type="button"
                  onClick={() => {
                    completeOnboarding();
                    if (onCompletePrologue) onCompletePrologue();
                    onClose();
                  }}
                  className="text-xs text-[#9BA3AF] hover:text-white"
                >
                  Bỏ qua cắt cảnh & Vào ngay
                </button>

                <button
                  type="button"
                  onClick={handleNextPrologue}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-[#121820] text-xs font-bold transition flex items-center gap-2 shadow-lg cursor-pointer"
                >
                  <span>
                    {prologueIndex < prologueMessages.length - 1
                      ? 'Lắng Nghe Tiếp'
                      : 'Bắt Đầu Phá Án Ngay!'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
