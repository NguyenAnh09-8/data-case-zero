import React from 'react';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  BarChart,
  Brain,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CASE_FILES } from '../data/cases';
import { ACHIEVEMENTS } from '../data/achievements';

export const ProgressPage: React.FC = () => {
  const { profile, completedCases, achievements } = useGame();

  const expPercentage = Math.min(100, Math.round((profile.currentExp / profile.nextLevelExp) * 100));

  const milestones = [
    {
      level: 'Cột mốc 1',
      title: 'Tân binh phá án (Case 00)',
      desc: 'Hoàn thành vụ án Căn tin Đại học, nắm vững khái niệm Biến số và Giới hạn dữ liệu.',
      unlocked: completedCases.includes('case-00'),
    },
    {
      level: 'Cột mốc 2',
      title: 'Thám tử độc lập (Case 03)',
      desc: 'Mở khóa quyền chọn vụ án tự do tại Kho dữ liệu và hệ thống phân tích Cohort.',
      unlocked: completedCases.length >= 3,
    },
    {
      level: 'Cột mốc 3',
      title: 'Khai mở Trợ lý AI (Case 04)',
      desc: 'Phá thành công Vụ án 04 để kích hoạt AI Detective Assistant thông minh.',
      unlocked: completedCases.length >= 4,
    },
    {
      level: 'Cột mốc 4',
      title: 'Thám tử Trưởng kỳ cựu (Case 07)',
      desc: 'Làm chủ các phương pháp thực nghiệm A/B Testing và mô hình hồi quy không gian.',
      unlocked: completedCases.length >= 7,
    },
  ];

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
      title: 'Giao tiếp phát hiện (Data Storytelling)',
      icon: Compass,
      progress: completedCases.includes('case-00') ? 75 : 25,
      skills: ['Soạn báo cáo 4 phần', 'Đề xuất dựa trên bằng chứng', 'Trực quan hóa biểu đồ'],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F5F8FC] text-[#102C55] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#DCE5EF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#2786C5] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>TIẾN ĐỘ HUẤN LUYỆN THÁM TỬ • DETECTIVE PROGRESS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102C55] mt-1">
              Lộ Trình Phát Triển Năng Lực Dữ Liệu
            </h1>
            <p className="text-sm text-[#52677F] mt-1">
              Theo dõi điểm kinh nghiệm (EXP), cấp bậc nghiệp vụ và các năng lực cốt lõi đã được kiểm chứng qua các vụ án.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-[#DCE5EF] shadow-sm">
            <Award className="w-6 h-6 text-[#2786C5]" />
            <div>
              <span className="text-xs text-[#52677F] block">Cấp bậc hiện tại</span>
              <span className="text-base font-bold text-[#102C55]">{profile.title} (Cấp {profile.level})</span>
            </div>
          </div>
        </div>

        {/* Level and EXP Bar */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-[#2786C5] uppercase">
                KINH NGHIỆM ĐIỀU TRA (EXP)
              </span>
              <div className="text-2xl font-bold font-mono text-[#102C55] mt-0.5">
                {profile.currentExp} / {profile.nextLevelExp} EXP
              </div>
            </div>
            <span className="text-xs font-mono text-[#52677F]">
              Cần thêm <strong>{profile.nextLevelExp - profile.currentExp} EXP</strong> để đạt Cấp {profile.level + 1}
            </span>
          </div>

          <div className="w-full bg-[#E8F0F8] h-4 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-[#184A8E] to-[#2786C5] h-full rounded-full transition-all duration-700"
              style={{ width: `${expPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs font-mono">
            <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#DCE5EF]">
              <span className="text-[#52677F] block">Vụ án đã phá:</span>
              <span className="text-base font-bold text-[#102C55]">
                {completedCases.length} / {CASE_FILES.length}
              </span>
            </div>
            <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#DCE5EF]">
              <span className="text-[#52677F] block">Huân chương đạt:</span>
              <span className="text-base font-bold text-[#102C55]">
                {Object.values(achievements).filter((a) => a.unlocked).length} / {ACHIEVEMENTS.length}
              </span>
            </div>
            <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#DCE5EF]">
              <span className="text-[#52677F] block">Điểm thưởng tích lũy:</span>
              <span className="text-base font-bold text-[#2786C5]">
                {profile.currentExp + (profile.level - 1) * 500} EXP
              </span>
            </div>
            <div className="p-3 bg-[#F5F8FC] rounded-xl border border-[#DCE5EF]">
              <span className="text-[#52677F] block">Trạng thái AI:</span>
              <span className="text-base font-bold text-amber-700">
                {completedCases.length >= 4 ? 'Đã kích hoạt' : 'Khóa (Cần 4 vụ)'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Skill Branches */}
        <div>
          <h2 className="text-lg font-bold text-[#102C55] mb-4">Các nhánh năng lực phân tích</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {skillTracks.map((track, idx) => {
              const Icon = track.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-[#DCE5EF] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F0F8] text-[#184A8E] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-[#102C55]">{track.title}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#2786C5]">
                      {track.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-[#E8F0F8] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2786C5] h-full rounded-full"
                      style={{ width: `${track.progress}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {track.skills.map((s, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-[#F5F8FC] border border-[#DCE5EF] text-[#52677F]"
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

        {/* Milestones Timeline */}
        <div className="bg-white p-6 rounded-2xl border border-[#DCE5EF] shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#102C55]">Các cột mốc sự nghiệp thám tử</h2>
          <div className="space-y-4">
            {milestones.map((ms, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-start gap-4 transition ${
                  ms.unlocked
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-[#F5F8FC] border-[#DCE5EF] opacity-75'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    ms.unlocked
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {ms.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#2786C5]">{ms.level}</span>
                    <span className="text-xs font-semibold">
                      {ms.unlocked ? (
                        <span className="text-emerald-700">Đã mở khóa</span>
                      ) : (
                        <span className="text-slate-500">Chưa mở</span>
                      )}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#102C55] mt-0.5">{ms.title}</h3>
                  <p className="text-xs text-[#52677F] mt-1 leading-relaxed">{ms.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
