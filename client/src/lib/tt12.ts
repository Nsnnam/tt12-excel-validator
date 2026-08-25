import * as XLSX from "xlsx";
import { getReferenceFields, isRequired } from "./reference";

export type Severity = "error" | "warning" | "info";

export type CellData = {
  value: unknown;
  formula?: string;
  kind?: string;
};

export type DataRow = {
  rowNumber: number;
  cells: Record<string, CellData>;
};

export type ValidationIssue = {
  id: string;
  severity: Severity;
  row: number | null;
  column: string;
  category: string;
  message: string;
  suggestion: string;
};

export type TemplateSchema = {
  id: string;
  label: string;
  sheetName: string;
  headers: string[];
  keyFields: string[];
  requiredFields: string[];
  datePairs: [string, string][];
};

export type Detection = {
  template: TemplateSchema;
  score: number;
  matched: number;
  missing: string[];
  extra: string[];
};

export type Inspection = {
  fileName: string;
  fileSize: number;
  sheetName: string;
  headerRow: number;
  headers: string[];
  rows: DataRow[];
  detection: Detection | null;
  candidates: Detection[];
  issues: ValidationIssue[];
  hasFormula: boolean;
};

const common = ["TU_NGAY", "DEN_NGAY", "MA_CSKCB"];

export const TEMPLATES: TemplateSchema[] = [
  {
    id: "MAU_01",
    label: "Mẫu số 01/DM",
    sheetName: "MAU_01",
    headers: ["STT", "MA_KHOA", "TEN_KHOA", "BAN_KHAM", "GIUONG_PD", "GIUONG_TK", "GIUONG_HSTC", "GIUONG_HSCC", ...common],
    keyFields: ["MA_KHOA", "MA_CSKCB", "TU_NGAY"],
    requiredFields: ["MA_KHOA", "TEN_KHOA", "TU_NGAY", "MA_CSKCB"],
    datePairs: [["TU_NGAY", "DEN_NGAY"]],
  },
  {
    id: "MAU_02",
    label: "Mẫu số 02/DM",
    sheetName: "MAU_02",
    headers: ["STT", "MA_KHOA", "TEN_KHOA", "HO_TEN", "GIOI_TINH", "SO_DINH_DANH", "CHUCDANH_NN", "VI_TRI", "MACCHN", "NGAYCAP_CCHN", "NOICAP_CCHN", "PHAMVI_CM", "PHAMVI_CMBS", "DVKT_KHAC", "VB_PHANCONG", "THOIGIAN_DK", "THOIGIAN_NGAY", "THOIGIAN_TUAN", "CSKCB_KHAC", "CSKCB_CGKT", "QD_CGKT", ...common],
    keyFields: ["SO_DINH_DANH", "MA_CSKCB", "TU_NGAY"],
    requiredFields: ["MA_KHOA", "HO_TEN", "SO_DINH_DANH", "TU_NGAY", "MA_CSKCB"],
    datePairs: [["TU_NGAY", "DEN_NGAY"]],
  },
  {
    id: "MAU_03",
    label: "Mẫu số 03/DM",
    sheetName: "MAU_03",
    headers: ["STT", "MA_THUOC", "TEN_HOAT_CHAT", "TEN_THUOC", "DON_VI_TINH", "HAM_LUONG", "DUONG_DUNG", "MA_DUONG_DUNG", "DANG_BAO_CHE", "SO_DANG_KY", "SO_LUONG", "DON_GIA", "DON_GIA_BH", "QUY_CACH", "NHA_SX", "NUOC_SX", "NHA_THAU", "TT_THAU", "TU_NGAY_HD", "DEN_NGAY_HD", "MA_CSKCB", "LOAI_THUOC", "LOAI_THAU", "HT_THAU", "MA_DVKT", "TCCL", "BO_PHAN_VT", "TEN_KHOA_HOC", "NGUON_GOC", "PP_CHEBIEN", "MA_DL_NHAP", "MA_DL_CB", "TLHH_CB", "TLHH_BQ", "MA_CSKCB_THUOC", "TU_NGAY", "DEN_NGAY"],
    keyFields: ["MA_THUOC", "MA_CSKCB", "TU_NGAY"],
    requiredFields: ["MA_THUOC", "TEN_THUOC", "DON_VI_TINH", "DON_GIA", "TU_NGAY", "MA_CSKCB"],
    datePairs: [["TU_NGAY_HD", "DEN_NGAY_HD"], ["TU_NGAY", "DEN_NGAY"]],
  },
  {
    id: "MAU_04",
    label: "Mẫu số 04/DM",
    sheetName: "MAU_04",
    headers: ["STT", "MA_VAT_TU", "NHOM_VAT_TU", "TEN_VAT_TU", "MA_HIEU", "SO_LUU_HANH", "TINHNANG_KT", "QUY_CACH", "HANG_SX", "NUOC_SX", "DON_VI_TINH", "DON_GIA", "DON_GIA_BH", "TYLE_TT_BH", "SO_LUONG", "DINH_MUC", "NHA_THAU", "TT_THAU", "TU_NGAY_HD", "DEN_NGAY_HD", "MA_CSKCB", "LOAI_THAU", "HT_THAU", "MA_CSKCB_TBYT", "TU_NGAY", "DEN_NGAY"],
    keyFields: ["MA_VAT_TU", "MA_CSKCB", "TU_NGAY"],
    requiredFields: ["MA_VAT_TU", "TEN_VAT_TU", "DON_VI_TINH", "DON_GIA", "TU_NGAY", "MA_CSKCB"],
    datePairs: [["TU_NGAY_HD", "DEN_NGAY_HD"], ["TU_NGAY", "DEN_NGAY"]],
  },
  {
    id: "MAU_05",
    label: "Mẫu số 05/DM",
    sheetName: "MAU_05",
    headers: ["STT", "MA_DICH_VU", "TEN_DICH_VU", "TEN_DVKT_GIA", "DON_GIA", "QUY_TRINH", "SO_LUONG_CGKT", "CSKCB_CGKT", "CSKCB_CLS", "QD_DVKT", "QD_PD_GIA", "GHI_CHU", "TU_NGAY", "DEN_NGAY", "MA_CSKCB", "GIA_THANH_TOAN", "DS_THUOCPX.STT", "DS_THUOCPX.MA_THUOC", "DS_THUOCPX.TEN_THUOC", "DS_THUOCPX.SO_DANG_KY", "DS_THUOCPX.DON_VI_TINH", "DS_THUOCPX.TT_THAU", "DS_THUOCPX.DON_GIA_THUOC", "DS_THUOCPX.DM_NSX_CDD", "DS_THUOCPX.DM_THUCTE_CDD", "DS_THUOCPX.LIEU_BQ_PX", "DS_THUOCPX.TL_THUCTE_BQ_PX", "DS_THUOCPX.THANH_TIEN_THUOC"],
    keyFields: ["MA_DICH_VU", "MA_CSKCB", "TU_NGAY"],
    requiredFields: ["MA_DICH_VU", "TEN_DICH_VU", "DON_GIA", "TU_NGAY", "MA_CSKCB"],
    datePairs: [["TU_NGAY", "DEN_NGAY"]],
  },
  {
    id: "MAU_06",
    label: "Mẫu số 06/DM",
    sheetName: "MAU_06",
    headers: ["STT", "TEN_TB", "KY_HIEU", "CONGTY_SX", "NUOC_SX", "NAM_SX", "NAM_SD", "MA_MAY", "SO_LUU_HANH", "HD_TU", "HD_DEN", "TU_NGAY", "DEN_NGAY", "MA_CSKCB"],
    keyFields: ["MA_MAY", "MA_CSKCB", "TU_NGAY"],
    requiredFields: ["TEN_TB", "TU_NGAY", "MA_CSKCB"],
    datePairs: [["HD_TU", "HD_DEN"], ["TU_NGAY", "DEN_NGAY"]],
  },
];

const fieldNotes: Record<string, string> = {
  STT: "Số thứ tự của dòng dữ liệu.",
  MA_KHOA: "Mã khoa hoặc mã khám bệnh theo danh mục dùng chung.",
  TEN_KHOA: "Tên khoa hoặc chuyên khoa tương ứng với mã khoa.",
  BAN_KHAM: "Số lượng bàn khám.",
  GIUONG_PD: "Số giường được phê duyệt.",
  GIUONG_TK: "Tổng số giường thực tế.",
  GIUONG_HSTC: "Số giường hồi sức tích cực.",
  GIUONG_HSCC: "Số giường hồi sức cấp cứu.",
  TU_NGAY: "Ngày bắt đầu áp dụng theo dạng YYYYMMDD.",
  DEN_NGAY: "Ngày ngừng áp dụng theo dạng YYYYMMDD khi có điều chỉnh.",
  MA_CSKCB: "Mã cơ sở khám bệnh, chữa bệnh gồm 5 ký tự.",
  DON_GIA: "Đơn giá phải là số không âm, không chứa ký hiệu tiền tệ.",
  DON_GIA_BH: "Đơn giá BHYT phải là số không âm.",
  GIA_THANH_TOAN: "Giá thanh toán phải là số không âm.",
};

const maxLengths: Record<string, number> = {
  STT: 3,
  MA_KHOA: 50,
  MA_CSKCB: 5,
  TU_NGAY: 8,
  DEN_NGAY: 8,
  TU_NGAY_HD: 8,
  DEN_NGAY_HD: 8,
  NGAYCAP_CCHN: 8,
};

const integerFields = new Set([
  "STT", "BAN_KHAM", "GIUONG_PD", "GIUONG_TK", "GIUONG_HSTC", "GIUONG_HSCC", "SO_LUONG", "DINH_MUC", "THOIGIAN_DK", "THOIGIAN_NGAY", "THOIGIAN_TUAN", "NAM_SX", "NAM_SD", "DS_THUOCPX.STT",
]);

const decimalFields = new Set(["TYLE_TT_BH", "TLHH_CB", "TLHH_BQ", "DS_THUOCPX.LIEU_BQ_PX", "DS_THUOCPX.TL_THUCTE_BQ_PX", "SO_LUONG_CGKT"]);

const dateFields = new Set(["TU_NGAY", "DEN_NGAY", "TU_NGAY_HD", "DEN_NGAY_HD", "NGAYCAP_CCHN", "HD_TU", "HD_DEN"]);

function normalize(value: unknown) {
  return String(value ?? "").replace(/\u00a0/g, " ").trim().replace(/\s+/g, " ").toUpperCase();
}

function text(value: unknown) {
  return String(value ?? "");
}

function isPresent(cell?: CellData) {
  return Boolean(cell && (cell.formula || text(cell.value).trim()));
}

function numberValue(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const content = text(value).trim();
  if (!/^\d+(?:\.\d+)?$/.test(content)) return null;
  const parsed = Number(content);
  return Number.isFinite(parsed) ? parsed : null;
}

function isValidDate(value: unknown) {
  const source = text(value).trim();
  if (!/^\d{8}$/.test(source)) return false;
  const year = Number(source.slice(0, 4));
  const month = Number(source.slice(4, 6));
  const day = Number(source.slice(6, 8));
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function issue(
  severity: Severity,
  row: number | null,
  column: string,
  category: string,
  message: string,
  suggestion: string,
): ValidationIssue {
  return { id: `${severity}-${row ?? "header"}-${column}-${message}`, severity, row, column, category, message, suggestion };
}

function isCurrency(header: string) {
  return header.includes("DON_GIA") || header.includes("GIA_THANH") || header.includes("THANH_TIEN");
}

function isDate(header: string) {
  return dateFields.has(header);
}

function isNumber(header: string) {
  return integerFields.has(header) || decimalFields.has(header) || isCurrency(header);
}

function fieldFormat(header: string) {
  if (isDate(header)) return "Chuỗi ngày YYYYMMDD";
  if (isCurrency(header)) return "Số tiền không âm";
  if (integerFields.has(header)) return "Số nguyên không âm";
  if (decimalFields.has(header)) return "Số không âm";
  return "Chuỗi";
}

export function fieldsForTemplate(template: TemplateSchema) {
  const sourceFields = getReferenceFields(template.id);
  if (sourceFields.length) {
    return sourceFields.map((field, index) => ({
      index: Number(field.stt) || index + 1,
      name: field.chiTieu,
      format: field.dinhDang || fieldFormat(field.chiTieu),
      size: field.kichThuoc || "—",
      note: field.dienGiai || fieldNotes[field.chiTieu] || `Trường dữ liệu thuộc ${template.label}.`,
      required: isRequired(field),
      duplicate: field.trung.trim().toLowerCase() === "x",
      additionalNote: field.ghiChuBS,
    }));
  }
  return template.headers.map((header, index) => ({
    index: index + 1,
    name: header,
    format: fieldFormat(header),
    size: maxLengths[header] ?? "—",
    note: fieldNotes[header] ?? `Trường dữ liệu thuộc ${template.label}.`,
    required: template.requiredFields.includes(header),
    duplicate: false,
    additionalNote: "",
  }));
}

export function detectTemplate(headers: string[]): Detection[] {
  const source = headers.map(normalize).filter(Boolean);
  const uniqueSource = new Set(source);
  return TEMPLATES.map((template) => {
    const expected = template.headers.map(normalize);
    const matched = expected.filter((header) => uniqueSource.has(header)).length;
    const missing = template.headers.filter((header) => !uniqueSource.has(normalize(header)));
    const extra = headers.filter((header) => !expected.includes(normalize(header)));
    return { template, score: Math.round((matched / expected.length) * 100), matched, missing, extra };
  }).sort((a, b) => b.score - a.score || b.matched - a.matched);
}

export function validateTable(template: TemplateSchema, headers: string[], rows: DataRow[]) {
  const issues: ValidationIssue[] = [];
  const sourceFields = getReferenceFields(template.id);
  const sourceByName = new Map(sourceFields.map((field) => [field.chiTieu, field]));
  const requiredFields = Array.from(new Set([...template.requiredFields, ...sourceFields.filter(isRequired).map((field) => field.chiTieu)]));
  const normalizedHeaders = headers.map(normalize);
  const expected = new Set(template.headers.map(normalize));

  const headerCount = new Map<string, number>();
  headers.forEach((header) => headerCount.set(normalize(header), (headerCount.get(normalize(header)) ?? 0) + 1));
  headerCount.forEach((count, header) => {
    if (header && count > 1) issues.push(issue("error", null, header, "Cấu trúc", "Trùng tên cột trong hàng tiêu đề.", "Chỉ giữ một cột cho mỗi chỉ tiêu chuẩn."));
  });

  template.headers.forEach((header) => {
    if (!normalizedHeaders.includes(normalize(header))) {
      issues.push(issue("error", null, header, "Cấu trúc", "Thiếu cột bắt buộc theo mẫu đã nhận diện.", "Khôi phục đúng tên cột theo file mẫu, không thêm hoặc bớt ký tự."));
    }
  });
  headers.forEach((header) => {
    if (header && !expected.has(normalize(header))) issues.push(issue("warning", null, header, "Cấu trúc", "Cột không thuộc mẫu chuẩn đã nhận diện.", "Rà soát tên cột hoặc chuyển nội dung sang trường phù hợp trong file mẫu."));
  });

  const seen = new Map<string, number>();
  rows.forEach((row, index) => {
    requiredFields.forEach((header) => {
      if (!isPresent(row.cells[header])) {
        issues.push(issue("error", row.rowNumber, header, "Thiếu dữ liệu", "Trường lõi đang để trống.", "Bổ sung giá trị trước khi gửi danh mục."));
      }
    });

    template.headers.forEach((header) => {
      const cell = row.cells[header];
      if (!isPresent(cell)) return;
      const value = text(cell?.value);
      if (cell?.formula) {
        issues.push(issue("warning", row.rowNumber, header, "Công thức", "Ô chứa công thức Excel.", "Dán giá trị tĩnh trước khi nộp để tránh thay đổi ngoài ý muốn."));
      }
      if (/^[\s\u00a0]+|[\s\u00a0]+$/.test(value)) {
        issues.push(issue("warning", row.rowNumber, header, "Văn bản", "Có khoảng trắng ở đầu hoặc cuối ô.", "Xóa khoảng trắng thừa ở hai đầu giá trị."));
      }
      if (/ {2,}/.test(value)) {
        issues.push(issue("warning", row.rowNumber, header, "Văn bản", "Có nhiều khoảng trắng liên tiếp.", "Chuẩn hóa về một khoảng trắng giữa các từ."));
      }
      if (/\r|\n/.test(value)) {
        issues.push(issue("warning", row.rowNumber, header, "Văn bản", "Ô chứa ký tự xuống dòng.", "Chuyển nội dung về một dòng nếu chỉ tiêu không yêu cầu diễn giải nhiều dòng."));
      }
      if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value) || value.includes("\u00a0")) {
        issues.push(issue("warning", row.rowNumber, header, "Văn bản", "Phát hiện ký tự ẩn hoặc khoảng trắng không ngắt.", "Thay bằng ký tự văn bản thông thường và kiểm tra lại ô."));
      }
      const sourceLength = Number(sourceByName.get(header)?.kichThuoc);
      const maximum = maxLengths[header] ?? (Number.isFinite(sourceLength) && sourceLength > 0 ? sourceLength : undefined);
      if (maximum && value.trim().length > maximum) {
        issues.push(issue("error", row.rowNumber, header, "Độ dài", `Giá trị dài ${value.trim().length} ký tự, vượt giới hạn ${maximum}.`, "Rút gọn giá trị theo quy định của chỉ tiêu."));
      }
      if (header.startsWith("MA_") && typeof cell?.value === "number") {
        issues.push(issue("warning", row.rowNumber, header, "Định dạng mã", "Mã được Excel đọc ở dạng số; có nguy cơ mất số 0 ở đầu.", "Định dạng cột là Text và nhập lại mã theo danh mục dùng chung."));
      }
      const sourceFormat = sourceByName.get(header)?.dinhDang.toLowerCase() ?? "";
      const expectsNumber = isNumber(header) || sourceFormat.includes("số");
      if (isDate(header) && !isValidDate(value)) {
        issues.push(issue("error", row.rowNumber, header, "Ngày tháng", "Ngày không đúng định dạng YYYYMMDD hoặc không tồn tại trên lịch.", "Nhập 8 chữ số, ví dụ 20260825; không dùng dấu gạch hoặc định dạng ngày Excel."));
      }
      if (expectsNumber) {
        const numeric = numberValue(cell?.value);
        if (numeric === null || numeric < 0) {
          issues.push(issue("error", row.rowNumber, header, isCurrency(header) ? "Tiền tệ" : "Số liệu", isCurrency(header) ? "Giá trị tiền tệ phải là số không âm, không chứa ký hiệu tiền hoặc dấu phân tách." : "Giá trị phải là số không âm hợp lệ.", "Nhập giá trị số thuần, ví dụ 1250000."));
        } else if (integerFields.has(header) && !Number.isInteger(numeric)) {
          issues.push(issue("error", row.rowNumber, header, "Số liệu", "Chỉ tiêu này chỉ chấp nhận số nguyên.", "Làm tròn hoặc điều chỉnh về số nguyên không âm."));
        }
      }
    });

    const stt = numberValue(row.cells.STT?.value);
    if (stt !== null && stt !== index + 1) {
      issues.push(issue("warning", row.rowNumber, "STT", "Trình tự", `STT hiện là ${stt}, không khớp thứ tự dòng dữ liệu ${index + 1}.`, "Đánh lại STT liên tục hoặc để công cụ nguồn đánh số lại."));
    }
    const cskcb = text(row.cells.MA_CSKCB?.value).trim();
    if (cskcb && cskcb.length !== 5) {
      issues.push(issue("error", row.rowNumber, "MA_CSKCB", "Độ dài", "Mã cơ sở KCB phải có đúng 5 ký tự.", "Đối chiếu với danh mục mã cơ sở khám chữa bệnh."));
    }
    const dinhDanh = text(row.cells.SO_DINH_DANH?.value).trim();
    if (dinhDanh && !/^\d{12}$/.test(dinhDanh)) {
      issues.push(issue("warning", row.rowNumber, "SO_DINH_DANH", "Định danh", "Số định danh không có đủ 12 chữ số.", "Kiểm tra lại số định danh cá nhân và giữ định dạng Text khi cần."));
    }
    template.datePairs.forEach(([start, end]) => {
      const from = text(row.cells[start]?.value).trim();
      const to = text(row.cells[end]?.value).trim();
      if (from && to && isValidDate(from) && isValidDate(to) && from > to) {
        issues.push(issue("error", row.rowNumber, `${start} / ${end}`, "Logic thời gian", `${start} không được muộn hơn ${end}.`, "Điều chỉnh lại khoảng thời gian hiệu lực."));
      }
    });
    const key = template.keyFields.map((field) => text(row.cells[field]?.value).trim()).join("|");
    if (key && !key.includes("||") && key.split("|").every(Boolean)) {
      const firstRow = seen.get(key);
      if (firstRow) {
        issues.push(issue("error", row.rowNumber, template.keyFields.join(" + "), "Trùng dữ liệu", `Trùng khóa nghiệp vụ với dòng ${firstRow}.`, "Kiểm tra bản ghi lặp hoặc dùng TU_NGAY/DEN_NGAY đúng quy tắc cập nhật hai dòng."));
      } else {
        seen.set(key, row.rowNumber);
      }
    }

    if (template.id === "MAU_01") {
      const total = numberValue(row.cells.GIUONG_TK?.value);
      const critical = numberValue(row.cells.GIUONG_HSTC?.value) ?? 0;
      const emergency = numberValue(row.cells.GIUONG_HSCC?.value) ?? 0;
      if (total !== null && critical + emergency > total) {
        issues.push(issue("error", row.rowNumber, "GIUONG_HSTC / GIUONG_HSCC", "Logic số liệu", "Tổng giường HSTC và HSCC vượt GIUONG_TK.", "Rà soát số giường từng nhóm và tổng số giường thực tế."));
      }
    }
    if (template.id === "MAU_02") {
      const day = numberValue(row.cells.THOIGIAN_NGAY?.value);
      const week = numberValue(row.cells.THOIGIAN_TUAN?.value);
      if ((day !== null && day > 24) || (week !== null && week > 168)) {
        issues.push(issue("warning", row.rowNumber, "THOIGIAN_NGAY / THOIGIAN_TUAN", "Logic thời gian", "Thời gian khai báo vượt giới hạn một ngày hoặc một tuần.", "Kiểm tra đơn vị và giá trị thời gian đăng ký."));
      }
    }
    if (template.id === "MAU_03") {
      const price = numberValue(row.cells.DON_GIA?.value);
      const covered = numberValue(row.cells.DON_GIA_BH?.value);
      if (price !== null && covered !== null && covered > price) {
        issues.push(issue("warning", row.rowNumber, "DON_GIA_BH", "Logic tiền tệ", "Đơn giá BHYT lớn hơn đơn giá khai báo.", "Đối chiếu giá thầu, giá nhập và mức thanh toán BHYT."));
      }
    }
    if (template.id === "MAU_04") {
      const rate = numberValue(row.cells.TYLE_TT_BH?.value);
      if (rate !== null && rate > 100) {
        issues.push(issue("warning", row.rowNumber, "TYLE_TT_BH", "Tỷ lệ", "Tỷ lệ thanh toán BHYT vượt 100%.", "Nhập tỷ lệ phần trăm trong khoảng từ 0 đến 100."));
      }
    }
    if (template.id === "MAU_05") {
      const base = numberValue(row.cells.DON_GIA?.value);
      const paid = numberValue(row.cells.GIA_THANH_TOAN?.value);
      if (base !== null && paid !== null && paid > base) {
        issues.push(issue("warning", row.rowNumber, "GIA_THANH_TOAN", "Logic tiền tệ", "Giá thanh toán lớn hơn đơn giá dịch vụ.", "Đối chiếu quyết định phê duyệt giá và quy tắc thanh toán."));
      }
    }
    if (template.id === "MAU_06") {
      const manufactured = numberValue(row.cells.NAM_SX?.value);
      const used = numberValue(row.cells.NAM_SD?.value);
      if (manufactured !== null && used !== null && used < manufactured) {
        issues.push(issue("error", row.rowNumber, "NAM_SD", "Logic thiết bị", "Năm sử dụng không thể nhỏ hơn năm sản xuất.", "Rà soát lại năm sản xuất và năm bắt đầu sử dụng."));
      }
    }
  });
  if (!rows.length) {
    issues.push(issue("info", null, "Dữ liệu", "Phạm vi kiểm tra", "Không tìm thấy dòng dữ liệu để kiểm định.", "Điền dữ liệu từ dòng sau hàng tiêu đề rồi import lại."));
  }
  return issues;
}

function snapshotSheet(sheet: XLSX.WorkSheet) {
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1:A1");
  let best: { rowIndex: number; headers: string[]; candidates: Detection[] } | null = null;
  for (let rowIndex = range.s.r; rowIndex <= Math.min(range.e.r, range.s.r + 11); rowIndex += 1) {
    const headers: string[] = [];
    for (let column = range.s.c; column <= range.e.c; column += 1) {
      const cell = sheet[XLSX.utils.encode_cell({ r: rowIndex, c: column })];
      headers.push(cell ? text(cell.v) : "");
    }
    const candidates = detectTemplate(headers);
    if (!best || candidates[0].score > best.candidates[0].score) best = { rowIndex, headers, candidates };
  }
  if (!best) return null;
  const rows: DataRow[] = [];
  for (let rowIndex = best.rowIndex + 1; rowIndex <= range.e.r; rowIndex += 1) {
    const cells: Record<string, CellData> = {};
    let hasData = false;
    best.headers.forEach((header, columnOffset) => {
      const name = normalize(header);
      if (!name) return;
      const cell = sheet[XLSX.utils.encode_cell({ r: rowIndex, c: range.s.c + columnOffset })];
      const data: CellData = { value: cell?.v ?? "", formula: cell?.f, kind: cell?.t };
      cells[name] = data;
      if (name !== "STT" && isPresent(data)) hasData = true;
    });
    if (hasData) rows.push({ rowNumber: rowIndex + 1, cells });
  }
  return { headerRow: best.rowIndex + 1, headers: best.headers.map(normalize).filter(Boolean), rows, candidates: best.candidates };
}

export async function inspectExcelFile(file: File): Promise<Inspection> {
  const bytes = await file.arrayBuffer();
  const workbook = XLSX.read(bytes, { type: "array", cellFormula: true, cellDates: false, raw: true });
  const options = workbook.SheetNames.map((name) => ({ name, snapshot: snapshotSheet(workbook.Sheets[name]) })).filter((item) => item.snapshot);
  if (!options.length) throw new Error("Không tìm thấy sheet có thể đọc trong file Excel.");
  const preferred = options.sort((a, b) => (b.snapshot?.candidates[0]?.score ?? 0) - (a.snapshot?.candidates[0]?.score ?? 0))[0];
  const snapshot = preferred.snapshot!;
  const detected = snapshot.candidates[0]?.score >= 60 ? snapshot.candidates[0] : null;
  const issues = detected
    ? validateTable(detected.template, snapshot.headers, snapshot.rows)
    : [issue("error", snapshot.headerRow, "Hàng tiêu đề", "Nhận diện mẫu", "Không đủ chữ ký cột để nhận diện Mẫu 01–06/DM.", "Dùng file mẫu chuẩn hoặc kiểm tra tên cột ở dòng tiêu đề.")];
  return {
    fileName: file.name,
    fileSize: file.size,
    sheetName: preferred.name,
    headerRow: snapshot.headerRow,
    headers: snapshot.headers,
    rows: snapshot.rows,
    detection: detected,
    candidates: snapshot.candidates.slice(0, 3),
    issues,
    hasFormula: snapshot.rows.some((row) => Object.values(row.cells).some((cell) => Boolean(cell.formula))),
  };
}

export function issueCounts(issues: ValidationIssue[]) {
  return issues.reduce<Record<Severity, number>>((counts, item) => {
    counts[item.severity] += 1;
    return counts;
  }, { error: 0, warning: 0, info: 0 });
}

function fileTimestamp() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((all, item) => ({ ...all, [item.type]: item.value }), {});
  return `${parts.hour}${parts.minute}${parts.second}_TT12_kiem_dinh_${parts.year}${parts.month}${parts.day}`;
}

export function exportReport(inspection: Inspection) {
  const counts = issueCounts(inspection.issues);
  const summary = [
    ["BÁO CÁO KIỂM ĐỊNH EXCEL TT12", ""],
    ["Thời điểm", new Intl.DateTimeFormat("vi-VN", { dateStyle: "full", timeStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date())],
    ["Tệp", inspection.fileName],
    ["Sheet", inspection.sheetName],
    ["Mẫu nhận diện", inspection.detection?.template.label ?? "Chưa nhận diện"],
    ["Độ tin cậy", inspection.detection ? `${inspection.detection.score}%` : "0%"],
    ["Số dòng dữ liệu", inspection.rows.length],
    ["Lỗi chặn", counts.error],
    ["Cảnh báo", counts.warning],
    ["Thông tin", counts.info],
  ];
  const detail = inspection.issues.map((item) => ({
    "Mức độ": item.severity === "error" ? "Lỗi" : item.severity === "warning" ? "Cảnh báo" : "Thông tin",
    "Dòng Excel": item.row ?? "—",
    "Cột": item.column,
    "Nhóm kiểm tra": item.category,
    "Nội dung": item.message,
    "Gợi ý xử lý": item.suggestion,
  }));
  const log = [{ "Thời điểm GMT+7": new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date()), "Sự kiện": "Hoàn thành kiểm định tại trình duyệt", "Chi tiết": `${inspection.rows.length} dòng dữ liệu, ${inspection.issues.length} phát hiện.` }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(summary), "Tóm tắt");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(detail), "Chi tiết");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(log), "Nhật ký");
  XLSX.writeFile(workbook, `${fileTimestamp()}.xlsx`);
}

export function sourceTemplateUrl(id: string) {
  const number = id.replace("MAU_", "");
  return `https://tracuu-danhmuc-tt12.web.app/MAU_${number}_Template.xlsx`;
}
