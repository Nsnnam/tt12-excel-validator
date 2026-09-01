# TT12 Excel Validator

**TT12 Excel Validator** là ứng dụng web tra cứu, nhận diện tự động và kiểm định dữ liệu cho **8 mẫu Excel BHYT** (gồm 6 mẫu danh mục 01–06/DM theo Thông tư 12/2026/TT-BYT, Mẫu 01/BH tổng hợp đề nghị thanh toán và Mẫu 02/BH báo cáo quyết toán).

Ứng dụng chạy hoàn toàn trên trình duyệt (**100% Client-side**), bảo mật tuyệt đối dữ liệu y tế, hỗ trợ chạy trực tiếp trên web qua GitHub Pages hoặc tải về file HTML tự chứa để sử dụng offline không cần kết nối Internet và không cần cài đặt môi trường.

| Thông tin | Chi tiết |
|---|---|
| **Phiên bản** | `1.7.2` |
| **Ngày cập nhật** | 2026-09-01 |
| **Tác giả** | [Nguyễn Sơn Nam (Nsnnam)](https://github.com/Nsnnam) |
| **Múi giờ** | GMT+7 (`Asia/Ho_Chi_Minh`) |
| **Web trực tiếp** | [https://nsnnam.github.io/tt12-excel-validator/](https://nsnnam.github.io/tt12-excel-validator/) |
| **Bản HTML Single-page** | [`releases/single-page/tt12-excel-validator.html`](./releases/single-page/tt12-excel-validator.html) |
| **Tài liệu tham chiếu QĐ 1227** | [`docs/QD_1227.xlsx`](./docs/QD_1227.xlsx) |
| **Nguồn tham chiếu** | [Tra cứu danh mục TT12](https://tracuu-danhmuc-tt12.web.app/) |

---

## 🌐 Sử dụng trực tiếp trên Web & Tải về Offline

Người dùng có thể sử dụng ứng dụng ngay lập tức bằng một trong các phương thức sau mà không cần cài đặt:

1. **Sử dụng trực tiếp trên Web (GitHub Pages):**
   - Truy cập: **[https://nsnnam.github.io/tt12-excel-validator/](https://nsnnam.github.io/tt12-excel-validator/)**
   - Tự động đồng bộ và triển khai bản mới nhất từ nhánh `main` qua GitHub Actions.
   
2. **Sử dụng file Single HTML Offline (Không cần mạng, không cần cài đặt):**
   - Tải file HTML tự chứa tại: [`releases/single-page/tt12-excel-validator.html`](./releases/single-page/tt12-excel-validator.html) (hoặc [`releases/TT12-Excel-Validator-v1.7.0-offline.html`](./releases/TT12-Excel-Validator-v1.7.0-offline.html)).
   - Nhấp đúp chuột để mở trực tiếp trong bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Cốc Cốc,...).
   - Chạy offline hoàn toàn, độc lập không phụ thuộc máy chủ hay internet.

3. **Bản EXE Portable (Windows 64-bit):**
   - Tạo bằng lệnh `pnpm build:exe` (đóng gói kèm runtime Node 22, tự khởi động server cục bộ tại `http://localhost:3000`).

---

## ✨ Tính năng nổi bật

- **Tổ chức tra cứu chuẩn hóa 8 mẫu:** Gồm 6 mẫu danh mục (Mẫu 01/DM đến 06/DM) và 2 mẫu thanh toán (Mẫu 01/BH, Mẫu 02/BH).
- **Nhận diện chữ ký tiêu đề thông minh:** Tự động quét các sheet trong file Excel (`.xlsx`, `.xls`, `.xlsm`), tìm dòng tiêu đề và nhận diện mẫu có độ khớp cao nhất, không phụ thuộc vào tên tệp.
- **Bộ tìm kiếm xuyên hồ sơ (Global Search):** Tìm kiếm tức thì theo mã trường, tên danh mục, diễn giải chỉ tiêu trên toàn bộ 8 mẫu TT12, 4 danh mục mã dùng chung, 15 bảng QĐ 3176 và 13 phụ lục QĐ 5937/QĐ-BYT.
- **Kiểm định đa tầng & phân loại mức độ:** Phân nhóm phát hiện thành **Lỗi (Error)**, **Cảnh báo (Warning)** và **Thông tin (Info)**.
- **Đối chiếu danh mục mã dùng chung:** Hỗ trợ nạp file mã khoa / mã khám bệnh để đối chiếu tên và mã trực tiếp trong phiên làm việc.
- **Quy tắc cơ sở KCB tùy biến:** Thiết lập quy tắc kiểm tra cục bộ theo từng mã CSKCB (bắt buộc cột, giới hạn ký tự, cấm công thức).
- **Xuất báo cáo đa chiều:** Tạo file Excel báo cáo gồm 3 sheet: `Tóm tắt`, `Chi tiết` và `Nhật ký`, ghi nhận thời gian theo múi giờ GMT+7.
- **Xem trước & Xóa hồ sơ an toàn:** Xem trước bảng dữ liệu với tô màu trực quan ô lỗi/cảnh báo; nút **Xóa hồ sơ** giúp đặt lại phiên làm việc mà không chạm đến file gốc trên ổ cứng.

---

## 🔍 Phạm vi và quy tắc kiểm định

| Nhóm kiểm tra | Quy tắc và phạm vi rà soát |
|---|---|
| **Văn bản & Ký tự** | Phát hiện khoảng trắng đầu/cuối, nhiều khoảng trắng liên tiếp, ký tự xuống dòng `\n`, ký tự ẩn không in được, khoảng trắng không ngắt (`\u00A0`). |
| **Cấu trúc & Cột** | Thiếu cột bắt buộc, trùng tên cột, cột ngoài danh mục chuẩn, sai vị trí hoặc sai lệch hàng tiêu đề. |
| **Định dạng & Kiểu** | Kiểm tra định dạng ngày `YYYYMMDD`, ngày giờ `YYYYMMDDHHMM[SS]`, mã định danh bị ép kiểu số làm mất số `0` ở đầu, độ dài mã cơ sở KCB (`MA_CSKCB`), giá trị số hoặc tiền tệ âm, chứa ký tự chữ. |
| **Công thức Excel** | Phát hiện các ô chứa công thức Excel (`=SUM(...)`, `=CONCAT(...)`,...) cần chuyển đổi thành giá trị tĩnh trước khi gửi cổng dữ liệu. |
| **Khóa trùng nghiệp vụ** | Kiểm tra trùng lặp bản ghi dựa trên bộ chỉ tiêu khóa nghiệp vụ (cờ **Trùng**) của từng mẫu. |
| **Logic nghiệp vụ mẫu** | - **Mẫu 01/DM:** Giường HSTC / HSCC không vượt quá tổng giường kế hoạch / thực kê; kiểm tra `TU_NGAY <= DEN_NGAY`.<br>- **Mẫu 02/DM:** Thời gian làm việc ngày <= 24h, tuần <= 168h; thời gian tuần không nhỏ hơn ngày.<br>- **Mẫu 03/DM:** Đơn giá BHYT không lớn hơn đơn giá khai báo; số lượng thuốc/máu > 0 khi còn hiệu lực.<br>- **Mẫu 04/DM:** Tỷ lệ thanh toán BHYT (0 - 100%); đơn giá BHYT vật tư không lớn hơn đơn giá khai báo.<br>- **Mẫu 05/DM:** Giá thanh toán DVKT không vượt đơn giá; số lượng chuyển giao kỹ thuật hợp lệ.<br>- **Mẫu 06/DM:** Năm sử dụng không nhỏ hơn năm sản xuất (`NAM_SD >= NAM_SX`); ngày hiệu lực hợp đồng.<br>- **Mẫu 01/BH:** Kiểm tra `NGAY_VAO <= NGAY_VAO_NOI_TRU <= NGAY_RA`; logic tổng chi BV = BHTT + BNCCT + BNTT + NGUONKHAC. |

---

## 🚀 Cài đặt và phát triển cục bộ

Yêu cầu môi trường: **Node.js 18+** và trình quản lý gói **pnpm** (hoặc npm).

```bash
# 1. Clone repository
git clone https://github.com/Nsnnam/tt12-excel-validator.git
cd tt12-excel-validator

# 2. Cài đặt thư viện phụ thuộc
pnpm install

# 3. Khởi chạy máy chủ phát triển
pnpm dev
```

### Các lệnh quản trị & đóng gói

| Lệnh | Mô tả |
|---|---|
| `pnpm dev` | Khởi chạy máy chủ phát triển Vite với Hot Module Replacement. |
| `pnpm check` | Kiểm tra kiểu dữ liệu tĩnh TypeScript (`tsc --noEmit`). |
| `pnpm test` | Chạy toàn bộ bộ kiểm thử tự động với Vitest. |
| `pnpm build` | Đóng gói bản web tĩnh và server Express vào thư mục `dist/`. |
| `pnpm build:offline` | Đóng gói ra file HTML độc lập tại `releases/single-page/` và `releases/`. |
| `pnpm build:exe` | Đóng gói thành file EXE portable chạy trên Windows 64-bit. |

---

## 📖 Hướng dẫn sử dụng nhanh

1. **Tra cứu danh mục & Chỉ tiêu:**
   - Sử dụng ô **Tra cứu xuyên hồ sơ** ở đầu trang để tìm kiếm nhanh chỉ tiêu, mã trường hoặc từ khóa diễn giải.
   - Chuyển đổi giữa các tab mẫu để xem cấu trúc chi tiết, độ dài tối đa, định dạng, cờ Bắt buộc / Trùng.
2. **Kiểm định file Excel:**
   - Chuyển sang khu vực **Kiểm định Excel**, kéo thả hoặc chọn tệp `.xlsx` / `.xls` / `.xlsm`.
   - Hệ thống tự động phân tích cấu trúc, xác định mẫu phù hợp và hiển thị bảng lỗi phân loại.
3. **Rà soát & Xem trước:**
   - Xem trước bảng tính trực quan, các ô vi phạm được tô màu nổi bật kèm hướng dẫn sửa chi tiết khi rê chuột.
   - Xử lý các phát hiện theo mức độ: Ưu tiên xử lý toàn bộ **Lỗi**, sau đó xem xét **Cảnh báo**.
4. **Xuất báo cáo kiểm định:**
   - Nhấn **Xuất báo cáo Excel** để tải về file tổng hợp gồm 3 sheet: *Tóm tắt*, *Chi tiết lỗi/cảnh báo*, *Nhật ký kiểm định*.
   - Nhấn nút **Xóa hồ sơ** để kết thúc phiên và dọn sạch dữ liệu hiển thị trên trình duyệt.

---

## 🔒 Bảo mật và an toàn dữ liệu

- Ứng dụng hoạt động theo cơ chế **100% Client-side Processing**: Toàn bộ thao tác đọc, phân tích tệp Excel và đối chiếu dữ liệu diễn ra hoàn toàn trong bộ nhớ RAM trình duyệt của người dùng.
- **Không gửi hoặc lưu trữ:** Ứng dụng không có API máy chủ lưu trữ tệp, không gửi bất kỳ dữ liệu bệnh nhân, hồ sơ KCB hay nội dung file Excel lên Internet.
- **Không ghi đè file gốc:** Ứng dụng chỉ đọc dữ liệu và xuất file báo cáo riêng biệt, bảo toàn nguyên vẹn tệp gốc của đơn vị.

---

## 📁 Cấu trúc dự án

```text
tt12-excel-validator/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml       # Tự động build và deploy GitHub Pages
├── client/
│   ├── public/                    # Tài nguyên tĩnh
│   └── src/
│       ├── components/            # UI components (Radix UI / Tailwind)
│       ├── data/                  # Dữ liệu nguồn QĐ 5937, QĐ 3176, TT12
│       ├── lib/
│       │   ├── tt12.ts            # Schema 8 mẫu, bộ quy tắc kiểm định & xuất XLSX
│       │   ├── tt12.test.ts       # Kiểm thử tự động logic nghiệp vụ
│       │   ├── search.ts          # Bộ máy tìm kiếm xuyên hồ sơ
│       │   ├── meta.ts            # Nguồn thông tin phiên bản & tác giả
│       │   └── reference.ts       # Dữ liệu đối chiếu danh mục dùng chung
│       ├── pages/
│       │   └── HomeExpanded.tsx   # Giao diện chính của ứng dụng
│       └── App.tsx
├── docs/                          # Tài liệu hướng dẫn chi tiết
├── releases/
│   ├── single-page/
│   │   └── tt12-excel-validator.html   # File HTML standalone chạy offline
│   ├── TT12-Excel-Validator-v1.7.0-offline.html
│   └── README.md                  # Hướng dẫn sử dụng các bản phát hành
├── scripts/
│   ├── build-offline.mjs          # Script đóng gói HTML tự chứa
│   └── build-exe.mjs              # Script đóng gói EXE Windows
├── package.json
└── vite.config.ts
```

---

## ☕ Tác giả và ủng hộ

- **Tác giả:** Nguyễn Sơn Nam (Nsnnam) · [GitHub Profile](https://github.com/Nsnnam)
- **Ủng hộ dự án:** Nếu công cụ hữu ích cho công việc của bạn, hãy xem thông tin mời cà phê tại [SUPPORT.md](./SUPPORT.md).

---

## 📄 Giấy phép

Phát hành phục vụ nghiệp vụ y tế và kiểm định dữ liệu nội bộ.
