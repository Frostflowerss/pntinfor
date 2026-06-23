# PNT ARCH — Portfolio (Next.js + Supabase)

Website portfolio kiến trúc sư, song ngữ **VI/EN**, có **trang quản trị ẩn** tại `/pntarch` để tự thêm/sửa dự án, ảnh, hồ sơ — **không cần vào Supabase**.

- **Frontend:** Next.js 15 (App Router) + Tailwind + Framer Motion
- **Dữ liệu & ảnh:** Supabase (Postgres + Storage)
- **Admin ẩn:** `/pntarch` — không có link nào trên web, đã chặn khỏi Google & sitemap

> Trước khi cấu hình Supabase, web vẫn chạy và hiển thị sẵn nội dung mẫu (10 dự án thật). Khi nối Supabase + chạy `seed.sql`, mọi nội dung sẽ sửa được trong panel.

---

## 1. Chạy thử ở máy (local)

Yêu cầu: **Node.js 18.18+** (khuyến nghị 20+).

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở http://localhost:3000 — web đã chạy với nội dung mẫu.
Trang quản trị: http://localhost:3000/pntarch (đăng nhập **chưa hoạt động đầy đủ** cho tới khi điền biến môi trường ở bước 3).

---

## 2. Tạo project Supabase (cơ bản)

1. Vào https://supabase.com → **Sign in** (đăng nhập bằng GitHub/Google).
2. Bấm **New project**.
   - **Name:** pntarch (tùy ý)
   - **Database Password:** đặt một mật khẩu mạnh và **lưu lại**.
   - **Region:** chọn gần Việt Nam (vd Singapore).
3. Đợi ~1–2 phút cho project khởi tạo xong.

### 2.1. Tạo bảng + bucket ảnh
1. Trong project, mở **SQL Editor** (thanh trái) → **New query**.
2. Mở file `supabase/schema.sql` trong source này, **copy toàn bộ** dán vào, bấm **Run**.
   → Tự tạo tất cả bảng, bật bảo mật (RLS) cho phép đọc công khai, và tạo bucket ảnh `portfolio`.
3. (Khuyến nghị) Mở tiếp `supabase/seed.sql`, copy–dán vào New query → **Run**.
   → Đổ sẵn 10 dự án + hồ sơ + kinh nghiệm thật vào DB để sửa ngay trong panel (ảnh thêm sau qua panel).

### 2.2. Lấy khóa kết nối
Vào **Project Settings → API**, copy 3 giá trị:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role** key (bí mật!) → `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Điền biến môi trường

Mở `.env.local` và điền:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...        # anon public
SUPABASE_SERVICE_ROLE_KEY=eyJ...            # service_role (TUYỆT ĐỐI không công khai)

ADMIN_USERNAME=PNTARCH
ADMIN_PASSWORD=!27021998
ADMIN_SESSION_SECRET=  # dán 1 chuỗi ngẫu nhiên dài, vd chạy: openssl rand -hex 32

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Lưu lại, rồi chạy lại:
```bash
npm run dev
```

---

## 4. Dùng trang quản trị `/pntarch`

1. Vào http://localhost:3000/pntarch
2. Đăng nhập: **ID** `PNTARCH` · **Mật khẩu** `!27021998`
3. Trong panel:
   - **Dự án → Thêm dự án:** điền tên (VI + EN), cấp công trình, địa điểm, vai trò, tổng quan, các đầu việc; **kéo–thả ảnh bìa và ảnh chi tiết** (tải thẳng lên Supabase, hiện thumbnail). Bấm *Tạo dự án*.
   - **Hồ sơ & Trang chủ:** ảnh đại diện, CV (PDF), liên hệ, tiêu đề + mô tả trang chủ, giới thiệu — tất cả có ô **VI và EN** riêng.
   - **Kinh nghiệm / Học vấn / Kĩ năng / Thư viện:** thêm–sửa–xóa tương tự.

Mọi thay đổi xuất hiện trên web sau vài giây (web tự làm mới).

---

## 5. Đưa lên mạng (deploy Vercel)

1. Đẩy source lên một repo GitHub (đừng commit `.env.local`).
2. Vào https://vercel.com → **Add New → Project** → chọn repo.
3. Mục **Environment Variables**: thêm **đúng các biến** ở `.env.local`
   (nhớ đổi `NEXT_PUBLIC_SITE_URL` thành tên miền thật, vd `https://ten-mien.vercel.app`).
4. **Deploy**. Xong, admin vẫn ở `<tên-miền>/pntarch`.

---

## Bảo mật & ghi chú
- `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng phía **server** (API/Server Action) sau khi đã đăng nhập admin — không bao giờ lộ ra trình duyệt.
- Khách chỉ có quyền **đọc** dữ liệu (RLS). Ghi/sửa/tải ảnh chỉ thực hiện qua phiên đăng nhập admin.
- Đổi `ADMIN_PASSWORD` và `ADMIN_SESSION_SECRET` bất cứ lúc nào trong biến môi trường.
- Muốn đổi đường dẫn admin khỏi `/pntarch`: đổi tên thư mục `src/app/pntarch` và sửa `disallow` trong `src/app/robots.ts`.

## Lệnh hữu ích
```bash
npm run dev      # chạy phát triển
npm run build    # build production
npm run start    # chạy bản build
```
