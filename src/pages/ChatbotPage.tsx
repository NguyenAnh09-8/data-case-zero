import React, { useState } from 'react';
import {
  Bot,
  Lock,
  Sparkles,
  Send,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Unlock,
  HelpCircle,
  Brain,
  Lightbulb,
  Edit3,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CharacterAvatar } from '../components/npc/CharacterIllustrations';

export const ChatbotPage: React.FC = () => {
  const {
    isChatbotUnlocked,
    completedCases,
    devChatbotOverride,
    toggleChatbotDevOverride,
    profile,
    aiAssistantName,
    setShowAiNamingModal,
  } = useGame();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'bot'; text: string; timestamp: string }[]
  >([
    {
      sender: 'bot',
      text: `Xin chào thám tử ${profile.name}! Tôi là ${aiAssistantName}, Trợ lý Phân tích Dữ liệu đồng hành của bạn tại Văn phòng Điều tra. Tôi sẵn sàng hỗ trợ giải đáp các khái niệm Khoa học Dữ liệu, phương pháp kiểm định thống kê và định hướng suy luận. Bạn cần thảo luận điều gì hôm nay?`,
      timestamp: '09:30',
    },
  ]);

  const quickPrompts = [
    'Phân biệt Tương quan (Correlation) và Nhân quả (Causation)?',
    'Tại sao không thể kết luận món ế nếu thiếu số tồn kho?',
    'Khi nào nên dùng Bar chart so với Histogram hay Scatter plot?',
    'Cách nhận diện và xử lý giá trị ngoại lai (Outliers)?',
  ];

  const handleSendPrompt = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newMessages = [...messages, { sender: 'user' as const, text, timestamp: time }];
    setMessages(newMessages);
    setInputQuery('');

    // Generate educational data science response
    setTimeout(() => {
      let botResponse = '';
      const q = text.toLowerCase();

      if (q.includes('tương quan') || q.includes('nhân quả') || q.includes('correlation')) {
        botResponse = `Hai biến số biến thiên cùng nhau (tương quan) KHÔNG có nghĩa biến này là nguyên nhân gây ra biến kia (nhân quả).
Ví dụ trong Vụ án 00: Doanh thu căn tin tăng vọt vào khung giờ Trưa tương quan với giờ tan học của sinh viên, chứ không phải vì đồ ăn lúc trưa tự nhiên ngon hơn buổi sáng. Để chứng minh quan hệ nhân quả, chúng ta cần phương pháp thực nghiệm có nhóm đối chứng (A/B Testing hoặc Controlled Experiments).`;
      } else if (q.includes('tồn kho') || q.includes('món ế') || q.includes('case 00')) {
        botResponse = `Đây là bài học cốt lõi về "Giới hạn dữ liệu": Bảng hóa đơn chỉ ghi nhận các giao dịch đã hoàn tất.
Nếu căn tin chỉ nấu 10 suất Cơm chay, dù có 50 sinh viên muốn mua thì số đơn tối đa ghi nhận vẫn chỉ là 10 suất. Do đó, việc kết luận một sản phẩm "ế ẩm" chỉ dựa trên doanh số bán ra mà bỏ qua số lượng cung cấp ban đầu (Inventory & Supply) là một cái bẫy tư duy rất phổ biến trong phân tích kinh doanh!`;
      } else if (q.includes('bar chart') || q.includes('biểu đồ') || q.includes('histogram')) {
        botResponse = `Quy tắc chọn biểu đồ chuẩn trong Data Science:
1. Bar Chart: Dùng khi so sánh các biến định tính danh nghĩa rời rạc (Ví dụ: Doanh thu theo từng Món ăn hoặc Khung giờ Sáng/Trưa/Chiều).
2. Histogram: Dùng để xem hình dạng phân phối tần suất của một biến liên tục (Ví dụ: Phân phối độ tuổi sinh viên từ 18-25).
3. Scatter Plot: Dùng để tìm kiếm mẫu hình tương quan giữa 2 biến số định lượng (Ví dụ: Giá món ăn vs Số suất đặt mua).`;
      } else if (q.includes('outlier') || q.includes('ngoại lai')) {
        botResponse = `Điểm ngoại lai (Outlier) là các quan sát có giá trị cách biệt bất thường so với phần còn lại của tập dữ liệu.
Ví dụ: Một đơn hàng tại căn tin bình thường từ 25k - 80k, bỗng xuất hiện 1 đơn trị giá 3.500.000 đ (do đặt tiệc khoa). Giá trị này sẽ kéo lệch giá trị trung bình (Mean). Trong trường hợp đó, ta nên dùng Trung vị (Median) thay vì Trung bình để phản ánh sát thực tế hơn!`;
      } else {
        botResponse = `Câu hỏi rất hay! Trong điều tra dữ liệu, nguyên tắc vàng luôn là: "Tách biệt giữa Quan sát thực tế và Giả thuyết suy luận". Dữ liệu cung cấp chứng cứ số học, nhưng người thám tử phải đặt câu hỏi về bối cảnh kinh doanh, độ tin cậy của quy trình thu thập và các biến ẩn chưa được đo lường trước khi đưa ra khuyến nghị. Bạn có muốn phân tích sâu hơn về trường hợp cụ thể nào không?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#121820] text-[#EDE8DF] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#3A322C]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#00E5FF] uppercase tracking-wider">
              <Bot className="w-4 h-4 animate-pulse" />
              <span>TRỢ LÝ THÁM TỬ AI • COMPANION: {aiAssistantName.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Trợ Lý Trí Tuệ Nhân Tạo Văn Phòng
            </h1>
            <p className="text-xs text-[#9BA3AF] mt-1">
              Cố vấn giải đáp các khái niệm Khoa học Dữ liệu, phương pháp thống kê và tư duy phản biện.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Custom AI Naming trigger button */}
            <button
              onClick={() => setShowAiNamingModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A2536] border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-bold hover:bg-[#203147] transition cursor-pointer shadow-sm"
              title="Nhấp để đổi tên riêng cho Trợ lý AI của bạn"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Đổi tên: {aiAssistantName}</span>
            </button>

            {/* Dev mode toggle to allow immediate test without waiting */}
            <button
              onClick={toggleChatbotDevOverride}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                devChatbotOverride
                  ? 'bg-amber-950/80 border-amber-600 text-[#E5A93C]'
                  : 'bg-[#1A1D24] border-[#3A322C] text-[#9BA3AF] hover:text-white'
              }`}
              title="Cho phép kiểm thử viên xem giao diện Trợ lý AI trước khi phá đủ 4 vụ án"
            >
              {devChatbotOverride ? (
                <Unlock className="w-3.5 h-3.5 text-[#E5A93C]" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
              <span>{devChatbotOverride ? 'Đang mở thử nghiệm' : 'Mở khóa trước (Dev Mode)'}</span>
            </button>
          </div>
        </div>

        {/* LOCKED STATE */}
        {!isChatbotUnlocked ? (
          <div className="bg-[#1A1D24] p-8 sm:p-12 rounded-3xl border border-[#3A322C] shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-[#121820] text-[#00E5FF] flex items-center justify-center mx-auto shadow-inner border border-[#00E5FF]/30">
              <Lock className="w-10 h-10 text-[#00E5FF]" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-[#E5A93C] border border-[#E5A93C]/30">
                YÊU CẦU: HOÀN THÀNH VỤ ÁN 04
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Trợ Lý AI Đang Trong Giai Đoạn Mã Hóa Bảo Mật
              </h2>
              <p className="text-xs text-[#9BA3AF] leading-relaxed">
                Theo quy định của Trưởng văn phòng Hoàng Minh, thám tử cần chứng minh năng lực tư duy độc lập qua 4 vụ án đầu tiên trước khi được ủy quyền kích hoạt Trợ lý AI hỗ trợ phá án.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="max-w-sm mx-auto p-4 rounded-2xl bg-[#121820] border border-[#3A322C] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-[#EDE8DF]">
                <span>Tiến độ mở khóa:</span>
                <span className="font-bold text-[#00E5FF]">
                  {completedCases.length} / 4 vụ án
                </span>
              </div>
              <div className="w-full bg-[#202630] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00E5FF] to-[#E5A93C] h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (completedCases.length / 4) * 100)}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={toggleChatbotDevOverride}
                className="inline-flex items-center gap-2 text-xs text-[#00E5FF] font-semibold hover:underline cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Bấm vào đây để mở khóa xem thử giao diện trò chuyện</span>
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED CHAT STATE */
          <div className="bg-[#1A1D24] rounded-3xl border border-[#3A322C] shadow-2xl overflow-hidden flex flex-col h-[620px]">
            {/* Top Bar with Director Endorsement & AI Avatar */}
            <div className="p-4 bg-[#121820] border-b border-[#3A322C] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#0A84FF] text-[#121820] flex items-center justify-center shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{aiAssistantName}</span>
                      <button
                        onClick={() => setShowAiNamingModal(true)}
                        className="text-[10px] text-[#00E5FF] hover:underline flex items-center gap-0.5"
                      >
                        [Đổi tên]
                      </button>
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                      Trực tuyến
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9BA3AF]">
                    Huấn luyện theo hiến pháp tư duy dữ liệu khách quan & không thiên kiến
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-[#9BA3AF] font-mono hidden sm:block">
                <span>CỤC ĐIỀU TRA DỮ LIỆU</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#161A22]">
              {messages.map((msg, idx) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      isBot ? 'flex-row' : 'flex-row-reverse'
                    }`}
                  >
                    {isBot ? (
                      <div className="w-8 h-8 rounded-xl bg-[#00E5FF] text-[#121820] flex items-center justify-center shrink-0 shadow-md">
                        <Bot className="w-4 h-4 font-bold" />
                      </div>
                    ) : (
                      <CharacterAvatar id="player_detective" size="sm" />
                    )}

                    <div
                      className={`max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isBot
                          ? 'bg-[#1A1D24] text-[#EDE8DF] border border-[#2A3F55] rounded-tl-none shadow-md whitespace-pre-line'
                          : 'bg-[#E5A93C] text-[#121820] font-medium rounded-tr-none shadow-md'
                      }`}
                    >
                      {msg.text}
                      <div
                        className={`text-[10px] font-mono mt-1 ${
                          isBot ? 'text-[#9BA3AF]' : 'text-[#3E2C14]'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Prompts */}
            <div className="p-3 bg-[#121820] border-t border-[#3A322C] flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-[#E5A93C] shrink-0 font-mono">
                Gợi ý:
              </span>
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendPrompt(prompt)}
                  className="px-3 py-1 rounded-full bg-[#1A1D24] hover:bg-[#2A2421] border border-[#3A322C] text-[11px] text-[#EDE8DF] hover:text-[#E5A93C] whitespace-nowrap transition cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Query Input Bar */}
            <div className="p-4 bg-[#121820] border-t border-[#3A322C]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPrompt();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Đặt câu hỏi về thống kê, làm sạch dữ liệu với ${aiAssistantName}...`}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#1A1D24] border border-[#3A322C] text-xs text-white placeholder:text-[#9BA3AF] focus:outline-none focus:border-[#00E5FF]"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#33EAFF] text-[#121820] font-bold disabled:opacity-40 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
