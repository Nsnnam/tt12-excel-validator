/**
 * NSN App Standard: một nguồn sự thật cho nhận diện, phiên bản, lịch sử và thông tin hỗ trợ.
 */
export const APP_META = {
  name: "TT12 Excel Validator",
  version: "1.5.0",
  date: "2026-08-26",
  author: "Nguyễn Sơn Nam (Nsnnam)",
  authorShort: "NSN",
  role: "Tác giả · Tiện ích HIS / Excel / dữ liệu y tế",
  github: "https://github.com/Nsnnam/tt12-excel-validator",
  timezone: "Asia/Ho_Chi_Minh",
  changelog: [
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

export const BRAND_ASSETS = {
  logo: import.meta.env.VITE_NSN_OFFLINE === "1" ? "" : "/manus-storage/tt12-validator-logo_43635a60.png",
  texture: import.meta.env.VITE_NSN_OFFLINE === "1" ? "" : "/manus-storage/tt12-ledger-texture_03495bba.png",
} as const;
