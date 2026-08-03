"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string | null | undefined;
  alt: string;
  wrapperClassName?: string;
};

/** Renders a blueprint placeholder when no URL is set (pre-Supabase / empty). */
function Placeholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-[var(--ink-soft)]",
        className
      )}
      aria-hidden
    >
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-fg-faint">
        <path
          d="M3 3h18v18H3zM3 9h18M9 3v18"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function SmartImage({
  src,
  alt,
  className,
  wrapperClassName,
  fill,
  priority,
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={cn("relative overflow-hidden", wrapperClassName)}>
        <Placeholder className={className as string} />
      </div>
    );
  }

  // Ảnh priority là ứng viên LCP. Cổng opacity-0 → chờ onLoad của React → fade
  // 700ms khiến phần tử vô hình tại thời điểm paint đầu, mà phần tử opacity 0
  // KHÔNG được tính vào LCP — hiệu ứng đẹp này tự đẩy lùi chính chỉ số nó nên
  // giúp. Với ảnh priority thì vẽ thẳng, hiệu ứng chỉ áp cho ảnh dưới màn hình.
  const fadeIn = !priority;

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {fadeIn && !loaded && <div className="skeleton absolute inset-0 z-10" />}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        onLoad={fadeIn ? () => setLoaded(true) : undefined}
        // Không có onError thì một URL Supabase hỏng sẽ để skeleton shimmer
        // quay mãi và ảnh kẹt ở opacity 0 — người dùng nhìn thấy ô trống nhấp
        // nháy vĩnh viễn. Rơi về placeholder blueprint cho dứt khoát.
        onError={() => setFailed(true)}
        className={cn(
          fadeIn && "transition-[opacity,transform,filter] duration-[760ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          fadeIn && !loaded && "opacity-0 blur-[6px] scale-[1.02]",
          fadeIn && loaded && "opacity-100 blur-0 scale-100",
          className
        )}
        {...rest}
      />
    </div>
  );
}
