import { useEffect, useRef, type RefObject } from "react";
import { detectCapability } from "../../lib/capability";
import {
  landmarkProgress,
  selectFrames,
  sequenceLandmarks,
  sequences,
  type SelectedFrames,
  type SequenceChapter,
} from "../../lib/oceanSequences";

type OceanJourneyCanvasProps = {
  depthOutputRef: RefObject<HTMLSpanElement | null>;
  onInitialBufferProgress?: (progress: number) => void;
};

type LoadedFrame = {
  image: HTMLImageElement;
  touchedAt: number;
};

type CoverRect = {
  viewportWidth: number;
  viewportHeight: number;
  naturalWidth: number;
  naturalHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type FiberPoint = {
  x: number;
  y: number;
};

type FiberStrand = {
  points: FiberPoint[];
  emergence: number;
  thickness: number;
  seed: number;
  dormant: boolean;
};

type OceanDebugState = {
  currentChapter: string | null;
  currentFrame: number;
  targetFrame: number;
  decodedFrameCount: number;
  cacheSize: number;
  qualityMode: string;
  averageFrameTime: number;
  depth: number;
  submersion: number;
  degradationLevel: number;
  networkGrowth: number;
  scrollVelocity: number;
  pointerEffects: boolean;
};

declare global {
  interface Window {
    __OCEAN_DEBUG__?: OceanDebugState;
  }
}



const isDevelopment = import.meta.env.DEV;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

function smoothstep(value: number) {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
}

function seededUnit(seed: number) {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1;
}

function cubicPoint(
  start: FiberPoint,
  controlA: FiberPoint,
  controlB: FiberPoint,
  end: FiberPoint,
  t: number,
) {
  const inverse = 1 - t;
  return {
    x:
      inverse ** 3 * start.x +
      3 * inverse ** 2 * t * controlA.x +
      3 * inverse * t ** 2 * controlB.x +
      t ** 3 * end.x,
    y:
      inverse ** 3 * start.y +
      3 * inverse ** 2 * t * controlA.y +
      3 * inverse * t ** 2 * controlB.y +
      t ** 3 * end.y,
  };
}

function sampleCurve(
  start: FiberPoint,
  controlA: FiberPoint,
  controlB: FiberPoint,
  end: FiberPoint,
  segments: number,
) {
  return Array.from({ length: segments + 1 }, (_, index) =>
    cubicPoint(start, controlA, controlB, end, index / segments),
  );
}

function createLivingNetwork(
  viewportWidth: number,
  viewportHeight: number,
  requestedCount: number,
) {
  const strands: FiberStrand[] = [];
  const count = Math.max(3, requestedCount);

  for (let line = 0; line < count; line += 1) {
    const seed = line + 1;
    const fromLeft = line % 2 === 0;
    const side = fromLeft ? 1 : -1;
    const start = {
      x: fromLeft ? -viewportWidth * 0.035 : viewportWidth * 1.035,
      y: viewportHeight * (0.75 + seededUnit(seed * 2.1) * 0.22),
    };
    const end = {
      x:
        viewportWidth *
        (fromLeft
          ? 0.34 + seededUnit(seed * 3.7) * 0.21
          : 0.66 - seededUnit(seed * 3.7) * 0.21),
      y: viewportHeight * (0.58 + seededUnit(seed * 5.3) * 0.25),
    };
    const controlA = {
      x: start.x + side * viewportWidth * (0.12 + seededUnit(seed * 7.9) * 0.09),
      y: viewportHeight * (0.57 + seededUnit(seed * 9.1) * 0.24),
    };
    const controlB = {
      x: end.x - side * viewportWidth * (0.12 + seededUnit(seed * 11.3) * 0.1),
      y: viewportHeight * (0.7 + seededUnit(seed * 13.7) * 0.18),
    };
    const mainPoints = sampleCurve(start, controlA, controlB, end, 28);
    strands.push({
      points: mainPoints,
      emergence: 0.04 + (line / count) * 0.28,
      thickness: 0.68 + seededUnit(seed * 17.1) * 0.72,
      seed,
      dormant: false,
    });

    const branchCount = 1 + (line % 3 === 0 ? 1 : 0);
    for (let branch = 0; branch < branchCount; branch += 1) {
      const anchorIndex = Math.round(
        mainPoints.length * (0.36 + branch * 0.2 + seededUnit(seed * 19.9) * 0.06),
      );
      const anchor = mainPoints[Math.min(mainPoints.length - 1, anchorIndex)];
      const branchSide = branch % 2 === 0 ? side : -side;
      const branchEnd = {
        x:
          anchor.x +
          branchSide * viewportWidth * (0.07 + seededUnit(seed * 23.3 + branch) * 0.075),
        y:
          anchor.y -
          viewportHeight * (0.055 + seededUnit(seed * 29.7 + branch) * 0.09),
      };
      const branchControlA = {
        x: anchor.x + branchSide * viewportWidth * 0.028,
        y: anchor.y - viewportHeight * (0.035 + branch * 0.012),
      };
      const branchControlB = {
        x: branchEnd.x - branchSide * viewportWidth * 0.024,
        y: branchEnd.y + viewportHeight * 0.025,
      };
      strands.push({
        points: sampleCurve(
          anchor,
          branchControlA,
          branchControlB,
          branchEnd,
          14,
        ),
        emergence: 0.42 + (line / count) * 0.26 + branch * 0.12,
        thickness: 0.38 + seededUnit(seed * 31.1 + branch) * 0.28,
        seed: seed + branch * 0.37,
        dormant: branch === 1 || line % 4 === 0,
      });
    }
  }

  return strands;
}

export default function OceanJourneyCanvas({
  depthOutputRef,
  onInitialBufferProgress,
}: OceanJourneyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!canvas || !context) return;

    const root = document.documentElement;
    const profile = detectCapability();
    const navButtons = Array.from(
      document.querySelectorAll<HTMLButtonElement>("[data-journey-stop]"),
    );
    const waterBodies = Array.from(
      document.querySelectorAll<HTMLElement>("[data-water-body]"),
    );
    const heroVideo = document.querySelector<HTMLVideoElement>(
      "[data-hero-video]",
    );
    const waterTouchProgress = landmarkProgress("chapter1First");
    const fullySubmergedProgress = landmarkProgress("chapter1Second");
    const seabedArrivalProgress = landmarkProgress("chapter1Forth");
    const ascentBeginsProgress = landmarkProgress("chapter2FirstHalf");
    const surfaceApproachProgress = landmarkProgress("chapter2SecondHalf");
    const surfaceBreakProgress = landmarkProgress("chapter2SecondHalf");

    root.dataset.animationQuality = profile.quality;
    root.dataset.reducedMotion = String(profile.reducedMotion);
    root.dataset.performanceLevel = "0";
    root.dataset.oceanRuntime = "true";
    root.style.setProperty("--sequence-ready", "0");

    let width = 0;
    let height = 0;
    let dpr = 1;
    let scrollableCached = 1;
    let targetProgress = 0;
    let smoothProgress = 0;
    let previousProgress = 0;
    let scrollDirection: 1 | -1 = 1;
    let animationFrame = 0;
    let resizeFrame = 0;
    let renderIsRunning = false;
    let pageVisible = !document.hidden;
    let resumeAudioAfterVisibility = false;
    let sequenceReady = false;
    let degradationLevel = 0;
    let slowFrameCount = 0;
    let averageFrameTime = 16.7;
    let previousFrameTime = performance.now();
    let diagnosticTime = 0;
    let renderCount = 0;
    let disposed = false;
    let lastLoggedFrameKey = "";
    let livingNetwork: FiberStrand[] = [];
    let targetPointerX = window.innerWidth * 0.5;
    let targetPointerY = window.innerHeight * 0.5;
    let pointerX = targetPointerX;
    let pointerY = targetPointerY;
    let pointerSeen = false;
    let pointerEnergy = 0;
    let targetScrollVelocity = 0;
    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let hoverTarget = 0;
    let hoverResponse = 0;
    let hoverX = targetPointerX;
    let hoverY = targetPointerY;
    let hoverPulseStart = Number.NEGATIVE_INFINITY;
    let activeNetworkReactor: Element | null = null;
    let ambientPulseStart = Number.NEGATIVE_INFINITY;
    let ambientPulseSerial = 0;
    let nextAmbientPulseAt = performance.now() + 5200;
    let visionEntryStart = Number.NEGATIVE_INFINITY;
    let visionEntryArmed = true;
    const resize = () => {
      const viewport = window.visualViewport;
      width = Math.round(viewport?.width ?? window.innerWidth);
      height = Math.round(viewport?.height ?? window.innerHeight);
      dpr = Math.min(window.devicePixelRatio || 1, profile.dprCap);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality =
        profile.quality === "high" ? "high" : "medium";
      root.style.setProperty("--viewport-height", `${height}px`);
      livingNetwork = createLivingNetwork(width, height, profile.fiberCount);
      if (!pointerSeen) {
        targetPointerX = width * 0.5;
        targetPointerY = height * 0.62;
        pointerX = targetPointerX;
        pointerY = targetPointerY;
      }
      scrollableCached = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );

      };

    const scheduleResize = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
      });
    };

    const updateScrollTarget = () => {
      const nextProgress = clamp(window.scrollY / scrollableCached);
      const now = performance.now();
      const elapsed = Math.max(16, now - lastScrollTime);
      const distance = window.scrollY - lastScrollY;
      targetScrollVelocity = clamp(distance / elapsed / 2.4, -1, 1);
      lastScrollY = window.scrollY;
      lastScrollTime = now;
      if (Math.abs(nextProgress - targetProgress) > 0.00005) {
        scrollDirection = nextProgress >= targetProgress ? 1 : -1;
      }
      targetProgress = nextProgress;
      };

    const updateInterface = (
      progress: number,
      depth: number,
      submersion: number,
      travelDirection: 1 | -1,
      networkGrowth: number,
      visionProximity: number,
    ) => {
      const surfaceStrength = Math.pow(1 - depth, 1.7);
      const waterlineStrength = Math.max(
        1 - clamp(Math.abs(progress - waterTouchProgress) / 0.032),
        1 - clamp(Math.abs(progress - surfaceBreakProgress) / 0.032),
      );
      const motionStrength = 0.18 + (1 - depth) * 0.82;
      const rayOpacity = Math.pow(1 - depth, 2.2);
      const fiberOpacity = clamp((depth - 0.74) / 0.26);
      const bioluminescence = clamp((depth - 0.64) / 0.36);
      const flashlightStrength =
        profile.quality === "high" &&
          profile.precisePointer &&
          pointerSeen &&
          !profile.reducedMotion &&
          degradationLevel < 6
          ? smoothstep((depth - 0.76) / 0.24) * (0.72 + pointerEnergy * 0.28)
          : 0;

      root.style.setProperty("--journey", progress.toFixed(4));
      root.style.setProperty("--depth", depth.toFixed(4));
      root.style.setProperty("--ocean-depth", depth.toFixed(4));
      root.style.setProperty("--submersion", submersion.toFixed(4));
      root.style.setProperty("--direction", String(travelDirection));
      root.style.setProperty("--surface-strength", surfaceStrength.toFixed(4));
      root.style.setProperty("--ocean-light", surfaceStrength.toFixed(4));
      root.style.setProperty("--waterline", waterlineStrength.toFixed(4));
      root.style.setProperty("--motion-strength", motionStrength.toFixed(4));
      root.style.setProperty(
        "--particle-opacity",
        (0.22 + depth * 0.78).toFixed(4),
      );
      root.style.setProperty("--ray-opacity", rayOpacity.toFixed(4));
      root.style.setProperty("--fiber-opacity", fiberOpacity.toFixed(4));
      root.style.setProperty(
        "--glass-darkness",
        (0.28 + depth * 0.32).toFixed(4),
      );
      root.style.setProperty("--bioluminescence", bioluminescence.toFixed(4));
      root.style.setProperty("--network-growth", networkGrowth.toFixed(4));
      root.style.setProperty("--seabed-stage", smoothstep((depth - 0.64) / 0.36).toFixed(4));
      root.style.setProperty("--vision-entry", visionProximity.toFixed(4));
      root.style.setProperty("--flashlight-strength", flashlightStrength.toFixed(4));
      root.style.setProperty("--network-hover", hoverResponse.toFixed(4));
      root.style.setProperty("--scroll-current", scrollVelocity.toFixed(4));
      root.style.setProperty("--pointer-x", `${pointerX.toFixed(1)}px`);
      root.style.setProperty("--pointer-y", `${pointerY.toFixed(1)}px`);

      if (depthOutputRef.current) {
        depthOutputRef.current.textContent = String(
          Math.round(depth * 3800),
        ).padStart(4, "0");
      }

      const navButtons = document.querySelectorAll(
        ".journey-nav-button",
      ) as NodeListOf<HTMLButtonElement>;

      let activeStop = 0;
      navButtons.forEach((button, index) => {
        const stop = Number(button.dataset.journeyStop ?? 0);
        if (progress >= stop - 0.035) activeStop = index;
      });
      navButtons.forEach((button, index) => {
        button.dataset.active = String(index === activeStop);
      });

      if (heroVideo) {
        const nearSurface = submersion < 0.08 || smoothProgress > 0.88;
        if (nearSurface && pageVisible && heroVideo.paused) {
          void heroVideo.play().catch(() => undefined);
        } else if ((!nearSurface || !pageVisible) && !heroVideo.paused) {
          heroVideo.pause();
        }
      }
    };

    const updateWaterPhysics = (
      time: number,
      progress: number,
      depth: number,
      submersion: number,
    ) => {
      if (profile.reducedMotion) return;
      const performanceScale = degradationLevel >= 7 ? 0.24 : degradationLevel >= 5 ? 0.55 : 1;
      const currentStrength = scrollVelocity * submersion * performanceScale;

      waterBodies.forEach((body, index) => {
        const owner = body.closest<HTMLElement>("[data-center]");
        const center = Number(body.dataset.center ?? owner?.dataset.center ?? 0.5);
        const ascending = body.dataset.ascent === "true" || owner?.dataset.ascent === "true";
        const sectionDistance = clamp((progress - center) / 0.145, -1, 1);
        const seed = (index + 1) * 1.731;
        const phase = seededUnit(seed) * Math.PI * 2;
        const localSubmersion = body.closest(".hero-section") ? submersion * 0.35 : submersion;
        const buoyancy = (2.2 + depth * 5.8) * localSubmersion * performanceScale;
        const floatY = Math.sin(time * (0.00028 + seededUnit(seed + 2) * 0.0002) + phase) * buoyancy;
        const floatX = Math.cos(time * (0.00022 + seededUnit(seed + 5) * 0.00016) + phase) * buoyancy * 0.42;
        const currentX = -currentStrength * (7 + seededUnit(seed + 8) * 12);
        const currentY = currentStrength * (ascending ? -4 : 4);
        const parallaxY = sectionDistance * profile.parallaxDistance * (ascending ? 0.58 : -0.58) * performanceScale;
        const parallaxX = sectionDistance * profile.parallaxDistance * (ascending ? -0.1 : 0.1) * performanceScale;
        const rotation = Math.sin(time * 0.00019 + phase) * (0.08 + depth * 0.18) * localSubmersion * performanceScale;
        const compression = 1 - Math.abs(sectionDistance) * 0.009 * performanceScale;

        body.style.transform = `translate3d(${(floatX + currentX + parallaxX).toFixed(2)}px, ${(floatY + currentY + parallaxY).toFixed(2)}px, 0) rotate(${rotation.toFixed(3)}deg) scale(${compression.toFixed(4)})`;
      });
    };

    const drawDepthGrade = (depth: number, time: number) => {
      const deep = smoothstep((depth - 0.38) / 0.62);
      const breathing =
        profile.reducedMotion || depth < 0.82
          ? 1
          : 1 + Math.sin(time * 0.00055) * 0.025;
      const gradient = context.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${deep * 0.4 * breathing})`);
      gradient.addColorStop(0.52, `rgba(0, 0, 0, ${deep * 0.52 * breathing})`);
      gradient.addColorStop(1, `rgba(0, 0, 0, ${0.08 + deep * 0.55 * breathing})`);
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);
    };

    const drawSeabedFog = (depth: number, time: number) => {
      const strength = smoothstep((depth - 0.72) / 0.28);
      if (strength <= 0.001) return;
      const drift = profile.reducedMotion ? 0 : Math.sin(time * 0.000075) * width * 0.035;
      const fogA = context.createRadialGradient(
        width * 0.22 + drift,
        height * 0.68,
        0,
        width * 0.22 + drift,
        height * 0.68,
        width * 0.56,
      );
      fogA.addColorStop(0, `rgba(0, 0, 0, ${strength * 0.065})`);
      fogA.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = fogA;
      context.fillRect(0, 0, width, height);

      const fogB = context.createRadialGradient(
        width * 0.82 - drift * 0.6,
        height * 0.88,
        0,
        width * 0.82 - drift * 0.6,
        height * 0.88,
        width * 0.48,
      );
      fogB.addColorStop(0, `rgba(0, 0, 0, ${strength * 0.075})`);
      fogB.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = fogB;
      context.fillRect(0, 0, width, height);
    };

    const drawHiddenGeometry = (
      depth: number,
      time: number,
      visionEvent: number,
    ) => {
      const strength = smoothstep((depth - 0.78) / 0.22);
      if (strength <= 0.001 || degradationLevel >= 3) return;
      const interactive =
        profile.quality === "high" && profile.precisePointer && pointerSeen;
      const breathing = profile.reducedMotion ? 1 : 1 + Math.sin(time * 0.0005) * 0.04;

      context.save();
      context.globalCompositeOperation = "screen";
      context.lineWidth = 0.7;
      context.strokeStyle = `rgba(114, 221, 229, ${strength * (0.012 + visionEvent * 0.02) * breathing})`;
      context.beginPath();
      const radius = Math.min(width, height) * 0.47;
      for (let point = 0; point <= 8; point += 1) {
        const angle = -Math.PI * 0.5 + (point / 8) * Math.PI * 2;
        const x = width * 0.5 + Math.cos(angle) * radius;
        const y = height * 1.03 + Math.sin(angle) * radius;
        if (point === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();

      context.beginPath();
      context.arc(width * 0.5, height * 1.03, radius * 0.7, Math.PI * 1.08, Math.PI * 1.92);
      context.stroke();
      context.beginPath();
      context.arc(width * 0.04, height * 0.72, radius * 0.5, -1.1, 1.2);
      context.stroke();

      if (interactive) {
        const reveal = context.createRadialGradient(
          pointerX,
          pointerY,
          0,
          pointerX,
          pointerY,
          285,
        );
        reveal.addColorStop(0, `rgba(200, 255, 248, ${strength * 0.115})`);
        reveal.addColorStop(0.45, `rgba(111, 247, 232, ${strength * 0.048})`);
        reveal.addColorStop(1, "rgba(111, 247, 232, 0)");
        context.strokeStyle = reveal;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(width * 0.5, height * 1.03, radius * 0.7, Math.PI * 1.08, Math.PI * 1.92);
        context.stroke();
      }
      context.restore();
    };

    const drawLivingNetwork = (
      depth: number,
      time: number,
      networkGrowth: number,
      visionEvent: number,
    ) => {
      if (networkGrowth <= 0.001 || livingNetwork.length === 0) return;
      const isLow = profile.quality === "low" || profile.reducedMotion;
      const allowDeformation =
        !isLow && degradationLevel < 7;
      const allowPointer =
        profile.quality === "high" &&
        profile.precisePointer &&
        pointerSeen &&
        degradationLevel < 7;
      const allowHoverPulse =
        allowPointer && degradationLevel < 2 && hoverResponse > 0.005;
      const ambientAge = time - ambientPulseStart;
      const ambientPhase =
        profile.quality !== "low" && ambientAge >= 0 && ambientAge < 2600
          ? ambientAge / 2600
          : -1;
      const hoverAge = time - hoverPulseStart;
      const hoverPhase =
        allowHoverPulse && hoverAge >= 0 && hoverAge < 1700
          ? hoverAge / 1700
          : -1;
      const entryAge = time - visionEntryStart;
      const entryPhase =
        entryAge >= 0 && entryAge < 3000 && !profile.reducedMotion
          ? entryAge / 3000
          : -1;
      const breathing =
        isLow ? 1 : 1 + Math.sin(time * 0.00056) * 0.045 * smoothstep((depth - 0.82) / 0.18);
      const strandStride = degradationLevel >= 4 ? 2 : 1;
      const pointerRadius = 245;
      const currentOffset = allowDeformation ? -scrollVelocity * 7 : 0;

      const deformPoint = (point: FiberPoint, seed: number) => {
        const slowSway =
          allowDeformation
            ? Math.sin(time * 0.00009 + seed * 1.9 + point.y * 0.004) * 1.7
            : 0;
        let x = point.x + currentOffset + slowSway;
        let y = point.y - scrollVelocity * 4.5;
        if (allowPointer) {
          const dx = x - pointerX;
          const dy = y - pointerY;
          const distance = Math.hypot(dx, dy);
          if (distance > 0.1 && distance < pointerRadius) {
            const influence = smoothstep(1 - distance / pointerRadius);
            const displacement = influence * (4 + pointerEnergy * 4);
            x += (dx / distance) * displacement;
            y += (dy / distance) * displacement * 0.55;
          }
        }
        return { x, y };
      };

      context.save();
      context.globalCompositeOperation = "screen";
      context.lineCap = "round";
      context.lineJoin = "round";

      for (let strandIndex = 0; strandIndex < livingNetwork.length; strandIndex += strandStride) {
        const strand = livingNetwork[strandIndex];
        const strandGrowth = smoothstep(
          (networkGrowth - strand.emergence) / (strand.dormant ? 0.32 : 0.42),
        );
        if (strandGrowth <= 0.001) continue;
        const visibleSegments = Math.max(
          1,
          Math.floor((strand.points.length - 1) * strandGrowth),
        );
        const dormantBase = strand.dormant ? 0.14 : 1;
        const baseAlpha =
          strandGrowth *
          dormantBase *
          breathing *
          (0.028 + strand.thickness * 0.026 + visionEvent * 0.018);
        context.strokeStyle = `rgba(111, 247, 232, ${baseAlpha})`;
        context.lineWidth = strand.thickness;
        context.beginPath();

        for (let pointIndex = 0; pointIndex <= visibleSegments; pointIndex += 1) {
          const point = deformPoint(
            strand.points[pointIndex],
            strand.seed + pointIndex * 0.05,
          );
          if (pointIndex === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.stroke();

        if (allowPointer) {
          context.lineWidth = strand.thickness + 0.45;
          for (let pointIndex = 1; pointIndex <= visibleSegments; pointIndex += 1) {
            const rawPoint = strand.points[pointIndex];
            const distance = Math.hypot(rawPoint.x - pointerX, rawPoint.y - pointerY);
            const reveal = smoothstep(1 - distance / pointerRadius);
            if (reveal <= 0.01) continue;
            const previousPoint = deformPoint(
              strand.points[pointIndex - 1],
              strand.seed + (pointIndex - 1) * 0.05,
            );
            const point = deformPoint(rawPoint, strand.seed + pointIndex * 0.05);
            context.strokeStyle = `rgba(200, 255, 248, ${reveal * strandGrowth * (strand.dormant ? 0.18 : 0.1)})`;
            context.beginPath();
            context.moveTo(previousPoint.x, previousPoint.y);
            context.lineTo(point.x, point.y);
            context.stroke();
          }
        }

        let pulsePosition = -1;
        let pulseStrength = 0;
        if (entryPhase >= 0) {
          pulsePosition = clamp(entryPhase * 1.28 - (strand.seed % 1) * 0.22);
          pulseStrength = Math.sin(entryPhase * Math.PI) * 0.38;
        }
        if (ambientPhase >= 0) {
          const ambientPosition = clamp(
            ambientPhase * 1.34 - (strand.seed % 1) * 0.3,
          );
          const ambientStrength = Math.sin(ambientPhase * Math.PI) * 0.24;
          if (ambientStrength > pulseStrength) {
            pulsePosition = ambientPosition;
            pulseStrength = ambientStrength;
          }
        }
        if (hoverPhase >= 0) {
          const anchor = strand.points[Math.floor(visibleSegments * 0.5)];
          const proximity = smoothstep(
            1 - Math.hypot(anchor.x - hoverX, anchor.y - hoverY) / Math.max(width * 0.56, 1),
          );
          const hoverPosition = clamp(hoverPhase * 1.2);
          const hoverStrength = Math.sin(hoverPhase * Math.PI) * proximity * 0.32;
          if (hoverStrength > pulseStrength) {
            pulsePosition = hoverPosition;
            pulseStrength = hoverStrength;
          }
        }

        if (pulsePosition >= 0 && pulseStrength > 0.005) {
          const centerIndex = Math.min(
            visibleSegments,
            Math.max(1, Math.round(pulsePosition * visibleSegments)),
          );
          const startIndex = Math.max(0, centerIndex - 2);
          const endIndex = Math.min(visibleSegments, centerIndex + 2);
          context.strokeStyle = `rgba(200, 255, 248, ${pulseStrength * strandGrowth})`;
          context.lineWidth = strand.thickness + 0.75;
          context.shadowColor = "rgba(111, 247, 232, .32)";
          context.shadowBlur = profile.quality === "high" ? 5 : 0;
          context.beginPath();
          for (let pointIndex = startIndex; pointIndex <= endIndex; pointIndex += 1) {
            const point = deformPoint(
              strand.points[pointIndex],
              strand.seed + pointIndex * 0.05,
            );
            if (pointIndex === startIndex) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          }
          context.stroke();
          context.shadowBlur = 0;
        }
      }
      context.restore();
    };

    const drawEnvironment = (
      depth: number,
      time: number,
      networkGrowth: number,
      visionEvent: number,
    ) => {
      const surface = Math.pow(1 - depth, 2);
      const motion = profile.reducedMotion ? 0 : 0.13 + (1 - depth) * 0.87;
      const particleCount =
        degradationLevel >= 5
          ? Math.max(8, Math.round(profile.particleCount * 0.45))
          : profile.particleCount;
      const visibleParticleCount = Math.max(
        4,
        Math.round(particleCount * (0.22 + depth * 0.78)),
      );
      const visibleBubbleCount = Math.max(
        depth > 0.82 ? 0 : 1,
        Math.round(profile.bubbleCount * Math.pow(surface, 0.78)),
      );

      drawSeabedFog(depth, time);
      drawHiddenGeometry(depth, time, visionEvent);

      context.save();
      context.globalCompositeOperation = "screen";

      if (
        surface > 0.08 &&
        profile.quality !== "low" &&
        degradationLevel < 3
      ) {
        context.lineWidth = 0.7;
        const rows = profile.quality === "high" ? 5 : 3;
        for (let row = 0; row < rows; row += 1) {
          context.strokeStyle = `rgba(190, 250, 251, ${surface * (0.025 + row * 0.008)})`;
          context.beginPath();
          for (let x = -20; x <= width + 20; x += 18) {
            const y =
              height * (0.16 + row * 0.07) +
              Math.sin(x * 0.018 + time * 0.00055 * motion + row) * 9;
            if (x === -20) context.moveTo(x, y);
            else context.lineTo(x, y);
          }
          context.stroke();
        }
      }

      const pressureEnabled =
        profile.quality === "high" &&
        profile.precisePointer &&
        pointerSeen &&
        !profile.reducedMotion &&
        degradationLevel < 1;
      const pressureRadius = 220;
      for (let index = 0; index < visibleParticleCount; index += 1) {
        const seedX = ((index * 73) % 101) / 100;
        const seedY = ((index * 47) % 97) / 96;
        const speed = time * motion * (0.000004 + (index % 5) * 0.0000008);
        let x =
          seedX * width +
          Math.sin(time * 0.00023 * motion + index) * 7 -
          scrollVelocity * (2 + (index % 4));
        let y = ((seedY - speed + 10) % 1) * height - scrollVelocity * 5;
        let pressure = 0;
        if (pressureEnabled && depth > 0.68 && index < 20) {
          const dx = x - pointerX;
          const dy = y - pointerY;
          const distance = Math.hypot(dx, dy);
          if (distance > 0.1 && distance < pressureRadius) {
            pressure = smoothstep(1 - distance / pressureRadius);
            x += (dx / distance) * pressure * 6;
            y += (dy / distance) * pressure * 3.5;
          }
        }
        const radius = 0.4 + (index % 4) * 0.34;
        const deepGlow = depth > 0.7 && index % 8 === 0;
        context.fillStyle = deepGlow
          ? `rgba(111, 247, 232, ${0.07 + depth * 0.18 + pressure * 0.16 + visionEvent * 0.08})`
          : `rgba(222, 252, 255, ${0.04 + surface * 0.15 + pressure * 0.06})`;
        context.beginPath();
        context.arc(x, y, deepGlow ? radius * 1.48 : radius, 0, Math.PI * 2);
        context.fill();
      }

      context.lineWidth = 0.8;
      for (let index = 0; index < visibleBubbleCount; index += 1) {
        const lane = ((index * 37) % 97) / 96;
        const bubbleSpeed = profile.reducedMotion
          ? 0
          : time * (0.000035 + (index % 4) * 0.000007) * motion;
        const x =
          lane * width + Math.sin(time * 0.0005 * motion + index * 2.1) * 11;
        const y = ((0.95 - bubbleSpeed + index * 0.17 + 10) % 1) * height;
        const radius = 1.8 + (index % 5) * 1.25;
        context.strokeStyle = `rgba(217, 253, 255, ${0.055 + surface * 0.2})`;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();

      drawLivingNetwork(depth, time, networkGrowth, visionEvent);
    };

    const lowerPerformanceBudget = () => {
      if (degradationLevel >= 7) return;
      degradationLevel += 1;
      slowFrameCount = 0;
      root.dataset.performanceLevel = String(degradationLevel);
      if (isDevelopment) {
        console.info(
          `[ocean] Performance budget lowered to level ${degradationLevel}.`,
        );
      }
    };

    const render = (time: number) => {
      try {
        if (!pageVisible) {
          renderIsRunning = false;
          return;
        }

      const delta = time - previousFrameTime;
      previousFrameTime = time;

      // Ignore massive OS/JS thread spikes (GC, React Hydration, Hot Reloads).
      // Only measure sustained GPU rendering lag (regular frames taking > 25ms).
      // Give initial react components 3000ms to boot before observing.
      if (time > 3000 && delta > 0 && delta < 80) {
        averageFrameTime = averageFrameTime * 0.96 + delta * 0.04;
        if (averageFrameTime > 25) slowFrameCount += 1;
        else slowFrameCount = Math.max(0, slowFrameCount - 2);
        if (slowFrameCount > 180) lowerPerformanceBudget();
      }

      if (Math.abs(targetProgress - smoothProgress) > 0.15) {
        smoothProgress = targetProgress;
      } else {
        smoothProgress +=
          (targetProgress - smoothProgress) *
          (profile.reducedMotion ? 1 : profile.quality === "low" ? 0.11 : 0.08);
      }
      const progress = clamp(smoothProgress);
      window.dispatchEvent(new CustomEvent("ocean-progress", { detail: progress }));
      const descendingSubmersion = smoothstep(
        (progress - waterTouchProgress) /
        Math.max(0.001, fullySubmergedProgress - waterTouchProgress),
      );
      const ascentEmergence = smoothstep(
        (progress - surfaceApproachProgress) /
        Math.max(0.001, surfaceBreakProgress - surfaceApproachProgress),
      );
      const submersion = clamp(descendingSubmersion * (1 - ascentEmergence));
      const depth =
        progress < waterTouchProgress
          ? 0
          : progress < seabedArrivalProgress
            ? smoothstep(
              (progress - waterTouchProgress) /
              Math.max(0.001, seabedArrivalProgress - waterTouchProgress),
            )
            : progress <= ascentBeginsProgress
              ? 1
              : 1 -
              smoothstep(
                (progress - ascentBeginsProgress) /
                Math.max(0.001, surfaceBreakProgress - ascentBeginsProgress),
              );
      const travelDirection: 1 | -1 =
        progress <= ascentBeginsProgress ? 1 : -1;
      if (Math.abs(progress - previousProgress) > 0.00002) {
        scrollDirection = progress >= previousProgress ? 1 : -1;
      }
      previousProgress = progress;

      const pointerSmoothing = profile.reducedMotion ? 1 : 0.09;
      pointerX += (targetPointerX - pointerX) * pointerSmoothing;
      pointerY += (targetPointerY - pointerY) * pointerSmoothing;
      pointerEnergy += ((pointerSeen ? 1 : 0) - pointerEnergy) * 0.075;
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.11;
      targetScrollVelocity *= 0.9;
      hoverResponse += (hoverTarget - hoverResponse) * 0.08;

      const networkGrowth = smoothstep((depth - 0.64) / 0.36);
      const visionProximity = smoothstep(
        1 - Math.abs(progress - 0.59) / 0.078,
      );
      if (visionProximity > 0.72 && visionEntryArmed) {
        visionEntryStart = time;
        visionEntryArmed = false;
      } else if (visionProximity < 0.12) {
        visionEntryArmed = true;
      }
      const visionEventAge = time - visionEntryStart;
      const visionEvent =
        visionEventAge >= 0 && visionEventAge < 3200 && !profile.reducedMotion
          ? Math.sin((visionEventAge / 3200) * Math.PI)
          : 0;

      if (
        depth > 0.92 &&
        profile.quality !== "low" &&
        !profile.reducedMotion &&
        time >= nextAmbientPulseAt
      ) {
        ambientPulseStart = time;
        ambientPulseSerial += 1;
        nextAmbientPulseAt =
          time + 4200 + seededUnit(ambientPulseSerial * 7.31) * 5600;
      } else if (depth < 0.76 && time > nextAmbientPulseAt) {
        nextAmbientPulseAt = time + 4800;
      }

      updateInterface(
        progress,
        depth,
        submersion,
        travelDirection,
        networkGrowth,
        visionProximity,
      );
      updateWaterPhysics(time, progress, depth, submersion);
      context.clearRect(0, 0, width, height);

      // Calculate cross-fade to synchronize with hero video
      const heroFadeOut = smoothstep((progress - 0.005) / 0.045);
      const footerFadeIn = smoothstep(
        (progress - surfaceApproachProgress) /
        Math.max(0.001, surfaceBreakProgress - surfaceApproachProgress),
      );
      const videoAlpha = clamp(1 - heroFadeOut + footerFadeIn);
      root.style.setProperty("--hero-video-opacity", videoAlpha.toFixed(4));

      // Only draw environmental overlays (depth grade, caustics, particles, bubbles)
      // once we are past the hero image-sequence phase. During the early scroll
      // the user should see ONLY the raw image sequences with nothing on top.
      if (depth > 0.15) {
        drawDepthGrade(depth, time);
        drawEnvironment(depth, time, networkGrowth, visionEvent);
      }

      // Use raw instant scroll position for the darkness overlay so that if a user 
      // furiously scrubs in reverse, the screen instantly snaps to black, seamlessly masking 
      // the background canvas while it awaits network fetching for the new chapter sequences.
      const instantProgress = targetProgress;
      let abyssDarkness = 0;
      if (instantProgress >= 0.44 && instantProgress <= 0.89) {
        if (instantProgress < 0.52) {
          abyssDarkness = smoothstep((instantProgress - 0.44) / 0.08);
        } else if (instantProgress > 0.87) {
          abyssDarkness = 1 - smoothstep((instantProgress - 0.87) / 0.02);
        } else {
          abyssDarkness = 1;
        }
      }

      if (abyssDarkness > 0.01) {
        context.globalCompositeOperation = "source-over"; // Reset blending!
        context.fillStyle = `rgba(0, 0, 0, ${abyssDarkness})`;
        context.fillRect(0, 0, width, height);
      }

      if (isDevelopment) {
        const elProgress = document.getElementById("dbg-progress");

        if (elProgress) elProgress.textContent = progress.toFixed(4);

        if (time - diagnosticTime > 500) {
          diagnosticTime = time;
          window.__OCEAN_DEBUG__ = {
            currentChapter: null,
            currentFrame: 0,
            targetFrame: 0,
            decodedFrameCount: 0,
            cacheSize: 0,
            qualityMode: profile.quality,
            averageFrameTime: Number(averageFrameTime.toFixed(2)),
            depth: Number(depth.toFixed(4)),
            submersion: Number(submersion.toFixed(4)),
            degradationLevel,
            networkGrowth: Number(networkGrowth.toFixed(4)),
            scrollVelocity: Number(scrollVelocity.toFixed(4)),
            pointerEffects:
              profile.quality === "high" &&
              profile.precisePointer &&
              !profile.reducedMotion &&
              degradationLevel < 7,
          };
        }
      }

      } catch (err: any) {
        console.error("Render loop crashed:", err);
        const panel = document.getElementById("ocean-debug-panel");
        if (panel) {
          panel.style.border = "1px solid red";
          panel.style.color = "#ff3333";
          panel.innerHTML = `<div style="font-weight:bold;margin-bottom:4px;">RENDER CRASHED:</div><div>${err.message || err}</div><pre style="font-size:8px;overflow:auto;max-height:100px;margin-top:6px;color:#aaa;">${err.stack || ""}</pre>`;
        }
      }

      animationFrame = requestAnimationFrame(render);
    };

    const startRenderLoop = () => {
      if (renderIsRunning || !pageVisible) return;
      renderIsRunning = true;
      previousFrameTime = performance.now();
      animationFrame = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (!pageVisible) {
        cancelAnimationFrame(animationFrame);
        renderIsRunning = false;
        targetScrollVelocity = 0;
        scrollVelocity = 0;
        hoverTarget = 0;
        heroVideo?.pause();
        return;
      }

      updateScrollTarget();
      smoothProgress = targetProgress;
      previousProgress = targetProgress;
      scheduleResize();
      startRenderLoop();
    };

    const trackPointer = (event: PointerEvent) => {
      targetPointerX = event.clientX;
      targetPointerY = event.clientY;
      pointerSeen = true;
    };

    const releasePointer = () => {
      pointerSeen = false;
      hoverTarget = 0;
      activeNetworkReactor = null;
    };

    const handleNetworkPointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const reactor = target.closest("[data-network-reactor]");
      if (!reactor || reactor === activeNetworkReactor) return;
      activeNetworkReactor = reactor;
      hoverTarget = 1;
      hoverX = event.clientX;
      hoverY = event.clientY;
      hoverPulseStart = performance.now();
    };

    const handleNetworkPointerOut = (event: PointerEvent) => {
      if (!activeNetworkReactor) return;
      const related = event.relatedTarget;
      if (related instanceof Node && activeNetworkReactor.contains(related)) {
        return;
      }
      hoverTarget = 0;
      activeNetworkReactor = null;
    };

    resize();
    updateScrollTarget();
    smoothProgress = targetProgress;
    previousProgress = targetProgress;

    onInitialBufferProgress?.(1);

    window.addEventListener("resize", scheduleResize, { passive: true });
    window.addEventListener("orientationchange", scheduleResize, {
      passive: true,
    });
    window.visualViewport?.addEventListener("resize", scheduleResize, {
      passive: true,
    });
    window.addEventListener("scroll", updateScrollTarget, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (
      profile.precisePointer &&
      profile.quality === "high" &&
      !profile.reducedMotion
    ) {
      window.addEventListener("pointermove", trackPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", releasePointer, {
        passive: true,
      });
      document.addEventListener("pointerover", handleNetworkPointerOver, {
        passive: true,
      });
      document.addEventListener("pointerout", handleNetworkPointerOut, {
        passive: true,
      });
    }
    startRenderLoop();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("orientationchange", scheduleResize);
      window.visualViewport?.removeEventListener("resize", scheduleResize);
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("pointermove", trackPointer);
      document.documentElement.removeEventListener("pointerleave", releasePointer);
      document.removeEventListener("pointerover", handleNetworkPointerOver);
      document.removeEventListener("pointerout", handleNetworkPointerOut);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      waterBodies.forEach((body) => body.style.removeProperty("transform"));
      delete root.dataset.animationQuality;
      delete root.dataset.reducedMotion;
      delete root.dataset.performanceLevel;
      delete root.dataset.oceanRuntime;
      root.style.removeProperty("--sequence-ready");
      [
        "--journey",
        "--depth",
        "--ocean-depth",
        "--submersion",
        "--direction",
        "--surface-strength",
        "--ocean-light",
        "--waterline",
        "--motion-strength",
        "--particle-opacity",
        "--ray-opacity",
        "--fiber-opacity",
        "--glass-darkness",
        "--bioluminescence",
        "--network-growth",
        "--seabed-stage",
        "--vision-entry",
        "--flashlight-strength",
        "--network-hover",
        "--scroll-current",
        "--pointer-x",
        "--pointer-y",
        "--viewport-height",
      ].forEach((property) => root.style.removeProperty(property));
      if (isDevelopment) delete window.__OCEAN_DEBUG__;
    };
  }, [depthOutputRef, onInitialBufferProgress]);

  return (
    <>
      <canvas ref={canvasRef} className="sequence-canvas" aria-hidden="true" />
    </>
  );
}
