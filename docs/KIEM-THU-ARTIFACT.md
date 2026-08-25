# Kiểm thử artifact phát hành

## 2026-08-25 — Bản HTML offline v1.2.0

- Artifact: `releases/TT12-Excel-Validator-v1.2.0-offline.html`.
- Kết quả ban đầu khi mở trực tiếp qua `file://`: trang trắng, chưa đạt smoke test.
- Cách xử lý: dùng `vite-plugin-singlefile` và route fallback về màn hình chính đối với pathname `file://`.
- Kết quả sau xử lý: ứng dụng hiển thị đầy đủ bảng tra cứu, sidebar, metadata phiên bản và thư viện tài liệu khi mở trực tiếp từ artifact; **đạt smoke test HTML offline**.

## 2026-08-25 — EXE portable Windows v1.2.0

Artifact `releases/TT12-Excel-Validator-v1.2.0-win-x64.exe` đã được tạo từ target `node22-win-x64`. Tệp được xác nhận là PE32+ x86-64 cho Windows, kích thước 58 MB. Sandbox Linux không thể chạy smoke test Windows; cần chạy file trên Windows 64-bit và mở `http://localhost:3000` để kiểm tra lần cuối tại máy đích.

## 2026-08-25 — Bản v1.3.0

Single HTML `TT12-Excel-Validator-v1.3.0-offline.html` đã được mở trực tiếp qua `file://` và hiển thị ứng dụng bình thường. Smoke test xác nhận các nhãn sáu mẫu, cột **Bắt buộc/Trùng** và điểm vào **Quy tắc cơ sở KCB** đều có trong artifact offline. EXE v1.3.0 được xác nhận là PE32+ x86-64 cho Windows; vẫn cần thực hiện smoke test trên Windows 64-bit tại máy đích.
