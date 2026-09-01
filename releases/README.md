# Release Artifacts

Thư mục này chứa các bản build phát hành của ứng dụng **TT12 Excel Validator**.

| Định dạng / Đường dẫn | Loại | Mô tả |
|---|---|---|
| [`releases/single-page/tt12-excel-validator.html`](./single-page/tt12-excel-validator.html) | Single HTML | Bản HTML tự chứa (all-in-one), tải về mở trực tiếp bằng trình duyệt không cần cài đặt hay bật server. |
| [`releases/TT12-Excel-Validator-v1.7.1-offline.html`](./TT12-Excel-Validator-v1.7.1-offline.html) | Single HTML | Bản HTML offline gắn tag phiên bản `1.7.1`. |
| `releases/TT12-Excel-Validator-v<version>-win-x64.exe` | EXE portable | Đóng gói kèm runtime Node 22 (tạo bằng lệnh `pnpm build:exe`). |

> **Ghi chú bảo mật & an toàn:**
> - Bản HTML single-page và offline chạy 100% Client-side trên trình duyệt máy tính.
> - Toàn bộ quá trình đọc, đối chiếu và xuất báo cáo Excel diễn ra trên RAM của máy người dùng, không truyền tải bất kỳ dữ liệu nhạy cảm nào qua mạng.
