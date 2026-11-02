import { CaseBenchmarkSolution } from '../types';

export const CASE_BENCHMARK_SOLUTIONS: Record<string, CaseBenchmarkSolution> = {
  'case-00': {
    caseId: 'case-00',
    caseCode: 'CASE-00',
    caseTitle: 'Bí Ẩn Món Ăn Bán Chạy Tại Căn Tin Trường Học',
    coreConcepts: [
      {
        title: 'Biến Định Tính vs Biến Định Lượng (Categorical vs Quantitative)',
        description:
          'Biến định lượng như Đơn giá, Thành tiền, Số lượng cho phép tính Tổng (SUM) và Trung bình (MEAN). Biến định tính như Món ăn, Khung giờ, Phương thức thanh toán được phân tích qua Số đếm tần suất (COUNT/FREQUENCY) và Yếu vị (MODE).',
        keyTakeaway: 'Không thể tính trung bình cộng của tên món ăn; phải đếm số lần xuất hiện hoặc tổng hợp theo nhóm (GROUP BY).',
      },
      {
        title: 'Tổng Hợp Dữ Liệu (Aggregation & Segmentation)',
        description:
          'Một món có thể có ít đơn hàng nhưng số lượng mỗi đơn lại lớn. Cần phân biệt rõ: Số lượt mua (Count of Transactions) vs Số suất bán thực tế (Sum of Quantity).',
        keyTakeaway: 'Doanh thu = Đơn giá × Số lượng. Tổng doanh thu căn tin phụ thuộc 48.5% vào khung giờ Trưa.',
      },
      {
        title: 'Bẫy Thiếu Mẫu Số & Cung Cầu (Missing Denominator / Selection Bias)',
        description:
          'Bảng dữ liệu chỉ ghi nhận giao dịch thành công (Purchases). Nếu nhà bếp chỉ nấu 10 suất Cơm chay và bán hết lúc 11:30, số liệu chỉ ghi 10 đơn. Ta không thể kết luận món này "ế" nếu không biết số lượng chuẩn bị ban đầu (Stock Supply).',
        keyTakeaway: 'Dữ liệu bán hàng không phản ánh toàn bộ nhu cầu thực tế nếu thiếu biến tồn kho và thời điểm hết món.',
      },
    ],
    idealApproachSteps: [
      {
        step: 1,
        title: 'Kiểm toán Cấu trúc & Toàn vẹn Dữ liệu',
        description:
          'Xác nhận 150 dòng quan sát (đơn hàng), 8 cột biến số. Kiểm tra giá trị thiếu (0 ô trống) và công thức số học (total_vnd = quantity × unit_price_vnd chính xác 100%).',
      },
      {
        step: 2,
        title: 'Xếp hạng Phân phối Món & Khung giờ',
        description:
          'Thực hiện thống kê tần suất và doanh thu theo món ăn. Xác định Cơm gà sốt teriyaki (40 suất) và Cơm rang dưa bò (35 suất) chiếm vị trí dẫn đầu.',
      },
      {
        step: 3,
        title: 'Phân tích Giờ Cao Điểm (Peak Hour Analysis)',
        description:
          'Nhận diện khung giờ Trưa tạo ra 3.230.000 đ (48.5% doanh thu) và 71 đơn hàng, tạo áp lực tắc nghẽn quầy phục vụ lúc 11h30 - 12h30.',
      },
      {
        step: 4,
        title: 'Phát hiện Biến Ẩn & Đề xuất Thử nghiệm',
        description:
          'Phản biện giả định của quản lý Ba về món "ế ẩm". Đề xuất lập sổ kiểm kê suất nấu và ghi nhận lượt khách hỏi mua khi hết món để đo nhu cầu thực sự.',
      },
    ],
    officialReport: {
      finding1:
        'Cơm gà sốt teriyaki (40 suất, 1.400.000 đ) và Cơm rang dưa bò (35 suất, 1.225.000 đ) là hai món bán chạy nhất, đóng góp hơn 39.4% tổng doanh thu căn tin.',
      evidence1:
        'Thống kê tổng hợp từ 150 đơn hàng: Khung giờ Trưa chiếm 71/150 đơn (48.5% doanh thu). Nhóm Cơm chiếm tỷ trọng áp đảo (50.7% số suất bán toàn căn tin). Phương thức thanh toán chuyển khoản & ví điện tử chiếm 66.7% tổng giao dịch.',
      furtherQuestion:
        'Các món có số lượng bán thấp như Salad gà (6 suất) hay Cơm chay (9 suất) thực sự ít người thích, hay do nhà bếp chỉ nấu số lượng hạn chế và hết sạch từ sớm?',
      recommendation:
        'Thiết lập sổ kiểm kê 2 đầu (Số suất chuẩn bị đầu ca vs Số suất dư cuối ca); Phân bổ thêm nhân sự vào ca Trưa (11h-13h); Thử nghiệm nấu tăng 50% suất Cơm chay trong 1 tuần để kiểm chứng độ co giãn của nhu cầu sinh viên trước khi đưa ra quyết định cắt giảm.',
    },
  },
  'case-01': {
    caseId: 'case-01',
    caseCode: 'CASE-01',
    caseTitle: 'Cú Rớt Phễu Thanh Toán 70% Chiến Dịch Tựu Trường',
    coreConcepts: [
      {
        title: 'Phân Tích Phễu Chuyển Đổi (Funnel Drop-Off Analysis)',
        description:
          'Mô hình hóa hành trình khách hàng từ Xem sản phẩm -> Thêm giỏ hàng -> Nhập địa chỉ -> Xác nhận thanh toán -> Mua thành công. Tỷ lệ chuyển đổi qua từng bước giúp định vị chính xác "vết nứt rò rỉ" của hệ thống.',
        keyTakeaway: 'Chặng 3 (Nhập địa chỉ) sang Chặng 4 (Xác nhận TT) có tỷ lệ rớt lên đến 50.7% (từ 138 phiên xuống 68 phiên).',
      },
      {
        title: 'Hiệu Ứng Chi Phí Ẩn Gây Sốc (Unexpected Cost Friction / Dark Pattern)',
        description:
          'Khách hàng sẵn sàng chi tiền mua sản phẩm, nhưng phản ứng rất tiêu cực nếu xuất hiện chi phí phụ thu bất ngờ ở bước cuối. Tỷ lệ bỏ giỏ hàng vì phí ship 50k chiếm đến 62% các trường hợp drop-off tại chặng này.',
        keyTakeaway: 'Phí ship không sai, nhưng việc giấu phí ship cho đến bước thanh toán cuối cùng gây cảm giác thiếu minh bạch.',
      },
      {
        title: 'Phân Đoạn Khách Hàng (User Segmentation & Device Breakdown)',
        description:
          'Khách hàng mới (New Customers) nhạy cảm hơn khách hàng thân thiết với phụ phí. Thiết bị Mobile có tỷ lệ bỏ giỏ cao hơn do thao tác nhập địa chỉ dài dòng kết hợp phí ship bất ngờ.',
        keyTakeaway: 'Cần phân tích đa chiều (Crosstab: Device × Segment × Drop-off Reason) thay vì nhìn vào số liệu tổng chung.',
      },
    ],
    idealApproachSteps: [
      {
        step: 1,
        title: 'Vẽ Sơ đồ Phễu 5 Chặng (Conversion Pipeline)',
        description:
          'Đếm số phiên đạt tới từng bước: Bước 1 (200) -> Bước 2 (166 / 83%) -> Bước 3 (138 / 69%) -> Bước 4 (68 / 34%) -> Bước 5 (52 / 26%).',
      },
      {
        step: 2,
        title: 'Định vị Cổ Chai Tỷ Lệ Rơi Rụng (Drop-off Bottleneck)',
        description:
          'Tính tỷ lệ rớt qua từng bước: Bước 1->2 (17%), Bước 2->3 (16.9%), Bước 3->4 (50.7% - ĐIỂM SỤT BẤT THƯỜNG), Bước 4->5 (23.5%).',
      },
      {
        step: 3,
        title: 'Truy Tìm Nguyên Nhân Gốc Rễ (Root Cause Analysis)',
        description:
          'Lọc 70 phiên bỏ cuộc tại Bước 3: Lý do "Sốc phí ship 50k bất ngờ" chiếm áp đảo (hơn 60%), trong khi lỗi kỹ thuật thanh toán hay ngân hàng chỉ dưới 10%.',
      },
      {
        step: 4,
        title: 'Đề Xuất Can Thiệp A/B Testing & Tối Ưu UX',
        description:
          'Thiết kế giải pháp minh bạch chi phí vận chuyển ngay tại giỏ hàng và đặt ngưỡng FreeShip để biến nhược điểm thành động lực tăng giá trị đơn hàng.',
      },
    ],
    officialReport: {
      finding1:
        'Vết nứt lớn nhất của phễu thanh toán nằm ở chặng giữa Bước 3 (Nhập địa chỉ giao hàng) và Bước 4 (Xác nhận thanh toán) với tỷ lệ rớt lên đến 50.7%, làm mất 70/138 khách hàng tiềm năng.',
      evidence1:
        'Từ 200 phiên: Có 166 khách thêm giỏ (83%), 138 khách nhập địa chỉ (69%), nhưng chỉ 68 khách qua bước thanh toán và 52 khách hoàn tất. Nguyên nhân "Sốc phí ship 50k bất ngờ" chiếm hơn 60% tổng số phiên bỏ rơi tại chặng này. Thiết bị di động chiếm 58% lượng bỏ giỏ.',
      furtherQuestion:
        'Nếu áp dụng ngưỡng Miễn phí vận chuyển (Free Shipping) cho đơn hàng từ 1.000.000 đ hoặc 1.500.000 đ, tỷ lệ khách mua thêm sản phẩm để được miễn phí ship sẽ tăng lên bao nhiêu?',
      recommendation:
        '1. Hiển thị thông báo phí vận chuyển minh bạch ngay tại Bước 2 (Giỏ hàng) kèm thanh tiến trình "Mua thêm X đồng để được FreeShip".\n2. Triển khai thử nghiệm A/B Testing 50/50 giữa phương án Hiển thị phí ship sớm vs Miễn phí ship kèm tăng giá nhẹ sản phẩm.\n3. Rút ngắn form địa chỉ trên Mobile để giảm ma sát thao tác.',
    },
  },
};
