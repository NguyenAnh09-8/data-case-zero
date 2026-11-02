export type TimeSlot = 'Sáng' | 'Trưa' | 'Chiều';
export type PaymentMethod = 'Tiền mặt' | 'Chuyển khoản' | 'Ví điện tử';
export type DishCategory = 'Cơm' | 'Mì' | 'Bún & Phở' | 'Bánh & Salad';

export interface CanteenRecord {
  order_id: string;
  dish: string;
  category: DishCategory;
  quantity: number;
  unit_price_vnd: number;
  total_vnd: number;
  time_slot: TimeSlot;
  payment_method: PaymentMethod;
}

export type CaseDifficulty = 'Nhập môn' | 'Cơ bản' | 'Trung cấp' | 'Nâng cao' | 'Chuyên gia';

export interface CaseFile {
  id: string;
  code: string; // e.g. "CASE-00" to "CASE-18"
  title: string;
  subtitle: string;
  summary: string;
  difficulty: CaseDifficulty;
  category: string;
  tier: number; // 0 for Case 00, 1 for 01-03, 2 for 04-06, 3 for 07-09, 4 for 10-12, 5 for 13-15, 6 for 16-18
  tags: string[];
  client: {
    name: string;
    role: string;
    avatarKey: string;
    organization: string;
  };
  expReward: number;
  estimatedMinutes: number;
  unlockedByDefault?: boolean;
  requiredCaseId?: string;
  requiredTier?: number;
  story: string;
  problemStatement: string;
  learningObjectives: string[];
  limitations: string[];
}

export interface BoardNode {
  id: string;
  caseId: string;
  type: 'clue' | 'evidence' | 'hypothesis' | 'suspect' | 'conclusion';
  title: string;
  content: string;
  x: number;
  y: number;
  unlockedStep: number; // 1 to 7 corresponding to case stages
  pinned?: boolean;
  tag?: string;
  accentColor?: string;
}

export interface BoardConnection {
  id: string;
  caseId: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  color?: string;
}

export interface DetectiveNote {
  id: string;
  caseId: string;
  type: 'evidence' | 'observation' | 'hypothesis' | 'conclusion';
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  color?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'tool' | 'cheatsheet' | 'prop' | 'token';
  description: string;
  iconName: string;
  count: number;
  detailContent?: string;
  acquiredAt: string;
  isNew?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  expReward: number;
  category: 'onboarding' | 'investigation' | 'analysis' | 'mastery';
  secret?: boolean;
  unlockedOfficeItem?: string;
  rewardType?: 'theme' | 'avatar' | 'office_item' | 'cheat_sheet' | 'tool' | 'token' | 'prop';
  rewardTitle?: string;
  rewardItem?: InventoryItem;
}

export interface InvestigationReport {
  finding1: string;
  evidence1: string;
  finding2: string;
  evidence2: string;
  furtherQuestion: string;
  recommendation: string;
  submittedAt?: string;
}

export interface CaseProgressState {
  currentTask: number;
  taskAnswers: Record<string, any>;
  reportDraft: InvestigationReport;
  submittedReport?: InvestigationReport;
  completed: boolean;
  completedAt?: string;
}

export interface UserProfile {
  name: string;
  codeName: string;
  badgeNumber: string;
  avatar: string;
  gender?: 'male' | 'female' | 'other';
  title: string;
  level: number;
  currentExp: number;
  nextLevelExp: number;
  joinedDate: string;
  streakDays: number;
  accuracyRate: number;
  totalStudyMinutes: number;
  // Auth & Onboarding
  isAuthenticated?: boolean;
  authProvider?: 'google' | 'github' | 'facebook' | 'email' | 'guest';
  email?: string;
  onboardingCompleted?: boolean;
  unlockedHotspots?: string[];
  // AI Companion Customization
  aiAssistantName?: string;
}

export type ThemeStyle = 'classic_detective' | 'cyber_noir' | 'retro_parchment';

export interface CaseBenchmarkSolution {
  caseId: string;
  caseCode: string;
  caseTitle: string;
  coreConcepts: {
    title: string;
    description: string;
    keyTakeaway: string;
  }[];
  idealApproachSteps: {
    step: number;
    title: string;
    description: string;
  }[];
  officialReport: {
    finding1: string;
    evidence1: string;
    furtherQuestion: string;
    recommendation: string;
  };
}
