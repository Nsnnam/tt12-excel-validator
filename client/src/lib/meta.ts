/**
 * NSN App Standard: một nguồn sự thật cho nhận diện, phiên bản, lịch sử và thông tin hỗ trợ.
 */
export const APP_META = {
  name: "TT12 Excel Validator",
  version: "1.8.0",
  date: "2026-09-03",
  author: "Nguyễn Sơn Nam (Nsnnam)",
  authorShort: "NSN",
  role: "Tác giả · Tiện ích HIS / Excel / dữ liệu y tế",
  github: "https://github.com/Nsnnam/tt12-excel-validator",
  timezone: "Asia/Ho_Chi_Minh",
  changelog: [
    { version: "1.8.0", date: "2026-09-03", changes: ["Tích hợp 2 bảng phụ lục Quyết định 3276/QĐ-BYT (sửa đổi bổ sung QĐ 2010): Phụ lục 1 (Mã đối tượng KCB BHYT) và Phụ lục 2 (Mã nhiên liệu) vào NGUỒN THAM CHIẾU.", "Lưu trữ file PDF gốc BYT-3276.QĐ Sửa đổi bổ sung QĐ2010.pdf trực tiếp trên kho GitHub và bổ sung vào THƯ VIỆN FILE MẪU & TÀI LIỆU hỗ trợ tải về đối chiếu."] },
    { version: "1.7.2", date: "2026-09-01", changes: ["Tối ưu gọn gàng khu vực Header (Phần 1): tích hợp tiêu đề, trạng thái, nút thao tác và thanh tìm kiếm xuyên hồ sơ thành thanh điều khiển tinh gọn.", "Tối đa hóa không gian hiển thị cho bảng dữ liệu tra cứu và kiểm định Excel (Phần 2) tăng gấp 3 lần số dòng hiển thị trực tiếp."] },
    { version: "1.7.1", date: "2026-09-01", changes: ["Bổ sung file Excel QĐ 1227/QĐ-BYT (Định mức KT-KT kỹ thuật y tế) vào thư viện tài liệu và lưu trữ trực tiếp trên GitHub."] },
    { version: "1.7.0", date: "2026-08-28", changes: ["Thu gọn dải tiêu đề và khu TRA CỨU XUYÊN HỒ SƠ để ưu tiên vùng dữ liệu.", "Bổ sung thao tác Xóa hồ sơ để kết thúc phiên Excel đã nạp mà không xóa file gốc trên máy."] },
    { version: "1.6.0", date: "2026-08-28", changes: ["Bổ sung tìm kiếm toàn cục trên schema TT12, danh mục mã, 15 bảng QĐ 3176 và thư viện tài liệu.", "Cho phép thu hẹp theo từng mẫu TT12 hoặc từng bảng, đồng thời lọc trực tiếp trong bảng đang chọn."] },
    { version: "1.5.1", date: "2026-08-26", changes: ["Sửa ID trùng trong thư viện tài liệu để loại bỏ cảnh báo React về key không duy nhất."] },
    { version: "1.5.0", date: "2026-08-26", changes: ["Ưu tiên kích thước, định dạng, diễn giải, ghi chú, Bắt buộc và Trùng từ file validate chi tiết của sáu mẫu DM.", "Bổ sung mô tả CHITIET_HS01BH (trang 60–63 tài liệu kỹ thuật) cho Mẫu 01/BH và cảnh báo thời điểm vào nội trú sớm hơn thời điểm đến KCB."] },
    { version: "1.4.0", date: "2026-08-26", changes: ["Thay sáu file mẫu TT12 bằng file người dùng cung cấp và bổ sung Mẫu 01/BH, Mẫu 02/BH.", "Nhận diện/kiểm định dùng schema cột trích xuất từ tám file mẫu mới, gồm định dạng datetime của Mẫu 01/BH."] },
    { version: "1.3.0", date: "2026-08-25", changes: ["Bổ sung cột Bắt buộc/Trùng với điều kiện nguồn, lọc preview theo cột và quy tắc cục bộ theo cơ sở KCB.", "Thêm xuất Excel tô màu lỗi kèm danh sách phát hiện để xử lý offline."] },
    { version: "1.2.0", date: "2026-08-25", changes: ["Chuẩn hóa metadata và thông tin phát hành NSN.", "Bổ sung bản HTML offline và EXE portable Windows."] },
    { version: "1.1.0", date: "2026-08-25", changes: ["Tích hợp dữ liệu TT12 nguồn, preview Excel và đối chiếu mã dùng chung."] },
    { version: "1.0.0", date: "2026-08-25", changes: ["Khởi tạo tra cứu và kiểm định Excel tại trình duyệt."] },
  ],
  coffee: {
    accountName: "NGUYEN SON NAM",
    accountNumber: "8855989777",
    bank: "BIDV — PGD Nguyễn Tất Thành",
  },
} as const;

const MANUS_ASSET_ORIGIN = "https://tt12excel-g5pahdhg.manus.space";

export const BRAND_ASSETS = {
  logo: import.meta.env.VITE_NSN_OFFLINE === "1" ? "" : `${MANUS_ASSET_ORIGIN}/manus-storage/tt12-validator-logo_43635a60.png`,
  texture: import.meta.env.VITE_NSN_OFFLINE === "1" ? "" : `${MANUS_ASSET_ORIGIN}/manus-storage/tt12-ledger-texture_03495bba.png`,
} as const;
