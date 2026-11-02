# DATA CASE: ZERO

Trò chơi điều tra tương tác giúp người chơi học tư duy phân tích dữ liệu qua các vụ án kinh doanh. Người chơi khám phá hồ sơ, làm việc với dataset, ghi nhận manh mối và theo dõi tiến trình điều tra.

## Chạy ứng dụng trên máy local

### Yêu cầu

- Node.js 22 LTS (kèm npm). Tải từ [nodejs.org](https://nodejs.org/), sau đó mở terminal mới.

Kiểm tra cài đặt:

```powershell
node --version
npm --version
```

### Cài đặt và khởi động

Mở PowerShell tại thư mục dự án rồi chạy:

```powershell
npm install
npm run dev
```

Mở địa chỉ được Vite hiển thị trong terminal, mặc định là [http://localhost:3000](http://localhost:3000). Giữ terminal đang chạy trong khi sử dụng ứng dụng; nhấn `Ctrl+C` để dừng.

### Kiểm tra mã nguồn và tạo bản build

```powershell
npm run lint
npm run build
```

Để xem bản build production trên máy local:

```powershell
npm run preview
```

Chatbot hiện sử dụng các câu trả lời giáo dục được định nghĩa sẵn trong ứng dụng, không cần Gemini API key.
