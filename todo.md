# Công việc mở rộng TT12 Excel Validator

- [x] Lập chỉ mục toàn bộ JavaScript, JSON, tài liệu và file mẫu công khai từ trang tham chiếu.
- [x] Trích xuất đầy đủ định nghĩa chỉ tiêu, định dạng, kích thước, diễn giải và cờ bắt buộc cho Mẫu 01–06/DM.
- [x] Đóng gói dữ liệu tra cứu/validate vào ứng dụng và liên kết lại thư viện tài liệu gốc.
- [x] Hiển thị bảng xem trước Excel trên web với hàng/cột, ô lỗi và chú giải màu theo mức độ.
- [x] Tạo luồng xác nhận, tự sửa các lỗi văn bản/định dạng an toàn và tải file Excel đã chuẩn hóa.
- [x] Cho phép nạp danh mục mã khoa, mã khám bệnh và tự nhận diện cột mã/tên để đối chiếu chính xác.
- [x] Kiểm thử với file mẫu tham chiếu, build, rà soát giao diện và cập nhật tài liệu/changelog.
- [x] Bảo đảm hàng tiêu đề dữ liệu không sinh cảnh báo và không được tô màu như lỗi trong bảng xem trước.

## Phát hành NSN App Standard

- [x] Đọc checklist phát hành, kiểm tra metadata hiện có, artifact và dữ liệu nhạy cảm.
- [x] Bổ sung metadata trung tâm, trang Phiên bản/Lịch sử/Tác giả/Mời cà phê và tài liệu repo hoàn chỉnh.
- [x] Tạo bản HTML offline, smoke test bằng HTTP cục bộ và đóng gói EXE portable Windows.
- [x] Tạo repository GitHub private mới, commit rõ ràng và push bản phát hành.
- [x] Xác minh lại artifact, link GitHub, version, changelog và README.

## Tối ưu khả năng đọc giao diện

- [x] Rà soát contrast và kích thước chữ ở header, sidebar, bảng dữ liệu và trạng thái lỗi.
- [x] Tăng typography, tương phản màu và vùng bấm trên giao diện desktop/mobile.
- [x] Kiểm tra trực quan, build và lưu checkpoint cho phiên bản giao diện dễ đọc hơn.

## Nhãn nghiệp vụ sáu mẫu TT12

- [x] Đồng bộ mô tả nghiệp vụ đầy đủ cho Mẫu 01–06/DM ở sidebar, dải hồ sơ và nội dung tra cứu.
- [x] Kiểm tra hiển thị tên dài trên desktop/mobile, build và lưu checkpoint.

## Nhấn mạnh hành động và chỉ tiêu bắt buộc

- [ ] Tăng độ nổi bật, vùng bấm và focus cho liên kết tải file mẫu.
- [ ] Phóng to, tăng contrast cho nhãn BẮT BUỘC và kiểm tra trực quan/bản build.

## Kiểm định theo schema cột TT12

- [x] So sánh bộ kiểm định hiện có với định dạng, kích thước, diễn giải và cờ bắt buộc từ dữ liệu nguồn.
- [x] Bổ sung kiểm tra số/tiền tệ, chuỗi, ngày, độ dài, khoảng trắng, xuống dòng, ký tự ẩn và công thức theo từng cột.
- [ ] Gắn thông điệp cảnh báo vào đúng dòng/cột, thêm kiểm thử hồi quy và xác minh báo cáo Excel.

## Khắc phục nút tải file mẫu

- [x] Sửa nút Tải file mẫu không hiển thị nhãn và xác minh trên khung nhìn rộng.

## Preview, Excel tô màu và logic liên cột

- [x] Rà soát luồng preview, export và các quy tắc logic hiện có của sáu mẫu TT12.
- [x] Bổ sung bộ lọc theo mức độ/nhóm lỗi trong preview Excel và xuất Excel có màu ô lỗi.
- [x] Mở rộng quy tắc liên cột theo phụ lục từng mẫu, kiểm thử hồi quy và đóng gói bản cập nhật.

## Cờ nghiệp vụ, lọc theo cột và quy tắc cơ sở KCB

- [x] Đối chiếu dữ liệu nguồn về Bắt buộc, Trùng và các điều kiện “bắt buộc đối với…” của sáu mẫu.
- [x] Bổ sung cột Bắt buộc/Trùng có mô tả đầy đủ và áp dụng cờ trùng vào kiểm định khóa nghiệp vụ.
- [x] Thêm lọc preview theo cột có lỗi, kết hợp với bộ lọc mức độ và nhóm lỗi.
- [x] Tạo khu vực quản lý/lưu quy tắc riêng theo mã cơ sở KCB trong trình duyệt.
- [x] Kiểm thử dữ liệu, giao diện và đóng gói bản cập nhật.

## Artifact và GitHub bản cập nhật

- [x] Hoàn thiện cờ nghiệp vụ, lọc cột và quản lý quy tắc cơ sở KCB.
- [x] Kiểm thử, tạo lại single HTML và EXE portable từ mã mới.
- [x] Commit, push repository GitHub private và xác minh artifact phát hành.

## Thay bộ mẫu Excel TT12 và bổ sung mẫu BH

- [x] Trích xuất sheet, hàng tiêu đề, cột, định dạng và công thức từ sáu mẫu TT12 mới cùng Mẫu 01/BH và 02/BH.
- [x] Thay sáu file mẫu tải xuống, bổ sung hai mẫu BH vào thư viện và cập nhật metadata/tên nghiệp vụ.
- [x] Cập nhật chữ ký nhận diện, kiểm định cấu trúc/cột và các kiểm thử theo tám mẫu thực tế.
- [x] Kiểm thử import từng mẫu, cập nhật giao diện/tài liệu, tạo lại single HTML/EXE và push GitHub private.

## Kích thước, diễn giải và ghi chú theo tài liệu TT12-2026-BTC

- [ ] Trích xuất Mục 5, xác định các bảng quy ước tương ứng tám mẫu và đối chiếu với schema hiện có.
- [ ] Cập nhật kích thước, diễn giải, ghi chú và kiểm định độ dài cho từng chỉ tiêu có quy ước.
- [ ] Kiểm thử cảnh báo giới hạn mới, rà soát bảng tra cứu và cập nhật tài liệu phát hành.
- [ ] Tạo artifact cập nhật, commit/push GitHub private và xác minh bản phát hành.

## Validate ưu tiên và CHITIET_HS01BH

- [ ] Trích xuất toàn bộ bảng validate từ file mới, đối chiếu header và đánh giá mức độ phủ so với sáu schema DM.
- [ ] Trích xuất bảng CHITIET_HS01BH trang 60–63 để cập nhật Mẫu 01/BH.
- [ ] Hợp nhất định dạng, kích thước, diễn giải, ghi chú, Bắt buộc và Trùng từ nguồn ưu tiên; kiểm thử hồi quy.
- [ ] Rà soát giao diện, tài liệu, artifact và commit/push GitHub private.

## Bản vá khóa React trùng lặp

- [x] Xác định danh sách render tạo khóa con không duy nhất, sửa theo định danh nghiệp vụ ổn định và kiểm thử console.
