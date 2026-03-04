# PNT Architect Portfolio (Next.js) — Hướng dẫn cập nhật nội dung

Tài liệu này chỉ ra **đúng file** và **dòng** cần sửa để bạn cập nhật nội dung nhanh (text/ảnh) cho các mục: **Home / About / Work / Gallery**.

> Ghi chú: Số **dòng** được tính theo phiên bản hiện tại trong ZIP (V12). Nếu bạn thêm/bớt nội dung, số dòng có thể thay đổi. Khi lệch, hãy tìm theo **từ khoá** được ghi kèm.

---

## Quy ước đường dẫn ảnh (đã tách riêng Home / Work / Gallery)

- **Home**: `public/images/home/H01.jpg ... H10.jpg`
- **Work**: `public/images/work/P01/CV01.jpg` (cover) + `DT01.jpg ...` (detail)  
  - Dự án `P02` dùng `CV02.jpg`, `DT01...` (detail trong từng dự án vẫn bắt đầu từ `DT01`)
- **Gallery**: `public/images/gallery/P01/IMG01.jpg ...`

---

## HOME

### Path sửa text
- File: `src/resources/content.tsx`
  - **Tên / vai trò / email / avatar**: dòng **5–14** (từ khoá: `const person: Person`)
    - `name`, `role`, `email`, `avatar`, `languages`, …
  - **Mô tả dưới headline (VI/EN)**: dòng **49–54** (từ khoá: `subline`)
    - VI: dòng **51**
    - EN: dòng **52**

### Path sửa ảnh
- **OG image (ảnh preview khi share link)**:
  - File: `src/resources/content.tsx`
  - Dòng **35** (từ khoá: `image: "/images/og/home.jpg"`)
  - Ảnh tương ứng: `public/images/og/home.jpg`

- **Cụm ảnh showcase chạy ở Home**:
  - File: `src/resources/portfolio-data.ts`
  - Dòng **21–33** (từ khoá: `export const homeShowcaseImages`)
  - Ảnh tương ứng: `public/images/home/H01.jpg ...`

---

## ABOUT

### TÓM TẮT CHUYÊN MÔN
- Path sửa text:
  - File: `src/resources/content.tsx`
  - Dòng **73–86** (từ khoá: `title: "TÓM TẮT CHUYÊN MÔN`)
    - VI: dòng **78–80**
    - EN: dòng **81–83**

### LỊCH SỬ CÔNG VIỆC
- Path sửa text:
  - File: `src/resources/content.tsx`
  - Dòng **87–(kéo dài)** (từ khoá: `work: {` và `experiences: [`)
  - Mỗi job là một object trong `experiences[]`:
    - `company`, `timeframe`, `role`, `achievements` (VI/EN)
- Path sửa ảnh (ảnh minh hoạ trong từng job):
  - File: `src/resources/content.tsx`
  - Dòng **106–113** (job 1) và các block `images: [` tương tự bên dưới
  - Ảnh tương ứng: `public/images/work/Pxx/CVxx.jpg`

### KĨ NĂNG PHẦN MỀM
- Path sửa text:
  - File: `src/resources/content.tsx`
  - Dòng **201–(kéo dài)** (từ khoá: `title: "KĨ NĂNG PHẦN MỀM`)
  - Mỗi kỹ năng là 1 object trong `skills[]`:
    - `title`, `tags`, `description` (VI/EN)

---

## WORK

### Path sửa text (tên dự án, vai trò, mô tả, responsibilities…)
- File: `src/resources/portfolio-data.ts`
- Danh sách dự án: dòng **60–(kéo dài)** (từ khoá: `export const workProjects`)
- Với mỗi dự án, bạn thường sửa các field:
  - `titleVI`, `titleEN`
  - `constructionClassVI/EN`
  - `locationVI/EN`
  - `primaryRoleVI/EN`
  - `details.overviewVI/EN`
  - `details.responsibilitiesVI/EN` (mảng bullet)

### Path sửa ảnh dự án (cover + ảnh chi tiết)
- File: `src/resources/portfolio-data.ts`
- Trong từng dự án:
  - `cover`: ví dụ dòng **71** của dự án P01 (từ khoá: `cover:`)
    - Ảnh tương ứng: `public/images/work/P01/CV01.jpg`
  - `images`: ví dụ dòng **72–78** của dự án P01 (từ khoá: `images: [`)
    - Ảnh tương ứng: `public/images/work/P01/DT01.jpg ...`

---

## GALLERY

### Path sửa text (tiêu đề / mô tả)
- File: `src/resources/content.tsx`
- Dòng **334–339** (từ khoá: `const gallery: Gallery`)

### Path sửa ảnh
- File: `src/resources/content.tsx`
- Dòng **339–348** (từ khoá: `images: [`)
  - Mỗi ảnh: `{ src: "...", alt: "...", orientation: "horizontal|vertical" }`
- Ảnh tương ứng: `public/images/gallery/Pxx/IMGxx.jpg`

---

## Gợi ý cách cập nhật nhanh

1. **Đổi text**: sửa `src/resources/content.tsx` (Home/About/Gallery meta) và `src/resources/portfolio-data.ts` (Work projects).
2. **Đổi ảnh**: thay file ảnh trong `public/images/...` đúng tên quy ước.
3. **Giữ đúng tên file** (CVxx/DTxx/IMGxx/Hxx) để không phải sửa code.

