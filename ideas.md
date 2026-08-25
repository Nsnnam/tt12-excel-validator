# Định hướng thiết kế — TT12 Excel Validator

## Ba hướng tiếp cận

| Theme Name | Very Brief Intro | Probability |
|---|---|---:|
| Hồ sơ điều hành | Giao diện kiểu hồ sơ kiểm định chuyên nghiệp, dùng bề mặt giấy ngà, đường kẻ hồ sơ và nhấn xanh y tế. Tạo cảm giác chuẩn xác, có nguồn gốc và dễ rà soát. | 0.07 |
| Phòng thí nghiệm dữ liệu | Không gian sáng, giàu cấu trúc, sử dụng các mô-đun trạng thái như thiết bị phân tích mẫu. Phù hợp cho hành vi import–kiểm tra–xử lý báo cáo. | 0.04 |
| Bản đồ chuẩn hóa | Ngôn ngữ biên tập hiện đại với các dải thông tin, ký hiệu mã hóa và thứ bậc rõ để dẫn người dùng qua tiêu chuẩn TT12. Nhấn vào tra cứu và mối quan hệ giữa các trường dữ liệu. | 0.08 |

## Hướng được chọn: Hồ sơ điều hành

### Design Movement

Lấy cảm hứng từ **editorial information design** và các mẫu **hồ sơ kiểm định hành chính**: dữ liệu là chủ thể, thiết kế đóng vai trò tổ chức, định hướng và làm lộ rõ mức độ rủi ro thay vì trang trí.

### Core Principles

1. Mọi trạng thái nghiệp vụ đều nhìn thấy ngay: mẫu đang chọn, nguồn file, độ tin cậy nhận diện và mức độ lỗi.
2. Dữ liệu dày đặc nhưng không chật: khoảng trắng có chủ đích, hàng kẻ mảnh và kiểu chữ phân cấp.
3. Cảnh báo là ngôn ngữ thiết kế: đỏ chỉ lỗi chặn, hổ phách chỉ cần xem xét, xanh lục chỉ hợp lệ.
4. Chuyển động tối thiểu và dứt khoát để hỗ trợ thao tác, không cạnh tranh với dữ liệu.

### Color Philosophy

Nền **giấy ngà ấm** làm giảm mỏi mắt khi đọc bảng dài; **xanh mực tàu** truyền tải sự tin cậy của dữ liệu y tế và hành chính; **xanh lam cobalt** là màu nhận diện cho hành động/chọn mục; hổ phách và đỏ gạch giữ vai trò cảnh báo hữu dụng. Hệ màu ưu tiên tương phản ổn định thay vì hiệu ứng gradient.

### Layout Paradigm

Khung làm việc dạng **hồ sơ ba dải**: thanh công cụ dọc cố định bên trái; phần thông tin hồ sơ/mẫu nằm ngang ở đầu; vùng công việc chính thay đổi giữa tra cứu, import và báo cáo. Trên màn hình nhỏ, thanh dọc thu gọn thành các nút biểu tượng có nhãn.

### Signature Elements

1. Dải “mã hồ sơ” ở đầu mỗi màn hình với số thứ tự, nguồn và trạng thái.
2. Dấu hiệu cấp độ lỗi dạng chấm màu + nhãn chữ, luôn đi kèm nhau để không phụ thuộc màu sắc.
3. Họa tiết lưới giấy rất nhẹ ở nền và đường viền dạng nét mực để phân khu dữ liệu.

### Interaction Philosophy

Tương tác phải mang tính “kiểm định”: import file mở một khay rõ ràng; chọn lỗi sẽ dẫn chính xác tới dòng/cột; các thao tác xuất/reset yêu cầu xác nhận vừa đủ. Mọi cập nhật trạng thái cần phản hồi ngay bằng thông báo ngắn, có thể truy vết.

### Animation

Chỉ dùng chuyển động transform/opacity dưới 240ms với nhịp `cubic-bezier(0.23, 1, 0.32, 1)`. Khay import và ngăn chi tiết xuất hiện từ cạnh tương ứng; các con số tóm tắt chuyển opacity nhẹ, không đếm số gây xao nhãng. Tôn trọng `prefers-reduced-motion` và tắt chuyển động không thiết yếu.

### Typography System

**Manrope** dùng cho giao diện và bảng số liệu nhờ nhịp chữ rõ ở cỡ nhỏ; **Noto Serif** dùng hạn chế cho tiêu đề lớn/ghi chú nghiệp vụ nhằm gợi chất hồ sơ, không dùng cho bảng. Tiêu đề chính 32–40px, tiêu đề vùng 16–18px đậm, dữ liệu/bảng 13–14px, nhãn kỹ thuật 11–12px in hoa giãn chữ nhẹ.

### Brand Essence

**TT12 Excel Validator là bàn làm việc kiểm định danh mục BHYT dành cho nhân sự cần phát hiện lỗi Excel trước khi gửi dữ liệu.** Tính cách: chuẩn xác, điềm tĩnh, minh bạch.

### Brand Voice

Giọng điệu ngắn, nghiệp vụ, chỉ rõ tác động và hướng xử lý; không khoa trương hoặc chung chung.

> “Mẫu 01/DM được nhận diện với độ tin cậy 96%.”

> “Dòng 18: `TU_NGAY` phải theo dạng YYYYMMDD và không muộn hơn `DEN_NGAY`.”

### Wordmark & Logo

Biểu tượng **tờ biểu mẫu có dấu kiểm trong lăng kính quét**: ba đường ngang gợi ô Excel, một góc gấp gợi hồ sơ, đường chéo cobalt thể hiện phép kiểm. Mark không chứa chữ, phù hợp favicon; wordmark “TT12 Validator” dùng Manrope SemiBold có khoảng cách chữ hẹp.

### Signature Brand Color

**Mực Cobalt — `#1457C8`**: màu hành động, vùng được chọn và dấu kiểm của thương hiệu.

## Style Decisions

- Giao diện sáng, đậm tính công cụ; không dùng gradient tím, neon hay các góc bo đồng nhất.
- Các file Excel được xử lý cục bộ trong trình duyệt ở bản đầu tiên; không hiển thị như đã gửi lên máy chủ.
- Ưu tiên điều khiển có chữ rõ ràng, biểu tượng Lucide là hỗ trợ chứ không thay thế nhãn.
- Mỗi màn hình chính phải có dải hồ sơ gọn, hiển thị mẫu, nguồn, trạng thái nhận diện/kiểm định và mức độ lỗi bằng hệ nhãn quy tắc thống nhất.
- Mực Cobalt `#1457C8` là “mực kiểm định”: dùng cho điều hướng đang chọn, dữ liệu được chọn, hành động chính và motif quét/dấu kiểm; không dùng làm màu trang trí chung chung.
- Microcopy nêu rõ tác động nghiệp vụ và hành động tiếp theo trong một câu ngắn, ví dụ “Mẫu 01/DM đang được tra cứu; chưa có file Excel để kiểm định.”
