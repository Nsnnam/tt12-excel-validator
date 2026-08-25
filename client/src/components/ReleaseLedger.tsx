/** Phong cách Hồ sơ điều hành: thông tin phát hành xuất hiện như sổ mục lục, không phải cửa sổ tiếp thị. */
import { APP_META } from "@/lib/meta";
import { ExternalLink } from "lucide-react";

export function ReleaseLedger() {
  return <details className="release-ledger">
    <summary><span>Thông tin phát hành</span><b>v{APP_META.version}</b></summary>
    <div className="release-ledger-content">
      <p><strong>{APP_META.name}</strong><br />{APP_META.role}</p>
      <dl><div><dt>Phiên bản</dt><dd>{APP_META.version} · {APP_META.date}</dd></div><div><dt>Múi giờ</dt><dd>{APP_META.timezone} (GMT+7)</dd></div><div><dt>Tác giả</dt><dd>{APP_META.author}</dd></div></dl>
      <p className="release-heading">Lịch sử phiên bản</p>
      <ol>{APP_META.changelog.map((entry) => <li key={entry.version}><b>v{entry.version}</b><span>{entry.changes[0]}</span></li>)}</ol>
      <p className="release-heading">Mời cà phê</p>
      <p>{APP_META.coffee.accountName}<br />{APP_META.coffee.accountNumber} · {APP_META.coffee.bank}</p>
      <a href={APP_META.github} target="_blank" rel="noreferrer">Mở GitHub dự án <ExternalLink size={12} /></a>
    </div>
  </details>;
}
