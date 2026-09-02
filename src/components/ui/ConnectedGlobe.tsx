import React, { useEffect, useRef } from "react";

type LonLat = readonly [number, number];
type Vec3 = readonly [number, number, number];
type LandDot = { x: number; y: number; z: number; weight: number };
type Route = {
  from: LonLat;
  to: LonLat;
  lift: number;
};

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;
const ACCENT = "255, 159, 252";

const LAND: readonly (readonly LonLat[])[] = [
  [[-168, 66], [-156, 71], [-141, 69], [-130, 57], [-122, 50], [-124, 42], [-117, 32], [-108, 25], [-97, 19], [-88, 19], [-83, 25], [-80, 31], [-75, 36], [-69, 44], [-61, 48], [-55, 53], [-59, 61], [-72, 67], [-92, 73], [-116, 75], [-140, 73]],
  [[-180, 52], [-170, 52], [-160, 55], [-149, 59], [-140, 64], [-146, 71], [-165, 72], [-178, 67]],
  [[-104, 23], [-94, 18], [-88, 16], [-84, 10], [-79, 8], [-77, 10], [-82, 18], [-91, 22]],
  [[-81, 12], [-72, 12], [-61, 8], [-51, 3], [-45, -5], [-35, -8], [-38, -18], [-47, -28], [-52, -34], [-57, -40], [-65, -55], [-72, -51], [-75, -38], [-70, -27], [-72, -17], [-79, -5]],
  [[-73, 59], [-57, 59], [-43, 64], [-21, 72], [-25, 81], [-44, 84], [-62, 79], [-70, 69]],
  [[-17, 36], [-5, 36], [7, 37], [18, 34], [31, 31], [35, 23], [43, 12], [51, 11], [48, 2], [42, -10], [36, -20], [31, -30], [25, -35], [17, -34], [11, -24], [4, -9], [-5, 5], [-14, 12], [-17, 22]],
  [[-11, 36], [-10, 44], [-5, 50], [2, 51], [8, 55], [17, 54], [24, 59], [31, 60], [39, 54], [42, 45], [34, 40], [24, 37], [15, 38], [8, 43], [1, 42]],
  [[5, 55], [12, 56], [19, 61], [29, 70], [25, 72], [14, 69], [7, 63]],
  [[28, 70], [53, 74], [82, 76], [112, 74], [142, 69], [170, 65], [179, 59], [166, 52], [151, 48], [143, 42], [133, 36], [121, 31], [111, 20], [103, 8], [96, 6], [91, 20], [78, 8], [70, 20], [57, 25], [43, 31], [31, 40], [38, 53]],
  [[67, 24], [78, 31], [88, 26], [92, 20], [89, 9], [80, 6], [75, 12]],
  [[96, 22], [108, 22], [121, 16], [118, 6], [108, 1], [102, 8]],
  [[35, 30], [48, 30], [57, 23], [52, 13], [43, 12], [36, 20]],
  [[-8, 50], [-2, 50], [1, 55], [-4, 59], [-8, 57]],
  [[-24, 63], [-13, 64], [-14, 67], [-22, 67]],
  [[130, 31], [135, 33], [142, 42], [145, 45], [141, 36], [136, 34]],
  [[95, 5], [105, 5], [108, -6], [99, -6]],
  [[108, 1], [121, 2], [125, -7], [112, -8]],
  [[126, 3], [140, 1], [141, -7], [130, -6]],
  [[113, -12], [125, -11], [138, -16], [153, -28], [151, -38], [139, -39], [129, -34], [116, -35], [112, -24]],
  [[141, -3], [153, -4], [151, -10], [141, -9]],
  [[166, -35], [178, -38], [174, -47], [168, -45]],
  [[47, -13], [51, -16], [49, -26], [44, -25]],
  [[-180, -70], [-145, -67], [-110, -72], [-72, -67], [-35, -71], [0, -68], [43, -72], [81, -68], [120, -72], [158, -67], [180, -70], [180, -89], [-180, -89]],
];

function pointInPolygon(lon: number, lat: number, polygon: readonly LonLat[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function lonLatToVec([lon, lat]: LonLat): Vec3 {
  const latitude = lat * DEG;
  const longitude = lon * DEG;
  const cosLat = Math.cos(latitude);
  return [cosLat * Math.sin(longitude), Math.sin(latitude), cosLat * Math.cos(longitude)];
}

function createLandDots(): LandDot[] {
  const dots: LandDot[] = [];
  const N = 16000; // Optimal resolution matching the original density
  const phi = Math.PI * (3.0 - Math.sqrt(5.0)); // Golden angle

  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2; // y goes from 1 to -1 (north to south)
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;

    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;

    // Convert back to lon/lat to check against geojson polygons
    const lat = Math.asin(y) / DEG;
    const lon = Math.atan2(x, z) / DEG;

    if (!LAND.some((p) => pointInPolygon(lon, lat, p))) continue;

    const seed = Math.abs(Math.sin((lon * 12.9898 + lat * 78.233) * 0.17));
    dots.push({ x, y, z, weight: 0.78 + seed * 0.36 });
  }
  return dots;
}

const LAND_DOTS = createLandDots();

function getRandomDot(): LonLat {
  while (true) {
    const lat = -87.3 + Math.random() * (84 - -87.3);
    const lon = -180 + Math.random() * 360;
    if (LAND.some((p) => pointInPolygon(lon, lat, p))) return [lon, lat];
  }
}

function rotate([x, y, z]: Vec3, rotation: number, tilt: number): Vec3 {
  const cosR = Math.cos(rotation);
  const sinR = Math.sin(rotation);
  const rx = x * cosR + z * sinR;
  const rz = -x * sinR + z * cosR;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  return [rx, y * cosT - rz * sinT, y * sinT + rz * cosT];
}

function slerp(a: Vec3, b: Vec3, t: number): Vec3 {
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const omega = Math.acos(dot);
  if (omega < 0.0001) return a;
  const s = Math.sin(omega);
  const l = Math.sin((1 - t) * omega) / s;
  const r = Math.sin(t * omega) / s;
  return [a[0] * l + b[0] * r, a[1] * l + b[1] * r, a[2] * l + b[2] * r];
}

function easeOutCubic(v: number) {
  return 1 - Math.pow(1 - v, 3);
}

function clamp(v: number, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function drawRoute(
  ctx: CanvasRenderingContext2D,
  route: Route,
  headProgress: number,
  tailProgress: number,
  alpha: number,
  rotation: number,
  tilt: number,
  cx: number,
  cy: number,
  radius: number,
  dpr: number,
) {
  const start = lonLatToVec(route.from);
  const end = lonLatToVec(route.to);
  const segs = 80;

  // Calculate index bounds for the segment being drawn
  const first = Math.max(0, Math.floor(segs * tailProgress));
  const last = Math.max(first + 1, Math.min(segs, Math.floor(segs * headProgress)));

  type PP = { x: number; y: number; z: number; occluded: boolean };
  const pts: PP[] = [];

  for (let i = first; i <= last; i++) {
    const t = i / segs;
    const base = slerp(start, end, t);
    const elev = 1 + Math.sin(Math.PI * t) * route.lift;
    const r = rotate([base[0] * elev, base[1] * elev, base[2] * elev], rotation, tilt);
    const rSq = r[0] * r[0] + r[1] * r[1];
    const front = rSq < 1 ? Math.sqrt(1 - rSq) : -Infinity;
    pts.push({ x: cx + r[0] * radius, y: cy - r[1] * radius, z: r[2], occluded: rSq < 1 && r[2] < front });
  }

  const pass = (behind: boolean) => {
    let drawing = false;
    ctx.beginPath();
    for (const p of pts) {
      if (p.occluded !== behind) { drawing = false; continue; }
      if (!drawing) { ctx.moveTo(p.x, p.y); drawing = true; }
      else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = `rgba(${ACCENT}, ${alpha * (behind ? 0.12 : 0.6)})`;
    ctx.lineWidth = (behind ? 0.5 : 0.75) * dpr;
    ctx.stroke();
  };

  pass(true);
  return { points: pts, strokeFront: () => pass(false) };
}

function drawMarker(
  ctx: CanvasRenderingContext2D,
  pt: { x: number; y: number; occluded: boolean } | undefined,
  pulse: number,
  alpha: number,
  dpr: number,
) {
  if (!pt || pt.occluded) return;
  const ring = (3.5 + pulse * 8) * dpr;

  ctx.beginPath();
  ctx.arc(pt.x, pt.y, ring, 0, TAU);
  ctx.strokeStyle = `rgba(${ACCENT}, ${alpha * (1 - pulse) * 0.4})`;
  ctx.lineWidth = 0.6 * dpr;
  ctx.stroke();

  const glow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 6 * dpr);
  glow.addColorStop(0, `rgba(255, 200, 253, ${alpha * 0.85})`);
  glow.addColorStop(0.3, `rgba(${ACCENT}, ${alpha * 0.4})`);
  glow.addColorStop(1, `rgba(${ACCENT}, 0)`);
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 6 * dpr, 0, TAU);
  ctx.fill();

  ctx.fillStyle = `rgba(255, 235, 254, ${alpha})`;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, 1.5 * dpr, 0, TAU);
  ctx.fill();
}

export default function ConnectedGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const rotationRef = useRef(1.02);
  const tiltRef = useRef(-0.075);
  const velRef = useRef({ vx: 0, vy: 0 });
  const dragRef = useRef({ active: false, x: 0, y: 0 });
  const routesRef = useRef<Array<Route & { id: number; birth: number; duration: number }>>([]);
  const lastSpawnRef = useRef(0);
  const nextDelayRef = useRef(500);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shell = shellRef.current;
    if (!canvas || !shell) return;
    // TRANSPARENT canvas — no black container!
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let lastTime = performance.now();
    let elapsed = 4.5;

    const resize = () => {
      const bounds = shell.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(bounds.width * dpr));
      height = Math.max(1, Math.round(bounds.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    let isVisible = false;

    const render = (now: number) => {
      if (!isVisible && !dragRef.current.active) {
        frameRef.current = null;
        return;
      }

      const delta = Math.min(40, now - lastTime) / 1000;
      lastTime = now;
      if (!reduceMotion) {
        elapsed += delta;
        // Apply velocity with friction (inertia after drag)
        if (!dragRef.current.active) {
          rotationRef.current += delta * 0.085 + velRef.current.vx * delta;
          tiltRef.current = Math.max(-1.57, Math.min(1.57, tiltRef.current + velRef.current.vy * delta));
          velRef.current.vx *= 0.97;
          velRef.current.vy *= 0.97;
          if (Math.abs(velRef.current.vx) < 0.001) velRef.current.vx = 0;
          if (Math.abs(velRef.current.vy) < 0.001) velRef.current.vy = 0;
        }
      }

      // Dynamic routing (Bursting in groups, growing then retreating after 3s)
      if (now - lastSpawnRef.current > nextDelayRef.current) {
        lastSpawnRef.current = now;
        nextDelayRef.current = 6000; // 6 second full cycle per group

        // Spawn 4-7 lines at once
        const spawnCount = 4 + Math.floor(Math.random() * 4);
        for (let j = 0; j < spawnCount; j++) {
          routesRef.current.push({
            id: Math.random(), from: getRandomDot(), to: getRandomDot(),
            birth: elapsed + (j * 0.1), // slight stagger to feel organic
            duration: 6.0, lift: 0.25 + Math.random() * 0.15,
          });
        }
      }
      routesRef.current = routesRef.current.filter((r) => elapsed - r.birth < r.duration);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const radius = Math.min(width, height) * 0.33;
      const rotation = rotationRef.current;
      const tilt = tiltRef.current;

      // Clear to transparent
      ctx.clearRect(0, 0, width, height);

      // Process routes (back pass first)
      const activeRoutes: Array<{
        front: () => void;
        points: Array<{ x: number; y: number; z: number; occluded: boolean }>;
        alpha: number;
        headProgress: number;
        age: number;
      }> = [];

      for (const route of routesRef.current) {
        const age = elapsed - route.birth;

        let headReveal = 0;
        if (age < 3.0) {
          // Grow phase: 0 to 2 seconds
          headReveal = clamp(age / 2.0);
        } else {
          // Retreat phase ("starts going back"): 3 to 5 seconds
          headReveal = 1.0 - clamp((age - 3.0) / 2.0);
        }

        const headProgress = easeOutCubic(headReveal);
        const tailProgress = 0;

        const alpha = clamp(headReveal * 2.5);

        if (alpha < 0.015) continue;
        const rd = drawRoute(ctx, route, headProgress, tailProgress, alpha, rotation, tilt, cx, cy, radius, dpr);
        activeRoutes.push({ front: rd.strokeFront, points: rd.points, alpha, headProgress, age });
      }

      // ── Globe body — 100% opacity, pure black to match section bg ──
      const body = ctx.createRadialGradient(
        cx - radius * 0.3, cy - radius * 0.25, radius * 0.05,
        cx, cy, radius,
      );
      body.addColorStop(0, "#000000");
      body.addColorStop(1, "#000000");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.fill();

      // Clip dots inside sphere
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.997, 0, TAU);
      ctx.clip();

      // ── Land dots — #9ca3af (User requested via screenshot) ──
      ctx.fillStyle = "rgba(156, 163, 175, 1)";
      ctx.beginPath();
      for (let i = 0; i < LAND_DOTS.length; i++) {
        const dot = LAND_DOTS[i];
        const [x, y, z] = rotate([dot.x, dot.y, dot.z], rotation, tilt);
        if (z < -0.015) continue;
        const px = cx + x * radius;
        const py = cy - y * radius;
        const size = (0.25 + z * 0.25) * dot.weight * dpr;
        ctx.moveTo(px, py);
        ctx.rect(px - size, py - size, size * 2.5, size * 2.5);
      }
      ctx.fill();
      ctx.restore();

      // Front route pass + markers & landing splash
      for (const r of activeRoutes) r.front();
      for (let i = 0; i < activeRoutes.length; i++) {
        const r = activeRoutes[i];
        if (r.points.length > 0) {
          const pt = r.points[r.points.length - 1];
          if (r.headProgress < 0.98) {
            // Travelling marker
            const pulse = (elapsed * 2 + i) % 1;
            drawMarker(ctx, pt, pulse, r.alpha, dpr);
          } else if (r.age >= 2.0 && r.age <= 3.0 && !pt.occluded) {
            // Splash effect when landing on spot
            const splashAge = Math.min(1, Math.max(0, r.age - 2.0));
            const splashRadius = (2 + splashAge * 20) * dpr;
            const splashAlpha = r.alpha * (1 - splashAge);
            
            if (splashAlpha > 0.01) {
              ctx.strokeStyle = `rgba(0, 245, 212, ${splashAlpha})`;
              ctx.lineWidth = 1.5 * dpr;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, splashRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      frameRef.current = requestAnimationFrame(render);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(shell);
    resize();

    const io = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && frameRef.current === null) {
        lastTime = performance.now();
        frameRef.current = requestAnimationFrame(render);
      }
    }, { threshold: 0 });
    io.observe(shell);

    return () => {
      ro.disconnect();
      io.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, x: e.clientX, y: e.clientY };
    velRef.current = { vx: 0, vy: 0 };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current.x = e.clientX;
    dragRef.current.y = e.clientY;
    rotationRef.current += dx * 0.005;
    tiltRef.current = Math.max(-1.57, Math.min(1.57, tiltRef.current + dy * 0.005));
    // Store velocity for inertia
    velRef.current.vx = dx * 0.3;
    velRef.current.vy = dy * 0.3;
  };

  const stopDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragRef.current.active = false;
  };

  return (
    <div ref={shellRef} className="w-full h-full flex items-center justify-center relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[0]">
        {/* Stronger white/neutral rim shadow to lift black globe off black bg */}
        <div className="w-[50%] h-[50%] rounded-full shadow-[0_0_110px_25px_rgba(255,255,255,0.12)] bg-transparent opacity-100" />
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing focus:outline-none scale-[1.15] z-10 relative"
        style={{ touchAction: "none" }}
        role="img"
        aria-label="Interactive rotating globe with animated network connections. Drag to rotate."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      />
    </div>
  );
}
