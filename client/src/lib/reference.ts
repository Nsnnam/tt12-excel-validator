/**
 * Phong cách Hồ sơ điều hành: dữ liệu gốc TT12 được đóng gói rõ nguồn để dùng nhất quán cho tra cứu và kiểm định.
 */
import raw from "@/data/tt12-reference.json";
import qd3176 from "@/data/qd3176-chuan-dau-ra.json";

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
  { id: "13", name: "QĐ 2026 — Mã loại KCB, mã khoa", type: "pdf", url: "qd-ma-loai-kcb-ma-khoa-2026.pdf" },
  { id: "6", name: "File mẫu Mẫu 01/DM", type: "excel", url: "MAU_01_Template.xlsx" },
  { id: "7", name: "File mẫu Mẫu 02/DM", type: "excel", url: "MAU_02_Template.xlsx" },
  { id: "8", name: "File mẫu Mẫu 03/DM", type: "excel", url: "MAU_03_Template.xlsx" },
  { id: "9", name: "File mẫu Mẫu 04/DM", type: "excel", url: "MAU_04_Template.xlsx" },
  { id: "10", name: "File mẫu Mẫu 05/DM", type: "excel", url: "MAU_05_Template.xlsx" },
  { id: "11", name: "File mẫu Mẫu 06/DM", type: "excel", url: "MAU_06_Template.xlsx" },
  { id: "12", name: "Mẫu Import Người hành nghề (GĐV import)", type: "excel", url: "mau-import-nguoi-hanh-nghe_giamdinhvien%20import.xlsx" },
] as const;

export const COMMON_CATALOGS: Record<"maLoaiHinh" | "maKhamBenh" | "maDoiTuong" | "maKhoa", CommonCode[]> = {
  maLoaiHinh: source._ ?? [],
  maKhamBenh: source.v ?? [],
  maDoiTuong: source.x ?? [],
  maKhoa: source.y ?? [],
};

export const QD3176_TABLES = qd3176 as { id: string; title: string; headers: string[]; rows: string[][] }[];

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

export function sourceUrl(path: string) {
  return `https://tracuu-danhmuc-tt12.web.app/${path}`;
}

export function readableRequirement(field: ReferenceField) {
  if (isRequired(field)) return "Bắt buộc";
  return field.batBuoc.trim() || "Không bắt buộc";
}
