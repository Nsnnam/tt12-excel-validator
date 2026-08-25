# Kiểm thử artifact phát hành

## 2026-08-25 — Bản HTML offline v1.2.0

- Artifact: `releases/TT12-Excel-Validator-v1.2.0-offline.html`.
- Kết quả ban đầu khi mở trực tiếp qua `file://`: trang trắng, chưa đạt smoke test.
- Cách xử lý: dùng `vite-plugin-singlefile` và route fallback về màn hình chính đối với pathname `file://`.
- Kết quả sau xử lý: ứng dụng hiển thị đầy đủ bảng tra cứu, sidebar, metadata phiên bản và thư viện tài liệu khi mở trực tiếp từ artifact; **đạt smoke test HTML offline**.
