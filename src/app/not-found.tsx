import "./globals.css";
import { NotFoundView } from "@/components/site/NotFoundView";

/**
 * Bắt các URL không khớp bất kỳ route nào. Render ngoài layout (site) nên
 * không có header/footer, nhưng vẫn giữ thương hiệu thay vì rơi vào trang 404
 * mặc định trần trụi của Next.
 */
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center">
      <NotFoundView />
    </main>
  );
}
