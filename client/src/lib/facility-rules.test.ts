import { describe, expect, it } from "vitest";
import { applyFacilityRules, type FacilityRule } from "./facility-rules";
import type { Inspection } from "./tt12";

describe("applyFacilityRules", () => {
  it("chỉ áp dụng quy tắc đúng mã cơ sở KCB và chỉ tiêu đã chọn", () => {
    const inspection = {
      fileName: "demo.xlsx",
      fileSize: 1,
      sheetName: "MAU_01",
      headerRow: 1,
      headers: ["MA_KHOA", "TEN_KHOA", "MA_CSKCB"],
      rows: [{ rowNumber: 2, cells: { MA_KHOA: { value: "K01", formula: "A1" }, TEN_KHOA: { value: "Tên khoa quá dài" }, MA_CSKCB: { value: "12345" } } }],
      detection: null,
      candidates: [],
      issues: [],
      hasFormula: true,
    } satisfies Inspection;
    const rules: FacilityRule[] = [
      { id: "1", facilityCode: "12345", column: "TEN_KHOA", kind: "maxLength", value: 5, note: "Ngắn hơn", enabled: true, updatedAt: "2026-08-25T00:00:00Z" },
      { id: "2", facilityCode: "12345", column: "MA_KHOA", kind: "noFormula", note: "Không công thức", enabled: true, updatedAt: "2026-08-25T00:00:00Z" },
      { id: "3", facilityCode: "99999", column: "TEN_KHOA", kind: "required", note: "Không áp dụng", enabled: true, updatedAt: "2026-08-25T00:00:00Z" },
    ];
    const issues = applyFacilityRules(inspection, rules);
    expect(issues).toHaveLength(2);
    expect(issues.every((item) => item.category === "Quy tắc cơ sở" && item.row === 2)).toBe(true);
  });
});
