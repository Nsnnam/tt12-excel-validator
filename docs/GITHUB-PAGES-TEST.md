# Kiểm thử GitHub Pages

## 2026-08-28 — Public deployment

Repository `Nsnnam/tt12-excel-validator` đã được chuyển sang trạng thái **PUBLIC**. Workflow `.github/workflows/deploy-pages.yml` build thành công với `GITHUB_PAGES=1`, sử dụng base path `/tt12-excel-validator/`, upload artifact và deploy thành công bằng GitHub Actions.

Run thành công: `33136996032` — https://github.com/Nsnnam/tt12-excel-validator/actions/runs/33136996032

URL public: https://nsnnam.github.io/tt12-excel-validator/

Smoke test bằng My Browser xác nhận trang có tiêu đề **TT12 Excel Validator**, hiển thị dải hồ sơ, tám mẫu TT12, bộ tìm kiếm xuyên hồ sơ với phạm vi toàn bộ/mẫu/bảng, bảng schema và thư viện tài liệu. Các URL asset logo, texture và file mẫu dùng origin Manus tuyệt đối để không phụ thuộc root path của GitHub Pages.

Ghi chú: EXE và việc chạy ứng dụng native không thuộc GitHub Pages; bản Manus vẫn có domain `https://tt12excel-g5pahdhg.manus.space`. GitHub Actions hiện có cảnh báo deprecation của Node 20 trong một số action nhưng run đã thành công.
