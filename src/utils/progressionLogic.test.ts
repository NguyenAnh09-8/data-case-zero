import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isCaseUnlockedPure,
  getAntiSpoilerBoardCases,
  getRecommendedOfficeCase,
  generateDetectiveBadgeId,
} from './progressionLogic';

test('Progression Logic: Case unlocking rules', () => {
  // Case 00 is always unlocked
  assert.equal(isCaseUnlockedPure('case-00', []), true);

  // Case 01 locked if Case 00 not completed
  assert.equal(isCaseUnlockedPure('case-01', []), false);

  // Case 01 unlocked when Case 00 completed
  assert.equal(isCaseUnlockedPure('case-01', ['case-00']), true);

  // Case 02 requires Case 01
  assert.equal(isCaseUnlockedPure('case-02', ['case-00']), false);
  assert.equal(isCaseUnlockedPure('case-02', ['case-00', 'case-01']), true);

  // Case 18 locked initially
  assert.equal(isCaseUnlockedPure('case-18', ['case-00']), false);
});

test('Anti-Spoiler Logic: Only unlocked cases appear in board dropdown', () => {
  // When no cases completed: ONLY Case 00 should appear
  const list0 = getAntiSpoilerBoardCases([]);
  assert.equal(list0.length, 1);
  assert.equal(list0[0].id, 'case-00');

  // When Case 00 completed: Case 00 and Case 01 appear
  const list1 = getAntiSpoilerBoardCases(['case-00']);
  assert.equal(list1.length, 2);
  assert.deepEqual(list1.map((c) => c.id), ['case-00', 'case-01']);

  // Never leaks future cases like case-10 or case-18
  assert.equal(list1.some((c) => c.id === 'case-18'), false);
  assert.equal(list1.some((c) => c.id === 'case-05'), false);
});

test('Dynamic Office Hub Center Card: Suggests in-progress or next logical case', () => {
  // Scenario 1: Case 00 is active and in-progress at stage 3
  const rec1 = getRecommendedOfficeCase('case-00', [], 3);
  assert.equal(rec1.caseItem.id, 'case-00');
  assert.equal(rec1.isNextNewCase, false);
  assert.match(rec1.actionText, /Tiếp Tục Điều Tra CASE-00/);
  assert.match(rec1.badgeLabel, /Giai đoạn 3\/7/);

  // Scenario 2: Case 00 is completed! Center card MUST suggest Case 01
  const rec2 = getRecommendedOfficeCase('case-00', ['case-00']);
  assert.equal(rec2.caseItem.id, 'case-01');
  assert.equal(rec2.isNextNewCase, true);
  assert.match(rec2.actionText, /Bắt Đầu CASE-01/);

  // Scenario 3: Case 00 and Case 01 completed! Center card MUST suggest Case 02
  const rec3 = getRecommendedOfficeCase('case-01', ['case-00', 'case-01']);
  assert.equal(rec3.caseItem.id, 'case-02');
  assert.equal(rec3.isNextNewCase, true);
  assert.match(rec3.actionText, /Bắt Đầu CASE-02/);
});

test('Badge ID Generator: Generates unique, non-editable DCZ-XXXX format', () => {
  const badgeId = generateDetectiveBadgeId();
  assert.match(badgeId, /^DCZ-\d{4}$/);
});
