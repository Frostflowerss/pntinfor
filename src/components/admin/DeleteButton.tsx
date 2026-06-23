"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteButton({
  action,
  label = "Xóa",
  confirmText = "Xóa mục này? Không thể hoàn tác.",
  compact,
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
  compact?: boolean;
}) {
  const [pending, start] = useTransition();

  function onClick() {
    if (!confirm(confirmText)) return;
    start(async () => {
      await action();
    });
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="grid h-8 w-8 place-items-center rounded-lg text-fg-faint transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        aria-label={label}
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
    >
      {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      {label}
    </button>
  );
}
