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

## 2026-08-26 — Bản v1.4.0

Single HTML `TT12-Excel-Validator-v1.4.0-offline.html` đã được mở trực tiếp qua `file://` và đạt smoke test. Artifact hiển thị đủ sáu mẫu danh mục TT12 được thay thế, Mẫu 01/BH tổng hợp đề nghị thanh toán và Mẫu 02/BH báo cáo quyết toán. EXE v1.4.0 được xác nhận là PE32+ x86-64 cho Windows; cần chạy smoke test trên Windows 64-bit tại máy đích.

## 2026-08-26 — Bản v1.5.0

Single HTML `TT12-Excel-Validator-v1.5.0-offline.html` đã được mở trực tiếp qua `file://` và đạt smoke test. Artifact hiển thị dải hồ sơ kiểm định, metadata **VALIDATE CHI TIẾT ƯU TIÊN**, bảng Mẫu 01/DM có kích thước/diễn giải/cờ Bắt buộc–Trùng từ nguồn ưu tiên và thông tin phát hành `v1.5.0`. SHA-256: `8dc52525d5d12bafad135e70e9df1ed6715db31f5ce87a50f473fc56bd976ff7`.

EXE `TT12-Excel-Validator-v1.5.0-win-x64.exe` được xác nhận là `PE32+ x86-64` cho Windows, gồm 7 section. SHA-256: `1c639f91cce090a0df4d0def75d30d24bdcb6329d5e2b7101d666854f1184a2a`. Sandbox Linux không thể thực thi EXE Windows; cần chạy smoke test cuối cùng trên Windows 64-bit tại máy đích và mở `http://localhost:3000`.

## 2026-08-26 — Bản vá v1.5.1

Single HTML `TT12-Excel-Validator-v1.5.1-offline.html` đã được mở trực tiếp qua `file://`. Bản artifact hiển thị đủ 14 mục thư viện tài liệu, thông tin phát hành `v1.5.1`; console chỉ còn thông tin khuyến nghị React DevTools và **không còn** cảnh báo khóa React trùng. EXE `TT12-Excel-Validator-v1.5.1-win-x64.exe` được xác nhận là `PE32+ x86-64` cho Windows, gồm 7 section.
