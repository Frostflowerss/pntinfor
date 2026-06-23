"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePointerFine } from "./Interactive";

type Counts = { work: number; skills: number; experience: number; education: number };
type P = {
  x: number; y: number;       // current position
  hx: number; hy: number;     // idle home (wanders, toroidal)
  ivx: number; ivy: number;   // idle drift velocity
  jx: number; jy: number;     // stable jitter for the focus ring
  size: number;               // glow diameter
  phase: number;              // twinkle phase
  hub: boolean;
  framed: boolean;
  fx: number; fy: number;     // focus-ring target
};

/**
 * Ambient firefly network background.
 * Soft glowing particles drift on their own, gather gently toward the
 * cursor, and — when a content block is centred in the viewport — a few
 * of them swarm around its edges like fireflies (a quiet highlight).
 * Pure background: pointer-events none, hidden in print, static on
 * reduced-motion, lighter on touch.
 */
export function MeshNetwork({ counts }: { counts: Counts }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const fine = usePointerFine();

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const motion = !reduce;
    const light = document.documentElement.getAttribute("data-theme") === "light";
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const total = fine ? 64 : 36;
    const FRAME_N = Math.min(total, 40);
    const hubTotal = clamp(counts.work + counts.skills + counts.experience + counts.education, 4, 10);

    // soft glow sprite (rendered once)
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    if (light) {
      g.addColorStop(0, "rgba(70,110,220,.9)");
      g.addColorStop(0.3, "rgba(92,140,255,.4)");
      g.addColorStop(1, "rgba(92,140,255,0)");
    } else {
      g.addColorStop(0, "rgba(210,228,255,1)");
      g.addColorStop(0.28, "rgba(124,162,255,.5)");
      g.addColorStop(1, "rgba(92,140,255,0)");
    }
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 64, 64);
    const blend: GlobalCompositeOperation = light ? "source-over" : "lighter";
    const coreCol = light ? "rgba(60,100,210," : "rgba(226,238,255,";
    const lineCol = light ? "30,70,180" : "124,162,255";
    const baseAlpha = light ? 0.5 : 0.62;

    let W = 0, H = 0;
    let ps: P[] = [];
    const seed = () => {
      ps = Array.from({ length: total }, (_, i) => {
        const hx = rand(-40, W + 40), hy = rand(-40, H + 40);
        const hub = i < hubTotal;
        return {
          x: hx, y: hy, hx, hy,
          ivx: rand(-0.16, 0.16), ivy: rand(-0.16, 0.16),
          jx: rand(-16, 16), jy: rand(-16, 16),
          size: rand(9, 20) * (hub ? 1.5 : 1),
          phase: rand(0, 6.28), hub, framed: false, fx: hx, fy: hy,
        };
      });
    };
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    setSize();

    // ---- focus tracking ----
    let activeEl: Element | null = null;
    let pickDirty = true;
    const pickFocus = () => {
      const tagged = document.querySelectorAll("[data-fx-focus]");
      const list = tagged.length ? tagged : document.querySelectorAll("main section, main article");
      const vc = H / 2;
      let best: Element | null = null, bestD = Infinity;
      list.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 90 || r.top > H - 90 || r.height < 80) return;
        const d = Math.abs(r.top + r.height / 2 - vc);
        if (d < bestD) { bestD = d; best = el; }
      });
      activeEl = best;
    };

    // ---- cursor ----
    let mx = -1, my = -1;
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = my = -1; };
    const onScroll = () => { pickDirty = true; };
    if (fine && motion) window.addEventListener("pointermove", onMove, { passive: true });
    if (fine) window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    const FOLLOW_R = 300;
    let raf = 0;

    const assignFocus = () => {
      let rect: DOMRect | null = null;
      if (motion && activeEl) {
        const r = activeEl.getBoundingClientRect();
        if (r.bottom > 90 && r.top < H - 90) rect = r;
      }
      if (!rect) { for (const p of ps) p.framed = false; return null; }
      const pad = 26;
      const L = clamp(rect.left - pad, 12, W - 12);
      const T = clamp(rect.top - pad, 80, H - 24);
      const R = clamp(rect.right + pad, 12, W - 12);
      const B = clamp(rect.bottom + pad, 80, H - 24);
      const w = Math.max(1, R - L), h = Math.max(1, B - T), peri = 2 * (w + h);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        if (i < FRAME_N) {
          let d = (i / FRAME_N) * peri, bx: number, by: number;
          if (d < w) { bx = L + d; by = T; }
          else if ((d -= w) < h) { bx = R; by = T + d; }
          else if ((d -= h) < w) { bx = R - d; by = B; }
          else { d -= w; bx = L; by = B - d; }
          p.fx = bx; p.fy = by; p.framed = true;
        } else p.framed = false;
      }
      return { cx: (L + R) / 2, cy: (T + B) / 2 };
    };

    const step = (t: number) => {
      if (pickDirty) { pickFocus(); pickDirty = false; }
      const focus = assignFocus();
      const mouseOn = mx > 0;

      // update positions
      for (const p of ps) {
        if (motion) {
          p.hx += p.ivx; p.hy += p.ivy;
          if (p.hx < -40) p.hx = W + 40; else if (p.hx > W + 40) p.hx = -40;
          if (p.hy < -40) p.hy = H + 40; else if (p.hy > H + 40) p.hy = -40;
        }
        let tx = p.hx, ty = p.hy, ease = 0.045;
        if (p.framed) {
          const wob = Math.sin(t * 0.0014 + p.phase) * 6;
          tx = p.fx + p.jx + wob; ty = p.fy + p.jy - wob; ease = 0.07;
        } else if (mouseOn) {
          const d = Math.hypot(p.hx - mx, p.hy - my);
          if (d < FOLLOW_R) {
            const f = (1 - d / FOLLOW_R) * 0.55;
            tx = p.hx + (mx - p.hx) * f; ty = p.hy + (my - p.hy) * f;
          }
        }
        p.x += (tx - p.x) * ease; p.y += (ty - p.y) * ease;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";

      // faint mesh links
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          const lit = a.framed && b.framed;
          const lim = lit ? 140 : 116;
          if (d < lim) {
            const k = 1 - d / lim;
            ctx.strokeStyle = `rgba(${lineCol},${k * (lit ? 0.26 : 0.12)})`;
            ctx.lineWidth = k * (lit ? 0.9 : 0.6);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      // cursor links
      if (mouseOn) {
        for (const p of ps) {
          const d = Math.hypot(p.x - mx, p.y - my);
          if (d < 150) {
            const k = 1 - d / 150;
            ctx.strokeStyle = `rgba(${lineCol},${k * 0.22})`;
            ctx.lineWidth = k * 0.7;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke();
          }
        }
      }

      // glowing fireflies (additive)
      ctx.globalCompositeOperation = blend;
      for (const p of ps) {
        const tw = 0.6 + 0.4 * Math.sin(t * 0.002 + p.phase);
        const lvl = p.framed ? 1.3 : 1;
        const a = baseAlpha * tw * lvl;
        const s = p.size * (p.framed ? 1.12 : 1);
        ctx.globalAlpha = clamp(a * 0.85, 0, 1);
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      // crisp cores
      for (const p of ps) {
        const tw = 0.6 + 0.4 * Math.sin(t * 0.002 + p.phase);
        ctx.globalAlpha = clamp(baseAlpha * tw * (p.framed ? 1.5 : 1.1), 0, 1);
        ctx.fillStyle = coreCol + "1)";
        const r = p.hub ? 1.6 : 1.1;
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
      }
      // cursor firefly
      if (mouseOn) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(sprite, mx - 26, my - 26, 52, 52);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (motion) raf = requestAnimationFrame(step);
    };

    pickFocus();
    step(0);
    window.addEventListener("resize", setSize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, fine, counts]);

  return (
    <div aria-hidden data-fx className="fx-bg pointer-events-none fixed inset-0 -z-10 print:hidden">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
