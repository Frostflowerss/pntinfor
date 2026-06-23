"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { usePointerFine } from "./Interactive";

type Counts = { work: number; skills: number; experience: number; education: number };
type Node = { x: number; y: number; z: number; kind: 0 | 1 | 2; parent?: number };
type Drift = { x: number; y: number; z: number; vx: number; vy: number; vz: number };

/**
 * Decorative site background: a slowly rotating 3D wireframe whose
 * structure is derived from the CV — a central hub branching into four
 * category clusters (work / skills / experience / education), wrapped in
 * an ambient point mesh. Purely visual: never interactive, hidden in
 * print, static on reduced-motion, lighter on touch devices.
 */
export function MeshNetwork({ counts }: { counts: Counts }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const fine = usePointerFine();

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    let W = 0, H = 0, cx = 0, cy = 0;
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight; cx = W / 2; cy = H / 2;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();

    // ---- build CV-structured node tree ----
    const cap = (n: number) => Math.max(2, Math.min(n || 3, 6));
    const groups = [counts.work, counts.skills, counts.experience, counts.education].map(cap);
    const CR = 215, ER = 80;
    const nodes: Node[] = [{ x: 0, y: 0, z: 0, kind: 0 }];
    groups.forEach((count, i) => {
      const ang = (i / groups.length) * Math.PI * 2;
      const cIdx = nodes.length;
      nodes.push({ x: Math.cos(ang) * CR, y: (i % 2 ? -1 : 1) * 80, z: Math.sin(ang) * CR, kind: 1 });
      for (let j = 0; j < count; j++) {
        const a = (j / count) * Math.PI * 2 + i;
        nodes.push({
          x: nodes[cIdx].x + Math.cos(a) * ER,
          y: nodes[cIdx].y + rand(-46, 46),
          z: nodes[cIdx].z + Math.sin(a) * ER,
          kind: 2, parent: cIdx,
        });
      }
    });

    // ---- ambient mesh ----
    const AN = Math.round(Math.min(fine ? 56 : 30, (W * H) / 20000));
    const AR = 360;
    const amb: Drift[] = Array.from({ length: AN }, () => ({
      x: rand(-AR, AR), y: rand(-AR, AR), z: rand(-AR, AR),
      vx: rand(-0.15, 0.15), vy: rand(-0.15, 0.15), vz: rand(-0.15, 0.15),
    }));

    const FOV = 660;
    let ry = 0, rx = -0.22, tgx = 0, raf = 0;
    const proj = (p: { x: number; y: number; z: number }) => {
      const cyr = Math.cos(ry), syr = Math.sin(ry);
      let x = p.x * cyr - p.z * syr, z = p.x * syr + p.z * cyr;
      const cxr = Math.cos(rx), sxr = Math.sin(rx);
      let y = p.y * cxr - z * sxr; z = p.y * sxr + z * cxr;
      const s = FOV / (FOV + z);
      return { sx: cx + x * s, sy: cy + y * s, s };
    };

    const onMove = (e: PointerEvent) => { tgx = (e.clientY / H - 0.5) * 0.4; };
    if (fine && !reduce) window.addEventListener("pointermove", onMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, W, H);
      if (!reduce) { ry += 0.0014; rx += (-0.22 + tgx - rx) * 0.05; }
      if (!reduce) for (const p of amb) {
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        if (p.x > AR || p.x < -AR) p.vx *= -1;
        if (p.y > AR || p.y < -AR) p.vy *= -1;
        if (p.z > AR || p.z < -AR) p.vz *= -1;
      }

      const A = amb.map(proj);
      for (let i = 0; i < AN; i++) for (let j = i + 1; j < AN; j++) {
        const a = A[i], b = A[j], d = Math.hypot(a.sx - b.sx, a.sy - b.sy);
        if (d < 130) {
          const t = 1 - d / 130;
          ctx.strokeStyle = `rgba(92,140,255,${t * 0.16 * ((a.s + b.s) / 2)})`;
          ctx.lineWidth = t * 0.6;
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
      }

      const P = nodes.map(proj);
      nodes.forEach((n, i) => {
        const b = P[i];
        if (n.kind === 1) {
          const a = P[0];
          ctx.strokeStyle = `rgba(92,140,255,${0.34 * b.s})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        } else if (n.kind === 2 && n.parent != null) {
          const a = P[n.parent];
          ctx.strokeStyle = `rgba(150,180,255,${0.24 * b.s})`; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
      });

      nodes.forEach((n, i) => {
        const a = P[i], s = a.s;
        if (n.kind === 0) {
          ctx.strokeStyle = `rgba(103,232,249,${0.85 * s})`; ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.arc(a.sx, a.sy, 7 * s, 0, 7); ctx.stroke();
          ctx.fillStyle = `rgba(103,232,249,${0.9 * s})`;
          ctx.beginPath(); ctx.arc(a.sx, a.sy, 2.3 * s, 0, 7); ctx.fill();
        } else {
          const r = (n.kind === 1 ? 4.6 : 3.2) * s;
          const col = n.kind === 1 ? "92,140,255" : "200,212,255";
          ctx.fillStyle = `rgba(${col},${(n.kind === 1 ? 0.85 : 0.6) * s})`;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy - r); ctx.lineTo(a.sx + r, a.sy);
          ctx.lineTo(a.sx, a.sy + r); ctx.lineTo(a.sx - r, a.sy);
          ctx.closePath(); ctx.fill();
        }
      });

      if (!reduce) raf = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("resize", setSize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, fine, counts]);

  return (
    <div aria-hidden data-fx className="fx-bg pointer-events-none fixed inset-0 -z-10 print:hidden">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
