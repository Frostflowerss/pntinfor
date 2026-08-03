"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Bộ nguyên hàm chuyển động dùng chung.
 *
 * Thang giá trị khớp với các biến --dur-* / --ease-out trong globals.css. Chủ
 * trương: mờ dần dẫn dắt, dịch chuyển chỉ phụ họa (14px, không phải 24px), và
 * dừng bằng đường cong giảm tốc sâu để không thấy điểm kết.
 */
const EASE = [0.16, 1, 0.3, 1] as const;
const DUR = 0.48;
const RISE = 14;

export function Reveal({
  children,
  delay = 0,
  y = RISE,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      // margin âm nhỏ: phần tử hiện khi đã vào hẳn trong khung nhìn, tránh cảm
      // giác nội dung "đuổi theo" lúc cuộn nhanh.
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: DUR, ease: EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

const container: Variants = {
  hidden: {},
  // Nhịp so le thưa hơn (0.08 -> 0.06) để lưới dự án hiện thành một mảng liền
  // mạch thay vì đếm được từng ô.
  show: { transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: RISE },
  show: { opacity: 1, y: 0, transition: { duration: DUR, ease: EASE } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={container}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/** Chữ trượt lên sau một khe hẹp — dành riêng cho tiêu đề lớn. */
export function MaskReveal({
  children,
  delay = 0,
  className,
  as = "span",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  const Tag = as as React.ElementType;
  if (reduce) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.76, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}

export function CountUp({
  to,
  suffix = "",
  duration = 1.4,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // Giảm tốc mạnh: số nhảy nhanh lúc đầu rồi dừng hẳn, không lê thê ở cuối.
      const eased = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  );
}
