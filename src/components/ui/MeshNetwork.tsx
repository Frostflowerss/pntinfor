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
  // Depend on the scalar the effect actually uses, not the object identity —
  // the parent rebuilds `counts` on every render, which would otherwise tear
  // down and rebuild the whole canvas (nodes, observers, listeners) each time.
  const flyTotal = counts.work + counts.skills + counts.experience + counts.education;

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
    const isLight = () => probe.getAttribute("data-theme") === "light";
    const parseColor = (str: string): RGB | null => {
      const s = str.trim();
      if (s.startsWith("#")) {
        let h = s.slice(1);
        if (h.length === 3) h = h.split("").map((c) => c + c).join("");
        if (h.length >= 6) {
          const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
          if (![r, g, b].some(isNaN)) return [r, g, b];
        }
      }
      const m = s.match(/-?\d+(\.\d+)?/g);
      if (m && m.length >= 3) return [+m[0], +m[1], +m[2]];
      return null;
    };
    const mix = (c: RGB, d: RGB, t: number): RGB => [c[0] + (d[0] - c[0]) * t, c[1] + (d[1] - c[1]) * t, c[2] + (d[2] - c[2]) * t];
    // Build the full palette from the studio accent so particles follow it.
    const buildColors = (): Record<Key, RGB> => {
      const base = parseColor(getComputedStyle(probe).getPropertyValue("--accent")) ?? [92, 140, 255];
      const tint = isLight() ? ([14, 18, 26] as RGB) : ([255, 255, 255] as RGB);
      return {
        primary: base,
        secondary: mix(base, tint, 0.12),
        line: base,
        glow: mix(base, tint, 0.3),
        node: mix(base, tint, isLight() ? 0.0 : 0.55),
      };
    };
    // colNow is mutated in place each frame, so snapshots must copy the RGB
    // arrays themselves — a shallow spread would alias and freeze the fade.
    const cloneColors = (c: Record<Key, RGB>) =>
      Object.fromEntries(keys.map((k) => [k, [...c[k]] as RGB])) as Record<Key, RGB>;
    let colFrom = buildColors(), colTo = colFrom, colNow = buildColors();
    let colT0 = 0, colDur = 750;
    const startTransition = () => { colFrom = cloneColors(colNow); colTo = buildColors(); colT0 = performance.now(); colDur = 750; };
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
    let spriteKey = -1;
    const buildSprite = (c: RGB) => {
      const k = ((c[0] | 0) << 16) | ((c[1] | 0) << 8) | (c[2] | 0);
      if (k === spriteKey) return;
      spriteKey = k;
      sctx.clearRect(0, 0, 64, 64);
      const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, rgba(c, 1)); g.addColorStop(0.3, rgba(c, 0.45)); g.addColorStop(1, rgba(c, 0));
      sctx.fillStyle = g; sctx.fillRect(0, 0, 64, 64);
    };

    // ---------------- sizing ----------------
    let W = 0, H = 0;
    const DENSITY = fine ? 17000 : 27000;
    let nodes: Node[] = [];
    const buildNodes = () => {
      const count = clamp(Math.round((W * H) / DENSITY), 24, fine ? 100 : 46);
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
    const FLY_N = clamp(Math.round(flyTotal * 1.4), 10, fine ? 22 : 14);
    const flies: Fly[] = Array.from({ length: FLY_N }, (_, i) => ({
      x: W / 2, y: H / 2, tx: W / 2, ty: H / 2,
      off: rand(12, 36), edge: i / FLY_N, phase: rand(0, 6.28), trail: [],
    }));

    // Takes the frame's already-measured rect: re-reading it here would force a
    // second synchronous layout every frame for an identical value.
    const flyTargets = (rz: DOMRect | null) => {
      let rect: DOMRect | null = null;
      if (rz && rz.bottom > 60 && rz.top < H - 60) rect = rz;
      if (!rect) {
        for (const f of flies) { f.tx = lerp(f.tx, W / 2, 0.02); f.ty = lerp(f.ty, H / 2, 0.02); }
        return;
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
    };

    // ---------------- render loop ----------------
    const LINK = fine ? 118 : 96;
    const LINK2 = LINK * LINK;
    const ATTRACT = 160, ATTRACT2 = ATTRACT * ATTRACT;
    const CUR_R = ATTRACT + 50, CUR_R2 = CUR_R * CUR_R;
    let raf = 0, running = true;

    // Scratch buffers reused across frames: the render loop allocates nothing.
    const act: { n: Node; a: number; near: number }[] = [];
    const curNear: { n: Node; d: number }[] = [];

    const frame = (t: number) => {
      // theme color lerp
      const p = colDur ? clamp((t - colT0) / colDur, 0, 1) : 1;
      const e = 1 - Math.pow(1 - p, 3);
      for (const k of keys) {
        const f = colFrom[k], to = colTo[k], cur = colNow[k];
        cur[0] = lerp(f[0], to[0], e); cur[1] = lerp(f[1], to[1], e); cur[2] = lerp(f[2], to[2], e);
      }
      buildSprite(colNow.glow);

      // virtual cursor inertia + speed
      if (vc.on) {
        vc.px = vc.x; vc.py = vc.y;
        vc.x += (vc.tx - vc.x) * 0.14;
        vc.y += (vc.ty - vc.y) * 0.14;
        const vdx = vc.x - vc.px, vdy = vc.y - vc.py;
        vc.speed = lerp(vc.speed, Math.sqrt(vdx * vdx + vdy * vdy), 0.2);
      } else vc.speed = lerp(vc.speed, 0, 0.1);

      ctx.clearRect(0, 0, W, H);
      const mScale = motion ? 1 : 0.18;

      // focus point: cursor if present, else reading-zone centre, else viewport centre
      const rz = activeEl ? activeEl.getBoundingClientRect() : null;
      const haveCur = useMouse && vc.on;
      const fpx = haveCur ? vc.x : rz ? (rz.left + rz.right) / 2 : W / 2;
      const fpy = haveCur ? vc.y : rz ? clamp((rz.top + rz.bottom) / 2, 80, H - 40) : H / 2;
      const REVEAL = haveCur ? 240 : 320;

      // resolve positions + cursor attraction; keep only nodes near focus.
      // Distances stay squared until a value is actually needed, so the common
      // "too far, skip it" case never pays for a square root.
      const REVEAL2 = REVEAL * REVEAL;
      let actN = 0;
      for (const n of nodes) {
        let sx = n.bx + Math.sin(t * n.fx + n.px) * n.ax * mScale;
        let sy = n.by + Math.cos(t * n.fy + n.py) * n.ay * mScale;
        let near = 0;
        if (haveCur) {
          const dx = vc.x - sx, dy = vc.y - sy, dc2 = dx * dx + dy * dy;
          if (dc2 < ATTRACT2) {
            near = 1 - Math.sqrt(dc2) / ATTRACT;
            const f = near * 0.22; sx += dx * f; sy += dy * f;
          }
        }
        n.sx = sx; n.sy = sy;
        const rx = sx - fpx, ry = sy - fpy, rd2 = rx * rx + ry * ry;
        if (rd2 >= REVEAL2) continue; // alpha would be 0
        const a = Math.pow(1 - Math.sqrt(rd2) / REVEAL, 1.6);
        if (a <= 0.03) continue;
        const slot = act[actN] ?? (act[actN] = { n, a, near });
        slot.n = n; slot.a = a; slot.near = near;
        actN++;
      }

      // links only among revealed nodes (small set, no grid needed)
      ctx.lineWidth = 0.7;
      for (let i = 0; i < actN; i++) {
        const A = act[i].n, ai = act[i].a;
        for (let j = i + 1; j < actN; j++) {
          const B = act[j].n;
          const dx = A.sx - B.sx, dy = A.sy - B.sy, d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = rgba(colNow.line, (1 - d / LINK) * Math.min(ai, act[j].a) * 0.5);
            ctx.beginPath(); ctx.moveTo(A.sx, A.sy); ctx.lineTo(B.sx, B.sy); ctx.stroke();
          }
        }
      }

      // node glow (additive) + crisp core, faded by reveal, brighter near cursor
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < actN; i++) {
        const { n, a, near } = act[i];
        const size = lerp(6, 15, n.z) * (1 + near * 0.7);
        ctx.globalAlpha = clamp(a * lerp(0.16, 0.5, n.z) * (1 + near), 0, 1);
        ctx.drawImage(sprite, n.sx - size / 2, n.sy - size / 2, size, size);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < actN; i++) {
        const { n, a, near } = act[i];
        ctx.fillStyle = rgba(colNow.node, clamp(a * lerp(0.5, 1, n.z) * (1 + near), 0, 1));
        ctx.beginPath(); ctx.arc(n.sx, n.sy, lerp(0.7, 1.7, n.z) + near * 1.2, 0, 6.2832); ctx.fill();
      }

      // cursor: stronger strands to nearest revealed nodes + small glow
      if (haveCur) {
        // Collect in-range nodes into the scratch buffer, then insertion-sort the
        // used prefix (always tiny) — same order as sort(), without the garbage.
        let cn = 0;
        for (let i = 0; i < actN; i++) {
          const n = act[i].n;
          const dx = n.sx - vc.x, dy = n.sy - vc.y, d2 = dx * dx + dy * dy;
          if (d2 >= CUR_R2) continue;
          const slot = curNear[cn] ?? (curNear[cn] = { n, d: 0 });
          slot.n = n; slot.d = Math.sqrt(d2);
          cn++;
        }
        for (let i = 1; i < cn; i++) {
          const key = curNear[i];
          let j = i - 1;
          while (j >= 0 && curNear[j].d > key.d) { curNear[j + 1] = curNear[j]; j--; }
          curNear[j + 1] = key;
        }
        const lim = cn < 7 ? cn : 7;
        for (let i = 0; i < lim; i++) {
          const { n, d } = curNear[i];
          ctx.strokeStyle = rgba(colNow.primary, (1 - d / CUR_R) * 0.65);
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(vc.x, vc.y); ctx.lineTo(n.sx, n.sy); ctx.stroke();
        }
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.4;
        ctx.drawImage(sprite, vc.x - 24, vc.y - 24, 48, 48);
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }

      // fireflies around the reading zone (calm: no trail / no pulse)
      flyTargets(rz);
      ctx.globalCompositeOperation = "lighter";
      const FLY_R = REVEAL + 140;
      for (const f of flies) {
        f.x += (f.tx - f.x) * 0.06 + (motion ? Math.sin(t * 0.0016 + f.phase) * 0.3 : 0);
        f.y += (f.ty - f.y) * 0.06 + (motion ? Math.cos(t * 0.0014 + f.phase) * 0.3 : 0);
        const fdx = f.x - fpx, fdy = f.y - fpy;
        const vis = clamp(1 - Math.sqrt(fdx * fdx + fdy * fdy) / FLY_R, 0, 1);
        if (vis < 0.05) continue;
        const flick = 0.55 + 0.45 * Math.sin(t * 0.005 + f.phase);
        ctx.globalAlpha = 0.4 * flick * vis;
        ctx.drawImage(sprite, f.x - 7, f.y - 7, 14, 14);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";

      colDur = p >= 1 ? 0 : colDur;
      if (running) raf = requestAnimationFrame(frame);
    };

    // visibility + throttled resize/scroll
    const onVisible = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; raf = requestAnimationFrame(frame); }
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
  }, [reduce, fine, flyTotal]);

  return (
    <div aria-hidden data-fx className="site-mesh fx-bg pointer-events-none fixed inset-0 -z-10">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
