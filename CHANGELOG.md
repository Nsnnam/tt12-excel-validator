# Lịch sử thay đổi

Mọi thay đổi đáng chú ý của **TT12 Excel Validator** được ghi tại đây theo [Keep a Changelog](https://keepachangelog.com/) và Semantic Versioning.

## [Unreleased]

Chưa có thay đổi ngoài phiên bản phát hành đầu tiên.

## [1.7.2] — 2026-09-01

### Thay đổi & Tối ưu hóa UI

- Tối ưu gọn gàng toàn diện khu vực Header (Phần 1): tích hợp tiêu đề, các chip metadata (mẫu, nguồn file, trạng thái), cụm nút hành động và thanh tìm kiếm xuyên hồ sơ thành thanh điều khiển tinh gọn (giảm chiều cao header từ ~330px xuống ~80px).
- Tối đa hóa diện tích hiển thị cho bảng dữ liệu tra cứu và bàn làm việc kiểm định Excel (Phần 2): mở rộng chiều cao bảng hiển thị trực tiếp lên tới 75% màn hình, xem đồng thời 15–20 dòng dữ liệu không cần cuộn trang.
- Kết quả tìm kiếm xuyên hồ sơ hiển thị dưới dạng dropdown menu nổi thông minh, không đẩy thụt lùi bảng dữ liệu.

## [1.7.1] — 2026-09-01

### Thêm mới

- Bổ sung file Excel **Quyết định 1227/QĐ-BYT** (Định mức KT-KT xét nghiệm & CĐHA) vào mục **THƯ VIỆN FILE MẪU & TÀI LIỆU**, lưu trữ và tải trực tiếp từ GitHub repository.

## [1.7.0] — 2026-08-28

### Thay đổi

- Thu gọn dải tiêu đề và khu **TRA CỨU XUYÊN HỒ SƠ** để giảm chiều cao đầu trang, giữ trọng tâm ở bảng dữ liệu.
- Bổ sung nút **Xóa hồ sơ** sau khi nạp Excel; thao tác chỉ xóa hồ sơ khỏi phiên làm việc và không xóa file gốc trên máy.

## [1.6.0] — 2026-08-28

### Thêm mới

- Bổ sung tìm kiếm toàn cục trên tám mẫu TT12, bốn danh mục mã, 15 bảng QĐ 3176 và thư viện tài liệu.
- Cho phép thu hẹp theo từng mẫu TT12 hoặc từng bảng riêng biệt; các kết quả có thể mở đúng khu vực dữ liệu tương ứng.
- Bổ sung lọc trực tiếp trong bảng QĐ 3176 đang chọn và kiểm thử hồi quy cho các phạm vi tìm kiếm.

## [1.5.1] — 2026-08-26

### Sửa lỗi

- Thay hai ID trùng `13` trong thư viện tài liệu bằng định danh nghiệp vụ duy nhất, loại bỏ cảnh báo React về khóa con trùng lặp khi mở trang tra cứu.
- Bổ sung kiểm thử hồi quy xác nhận tất cả ID thư viện tài liệu là duy nhất.

## [1.5.0] — 2026-08-26

### Thay đổi

- Đặt `20260306_6bang_tt12_chitiet_valid_.xlsx` làm nguồn ưu tiên cho định dạng, kích thước tối đa, diễn giải, ghi chú bổ sung và cờ **Bắt buộc/Trùng** của sáu mẫu 01–06/DM.
- Bảo toàn nguyên văn các điều kiện nguồn như “Không bắt buộc đối với …” trong bảng tra cứu.
- Bổ sung kích thước và diễn giải của `CHITIET_HS01BH` (trang 60–63 tài liệu kỹ thuật TT12) cho 20 chỉ tiêu Mẫu 01/BH.
- Thêm cảnh báo khi `NGAY_VAO_NOI_TRU` sớm hơn `NGAY_VAO`; kiểm tra sẵn có tiếp tục bảo đảm `NGAY_RA` không sớm hơn hai thời điểm này.

## [1.4.0] — 2026-08-26

### Thay đổi

- Thay sáu file Mẫu 01–06/DM cũ bằng sáu file người dùng cung cấp.
- Bổ sung Mẫu 01/BH — Tổng hợp đề nghị thanh toán KCB BHYT và Mẫu 02/BH — Báo cáo quyết toán KCB BHYT.
- Nhận diện và kiểm định chuyển sang dùng schema cột trích xuất từ sheet Hướng dẫn của tám file mới.
- Hỗ trợ ngày `YYYYMMDDHHMM[SS]` của Mẫu 01/BH và cập nhật liên kết tải toàn bộ tám file mẫu.

## [1.3.0] — 2026-08-25

### Thêm mới

- Hiển thị cột **Bắt buộc** và **Trùng** theo dữ liệu gốc của sáu mẫu TT12, kể cả các điều kiện “bắt buộc đối với…”.
- Bổ sung lọc preview Excel theo mức độ, nhóm lỗi và từng cột dữ liệu.
- Bổ sung màn hình quản lý quy tắc cục bộ theo mã cơ sở KCB; hỗ trợ bắt buộc dữ liệu, giới hạn ký tự và cấm công thức.
- Xuất Excel tô màu ô lỗi/cảnh báo, thêm comment gợi ý tại ô và sheet `Danh_sach_loi`.

### Thay đổi

- Kiểm tra trùng dùng các chỉ tiêu có cờ **Trùng** trong dữ liệu tham chiếu để tạo khóa nghiệp vụ.

## [1.2.0] — 2026-08-25

### Thêm mới

- Thêm metadata trung tâm, dải thông tin phát hành với version, lịch sử, tác giả, GitHub và thông tin mời cà phê.
- Thêm script tạo HTML tự chứa để sử dụng offline và script đóng gói EXE portable cho Windows 64-bit.

### Thay đổi

- Đồng bộ version phát hành `1.2.0` giữa package, metadata, giao diện, README và changelog.

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
