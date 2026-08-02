import { NextResponse, type NextRequest } from "next/server";

/**
 * Chặn ở biên cho toàn bộ /pntarch.
 *
 * Trước đây cổng duy nhất là app/pntarch/(panel)/layout.tsx. Layout không phải
 * ranh giới bảo mật: nó không render lại khi điều hướng phía client, và một
 * request RSC dựng khéo có thể nhắm thẳng vào cây page bên dưới. Middleware
 * chạy trước mọi thứ nên bịt được khoảng đó; layout vẫn giữ nguyên phần kiểm
 * tra của nó để phòng vệ nhiều lớp.
 *
 * Ở đây chỉ kiểm tra sự CÓ MẶT của cookie, không xác thực chữ ký: middleware
 * chạy trên Edge runtime, không dùng được `crypto.timingSafeEqual` của Node.
 * Việc xác thực chữ ký thật vẫn do isAuthed() làm ở phía server component và
 * route handler. Tầng này lọc sạch truy cập ẩn danh trước khi chạm tới đó.
 */
export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get("pnt_admin")?.value);
  if (hasSession) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/pntarch";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  // Khớp mọi thứ dưới /pntarch TRỪ chính trang đăng nhập.
  matcher: ["/pntarch/:path+"],
};
