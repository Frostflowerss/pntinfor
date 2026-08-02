/**
 * Khung chờ khi chuyển route. Dùng đúng lớp .skeleton có sẵn trong globals.css
 * để nhịp shimmer khớp với skeleton của ảnh.
 */
export default function Loading() {
  return (
    <div className="shell pb-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">Đang tải nội dung / Loading</span>
      <div className="mb-14 max-w-3xl">
        <div className="skeleton h-3 w-40 rounded-full" />
        <div className="skeleton mt-5 h-14 w-full max-w-xl rounded-xl" />
        <div className="skeleton mt-4 h-4 w-2/3 rounded-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[16/11] w-full rounded-2xl" />
            <div className="skeleton mt-4 h-4 w-3/4 rounded-full" />
            <div className="skeleton mt-2 h-3 w-1/2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
