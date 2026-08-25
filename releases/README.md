# Release Artifacts

Thư mục này được tạo bởi các script phát hành và không commit các binary lớn.

| Lệnh | Artifact |
|---|---|
| `pnpm build:offline` | `TT12-Excel-Validator-v<version>-offline.html` |
| `pnpm build:exe` | `TT12-Excel-Validator-v<version>-win-x64.exe` |

> Bản HTML offline chạy trực tiếp bằng trình duyệt hiện đại. Bản EXE portable phục vụ Windows 64-bit (Node 22 runtime), tự mở máy chủ cục bộ ở cổng `3000`; người dùng mở `http://localhost:3000` sau khi chạy file.
