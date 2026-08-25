/** Quy tắc cục bộ theo cơ sở KCB: cấu hình nằm trong localStorage, không gửi dữ liệu ra ngoài trình duyệt. */
import type { Inspection, ValidationIssue } from "./tt12";

export type FacilityRuleKind = "required" | "maxLength" | "noFormula";

export type FacilityRule = {
  id: string;
  facilityCode: string;
  column: string;
  kind: FacilityRuleKind;
  value?: number;
  note: string;
  enabled: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "tt12-validator.facility-rules.v1";

const text = (value: unknown) => String(value ?? "");
const hasValue = (value: unknown) => text(value).trim().length > 0;

export function loadFacilityRules(): FacilityRule[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value as FacilityRule[] : [];
  } catch {
    return [];
  }
}

export function persistFacilityRules(rules: FacilityRule[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
}

export function makeFacilityRule(input: Omit<FacilityRule, "id" | "updatedAt">): FacilityRule {
  return { ...input, id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
}

export function applyFacilityRules(inspection: Inspection, rules: FacilityRule[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  for (const row of inspection.rows) {
    const facility = text(row.cells.MA_CSKCB?.value).trim();
    for (const rule of rules) {
      if (!rule.enabled || (!facility || (rule.facilityCode !== "*" && rule.facilityCode !== facility))) continue;
      const cell = row.cells[rule.column];
      const prefix = `Quy tắc cơ sở ${rule.facilityCode}`;
      if (rule.kind === "required" && !hasValue(cell?.value) && !cell?.formula) {
        issues.push({ id: `facility-required-${rule.id}-${row.rowNumber}`, severity: "error", row: row.rowNumber, column: rule.column, category: "Quy tắc cơ sở", message: `${prefix}: trường phải có dữ liệu.`, suggestion: rule.note || "Bổ sung dữ liệu theo quy tắc riêng của cơ sở KCB." });
      }
      if (rule.kind === "maxLength" && rule.value && text(cell?.value).trim().length > rule.value) {
        issues.push({ id: `facility-length-${rule.id}-${row.rowNumber}`, severity: "warning", row: row.rowNumber, column: rule.column, category: "Quy tắc cơ sở", message: `${prefix}: giá trị vượt ${rule.value} ký tự.`, suggestion: rule.note || "Rút gọn giá trị theo quy tắc riêng của cơ sở KCB." });
      }
      if (rule.kind === "noFormula" && cell?.formula) {
        issues.push({ id: `facility-formula-${rule.id}-${row.rowNumber}`, severity: "warning", row: row.rowNumber, column: rule.column, category: "Quy tắc cơ sở", message: `${prefix}: không cho phép công thức trong cột này.`, suggestion: rule.note || "Dán giá trị tĩnh trước khi gửi dữ liệu." });
      }
    }
  }
  return issues;
}
