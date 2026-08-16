# PNT ARCH — Portfolio & CV (Next.js 15 + Supabase)

Website portfolio kiến trúc sư, song ngữ **VI/EN**, có **Studio** (trang quản trị ẩn tại `/pntarch`) để tự thêm/sửa dự án, ảnh, hồ sơ — không cần vào Supabase.

- **Frontend:** Next.js 15 (App Router) · Tailwind · Framer Motion · `next/font` (font tự host)
- **Dữ liệu & ảnh:** Supabase (Postgres + Storage, RLS chỉ cho đọc công khai)
- **Hai "website" trong một:**
  - `/` — **CV Compact**: tờ "schedule sheet" 1440×900 toàn màn hình, tự co giãn vừa mọi màn hình (PC, laptop, tablet, điện thoại ngang); điện thoại dọc thì vừa chiều cao và vuốt ngang. Không có header/footer. VI / EN đổi ngôn ngữ (`/?lang=en`). Bấm **DETAIL** → sang website gốc.
  - `/home`, `/about`, `/work`, `/gallery` — **website gốc** (Detail) với nav Home / About / Work / Gallery như cũ; nút **COMPACT / DETAIL** ở góc trên bên phải để quay lại CV.

> Đổi đích của nút DETAIL: sửa `DETAIL_HREF` trong `src/components/cv/SheetTopbar.tsx` (mặc định `/home`).
> Chưa nối Supabase web vẫn chạy với nội dung mẫu (`src/lib/fallback.ts`). Nối Supabase + chạy `schema.sql` (và `seed.sql`) thì mọi nội dung sửa được trong Studio.

---

## 1. Chạy ở máy

Yêu cầu **Node.js 20+**.

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

## 2. Supabase

1. https://supabase.com → **New project** (Region gần Việt Nam, vd Singapore). Lưu Database Password.
2. **SQL Editor → New query**: dán toàn bộ `supabase/schema.sql` → **Run**
   (tạo bảng, bật RLS đọc công khai, tạo bucket ảnh `portfolio`).
3. (Khuyến nghị) chạy tiếp `supabase/seed.sql` để đổ sẵn 10 dự án + hồ sơ mẫu.
   **Đang nâng cấp từ bản cũ?** chạy `supabase/migration_cv_sheet.sql` thay vì `schema.sql`.
4. **Project Settings → API**: copy `Project URL`, `anon public`, `service_role` vào `.env.local`.

## 3. Biến môi trường

Điền `.env.local` theo `.env.example`. Ba biến Studio là **bắt buộc**, tự chọn giá trị của bạn:

```bash
ADMIN_USERNAME=<tự đặt>
ADMIN_PASSWORD=<mật khẩu dài, tự đặt>
ADMIN_SESSION_SECRET=<openssl rand -hex 32>
```

Login bị khóa cho tới khi `ADMIN_SESSION_SECRET` ≥ 32 ký tự. Không có giá trị mặc định nào trong mã nguồn.

## 4. Studio `/pntarch`

- **Dự án**: tên VI/EN, cấp công trình, địa điểm, vai trò, tổng quan, đầu việc, ảnh bìa + ảnh chi tiết (kéo–thả nhiều ảnh, tự nén WebP ≤ 2400px trước khi tải, kéo để sắp xếp).
- **Hồ sơ & Trang chủ**: ảnh đại diện, CV (PDF), liên hệ, hero, màu accent, và mục **Trang CV** (trạng thái Open/Busy, ngôn ngữ mặc định, mã bản vẽ, revision, 2 dòng gáy dọc).
- **Kinh nghiệm / Học vấn**: thêm **năm bắt đầu / kết thúc** để vẽ đúng trên trục thời gian; học vấn chọn **Bằng cấp** (thanh rỗng) hoặc **Khóa học** (kim cương).
- **Kĩ năng**: trình độ → mã EXP/ADV/SKI/BAS + màu; tên ngắn cho tờ Compact.
- **Thư viện**: tải nhiều ảnh, kéo sắp xếp, sửa chú thích (alt), đổi ngang/dọc, xóa (xóa cả file Storage).

Mọi thay đổi xuất hiện trên web trong ~1 phút (ISR) hoặc ngay lập tức sau khi lưu.

## 5. Deploy (Vercel)

1. Đẩy repo lên GitHub (**không** commit `.env.local`).
2. Vercel → **Add New → Project** → chọn repo → **Environment Variables**: thêm đúng các biến ở `.env.local`, đổi `NEXT_PUBLIC_SITE_URL` thành tên miền thật.
3. Deploy. Studio ở `<tên-miền>/pntarch`.

## Bảo mật (đã cài sẵn)

- Ghi/sửa/tải ảnh chỉ qua Server Actions / API sau khi xác thực cookie phiên (HMAC-SHA256, `httpOnly`, `SameSite=Strict`, hết hạn 8h). `SUPABASE_SERVICE_ROLE_KEY` chỉ chạy phía server.
- Đăng nhập: khóa 15 phút sau 5 lần sai (theo IP), so sánh hằng thời gian.
- Upload: kiểm tra **magic bytes** (không tin MIME/đuôi file), giới hạn dung lượng, tên file UUID, `Cache-Control: immutable`.
- Header bảo mật: CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`; `/pntarch` và `/api` `noindex` + `no-store`; `X-Powered-By` tắt.
- Đổi đường dẫn Studio: đổi tên thư mục `src/app/pntarch` + `disallow` trong `src/app/robots.ts` + `headers()` trong `next.config.mjs`.

## Lệnh

```bash
npm run dev      # phát triển
npm run build    # build production
npm run start    # chạy bản build
npm run lint
```
