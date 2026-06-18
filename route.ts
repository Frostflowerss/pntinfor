"use client";

import { Globe, Mail, Phone, MapPin, FileDown } from "lucide-react";
import { Tilt } from "@/components/ui/Interactive";
import { SmartImage } from "@/components/ui/SmartImage";
import type { Profile } from "@/lib/types";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Tilt max={7}>
      <div className="glass overflow-hidden rounded-2xl p-6">
        <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-2xl border border-[var(--line)]">
          <SmartImage
            src={profile.avatarUrl}
            alt={profile.name}
            fill
            sizes="160px"
            className="object-cover"
            wrapperClassName="absolute inset-0"
            priority
          />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm">
          <Globe size={15} className="text-accent" />
          <span>{profile.locationLabel}</span>
        </div>

        {profile.languages.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {profile.languages.map((l) => (
              <span
                key={l}
                className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-fg-muted"
              >
                {l}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 space-y-3 border-t border-[var(--line)] pt-5 text-sm">
          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-lg bg-[var(--accent-soft)] px-3 py-2.5 text-accent transition hover:brightness-110"
            >
              <FileDown size={16} />
              <span className="font-medium">Download CV (PDF)</span>
            </a>
          )}
          <ContactRow icon={Mail} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
          <ContactRow icon={Phone} label="Phone" value={profile.phone} href={`tel:${profile.phone}`} />
          <ContactRow icon={MapPin} label="Address" value={profile.addressEN} />
        </div>
      </div>
    </Tilt>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  if (!value) return null;
  const inner = (
    <div className="flex items-start gap-3">
      <Icon size={15} className="mt-0.5 shrink-0 text-fg-faint" />
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-fg-faint">{label}</p>
        <p className="truncate text-fg-muted">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block transition hover:opacity-80">
      {inner}
    </a>
  ) : (
    inner
  );
}
