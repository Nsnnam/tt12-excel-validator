/**
 * Phong cách Hồ sơ điều hành: dữ liệu nguồn, trạng thái kiểm định và xem trước ô lỗi cùng tồn tại trong một bàn làm việc có thể truy vết.
 */
import { useMemo, useRef, useState } from "react";
import "../inspection.css";
import "../expanded.css";
import { toast } from "sonner";
import { AlertTriangle, BookOpen, CheckCircle2, ChevronRight, Download, FileCheck2, FileSpreadsheet, FolderSearch, Info, Search, ShieldCheck, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReleaseLedger } from "@/components/ReleaseLedger";
import { APP_META, BRAND_ASSETS } from "@/lib/meta";
import { TEMPLATES, exportReport, fieldsForTemplate, inspectExcelFile, issueCounts, sourceTemplateUrl, type Inspection, type Severity, type TemplateSchema, type ValidationIssue } from "@/lib/tt12";
import { COMMON_CATALOGS, DOCUMENT_LIBRARY, QD3176_TABLES, getReferenceFields, readableRequirement, sourceUrl } from "@/lib/reference";
import { importCatalogFile, validateCatalogIssues, type ImportedCatalog } from "@/lib/catalog";
import { downloadNormalizedWorkbook } from "@/lib/normalize";

type View = "lookup" | "validate" | "catalog" | "qd" | "guide";
type CatalogId = keyof typeof COMMON_CATALOGS;
const catalogLabels: Record<CatalogId, string> = { maLoaiHinh: "Mã loại hình KCB", maKhamBenh: "Mã khám bệnh", maDoiTuong: "Mã đối tượng KCB", maKhoa: "Mã khoa" };
const severityClass: Record<Severity, string> = { error: "error", warning: "warning", info: "info" };
const formatBytes = (bytes: number) => `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(bytes / 1024)} KB`;
const searchable = (value: unknown, query: string) => String(value ?? "").toLocaleLowerCase("vi-VN").includes(query.toLocaleLowerCase("vi-VN"));

function SideButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button className={`nav-button ${active ? "nav-button-active" : ""}`} onClick={onClick}><ChevronRight size={15} /><span>{children}</span></button>;
}

export default function HomeExpanded() {
  const [view, setView] = useState<View>("lookup");
  const [template, setTemplate] = useState<TemplateSchema>(TEMPLATES[0]);
  const [query, setQuery] = useState("");
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [catalogs, setCatalogs] = useState<ImportedCatalog[]>([]);
  const [catalogId, setCatalogId] = useState<CatalogId>("maLoaiHinh");
  const [qdId, setQdId] = useState(QD3176_TABLES[0]?.id ?? "bang-1");
  const [filter, setFilter] = useState<Severity | "all">("all");
  const [loading, setLoading] = useState(false);
  const [normalizing, setNormalizing] = useState(false);
  const excelInput = useRef<HTMLInputElement>(null);
  const catalogInput = useRef<HTMLInputElement>(null);
  const catalogIssues = useMemo(() => inspection ? validateCatalogIssues(inspection, catalogs) : [], [inspection, catalogs]);
  const allIssues = useMemo(() => inspection ? [...inspection.issues, ...catalogIssues] : [], [inspection, catalogIssues]);
  const counts = issueCounts(allIssues);
  const visibleIssues = allIssues.filter((item) => filter === "all" || item.severity === filter);
  const fields = useMemo(() => fieldsForTemplate(template).filter((field) => searchable(`${field.name} ${field.note} ${field.additionalNote}`, query)), [template, query]);
  const sourceFields = getReferenceFields(template.id);
  const codeRows = COMMON_CATALOGS[catalogId].filter((row) => Object.values(row).some((value) => searchable(value, query)));
  const codeHeaders = Object.keys(codeRows[0] ?? COMMON_CATALOGS[catalogId][0] ?? {});
  const qd = QD3176_TABLES.find((item) => item.id === qdId) ?? QD3176_TABLES[0];
  const issuesForCell = (row: number, column: string) => allIssues.filter((issue) => issue.row === row && issue.column.split("/").some((item) => item.trim().includes(column)));

  const loadExcel = async (file?: File) => {
    if (!file) return;
    if (!/\.(xlsx|xlsm|xls)$/i.test(file.name)) { toast.error("Chỉ hỗ trợ file Excel .xlsx, .xls hoặc .xlsm."); return; }
    setLoading(true);
    try {
      const result = await inspectExcelFile(file);
      setInspection(result); setExcelFile(file); setFilter("all"); setView("validate");
      if (result.detection) setTemplate(result.detection.template);
      toast.success(result.detection ? `${result.detection.template.label} đã được nhận diện với độ tin cậy ${result.detection.score}%.` : "Đã đọc file; cần kiểm tra lại hàng tiêu đề.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Không thể đọc file Excel."); }
    finally { setLoading(false); }
  };

  const loadCatalog = async (file?: File) => {
    if (!file) return;
    try {
      const catalog = await importCatalogFile(file);
      setCatalogs((current) => [...current.filter((item) => item.kind !== catalog.kind || catalog.kind === "unknown"), catalog]);
      toast.success(`Đã nạp ${catalog.count} mã từ ${catalog.fileName}.`);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Không thể đọc danh mục mã dùng chung."); }
    finally { if (catalogInput.current) catalogInput.current.value = ""; }
  };

  const normalize = async () => {
    if (!inspection || !excelFile) return;
    if (!window.confirm("Chỉ chuẩn hóa khoảng trắng, ký tự xuống dòng và khoảng trắng không ngắt trong các ô văn bản. File gốc không bị thay đổi. Bạn muốn tạo file mới?")) return;
    setNormalizing(true);
    try {
      const result = await downloadNormalizedWorkbook(excelFile, inspection);
      toast.success(`Đã tải ${result.outputName}; chuẩn hóa ${result.changedCells} ô.`);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Không thể tạo file chuẩn hóa."); }
    finally { setNormalizing(false); }
  };

  const title = view === "lookup" ? "Tra cứu cấu trúc danh mục" : view === "validate" ? "Kiểm định và xem trước Excel" : view === "catalog" ? "Danh mục mã dùng chung" : view === "qd" ? "15 bảng chỉ tiêu QĐ 3176" : "Hướng dẫn vận hành";
  const status = inspection ? (counts.error ? `${counts.error} lỗi chặn` : counts.warning ? `${counts.warning} mục cần đối chiếu` : "Không có lỗi chặn") : "Chưa có file Excel";

  return <div className="app-shell">
    <input ref={excelInput} className="sr-only" type="file" accept=".xlsx,.xls,.xlsm" onChange={(event) => void loadExcel(event.target.files?.[0])} />
    <input ref={catalogInput} className="sr-only" type="file" accept=".xlsx,.xls,.xlsm" onChange={(event) => void loadCatalog(event.target.files?.[0])} />
    <aside className="app-sidebar">
      <div className="brand-block">{BRAND_ASSETS.logo ? <img src={BRAND_ASSETS.logo} alt="Biểu tượng TT12 Validator" className="brand-logo" /> : <div className="brand-logo brand-logo-offline">TT12</div>}<div><p className="brand-name">TT12 <strong>Validator</strong></p><p className="brand-subline">DANH MỤC · EXCEL · BHYT</p></div></div>
      <div className="sidebar-scroll"><p className="sidebar-label">KHÔNG GIAN LÀM VIỆC</p><SideButton active={view === "lookup"} onClick={() => setView("lookup")}>Tra cứu danh mục</SideButton><SideButton active={view === "validate"} onClick={() => setView("validate")}>Kiểm định Excel</SideButton>
        <p className="sidebar-label space-top">NHÓM 1 · DANH MỤC TT12</p><div className="template-stack">{TEMPLATES.map((item, index) => <button key={item.id} className={`template-button ${template.id === item.id && view === "lookup" ? "template-button-active" : ""}`} onClick={() => { setTemplate(item); setView("lookup"); setQuery(""); }}><span>{String(index + 1).padStart(2, "0")}</span>{item.label.replace("Mẫu số ", "Mẫu ")}</button>)}</div>
        <p className="sidebar-label space-top">NHÓM 2 · MÃ DÙNG CHUNG</p>{(Object.keys(catalogLabels) as CatalogId[]).map((item) => <button key={item} className={`supplement-button ${view === "catalog" && catalogId === item ? "supplement-button-active" : ""}`} onClick={() => { setCatalogId(item); setView("catalog"); setQuery(""); }}>{catalogLabels[item]}<ChevronRight size={14} /></button>)}
        <p className="sidebar-label space-top">NGUỒN THAM CHIẾU</p><button className={`supplement-button ${view === "qd" ? "supplement-button-active" : ""}`} onClick={() => setView("qd")}>15 bảng chỉ tiêu QĐ 3176<ChevronRight size={14} /></button>
      </div>
      <div className="sidebar-bottom"><SideButton active={view === "guide"} onClick={() => setView("guide")}>Hướng dẫn & phạm vi</SideButton><ReleaseLedger /><p className="footer-meta">v{APP_META.version} · Nguyễn Sơn Nam</p></div>
    </aside>
    <main className="main-workspace"><header className="workspace-head">{BRAND_ASSETS.texture && <img src={BRAND_ASSETS.texture} alt="" className="ledger-texture" />}<div className="head-content"><div className="record-band"><div className="dossier-code"><span>HỒ SƠ</span><b>TT12 / 2026</b><i /></div><div className="record-slots"><div><span>MẪU ĐANG CHỌN</span><b>{template.label}</b></div><div><span>NGUỒN EXCEL</span><b>{inspection?.fileName ?? "Chưa nạp nguồn"}</b></div><div className={`record-status ${counts.error ? "record-status-error" : counts.warning ? "record-status-warning" : "record-status-idle"}`}><span>TRẠNG THÁI</span><b>{status}</b></div></div></div><div className="head-title-row"><div><h1>{title}</h1><p>Xử lý cục bộ trong trình duyệt · dữ liệu nguồn đã trích xuất từ trang tham chiếu.</p></div><div className="head-actions"><Button className="button-outline" variant="outline" onClick={() => catalogInput.current?.click()}><FolderSearch size={16} />Nạp mã dùng chung</Button><Button className="button-cobalt" onClick={() => excelInput.current?.click()}><Upload size={16} />Import Excel</Button></div></div></div></header>
      <div className="workspace-body">
        <div className="work-nav"><button className={view === "lookup" ? "active" : ""} onClick={() => setView("lookup")}>Mẫu TT12</button><button className={view === "validate" ? "active" : ""} onClick={() => setView("validate")}>Kiểm định & preview</button><button className={view === "catalog" ? "active" : ""} onClick={() => setView("catalog")}>Mã dùng chung</button><button className={view === "qd" ? "active" : ""} onClick={() => setView("qd")}>QĐ 3176</button></div>
        {view === "lookup" && <><section className="notice-strip"><Info size={18} /><p><strong>Quy tắc cập nhật:</strong> dòng cũ ghi <code>DEN_NGAY</code>; dòng thay đổi ghi <code>TU_NGAY</code> và để trống <code>DEN_NGAY</code>.</p></section><div className="validate-toolbar"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm chỉ tiêu, quy tắc hoặc diễn giải…" /></label><a className="template-download" href={sourceTemplateUrl(template.id)} target="_blank" rel="noreferrer"><Download size={16} />Tải file mẫu</a></div><section className="source-card"><div className="source-card-head"><div><p className="eyebrow">DỮ LIỆU VALIDATE GỐC</p><h2>{template.label} · {sourceFields.length} chỉ tiêu</h2></div><span className="source-chip"><FileCheck2 size={14} /><b>{sourceFields.filter((field) => field.batBuoc.trim().toLowerCase() === "x").length}</b> bắt buộc</span></div><div className="source-table-wrap"><table className="source-table"><thead><tr><th>STT</th><th>Chỉ tiêu</th><th>Định dạng</th><th>Kích thước</th><th>Diễn giải & ghi chú</th><th>Yêu cầu</th></tr></thead><tbody>{fields.map((field) => <tr key={field.name}><td>{field.index}</td><td><strong>{field.name}</strong></td><td>{field.format}</td><td>{field.size}</td><td><div className="field-note"><pre>{field.note}</pre>{field.additionalNote && <small>Ghi chú bổ sung: {field.additionalNote}</small>}</div></td><td>{field.required ? <span className="required-mark">BẮT BUỘC</span> : "Không bắt buộc"}</td></tr>)}</tbody></table></div></section><section className="library-section"><div><p className="eyebrow">THƯ VIỆN TÀI LIỆU ĐÃ KIỂM KÊ</p><h2>13 tài liệu và file mẫu gốc</h2></div><div className="library-grid">{DOCUMENT_LIBRARY.map((document) => <a key={document.id} href={sourceUrl(document.url)} target="_blank" rel="noreferrer" className="library-link"><BookOpen size={17} /><span>{document.name}</span><ChevronRight size={16} /></a>)}</div></section></>}
        {view === "catalog" && <section className="catalog-layout"><aside className="source-card"><div className="source-card-head"><div><p className="eyebrow">BẢNG MÃ</p><h2>Danh mục</h2></div></div><div className="p-3">{(Object.keys(catalogLabels) as CatalogId[]).map((item) => <button key={item} className={`catalog-file ${catalogId === item ? "active" : ""}`} onClick={() => { setCatalogId(item); setQuery(""); }}><span>{catalogLabels[item]}</span><b>{COMMON_CATALOGS[item].length}</b></button>)}</div></aside><section className="source-card"><div className="source-card-head"><div><p className="eyebrow">DỮ LIỆU GỐC ĐÃ TÍCH HỢP</p><h2>{catalogLabels[catalogId]}</h2><p>{codeRows.length}/{COMMON_CATALOGS[catalogId].length} dòng khớp từ khóa.</p></div><label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã hoặc nội dung…" /></label></div><div className="source-table-wrap"><table className="source-table"><thead><tr>{codeHeaders.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{codeRows.map((row, index) => <tr key={`${index}-${JSON.stringify(row)}`}>{codeHeaders.map((header) => <td key={header}>{row[header]}</td>)}</tr>)}</tbody></table></div></section></section>}
        {view === "qd" && <section className="source-card"><div className="source-card-head"><div><p className="eyebrow">CHUẨN ĐẦU RA</p><h2>{qd?.title}</h2><p>{qd?.rows.length} dòng chỉ tiêu từ dữ liệu QĐ 3176 đã tải.</p></div></div><div className="work-nav">{QD3176_TABLES.map((item) => <button key={item.id} className={qdId === item.id ? "active" : ""} onClick={() => setQdId(item.id)}>{item.id.replace("bang-", "Bảng ")}</button>)}</div><div className="source-table-wrap"><table className="source-table"><thead><tr>{qd?.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{qd?.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={`${index}-${column}`}><pre>{cell}</pre></td>)}</tr>)}</tbody></table></div></section>}
        {view === "validate" && <><section className="validate-toolbar"><div className="catalog-drop"><Button variant="outline" className="button-outline" onClick={() => catalogInput.current?.click()}><FolderSearch size={16} />Nạp mã khoa/mã KCB</Button>{catalogs.map((catalog) => <span className="uploaded-catalog" key={catalog.id}>{catalog.kind === "maKhoa" ? "Mã khoa" : catalog.kind === "maKhamBenh" ? "Mã khám bệnh" : "Danh mục"} · {catalog.count} mã<button onClick={() => setCatalogs((items) => items.filter((item) => item.id !== catalog.id))}><X size={13} /></button></span>)}</div>{inspection && <div className="head-actions"><Button variant="outline" className="button-outline" onClick={normalize} disabled={normalizing}>{normalizing ? "Đang chuẩn hóa…" : "Tạo file chuẩn hóa"}</Button><Button className="button-cobalt" onClick={() => exportReport({ ...inspection, issues: allIssues })}><Download size={16} />Xuất báo cáo</Button></div>}</section>{!inspection ? <section className="dropzone"><div className="empty-inspection"><div className="empty-inspection-icon"><FileSpreadsheet size={28} /></div><div><p className="eyebrow">PHIÊN KIỂM ĐỊNH MỚI</p><h2>Nạp file để xem lỗi ngay tại ô dữ liệu.</h2><p>Ứng dụng nhận diện mẫu, tô màu ô lỗi/cảnh báo và đối chiếu thêm với các danh mục mã người dùng cung cấp.</p></div><Button className="button-cobalt" onClick={() => excelInput.current?.click()} disabled={loading}><Upload size={17} />Chọn file Excel</Button><p className="privacy-note"><ShieldCheck size={15} />File chỉ được xử lý trong trình duyệt.</p></div></section> : <><section className="inspection-summary"><div className="file-identity"><div className="file-icon"><FileSpreadsheet size={24} /></div><div><p className="eyebrow">PHIÊN KIỂM ĐỊNH</p><h2>{inspection.fileName}</h2><p>Sheet <strong>{inspection.sheetName}</strong> · {inspection.rows.length} dòng · {formatBytes(inspection.fileSize)} · {inspection.detection?.template.label ?? "Chưa nhận diện"}</p></div></div><div className="detection-card"><p>ĐỘ TIN CẬY NHẬN DIỆN</p><strong>{inspection.detection?.score ?? 0}%</strong><div className="confidence"><span style={{ width: `${inspection.detection?.score ?? 0}%` }} /></div><small>{allIssues.length} phát hiện, trong đó {counts.error} lỗi chặn.</small></div></section><section className="metrics-row"><button className={`metric-card ${filter === "all" ? "metric-card-active" : ""}`} onClick={() => setFilter("all")}><Info size={20} /><div><span>TỔNG PHÁT HIỆN</span><strong>{allIssues.length}</strong></div></button>{(["error", "warning", "info"] as Severity[]).map((severity) => <button key={severity} className={`metric-card metric-${severity} ${filter === severity ? "metric-card-active" : ""}`} onClick={() => setFilter(severity)}><AlertTriangle size={20} /><div><span>{severity === "error" ? "LỖI CHẶN" : severity === "warning" ? "CẦN ĐỐI CHIẾU" : "THÔNG TIN"}</span><strong>{counts[severity]}</strong></div></button>)}</section><section className="source-card"><div className="source-card-head"><div><p className="eyebrow">XEM TRƯỚC EXCEL TRỰC TIẾP</p><h2>Ô có vấn đề được tô màu theo mức độ</h2><p>Hiển thị tối đa 60 dòng đầu; rê chuột vào ô để đọc nhanh phát hiện liên quan.</p></div></div><div className="preview-legend"><span className="error"><AlertTriangle size={13} />Lỗi chặn</span><span className="warning"><AlertTriangle size={13} />Cần đối chiếu</span><span className="info"><Info size={13} />Thông tin</span></div><div className="excel-preview-wrap"><table className="excel-preview"><thead><tr><th>Dòng</th>{inspection.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{inspection.rows.slice(0, 60).map((row) => <tr key={row.rowNumber}><td>{row.rowNumber}</td>{inspection.headers.map((header) => { const related = issuesForCell(row.rowNumber, header); const top = related.find((item) => item.severity === "error") ?? related.find((item) => item.severity === "warning") ?? related[0]; return <td key={header} className={top ? `cell-${severityClass[top.severity]}` : ""} title={related.map((item) => item.message).join("\n")}>{String(row.cells[header]?.value ?? "")}</td>; })}</tr>)}</tbody></table></div><div className="normalize-note"><CheckCircle2 size={17} /><p><strong>Tạo file chuẩn hóa</strong> chỉ sửa khoảng trắng đầu/cuối, khoảng trắng liên tiếp, ký tự xuống dòng và khoảng trắng không ngắt trong ô văn bản; không tự sửa công thức, mã hay số tiền.</p></div></section><section className="issues-card"><div className="issues-card-head"><div><p className="eyebrow">KẾT QUẢ RÀ SOÁT</p><h2>{filter === "all" ? "Toàn bộ phát hiện" : "Phát hiện đã lọc"}</h2></div><span className="source-chip">{visibleIssues.length} mục hiển thị</span></div><div className="issue-table-wrap"><table className="issue-table"><thead><tr><th>Mức độ</th><th>Vị trí</th><th>Nhóm</th><th>Phát hiện</th><th>Gợi ý</th></tr></thead><tbody>{visibleIssues.map((item: ValidationIssue) => <tr key={item.id}><td><span className={`legend-item ${severityClass[item.severity]}`}>{item.severity === "error" ? "Lỗi" : item.severity === "warning" ? "Cảnh báo" : "Thông tin"}</span></td><td>{item.row ? `Dòng ${item.row}` : "Cấu trúc"}<small>{item.column}</small></td><td>{item.category}</td><td>{item.message}</td><td>{item.suggestion}</td></tr>)}</tbody></table></div></section></>}</>}
        {view === "guide" && <section className="article-card"><p className="eyebrow">HƯỚNG DẪN VẬN HÀNH</p><h2>Kiểm tra file, đối chiếu mã và chỉ chuẩn hóa các lỗi an toàn.</h2><div className="guide-steps"><div><span>01</span><h3>Nạp mẫu và file Excel</h3><p>Ứng dụng nhận diện theo hàng tiêu đề chuẩn của sáu mẫu TT12.</p></div><div><span>02</span><h3>Nạp danh mục mã</h3><p>Chọn file có cột `MA_KHOA`, `MA_KHAM_BENH` hoặc `MA` để so sánh với dữ liệu import.</p></div><div><span>03</span><h3>Xác nhận chuẩn hóa</h3><p>Chỉ sau khi bạn xác nhận, ứng dụng tạo file Excel mới với lỗi văn bản cơ bản đã được làm sạch.</p></div></div></section>}
      </div></main>
  </div>;
}
