import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  TECHMART_FUNNEL_DATASET,
  getFunnelStepsSummary,
  getDropOffReasonsSummary,
} from './techmartDataset';

describe('TECHMART_FUNNEL_DATASET Integrity Tests', () => {
  it('contains exactly 200 sessions', () => {
    assert.strictEqual(TECHMART_FUNNEL_DATASET.length, 200);
  });

  it('contains valid step_reached values across the 5 funnel stages', () => {
    const validSteps = [
      '1_xem_san_pham',
      '2_them_gio_hang',
      '3_nhap_dia_chi',
      '4_xac_nhan_thanh_toan',
      '5_thanh_toan_thanh_cong',
    ];
    for (const record of TECHMART_FUNNEL_DATASET) {
      assert.ok(validSteps.includes(record.step_reached), `Invalid step ${record.step_reached}`);
      assert.ok(record.session_id.startsWith('TM-'));
      assert.ok(record.cart_value_vnd > 0);
    }
  });

  it('aggregates 5 funnel steps with decreasing conversion', () => {
    const summary = getFunnelStepsSummary(TECHMART_FUNNEL_DATASET);
    assert.strictEqual(summary.length, 5);
    assert.strictEqual(summary[0].count, 200);
    assert.strictEqual(summary[4].count, 52); // 52 successful checkouts
    // Step 3 to Step 4 is the largest drop-off
    const step4Drop = summary[3].dropOffCount;
    assert.ok(step4Drop >= 70, `Step 4 dropoff was ${step4Drop}, expected >= 70`);
  });

  it('identifies unexpected shipping fee as leading drop-off cause', () => {
    const reasons = getDropOffReasonsSummary(TECHMART_FUNNEL_DATASET);
    assert.ok(reasons.length > 0);
    assert.strictEqual(reasons[0].reason, 'Sốc phí ship 50k bất ngờ');
    assert.ok(reasons[0].percentage > 40);
  });
});
