import React from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  Footprints,
  SearchCheck,
  ShieldAlert,
  Pin,
  MessageSquareText,
  Database,
  Gift,
  Check,
  FileText,
  Lamp,
  Search,
} from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { useGame } from '../context/GameContext';

export const AchievementsPage: React.FC = () => {
  const { achievements, claimedRewards, claimAchievementReward } = useGame();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Footprints':
        return Footprints;
      case 'CheckCircle2':
        return CheckCircle2;
      case 'SearchCheck':
        return SearchCheck;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Pin':
        return Pin;
      case 'MessageSquareText':
        return MessageSquareText;
      case 'Database':
        return Database;
      default:
        return Award;
    }
  };

  const unlockedCount = Object.values(achievements).filter((a) => a.unlocked).length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#3A322C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#E5A93C] uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>KỆ HUÂN CHƯƠNG & PHẦN THƯỞNG NGHIỆP VỤ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Thành Tựu & Huân Chương Thám Tử
            </h1>
            <p className="text-sm text-[#9BA3AF] mt-1">
              Mỗi mốc thành tựu mở khóa điểm EXP, vật phẩm văn phòng và tài liệu tra cứu trực tiếp vào Túi đồ nghề.
            </p>
          </div>

          <div className="bg-[#1A1D24] px-5 py-3 rounded-2xl border border-[#3A322C] shadow-sm flex items-center gap-4">
            <div>
              <span className="text-xs text-[#9BA3AF] block font-mono">Đã chinh phục</span>
              <span className="text-lg font-bold font-mono text-white">
                {unlockedCount} / {ACHIEVEMENTS.length}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/50 flex items-center justify-center font-bold font-mono text-sm">
              {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] text-xs text-[#EDE8DF] flex items-center gap-3">
          <Gift className="w-5 h-5 text-[#E5A93C] shrink-0" />
          <span>
            <strong>Cơ chế nhận thưởng:</strong> Bấm nút <strong>&ldquo;Nhận Thưởng&rdquo;</strong> trên các huân chương đã mở khóa để thêm ngay Sổ tay cú pháp, Kính lúp hoặc Đạo cụ vào <strong>Túi đồ nghề (Floating Bubble)</strong>.
          </span>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = achievements[ach.id]?.unlocked;
            const isClaimed = claimedRewards[ach.id];
            const Icon = getIcon(ach.iconName);

            return (
              <div
                key={ach.id}
                className={`relative rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  isUnlocked
                    ? 'bg-[#1A1D24] border-[#D4AF37]/60 shadow-xl'
                    : 'bg-[#15181F] border-[#2A2F38] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/60 shadow-md'
                          : 'bg-[#1E232B] text-slate-500'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-[#E5A93C] block">
                        +{ach.expReward} EXP
                      </span>
                      {isUnlocked ? (
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 justify-end font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã mở
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 justify-end font-mono">
                          <Lock className="w-3.5 h-3.5" /> Khóa
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white">{ach.title}</h3>
                  <p className="text-xs text-[#9BA3AF] mt-1.5 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {/* Reward Info & Claim Button */}
                <div className="pt-3 border-t border-[#3A322C] space-y-3">
                  <div className="text-[11px]">
                    <span className="text-[#9BA3AF] block">Phần thưởng đính kèm:</span>
                    <span className="font-semibold text-[#E5A93C] truncate block">
                      🎁 {ach.rewardTitle || ach.unlockedOfficeItem}
                    </span>
                  </div>

                  {isUnlocked && (
                    <button
                      onClick={() => claimAchievementReward(ach.id)}
                      disabled={isClaimed}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isClaimed
                          ? 'bg-[#2A2421] text-emerald-400 border border-emerald-900/60 cursor-default'
                          : 'bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] shadow-md cursor-pointer animate-pulse'
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã Nhận Vào Túi Đồ Nghề</span>
                        </>
                      ) : (
                        <>
                          <Gift className="w-3.5 h-3.5" />
                          <span>Bấm Nhận Phần Thưởng Này</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
