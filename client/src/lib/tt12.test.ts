import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { TEMPLATES, detectTemplate, inspectExcelFile, type DataRow, validateTable } from "./tt12";

describe("validateTable", () => {
  it("phát hiện lỗi thời gian, công thức và tổng giường vượt mức", () => {
    const row: DataRow = {
      rowNumber: 2,
      cells: {
        STT: { value: 1 }, MA_KHOA: { value: "K02" }, TEN_KHOA: { value: "Hồi sức" }, BAN_KHAM: { value: 1 },
        GIUONG_PD: { value: 5 }, GIUONG_TK: { value: 4 }, GIUONG_HSTC: { value: 3 }, GIUONG_HSCC: { value: 2 },
        TU_NGAY: { value: "20260102" }, DEN_NGAY: { value: "20260101" }, MA_CSKCB: { value: "12345", formula: "CONCAT(123,45)" },
      },
    };
    const issues = validateTable(TEMPLATES[0], TEMPLATES[0].headers, [row]);
    expect(issues.some((item) => item.category === "Logic thời gian")).toBe(true);
    expect(issues.some((item) => item.category === "Logic số liệu")).toBe(true);
    expect(issues.some((item) => item.category === "Công thức")).toBe(true);
  });
  it("ghi nhận sai khác hàng tiêu đề là lỗi cấu trúc, không gán vào dòng dữ liệu 1", () => {
    const issues = validateTable(TEMPLATES[0], ["STT", "MA_KHOA", "TEN_KHOA"], []);
    const structural = issues.filter((item) => item.category === "Cấu trúc");
    expect(structural.length).toBeGreaterThan(0);
    expect(structural.every((item) => item.row === null)).toBe(true);
  });
  it("gắn cảnh báo văn bản, tiền tệ, ngày và độ dài theo schema của từng cột", () => {
    const row: DataRow = {
      rowNumber: 2,
      cells: {
        STT: { value: 1 },
        MA_THUOC: { value: "  T  01\n" },
        TEN_THUOC: { value: "Thuốc mẫu" },
        DON_VI_TINH: { value: "Viên" },
        DON_GIA: { value: "1,200,000", formula: "A1*2" },
        TU_NGAY: { value: "20261340" },
        MA_CSKCB: { value: "123456" },
      },
    };
    const issues = validateTable(TEMPLATES[2], TEMPLATES[2].headers, [row]);
    expect(issues.some((item) => item.column === "MA_THUOC" && item.category === "Văn bản")).toBe(true);
    expect(issues.some((item) => item.column === "DON_GIA" && item.category === "Công thức")).toBe(true);
    expect(issues.some((item) => item.column === "DON_GIA" && item.category === "Tiền tệ")).toBe(true);
    expect(issues.some((item) => item.column === "TU_NGAY" && item.category === "Ngày tháng")).toBe(true);
    expect(issues.some((item) => item.column === "MA_CSKCB" && item.category === "Độ dài")).toBe(true);
  });
  it("kiểm tra các quy tắc liên cột chuyên sâu của từng mẫu", () => {
    const mau01 = validateTable(TEMPLATES[0], TEMPLATES[0].headers, [{ rowNumber: 2, cells: { STT: { value: 1 }, MA_KHOA: { value: "K01" }, TEN_KHOA: { value: "Nội" }, GIUONG_PD: { value: 100 }, GIUONG_TK: { value: 131 }, TU_NGAY: { value: "20260101" }, MA_CSKCB: { value: "12345" } } }]);
    const mau02 = validateTable(TEMPLATES[1], TEMPLATES[1].headers, [{ rowNumber: 2, cells: { MA_KHOA: { value: "K01" }, HO_TEN: { value: "A" }, SO_DINH_DANH: { value: "123456789012" }, THOIGIAN_NGAY: { value: 8 }, THOIGIAN_TUAN: { value: 7 }, TU_NGAY: { value: "20260101" }, MA_CSKCB: { value: "12345" } } }]);
    const mau04 = validateTable(TEMPLATES[3], TEMPLATES[3].headers, [{ rowNumber: 2, cells: { MA_VAT_TU: { value: "VT1" }, TEN_VAT_TU: { value: "Vật tư" }, DON_VI_TINH: { value: "Cái" }, DON_GIA: { value: 100 }, DON_GIA_BH: { value: 120 }, TU_NGAY: { value: "20260101" }, MA_CSKCB: { value: "12345" } } }]);
    const mau05 = validateTable(TEMPLATES[4], TEMPLATES[4].headers, [{ rowNumber: 2, cells: { MA_DICH_VU: { value: "DV1" }, TEN_DICH_VU: { value: "Dịch vụ" }, DON_GIA: { value: 100 }, SO_LUONG_CGKT: { value: 0 }, TU_NGAY: { value: "20260101" }, MA_CSKCB: { value: "12345" } } }]);
    const mau06 = validateTable(TEMPLATES[5], TEMPLATES[5].headers, [{ rowNumber: 2, cells: { TEN_TB: { value: "Máy" }, HD_TU: { value: "20260110" }, TU_NGAY: { value: "20260101" }, MA_CSKCB: { value: "12345" } } }]);
    expect(mau01.some((item) => item.category === "Logic giường bệnh")).toBe(true);
    expect(mau02.some((item) => item.category === "Logic thời gian" && item.message.includes("tuần nhỏ hơn"))).toBe(true);
    expect(mau04.some((item) => item.category === "Logic tiền tệ")).toBe(true);
    expect(mau05.some((item) => item.category === "Logic dịch vụ")).toBe(true);
    expect(mau06.some((item) => item.category === "Logic hiệu lực")).toBe(true);
  });
  it("dùng cột có cờ Trùng từ nguồn để phát hiện bản ghi lặp", () => {
    const rows: DataRow[] = [
      { rowNumber: 2, cells: { STT: { value: 1 }, MA_KHOA: { value: "K01" }, TEN_KHOA: { value: "Nội" }, TU_NGAY: { value: "20260101" }, MA_CSKCB: { value: "12345" } } },
      { rowNumber: 3, cells: { STT: { value: 2 }, MA_KHOA: { value: "K01" }, TEN_KHOA: { value: "Nội" }, TU_NGAY: { value: "20260201" }, MA_CSKCB: { value: "12345" } } },
    ];
    const issues = validateTable(TEMPLATES[0], TEMPLATES[0].headers, rows);
    expect(issues.some((item) => item.category === "Trùng dữ liệu" && item.row === 3)).toBe(true);
  });
});

describe("detectTemplate", () => {
  it("nhận diện chính xác sáu chữ ký cột TT12", () => {
    TEMPLATES.forEach((template) => {
      const detection = detectTemplate(template.headers)[0];
      expect(detection.template.id).toBe(template.id);
      expect(detection.score).toBe(100);
    });
  });
});

describe("inspectExcelFile", () => {
  it("đọc và nhận diện Mẫu 01/DM từ file mẫu công khai", async () => {
    const bytes = readFileSync("/home/ubuntu/reference-tt12/MAU_01_Template.xlsx");
    const file = new File([bytes], "MAU_01_Template.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const inspection = await inspectExcelFile(file);
    expect(inspection.detection?.template.id).toBe("MAU_01");
    expect(inspection.detection?.score).toBe(100);
    expect(inspection.headers).toContain("MA_KHOA");
  });
});
