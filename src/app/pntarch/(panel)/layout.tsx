import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { isAdminConfigured } from "@/lib/supabase";
import { AdminNav } from "@/components/admin/AdminNav";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/pntarch");

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 py-8 lg:flex-row lg:px-6">
      <aside className="lg:sticky lg:top-8 lg:h-fit lg:w-64 lg:shrink-0">
        <div className="mb-6 px-3">
          <h1 className="font-display text-2xl tracking-tight">Studio</h1>
          <p className="text-xs text-fg-faint">PNT ARCH · CMS</p>
        </div>
        <AdminNav />
      </aside>

      <main className="min-w-0 flex-1">
        {!isAdminConfigured && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Chưa kết nối Supabase.</p>
              <p className="mt-1 text-amber-300/80">
                Thêm <code>SUPABASE_SERVICE_ROLE_KEY</code> và các biến môi trường vào <code>.env.local</code> (xem README) để lưu &amp; tải ảnh.
              </p>
            </div>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
