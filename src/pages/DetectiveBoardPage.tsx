import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Pin,
  Plus,
  Trash2,
  Tag,
  Filter,
  Sparkles,
  FileText,
  CheckCircle2,
  HelpCircle,
  X,
  Edit2,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { BoardNode, DetectiveNote } from '../types';
import { CASE_FILES } from '../data/cases';
import { getAntiSpoilerBoardCases } from '../utils/progressionLogic';

export interface DetectiveBoardPageProps {
  initialCaseId?: string;
  isModalOverlay?: boolean;
  onCloseModal?: () => void;
}

export const DetectiveBoardPage: React.FC<DetectiveBoardPageProps> = ({
  initialCaseId,
  isModalOverlay = false,
  onCloseModal,
}) => {
  const {
    activeCaseId,
    setActiveCaseId,
    caseNodes,
    caseConnections,
    updateNodePosition,
    addBoardNode,
    completedCases,
    caseProgress,
  } = useGame();

  // Restrict visible cases strictly to unlocked cases to prevent content spoilers
  const unlockedCases = useMemo(() => getAntiSpoilerBoardCases(completedCases), [completedCases]);

  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => {
    const desired = initialCaseId || activeCaseId || 'case-00';
    const isAvailable = unlockedCases.some((c) => c.id === desired);
    return isAvailable ? desired : unlockedCases[0]?.id || 'case-00';
  });

  // Keep selectedCaseId synchronized if completedCases changes
  useEffect(() => {
    if (!unlockedCases.some((c) => c.id === selectedCaseId)) {
      setSelectedCaseId(unlockedCases[0]?.id || 'case-00');
    }
  }, [unlockedCases, selectedCaseId]);

  const [filterType, setFilterType] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Add node form state
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeContent, setNodeContent] = useState('');
  const [nodeType, setNodeType] = useState<BoardNode['type']>('evidence');
  const [nodeTag, setNodeTag] = useState('');

  const currentCase = unlockedCases.find((c) => c.id === selectedCaseId) || unlockedCases[0] || CASE_FILES[0];
  const isCaseCompleted = completedCases.includes(selectedCaseId);
  const currentProgress = caseProgress[selectedCaseId] || { currentTask: 1, completed: isCaseCompleted };
  const currentStep = isCaseCompleted ? 7 : (currentProgress.currentTask || 1);

  const rawNodes = caseNodes[selectedCaseId] || [];
  const rawConnections = caseConnections[selectedCaseId] || [];

  // Filter nodes by type and progressive reveal (unlockedStep <= currentStep + 1)
  const visibleNodes = useMemo(() => {
    return rawNodes.filter((node) => {
      // In completed cases, all nodes are visible. In active case, reveal progressively
      if (!isCaseCompleted && node.unlockedStep > currentStep + 1) return false;
      if (filterType !== 'all' && node.type !== filterType) return false;
      return true;
    });
  }, [rawNodes, filterType, isCaseCompleted, currentStep]);

  // Corkboard ref for drag math
  const boardRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, node: BoardNode) => {
    e.stopPropagation();
    setDraggedNodeId(node.id);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNodeId || !boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(boardRect.width - 240, e.clientX - boardRect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(boardRect.height - 180, e.clientY - boardRect.top - dragOffset.y));

    updateNodePosition(selectedCaseId, draggedNodeId, Math.round(newX), Math.round(newY));
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeTitle.trim() || !nodeContent.trim()) return;

    addBoardNode({
      caseId: selectedCaseId,
      title: nodeTitle,
      content: nodeContent,
      type: nodeType,
      tag: nodeTag || 'Ghi chú',
      x: Math.round(Math.random() * 200 + 100),
      y: Math.round(Math.random() * 200 + 100),
      unlockedStep: 1,
      accentColor:
        nodeType === 'evidence'
          ? '#C93B2B'
          : nodeType === 'clue'
          ? '#00E5FF'
          : nodeType === 'hypothesis'
          ? '#E5A93C'
          : '#22C55E',
    });

    setNodeTitle('');
    setNodeContent('');
    setNodeTag('');
    setModalOpen(false);
  };

  const getNodeBadge = (t: BoardNode['type']) => {
    switch (t) {
      case 'suspect':
        return { label: 'Thân chủ / Đối tượng', color: 'bg-[#E5A93C] text-[#121820]' };
      case 'clue':
        return { label: 'Manh mối dữ liệu', color: 'bg-[#00E5FF] text-[#121820]' };
      case 'evidence':
        return { label: 'Bằng chứng xác thực', color: 'bg-[#C93B2B] text-white' };
      case 'hypothesis':
        return { label: 'Giả thuyết kiểm chứng', color: 'bg-[#D4AF37] text-[#121820]' };
      case 'conclusion':
        return { label: 'Kết luận vụ án', color: 'bg-emerald-600 text-white' };
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] py-6 px-3 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full space-y-4">
        {/* Header & Case Switcher */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#E5A93C] uppercase tracking-wider">
              <Pin className="w-4 h-4 text-[#C93B2B]" />
              <span>BẢNG ĐIỀU TRA ĐẦU MỐI • DETECTIVE CORKBOARD</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
              <span>{currentCase.title}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40">
                {currentCase.code}
              </span>
            </h1>
            <p className="text-xs text-[#9BA3AF] mt-0.5">
              Kết nối bằng chứng, manh mối bảng tính và giả thuyết bằng dây chỉ đỏ theo tư duy phản biện.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Case Switcher Dropdown */}
            <div className="flex items-center gap-2 text-xs font-mono bg-[#121820] p-1.5 rounded-xl border border-[#3A322C]">
              <span className="text-[#9BA3AF] pl-2">Hồ sơ:</span>
              <select
                value={selectedCaseId}
                onChange={(e) => {
                  setSelectedCaseId(e.target.value);
                  setActiveCaseId(e.target.value);
                }}
                className="bg-[#2A2421] text-[#EDE8DF] px-3 py-1.5 rounded-lg border border-[#3A322C] font-semibold text-xs focus:outline-none focus:border-[#E5A93C]"
              >
                {unlockedCases.map((c) => {
                  const isDone = completedCases.includes(c.id);
                  return (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title} {isDone ? '✓ [ĐÃ PHÁ ÁN]' : '● [ĐANG ĐIỀU TRA]'}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ghim Manh Mối Mới</span>
            </button>

            {isModalOverlay && onCloseModal && (
              <button
                onClick={onCloseModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C93B2B] hover:bg-[#A8281B] text-white text-xs font-bold transition shadow-md cursor-pointer ring-2 ring-white/20"
              >
                <X className="w-4 h-4" />
                <span>Đóng & Quay Lại Hồ Sơ (Giữ Tiến Độ)</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter and Progressive Reveal Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1A1D24] p-3 rounded-2xl border border-[#3A322C] text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'Tất cả thẻ ghim' },
              { id: 'clue', label: 'Manh mối' },
              { id: 'evidence', label: 'Bằng chứng' },
              { id: 'hypothesis', label: 'Giả thuyết' },
              { id: 'conclusion', label: 'Kết luận' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#E5A93C] text-[#121820] font-bold shadow-xs'
                    : 'text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#9BA3AF]">
            <span>Đang ghim: <strong className="text-white">{visibleNodes.length}</strong> đầu mối</span>
            <span className="text-[#C93B2B] flex items-center gap-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C93B2B]" /> Dây chỉ đỏ kết nối
            </span>
          </div>
        </div>

        {/* THE CORKBOARD CANVAS STAGE */}
        <div
          ref={boardRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="relative w-full h-[620px] rounded-3xl corkboard-texture wood-frame shadow-2xl overflow-hidden select-none"
        >
          {/* Wooden Frame Corner Vignette Shadow */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(30,15,5,0.7)]" />

          {/* SOLVED / CLOSED INK STAMP OVERLAY (when case is completed) */}
          {isCaseCompleted && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none z-40 opacity-85">
              <div className="border-8 border-dashed border-[#C93B2B] px-8 py-4 rounded-3xl text-center shadow-2xl bg-black/20 backdrop-blur-xs">
                <div className="text-3xl sm:text-5xl font-black font-mono tracking-widest text-[#C93B2B] uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  ĐÃ PHÁ ÁN
                </div>
                <div className="text-xs sm:text-sm font-bold font-mono tracking-wider text-[#C93B2B] mt-1 uppercase">
                  CASE CLOSED • VĂN PHÒNG ĐIỀU TRA DỮ LIỆU
                </div>
              </div>
            </div>
          )}

          {/* SVG LAYER FOR CRIMSON RED YARN STRINGS */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {rawConnections.map((conn) => {
              const fromNode = rawNodes.find((n) => n.id === conn.fromNodeId);
              const toNode = rawNodes.find((n) => n.id === conn.toNodeId);
              if (!fromNode || !toNode) return null;

              // Anchor coordinates (center top of polaroid cards)
              const x1 = fromNode.x + 105;
              const y1 = fromNode.y + 15;
              const x2 = toNode.x + 105;
              const y2 = toNode.y + 15;

              // Realistic string curve with sagging sag
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2 + 25;

              return (
                <g key={conn.id}>
                  {/* String Shadow */}
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY + 4} ${x2} ${y2}`}
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="3.5"
                    fill="none"
                  />
                  {/* Red String Body */}
                  <path
                    d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    stroke="#C93B2B"
                    strokeWidth="2.5"
                    fill="none"
                    strokeDasharray={conn.color === '#E5A93C' ? '4 2' : 'none'}
                  />
                  {/* String Label Badge if exists */}
                  {conn.label && (
                    <text
                      x={midX}
                      y={midY - 8}
                      fill="#EDE8DF"
                      fontSize="9"
                      fontFamily="DM Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* DRAGGABLE POLAROID & NOTE CARDS ON CORKBOARD */}
          {visibleNodes.map((node) => {
            const badge = getNodeBadge(node.type);
            const isDragging = draggedNodeId === node.id;

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(e, node)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                }}
                className={`absolute w-56 sm:w-60 p-3.5 rounded-2xl bg-[#FFFDF7] text-[#1C1917] polaroid-card border border-[#E8DEC8] cursor-grab active:cursor-grabbing transition-shadow z-20 ${
                  isDragging ? 'shadow-2xl scale-105 z-30 ring-2 ring-[#E5A93C]' : ''
                }`}
              >
                {/* Brass / Crimson Push Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#E53935] to-[#8C1D18] border-2 border-white/80 shadow-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                  </div>
                </div>

                {/* Card Top Category Badge */}
                <div className="flex items-center justify-between mt-1 mb-2">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${badge.color}`}>
                    {badge.label}
                  </span>
                  <span className="text-[9px] font-mono text-[#8C5828] font-bold">
                    #{node.tag || 'Manh mối'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xs font-extrabold text-[#1C1917] leading-tight">
                  {node.title}
                </h3>

                {/* Content */}
                <p className="text-[11px] text-[#4A3828] mt-1.5 leading-relaxed bg-[#F7F2E6] p-2 rounded-xl border border-[#E8DEC8] font-sans">
                  {node.content}
                </p>

                {/* Bottom Pin Anchor Indicator */}
                <div className="mt-2 pt-1 border-t border-[#1C1917]/10 flex items-center justify-between text-[9px] font-mono text-[#8C7A68]">
                  <span>Vị trí ghim: ({node.x}, {node.y})</span>
                  <span className="text-[#C93B2B] font-bold">● Đầu chốt nối</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Clue Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-[#1A1D24] border-2 border-[#D4AF37] shadow-2xl p-6 text-[#EDE8DF] relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Pin className="w-4 h-4 text-[#C93B2B]" />
              <span>Ghim Manh Mối / Giả Thuyết Mới</span>
            </h2>

            <form onSubmit={handleCreateNode} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-white block mb-1">Loại thẻ điều tra:</label>
                <select
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#121820] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="evidence">Bằng chứng (Dữ liệu xác thực từ bảng)</option>
                  <option value="clue">Manh mối (Biến số & Quan sát)</option>
                  <option value="hypothesis">Giả thuyết (Suy luận cần kiểm chứng)</option>
                  <option value="conclusion">Kết luận (Giải pháp cho thân chủ)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Tiêu đề ngắn gọn:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đỉnh doanh thu giờ trưa, Tỷ lệ bỏ giỏ hàng..."
                  value={nodeTitle}
                  onChange={(e) => setNodeTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#121820] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Nội dung ghi chú:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Mô tả số liệu quan sát được hoặc lập luận logic..."
                  value={nodeContent}
                  onChange={(e) => setNodeContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#121820] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div>
                <label className="font-bold text-white block mb-1">Thẻ nhãn (Tag):</label>
                <input
                  type="text"
                  placeholder="Doanh thu, Khung giờ, Món ăn"
                  value={nodeTag}
                  onChange={(e) => setNodeTag(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#121820] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#3A322C]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#3A322C] text-[#9BA3AF] hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] font-bold shadow-md cursor-pointer"
                >
                  Ghim Lên Bảng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
