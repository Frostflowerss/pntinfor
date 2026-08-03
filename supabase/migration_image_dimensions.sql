-- Migration: lưu kích thước thật của ảnh
-- Chạy trên Supabase project đang có (an toàn khi chạy lại nhiều lần).
--
-- Vì sao cần: trước đây giao diện phải ĐOÁN tỉ lệ ảnh — ảnh chi tiết dự án bị
-- ép cứng về 900x650 rồi object-cover, nên bản vẽ dọc và ảnh panorama đều bị
-- xén. Có width/height thật thì mỗi ảnh hiển thị đúng tỉ lệ gốc, và trình duyệt
-- cũng đặt sẵn được chỗ trống nên không còn giật layout khi ảnh tải xong.
--
-- Ảnh cũ sẽ có width/height = null; giao diện tự quay về cách hiển thị cũ cho
-- những ảnh đó, nên không cần làm gì thêm. Tải lại ảnh là có kích thước thật.

alter table public.project_images add column if not exists width  int;
alter table public.project_images add column if not exists height int;

alter table public.gallery_images add column if not exists width  int;
alter table public.gallery_images add column if not exists height int;
