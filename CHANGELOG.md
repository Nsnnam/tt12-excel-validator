# Lịch sử thay đổi

Mọi thay đổi đáng chú ý của **TT12 Excel Validator** được ghi tại đây theo [Keep a Changelog](https://keepachangelog.com/) và Semantic Versioning.

## [Unreleased]

Chưa có thay đổi ngoài phiên bản phát hành đầu tiên.

## [1.1.0] — 2026-08-25

### Thêm mới

- Nhập dữ liệu validate đầy đủ của sáu mẫu TT12, bốn danh mục mã dùng chung, 15 bảng chỉ tiêu QĐ 3176 và chỉ mục 13 tài liệu/file mẫu từ trang tham chiếu.
- Bổ sung màn hình tra cứu danh mục mã dùng chung và bảng QĐ 3176 ngay trong ứng dụng.
- Bổ sung xem trước Excel trực tiếp, tô màu ô theo mức độ lỗi/cảnh báo/thông tin và tooltip nội dung phát hiện.
- Bổ sung nạp file danh mục mã khoa/mã khám bệnh để đối chiếu mã và tên tại trình duyệt.
- Bổ sung luồng xác nhận tạo file chuẩn hóa; chỉ làm sạch khoảng trắng, xuống dòng và khoảng trắng không ngắt, không sửa file gốc.

### Thay đổi

- Hàng tiêu đề Excel được nhận diện là cấu trúc, không bị gán là dòng dữ liệu lỗi hoặc tô màu như ô lỗi.

## [1.0.0] — 2026-08-25

### Thêm mới

- Tạo giao diện tra cứu sáu mẫu 01–06/DM theo cấu trúc của trang tham chiếu TT12.
- Bổ sung import `.xlsx`, `.xls`, `.xlsm`, quét sheet và nhận diện mẫu bằng chữ ký cột.
- Bổ sung kiểm tra cấu trúc, thiếu dữ liệu, ký tự văn bản, ngày tháng, số liệu/tiền tệ, công thức, trùng khóa và logic theo từng mẫu.
- Xuất báo cáo Excel gồm `Tóm tắt`, `Chi tiết`, `Nhật ký` với thời điểm GMT+7.
- Thêm các khu vực Hướng dẫn, Phiên bản, Tác giả và Mời cà phê theo NSN App Standard.
