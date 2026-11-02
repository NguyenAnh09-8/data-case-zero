import React, { useState } from 'react';
import { Bot, Sparkles, Check, X, Shield, Award, Wand2 } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface CustomAiNamingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomAiNamingModal: React.FC<CustomAiNamingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { aiAssistantName, setAiAssistantName, profile } = useGame();
  const [customName, setCustomName] = useState(aiAssistantName || 'DataHound AI');

  if (!isOpen) return null;

  const presets = [
    { name: 'DataHound AI', desc: 'Thần khuyển dữ liệu đánh hơi điểm dị biệt' },
    { name: 'Sherlock Byte', desc: 'Tư duy logic nhạy bén, truy tìm quy luật ẩn' },
    { name: 'Watson Query', desc: 'Trợ lý phân tích, trực quan hóa và tổng hợp số liệu' },
    { name: 'Minh Trí AI', desc: 'Cố vấn khách quan, phản biện các sai lầm thống kê' },
    { name: 'CyberSleuth', desc: 'Siêu trí tuệ thuật toán, chuyên xử lý chuỗi và phễu' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      setAiAssistantName(customName.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#161A22] border-2 border-[#00E5FF]/60 shadow-2xl overflow-hidden text-[#EDE8DF]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0C1929] via-[#10243C] to-[#0C1929] px-6 py-4 border-b border-[#23425F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00E5FF] text-[#121820] flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                MÔ-ĐUN CỘNG SỰ AI • BẢN QUYỀN VĂN PHÒNG
              </div>
              <h3 className="text-sm font-bold text-white">
                Tùy Chỉnh Tên Trợ Lý Thám Tử AI
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9BA3AF] hover:text-white hover:bg-[#202F44] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đặc Quyền Sau Vụ Án 04</span>
            </div>
            <h2 className="text-xl font-black text-white">
              Đặt Tên Cho Người Bạn Đồng Hành AI
            </h2>
            <p className="text-xs text-[#9BA3AF] leading-relaxed">
              Tên gọi này sẽ xuất hiện trong toàn bộ cuộc đối thoại, khung giải đáp tại văn phòng và báo cáo tư vấn dành riêng cho thám tử <strong className="text-white">{profile.name}</strong>.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-[#00E5FF] uppercase font-bold block">
              Gợi ý tên danh tiếng:
            </label>
            <div className="space-y-2">
              {presets.map((preset) => {
                const isSelected = customName === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setCustomName(preset.name)}
                    className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#0E2744] border-[#00E5FF] text-white shadow-sm'
                        : 'bg-[#182332] border-[#2A3B50] hover:border-[#00E5FF]/50 text-[#EDE8DF]'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>{preset.name}</span>
                        {isSelected && (
                          <span className="text-[10px] font-mono text-[#00E5FF] font-semibold">
                            (Đang chọn)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#9BA3AF] mt-0.5">
                        {preset.desc}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#00E5FF] shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input field */}
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-white flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Hoặc tự nhập tên riêng của bạn:</span>
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Nhập tên trợ lý..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121A24] border border-[#23425F] text-white focus:outline-none focus:border-[#00E5FF] font-mono font-bold text-xs"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#23425F]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1A2536] hover:bg-[#25344C] text-xs font-semibold text-[#9BA3AF] hover:text-white transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#33EAFF] text-[#0A1828] text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-[#00E5FF]/20 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Xác Nhận Đổi Tên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
