import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import json
import os

with open('client/src/data/qd3556-upstream-diff.json', 'r', encoding='utf-8') as f:
    diff_data = json.load(f)

wb = openpyxl.Workbook()
wb.remove(wb.active)

# Color styles
NAVY_HEADER = PatternFill(start_color="10385B", end_color="10385B", fill_type="solid")
TEAL_HEADER = PatternFill(start_color="1457C8", end_color="1457C8", fill_type="solid")
SUB_HEADER = PatternFill(start_color="D9E7F3", end_color="D9E7F3", fill_type="solid")
ZEBRA_FILL = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
HIGHLIGHT_CHANGE = PatternFill(start_color="FFFBEB", end_color="FFFBEB", fill_type="solid")
ACCENT_GREEN = PatternFill(start_color="ECFDF5", end_color="ECFDF5", fill_type="solid")
ACCENT_RED = PatternFill(start_color="FEF2F2", end_color="FEF2F2", fill_type="solid")
ACCENT_PURPLE = PatternFill(start_color="F5F3FF", end_color="F5F3FF", fill_type="solid")

FONT_TITLE = Font(name="Segoe UI", size=15, bold=True, color="10385B")
FONT_SUBTITLE = Font(name="Segoe UI", size=10, italic=True, color="556C82")
FONT_HEADER_WHITE = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
FONT_HEADER_DARK = Font(name="Segoe UI", size=10, bold=True, color="10385B")
FONT_REGULAR = Font(name="Segoe UI", size=9.5, color="1E293B")
FONT_BOLD = Font(name="Segoe UI", size=9.5, bold=True, color="102A43")
FONT_BADGE = Font(name="Segoe UI", size=9, bold=True, color="0E3E92")
FONT_CHANGE = Font(name="Segoe UI", size=9.5, color="854D0E")

BORDER_THIN = Border(
    left=Side(style='thin', color='CBD5E1'),
    right=Side(style='thin', color='CBD5E1'),
    top=Side(style='thin', color='CBD5E1'),
    bottom=Side(style='thin', color='CBD5E1')
)
BORDER_HEADER = Border(
    left=Side(style='thin', color='64748B'),
    right=Side(style='thin', color='64748B'),
    top=Side(style='medium', color='10385B'),
    bottom=Side(style='medium', color='10385B')
)

ALIGN_CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
ALIGN_LEFT = Alignment(horizontal="left", vertical="top", wrap_text=True)
ALIGN_RIGHT = Alignment(horizontal="right", vertical="top")

# -------------------------------------------------------------
# SHEET 1: TỔNG QUAN
# -------------------------------------------------------------
ws1 = wb.create_sheet(title="Tong_Quan")
ws1.views.sheetView[0].showGridLines = True

ws1.cell(1, 1, "BÁO CÁO SO SÁNH THAY ĐỔI CHUẨN DỮ LIỆU ĐẦU RA KCB BHYT").font = FONT_TITLE
ws1.cell(2, 1, "QUYẾT ĐỊNH SỐ 3556/QĐ-BYT (KÝ NGÀY 18/11/2026) SO VỚI QUYẾT ĐỊNH SỐ 3176/QĐ-BYT").font = Font(name="Segoe UI", size=11, bold=True, color="1457C8")
ws1.cell(3, 1, "Bộ Y tế ban hành ngày 18/11/2026 · Thứ trưởng Đào Xuân Cơ ký · Hiệu lực thi hành kể từ ngày ký").font = FONT_SUBTITLE

# Box thống kê số liệu
ws1.cell(5, 1, "I. THỐNG KÊ PHÂN LOẠI THAY ĐỔI THEO CHUẨN ĐỐI CHIẾU UPSTREAM (484 CHỈ TIÊU)").font = FONT_HEADER_DARK

counts = diff_data['counts']
kpi_data = [
    ("Trường mới bổ sung (new)", counts.get("new", 3), "Thêm MA_BENH_KHAC (B1), T_BNCCT_LK (B1), NGAY_VAO_NOI_TRU (B7)"),
    ("Sửa đổi diễn giải (modified)", counts.get("modified", 60), "Cập nhật nội dung, tăng kích thước n, đa mã ngăn cách dấu chấm phẩy"),
    ("Bổ sung diễn giải (supplemented)", counts.get("supplemented", 21), "Bổ sung hướng dẫn CCCD/định danh khi chưa có GPHN, lưu ý thầu thuốc"),
    ("Quy định để giá trị null (null)", counts.get("null", 8), "MAHUYEN_CU_TRU (B1,9,12), T_THUOC & T_VTYT (B1), MA_BAC_SI (B13), MA_TTDV (B14)"),
    ("Cần đối chiếu (review)", counts.get("review", 2), "TT_THAU (B2) và Kiểu/Kích thước Bảng 6 (khác tệp 2024 nhưng cột sửa đổi để trống)"),
    ("Dẫn lại QĐ 1931/QĐ-BYT (inherited)", counts.get("inherited", 1), "SO_DANG_KY (B2) dẫn lại hướng dẫn mã hóa thuốc hiếm UBND.YYYY.X.S"),
    ("Lịch sử QĐ 3176 (historical)", counts.get("historical", 3), "TINH_TRANG_CT, TEN_DICH_VU, TEN_THUOC tại Bảng 13 đã có chỉ dẫn từ QĐ 3176"),
    ("Chưa thấy sửa đổi mới (unchanged)", counts.get("unchanged", 386), "Giữ nguyên quy định chuẩn đầu ra theo QĐ 3176 tệp năm 2024"),
]

row_idx = 7
ws1.cell(row_idx, 1, "Phân loại thay đổi").font = FONT_HEADER_WHITE
ws1.cell(row_idx, 1).fill = NAVY_HEADER
ws1.cell(row_idx, 2, "Số lượng chỉ tiêu").font = FONT_HEADER_WHITE
ws1.cell(row_idx, 2).fill = NAVY_HEADER
ws1.cell(row_idx, 3, "Tỷ lệ (%)").font = FONT_HEADER_WHITE
ws1.cell(row_idx, 3).fill = NAVY_HEADER
ws1.cell(row_idx, 4, "Diễn giải & Ý nghĩa nghiệp vụ").font = FONT_HEADER_WHITE
ws1.cell(row_idx, 4).fill = NAVY_HEADER

for item, count, desc in kpi_data:
    row_idx += 1
    pct = round((count / 484) * 100, 1)
    ws1.cell(row_idx, 1, item).font = FONT_BOLD
    ws1.cell(row_idx, 2, count).font = FONT_BOLD
    ws1.cell(row_idx, 2).alignment = ALIGN_CENTER
    ws1.cell(row_idx, 3, f"{pct}%").font = FONT_REGULAR
    ws1.cell(row_idx, 3).alignment = ALIGN_CENTER
    ws1.cell(row_idx, 4, desc).font = FONT_REGULAR

    fill = ACCENT_GREEN if "new" in item else HIGHLIGHT_CHANGE if "modified" in item or "supplemented" in item else ACCENT_PURPLE if "null" in item else ZEBRA_FILL
    for col in range(1, 5):
        ws1.cell(row_idx, col).border = BORDER_THIN

row_idx += 2
ws1.cell(row_idx, 1, "II. THÔNG TIN TOÀN VẸN CÁC TỆP NGUỒN (SHA-256)").font = FONT_HEADER_DARK
row_idx += 1

sources_info = [
    ("Tệp văn bản pháp lý PDF", "BYT-3556.QD-Sua-doi-bo-sung-QD3176.signed.pdf", "a8212f076a350855d7e2c0d61bb9acb5416429b568163ebc855e3a5a7657200f", "577 KB (Ký điện tử Bộ Y tế lúc 16:57:41 ngày 18/11/2026)"),
    ("Bảng chuẩn dữ liệu Excel mới", "261116_Chuan_du_lieu_dau_ra_sua_3176_Final.xlsx", "d2894506a7ec8f70f59f4b7b4d9873757131ece757be991ac7fa99f70387f0c0", "132 KB (16 sheet chuẩn dữ liệu sửa đổi 3176)"),
    ("Bảng đối chiếu cũ năm 2024", "chuan-dau-ra-3176-2024.xls", "066de28331227c819d6fb51e1ea8d9d078d38fba98485f4defab372ad360c91b", "540 KB (Bảng chuẩn đối chiếu ban hành ngày 28/10/2024)"),
]

ws1.cell(row_idx, 1, "Tệp nguồn").font = FONT_HEADER_WHITE
ws1.cell(row_idx, 1).fill = TEAL_HEADER
ws1.cell(row_idx, 2, "Tên file").font = FONT_HEADER_WHITE
ws1.cell(row_idx, 2).fill = TEAL_HEADER
ws1.cell(row_idx, 3, "Mã băm SHA-256").font = FONT_HEADER_WHITE
ws1.cell(row_idx, 3).fill = TEAL_HEADER
ws1.cell(row_idx, 4, "Ghi chú xác thực").font = FONT_HEADER_WHITE
ws1.cell(row_idx, 4).fill = TEAL_HEADER

for label, fname, sha, note in sources_info:
    row_idx += 1
    ws1.cell(row_idx, 1, label).font = FONT_BOLD
    ws1.cell(row_idx, 2, fname).font = FONT_REGULAR
    ws1.cell(row_idx, 3, sha).font = Font(name="Consolas", size=8.5, color="10385B")
    ws1.cell(row_idx, 4, note).font = FONT_REGULAR
    for col in range(1, 5):
        ws1.cell(row_idx, col).border = BORDER_THIN

ws1.column_dimensions['A'].width = 35
ws1.column_dimensions['B'].width = 45
ws1.column_dimensions['C'].width = 70
ws1.column_dimensions['D'].width = 60

# -------------------------------------------------------------
# SHEET 2: CHI TIẾT 98 CHỈ TIÊU CÓ THAY ĐỔI HOẶC ĐỐI CHIẾU
# -------------------------------------------------------------
ws2 = wb.create_sheet(title="Chi_Tiet_Thay_Doi")
ws2.views.sheetView[0].showGridLines = True

headers_s2 = [
    "STT", "Bảng dữ liệu", "Mã chỉ tiêu", "Phân loại", "Tóm tắt thay đổi chính",
    "Kích thước / Kiểu (Cũ → Mới)", "Quy định cũ (QĐ 3176/4750/130)",
    "Nội dung sửa đổi, bổ sung (QĐ 3556)", "Ghi chú & Cần đối chiếu", "Vị trí ô nguồn"
]

ws2.cell(1, 1, "DANH SÁCH CHI TIẾT CÁC CHỈ TIÊU THAY ĐỔI & CẦN ĐỐI CHIẾU THEO QĐ 3556/QĐ-BYT").font = FONT_TITLE
ws2.cell(2, 1, "Nguồn: Tệp chuẩn dữ liệu 2026 đối chiếu với Tệp chuẩn dữ liệu 2024 · Bộ Y tế ban hành ngày 18/11/2026").font = FONT_SUBTITLE

for col_idx, h in enumerate(headers_s2, start=1):
    c = ws2.cell(4, col_idx, h)
    c.font = FONT_HEADER_WHITE
    c.fill = NAVY_HEADER
    c.alignment = ALIGN_CENTER
    c.border = BORDER_HEADER

# Filter out unchanged records
changed_records = [r for r in diff_data['records'] if r['status'] != 'unchanged']

table_titles = {t['id']: t['title'] for t in diff_data['tables']}

status_labels = {
    'modified': 'Sửa đổi',
    'supplemented': 'Bổ sung',
    'new': 'Trường mới',
    'null': 'Giá trị null',
    'review': 'Cần đối chiếu',
    'inherited': 'Dẫn lại QĐ 1931',
    'historical': 'Lịch sử QĐ 3176',
    'repeal': 'Bãi bỏ',
}

status_colors = {
    'new': ACCENT_GREEN,
    'modified': HIGHLIGHT_CHANGE,
    'supplemented': HIGHLIGHT_CHANGE,
    'null': ACCENT_PURPLE,
    'review': ACCENT_RED,
    'inherited': ZEBRA_FILL,
    'historical': ZEBRA_FILL,
}

for i, r in enumerate(changed_records, start=1):
    row_num = 4 + i
    table_name = table_titles.get(r['tableId'], r['tableId'])
    meta_str = "; ".join([f"{m['label']}: {m['before']} → {m['after']}" for m in r.get('metadataChanges', [])])
    
    # Old text from before.history
    before_obj = r.get('before') or {}
    after_obj = r.get('after') or {}
    old_history = before_obj.get('history', [])
    old_text = "\n---\n".join([f"[{h.get('label', '')}]: {h.get('text', '')}" for h in old_history]) if old_history else "Chưa có trường này trong bảng tương ứng của tệp năm 2024."
    
    # New amendment text
    new_text = after_obj.get('amendment', '') or r.get('summary', '')
    
    notes_str = "\n".join(r.get('notes', []) + r.get('repeal', []))
    cell_pos = f"{after_obj.get('sheet', '')} : {after_obj.get('amendmentCell', '') or before_obj.get('amendmentCell', '')}"
    
    ws2.cell(row_num, 1, i).alignment = ALIGN_CENTER
    ws2.cell(row_num, 2, table_name).font = FONT_BOLD
    ws2.cell(row_num, 3, r['field']).font = FONT_BADGE
    ws2.cell(row_num, 4, status_labels.get(r['status'], r['status'])).alignment = ALIGN_CENTER
    ws2.cell(row_num, 5, r['summary']).font = FONT_REGULAR
    ws2.cell(row_num, 6, meta_str).font = Font(name="Consolas", size=9, bold=True, color="92400E")
    ws2.cell(row_num, 7, old_text).font = FONT_REGULAR
    ws2.cell(row_num, 8, new_text).font = FONT_CHANGE
    ws2.cell(row_num, 9, notes_str).font = FONT_REGULAR
    ws2.cell(row_num, 10, cell_pos).font = Font(name="Consolas", size=8.5, color="64748B")
    
    fill = status_colors.get(r['status'], ZEBRA_FILL if i % 2 == 0 else PatternFill(fill_type=None))
    if fill.fill_type:
        ws2.cell(row_num, 4).fill = fill
    
    for c_i in range(1, 11):
        cell = ws2.cell(row_num, c_i)
        cell.border = BORDER_THIN
        if c_i in [5, 7, 8, 9]:
            cell.alignment = ALIGN_LEFT

ws2.column_dimensions['A'].width = 6
ws2.column_dimensions['B'].width = 25
ws2.column_dimensions['C'].width = 20
ws2.column_dimensions['D'].width = 16
ws2.column_dimensions['E'].width = 40
ws2.column_dimensions['F'].width = 25
ws2.column_dimensions['G'].width = 50
ws2.column_dimensions['H'].width = 50
ws2.column_dimensions['I'].width = 30
ws2.column_dimensions['J'].width = 20

# -------------------------------------------------------------
# SHEET 3: QUY TẮC ĐIỀU 2
# -------------------------------------------------------------
ws3 = wb.create_sheet(title="Quy_Tac_Dieu_2_XML")
ws3.views.sheetView[0].showGridLines = True

ws3.cell(1, 1, "HƯỚNG DẪN KỸ THUẬT TRIỂN KHAI ĐIỀU 2 QUYẾT ĐỊNH 3556/QĐ-BYT").font = FONT_TITLE
ws3.cell(2, 1, "Nghiệp vụ ca bệnh khám ngoại trú có chỉ định cận lâm sàng rồi chuyển nhập viện nội trú").font = FONT_SUBTITLE

content_dieu2 = [
    ("1. Bối cảnh & Thách thức nghiệp vụ", "Trước đây khi người bệnh đến khám ngoại trú, bác sĩ chỉ định các xét nghiệm, chẩn đoán hình ảnh (CLS), sau đó có diễn biến nặng hoặc đủ điều kiện nhập viện điều trị nội trú, thường xảy ra vướng mắc trong việc ghi nhận mức hưởng BHYT ngoại trú so với nội trú (đặc biệt khi trái tuyến hoặc có mức hưởng nội/ngoại trú khác nhau). Một số nơi chỉ định lại xét nghiệm gây lãng phí hoặc bị xuất toán do trùng lặp chỉ định."),
    ("2. Quy định tại Điều 2 QĐ 3556/QĐ-BYT", "Cơ sở khám bệnh, chữa bệnh thực hiện:\n- Xác định giá trị mức hưởng (MUC_HUONG) tương ứng cho từng dịch vụ KCB ngoại trú, nội trú tại Bảng 2 (Thuốc) và Bảng 3 (Dịch vụ kỹ thuật & Vật tư y tế).\n- Được sử dụng lại kết quả cận lâm sàng ngoại trú trong quá trình điều trị nội trú, không phải chỉ định lại xét nghiệm trùng lặp."),
    ("3. Công thức tính tiền mới tại Bảng 2 & Bảng 3", "- Tiền người bệnh tự trả: T_BNTT = THANH_TIEN_BV − T_BHTT − T_BNCCT (bãi bỏ diễn giải QĐ 3176 cũ).\n- Tiền người bệnh cùng chi trả: T_BNCCT = THANH_TIEN_BH × MUC_HUONG_BH/100 − T_BHTT (bãi bỏ diễn giải QĐ 3176 cũ)."),
    ("4. Các trường dữ liệu liên đới chính", "- Bảng 1: T_BNCCT_LK (tiền cùng chi trả lũy kế), MA_BENH_KHAC (chẩn đoán phân biệt/loại trừ).\n- Bảng 7: NGAY_VAO_NOI_TRU (thời điểm vào nội trú, yyyymmddHHMM).\n- Bảng 2 & 3: MUC_HUONG, T_BHTT, T_BNCCT, T_BNTT tương ứng với từng giai đoạn KCB ngoại trú / nội trú.")
]

r_d2 = 4
for heading, body in content_dieu2:
    ws3.cell(r_d2, 1, heading).font = FONT_BOLD
    ws3.cell(r_d2, 1).fill = SUB_HEADER
    r_d2 += 1
    cell_body = ws3.cell(r_d2, 1, body)
    cell_body.font = FONT_REGULAR
    cell_body.alignment = ALIGN_LEFT
    r_d2 += 2

ws3.column_dimensions['A'].width = 110

# -------------------------------------------------------------
# SHEET 4: VĂN BẢN PHÁP QUY DẪN CHIẾU MỚI
# -------------------------------------------------------------
ws4 = wb.create_sheet(title="Van_Ban_Phap_Quy")
ws4.views.sheetView[0].showGridLines = True

ws4.cell(1, 1, "DANH MỤC CÁC VĂN BẢN PHÁP QUY DẪN CHIẾU MỚI TRONG QĐ 3556/QĐ-BYT").font = FONT_TITLE
ws4.cell(2, 1, "Các cơ sở khám chữa bệnh cần cập nhật trong quy chế kiểm soát và cấu hình HIS").font = FONT_SUBTITLE

vb_headers = ["STT", "Số hiệu văn bản", "Cơ quan ban hành", "Ngày ban hành", "Trích yếu nội dung", "Áp dụng vào chuẩn đầu ra"]
for c_i, h in enumerate(vb_headers, 1):
    c = ws4.cell(4, c_i, h)
    c.font = FONT_HEADER_WHITE
    c.fill = NAVY_HEADER
    c.alignment = ALIGN_CENTER
    c.border = BORDER_HEADER

vb_list = [
    (1, "QĐ 3556/QĐ-BYT", "Bộ Y tế", "18/11/2026", "Sửa đổi, bổ sung QĐ 3176 chuẩn dữ liệu đầu ra KCB BHYT", "Hiệu lực kể từ ngày ký, 15 bảng sửa đổi"),
    (2, "QĐ 19/2025/QĐ-TTg", "Thủ tướng Chính phủ", "30/06/2025", "Ban hành Danh mục mã số đơn vị hành chính 3 cấp", "Thay thế toàn bộ mã tỉnh, huyện, xã cũ"),
    (3, "QĐ 1804/QĐ-BYT", "Bộ Y tế", "19/06/2026", "Quy định mã loại hình KCB và danh mục kèm theo", "Áp dụng cho MA_LOAI_KCB (tăng size lên 10, phân tách bằng ;)"),
    (4, "QĐ 3276/QĐ-BYT & QĐ 2917/QĐ-BYT", "Bộ Y tế", "15/09/2026", "Ban hành mã đối tượng KCB (Phụ lục 1) và mã nhiên liệu (Phụ lục 2)", "Áp dụng cho MA_DOITUONG_KCB (tăng size lên 50, phân tách bằng ;)"),
    (5, "Thông tư 01/2025/TT-BYT", "Bộ Y tế", "2025", "Quy định biểu mẫu chuyển viện và hẹn tái khám", "Đồng bộ Bảng 13 (Phụ lục VI) và Bảng 14 (Phụ lục V)"),
    (6, "QĐ 1931/QĐ-BYT", "Bộ Y tế", "29/06/2026", "Hướng dẫn mã hóa số đăng ký thuốc hiếm cấp phép bởi UBND cấp tỉnh", "Áp dụng cấu trúc UBND.YYYY.X.S cho trường SO_DANG_KY"),
    (7, "Luật Căn cước 2023 & VNeID", "Quốc hội / BCA", "2023 - 2026", "Quy định về thẻ Căn cước và định danh điện tử", "Áp dụng cho MA_TTDV, MA_THE_BHYT, MA_BHXH nới lỏng n ký tự")
]

for row_i, vb in enumerate(vb_list, 5):
    for col_i, val in enumerate(vb, 1):
        cell = ws4.cell(row_i, col_i, val)
        cell.font = FONT_REGULAR
        cell.border = BORDER_THIN
        if col_i in [1, 4]:
            cell.alignment = ALIGN_CENTER
        elif col_i == 2:
            cell.font = FONT_BOLD

ws4.column_dimensions['A'].width = 6
ws4.column_dimensions['B'].width = 30
ws4.column_dimensions['C'].width = 25
ws4.column_dimensions['D'].width = 15
ws4.column_dimensions['E'].width = 50
ws4.column_dimensions['F'].width = 45

# Save workbook to both docs and client/public/documents
out1 = "docs/So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx"
out2 = "client/public/documents/So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx"
wb.save(out1)
wb.save(out2)
print(f"Generated {out1} and {out2} with {len(changed_records)} changed records!")
