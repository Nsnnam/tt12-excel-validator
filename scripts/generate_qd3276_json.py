import json
import os

qd3276_data = [
    {
        "id": "pl-01",
        "title": "Phụ lục 1 · Danh mục mã đối tượng đến khám bệnh, chữa bệnh",
        "headers": [
            "STT",
            "Mã đối tượng (MA_DOITUONG_KCB)",
            "Trường hợp",
            "Quy định",
            "Mức hưởng (MUC_HUONG)",
            "Ghi chú"
        ],
        "rows": [
            [
                "1",
                "1.1",
                "Đến KCB đúng cơ sở KCB nơi đăng ký KCB BHYT ban đầu (Trừ trường hợp quy định tại mã 1.2)",
                "",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "2",
                "1.2",
                "Đi KCB tại cơ sở KCB cấp ban đầu bao gồm trạm y tế, cơ sở KCB y học gia đình, trạm y tế quân - dân y, trung tâm y tế huyện (trung tâm y tế khu vực từ 01/7/2025) được cấp giấy phép hoạt động theo hình thức tổ chức là phòng khám, y tế cơ quan, đơn vị, tổ chức được tổ chức dưới hình thức trạm y tế hoặc phòng khám, cơ sở KCB cấp ban đầu trong quân đội, công an (Bao gồm cả trường hợp đến đúng cơ sở KCB nơi đăng ký KCB BHYT ban đầu và đi KCB không đúng nơi đăng ký KCB BHYT ban đầu)",
                "- Điểm c khoản 1 Điều 22 Luật BHYT\n- Điểm c khoản 4 Điều 22 Luật BHYT\n- Điều 3 Thông tư số 01/2025/TT-BYT",
                "100% chi phí KCB theo phạm vi quyền lợi (không phụ thuộc mức hưởng trên thẻ BHYT)",
                ""
            ],
            [
                "3",
                "1.3",
                "Đến KCB có phiếu chuyển cơ sở KCB (Bao gồm Phiếu chuyển cơ sở KCB có giá trị 1 năm)",
                "Điều 9, Điều 10 Thông tư số 01/2025/TT-BYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "4",
                "1.4",
                "Trường hợp KCB khi thay đổi nơi lưu trú, nơi cư trú theo quy định tại Điều 4 Thông tư số 01/2025/TT-BYT",
                "- Khoản 3 Điều 22 Luật BHYT\n- Điều 4 Thông tư số 01/2025/TT-BYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "5",
                "1.5",
                "Đến KCB theo phiếu hẹn khám lại theo quy định tại Điều 11 Thông tư số 01/2025/TT-BYT",
                "Điều 11 Thông tư số 01/2025/TT-BYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "6",
                "1.6",
                "Người đã hiến bộ phận cơ thể của mình phải điều trị ngay sau khi hiến bộ phận cơ thể",
                "Khoản 4 Điều 37 Nghị định số 188/2025/NĐ-CP",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "7",
                "1.7",
                "Trẻ sơ sinh phải điều trị ngay sau khi sinh ra",
                "Khoản 2 Điều 37 Nghị định số 188/2025/NĐ-CP",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "8",
                "1.11",
                "Tự đến KCB tại cơ sở KCB cấp ban đầu còn lại không thuộc mã 1.2",
                "Điểm c khoản 4 Điều 22 Luật BHYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "9",
                "1.12",
                "Tự đến KCB ngoại trú tại cơ sở KCB cấp cơ bản đạt số điểm dưới 50 điểm hoặc được tạm xếp cấp cơ bản (trừ trường hợp KCB tại cơ sở KCB cấp cơ bản mà trước ngày 01/01/2025 đã được xác định là tuyến tỉnh hoặc tuyến trung ương)",
                "Khoản 1 Điều 19 Nghị định số 188/2025/NĐ-CP",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "10",
                "1.13",
                "Tự đến KCB ngoại trú tại cơ sở KCB cấp cơ bản đạt số điểm từ 50 - 70 điểm (trừ trường hợp các bệnh thuộc Phụ lục II ban hành kèm theo Thông tư số 01/2025/TT-BYT)",
                "Khoản 2 Điều 19 Nghị định số 188/2025/NĐ-CP",
                "- Từ ngày 01/01/2025 - 30/6/2026: Không được hưởng BHYT\n- Từ ngày 01/7/2026: 50% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "11",
                "1.14",
                "Tự đến KCB ngoại trú tại cơ sở KCB cấp cơ bản mà trước ngày 01/01/2025 đã được xác định là tuyến tỉnh hoặc tuyến trung ương hoặc tương đương tuyến tỉnh hoặc tuyến trung ương (trừ trường hợp các bệnh thuộc Phụ lục II ban hành kèm theo Thông tư số 01/2025/TT-BYT)",
                "Khoản 3 Điều 19 Nghị định số 188/2025/NĐ-CP",
                "- Từ ngày 01/01/2025 - 30/6/2026: Không được hưởng BHYT\n- Từ ngày 01/7/2026: 50% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "12",
                "1.15",
                "Tự đến KCB nội trú tại cơ sở KCB cấp cơ bản",
                "Điểm d khoản 4 Điều 22 Luật BHYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "13",
                "1.16",
                "Tự đến KCB tại cơ sở KCB cấp cơ bản đối với các bệnh thuộc Phụ lục II ban hành kèm theo Thông tư số 01/2025/TT-BYT",
                "- Điểm a khoản 4 Điều 22 Luật BHYT\n- Điểm b khoản 1 Điều 5 Thông tư số 01/2025/TT-BYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "14",
                "1.17",
                "Tự đến KCB tại cơ sở KCB cấp chuyên sâu đối với các bệnh thuộc Phụ lục I ban hành kèm theo Thông tư số 01/2025/TT-BYT",
                "- Điểm a khoản 4 Điều 22 Luật BHYT\n- Điểm a khoản 1 Điều 5 Thông tư số 01/2025/TT-BYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "15",
                "1.18",
                "Tự đến KCB ngoại trú tại cơ sở KCB cấp chuyên sâu mà trước ngày 01/01/2025 đã được cơ quan có thẩm quyền xác định là tuyến tỉnh (trừ trường hợp các bệnh thuộc Phụ lục I ban hành kèm theo Thông tư số 01/2025/TT-BYT)",
                "- Điểm h khoản 4 Điều 22 Luật BHYT\n- Khoản 4 Điều 19 Nghị định số 188/2025/NĐ-CP",
                "- Từ ngày 01/01/2025 - 30/6/2026: Không được hưởng BHYT\n- Từ ngày 01/7/2026: 50% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "16",
                "2",
                "Cấp cứu",
                "Khoản 5 Điều 22 Luật BHYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "17",
                "3.1",
                "Tự đến KCB tại cơ sở KCB cấp chuyên sâu mà trước ngày 01/01/2025 đã được cơ quan có thẩm quyền xác định là tuyến trung ương (trừ đối tượng quy định tại mã 1.17)",
                "Điểm g khoản 4 Điều 22 Luật BHYT",
                "- 40% chi phí KCB nội trú theo phạm vi quyền lợi, mức hưởng\n- 0% chi phí KCB ngoại trú",
                ""
            ],
            [
                "18",
                "3.2",
                "Tự đến KCB nội trú tại cơ sở KCB cấp chuyên sâu mà trước ngày 01/01/2025 đã được cơ quan có thẩm quyền xác định là tuyến tỉnh (trừ đối tượng quy định tại mã 1.17)",
                "Điểm h khoản 4 Điều 22 Luật BHYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "19",
                "3.3",
                "Tự đến KCB tại cơ sở KCB cấp cơ bản, cấp chuyên sâu mà trước ngày 01/01/2025 đã được cơ quan có thẩm quyền xác định là tuyến huyện",
                "Điểm đ khoản 4 Điều 22 Luật BHYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                "Bổ sung"
            ],
            [
                "20",
                "3.6",
                "Người dân tộc thiểu số và người thuộc hộ nghèo đang sinh sống tại vùng có điều kiện kinh tế - xã hội khó khăn, vùng có điều kiện kinh tế - xã hội đặc biệt khó khăn, người đang sinh sống tại xã đảo, huyện đảo khi đến KCB nội trú tại cơ sở KCB cấp chuyên sâu",
                "Điểm b khoản 4 Điều 22 Luật BHYT",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "21",
                "7",
                "Lĩnh thuốc theo giấy hẹn (chỉ lĩnh thuốc, không khám bệnh) trong trường hợp dịch bệnh nhóm A hoặc trường hợp bất khả kháng",
                "",
                "100% chi phí KCB theo phạm vi quyền lợi, mức hưởng",
                ""
            ],
            [
                "23",
                "7.2",
                "Người bệnh uỷ quyền cho người khác đến cơ sở khám bệnh, chữa bệnh lĩnh thuốc",
                "- Khoản 1 Điều 15 Thông tư số 37/2024/TT-BYT\n- Điểm a khoản 4 Điều 9 Thông tư 26/2025/TT-BYT",
                "",
                ""
            ],
            [
                "24",
                "7.3",
                "Người bệnh đến lĩnh thuốc tại cơ sở KCB khác mà không thể đến được cơ sở KCB nơi cấp giấy hẹn. Cơ sở KCB nơi cấp giấy hẹn chuyển thuốc cho cơ sở KCB nơi người bệnh đến lĩnh thuốc (Chỉ áp dụng trong trường hợp dịch bệnh nhóm A)",
                "Khoản 1 Điều 15 Thông tư số 37/2024/TT-BYT",
                "",
                ""
            ],
            [
                "25",
                "7.4",
                "Cơ sở KCB chuyển thuốc đến cho người bệnh (Chỉ áp dụng trong trường hợp dịch bệnh nhóm A)",
                "Khoản 1 Điều 15 Thông tư số 37/2024/TT-BYT",
                "",
                ""
            ],
            [
                "26",
                "8",
                "Thu hồi đề nghị thanh toán",
                "",
                "",
                ""
            ],
            [
                "27",
                "9",
                "Người bệnh không KCB BHYT",
                "",
                "0%",
                ""
            ],
            [
                "28",
                "10",
                "Người bệnh đến cơ sở KCB để lĩnh thuốc theo giấy hẹn (chỉ lĩnh thuốc, không khám bệnh, trừ trường hợp quy định tại mã 7)",
                "",
                "Phạm vi quyền lợi, mức hưởng tuỳ thuộc vào từng trường hợp cụ thể",
                ""
            ]
        ],
        "notes": [
            "Mã đối tượng đến khám bệnh, chữa bệnh được cơ sở khám bệnh, chữa bệnh xác định sau khi kết thúc khám bệnh hoặc kết thúc điều trị đối với người bệnh để gửi dữ liệu điện tử XML lên Cổng tiếp nhận của cơ quan bảo hiểm xã hội.",
            "Trường hợp một người bệnh đến khám bệnh, chữa bệnh có thể áp dụng nhiều hơn 01 mã đối tượng thì cơ sở khám bệnh, chữa bệnh lựa chọn mã đối tượng theo thứ tự sắp xếp từ trên xuống dưới.",
            "Quyết định số 3276/QĐ-BYT năm 2025 bãi bỏ Phụ lục 5 Quyết định số 2010/QĐ-BYT ngày 19/6/2025 của Bộ trưởng Bộ Y tế."
        ]
    },
    {
        "id": "pl-02",
        "title": "Phụ lục 2 · Danh mục mã nhiên liệu (xăng, dầu, điện)",
        "headers": [
            "STT",
            "Loại nhiên liệu",
            "Mã xăng dầu Vùng 1 (MA_XANG_DAU)",
            "Mã xăng dầu Vùng 2 (MA_XANG_DAU)",
            "Ghi chú"
        ],
        "rows": [
            ["1", "Xăng RON 95-IV", "R954V1", "R954V2", ""],
            ["2", "Xăng RON95-III", "R953V1", "R953V2", ""],
            ["3", "Xăng sinh học E5 RON 92-II", "E922V1", "E922V2", ""],
            ["4", "Dầu DO 0,001S-V", "D1S5V1", "D1S5V2", ""],
            ["5", "Dầu DO 0,05S-II", "D5S2V1", "D5S2V2", ""],
            ["6", "Xăng RON 95-V", "R955V1", "R955V2", ""],
            ["7", "Xăng sinh học E10", "E10V1", "E10V2", ""],
            ["8", "Sử dụng điện (sạc điện, pin,...)", "XEDIEN", "XEDIEN", "Dùng chung mã cho cả vùng 1 và vùng 2"]
        ],
        "notes": [
            "Việc thanh toán chi phí vận chuyển người bệnh thực hiện theo quy định tại Điều 14 Nghị định số 188/2025/NĐ-CP.",
            "Quyết định số 3276/QĐ-BYT năm 2025 bãi bỏ Phụ lục 5 danh mục mã xăng, dầu ban hành kèm theo Quyết định số 824/QĐ-BYT ngày 15/02/2023 của Bộ trưởng Bộ Y tế."
        ]
    }
]

output_path = r"C:\Users\Admin\Projects\tt12-excel-validator\client\src\data\qd3276-phu-luc.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(qd3276_data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {output_path} with {len(qd3276_data)} tables.")
