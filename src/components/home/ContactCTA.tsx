import { ArrowUpRight, Mail, Phone, FileDown } from "lucide-react";
import { Reveal, MaskReveal } from "@/components/ui/motion";
import type { Profile } from "@/lib/types";

/**
 * Điểm chuyển đổi cuối trang chủ.
 *
 * Trước đây trang chủ kết thúc bằng lưới dự án rồi xuống thẳng footer: người
 * dùng đã bị thuyết phục nhưng không được mời làm gì tiếp. Toàn bộ luồng liên
 * hệ chỉ là một mailto nhỏ trong footer.
 *
 * Mọi thông tin ở đây lấy từ hồ sơ trong panel — không hardcode, và tự ẩn nếu
 * trường tương ứng bỏ trống.
 */
export function ContactCTA({ profile }: { profile: Profile }) {
  const hasContact = Boolean(profile.email || profile.phone);
  if (!hasContact) return null;

  return (
    <section className="shell scroll-mt-28 pb-24" id="contact">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--ink-soft)] px-6 py-14 sm:px-12 sm:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-faint">
            02 — Liên hệ / Contact
          </p>

          <h2 className="mt-4 max-w-2xl font-display text-4xl font-light leading-[1.05] tracking-tight sm:text-5xl">
            <MaskReveal className="vi">Cùng bàn về dự án của bạn</MaskReveal>
          </h2>
          <p lang="en" className="en mt-3 max-w-xl text-base sm:text-lg">
            Open to architecture &amp; BIM coordination roles, freelance and
            consulting work.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-[var(--paper)]"
              >
                <Mail size={16} aria-hidden />
                Gửi email / Email me
                <ArrowUpRight
                  size={16}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            )}

            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3.5 text-sm text-fg-muted transition-colors hover:border-[var(--accent)] hover:text-fg"
              >
                <Phone size={15} aria-hidden />
                {profile.phone}
              </a>
            )}

            {profile.cvUrl && (
              <a
                href={profile.cvUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3.5 text-sm text-fg-muted transition-colors hover:border-[var(--accent)] hover:text-fg"
              >
                <FileDown size={15} aria-hidden />
                Tải CV / Download CV
              </a>
            )}
          </div>

          {profile.locationLabel && (
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.25em] text-fg-faint">
              {profile.locationLabel}
              {profile.languages.length > 0 && ` · ${profile.languages.join(" · ")}`}
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
