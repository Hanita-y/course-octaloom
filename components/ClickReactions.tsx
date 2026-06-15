"use client";

import { useEffect, useRef } from "react";

// Ported from the OctaLoom website (LinkedIn Growth Engine page):
// clicking empty space bursts real LinkedIn reaction icons that fly up and fade.
const REACTION_SRC = [
  "/brand/reactions/like.png",
  "/brand/reactions/celebrate.png",
  "/brand/reactions/support.png",
  "/brand/reactions/love.png",
  "/brand/reactions/insightful.png",
  "/brand/reactions/funny.png",
];

interface Particle {
  x: number; y: number; vx: number; vy: number; sz: number;
  op: number; rot: number; rotSpd: number; img: HTMLImageElement;
  life: number; maxLife: number;
}

export default function ClickReactions() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);
  const imgs = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    REACTION_SRC.forEach((src) => {
      const im = new Image();
      im.src = src;
      imgs.current.push(im);
    });
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("button,a,input,textarea,select")) return;
      const count = 6 + Math.floor(Math.random() * 4);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 0.8 + Math.PI * 0.1;
        const spd = 2 + Math.random() * 4;
        particles.current.push({
          x: e.clientX, y: e.clientY,
          vx: Math.cos(angle) * spd * (Math.random() > 0.5 ? 1 : -1),
          vy: -Math.sin(angle) * spd - 1,
          sz: 18 + Math.random() * 12, op: 1,
          rot: Math.random() * 360, rotSpd: (Math.random() - 0.5) * 9,
          img: imgs.current[Math.floor(Math.random() * imgs.current.length)],
          life: 0, maxLife: 42 + Math.random() * 28,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter((p) => {
        p.life++; p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.rot += p.rotSpd;
        p.op = Math.max(0, 1 - p.life / p.maxLife);
        if (p.op <= 0) return false;
        ctx.save();
        ctx.globalAlpha = p.op;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        try { ctx.drawImage(p.img, -p.sz / 2, -p.sz / 2, p.sz, p.sz); } catch {}
        ctx.restore();
        return true;
      });
      raf.current = requestAnimationFrame(animate);
    };

    document.addEventListener("click", onClick);
    raf.current = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}
      aria-hidden="true"
    />
  );
}
