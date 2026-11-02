/**
 * Dataset mô phỏng 200 phiên truy cập phễu mua sắm cho Case 01: TechMart Online
 * Nghiên cứu vết nứt phễu thanh toán (Checkout Funnel Drop-off Analysis)
 */

export interface TechMartFunnelRecord {
  session_id: string;
  user_segment: 'Khách mới' | 'Khách quay lại' | 'Thành viên VIP';
  device: 'Web di động' | 'App di động' | 'Máy tính để bàn';
  step_reached:
    | '1_xem_san_pham'
    | '2_them_gio_hang'
    | '3_nhap_dia_chi'
    | '4_xac_nhan_thanh_toan'
    | '5_thanh_toan_thanh_cong';
  cart_value_vnd: number;
  shipping_fee_vnd: number;
  shipping_fee_surprised: boolean;
  payment_method: 'Ví MoMo' | 'VNPAY-QR' | 'Thẻ Visa/Master' | 'Thanh toán COD';
  drop_off_reason:
    | 'Không có (Thành công)'
    | 'Sốc phí ship 50k bất ngờ'
    | 'Lỗi timeout OTP ngân hàng'
    | 'Đổi ý không mua'
    | 'Ứng dụng tải chậm';
}

// Hàm sinh 200 bản ghi giả lập xác định (deterministic)
function generateTechMartDataset(): TechMartFunnelRecord[] {
  const records: TechMartFunnelRecord[] = [];

  const segments: TechMartFunnelRecord['user_segment'][] = [
    'Khách mới',
    'Khách quay lại',
    'Khách mới',
    'Thành viên VIP',
    'Khách mới',
  ];
  const devices: TechMartFunnelRecord['device'][] = [
    'App di động',
    'Web di động',
    'App di động',
    'Máy tính để bàn',
    'Web di động',
  ];
  const payments: TechMartFunnelRecord['payment_method'][] = [
    'Ví MoMo',
    'VNPAY-QR',
    'Thanh toán COD',
    'Thẻ Visa/Master',
  ];

  // 200 sessions distribution:
  // Step 1 (Xem SP): 200 (100%)
  // Step 2 (Thêm giỏ): 164 (82%) -> 36 drop ở step 1
  // Step 3 (Nhập địa chỉ): 138 (69%) -> 26 drop ở step 2
  // Step 4 (Xác nhận thanh toán): 68 (34%) -> 70 drop ở step 3 (VẾT NỨT CHÍNH! Sốc phí ship)
  // Step 5 (Thành công): 52 (26%) -> 16 drop ở step 4 (Lỗi OTP & hủy)

  for (let i = 1; i <= 200; i++) {
    const padded = String(i).padStart(4, '0');
    const sessionId = `TM-${padded}`;
    const segment = segments[(i * 3 + 1) % segments.length];
    const device = devices[(i * 7 + 2) % devices.length];
    const payment = payments[(i * 5 + 3) % payments.length];
    const cartValue = 150000 + ((i * 37000) % 1850000);

    let step: TechMartFunnelRecord['step_reached'];
    let dropReason: TechMartFunnelRecord['drop_off_reason'];
    let surprised = false;

    if (i <= 52) {
      // 52 sessions hoàn thành 100%
      step = '5_thanh_toan_thanh_cong';
      dropReason = 'Không có (Thành công)';
      surprised = false;
    } else if (i <= 68) {
      // 16 sessions drop ở step 4 (Xác nhận thanh toán: OTP timeout)
      step = '4_xac_nhan_thanh_toan';
      dropReason = 'Lỗi timeout OTP ngân hàng';
      surprised = true;
    } else if (i <= 138) {
      // 70 sessions drop ở step 3 (Nhập địa chỉ xong thấy phí ship 50k bất ngờ -> Vết nứt chính!)
      step = '3_nhap_dia_chi';
      dropReason = 'Sốc phí ship 50k bất ngờ';
      surprised = true;
    } else if (i <= 164) {
      // 26 sessions drop ở step 2 (Thêm giỏ xong ứng dụng tải chậm)
      step = '2_them_gio_hang';
      dropReason = 'Ứng dụng tải chậm';
      surprised = false;
    } else {
      // 36 sessions drop ở step 1 (Xem sản phẩm xong đổi ý)
      step = '1_xem_san_pham';
      dropReason = 'Đổi ý không mua';
      surprised = false;
    }

    records.push({
      session_id: sessionId,
      user_segment: segment,
      device: device,
      step_reached: step,
      cart_value_vnd: cartValue,
      shipping_fee_vnd: 50000,
      shipping_fee_surprised: surprised,
      payment_method: payment,
      drop_off_reason: dropReason,
    });
  }

  return records;
}

export const TECHMART_FUNNEL_DATASET: TechMartFunnelRecord[] = generateTechMartDataset();

export interface FunnelStepSummary {
  step: string;
  stepName: string;
  count: number;
  pctOfTotal: number;
  conversionFromPrev: number;
  dropOffCount: number;
  dropOffRate: number;
}

export function getFunnelStepsSummary(dataset: TechMartFunnelRecord[] = TECHMART_FUNNEL_DATASET): FunnelStepSummary[] {
  const total = dataset.length;

  const step1 = dataset.length; // Tất cả đều xem sản phẩm
  const step2 = dataset.filter((r) => r.step_reached !== '1_xem_san_pham').length;
  const step3 = dataset.filter(
    (r) => r.step_reached !== '1_xem_san_pham' && r.step_reached !== '2_them_gio_hang'
  ).length;
  const step4 = dataset.filter(
    (r) =>
      r.step_reached === '4_xac_nhan_thanh_toan' || r.step_reached === '5_thanh_toan_thanh_cong'
  ).length;
  const step5 = dataset.filter((r) => r.step_reached === '5_thanh_toan_thanh_cong').length;

  const stepsData = [
    { step: '1_xem_san_pham', stepName: '1. Xem sản phẩm', count: step1 },
    { step: '2_them_gio_hang', stepName: '2. Thêm vào giỏ', count: step2 },
    { step: '3_nhap_dia_chi', stepName: '3. Nhập địa chỉ', count: step3 },
    { step: '4_xac_nhan_thanh_toan', stepName: '4. Xác nhận thanh toán', count: step4 },
    { step: '5_thanh_toan_thanh_cong', stepName: '5. Mua thành công', count: step5 },
  ];

  return stepsData.map((s, idx) => {
    const prevCount = idx === 0 ? total : stepsData[idx - 1].count;
    const dropCount = prevCount - s.count;
    const dropRate = prevCount > 0 ? (dropCount / prevCount) * 100 : 0;
    const convPrev = prevCount > 0 ? (s.count / prevCount) * 100 : 100;

    return {
      step: s.step,
      stepName: s.stepName,
      count: s.count,
      pctOfTotal: (s.count / total) * 100,
      conversionFromPrev: convPrev,
      dropOffCount: dropCount,
      dropOffRate: dropRate,
    };
  });
}

export function getDropOffReasonsSummary(dataset: TechMartFunnelRecord[] = TECHMART_FUNNEL_DATASET) {
  const droppedRecords = dataset.filter((r) => r.drop_off_reason !== 'Không có (Thành công)');
  const counts: Record<string, number> = {};

  droppedRecords.forEach((r) => {
    counts[r.drop_off_reason] = (counts[r.drop_off_reason] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: (count / droppedRecords.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}
