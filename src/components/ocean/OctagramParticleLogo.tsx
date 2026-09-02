import { useEffect, useRef } from "react";
import octagramLogoUrl from "../../assets/OctagramLogo.png";
import { companyAssets } from "../../lib/companyAssets";

const OCTAGRAM_COLORS = [
  { r: 255, g: 126, b: 95 },  // Coral #FF7E5F
  { r: 255, g: 200, b: 87 },  // Amber #FFC857
  { r: 0,   g: 245, b: 212 }, // Mint #00F5D4
  { r: 0,   g: 187, b: 249 }, // Aqua #00BBF9
];

interface Particle {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  startX: number;
  startY: number;
  repX: number;
  repY: number;
  color: { r: number; g: number; b: number };
  size: number;
  inZone: boolean;
}

interface OctagramParticleLogoProps {
  width?: number;
  height?: number;
  className?: string;
  repulsionRadius?: number;
  repulsionForce?: number;
}

export default function OctagramParticleLogo({
  width = 340,
  height = 340,
  className = "",
  repulsionRadius = 65,
  repulsionForce = 9,
}: OctagramParticleLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -99999, y: -99999, active: false });
  const prevMouseRef = useRef({ x: -99999, y: -99999 });
  const mouseSpeedRef = useRef(0);
  const smoothMouseRef = useRef({ x: -99999, y: -99999 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const inViewRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;
    let draw: () => void;

    // Set up observer to forcefully halt physics when out of view!
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      inViewRef.current = entry.isIntersecting;
      // Kickstart the render loop if it just came back into view
      if (entry.isIntersecting && !animFrameRef.current && isDisposed === false && particlesRef.current.length > 0) {
        if (typeof draw === "function") {
          animFrameRef.current = requestAnimationFrame(draw);
        }
      }
    });
    observer.observe(container);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = width;
    const H = height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    // Offscreen canvas for generating precise Octagram geometry
    const offCanvas = document.createElement("canvas");
    offCanvas.width = W;
    offCanvas.height = H;
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    const cx = W / 2;
    const cy = H / 2;

    const generateParticles = (sourceImg?: HTMLImageElement) => {
      if (isDisposed) return;
      offCtx.clearRect(0, 0, W, H);

      if (sourceImg && sourceImg.naturalWidth !== 0) {
        // Sample from high-res image asset if available
        const padding = 20;
        const maxW = W - padding * 2;
        const maxH = H - padding * 2;
        const scale = Math.min(maxW / sourceImg.width, maxH / sourceImg.height);
        const drawW = sourceImg.width * scale;
        const drawH = sourceImg.height * scale;
        const drawX = (W - drawW) / 2;
        const drawY = (H - drawH) / 2;
        offCtx.drawImage(sourceImg, drawX, drawY, drawW, drawH);
      } else {
        // Draw exact 8-blade geometric Octagram emblem
        const outerR = Math.min(W, H) * 0.38;
        const innerR = Math.min(W, H) * 0.12;

        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const color = OCTAGRAM_COLORS[i % 4];

          offCtx.save();
          offCtx.translate(cx, cy);
          offCtx.rotate(angle);
          offCtx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

          // Angled geometric facet blade shape
          const p1x = innerR * 1.1;
          const p1y = -innerR * 0.35;
          const p2x = outerR;
          const p2y = -outerR * 0.32;
          const p3x = outerR * 0.76;
          const p3y = outerR * 0.32;
          const p4x = innerR * 0.35;
          const p4y = innerR * 0.55;

          offCtx.beginPath();
          offCtx.moveTo(p1x, p1y);
          offCtx.lineTo(p2x, p2y);
          offCtx.lineTo(p3x, p3y);
          offCtx.lineTo(p4x, p4y);
          offCtx.closePath();
          offCtx.fill();
          offCtx.restore();
        }
      }

      // Sample pixels to create fine, smooth circular particles
      const imgData = offCtx.getImageData(0, 0, W, H);
      const px = imgData.data;
      const gap = 2.2; // Fine density sampling
      const sampled: Particle[] = [];

      for (let y = 0; y < H; y += gap) {
        for (let x = 0; x < W; x += gap) {
          const ix = Math.floor(x);
          const iy = Math.floor(y);
          const idx = (iy * W + ix) * 4;
          const r = px[idx];
          const g = px[idx + 1];
          const b = px[idx + 2];
          const a = px[idx + 3];

          if (a > 30 && (r > 15 || g > 15 || b > 15)) {
            sampled.push({
              x: x,
              y: y,
              homeX: x,
              homeY: y,
              startX: x,
              startY: y,
              repX: 0,
              repY: 0,
              color: { r, g, b },
              size: 1.1 + Math.random() * 0.8,
              inZone: false,
            });
          }
        }
      }

      particlesRef.current = sampled;
    };

    // Load logo asset
    const logoImg = new Image();
    logoImg.crossOrigin = "anonymous";
    const logoSrc = companyAssets.octagramLogo || octagramLogoUrl;

    logoImg.onload = () => generateParticles(logoImg);
    logoImg.onerror = () => generateParticles();
    logoImg.src = logoSrc;

    if (!logoImg.complete) {
      generateParticles();
    }

    // ── Smooth antialiased canvas animation loop ──
    draw = () => {
      if (isDisposed) return;
      if (!inViewRef.current) {
        animFrameRef.current = null;
        return; // Brutally slice CPU usage 100% when off screen!
      }
      
      animFrameRef.current = requestAnimationFrame(draw);
      const particles = particlesRef.current;
      if (!particles.length) return;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      const { x: rawMx, y: rawMy, active } = mouseRef.current;
      const hitSpeed = mouseSpeedRef.current;
      mouseSpeedRef.current *= 0.88;

      const sm = smoothMouseRef.current;
      if (active) {
        const lerpFactor = Math.max(0.08, 0.3 - hitSpeed * 0.006);
        if (sm.x < -9000) {
          sm.x = rawMx;
          sm.y = rawMy;
        } else {
          sm.x += (rawMx - sm.x) * lerpFactor;
          sm.y += (rawMy - sm.y) * lerpFactor;
        }
      } else {
        sm.x = -99999;
        sm.y = -99999;
      }

      const mx = sm.x;
      const my = sm.y;
      const repCutoff = repulsionRadius;
      const repCutoffSq = repCutoff * repCutoff;

      // Draw constellation threads near cursor
      if (active && mx > -9000) {
        ctx.strokeStyle = "rgba(0, 245, 212, 0.25)";
        ctx.lineWidth = 0.6;
        for (let i = 0; i < particles.length; i += 6) {
          const p1 = particles[i];
          const dx = p1.x - mx;
          const dy = p1.y - my;
          if (dx * dx + dy * dy < repCutoffSq * 1.5) {
            for (let j = i + 1; j < Math.min(i + 14, particles.length); j += 2) {
              const p2 = particles[j];
              const pdx = p1.x - p2.x;
              const pdy = p1.y - p2.y;
              if (pdx * pdx + pdy * pdy < 350) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      // Draw smooth antialiased circular particles
      for (const p of particles) {
        // Mouse Repulsion Physics
        if (active) {
          const dx = p.homeX - mx;
          const dy = p.homeY - my;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < repCutoffSq) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const push = (1 - dist / repCutoff) * (hitSpeed + 4) * repulsionForce * 0.035;
            p.repX += nx * push;
            p.repY += ny * push;
            const targetRepX = nx * (repCutoff - dist) * 0.8;
            const targetRepY = ny * (repCutoff - dist) * 0.8;
            p.repX += (targetRepX - p.repX) * 0.12;
            p.repY += (targetRepY - p.repY) * 0.12;
            p.inZone = true;
          } else {
            p.inZone = false;
          }
        } else {
          p.inZone = false;
        }

        if (!p.inZone) {
          p.repX *= 0.88;
          p.repY *= 0.88;
        }

        p.x = p.homeX + p.repX;
        p.y = p.homeY + p.repY;

        // Smooth antialiased arc dot
        ctx.fillStyle = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
        ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      }

      ctx.restore();
    };

    draw();

    return () => {
      isDisposed = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      observer.disconnect();
    };
  }, [width, height, repulsionRadius, repulsionForce]);

  // Cache bounding rect to prevent layout thrashing (150ms+ INP spikes) on pointer events!
  const canvasRectRef = useRef<DOMRect | null>(null);

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    if (!canvasRectRef.current) {
        canvasRectRef.current = canvas.getBoundingClientRect();
    }
    const rect = canvasRectRef.current;
    
    const mx = (e.clientX - rect.left) * (width / rect.width);
    const my = (e.clientY - rect.top) * (height / rect.height);
    const prev = prevMouseRef.current;

    if (prev.x > -9999) {
      const ddx = mx - prev.x;
      const ddy = my - prev.y;
      mouseSpeedRef.current = Math.sqrt(ddx * ddx + ddy * ddy);
    }

    prevMouseRef.current = { x: mx, y: my };
    mouseRef.current = { x: mx, y: my, active: true };
  };

  const onMouseLeave = () => {
    mouseRef.current = { x: -99999, y: -99999, active: false };
    canvasRectRef.current = null; // Clear cache on leave so it refreshes if scrolled
  };

  const onResetParticles = () => {
    onMouseLeave();
    particlesRef.current.forEach((p) => {
      p.repX = 0;
      p.repY = 0;
      p.inZone = false;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <canvas
        ref={canvasRef}
        className="block cursor-pointer"
        style={{ width: "100%", height: "100%" }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={onResetParticles}
        onTouchEnd={onResetParticles}
        onTouchCancel={onResetParticles}
      />
    </div>
  );
}

