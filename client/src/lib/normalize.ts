/**
 * Phong cách Hồ sơ điều hành: chỉ tự chuẩn hóa các lỗi văn bản an toàn; không tự suy đoán hoặc thay đổi nội dung nghiệp vụ.
 */
import * as XLSX from "xlsx";
import * as XLSXStyle from "xlsx-js-style";
import type { Inspection, Severity, ValidationIssue } from "./tt12";

export type NormalizationResult = { changedCells: number; outputName: string };
export type HighlightedExportResult = { markedCells: number; outputName: string };

const cleanText = (value: string) => value.replace(/\u00a0/g, " ").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

function timestamp() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((result, item) => ({ ...result, [item.type]: item.value }), {});
  return `${parts.hour}${parts.minute}${parts.second}_TT12_chuan_hoa_${parts.year}${parts.month}${parts.day}.xlsx`;
}

export async function downloadNormalizedWorkbook(file: File, inspection: Inspection): Promise<NormalizationResult> {
  const workbook = XLSX.read(await file.arrayBuffer(), { type: "array", cellFormula: true, raw: true });
  const sheet = workbook.Sheets[inspection.sheetName];
  if (!sheet) throw new Error("Không tìm thấy sheet đã kiểm định trong file gốc.");
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "A1:A1");
  const headers = new Map<string, number>();
  for (let column = range.s.c; column <= range.e.c; column += 1) {
    const cell = sheet[XLSX.utils.encode_cell({ r: inspection.headerRow - 1, c: column })];
    const header = String(cell?.v ?? "").replace(/\u00a0/g, " ").trim().replace(/\s+/g, " ").toUpperCase();
    if (header) headers.set(header, column);
  }
  let changedCells = 0;
  for (const row of inspection.rows) {
    headers.forEach((column) => {
      const address = XLSX.utils.encode_cell({ r: row.rowNumber - 1, c: column });
      const cell = sheet[address];
      if (!cell || cell.f || typeof cell.v !== "string") return;
      const cleaned = cleanText(cell.v);
      if (cleaned !== cell.v) {
        cell.v = cleaned;
        cell.w = cleaned;
        cell.t = "s";
        changedCells += 1;
      }
    });
  }
  const outputName = timestamp();
  XLSX.writeFile(workbook, outputName);
  return { changedCells, outputName };
}

const highlight = {
  error: { fill: "FCE4D6", font: "9C0006", border: "C00000" },
  warning: { fill: "FFF2CC", font: "7F6000", border: "BF9000" },
  info: { fill: "DDEBF7", font: "1F4E78", border: "5B9BD5" },
} satisfies Record<Severity, { fill: string; font: string; border: string }>;

const severityRank: Record<Severity, number> = { error: 3, warning: 2, info: 1 };

function exportTimestamp() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    .formatToParts(new Date())
    .reduce<Record<string, string>>((result, item) => ({ ...result, [item.type]: item.value }), {});
  return `${parts.year}${parts.month}${parts.day}_${parts.hour}${parts.minute}${parts.second}`;
}

function normalized(value: unknown) {
  return String(value ?? "").replace(/\u00a0/g, " ").trim().replace(/\s+/g, " ").toUpperCase();
}

function relatedToColumn(issue: ValidationIssue, column: string) {
  return issue.column.split("/").some((part) => normalized(part).includes(normalized(column)) || normalized(column).includes(normalized(part)));
}

function highestSeverity(issues: ValidationIssue[]) {
  return issues.reduce<Severity | null>((top, current) => !top || severityRank[current.severity] > severityRank[top] ? current.severity : top, null);
}

export async function downloadHighlightedWorkbook(file: File, inspection: Inspection, issues: ValidationIssue[]): Promise<HighlightedExportResult> {
  const workbook = XLSXStyle.read(await file.arrayBuffer(), { type: "array", cellFormula: true, raw: true });
  const sheet = workbook.Sheets[inspection.sheetName];
  if (!sheet) throw new Error("Không tìm thấy sheet đã kiểm định trong file gốc.");

  const range = XLSXStyle.utils.decode_range(sheet["!ref"] ?? "A1:A1");
  const columns = new Map<string, number>();
  for (let column = range.s.c; column <= range.e.c; column += 1) {
    const header = sheet[XLSXStyle.utils.encode_cell({ r: inspection.headerRow - 1, c: column })];
    const name = normalized(header?.v);
    if (name) columns.set(name, column);
  }

  let markedCells = 0;
  for (const row of inspection.rows) {
    Array.from(columns.entries()).forEach(([header, column]) => {
      const matching = issues.filter((item) => item.row === row.rowNumber && relatedToColumn(item, header));
      const severity = highestSeverity(matching);
      if (!severity) return;
      const address = XLSXStyle.utils.encode_cell({ r: row.rowNumber - 1, c: column });
      const cell = sheet[address] ?? { t: "s", v: "" };
      const color = highlight[severity];
      cell.s = {
        ...(cell.s ?? {}),
        fill: { patternType: "solid", fgColor: { rgb: color.fill } },
        font: { ...(cell.s?.font ?? {}), color: { rgb: color.font }, bold: severity === "error" },
        border: {
          top: { style: "thin", color: { rgb: color.border } },
          bottom: { style: "thin", color: { rgb: color.border } },
          left: { style: "thin", color: { rgb: color.border } },
          right: { style: "thin", color: { rgb: color.border } },
        },
      };
      cell.c = [{ a: "TT12 Validator", t: matching.map((item) => `[${item.category}] ${item.message}\nGợi ý: ${item.suggestion}`).join("\n\n") }];
      sheet[address] = cell;
      markedCells += 1;
    });
  }

  const rows = [["DANH SÁCH LỖI TT12", "", "", "", ""], ["Mức độ", "Dòng", "Cột", "Nhóm", "Phát hiện / Gợi ý"], ...issues.map((item) => [item.severity === "error" ? "Lỗi" : item.severity === "warning" ? "Cảnh báo" : "Thông tin", item.row ?? "Cấu trúc", item.column, item.category, `${item.message}\n${item.suggestion}`])];
  const reportSheet = XLSXStyle.utils.aoa_to_sheet(rows);
  reportSheet["!cols"] = [{ wch: 14 }, { wch: 10 }, { wch: 28 }, { wch: 22 }, { wch: 88 }];
  reportSheet["A1"].s = { fill: { patternType: "solid", fgColor: { rgb: "073763" } }, font: { color: { rgb: "FFFFFF" }, bold: true, sz: 13 } };
  ["A2", "B2", "C2", "D2", "E2"].forEach((address) => { reportSheet[address].s = { fill: { patternType: "solid", fgColor: { rgb: "D9EAF7" } }, font: { bold: true, color: { rgb: "073763" } } }; });
  for (let row = 3; row <= rows.length; row += 1) reportSheet[`E${row}`].s = { alignment: { wrapText: true, vertical: "top" } };
  XLSXStyle.utils.book_append_sheet(workbook, reportSheet, "Danh_sach_loi");

  const outputName = `TT12_excel_to_mau_loi_${exportTimestamp()}.xlsx`;
  XLSXStyle.writeFile(workbook, outputName);
  return { markedCells, outputName };
}
