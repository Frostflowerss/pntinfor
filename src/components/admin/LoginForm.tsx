"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Lock, Loader2, KeyRound } from "lucide-react";
import { loginAction } from "@/lib/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
      Đăng nhập
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <div className="grid min-h-screen place-items-center bg-[var(--paper)] px-6">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="glass relative w-full max-w-sm rounded-2xl p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-accent">
            <KeyRound size={18} />
          </span>
          <div>
            <h1 className="font-display text-xl tracking-tight">Studio</h1>
            <p className="text-xs text-fg-faint">Khu vực quản trị</p>
          </div>
        </div>

        <form action={formAction} className="space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-fg-muted">ID</span>
            <input
              name="username"
              autoComplete="username"
              autoFocus
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--ink-soft)] px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-fg-muted">Mật khẩu</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--ink-soft)] px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </label>

          {state?.error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{state.error}</p>
          )}

          <Submit />
        </form>
      </div>
    </div>
  );
}
