# Hướng dẫn kiểm định Excel TT12

## Nguyên tắc nhận diện mẫu

Ứng dụng so sánh hàng tiêu đề của các sheet với chữ ký cột của Mẫu 01–06/DM. Sheet có tỷ lệ trùng khớp cao nhất được chọn để kiểm định. Nếu độ khớp dưới 60%, ứng dụng dừng ở trạng thái **chưa nhận diện** và chỉ ra yêu cầu kiểm tra lại hàng tiêu đề.

Tên cột được chuẩn hóa ở mức kỹ thuật: khoảng trắng không ngắt được thay bằng khoảng trắng, khoảng trắng đầu/cuối được bỏ và chữ hoa/thường được đồng nhất. Việc này chỉ phục vụ nhận diện; báo cáo vẫn cảnh báo tên cột sai hoặc không thuộc mẫu chuẩn.

## Phân loại kết quả

| Mức độ | Ý nghĩa | Hành động đề nghị |
|---|---|---|
| **Lỗi** | Không phù hợp cấu trúc/định dạng hoặc vi phạm điều kiện logic chính. | Sửa trước khi gửi danh mục. |
| **Cảnh báo** | Rủi ro về nội dung, định dạng Excel hoặc quan hệ dữ liệu cần đối chiếu. | Rà soát với hồ sơ và danh mục đang hiệu lực. |
| **Thông tin** | Hoàn cảnh kiểm định hoặc nội dung không đủ dữ liệu để đánh giá. | Bổ sung dữ liệu nếu cần. |

## Quy tắc kiểm tra nổi bật

Các trường ngày được yêu cầu theo `YYYYMMDD`, không sử dụng dấu gạch ngang và phải là ngày tồn tại. Các trường có tiền tố `MA_` được cảnh báo khi Excel đã đọc ở dạng số vì số 0 đầu mã có thể bị mất. Các trường đơn giá, giá thanh toán, thành tiền không nhận giá trị âm, ký hiệu tiền tệ hay chuỗi có dấu phân tách.

Với Mẫu 01/DM, tổng `GIUONG_HSTC + GIUONG_HSCC` không được vượt `GIUONG_TK`. Với Mẫu 02/DM, thời gian ngày/tuần được cảnh báo khi vượt 24/168 giờ. Với Mẫu 03/DM, `DON_GIA_BH` lớn hơn `DON_GIA` được đánh dấu; Mẫu 04/DM cảnh báo `TYLE_TT_BH > 100`; Mẫu 05/DM cảnh báo `GIA_THANH_TOAN > DON_GIA`; Mẫu 06/DM chặn trường hợp `NAM_SD < NAM_SX`.

Mọi mẫu có khoảng thời gian đều kiểm tra `TU_NGAY` không muộn hơn `DEN_NGAY` (và tương tự với khoảng hiệu lực hợp đồng). Bộ khóa nghiệp vụ được dùng để phát hiện bản ghi lặp: mã chính của mẫu, `MA_CSKCB` và `TU_NGAY`.

## Giới hạn phiên bản 1.0.0

Ứng dụng hiện chưa kết nối danh mục mã dùng chung, danh mục thuốc/vật tư hoặc các tài liệu pháp quy để xác thực từng mã theo thời điểm. Vì vậy, thông báo về mã là kiểm tra hình thức; người vận hành vẫn cần đối chiếu với danh mục chính thức và quy định hiện hành.

Ứng dụng không tự chỉnh sửa file. Báo cáo xuất ra là bản kiểm định độc lập, giữ file nguồn không đổi. Người dùng chịu trách nhiệm bảo mật file Excel và không đưa dữ liệu bệnh án thực vào kho mã nguồn hoặc kênh hỗ trợ công khai.
