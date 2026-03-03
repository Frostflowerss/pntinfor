# PNT Architect Portfolio (VI/EN)

Website portfolio cá nhân theo phong cách Magic Portfolio (Once UI + Next.js), đã tùy biến để:
- Luôn hiển thị **song ngữ 2 dòng (VI/EN)** theo palette trong CV PDF.
- **Home** tối giản + thêm cụm ảnh showcase (tự tăng dot theo số ảnh).
- **About** gọn hơn + gom **Download PDF / Email / Phone / Address** vào 1 khối.
- **Work** theo dạng **carousel cover 9:16** + click mở **modal** (carousel ảnh + mô tả song ngữ).
- **Blog** đã tắt / loại bỏ.

---

## Cấu trúc dữ liệu quan trọng

### 1) CV PDF
- File nằm ở: `public/files/PNT_CV_Architect_2025_VN-EN-2.pdf`
- Cấu hình đường dẫn tại: `src/resources/profile.ts`

### 2) Ảnh showcase (Home)
- Danh sách ảnh: `src/resources/portfolio-data.ts` → `homeShowcaseImages`
- Thêm/bớt ảnh trong mảng này thì **indicator/dot tự cập nhật**.

### 3) Dự án (Work)
- Danh sách dự án: `src/resources/portfolio-data.ts` → `workProjects`
- Mỗi dự án gồm:
  - `cover` (ảnh cover dọc, hiển thị theo **9:16**)
  - `images[]` (thường 5 ảnh để hiển thị trong modal)
  - `details` (overview + responsibilities VI/EN)

---

## Chạy local

```bash
npm install
npm run dev
```

---

## Deploy (Vercel)

- Import repo từ GitHub vào Vercel.
- Mặc định: push lên branch sẽ tạo Preview, merge `main` sẽ tạo Production.

---

## Ghi chú

- Màu chữ song ngữ (VI trắng / EN vàng) và scale chữ được set trong: `src/resources/custom.css`.
- Nếu cần thay ảnh thật theo từng dự án: thay file trong `public/images/...` hoặc chỉnh trực tiếp đường dẫn trong `portfolio-data.ts`.
