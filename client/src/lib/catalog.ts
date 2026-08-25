/**
 * Phong cách Hồ sơ điều hành: danh mục người dùng nạp là nguồn kiểm tra cục bộ, không rời khỏi trình duyệt.
 */
import * as XLSX from "xlsx";
import type { Inspection, ValidationIssue } from "./tt12";

export type CatalogKind = "maKhoa" | "maKhamBenh" | "unknown";

export type ImportedCatalog = {
  id: string;
  kind: CatalogKind;
  fileName: string;
  sheetName: string;
  count: number;
  codeColumn: string;
  nameColumn?: string;
  entries: Map<string, string>;
};

const normalize = (value: unknown) => String(value ?? "").replace(/\u00a0/g, " ").trim().replace(/\s+/g, " ").toLocaleUpperCase("vi-VN");
const plain = (value: unknown) => String(value ?? "").replace(/\u00a0/g, " ").trim().replace(/\s+/g, " ");
const columnName = (index: number) => XLSX.utils.encode_col(index);

function identifyKind(headers: string[]): CatalogKind {
  const combined = headers.map(normalize).join("|");
  if (combined.includes("MA_KHOA") || combined.includes("TEN_KHOA")) return "maKhoa";
  if (combined.includes("MA_KHAM_BENH") || combined.includes("TEN_KHAM_BENH") || combined.includes("MA_BAN_KHAM")) return "maKhamBenh";
  return "unknown";
}

function issue(row: number, column: string, message: string, suggestion: string): ValidationIssue {
  return { id: `catalog-${row}-${column}-${message}`, severity: "error", row, column, category: "Danh mục đối chiếu", message, suggestion };
}

export async function importCatalogFile(file: File, forcedKind?: CatalogKind): Promise<ImportedCatalog> {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", raw: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("Không tìm thấy sheet trong file danh mục.");
  const sheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1:A1");
  let headerRow = range.s.r;
  let headers: string[] = [];
  let bestScore = -1;
  for (let row = range.s.r; row <= Math.min(range.e.r, range.s.r + 9); row += 1) {
    const candidate = Array.from({ length: range.e.c - range.s.c + 1 }, (_, offset) => plain(sheet[XLSX.utils.encode_cell({ r: row, c: range.s.c + offset })]?.v));
    const score = candidate.filter(Boolean).length + candidate.filter((item) => /MA|TEN|MÃ|TÊN/i.test(item)).length * 2;
    if (score > bestScore) { headerRow = row; headers = candidate; bestScore = score; }
  }
  const normalized = headers.map(normalize);
  const codeIndex = normalized.findIndex((header) => /^(MA_KHOA|MA_KHAM_BENH|MA_BAN_KHAM|MA|MÃ)$/.test(header) || header.includes("MA_KHOA") || header.includes("MA_KHAM_BENH"));
  if (codeIndex < 0) throw new Error("Không tự nhận diện được cột mã. Hãy đặt tên cột là MA_KHOA, MA_KHAM_BENH hoặc MA.");
  const nameIndex = normalized.findIndex((header) => /^(TEN_KHOA|TEN_KHAM_BENH|TEN|TÊN)$/.test(header) || header.includes("TEN_KHOA") || header.includes("TEN_KHAM_BENH"));
  const entries = new Map<string, string>();
  for (let row = headerRow + 1; row <= range.e.r; row += 1) {
    const code = normalize(sheet[XLSX.utils.encode_cell({ r: row, c: range.s.c + codeIndex })]?.v);
    if (!code) continue;
    const name = nameIndex >= 0 ? plain(sheet[XLSX.utils.encode_cell({ r: row, c: range.s.c + nameIndex })]?.v) : "";
    entries.set(code, name);
  }
  if (!entries.size) throw new Error("Danh mục không có dòng mã hợp lệ sau hàng tiêu đề.");
  return {
    id: `${file.name}-${file.lastModified}-${entries.size}`,
    kind: forcedKind && forcedKind !== "unknown" ? forcedKind : identifyKind(headers),
    fileName: file.name,
    sheetName,
    count: entries.size,
    codeColumn: headers[codeIndex] || columnName(codeIndex),
    nameColumn: nameIndex >= 0 ? headers[nameIndex] || columnName(nameIndex) : undefined,
    entries,
  };
}

export function validateCatalogIssues(inspection: Inspection, catalogs: ImportedCatalog[]): ValidationIssue[] {
  if (!catalogs.length) return [];
  const allowed = new Map<string, string>();
  catalogs.forEach((catalog) => catalog.entries.forEach((name, code) => allowed.set(code, name)));
  const issues: ValidationIssue[] = [];
  inspection.rows.forEach((row) => {
    const code = normalize(row.cells.MA_KHOA?.value);
    const isCompositeKhoa = /^K\d{4,}$/.test(code) || /^K\d{2}\.D\d{2}$/.test(code);
    if (!code || isCompositeKhoa || code.startsWith("TYT") || code.startsWith("LKV") || code.startsWith("GKV")) return;
    const matchedName = allowed.get(code);
    if (!matchedName) {
      issues.push(issue(row.rowNumber, "MA_KHOA", "Mã không có trong danh mục mã khoa/mã khám bệnh đã nạp.", "Đối chiếu mã với danh mục đang hiệu lực hoặc nạp đúng file mã dùng chung."));
      return;
    }
    const declaredName = plain(row.cells.TEN_KHOA?.value);
    if (declaredName && matchedName && normalize(declaredName) !== normalize(matchedName)) {
      issues.push({ id: `catalog-name-${row.rowNumber}`, severity: "warning", row: row.rowNumber, column: "TEN_KHOA", category: "Danh mục đối chiếu", message: `Tên khai báo khác tên trong danh mục đã nạp: “${matchedName}”.`, suggestion: "Đối chiếu lại tên khoa/bàn khám và mã tương ứng trước khi gửi." });
    }
  });
  return issues;
}
