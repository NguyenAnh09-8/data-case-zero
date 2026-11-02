import { CASE_FILES } from '../data/cases';
import { CaseFile } from '../types';

/**
 * 19 Cases Dynamic Unlock Rule:
 * Case 00: Unlocked by default
 * Case 01: requires Case 00 completed
 * Case 02: requires Case 01 completed
 * Case 03: requires Case 02 completed
 * Tier 2 (Cases 04-06): unlocked when Case 03 is completed
 * Tier 3 (Cases 07-09): unlocked when at least 6 cases completed
 * Tier 4 (Cases 10-12): unlocked when at least 9 cases completed
 * Tier 5 (Cases 13-15): unlocked when at least 12 cases completed
 * Tier 6 (Cases 16-18): unlocked when at least 15 cases completed
 */
export function isCaseUnlockedPure(caseId: string, completedCases: string[]): boolean {
  if (caseId === 'case-00') return true;
  if (caseId === 'case-01') return completedCases.includes('case-00');
  if (caseId === 'case-02') return completedCases.includes('case-01');
  if (caseId === 'case-03') return completedCases.includes('case-02');

  const targetCase = CASE_FILES.find((c) => c.id === caseId);
  if (!targetCase) return false;

  if (targetCase.tier === 2) {
    return completedCases.includes('case-03');
  }
  if (targetCase.tier === 3) {
    return completedCases.length >= 6;
  }
  if (targetCase.tier === 4) {
    return completedCases.length >= 9;
  }
  if (targetCase.tier === 5) {
    return completedCases.length >= 12;
  }
  if (targetCase.tier === 6) {
    return completedCases.length >= 15;
  }

  return false;
}

/**
 * Filters the list of cases strictly to unlocked cases to prevent content leaks / spoilers on the Detective Board.
 */
export function getAntiSpoilerBoardCases(completedCases: string[]): CaseFile[] {
  return CASE_FILES.filter((c) => isCaseUnlockedPure(c.id, completedCases));
}

/**
 * Determines the dynamic central card recommendation for the Office Home Screen.
 * - If current active case is in-progress (not completed), suggest continuing it with stage number.
 * - If current case is completed, automatically suggest the next unlocked unfinished case.
 * - If all cases completed, return latest completed case.
 */
export function getRecommendedOfficeCase(
  activeCaseId: string,
  completedCases: string[],
  activeStageNumber: number = 1
): {
  caseItem: CaseFile;
  isNextNewCase: boolean;
  badgeLabel: string;
  actionText: string;
} {
  // 1. If active case is unfinished, recommend continuing it
  if (activeCaseId && !completedCases.includes(activeCaseId)) {
    const c = CASE_FILES.find((item) => item.id === activeCaseId) || CASE_FILES[0];
    return {
      caseItem: c,
      isNextNewCase: false,
      badgeLabel: `● ĐANG ĐIỀU TRA • Giai đoạn ${activeStageNumber}/7`,
      actionText: `Tiếp Tục Điều Tra ${c.code}`,
    };
  }

  // 2. Otherwise, find the next unlocked case that is not completed
  const nextUnlocked = CASE_FILES.find(
    (item) => isCaseUnlockedPure(item.id, completedCases) && !completedCases.includes(item.id)
  );
  if (nextUnlocked) {
    return {
      caseItem: nextUnlocked,
      isNextNewCase: true,
      badgeLabel: `★ VỤ ÁN TIẾP THEO • SẴN SÀNG KHỞI ĐỘNG`,
      actionText: `Bắt Đầu ${nextUnlocked.code}: ${nextUnlocked.title}`,
    };
  }

  // 3. Fallback: all available cases completed
  const fallback = CASE_FILES.find((item) => item.id === activeCaseId) || CASE_FILES[0];
  return {
    caseItem: fallback,
    isNextNewCase: false,
    badgeLabel: `✓ ĐÃ HOÀN TẤT TOÀN BỘ ÁN`,
    actionText: `Mở Hồ Sơ ${fallback.code}`,
  };
}

/**
 * Generates an official, non-editable random detective badge number (e.g. DCZ-9402).
 */
export function generateDetectiveBadgeId(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `DCZ-${digits}`;
}
