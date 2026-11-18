from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
# Set widescreen 16:9
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Colors
C_NAVY_DARK = RGBColor(16, 42, 71)      # #102A47
C_NAVY_LIGHT = RGBColor(27, 78, 128)    # #1B4E80
C_COBALT = RGBColor(20, 87, 200)        # #1457C8
C_TEAL = RGBColor(0, 168, 150)          # #00A896
C_AMBER = RGBColor(245, 158, 11)        # #F59E0B
C_TEXT_DARK = RGBColor(30, 41, 59)      # #1E293B
C_TEXT_MUTED = RGBColor(100, 116, 139)  # #64748B
C_BG_LIGHT = RGBColor(248, 250, 252)    # #F8FAFC
C_WHITE = RGBColor(255, 255, 255)
C_CARD_BG = RGBColor(241, 245, 249)     # #F1F5F9
C_BORDER = RGBColor(203, 213, 225)      # #CBD5E1

blank_layout = prs.slide_layouts[6]

def add_header(slide, title_text, category_text="QUYẾT ĐỊNH 3556/QĐ-BYT · CHUẨN ĐẦU RA DỮ LIỆU KCB BHYT"):
    # Header shape
    cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
    tf_cat = cat_box.text_frame
    tf_cat.word_wrap = True
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = category_text.upper()
    p_cat.font.size = Pt(9.5)
    p_cat.font.bold = True
    p_cat.font.color.rgb = C_COBALT
    p_cat.font.name = "Segoe UI"
    
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.7))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.size = Pt(20)
    p_title.font.bold = True
    p_title.font.color.rgb = C_NAVY_DARK
    p_title.font.name = "Segoe UI"
    
    # Divider line
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.4), Inches(11.733), Inches(0.02))
    line.fill.solid()
    line.fill.fore_color.rgb = C_BORDER
    line.line.color.rgb = C_BORDER

def add_card(slide, left, top, width, height, title, body_paragraphs, badge=None, accent_color=C_COBALT):
    # Card background
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_BORDER
    card.line.width = Pt(1)
    
    # Accent top border
    accent = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, Inches(0.08))
    accent.fill.solid()
    accent.fill.fore_color.rgb = accent_color
    accent.line.color.rgb = accent_color
    
    # Content
    tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.15), width - Inches(0.4), height - Inches(0.3))
    tf = tb.text_frame
    tf.word_wrap = True
    
    p0 = tf.paragraphs[0]
    if badge:
        p0.text = f"[{badge}] {title}"
    else:
        p0.text = title
    p0.font.size = Pt(12)
    p0.font.bold = True
    p0.font.color.rgb = C_NAVY_DARK
    p0.font.name = "Segoe UI"
    p0.space_after = Pt(8)
    
    for para in body_paragraphs:
        p = tf.add_paragraph()
        p.text = para
        p.font.size = Pt(10)
        p.font.color.rgb = C_TEXT_DARK
        p.font.name = "Segoe UI"
        p.space_after = Pt(4)

# ==============================================================================
# SLIDE 1: TITLE SLIDE (Dark Navy Premium)
# ==============================================================================
slide1 = prs.slides.add_slide(blank_layout)
bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
bg1.fill.solid()
bg1.fill.fore_color.rgb = C_NAVY_DARK
bg1.line.fill.background()

# Top Tag
tag1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(1.3), Inches(4.5), Inches(0.45))
tag1.fill.solid()
tag1.fill.fore_color.rgb = C_COBALT
tag1.line.fill.background()
tf_tag = tag1.text_frame
p_tag = tf_tag.paragraphs[0]
p_tag.text = "BỘ Y TẾ · BAN HÀNH NGÀY 16/11/2026"
p_tag.font.size = Pt(10)
p_tag.font.bold = True
p_tag.font.color.rgb = C_WHITE
p_tag.alignment = PP_ALIGN.CENTER
p_tag.font.name = "Segoe UI"

# Main Title
tb_t1 = slide1.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(11.0), Inches(2.5))
tf_t1 = tb_t1.text_frame
tf_t1.word_wrap = True
p_t1 = tf_t1.paragraphs[0]
p_t1.text = "BÁO CÁO PHÂN TÍCH & ĐỐI CHIẾU THAY ĐỔI\nQUYẾT ĐỊNH 3556/QĐ-BYT"
p_t1.font.size = Pt(30)
p_t1.font.bold = True
p_t1.font.color.rgb = C_WHITE
p_t1.font.name = "Segoe UI"

p_sub = tf_t1.add_paragraph()
p_sub.text = "Sửa đổi, bổ sung Quyết định số 3176/QĐ-BYT về chuẩn và định dạng dữ liệu đầu ra KCB BHYT"
p_sub.font.size = Pt(16)
p_sub.font.color.rgb = RGBColor(186, 215, 245)
p_sub.font.name = "Segoe UI"
p_sub.space_before = Pt(12)

# Meta info card on slide 1
meta_card = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2), Inches(4.8), Inches(10.9), Inches(1.6))
meta_card.fill.solid()
meta_card.fill.fore_color.rgb = RGBColor(22, 53, 89)
meta_card.line.color.rgb = RGBColor(40, 85, 138)

tb_meta = slide1.shapes.add_textbox(Inches(1.5), Inches(5.0), Inches(10.3), Inches(1.2))
tf_meta = tb_meta.text_frame
tf_meta.word_wrap = True

p_m1 = tf_meta.paragraphs[0]
p_m1.text = "• Phạm vi điều chỉnh: Sửa đổi, bổ sung 93 trường dữ liệu trên 15 bảng chuẩn đầu ra XML (QĐ 3176, QĐ 4750, QĐ 130/QĐ-BYT)."
p_m1.font.size = Pt(11)
p_m1.font.color.rgb = C_WHITE
p_m1.font.name = "Segoe UI"

p_m2 = tf_meta.add_paragraph()
p_m2.text = "• Điểm nhấn nghiệp vụ: Quy định cơ chế xử lý ca bệnh ngoại trú làm CLS chuyển nhập viện nội trú (Điều 2) & Cập nhật mã ĐVHC 3 cấp mới (QĐ 19/2025/QĐ-TTg)."
p_m2.font.size = Pt(11)
p_m2.font.color.rgb = RGBColor(254, 215, 170)
p_m2.font.name = "Segoe UI"

p_m3 = tf_meta.add_paragraph()
p_m3.text = "• Hiệu lực thi hành: Kể từ ngày ký (16/11/2026). BHXH Việt Nam và các cơ sở KCB toàn quốc cập nhật theo Hệ thống Giám định BHYT."
p_m3.font.size = Pt(11)
p_m3.font.color.rgb = RGBColor(203, 213, 225)
p_m3.font.name = "Segoe UI"

# ==============================================================================
# SLIDE 2: BỐI CẢNH & MỤC TIÊU BAN HÀNH
# ==============================================================================
slide2 = prs.slides.add_slide(blank_layout)
add_header(slide2, "Bối cảnh pháp lý & Sự cần thiết ban hành Quyết định 3556/QĐ-BYT")

cards_s2 = [
    ("Đồng bộ Luật BHYT & Nghị định 188/2025/NĐ-CP", [
        "• Luật BHYT sửa đổi bổ sung và Nghị định số 188/2025/NĐ-CP (thay thế Nghị định 146/2018) có hiệu lực với nhiều cơ chế chính sách mới.",
        "• Đòi hỏi chuẩn dữ liệu đầu ra phải cập nhật căn cứ pháp lý, quyền lợi hưởng, phương thức ký số và liên thông dữ liệu điện tử."
    ], C_COBALT),
    
    ("Đồng bộ Mã đơn vị hành chính mới theo QĐ 19/2025/QĐ-TTg", [
        "• Thủ tướng Chính phủ ban hành Quyết định 19/2025/QĐ-TTg ngày 30/6/2025 thay thế Quyết định 124/2004/QĐ-TTg.",
        "• Mã tỉnh (Phụ lục I), mã huyện và mã xã (Phụ lục II) cần được cập nhật đồng nhất trên tất cả các bảng dữ liệu để đối chiếu dân cư."
    ], C_TEAL),
    
    ("Giải quyết vướng mắc ca bệnh Ngoại trú chuyển Nội trú", [
        "• Bất cập kéo dài: Người bệnh khám ngoại trú làm CLS rồi nhập viện thường bị tính sai mức hưởng hoặc phải làm lại CLS.",
        "• QĐ 3556 luật hóa cơ chế xác định mức hưởng riêng cho từng dịch vụ và cho phép sử dụng lại kết quả CLS ngoại trú trong nội trú."
    ], C_AMBER),
    
    ("Đồng bộ Danh mục dùng chung & Biểu mẫu KCB mới", [
        "• Quyết định 1804/QĐ-BYT về mã loại hình KCB; Quyết định 3276 và QĐ 2917/QĐ-BYT về 27 mã đối tượng KCB.",
        "• Thông tư 01/2025/TT-BYT ban hành mẫu Phiếu chuyển cơ sở KCB và Phiếu hẹn tái khám mới thay cho mẫu Nghị định 75/2023."
    ], C_COBALT)
]

w_card = Inches(5.6)
h_card = Inches(2.6)
positions = [
    (Inches(0.8), Inches(1.7)),
    (Inches(6.8), Inches(1.7)),
    (Inches(0.8), Inches(4.5)),
    (Inches(6.8), Inches(4.5))
]

for idx, (title, paras, color) in enumerate(cards_s2):
    left, top = positions[idx]
    add_card(slide2, left, top, w_card, h_card, title, paras, badge=f"Trụ cột {idx+1}", accent_color=color)

# ==============================================================================
# SLIDE 3: TỔNG QUAN ĐỊNH LƯỢNG THAY ĐỔI (93 TRƯỜNG DỮ LIỆU)
# ==============================================================================
slide3 = prs.slides.add_slide(blank_layout)
add_header(slide3, "Tổng quan định lượng: 93 trường dữ liệu sửa đổi, bổ sung tại 15 bảng")

# Stat Big Callouts
stats = [
    ("93", "TRƯỜNG SỬA ĐỔI / BỔ SUNG", "Phân bố trên 15 bảng chuẩn đầu ra", C_COBALT),
    ("16", "BẢNG CHUẨN ĐẦU RA", "Gồm Bảng Check-in và 15 bảng XML", C_NAVY_LIGHT),
    ("20", "THAY ĐỔI TẠI BẢNG 1", "Bảng Tổng hợp KCB chịu tác động lớn nhất", C_AMBER),
    ("100%", "HIỆU LỰC TỨC THÌ", "Kể từ ngày 16/11/2026 trên toàn quốc", C_TEAL)
]

w_stat = Inches(2.75)
for idx, (num, label, sub, color) in enumerate(stats):
    left = Inches(0.8 + idx * 2.95)
    box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.6), w_stat, Inches(1.6))
    box.fill.solid()
    box.fill.fore_color.rgb = C_WHITE
    box.line.color.rgb = color
    box.line.width = Pt(1.5)
    
    tf = box.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = num
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = color
    p1.alignment = PP_ALIGN.CENTER
    p1.font.name = "Segoe UI"
    
    p2 = tf.add_paragraph()
    p2.text = label
    p2.font.size = Pt(9.5)
    p2.font.bold = True
    p2.font.color.rgb = C_NAVY_DARK
    p2.alignment = PP_ALIGN.CENTER
    p2.font.name = "Segoe UI"
    
    p3 = tf.add_paragraph()
    p3.text = sub
    p3.font.size = Pt(8.5)
    p3.font.color.rgb = C_TEXT_MUTED
    p3.alignment = PP_ALIGN.CENTER
    p3.font.name = "Segoe UI"

# Table of sheets
rows_data = [
    ("Nhóm Lâm sàng & Chi phí", "Bảng 1: Tổng hợp (20) · Bảng 2: Thuốc (8) · Bảng 3: DVKT & VTYT (10) · Bảng 4: Cận lâm sàng (2) · Bảng 5: Diễn biến LS (1)"),
    ("Nhóm Tiếp đón & Giám sát", "Bảng Check-in: Trạng thái KCB (6) · Bảng 6: HIV/AIDS (1) · Bảng 12: Giám định y khoa (5)"),
    ("Nhóm Hồ sơ & Chứng từ", "Bảng 7: Giấy ra viện (7) · Bảng 8: Tóm tắt HSBA (4) · Bảng 9: Giấy chứng sinh (8) · Bảng 10: Dưỡng thai (5) · Bảng 11: Nghỉ BHXH (8)"),
    ("Nhóm Chuyển tuyến & Hẹn khám", "Bảng 13: Phiếu chuyển cơ sở KCB (4) · Bảng 14: Giấy hẹn khám lại (4) · Bảng 15: Quản lý bệnh lao (0 - Giữ nguyên)")
]

top_t = Inches(3.5)
for idx, (grp_name, grp_desc) in enumerate(rows_data):
    bar = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_t + Inches(idx * 0.9), Inches(11.733), Inches(0.8))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_CARD_BG if idx % 2 == 0 else C_WHITE
    bar.line.color.rgb = C_BORDER
    
    tb = slide3.shapes.add_textbox(Inches(1.0), top_t + Inches(idx * 0.9) + Inches(0.08), Inches(11.3), Inches(0.65))
    tf = tb.text_frame
    tf.word_wrap = True
    p_g1 = tf.paragraphs[0]
    p_g1.text = grp_name.upper()
    p_g1.font.size = Pt(11)
    p_g1.font.bold = True
    p_g1.font.color.rgb = C_COBALT
    p_g1.font.name = "Segoe UI"
    
    p_g2 = tf.add_paragraph()
    p_g2.text = grp_desc
    p_g2.font.size = Pt(10)
    p_g2.font.color.rgb = C_TEXT_DARK
    p_g2.font.name = "Segoe UI"

# ==============================================================================
# SLIDE 4: ĐIỂM MỚI TRỌNG YẾU 1 - CA NGOẠI TRÚ LÀM CLS CHUYỂN NỘI TRÚ (ĐIỀU 2)
# ==============================================================================
slide4 = prs.slides.add_slide(blank_layout)
add_header(slide4, "Trọng tâm 1: Cơ chế xử lý ca bệnh ngoại trú làm CLS chuyển nhập viện nội trú (Điều 2)")

box_quote = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(11.733), Inches(1.4))
box_quote.fill.solid()
box_quote.fill.fore_color.rgb = RGBColor(239, 246, 255)
box_quote.line.color.rgb = C_COBALT
box_quote.line.width = Pt(1.5)

tf_q = box_quote.text_frame
tf_q.word_wrap = True
p_qt = tf_q.paragraphs[0]
p_qt.text = "TOÀN VĂN QUY ĐỊNH TẠI ĐIỀU 2 QUYẾT ĐỊNH 3556/QĐ-BYT:"
p_qt.font.size = Pt(10.5)
p_qt.font.bold = True
p_qt.font.color.rgb = C_NAVY_DARK
p_qt.font.name = "Segoe UI"

p_qc = tf_q.add_paragraph()
p_qc.text = "\"Cơ sở khám bệnh, chữa bệnh xác định giá trị mức hưởng (MUC_HUONG) tương ứng đối với từng dịch vụ thực hiện khi khám bệnh, chữa bệnh ngoại trú, khám bệnh, chữa bệnh nội trú tại Bảng 2 và Bảng 3. Trường hợp theo quy định của pháp luật và yêu cầu chuyên môn, cơ sở khám bệnh, chữa bệnh sử dụng lại kết quả cận lâm sàng đã thực hiện trong lần khám bệnh, chữa bệnh ngoại trú để sử dụng trong quá trình điều trị nội trú cho người bệnh.\""
p_qc.font.size = Pt(10)
p_qc.font.italic = True
p_qc.font.color.rgb = C_NAVY_DARK
p_qc.font.name = "Segoe UI"

# 3 Implementation columns
col_w = Inches(3.75)
h_col = Inches(3.8)

add_card(slide4, Inches(0.8), Inches(3.2), col_w, h_col, "Tách biệt Mức hưởng tại Bảng 2 & 3", [
    "• Vấn đề cũ: Bệnh nhân khám ngoại trú có mức hưởng 0% hoặc khác nội trú, khi gộp hồ sơ thường bị áp sai tỷ lệ.",
    "• Quy định mới: Mỗi dòng dịch vụ trong Bảng 2 (Thuốc) và Bảng 3 (DVKT, VTYT) phải ghi đúng giá trị MUC_HUONG tại thời điểm chỉ định.",
    "• Tránh tình trạng bị cơ quan BHXH từ chối hồ sơ do mâu thuẫn mức hưởng ngoại trú - nội trú."
], badge="Nghiệp vụ 1", accent_color=C_COBALT)

add_card(slide4, Inches(4.8), Inches(3.2), col_w, h_col, "Hợp thức hóa Tái sử dụng kết quả CLS", [
    "• Vấn đề cũ: Bác sĩ nội trú thường phải cho làm lại xét nghiệm để có kết quả nằm trong HSBA nội trú.",
    "• Quy định mới: Cho phép sử dụng lại toàn bộ kết quả CLS ngoại trú nếu phù hợp yêu cầu chuyên môn.",
    "• Lợi ích kép: Bệnh nhân không phải lấy máu/chụp chiếu lặp lại; Quỹ BHYT tiết kiệm chi phí; giảm tải khoa CĐHA/Xét nghiệm."
], badge="Nghiệp vụ 2", accent_color=C_TEAL)

add_card(slide4, Inches(8.8), Inches(3.2), col_w, h_col, "Đa mã loại hình KCB (MA_LOAI_KCB)", [
    "• Đồng bộ kỹ thuật: Tăng kích thước MA_LOAI_KCB lên 10 ký tự.",
    "• Hướng dẫn mới: Cho phép ghi nhiều mã loại hình KCB ngăn cách bằng dấu chấm phẩy ';' (ví dụ: '01;03' - Khám ngoại trú rồi vào nội trú).",
    "• Giữ nguyên mã liên kết MA_LK xuyên suốt từ phòng khám ban đầu đến khi ra viện."
], badge="Nghiệp vụ 3", accent_color=C_AMBER)

# ==============================================================================
# SLIDE 5: ĐIỂM MỚI TRỌNG YẾU 2 - MÃ ĐƠN VỊ HÀNH CHÍNH & ĐỊA CHỈ DÂN CƯ
# ==============================================================================
slide5 = prs.slides.add_slide(blank_layout)
add_header(slide5, "Trọng tâm 2: Chuẩn hóa Mã đơn vị hành chính theo QĐ 19/2025/QĐ-TTg & Địa chỉ")

add_card(slide5, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.3), "Thay thế Mã ĐVHC theo Quyết định 19/2025/QĐ-TTg", [
    "Quyết định số 19/2025/QĐ-TTg ngày 30/6/2025 của Thủ tướng Chính phủ bãi bỏ hoàn toàn danh mục mã theo QĐ 124/2004/QĐ-TTg và TT 07/2016/TT-BCA.",
    "",
    "• MATINH_CU_TRU (Mã tỉnh/thành):",
    "  - Ghi theo quy định tại Phụ lục I Quyết định số 19/2025/QĐ-TTg.",
    "  - Kích thước tối đa: 3 ký tự.",
    "",
    "• MAHUYEN_CU_TRU (Mã quận/huyện):",
    "  - Ghi theo quy định tại Phụ lục II Quyết định số 19/2025/QĐ-TTg.",
    "  - Kích thước tối đa: 3 ký tự.",
    "",
    "• MAXA_CU_TRU (Mã xã/phường/thị trấn):",
    "  - Ghi theo quy định tại Phụ lục II Quyết định số 19/2025/QĐ-TTg.",
    "  - Kích thước tối đa: 5 ký tự. Trường hợp xã chưa có mã thì để trống.",
    "",
    "Áp dụng đồng bộ trên Bảng 1, Bảng Check-in, Bảng 7, 8, 9, 10, 11."
], badge="Mã hành chính 3 cấp", accent_color=C_COBALT)

add_card(slide5, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.3), "Hướng dẫn chi tiết Địa chỉ cư trú (DIA_CHI)", [
    "Chuẩn hóa trường DIA_CHI (kích thước tối đa 1024 ký tự) theo Cơ sở dữ liệu quốc gia về dân cư:",
    "",
    "• Người bệnh là công dân Việt Nam:",
    "  - Ghi theo địa chỉ nơi cư trú hiện tại đã cập nhật trong CSDL quốc gia về dân cư / CSDL cư trú.",
    "  - Gồm: Số nhà; thôn/xóm/đường/phố; xã/phường/thị trấn; tỉnh/thành phố.",
    "",
    "• Trẻ sơ sinh chưa được cấp thẻ BHYT:",
    "  - Ghi theo địa chỉ nơi mẹ hoặc người giám hộ hợp pháp cư trú.",
    "  - Trẻ sơ sinh không có người nhận hoặc bị bỏ rơi: Ghi theo địa chỉ nơi cơ sở KCB đặt trụ sở.",
    "",
    "• Người bệnh là người nước ngoài:",
    "  - Ghi theo địa chỉ do người bệnh tự khai báo.",
    "",
    "Ý nghĩa: Đảm bảo đồng bộ dữ liệu VNeID, định danh công dân và giải quyết hưởng chế độ BHYT chính xác."
], badge="Địa chỉ dân cư", accent_color=C_TEAL)

# ==============================================================================
# SLIDE 6: ĐIỂM MỚI TRỌNG YẾU 3 - NỚI LỎNG KÍCH THƯỚC TRƯỜNG "n" & ĐA MÃ LIÊN KẾT
# ==============================================================================
slide6 = prs.slides.add_slide(blank_layout)
add_header(slide6, "Trọng tâm 3: Nới lỏng kích thước trường 'n' & Đa mã liên kết bằng dấu ';'")

items_s6 = [
    ("Mã thẻ BHYT & Hạn thẻ tăng lên 'n' ký tự", 
     "Các trường MA_THE_BHYT, GT_THE_TU, GT_THE_DEN, MA_BHXH được nâng kích thước tối đa lên 'n' ký tự (trước đây giới hạn cố định). Giúp cơ sở KCB dễ dàng nối nhiều thẻ mới phát sinh trong quá trình điều trị cách nhau bằng dấu ';', xóa bỏ triệt để lỗi tràn chuỗi XML.",
     C_COBALT),
     
    ("Đa mã đối tượng KCB (MA_DOITUONG_KCB)",
     "Tăng kích thước tối đa lên 50 ký tự (trước đây 4 ký tự). Trường hợp người bệnh có nhiều mã đối tượng đến KCB theo QĐ 3276/QĐ-BYT và QĐ 2917/QĐ-BYT thì ghi đầy đủ các mã đối tượng cách nhau bởi dấu chấm phẩy ';'.",
     C_TEAL),
     
    ("Đa mã loại hình KCB (MA_LOAI_KCB)",
     "Tăng kích thước tối đa lên 10 ký tự. Ghi mã loại hình KCB theo QĐ 1804/QĐ-BYT. Cho phép ghi nhiều mã loại hình khi bệnh nhân chuyển trạng thái KCB trong một lần điều trị (Ví dụ: Khám ngoại trú rồi vào nội trú: '01;03').",
     C_AMBER),
     
    ("Đa ngày hẹn tái khám (NGAY_HEN_KL)",
     "Tại Bảng 14 (Giấy hẹn khám lại), trường NGAY_HEN_KL tăng kích thước lên 200 ký tự, định dạng yyyymmddHHMM. Trường hợp có nhiều hơn 1 ngày hẹn tái khám chuyên khoa thì ghi các ngày cách nhau bằng dấu ';'.",
     C_COBALT)
]

for idx, (title, desc, color) in enumerate(items_s6):
    left = Inches(0.8)
    top = Inches(1.7 + idx * 1.35)
    
    card = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(11.733), Inches(1.2))
    card.fill.solid()
    card.fill.fore_color.rgb = C_WHITE
    card.line.color.rgb = C_BORDER
    
    accent = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, Inches(0.12), Inches(1.2))
    accent.fill.solid()
    accent.fill.fore_color.rgb = color
    accent.line.color.rgb = color
    
    tb = slide6.shapes.add_textbox(left + Inches(0.3), top + Inches(0.1), Inches(11.2), Inches(1.0))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = title
    p1.font.size = Pt(11.5)
    p1.font.bold = True
    p1.font.color.rgb = C_NAVY_DARK
    p1.font.name = "Segoe UI"
    
    p2 = tf.add_paragraph()
    p2.text = desc
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = C_TEXT_DARK
    p2.font.name = "Segoe UI"

# ==============================================================================
# SLIDE 7: ĐIỂM MỚI TRỌNG YẾU 4 - ĐỒNG BỘ BIỂU MẪU TT 01/2025 & QUY ĐỊNH NULL
# ==============================================================================
slide7 = prs.slides.add_slide(blank_layout)
add_header(slide7, "Trọng tâm 4: Đồng bộ biểu mẫu theo TT 01/2025/TT-BYT & Cho phép giá trị NULL")

add_card(slide7, Inches(0.8), Inches(1.7), Inches(5.6), Inches(5.3), "Cập nhật Biểu mẫu KCB theo Thông tư 01/2025/TT-BYT", [
    "Thay thế toàn bộ các dẫn chiếu biểu mẫu cũ theo Nghị định 75/2023/NĐ-CP bằng biểu mẫu mới ban hành kèm theo Thông tư số 01/2025/TT-BYT ngày 05/01/2025:",
    "",
    "• Bảng 13 (Phiếu chuyển cơ sở KCB):",
    "  - SO_HOSO: Ghi số hồ sơ Phiếu chuyển cơ sở KBCB theo mẫu tại Phụ lục VI Thông tư 01/2025/TT-BYT.",
    "  - SO_CHUYENTUYEN: Ghi số của sổ chuyển cơ sở KBCB theo mẫu Phụ lục VI Thông tư 01/2025/TT-BYT.",
    "  - GIAY_CHUYEN_TUYEN: Ghi số Phiếu chuyển cơ sở KBCB do cơ sở KBCB cấp theo Phụ lục VI.",
    "",
    "• Bảng 14 (Giấy hẹn khám lại):",
    "  - SO_GIAYHEN_KL: Ghi số Phiếu hẹn khám lại do cơ sở KBCB cấp theo mẫu tại Phụ lục V Thông tư 01/2025/TT-BYT.",
    "",
    "• Tên vật tư y tế (TEN_VAT_TU - Bảng Check-in):",
    "  - Sửa đổi: Ghi tên thương mại của VTYT theo quyết định trúng thầu (thay vì tên nhóm theo TT 04/2017)."
], badge="Đồng bộ biểu mẫu", accent_color=C_TEAL)

add_card(slide7, Inches(6.8), Inches(1.7), Inches(5.6), Inches(5.3), "Quy định cho phép để giá trị NULL giảm rào cản", [
    "QĐ 3556 sửa đổi hướng dẫn tại nhiều bảng cho phép trường dữ liệu được để giá trị NULL, loại bỏ các lỗi chặn kỹ thuật cứng nhắc:",
    "",
    "• Bảng 13 (Phiếu chuyển cơ sở KCB):",
    "  - MA_BAC_SI (Mã người hành nghề chỉ định chuyển cơ sở KCB): Được để giá trị null.",
    "",
    "• Bảng 14 (Giấy hẹn khám lại):",
    "  - MA_TTDV (Mã của người đứng đầu cơ sở KCB hoặc người được ủy quyền ký giấy hẹn): Được để giá trị null.",
    "",
    "• Các bảng biểu khác:",
    "  - Hướng dẫn rõ ràng các trường thông tin khi không có hoặc chưa áp dụng thì để trống/null mà không làm từ chối toàn bộ gói XML đợt KCB.",
    "",
    "Tác động: Giảm tải áp lực ký duyệt phân cấp trong bệnh viện, tăng tỷ lệ tiếp nhận dữ liệu thành công trên Cổng BHXH."
], badge="Quy định NULL", accent_color=C_AMBER)

# ==============================================================================
# SLIDE 8: MA TRẬN SO SÁNH QĐ 3176 VS QĐ 3556
# ==============================================================================
slide8 = prs.slides.add_slide(blank_layout)
add_header(slide8, "Bảng ma trận đối chiếu tổng hợp: Quyết định 3176 vs Quyết định 3556")

table_shape = slide8.shapes.add_table(7, 4, Inches(0.8), Inches(1.7), Inches(11.733), Inches(5.1))
tbl = table_shape.table

# Column widths
tbl.columns[0].width = Inches(2.2)
tbl.columns[1].width = Inches(3.2)
tbl.columns[2].width = Inches(4.3)
tbl.columns[3].width = Inches(2.033)

headers_m = ["Tiêu chí đối chiếu", "Quy định cũ (QĐ 3176/QĐ-BYT)", "Quy định mới (QĐ 3556/QĐ-BYT)", "Mức độ ảnh hưởng"]
for c_idx, text in enumerate(headers_m):
    cell = tbl.cell(0, c_idx)
    cell.fill.solid()
    cell.fill.fore_color.rgb = C_NAVY_DARK
    p = cell.text_frame.paragraphs[0]
    p.text = text
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.alignment = PP_ALIGN.CENTER
    p.font.name = "Segoe UI"

matrix_rows = [
    ("Ca ngoại trú chuyển nội trú", "Chưa có quy định riêng, dễ xung đột mức hưởng; thường phải làm lại CLS", "Điều 2: MUC_HUONG riêng cho từng dịch vụ; Cho phép tái sử dụng kết quả CLS ngoại trú trong nội trú", "Rất cao (Lâm sàng & BHYT)"),
    ("Mã đơn vị hành chính", "Theo QĐ 124/2004/QĐ-TTg và TT 07/2016/TT-BCA", "Theo QĐ 19/2025/QĐ-TTg (Phụ lục I: Tỉnh, Phụ lục II: Huyện & Xã)", "Cao (Cần update bảng mã)"),
    ("Độ dài Mã thẻ & Hạn thẻ", "Kích thước chuỗi giới hạn cố định (15 ký tự, 8 ký tự)", "Tăng kích thước tối đa lên 'n' ký tự cho thẻ BHYT, hạn thẻ từ-đến, mã BHXH", "Trung bình (Giảm lỗi tràn chuỗi)"),
    ("Loại KCB & Đối tượng", "Chỉ ghi 1 mã duy nhất (MA_LOAI_KCB tối đa 2; MA_DOITUONG tối đa 4)", "Ghi nhiều mã ngăn cách ';'. MA_LOAI_KCB lên 10; MA_DOITUONG lên 50", "Cao (HIS cần hỗ trợ đa mã)"),
    ("Biểu mẫu chuyển viện & hẹn", "Mẫu số 6 Phụ lục NĐ 75/2023/NĐ-CP", "Phụ lục VI (Phiếu chuyển viện) & Phụ lục V (Phiếu hẹn) theo TT 01/2025/TT-BYT", "Cao (Đổi form in & trường XML)"),
    ("Chữ ký bác sĩ Bảng 13, 14", "Bắt buộc ghi mã bác sĩ chỉ định và mã thủ trưởng đơn vị", "Cho phép để giá trị null đối với MA_BAC_SI (Bảng 13) và MA_TTDV (Bảng 14)", "Thấp (Tháo gỡ lỗi chặn)")
]

for r_idx, r_data in enumerate(matrix_rows, start=1):
    for c_idx, val in enumerate(r_data):
        cell = tbl.cell(r_idx, c_idx)
        cell.fill.solid()
        if r_idx % 2 == 1:
            cell.fill.fore_color.rgb = C_WHITE
        else:
            cell.fill.fore_color.rgb = C_CARD_BG
            
        p = cell.text_frame.paragraphs[0]
        p.text = val
        p.font.size = Pt(9.5)
        p.font.name = "Segoe UI"
        if c_idx == 0:
            p.font.bold = True
            p.font.color.rgb = C_NAVY_DARK
        elif c_idx == 2:
            p.font.color.rgb = C_COBALT
            p.font.bold = True
        elif c_idx == 3:
            p.alignment = PP_ALIGN.CENTER
            p.font.bold = True
            if "Rất cao" in val or "Cao" in val:
                p.font.color.rgb = RGBColor(185, 28, 28)
            else:
                p.font.color.rgb = RGBColor(21, 128, 61)
        else:
            p.font.color.rgb = C_TEXT_DARK

# ==============================================================================
# SLIDE 9: KẾ HOẠCH HÀNH ĐỘNG DÀNH CHO BỆNH VIỆN & ĐỘI NGŨ CNTT
# ==============================================================================
slide9 = prs.slides.add_slide(blank_layout)
add_header(slide9, "Khuyến nghị lộ trình hành động dành cho Cơ sở KCB & Đội ngũ CNTT / HIS")

add_card(slide9, Inches(0.8), Inches(1.7), Inches(3.75), Inches(5.3), "1. Đối với Phòng KHTH & Lâm sàng", [
    "• Phổ biến ngay Điều 2 QĐ 3556:",
    "  - Bác sĩ điều trị nội trú khai thác và sử dụng lại kết quả CLS ngoại trú, không chỉ định lại xét nghiệm trùng lặp.",
    "",
    "• Kiểm soát mức hưởng MUC_HUONG:",
    "  - Đảm bảo tính toán đúng quyền lợi ngoại trú cho các dịch vụ thực hiện trước nhập viện.",
    "",
    "• Cập nhật quy trình chuyển viện & hẹn khám:",
    "  - Áp dụng mẫu biểu mới theo Thông tư 01/2025/TT-BYT; hướng dẫn hẹn tái khám nhiều chuyên khoa cách nhau bởi dấu ';'."
], badge="Khối Chuyên môn", accent_color=C_COBALT)

add_card(slide9, Inches(4.8), Inches(1.7), Inches(3.75), Inches(5.3), "2. Đối với Đội ngũ CNTT & Đối tác HIS", [
    "• Nâng cấp Schema XML đầu ra:",
    "  - Mở rộng độ dài trường: MA_THE_BHYT, GT_THE_TU, GT_THE_DEN, MA_BHXH (n ký tự); MA_DOITUONG_KCB (50 ký tự); MA_LOAI_KCB (10 ký tự).",
    "",
    "• Cập nhật Danh mục hành chính 3 cấp:",
    "  - Nạp bộ mã tỉnh, huyện, xã theo Quyết định 19/2025/QĐ-TTg vào CSDL HIS.",
    "",
    "• Cho phép đa mã ngăn cách bằng ';':",
    "  - Hỗ trợ lưu trữ và xuất chuỗi đa mã loại hình KCB và đa mã đối tượng KCB."
], badge="Khối Kỹ thuật HIS", accent_color=C_TEAL)

add_card(slide9, Inches(8.8), Inches(1.7), Inches(3.75), Inches(5.3), "3. Đối với Phòng Tài chính & Giám định", [
    "• Rà soát hồ sơ thanh toán BHYT:",
    "  - Kiểm tra các đợt điều trị có bệnh nhân chuyển từ khám ngoại trú sang nội trú để đối soát đúng mức hưởng.",
    "",
    "• Giảm tỷ lệ từ chối / xuất toán:",
    "  - Tận dụng quy định cho phép NULL ở MA_BAC_SI (Bảng 13) và MA_TTDV (Bảng 14) để đẩy nhanh tiến độ nộp hồ sơ.",
    "",
    "• Sử dụng công cụ TT12 Validator:",
    "  - Kiểm tra trước file Excel/XML xuất từ HIS trước khi tải lên Cổng tiếp nhận dữ liệu BHXH Việt Nam."
], badge="Khối Giám định BHYT", accent_color=C_AMBER)

# ==============================================================================
# SLIDE 10: TỔNG KẾT & THÔNG TIN HỖ TRỢ
# ==============================================================================
slide10 = prs.slides.add_slide(blank_layout)
bg10 = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
bg10.fill.solid()
bg10.fill.fore_color.rgb = C_NAVY_DARK
bg10.line.fill.background()

tb_end = slide10.shapes.add_textbox(Inches(1.5), Inches(1.8), Inches(10.3), Inches(4.0))
tf_end = tb_end.text_frame
tf_end.word_wrap = True

p_e1 = tf_end.paragraphs[0]
p_e1.text = "TỔNG KẾT & TÀI NGUYÊN TRA CỨU HỖ TRỢ"
p_e1.font.size = Pt(26)
p_e1.font.bold = True
p_e1.font.color.rgb = C_WHITE
p_e1.font.name = "Segoe UI"
p_e1.space_after = Pt(16)

p_e2 = tf_end.add_paragraph()
p_e2.text = "• Quyết định số 3556/QĐ-BYT là bước hoàn thiện kỹ thuật rất quan trọng, tháo gỡ nhiều nút thắt thực tế trong thanh toán BHYT và số hóa y tế."
p_e2.font.size = Pt(12)
p_e2.font.color.rgb = RGBColor(226, 232, 240)
p_e2.font.name = "Segoe UI"
p_e2.space_after = Pt(8)

p_e3 = tf_end.add_paragraph()
p_e3.text = "• Toàn bộ 93 trường dữ liệu sửa đổi, bổ sung đã được tích hợp đầy đủ vào ứng dụng TT12 Excel Validator:"
p_e3.font.size = Pt(12)
p_e3.font.color.rgb = RGBColor(226, 232, 240)
p_e3.font.name = "Segoe UI"
p_e3.space_after = Pt(6)

p_e4 = tf_end.add_paragraph()
p_e4.text = "   1. Ứng dụng tra cứu trực tuyến: https://nsnnam.github.io/tt12-excel-validator/"
p_e4.font.size = Pt(11)
p_e4.font.bold = True
p_e4.font.color.rgb = RGBColor(147, 197, 253)
p_e4.font.name = "Segoe UI"

p_e5 = tf_end.add_paragraph()
p_e5.text = "   2. File Excel so sánh chi tiết: docs/So_sanh_thay_doi_QD_3556_vs_3176_BYT.xlsx"
p_e5.font.size = Pt(11)
p_e5.font.bold = True
p_e5.font.color.rgb = RGBColor(147, 197, 253)
p_e5.font.name = "Segoe UI"

p_e6 = tf_end.add_paragraph()
p_e6.text = "   3. File văn bản ký số gốc: docs/BYT-3556.QD-Sua-doi-bo-sung-QD3176.signed.pdf"
p_e6.font.size = Pt(11)
p_e6.font.bold = True
p_e6.font.color.rgb = RGBColor(147, 197, 253)
p_e6.font.name = "Segoe UI"

p_e7 = tf_end.add_paragraph()
p_e7.text = "Tác giả: Nguyễn Sơn Nam (Nsnnam) · TT12 Excel Validator Project · Tháng 11/2026"
p_e7.font.size = Pt(10)
p_e7.font.italic = True
p_e7.font.color.rgb = C_TEXT_MUTED
p_e7.font.name = "Segoe UI"
p_e7.space_before = Pt(24)

# Save files
out_pptx_docs = r'docs\Bao_cao_Phan_tich_Thay_doi_QD_3556_BYT.pptx'
out_pptx_public = r'client\public\documents\Bao_cao_Phan_tich_Thay_doi_QD_3556_BYT.pptx'

prs.save(out_pptx_docs)
prs.save(out_pptx_public)

print(f"Successfully generated PowerPoint presentation at:")
print(f"  - {out_pptx_docs}")
print(f"  - {out_pptx_public}")
