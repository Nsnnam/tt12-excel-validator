import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import json
import os

with open('scratch_qd3556_analysis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

wb = openpyxl.Workbook()
# Remove default sheet
wb.remove(wb.active)

# Color styles
NAVY_HEADER = PatternFill(start_color="10385B", end_color="10385B", fill_type="solid")
TEAL_HEADER = PatternFill(start_color="1457C8", end_color="1457C8", fill_type="solid")
SUB_HEADER = PatternFill(start_color="D9E7F3", end_color="D9E7F3", fill_type="solid")
ZEBRA_FILL = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
HIGHLIGHT_CHANGE = PatternFill(start_color="FFFBEB", end_color="FFFBEB", fill_type="solid") # soft amber
ACCENT_GREEN = PatternFill(start_color="ECFDF5", end_color="ECFDF5", fill_type="solid")
ACCENT_RED = PatternFill(start_color="FEF2F2", end_color="FEF2F2", fill_type="solid")

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
ws1.cell(2, 1, "QUYẾT ĐỊNH SỐ 3556/QĐ-BYT NGÀY 16/11/2026 SO VỚI QUYẾT ĐỊNH SỐ 3176/QĐ-BYT").font = Font(name="Segoe UI", size=11, bold=True, color="1457C8")
ws1.cell(3, 1, "Bộ Y tế ban hành ngày 16/11/2026 · Thứ trưởng Đào Xuân Cơ ký · Hiệu lực thi hành kể từ ngày ký").font = FONT_SUBTITLE

# Box thống kê số liệu
ws1.cell(5, 1, "I. THỐNG KÊ SỐ LƯỢNG THAY ĐỔI THEO CÁC BẢNG CHUẨN ĐẦU RA").font = FONT_HEADER_DARK

headers_s1 = ["STT", "Mã Bảng", "Tên Bảng Chỉ Tiêu Chuẩn Đầu Ra", "Tổng số chỉ tiêu", "Số trường thay đổi/bổ sung", "Tỷ lệ thay đổi", "Mức độ ảnh hưởng HIS"]
for c_idx, h in enumerate(headers_s1, start=1):
    cell = ws1.cell(6, c_idx, h)
    cell.fill = NAVY_HEADER
    cell.font = FONT_HEADER_WHITE
    cell.alignment = ALIGN_CENTER
    cell.border = BORDER_HEADER

row_idx = 7
total_fields_all = 0
total_changes_all = 0

stt_t = 1
for sheetname, info in data.items():
    tf = info['total_fields']
    cc = info['change_count']
    total_fields_all += tf
    total_changes_all += cc
    
    clean_name = sheetname.strip()
    rate = f"{(cc / tf * 100):.1f}%" if tf > 0 else "0%"
    
    impact = "Cao" if cc >= 8 else ("Trung bình" if cc >= 4 else ("Thấp" if cc > 0 else "Không đổi"))
    
    ws1.cell(row_idx, 1, stt_t).alignment = ALIGN_CENTER
    ws1.cell(row_idx, 2, sheetname.replace("Bang ", "Bảng ").strip()).alignment = ALIGN_CENTER
    ws1.cell(row_idx, 3, clean_name).alignment = ALIGN_LEFT
    ws1.cell(row_idx, 4, tf).alignment = ALIGN_CENTER
    ws1.cell(row_idx, 5, cc).alignment = ALIGN_CENTER
    ws1.cell(row_idx, 6, rate).alignment = ALIGN_CENTER
    cell_impact = ws1.cell(row_idx, 7, impact)
    cell_impact.alignment = ALIGN_CENTER
    
    if impact == "Cao":
        cell_impact.fill = ACCENT_RED
        cell_impact.font = Font(name="Segoe UI", size=9.5, bold=True, color="991B1B")
    elif impact == "Trung bình":
        cell_impact.fill = HIGHLIGHT_CHANGE
        cell_impact.font = Font(name="Segoe UI", size=9.5, bold=True, color="854D0E")
    elif impact == "Không đổi":
        cell_impact.fill = ZEBRA_FILL
        cell_impact.font = Font(name="Segoe UI", size=9.5, color="64748B")
    else:
        cell_impact.fill = ACCENT_GREEN
        cell_impact.font = Font(name="Segoe UI", size=9.5, color="166534")

    for col in range(1, 8):
        c = ws1.cell(row_idx, col)
        c.border = BORDER_THIN
        if col != 7:
            c.font = FONT_REGULAR
            if row_idx % 2 == 0:
                c.fill = ZEBRA_FILL

    row_idx += 1
    stt_t += 1

# Total row
ws1.cell(row_idx, 1, "")
ws1.cell(row_idx, 2, "TỔNG CỘNG").alignment = ALIGN_CENTER
ws1.cell(row_idx, 3, "16 bảng chuẩn đầu ra dữ liệu KCB BHYT").font = FONT_BOLD
ws1.cell(row_idx, 4, total_fields_all).alignment = ALIGN_CENTER
ws1.cell(row_idx, 5, total_changes_all).alignment = ALIGN_CENTER
ws1.cell(row_idx, 6, f"{(total_changes_all / total_fields_all * 100):.1f}%").alignment = ALIGN_CENTER
ws1.cell(row_idx, 7, "93 TRƯỜNG THAY ĐỔI").alignment = ALIGN_CENTER

for col in range(1, 8):
    c = ws1.cell(row_idx, col)
    c.fill = SUB_HEADER
    c.font = FONT_HEADER_DARK
    c.border = BORDER_HEADER

# Khối tóm tắt văn bản & căn cứ
row_idx += 3
ws1.cell(row_idx, 1, "II. NGUYÊN TẮC VÀ VĂN BẢN QUY PHẠM PHÁP LUẬT DẪN CHIẾU MỚI").font = FONT_HEADER_DARK
row_idx += 1

principles = [
    ("1. Quy định ca bệnh ngoại trú làm CLS chuyển nhập viện nội trú (Điều 2 QĐ 3556)", 
     "Xác định giá trị mức hưởng (MUC_HUONG) tương ứng tại Bảng 2 và Bảng 3 đối với từng dịch vụ ngoại trú, nội trú. Cơ sở KCB được sử dụng lại kết quả CLS đã thực hiện trong lần khám ngoại trú để điều trị nội trú."),
    ("2. Cập nhật mã đơn vị hành chính 3 cấp mới theo Quyết định số 19/2025/QĐ-TTg ngày 30/6/2025", 
     "Thay thế toàn bộ quy định mã tỉnh/huyện/xã cũ (QĐ 124, TT 07/2016) bằng mã tại Phụ lục I và Phụ lục II QĐ 19/2025/QĐ-TTg trên tất cả các bảng dữ liệu (Bảng 1, 7, 8, 9, 10, 11...)."),
    ("3. Mã loại hình KCB và mã đối tượng KCB", 
     "Áp dụng mã loại KCB theo QĐ 1804/QĐ-BYT (19/6/2026), mã đối tượng theo QĐ 3276/QĐ-BYT và QĐ 2917/QĐ-BYT. Cho phép ghi nhiều mã ngăn cách bằng dấu chấm phẩy ';' (tối đa 10 ký tự đối với loại KCB, 50 ký tự đối với đối tượng KCB)."),
    ("4. Nới lỏng kích thước tối đa lên 'n' ký tự", 
     "Mã thẻ BHYT, hạn thẻ từ - đến (GT_THE_TU, GT_THE_DEN), mã số BHXH được tăng kích thước lên 'n' ký tự để chống tràn chuỗi khi nối nhiều mã thẻ/hạn thẻ mới."),
    ("5. Đồng bộ biểu mẫu theo Thông tư số 01/2025/TT-BYT và Nghị định số 188/2025/NĐ-CP", 
     "Cập nhật số Phiếu chuyển cơ sở KCB theo Phụ lục VI TT 01/2025/TT-BYT; Phiếu hẹn khám lại theo Phụ lục V TT 01/2025/TT-BYT. Cho phép để giá trị null một số mã bác sĩ chỉ định/người ký (MA_BAC_SI, MA_TTDV)."),
    ("6. Hướng dẫn địa chỉ cư trú người bệnh (DIA_CHI)", 
     "Quy định chuẩn theo CSDL quốc gia về dân cư; hướng dẫn chi tiết trường hợp trẻ sơ sinh chưa có thẻ BHYT, trẻ bị bỏ rơi và người nước ngoài.")
]

for title_p, desc_p in principles:
    ws1.merge_cells(start_row=row_idx, start_column=1, end_row=row_idx, end_column=3)
    ws1.merge_cells(start_row=row_idx, start_column=4, end_row=row_idx, end_column=7)
    
    c1 = ws1.cell(row_idx, 1, title_p)
    c1.font = FONT_BOLD
    c1.fill = ZEBRA_FILL
    c1.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    
    c2 = ws1.cell(row_idx, 4, desc_p)
    c2.font = FONT_REGULAR
    c2.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
    
    for c in range(1, 8):
        ws1.cell(row_idx, c).border = BORDER_THIN
    row_idx += 1

# -------------------------------------------------------------
# SHEET 2: CHI TIẾT 93 THAY ĐỔI
# -------------------------------------------------------------
ws2 = wb.create_sheet(title="Chi_Tiet_93_Thay_Doi")
ws2.views.sheetView[0].showGridLines = True

ws2.cell(1, 1, "BẢNG SO SÁNH CHI TIẾT 93 TRƯỜNG DỮ LIỆU ĐƯỢC SỬA ĐỔI, BỔ SUNG THEO QĐ 3556/QĐ-BYT").font = FONT_TITLE
ws2.cell(2, 1, "Đối chiếu trực tiếp từng trường dữ liệu giữa Quyết định số 3176/QĐ-BYT (cũ) và Quyết định số 3556/QĐ-BYT (mới)").font = FONT_SUBTITLE

headers_s2 = [
    "STT", 
    "Bảng chỉ tiêu", 
    "STT trường", 
    "Mã chỉ tiêu", 
    "Kiểu DL", 
    "Kích thước", 
    "Nội dung quy định theo QĐ 3176 (Cũ)", 
    "NỘI DUNG SỬA ĐỔI, BỔ SUNG THEO QĐ 3556 (MỚI)", 
    "Phân loại tính chất thay đổi",
    "Tác động hệ thống HIS / Ghi chú"
]

for c_idx, h in enumerate(headers_s2, start=1):
    cell = ws2.cell(4, c_idx, h)
    cell.fill = TEAL_HEADER
    cell.font = FONT_HEADER_WHITE
    cell.alignment = ALIGN_CENTER
    cell.border = BORDER_HEADER

row_idx = 5
change_stt = 1

def categorize_change(chi_tieu, change_text):
    text_lower = change_text.lower()
    if '19/2025/qđ-ttg' in text_lower or 'mã đơn vị hành chính' in text_lower or 'tỉnh' in text_lower or 'huyện' in text_lower or 'xã' in text_lower:
        return ("Địa giới hành chính", "Cập nhật mã hành chính 3 cấp mới theo QĐ 19/2025/QĐ-TTg")
    elif 'tăng kích thước tối đa lên "n"' in text_lower or 'tăng kích thước' in text_lower or 'kích thước tối đa' in text_lower:
        return ("Kích thước trường", "Mở rộng độ dài trường dữ liệu, chống lỗi tràn chuỗi")
    elif 'ma_loai_kcb' in chi_tieu.lower() or 'loại hình kbcb' in text_lower or '1804/qđ-byt' in text_lower:
        return ("Mã loại hình KCB", "Đồng bộ QĐ 1804/QĐ-BYT, cho phép nhiều mã ngăn cách ';'")
    elif 'ma_doituong_kcb' in chi_tieu.lower() or 'đối tượng đến kbcb' in text_lower:
        return ("Mã đối tượng KCB", "Đồng bộ QĐ 3276 & QĐ 2917, cho phép nhiều mã ngăn cách ';'")
    elif 'để giá trị null' in text_lower or 'null' in text_lower:
        return ("Quy định Null", "Cho phép để trống/null, giảm ràng buộc cứng khi trích xuất")
    elif '01/2025/tt-byt' in text_lower or 'phiếu chuyển' in text_lower or 'phiếu hẹn' in text_lower:
        return ("Biểu mẫu TT 01/2025", "Đồng bộ mẫu giấy chuyển tuyến/hẹn tái khám theo TT 01/2025/TT-BYT")
    elif 'dia_chi' in chi_tieu.lower() or 'cơ sở dữ liệu quốc gia về dân cư' in text_lower:
        return ("Địa chỉ cư trú", "Chuẩn hóa theo CSDL dân cư, bổ sung quy tắc trẻ sơ sinh/người nước ngoài")
    elif 'tên thương mại' in text_lower:
        return ("Tên thương mại VTYT", "Ghi tên thương mại VTYT theo quyết định trúng thầu")
    elif 'quyết toán' in text_lower or 'mẫu 06/bh' in text_lower or '12/2026/tt-btc' in text_lower:
        return ("Thanh quyết toán BHYT", "Đồng bộ Thông tư 12/2026/TT-BTC")
    else:
        return ("Diễn giải & Nghiệp vụ", "Chuẩn hóa quy tắc nghiệp vụ KCB BHYT")

for sheetname, info in data.items():
    clean_sheet = sheetname.strip()
    for c in info['changes']:
        category, note = categorize_change(c['chi_tieu'], c['sua_doi_3556'])
        
        ws2.cell(row_idx, 1, change_stt).alignment = ALIGN_CENTER
        ws2.cell(row_idx, 2, clean_sheet).alignment = ALIGN_LEFT
        ws2.cell(row_idx, 3, c['stt']).alignment = ALIGN_CENTER
        ws2.cell(row_idx, 4, c['chi_tieu']).alignment = ALIGN_LEFT
        ws2.cell(row_idx, 5, c['kieu']).alignment = ALIGN_CENTER
        ws2.cell(row_idx, 6, c['kich_thuoc']).alignment = ALIGN_CENTER
        
        old_val = c['dien_giai_3176'] if c['dien_giai_3176'] else "(Chưa quy định chi tiết hoặc giữ theo QĐ 130/4750)"
        ws2.cell(row_idx, 7, old_val).alignment = ALIGN_LEFT
        
        new_cell = ws2.cell(row_idx, 8, c['sua_doi_3556'])
        new_cell.alignment = ALIGN_LEFT
        new_cell.fill = HIGHLIGHT_CHANGE
        new_cell.font = FONT_CHANGE
        
        ws2.cell(row_idx, 9, category).alignment = ALIGN_CENTER
        ws2.cell(row_idx, 10, note).alignment = ALIGN_LEFT
        
        for col in range(1, 11):
            cell_obj = ws2.cell(row_idx, col)
            cell_obj.border = BORDER_THIN
            if col not in (8, 9):
                cell_obj.font = FONT_REGULAR
                if row_idx % 2 == 0:
                    cell_obj.fill = ZEBRA_FILL
            if col == 4:
                cell_obj.font = FONT_BOLD
            if col == 9:
                cell_obj.font = FONT_BADGE
                cell_obj.fill = SUB_HEADER
                
        row_idx += 1
        change_stt += 1

# -------------------------------------------------------------
# SHEET 3: QUY TẮC ĐIỀU 2 XML
# -------------------------------------------------------------
ws3 = wb.create_sheet(title="Quy_Tac_Dieu_2_XML")
ws3.views.sheetView[0].showGridLines = True

ws3.cell(1, 1, "HƯỚNG DẪN XỬ LÝ XML THEO ĐIỀU 2 QUYẾT ĐỊNH SỐ 3556/QĐ-BYT").font = FONT_TITLE
ws3.cell(2, 1, "Trường hợp người bệnh KCB ngoại trú, chỉ định Cận lâm sàng (CLS), sau đó nhập viện nội trú").font = FONT_SUBTITLE

dieu_2_text = (
    "Theo Điều 2 Quyết định số 3556/QĐ-BYT:\n"
    "\"Việc tạo lập dữ liệu XML trong trường hợp người bệnh đến khám bệnh, chữa bệnh ngoại trú, "
    "được bác sỹ chỉ định thực hiện các dịch vụ cận lâm sàng, sau đó được chỉ định vào nhập viện nội trú theo yêu cầu chuyên môn:\n"
    "- Cơ sở khám bệnh, chữa bệnh xác định giá trị mức hưởng (MUC_HUONG) tương ứng đối với từng dịch vụ thực hiện khi khám bệnh, "
    "chữa bệnh ngoại trú, khám bệnh, chữa bệnh nội trú tại Bảng 2 và Bảng 3.\n"
    "- Trường hợp theo quy định của pháp luật và yêu cầu chuyên môn, cơ sở khám bệnh, chữa bệnh sử dụng lại kết quả cận lâm sàng "
    "đã thực hiện trong lần khám bệnh, chữa bệnh ngoại trú để sử dụng trong quá trình điều trị nội trú cho người bệnh.\""
)

ws3.merge_cells("A4:H7")
c_d2 = ws3.cell(4, 1, dieu_2_text)
c_d2.font = Font(name="Segoe UI", size=10, italic=True, color="0E3E92")
c_d2.fill = PatternFill(start_color="EFF6FF", end_color="EFF6FF", fill_type="solid")
c_d2.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
for r in range(4, 8):
    for c in range(1, 9):
        ws3.cell(r, c).border = BORDER_THIN

headers_s3 = ["STT", "Nghiệp vụ phát sinh", "Tại Bảng dữ liệu", "Chỉ tiêu liên quan", "Cách thức lập XML theo QĐ 3176 cũ", "QUY TẮC LẬP XML THEO QĐ 3556 MỚI", "Lợi ích & Tránh xuất toán"]
for c_idx, h in enumerate(headers_s3, start=1):
    cell = ws3.cell(9, c_idx, h)
    cell.fill = NAVY_HEADER
    cell.font = FONT_HEADER_WHITE
    cell.alignment = ALIGN_CENTER
    cell.border = BORDER_HEADER

dieu2_steps = [
    (1, "Xác định mức hưởng dịch vụ CLS ngoại trú", "Bảng 3 (DVKT, VTYT)", "MUC_HUONG, MA_LOAI_KCB", 
     "Dễ bị nhầm lẫn tính mức hưởng chung của đợt điều trị nội trú hoặc bị từ chối thanh toán do sai lệch tỷ lệ hưởng ngoại trú/nội trú",
     "Ghi giá trị MUC_HUONG tương ứng với quyền lợi KCB ngoại trú tại thời điểm thực hiện dịch vụ CLS trước khi vào viện",
     "Đúng tỷ lệ thanh toán BHYT ngoại trú, không bị từ chối hồ sơ khi giám định"),
    
    (2, "Xác định mức hưởng dịch vụ điều trị nội trú", "Bảng 2 (Thuốc) & Bảng 3 (DVKT)", "MUC_HUONG, NGAY_VAO_NOI_TRU",
     "Một số phần mềm gộp chung ngày và mức hưởng dẫn đến khó phân định chi phí trước - sau nhập viện",
     "Ghi giá trị MUC_HUONG tương ứng với quyền lợi KCB nội trú đối với tất cả các dịch vụ, thuốc phát sinh trong giai đoạn nội trú",
     "Phân định minh bạch chi phí ngoại trú và nội trú trên cùng một mã liên kết MA_LK"),
    
    (3, "Tái sử dụng kết quả CLS ngoại trú trong nội trú", "Bảng 3 & Bảng 4 (Dịch vụ CLS)", "MA_DICH_VU, NGAY_KQ, MA_LK",
     "Trước đây bác sĩ thường phải cho làm lại xét nghiệm/chẩn đoán hình ảnh khi vào khoa nội trú để có kết quả trong hồ sơ bệnh án nội trú, gây lãng phí Quỹ BHYT và phiền hà cho người bệnh",
     "Cơ sở KCB được phép sử dụng lại kết quả CLS đã thực hiện ở phòng khám ngoại trú để phục vụ chẩn đoán, điều trị nội trú. Không chỉ định lặp lại nếu không có thay đổi bệnh lý bất thường",
     "Tiết kiệm chi phí Quỹ BHYT, giảm quá tải khoa CLS, đảm bảo quyền lợi và an toàn cho người bệnh"),
    
    (4, "Ghi nhận nhiều loại hình KCB trên cùng hồ sơ", "Bảng 1 (Tổng hợp) & Check-in", "MA_LOAI_KCB, MA_DOITUONG_KCB",
     "Chỉ cho phép ghi 1 mã loại KCB (01 hoặc 02 hoặc 03), dễ gây vướng mắc khi bệnh nhân chuyển từ khám ngoại trú sang nội trú",
     "Ghi đầy đủ các mã loại hình KBCB cách nhau bằng dấu chấm phẩy ';' (Ví dụ: '01;03' - Khám bệnh ngoại trú sau đó vào điều trị nội trú). Tăng kích thước MA_LOAI_KCB lên 10 ký tự",
     "Phản ánh đúng thực tế diễn biến đợt KCB của người bệnh, liên thông dữ liệu thông suốt giữa ngoại trú và nội trú")
]

row_idx = 10
for s in dieu2_steps:
    ws3.cell(row_idx, 1, s[0]).alignment = ALIGN_CENTER
    ws3.cell(row_idx, 2, s[1]).alignment = ALIGN_LEFT
    ws3.cell(row_idx, 3, s[2]).alignment = ALIGN_CENTER
    ws3.cell(row_idx, 4, s[3]).alignment = ALIGN_CENTER
    ws3.cell(row_idx, 5, s[4]).alignment = ALIGN_LEFT
    
    c6 = ws3.cell(row_idx, 6, s[5])
    c6.alignment = ALIGN_LEFT
    c6.fill = HIGHLIGHT_CHANGE
    c6.font = FONT_CHANGE
    
    ws3.cell(row_idx, 7, s[6]).alignment = ALIGN_LEFT
    
    for c in range(1, 8):
        cell_obj = ws3.cell(row_idx, c)
        cell_obj.border = BORDER_THIN
        if c != 6:
            cell_obj.font = FONT_REGULAR
            if row_idx % 2 == 0:
                cell_obj.fill = ZEBRA_FILL
        if c == 2:
            cell_obj.font = FONT_BOLD
            
    row_idx += 1

# -------------------------------------------------------------
# SHEET 4: DANH MỤC VĂN BẢN PHÁP QUY DẪN CHIẾU
# -------------------------------------------------------------
ws4 = wb.create_sheet(title="Van_Ban_Phap_Quy")
ws4.views.sheetView[0].showGridLines = True

ws4.cell(1, 1, "DANH MỤC CÁC VĂN BẢN QUY PHẠM PHÁP LUẬT MỚI DẪN CHIẾU TRONG QĐ 3556/QĐ-BYT").font = FONT_TITLE
ws4.cell(2, 1, "Hệ thống văn bản luật, nghị định, thông tư, quyết định làm căn cứ kỹ thuật và nghiệp vụ").font = FONT_SUBTITLE

headers_s4 = ["STT", "Số hiệu văn bản", "Ngày ban hành", "Cơ quan ban hành", "Trích yếu nội dung", "Phạm vi áp dụng trong QĐ 3556"]
for c_idx, h in enumerate(headers_s4, start=1):
    cell = ws4.cell(4, c_idx, h)
    cell.fill = NAVY_HEADER
    cell.font = FONT_HEADER_WHITE
    cell.alignment = ALIGN_CENTER
    cell.border = BORDER_HEADER

legal_docs = [
    (1, "Quyết định số 3556/QĐ-BYT", "16/11/2026", "Bộ Y tế", 
     "Sửa đổi, bổ sung một số trường dữ liệu tại Quyết định số 3176/QĐ-BYT ngày 29/10/2024 quy định chuẩn và định dạng dữ liệu đầu ra phục vụ quản lý, giám định, thanh toán chi phí KCB BHYT",
     "Sửa đổi, bổ sung 93 trường dữ liệu tại 15 bảng chuẩn đầu ra và quy định Điều 2 về ca bệnh ngoại trú chuyển nội trú"),
    
    (2, "Quyết định số 19/2025/QĐ-TTg", "30/06/2025", "Thủ tướng Chính phủ", 
     "Ban hành Danh mục và mã số các đơn vị hành chính Việt Nam (thay thế Quyết định số 124/2004/QĐ-TTg)",
     "Áp dụng mã tỉnh (Phụ lục I), mã huyện (Phụ lục II), mã xã (Phụ lục II) cho các trường MATINH_CU_TRU, MAHUYEN_CU_TRU, MAXA_CU_TRU trên toàn bộ các bảng XML"),
    
    (3, "Quyết định số 1804/QĐ-BYT", "19/06/2026", "Bộ Y tế", 
     "Ban hành Bộ mã danh mục dùng chung áp dụng trong khám bệnh, chữa bệnh và thanh toán bảo hiểm y tế (Phiên bản mới)",
     "Áp dụng mã loại hình KCB (Phụ lục 01) cho trường MA_LOAI_KCB, cho phép ghi nhiều mã ngăn cách bằng ';'"),
    
    (4, "Quyết định số 3276/QĐ-BYT & QĐ 2917/QĐ-BYT", "24/10/2025 & 15/09/2026", "Bộ Y tế", 
     "Sửa đổi bổ sung QĐ 2010/QĐ-BYT: Ban hành Phụ lục 1 Danh mục mã đối tượng KCB (27 mã) và Phụ lục 2 Danh mục mã nhiên liệu; QĐ 2917 bổ sung mã 3.1 cho cơ sở chuyên sâu thành lập mới sau 01/01/2025",
     "Áp dụng cho trường MA_DOITUONG_KCB, tăng kích thước lên 50 ký tự, cho phép ghi nhiều mã ngăn cách bằng ';'"),
    
    (5, "Nghị định số 188/2025/NĐ-CP", "01/07/2025", "Chính phủ", 
     "Quy định chi tiết và hướng dẫn thi hành một số điều của Luật Bảo hiểm y tế (thay thế Nghị định 146/2018/NĐ-CP)",
     "Căn cứ pháp lý cốt lõi về quyền lợi KCB BHYT, mức hưởng, ký số và liên thông dữ liệu điện tử"),
    
    (6, "Thông tư số 01/2025/TT-BYT", "05/01/2025", "Bộ Y tế", 
     "Quy định về chuyển cơ sở khám bệnh, chữa bệnh và hẹn khám lại trong khám bệnh, chữa bệnh bảo hiểm y tế",
     "Áp dụng mẫu Phiếu chuyển cơ sở KCB (Phụ lục VI) và Phiếu hẹn khám lại (Phụ lục V) cho Bảng 13 và Bảng 14"),
    
    (7, "Thông tư số 12/2026/TT-BTC", "20/02/2026", "Bộ Tài chính", 
     "Quy định quản lý, thanh toán, quyết toán chi phí khám bệnh, chữa bệnh bảo hiểm y tế",
     "Áp dụng mẫu Biên bản quyết toán Mẫu 06/BH và quy trình ký duyệt, thời hạn thanh quyết toán kinh phí BHYT")
]

row_idx = 5
for doc in legal_docs:
    ws4.cell(row_idx, 1, doc[0]).alignment = ALIGN_CENTER
    ws4.cell(row_idx, 2, doc[1]).alignment = ALIGN_CENTER
    ws4.cell(row_idx, 3, doc[2]).alignment = ALIGN_CENTER
    ws4.cell(row_idx, 4, doc[3]).alignment = ALIGN_CENTER
    ws4.cell(row_idx, 5, doc[4]).alignment = ALIGN_LEFT
    ws4.cell(row_idx, 6, doc[5]).alignment = ALIGN_LEFT
    
    for c in range(1, 7):
        cell_obj = ws4.cell(row_idx, c)
        cell_obj.border = BORDER_THIN
        cell_obj.font = FONT_REGULAR
        if row_idx % 2 == 0:
            cell_obj.fill = ZEBRA_FILL
        if c == 2:
            cell_obj.font = FONT_BOLD
            
    row_idx += 1

# Auto-adjust column widths for all sheets
for ws in [ws1, ws2, ws3, ws4]:
    for col in ws.columns:
        col_letter = get_column_letter(col[0].column)
        max_len = 0
        for cell in col:
            # Skip merged or very long cells in title
            if cell.row in (1, 2, 3, 4) and ws == ws3:
                continue
            val_str = str(cell.value or '')
            lines = val_str.split('\n')
            longest_line = max(len(l) for l in lines) if lines else 0
            if longest_line > max_len:
                max_len = longest_line
        ws.column_dimensions[col_letter].width = min(max(max_len + 3, 11), 60)

# Set specific column widths for best reading
ws1.column_dimensions['A'].width = 6
ws1.column_dimensions['B'].width = 16
ws1.column_dimensions['C'].width = 35
ws1.column_dimensions['D'].width = 16
ws1.column_dimensions['E'].width = 24
ws1.column_dimensions['F'].width = 15
ws1.column_dimensions['G'].width = 24

ws2.column_dimensions['A'].width = 6
ws2.column_dimensions['B'].width = 24
ws2.column_dimensions['C'].width = 11
ws2.column_dimensions['D'].width = 18
ws2.column_dimensions['E'].width = 10
ws2.column_dimensions['F'].width = 12
ws2.column_dimensions['G'].width = 38
ws2.column_dimensions['H'].width = 48
ws2.column_dimensions['I'].width = 22
ws2.column_dimensions['J'].width = 32

ws3.column_dimensions['A'].width = 6
ws3.column_dimensions['B'].width = 26
ws3.column_dimensions['C'].width = 22
ws3.column_dimensions['D'].width = 24
ws3.column_dimensions['E'].width = 32
ws3.column_dimensions['F'].width = 44
ws3.column_dimensions['G'].width = 32

ws4.column_dimensions['A'].width = 6
ws4.column_dimensions['B'].width = 28
ws4.column_dimensions['C'].width = 14
ws4.column_dimensions['D'].width = 20
ws4.column_dimensions['E'].width = 45
ws4.column_dimensions['F'].width = 40

out_path_docs = r'docs\So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx'
out_path_public = r'client\public\documents\So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx'

wb.save(out_path_docs)
wb.save(out_path_public)

print(f"Successfully generated comparison Excel workbook at:")
print(f"  - {out_path_docs}")
print(f"  - {out_path_public}")
