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

export function SmartImage({ src, alt, className, wrapperClassName, fill, ...rest }: Props) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return (
      <div className={cn("relative overflow-hidden", wrapperClassName)}>
        <Placeholder className={className as string} />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded && <div className="skeleton absolute inset-0 z-10" />}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-[opacity,transform,filter] duration-700 ease-smooth",
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105",
          className
        )}
        {...rest}
      />
    </div>
  );
}
