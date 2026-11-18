import openpyxl
import json
import sys

excel_path = r'J:\Users\Admin\Desktop\2026\11.2026\0-Văn bản\QD 3556 sua doi bo sung 3176\261116_Chuan du lieu dau ra (sua 3176)_Final.xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)

all_changes = {}
summary = []

for sheetname in wb.sheetnames:
    ws = wb[sheetname]
    header_row = 2
    headers = [str(ws.cell(header_row, col).value or '').strip() for col in range(1, ws.max_column + 1)]
    
    change_col_idx = None
    qd3176_col_idx = None
    qd130_col_idx = None
    qd4750_col_idx = None
    
    for idx, h in enumerate(headers):
        if 'Sửa đổi' in h or 'bổ sung' in h:
            change_col_idx = idx + 1
        if '3176' in h:
            qd3176_col_idx = idx + 1
        if '130' in h:
            qd130_col_idx = idx + 1
        if '4750' in h:
            qd4750_col_idx = idx + 1
            
    sheet_changes = []
    total_fields = 0
    for r in range(3, ws.max_row + 1):
        stt = ws.cell(r, 1).value
        chi_tieu = ws.cell(r, 2).value
        if not chi_tieu:
            continue
        total_fields += 1
        kieu = ws.cell(r, 3).value
        kich_thuoc = ws.cell(r, 4).value
        
        change_val = ws.cell(r, change_col_idx).value if change_col_idx else None
        qd3176_val = ws.cell(r, qd3176_col_idx).value if qd3176_col_idx else None
        
        if change_val is not None and str(change_val).strip() != '':
            sheet_changes.append({
                'row': r,
                'stt': stt,
                'chi_tieu': str(chi_tieu).strip(),
                'kieu': str(kieu or '').strip(),
                'kich_thuoc': str(kich_thuoc or '').strip(),
                'dien_giai_3176': str(qd3176_val or '').strip(),
                'sua_doi_3556': str(change_val).strip()
            })
            
    all_changes[sheetname] = {
        'total_fields': total_fields,
        'change_count': len(sheet_changes),
        'changes': sheet_changes
    }
    summary.append((sheetname, total_fields, len(sheet_changes)))

print(f"{'Sheet Name':<30} | {'Total Fields':<12} | {'Changes':<10}")
print("-" * 60)
total_c = 0
for s, tf, c in summary:
    print(f"{s:<30} | {tf:<12} | {c:<10}")
    total_c += c
print("-" * 60)
print(f"TOTAL CHANGES ACROSS ALL SHEETS: {total_c}")

with open('scratch_qd3556_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(all_changes, f, ensure_ascii=False, indent=2)
print("Saved details to scratch_qd3556_analysis.json")
