# PNT Architect Portfolio (Next.js + Once UI)

## 1) Tổng quan cấu trúc nội dung
Website dùng **dữ liệu tĩnh** trong `src/resources/*` và ảnh nằm trong `public/images/*`.
Mỗi khu vực **Home / About / Work / Gallery dùng nguồn ảnh riêng**, không ràng buộc lẫn nhau (đổi ảnh Work không ảnh hưởng Home/Gallery, v.v.).

---

## 2) Đổi ảnh theo từng trang

### 2.1 Home
**(A) Ảnh “Hình ảnh nổi bật / Featured images”**
- Cấu hình tại: `src/resources/portfolio-data.ts` → `homeShowcaseImages: string[]`
- Ảnh tương ứng nằm trong: `public/images/...` (đường dẫn bắt đầu bằng `/images/...`)

**(B) Ảnh OG/Preview cho Home (chia sẻ link)**
- Cấu hình tại: `src/resources/content.tsx` → `home.image`
- File ảnh nằm trong: `public/images/og/*`

> Lưu ý: `homeShowcaseImages` là danh sách riêng của Home. Không dùng chung với Work/Gallery trừ khi bạn tự chủ động trỏ về cùng một file.

---

### 2.2 About
**(A) Ảnh avatar**
- Cấu hình tại: `src/resources/content.tsx` → `person.avatar`
- File ảnh nằm trong: `public/images/avatar.jpg` (hoặc đổi sang file khác và sửa lại đường dẫn)

**(B) Nội dung/tiêu đề About**
- Cấu hình tại: `src/resources/content.tsx` → object `about`
- Một số thông tin liên hệ (Email/Phone/Address/CV PDF) nằm tại: `src/resources/profile.ts`

---

### 2.3 Work
**(A) Danh sách dự án + ảnh cover + ảnh chi tiết**
- Cấu hình tại: `src/resources/portfolio-data.ts` → `workProjects: WorkProject[]`
- Mỗi dự án có:
  - `cover`: ảnh đại diện của dự án (trang Work)
  - `images[]`: ảnh hiển thị trong modal chi tiết khi bấm vào dự án
  - `titleVI/titleEN`, `locationVI/locationEN`, `primaryRoleVI/primaryRoleEN`, `details...`

**(B) UI/logic hiển thị trang Work**
- Component: `src/components/work/WorkCarousel.tsx`
- Style: `src/components/work/WorkCarousel.module.scss`

> Lưu ý: Ảnh Work là ảnh riêng theo từng dự án (`/images/projects/...`). Không liên quan đến ảnh Home/Gallery trừ khi bạn tự trỏ cùng path.

---

### 2.4 Gallery
**Danh sách ảnh Gallery**
- Cấu hình tại: `src/resources/content.tsx` → object `gallery.images: {src, alt, orientation}[]`
- Ảnh tương ứng nằm trong: `public/images/gallery/*`

> Lưu ý: Gallery lấy dữ liệu từ `content.tsx` (không lấy từ `homeShowcaseImages` hay `workProjects`).

---

## 3) Đổi nội dung (text) theo từng trang
- Thông tin cá nhân, route, title/description các trang: `src/resources/content.tsx`
- Thông tin liên hệ + file CV PDF: `src/resources/profile.ts`
- Dự án Work + Home Showcase: `src/resources/portfolio-data.ts`

---

## 4) Chạy local
```bash
npm install
npm run dev
```
