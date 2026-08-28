import { describe, expect, it } from "vitest";
import { COMMON_CATALOGS, QD3176_TABLES } from "./reference";
import { searchReferenceData, searchScopeOptions } from "./search";

/**
 * Phong cách Hồ sơ điều hành: kiểm thử bảo vệ tìm kiếm có phạm vi rõ và exact-match theo từ khóa.
 */
describe("searchReferenceData", () => {
  it("tìm xuyên toàn bộ mẫu TT12 bằng mã trường", () => {
    const results = searchReferenceData("MA_KHOA");
    expect(results.some((item) => item.kind === "field" && item.title.includes("MA_KHOA"))).toBe(true);
  });

  it("giới hạn kết quả đúng theo một mẫu", () => {
    const results = searchReferenceData("MA_", "template:MAU_01");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((item) => item.scope === "template:MAU_01")).toBe(true);
  });

  it("tìm được mã thật trong bảng mã riêng", () => {
    const record = COMMON_CATALOGS.maKhoa[0];
    const code = Object.values(record)[0];
    const results = searchReferenceData(code, "catalog:maKhoa");
    expect(results.some((item) => item.kind === "catalog")).toBe(true);
  });

  it("tìm được chỉ tiêu trong bảng QĐ riêng", () => {
    const table = QD3176_TABLES[0];
    const results = searchReferenceData("MA_LK", `qd:${table.id}`);
    expect(results.some((item) => item.kind === "qd" && item.targetId === table.id)).toBe(true);
  });

  it("cung cấp đủ lựa chọn toàn bộ, theo mẫu và theo bảng", () => {
    const scopes = searchScopeOptions();
    expect(scopes[0].value).toBe("all");
    expect(scopes.filter((item) => item.group === "template")).toHaveLength(8);
    expect(scopes.filter((item) => item.group === "table").length).toBeGreaterThanOrEqual(19);
  });
});
