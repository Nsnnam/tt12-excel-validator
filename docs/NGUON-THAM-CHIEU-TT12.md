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

## Cập nhật Quyết định 3276/QĐ-BYT — 2026-09-03

Theo Quyết định số 3276/QĐ-BYT của Bộ Y tế (ban hành kèm file `BYT-3276.QĐ Sửa đổi bổ sung QĐ2010.pdf`):
- **Phụ lục 1**: Ban hành Danh mục mã đối tượng đến khám bệnh, chữa bệnh gồm 27 mã đối tượng (từ mã `1.1` đến mã `10`), kèm căn cứ quy định theo Luật BHYT và các Nghị định, Thông tư liên quan, mức hưởng chi phí KCB BHYT tương ứng. Bãi bỏ Phụ lục 5 Quyết định số 2010/QĐ-BYT ngày 19/6/2025.
- **Phụ lục 2**: Ban hành Danh mục mã nhiên liệu (xăng, dầu, điện) phục vụ gửi dữ liệu điện tử thanh toán chi phí vận chuyển người bệnh theo Điều 14 Nghị định 188/2025/NĐ-CP (gồm 8 dòng mã theo Vùng 1 và Vùng 2). Bãi bỏ Phụ lục 5 Quyết định số 824/QĐ-BYT ngày 15/02/2023.
- Cả 2 phụ lục đã được trích xuất thành tệp dữ liệu có cấu trúc `qd3276-phu-luc.json`, tích hợp vào **NGUỒN THAM CHIẾU**, kết nối với hệ thống tìm kiếm xuyên hồ sơ (Global Search) và lưu trữ file PDF gốc trực tiếp trên kho GitHub repository để người dùng tải về đối chiếu.

## Cập nhật Quyết định 2917/QĐ-BYT — 2026-09-15

Theo Quyết định số 2917/QĐ-BYT ngày 15/09/2026 của Bộ trưởng Bộ Y tế (do Thứ trưởng thường trực Vũ Mạnh Hà ký):
- **Sửa đổi, bổ sung trường hợp áp dụng Mã đối tượng đến KCB 3.1** tại Phụ lục 1 ban hành kèm theo Quyết định số 3276/QĐ-BYT:
  - **Trường hợp 1**: Tự đến khám bệnh, chữa bệnh tại cơ sở khám bệnh, chữa bệnh cấp chuyên sâu mà trước ngày 01/01/2025 đã được cơ quan có thẩm quyền xác định là tuyến trung ương (trừ đối tượng quy định tại mã 1.17).
  - **Trường hợp 2 (Bổ sung mới)**: Tự đến khám bệnh, chữa bệnh tại cơ sở khám bệnh, chữa bệnh cấp chuyên sâu **được thành lập mới sau ngày 01/01/2025** (trừ đối tượng quy định tại mã 1.17).
- Mức hưởng giữ nguyên: 40% chi phí KCB nội trú theo phạm vi quyền lợi, mức hưởng; 0% chi phí KCB ngoại trú.
- Căn cứ quy định: Điểm g khoản 4 Điều 22 Luật BHYT.
- BHXH Việt Nam và các cơ sở KCB trên toàn quốc cập nhật điều chỉnh mã 3.1 trên Cổng giám định BHYT và phần mềm HIS. Các hồ sơ đã gửi trước ngày ban hành không phải gửi lại.
- Dữ liệu `qd3276-phu-luc.json`, `COMMON_CATALOGS.maDoiTuong` và file PDF ký số `BYT-2917.QD-Sua-doi-bo-sung-QD3276.signed.pdf` đã được đồng bộ đầy đủ trên hệ thống và GitHub repository.

## Cập nhật Cẩm nang 108 câu Hỏi - Đáp nghiệp vụ BHYT 2026 — 2026-11-13

Rà soát toàn diện nguồn công khai `https://tracuu-danhmuc-tt12.web.app/` ngày 13/11/2026 (GMT+7). Trang nguồn đã bổ sung tài liệu mới trong thư viện: **Hỏi đáp nghiệp vụ BHYT 2026** kèm file PDF gốc `hoi-dap-giam-dinh-bhyt-2026.pdf`.

- **Cơ quan ban hành:** Bảo hiểm xã hội Việt Nam — Ban hành Tháng 10/2026 (Tài liệu lưu hành nội bộ, 86 trang).
- **Căn cứ pháp lý chủ đạo:** Luật Bảo hiểm y tế, Nghị định số 188/2025/NĐ-CP của Chính phủ, Thông tư số 12/2026/TT-BTC của Bộ Tài chính và các văn bản chỉ đạo nghiệp vụ liên quan.
- **Phân loại 6 chuyên đề nghiệp vụ:**
  1. **Cổng tiếp nhận dữ liệu:** 20 câu (Câu 1 đến Câu 20, Trang 12–25) về tài khoản, chữ ký số, xác thực dữ liệu KCB điện tử, hiển thị thời điểm gửi/nhận, kiểm tra thẻ BHYT và tiếp nhận hồ sơ.
  2. **Hợp đồng KCB BHYT:** 15 câu (Câu 21 đến Câu 35, Trang 26–37) về điều kiện ký hợp đồng, mẫu hồ sơ, phụ lục hợp đồng, thay đổi bổ sung phạm vi hoạt động chuyên môn và nhân lực.
  3. **Danh mục liên thông:** 23 câu (Câu 36 đến Câu 58, Trang 38–53) về ánh xạ mã thuốc, vật tư y tế, thiết bị y tế, dịch vụ kỹ thuật, nhân lực hành nghề KCB và liên thông dữ liệu.
  4. **Hồ sơ đề nghị thanh toán:** 16 câu (Câu 59 đến Câu 74, Trang 54–65) về biểu mẫu đề nghị thanh toán (Mẫu 01/BH, Mẫu 02/BH), thời hạn nộp dữ liệu và xử lý hồ sơ bị từ chối/phản hồi.
  5. **Giám định chi phí KCB BHYT:** 23 câu (Câu 75 đến Câu 97, Trang 66–77) về quyền lợi người bệnh, mức hưởng, kiểm tra tính hợp lý của chỉ định thuốc, dịch vụ, ngày giường và nghiệp vụ giám định điện tử.
  6. **Thanh toán, quyết toán:** 11 câu (Câu 98 đến Câu 108, Trang 78–82) về tạm ứng kinh phí, lập Biên bản quyết toán theo Mẫu số 06/BH, thời hạn ký duyệt của cơ sở KCB và thời hạn thanh toán của cơ quan BHXH.
- **Tích hợp vào hệ thống:**
  - File JSON dữ liệu chuẩn hóa `hoi-dap-bhyt-2026.json` (231 KB) lưu trữ đầy đủ 108 câu hỏi - đáp, phân đoạn văn bản và số trang đối chiếu.
  - Giao diện tra cứu chuyên sâu với bộ lọc theo từng chuyên đề, tìm kiếm tức thì theo số câu & từ khóa, nút mở rộng/thu gọn và nút mở xem trang tài liệu đối chiếu trực tiếp trên file PDF gốc.
  - Mở rộng công cụ tìm kiếm toàn cục (Global Search) hỗ trợ truy vấn trực tiếp nội dung 108 câu hỏi - đáp.
  - Lưu trữ file PDF gốc `hoi-dap-giam-dinh-bhyt-2026.pdf` (1.48 MB) trên kho GitHub và bổ sung vào Thư viện tài liệu tham chiếu để tải về sử dụng ngoại tuyến.

## Cập nhật Quyết định 3556/QĐ-BYT — 2026-11-18

Theo Quyết định số 3556/QĐ-BYT ngày 16/11/2026 của Bộ trưởng Bộ Y tế (do Thứ trưởng Đào Xuân Cơ ký ban hành):

- **Văn bản pháp lý:** Sửa đổi, bổ sung Quyết định số 3176/QĐ-BYT ngày 18/10/2023 ban hành Chuẩn dữ liệu đầu ra phục vụ quản lý, giám định, thanh toán chi phí khám bệnh, chữa bệnh và giải quyết các chế độ liên quan. Hiệu lực thi hành kể từ ngày ký (16/11/2026).
- **Quy định cốt lõi tại Điều 2 (Nghiệp vụ liên thông ngoại trú - nội trú):**
  - Đối với ca bệnh khám ngoại trú có chỉ định dịch vụ cận lâm sàng, sau đó người bệnh được chuyển vào điều trị nội trú:
    1. Cơ sở KCB xác định giá trị mức hưởng (`MUC_HUONG`) tương ứng cho từng dịch vụ KCB ngoại trú, nội trú tại Bảng 2 (Thuốc) và Bảng 3 (Dịch vụ kỹ thuật & Vật tư y tế).
    2. Cơ sở KCB được sử dụng lại kết quả cận lâm sàng ngoại trú trong quá trình điều trị nội trú, không phải chỉ định lại xét nghiệm trùng lặp.
- **Quy mô thay đổi dữ liệu:**
  - Tổng số 16 bảng chuẩn dữ liệu đầu ra: phát hiện chính xác **93 chỉ tiêu được sửa đổi, bổ sung** trên 15 bảng (Bảng 15 Quản lý bệnh Lao giữ nguyên 21 chỉ tiêu).
  - Phân bố cụ thể: Check-in (6), Bảng 1 (20), Bảng 2 (8), Bảng 3 (10), Bảng 4 (2), Bảng 5 (1), Bảng 6 (1), Bảng 7 (7), Bảng 8 (4), Bảng 9 (8), Bảng 10 (5), Bảng 11 (8), Bảng 12 (5), Bảng 13 (4), Bảng 14 (4), Bảng 15 (0).
- **6 nhóm thay đổi trọng yếu:**
  1. **Mã đơn vị hành chính 3 cấp mới:** Cập nhật toàn bộ mã tỉnh, huyện, xã theo Quyết định số 19/2025/QĐ-TTg ngày 30/6/2025 của Thủ tướng Chính phủ (thay thế danh mục cũ của Tổng cục Thống kê).
  2. **Nới lỏng kích thước chuỗi sang `n` (không giới hạn):** `MA_THE_BHYT`, `GT_THE_TU`, `GT_THE_DEN`, `MA_BHXH` để tương thích thẻ BHYT số, VssID và VNeID.
  3. **Hỗ trợ đa mã ngăn cách bằng dấu `;`:** `MA_LOAI_KCB` (10 ký tự, theo QĐ 1804/QĐ-BYT), `MA_DOITUONG_KCB` (50 ký tự, theo QĐ 3276/QĐ-BYT & QĐ 2917/QĐ-BYT), `NGAY_HEN_KL` (200 ký tự).
  4. **Đồng bộ biểu mẫu chứng từ y tế:** Đồng bộ theo Thông tư số 01/2025/TT-BYT (Phiếu chuyển cơ sở KCB - Phụ lục VI, Giấy hẹn khám lại - Phụ lục V).
  5. **Quy định linh hoạt giá trị `null`:** Cho phép để trống `MA_BAC_SI` (Bảng 13) và `MA_TTDV` (Bảng 14).
  6. **Định danh vật tư y tế trúng thầu:** Trường `TEN_VAT_TU` quy định rõ ghi đúng theo tên thương mại trong quyết định trúng thầu.
- **Tích hợp vào hệ thống & sản phẩm đối chiếu:**
  - File JSON dữ liệu cấu trúc `qd3556-chuan-dau-ra.json` (391 KB, 16 bảng) tích hợp vào hệ thống tra cứu và tìm kiếm toàn cục.
  - File Excel so sánh chi tiết 93 thay đổi: `So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx`.
  - Bộ Slide thuyết trình PowerPoint 10 slide: `Bao_cao_Phan_tich_Thay_doi_QD_3556_BYT.pptx`.
  - Bản Infographic tương tác trực quan: `Infographic_QD3556_ThayDoi.html`.
  - Lưu trữ file PDF ký số gốc `BYT-3556.QD-Sua-doi-bo-sung-QD3176.signed.pdf` và file Excel gốc `261116_Chuan_du_lieu_dau_ra_sua_3176_Final.xlsx` trên GitHub repository.




