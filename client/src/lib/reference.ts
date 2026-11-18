/**
 * Phong cách Hồ sơ điều hành: dữ liệu gốc TT12 được đóng gói rõ nguồn để dùng nhất quán cho tra cứu và kiểm định.
 */
import raw from "@/data/tt12-reference.json";
import qd3176 from "@/data/qd3176-chuan-dau-ra.json";
import qd3556 from "@/data/qd3556-chuan-dau-ra.json";
import qd5937 from "@/data/qd5937-danh-muc.json";
import qd3276 from "@/data/qd3276-phu-luc.json";
import hoiDapRaw from "@/data/hoi-dap-bhyt-2026.json";

export type ReferenceField = {
  stt: string;
  chiTieu: string;
  dinhDang: string;
  kichThuoc: string;
  dienGiai: string;
  batBuoc: string;
  trung: string;
  ghiChuBS: string;
};

export type CommonCode = Record<string, string>;

export type HoiDapSection = {
  id: string;
  title: string;
  description: string;
};

export type HoiDapQuestion = {
  id: number;
  question: string;
  answer: string[];
  section: string;
  page: number;
  endPage: number;
};

export type HoiDapData = {
  title: string;
  edition: string;
  publisher: string;
  circulation: string;
  pageCount: number;
  sourceFile: string;
  sourceSha256: string;
  sections: HoiDapSection[];
  questions: HoiDapQuestion[];
};

export const HOI_DAP_BHYT_2026 = hoiDapRaw as unknown as HoiDapData;

type ReferenceData = Record<string, ReferenceField[] | CommonCode[]>;
const source = raw as unknown as ReferenceData;

const templateKeys: Record<string, string> = {
  MAU_01: "d",
  MAU_02: "f",
  MAU_03: "p",
  MAU_04: "m",
  MAU_05: "h",
  MAU_06: "g",
};

export const DOCUMENT_LIBRARY = [
  { id: "1", name: "HD Ánh xạ thuốc_Lâm Xung", type: "pdf", url: "huong-dan-anh-xa-thuoc.pdf" },
  { id: "2", name: "Sơ đồ tóm tắt TT12", type: "pdf", url: "so-do-tom-tat-tt12.pdf" },
  { id: "3", name: "Tài liệu kỹ thuật TT12", type: "pdf", url: "tai-lieu-ky-thuat-tt12.pdf" },
  { id: "4", name: "PL 06 bảng DM", type: "word", url: "phu-luc-huong-dan-su-dung-06bangdanhmuc.docx" },
  { id: "5", name: "HD ghi PVCM (CV 2148)", type: "pdf", url: "2148-HD-ma-hoa-pham-vi-chuyen-mon.pdf" },
  { id: "qd-2026-ma-kcb-ma-khoa", name: "QĐ 2026 — Mã loại KCB, mã khoa", type: "pdf", url: "qd-ma-loai-kcb-ma-khoa-2026.pdf" },
  { id: "qd-5937-2021", name: "QĐ 5937/QĐ-BYT — 11 danh mục mã dùng chung", type: "pdf", url: "https://bvquan9.medinet.gov.vn/chuyen-muc/quyet-dinh-5937qd-byt-ban-hanh-bo-sung-cac-danh-muc-ma-dung-chung-ap-dung-trong-cmobile16640-62317.aspx" },
  { id: "qd-1227-byt", name: "QĐ 1227 — Định mức KT-KT kỹ thuật y tế", type: "excel", url: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/QD_1227.xlsx" },
  { id: "qd-3276-byt", name: "QĐ 3276/QĐ-BYT — Mã đối tượng KCB & mã nhiên liệu (Sửa đổi QĐ 2010)", type: "pdf", url: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/BYT-3276.QD-Sua-doi-bo-sung-QD2010.pdf" },
  { id: "qd-2917-byt", name: "QĐ 2917/QĐ-BYT — Sửa đổi, bổ sung mã đối tượng KCB 3.1 tại QĐ 3276 (15/09/2026)", type: "pdf", url: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/BYT-2917.QD-Sua-doi-bo-sung-QD3276.signed.pdf" },
  { id: "qd-3556-byt", name: "QĐ 3556/QĐ-BYT — Sửa đổi, bổ sung QĐ 3176 chuẩn đầu ra KCB BHYT (16/11/2026)", type: "pdf", url: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/BYT-3556.QD-Sua-doi-bo-sung-QD3176.signed.pdf" },
  { id: "qd-3556-excel-goc", name: "QĐ 3556 — Bảng chuẩn dữ liệu đầu ra sửa 3176 (Excel gốc Bộ Y tế)", type: "excel", url: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/261116_Chuan_du_lieu_dau_ra_sua_3176_Final.xlsx" },
  { id: "qd-3556-so-sanh", name: "So sánh chi tiết 93 thay đổi QĐ 3556 vs QĐ 3176 (Excel đối chiếu chuyên sâu)", type: "excel", url: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx" },
  { id: "qd-3556-slide", name: "Slide Báo cáo phân tích thay đổi QĐ 3556/QĐ-BYT (PowerPoint 10 slide)", type: "word", url: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/Bao_cao_Phan_tich_Thay_doi_QD_3556_BYT.pptx" },
  { id: "qd-3556-infographic", name: "Infographic trực quan so sánh thay đổi QĐ 3556 (Bản tương tác trực quan)", type: "pdf", url: "documents/Infographic_QD3556_ThayDoi.html" },
  { id: "hoi-dap-giam-dinh-bhyt-2026", name: "Cẩm nang 108 câu Hỏi - Đáp nghiệp vụ BHYT (BHXH Việt Nam 10/2026)", type: "pdf", url: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/hoi-dap-giam-dinh-bhyt-2026.pdf" },
  { id: "6", name: "Mẫu 01/DM - Bộ phận chuyên môn KCB BHYT", type: "excel", url: "/manus-storage/MAU_01_Template_b516b53b.xlsx" },
  { id: "7", name: "Mẫu 02/DM - Nhân lực thực hiện KCB BHYT", type: "excel", url: "/manus-storage/MAU_02_Template_0406dec0.xlsx" },
  { id: "8", name: "Mẫu 03/DM - Thuốc, máu, chế phẩm máu", type: "excel", url: "/manus-storage/MAU_03_Template_815ef4f9.xlsx" },
  { id: "9", name: "Mẫu 04/DM - Thiết bị y tế", type: "excel", url: "/manus-storage/MAU_04_Template_2549b380.xlsx" },
  { id: "10", name: "Mẫu 05/DM - Dịch vụ KCB", type: "excel", url: "/manus-storage/MAU_05_Template_f74b0c1a.xlsx" },
  { id: "11", name: "Mẫu 06/DM - Thiết bị thực hiện dịch vụ", type: "excel", url: "/manus-storage/MAU_06_Template_92c8b3db.xlsx" },
  { id: "12", name: "Mẫu 01/BH - Tổng hợp đề nghị thanh toán KCB BHYT", type: "excel", url: "/manus-storage/MAU_01_BH_Template_e4db7973.xlsx" },
  { id: "mau-02-bh", name: "Mẫu 02/BH - Báo cáo quyết toán KCB BHYT", type: "excel", url: "/manus-storage/MAU_02_BH_Template_0f545a41.xlsx" },
] as const;

export type DownloadableFile = {
  id: string;
  name: string;
  filename: string;
  path: string;
  rawGithubUrl: string;
  size: string;
  type: "excel" | "pptx" | "html" | "pdf";
  badge: string;
  desc: string;
  canPreview?: boolean;
};

export const QD3556_DOWNLOADABLE_FILES: DownloadableFile[] = [
  {
    id: "so-sanh-excel",
    name: "Bảng tính Excel so sánh 93 thay đổi QĐ 3556 vs 3176",
    filename: "So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx",
    path: "documents/So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx",
    rawGithubUrl: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx",
    size: "31 KB",
    type: "excel",
    badge: "EXCEL",
    desc: "4 sheet chi tiết: Tổng quan 16 bảng, Chi tiết 93 thay đổi (10 cột đối chiếu), Quy tắc Điều 2 và Danh mục 7 văn bản pháp quy dẫn chiếu mới.",
  },
  {
    id: "slide-pptx",
    name: "Slide thuyết trình PowerPoint phân tích QĐ 3556",
    filename: "Bao_cao_Phan_tich_Thay_doi_QD_3556_BYT.pptx",
    path: "documents/Bao_cao_Phan_tich_Thay_doi_QD_3556_BYT.pptx",
    rawGithubUrl: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/Bao_cao_Phan_tich_Thay_doi_QD_3556_BYT.pptx",
    size: "46 KB",
    type: "pptx",
    badge: "PPTX",
    desc: "10 slide widescreen chuẩn thuyết trình: Bối cảnh, 93 thay đổi, 6 nhóm biến động, Điều 2 và kế hoạch 5 bước nâng cấp hệ thống HIS/EMR.",
  },
  {
    id: "infographic-html",
    name: "Bản Infographic tương tác trực quan so sánh thay đổi",
    filename: "Infographic_QD3556_ThayDoi.html",
    path: "documents/Infographic_QD3556_ThayDoi.html",
    rawGithubUrl: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/Infographic_QD3556_ThayDoi.html",
    size: "38 KB",
    type: "html",
    badge: "HTML",
    desc: "Dashboard web tương tác trực quan: Thẻ KPI, ma trận 16 bảng dữ liệu, biểu đồ tỷ lệ thay đổi và bộ lọc tìm kiếm 93 thay đổi tức thì.",
    canPreview: true,
  },
  {
    id: "qd3556-pdf",
    name: "QĐ số 3556/QĐ-BYT ký số gốc từ Thứ trưởng Đào Xuân Cơ",
    filename: "BYT-3556.QD-Sua-doi-bo-sung-QD3176.signed.pdf",
    path: "documents/BYT-3556.QD-Sua-doi-bo-sung-QD3176.signed.pdf",
    rawGithubUrl: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/BYT-3556.QD-Sua-doi-bo-sung-QD3176.signed.pdf",
    size: "577 KB",
    type: "pdf",
    badge: "PDF GỐC",
    desc: "Toàn văn Quyết định số 3556/QĐ-BYT ngày 16/11/2026 có chữ ký số điện tử của Bộ Y tế.",
    canPreview: true,
  },
  {
    id: "excel-goc",
    name: "File Excel chuẩn dữ liệu đầu ra gốc từ Bộ Y tế",
    filename: "261116_Chuan_du_lieu_dau_ra_sua_3176_Final.xlsx",
    path: "documents/261116_Chuan_du_lieu_dau_ra_sua_3176_Final.xlsx",
    rawGithubUrl: "https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/docs/261116_Chuan_du_lieu_dau_ra_sua_3176_Final.xlsx",
    size: "132 KB",
    type: "excel",
    badge: "EXCEL GỐC",
    desc: "Bảng chuẩn dữ liệu đầu ra gồm 16 sheet do Vụ BHYT / Cục QLKCB cung cấp.",
  },
];

// Dữ liệu Mã đối tượng KCB chuẩn hóa thay thế theo Phụ lục 1 Quyết định 3276/QĐ-BYT (bãi bỏ Phụ lục 5 QĐ 2010/QĐ-BYT)
const qd3276DoiTuongRows: CommonCode[] = (qd3276[0]?.rows ?? []).map((row) => ({
  stt: row[0] ?? "",
  ma: row[1] ?? "",
  truongHop: row[2] ?? "",
  quyDinh: row[3] ?? "",
  mucHuong: row[4] ?? "",
  ghiChu: row[5] ?? "",
}));

export const COMMON_CATALOGS: Record<"maLoaiHinh" | "maKhamBenh" | "maDoiTuong" | "maKhoa", CommonCode[]> = {
  maLoaiHinh: source._ ?? [],
  maKhamBenh: source.v ?? [],
  maDoiTuong: qd3276DoiTuongRows.length > 0 ? qd3276DoiTuongRows : (source.x ?? []),
  maKhoa: source.y ?? [],
};

export type ReferenceTable = { id: string; title: string; headers: string[]; rows: string[][]; notes?: string[] };

export const QD3176_TABLES = qd3176 as ReferenceTable[];
export const QD3556_TABLES = qd3556 as (ReferenceTable & { changeCount?: number })[];
export const QD5937_TABLES = qd5937 as ReferenceTable[];
export const QD3276_TABLES = qd3276 as ReferenceTable[];

export function getReferenceFields(templateId: string): ReferenceField[] {
  const key = templateKeys[templateId];
  return (key ? source[key] : []) as ReferenceField[];
}

export function isRequired(field: ReferenceField) {
  return field.batBuoc.trim().toLowerCase() === "x";
}

export function hasDuplicateRule(field: ReferenceField) {
  return field.trung.trim().toLowerCase() === "x";
}

const MANUS_ASSET_ORIGIN = "https://tt12excel-g5pahdhg.manus.space";

export function documentUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  
  if (import.meta.env.VITE_NSN_OFFLINE === "1" || (typeof window !== "undefined" && window.location.protocol === "file:")) {
    const docPath = clean.startsWith("documents/") ? "docs/" + clean.slice("documents/".length) : clean;
    return `https://raw.githubusercontent.com/Nsnnam/tt12-excel-validator/main/${docPath}`;
  }
  
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${clean}`;
}

export function sourceUrl(path: string) {
  if (path.startsWith("/manus-storage/")) return `${MANUS_ASSET_ORIGIN}${path}`;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/documents/") || path.startsWith("documents/")) {
    return documentUrl(path);
  }
  if (path.startsWith("/")) return path;
  return `https://tracuu-danhmuc-tt12.web.app/${path}`;
}

export function readableRequirement(field: ReferenceField) {
  if (isRequired(field)) return "Bắt buộc";
  return field.batBuoc.trim() || "Không bắt buộc";
}
