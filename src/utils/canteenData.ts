import { CANTEEN_DATASET } from '../data/canteenDataset';
import { CanteenRecord, DishCategory, PaymentMethod, TimeSlot } from '../types';

export interface DishStat {
  dish: string;
  category: DishCategory;
  orderCount: number;
  totalQuantity: number;
  unitPrice: number;
  totalRevenue: number;
  percentageOfQuantity: number;
}

export interface TimeSlotStat {
  timeSlot: TimeSlot;
  orderCount: number;
  totalQuantity: number;
  totalRevenue: number;
  percentageOfRevenue: number;
  topDishes: { dish: string; quantity: number }[];
}

export interface CategoryStat {
  category: DishCategory;
  orderCount: number;
  totalQuantity: number;
  totalRevenue: number;
}

export function validateOrderMath(record: CanteenRecord): boolean {
  return (
    Number.isInteger(record.quantity) &&
    record.quantity > 0 &&
    record.unit_price_vnd > 0 &&
    record.total_vnd === record.quantity * record.unit_price_vnd
  );
}

export function validateDatasetIntegrity(dataset: CanteenRecord[] = CANTEEN_DATASET): {
  isValid: boolean;
  totalRows: number;
  columnCount: number;
  uniqueOrderIds: number;
  mathMismatches: number;
  missingValues: number;
} {
  const ids = new Set<string>();
  let mathMismatches = 0;
  let missingValues = 0;

  for (const row of dataset) {
    if (!row.order_id || ids.has(row.order_id)) ids.add(row.order_id);
    else ids.add(row.order_id);

    if (!validateOrderMath(row)) {
      mathMismatches++;
    }

    if (
      !row.order_id ||
      !row.dish ||
      !row.category ||
      row.quantity == null ||
      row.unit_price_vnd == null ||
      row.total_vnd == null ||
      !row.time_slot ||
      !row.payment_method
    ) {
      missingValues++;
    }
  }

  return {
    isValid: mathMismatches === 0 && missingValues === 0 && ids.size === dataset.length,
    totalRows: dataset.length,
    columnCount: 8,
    uniqueOrderIds: ids.size,
    mathMismatches,
    missingValues,
  };
}

export function getDishSummary(dataset: CanteenRecord[] = CANTEEN_DATASET): DishStat[] {
  const map = new Map<string, { category: DishCategory; orderCount: number; totalQuantity: number; unitPrice: number; totalRevenue: number }>();
  let grandTotalQty = 0;

  for (const row of dataset) {
    grandTotalQty += row.quantity;
    const current = map.get(row.dish) || {
      category: row.category,
      orderCount: 0,
      totalQuantity: 0,
      unitPrice: row.unit_price_vnd,
      totalRevenue: 0,
    };
    current.orderCount += 1;
    current.totalQuantity += row.quantity;
    current.totalRevenue += row.total_vnd;
    map.set(row.dish, current);
  }

  const result: DishStat[] = [];
  for (const [dish, data] of map.entries()) {
    result.push({
      dish,
      category: data.category,
      orderCount: data.orderCount,
      totalQuantity: data.totalQuantity,
      unitPrice: data.unitPrice,
      totalRevenue: data.totalRevenue,
      percentageOfQuantity: grandTotalQty > 0 ? (data.totalQuantity / grandTotalQty) * 100 : 0,
    });
  }

  // Sort by total quantity descending
  return result.sort((a, b) => b.totalQuantity - a.totalQuantity);
}

export function getTimeSlotSummary(dataset: CanteenRecord[] = CANTEEN_DATASET): TimeSlotStat[] {
  const slots: TimeSlot[] = ['Sáng', 'Trưa', 'Chiều'];
  let grandTotalRevenue = 0;

  const slotMaps = new Map<TimeSlot, { orderCount: number; totalQuantity: number; totalRevenue: number; dishCounts: Map<string, number> }>();
  for (const s of slots) {
    slotMaps.set(s, { orderCount: 0, totalQuantity: 0, totalRevenue: 0, dishCounts: new Map() });
  }

  for (const row of dataset) {
    grandTotalRevenue += row.total_vnd;
    const sData = slotMaps.get(row.time_slot);
    if (sData) {
      sData.orderCount++;
      sData.totalQuantity += row.quantity;
      sData.totalRevenue += row.total_vnd;
      const dCount = sData.dishCounts.get(row.dish) || 0;
      sData.dishCounts.set(row.dish, dCount + row.quantity);
    }
  }

  return slots.map(slot => {
    const d = slotMaps.get(slot)!;
    const topDishes = Array.from(d.dishCounts.entries())
      .map(([dish, quantity]) => ({ dish, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);

    return {
      timeSlot: slot,
      orderCount: d.orderCount,
      totalQuantity: d.totalQuantity,
      totalRevenue: d.totalRevenue,
      percentageOfRevenue: grandTotalRevenue > 0 ? (d.totalRevenue / grandTotalRevenue) * 100 : 0,
      topDishes,
    };
  });
}

export function getCategorySummary(dataset: CanteenRecord[] = CANTEEN_DATASET): CategoryStat[] {
  const catMap = new Map<DishCategory, { orderCount: number; totalQuantity: number; totalRevenue: number }>();
  for (const row of dataset) {
    const current = catMap.get(row.category) || { orderCount: 0, totalQuantity: 0, totalRevenue: 0 };
    current.orderCount++;
    current.totalQuantity += row.quantity;
    current.totalRevenue += row.total_vnd;
    catMap.set(row.category, current);
  }

  return Array.from(catMap.entries()).map(([category, stat]) => ({
    category,
    orderCount: stat.orderCount,
    totalQuantity: stat.totalQuantity,
    totalRevenue: stat.totalRevenue,
  })).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

export function formatVND(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}
