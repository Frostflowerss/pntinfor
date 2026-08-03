"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export type LightboxItem = { url: string; alt: string };

export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const open = index !== null;
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      const n = items.length;
      onIndex((index + dir + n) % n);
    },
    [index, items.length, onIndex]
  );

  useEffect(() => {
    if (!open) return;

    // Trả focus về đúng ảnh đã bấm khi đóng, thay vì hất người dùng về đầu trang.
    const opener = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => !el.hasAttribute("disabled"));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return go(1);
      if (e.key === "ArrowLeft") return go(-1);
      if (e.key !== "Tab") return;

      // Nhốt Tab trong hộp thoại: nếu không, người dùng bàn phím sẽ tab ra nội
      // dung phía sau lớp phủ mờ — vẫn focus được nhưng không nhìn thấy gì.
      const els = focusables();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // Chờ một frame cho AnimatePresence gắn node vào DOM rồi mới focus.
    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      opener?.focus?.();
    };
  }, [open, go, onClose]);

  // Phải portal ra thẳng <body>. Lightbox được render bên trong wrapper của
  // app/(site)/template.tsx, mà wrapper đó mang clip-path vĩnh viễn — một
  // ancestor có clip-path cắt hình mọi con, kể cả con position:fixed. Đo được
  // là lớp phủ mất góc trên-phải ở mọi vị trí cuộn, đúng chỗ đặt nút Đóng.
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Xem ảnh ${index + 1} / ${items.length}`}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous"
                className="absolute left-3 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 hover:text-white sm:left-6"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label="Next"
                className="absolute right-3 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 hover:text-white sm:right-6"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <motion.div
            key={index}
            className="relative mx-12 h-[82vh] w-[min(92vw,1100px)]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[index].url}
              alt={items[index].alt}
              fill
              sizes="92vw"
              className="object-contain"
              priority
            />
          </motion.div>

          {items.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-white/60">
              {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
