/**
 * Phong cách Hồ sơ điều hành: kết quả tìm kiếm là các dòng hồ sơ có nguồn,
 * định danh và đích đến rõ ràng; không dùng fuzzy match để tránh lệch nghiệp vụ.
 */
import { COMMON_CATALOGS, DOCUMENT_LIBRARY, QD3176_TABLES, type CommonCode } from "./reference";
import { TEMPLATES, fieldsForTemplate } from "./tt12";

export type SearchScope = "all" | `template:${string}` | `catalog:${string}` | `qd:${string}`;
export type SearchResultKind = "field" | "catalog" | "qd" | "document";

export type SearchScopeOption = {
  value: SearchScope;
  label: string;
  group: "all" | "template" | "table";
};

export type SearchResult = {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  snippet: string;
  focus: string;
  scope: SearchScope;
  targetId?: string;
  url?: string;
};

const catalogLabels: Record<string, string> = {
  maLoaiHinh: "Mã loại hình KCB",
  maKhamBenh: "Mã khám bệnh",
  maDoiTuong: "Mã đối tượng KCB",
  maKhoa: "Mã khoa",
};

function unaccent(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi-VN");
}

function compact(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function matches(value: string, query: string) {
  const source = unaccent(value);
  return query.trim().split(/\s+/).filter(Boolean).every((term) => source.includes(unaccent(term)));
}

function excerpt(value: string, limit = 180) {
  return value.length > limit ? `${value.slice(0, limit - 1).trimEnd()}…` : value;
}

function catalogScope(id: string): SearchScope {
  return `catalog:${id}`;
}

function templateScope(id: string): SearchScope {
  return `template:${id}`;
}

function qdScope(id: string): SearchScope {
  return `qd:${id}`;
}

export function searchScopeOptions(): SearchScopeOption[] {
  return [
    { value: "all", label: "Toàn bộ dữ liệu TT12", group: "all" },
    ...TEMPLATES.map((template) => ({ value: templateScope(template.id), label: template.label, group: "template" as const })),
    ...Object.keys(COMMON_CATALOGS).map((id) => ({ value: catalogScope(id), label: catalogLabels[id] ?? id, group: "table" as const })),
    ...QD3176_TABLES.map((table) => ({ value: qdScope(table.id), label: `QĐ 3176 · ${compact(table.title).split("(")[0].trim()}`, group: "table" as const })),
  ];
}

export function searchReferenceData(query: string, scope: SearchScope = "all", limit = 80): SearchResult[] {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];
  const results: SearchResult[] = [];
  const wants = (candidate: SearchScope) => scope === "all" || scope === candidate;

  for (const template of TEMPLATES) {
    const currentScope = templateScope(template.id);
    if (!wants(currentScope)) continue;
    for (const field of fieldsForTemplate(template)) {
      const searchableText = [template.id, template.label, field.name, field.format, field.size, field.note, field.additionalNote, field.requirementText].join(" ");
      if (!matches(searchableText, normalizedQuery)) continue;
      results.push({
        id: `${currentScope}:${field.name}`,
        kind: "field",
        title: `${field.name} · ${template.label}`,
        subtitle: `${template.id.endsWith("_BH") ? "Mẫu BHYT" : "Mẫu danh mục TT12"} · Định dạng ${field.format} · Kích thước ${field.size}`,
        snippet: excerpt([field.note, field.additionalNote].filter(Boolean).join(" ") || "Không có diễn giải bổ sung."),
        focus: field.name,
        scope: currentScope,
        targetId: template.id,
      });
      if (results.length >= limit) return results;
    }
  }

  for (const [id, rows] of Object.entries(COMMON_CATALOGS)) {
    const currentScope = catalogScope(id);
    if (!wants(currentScope)) continue;
    rows.forEach((row: CommonCode, index: number) => {
      if (results.length >= limit) return;
      const values = Object.values(row).map(compact).filter(Boolean);
      const searchableText = [catalogLabels[id], ...values].join(" ");
      if (!matches(searchableText, normalizedQuery)) return;
      results.push({
        id: `${currentScope}:${index}:${values.join("|")}`,
        kind: "catalog",
        title: `${values[0] ?? "Mã"} · ${catalogLabels[id] ?? id}`,
        subtitle: "Danh mục mã dùng chung",
        snippet: excerpt(values.join(" · ")),
        focus: values[0] ?? values[1] ?? normalizedQuery,
        scope: currentScope,
        targetId: id,
      });
    });
    if (results.length >= limit) return results;
  }

  for (const table of QD3176_TABLES) {
    const currentScope = qdScope(table.id);
    if (!wants(currentScope)) continue;
    const tableName = `${table.id} ${compact(table.title)}`;
    if (matches(tableName, normalizedQuery)) {
      results.push({
        id: `${currentScope}:table`,
        kind: "qd",
        title: compact(table.title).split("(")[0].trim(),
        subtitle: `QĐ 3176 · ${table.rows.length} dòng dữ liệu`,
        snippet: "Mở bảng riêng để tiếp tục tra cứu theo mã chỉ tiêu và diễn giải.",
        focus: "",
        scope: currentScope,
        targetId: table.id,
      });
      if (results.length >= limit) return results;
    }
    table.rows.forEach((row, index) => {
      if (results.length >= limit) return;
      const values = row.map(compact);
      if (!matches(values.join(" "), normalizedQuery)) return;
      results.push({
        id: `${currentScope}:${index}`,
        kind: "qd",
        title: `${values[1] || values[0] || `Dòng ${index + 1}`} · ${table.id.replace("bang-", "Bảng ")}`,
        subtitle: `QĐ 3176 · ${excerpt(compact(table.title), 100)}`,
        snippet: excerpt(values.filter(Boolean).join(" · ")),
        focus: values.find((value) => matches(value, normalizedQuery)) || values[1] || normalizedQuery,
        scope: currentScope,
        targetId: table.id,
      });
    });
    if (results.length >= limit) return results;
  }

  if (scope === "all") {
    for (const document of DOCUMENT_LIBRARY) {
      const searchableText = `${document.name} ${document.type} ${document.url}`;
      if (!matches(searchableText, normalizedQuery)) continue;
      results.push({
        id: `document:${document.id}`,
        kind: "document",
        title: document.name,
        subtitle: `Tài liệu tham chiếu · ${document.type.toUpperCase()}`,
        snippet: "Mở nguồn tài liệu đang được ứng dụng sử dụng.",
        focus: document.name,
        scope: "all",
        url: document.url,
      });
      if (results.length >= limit) return results;
    }
  }

  return results;
}
