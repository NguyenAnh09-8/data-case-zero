import { CanteenRecord, DishCategory, PaymentMethod, TimeSlot } from '../types';

export interface DishConfig {
  name: string;
  category: DishCategory;
  price: number;
  popularityWeight: number; // For realistic lunch rush distribution
  preferredTimeSlots: TimeSlot[];
}

export const CANTEEN_DISHES: DishConfig[] = [
  { name: 'Cơm rang dưa bò', category: 'Cơm', price: 35000, popularityWeight: 24, preferredTimeSlots: ['Trưa', 'Chiều'] },
  { name: 'Cơm gà sốt teriyaki', category: 'Cơm', price: 40000, popularityWeight: 26, preferredTimeSlots: ['Trưa'] },
  { name: 'Cơm sườn', category: 'Cơm', price: 38000, popularityWeight: 22, preferredTimeSlots: ['Trưa', 'Chiều'] },
  { name: 'Mì xào bò', category: 'Mì', price: 35000, popularityWeight: 16, preferredTimeSlots: ['Sáng', 'Trưa'] },
  { name: 'Mì trộn', category: 'Mì', price: 30000, popularityWeight: 14, preferredTimeSlots: ['Sáng', 'Chiều'] },
  { name: 'Bún chả', category: 'Bún & Phở', price: 40000, popularityWeight: 15, preferredTimeSlots: ['Trưa'] },
  { name: 'Phở bò', category: 'Bún & Phở', price: 45000, popularityWeight: 18, preferredTimeSlots: ['Sáng'] },
  { name: 'Bánh mì', category: 'Bánh & Salad', price: 25000, popularityWeight: 12, preferredTimeSlots: ['Sáng', 'Chiều'] },
  { name: 'Salad gà', category: 'Bánh & Salad', price: 35000, popularityWeight: 8, preferredTimeSlots: ['Trưa'] },
  { name: 'Cơm chay', category: 'Cơm', price: 28000, popularityWeight: 7, preferredTimeSlots: ['Trưa'] },
];

// Linear Congruential Generator (LCG) with fixed seed for guaranteed 100% deterministic reproducibility
function createDeterministicPRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildDeterministicCanteenDataset(): CanteenRecord[] {
  const prng = createDeterministicPRNG(20261031); // Seed
  const records: CanteenRecord[] = [];
  const paymentMethods: PaymentMethod[] = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử'];
  const allTimeSlots: TimeSlot[] = ['Sáng', 'Trưa', 'Chiều'];

  // Weighted dish selection pool
  const dishPool: DishConfig[] = [];
  for (const dish of CANTEEN_DISHES) {
    for (let i = 0; i < dish.popularityWeight; i++) {
      dishPool.push(dish);
    }
  }

  for (let i = 1; i <= 150; i++) {
    const order_id = `ORD-${1000 + i}`;
    
    // Select dish
    const dishIdx = Math.floor(prng() * dishPool.length);
    const selectedDish = dishPool[dishIdx];

    // Select time slot with natural bias towards lunch
    const timeRand = prng();
    let time_slot: TimeSlot = 'Trưa';
    if (selectedDish.name === 'Phở bò' || selectedDish.name === 'Bánh mì') {
      time_slot = timeRand < 0.65 ? 'Sáng' : timeRand < 0.85 ? 'Trưa' : 'Chiều';
    } else if (selectedDish.category === 'Cơm') {
      time_slot = timeRand < 0.12 ? 'Sáng' : timeRand < 0.78 ? 'Trưa' : 'Chiều';
    } else {
      time_slot = timeRand < 0.25 ? 'Sáng' : timeRand < 0.75 ? 'Trưa' : 'Chiều';
    }

    // Select quantity (mostly 1, sometimes 2 or 3, rarely 4 or 5)
    const qRand = prng();
    let quantity = 1;
    if (qRand > 0.94) quantity = 4;
    else if (qRand > 0.88) quantity = 3;
    else if (qRand > 0.65) quantity = 2;
    else quantity = 1;

    // Payment method distribution
    const payRand = prng();
    const payment_method: PaymentMethod =
      payRand < 0.35 ? 'Tiền mặt' : payRand < 0.72 ? 'Ví điện tử' : 'Chuyển khoản';

    const unit_price_vnd = selectedDish.price;
    const total_vnd = quantity * unit_price_vnd;

    records.push({
      order_id,
      dish: selectedDish.name,
      category: selectedDish.category,
      quantity,
      unit_price_vnd,
      total_vnd,
      time_slot,
      payment_method,
    });
  }

  // Deterministic shuffle using Fisher-Yates with same PRNG
  for (let i = records.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [records[i], records[j]] = [records[j], records[i]];
  }

  return records;
}

// Single immutable instance created once
export const CANTEEN_DATASET: CanteenRecord[] = buildDeterministicCanteenDataset();
