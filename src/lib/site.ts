/**
 * URL gốc của site, dùng chung cho metadataBase, sitemap.xml và robots.txt.
 *
 * Trước đây ba nơi tự fallback về http://localhost:3000. Nếu quên đặt
 * NEXT_PUBLIC_SITE_URL trên production thì OG URL, sitemap và dòng `Sitemap:`
 * trong robots.txt đều trỏ localhost mà không có dấu hiệu gì — Google nuốt
 * trọn một sitemap vô dụng. Nay cảnh báo rõ lúc build/khởi động.
 */
const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (!fromEnv && process.env.NODE_ENV === "production") {
  console.warn(
    "[site] NEXT_PUBLIC_SITE_URL chưa được đặt — metadata, sitemap và robots " +
      "sẽ trỏ về localhost. Đặt biến này thành domain thật trước khi deploy."
  );
}

export const SITE_URL = (fromEnv || "http://localhost:3000").replace(/\/+$/, "");
