import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-step',
    title: 'Bước Chân Đầu Tiên',
    description: 'Gia nhập Văn phòng Điều tra Dữ liệu và hoàn thành hướng dẫn nghiệp vụ ban đầu.',
    iconName: 'Footprints',
    expReward: 50,
    category: 'onboarding',
    unlockedOfficeItem: 'Huy hiệu Thám tử Tân binh mạ bạc',
    rewardType: 'cheat_sheet',
    rewardTitle: 'Sổ tay: Phím tắt & Biến số cơ bản (Data Variables Sheet)',
    rewardItem: {
      id: 'item-cheat-1',
      name: 'Bản Tra Cứu Biến Số & Cấu Trúc Bảng',
      category: 'cheatsheet',
      description: 'Cẩm nang phân biệt Dòng (Quan sát), Cột (Biến số), Đơn vị đo lường và các kiểu dữ liệu cơ bản.',
      iconName: 'FileText',
      count: 1,
      acquiredAt: 'Khi gia nhập cơ quan',
      detailContent: `CẤU TRÚC BẢNG DỮ LIỆU CHUẨN:
- Row (Dòng): Một đơn vị quan sát độc lập (VD: 1 hóa đơn, 1 phiên truy cập).
- Column (Cột / Feature): Biến số hoặc đặc tính đo lường được (VD: Đơn giá, Khung giờ).
- Quantitative (Định lượng): Số đếm, số tiền, cân nặng (Áp dụng được Sum, Mean, Median).
- Qualitative (Định tính): Danh mục, nhãn, phân loại (Áp dụng Mode, Tần suất Count).`,
    },
  },
  {
    id: 'ach-case-00',
    title: 'Phá Án Giờ Cao Điểm',
    description: 'Nộp báo cáo điều tra hoàn chỉnh cho Vụ án 00 và nhận đánh giá từ Trưởng văn phòng.',
    iconName: 'CheckCircle2',
    expReward: 100,
    category: 'investigation',
    unlockedOfficeItem: 'Cúp lưu niệm Căn tin Đại học để bàn',
    rewardType: 'office_item',
    rewardTitle: 'Vật phẩm bàn làm việc: Đèn Bàn Đồng Thau Cổ Điển',
    rewardItem: {
      id: 'item-prop-lamp',
      name: 'Đèn Bàn Đồng Thau Cổ Điển',
      category: 'prop',
      description: 'Đèn bàn chụp thủy tinh xanh ngọc chiếu ánh sáng ấm áp lên hồ sơ điều tra.',
      iconName: 'Lamp',
      count: 1,
      acquiredAt: 'Phá xong Vụ án 00',
    },
  },
  {
    id: 'ach-data-integrity',
    title: 'Mắt Đại Bàng Kiểm Định',
    description: 'Kiểm tra tính toàn vẹn của 150 đơn hàng và phát hiện không có giá trị khuyết thiếu.',
    iconName: 'SearchCheck',
    expReward: 50,
    category: 'analysis',
    unlockedOfficeItem: 'Kính lúp điều tra chuyên dụng trên bàn làm việc',
    rewardType: 'tool',
    rewardTitle: 'Dụng cụ: Kính Lúp Soi Dữ Liệu (Clue Magnifier)',
    rewardItem: {
      id: 'item-tool-magnifier',
      name: 'Kính Lúp Soi Dữ Liệu Chuyên Dụng',
      category: 'tool',
      description: 'Tự động làm nổi bật các giá trị ngoại lai (Outliers) và ô dữ liệu trống (NaN / Null).',
      iconName: 'Search',
      count: 3,
      acquiredAt: 'Kiểm định 150 đơn hàng',
    },
  },
  {
    id: 'ach-critical-thinker',
    title: 'Tư Duy Khách Quan',
    description: 'Nhận diện chính xác giới hạn của tập dữ liệu: không thể suy đoán cháy hàng nếu thiếu số tồn kho.',
    iconName: 'ShieldAlert',
    expReward: 75,
    category: 'analysis',
    unlockedOfficeItem: 'Bảng ghi chú gỗ sồi phong cách thám tử',
    rewardType: 'theme',
    rewardTitle: 'Giao diện: Phong Cách Cổ Điển (Classic Detective Noir)',
  },
  {
    id: 'ach-board-master',
    title: 'Bậc Thầy Manh Mối',
    description: 'Ghim ít nhất 3 ghi chú điều tra (Quan sát, Giả thuyết, Bằng chứng) lên Bảng điều tra.',
    iconName: 'Pin',
    expReward: 50,
    category: 'investigation',
    unlockedOfficeItem: 'Cuộn chỉ đỏ kết nối đầu mối tội phạm',
    rewardType: 'token',
    rewardTitle: 'Thẻ Gợi Ý: Cuộn Chỉ Đỏ Phân Tích (Crimson String Token)',
    rewardItem: {
      id: 'item-token-string',
      name: 'Cuộn Chỉ Đỏ Phân Tích',
      category: 'token',
      description: 'Gợi ý ngay một mối quan hệ tương quan tiềm ẩn giữa 2 biến số trong vụ án đang xử lý.',
      iconName: 'Sparkles',
      count: 2,
      acquiredAt: 'Ghim 3 thẻ đầu mối',
    },
  },
  {
    id: 'ach-npc-listener',
    title: 'Thấu Hiểu Thân Chủ',
    description: 'Trò chuyện đầy đủ và khai thác tất cả manh mối bối cảnh từ Chú Ba quản lý căn tin.',
    iconName: 'MessageSquareText',
    expReward: 40,
    category: 'onboarding',
    unlockedOfficeItem: 'Tách trà thảo mộc thư giãn văn phòng',
    rewardType: 'prop',
    rewardTitle: 'Vật phẩm văn phòng: Bộ Tách Trà Thảo Mộc',
    rewardItem: {
      id: 'item-prop-tea',
      name: 'Bộ Tách Trà Thảo Mộc Thân Chủ',
      category: 'prop',
      description: 'Tách trà ấm giữ cho tâm trí luôn sáng suốt khi đối mặt với các bài toán dữ liệu phức tạp.',
      iconName: 'Coffee',
      count: 1,
      acquiredAt: 'Phỏng vấn thân chủ Chú Ba',
    },
  },
  {
    id: 'ach-explorer',
    title: 'Nhà Thám Hiểm Kho Dữ Liệu',
    description: 'Truy cập và lọc dữ liệu nâng cao trong Không gian làm việc Dataset Workspace.',
    iconName: 'Database',
    expReward: 40,
    category: 'analysis',
    unlockedOfficeItem: 'Màn hình máy tính phụ hiển thị luồng dữ liệu vũ trụ',
    rewardType: 'cheat_sheet',
    rewardTitle: 'Sổ tay: Các hàm xử lý bảng tính & SQL Cheat Sheet',
    rewardItem: {
      id: 'item-cheat-sql',
      name: 'Cẩm Nang Cú Pháp SQL & Pandas Truy Vết',
      category: 'cheatsheet',
      description: 'Tổng hợp các câu lệnh lọc, nhóm GROUP BY, tính SUM/COUNT/AVG và xử lý điều kiện HAVING.',
      iconName: 'Code',
      count: 1,
      acquiredAt: 'Khám phá Workspace',
      detailContent: `CÚ PHÁP TRUY VẤN DỮ LIỆU ĐIỀU TRA:
1. Tổng hợp doanh thu theo món:
   SELECT dish, SUM(quantity) as total_qty, SUM(total_vnd) as revenue
   FROM canteen_orders
   GROUP BY dish
   ORDER BY revenue DESC;

2. Lọc đơn hàng giờ cao điểm trưa có số lượng trên 2:
   SELECT * FROM canteen_orders
   WHERE time_slot = 'Trưa' AND quantity >= 2;

3. Tính giá trị đơn trung bình (AOV):
   SELECT AVG(total_vnd) as average_order_value FROM canteen_orders;`,
    },
  },
  {
    id: 'ach-milestone-lvl2',
    title: 'Thăng Cấp Nghiệp Vụ',
    description: 'Đạt cấp độ 2 Thám tử Chính thức với hơn 200 EXP tích lũy.',
    iconName: 'Award',
    expReward: 80,
    category: 'mastery',
    unlockedOfficeItem: 'Bằng khen Thám tử xuất sắc đóng khung treo tường',
    rewardType: 'avatar',
    rewardTitle: 'Khung Huy Hiệu: Khung Mạ Vàng Thám Tử Chính Thức',
  },
  {
    id: 'ach-ai-companion',
    title: 'Cộng Sự Trí Tuệ Nhân Tạo',
    description: 'Mở khóa và tùy chỉnh tên cho Trợ lý AI đồng hành phân tích dữ liệu.',
    iconName: 'Bot',
    expReward: 100,
    category: 'mastery',
    unlockedOfficeItem: 'Mô-đun trợ lý AI trên bàn máy trạm văn phòng',
    rewardType: 'prop',
    rewardTitle: 'Huy hiệu: Chỉ huy Trợ lý Dữ liệu AI',
  },
];
