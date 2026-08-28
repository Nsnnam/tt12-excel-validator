# Kiểm thử tìm kiếm TT12

Ngày kiểm thử: 2026-08-28, Asia/Ho_Chi_Minh.

## Kết quả

- Tìm toàn cục với `MA_KHOA` trả về kết quả từ Mẫu 01/DM, Mẫu 02/DM và các bảng QĐ 3176.
- Chuyển phạm vi sang Mẫu 01/DM thu hẹp còn đúng các kết quả thuộc `template:MAU_01`.
- Chọn kết quả Mẫu 01/DM đưa người dùng trở lại đúng mẫu và điền từ khóa vào ô tìm cục bộ.
- Mở QĐ 3176 hiển thị đủ 15 nút bảng và ô tìm riêng của bảng đang chọn.
- Tìm `MA_LK` trong Bảng 1 lọc còn `1/67` dòng khớp.
- Bộ phạm vi tìm kiếm gồm toàn bộ dữ liệu, 8 mẫu TT12, 4 danh mục mã và 15 bảng QĐ 3176.
- Tìm kiếm không dấu được hỗ trợ; kết quả giữ nguồn, loại dữ liệu và đích đến để điều hướng.

## Quyết định giao diện

Tìm kiếm toàn cục đặt trong dải hồ sơ dưới phần metadata, dùng mực cobalt cho điểm tương tác và nền giấy ngà cho kết quả. Tìm cục bộ của Mẫu TT12, danh mục mã và QĐ 3176 tiếp tục dùng cùng `search-box` để không tách hệ ngôn ngữ thị giác.
