/**
 * Phong cách Hồ sơ điều hành: chỉ tự chuẩn hóa các lỗi văn bản an toàn; không tự suy đoán hoặc thay đổi nội dung nghiệp vụ.
 */
import * as XLSX from "xlsx";
import type { Inspection } from "./tt12";

export type NormalizationResult = { changedCells: number; outputName: string };

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
