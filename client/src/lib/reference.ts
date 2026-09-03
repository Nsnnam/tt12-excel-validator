/**
 * Phong cách Hồ sơ điều hành: dữ liệu gốc TT12 được đóng gói rõ nguồn để dùng nhất quán cho tra cứu và kiểm định.
 */
import raw from "@/data/tt12-reference.json";
import qd3176 from "@/data/qd3176-chuan-dau-ra.json";
import qd5937 from "@/data/qd5937-danh-muc.json";
import qd3276 from "@/data/qd3276-phu-luc.json";

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
  { id: "6", name: "Mẫu 01/DM - Bộ phận chuyên môn KCB BHYT", type: "excel", url: "/manus-storage/MAU_01_Template_b516b53b.xlsx" },
  { id: "7", name: "Mẫu 02/DM - Nhân lực thực hiện KCB BHYT", type: "excel", url: "/manus-storage/MAU_02_Template_0406dec0.xlsx" },
  { id: "8", name: "Mẫu 03/DM - Thuốc, máu, chế phẩm máu", type: "excel", url: "/manus-storage/MAU_03_Template_815ef4f9.xlsx" },
  { id: "9", name: "Mẫu 04/DM - Thiết bị y tế", type: "excel", url: "/manus-storage/MAU_04_Template_2549b380.xlsx" },
  { id: "10", name: "Mẫu 05/DM - Dịch vụ KCB", type: "excel", url: "/manus-storage/MAU_05_Template_f74b0c1a.xlsx" },
  { id: "11", name: "Mẫu 06/DM - Thiết bị thực hiện dịch vụ", type: "excel", url: "/manus-storage/MAU_06_Template_92c8b3db.xlsx" },
  { id: "12", name: "Mẫu 01/BH - Tổng hợp đề nghị thanh toán KCB BHYT", type: "excel", url: "/manus-storage/MAU_01_BH_Template_e4db7973.xlsx" },
  { id: "mau-02-bh", name: "Mẫu 02/BH - Báo cáo quyết toán KCB BHYT", type: "excel", url: "/manus-storage/MAU_02_BH_Template_0f545a41.xlsx" },
] as const;

export const COMMON_CATALOGS: Record<"maLoaiHinh" | "maKhamBenh" | "maDoiTuong" | "maKhoa", CommonCode[]> = {
  maLoaiHinh: source._ ?? [],
  maKhamBenh: source.v ?? [],
  maDoiTuong: source.x ?? [],
  maKhoa: source.y ?? [],
};

export type ReferenceTable = { id: string; title: string; headers: string[]; rows: string[][]; notes?: string[] };

export const QD3176_TABLES = qd3176 as ReferenceTable[];
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

export function sourceUrl(path: string) {
  if (path.startsWith("/manus-storage/")) return `${MANUS_ASSET_ORIGIN}${path}`;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  return `https://tracuu-danhmuc-tt12.web.app/${path}`;
}

export function readableRequirement(field: ReferenceField) {
  if (isRequired(field)) return "Bắt buộc";
  return field.batBuoc.trim() || "Không bắt buộc";
}
