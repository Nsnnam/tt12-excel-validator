# Kiểm kê nguồn công khai TT12

Nguồn khảo sát chính là [Tra cứu Hướng Dẫn Ghi Danh Mục BHYT](https://tracuu-danhmuc-tt12.web.app/), truy cập ngày 2026-08-25 theo GMT+7. Trang cung cấp sáu mẫu danh mục TT12, bốn nhóm mã dùng chung, nhóm 15 bảng chỉ tiêu Quyết định 3176, sáu tài liệu tham chiếu và các file Excel mẫu.

## Danh mục công khai đã phát hiện

| Nhóm | Nội dung |
|---|---|
| Mẫu TT12 | Mẫu 01/DM, Mẫu 02/DM, Mẫu 03/DM, Mẫu 04/DM, Mẫu 05/DM, Mẫu 06/DM. |
| Mã dùng chung | Mã loại hình KCB, mã khám bệnh, mã đối tượng KCB, mã khoa. |
| Chuẩn đầu ra | 15 bảng chỉ tiêu theo QĐ 3176. |
| Thư viện | Hướng dẫn ánh xạ thuốc, sơ đồ tóm tắt TT12, tài liệu kỹ thuật TT12, phụ lục 06 bảng danh mục, hướng dẫn ghi PVCM, quyết định mã loại KCB/mã khoa. |
| Tệp mẫu | `MAU_01_Template.xlsx` đến `MAU_06_Template.xlsx` và tệp import người hành nghề. |

## Mẫu 06/DM — dữ liệu validate đã đọc trên trang gốc

| STT | Chỉ tiêu | Định dạng | Kích thước | Diễn giải rút gọn |
|---:|---|---|---:|---|
| 1 | `STT` | Số | 10 | Số thứ tự. |
| 2 | `TEN_TB` | Chuỗi | n | Tên thiết bị y tế. |
| 3 | `KY_HIEU` | Chuỗi | 1024 | Model thiết bị y tế. |
| 4 | `CONGTY_SX` | Chuỗi | 1024 | Tên công ty sản xuất. |
| 5 | `NUOC_SX` | Chuỗi | 100 | Tên nước sản xuất. |
| 6 | `NAM_SX` | Số | 4 | Năm sản xuất. |
| 7 | `NAM_SD` | Số | 4 | Năm bắt đầu đưa vào sử dụng. |
| 8 | `MA_MAY` | Số | n | Mã máy theo hướng dẫn tại QĐ 3176. |
| 9 | `SO_LUU_HANH` | Chuỗi | 20 | Số lưu hành theo Nghị định 07/2023/NĐ-CP. |
| 10 | `HD_TU` | Chuỗi | 8 | Ngày hiệu lực hợp đồng thuê/mượn/mua trả chậm, theo `YYYYMMDD`. |
| 11 | `HD_DEN` | Chuỗi | 8 | Ngày hết hiệu lực hợp đồng, theo `YYYYMMDD`. |
| 12 | `TU_NGAY` | Chuỗi | 8 | Thời điểm bắt đầu áp dụng theo điều kiện thiết bị/hợp đồng. |
| 13 | `DEN_NGAY` | Chuỗi | 8 | Thời điểm ngừng áp dụng hoặc hết điều kiện sử dụng. |
| 14 | `MA_CSKCB` | Chuỗi | 5 | Mã cơ sở khám bệnh, chữa bệnh. |

> Ghi chú nghiệp vụ chung: một thay đổi danh mục sử dụng hai dòng dữ liệu; dòng thông tin cũ ghi `DEN_NGAY`, còn dòng thông tin mới ghi `TU_NGAY` và để trống `DEN_NGAY`.

## Kết quả kiểm thử giao diện mở rộng

Bản ứng dụng đã hiển thị được bảng validate đầy đủ của Mẫu 01/DM với cờ **Bắt buộc**, diễn giải và ghi chú bổ sung từ dữ liệu gốc. Thư viện hiển thị đủ 13 liên kết tài liệu/file mẫu. Màn hình **Kiểm định & preview** có các điểm vào cho import Excel và nạp danh mục mã khoa/mã khám bệnh, kèm trạng thái rõ ràng khi chưa có file.

## Đối chiếu cờ nghiệp vụ — 2026-08-25

Nguồn trích xuất `tt12-reference.json` có ba trường nghiệp vụ theo mỗi chỉ tiêu: `batBuoc`, `trung` và `ghiChuBS`. Trường `batBuoc` không chỉ là ký hiệu `x`; một số chỉ tiêu có điều kiện mô tả. Ví dụ, `BAN_KHAM` ở Mẫu 01/DM được ghi là không bắt buộc đối với Khoa Dược/Dinh dưỡng/Chống nhiễm khuẩn hoặc khoa lâm sàng không có bàn khám chuyên khoa. Trường `trung = x` là cờ nguồn để hiển thị cột **Trùng** và đưa vào kiểm tra khóa nghiệp vụ.

## Chính sách ưu tiên metadata — 2026-08-26

File người dùng cung cấp `20260306_6bang_tt12_chitiet_valid_.xlsx` có sáu sheet `MS01DM` đến `MS06DM` với các cột **Chỉ tiêu**, **Định dạng**, **Kích thước tối đa**, **Diễn giải**, **Bắt buộc**, **Trùng/Key check trùng** và **Ghi chú bổ sung Diễn giải**. Từ phiên bản 1.5.0, đây là nguồn ưu tiên cho sáu schema Mẫu 01–06/DM: giá trị không trống trong file này ghi đè metadata cùng trường đã trích xuất trước đó; chỉ metadata không có trong file nguồn mới giữ lại từ nguồn kỹ thuật cũ. Điều kiện Bắt buộc được lưu nguyên văn để không suy diễn các ngoại lệ nghiệp vụ.

Đối với Mẫu 01/BH, mô tả 20 chỉ tiêu được đối chiếu và cập nhật theo mục `CHITIET_HS01BH` tại trang 60 đến hết trang 63 của file `Tàiliệukỹthuật_TT12-2026-BTC.pdf` người dùng cung cấp. Phạm vi này gồm kích thước ngày/giờ 12 ký tự, các trường số tiền tối đa 15 ký tự, mã cơ sở KCB 5 ký tự và hướng dẫn `SO_NGAY_DTRI`. Các quy tắc kiểm định chỉ áp dụng quan hệ thời gian chắc chắn; công cụ không tự suy ra công thức thanh toán từ diễn giải.
