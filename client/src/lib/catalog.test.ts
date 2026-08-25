import { describe, expect, it } from "vitest";
import { COMMON_CATALOGS } from "./reference";
import { validateCatalogIssues, type ImportedCatalog } from "./catalog";
import type { Inspection } from "./tt12";

function inspection(maKhoa: string, tenKhoa: string): Inspection {
  return {
    fileName: "kiem-thu.xlsx", fileSize: 1, sheetName: "DanhSach", headerRow: 1,
    headers: ["MA_KHOA", "TEN_KHOA"],
    rows: [{ rowNumber: 2, cells: { MA_KHOA: { value: maKhoa }, TEN_KHOA: { value: tenKhoa } } }],
    detection: null, candidates: [], issues: [], hasFormula: false,
  };
}

describe("validateCatalogIssues", () => {
  it("đối chiếu đúng mã khoa công khai và báo khi mã/tên không khớp", () => {
    const record = COMMON_CATALOGS.maKhoa[0];
    const code = record.maKhoa;
    const name = record.tenKhoa;
    const catalog: ImportedCatalog = {
      id: "public-ma-khoa", kind: "maKhoa", fileName: "ma-khoa.xlsx", sheetName: "DanhSach", count: 1,
      codeColumn: "MA_KHOA", nameColumn: "TEN_KHOA", entries: new Map([[code, name]]),
    };
    expect(validateCatalogIssues(inspection(code, name), [catalog])).toHaveLength(0);
    expect(validateCatalogIssues(inspection("ZZ999", name), [catalog]).some((item) => item.severity === "error")).toBe(true);
    expect(validateCatalogIssues(inspection(code, "Tên không khớp"), [catalog]).some((item) => item.severity === "warning")).toBe(true);
  });
});
