"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePointerFine } from "./Interactive";

type Counts = { work: number; skills: number; experience: number; education: number };
type RGB = [number, number, number];
type Node = {
  bx: number; by: number; z: number;        // base pos + depth (0 far .. 1 near)
  ax: number; ay: number; fx: number; fy: number; px: number; py: number; // drift params
  sx: number; sy: number;                   // resolved screen pos (per frame)
};
type Fly = {
  x: number; y: number; tx: number; ty: number; off: number; edge: number;
  phase: number; trail: { x: number; y: number }[];
};

/**
 * Ambient mesh-network background.
 * Modules (all inside one effect for a single lifecycle):
 *   theme   – reads --mesh-* CSS vars, lerps colors over ~750ms on theme change
 *   mesh    – multi-depth nodes drifting via layered sine "noise"; spatial-grid links
 *   pointer – inertial virtual cursor; soft strands to nearest nodes w/ light-travel
 *   reading – IntersectionObserver picks the most-visible reading zone
 *   flies   – fireflies hovering just outside the active zone (glow / flicker / trail)
 *   loop    – rAF render, paused via Page Visibility, throttled resize/scroll
 * Pure background: pointer-events none, hidden in print, calm on reduced-motion.
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
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // ---------------- theme manager ----------------
    const probe = document.documentElement;
    const keys = ["primary", "secondary", "glow", "node", "line"] as const;
    type Key = (typeof keys)[number];
    const fallback: Record<Key, RGB> = {
      primary: [124, 162, 255], secondary: [92, 140, 255],
      glow: [150, 180, 255], node: [214, 230, 255], line: [124, 162, 255],
    };
    const readVar = (k: Key): RGB => {
      const raw = getComputedStyle(probe).getPropertyValue(`--mesh-${k}`).trim();
      const n = raw.split(/[\s,]+/).map(Number);
      return n.length >= 3 && n.every((v) => !isNaN(v)) ? [n[0], n[1], n[2]] : fallback[k];
    };
    const readAll = () => Object.fromEntries(keys.map((k) => [k, readVar(k)])) as Record<Key, RGB>;
    let colFrom = readAll(), colTo = colFrom, colNow = readAll();
    let colT0 = 0, colDur = 750;
    const startTransition = () => { colFrom = { ...colNow }; colTo = readAll(); colT0 = performance.now(); colDur = 750; };
    const themeObs = new MutationObserver(startTransition);
    themeObs.observe(probe, { attributes: true, attributeFilter: ["data-theme"] });
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => startTransition();
    mql.addEventListener?.("change", onScheme);
    const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

    // glow sprite (rebuilt only when glow color shifts)
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    let spriteKey = "";
    const buildSprite = (c: RGB) => {
      const k = c.map((v) => v | 0).join(",");
      if (k === spriteKey) return;
      spriteKey = k;
      sctx.clearRect(0, 0, 64, 64);
      const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, rgba(c, 1)); g.addColorStop(0.3, rgba(c, 0.45)); g.addColorStop(1, rgba(c, 0));
      sctx.fillStyle = g; sctx.fillRect(0, 0, 64, 64);
    };

    // ---------------- sizing ----------------
    let W = 0, H = 0;
    const DENSITY = fine ? 13000 : 24000;
    let nodes: Node[] = [];
    const buildNodes = () => {
      const count = clamp(Math.round((W * H) / DENSITY), 28, fine ? 140 : 60);
      nodes = Array.from({ length: count }, () => {
        const bx = rand(0, W), by = rand(0, H);
        return {
          bx, by, z: Math.random(),
          ax: rand(14, 44), ay: rand(14, 44),
          fx: rand(0.00018, 0.00046), fy: rand(0.00018, 0.00046),
          px: rand(0, 6.28), py: rand(0, 6.28),
          sx: bx, sy: by,
        };
      });
    };
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };
    setSize();

    // ---------------- pointer (virtual cursor w/ inertia) ----------------
    const vc = { x: -999, y: -999, px: -999, py: -999, tx: -999, ty: -999, speed: 0, on: false };
    const onMove = (e: PointerEvent) => {
      if (!vc.on) { vc.x = vc.px = e.clientX; vc.y = vc.py = e.clientY; }
      vc.tx = e.clientX; vc.ty = e.clientY; vc.on = true;
    };
    const onLeave = () => { vc.on = false; };
    const useMouse = fine && motion;
    if (useMouse) { window.addEventListener("pointermove", onMove, { passive: true }); window.addEventListener("pointerleave", onLeave); }

    // ---------------- reading-zone observer ----------------
    let activeEl: Element | null = null;
    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
        let best: Element | null = null, bestR = 0;
        const vcY = H / 2;
        ratios.forEach((r, el) => {
          if (r <= 0.01) return;
          const rect = el.getBoundingClientRect();
          const centerPenalty = Math.abs(rect.top + rect.height / 2 - vcY) / H;
          const score = r - centerPenalty * 0.25;
          if (score > bestR) { bestR = score; best = el; }
        });
        if (best) activeEl = best;
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1], rootMargin: "-12% 0px -12% 0px" }
    );
    const observeZones = () => {
      ratios.clear(); io.disconnect();
      document
        .querySelectorAll("[data-reading-zone], .reading-zone, article, main section")
        .forEach((el) => { if ((el as HTMLElement).offsetHeight > 80) io.observe(el); });
    };
    observeZones();

    // ---------------- fireflies ----------------
    const FLY_N = clamp(Math.round((counts.work + counts.skills + counts.experience + counts.education) * 1.4), 10, fine ? 22 : 14);
    const flies: Fly[] = Array.from({ length: FLY_N }, (_, i) => ({
      x: W / 2, y: H / 2, tx: W / 2, ty: H / 2,
      off: rand(12, 36), edge: i / FLY_N, phase: rand(0, 6.28), trail: [],
    }));

    const flyTargets = () => {
      let rect: DOMRect | null = null;
      if (activeEl) {
        const r = activeEl.getBoundingClientRect();
        if (r.bottom > 60 && r.top < H - 60) rect = r;
      }
      if (!rect) {
        for (const f of flies) { f.tx = lerp(f.tx, W / 2, 0.02); f.ty = lerp(f.ty, H / 2, 0.02); }
        return null;
      }
      const L = rect.left, T = clamp(rect.top, 70, H), R = rect.right, B = clamp(rect.bottom, 70, H);
      const w = Math.max(1, R - L), h = Math.max(1, B - T), peri = 2 * (w + h);
      for (const f of flies) {
        let d = f.edge * peri, bx: number, by: number, nx = 0, ny = 0;
        if (d < w) { bx = L + d; by = T; ny = -1; }
        else if ((d -= w) < h) { bx = R; by = T + d; nx = 1; }
        else if ((d -= h) < w) { bx = R - d; by = B; ny = 1; }
        else { d -= w; bx = L; by = B - d; nx = -1; }
        f.tx = clamp(bx + nx * f.off, 8, W - 8);
        f.ty = clamp(by + ny * f.off, 64, H - 8);
      }
      return { cx: (L + R) / 2, cy: (T + B) / 2 };
    };

    // ---------------- render loop ----------------
    const LINK = fine ? 132 : 108;
    const LINK_CAP = fine ? 260 : 120;
    const cell = LINK;
    let raf = 0, running = true, last = performance.now();

    const frame = (t: number) => {
      const dt = Math.min(40, t - last); last = t;

      // theme color lerp
      const p = colDur ? clamp((t - colT0) / colDur, 0, 1) : 1;
      const e = 1 - Math.pow(1 - p, 3);
      for (const k of keys) colNow[k] = colFrom[k].map((v, i) => lerp(v, colTo[k][i], e)) as RGB;
      buildSprite(colNow.glow);

      // virtual cursor inertia + speed
      if (vc.on) {
        vc.px = vc.x; vc.py = vc.y;
        vc.x += (vc.tx - vc.x) * 0.14;
        vc.y += (vc.ty - vc.y) * 0.14;
        vc.speed = lerp(vc.speed, Math.hypot(vc.x - vc.px, vc.y - vc.py), 0.2);
      } else vc.speed = lerp(vc.speed, 0, 0.1);

      ctx.clearRect(0, 0, W, H);
      const mScale = motion ? 1 : 0.18;
      const parX = useMouse && vc.on ? (vc.x - W / 2) : 0;
      const parY = useMouse && vc.on ? (vc.y - H / 2) : 0;

      // resolve node screen positions (drift + depth parallax) + spatial grid
      const grid = new Map<number, number[]>();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.sx = n.bx + Math.sin(t * n.fx + n.px) * n.ax * mScale + parX * n.z * 0.02;
        n.sy = n.by + Math.cos(t * n.fy + n.py) * n.ay * mScale + parY * n.z * 0.02;
        const gx = Math.floor(n.sx / cell), gy = Math.floor(n.sy / cell);
        const key = gx * 73856 + gy;
        (grid.get(key) ?? grid.set(key, []).get(key)!).push(i);
      }

      // links via neighbor lookup (capped)
      let drawn = 0;
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length && drawn < LINK_CAP; i++) {
        const a = nodes[i];
        const gx = Math.floor(a.sx / cell), gy = Math.floor(a.sy / cell);
        for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
          const bucket = grid.get((gx + ox) * 73856 + (gy + oy));
          if (!bucket) continue;
          for (const j of bucket) {
            if (j <= i) continue;
            const b = nodes[j];
            const dx = a.sx - b.sx, dy = a.sy - b.sy, d = Math.hypot(dx, dy);
            if (d < LINK) {
              const depth = (a.z + b.z) / 2;
              ctx.strokeStyle = rgba(colNow.line, (1 - d / LINK) * 0.18 * (0.4 + depth * 0.6));
              ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
              if (++drawn >= LINK_CAP) break;
            }
          }
          if (drawn >= LINK_CAP) break;
        }
      }

      // nodes (glow scaled by depth, additive)
      ctx.globalCompositeOperation = "lighter";
      for (const n of nodes) {
        const size = lerp(7, 22, n.z);
        ctx.globalAlpha = lerp(0.16, 0.7, n.z);
        ctx.drawImage(sprite, n.sx - size / 2, n.sy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      for (const n of nodes) {
        ctx.fillStyle = rgba(colNow.node, lerp(0.3, 1, n.z));
        const r = lerp(0.6, 1.8, n.z);
        ctx.beginPath(); ctx.arc(n.sx, n.sy, r, 0, 6.2832); ctx.fill();
      }

      // pointer strands to 3–6 nearest nodes + light-travel pulse + cursor glow
      if (useMouse && vc.on) {
        const near = nodes
          .map((n) => ({ n, d: Math.hypot(n.sx - vc.x, n.sy - vc.y) }))
          .filter((o) => o.d < 240)
          .sort((a, b) => a.d - b.d)
          .slice(0, 6);
        const pulse = clamp(vc.speed / 14, 0, 1);
        for (const { n, d } of near) {
          const a = (1 - d / 240) * 0.5;
          ctx.strokeStyle = rgba(colNow.primary, a);
          ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(vc.x, vc.y); ctx.lineTo(n.sx, n.sy); ctx.stroke();
          if (motion) {
            const u = (t * 0.0012 + n.px) % 1;
            const lx = lerp(vc.x, n.sx, u), ly = lerp(vc.y, n.sy, u);
            ctx.globalCompositeOperation = "lighter";
            ctx.globalAlpha = (0.3 + pulse * 0.6) * (1 - d / 240);
            ctx.drawImage(sprite, lx - 6, ly - 6, 12, 12);
            ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
          }
        }
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.45;
        ctx.drawImage(sprite, vc.x - 30, vc.y - 30, 60, 60);
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }

      // fireflies around the reading zone
      flyTargets();
      ctx.globalCompositeOperation = "lighter";
      for (const f of flies) {
        const ease = 0.06;
        f.x += (f.tx - f.x) * ease + (motion ? Math.sin(t * 0.0017 + f.phase) * 0.4 : 0);
        f.y += (f.ty - f.y) * ease + (motion ? Math.cos(t * 0.0015 + f.phase) * 0.4 : 0);
        if (motion) {
          f.trail.unshift({ x: f.x, y: f.y });
          if (f.trail.length > 5) f.trail.pop();
          for (let i = f.trail.length - 1; i > 0; i--) {
            ctx.globalAlpha = 0.05 * (1 - i / 5);
            ctx.drawImage(sprite, f.trail[i].x - 5, f.trail[i].y - 5, 10, 10);
          }
        }
        const flick = 0.55 + 0.45 * Math.sin(t * 0.006 + f.phase);
        ctx.globalAlpha = 0.6 * flick;
        ctx.drawImage(sprite, f.x - 8, f.y - 8, 16, 16);
        // thin tie to cursor when close
        if (useMouse && vc.on) {
          const d = Math.hypot(f.x - vc.x, f.y - vc.y);
          if (d < 120) {
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = (1 - d / 120) * 0.4;
            ctx.strokeStyle = rgba(colNow.glow, 1); ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(vc.x, vc.y); ctx.stroke();
            ctx.globalCompositeOperation = "lighter";
          }
        }
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

      colDur = p >= 1 ? 0 : colDur;
      if (running) raf = requestAnimationFrame(frame);
    };

    // visibility + throttled resize/scroll
    const onVisible = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
    };
    let rTimer = 0;
    const onResize = () => { clearTimeout(rTimer); rTimer = window.setTimeout(() => { setSize(); observeZones(); }, 160); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("resize", onResize);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect(); io.disconnect();
      mql.removeEventListener?.("change", onScheme);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      clearTimeout(rTimer);
    };
  }, [reduce, fine, counts]);

  return (
    <div aria-hidden data-fx className="fx-bg pointer-events-none fixed inset-0 -z-10 print:hidden">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
