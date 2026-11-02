import React, { useState, useMemo } from 'react';
import {
  FolderOpen,
  Search,
  Filter,
  Lock,
  CheckCircle2,
  Play,
  ArrowRight,
  Clock,
  Sparkles,
  Award,
  Layers,
  ChevronDown,
  Database,
  Table,
  FileSpreadsheet,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { CASE_FILES } from '../data/cases';
import { useGame } from '../context/GameContext';
import { CharacterAvatar } from '../components/npc/CharacterIllustrations';
import { CaseFile } from '../types';
import { PageId } from '../components/navigation/HeaderNav';

interface CaseFilesPageProps {
  onOpenCase: (caseId: string) => void;
  onNavigate?: (page: PageId) => void;
  initialView?: 'cases' | 'datasets';
}

export const CaseFilesPage: React.FC<CaseFilesPageProps> = ({
  onOpenCase,
  onNavigate,
  initialView = 'cases',
}) => {
  const { completedCases, isCaseUnlocked, setActiveCaseId } = useGame();

  // Top view toggle: Unified Case Files Hub
  const [activeView, setActiveView] = useState<'cases' | 'datasets'>(initialView);

  // Cases filter states
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'completed' | 'locked'>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'code' | 'exp' | 'time'>('code');

  // Datasets filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [datasetSearch, setDatasetSearch] = useState('');

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

  const filteredCases = useMemo(() => {
    return CASE_FILES.filter((c) => {
      const isCompleted = completedCases.includes(c.id);
      const isUnlocked = isCaseUnlocked(c.id);

      if (activeTab === 'unlocked' && (!isUnlocked || isCompleted)) return false;
      if (activeTab === 'completed' && !isCompleted) return false;
      if (activeTab === 'locked' && isUnlocked) return false;
      if (selectedTier !== 'all' && String(c.tier) !== selectedTier) return false;
      if (selectedDifficulty !== 'all' && c.difficulty !== selectedDifficulty) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchSummary = c.summary.toLowerCase().includes(q);
        const matchTag = c.tags.some((t) => t.toLowerCase().includes(q));
        const matchCode = c.code.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchTag && !matchCode) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'exp') return b.expReward - a.expReward;
      if (sortBy === 'time') return a.estimatedMinutes - b.estimatedMinutes;
      return a.code.localeCompare(b.code);
    });
  }, [completedCases, isCaseUnlocked, activeTab, selectedTier, selectedDifficulty, searchQuery, sortBy]);

  const filteredDatasets = useMemo(() => {
    return CASE_FILES.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (datasetSearch.trim()) {
        const q = datasetSearch.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [selectedCategory, datasetSearch]);

  const tierStats = useMemo(() => {
    const stats: Record<number, { total: number; unlocked: number; completed: number }> = {};
    for (let t = 1; t <= 6; t++) {
      stats[t] = { total: 0, unlocked: 0, completed: 0 };
    }
    CASE_FILES.forEach((c) => {
      const t = c.tier || 1;
      if (!stats[t]) stats[t] = { total: 0, unlocked: 0, completed: 0 };
      stats[t].total++;
      if (isCaseUnlocked(c.id)) stats[t].unlocked++;
      if (completedCases.includes(c.id)) stats[t].completed++;
    });
    return stats;
  }, [completedCases, isCaseUnlocked]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header & Sub-Navigation Merger Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#3A322C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#E5A93C] uppercase tracking-wider">
              <FolderOpen className="w-4 h-4" />
              <span>TRUNG TÂM HỒ SƠ & DỮ LIỆU ĐIỀU TRA • CASE & DATA HUB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {activeView === 'cases' ? 'Tủ Hồ Sơ 19 Vụ Án Nghiệp Vụ' : 'Kho Dữ Liệu & Schema Thực Chiến'}
            </h1>
            <p className="text-sm text-[#9BA3AF] mt-1">
              {activeView === 'cases'
                ? 'Hệ thống 19 vụ án kinh doanh từ F&B, Logistics đến An ninh mạng, mở khóa tuần tự theo 6 giai đoạn.'
                : 'Khám phá cấu trúc bảng (schema), biến số đo lường và mở trực tiếp trong Không gian dữ liệu.'}
            </p>
          </div>

          {/* Unified View Switcher Button Group */}
          <div className="flex items-center gap-1.5 p-1.5 bg-[#1A1D24] rounded-2xl border border-[#3A322C] shrink-0">
            <button
              onClick={() => setActiveView('cases')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === 'cases'
                  ? 'bg-[#E5A93C] text-[#121820] shadow-md'
                  : 'text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span>Tủ Hồ Sơ (19 Vụ)</span>
            </button>
            <button
              onClick={() => setActiveView('datasets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeView === 'datasets'
                  ? 'bg-[#E5A93C] text-[#121820] shadow-md'
                  : 'text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Kho Dữ Liệu & Schema</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* VIEW 1: 19 CASE FILES DOSSIERS */}
        {/* ========================================================= */}
        {activeView === 'cases' && (
          <div className="space-y-6">
            {/* 6 Tiers Phase Navigator */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { tier: 1, title: 'Giai đoạn 1', desc: 'Nhập môn (00-03)' },
                { tier: 2, title: 'Giai đoạn 2', desc: 'Thao tác & Khám phá (04-06)' },
                { tier: 3, title: 'Giai đoạn 3', desc: 'Phân tích & Tương quan (07-09)' },
                { tier: 4, title: 'Giai đoạn 4', desc: 'Suy luận & Kiểm định (10-12)' },
                { tier: 5, title: 'Giai đoạn 5', desc: 'Dự báo & Phân nhóm (13-15)' },
                { tier: 6, title: 'Giai đoạn 6', desc: 'Chuyên sâu & Quản trị (16-18)' },
              ].map((t) => {
                const stat = tierStats[t.tier] || { total: 3, unlocked: 0, completed: 0 };
                const isSelected = selectedTier === String(t.tier);
                const isFullyLocked = stat.unlocked === 0;

                return (
                  <button
                    key={t.tier}
                    onClick={() => setSelectedTier(isSelected ? 'all' : String(t.tier))}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-[#2A2421] border-[#E5A93C] ring-2 ring-[#E5A93C]/40 shadow-lg'
                        : isFullyLocked
                        ? 'bg-[#15181F] border-[#2A2F38] opacity-60'
                        : 'bg-[#1A1D24] border-[#3A322C] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={isSelected ? 'text-[#E5A93C] font-bold' : 'text-[#9BA3AF]'}>
                        {t.title}
                      </span>
                      {isFullyLocked ? (
                        <Lock className="w-3 h-3 text-slate-500" />
                      ) : stat.completed === stat.total ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <span className="text-[9px] text-[#E5A93C] font-bold">
                          {stat.completed}/{stat.total}
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white truncate">{t.desc}</div>
                    <div className="w-full bg-[#121820] h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-[#E5A93C] h-full transition-all"
                        style={{ width: `${(stat.completed / stat.total) * 100}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C]">
              {/* Tab Filters */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'Tất cả 19 vụ' },
                  { id: 'unlocked', label: 'Đang mở' },
                  { id: 'completed', label: 'Đã phá án' },
                  { id: 'locked', label: 'Đang khóa' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#E5A93C] text-[#121820] shadow-sm font-bold'
                        : 'text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[#9BA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã vụ án, từ khóa..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#121820] border border-[#3A322C] text-xs text-white placeholder-[#9BA3AF] focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-[#121820] text-[#EDE8DF] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#3A322C] focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="all">Mọi độ khó</option>
                  <option value="Nhập môn">Nhập môn</option>
                  <option value="Cơ bản">Cơ bản</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Nâng cao">Nâng cao</option>
                  <option value="Chuyên gia">Chuyên gia</option>
                </select>
              </div>
            </div>

            {/* Case Dossiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((c) => {
                const isCompleted = completedCases.includes(c.id);
                const isUnlocked = isCaseUnlocked(c.id);
                const isCase00 = c.id === 'case-00';

                return (
                  <div
                    key={c.id}
                    className={`group relative rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                      isCompleted
                        ? 'bg-[#1A1D24] border-emerald-800/60'
                        : isUnlocked
                        ? 'bg-[#1A1D24] border-[#3A322C] hover:border-[#D4AF37] hover:shadow-2xl'
                        : 'bg-[#15181F] border-[#2A2F38] opacity-75'
                    }`}
                  >
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#121820] text-[#E5A93C] border border-[#D4AF37]/40">
                            {c.code}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2421] text-[#EDE8DF]">
                              Giai đoạn {c.tier}
                            </span>
                            {isCompleted ? (
                              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Đã phá án
                              </span>
                            ) : isUnlocked ? (
                              <span className="text-[11px] font-semibold text-[#00E5FF] flex items-center gap-1 font-mono">
                                <Sparkles className="w-3 h-3" /> Sẵn sàng
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 font-mono">
                                <Lock className="w-3 h-3" /> Đang khóa
                              </span>
                            )}
                          </div>
                        </div>

                        <h2 className="text-lg font-bold text-white group-hover:text-[#E5A93C] transition">
                          {c.title}
                        </h2>
                        <p className="text-xs font-medium text-[#E5A93C] mt-0.5">
                          {c.subtitle}
                        </p>
                        <p className="text-xs text-[#9BA3AF] mt-2.5 line-clamp-3 leading-relaxed">
                          {c.summary}
                        </p>
                      </div>

                      {/* Client Avatar */}
                      <div className="p-3 rounded-2xl bg-[#121820] border border-[#3A322C] flex items-center gap-3">
                        <CharacterAvatar id={c.client.avatarKey as any} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-white truncate">
                            {c.client.name}
                          </div>
                          <div className="text-[11px] text-[#9BA3AF] truncate">
                            {c.client.role} • {c.client.organization}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {c.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121820] text-[#EDE8DF] border border-[#3A322C]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="px-5 py-3.5 bg-[#121820] border-t border-[#3A322C] flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs font-mono text-[#9BA3AF]">
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#E5A93C]" />
                          <strong className="text-white">+{c.expReward}</strong> EXP
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {c.estimatedMinutes}p
                        </span>
                      </div>

                      {isUnlocked ? (
                        <button
                          onClick={() => {
                            setActiveCaseId(c.id);
                            onOpenCase(c.id);
                          }}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer ${
                            isCase00 || c.id === 'case-01'
                              ? 'bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-[#121820]'
                              : 'bg-[#2A2421] hover:bg-[#3A322C] text-[#E5A93C] border border-[#D4AF37]/50'
                          }`}
                        >
                          <span>{isCompleted ? 'Xem lại' : 'Vào điều tra'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#1C2028] text-slate-500 cursor-not-allowed"
                        >
                          <Lock className="w-3 h-3" />
                          <span>{c.requiredCaseId ? `Cần ${c.requiredCaseId.toUpperCase()}` : `Mở Giai đoạn ${c.tier}`}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: UNIFIED DATASET EXPLORER & SCHEMA VIEWER */}
        {/* ========================================================= */}
        {activeView === 'datasets' && (
          <div className="space-y-6">
            {/* Category Filter Pills & Search */}
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase">
                  LỌC THEO NGÀNH NGHỀ & LĨNH VỰC DOANH NGHIỆP:
                </span>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#9BA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={datasetSearch}
                    onChange={(e) => setDatasetSearch(e.target.value)}
                    placeholder="Tìm tên dataset, mã vụ..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#121820] border border-[#3A322C] text-xs text-white placeholder-[#9BA3AF] focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#E5A93C] text-[#121820] font-bold shadow-sm'
                        : 'bg-[#121820] text-[#9BA3AF] hover:text-white hover:bg-[#2A2421] border border-[#3A322C]'
                    }`}
                  >
                    {cat === 'all' ? 'Tất cả ngành nghề' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Datasets Table & Explorer */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDatasets.map((c) => {
                const isUnlocked = isCaseUnlocked(c.id);
                const isPlayableDataset = c.id === 'case-00' || c.id === 'case-01';

                return (
                  <div
                    key={c.id}
                    className="rounded-3xl bg-[#1A1D24] border border-[#3A322C] p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#D4AF37] transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#121820] text-[#E5A93C] border border-[#D4AF37]/40">
                          {c.code}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#2A2421] text-[#00E5FF]">
                          {c.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{c.title}</h3>

                      <div className="p-3 bg-[#121820] rounded-xl border border-[#3A322C] space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between text-[#9BA3AF]">
                          <span>Quy mô dữ liệu:</span>
                          <span className="text-white font-bold">
                            {c.id === 'case-00'
                              ? '150 dòng × 8 cột'
                              : c.id === 'case-01'
                              ? '200 dòng × 8 cột'
                              : 'Mô phỏng 500+ dòng'}
                          </span>
                        </div>
                        <div className="flex justify-between text-[#9BA3AF]">
                          <span>Định dạng tệp:</span>
                          <span className="text-[#E5A93C]">.CSV / .JSON</span>
                        </div>
                        <div className="flex justify-between text-[#9BA3AF]">
                          <span>Trạng thái:</span>
                          <span className={isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {isUnlocked ? 'Sẵn sàng nạp Workspace' : 'Chưa mở khóa'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {c.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121820] text-[#9BA3AF]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#3A322C] flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setActiveCaseId(c.id);
                          onOpenCase(c.id);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#2A2421] hover:bg-[#3A322C] text-[#EDE8DF] text-xs font-bold border border-[#3A322C] transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>Hồ sơ vụ án</span>
                      </button>

                      {isPlayableDataset && onNavigate ? (
                        <button
                          onClick={() => {
                            setActiveCaseId(c.id);
                            onNavigate('workspace');
                          }}
                          className="flex-1 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] text-xs font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
                        >
                          <Table className="w-3.5 h-3.5" />
                          <span>Mở Workspace</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-2 rounded-xl bg-[#161A22] text-slate-500 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Khóa</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
