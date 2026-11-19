import { describe, expect, it } from "vitest";
import { COMMON_CATALOGS, DOCUMENT_LIBRARY, QD3276_TABLES, QD3556_TABLES, QD3556_DOWNLOADABLE_FILES, QD3556_DIFF, HOI_DAP_BHYT_2026, documentUrl, sourceUrl } from "./reference";

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

  it("chứa tài liệu và sản phẩm đối chiếu QĐ 3556/QĐ-BYT", () => {
    const pdfDoc = DOCUMENT_LIBRARY.find((d) => d.id === "qd-3556-byt");
    const xlsDoc = DOCUMENT_LIBRARY.find((d) => d.id === "qd-3556-so-sanh");
    const pptxDoc = DOCUMENT_LIBRARY.find((d) => d.id === "qd-3556-slide");
    const infoDoc = DOCUMENT_LIBRARY.find((d) => d.id === "qd-3556-infographic");
    const rawXls = DOCUMENT_LIBRARY.find((d) => d.id === "qd-3556-excel-goc");

    expect(pdfDoc).toBeDefined();
    expect(xlsDoc).toBeDefined();
    expect(pptxDoc).toBeDefined();
    expect(infoDoc).toBeDefined();
    expect(rawXls).toBeDefined();
  });

  it("chứa cẩm nang 108 câu hỏi - đáp nghiệp vụ BHYT 2026 với link tải PDF", () => {
    const doc = DOCUMENT_LIBRARY.find((d) => d.id === "hoi-dap-giam-dinh-bhyt-2026");
    expect(doc).toBeDefined();
    expect(doc?.type).toBe("pdf");
    expect(doc?.url).toContain("hoi-dap-giam-dinh-bhyt-2026.pdf");
  });
});

describe("QD3556_TABLES", () => {
  it("chứa đủ 16 bảng chuẩn dữ liệu đầu ra KCB BHYT", () => {
    expect(QD3556_TABLES).toHaveLength(16);
    expect(QD3556_TABLES[0].id).toBe("bang-checkin");
    expect(QD3556_TABLES[1].id).toBe("bang-1");
    expect(QD3556_TABLES[15].id).toBe("bang-15");
  });

  it("thống kê chính xác 93 chỉ tiêu sửa đổi, bổ sung trên 15 bảng", () => {
    const totalChanges = QD3556_TABLES.reduce((sum, t) => sum + (t.changeCount ?? 0), 0);
    expect(totalChanges).toBe(93);

    const bang1 = QD3556_TABLES.find((t) => t.id === "bang-1");
    expect(bang1?.changeCount).toBe(20);

    const bang15 = QD3556_TABLES.find((t) => t.id === "bang-15");
    expect(bang15?.changeCount).toBe(0);
  });
});

describe("QD3556_DOWNLOADABLE_FILES", () => {
  it("chứa đủ 6 tệp tài liệu và sản phẩm đối chiếu có đường dẫn hợp lệ", () => {
    expect(QD3556_DOWNLOADABLE_FILES).toHaveLength(6);
    const ids = QD3556_DOWNLOADABLE_FILES.map((f) => f.id);
    expect(ids).toContain("so-sanh-excel");
    expect(ids).toContain("slide-pptx");
    expect(ids).toContain("infographic-html");
    expect(ids).toContain("qd3556-pdf");
    expect(ids).toContain("excel-goc");
    expect(ids).toContain("chuan-cu-excel");

    QD3556_DOWNLOADABLE_FILES.forEach((file) => {
      expect(file.filename).toBeTruthy();
      expect(file.path).toBeTruthy();
      expect(file.rawGithubUrl).toContain("https://raw.githubusercontent.com");
      expect(documentUrl(file.path)).toBeTruthy();
      expect(sourceUrl(file.path)).toBeTruthy();
    });
  });
});

describe("QD3556_DIFF", () => {
  it("chứa đầy đủ 484 bản ghi đối chiếu chuyên sâu", () => {
    expect(QD3556_DIFF.records).toHaveLength(484);
    expect(QD3556_DIFF.decision).toBe("3556/QĐ-BYT");
    expect(QD3556_DIFF.issued).toBe("18/11/2026");
    expect(QD3556_DIFF.sources).toHaveLength(3);
    expect(QD3556_DIFF.counts.new).toBe(3);
    expect(QD3556_DIFF.counts.null).toBe(8);
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


