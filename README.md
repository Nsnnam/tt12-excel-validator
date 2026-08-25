# TT12 Excel Validator

Ứng dụng web hỗ trợ **tra cứu cấu trúc sáu mẫu danh mục TT12** và kiểm định file Excel trước khi gửi, ưu tiên phát hiện lỗi cấu trúc, định dạng, văn bản và logic dữ liệu ngay trong trình duyệt.

| | |
|---|---|
| **Phiên bản** | `1.0.0` |
| **Ngày** | 2026-08-25 |
| **Tác giả** | [Nguyễn Sơn Nam (Nsnnam)](https://github.com/Nsnnam) |
| **Múi giờ** | GMT+7 (`Asia/Ho_Chi_Minh`) |
| **Nguồn tham chiếu** | [Tra cứu danh mục TT12](https://tracuu-danhmuc-tt12.web.app/) |

## Tính năng

Ứng dụng tổ chức sáu mẫu 01–06/DM theo sidebar tra cứu và hiển thị cấu trúc chỉ tiêu tương ứng. Các file mẫu được đối chiếu theo **chữ ký hàng tiêu đề**, vì vậy việc nhận diện không dựa trên suy đoán tên tệp.

Khi import file `.xlsx`, `.xls` hoặc `.xlsm`, công cụ đọc sheet có độ khớp cấu trúc cao nhất, công bố mức độ tin cậy nhận diện và phân loại phát hiện thành **Lỗi**, **Cảnh báo** và **Thông tin**. Phạm vi rà soát gồm thiếu/trùng cột, thiếu dữ liệu lõi, độ dài, ngày `YYYYMMDD`, định dạng mã, tiền tệ/số liệu, ký tự ẩn, khoảng trắng, xuống dòng, công thức Excel, trùng khóa nghiệp vụ và một số quan hệ logic đặc thù từng mẫu.

| Loại kiểm tra | Ví dụ áp dụng |
|---|---|
| **Văn bản** | Khoảng trắng đầu/cuối, nhiều khoảng trắng, xuống dòng, ký tự ẩn, khoảng trắng không ngắt. |
| **Cấu trúc** | Thiếu/trùng cột, tên cột ngoài mẫu, hàng tiêu đề sai. |
| **Định dạng** | Ngày `YYYYMMDD`, mã được Excel đọc thành số, độ dài `MA_CSKCB`, giá trị số/tiền tệ âm hoặc chứa ký hiệu. |
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

## Hướng dẫn sử dụng nhanh

Trước hết, mở **Tra cứu danh mục** để xem đúng cột của Mẫu 01–06/DM hoặc tải file mẫu từ nguồn tham chiếu. Sau đó, vào **Kiểm định Excel** và chọn file Excel. Công cụ đọc các sheet, tự chọn sheet có chữ ký cột gần với một trong sáu mẫu nhất, rồi lập bảng phát hiện theo dòng và cột.

Người dùng nên xử lý toàn bộ **Lỗi** trước khi rà soát **Cảnh báo**. Sau khi đối chiếu, chọn **Xuất báo cáo** để tạo file có các sheet tóm tắt, chi tiết và nhật ký theo thời điểm GMT+7. Nút **Nạp file khác** chỉ xóa trạng thái của phiên hiện tại, không chỉnh sửa file gốc.

## Cấu trúc rút gọn

| File / thư mục | Mô tả |
|---|---|
| `client/src/lib/tt12.ts` | Schema sáu mẫu, nhận diện file, bộ quy tắc kiểm định và xuất báo cáo. |
| `client/src/lib/tt12.test.ts` | Kiểm thử quy tắc logic/ô công thức trọng yếu. |
| `client/src/pages/Home.tsx` | Giao diện tra cứu, import và báo cáo. |
| `client/src/index.css` | Hệ thống thiết kế Hồ sơ điều hành. |
| `ideas.md` | Quyết định phong cách và nhận diện giao diện. |
| `docs/HUONG-DAN.md` | Phạm vi kiểm tra, quy tắc và giới hạn. |
| `CHANGELOG.md` | Lịch sử phiên bản. |

## Lưu ý nghiệp vụ và an toàn

> **Công cụ hỗ trợ kiểm định sơ bộ, không thay thế tài liệu pháp lý hoặc việc đối chiếu với danh mục dùng chung đang hiệu lực.** Phiên bản `1.0.0` chưa đóng gói cơ sở dữ liệu mã dùng chung; các mã cần được xác nhận tiếp với nguồn danh mục chính thức.

Ứng dụng chỉ đọc file và xuất báo cáo, không tự sửa file gốc. Các ô có công thức được cảnh báo để người dùng chủ động chuyển về giá trị tĩnh khi quy trình nộp danh mục yêu cầu. Dữ liệu có tính nhạy cảm không được đưa vào issue tracker, commit hoặc kho công khai.

## Thông tin phiên bản

Chi tiết thay đổi xem tại [CHANGELOG.md](./CHANGELOG.md).

| Ngày | Phiên bản | Nội dung |
|---|---|---|
| 2026-08-25 | `1.0.0` | Khởi tạo tra cứu TT12 và kiểm định Excel chạy cục bộ. |

## Ủng hộ

Xem [SUPPORT.md](./SUPPORT.md).

## Giấy phép

Private – dùng nội bộ đơn vị.
