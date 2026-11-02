import React, { useState } from 'react';
import {
  Briefcase,
  X,
  Search,
  FileText,
  Lamp,
  Coffee,
  Code,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { InventoryItem } from '../../types';

export const InventoryBubble: React.FC = () => {
  const { inventory } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'cheatsheet' | 'tool' | 'prop' | 'token'>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search':
        return Search;
      case 'Lamp':
        return Lamp;
      case 'Coffee':
        return Coffee;
      case 'Code':
        return Code;
      case 'Sparkles':
        return Sparkles;
      case 'FileText':
      default:
        return FileText;
    }
  };

  const filteredItems = inventory.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const totalItemCount = inventory.reduce((sum, item) => sum + (item.count || 1), 0);

  return (
    <>
      {/* Floating Action Button at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-3.5 rounded-full bg-gradient-to-br from-[#2A2421] to-[#121820] text-[#E5A93C] border-2 border-[#D4AF37]/80 shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-[#D4AF37]/20"
          aria-label="Mở túi đồ nghề thám tử"
          title="Túi đồ nghề & Sổ tay thám tử"
        >
          <Briefcase className="w-6 h-6 group-hover:rotate-6 transition-transform text-[#E5A93C]" />

          {/* Badge */}
          <span className="absolute -top-1.5 -right-1.5 bg-[#C93B2B] text-white text-[11px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121820] shadow-md animate-pulse">
            {totalItemCount}
          </span>
        </button>
      </div>

      {/* Slide-over Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md h-full bg-[#1A1D24] border-l border-[#3A322C] shadow-2xl flex flex-col text-[#EDE8DF] relative">
            {/* Header */}
            <div className="p-5 border-b border-[#3A322C] flex items-center justify-between bg-[#121820]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2A2421] border border-[#D4AF37]/50 flex items-center justify-center text-[#E5A93C]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Túi Đồ Nghề Thám Tử</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2421] text-[#E5A93C] border border-[#D4AF37]/30">
                      INVENTORY
                    </span>
                  </h2>
                  <p className="text-xs text-[#9BA3AF]">
                    Dụng cụ phân tích, sổ tay công thức và vật phẩm hỗ trợ
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setSelectedItem(null);
                }}
                className="p-1.5 rounded-lg text-[#9BA3AF] hover:text-white hover:bg-[#2A2421] transition cursor-pointer"
                aria-label="Đóng túi đồ nghề"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-3 bg-[#121820]/60 border-b border-[#3A322C] overflow-x-auto text-xs">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'cheatsheet', label: 'Sổ tay & Cú pháp' },
                { id: 'tool', label: 'Dụng cụ' },
                { id: 'prop', label: 'Đạo cụ bàn' },
                { id: 'token', label: 'Thẻ gợi ý' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeCategory === tab.id
                      ? 'bg-[#E5A93C] text-[#121820] font-bold shadow-sm'
                      : 'text-[#9BA3AF] hover:bg-[#2A2421] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredItems.map((item) => {
                const IconComponent = getIcon(item.iconName);
                const isSelected = selectedItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#2A2421] border-[#E5A93C] ring-2 ring-[#E5A93C]/20 shadow-md'
                        : 'bg-[#151A22] border-[#3A322C] hover:border-[#D4AF37]/50 hover:bg-[#1C222C]'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#121820] border border-[#3A322C] flex items-center justify-center text-[#E5A93C] shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#121820] text-[#E5A93C] border border-[#3A322C]">
                          x{item.count}
                        </span>
                      </div>
                      <p className="text-xs text-[#9BA3AF] mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#D4AF37]">
                        <span>Nguồn: {item.acquiredAt}</span>
                        {item.detailContent && (
                          <span className="flex items-center gap-1 font-semibold text-[#00E5FF]">
                            <BookOpen className="w-3 h-3" /> Bấm để đọc
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-[#9BA3AF] space-y-2">
                  <Briefcase className="w-10 h-10 mx-auto opacity-30 text-[#E5A93C]" />
                  <p className="text-xs">Chưa có vật phẩm trong danh mục này.</p>
                </div>
              )}
            </div>

            {/* Item Detail Inspector Drawer */}
            {selectedItem && selectedItem.detailContent && (
              <div className="p-4 bg-[#121820] border-t border-[#3A322C] max-h-56 overflow-y-auto space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#3A322C]">
                  <span className="font-mono text-[#E5A93C] font-bold">NỘI DUNG TRA CỨU: {selectedItem.name}</span>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-[#9BA3AF] hover:text-white"
                  >
                    Thu nhỏ
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-[#EDE8DF] bg-[#0F1318] p-3 rounded-xl border border-[#3A322C] whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {selectedItem.detailContent}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
