import openpyxl
import json
import re

excel_path = r'J:\Users\Admin\Desktop\2026\11.2026\0-Văn bản\QD 3556 sua doi bo sung 3176\261116_Chuan du lieu dau ra (sua 3176)_Final.xlsx'
wb = openpyxl.load_workbook(excel_path, data_only=True)

tables = []

sheet_id_map = {
    'Bang Check-in': 'bang-checkin',
    'Bang 1_Tong hop': 'bang-1',
    'Bang 2_Thuoc ': 'bang-2',
    'Bang 2_Thuoc': 'bang-2',
    'Bang 3_DVKT, VTYT': 'bang-3',
    'Bang 4_Dich vu CLS': 'bang-4',
    'Bang 5_Dien bien lam sang': 'bang-5',
    'Bang 6_HIV.AIDS': 'bang-6',
    ' Bang 7_Giay ra vien': 'bang-7',
    'Bang 7_Giay ra vien': 'bang-7',
    'Bang 8_Tom tat HSBA': 'bang-8',
    'Bang 9_Giay chung sinh': 'bang-9',
    'Bang 10_Giay nghi duong thai': 'bang-10',
    'Bang 11_Giay nghi huong BHXH': 'bang-11',
    'Bang 12_GDYK': 'bang-12',
    'Bang 13_Giay chuyen tuyen BHYT': 'bang-13',
    'Bang 14_Giay hen kham lai': 'bang-14',
    'Bang 15_Lao': 'bang-15',
}

for sheetname in wb.sheetnames:
    ws = wb[sheetname]
    clean_sheetname = sheetname.strip()
    table_id = sheet_id_map.get(sheetname) or sheet_id_map.get(clean_sheetname) or f"bang-{len(tables)+1}"
    
    title = str(ws.cell(1, 1).value or '').strip()
    if not title:
        title = f"Bảng chuẩn dữ liệu đầu ra {clean_sheetname}"
    
    # Header row is row 2
    raw_headers = [ws.cell(2, c).value for c in range(1, ws.max_column + 1)]
    # Filter out trailing None headers
    last_h_idx = 0
    for idx, h in enumerate(raw_headers):
        if h is not None and str(h).strip() != '':
            last_h_idx = idx + 1
            
    headers = [str(ws.cell(2, c).value or f'Cột {c}').strip() for c in range(1, last_h_idx + 1)]
    
    # Normalize headers
    norm_headers = []
    for h in headers:
        if 'Sửa đổi' in h and 'bổ sung' in h and '3556' not in h and '4750' not in h:
            norm_headers.append('Sửa đổi, bổ sung theo QĐ 3556/QĐ-BYT')
        else:
            norm_headers.append(h)
            
    rows = []
    for r in range(3, ws.max_row + 1):
        # Check if row is empty
        row_vals = [ws.cell(r, c).value for c in range(1, last_h_idx + 1)]
        if not any(v is not None and str(v).strip() != '' for v in row_vals):
            continue
        
        # Format values to string
        row_strs = []
        for v in row_vals:
            if v is None:
                row_strs.append('')
            elif isinstance(v, float) and v.is_integer():
                row_strs.append(str(int(v)))
            else:
                row_strs.append(str(v).strip())
        rows.append(row_strs)
        
    tables.append({
        'id': table_id,
        'name': clean_sheetname,
        'title': title,
        'headers': norm_headers,
        'rows': rows,
        'changeCount': sum(1 for row in rows if len(row) >= len(norm_headers) and 'Sửa đổi, bổ sung theo QĐ 3556/QĐ-BYT' in norm_headers and row[norm_headers.index('Sửa đổi, bổ sung theo QĐ 3556/QĐ-BYT')].strip() != '')
    })

print(f"Parsed {len(tables)} tables.")
for t in tables:
    print(f"  {t['id']:<15} | {t['name']:<30} | {len(t['rows']):<4} rows | {t['changeCount']} changes")

with open('client/src/data/qd3556-chuan-dau-ra.json', 'w', encoding='utf-8') as f:
    json.dump(tables, f, ensure_ascii=False, indent=2)

print("Saved to client/src/data/qd3556-chuan-dau-ra.json successfully!")
