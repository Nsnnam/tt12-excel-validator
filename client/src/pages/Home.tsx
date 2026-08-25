/**
 * Phong cách Hồ sơ điều hành: nền giấy ngà, xanh mực/cobalt và cấu trúc dải dữ liệu rõ ràng.
 * Mọi trạng thái kiểm định hiển thị bằng chữ và màu để không phụ thuộc vào màu sắc đơn lẻ.
 */
import { useMemo, useRef, useState } from "react";
import "../inspection.css";
import { toast } from "sonner";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Download,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  FolderSearch,
  Github,
  History,
  Info,
  LayoutList,
  LoaderCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Upload,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TEMPLATES,
  exportReport,
  fieldsForTemplate,
  inspectExcelFile,
  issueCounts,
  sourceTemplateUrl,
  type Inspection,
  type Severity,
  type TemplateSchema,
} from "@/lib/tt12";

type View = "lookup" | "validate" | "guide" | "version" | "author" | "coffee";

const library = [
  ["HD Ánh xạ thuốc_Lâm Xung", "huong-dan-anh-xa-thuoc.pdf"],
  ["Sơ đồ tóm tắt TT12", "so-do-tom-tat-tt12.pdf"],
  ["Tài liệu kỹ thuật TT12", "tai-lieu-ky-thuat-tt12.pdf"],
  ["PL 06 bảng DM", "phu-luc-huong-dan-su-dung-06bangdanhmuc.docx"],
  ["HD ghi PVCM (CV 2148)", "2148-HD-ma-hoa-pham-vi-chuyen-mon.pdf"],
  ["QĐ 2026 — Mã loại KCB, mã khoa", "qd-ma-loai-kcb-ma-khoa-2026.pdf"],
];

const severityVisual: Record<Severity, { label: string; classes: string; icon: typeof AlertTriangle }> = {
  error: { label: "Lỗi", classes: "border-[#e6b2aa] bg-[#fff1ed] text-[#963c2d]", icon: AlertTriangle },
  warning: { label: "Cảnh báo", classes: "border-[#e6ce8d] bg-[#fff9e9] text-[#8b6400]", icon: AlertTriangle },
  info: { label: "Thông tin", classes: "border-[#a9c6e8] bg-[#eff7ff] text-[#285782]", icon: Info },
};

function formatBytes(bytes: number) {
  return new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(bytes / 1024) + " KB";
}

function NavLabel({ icon: Icon, children, active, onClick }: { icon: typeof FileSpreadsheet; children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`nav-button ${active ? "nav-button-active" : ""}`}>
      <Icon size={16} strokeWidth={active ? 2.3 : 1.8} />
      <span>{children}</span>
    </button>
  );
}

function IssueBadge({ severity }: { severity: Severity }) {
  const visual = severityVisual[severity];
  const Icon = visual.icon;
  return <Badge className={`gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold shadow-none ${visual.classes}`}><Icon size={12} />{visual.label}</Badge>;
}

function EmptyInspection({ onUpload, loading }: { onUpload: () => void; loading: boolean }) {
  return (
    <div className="empty-inspection">
      <div className="empty-inspection-icon"><FlaskConical size={28} /></div>
      <div>
        <p className="eyebrow">PHIÊN KIỂM ĐỊNH MỚI</p>
        <h2>Đưa một file Excel vào bàn kiểm tra.</h2>
        <p>Công cụ đọc cấu trúc sheet, đối chiếu chữ ký cột với Mẫu 01–06/DM và rà soát lỗi ngay trên trình duyệt.</p>
      </div>
      <Button onClick={onUpload} disabled={loading} className="button-cobalt"><Upload size={17} />Chọn file Excel</Button>
      <p className="privacy-note"><ShieldCheck size={15} />Tệp được xử lý cục bộ trong trình duyệt, không có luồng tải dữ liệu lên máy chủ trong phiên này.</p>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("lookup");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSchema>(TEMPLATES[0]);
  const [query, setQuery] = useState("");
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const guideRows = useMemo(() => fieldsForTemplate(selectedTemplate).filter((field) => `${field.name} ${field.note}`.toLowerCase().includes(query.toLowerCase())), [selectedTemplate, query]);
  const counts = inspection ? issueCounts(inspection.issues) : { error: 0, warning: 0, info: 0 };
  const visibleIssues = inspection?.issues.filter((item) => severityFilter === "all" || item.severity === severityFilter) ?? [];
  const statusTone = inspection ? (counts.error ? "record-status-error" : counts.warning ? "record-status-warning" : "record-status-good") : "record-status-idle";
  const statusText = inspection ? (counts.error ? `${counts.error} lỗi chặn cần xử lý` : counts.warning ? `${counts.warning} mục cần đối chiếu` : "Không có lỗi chặn") : "Chưa có file Excel để kiểm định";
  const recordSource = inspection ? `${inspection.fileName} · ${inspection.sheetName}` : "Chưa nạp nguồn Excel";

  const chooseTemplate = (template: TemplateSchema) => {
    setSelectedTemplate(template);
    setView("lookup");
    setQuery("");
  };

  const receiveFile = async (file?: File) => {
    if (!file) return;
    if (!/\.(xlsx|xlsm|xls)$/i.test(file.name)) {
      toast.error("Chỉ hỗ trợ file Excel .xlsx, .xls hoặc .xlsm.");
      return;
    }
    setLoading(true);
    try {
      const result = await inspectExcelFile(file);
      setInspection(result);
      if (result.detection) setSelectedTemplate(result.detection.template);
      setSeverityFilter("all");
      setView("validate");
      toast.success(result.detection ? `${result.detection.template.label} được nhận diện ở mức ${result.detection.score}%.` : "Đã đọc file, nhưng chưa xác định được mẫu TT12.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể đọc file Excel này.");
    } finally {
      setLoading(false);
    }
  };

  const resetInspection = () => {
    setInspection(null);
    setSeverityFilter("all");
    if (inputRef.current) inputRef.current.value = "";
    toast.message("Đã xóa phiên kiểm định. Bạn có thể nạp file mới.");
  };

  const openPlaceholder = (label: string) => toast.info(`${label} chưa có dữ liệu danh mục đóng gói trong phiên bản đầu tiên. Hãy dùng thư viện tài liệu ở bên dưới để đối chiếu nguồn.`);

  const title = view === "lookup" ? "Tra cứu cấu trúc danh mục" : view === "validate" ? "Kiểm định file Excel" : view === "guide" ? "Hướng dẫn sử dụng" : view === "version" ? "Phiên bản và lịch sử" : view === "author" ? "Thông tin tác giả" : "Mời cà phê";
  const subtitle = view === "lookup" ? `Đang xem ${selectedTemplate.label} · ${selectedTemplate.headers.length} chỉ tiêu` : view === "validate" ? "Nhận diện mẫu, rà soát cấu trúc và phát hiện lỗi trước khi gửi" : "TT12 Excel Validator · dữ liệu được xử lý tại trình duyệt";

  return (
    <div className="app-shell">
      <input ref={inputRef} className="sr-only" type="file" accept=".xlsx,.xls,.xlsm" onChange={(event) => void receiveFile(event.target.files?.[0])} />
      <aside className="app-sidebar">
        <div className="brand-block">
          <img src="/manus-storage/tt12-validator-logo_43635a60.png" alt="Biểu tượng TT12 Validator" className="brand-logo" />
          <div><p className="brand-name">TT12 <strong>Validator</strong></p><p className="brand-subline">DANH MỤC · EXCEL · BHYT</p></div>
        </div>
        <div className="sidebar-scroll">
          <p className="sidebar-label">KHÔNG GIAN LÀM VIỆC</p>
          <NavLabel icon={FolderSearch} active={view === "lookup"} onClick={() => setView("lookup")}>Tra cứu danh mục</NavLabel>
          <NavLabel icon={FileCheck2} active={view === "validate"} onClick={() => setView("validate")}>Kiểm định Excel</NavLabel>

          <p className="sidebar-label space-top">NHÓM 1 · DANH MỤC TT12</p>
          <div className="template-stack">
            {TEMPLATES.map((template, index) => <button key={template.id} onClick={() => chooseTemplate(template)} className={`template-button ${selectedTemplate.id === template.id && view === "lookup" ? "template-button-active" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span>{template.label.replace("Mẫu số ", "Mẫu ")}</button>)}
          </div>

          <p className="sidebar-label space-top">NHÓM 2 · MÃ DÙNG CHUNG</p>
          {["Mã loại hình KCB", "Mã khám bệnh", "Mã đối tượng KCB", "Mã khoa"].map((item) => <button key={item} onClick={() => openPlaceholder(item)} className="supplement-button">{item}<ChevronRight size={14} /></button>)}

          <p className="sidebar-label space-top">NGUỒN THAM CHIẾU</p>
          <button onClick={() => openPlaceholder("15 bảng chỉ tiêu QĐ 3176")} className="supplement-button"><span>15 bảng chỉ tiêu QĐ 3176</span><ChevronRight size={14} /></button>
        </div>
        <div className="sidebar-bottom">
          <NavLabel icon={CircleHelp} active={view === "guide"} onClick={() => setView("guide")}>Hướng dẫn</NavLabel>
          <NavLabel icon={History} active={view === "version"} onClick={() => setView("version")}>Phiên bản</NavLabel>
          <NavLabel icon={UserRound} active={view === "author"} onClick={() => setView("author")}>Tác giả</NavLabel>
          <NavLabel icon={WalletCards} active={view === "coffee"} onClick={() => setView("coffee")}>Mời cà phê</NavLabel>
          <p className="footer-meta">v1.0.0 · Nguyễn Sơn Nam</p>
        </div>
      </aside>

      <main className="main-workspace">
        <header className="workspace-head">
          <img src="/manus-storage/tt12-ledger-texture_03495bba.png" alt="" className="ledger-texture" />
          <div className="head-content">
            <div className="record-band">
              <div className="dossier-code"><span>HỒ SƠ</span><b>TT12 / 2026</b><i /></div>
              <div className="record-slots">
                <div><span>MẪU ĐANG CHỌN</span><b>{selectedTemplate.label}</b></div>
                <div><span>NGUỒN</span><b>{recordSource}</b></div>
                <div className={`record-status ${statusTone}`}><span>TRẠNG THÁI</span><b>{statusText}</b></div>
              </div>
            </div>
            <div className="head-title-row"><div><h1>{title}</h1><p>{subtitle}</p></div><div className="head-actions"><Button variant="outline" onClick={() => inputRef.current?.click()} className="button-outline"><Upload size={16} />Import Excel</Button>{inspection && <Button onClick={() => exportReport(inspection)} className="button-cobalt"><Download size={16} />Xuất báo cáo</Button>}</div></div>
          </div>
        </header>

        <div className="workspace-body">
          {view === "lookup" && <>
            <section className="notice-strip"><Info size={18} /><p><strong>Lưu ý cập nhật danh mục:</strong> khi thay đổi thông tin, dùng 02 dòng dữ liệu: dòng cũ ghi <code>DEN_NGAY</code>; dòng mới ghi <code>TU_NGAY</code> và để trống <code>DEN_NGAY</code>.</p></section>
            <section className="validation-legend"><div><span className="legend-code">NGÔN NGỮ KIỂM ĐỊNH</span><p><strong>{selectedTemplate.label} đang được tra cứu;</strong> chưa có file Excel để kiểm định.</p></div><div className="legend-items"><span className="legend-item legend-valid"><CheckCircle2 size={14} />Hợp lệ</span><span className="legend-item legend-review"><AlertTriangle size={14} />Cần đối chiếu</span><span className="legend-item legend-block"><AlertTriangle size={14} />Lỗi chặn</span></div></section>
            <section className="lookup-tools"><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên chỉ tiêu, mã hoặc diễn giải…" /></label><div className="template-stamp"><FileText size={16} /><span>{selectedTemplate.label}</span><b>{selectedTemplate.headers.length} cột</b></div></section>
            <section className="document-card"><div className="document-card-head"><div><p className="eyebrow">CẤU TRÚC MẪU</p><h2>{selectedTemplate.label}</h2></div><a className="template-download" href={sourceTemplateUrl(selectedTemplate.id)} target="_blank" rel="noreferrer"><Download size={16} />Tải file mẫu</a></div><div className="table-wrap"><table className="reference-table"><thead><tr><th>STT</th><th>Chỉ tiêu</th><th>Định dạng</th><th>Kích thước</th><th>Diễn giải</th></tr></thead><tbody>{guideRows.map((field) => <tr key={field.name}><td>{String(field.index).padStart(2, "0")}</td><td><code>{field.name}</code></td><td>{field.format}</td><td>{field.size}</td><td>{field.note}</td></tr>)}</tbody></table></div>{!guideRows.length && <div className="table-empty">Không có chỉ tiêu nào khớp từ khóa tìm kiếm.</div>}</section>
            <section className="library-section"><div><p className="eyebrow">THƯ VIỆN TÀI LIỆU</p><h2>Nguồn đọc và file mẫu từ trang tham chiếu</h2></div><div className="library-grid">{library.map(([label, file]) => <a key={file} href={`https://tracuu-danhmuc-tt12.web.app/${file}`} target="_blank" rel="noreferrer" className="library-link"><BookOpen size={17} /><span>{label}</span><ChevronRight size={16} /></a>)}</div></section>
          </>}

          {view === "validate" && <>
            {!inspection ? <section className={`dropzone ${dragging ? "dropzone-active" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); void receiveFile(event.dataTransfer.files[0]); }}><EmptyInspection onUpload={() => inputRef.current?.click()} loading={loading} /></section> : <>
              <section className="inspection-summary"><div className="file-identity"><div className="file-icon"><FileSpreadsheet size={24} /></div><div><p className="eyebrow">NGUỒN IMPORT</p><h2>{inspection.fileName}</h2><p>Sheet: <strong>{inspection.sheetName}</strong> · hàng tiêu đề: <strong>{inspection.headerRow}</strong> · {inspection.rows.length} dòng dữ liệu · {formatBytes(inspection.fileSize)}</p></div></div><div className="detection-card"><p>NHẬN DIỆN TỰ ĐỘNG</p><strong>{inspection.detection?.template.label ?? "Chưa xác định"}</strong><div className="confidence"><span style={{ width: `${inspection.detection?.score ?? 0}%` }} /><b>{inspection.detection?.score ?? 0}%</b></div><small>{inspection.detection ? `${inspection.detection.matched}/${inspection.detection.template.headers.length} cột chuẩn trùng khớp` : "Cần kiểm tra tên cột hoặc dùng file mẫu"}</small></div></section>
              <section className="metrics-row"><button onClick={() => setSeverityFilter("all")} className={`metric-card ${severityFilter === "all" ? "metric-card-active" : ""}`}><LayoutList size={20} /><div><span>TỔNG PHÁT HIỆN</span><strong>{inspection.issues.length}</strong></div></button><button onClick={() => setSeverityFilter("error")} className={`metric-card metric-error ${severityFilter === "error" ? "metric-card-active" : ""}`}><AlertTriangle size={20} /><div><span>LỖI CHẶN</span><strong>{counts.error}</strong></div></button><button onClick={() => setSeverityFilter("warning")} className={`metric-card metric-warning ${severityFilter === "warning" ? "metric-card-active" : ""}`}><AlertTriangle size={20} /><div><span>CẦN XEM LẠI</span><strong>{counts.warning}</strong></div></button><button onClick={() => setSeverityFilter("info")} className={`metric-card metric-info ${severityFilter === "info" ? "metric-card-active" : ""}`}><Info size={20} /><div><span>THÔNG TIN</span><strong>{counts.info}</strong></div></button></section>
              <section className="issues-card"><div className="issues-card-head"><div><p className="eyebrow">KẾT QUẢ RÀ SOÁT</p><h2>{severityFilter === "all" ? "Toàn bộ phát hiện" : `Lọc theo ${severityVisual[severityFilter].label.toLowerCase()}`}</h2></div><div className="issue-actions"><span>{inspection.hasFormula ? "Có công thức trong file" : "Không phát hiện công thức"}</span><Button variant="outline" onClick={resetInspection} className="button-quiet"><RotateCcw size={16} />Nạp file khác</Button></div></div><div className="issue-table-wrap"><table className="issue-table"><thead><tr><th>Mức độ</th><th>Vị trí</th><th>Nhóm</th><th>Phát hiện</th><th>Hướng xử lý</th></tr></thead><tbody>{visibleIssues.map((item) => <tr key={item.id}><td><IssueBadge severity={item.severity} /></td><td><strong>{item.row ? `Dòng ${item.row}` : "Cấu trúc"}</strong><small>{item.column}</small></td><td>{item.category}</td><td>{item.message}</td><td>{item.suggestion}</td></tr>)}</tbody></table></div>{!visibleIssues.length && <div className="validation-clean"><CheckCircle2 size={24} /><div><strong>Không có phát hiện ở nhóm đang lọc.</strong><p>Chuyển bộ lọc hoặc xuất báo cáo để lưu kết quả kiểm định.</p></div></div>}</section>
              <section className="preview-card"><div><p className="eyebrow">XEM NHANH DỮ LIỆU</p><h2>8 dòng đầu tiên trong sheet đã đọc</h2></div><div className="preview-table-wrap"><table className="preview-table"><thead><tr>{inspection.headers.slice(0, 8).map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{inspection.rows.slice(0, 8).map((row) => <tr key={row.rowNumber}>{inspection.headers.slice(0, 8).map((header) => <td key={header}>{String(row.cells[header]?.value ?? "—")}</td>)}</tr>)}</tbody></table></div></section>
            </>}
          </>}

          {view === "guide" && <section className="article-card"><p className="eyebrow">QUY TRÌNH AN TOÀN</p><h2>Ba bước kiểm định trước khi gửi dữ liệu.</h2><div className="guide-steps"><div><span>01</span><h3>Chọn đúng file mẫu</h3><p>Dùng một trong sáu mẫu TT12. Giữ nguyên hàng tiêu đề; tên cột là chữ ký nhận diện của công cụ.</p></div><div><span>02</span><h3>Đọc báo cáo theo mức độ</h3><p>Sửa lỗi chặn trước, sau đó đối chiếu cảnh báo logic, tiền tệ, ngày tháng, mã và ký tự trong ô.</p></div><div><span>03</span><h3>Xuất và lưu vết</h3><p>Xuất báo cáo gồm Tóm tắt, Chi tiết và Nhật ký. Tệp kết quả dùng thời điểm GMT+7 trong tên file.</p></div></div><div className="guide-callout"><ShieldCheck size={22} /><p>Phiên bản đầu tiên kiểm tra tại máy người dùng. Công cụ không tự sửa file gốc và không ghi đè giá trị của bất kỳ ô trống nào.</p></div></section>}

          {view === "version" && <section className="article-card"><p className="eyebrow">PHIÊN BẢN</p><h2>TT12 Excel Validator <span>v1.0.0</span></h2><div className="version-list"><div><time>2026-08-25</time><div><h3>Khởi tạo chức năng kiểm định</h3><p>Bổ sung tra cứu Mẫu 01–06/DM, nhận diện bằng chữ ký cột, kiểm tra văn bản/định dạng, kiểm tra logic theo mẫu và xuất báo cáo Excel.</p></div></div></div><p className="small-meta">Múi giờ ứng dụng: Asia/Ho_Chi_Minh (GMT+7).</p></section>}

          {view === "author" && <section className="article-card identity-card"><img src="/manus-storage/tt12-validator-logo_43635a60.png" alt="" /><div><p className="eyebrow">TÁC GIẢ</p><h2>Nguyễn Sơn Nam <span>Nsnnam · NSN</span></h2><p>Tác giả các tiện ích HIS, Excel, dữ liệu y tế và công cụ nội bộ. Ứng dụng này được thiết kế để giảm lỗi định dạng và tăng khả năng tự kiểm tra trước khi gửi danh mục.</p><a href="https://github.com/Nsnnam" target="_blank" rel="noreferrer" className="author-link"><Github size={18} />github.com/Nsnnam</a></div></section>}

          {view === "coffee" && <section className="coffee-card"><div><p className="eyebrow">MỜI CÀ PHÊ</p><h2>Nếu công cụ hữu ích, hãy ủng hộ tác giả một tách cà phê.</h2><p>Quét mã VietQR để chuyển nhanh. Cảm ơn bạn đã ủng hộ các tiện ích dữ liệu y tế của Nguyễn Sơn Nam.</p><dl><div><dt>Chủ tài khoản</dt><dd>NGUYEN SON NAM</dd></div><div><dt>Số tài khoản</dt><dd>8855989777</dd></div><div><dt>Ngân hàng</dt><dd>BIDV — PGD Nguyễn Tất Thành</dd></div></dl></div><img src="/manus-storage/coffee-qr_1f98b8e8.jpg" alt="QR VietQR ủng hộ Nguyễn Sơn Nam" /></section>}
        </div>
      </main>
    </div>
  );
}
