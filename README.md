# TT12 Excel Validator

Ứng dụng web hỗ trợ **tra cứu, nhận diện và kiểm định tám mẫu Excel BHYT**: sáu mẫu danh mục TT12 cùng Mẫu 01/BH tổng hợp đề nghị thanh toán và Mẫu 02/BH báo cáo quyết toán.

| | |
|---|---|
| **Phiên bản** | `1.4.0` |
| **Ngày** | 2026-08-26 |
| **Tác giả** | [Nguyễn Sơn Nam (Nsnnam)](https://github.com/Nsnnam) |
| **Múi giờ** | GMT+7 (`Asia/Ho_Chi_Minh`) |
| **Nguồn tham chiếu** | [Tra cứu danh mục TT12](https://tracuu-danhmuc-tt12.web.app/) |

## Tính năng

Ứng dụng tổ chức sáu mẫu 01–06/DM và hai mẫu 01–02/BH theo sidebar tra cứu, hiển thị cấu trúc chỉ tiêu tương ứng. Schema được trích xuất từ sheet **Hướng dẫn** của các file người dùng cung cấp; nhận diện dựa trên **chữ ký hàng tiêu đề**, không suy đoán theo tên tệp.

Khi import file `.xlsx`, `.xls` hoặc `.xlsm`, công cụ đọc sheet có độ khớp cấu trúc cao nhất, công bố mức độ tin cậy nhận diện và phân loại phát hiện thành **Lỗi**, **Cảnh báo** và **Thông tin**. Phạm vi rà soát gồm thiếu/trùng cột, thiếu dữ liệu lõi, độ dài, ngày `YYYYMMDD`, định dạng mã, tiền tệ/số liệu, ký tự ẩn, khoảng trắng, xuống dòng, công thức Excel, trùng khóa nghiệp vụ và một số quan hệ logic đặc thù từng mẫu.

| Loại kiểm tra | Ví dụ áp dụng |
|---|---|
| **Văn bản** | Khoảng trắng đầu/cuối, nhiều khoảng trắng, xuống dòng, ký tự ẩn, khoảng trắng không ngắt. |
| **Cấu trúc** | Thiếu/trùng cột, tên cột ngoài mẫu, hàng tiêu đề sai. |
| **Định dạng** | Ngày `YYYYMMDD`/`YYYYMMDDHHMM[SS]`, mã được Excel đọc thành số, độ dài `MA_CSKCB`, giá trị số/tiền tệ âm hoặc chứa ký hiệu. |
| **Logic mẫu** | Khoảng thời gian hiệu lực, khóa trùng, giường HSTC/HSCC so với tổng giường, đơn giá BHYT, tỷ lệ BHYT, năm sản xuất/sử dụng. |
| **Báo cáo** | Xuất `.xlsx` gồm ba sheet: `Tóm tắt`, `Chi tiết`, `Nhật ký`. |

## Yêu cầu

Ứng dụng là web app React/TypeScript; cần Node.js 18+ và trình duyệt Chromium/Chrome/Edge/Firefox phiên bản hiện hành để phát triển. Việc đọc file chạy trên thiết bị người dùng trong phiên hiện tại; ứng dụng không có API lưu trữ file Excel.

## Cài đặt và chạy

```bash
git clone https://github.com/Nsnnam/tt12-excel-validator.git
cd tt12-excel-validator
pnpm install
pnpm dev
```

| Lệnh | Mục đích |
|---|---|
| `pnpm dev` | Chạy môi trường phát triển. |
| `pnpm check` | Kiểm tra kiểu TypeScript. |
| `pnpm vitest run client/src/lib/tt12.test.ts` | Chạy kiểm thử lõi kiểm định. |
| `pnpm build` | Đóng gói bản web tĩnh. |
| `pnpm build:offline` | Tạo một file HTML tự chứa tại `releases/`. |
| `pnpm build:exe` | Tạo EXE portable Windows 64-bit tại `releases/`. |

## Hướng dẫn sử dụng nhanh

Trước hết, mở **Tra cứu danh mục** để xem đúng cột của một trong tám mẫu và tải file mẫu tương ứng. Sau đó, vào **Kiểm định Excel** và chọn file Excel. Công cụ đọc các sheet, tự chọn sheet có chữ ký cột gần với một trong tám mẫu nhất, rồi lập bảng phát hiện theo dòng và cột.

Người dùng nên xử lý toàn bộ **Lỗi** trước khi rà soát **Cảnh báo**. Sau khi đối chiếu, chọn **Xuất báo cáo** để tạo file có các sheet tóm tắt, chi tiết và nhật ký theo thời điểm GMT+7. Nút **Nạp file khác** chỉ xóa trạng thái của phiên hiện tại, không chỉnh sửa file gốc.

## Cấu trúc rút gọn

| File / thư mục | Mô tả |
|---|---|
| `client/src/lib/tt12.ts` | Schema tám mẫu, nhận diện file, bộ quy tắc kiểm định và xuất báo cáo. |
| `client/src/lib/tt12.test.ts` | Kiểm thử quy tắc logic/ô công thức trọng yếu. |
| `client/src/pages/HomeExpanded.tsx` | Giao diện tra cứu, import, preview và đối chiếu. |
| `client/src/lib/meta.ts` | Nguồn sự thật cho version, tác giả, lịch sử và thông tin hỗ trợ. |
| `scripts/build-offline.mjs` | Tạo bản HTML tự chứa để chạy không cần web server. |
| `scripts/build-exe.mjs` | Đóng gói EXE portable Windows 64-bit. |
| `releases/` | Đường dẫn artifact phát hành, không commit binary lớn. |
| `client/src/index.css` | Hệ thống thiết kế Hồ sơ điều hành. |
| `ideas.md` | Quyết định phong cách và nhận diện giao diện. |
| `docs/HUONG-DAN.md` | Phạm vi kiểm tra, quy tắc và giới hạn. |
| `CHANGELOG.md` | Lịch sử phiên bản. |

## Lưu ý nghiệp vụ và an toàn

> **Công cụ hỗ trợ kiểm định sơ bộ, không thay thế tài liệu pháp lý hoặc việc đối chiếu với danh mục dùng chung đang hiệu lực.** Phiên bản `1.4.0` có thể đối chiếu cục bộ với danh mục mã do người dùng nạp; kết quả vẫn cần được xác nhận theo danh mục chính thức đang hiệu lực.

Ứng dụng chỉ đọc file và xuất báo cáo, không tự sửa file gốc. Các ô có công thức được cảnh báo để người dùng chủ động chuyển về giá trị tĩnh khi quy trình nộp danh mục yêu cầu. Dữ liệu có tính nhạy cảm không được đưa vào issue tracker, commit hoặc kho công khai.

## Thông tin phiên bản

Chi tiết thay đổi xem tại [CHANGELOG.md](./CHANGELOG.md).

| Ngày | Phiên bản | Nội dung |
|---|---|---|
| 2026-08-25 | `1.0.0` | Khởi tạo tra cứu TT12 và kiểm định Excel chạy cục bộ. |
| 2026-08-25 | `1.1.0` | Tích hợp dữ liệu nguồn, preview Excel, chuẩn hóa an toàn và đối chiếu danh mục. |
| 2026-08-25 | `1.2.0` | Chuẩn hóa NSN App Standard, thêm artifact HTML offline và EXE portable. |
| 2026-08-25 | `1.3.0` | Bổ sung cờ nghiệp vụ, lọc theo cột và quy tắc cơ sở KCB. |
| 2026-08-26 | `1.4.0` | Thay sáu file mẫu, thêm Mẫu 01/BH và 02/BH, nhận diện tám schema mới. |

## Ủng hộ

Xem [SUPPORT.md](./SUPPORT.md).

## Giấy phép

Private – dùng nội bộ đơn vị.
