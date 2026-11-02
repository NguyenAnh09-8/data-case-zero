import React, { createContext, useContext, useEffect, useState } from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import { DEFAULT_CASE_CONNECTIONS, DEFAULT_CASE_NODES } from '../data/boardData';
import { CASE_FILES } from '../data/cases';
import {
  Achievement,
  BoardConnection,
  BoardNode,
  CaseFile,
  CaseProgressState,
  DetectiveNote,
  InventoryItem,
  InvestigationReport,
  ThemeStyle,
  UserProfile,
} from '../types';
import { isCaseUnlockedPure, generateDetectiveBadgeId } from '../utils/progressionLogic';

const STORAGE_KEY = 'DATA_CASE_ZERO_STATE_V2';

const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Nguyễn',
  codeName: 'Detective-07',
  badgeNumber: 'DCZ-9402',
  avatar: 'player_detective',
  gender: 'male',
  title: 'Thám tử Tập sự',
  level: 1,
  currentExp: 120,
  nextLevelExp: 500,
  joinedDate: '31/10/2026',
  streakDays: 4,
  accuracyRate: 94,
  totalStudyMinutes: 85,
  isAuthenticated: true,
  authProvider: 'guest',
  email: 'alex.nguyen@data-agency.vn',
  onboardingCompleted: true,
  unlockedHotspots: ['desk', 'corkboard', 'cabinet', 'workspace', 'achievements', 'chatbot'],
  aiAssistantName: 'DataHound AI',
};

const INITIAL_REPORT: InvestigationReport = {
  finding1: 'Cơm gà sốt teriyaki và Cơm rang dưa bò là 2 món được mua nhiều nhất (chiếm hơn 30% tổng suất mua trong kỳ).',
  evidence1: 'Bảng tổng hợp thống kê cho thấy Cơm gà sốt teriyaki ghi nhận 26 lượt đặt (40 suất), Cơm rang dưa bò ghi nhận 25 lượt (35 suất).',
  finding2: 'Khung giờ Trưa là giờ cao điểm áp đảo cả về số lượng món bán ra lẫn tổng doanh thu (chiếm hơn 48.5% doanh thu toàn căn tin).',
  evidence2: 'Doanh thu buổi Trưa vượt trội so với Sáng và Chiều gộp lại; 71/150 đơn hàng dồn vào khung 11h-13h.',
  furtherQuestion: 'Liệu các món có số lượng mua thấp như Salad gà hay Cơm chay là do nhu cầu sinh viên thấp, hay do nhà bếp nấu ít suất và đã hết hàng từ sớm?',
  recommendation: 'Cần bổ sung sổ theo dõi số suất nấu ban đầu và số suất tồn/hết hàng để xác định chính xác nhu cầu thực tế trước khi cắt giảm món.',
};

const INITIAL_CASE_00_PROGRESS: CaseProgressState = {
  currentTask: 1,
  taskAnswers: {
    task1_rows: '150',
    task1_cols: '8',
    task1_obs_concept: 'row',
    task2_top_dish: 'Cơm gà sốt teriyaki',
    task2_least_dish: 'Bún chả',
    task3_peak_slot: 'Trưa',
    task3_reasoning: 'Sinh viên và giảng viên tập trung ăn bữa chính vào giờ nghỉ trưa giữa ca học.',
    task4_math_verified: 'true',
    task4_missing_values: '0',
    task5_hypothesis_valid: 'limited_stock',
  },
  reportDraft: INITIAL_REPORT,
  completed: false,
};

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'item-cheat-1',
    name: 'Bản Tra Cứu Biến Số & Cấu Trúc Bảng',
    category: 'cheatsheet',
    description: 'Cẩm nang phân biệt Dòng (Quan sát), Cột (Biến số), Đơn vị đo lường và các kiểu dữ liệu cơ bản.',
    iconName: 'FileText',
    count: 1,
    acquiredAt: 'Được cấp khi vào ngành',
    detailContent: `CẤU TRÚC BẢNG DỮ LIỆU CHUẨN:
- Row (Dòng): Một đơn vị quan sát độc lập (VD: 1 hóa đơn, 1 đơn hàng).
- Column (Cột / Feature): Biến số hoặc thuộc tính đo lường được (VD: Đơn giá, Khung giờ).
- Quantitative (Định lượng): Số đếm, số tiền, cân nặng (Áp dụng được Sum, Mean, Median).
- Qualitative (Định tính): Danh mục, nhãn, phân loại (Áp dụng Mode, Tần suất Count).`,
  },
  {
    id: 'item-tool-magnifier',
    name: 'Kính Lúp Soi Dữ Liệu',
    category: 'tool',
    description: 'Dụng cụ nghiệp vụ giúp phát hiện ô trống (Missing values) và kiểm tra công thức số học.',
    iconName: 'Search',
    count: 2,
    acquiredAt: 'Trang bị ban đầu',
  },
  {
    id: 'item-prop-lamp',
    name: 'Đèn Bàn Đồng Thau Cổ Điển',
    category: 'prop',
    description: 'Đèn bàn chiếu ánh sáng vàng ấm áp lên hồ sơ điều tra tại văn phòng.',
    iconName: 'Lamp',
    count: 1,
    acquiredAt: 'Đạo cụ bàn làm việc',
  },
];

const DEFAULT_DETECTIVE_NOTES: DetectiveNote[] = [
  {
    id: 'note-init-1',
    caseId: 'case-00',
    type: 'evidence',
    title: 'Món ăn bán chạy nhất',
    content: 'Cơm gà sốt teriyaki và Cơm rang dưa bò luôn dẫn đầu về số lượt mua.',
    tags: ['Món ăn', 'Số lượng', 'Xác thực'],
    createdAt: 'Hôm nay, 09:30',
    color: '#E5A93C',
  },
  {
    id: 'note-init-2',
    caseId: 'case-00',
    type: 'observation',
    title: 'Khung giờ tập trung',
    content: 'Buổi trưa tạo ra gần một nửa tổng doanh thu của toàn căn tin.',
    tags: ['Khung giờ', 'Doanh thu'],
    createdAt: 'Hôm nay, 09:45',
    color: '#00E5FF',
  },
  {
    id: 'note-init-3',
    caseId: 'case-00',
    type: 'hypothesis',
    title: 'Nghi vấn về món ít mua',
    content: 'Không thể khẳng định Cơm chay ế nếu không biết nhà bếp nấu bao nhiêu suất ban đầu!',
    tags: ['Giả thuyết', 'Giới hạn dữ liệu'],
    createdAt: 'Hôm nay, 10:15',
    color: '#C93B2B',
  },
];

interface GameContextType {
  profile: UserProfile;
  completedCases: string[];
  activeCaseId: string;
  setActiveCaseId: (id: string) => void;
  caseProgress: Record<string, CaseProgressState>;
  detectiveNotes: DetectiveNote[];
  achievements: Record<string, { unlocked: boolean; unlockedAt?: string }>;
  claimedRewards: Record<string, boolean>;
  inventory: InventoryItem[];
  theme: ThemeStyle;
  setTheme: (theme: ThemeStyle) => void;
  tutorialSeen: boolean;
  setTutorialSeen: (seen: boolean) => void;
  notification: { message: string; type: 'info' | 'success' | 'exp' } | null;
  clearNotification: () => void;
  awardExp: (amount: number, reason: string) => void;
  unlockAchievement: (achievementId: string) => void;
  claimAchievementReward: (achievementId: string) => void;
  saveTaskAnswer: (caseId: string, taskKey: string, answer: any) => void;
  setTaskNumber: (caseId: string, taskNumber: number) => void;
  saveReportDraft: (caseId: string, draft: Partial<InvestigationReport>, notify?: boolean) => void;
  submitCaseReport: (caseId: string) => void;
  addDetectiveNote: (note: Omit<DetectiveNote, 'id' | 'createdAt'>) => void;
  updateDetectiveNote: (id: string, updates: Partial<DetectiveNote>) => void;
  deleteDetectiveNote: (id: string) => void;
  resetAllProgress: () => void;
  isCaseUnlocked: (caseId: string) => boolean;
  isChatbotUnlocked: boolean;
  toggleChatbotDevOverride: () => void;
  devChatbotOverride: boolean;
  caseNodes: Record<string, BoardNode[]>;
  caseConnections: Record<string, BoardConnection[]>;
  updateNodePosition: (caseId: string, nodeId: string, x: number, y: number) => void;
  addBoardNode: (node: Omit<BoardNode, 'id'>) => void;
  togglePinNode: (caseId: string, nodeId: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'acquiredAt'>) => void;
  // Auth & Onboarding State
  isAuthenticated: boolean;
  login: (provider: 'google' | 'github' | 'facebook' | 'email' | 'guest', email?: string, name?: string) => void;
  logout: () => void;
  exitGuestSession: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  showCharacterCreation: boolean;
  setShowCharacterCreation: (show: boolean) => void;
  // Custom AI Companion
  aiAssistantName: string;
  setAiAssistantName: (name: string) => void;
  showAiNamingModal: boolean;
  setShowAiNamingModal: (show: boolean) => void;
  // Sequential Office Unlocking
  unlockedHotspots: string[];
  unlockHotspot: (hotspotKey: string) => void;
  completeOnboarding: () => void;
  isHotspotUnlocked: (hotspotKey: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_PROFILE`);
      return saved ? JSON.parse(saved) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  });

  const [completedCases, setCompletedCases] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_COMPLETED_CASES`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCaseId, setActiveCaseId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ACTIVE_CASE_ID`);
      return saved || 'case-00';
    } catch {
      return 'case-00';
    }
  });

  const [caseProgress, setCaseProgress] = useState<Record<string, CaseProgressState>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CASE_PROGRESS`);
      return saved ? JSON.parse(saved) : { 'case-00': INITIAL_CASE_00_PROGRESS };
    } catch {
      return { 'case-00': INITIAL_CASE_00_PROGRESS };
    }
  });

  const [detectiveNotes, setDetectiveNotes] = useState<DetectiveNote[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_NOTES`);
      return saved ? JSON.parse(saved) : DEFAULT_DETECTIVE_NOTES;
    } catch {
      return DEFAULT_DETECTIVE_NOTES;
    }
  });

  const [achievements, setAchievements] = useState<Record<string, { unlocked: boolean; unlockedAt?: string }>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ACHIEVEMENTS`);
      return saved ? JSON.parse(saved) : { 'ach-first-step': { unlocked: true, unlockedAt: 'Gia nhập văn phòng' } };
    } catch {
      return { 'ach-first-step': { unlocked: true, unlockedAt: 'Gia nhập văn phòng' } };
    }
  });

  const [claimedRewards, setClaimedRewards] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CLAIMED_REWARDS`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_INVENTORY`);
      return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
    } catch {
      return DEFAULT_INVENTORY;
    }
  });

  const [theme, setTheme] = useState<ThemeStyle>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_THEME`) as ThemeStyle;
      return saved || 'classic_detective';
    } catch {
      return 'classic_detective';
    }
  });

  const [caseNodes, setCaseNodes] = useState<Record<string, BoardNode[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_NODES`);
      return saved ? JSON.parse(saved) : DEFAULT_CASE_NODES;
    } catch {
      return DEFAULT_CASE_NODES;
    }
  });

  const [caseConnections, setCaseConnections] = useState<Record<string, BoardConnection[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_CONNECTIONS`);
      return saved ? JSON.parse(saved) : DEFAULT_CASE_CONNECTIONS;
    } catch {
      return DEFAULT_CASE_CONNECTIONS;
    }
  });

  const [tutorialSeen, setTutorialSeenState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TUTORIAL_SEEN`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [devChatbotOverride, setDevChatbotOverride] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'exp' } | null>(null);

  // Auth & Onboarding modals
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showCharacterCreation, setShowCharacterCreation] = useState<boolean>(false);
  const [showAiNamingModal, setShowAiNamingModal] = useState<boolean>(false);

  const isAuthenticated = Boolean(profile.isAuthenticated ?? true);
  const aiAssistantName = profile.aiAssistantName || 'DataHound AI';
  const unlockedHotspots = profile.unlockedHotspots || ['desk', 'corkboard', 'cabinet', 'workspace', 'achievements', 'chatbot'];

  const setAiAssistantName = (name: string) => {
    const cleanName = name.trim() || 'DataHound AI';
    setProfile((prev) => ({
      ...prev,
      aiAssistantName: cleanName,
    }));
    setNotification({
      message: `Đã đổi tên Trợ lý AI thành: ${cleanName}!`,
      type: 'success',
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const login = (
    provider: 'google' | 'github' | 'facebook' | 'email' | 'guest',
    email?: string,
    name?: string
  ) => {
    const isNewUser = !profile.onboardingCompleted || provider === 'guest';
    const assignedBadge = profile.badgeNumber && profile.badgeNumber.startsWith('DCZ-')
      ? profile.badgeNumber
      : generateDetectiveBadgeId();

    setProfile((prev) => ({
      ...prev,
      isAuthenticated: true,
      authProvider: provider,
      badgeNumber: prev.badgeNumber || assignedBadge,
      email: email || prev.email || `${provider}_agent@data-agency.vn`,
      name: name || prev.name,
    }));
    setNotification({
      message: `Đăng nhập thành công (${provider.toUpperCase()})!`,
      type: 'success',
    });
    if (isNewUser) {
      setShowCharacterCreation(true);
    }
  };

  const logout = () => {
    setProfile((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
    setNotification({
      message: 'Đã đăng xuất khỏi tài khoản thám tử.',
      type: 'info',
    });
  };

  const exitGuestSession = () => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_PROFILE`);
    } catch {
      // ignore
    }
    const freshBadge = generateDetectiveBadgeId();
    setProfile({
      ...INITIAL_PROFILE,
      name: 'Tân Thám Tử',
      badgeNumber: freshBadge,
      isAuthenticated: false,
      authProvider: 'guest',
      onboardingCompleted: false,
    });
    setNotification({
      message: 'Đã kết thúc phiên khách và đặt lại trạng thái.',
      type: 'info',
    });
  };

  const unlockHotspot = (hotspotKey: string) => {
    setProfile((prev) => {
      const current = prev.unlockedHotspots || ['desk', 'corkboard', 'cabinet', 'workspace', 'achievements', 'chatbot'];
      if (current.includes(hotspotKey)) return prev;
      return {
        ...prev,
        unlockedHotspots: [...current, hotspotKey],
      };
    });
  };

  const completeOnboarding = () => {
    setProfile((prev) => ({
      ...prev,
      onboardingCompleted: true,
      unlockedHotspots: ['desk', 'corkboard', 'cabinet', 'workspace', 'achievements', 'chatbot'],
    }));
    setTutorialSeenState(true);
  };

  const isHotspotUnlocked = (hotspotKey: string): boolean => {
    if (profile.onboardingCompleted) return true;
    const current = profile.unlockedHotspots || ['desk'];
    return current.includes(hotspotKey);
  };

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_PROFILE`, JSON.stringify(profile));
      localStorage.setItem(`${STORAGE_KEY}_COMPLETED_CASES`, JSON.stringify(completedCases));
      localStorage.setItem(`${STORAGE_KEY}_CASE_PROGRESS`, JSON.stringify(caseProgress));
      localStorage.setItem(`${STORAGE_KEY}_NOTES`, JSON.stringify(detectiveNotes));
      localStorage.setItem(`${STORAGE_KEY}_ACHIEVEMENTS`, JSON.stringify(achievements));
      localStorage.setItem(`${STORAGE_KEY}_CLAIMED_REWARDS`, JSON.stringify(claimedRewards));
      localStorage.setItem(`${STORAGE_KEY}_INVENTORY`, JSON.stringify(inventory));
      localStorage.setItem(`${STORAGE_KEY}_THEME`, theme);
      localStorage.setItem(`${STORAGE_KEY}_NODES`, JSON.stringify(caseNodes));
      localStorage.setItem(`${STORAGE_KEY}_CONNECTIONS`, JSON.stringify(caseConnections));
      localStorage.setItem(`${STORAGE_KEY}_TUTORIAL_SEEN`, tutorialSeen ? 'true' : 'false');
      localStorage.setItem(`${STORAGE_KEY}_ACTIVE_CASE_ID`, activeCaseId);
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [
    profile,
    completedCases,
    activeCaseId,
    caseProgress,
    detectiveNotes,
    achievements,
    claimedRewards,
    inventory,
    theme,
    caseNodes,
    caseConnections,
    tutorialSeen,
  ]);

  const clearNotification = () => setNotification(null);

  const awardExp = (amount: number, reason: string) => {
    setProfile((prev) => {
      let newExp = prev.currentExp + amount;
      let newLevel = prev.level;
      let newNext = prev.nextLevelExp;
      let newTitle = prev.title;

      while (newExp >= newNext) {
        newExp -= newNext;
        newLevel += 1;
        newNext = Math.round(newNext * 1.4);
        if (newLevel === 2) {
          newTitle = 'Thám tử Chính thức';
          unlockAchievement('ach-milestone-lvl2');
        } else if (newLevel >= 4) {
          newTitle = 'Thám tử Cao cấp';
        } else if (newLevel >= 7) {
          newTitle = 'Thám tử Trưởng (Master Sleuth)';
        }
      }

      setNotification({
        message: `+${amount} EXP: ${reason}`,
        type: 'exp',
      });

      return {
        ...prev,
        level: newLevel,
        currentExp: newExp,
        nextLevelExp: newNext,
        title: newTitle,
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    setAchievements((prev) => {
      if (prev[achievementId]?.unlocked) return prev;
      const ach = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (ach) {
        awardExp(ach.expReward, `Thành tựu [${ach.title}]`);
        setNotification({
          message: `🏆 Đã mở khóa thành tựu: ${ach.title}!`,
          type: 'success',
        });
      }
      return {
        ...prev,
        [achievementId]: {
          unlocked: true,
          unlockedAt: new Date().toLocaleDateString('vi-VN'),
        },
      };
    });
  };

  const claimAchievementReward = (achievementId: string) => {
    if (claimedRewards[achievementId]) return;
    const ach = ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!ach) return;

    if (ach.rewardItem) {
      addInventoryItem({
        id: ach.rewardItem.id,
        name: ach.rewardItem.name,
        category: ach.rewardItem.category,
        description: ach.rewardItem.description,
        iconName: ach.rewardItem.iconName,
        count: ach.rewardItem.count || 1,
        detailContent: ach.rewardItem.detailContent,
      });
    }

    setClaimedRewards((prev) => ({
      ...prev,
      [achievementId]: true,
    }));

    setNotification({
      message: `🎁 Đã nhận phần thưởng: ${ach.rewardTitle || ach.unlockedOfficeItem}!`,
      type: 'success',
    });
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'acquiredAt'>) => {
    setInventory((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, count: i.count + (item.count || 1) } : i));
      }
      return [
        {
          ...item,
          acquiredAt: 'Mới nhận',
          isNew: true,
        },
        ...prev,
      ];
    });
  };

  const setTutorialSeen = (seen: boolean) => {
    setTutorialSeenState(seen);
    if (seen) {
      unlockAchievement('ach-first-step');
    }
  };

  const saveTaskAnswer = (caseId: string, taskKey: string, answer: any) => {
    setCaseProgress((prev) => {
      const current = prev[caseId] || { ...INITIAL_CASE_00_PROGRESS };
      return {
        ...prev,
        [caseId]: {
          ...current,
          taskAnswers: {
            ...current.taskAnswers,
            [taskKey]: answer,
          },
        },
      };
    });
  };

  const setTaskNumber = (caseId: string, taskNumber: number) => {
    setCaseProgress((prev) => {
      const current = prev[caseId] || { ...INITIAL_CASE_00_PROGRESS };
      return {
        ...prev,
        [caseId]: {
          ...current,
          currentTask: taskNumber,
        },
      };
    });
  };

  const saveReportDraft = (
    caseId: string,
    draft: Partial<InvestigationReport>,
    notify: boolean = false
  ) => {
    setCaseProgress((prev) => {
      const current = prev[caseId] || { ...INITIAL_CASE_00_PROGRESS };
      return {
        ...prev,
        [caseId]: {
          ...current,
          reportDraft: {
            ...current.reportDraft,
            ...draft,
          },
        },
      };
    });
    if (notify) {
      setNotification({
        message: 'Đã lưu bản nháp báo cáo điều tra!',
        type: 'info',
      });
    }
  };

  const submitCaseReport = (caseId: string) => {
    const caseItem = CASE_FILES.find((c) => c.id === caseId);
    const expReward = caseItem?.expReward || 150;

    setCaseProgress((prev) => {
      const current = prev[caseId] || { ...INITIAL_CASE_00_PROGRESS };
      return {
        ...prev,
        [caseId]: {
          ...current,
          completed: true,
          submittedReport: { ...current.reportDraft, submittedAt: new Date().toLocaleString('vi-VN') },
          completedAt: new Date().toLocaleDateString('vi-VN'),
        },
      };
    });

    if (!completedCases.includes(caseId)) {
      setCompletedCases((prev) => [...prev, caseId]);
      awardExp(expReward, `Hoàn thành ${caseItem?.title || caseId}`);

      if (caseId === 'case-00') {
        unlockAchievement('ach-case-00');
        unlockAchievement('ach-critical-thinker');
      }

      // Check if this unlocks AI Assistant (Case 04 or 4 completed cases)
      if (caseId === 'case-04' || completedCases.length + 1 >= 4) {
        setShowAiNamingModal(true);
        unlockAchievement('ach-ai-companion');
      }
    }
  };

  const addDetectiveNote = (note: Omit<DetectiveNote, 'id' | 'createdAt'>) => {
    const newNote: DetectiveNote = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: 'Vừa xong',
    };
    setDetectiveNotes((prev) => [newNote, ...prev]);
    unlockAchievement('ach-board-master');
    setNotification({
      message: 'Đã ghim ghi chú mới lên Bảng điều tra!',
      type: 'success',
    });
  };

  const updateDetectiveNote = (id: string, updates: Partial<DetectiveNote>) => {
    setDetectiveNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  };

  const deleteDetectiveNote = (id: string) => {
    setDetectiveNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNodePosition = (caseId: string, nodeId: string, x: number, y: number) => {
    setCaseNodes((prev) => {
      const list = prev[caseId] || [];
      return {
        ...prev,
        [caseId]: list.map((node) => (node.id === nodeId ? { ...node, x, y } : node)),
      };
    });
  };

  const addBoardNode = (node: Omit<BoardNode, 'id'>) => {
    const newNode: BoardNode = {
      ...node,
      id: `node-${Date.now()}`,
    };
    setCaseNodes((prev) => {
      const list = prev[node.caseId] || [];
      return {
        ...prev,
        [node.caseId]: [...list, newNode],
      };
    });
  };

  const togglePinNode = (caseId: string, nodeId: string) => {
    setCaseNodes((prev) => {
      const list = prev[caseId] || [];
      return {
        ...prev,
        [caseId]: list.map((node) => (node.id === nodeId ? { ...node, pinned: !node.pinned } : node)),
      };
    });
  };

  const resetAllProgress = () => {
    localStorage.clear();
    setProfile(INITIAL_PROFILE);
    setCompletedCases([]);
    setActiveCaseId('case-00');
    setCaseProgress({ 'case-00': INITIAL_CASE_00_PROGRESS });
    setDetectiveNotes(DEFAULT_DETECTIVE_NOTES);
    setAchievements({ 'ach-first-step': { unlocked: true, unlockedAt: 'Gia nhập văn phòng' } });
    setClaimedRewards({});
    setInventory(DEFAULT_INVENTORY);
    setTheme('classic_detective');
    setCaseNodes(DEFAULT_CASE_NODES);
    setCaseConnections(DEFAULT_CASE_CONNECTIONS);
    setTutorialSeenState(false);
    setDevChatbotOverride(false);
    setNotification({
      message: 'Đã đặt lại toàn bộ tiến độ về trạng thái ban đầu!',
      type: 'info',
    });
  };

  // 19 Cases Dynamic Unlock Rule:
  // Case 00: Unlocked
  // Case 01: requires Case 00 completed
  // Case 02: requires Case 01 completed
  // Case 03: requires Case 02 completed
  // Tier 2 (Cases 04-06): unlocked when Case 03 is completed
  // Tier 3 (Cases 07-09): unlocked when at least 6 cases completed
  // Tier 4 (Cases 10-12): unlocked when at least 9 cases completed
  // Tier 5 (Cases 13-15): unlocked when at least 12 cases completed
  // Tier 6 (Cases 16-18): unlocked when at least 15 cases completed
  const isCaseUnlocked = (caseId: string): boolean => {
    return isCaseUnlockedPure(caseId, completedCases);
  };

  const isChatbotUnlocked = devChatbotOverride || completedCases.length >= 4 || completedCases.includes('case-04');

  const toggleChatbotDevOverride = () => {
    setDevChatbotOverride((prev) => !prev);
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        completedCases,
        activeCaseId,
        setActiveCaseId,
        caseProgress,
        detectiveNotes,
        achievements,
        claimedRewards,
        inventory,
        theme,
        setTheme,
        tutorialSeen,
        setTutorialSeen,
        notification,
        clearNotification,
        awardExp,
        unlockAchievement,
        claimAchievementReward,
        saveTaskAnswer,
        setTaskNumber,
        saveReportDraft,
        submitCaseReport,
        addDetectiveNote,
        updateDetectiveNote,
        deleteDetectiveNote,
        resetAllProgress,
        isCaseUnlocked,
        isChatbotUnlocked,
        toggleChatbotDevOverride,
        devChatbotOverride,
        caseNodes,
        caseConnections,
        updateNodePosition,
        addBoardNode,
        togglePinNode,
        addInventoryItem,
        // Auth & Onboarding
        isAuthenticated,
        login,
        logout,
        exitGuestSession,
        updateProfile,
        showAuthModal,
        setShowAuthModal,
        showCharacterCreation,
        setShowCharacterCreation,
        // AI Companion
        aiAssistantName,
        setAiAssistantName,
        showAiNamingModal,
        setShowAiNamingModal,
        // Sequential Office Unlocking
        unlockedHotspots,
        unlockHotspot,
        completeOnboarding,
        isHotspotUnlocked,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
