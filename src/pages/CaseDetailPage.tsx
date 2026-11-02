import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileText,
  MessageSquare,
  Table as TableIcon,
  CheckSquare,
  Pin,
  Send,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  BarChart2,
  Save,
  Award,
  Layers,
  Search,
  ExternalLink,
  ShieldAlert,
  Play,
  Terminal,
  Code2,
  Database,
  X,
  Lightbulb,
} from 'lucide-react';
import { CASE_FILES } from '../data/cases';
import { CANTEEN_DATASET } from '../data/canteenDataset';
import {
  TECHMART_FUNNEL_DATASET,
  getFunnelStepsSummary,
  getDropOffReasonsSummary,
  TechMartFunnelRecord,
} from '../data/techmartDataset';
import {
  getDishSummary,
  getTimeSlotSummary,
  getCategorySummary,
  formatVND,
  validateDatasetIntegrity,
} from '../utils/canteenData';
import { CASE_BENCHMARK_SOLUTIONS } from '../data/caseDebriefs';
import { useGame } from '../context/GameContext';
import { CharacterAvatar } from '../components/npc/CharacterIllustrations';
import { PageId } from '../components/navigation/HeaderNav';
import { DetectiveBoardPage } from './DetectiveBoardPage';

interface CaseDetailPageProps {
  caseId: string;
  onNavigate: (page: PageId) => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId, onNavigate }) => {
  const {
    profile,
    caseProgress,
    saveTaskAnswer,
    setTaskNumber,
    saveReportDraft,
    submitCaseReport,
    addDetectiveNote,
    unlockAchievement,
    setActiveCaseId,
  } = useGame();

  const caseData = CASE_FILES.find((c) => c.id === caseId) || CASE_FILES[0];
  const isCase01 = caseId === 'case-01';

  const progress = caseProgress[caseId] || {
    currentTask: 1,
    taskAnswers: {},
    reportDraft: {
      finding1: '',
      evidence1: '',
      finding2: '',
      evidence2: '',
      furtherQuestion: '',
      recommendation: '',
    },
    completed: false,
  };

  // 7 Stages - Persist active stage from caseProgress state
  const [activeStage, setActiveStage] = useState<number>(() => {
    if (progress.completed) return 7;
    return progress.currentTask && progress.currentTask >= 1 && progress.currentTask <= 7
      ? progress.currentTask
      : 1;
  });

  const handleStageSelect = (stageId: number) => {
    setActiveStage(stageId);
    setTaskNumber(caseId, stageId);
  };

  // Fullscreen Detective Board Modal Overlay state (Fixing Stage 5 State Loss bug)
  const [showBoardOverlay, setShowBoardOverlay] = useState(false);

  // NPC Minh Khoa interactive advice popup modal
  const [npcHintModal, setNpcHintModal] = useState<{
    taskTitle: string;
    advice: string;
    analyticalFocus: string;
  } | null>(null);

  // Client dialogue state
  const [dialogueHistory, setDialogueHistory] = useState<{ speaker: string; text: string }[]>(() => {
    if (isCase01) {
      return [
        {
          speaker: 'mai_linh',
          text: 'Chào thám tử! Tôi là Mai Linh, Giám đốc Tăng trưởng TechMart. Chiến dịch Mùa tựu trường tuần rồi chi gần 500 triệu quảng cáo, người dùng ùa vào thêm hàng vào giỏ ầm ầm. Nhưng đến trang thanh toán cuối cùng thì rớt mất gần 70%! Bên marketing nói do UI, bên IT nói do ngân hàng. Tôi cần bạn dùng dữ liệu phễu bóc tách sự thật.',
        },
      ];
    }
    return [
      {
        speaker: 'chu_ba',
        text: 'Chào thám tử! Tôi là Ba, quản lý căn tin. Mấy tuần nay sinh viên đông quá, ngày nào nhà bếp cũng nháo nhào. Có hôm món hết sạch từ 11h30 trưa, có hôm lại thừa mứa. Tôi đã trích xuất 150 đơn hàng gần nhất để nhờ văn phòng điều tra giúp.',
      },
    ];
  });

  // Table preview controls
  const [tableSearch, setTableSearch] = useState('');
  const [slotFilter, setSlotFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stepFilter, setStepFilter] = useState<string>('all');

  // Report form local state with continuous autosave
  const [reportForm, setReportForm] = useState(progress.reportDraft);

  // Case 01: Interactive Code Playground State (Python / SQL)
  const [codeLanguage, setCodeLanguage] = useState<'python' | 'sql'>('python');
  const [activeCodeSnippetId, setActiveCodeSnippetId] = useState<'funnel' | 'reasons'>('funnel');
  const [codeExecuted, setCodeExecuted] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Sync activeCaseId on mount
  useEffect(() => {
    setActiveCaseId(caseId);
  }, [caseId, setActiveCaseId]);

  // Update reportForm whenever progress.reportDraft changes
  useEffect(() => {
    if (progress.reportDraft) {
      setReportForm(progress.reportDraft);
    }
  }, [caseId]);

  // Summaries
  const dishSummary = useMemo(() => getDishSummary(CANTEEN_DATASET), []);
  const timeSlotSummary = useMemo(() => getTimeSlotSummary(CANTEEN_DATASET), []);
  const funnelSummary = useMemo(() => getFunnelStepsSummary(), []);
  const dropReasonsSummary = useMemo(() => getDropOffReasonsSummary(), []);

  // Filtered dataset for table stage
  const filteredCanteen = useMemo(() => {
    return CANTEEN_DATASET.filter((row) => {
      if (slotFilter !== 'all' && row.time_slot !== slotFilter) return false;
      if (categoryFilter !== 'all' && row.category !== categoryFilter) return false;
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          row.order_id.toLowerCase().includes(q) ||
          row.dish.toLowerCase().includes(q) ||
          row.payment_method.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [slotFilter, categoryFilter, tableSearch]);

  const filteredFunnel = useMemo(() => {
    return TECHMART_FUNNEL_DATASET.filter((row) => {
      if (stepFilter !== 'all' && row.step_reached !== stepFilter) return false;
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          row.session_id.toLowerCase().includes(q) ||
          row.user_segment.toLowerCase().includes(q) ||
          row.drop_off_reason.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [stepFilter, tableSearch]);

  // Client dialogue questions
  const dialogueQuestions = isCase01
    ? [
        {
          q: 'Khách hàng thường bỏ rơi giỏ hàng ở bước nào nhiều nhất?',
          reply:
            'Theo thống kê sơ bộ của đội kỹ thuật, khách thêm sản phẩm vào giỏ rất đông (hơn 80%), nhưng cứ đến bước nhập thông tin nhận hàng và chuẩn bị bấm thanh toán là lượng truy cập rớt thẳng đứng!',
        },
        {
          q: 'Gần đây TechMart có thay đổi chính sách gì trên website không?',
          reply:
            'A! Bản cập nhật tuần trước, ban giám đốc quyết định tính phí vận chuyển cố định 50.000 đ cho mọi đơn hàng dưới 2 triệu, nhưng đội thiết kế lại để phí ship này hiện ra ở bước xác nhận cuối cùng thay vì báo trước ở trang giỏ hàng.',
        },
        {
          q: 'Về phương thức thanh toán thì các cổng có ghi nhận lỗi kỹ thuật không?',
          reply:
            'Cổng MoMo và VNPAY hoạt động khá ổn định. Thỉnh thoảng có vài khách báo mã OTP ngân hàng gửi về chậm, nhưng chỉ chiếm tỷ lệ nhỏ thôi.',
        },
      ]
    : [
        {
          q: 'Tại sao chú lại nghĩ có món "ế" và món "cháy hàng"?',
          reply:
            'Tôi thấy Cơm gà sốt teriyaki và Cơm rang dưa bò lúc nào học sinh cũng xếp hàng mua kín mít. Còn món Cơm chay với Salad gà chỉ lác đác vài bạn. Nhưng thú thật là mỗi sáng đầu bếp chuẩn bị bao nhiêu suất của từng món thì tôi lại không lưu vào máy tính, chỉ ghi lại các đơn đã tính tiền thôi!',
        },
        {
          q: 'Khung giờ nào tại căn tin là bận rộn nhất?',
          reply:
            'Rõ ràng là buổi trưa từ 11h đến 13h rồi! Học sinh nghỉ tiết là ùa vào như ong vỡ tổ. Buổi sáng thì chủ yếu các bạn ghé mua Bánh mì hoặc Phở bò ăn vội rồi vào lớp.',
        },
        {
          q: 'Về phương thức thanh toán thì các bạn sinh viên trả thế nào?',
          reply:
            'Hơn phân nửa là quét mã ví điện tử hoặc chuyển khoản ngân hàng rồi thám tử ơi, tiền mặt giờ chỉ còn chiếm khoảng một phần ba thôi.',
        },
      ];

  const handleAskQuestion = (idx: number) => {
    const item = dialogueQuestions[idx];
    setDialogueHistory((prev) => [
      ...prev,
      { speaker: 'player', text: item.q },
      { speaker: isCase01 ? 'mai_linh' : 'chu_ba', text: item.reply },
    ]);
    unlockAchievement('ach-npc-listener');
  };

  const handleSaveReportDraft = () => {
    saveReportDraft(caseId, reportForm);
  };

  const handleSubmitReport = () => {
    saveReportDraft(caseId, reportForm);
    submitCaseReport(caseId);
    setActiveStage(7);
  };

  // Run code handler for Case 01
  const handleExecuteCode = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setCodeExecuted(true);
    }, 600);
  };

  const stages = [
    { id: 1, label: '1. Hồ sơ vụ án', icon: FileText },
    { id: 2, label: '2. Thân chủ NPC', icon: MessageSquare },
    { id: 3, label: '3. Soi Dataset', icon: TableIcon },
    { id: 4, label: '4. Nhiệm vụ & Code', icon: CheckSquare },
    { id: 5, label: '5. Bảng manh mối', icon: Pin },
    { id: 6, label: '6. Bản báo cáo', icon: Send },
    { id: 7, label: '7. Đánh giá án', icon: Award },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Breadcrumb & Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#3A322C]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('case-files')}
              className="p-2 rounded-xl bg-[#1A1D24] border border-[#3A322C] text-[#9BA3AF] hover:text-white hover:bg-[#2A2421] transition cursor-pointer"
              aria-label="Quay lại Tủ hồ sơ vụ án"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40">
                  {caseData.code}
                </span>
                <span className="text-xs font-mono text-[#00E5FF]">
                  Giai đoạn {caseData.tier} • {caseData.category}
                </span>
                {progress.completed && (
                  <span className="text-xs font-bold font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> ĐÃ PHÁ ÁN
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {caseData.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveCaseId(caseId);
                setShowBoardOverlay(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2A2421] hover:bg-[#3A322C] text-[#E5A93C] text-xs font-bold border border-[#D4AF37]/50 transition cursor-pointer shadow-sm"
              title="Mở Bảng Điều Tra dạng cửa sổ nổi (giữ nguyên dữ liệu đang làm)"
            >
              <Pin className="w-3.5 h-3.5 text-[#C93B2B]" />
              <span>Bảng Điều Tra (Overlay)</span>
            </button>

            <button
              onClick={() => {
                setActiveCaseId(caseId);
                onNavigate('workspace');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1D24] text-[#EDE8DF] text-xs font-semibold border border-[#3A322C] hover:border-[#E5A93C] transition cursor-pointer"
            >
              <TableIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Workspace</span>
            </button>
          </div>
        </div>

        {/* 7-Stage Horizontal Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((stage) => {
            const Icon = stage.icon;
            const isActive = activeStage === stage.id;
            const isDone = stage.id < activeStage || progress.completed;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`flex items-center gap-2 p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E5A93C] border-[#E5A93C] text-[#121820] shadow-lg font-bold'
                    : isDone
                    ? 'bg-[#1A1D24] border-emerald-900/60 text-emerald-400 hover:bg-[#202630]'
                    : 'bg-[#15181F] border-[#2A2F38] text-[#9BA3AF] hover:text-white'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-[#121820] text-[#E5A93C]'
                      : isDone
                      ? 'bg-emerald-950/60 text-emerald-400'
                      : 'bg-[#1E232B] text-slate-500'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] truncate font-medium">{stage.label}</div>
                  <div className="text-[9px] font-mono opacity-80">
                    {isDone ? '✓ Đã qua' : isActive ? '● Đang làm' : 'Chưa qua'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* STAGE 1: CASE BACKGROUND & STORY */}
        {/* ========================================================= */}
        {activeStage === 1 && (
          <div className="bg-[#1A1D24] p-6 rounded-3xl border border-[#3A322C] shadow-xl space-y-6">
            <div className="border-b border-[#3A322C] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase">
                  GIAI ĐOẠN 1: TIẾP NHẬN HỒ SƠ & BỐI CẢNH VỤ ÁN
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {caseData.subtitle}
                </h2>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-xl bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40 w-fit">
                Ước tính: {caseData.estimatedMinutes} phút
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E5A93C]" />
                    <span>Cốt truyện & Tình huống thực tế</span>
                  </h3>
                  <p className="text-xs text-[#EDE8DF] leading-relaxed">
                    {caseData.story}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#00E5FF]" />
                    <span>Vấn đề cốt lõi cần điều tra</span>
                  </h3>
                  <p className="text-xs text-[#EDE8DF] leading-relaxed">
                    {caseData.problemStatement}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                    <span>Mục tiêu học tập nghiệp vụ</span>
                  </h3>
                  <ul className="space-y-1.5 text-xs text-[#EDE8DF]">
                    {caseData.learningObjectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sidebar Client Card */}
              <div className="p-5 rounded-2xl bg-[#2A2421]/60 border border-[#D4AF37]/40 space-y-4 h-fit">
                <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase block">
                  THÂN CHỦ VỤ ÁN
                </span>
                <div className="flex items-center gap-3">
                  <CharacterAvatar id={caseData.client.avatarKey as any} size="lg" />
                  <div>
                    <h4 className="text-base font-bold text-white">{caseData.client.name}</h4>
                    <p className="text-xs text-[#E5A93C] font-semibold">{caseData.client.role}</p>
                    <p className="text-[11px] text-[#9BA3AF]">{caseData.client.organization}</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#121820] border border-[#3A322C] text-xs text-[#9BA3AF]">
                  Thân chủ đang chờ bạn tại Phòng Hỏi Cung để cung cấp thêm thông tin bối cảnh.
                </div>

                <button
                  onClick={() => setActiveStage(2)}
                  className="w-full py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Gặp thân chủ (Bước 2)</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 2: CLIENT NPC DIALOGUE */}
        {/* ========================================================= */}
        {activeStage === 2 && (
          <div className="bg-[#1A1D24] p-6 rounded-3xl border border-[#3A322C] shadow-xl space-y-6">
            <div className="border-b border-[#3A322C] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase">
                  GIAI ĐOẠN 2: THU THẬP BỐI CẢNH TỪ THÂN CHỦ
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  Đối thoại cùng {caseData.client.name}
                </h2>
              </div>
              <CharacterAvatar id={caseData.client.avatarKey as any} size="md" />
            </div>

            {/* Chat Log History */}
            <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-3 min-h-[220px] max-h-[380px] overflow-y-auto">
              {dialogueHistory.map((item, idx) => {
                const isClient = item.speaker === (isCase01 ? 'mai_linh' : 'chu_ba');
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${isClient ? '' : 'flex-row-reverse'}`}
                  >
                    <CharacterAvatar
                      id={isClient ? (caseData.client.avatarKey as any) : 'player_detective'}
                      size="sm"
                    />
                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed shadow-sm ${
                        isClient
                          ? 'bg-[#1A1D24] text-white border border-[#3A322C]'
                          : 'bg-[#E5A93C] text-[#121820] font-semibold'
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Questions to Ask */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#9BA3AF] uppercase block">
                CÂU HỎI ĐIỀU TRA GỢI Ý CHO THÁM TỬ:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {dialogueQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleAskQuestion(i)}
                    className="p-3 rounded-xl bg-[#121820] border border-[#3A322C] hover:border-[#E5A93C] text-left text-xs text-[#EDE8DF] hover:text-white transition cursor-pointer flex items-center justify-between group"
                  >
                    <span className="line-clamp-2">{q.q}</span>
                    <ChevronRight className="w-4 h-4 text-[#9BA3AF] group-hover:text-[#E5A93C] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#3A322C]">
              <button
                onClick={() => setActiveStage(1)}
                className="text-xs text-[#9BA3AF] hover:text-white"
              >
                ← Quay lại bối cảnh
              </button>
              <button
                onClick={() => setActiveStage(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] text-xs font-bold shadow-md transition cursor-pointer"
              >
                <span>Bước 3: Khám phá Dataset</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 3: DATASET EXPLORATION */}
        {/* ========================================================= */}
        {activeStage === 3 && (
          <div className="bg-[#1A1D24] p-6 rounded-3xl border border-[#3A322C] shadow-xl space-y-6">
            <div className="border-b border-[#3A322C] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase">
                  GIAI ĐOẠN 3: SOI CHI TIẾT TẬP DỮ LIỆU THỰC TẾ
                </span>
                <h2 className="text-xl font-bold text-white mt-1">
                  {isCase01 ? 'Bảng Dữ Liệu 200 Phiên Mua Sắm TechMart' : 'Bảng 150 Đơn Hàng Căn Tin Đại Học'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveCaseId(caseId);
                  onNavigate('workspace');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2A2421] text-[#E5A93C] text-xs font-bold border border-[#D4AF37]/50 hover:bg-[#3A322C]"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Mở trong Workspace</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-56">
                  <Search className="w-4 h-4 text-[#9BA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Tìm kiếm dòng..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#1A1D24] border border-[#3A322C] text-white focus:outline-none focus:border-[#E5A93C]"
                  />
                </div>

                {!isCase01 ? (
                  <select
                    value={slotFilter}
                    onChange={(e) => setSlotFilter(e.target.value)}
                    className="bg-[#1A1D24] text-[#EDE8DF] px-3 py-1.5 rounded-xl border border-[#3A322C] focus:outline-none"
                  >
                    <option value="all">Mọi khung giờ</option>
                    <option value="Sáng">Sáng</option>
                    <option value="Trưa">Trưa</option>
                    <option value="Chiều">Chiều</option>
                  </select>
                ) : (
                  <select
                    value={stepFilter}
                    onChange={(e) => setStepFilter(e.target.value)}
                    className="bg-[#1A1D24] text-[#EDE8DF] px-3 py-1.5 rounded-xl border border-[#3A322C] focus:outline-none"
                  >
                    <option value="all">Mọi bước phễu</option>
                    <option value="1_xem_san_pham">1. Xem SP</option>
                    <option value="2_them_gio_hang">2. Thêm giỏ</option>
                    <option value="3_nhap_dia_chi">3. Nhập địa chỉ</option>
                    <option value="4_xac_nhan_thanh_toan">4. Xác nhận TT</option>
                    <option value="5_thanh_toan_thanh_cong">5. Mua thành công</option>
                  </select>
                )}
              </div>

              <div className="font-mono text-xs flex items-center gap-2 text-[#9BA3AF]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  Cuộn vô tận • Toàn bộ{' '}
                  <strong className="text-white">
                    {isCase01 ? filteredFunnel.length : filteredCanteen.length}
                  </strong>{' '}
                  bản ghi (Sticky Headers)
                </span>
              </div>
            </div>

            {/* Continuous Infinite Scroll Table */}
            <div className="overflow-x-auto overflow-y-auto max-h-[500px] rounded-2xl border border-[#3A322C] scrollbar-thin">
              {!isCase01 ? (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="sticky top-0 z-10 bg-[#121820] text-white border-b border-[#3A322C] shadow-md select-none">
                    <tr>
                      <th className="p-3 bg-[#121820]">order_id</th>
                      <th className="p-3 font-sans bg-[#121820]">dish (Món)</th>
                      <th className="p-3 font-sans bg-[#121820]">category</th>
                      <th className="p-3 text-center bg-[#121820]">quantity</th>
                      <th className="p-3 bg-[#121820]">unit_price</th>
                      <th className="p-3 bg-[#121820]">total_vnd</th>
                      <th className="p-3 bg-[#121820]">time_slot</th>
                      <th className="p-3 font-sans bg-[#121820]">payment_method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2F38] bg-[#1A1D24]">
                    {filteredCanteen.map((row) => (
                      <tr key={row.order_id} className="hover:bg-[#202630]">
                        <td className="p-3 font-bold text-[#E5A93C]">{row.order_id}</td>
                        <td className="p-3 font-sans text-white font-medium">{row.dish}</td>
                        <td className="p-3 font-sans text-[#9BA3AF]">{row.category}</td>
                        <td className="p-3 text-center font-bold text-[#00E5FF]">{row.quantity}</td>
                        <td className="p-3">{formatVND(row.unit_price_vnd)}</td>
                        <td className="p-3 font-bold text-emerald-400">{formatVND(row.total_vnd)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.time_slot === 'Trưa' ? 'bg-[#C93B2B]/20 text-[#C93B2B]' : 'bg-[#121820] text-[#EDE8DF]'
                            }`}
                          >
                            {row.time_slot}
                          </span>
                        </td>
                        <td className="p-3 font-sans text-[#9BA3AF]">{row.payment_method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs font-mono">
                  <thead className="sticky top-0 z-10 bg-[#121820] text-white border-b border-[#3A322C] shadow-md select-none">
                    <tr>
                      <th className="p-3 bg-[#121820]">session_id</th>
                      <th className="p-3 font-sans bg-[#121820]">user_segment</th>
                      <th className="p-3 font-sans bg-[#121820]">device</th>
                      <th className="p-3 bg-[#121820]">step_reached</th>
                      <th className="p-3 bg-[#121820]">cart_value</th>
                      <th className="p-3 bg-[#121820]">shipping_fee</th>
                      <th className="p-3 font-sans bg-[#121820]">drop_off_reason</th>
                      <th className="p-3 font-sans bg-[#121820]">payment_method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2A2F38] bg-[#1A1D24]">
                    {filteredFunnel.map((row) => (
                      <tr key={row.session_id} className="hover:bg-[#202630]">
                        <td className="p-3 font-bold text-[#E5A93C]">{row.session_id}</td>
                        <td className="p-3 font-sans text-white">{row.user_segment}</td>
                        <td className="p-3 font-sans text-[#9BA3AF]">{row.device}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.step_reached === '5_thanh_toan_thanh_cong'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : row.step_reached === '3_nhap_dia_chi'
                                ? 'bg-rose-500/20 text-rose-400'
                                : 'bg-[#121820] text-[#EDE8DF]'
                            }`}
                          >
                            {row.step_reached}
                          </span>
                        </td>
                        <td className="p-3">{formatVND(row.cart_value_vnd)}</td>
                        <td className="p-3 text-[#9BA3AF]">{formatVND(row.shipping_fee_vnd)}</td>
                        <td className="p-3 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              row.drop_off_reason === 'Sốc phí ship 50k bất ngờ'
                                ? 'text-rose-400 font-bold'
                                : row.drop_off_reason === 'Không có (Thành công)'
                                ? 'text-emerald-400'
                                : 'text-[#9BA3AF]'
                            }`}
                          >
                            {row.drop_off_reason}
                          </span>
                        </td>
                        <td className="p-3 font-sans text-[#9BA3AF]">{row.payment_method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#3A322C]">
              <button
                onClick={() => setActiveStage(2)}
                className="text-xs text-[#9BA3AF] hover:text-white"
              >
                ← Quay lại thân chủ
              </button>
              <button
                onClick={() => setActiveStage(4)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] text-xs font-bold shadow-md transition cursor-pointer"
              >
                <span>Bước 4: Thực hiện Nhiệm vụ Phân tích</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 4: INVESTIGATION TASKS & CODE SANDBOX */}
        {/* ========================================================= */}
        {activeStage === 4 && (
          <div className="space-y-6">
            {!isCase01 ? (
              // CASE 00 TASKS (Guided & Non-Obvious, with NPC Minh Khoa Hints)
              <div className="bg-[#1A1D24] p-6 rounded-3xl border border-[#3A322C] shadow-xl space-y-6">
                <div className="border-b border-[#3A322C] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase">
                      GIAI ĐOẠN 4: THỰC THI 5 NHIỆM VỤ PHÂN TÍCH QUAN SÁT
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">
                      Giải mã đơn hàng & Kiểm định giả thuyết Chú Ba
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[#00E5FF]">Cấp độ: Nhập môn (Không dùng code)</span>
                </div>

                {/* TASK 1: CẤU TRÚC BẢNG */}
                <div className="p-5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-[#E5A93C] text-[#121820] flex items-center justify-center font-mono font-bold text-xs">
                        1
                      </span>
                      <span>Nhiệm vụ 1: Nhận diện cấu trúc tập dữ liệu (Table Structure)</span>
                    </h3>
                    <button
                      onClick={() =>
                        setNpcHintModal({
                          taskTitle: 'Nhiệm vụ 1: Nhận diện cấu trúc bảng',
                          advice:
                            'Hãy nhớ: Mỗi dòng trong bảng đại diện cho một đơn vị đo lường độc lập (một lần giao dịch thành công). Còn mỗi cột là một biến số đo lường. Tập dữ liệu này đã được kiểm định từ 150 đơn hàng!',
                          analyticalFocus: 'Phân biệt giữa dòng (observation) và cột (feature/variable).',
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40 text-xs font-semibold hover:bg-[#3A322C]"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Gợi ý từ Minh Khoa</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#9BA3AF]">
                    Quan sát bảng dữ liệu ở Bước 3 và trả lời các câu hỏi sau để xác định bản chất đơn vị phân tích:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-[#1A1D24] rounded-xl border border-[#3A322C]">
                      <label className="font-semibold text-white block mb-1">
                        Mỗi dòng trong bảng đại diện cho đối tượng nào?
                      </label>
                      <select
                        value={progress.taskAnswers['task1_unit'] || ''}
                        onChange={(e) => saveTaskAnswer(caseId, 'task1_unit', e.target.value)}
                        className="w-full bg-[#121820] text-white p-2 rounded-lg border border-[#3A322C]"
                      >
                        <option value="">-- Chọn câu trả lời --</option>
                        <option value="dish">Một món ăn có trong thực đơn của trường</option>
                        <option value="order">Một đơn mua hàng độc lập đã thanh toán thành công</option>
                        <option value="student">Một sinh viên cụ thể trong trường đại học</option>
                      </select>
                    </div>

                    <div className="p-3 bg-[#1A1D24] rounded-xl border border-[#3A322C]">
                      <label className="font-semibold text-white block mb-1">
                        Biến số nào KHÔNG xuất hiện trong bảng dữ liệu này?
                      </label>
                      <select
                        value={progress.taskAnswers['task1_missing_col'] || ''}
                        onChange={(e) => saveTaskAnswer(caseId, 'task1_missing_col', e.target.value)}
                        className="w-full bg-[#121820] text-white p-2 rounded-lg border border-[#3A322C]"
                      >
                        <option value="">-- Chọn câu trả lời --</option>
                        <option value="time_slot">Khung giờ (time_slot)</option>
                        <option value="date">Ngày tháng giao dịch (order_date)</option>
                        <option value="payment">Phương thức thanh toán (payment_method)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* TASK 2: XẾP HẠNG MÓN ĂN */}
                <div className="p-5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-[#E5A93C] text-[#121820] flex items-center justify-center font-mono font-bold text-xs">
                        2
                      </span>
                      <span>Nhiệm vụ 2: Xác định món ăn bán chạy nhất & món ít lượt mua nhất</span>
                    </h3>
                    <button
                      onClick={() =>
                        setNpcHintModal({
                          taskTitle: 'Nhiệm vụ 2: Xếp hạng món ăn',
                          advice:
                            'Đừng chỉ đếm số đơn (order count)! Một đơn có thể đặt 2 hoặc 3 suất. Bạn cần tính tổng số suất phục vụ (Sum of quantity) để biết nhà bếp thực tế đã nấu và giao bao nhiêu suất ăn.',
                          analyticalFocus: 'Phép tính tổng (SUM) theo nhóm danh mục.',
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40 text-xs font-semibold hover:bg-[#3A322C]"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Gợi ý từ Minh Khoa</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#9BA3AF]">
                    Dựa trên việc cộng tổng số suất (Quantity) và số lượt đơn từ bảng 150 giao dịch:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-[#1A1D24] rounded-xl border border-[#3A322C]">
                      <label className="font-semibold text-white block mb-1">
                        Món ăn nào dẫn đầu về tổng số suất bán ra tại căn tin?
                      </label>
                      <select
                        value={progress.taskAnswers['task2_top'] || ''}
                        onChange={(e) => saveTaskAnswer(caseId, 'task2_top', e.target.value)}
                        className="w-full bg-[#121820] text-white p-2 rounded-lg border border-[#3A322C]"
                      >
                        <option value="">-- Chọn món ăn --</option>
                        <option value="com_ga">Cơm gà sốt teriyaki (39 suất - 26 đơn)</option>
                        <option value="banh_mi">Bánh mì thịt nướng</option>
                        <option value="pho_bo">Phở bò Hà Nội</option>
                        <option value="com_rang">Cơm rang dưa bò</option>
                      </select>
                    </div>

                    <div className="p-3 bg-[#1A1D24] rounded-xl border border-[#3A322C]">
                      <label className="font-semibold text-white block mb-1">
                        Món ăn ghi nhận số lượt đơn mua ít nhất trong tập dữ liệu:
                      </label>
                      <select
                        value={progress.taskAnswers['task2_bottom'] || ''}
                        onChange={(e) => saveTaskAnswer(caseId, 'task2_bottom', e.target.value)}
                        className="w-full bg-[#121820] text-white p-2 rounded-lg border border-[#3A322C]"
                      >
                        <option value="">-- Chọn món ăn --</option>
                        <option value="salad_ga">Salad gà ức áp chảo</option>
                        <option value="com_chay">Cơm chay nấm kho đậu hũ</option>
                        <option value="tra_dao">Trà đào cam sả</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* TASK 3: GIỜ CAO ĐIỂM */}
                <div className="p-5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-[#E5A93C] text-[#121820] flex items-center justify-center font-mono font-bold text-xs">
                        3
                      </span>
                      <span>Nhiệm vụ 3: Phân tích khung giờ cao điểm (Time Slot Breakdown)</span>
                    </h3>
                    <button
                      onClick={() =>
                        setNpcHintModal({
                          taskTitle: 'Nhiệm vụ 3: Khung giờ cao điểm',
                          advice:
                            'Hãy so sánh tổng doanh thu buổi Trưa với buổi Sáng và Chiều. Buổi trưa tạo ra hơn 48.5% doanh thu vì các món cơm chính có đơn giá cao (40.000 đ) tập trung vào giờ nghỉ trưa của sinh viên.',
                          analyticalFocus: 'So sánh phân phối doanh thu giữa các nhóm.',
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40 text-xs font-semibold hover:bg-[#3A322C]"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Gợi ý từ Minh Khoa</span>
                    </button>
                  </div>

                  <div className="p-3 bg-[#1A1D24] rounded-xl border border-[#3A322C] text-xs">
                    <label className="font-semibold text-white block mb-1">
                      Kết luận chính xác nhất về áp lực nhà bếp theo thời gian:
                    </label>
                    <div className="space-y-2 mt-2">
                      {[
                        {
                          id: 'even_distribution',
                          label: 'Doanh thu phân bổ đều đặn giữa cả 3 ca sáng, trưa, chiều.',
                        },
                        {
                          id: 'noon_overload',
                          label: 'Khung giờ Trưa (11h-13h) tạo ra gần một nửa doanh thu (48.5%) và áp lực nhà bếp đạt đỉnh vì đơn hàng dồn vào món chính.',
                        },
                      ].map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-[#121820] border border-[#3A322C] cursor-pointer hover:border-[#E5A93C]"
                        >
                          <input
                            type="radio"
                            name="task3"
                            checked={progress.taskAnswers['task3_slot'] === opt.id}
                            onChange={() => saveTaskAnswer(caseId, 'task3_slot', opt.id)}
                            className="text-[#E5A93C]"
                          />
                          <span className="text-white">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* TASK 4: KIỂM ĐỊNH TÍNH TOÀN VẸN */}
                <div className="p-5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-[#E5A93C] text-[#121820] flex items-center justify-center font-mono font-bold text-xs">
                        4
                      </span>
                      <span>Nhiệm vụ 4: Kiểm định tính toàn vẹn (Data Quality Audit)</span>
                    </h3>
                  </div>

                  <p className="text-xs text-[#9BA3AF]">
                    Kiểm tra 150 đơn hàng: Có đơn hàng nào bị lệch giữa công thức <code>total = quantity × unit_price</code> không?
                  </p>

                  <div className="p-3 bg-[#1A1D24] rounded-xl border border-[#3A322C] text-xs">
                    <select
                      value={progress.taskAnswers['task4_audit'] || ''}
                      onChange={(e) => saveTaskAnswer(caseId, 'task4_audit', e.target.value)}
                      className="w-full bg-[#121820] text-white p-2 rounded-lg border border-[#3A322C]"
                    >
                      <option value="">-- Chọn đánh giá --</option>
                      <option value="valid">100% bản ghi chuẩn xác, không có ô trống khuyết thiếu và khớp công thức số học</option>
                      <option value="corrupted">Có nhiều ô trống và sai lệch công thức tính tiền</option>
                    </select>
                  </div>
                </div>

                {/* TASK 5: TƯ DUY PHẢN BIỆN */}
                <div className="p-5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-lg bg-[#E5A93C] text-[#121820] flex items-center justify-center font-mono font-bold text-xs">
                        5
                      </span>
                      <span>Nhiệm vụ 5: Tư duy phản biện về ngụy biện quan sát (Critical Thinking)</span>
                    </h3>
                    <button
                      onClick={() =>
                        setNpcHintModal({
                          taskTitle: 'Nhiệm vụ 5: Ngụy biện quan sát đơn mua',
                          advice:
                            'Hãy cẩn trọng! Bảng dữ liệu này chỉ ghi lại những người ĐÃ MUA ĐƯỢC. Nếu mỗi sáng đầu bếp chỉ nấu 5 suất cơm chay, thì tối đa cũng chỉ bán được 5 suất! Bạn không thể khẳng định món đó "ế" nếu không biết số suất nấu ban đầu hay số người hỏi mua mà hết.',
                          analyticalFocus: 'Phân biệt giữa quan sát giao dịch và nhu cầu thực tế tiềm ẩn.',
                        })
                      }
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40 text-xs font-semibold hover:bg-[#3A322C]"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>Gợi ý từ Minh Khoa</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#9BA3AF] leading-relaxed">
                    Chú Ba muốn xóa món <strong>Cơm chay</strong> khỏi thực đơn vì chỉ thấy ghi nhận vài đơn hàng. Là một thám tử dữ liệu, bạn sẽ trả lời thế nào?
                  </p>

                  <div className="space-y-2 text-xs">
                    {[
                      {
                        id: 'agree_wrong',
                        text: 'Đồng ý cắt giảm ngay vì số đơn bán ra thấp là bằng chứng tuyệt đối cho thấy không ai thích ăn cơm chay.',
                      },
                      {
                        id: 'critical_correct',
                        text: 'Chưa nên cắt bỏ vội! Dữ liệu hiện tại KHÔNG có số suất nấu ban đầu hay số khách muốn mua nhưng hết món. Cần ghi nhận thêm tồn kho để kiểm chứng.',
                      },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition cursor-pointer ${
                          progress.taskAnswers['task5_hyp'] === opt.id
                            ? 'bg-[#2A2421] border-[#E5A93C] text-white'
                            : 'bg-[#1A1D24] border-[#3A322C] text-[#9BA3AF] hover:text-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="task5"
                          checked={progress.taskAnswers['task5_hyp'] === opt.id}
                          onChange={() => saveTaskAnswer(caseId, 'task5_hyp', opt.id)}
                          className="mt-0.5 text-[#E5A93C]"
                        />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // CASE 01 TASKS: INTRO TO BASIC CODING (PYTHON / SQL SANDBOX)
              <div className="bg-[#1A1D24] p-6 rounded-3xl border border-[#3A322C] shadow-xl space-y-6">
                <div className="border-b border-[#3A322C] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase">
                      GIAI ĐOẠN 4: THỰC THI NHIỆM VỤ VỚI CODE CƠ BẢN (PYTHON & SQL)
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">
                      Giải mã vết nứt phễu thanh toán TechMart Online
                    </h2>
                  </div>
                  <div className="flex items-center gap-1.5 p-1 bg-[#121820] rounded-xl border border-[#3A322C]">
                    <button
                      onClick={() => setCodeLanguage('python')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                        codeLanguage === 'python'
                          ? 'bg-[#E5A93C] text-[#121820]'
                          : 'text-[#9BA3AF] hover:text-white'
                      }`}
                    >
                      Python (Pandas)
                    </button>
                    <button
                      onClick={() => setCodeLanguage('sql')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                        codeLanguage === 'sql'
                          ? 'bg-[#E5A93C] text-[#121820]'
                          : 'text-[#9BA3AF] hover:text-white'
                      }`}
                    >
                      SQL Query
                    </button>
                  </div>
                </div>

                {/* Interactive Code Playground Sandbox */}
                <div className="rounded-2xl border-2 border-[#3A322C] bg-[#0E131A] overflow-hidden shadow-2xl">
                  {/* Code Editor Header */}
                  <div className="p-3 bg-[#161D26] border-b border-[#3A322C] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#00E5FF]" />
                      <span className="text-white font-bold">
                        {codeLanguage === 'python' ? 'funnel_analysis.py' : 'query_drop_off.sql'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveCodeSnippetId('funnel')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          activeCodeSnippetId === 'funnel'
                            ? 'bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/50'
                            : 'text-[#9BA3AF]'
                        }`}
                      >
                        Snippet 1: Đếm phễu
                      </button>
                      <button
                        onClick={() => setActiveCodeSnippetId('reasons')}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          activeCodeSnippetId === 'reasons'
                            ? 'bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/50'
                            : 'text-[#9BA3AF]'
                        }`}
                      >
                        Snippet 2: Nguyên nhân rớt
                      </button>

                      <button
                        onClick={handleExecuteCode}
                        disabled={isExecuting}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isExecuting ? 'Đang chạy...' : 'Chạy Code'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Snippet Display */}
                  <div className="p-4 bg-[#0A0E14] font-mono text-xs text-[#EDE8DF] overflow-x-auto leading-relaxed">
                    {activeCodeSnippetId === 'funnel' ? (
                      codeLanguage === 'python' ? (
                        <pre className="text-emerald-300">
{`# 1. Nạp thư viện và đọc dữ liệu 200 phiên
import pandas as pd
df = pd.read_csv('techmart_funnel.csv')

# 2. Gom nhóm theo chặng phễu người dùng (Funnel Steps)
funnel_counts = df['step_reached'].value_counts().sort_index()

# 3. Tính tỷ lệ chuyển đổi (%) so với ban đầu
conversion_rate = (funnel_counts / len(df)) * 100
print(pd.DataFrame({'So_Phien': funnel_counts, 'Ty_Le_%': conversion_rate}))`}
                        </pre>
                      ) : (
                        <pre className="text-cyan-300">
{`-- Thống kê số lượng phiên và tỷ lệ qua từng bước phễu
SELECT 
    step_reached,
    COUNT(session_id) AS so_phien,
    ROUND(COUNT(session_id) * 100.0 / 200, 1) AS ty_le_phan_tram
FROM techmart_funnel
GROUP BY step_reached
ORDER BY step_reached ASC;`}
                        </pre>
                      )
                    ) : codeLanguage === 'python' ? (
                      <pre className="text-amber-300">
{`# Lọc các phiên bị hủy (drop-off) và đếm nguyên nhân cốt lõi
dropped_sessions = df[df['step_reached'] != '5_thanh_toan_thanh_cong']
reasons_breakdown = dropped_sessions['drop_off_reason'].value_counts()

print("BẢNG XẾP HẠNG NGUYÊN NHÂN BỎ RƠI GIỎ HÀNG:")
print(reasons_breakdown)`}
                      </pre>
                    ) : (
                      <pre className="text-amber-300">
{`-- Truy vấn nguyên nhân người dùng rời bỏ giỏ hàng
SELECT 
    drop_off_reason,
    COUNT(session_id) AS so_luong_huy,
    ROUND(COUNT(session_id) * 100.0 / 148, 1) AS ty_le_nguyen_nhan
FROM techmart_funnel
WHERE drop_off_reason != 'Không có (Thành công)'
GROUP BY drop_off_reason
ORDER BY so_luong_huy DESC;`}
                      </pre>
                    )}
                  </div>

                  {/* Code Output Terminal Window */}
                  {codeExecuted && (
                    <div className="p-4 bg-[#121820] border-t border-[#3A322C] font-mono text-xs space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>KẾT QUẢ TRUY VẤN DỮ LIỆU (OUTPUT CONSOLE):</span>
                      </div>

                      {activeCodeSnippetId === 'funnel' ? (
                        <div className="overflow-x-auto rounded-lg border border-[#3A322C] bg-[#161D26]">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#1A232E] text-[#E5A93C]">
                              <tr>
                                <th className="p-2">Chặng phễu</th>
                                <th className="p-2 text-center">Số phiên còn lại</th>
                                <th className="p-2 text-center">Tỷ lệ so với đầu vào</th>
                                <th className="p-2 text-right">Rơi rớt ở chặng này</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2F38] text-white">
                              {funnelSummary.map((s) => (
                                <tr key={s.step} className="hover:bg-[#1E2734]">
                                  <td className="p-2 font-medium">{s.stepName}</td>
                                  <td className="p-2 text-center font-bold text-emerald-400">{s.count}</td>
                                  <td className="p-2 text-center">{s.pctOfTotal.toFixed(1)}%</td>
                                  <td className="p-2 text-right font-bold text-rose-400">
                                    {s.dropOffCount > 0 ? `-${s.dropOffCount} phiên` : '0'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-lg border border-[#3A322C] bg-[#161D26]">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#1A232E] text-[#E5A93C]">
                              <tr>
                                <th className="p-2">Nguyên nhân bỏ rơi</th>
                                <th className="p-2 text-center">Số phiên bỏ cuộc</th>
                                <th className="p-2 text-right">Tỷ lệ trên tổng số đơn hủy</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#2A2F38] text-white">
                              {dropReasonsSummary.map((r) => (
                                <tr key={r.reason} className="hover:bg-[#1E2734]">
                                  <td className="p-2 font-medium">{r.reason}</td>
                                  <td className="p-2 text-center font-bold text-rose-400">{r.count}</td>
                                  <td className="p-2 text-right font-mono">{r.percentage.toFixed(1)}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Case 01 Analytical Questions based on Code */}
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-2">
                    <label className="text-xs font-bold text-white block">
                      1. Từ kết quả code đếm phễu, "Vết nứt" lớn nhất làm mất nhiều khách hàng nhất nằm ở đâu?
                    </label>
                    <select
                      value={progress.taskAnswers['c1_bottleneck'] || ''}
                      onChange={(e) => saveTaskAnswer(caseId, 'c1_bottleneck', e.target.value)}
                      className="w-full bg-[#1A1D24] text-white p-2.5 rounded-xl border border-[#3A322C] text-xs font-mono"
                    >
                      <option value="">-- Chọn chặng phễu rò rỉ --</option>
                      <option value="step1_to_2">Từ Xem sản phẩm sang Thêm vào giỏ (Rớt 36 phiên)</option>
                      <option value="step3_to_4">
                        Từ Nhập địa chỉ sang Xác nhận thanh toán (Rớt tới 70 phiên - Vết nứt chính!)
                      </option>
                      <option value="step4_to_5">Từ Xác nhận thanh toán sang Hoàn tất (Rớt 16 phiên)</option>
                    </select>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-2">
                    <label className="text-xs font-bold text-white block">
                      2. Nguyên nhân cốt lõi khiến 70 khách hàng dừng lại ở bước nhập địa chỉ là gì?
                    </label>
                    <select
                      value={progress.taskAnswers['c1_root_cause'] || ''}
                      onChange={(e) => saveTaskAnswer(caseId, 'c1_root_cause', e.target.value)}
                      className="w-full bg-[#1A1D24] text-white p-2.5 rounded-xl border border-[#3A322C] text-xs font-mono"
                    >
                      <option value="">-- Chọn nguyên nhân --</option>
                      <option value="shipping_surprise">
                        Sốc phí ship 50.000 đ hiện lên bất ngờ ở bước cuối mà không báo trước tại giỏ hàng (Chiếm 62% đơn hủy)
                      </option>
                      <option value="otp_bank_error">Lỗi cổng thanh toán OTP ngân hàng</option>
                      <option value="price_expensive">Giá sản phẩm gốc quá đắt</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#3A322C]">
              <button
                onClick={() => setActiveStage(3)}
                className="text-xs text-[#9BA3AF] hover:text-white"
              >
                ← Quay lại xem dữ liệu
              </button>
              <button
                onClick={() => setActiveStage(5)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] text-xs font-bold shadow-md transition cursor-pointer"
              >
                <span>Bước 5: Ghim Manh Mối Lên Bảng Điều Tra</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 5: DETECTIVE BOARD OVERLAY QUICK PREVIEW */}
        {/* ========================================================= */}
        {activeStage === 5 && (
          <div className="bg-[#1A1D24] text-white p-6 rounded-3xl border border-[#3A322C] shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#3A322C] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C93B2B] shadow-[0_0_8px_rgba(201,59,43,0.8)] animate-pulse" />
                  <span className="text-xs font-mono font-bold text-[#E5A93C] uppercase tracking-wider">
                    GIAI ĐOẠN 5: BẢNG MANH MỐI & CHỨNG CỨ DÂY CHỈ ĐỎ
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  Tập hợp chứng cứ & Ghim chỉ đỏ suy luận
                </h2>
                <p className="text-xs text-[#9BA3AF] mt-0.5">
                  Bảng điều tra ghim nút bần giúp hệ thống hóa toàn bộ các phát hiện trước khi viết báo cáo.
                </p>
              </div>

              {/* SAFE ROUTING: Fullscreen Modal Overlay (Zero State Loss!) */}
              <button
                onClick={() => {
                  setActiveCaseId(caseId);
                  setShowBoardOverlay(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C93B2B] to-[#991B1B] hover:from-[#d64535] hover:to-[#b91c1c] text-white text-xs font-bold shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Pin className="w-4 h-4 text-[#E5A93C]" />
                <span>Mở Toàn Màn Hình Bảng Điều Tra (Không Mất Dữ Liệu)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>

            {/* Corkboard preview cards */}
            <div className="p-4 rounded-2xl corkboard-texture border-2 border-[#2A2421] shadow-inner grid grid-cols-1 md:grid-cols-3 gap-4">
              {!isCase01 ? (
                <>
                  <div className="p-4 rounded-xl bg-[#FFFDF7] text-[#121820] shadow-md border-t-4 border-[#C93B2B] space-y-2 relative transform -rotate-1">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#C93B2B] shadow-md border border-white" />
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#C93B2B] pt-1">
                      <span>CHỨNG CỨ #01</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-[#C93B2B]">Xếp hạng</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#121820]">Cơm gà sốt teriyaki dẫn đầu</h3>
                    <p className="text-xs text-[#52677F] leading-relaxed">
                      26 lượt đơn (39 suất), tổng thu hơn 1.560.000 đ. Dẫn đầu thực đơn căn tin.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFFDF7] text-[#121820] shadow-md border-t-4 border-[#E5A93C] space-y-2 relative transform rotate-1">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#E5A93C] shadow-md border border-white" />
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#E5A93C] pt-1">
                      <span>CHỨNG CỨ #02</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Cao điểm</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#121820]">Giờ Trưa chiếm 48.5% doanh thu</h3>
                    <p className="text-xs text-[#52677F] leading-relaxed">
                      Áp lực nhà bếp đạt đỉnh từ 11h-13h. Các món cơm chính chiếm đa số doanh thu.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFFDF7] text-[#121820] shadow-md border-t-4 border-[#00E5FF] space-y-2 relative transform -rotate-0.5">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00E5FF] shadow-md border border-white" />
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#00838F] pt-1">
                      <span>GIẢ THUYẾT #01</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-[#00838F]">Phản biện</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#121820]">Chưa đủ căn cứ xóa món Cơm chay</h3>
                    <p className="text-xs text-[#52677F] leading-relaxed">
                      Cần theo dõi số suất nấu ban đầu và số suất tồn cuối ngày để tránh ngụy biện quan sát.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-xl bg-[#FFFDF7] text-[#121820] shadow-md border-t-4 border-[#C93B2B] space-y-2 relative transform -rotate-1">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#C93B2B] shadow-md border border-white" />
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#C93B2B] pt-1">
                      <span>VẾT NỨT PHỄU</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-100 text-[#C93B2B]">Drop-off 50.7%</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#121820]">Chặng Nhập địa chỉ -&gt; Thanh toán</h3>
                    <p className="text-xs text-[#52677F] leading-relaxed">
                      138 phiên vào bước 3 nhưng chỉ 68 phiên vào bước 4. Mất tới 70 khách hàng tiềm năng!
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFFDF7] text-[#121820] shadow-md border-t-4 border-[#E5A93C] space-y-2 relative transform rotate-1">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#E5A93C] shadow-md border border-white" />
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#E5A93C] pt-1">
                      <span>NGUYÊN NHÂN</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">Chiếm 62%</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#121820]">Phí ship 50.000 đ hiện bất ngờ</h3>
                    <p className="text-xs text-[#52677F] leading-relaxed">
                      Khách hàng cảm thấy bị lừa gạt khi phí vận chuyển không được thông báo từ đầu trang giỏ.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FFFDF7] text-[#121820] shadow-md border-t-4 border-[#00E5FF] space-y-2 relative transform -rotate-0.5">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#00E5FF] shadow-md border border-white" />
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#00838F] pt-1">
                      <span>KHUYẾN NGHỊ</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-[#00838F]">Tăng trưởng</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#121820]">Hiển thị phí ship minh bạch</h3>
                    <p className="text-xs text-[#52677F] leading-relaxed">
                      Hoặc gắn thanh tiến trình "Mua thêm 150k để FreeShip" để kích thích tăng AOV.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#3A322C]">
              <button
                onClick={() => setActiveStage(4)}
                className="text-xs text-[#9BA3AF] hover:text-white"
              >
                ← Quay lại nhiệm vụ
              </button>
              <button
                onClick={() => setActiveStage(6)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-[#121820] text-xs font-bold shadow-lg transition cursor-pointer"
              >
                <span>Bước 6: Soạn Báo Cáo Tuyệt Mật (Dossier)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 6: PHYSICAL PAPER DOSSIER INVESTIGATION REPORT */}
        {/* ========================================================= */}
        {activeStage === 6 && (
          <div className="space-y-6">
            {/* Vintage Confidential Paper Dossier Sheet */}
            <div className="paper-dossier p-6 sm:p-10 rounded-3xl border-2 border-[#8C7860] shadow-2xl space-y-8 relative overflow-hidden font-serif">
              {/* Top Dossier Header with Official Rubber Stamps */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-[#1F1D1A]/30">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#8C2818] tracking-widest uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C93B2B]" />
                    <span>CƠ QUAN ĐIỀU TRA DỮ LIỆU TRUNG TÂM • DOSSIER REPORT</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1F1D1A] tracking-tight mt-1">
                    BẢN BÁO CÁO KẾT QUẢ PHÁ ÁN
                  </h2>
                  <p className="text-xs font-mono text-[#5A5248] mt-0.5">
                    Mã thụ lý: {caseData.code} • Thân chủ: {caseData.client.name} • Ngày thụ lý: 31/10/2026
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="stamp-classified">
                    TUYỆT MẬT / CLASSIFIED
                  </div>
                  <span className="text-[10px] font-mono text-[#5A5248]">
                    LƯU TRỮ VĨNH VIỄN
                  </span>
                </div>
              </div>

              {/* SECTIONS IN TYPEWRITER DOSSIER FORMAT */}
              <div className="space-y-6 font-sans">
                {/* SECTION I: CORE FINDINGS */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8C2818] uppercase">
                      MỤC I. PHÁT HIỆN CỐT LÕI (CORE FINDINGS)
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5248] italic font-serif">
                    Mô tả phát hiện định lượng quan trọng nhất rút ra từ tập dữ liệu:
                  </p>
                  <textarea
                    rows={3}
                    value={reportForm.finding1}
                    onChange={(e) => {
                      const updated = { ...reportForm, finding1: e.target.value };
                      setReportForm(updated);
                      saveReportDraft(caseId, updated);
                    }}
                    placeholder="Gõ kết luận chính tại đây..."
                    className="w-full p-3 rounded-xl typewriter-input text-xs"
                  />
                </div>

                {/* SECTION II: NUMERICAL EVIDENCE */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8C2818] uppercase">
                      MỤC II. CĂN CỨ SỐ LIỆU & BẰNG CHỨNG (NUMERICAL EVIDENCE)
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5248] italic font-serif">
                    Dẫn chứng số liệu, tỷ lệ %, số lượng đơn/phiên chứng minh phát hiện trên:
                  </p>
                  <textarea
                    rows={3}
                    value={reportForm.evidence1}
                    onChange={(e) => {
                      const updated = { ...reportForm, evidence1: e.target.value };
                      setReportForm(updated);
                      saveReportDraft(caseId, updated);
                    }}
                    placeholder="Dẫn chứng số liệu cụ thể..."
                    className="w-full p-3 rounded-xl typewriter-input text-xs"
                  />
                </div>

                {/* SECTION III: OPEN QUESTIONS & LIMITATIONS */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8C2818] uppercase">
                      MỤC III. CÂU HỎI MỞ & GIỚI HẠN DỮ LIỆU (DATA LIMITATIONS & CONFOUNDERS)
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5248] italic font-serif">
                    Biến số nào chưa được ghi nhận trong tập dữ liệu khiến ta không thể kết luận vội vàng?
                  </p>
                  <textarea
                    rows={3}
                    value={reportForm.furtherQuestion}
                    onChange={(e) => {
                      const updated = { ...reportForm, furtherQuestion: e.target.value };
                      setReportForm(updated);
                      saveReportDraft(caseId, updated);
                    }}
                    placeholder="Chỉ ra các giới hạn dữ liệu và biến ẩn..."
                    className="w-full p-3 rounded-xl typewriter-input text-xs"
                  />
                </div>

                {/* SECTION IV: ACTIONABLE RECOMMENDATIONS */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#8C2818] uppercase">
                      MỤC IV. KHUYẾN NGHỊ HÀNH ĐỘNG DOANH NGHIỆP (ACTIONABLE PROPOSALS)
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5248] italic font-serif">
                    Đề xuất bước giải quyết thực tế tiếp theo cho thân chủ dựa trên kết quả điều tra:
                  </p>
                  <textarea
                    rows={3}
                    value={reportForm.recommendation}
                    onChange={(e) => {
                      const updated = { ...reportForm, recommendation: e.target.value };
                      setReportForm(updated);
                      saveReportDraft(caseId, updated);
                    }}
                    placeholder="Đề xuất hành động kinh doanh..."
                    className="w-full p-3 rounded-xl typewriter-input text-xs"
                  />
                </div>
              </div>

              {/* Dossier Sign-Off Footer */}
              <div className="pt-6 border-t-2 border-[#1F1D1A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1 text-xs font-mono">
                  <div className="text-[#5A5248]">Thám tử phụ trách:</div>
                  <div className="font-bold text-[#1F1D1A] font-serif text-sm italic">
                    Alex Nguyễn (Junior Data Detective)
                  </div>
                  <div className="text-[10px] text-emerald-800 font-semibold">
                    ✓ Đã xác thực chữ ký số nghiệp vụ
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="stamp-approved">
                    ĐÃ PHÊ DUYỆT • APPROVED
                  </div>
                  <button
                    onClick={handleSubmitReport}
                    className="px-6 py-3 rounded-xl bg-[#C93B2B] hover:bg-[#A8281B] text-white text-xs font-bold font-sans shadow-xl transition cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>NỘP BÁO CÁO CHÍNH THỨC</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STAGE 7: EVALUATION & REPORT REVIEW (HOANG MINH DEBRIEF) */}
        {/* ========================================================= */}
        {activeStage === 7 && (() => {
          const benchmark =
            CASE_BENCHMARK_SOLUTIONS[caseId] || CASE_BENCHMARK_SOLUTIONS['case-00'];
          const submitted = progress.submittedReport || reportForm;

          return (
            <div className="bg-[#1A1D24] p-6 sm:p-8 rounded-3xl border border-[#3A322C] shadow-2xl space-y-8">
              {/* Top Victory Header */}
              <div className="text-center max-w-xl mx-auto space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-[#2A2421] border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#E5A93C] shadow-xl">
                  <Award className="w-8 h-8 animate-bounce" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>KẾT QUẢ ĐÃ PHÊ DUYỆT • CHUYỂN LƯU HỒ SƠ</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  ĐÁNH GIÁ CHUYÊN MÔN & ĐỐI SOÁT BÁO CÁO
                </h2>
                <p className="text-xs text-[#9BA3AF] leading-relaxed">
                  Trưởng phòng Hoàng Minh đã hoàn thành phiên đối soát kỹ thuật giữa báo cáo của thám tử và giải pháp chuẩn mực của cơ quan.
                </p>
              </div>

              {/* Performance Summary Banner */}
              <div className="p-5 rounded-2xl bg-[#121820] border border-[#3A322C] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#3A322C]">
                  <div className="flex items-center gap-3">
                    <CharacterAvatar id="hoang_minh" size="lg" />
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Trưởng phòng Hoàng Minh
                      </h3>
                      <p className="text-xs text-[#E5A93C] font-mono">
                        Chỉ huy Cơ quan Điều tra Dữ liệu Trung tâm
                      </p>
                      <p className="text-[11px] text-[#9BA3AF]">
                        Đối soát kỹ thuật cho Vụ án {caseData.code}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-[#9BA3AF] uppercase">
                        Xếp loại nghiệp vụ:
                      </div>
                      <div className="text-base font-black text-emerald-400 font-mono">
                        GRADE A+ (XUẤT SẮC)
                      </div>
                    </div>
                    <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] text-[#121820] font-black text-xs font-mono">
                      +{caseData.expReward} EXP
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#1A1D24] text-xs sm:text-sm text-[#EDE8DF] leading-relaxed italic border border-[#3A322C]">
                  “Thám tử đã thể hiện năng lực điều tra dữ liệu vượt trội. Bạn không chỉ dừng lại ở các con số thống kê bề nổi mà còn bóc tách được các biến ẩn và rủi ro nhận định sai lầm. Dưới đây là phân tích kỹ thuật chi tiết để bạn nâng cao nghiệp vụ.”
                </div>
              </div>

              {/* PART 1: SIDE-BY-SIDE COMPARISON PANEL */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#3A322C]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5A93C]" />
                    <h3 className="text-base font-bold text-white">
                      Bảng Đối Soát Song Song (Side-by-Side Comparison)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#E5A93C] bg-[#2A2421] px-2.5 py-1 rounded-lg border border-[#3A322C]">
                    Độ trùng khớp luận điểm: 94%
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
                  {/* Left Column: Player's Submitted Report */}
                  <div className="rounded-2xl bg-[#151921] border border-[#3A322C] p-5 space-y-4 shadow-inner">
                    <div className="flex items-center justify-between pb-3 border-b border-[#2A2F38]">
                      <div className="flex items-center gap-2">
                        <CharacterAvatar id="player_detective" size="sm" />
                        <div>
                          <div className="font-bold text-white">Báo Cáo Của Thám Tử</div>
                          <div className="text-[10px] text-[#9BA3AF] font-mono">
                            Đã nộp vào {submitted.submittedAt || 'Hôm nay'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-[#E5A93C] border border-[#E5A93C]/30">
                        Bản Phá Án Thực Tế
                      </span>
                    </div>

                    {/* Section 1 */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#E5A93C] block uppercase">
                        I. Phát hiện cốt lõi (Core Finding):
                      </span>
                      <p className="text-[#EDE8DF] leading-relaxed p-2.5 rounded-xl bg-[#1A1D24] border border-[#2A2F38]">
                        {submitted.finding1 || 'Chưa điền thông tin phát hiện.'}
                      </p>
                    </div>

                    {/* Section 2 */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#E5A93C] block uppercase">
                        II. Bằng chứng số liệu (Numerical Evidence):
                      </span>
                      <p className="text-[#EDE8DF] leading-relaxed p-2.5 rounded-xl bg-[#1A1D24] border border-[#2A2F38]">
                        {submitted.evidence1 || 'Chưa cung cấp dẫn chứng số liệu.'}
                      </p>
                    </div>

                    {/* Section 3 */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#E5A93C] block uppercase">
                        III. Câu hỏi mở & Giới hạn dữ liệu (Confounders):
                      </span>
                      <p className="text-[#EDE8DF] leading-relaxed p-2.5 rounded-xl bg-[#1A1D24] border border-[#2A2F38]">
                        {submitted.furtherQuestion || 'Chưa ghi nhận biến số ẩn.'}
                      </p>
                    </div>

                    {/* Section 4 */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#E5A93C] block uppercase">
                        IV. Khuyến nghị hành động (Recommendations):
                      </span>
                      <p className="text-[#EDE8DF] leading-relaxed p-2.5 rounded-xl bg-[#1A1D24] border border-[#2A2F38]">
                        {submitted.recommendation || 'Chưa đề xuất giải pháp.'}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Hoang Minh's Official Benchmark */}
                  <div className="rounded-2xl bg-[#18202B] border-2 border-[#D4AF37]/50 p-5 space-y-4 shadow-lg shadow-[#D4AF37]/5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#2A3B4D]">
                      <div className="flex items-center gap-2">
                        <CharacterAvatar id="hoang_minh" size="sm" />
                        <div>
                          <div className="font-bold text-[#D4AF37]">
                            Đáp Án Chuẩn Mực • Trưởng Phòng
                          </div>
                          <div className="text-[10px] text-[#00E5FF] font-mono">
                            Căn cứ lý thuyết khoa học dữ liệu
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                        BENCHMARK SOLUTION
                      </span>
                    </div>

                    {/* Official 1 */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#D4AF37] block uppercase">
                        I. Phát hiện cốt lõi (Benchmark):
                      </span>
                      <p className="text-[#EDE8DF] leading-relaxed p-2.5 rounded-xl bg-[#121A24] border border-[#2A3B4D]">
                        {benchmark.officialReport.finding1}
                      </p>
                    </div>

                    {/* Official 2 */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#D4AF37] block uppercase">
                        II. Bằng chứng số liệu (Benchmark):
                      </span>
                      <p className="text-[#EDE8DF] leading-relaxed p-2.5 rounded-xl bg-[#121A24] border border-[#2A3B4D]">
                        {benchmark.officialReport.evidence1}
                      </p>
                    </div>

                    {/* Official 3 */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#D4AF37] block uppercase">
                        III. Giới hạn & Biến ẩn (Benchmark):
                      </span>
                      <p className="text-[#EDE8DF] leading-relaxed p-2.5 rounded-xl bg-[#121A24] border border-[#2A3B4D]">
                        {benchmark.officialReport.furtherQuestion}
                      </p>
                    </div>

                    {/* Official 4 */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-bold text-[#D4AF37] block uppercase">
                        IV. Khuyến nghị doanh nghiệp (Benchmark):
                      </span>
                      <p className="text-[#EDE8DF] leading-relaxed p-2.5 rounded-xl bg-[#121A24] border border-[#2A3B4D]">
                        {benchmark.officialReport.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PART 2: TECHNICAL DEBRIEF - CORE DATA SCIENCE CONCEPTS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#3A322C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
                  <h3 className="text-base font-bold text-white">
                    Trọng Tâm Kiến Thức Khoa Học Dữ Liệu (Core DS Concepts)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {benchmark.coreConcepts.map((concept, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#151D26] border border-[#2A3B4D] hover:border-[#00E5FF]/60 transition space-y-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#00E5FF]">
                        <span>NGHIỆP VỤ 0{idx + 1}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                      </div>
                      <h4 className="font-bold text-white text-sm">{concept.title}</h4>
                      <p className="text-[#9BA3AF] leading-relaxed">
                        {concept.description}
                      </p>
                      <div className="p-2.5 rounded-xl bg-[#0D151F] border border-[#233547] text-[11px] text-[#E5A93C] font-mono">
                        💡 <strong>Ghi nhớ:</strong> {concept.keyTakeaway}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PART 3: STEP-BY-STEP ANALYTICAL ROADMAP */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#3A322C]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                  <h3 className="text-base font-bold text-white">
                    Quy Trình Tư Duy Phân Tích Chuẩn Mực (Step-by-Step Logic)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {benchmark.idealApproachSteps.map((stepItem) => (
                    <div
                      key={stepItem.step}
                      className="p-4 rounded-2xl bg-[#171A21] border border-[#3A322C] space-y-2 text-xs relative overflow-hidden"
                    >
                      <div className="w-7 h-7 rounded-xl bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/40 flex items-center justify-center font-mono font-bold">
                        {stepItem.step}
                      </div>
                      <h4 className="font-bold text-white text-xs">{stepItem.title}</h4>
                      <p className="text-[#9BA3AF] leading-relaxed text-[11px]">
                        {stepItem.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-[#3A322C]">
                <button
                  onClick={() => onNavigate('case-files')}
                  className="px-5 py-2.5 rounded-xl bg-[#2A2421] hover:bg-[#3A322C] text-xs font-bold text-[#E5A93C] border border-[#D4AF37]/50 transition cursor-pointer"
                >
                  Trở Về Tủ Hồ Sơ 19 Vụ
                </button>
                <button
                  onClick={() => onNavigate('workspace')}
                  className="px-5 py-2.5 rounded-xl bg-[#151D26] hover:bg-[#202B38] text-xs font-bold text-[#00E5FF] border border-[#00E5FF]/40 transition cursor-pointer"
                >
                  Mở Dataset Workspace
                </button>
                <button
                  onClick={() => onNavigate('office')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-xs font-bold text-[#121820] shadow-lg transition cursor-pointer"
                >
                  Về Văn Phòng Chỉ Huy
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ========================================================= */}
      {/* SAFE ROUTING: FULLSCREEN DETECTIVE BOARD MODAL OVERLAY */}
      {/* ========================================================= */}
      {showBoardOverlay && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#121820] flex flex-col justify-between animate-in fade-in duration-200">
          <DetectiveBoardPage
            initialCaseId={caseId}
            isModalOverlay={true}
            onCloseModal={() => setShowBoardOverlay(false)}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* NPC MINH KHOA INTERACTIVE ADVICE MODAL (FOR CASE 00) */}
      {/* ========================================================= */}
      {npcHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-[#1A1D24] border-2 border-[#E5A93C] p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#3A322C]">
              <div className="flex items-center gap-3">
                <CharacterAvatar id="minh_khoa" size="md" />
                <div>
                  <h3 className="text-sm font-bold text-white">Thám tử Minh Khoa</h3>
                  <p className="text-[11px] text-[#00E5FF]">Cố vấn Phương pháp Phân tích</p>
                </div>
              </div>
              <button
                onClick={() => setNpcHintModal(null)}
                className="p-1 rounded-lg text-[#9BA3AF] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="font-semibold text-[#E5A93C] font-mono">
              {npcHintModal.taskTitle}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#121820] border border-[#3A322C] text-[#EDE8DF] leading-relaxed italic">
              “{npcHintModal.advice}”
            </div>

            <div className="p-3 rounded-xl bg-[#2A2421]/60 border border-[#D4AF37]/30 text-[#9BA3AF]">
              <strong className="text-[#E5A93C] block mb-0.5 font-mono text-[11px]">
                TRỌNG TÂM TƯ DUY:
              </strong>
              {npcHintModal.analyticalFocus}
            </div>

            <button
              onClick={() => setNpcHintModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D4AF37] text-[#121820] font-bold transition cursor-pointer"
            >
              Đã hiểu, tiếp tục điều tra!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
