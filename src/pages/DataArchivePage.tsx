import React, { useState } from 'react';
import {
  Database,
  Lock,
  CheckCircle2,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  Clock,
} from 'lucide-react';
import { CASE_FILES } from '../data/cases';
import { useGame } from '../context/GameContext';

interface DataArchivePageProps {
  onOpenCase: (caseId: string) => void;
}

export const DataArchivePage: React.FC<DataArchivePageProps> = ({ onOpenCase }) => {
  const { completedCases, isCaseUnlocked } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    'Dịch vụ F&B',
    'Thương mại điện tử',
    'Vận tải & Logistics',
    'Phần mềm SaaS',
    'Tài chính & An ninh',
    'Bán lẻ & Địa lý',
    'Tài chính & Ngân hàng',
    'Năng lượng & Đô thị',
    'Bất động sản PropTech',
    'Hàng không & Vận tải',
    'Nông nghiệp AgriTech',
    'Y tế & Sức khỏe',
    'An ninh mạng & Forensics',
    'Đạo đức & Quản trị AI',
  ];

  const filtered = CASE_FILES.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#3A322C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#E5A93C] uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>KHO LƯU TRỮ DỮ LIỆU • DATA ARCHIVE 19 VỤ ÁN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Kho Lưu Trữ Hồ Sơ & Tập Dữ Liệu Doanh Nghiệp
            </h1>
            <p className="text-sm text-[#9BA3AF] mt-1">
              Bộ sưu tập các tình huống điều tra phân loại theo ngành nghề. Sau khi hoàn thành Vụ án 03, bạn có thể tự do mở các vụ án theo từng giai đoạn.
            </p>
          </div>

          <div className="text-xs font-mono bg-[#1A1D24] px-4 py-2.5 rounded-2xl border border-[#3A322C] shadow-sm">
            <span className="text-[#9BA3AF]">Chế độ mở tự do: </span>
            <strong className={completedCases.length >= 3 ? 'text-emerald-400 font-bold' : 'text-[#E5A93C]'}>
              {completedCases.length >= 3 ? 'ĐÃ KÍCH HOẠT (≥3 VỤ)' : 'CẦN HOÀN THÀNH VỤ 00-03'}
            </strong>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#1A1D24] rounded-2xl border border-[#3A322C] overflow-x-auto shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#E5A93C] text-[#121820] font-bold shadow-sm'
                  : 'text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]'
              }`}
            >
              {cat === 'all' ? 'Tất cả lĩnh vực (19 vụ)' : cat}
            </button>
          ))}
        </div>

        {/* Case List by Category */}
        <div className="space-y-4">
          {filtered.map((c) => {
            const isCompleted = completedCases.includes(c.id);
            const isUnlocked = isCaseUnlocked(c.id);

            return (
              <div
                key={c.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                  isUnlocked
                    ? 'bg-[#1A1D24] border-[#3A322C] hover:border-[#D4AF37]/80 shadow-md'
                    : 'bg-[#15181F] border-[#2A2F38] opacity-75'
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/30">
                      {c.code}
                    </span>
                    <span className="text-xs font-semibold text-[#EDE8DF] px-2.5 py-0.5 rounded bg-[#121820] border border-[#3A322C]">
                      {c.category}
                    </span>
                    <span className="text-xs text-[#9BA3AF]">
                      Độ khó: <strong className="text-white">{c.difficulty}</strong>
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đã phá án
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {c.title}: <span className="text-xs font-medium text-[#E5A93C]">{c.subtitle}</span>
                  </h3>

                  <p className="text-xs text-[#9BA3AF] leading-relaxed max-w-3xl">
                    {c.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121820] border border-[#3A322C] text-[#9BA3AF]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
                  <div className="text-right text-xs font-mono text-[#9BA3AF] hidden sm:block">
                    <span className="block text-[#E5A93C] font-bold">+{c.expReward} EXP</span>
                    <span>~{c.estimatedMinutes} phút</span>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => onOpenCase(c.id)}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      <span>{isCompleted ? 'Xem lại' : 'Vào điều tra'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C2028] text-slate-500 text-xs font-semibold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{c.requiredCaseId ? `Cần ${c.requiredCaseId.toUpperCase()}` : `Mở ở Giai đoạn ${c.tier}`}</span>
                    </div>
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
