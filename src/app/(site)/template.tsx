"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Chuyển trang: mờ dần kèm nhô lên rất nhẹ.
 *
 * Bản cũ dùng clip-path quét chéo (polygon 115%) trong 0.7s. Hai vấn đề:
 *
 *  1. Về thẩm mỹ, một vệt cắt chéo chạy ngang màn hình mỗi lần đổi trang là
 *     hiệu ứng tự thu hút sự chú ý về chính nó — người xem nhìn hiệu ứng thay
 *     vì nhìn công trình.
 *  2. Về kỹ thuật, clip-path còn lại trên phần tử bọc TOÀN BỘ nội dung mọi
 *     trang, mà ancestor có clip-path thì cắt hình cả con position:fixed. Đo
 *     được là lớp phủ xem ảnh mất góc trên-phải ở mọi vị trí cuộn, đúng chỗ đặt
 *     nút Đóng. Trước đây phải né bằng cách portal Lightbox ra body; bỏ
 *     clip-path là dứt điểm nguyên nhân, không chỉ né triệu chứng.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.48, ease: EASE },
        // Phần dịch chuyển kết thúc sớm hơn phần mờ dần, nên mắt bắt được nội
        // dung trước khi chuyển động kịp dừng — cảm giác nhẹ và không chờ đợi.
        y: { duration: 0.62, ease: EASE },
      }}
    >
      {children}
    </motion.div>
  );
}
