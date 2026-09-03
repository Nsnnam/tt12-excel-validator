import { describe, expect, it } from "vitest";
import { DOCUMENT_LIBRARY, QD3276_TABLES } from "./reference";

describe("DOCUMENT_LIBRARY", () => {
  it("có ID duy nhất để dùng ổn định làm khóa React", () => {
    expect(new Set(DOCUMENT_LIBRARY.map((document) => document.id)).size).toBe(DOCUMENT_LIBRARY.length);
  });

  it("chứa tài liệu QĐ 3276/QĐ-BYT với link tải PDF", () => {
    const doc = DOCUMENT_LIBRARY.find((d) => d.id === "qd-3276-byt");
    expect(doc).toBeDefined();
    expect(doc?.type).toBe("pdf");
    expect(doc?.url).toContain("BYT-3276");
  });
});

describe("QD3276_TABLES", () => {
  it("chứa 2 bảng phụ lục đúng cấu trúc QĐ 3276", () => {
    expect(QD3276_TABLES).toHaveLength(2);
    const pl1 = QD3276_TABLES.find((t) => t.id === "pl-01");
    const pl2 = QD3276_TABLES.find((t) => t.id === "pl-02");
    expect(pl1?.rows).toHaveLength(27);
    expect(pl2?.rows).toHaveLength(8);
  });
});

