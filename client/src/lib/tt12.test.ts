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
