import test from 'node:test';
import assert from 'node:assert/strict';
import { CANTEEN_DATASET, CANTEEN_DISHES } from '../data/canteenDataset';
import {
  validateDatasetIntegrity,
  validateOrderMath,
  getDishSummary,
  getTimeSlotSummary,
  getCategorySummary,
} from './canteenData';

test('dataset has exactly 150 rows', () => {
  assert.equal(CANTEEN_DATASET.length, 150);
});

test('dataset has exactly 8 specified columns and no date column', () => {
  const firstRow = CANTEEN_DATASET[0];
  const keys = Object.keys(firstRow);
  assert.equal(keys.length, 8);
  assert.ok(keys.includes('order_id'));
  assert.ok(keys.includes('dish'));
  assert.ok(keys.includes('category'));
  assert.ok(keys.includes('quantity'));
  assert.ok(keys.includes('unit_price_vnd'));
  assert.ok(keys.includes('total_vnd'));
  assert.ok(keys.includes('time_slot'));
  assert.ok(keys.includes('payment_method'));
  assert.ok(!keys.includes('date'));
  assert.ok(!keys.includes('order_date'));
});

test('all order_ids are unique and start with ORD-', () => {
  const ids = new Set(CANTEEN_DATASET.map(r => r.order_id));
  assert.equal(ids.size, 150);
  for (const id of ids) {
    assert.match(id, /^ORD-\d+$/);
  }
});

test('total_vnd exactly equals quantity * unit_price_vnd for all 150 rows', () => {
  const integrity = validateDatasetIntegrity(CANTEEN_DATASET);
  assert.equal(integrity.isValid, true);
  assert.equal(integrity.mathMismatches, 0);
  assert.equal(integrity.missingValues, 0);

  for (const row of CANTEEN_DATASET) {
    assert.equal(row.total_vnd, row.quantity * row.unit_price_vnd);
    assert.ok(row.quantity >= 1);
    assert.ok(row.unit_price_vnd > 0);
  }
});

test('only 10 specific dishes are present', () => {
  const dishNames = new Set(CANTEEN_DATASET.map(r => r.dish));
  assert.equal(dishNames.size, 10);
  for (const dish of CANTEEN_DISHES) {
    assert.ok(dishNames.has(dish.name), `Missing dish: ${dish.name}`);
  }
});

test('time slot distribution aggregates correctly', () => {
  const slotSummary = getTimeSlotSummary(CANTEEN_DATASET);
  assert.equal(slotSummary.length, 3);
  const totalOrders = slotSummary.reduce((sum, s) => sum + s.orderCount, 0);
  assert.equal(totalOrders, 150);

  // Lunch (Trưa) should be the peak period
  const trua = slotSummary.find(s => s.timeSlot === 'Trưa');
  assert.ok(trua && trua.orderCount > 40);
});

test('dish summary ranks dishes properly', () => {
  const dishSummary = getDishSummary(CANTEEN_DATASET);
  assert.equal(dishSummary.length, 10);
  // Verify descending sort
  for (let i = 0; i < dishSummary.length - 1; i++) {
    assert.ok(dishSummary[i].totalQuantity >= dishSummary[i + 1].totalQuantity);
  }
});
