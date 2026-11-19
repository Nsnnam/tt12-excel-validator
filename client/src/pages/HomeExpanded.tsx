/**
 * Phong cách Hồ sơ điều hành: bảng tra cứu rõ ràng, filter kiểm định theo ngữ cảnh,
 * và hành động xuất file luôn nhìn thấy tại bàn làm việc dữ liệu.
 */
import { useMemo, useRef, useState, type ReactNode } from "react";
import "../inspection.css";
import "../expanded.css";
import { toast } from "sonner";
import { AlertTriangle, BookOpen, CheckCircle2, CheckSquare, ChevronDown, ChevronRight, Download, ExternalLink, Eye, FileCheck2, FileSpreadsheet, FileText, Filter, FolderDown, FolderSearch, HelpCircle, Info, Layers, Search, ShieldCheck, Sparkles, Square, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReleaseLedger } from "@/components/ReleaseLedger";
import { APP_META, BRAND_ASSETS } from "@/lib/meta";
import { TEMPLATES, exportReport, fieldsForTemplate, inspectExcelFile, issueCounts, sourceTemplateUrl, type Inspection, type Severity, type TemplateSchema, type ValidationIssue } from "@/lib/tt12";
import { COMMON_CATALOGS, DOCUMENT_LIBRARY, QD3176_TABLES, QD3556_TABLES, QD3556_DOWNLOADABLE_FILES, QD3556_DIFF, QD5937_TABLES, QD3276_TABLES, HOI_DAP_BHYT_2026, sourceUrl, documentUrl, type HoiDapQuestion, type QD3556DiffRecord, type QD3556Status } from "@/lib/reference";
import { importCatalogFile, validateCatalogIssues, type ImportedCatalog } from "@/lib/catalog";
import { downloadHighlightedWorkbook, downloadNormalizedWorkbook } from "@/lib/normalize";
import { applyFacilityRules, loadFacilityRules, makeFacilityRule, persistFacilityRules, type FacilityRule, type FacilityRuleKind } from "@/lib/facility-rules";
import { searchReferenceData, searchScopeOptions, type SearchResult, type SearchScope } from "@/lib/search";

type View = "lookup" | "validate" | "catalog" | "qd" | "qd3556" | "qd5937" | "qd3276" | "hoiDap" | "guide" | "rules";
type CatalogId = keyof typeof COMMON_CATALOGS;
type IssueFilter = Severity | "all";

const catalogLabels: Record<CatalogId, string> = { maLoaiHinh: "Mã loại hình KCB", maKhamBenh: "Mã khám bệnh", maDoiTuong: "Mã đối tượng KCB (QĐ 3276 & 2917)", maKhoa: "Mã khoa" };
const severityClass: Record<Severity, string> = { error: "error", warning: "warning", info: "info" };
const severityLabel: Record<Severity, string> = { error: "Lỗi chặn", warning: "Cần đối chiếu", info: "Thông tin" };
const formatBytes = (bytes: number) => `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(bytes / 1024)} KB`;
const searchable = (value: unknown, query: string) => String(value ?? "").toLocaleLowerCase("vi-VN").includes(query.toLocaleLowerCase("vi-VN"));

function SideButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return <button className={`nav-button ${active ? "nav-button-active" : ""}`} onClick={onClick}><ChevronRight size={15} /><span>{children}</span></button>;
}

function issueMatchesColumn(issue: ValidationIssue, column: string) {
  const current = column.trim().toUpperCase();
  return issue.column.split("/").some((part) => {
    const item = part.trim().toUpperCase();
    return item.includes(current) || current.includes(item);
  });
}

function topIssue(issues: ValidationIssue[]) {
  return issues.find((item) => item.severity === "error") ?? issues.find((item) => item.severity === "warning") ?? issues[0];
}

export default function HomeExpanded() {
  const [view, setView] = useState<View>("lookup");
  const [template, setTemplate] = useState<TemplateSchema>(TEMPLATES[0]);
  const [query, setQuery] = useState("");
  const [globalQuery, setGlobalQuery] = useState("");
  const [globalScope, setGlobalScope] = useState<SearchScope>("all");
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [catalogs, setCatalogs] = useState<ImportedCatalog[]>([]);
  const [catalogId, setCatalogId] = useState<CatalogId>("maLoaiHinh");
  const [qdId, setQdId] = useState(QD3176_TABLES[0]?.id ?? "bang-1");
  const [qd3556Id, setQd3556Id] = useState(QD3556_TABLES[0]?.id ?? "bang-checkin");
  const [onlyAmended3556, setOnlyAmended3556] = useState(false);
  const [qd3556Mode, setQd3556Mode] = useState<"diff" | "table">("diff");
  const [diffTableFilter, setDiffTableFilter] = useState<string>("all");
  const [diffStatusFilter, setDiffStatusFilter] = useState<string>("changed");
  const [selectedDiffRecord, setSelectedDiffRecord] = useState<QD3556DiffRecord | null>(null);
  const [selected3556Files, setSelected3556Files] = useState<Set<string>>(
    () => new Set(QD3556_DOWNLOADABLE_FILES.map((f) => f.id))
  );
  const [qd5937Id, setQd5937Id] = useState(QD5937_TABLES[0]?.id ?? "pl-01");
  const [qd3276Id, setQd3276Id] = useState(QD3276_TABLES[0]?.id ?? "pl-01");
  const [hoiDapSection, setHoiDapSection] = useState<string>("all");
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<number>>(new Set([1]));
  const [hoiDapPage, setHoiDapPage] = useState<number>(1);
  const HOI_DAP_PAGE_SIZE = 15;
  const [filter, setFilter] = useState<IssueFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [columnFilter, setColumnFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [normalizing, setNormalizing] = useState(false);
  const [highlighting, setHighlighting] = useState(false);
  const [facilityRules, setFacilityRules] = useState<FacilityRule[]>(() => loadFacilityRules());
  const [ruleDraft, setRuleDraft] = useState<{ facilityCode: string; column: string; kind: FacilityRuleKind; value: string; note: string }>({ facilityCode: "", column: "", kind: "required", value: "", note: "" });
  const excelInput = useRef<HTMLInputElement>(null);
  const catalogInput = useRef<HTMLInputElement>(null);

  const catalogIssues = useMemo(() => inspection ? validateCatalogIssues(inspection, catalogs) : [], [inspection, catalogs]);
  const facilityIssues = useMemo(() => inspection ? applyFacilityRules(inspection, facilityRules) : [], [inspection, facilityRules]);
  const allIssues = useMemo(() => inspection ? [...inspection.issues, ...catalogIssues, ...facilityIssues] : [], [inspection, catalogIssues, facilityIssues]);
  const counts = issueCounts(allIssues);
  const categories = useMemo(() => Array.from(new Set(allIssues.map((item) => item.category))).sort((a, b) => a.localeCompare(b, "vi")), [allIssues]);
  const visibleIssues = useMemo(() => allIssues.filter((item) => (filter === "all" || item.severity === filter) && (categoryFilter === "all" || item.category === categoryFilter) && (columnFilter === "all" || issueMatchesColumn(item, columnFilter))), [allIssues, filter, categoryFilter, columnFilter]);
  const fields = useMemo(() => fieldsForTemplate(template).filter((field) => searchable(`${field.name} ${field.note} ${field.additionalNote}`, query)), [template, query]);
  const globalSearchResults = useMemo(() => searchReferenceData(globalQuery, globalScope), [globalQuery, globalScope]);
  const globalSearchScopes = useMemo(() => searchScopeOptions(), []);
  const sourceFields = fields;
  const codeRows = COMMON_CATALOGS[catalogId].filter((row) => Object.values(row).some((value) => searchable(value, query)));
  const codeHeaders = Object.keys(codeRows[0] ?? COMMON_CATALOGS[catalogId][0] ?? {});
  const qd = QD3176_TABLES.find((item) => item.id === qdId) ?? QD3176_TABLES[0];
  const qdRows = useMemo(() => qd?.rows.filter((row) => row.some((cell) => searchable(cell, query))) ?? [], [qd, query]);
  const qd3556 = QD3556_TABLES.find((item) => item.id === qd3556Id) ?? QD3556_TABLES[0];
  const qd3556ChangeColIdx = qd3556?.headers.findIndex((h) => h.includes("3556")) ?? -1;
  const qd3556Rows = useMemo(() => {
    if (!qd3556) return [];
    return qd3556.rows.filter((row) => {
      if (onlyAmended3556 && qd3556ChangeColIdx !== -1) {
        const amendedVal = row[qd3556ChangeColIdx]?.trim();
        if (!amendedVal) return false;
      }
      if (!query.trim()) return true;
      return row.some((cell) => searchable(cell, query));
    });
  }, [qd3556, qd3556ChangeColIdx, onlyAmended3556, query]);

  const diffTableTitles = useMemo(() => {
    const map: Record<string, string> = { all: "Tất cả các bảng" };
    for (const t of QD3556_DIFF.tables) {
      map[t.id] = t.title;
    }
    return map;
  }, []);

  const diffRecords = useMemo(() => {
    let list = QD3556_DIFF.records;
    if (diffTableFilter !== "all") {
      list = list.filter((r) => r.tableId === diffTableFilter);
    }
    const q = query.trim().toLowerCase();
    return list.filter((r) => {
      let matchesStatus = true;
      if (diffStatusFilter === "all") matchesStatus = true;
      else if (diffStatusFilter === "amended") matchesStatus = ["modified", "supplemented"].includes(r.status);
      else if (diffStatusFilter === "changed") matchesStatus = !["unchanged", "historical"].includes(r.status);
      else if (diffStatusFilter === "repeal") matchesStatus = Boolean(r.repeal && r.repeal.length > 0);
      else if (diffStatusFilter === "review") matchesStatus = r.needsReview;
      else matchesStatus = r.status === diffStatusFilter;

      if (!matchesStatus) return false;
      if (!q) return true;

      const searchableText = [
        r.field,
        r.tableId,
        diffTableTitles[r.tableId] || "",
        r.summary,
        ...(r.notes || []),
        ...(r.repeal || []),
        r.before?.name ?? "",
        r.after?.name ?? "",
        ...(r.before?.history?.map((h) => h.text) ?? []),
        r.after?.amendment ?? "",
      ].join(" ").toLowerCase();

      return searchableText.includes(q);
    });
  }, [diffTableFilter, diffStatusFilter, query, diffTableTitles]);

  const formatDiffSummary = (r: QD3556DiffRecord) => {
    if (/^Tăng kích thước/.test(r.summary) || r.status === "review") {
      return r.metadataChanges?.map((m) => `${m.label}: ${m.before} → ${m.after}`).join("; ") || r.summary;
    }
    if (r.tableId === "bang-2" || r.tableId === "bang-3") {
      if (r.field === "MUC_HUONG") return "Thay cách xác định mức hưởng; bãi bỏ diễn giải QĐ 130. Cần đối chiếu cách biểu diễn tỷ lệ trong nguồn.";
      if (r.field === "T_BNTT") return "Công thức mới: T_BNTT = THANH_TIEN_BV − T_BHTT − T_BNCCT; bãi bỏ diễn giải QĐ 3176.";
      if (r.field === "T_BNCCT") return "Công thức mới: T_BNCCT = THANH_TIEN_BH × MUC_HUONG_BH/100 − T_BHTT; bãi bỏ diễn giải QĐ 3176.";
    }
    return r.summary;
  };
  const qd5937 = QD5937_TABLES.find((item) => item.id === qd5937Id) ?? QD5937_TABLES[0];
  const qd5937Rows = useMemo(() => qd5937?.rows.filter((row) => row.some((cell) => searchable(cell, query))) ?? [], [qd5937, query]);
  const qd3276 = QD3276_TABLES.find((item) => item.id === qd3276Id) ?? QD3276_TABLES[0];
  const qd3276Rows = useMemo(() => qd3276?.rows.filter((row) => row.some((cell) => searchable(cell, query))) ?? [], [qd3276, query]);
  const filteredHoiDapQuestions = useMemo(() => {
    return HOI_DAP_BHYT_2026.questions.filter((q) => {
      const inSection = hoiDapSection === "all" || q.section === hoiDapSection;
      if (!inSection) return false;
      if (!query.trim()) return true;
      const qAliases = [`câu ${q.id}`, `cau ${q.id}`, `q${q.id}`, `${q.id}`];
      const searchSource = [`Câu ${q.id}`, ...qAliases, q.question, ...q.answer, `trang ${q.page}`].join(" ");
      return searchable(searchSource, query);
    });
  }, [hoiDapSection, query]);
  const totalHoiDapPages = Math.max(1, Math.ceil(filteredHoiDapQuestions.length / HOI_DAP_PAGE_SIZE));
  const currentPageHoiDapQuestions = useMemo(() => {
    const start = (hoiDapPage - 1) * HOI_DAP_PAGE_SIZE;
    return filteredHoiDapQuestions.slice(start, start + HOI_DAP_PAGE_SIZE);
  }, [filteredHoiDapQuestions, hoiDapPage]);
  const ruleColumns = inspection?.headers.length ? inspection.headers : template.headers;
  const dmTemplates = TEMPLATES.filter((item) => !item.id.endsWith("_BH"));
  const bhTemplates = TEMPLATES.filter((item) => item.id.endsWith("_BH"));
  const schemaSource = template.id === "MAU_01_BH" ? "CHITIET_HS01BH · TR. 60–63" : template.id.endsWith("_BH") ? "HƯỚNG DẪN FILE MẪU" : "VALIDATE CHI TIẾT ƯU TIÊN";
  const contextLine = view === "lookup"
    ? `${template.label} đang được tra cứu theo ${schemaSource.toLocaleLowerCase("vi-VN")}. Tải file mẫu hoặc chuyển sang kiểm định Excel.`
    : inspection ? `Đang rà soát ${inspection.fileName}; dùng bộ lọc để khoanh vùng phát hiện theo dòng và chỉ tiêu.` : "Chưa có hồ sơ Excel trong phiên này. Nạp file để nhận diện mẫu và kiểm định tại từng ô.";

  const openSearchResult = (result: SearchResult) => {
    setGlobalQuery("");
    if (result.kind === "field" && result.targetId) {
      const nextTemplate = TEMPLATES.find((item) => item.id === result.targetId);
      if (nextTemplate) { setTemplate(nextTemplate); setView("lookup"); setQuery(result.focus); }
    } else if (result.kind === "catalog" && result.targetId) {
      if (result.targetId === "maDoiTuong") {
        setQd3276Id("pl-01"); setView("qd3276"); setQuery(result.focus);
      } else {
        setCatalogId(result.targetId as CatalogId); setView("catalog"); setQuery(result.focus);
      }
    } else if (result.kind === "qd" && result.targetId) {
      setQdId(result.targetId); setView("qd"); setQuery(result.focus);
    } else if (result.kind === "qd3556" && result.targetId) {
      setQd3556Id(result.targetId); setView("qd3556"); setQuery(result.focus);
      const normTableId = result.targetId === "bang-checkin" ? "check-in" : result.targetId;
      const rec = QD3556_DIFF.records.find((r) => r.tableId === normTableId && r.field === result.focus);
      if (rec) {
        setSelectedDiffRecord(rec);
        setQd3556Mode("diff");
      }
    } else if (result.kind === "qd5937" && result.targetId) {
      setQd5937Id(result.targetId); setView("qd5937"); setQuery(result.focus);
    } else if (result.kind === "qd3276" && result.targetId) {
      setQd3276Id(result.targetId); setView("qd3276"); setQuery(result.focus);
    } else if (result.kind === "hoiDap" && result.targetId) {
      const qId = parseInt(result.targetId, 10);
      const question = HOI_DAP_BHYT_2026.questions.find((item) => item.id === qId);
      if (question) {
        setView("hoiDap");
        setHoiDapSection(question.section);
        setExpandedQuestionIds((prev) => {
          const next = new Set(prev);
          next.add(qId);
          return next;
        });
        setQuery(question.question);
        const targetIndex = HOI_DAP_BHYT_2026.questions.filter((item) => item.section === question.section).findIndex((item) => item.id === qId);
        setHoiDapPage(Math.floor(Math.max(0, targetIndex) / HOI_DAP_PAGE_SIZE) + 1);
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resultKindLabel: Record<SearchResult["kind"], string> = { field: "Chỉ tiêu", catalog: "Mã dùng chung", qd: "Bảng QĐ 3176", qd3556: "Bảng QĐ 3556", qd5937: "Bảng QĐ 5937", qd3276: "Bảng QĐ 3276", hoiDap: "Hỏi đáp BHYT", document: "Tài liệu" };

  const loadExcel = async (file?: File) => {
    if (!file) return;
    if (!/\.(xlsx|xlsm|xls)$/i.test(file.name)) { toast.error("Chỉ hỗ trợ file Excel .xlsx, .xls hoặc .xlsm."); return; }
    setLoading(true);
    try {
      const result = await inspectExcelFile(file);
      setInspection(result);
      setExcelFile(file);
      setFilter("all");
      setCategoryFilter("all");
      setColumnFilter("all");
      setView("validate");
      if (result.detection) setTemplate(result.detection.template);
      toast.success(result.detection ? `${result.detection.template.label} đã được nhận diện với độ tin cậy ${result.detection.score}%.` : "Đã đọc file; cần kiểm tra lại hàng tiêu đề.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đọc file Excel.");
    } finally {
      setLoading(false);
      if (excelInput.current) excelInput.current.value = "";
    }
  };

  const loadCatalog = async (file?: File) => {
    if (!file) return;
    try {
      const catalog = await importCatalogFile(file);
      setCatalogs((current) => [...current.filter((item) => item.kind !== catalog.kind || catalog.kind === "unknown"), catalog]);
      toast.success(`Đã nạp ${catalog.count} mã từ ${catalog.fileName}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đọc danh mục mã dùng chung.");
    } finally {
      if (catalogInput.current) catalogInput.current.value = "";
    }
  };

  const normalize = async () => {
    if (!inspection || !excelFile) return;
    if (!window.confirm("Chỉ chuẩn hóa khoảng trắng, ký tự xuống dòng và khoảng trắng không ngắt trong các ô văn bản. File gốc không bị thay đổi. Bạn muốn tạo file mới?")) return;
    setNormalizing(true);
    try {
      const result = await downloadNormalizedWorkbook(excelFile, inspection);
      toast.success(`Đã tải ${result.outputName}; chuẩn hóa ${result.changedCells} ô.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo file chuẩn hóa.");
    } finally {
      setNormalizing(false);
    }
  };

  const exportHighlighted = async () => {
    if (!inspection || !excelFile) return;
    setHighlighting(true);
    try {
      const result = await downloadHighlightedWorkbook(excelFile, inspection, allIssues);
      toast.success(`Đã tải ${result.outputName}; tô màu ${result.markedCells} ô có phát hiện.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo file Excel tô màu.");
    } finally {
      setHighlighting(false);
    }
  };

  const saveFacilityRule = () => {
    const facilityCode = ruleDraft.facilityCode.trim().toUpperCase();
    const column = ruleDraft.column.trim().toUpperCase();
    const value = Number(ruleDraft.value);
    if (!facilityCode || !column) { toast.error("Nhập mã cơ sở KCB và chọn cột cần kiểm tra."); return; }
    if (ruleDraft.kind === "maxLength" && (!Number.isFinite(value) || value < 1)) { toast.error("Nhập giới hạn ký tự lớn hơn 0."); return; }
    const next = [...facilityRules, makeFacilityRule({ facilityCode, column, kind: ruleDraft.kind, value: ruleDraft.kind === "maxLength" ? value : undefined, note: ruleDraft.note.trim(), enabled: true })];
    setFacilityRules(next);
    persistFacilityRules(next);
    setRuleDraft((current) => ({ ...current, column: "", value: "", note: "" }));
    toast.success("Đã lưu quy tắc cục bộ cho cơ sở KCB.");
  };

  const removeFacilityRule = (id: string) => {
    const next = facilityRules.filter((rule) => rule.id !== id);
    setFacilityRules(next);
    persistFacilityRules(next);
  };

  const toggleQuestion = (id: number) => {
    setExpandedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAllHoiDap = () => {
    setExpandedQuestionIds(new Set(currentPageHoiDapQuestions.map((q) => q.id)));
  };

  const collapseAllHoiDap = () => {
    setExpandedQuestionIds(new Set());
  };

  const clearInspection = () => {
    if (!inspection) return;
    if (!window.confirm(`Xóa hồ sơ “${inspection.fileName}” khỏi phiên làm việc? Dữ liệu trên máy không bị xóa.`)) return;
    setInspection(null);
    setExcelFile(null);
    setQuery("");
    setFilter("all");
    setCategoryFilter("all");
    setColumnFilter("all");
    toast.success("Đã xóa hồ sơ khỏi phiên làm việc.");
  };

  const toggle3556File = (id: string) => {
    setSelected3556Files((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll3556Files = () => {
    if (selected3556Files.size === QD3556_DOWNLOADABLE_FILES.length) {
      setSelected3556Files(new Set());
    } else {
      setSelected3556Files(new Set(QD3556_DOWNLOADABLE_FILES.map((f) => f.id)));
    }
  };

  const triggerFileDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSelected3556Files = () => {
    const chosen = QD3556_DOWNLOADABLE_FILES.filter((f) => selected3556Files.has(f.id));
    if (chosen.length === 0) {
      toast.error("Vui lòng tích chọn ít nhất một file trong danh sách bên dưới để tải về.");
      return;
    }
    toast.success(`Đang bắt đầu tải về ${chosen.length} file đã tích chọn...`);
    chosen.forEach((file, idx) => {
      setTimeout(() => {
        triggerFileDownload(documentUrl(file.path), file.filename);
      }, idx * 450);
    });
  };

  const title = view === "lookup" ? "Tra cứu cấu trúc danh mục" : view === "validate" ? "Kiểm định và xem trước Excel" : view === "catalog" ? "Danh mục mã dùng chung" : view === "qd3556" ? "16 bảng chuẩn đầu ra QĐ 3556 (Sửa đổi QĐ 3176)" : view === "qd" ? "15 bảng chỉ tiêu QĐ 3176" : view === "qd5937" ? "13 bảng nguồn tham chiếu QĐ 5937" : view === "qd3276" ? "2 bảng phụ lục QĐ 3276" : view === "hoiDap" ? "108 câu hỏi - đáp nghiệp vụ BHYT 2026" : view === "rules" ? "Quản lý quy tắc cơ sở KCB" : "Hướng dẫn vận hành";
  const status = inspection ? (counts.error ? `${counts.error} lỗi chặn` : counts.warning ? `${counts.warning} mục cần đối chiếu` : "Không có lỗi chặn") : "Chưa có file Excel";

  return <div className="app-shell">
    <input ref={excelInput} className="sr-only" type="file" accept=".xlsx,.xls,.xlsm" onChange={(event) => void loadExcel(event.target.files?.[0])} />
    <input ref={catalogInput} className="sr-only" type="file" accept=".xlsx,.xls,.xlsm" onChange={(event) => void loadCatalog(event.target.files?.[0])} />
    <aside className="app-sidebar">
      <div className="brand-block">{BRAND_ASSETS.logo ? <img src={BRAND_ASSETS.logo} alt="Biểu tượng TT12 Validator" className="brand-logo" /> : <div className="brand-logo brand-logo-offline">TT12</div>}<div><p className="brand-name">TT12 <strong>Validator</strong></p><p className="brand-subline">DANH MỤC · EXCEL · BHYT</p></div></div>
      <div className="sidebar-scroll">
        <p className="sidebar-label">KHÔNG GIAN LÀM VIỆC</p>
        <SideButton active={view === "lookup"} onClick={() => setView("lookup")}>Tra cứu danh mục</SideButton>
        <SideButton active={view === "validate"} onClick={() => setView("validate")}>Kiểm định Excel</SideButton>
        <p className="sidebar-label space-top">NHÓM 1 · DANH MỤC TT12</p>
        <div className="template-stack">{dmTemplates.map((item, index) => <button key={item.id} className={`template-button ${template.id === item.id && view === "lookup" ? "template-button-active" : ""}`} onClick={() => { setTemplate(item); setView("lookup"); setQuery(""); }}><span>{String(index + 1).padStart(2, "0")}</span>{item.label.replace("Mẫu số ", "Mẫu ")}</button>)}</div>
        <p className="sidebar-label space-top">NHÓM 2 · TỔNG HỢP & QUYẾT TOÁN BHYT</p>
        <div className="template-stack">{bhTemplates.map((item, index) => <button key={item.id} className={`template-button ${template.id === item.id && view === "lookup" ? "template-button-active" : ""}`} onClick={() => { setTemplate(item); setView("lookup"); setQuery(""); }}><span>{String(index + 1).padStart(2, "0")}</span>{item.label.replace("Mẫu số ", "Mẫu ")}</button>)}</div>
        <p className="sidebar-label space-top">NHÓM 3 · MÃ DÙNG CHUNG</p>
        {(Object.keys(catalogLabels) as CatalogId[]).map((item) => (
          <button
            key={item}
            className={`supplement-button ${
              (item === "maDoiTuong" ? (view === "qd3276" && qd3276Id === "pl-01") : (view === "catalog" && catalogId === item))
                ? "supplement-button-active"
                : ""
            }`}
            onClick={() => {
              if (item === "maDoiTuong") {
                setView("qd3276");
                setQd3276Id("pl-01");
                setQuery("");
              } else {
                setCatalogId(item);
                setView("catalog");
                setQuery("");
              }
            }}
          >
            <span>{catalogLabels[item]}</span>
            <ChevronRight size={14} />
          </button>
        ))}
        <p className="sidebar-label space-top">NGUỒN THAM CHIẾU</p>
        <button className={`supplement-button ${view === "qd3556" ? "supplement-button-active" : ""}`} onClick={() => { setView("qd3556"); setQuery(""); }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>16 bảng QĐ 3556</span>
            <span className="badge-new-pill">MỚI</span>
          </span>
          <ChevronRight size={14} />
        </button>
        <button className={`supplement-button ${view === "qd" ? "supplement-button-active" : ""}`} onClick={() => setView("qd")}>15 bảng chỉ tiêu QĐ 3176<ChevronRight size={14} /></button>
        <button className={`supplement-button ${view === "qd5937" ? "supplement-button-active" : ""}`} onClick={() => { setView("qd5937"); setQuery(""); }}>13 bảng nguồn QĐ 5937<ChevronRight size={14} /></button>
        <button className={`supplement-button ${view === "qd3276" ? "supplement-button-active" : ""}`} onClick={() => { setView("qd3276"); setQuery(""); }}>2 bảng phụ lục QĐ 3276 & 2917<ChevronRight size={14} /></button>
        <button className={`supplement-button ${view === "hoiDap" ? "supplement-button-active" : ""}`} onClick={() => { setView("hoiDap"); setQuery(""); setHoiDapPage(1); }}>108 câu hỏi - đáp BHYT 2026<ChevronRight size={14} /></button>
      </div>
      <div className="sidebar-bottom"><SideButton active={view === "rules"} onClick={() => setView("rules")}>Quy tắc cơ sở KCB</SideButton><SideButton active={view === "guide"} onClick={() => setView("guide")}>Hướng dẫn & phạm vi</SideButton><ReleaseLedger /><p className="footer-meta">v{APP_META.version} · Nguyễn Sơn Nam</p></div>
    </aside>

    <main className="main-workspace">
      <header className="workspace-head compact-head">
        {BRAND_ASSETS.texture && <img src={BRAND_ASSETS.texture} alt="" className="ledger-texture" />}
        <div className="head-content">
          <div className="compact-header-top">
            <div className="compact-title-group">
              <div className="compact-dossier-badge">
                <FileCheck2 size={15} />
                <span>TT12 / 2026</span>
              </div>
              <h1 className="compact-heading">{title}</h1>
              <div className="compact-meta-chips">
                <span className="meta-chip meta-chip-template" title="Mẫu đang chọn">
                  <b>{template.label}</b>
                </span>
                <span className="meta-chip meta-chip-source" title="Nguồn Excel nạp vào">
                  {inspection?.fileName ?? "Chưa nạp nguồn"}
                </span>
                <span className={`meta-chip meta-chip-status ${counts.error ? "status-error" : counts.warning ? "status-warning" : "status-idle"}`} title="Trạng thái kiểm định">
                  {status}
                </span>
              </div>
            </div>

            <div className="compact-actions">
              <Button className="button-outline button-compact" variant="outline" onClick={() => catalogInput.current?.click()} title="Nạp file danh mục mã khoa hoặc mã KCB để đối chiếu">
                <FolderSearch size={14} />Nạp mã dùng chung
              </Button>
              {inspection && (
                <Button className="button-danger-outline button-compact" variant="outline" onClick={clearInspection} title="Xóa dữ liệu Excel khỏi phiên làm việc">
                  <Trash2 size={14} />Xóa hồ sơ
                </Button>
              )}
              <Button className="button-cobalt button-compact" onClick={() => excelInput.current?.click()}>
                <Upload size={14} />Nạp hồ sơ Excel
              </Button>
            </div>
          </div>

          <section className="compact-global-search" aria-label="Tìm kiếm dữ liệu TT12">
            <div className="compact-search-bar">
              <div className="compact-search-input">
                <Search size={16} />
                <input
                  value={globalQuery}
                  onChange={(event) => setGlobalQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setGlobalQuery("");
                  }}
                  placeholder="Tra cứu xuyên hồ sơ: nhập mã chỉ tiêu (MA_KHOA, GIA_BHYT...), tên thuốc, dịch vụ, bảng QĐ 3176, QĐ 5937..."
                  aria-label="Từ khóa tìm kiếm toàn bộ dữ liệu"
                />
                {globalQuery && (
                  <button className="compact-search-clear" onClick={() => setGlobalQuery("")} title="Xóa tìm kiếm (Esc)">
                    <X size={14} />
                  </button>
                )}
              </div>
              <label className="compact-search-scope">
                <span>PHẠM VI</span>
                <select value={globalScope} onChange={(event) => setGlobalScope(event.target.value as SearchScope)} aria-label="Chọn phạm vi tìm kiếm">
                  <option value="all">Toàn bộ dữ liệu TT12</option>
                  <optgroup label="Theo mẫu TT12">
                    {globalSearchScopes.filter((item) => item.group === "template").map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </optgroup>
                  <optgroup label="Theo bảng riêng biệt">
                    {globalSearchScopes.filter((item) => item.group === "table").map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </optgroup>
                </select>
              </label>
              <div className="compact-search-badge">
                {globalQuery.trim() ? `${globalSearchResults.length} kết quả` : "Tìm tức thì"}
              </div>
            </div>

            {globalQuery.trim() && (
              <div className="compact-search-dropdown">
                <div className="compact-search-dropdown-header">
                  <span>Kết quả tìm kiếm cho "{globalQuery}" ({globalSearchResults.length} mục)</span>
                  <button className="compact-dropdown-close" onClick={() => setGlobalQuery("")} title="Đóng danh sách tìm kiếm (Esc)">
                    <X size={14} />Đóng (Esc)
                  </button>
                </div>
                <div className="global-search-results">
                  {globalSearchResults.length ? globalSearchResults.map((result) => result.kind === "document" && result.url ? (
                    <a key={result.id} className="global-search-result" href={sourceUrl(result.url)} target="_blank" rel="noreferrer">
                      <span className="global-search-result-kind">{resultKindLabel[result.kind]}</span>
                      <strong>{result.title}</strong>
                      <small>{result.subtitle}</small>
                      <p>{result.snippet}</p>
                    </a>
                  ) : (
                    <button key={result.id} className="global-search-result" onClick={() => openSearchResult(result)}>
                      <span className="global-search-result-kind">{resultKindLabel[result.kind]}</span>
                      <strong>{result.title}</strong>
                      <small>{result.subtitle}</small>
                      <p>{result.snippet}</p>
                    </button>
                  )) : (
                    <div className="global-search-empty">
                      <Info size={16} />
                      <span>Không tìm thấy dữ liệu trong phạm vi đã chọn. Thử mã cột, tên danh mục hoặc từ khóa ngắn hơn.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </header>

      <div className="workspace-body">
        <div className="work-nav"><button className={view === "lookup" ? "active" : ""} onClick={() => { setView("lookup"); setQuery(""); }}>Mẫu TT12</button><button className={view === "validate" ? "active" : ""} onClick={() => { setView("validate"); setQuery(""); }}>Kiểm định & preview</button><button className={view === "catalog" ? "active" : ""} onClick={() => { setView("catalog"); setQuery(""); }}>Mã dùng chung</button><button className={view === "qd3556" ? "active" : ""} onClick={() => { setView("qd3556"); setQuery(""); }}>QĐ 3556 (Mới)</button><button className={view === "qd" ? "active" : ""} onClick={() => { setView("qd"); setQuery(""); }}>QĐ 3176</button><button className={view === "qd5937" ? "active" : ""} onClick={() => { setView("qd5937"); setQuery(""); }}>QĐ 5937</button><button className={view === "qd3276" ? "active" : ""} onClick={() => { setView("qd3276"); setQuery(""); }}>QĐ 3276</button><button className={view === "hoiDap" ? "active" : ""} onClick={() => { setView("hoiDap"); setQuery(""); setHoiDapPage(1); }}>Hỏi đáp BHYT 2026</button></div>

        {view === "qd3556" && (
          <section className="source-card">
            <div className="source-card-head">
              <div>
                <p className="eyebrow">
                  NGUỒN THAM CHIẾU · QUYẾT ĐỊNH 3556/QĐ-BYT (KÝ NGÀY 18/11/2026) · SỬA ĐỔI, BỔ SUNG QĐ 3176/QĐ-BYT
                </p>
                <h2>
                  {qd3556Mode === "diff"
                    ? "QĐ 3556 · Đối chiếu thay đổi chuyên sâu"
                    : qd3556?.title}
                </h2>
                <p>
                  {qd3556Mode === "diff"
                    ? `Đối chiếu tệp chuẩn 2026 với tệp 2024 · Ký số Bộ Y tế ngày 18/11/2026 · ${diffRecords.length} chỉ tiêu hiển thị.`
                    : query || onlyAmended3556
                    ? `${qd3556Rows.length}/${qd3556?.rows.length ?? 0} dòng hiển thị.`
                    : `${qd3556?.rows.length ?? 0} chỉ tiêu (${qd3556?.changeCount ?? 0} chỉ tiêu sửa đổi, bổ sung theo QĐ 3556).`}
                </p>
              </div>
              <label className="search-box">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Tìm tên trường, mã, quy định hoặc nội dung…"
                  aria-label="Tìm kiếm trong QĐ 3556"
                />
              </label>
            </div>

            {/* Banner quy định Điều 2 */}
            <div className="qd3556-banner">
              <div className="qd3556-banner-head">
                <Info size={18} className="qd3556-banner-icon" />
                <div className="qd3556-banner-title">
                  <strong>QUY ĐỊNH CỐT LÕI TẠI ĐIỀU 2 (QĐ 3556/QĐ-BYT):</strong> Ca bệnh ngoại trú có chỉ định cận lâm sàng rồi chuyển nhập viện nội trú
                </div>
              </div>
              <ul className="qd3556-banner-list">
                <li>
                  <strong>Tách giá trị mức hưởng:</strong> Cơ sở KCB xác định giá trị mức hưởng (<code>MUC_HUONG</code>) tương ứng cho từng dịch vụ KCB ngoại trú, nội trú tại Bảng 2 (Thuốc) và Bảng 3 (DVKT & VTYT).
                </li>
                <li>
                  <strong>Công thức tính tiền mới:</strong> <code>T_BNTT = THANH_TIEN_BV − T_BHTT − T_BNCCT</code> và <code>T_BNCCT = THANH_TIEN_BH × MUC_HUONG_BH/100 − T_BHTT</code> tại Bảng 2 và Bảng 3.
                </li>
                <li>
                  <strong>Tái sử dụng kết quả CLS:</strong> Cơ sở KCB được sử dụng lại kết quả cận lâm sàng ngoại trú trong quá trình điều trị nội trú, không phải chỉ định lại xét nghiệm trùng lặp.
                </li>
              </ul>
            </div>

            {/* Hộp công cụ tích chọn tải tài liệu QĐ 3556 */}
            <div className="qd3556-download-manager">
              <div className="qd3556-dm-header">
                <div className="qd3556-dm-title-group">
                  <div className="qd3556-dm-badge">
                    <FolderDown size={14} />
                    <span>DOWNLOAD MANAGER</span>
                  </div>
                  <h3>Hộp công cụ tải tài liệu & đối chiếu QĐ 3556</h3>
                  <p>Tích chọn các tệp bạn cần để tải về máy cùng lúc, hoặc tải riêng từng tệp bằng các nút thao tác bên phải.</p>
                </div>
                <div className="qd3556-dm-actions">
                  <button
                    type="button"
                    className="button-outline qd3556-dm-toggle-all"
                    onClick={toggleAll3556Files}
                  >
                    {selected3556Files.size === QD3556_DOWNLOADABLE_FILES.length ? (
                      <>
                        <CheckSquare size={15} />
                        <span>Bỏ tích tất cả</span>
                      </>
                    ) : (
                      <>
                        <Square size={15} />
                        <span>Tích chọn tất cả ({QD3556_DOWNLOADABLE_FILES.length})</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="button-primary qd3556-dm-download-btn"
                    onClick={downloadSelected3556Files}
                    disabled={selected3556Files.size === 0}
                  >
                    <Download size={16} />
                    <span>Tải về các file đã tích ({selected3556Files.size}/{QD3556_DOWNLOADABLE_FILES.length})</span>
                  </button>
                </div>
              </div>

              <div className="qd3556-dm-grid">
                {QD3556_DOWNLOADABLE_FILES.map((file) => {
                  const isChecked = selected3556Files.has(file.id);
                  const downloadHref = documentUrl(file.path);
                  return (
                    <div
                      key={file.id}
                      className={`qd3556-dm-item ${isChecked ? "qd3556-dm-item-selected" : ""}`}
                      onClick={() => toggle3556File(file.id)}
                    >
                      <div className="qd3556-dm-item-left" onClick={(e) => e.stopPropagation()}>
                        <label className="qd3556-checkbox-label" title={isChecked ? "Bỏ tích chọn file này" : "Tích chọn file này"}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle3556File(file.id)}
                            className="qd3556-checkbox"
                          />
                        </label>
                      </div>

                      <div className="qd3556-dm-item-main">
                        <div className="qd3556-dm-item-top">
                          <span className={`qd3556-file-badge qd3556-badge-${file.type}`}>
                            {file.badge}
                          </span>
                          <strong className="qd3556-file-name">{file.name}</strong>
                          <span className="qd3556-file-size">({file.size})</span>
                        </div>
                        <p className="qd3556-file-desc">{file.desc}</p>
                      </div>

                      <div className="qd3556-dm-item-actions" onClick={(e) => e.stopPropagation()}>
                        {file.canPreview && (
                          <a
                            href={downloadHref}
                            target="_blank"
                            rel="noreferrer"
                            className="button-outline qd3556-btn-preview"
                            title="Mở xem trực tiếp trong tab mới"
                          >
                            <Eye size={14} />
                            <span>Xem trước</span>
                          </a>
                        )}
                        <a
                          href={downloadHref}
                          download={file.filename}
                          target="_blank"
                          rel="noreferrer"
                          className="button-outline qd3556-btn-download"
                          title={`Tải trực tiếp ${file.filename} về máy`}
                        >
                          <Download size={14} />
                          <span>Tải về</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="qd3556-dm-footer">
                <span>
                  💡 <em>Mẹo:</em> Bạn có thể tải bảng đối chiếu cũ 2024 hoặc bảng mới 2026 để kiểm tra đối soát chéo độc lập.
                </span>
                <a
                  href="https://github.com/Nsnnam/tt12-excel-validator/archive/refs/heads/main.zip"
                  target="_blank"
                  rel="noreferrer"
                  className="qd3556-zip-link"
                >
                  <Download size={13} />
                  <span>Tải toàn bộ repo ZIP từ GitHub</span>
                </a>
              </div>
            </div>

            {/* Thanh chuyển chế độ xem: Đối chiếu chuyên sâu vs Bảng chuẩn toàn văn */}
            <div className="qd3556-mode-bar">
              <div className="qd3556-mode-tabs">
                <button
                  type="button"
                  className={`qd3556-mode-tab ${qd3556Mode === "diff" ? "qd3556-mode-tab-active" : ""}`}
                  onClick={() => setQd3556Mode("diff")}
                >
                  <Sparkles size={15} />
                  <span>Đối chiếu thay đổi chuyên sâu (Deep Diff)</span>
                  <span className="qd3556-mode-pill">
                    {QD3556_DIFF.records.filter((r) => !["unchanged", "historical"].includes(r.status)).length} thay đổi
                  </span>
                </button>
                <button
                  type="button"
                  className={`qd3556-mode-tab ${qd3556Mode === "table" ? "qd3556-mode-tab-active" : ""}`}
                  onClick={() => setQd3556Mode("table")}
                >
                  <Layers size={15} />
                  <span>Bảng chuẩn 16 bảng QĐ 3556 (Toàn văn)</span>
                  <span className="qd3556-mode-pill">16 bảng</span>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* CHẾ ĐỘ 1: ĐỐI CHIẾU THAY ĐỔI CHUYÊN SÂU (DEEP DIFF VIEW) */}
            {/* ======================================================== */}
            {qd3556Mode === "diff" && (
              <div className="qd3556-diff-section">
                {/* Dải chọn bảng dữ liệu */}
                <div className="work-nav qd3556-table-nav">
                  <button
                    type="button"
                    className={diffTableFilter === "all" ? "active" : ""}
                    onClick={() => setDiffTableFilter("all")}
                  >
                    <span>Tất cả các bảng</span>
                    <span className="qd3556-tab-badge">484</span>
                  </button>
                  {QD3556_DIFF.tables.map((t) => {
                    const changedInT = QD3556_DIFF.records.filter(
                      (r) => r.tableId === t.id && !["unchanged", "historical"].includes(r.status)
                    ).length;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={diffTableFilter === t.id ? "active" : ""}
                        onClick={() => setDiffTableFilter(t.id)}
                        title={t.title}
                      >
                        <span>{t.id === "check-in" ? "Check-in" : t.id.replace("bang-", "Bảng ")}</span>
                        {changedInT > 0 && <span className="qd3556-tab-badge">{changedInT}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Dải lọc theo loại thay đổi */}
                <div className="qd3556-diff-filters">
                  {[
                    { id: "changed", label: "Nội dung thay đổi", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && !["unchanged", "historical"].includes(r.status)).length },
                    { id: "new", label: "Trường mới", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && r.status === "new").length },
                    { id: "amended", label: "Sửa đổi/Bổ sung", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && ["modified", "supplemented"].includes(r.status)).length },
                    { id: "null", label: "Giá trị null", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && r.status === "null").length },
                    { id: "review", label: "Cần đối chiếu", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && r.needsReview).length },
                    { id: "repeal", label: "Bãi bỏ diễn giải", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && Boolean(r.repeal && r.repeal.length > 0)).length },
                    { id: "inherited", label: "Dẫn lại QĐ 1931", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && r.status === "inherited").length },
                    { id: "historical", label: "Lịch sử QĐ 3176", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && r.status === "historical").length },
                    { id: "unchanged", label: "Chưa thấy sửa đổi", count: QD3556_DIFF.records.filter((r) => (diffTableFilter === "all" || r.tableId === diffTableFilter) && r.status === "unchanged").length },
                    { id: "all", label: "Tất cả chỉ tiêu", count: QD3556_DIFF.records.filter((r) => diffTableFilter === "all" || r.tableId === diffTableFilter).length },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      className={`qd3556-filter-chip ${diffStatusFilter === btn.id ? "qd3556-filter-chip-active" : ""}`}
                      onClick={() => setDiffStatusFilter(btn.id)}
                    >
                      <span>{btn.label}</span>
                      <span className="qd3556-chip-count">{btn.count}</span>
                    </button>
                  ))}
                </div>

                {/* Danh sách thẻ chỉ tiêu đối chiếu */}
                <div className="qd3556-diff-cards">
                  {diffRecords.length > 0 ? (
                    diffRecords.map((r) => {
                      const statusTag = r.repeal && r.repeal.length > 0 ? "repeal" : r.status;
                      const tableName = diffTableTitles[r.tableId] || r.tableId;
                      const summaryText = formatDiffSummary(r);

                      return (
                        <div
                          key={r.id}
                          className={`qd3556-diff-card qd3556-card-${statusTag}`}
                          onClick={() => setSelectedDiffRecord(r)}
                        >
                          <div className="qd3556-card-top">
                            <div className="qd3556-card-title-group">
                              <span className="qd3556-card-table-badge">{tableName.split(".")[0]}</span>
                              <strong className="qd3556-card-field-name">{r.field}</strong>
                            </div>
                            <span className={`qd3556-status-pill qd3556-status-${statusTag}`}>
                              {statusTag === "new"
                                ? "Trường mới"
                                : statusTag === "null"
                                ? "Giá trị NULL"
                                : statusTag === "modified"
                                ? "Sửa đổi"
                                : statusTag === "supplemented"
                                ? "Bổ sung"
                                : statusTag === "review"
                                ? "Cần đối chiếu"
                                : statusTag === "inherited"
                                ? "QĐ 1931"
                                : statusTag === "historical"
                                ? "Lịch sử 3176"
                                : statusTag === "repeal"
                                ? "Bãi bỏ"
                                : "Chưa đổi"}
                            </span>
                          </div>

                          <p className="qd3556-card-summary">{summaryText}</p>

                          {/* Thay đổi kích thước/kiểu nếu có */}
                          {r.metadataChanges && r.metadataChanges.length > 0 && (
                            <div className="qd3556-card-meta-changes">
                              {r.metadataChanges.map((m, mIdx) => (
                                <span key={mIdx} className="qd3556-meta-chip">
                                  <b>{m.label}:</b> {m.before} → <mark>{m.after}</mark>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Cảnh báo hoặc bãi bỏ */}
                          {r.repeal && r.repeal.length > 0 && (
                            <div className="qd3556-card-note qd3556-note-repeal">
                              <span>⚠ Bãi bỏ: {r.repeal.join("; ")}</span>
                            </div>
                          )}
                          {r.notes && r.notes.length > 0 && (
                            <div className="qd3556-card-note">
                              <span>ℹ {r.notes.join("; ")}</span>
                            </div>
                          )}

                          <div className="qd3556-card-footer">
                            <span className="qd3556-card-pos">
                              Vị trí: {r.after?.sheet ? `${r.after.sheet} · dòng ${r.after.row}` : `${r.before?.sheet} · dòng ${r.before?.row}`}
                            </span>
                            <button
                              type="button"
                              className="button-outline qd3556-card-view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDiffRecord(r);
                              }}
                            >
                              <span>So sánh Cũ vs Mới</span>
                              <ChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="table-empty">
                      Không tìm thấy chỉ tiêu nào khớp với bộ lọc và từ khóa đang chọn.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* CHẾ ĐỘ 2: BẢNG CHUẨN 16 BẢNG TOÀN VĂN (FULL TABLE VIEW)  */}
            {/* ======================================================== */}
            {qd3556Mode === "table" && (
              <>
                {/* Table Navigation */}
                <div className="work-nav qd3556-table-nav">
                  {QD3556_TABLES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={qd3556Id === item.id ? "active" : ""}
                      onClick={() => {
                        setQd3556Id(item.id);
                        setQuery("");
                      }}
                      title={item.title}
                    >
                      <span>{item.id === "bang-checkin" ? "Check-in" : item.id.replace("bang-", "Bảng ")}</span>
                      {(item.changeCount ?? 0) > 0 && (
                        <span className="qd3556-tab-badge">{item.changeCount}</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Filter toolbar */}
                <div className="qd3556-filter-toolbar">
                  <button
                    type="button"
                    className={`qd3556-filter-toggle ${onlyAmended3556 ? "qd3556-filter-toggle-active" : ""}`}
                    onClick={() => setOnlyAmended3556(!onlyAmended3556)}
                  >
                    <Filter size={14} />
                    <span>
                      {onlyAmended3556
                        ? `Đang lọc: Chỉ hiển thị các chỉ tiêu sửa đổi/bổ sung (${qd3556?.changeCount ?? 0})`
                        : `Lọc: Chỉ xem các chỉ tiêu sửa đổi/bổ sung (${qd3556?.changeCount ?? 0})`}
                    </span>
                  </button>
                  <div className="qd3556-filter-status">
                    Đang hiển thị <strong>{qd3556Rows.length}</strong> / {qd3556?.rows.length ?? 0} chỉ tiêu
                    {onlyAmended3556 && " (chế độ lọc thay đổi)"}
                  </div>
                </div>

                {/* Main Data Table */}
                <div className="source-table-wrap">
                  <table className="source-table qd3556-table">
                    <thead>
                      <tr>
                        {qd3556?.headers.map((header, idx) => (
                          <th
                            key={header}
                            className={idx === qd3556ChangeColIdx ? "qd3556-th-amended" : ""}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {qd3556Rows.map((row, index) => {
                        const isRowAmended = qd3556ChangeColIdx !== -1 && Boolean(row[qd3556ChangeColIdx]?.trim());
                        return (
                          <tr
                            key={`${qd3556?.id}-${index}`}
                            className={isRowAmended ? "qd3556-tr-amended" : ""}
                          >
                            {row.map((cell, column) => {
                              const isAmendedCol = column === qd3556ChangeColIdx;
                              return (
                                <td
                                  key={`${index}-${column}`}
                                  className={isAmendedCol ? "qd3556-td-amended" : ""}
                                >
                                  {isAmendedCol && cell.trim() && (
                                    <div className="qd3556-amended-badge">
                                      ★ SỬA ĐỔI, BỔ SUNG THEO QĐ 3556
                                    </div>
                                  )}
                                  <pre>{cell}</pre>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {query && !qd3556Rows.length && (
                  <div className="table-empty">
                    Không có dòng nào trong bảng đang chọn khớp từ khóa "{query}".
                  </div>
                )}
                {onlyAmended3556 && !query && !qd3556Rows.length && (
                  <div className="table-empty">
                    Bảng này không có chỉ tiêu nào được sửa đổi theo QĐ 3556 (giữ nguyên quy định cũ).
                  </div>
                )}
              </>
            )}

            {/* ======================================================== */}
            {/* MODAL DIALOG SO SÁNH ĐỐI CHIẾU CHI TIẾT CŨ VS MỚI        */}
            {/* ======================================================== */}
            {selectedDiffRecord && (
              <div
                className="qd3556-modal-backdrop"
                onClick={() => setSelectedDiffRecord(null)}
              >
                <div
                  className="qd3556-modal-dialog"
                  onClick={(e) => e.stopPropagation()}
                >
                  <header className="qd3556-modal-header">
                    <div>
                      <p className="qd3556-modal-sub">
                        {diffTableTitles[selectedDiffRecord.tableId] || selectedDiffRecord.tableId}
                      </p>
                      <h2 className="qd3556-modal-title">{selectedDiffRecord.field}</h2>
                    </div>
                    <div className="qd3556-modal-header-right">
                      <span className={`qd3556-status-pill qd3556-status-${selectedDiffRecord.status}`}>
                        {selectedDiffRecord.status === "new"
                          ? "Trường mới"
                          : selectedDiffRecord.status === "null"
                          ? "Giá trị NULL"
                          : selectedDiffRecord.status === "modified"
                          ? "Sửa đổi"
                          : selectedDiffRecord.status === "supplemented"
                          ? "Bổ sung"
                          : selectedDiffRecord.status === "review"
                          ? "Cần đối chiếu"
                          : selectedDiffRecord.status === "inherited"
                          ? "QĐ 1931"
                          : selectedDiffRecord.status === "historical"
                          ? "Lịch sử 3176"
                          : "Chưa đổi"}
                      </span>
                      <button
                        type="button"
                        className="qd3556-modal-close"
                        onClick={() => setSelectedDiffRecord(null)}
                        aria-label="Đóng đối chiếu"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </header>

                  <div className="qd3556-modal-body">
                    {/* Tóm tắt thay đổi chính */}
                    <div className="qd3556-modal-key-change">
                      <h3>Thay đổi chính</h3>
                      <p className="qd3556-modal-summary-text">
                        {formatDiffSummary(selectedDiffRecord)}
                      </p>
                      {selectedDiffRecord.metadataChanges && selectedDiffRecord.metadataChanges.length > 0 && (
                        <div className="qd3556-modal-spec-table">
                          <table>
                            <thead>
                              <tr>
                                <th>Thông tin</th>
                                <th>Quy định cũ (2024)</th>
                                <th>Quy định mới QĐ 3556</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDiffRecord.metadataChanges.map((m, idx) => (
                                <tr key={idx}>
                                  <td><strong>{m.label}</strong></td>
                                  <td><code>{m.before}</code></td>
                                  <td className="qd3556-td-new-val"><code>{m.after}</code></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* So sánh hai cột Cũ vs Mới */}
                    <div className="qd3556-compare-cols">
                      {/* Cột trái: Quy định cũ */}
                      <div className="qd3556-compare-col qd3556-col-before">
                        <div className="qd3556-col-head">
                          <h4>Nội dung cũ theo QĐ 3176 (tệp 2024)</h4>
                          <span className="qd3556-col-meta">
                            {selectedDiffRecord.before?.sheet
                              ? `${selectedDiffRecord.before.sheet} · dòng ${selectedDiffRecord.before.row}`
                              : "Chưa có trong tệp 2024"}
                          </span>
                        </div>
                        <div className="qd3556-col-content">
                          {selectedDiffRecord.before?.history && selectedDiffRecord.before.history.length > 0 ? (
                            selectedDiffRecord.before.history.map((h, hIdx) => (
                              <div key={hIdx} className="qd3556-history-block">
                                <span className="qd3556-history-label">{h.label} ({h.cell})</span>
                                <pre className="qd3556-history-text">{h.text}</pre>
                              </div>
                            ))
                          ) : (
                            <p className="qd3556-empty-state">
                              Trường này chưa có trong bảng tương ứng của tệp năm 2024 (Đây là trường mới được bổ sung).
                            </p>
                          )}
                        </div>
                        <div className="qd3556-col-foot">
                          <a
                            href={documentUrl("documents/chuan-dau-ra-3176-2024.xls")}
                            download="chuan-dau-ra-3176-2024.xls"
                            target="_blank"
                            rel="noreferrer"
                            className="qd3556-col-link"
                          >
                            <Download size={13} />
                            <span>Tải tệp cũ (2024)</span>
                          </a>
                        </div>
                      </div>

                      {/* Cột phải: Quy định mới */}
                      <div className="qd3556-compare-col qd3556-col-after">
                        <div className="qd3556-col-head">
                          <h4>Nội dung mới theo QĐ 3556 (tệp 2026)</h4>
                          <span className="qd3556-col-meta">
                            {selectedDiffRecord.after?.sheet
                              ? `${selectedDiffRecord.after.sheet} · ${selectedDiffRecord.after.amendmentCell ? `ô ${selectedDiffRecord.after.amendmentCell}` : `dòng ${selectedDiffRecord.after.row}`}`
                              : "Không còn trong tệp mới"}
                          </span>
                        </div>
                        <div className="qd3556-col-content">
                          {selectedDiffRecord.after?.amendment ? (
                            <div className="qd3556-amendment-box">
                              <span className="qd3556-amendment-tag">SỬA ĐỔI, BỔ SUNG THEO QĐ 3556/QĐ-BYT</span>
                              <pre className="qd3556-amendment-text">{selectedDiffRecord.after.amendment}</pre>
                            </div>
                          ) : selectedDiffRecord.summary ? (
                            <p className="qd3556-plain-after">{selectedDiffRecord.summary}</p>
                          ) : (
                            <p className="qd3556-empty-state">
                              Không còn dòng này trong tệp mới. Chỉ dẫn “Bỏ” đã có tại cột QĐ 3176 của tệp cũ.
                            </p>
                          )}
                        </div>
                        <div className="qd3556-col-foot">
                          <a
                            href={documentUrl("documents/261116_Chuan_du_lieu_dau_ra_sua_3176_Final.xlsx")}
                            download="261116_Chuan_du_lieu_dau_ra_sua_3176_Final.xlsx"
                            target="_blank"
                            rel="noreferrer"
                            className="qd3556-col-link"
                          >
                            <Download size={13} />
                            <span>Tải tệp mới (2026)</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Ghi chú & lưu ý bổ sung */}
                    {((selectedDiffRecord.notes && selectedDiffRecord.notes.length > 0) || (selectedDiffRecord.repeal && selectedDiffRecord.repeal.length > 0)) && (
                      <div className="qd3556-modal-notes">
                        <h4>Lưu ý nghiệp vụ & quy tắc bãi bỏ</h4>
                        <ul>
                          {selectedDiffRecord.repeal?.map((rText, rIdx) => (
                            <li key={rIdx} className="qd3556-li-repeal">
                              <strong>Bãi bỏ:</strong> {rText}
                            </li>
                          ))}
                          {selectedDiffRecord.notes?.map((nText, nIdx) => (
                            <li key={nIdx}>
                              <strong>Ghi chú:</strong> {nText}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {view === "lookup" && <>
          <section className="notice-strip"><Info size={18} /><p><strong>Quy tắc cập nhật:</strong> dòng cũ ghi <code>DEN_NGAY</code>; dòng thay đổi ghi <code>TU_NGAY</code> và để trống <code>DEN_NGAY</code>.</p></section>
          <div className="validate-toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm chỉ tiêu, quy tắc hoặc diễn giải…" /></label><a className="template-download" href={sourceTemplateUrl(template.id)} target="_blank" rel="noreferrer"><Download size={16} />Tải file mẫu</a></div>
          <section className="source-card"><div className="source-card-head"><div><p className="eyebrow"><FileCheck2 size={13} /> {schemaSource}</p><h2>{template.label} · {sourceFields.length} chỉ tiêu</h2></div><span className="source-chip"><FileCheck2 size={14} /><b>{sourceFields.filter((field) => field.required).length}</b> bắt buộc</span></div><div className="source-table-wrap"><table className="source-table"><thead><tr><th>STT</th><th>Chỉ tiêu</th><th>Định dạng</th><th>Kích thước</th><th>Diễn giải & ghi chú</th><th>Bắt buộc</th><th>Trùng</th></tr></thead><tbody>{fields.map((field) => <tr key={field.name}><td>{field.index}</td><td><strong>{field.name}</strong></td><td>{field.format}</td><td>{field.size}</td><td><div className="field-note"><pre>{field.note}</pre>{field.additionalNote && <small>Ghi chú bổ sung: {field.additionalNote}</small>}</div></td><td><span className={field.required ? "required-mark" : field.requirementText !== "Không bắt buộc" ? "requirement-condition" : "requirement-optional"}>{field.requirementText}</span></td><td>{field.duplicate ? <span className="duplicate-mark">TRÙNG</span> : <span className="duplicate-empty">—</span>}</td></tr>)}</tbody></table></div></section>
          <section className="library-section"><div><p className="eyebrow">THƯ VIỆN FILE MẪU & TÀI LIỆU</p><h2>{DOCUMENT_LIBRARY.length} tài liệu và file mẫu đang sử dụng</h2></div><div className="library-grid">{DOCUMENT_LIBRARY.map((document) => <a key={document.id} href={sourceUrl(document.url)} target="_blank" rel="noreferrer" className="library-link"><BookOpen size={17} /><span>{document.name}</span><ChevronRight size={16} /></a>)}</div></section>
        </>}

        {view === "catalog" && <section className="catalog-layout"><aside className="source-card"><div className="source-card-head"><div><p className="eyebrow">BẢNG MÃ</p><h2>Danh mục</h2></div></div><div className="p-3">{(Object.keys(catalogLabels) as CatalogId[]).map((item) => <button key={item} className={`catalog-file ${catalogId === item ? "active" : ""}`} onClick={() => { if (item === "maDoiTuong") { setView("qd3276"); setQd3276Id("pl-01"); setQuery(""); } else { setCatalogId(item); setQuery(""); } }}><span>{catalogLabels[item]}</span><b>{COMMON_CATALOGS[item].length}</b></button>)}</div></aside><section className="source-card"><div className="source-card-head"><div><p className="eyebrow">DỮ LIỆU GỐC ĐÃ TÍCH HỢP</p><h2>{catalogLabels[catalogId]}</h2><p>{codeRows.length}/{COMMON_CATALOGS[catalogId].length} dòng khớp từ khóa.</p></div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã hoặc nội dung…" /></label></div>{catalogId === "maDoiTuong" && <div className="normalize-note" style={{ margin: "12px 16px" }}><Info size={17} /><p><strong>Thay thế theo QĐ 3276/QĐ-BYT & QĐ 2917/QĐ-BYT:</strong> Danh mục này áp dụng theo Phụ lục 1 QĐ 3276/QĐ-BYT và QĐ 2917/QĐ-BYT ngày 15/09/2026 (sửa đổi, bổ sung mã 3.1; bãi bỏ Phụ lục 5 QĐ 2010/QĐ-BYT).</p><button className="button-outline" style={{ marginLeft: "auto", padding: "4px 10px", fontSize: "11px", fontWeight: "bold", background: "#fff", cursor: "pointer" }} onClick={() => { setView("qd3276"); setQd3276Id("pl-01"); setQuery(""); }}>Xem tại Nguồn tham chiếu QĐ 3276/2917 →</button></div>}<div className="source-table-wrap"><table className="source-table"><thead><tr>{codeHeaders.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{codeRows.map((row, index) => <tr key={`${index}-${JSON.stringify(row)}`}>{codeHeaders.map((header) => <td key={header}>{row[header]}</td>)}</tr>)}</tbody></table></div></section></section>}

        {view === "qd" && <section className="source-card"><div className="source-card-head"><div><p className="eyebrow">CHUẨN ĐẦU RA</p><h2>{qd?.title}</h2><p>{query ? `${qdRows.length}/${qd?.rows.length ?? 0} dòng khớp từ khóa.` : `${qd?.rows.length ?? 0} dòng chỉ tiêu từ dữ liệu QĐ 3176 đã tải.`}</p></div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong bảng đang chọn…" aria-label="Tìm trong bảng QĐ 3176 đang chọn" /></label></div><div className="work-nav">{QD3176_TABLES.map((item) => <button key={item.id} className={qdId === item.id ? "active" : ""} onClick={() => { setQdId(item.id); setQuery(""); }}>{item.id.replace("bang-", "Bảng ")}</button>)}</div><div className="source-table-wrap"><table className="source-table"><thead><tr>{qd?.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{qdRows.map((row, index) => <tr key={`${qd?.id}-${index}`}>{row.map((cell, column) => <td key={`${index}-${column}`}><pre>{cell}</pre></td>)}</tr>)}</tbody></table></div>{query && !qdRows.length && <div className="table-empty">Không có dòng nào trong bảng đang chọn khớp từ khóa.</div>}</section>}
        {view === "qd5937" && <section className="source-card"><div className="source-card-head"><div><p className="eyebrow">NGUỒN THAM CHIẾU · QUYẾT ĐỊNH 5937/QĐ-BYT · 30/12/2021</p><h2>{qd5937?.title}</h2><p>{query ? `${qd5937Rows.length}/${qd5937?.rows.length ?? 0} dòng khớp từ khóa.` : `${qd5937?.rows.length ?? 0} dòng dữ liệu từ PDF quyết định đã trích xuất.`}</p></div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong phụ lục đang chọn…" aria-label="Tìm trong bảng QĐ 5937 đang chọn" /></label></div><div className="work-nav">{QD5937_TABLES.map((item) => <button key={item.id} className={qd5937Id === item.id ? "active" : ""} onClick={() => { setQd5937Id(item.id); setQuery(""); }}>{item.id.replace("pl-", "PL ")}</button>)}</div><div className="source-table-wrap"><table className="source-table"><thead><tr>{qd5937?.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{qd5937Rows.map((row, index) => <tr key={`${qd5937?.id}-${index}`}>{row.map((cell, column) => <td key={`${index}-${column}`}><pre>{cell}</pre></td>)}</tr>)}</tbody></table></div>{qd5937?.notes?.length ? <div className="normalize-note"><Info size={17} /><p><strong>Ghi chú nguồn:</strong> {qd5937.notes.join(" ")}</p></div> : null}{query && !qd5937Rows.length && <div className="table-empty">Không có dòng nào trong phụ lục đang chọn khớp từ khóa.</div>}</section>}
        {view === "qd3276" && <section className="source-card"><div className="source-card-head"><div><p className="eyebrow">NGUỒN THAM CHIẾU · QUYẾT ĐỊNH 3276/QĐ-BYT & 2917/QĐ-BYT · SỬA ĐỔI BỔ SUNG QĐ 2010</p><h2>{qd3276?.title}</h2><p>{query ? `${qd3276Rows.length}/${qd3276?.rows.length ?? 0} dòng khớp từ khóa.` : `${qd3276?.rows.length ?? 0} dòng dữ liệu từ QĐ 3276 & QĐ 2917/QĐ-BYT đã trích xuất.`}</p></div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong phụ lục đang chọn…" aria-label="Tìm trong bảng QĐ 3276 đang chọn" /></label></div><div className="work-nav">{QD3276_TABLES.map((item) => <button key={item.id} className={qd3276Id === item.id ? "active" : ""} onClick={() => { setQd3276Id(item.id); setQuery(""); }}>{item.id.replace("pl-", "PL ")}</button>)}</div><div className="source-table-wrap"><table className="source-table"><thead><tr>{qd3276?.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{qd3276Rows.map((row, index) => <tr key={`${qd3276?.id}-${index}`}>{row.map((cell, column) => <td key={`${index}-${column}`}><pre>{cell}</pre></td>)}</tr>)}</tbody></table></div>{qd3276?.notes?.length ? <div className="normalize-note"><Info size={17} /><p><strong>Ghi chú nguồn:</strong> {qd3276.notes.join(" ")}</p></div> : null}{query && !qd3276Rows.length && <div className="table-empty">Không có dòng nào trong phụ lục đang chọn khớp từ khóa.</div>}</section>}

        {view === "hoiDap" && (
          <section className="hoidap-container">
            <div className="hoidap-hero">
              <div className="hoidap-hero-left">
                <div className="hoidap-hero-badges">
                  <span className="hoidap-hero-badge hoidap-hero-badge-accent">
                    {HOI_DAP_BHYT_2026.publisher.toUpperCase()}
                  </span>
                  <span className="hoidap-hero-badge">
                    {HOI_DAP_BHYT_2026.edition}
                  </span>
                  <span className="hoidap-hero-badge">
                    {HOI_DAP_BHYT_2026.circulation}
                  </span>
                  <span className="hoidap-hero-badge">
                    {HOI_DAP_BHYT_2026.pageCount} TRANG · 108 CÂU HỎI - ĐÁP
                  </span>
                </div>
                <h2 className="hoidap-hero-title">{HOI_DAP_BHYT_2026.title}</h2>
                <p className="hoidap-hero-desc">
                  Bộ cẩm nang nghiệp vụ do Bảo hiểm xã hội Việt Nam ban hành, hướng dẫn chi tiết các tình huống xử lý về Cổng tiếp nhận dữ liệu, hợp đồng KCB, danh mục liên thông, hồ sơ đề nghị thanh toán, giám định chi phí và quyết toán BHYT theo Luật BHYT, Nghị định 188/2025/NĐ-CP và Thông tư 12/2026/TT-BTC.
                </p>
              </div>
              <div className="hoidap-hero-actions">
                <a
                  className="hoidap-hero-download"
                  href={sourceUrl("hoi-dap-giam-dinh-bhyt-2026.pdf")}
                  target="_blank"
                  rel="noreferrer"
                  title="Mở toàn văn file PDF gốc 86 trang từ BHXH Việt Nam"
                >
                  <Download size={16} />
                  <span>Tải file PDF gốc (86 trang)</span>
                </a>
              </div>
            </div>

            <div className="hoidap-section-tabs">
              <button
                className={`hoidap-section-tab ${hoiDapSection === "all" ? "hoidap-section-tab-active" : ""}`}
                onClick={() => { setHoiDapSection("all"); setHoiDapPage(1); }}
              >
                <span>Tất cả chuyên đề</span>
                <span className="hoidap-section-badge">{HOI_DAP_BHYT_2026.questions.length}</span>
              </button>
              {HOI_DAP_BHYT_2026.sections.map((sec) => {
                const count = HOI_DAP_BHYT_2026.questions.filter((q) => q.section === sec.id).length;
                return (
                  <button
                    key={sec.id}
                    className={`hoidap-section-tab ${hoiDapSection === sec.id ? "hoidap-section-tab-active" : ""}`}
                    onClick={() => { setHoiDapSection(sec.id); setHoiDapPage(1); }}
                    title={sec.description}
                  >
                    <span>{sec.title}</span>
                    <span className="hoidap-section-badge">{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="validate-toolbar" style={{ margin: "8px 0" }}>
              <label className="search-box" style={{ flex: 1 }}>
                <Search size={18} />
                <input
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setHoiDapPage(1); }}
                  placeholder="Tìm kiếm câu hỏi: nhập số câu (1, câu 108), từ khóa nghiệp vụ (ký số, biên bản quyết toán, NĐ 188)..."
                  aria-label="Tìm kiếm trong 108 câu hỏi - đáp BHYT"
                />
              </label>
              {query && (
                <Button variant="outline" className="button-outline" onClick={() => setQuery("")}>
                  <X size={15} /> Xóa tìm kiếm
                </Button>
              )}
            </div>

            <div className="hoidap-controls">
              <span className="hoidap-count-summary">
                {query ? (
                  <>Tìm thấy <strong>{filteredHoiDapQuestions.length}</strong> / {HOI_DAP_BHYT_2026.questions.length} câu hỏi khớp từ khóa</>
                ) : (
                  <>Đang hiển thị <strong>{filteredHoiDapQuestions.length}</strong> câu hỏi {hoiDapSection !== "all" ? `thuộc chuyên đề “${HOI_DAP_BHYT_2026.sections.find(s => s.id === hoiDapSection)?.title}”` : "toàn bộ cẩm nang"}</>
                )}
                {totalHoiDapPages > 1 && ` · Trang ${hoiDapPage}/${totalHoiDapPages}`}
              </span>
              <div className="hoidap-toggle-btns">
                <button className="hoidap-toggle-btn" onClick={expandAllHoiDap}>
                  Mở rộng trang này
                </button>
                <button className="hoidap-toggle-btn" onClick={collapseAllHoiDap}>
                  Thu gọn tất cả
                </button>
              </div>
            </div>

            <div className="hoidap-list">
              {currentPageHoiDapQuestions.length > 0 ? (
                currentPageHoiDapQuestions.map((q) => {
                  const isOpen = expandedQuestionIds.has(q.id);
                  const sec = HOI_DAP_BHYT_2026.sections.find((s) => s.id === q.section);
                  return (
                    <article
                      key={q.id}
                      className={`hoidap-item ${isOpen ? "hoidap-item-open" : ""}`}
                    >
                      <div
                        className="hoidap-header-row"
                        onClick={() => toggleQuestion(q.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleQuestion(q.id); }}
                      >
                        <span className="hoidap-qnum">CÂU {String(q.id).padStart(2, "0")}</span>
                        <div className="hoidap-header-main">
                          <div className="hoidap-header-tags">
                            <span className="hoidap-tag-section">{sec?.title ?? q.section}</span>
                            <span>•</span>
                            <span className="hoidap-tag-page">Trang {q.page}{q.endPage > q.page ? `–${q.endPage}` : ""}</span>
                          </div>
                          <h3 className="hoidap-qtitle">{q.question}</h3>
                        </div>
                        <div className="hoidap-chevron">
                          <ChevronDown size={18} />
                        </div>
                      </div>

                      {isOpen && (
                        <div className="hoidap-body">
                          {q.answer.map((paragraph, pIdx) => (
                            <p key={pIdx}>{paragraph}</p>
                          ))}
                          <div className="hoidap-body-footer">
                            <span style={{ fontSize: "11.5px", color: "#627d98" }}>
                              Nguồn: <em>{HOI_DAP_BHYT_2026.title}</em> ({HOI_DAP_BHYT_2026.edition})
                            </span>
                            <a
                              href={`${sourceUrl("hoi-dap-giam-dinh-bhyt-2026.pdf")}#page=${q.page}`}
                              target="_blank"
                              rel="noreferrer"
                              className="hoidap-pdf-link"
                              title={`Mở file PDF gốc đến đúng trang ${q.page}`}
                            >
                              <ExternalLink size={13} />
                              <span>Đối chiếu tài liệu gốc: Trang {q.page}{q.endPage > q.page ? `–${q.endPage}` : ""} (PDF)</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              ) : (
                <div className="table-empty">
                  Không tìm thấy câu hỏi nào khớp với từ khóa tìm kiếm trong chuyên đề đã chọn.
                </div>
              )}
            </div>

            {totalHoiDapPages > 1 && (
              <div className="hoidap-pagination">
                <button
                  className="hoidap-page-btn"
                  onClick={() => setHoiDapPage((p) => Math.max(1, p - 1))}
                  disabled={hoiDapPage === 1}
                >
                  ← Trước
                </button>
                {Array.from({ length: totalHoiDapPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`hoidap-page-btn ${hoiDapPage === p ? "hoidap-page-btn-active" : ""}`}
                    onClick={() => { setHoiDapPage(p); window.scrollTo({ top: 300, behavior: "smooth" }); }}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="hoidap-page-btn"
                  onClick={() => setHoiDapPage((p) => Math.min(totalHoiDapPages, p + 1))}
                  disabled={hoiDapPage === totalHoiDapPages}
                >
                  Sau →
                </button>
              </div>
            )}
          </section>
        )}

        {view === "validate" && <>
          <section className="validate-toolbar"><div className="catalog-drop"><Button variant="outline" className="button-outline" onClick={() => catalogInput.current?.click()}><FolderSearch size={16} />Nạp mã khoa/mã KCB</Button>{catalogs.map((catalog) => <span className="uploaded-catalog" key={catalog.id}>{catalog.kind === "maKhoa" ? "Mã khoa" : catalog.kind === "maKhamBenh" ? "Mã khám bệnh" : "Danh mục"} · {catalog.count} mã<button onClick={() => setCatalogs((items) => items.filter((item) => item.id !== catalog.id))}><X size={13} /></button></span>)}</div>{inspection && <div className="head-actions"><Button variant="outline" className="button-outline" onClick={normalize} disabled={normalizing}>{normalizing ? "Đang chuẩn hóa…" : "Tạo file chuẩn hóa"}</Button><Button variant="outline" className="button-outline" onClick={() => void exportHighlighted()} disabled={highlighting}>{highlighting ? "Đang tạo file…" : "Xuất Excel tô màu"}</Button><Button className="button-cobalt" onClick={() => exportReport({ ...inspection, issues: allIssues })}><Download size={16} />Xuất báo cáo</Button></div>}</section>
          {!inspection ? <section className="dropzone"><div className="empty-inspection"><div className="empty-inspection-icon"><FileSpreadsheet size={28} /></div><div><p className="eyebrow">PHIÊN KIỂM ĐỊNH MỚI</p><h2>Nạp file để xem lỗi ngay tại ô dữ liệu.</h2><p>Ứng dụng nhận diện mẫu, tô màu ô lỗi/cảnh báo và đối chiếu thêm với các danh mục mã người dùng cung cấp.</p></div><Button className="button-cobalt" onClick={() => excelInput.current?.click()} disabled={loading}><Upload size={17} />Chọn file Excel</Button><p className="privacy-note"><ShieldCheck size={15} />File chỉ được xử lý trong trình duyệt.</p></div></section> : <>
            <section className="inspection-summary"><div className="file-identity"><div className="file-icon"><FileSpreadsheet size={24} /></div><div><p className="eyebrow">PHIÊN KIỂM ĐỊNH</p><h2>{inspection.fileName}</h2><p>Sheet <strong>{inspection.sheetName}</strong> · {inspection.rows.length} dòng · {formatBytes(inspection.fileSize)} · {inspection.detection?.template.label ?? "Chưa nhận diện"}</p></div></div><div className="detection-card"><p>ĐỘ TIN CẬY NHẬN DIỆN</p><strong>{inspection.detection?.score ?? 0}%</strong><div className="confidence"><span style={{ width: `${inspection.detection?.score ?? 0}%` }} /></div><small>{allIssues.length} phát hiện, trong đó {counts.error} lỗi chặn.</small></div></section>
            <section className="metrics-row"><button className={`metric-card ${filter === "all" ? "metric-card-active" : ""}`} onClick={() => setFilter("all")}><Info size={20} /><div><span>TỔNG PHÁT HIỆN</span><strong>{allIssues.length}</strong></div></button>{(["error", "warning", "info"] as Severity[]).map((severity) => <button key={severity} className={`metric-card metric-${severity} ${filter === severity ? "metric-card-active" : ""}`} onClick={() => setFilter(severity)}><AlertTriangle size={20} /><div><span>{severityLabel[severity].toUpperCase()}</span><strong>{counts[severity]}</strong></div></button>)}</section>
            <section className="source-card preview-filter-card"><div className="source-card-head"><div><p className="eyebrow">XEM TRƯỚC EXCEL TRỰC TIẾP</p><h2>Ô có vấn đề được tô màu theo bộ lọc</h2><p>Chọn mức độ, nhóm lỗi hoặc cột; chỉ các ô phù hợp mới được nhấn mạnh trong bảng xem trước.</p></div></div><div className="preview-filter-bar"><Filter size={18} /><label>Mức độ<select value={filter} onChange={(event) => setFilter(event.target.value as IssueFilter)}><option value="all">Tất cả mức độ</option><option value="error">Lỗi chặn</option><option value="warning">Cần đối chiếu</option><option value="info">Thông tin</option></select></label><label>Nhóm lỗi<select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">Tất cả nhóm lỗi</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label>Cột lỗi<select value={columnFilter} onChange={(event) => setColumnFilter(event.target.value)}><option value="all">Tất cả cột</option>{inspection.headers.map((header) => <option key={header} value={header}>{header}</option>)}</select></label><span>{visibleIssues.length} phát hiện phù hợp</span></div><div className="preview-legend"><span className="error"><AlertTriangle size={13} />Lỗi chặn</span><span className="warning"><AlertTriangle size={13} />Cần đối chiếu</span><span className="info"><Info size={13} />Thông tin</span></div><div className="excel-preview-wrap"><table className="excel-preview"><thead><tr><th>Dòng</th>{inspection.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{inspection.rows.slice(0, 60).map((row) => <tr key={row.rowNumber}><td>{row.rowNumber}</td>{inspection.headers.map((header) => { const related = visibleIssues.filter((item) => item.row === row.rowNumber && issueMatchesColumn(item, header)); const top = topIssue(related); return <td key={header} className={top ? `cell-${severityClass[top.severity]}` : ""} title={related.map((item) => `[${item.category}] ${item.message}`).join("\n")}>{String(row.cells[header]?.value ?? "")}</td>; })}</tr>)}</tbody></table></div><div className="normalize-note"><CheckCircle2 size={17} /><p><strong>Xuất Excel tô màu</strong> giữ nguyên dữ liệu gốc, đánh dấu ô theo mức độ và thêm sheet <code>Danh_sach_loi</code> có chi tiết/gợi ý sửa offline.</p></div></section>
            <section className="issues-card"><div className="issues-card-head"><div><p className="eyebrow">KẾT QUẢ RÀ SOÁT</p><h2>{filter === "all" && categoryFilter === "all" ? "Toàn bộ phát hiện" : "Phát hiện đã lọc"}</h2></div><span className="source-chip">{visibleIssues.length} mục hiển thị</span></div><div className="issue-table-wrap"><table className="issue-table"><thead><tr><th>Mức độ</th><th>Vị trí</th><th>Nhóm</th><th>Phát hiện</th><th>Gợi ý</th></tr></thead><tbody>{visibleIssues.map((item) => <tr key={item.id}><td><span className={`legend-item ${severityClass[item.severity]}`}>{item.severity === "error" ? "Lỗi" : item.severity === "warning" ? "Cảnh báo" : "Thông tin"}</span></td><td>{item.row ? `Dòng ${item.row}` : "Cấu trúc"}<small>{item.column}</small></td><td>{item.category}</td><td>{item.message}</td><td>{item.suggestion}</td></tr>)}</tbody></table></div></section>
          </>}
        </>}

        {view === "rules" && <section className="rules-layout"><section className="source-card"><div className="source-card-head"><div><p className="eyebrow">QUY TẮC CỤC BỘ</p><h2>Tạo quy tắc theo cơ sở KCB</h2><p>Quy tắc chỉ lưu trong trình duyệt hiện tại và được áp dụng thêm khi mã `MA_CSKCB` của dòng dữ liệu trùng khớp.</p></div></div><div className="rules-form"><label>Mã cơ sở KCB<input value={ruleDraft.facilityCode} onChange={(event) => setRuleDraft((current) => ({ ...current, facilityCode: event.target.value }))} placeholder="Ví dụ: 12345 hoặc *" /></label><label>Cột kiểm tra<select value={ruleDraft.column} onChange={(event) => setRuleDraft((current) => ({ ...current, column: event.target.value }))}><option value="">Chọn cột</option>{ruleColumns.map((column) => <option key={column} value={column}>{column}</option>)}</select></label><label>Loại quy tắc<select value={ruleDraft.kind} onChange={(event) => setRuleDraft((current) => ({ ...current, kind: event.target.value as FacilityRuleKind }))}><option value="required">Bắt buộc có dữ liệu</option><option value="maxLength">Giới hạn ký tự</option><option value="noFormula">Không cho phép công thức</option></select></label>{ruleDraft.kind === "maxLength" && <label>Giới hạn ký tự<input type="number" min="1" value={ruleDraft.value} onChange={(event) => setRuleDraft((current) => ({ ...current, value: event.target.value }))} placeholder="Ví dụ: 50" /></label>}<label className="rule-note">Ghi chú xử lý<textarea value={ruleDraft.note} onChange={(event) => setRuleDraft((current) => ({ ...current, note: event.target.value }))} placeholder="Gợi ý sẽ hiển thị trong báo cáo lỗi." /></label><Button className="button-cobalt" onClick={saveFacilityRule}>Lưu quy tắc</Button></div></section><section className="source-card"><div className="source-card-head"><div><p className="eyebrow">DANH SÁCH ĐÃ LƯU</p><h2>{facilityRules.length} quy tắc cơ sở KCB</h2></div></div>{facilityRules.length ? <div className="rules-list">{facilityRules.map((rule) => <article key={rule.id} className="rule-item"><div><span className="source-chip">{rule.facilityCode}</span><strong>{rule.column}</strong><p>{rule.kind === "required" ? "Bắt buộc có dữ liệu" : rule.kind === "maxLength" ? `Tối đa ${rule.value} ký tự` : "Không cho phép công thức"}</p>{rule.note && <small>{rule.note}</small>}</div><Button variant="outline" className="button-quiet" onClick={() => removeFacilityRule(rule.id)}><X size={16} />Xóa</Button></article>)}</div> : <div className="validation-clean"><Info size={24} /><div><strong>Chưa có quy tắc riêng.</strong><p>Tạo quy tắc cho mã cơ sở KCB cụ thể hoặc dùng ký tự `*` để áp dụng cho mọi cơ sở.</p></div></div>}</section></section>}

        {view === "guide" && <section className="article-card"><p className="eyebrow">HƯỚNG DẪN VẬN HÀNH</p><h2>Kiểm tra file, đối chiếu mã và chỉ chuẩn hóa các lỗi an toàn.</h2><div className="guide-steps"><div><span>01</span><h3>Nạp một trong tám mẫu</h3><p>Ứng dụng nhận diện sáu mẫu danh mục TT12 và hai mẫu tổng hợp/quyết toán BHYT theo hàng tiêu đề chuẩn.</p></div><div><span>02</span><h3>Nạp danh mục mã</h3><p>Chọn file có cột `MA_KHOA`, `MA_KHAM_BENH` hoặc `MA` để so sánh với dữ liệu import.</p></div><div><span>03</span><h3>Lọc và xuất file sửa lỗi</h3><p>Lọc lỗi theo mức độ/nhóm/cột, sau đó xuất file tô màu để xử lý offline mà không thay đổi file gốc.</p></div></div></section>}
      </div>
    </main>
  </div>;
}
