import { describe, expect, it } from "vitest";
import { COMMON_CATALOGS, DOCUMENT_LIBRARY, QD3276_TABLES, HOI_DAP_BHYT_2026 } from "./reference";

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

  it("chứa tài liệu QĐ 2917/QĐ-BYT (sửa đổi QĐ 3276) với link tải PDF", () => {
    const doc = DOCUMENT_LIBRARY.find((d) => d.id === "qd-2917-byt");
    expect(doc).toBeDefined();
    expect(doc?.type).toBe("pdf");
    expect(doc?.url).toContain("BYT-2917");
  });

  it("chứa cẩm nang 108 câu hỏi - đáp nghiệp vụ BHYT 2026 với link tải PDF", () => {
    const doc = DOCUMENT_LIBRARY.find((d) => d.id === "hoi-dap-giam-dinh-bhyt-2026");
    expect(doc).toBeDefined();
    expect(doc?.type).toBe("pdf");
    expect(doc?.url).toContain("hoi-dap-giam-dinh-bhyt-2026.pdf");
  });
});

describe("HOI_DAP_BHYT_2026", () => {
  it("chứa đầy đủ thông tin xuất bản và 6 chuyên đề", () => {
    expect(HOI_DAP_BHYT_2026.publisher).toBe("Bảo hiểm xã hội Việt Nam");
    expect(HOI_DAP_BHYT_2026.pageCount).toBe(86);
    expect(HOI_DAP_BHYT_2026.sections).toHaveLength(6);
  });

  it("chứa đúng 108 câu hỏi có nội dung và trang đối chiếu", () => {
    expect(HOI_DAP_BHYT_2026.questions).toHaveLength(108);
    const q1 = HOI_DAP_BHYT_2026.questions[0];
    expect(q1.id).toBe(1);
    expect(q1.section).toBe("cong-tiep-nhan");
    expect(q1.question).toContain("ký số");
    expect(q1.page).toBe(12);

    const q108 = HOI_DAP_BHYT_2026.questions[107];
    expect(q108.id).toBe(108);
    expect(q108.section).toBe("quyet-toan");
    expect(q108.question).toContain("Biên bản quyết toán");
    expect(q108.page).toBe(82);
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

describe("COMMON_CATALOGS.maDoiTuong", () => {
  it("được cập nhật theo Phụ lục 1 QĐ 3276/QĐ-BYT thay cho QĐ 2010", () => {
    expect(COMMON_CATALOGS.maDoiTuong).toHaveLength(27);
    const row33 = COMMON_CATALOGS.maDoiTuong.find((r) => r.ma === "3.3");
    expect(row33).toBeDefined();
    expect(row33?.ghiChu).toBe("Bổ sung");
  });

  it("mã 3.1 đã được cập nhật nội dung bổ sung theo QĐ 2917/QĐ-BYT", () => {
    const row31 = COMMON_CATALOGS.maDoiTuong.find((r) => r.ma === "3.1");
    expect(row31).toBeDefined();
    expect(row31?.truongHop).toContain("sau ngày 01/01/2025");
    expect(row31?.ghiChu).toContain("2917/QĐ-BYT");
  });
});


