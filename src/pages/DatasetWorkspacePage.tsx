import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  ArrowUpDown,
  Download,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  PieChart,
  Table as TableIcon,
  Database,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import { CANTEEN_DATASET } from '../data/canteenDataset';
import { TECHMART_FUNNEL_DATASET, TechMartFunnelRecord } from '../data/techmartDataset';
import { CanteenRecord } from '../types';
import { formatVND, getDishSummary, getTimeSlotSummary } from '../utils/canteenData';
import { useGame } from '../context/GameContext';

export const DatasetWorkspacePage: React.FC = () => {
  const { activeCaseId } = useGame();

  // Active dataset selector: Case 00 Canteen vs Case 01 Funnel
  const [selectedDatasetKey, setSelectedDatasetKey] = useState<'case-00' | 'case-01'>(
    activeCaseId === 'case-01' ? 'case-01' : 'case-00'
  );

  // Common filters
  const [search, setSearch] = useState('');

  // Case 00 specific filters
  const [slotFilter, setSlotFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [canteenSortField, setCanteenSortField] = useState<keyof CanteenRecord>('order_id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Case 01 specific filters
  const [stepFilter, setStepFilter] = useState<string>('all');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [funnelSortField, setFunnelSortField] = useState<keyof TechMartFunnelRecord>('session_id');

  // ==========================================
  // CASE 00 DATASET PROCESSING
  // ==========================================
  const totalRevenue = useMemo(
    () => CANTEEN_DATASET.reduce((sum, r) => sum + r.total_vnd, 0),
    []
  );
  const totalQuantity = useMemo(
    () => CANTEEN_DATASET.reduce((sum, r) => sum + r.quantity, 0),
    []
  );

  const filteredCanteenData = useMemo(() => {
    return CANTEEN_DATASET.filter((row) => {
      if (slotFilter !== 'all' && row.time_slot !== slotFilter) return false;
      if (categoryFilter !== 'all' && row.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          row.order_id.toLowerCase().includes(q) ||
          row.dish.toLowerCase().includes(q) ||
          row.payment_method.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      const valA = a[canteenSortField];
      const valB = b[canteenSortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [slotFilter, categoryFilter, search, canteenSortField, sortDirection]);

  // ==========================================
  // CASE 01 DATASET PROCESSING
  // ==========================================
  const filteredFunnelData = useMemo(() => {
    return TECHMART_FUNNEL_DATASET.filter((row) => {
      if (stepFilter !== 'all' && row.step_reached !== stepFilter) return false;
      if (deviceFilter !== 'all' && row.device !== deviceFilter) return false;
      if (reasonFilter !== 'all' && row.drop_off_reason !== reasonFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          row.session_id.toLowerCase().includes(q) ||
          row.user_segment.toLowerCase().includes(q) ||
          row.drop_off_reason.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      const valA = a[funnelSortField];
      const valB = b[funnelSortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [stepFilter, deviceFilter, reasonFilter, search, funnelSortField, sortDirection]);

  // Continuous Infinite Scroll Dataset length
  const activeDatasetLength =
    selectedDatasetKey === 'case-00' ? filteredCanteenData.length : filteredFunnelData.length;

  const handleExportCSV = () => {
    if (selectedDatasetKey === 'case-00') {
      const headers = ['order_id', 'dish', 'category', 'quantity', 'unit_price_vnd', 'total_vnd', 'time_slot', 'payment_method'];
      const rows = CANTEEN_DATASET.map((r) =>
        [r.order_id, `"${r.dish}"`, `"${r.category}"`, r.quantity, r.unit_price_vnd, r.total_vnd, `"${r.time_slot}"`, `"${r.payment_method}"`].join(',')
      );
      const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      downloadFile(csv, 'canteen_case00_dataset.csv');
    } else {
      const headers = ['session_id', 'user_segment', 'device', 'step_reached', 'cart_value_vnd', 'shipping_fee_vnd', 'shipping_fee_surprised', 'payment_method', 'drop_off_reason'];
      const rows = TECHMART_FUNNEL_DATASET.map((r) =>
        [r.session_id, `"${r.user_segment}"`, `"${r.device}"`, `"${r.step_reached}"`, r.cart_value_vnd, r.shipping_fee_vnd, r.shipping_fee_surprised, `"${r.payment_method}"`, `"${r.drop_off_reason}"`].join(',')
      );
      const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
      downloadFile(csv, 'techmart_case01_funnel_dataset.csv');
    }
  };

  const handleExportJSON = () => {
    const data = selectedDatasetKey === 'case-00' ? CANTEEN_DATASET : TECHMART_FUNNEL_DATASET;
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    downloadFile(jsonStr, `${selectedDatasetKey}_dataset.json`);
  };

  const downloadFile = (uri: string, filename: string) => {
    const a = document.createElement('a');
    a.href = uri;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Cyber-Noir Aesthetic */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#3A322C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#E5A93C] uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>KHÔNG GIAN LÀM VIỆC DỮ LIỆU • DETECTIVE DATA WORKSPACE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Bàn Soi Chi Tiết Tập Dữ Liệu
            </h1>
            <p className="text-sm text-[#9BA3AF] mt-1">
              Duyệt bảng dữ liệu chuẩn trinh thám: sắp xếp đa chiều, lọc biến số, rà soát ngoại lai và kết xuất dữ liệu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A1D24] border border-[#3A322C] hover:border-[#E5A93C] text-xs font-semibold text-[#EDE8DF] transition cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Tải file .CSV</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#E5A93C] to-[#D4AF37] hover:from-[#f3b544] hover:to-[#e0ba42] text-xs font-bold text-[#121820] transition cursor-pointer shadow-md"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Xuất .JSON</span>
            </button>
          </div>
        </div>

        {/* Dataset Switcher Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#1A1D24] rounded-2xl border border-[#3A322C] w-fit">
          <button
            onClick={() => setSelectedDatasetKey('case-00')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedDatasetKey === 'case-00'
                ? 'bg-[#E5A93C] text-[#121820] shadow-md'
                : 'text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>CASE-00: Đơn Hàng Căn Tin (150 quan sát)</span>
          </button>
          <button
            onClick={() => setSelectedDatasetKey('case-01')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedDatasetKey === 'case-01'
                ? 'bg-[#E5A93C] text-[#121820] shadow-md'
                : 'text-[#9BA3AF] hover:text-white hover:bg-[#2A2421]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>CASE-01: Phễu TechMart Online (200 quan sát)</span>
          </button>
        </div>

        {/* High-Level Metric Stat Cards (Cyber-Noir Themed) */}
        {selectedDatasetKey === 'case-00' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <span className="text-[11px] font-mono text-[#9BA3AF] uppercase">Tổng số đơn hàng</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">150 đơn</div>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold">✓ Không giá trị khuyết thiếu</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <span className="text-[11px] font-mono text-[#9BA3AF] uppercase">Tổng suất phục vụ</span>
              <div className="text-2xl font-bold font-mono text-[#E5A93C] mt-1">{totalQuantity} suất</div>
              <span className="text-[11px] text-[#9BA3AF] font-mono">Trung bình 1.6 suất/đơn</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <span className="text-[11px] font-mono text-[#9BA3AF] uppercase">Tổng doanh thu căn tin</span>
              <div className="text-2xl font-bold font-mono text-[#00E5FF] mt-1">{formatVND(totalRevenue)}</div>
              <span className="text-[11px] text-[#9BA3AF] font-mono">100% khớp đơn giá × số lượng</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <span className="text-[11px] font-mono text-[#9BA3AF] uppercase">Giờ cao điểm áp đảo</span>
              <div className="text-2xl font-bold font-mono text-[#C93B2B] mt-1">Khung Trưa</div>
              <span className="text-[11px] text-[#9BA3AF] font-mono">Chiếm 48.5% doanh thu</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <span className="text-[11px] font-mono text-[#9BA3AF] uppercase">Tổng phiên mua sắm</span>
              <div className="text-2xl font-bold font-mono text-white mt-1">200 phiên</div>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold">100% định danh session</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <span className="text-[11px] font-mono text-[#9BA3AF] uppercase">Mua thành công</span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">52 đơn (26%)</div>
              <span className="text-[11px] text-[#9BA3AF] font-mono">Tỷ lệ chuyển đổi tổng thể</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <span className="text-[11px] font-mono text-[#9BA3AF] uppercase">Vết nứt bỏ giỏ hàng</span>
              <div className="text-2xl font-bold font-mono text-[#C93B2B] mt-1">70 phiên rớt</div>
              <span className="text-[11px] text-rose-400 font-mono">Ở bước Nhập địa chỉ -&gt; Thanh toán</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] shadow-lg">
              <span className="text-[11px] font-mono text-[#9BA3AF] uppercase">Lý do bỏ rơi hàng đầu</span>
              <div className="text-xl font-bold font-mono text-[#E5A93C] mt-1 truncate">Sốc phí ship 50k</div>
              <span className="text-[11px] text-[#9BA3AF] font-mono">Chiếm 62% tổng số phiên hủy</span>
            </div>
          </div>
        )}

        {/* Filter and Search Bar (Cyber-Noir / Parchment Style) */}
        <div className="p-4 rounded-2xl bg-[#1A1D24] border border-[#3A322C] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#9BA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm ID, từ khóa..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#121820] border border-[#3A322C] text-xs text-white placeholder-[#9BA3AF] focus:outline-none focus:border-[#E5A93C]"
              />
            </div>

            {selectedDatasetKey === 'case-00' ? (
              <>
                <select
                  value={slotFilter}
                  onChange={(e) => setSlotFilter(e.target.value)}
                  className="bg-[#121820] text-[#EDE8DF] text-xs px-3 py-1.5 rounded-xl border border-[#3A322C] focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="all">Mọi khung giờ</option>
                  <option value="Sáng">Sáng</option>
                  <option value="Trưa">Trưa</option>
                  <option value="Chiều">Chiều</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-[#121820] text-[#EDE8DF] text-xs px-3 py-1.5 rounded-xl border border-[#3A322C] focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="all">Mọi danh mục</option>
                  <option value="Món chính">Món chính</option>
                  <option value="Đồ uống">Đồ uống</option>
                  <option value="Tráng miệng">Tráng miệng</option>
                </select>
              </>
            ) : (
              <>
                <select
                  value={stepFilter}
                  onChange={(e) => setStepFilter(e.target.value)}
                  className="bg-[#121820] text-[#EDE8DF] text-xs px-3 py-1.5 rounded-xl border border-[#3A322C] focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="all">Mọi bước phễu</option>
                  <option value="1_xem_san_pham">1. Xem sản phẩm</option>
                  <option value="2_them_gio_hang">2. Thêm giỏ hàng</option>
                  <option value="3_nhap_dia_chi">3. Nhập địa chỉ</option>
                  <option value="4_xac_nhan_thanh_toan">4. Xác nhận thanh toán</option>
                  <option value="5_thanh_toan_thanh_cong">5. Mua thành công</option>
                </select>

                <select
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                  className="bg-[#121820] text-[#EDE8DF] text-xs px-3 py-1.5 rounded-xl border border-[#3A322C] focus:outline-none focus:border-[#E5A93C]"
                >
                  <option value="all">Mọi thiết bị</option>
                  <option value="App di động">App di động</option>
                  <option value="Web di động">Web di động</option>
                  <option value="Máy tính để bàn">Máy tính để bàn</option>
                </select>
              </>
            )}
          </div>

          <div className="text-xs font-mono text-[#9BA3AF] shrink-0">
            Hiển thị <strong className="text-white">{activeDatasetLength}</strong> kết quả
          </div>
        </div>

        {/* Continuous Infinite Scroll Data Table Container */}
        <div className="rounded-3xl border border-[#3A322C] bg-[#1A1D24] shadow-2xl overflow-hidden flex flex-col">
          {/* Scrollable Viewport with Sticky Column Headers */}
          <div className="overflow-x-auto overflow-y-auto max-h-[580px] scrollbar-thin">
            {selectedDatasetKey === 'case-00' ? (
              <table className="w-full text-left text-xs font-mono">
                <thead className="sticky top-0 z-10 bg-[#121820] text-[#EDE8DF] border-b border-[#3A322C] shadow-md select-none">
                  <tr>
                    {[
                      { key: 'order_id', label: 'order_id' },
                      { key: 'dish', label: 'dish (Món ăn)' },
                      { key: 'category', label: 'category (Danh mục)' },
                      { key: 'quantity', label: 'quantity (Số lượng)' },
                      { key: 'unit_price_vnd', label: 'unit_price (Đơn giá)' },
                      { key: 'total_vnd', label: 'total_vnd (Thành tiền)' },
                      { key: 'time_slot', label: 'time_slot (Khung giờ)' },
                      { key: 'payment_method', label: 'payment_method' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => {
                          if (canteenSortField === col.key) {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setCanteenSortField(col.key as keyof CanteenRecord);
                            setSortDirection('asc');
                          }
                        }}
                        className="p-3.5 font-bold hover:text-[#E5A93C] cursor-pointer transition whitespace-nowrap bg-[#121820]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{col.label}</span>
                          <ArrowUpDown className="w-3 h-3 text-[#9BA3AF]" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2F38]">
                  {filteredCanteenData.map((row) => (
                    <tr key={row.order_id} className="hover:bg-[#202630] transition-colors">
                      <td className="p-3.5 font-bold text-[#E5A93C]">{row.order_id}</td>
                      <td className="p-3.5 font-sans font-medium text-white">{row.dish}</td>
                      <td className="p-3.5 font-sans">
                        <span className="px-2 py-0.5 rounded-md bg-[#121820] text-[#9BA3AF] border border-[#3A322C]">
                          {row.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-[#00E5FF]">{row.quantity}</td>
                      <td className="p-3.5">{formatVND(row.unit_price_vnd)}</td>
                      <td className="p-3.5 font-bold text-emerald-400">{formatVND(row.total_vnd)}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.time_slot === 'Trưa'
                              ? 'bg-[#C93B2B]/20 text-[#C93B2B] border border-[#C93B2B]/40'
                              : row.time_slot === 'Sáng'
                              ? 'bg-amber-500/20 text-[#E5A93C] border border-[#E5A93C]/40'
                              : 'bg-blue-500/20 text-[#00E5FF] border border-[#00E5FF]/40'
                          }`}
                        >
                          {row.time_slot}
                        </span>
                      </td>
                      <td className="p-3.5 font-sans text-[#9BA3AF]">{row.payment_method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs font-mono">
                <thead className="sticky top-0 z-10 bg-[#121820] text-[#EDE8DF] border-b border-[#3A322C] shadow-md select-none">
                  <tr>
                    {[
                      { key: 'session_id', label: 'session_id' },
                      { key: 'user_segment', label: 'user_segment' },
                      { key: 'device', label: 'device' },
                      { key: 'step_reached', label: 'step_reached (Chặng phễu)' },
                      { key: 'cart_value_vnd', label: 'cart_value_vnd' },
                      { key: 'shipping_fee_vnd', label: 'shipping_fee' },
                      { key: 'drop_off_reason', label: 'drop_off_reason' },
                      { key: 'payment_method', label: 'payment_method' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => {
                          if (funnelSortField === col.key) {
                            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                          } else {
                            setFunnelSortField(col.key as keyof TechMartFunnelRecord);
                            setSortDirection('asc');
                          }
                        }}
                        className="p-3.5 font-bold hover:text-[#E5A93C] cursor-pointer transition whitespace-nowrap bg-[#121820]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{col.label}</span>
                          <ArrowUpDown className="w-3 h-3 text-[#9BA3AF]" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2F38]">
                  {filteredFunnelData.map((row) => (
                    <tr key={row.session_id} className="hover:bg-[#202630] transition-colors">
                      <td className="p-3.5 font-bold text-[#E5A93C]">{row.session_id}</td>
                      <td className="p-3.5 font-sans text-white">{row.user_segment}</td>
                      <td className="p-3.5 font-sans text-[#9BA3AF]">{row.device}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.step_reached === '5_thanh_toan_thanh_cong'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : row.step_reached === '3_nhap_dia_chi'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-amber-500/20 text-[#E5A93C] border border-[#E5A93C]/40'
                          }`}
                        >
                          {row.step_reached}
                        </span>
                      </td>
                      <td className="p-3.5">{formatVND(row.cart_value_vnd)}</td>
                      <td className="p-3.5 text-[#9BA3AF]">{formatVND(row.shipping_fee_vnd)}</td>
                      <td className="p-3.5 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            row.drop_off_reason === 'Sốc phí ship 50k bất ngờ'
                              ? 'bg-[#C93B2B]/20 text-[#C93B2B] font-bold'
                              : row.drop_off_reason === 'Không có (Thành công)'
                              ? 'text-emerald-400 font-bold'
                              : 'text-[#9BA3AF]'
                          }`}
                        >
                          {row.drop_off_reason}
                        </span>
                      </td>
                      <td className="p-3.5 font-sans text-[#9BA3AF]">{row.payment_method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Continuous Infinite Scroll Inspector Footer (No Pagination) */}
          <div className="p-4 bg-[#121820] border-t border-[#3A322C] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#9BA3AF]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Hiển thị toàn bộ{' '}
                <strong className="text-white">
                  {selectedDatasetKey === 'case-00'
                    ? filteredCanteenData.length
                    : filteredFunnelData.length}
                </strong>{' '}
                bản ghi • <span className="text-[#E5A93C]">Cuộn vô tận (Không phân trang)</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#9BA3AF]">
              <span className="text-[11px] bg-[#1A1D24] px-2.5 py-1 rounded-lg border border-[#3A322C]">
                Tiêu đề cột ghim cố định (Sticky Headers)
              </span>
              <button
                type="button"
                onClick={() => {
                  const tableEl = document.querySelector('.overflow-y-auto');
                  if (tableEl) tableEl.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-1 rounded-lg bg-[#2A2421] text-[#E5A93C] hover:bg-[#3A322C] transition cursor-pointer"
              >
                ↑ Lên đầu bảng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
