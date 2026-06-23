"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePointerFine } from "./Interactive";

type Counts = { work: number; skills: number; experience: number; education: number };
type P = {
  x: number; y: number;       // current position
  hx: number; hy: number;     // idle "home" (drifts)
  vx: number; vy: number;     // idle drift velocity
  tx: number; ty: number;     // current target
  hub: boolean;               // bracketed accent node
  framed: boolean;            // currently part of the highlight frame
};

/**
 * Decorative site background: a drifting particle constellation that
 * reacts to reading position. As a content block enters the centre of
 * the viewport, particles ease into a network frame that surrounds it
 * (a soft highlight); when nothing is focused they float freely.
 * Pure background — never captures pointer, hidden in print, static on
 * reduced-motion, lighter on touch devices.
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
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const total = fine ? 78 : 42;
    const hubTotal = clamp(
      counts.work + counts.skills + counts.experience + counts.education,
      4,
      11
    );

    let W = 0, H = 0;
    let ps: P[] = [];

    const seed = () => {
      ps = Array.from({ length: total }, (_, i) => {
        const hx = rand(W * 0.06, W * 0.94);
        const hy = rand(H * 0.05, H * 0.92);
        return {
          x: hx, y: hy, hx, hy, tx: hx, ty: hy,
          vx: rand(-0.22, 0.22), vy: rand(-0.22, 0.22),
          hub: i < hubTotal, framed: false,
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

    // ---- focus tracking (what the user is reading) ----
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

    // ---- cursor glow (passive) ----
    let mx = -1, my = -1;
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = my = -1; };
    const onScroll = () => { pickDirty = true; };
    if (fine && motion) window.addEventListener("pointermove", onMove, { passive: true });
    if (fine) window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    const FRAME_N = Math.min(total, 46);
    let raf = 0;

    const assignTargets = () => {
      let rect: DOMRect | null = null;
      if (motion && activeEl) {
        const r = activeEl.getBoundingClientRect();
        if (r.bottom > 90 && r.top < H - 90) rect = r;
      }
      if (!rect) {
        for (const p of ps) { p.tx = p.hx; p.ty = p.hy; p.framed = false; }
        return null;
      }
      const pad = 30;
      const L = clamp(rect.left - pad, 10, W - 10);
      const T = clamp(rect.top - pad, 78, H - 24);
      const R = clamp(rect.right + pad, 10, W - 10);
      const B = clamp(rect.bottom + pad, 78, H - 24);
      const w = Math.max(1, R - L), h = Math.max(1, B - T), peri = 2 * (w + h);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        if (i < FRAME_N) {
          let d = (i / FRAME_N) * peri, tx: number, ty: number;
          if (d < w) { tx = L + d; ty = T; }
          else if ((d -= w) < h) { tx = R; ty = T + d; }
          else if ((d -= h) < w) { tx = R - d; ty = B; }
          else { d -= w; tx = L; ty = B - d; }
          p.tx = tx; p.ty = ty; p.framed = true;
        } else { p.tx = p.hx; p.ty = p.hy; p.framed = false; }
      }
      return { cx: (L + R) / 2, cy: (T + B) / 2 };
    };

    const draw = (focus: { cx: number; cy: number } | null) => {
      ctx.clearRect(0, 0, W, H);

      // soft glow around the focused block
      if (focus) {
        const g = ctx.createRadialGradient(focus.cx, focus.cy, 0, focus.cx, focus.cy, 260);
        g.addColorStop(0, "rgba(92,140,255,.06)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(focus.cx - 260, focus.cy - 260, 520, 520);
      }

      // links between nearby particles
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          const lim = a.framed && b.framed ? 150 : 120;
          if (d < lim) {
            const t = 1 - d / lim;
            const lit = a.framed && b.framed;
            ctx.strokeStyle = lit
              ? `rgba(103,232,249,${t * 0.34})`
              : `rgba(92,140,255,${t * 0.2})`;
            ctx.lineWidth = t * (lit ? 1 : 0.7);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }

      // cursor glow + links
      if (mx > 0) {
        for (const p of ps) {
          const d = Math.hypot(p.x - mx, p.y - my);
          if (d < 180) {
            const t = 1 - d / 180;
            ctx.strokeStyle = `rgba(126,162,255,${t * 0.4})`;
            ctx.lineWidth = t;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke();
          }
        }
      }

      // particles (square markers)
      for (const p of ps) {
        const r = p.hub ? 3 : 2;
        const col = p.framed ? "103,232,249" : p.hub ? "150,180,255" : "200,212,255";
        const al = p.framed ? 0.95 : p.hub ? 0.8 : 0.55;
        ctx.fillStyle = `rgba(${col},${al})`;
        ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
        if (p.hub || p.framed) {
          const br = r * 2.6, k = br * 0.5;
          ctx.strokeStyle = `rgba(${col},${p.framed ? 0.8 : 0.32})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - br, p.y - br + k); ctx.lineTo(p.x - br, p.y - br); ctx.lineTo(p.x - br + k, p.y - br);
          ctx.moveTo(p.x + br - k, p.y - br); ctx.lineTo(p.x + br, p.y - br); ctx.lineTo(p.x + br, p.y - br + k);
          ctx.moveTo(p.x + br, p.y + br - k); ctx.lineTo(p.x + br, p.y + br); ctx.lineTo(p.x + br - k, p.y + br);
          ctx.moveTo(p.x - br + k, p.y + br); ctx.lineTo(p.x - br, p.y + br); ctx.lineTo(p.x - br, p.y + br - k);
          ctx.stroke();
        }
      }
    };

    const step = () => {
      if (pickDirty) { pickFocus(); pickDirty = false; }
      const focus = assignTargets();

      for (const p of ps) {
        if (!p.framed && motion) {
          p.hx += p.vx; p.hy += p.vy;
          if (p.hx < 20 || p.hx > W - 20) p.vx *= -1;
          if (p.hy < 20 || p.hy > H - 20) p.vy *= -1;
          p.tx = p.hx; p.ty = p.hy;
        }
        const ease = p.framed ? 0.09 : 0.05;
        p.x += (p.tx - p.x) * ease;
        p.y += (p.ty - p.y) * ease;
      }

      draw(focus);
      if (motion) raf = requestAnimationFrame(step);
    };

    pickFocus();
    step();
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
