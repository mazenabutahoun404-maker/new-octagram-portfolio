import { useEffect, useRef, useState } from "react";

type DarkExperienceCanvasProps = {
  activePalette?: [string, string, string];
};

function clamp(val: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, val));
}

function smoothstep(min: number, max: number, value: number) {
  const x = clamp((value - min) / Math.max(0.0001, max - min));
  return x * x * (3 - 2 * x);
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  return isMobile;
}

export default function DarkExperienceCanvas({
  activePalette = ["#FF7E5F", "#00F5D4", "#00BBF9"],
}: DarkExperienceCanvasProps) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let isRunning = false;
    let targetProgress = 0;
    let currentProgress = 0;

    const lerp = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) < 0.0005) {
        currentProgress = targetProgress;
        isRunning = false;
        return;
      }
      currentProgress += diff * 0.1;

      if (containerRef.current) {
        // Headless opacity calculation matching previous smoothstep curves
        const overallFadeIn = smoothstep(0.42, 0.45, currentProgress);
        // Fade out DarkExperienceCanvas just before runway hits top
        const overallFadeOut = 1 - smoothstep(0.82, 0.86, currentProgress);
        const overallAlpha = overallFadeIn * overallFadeOut;
        containerRef.current.style.opacity = overallAlpha.toString();
      }

      animationFrameId = requestAnimationFrame(lerp);
    };

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const newProgress = window.scrollY / totalScroll;
      targetProgress = newProgress;

      // Extremely lightweight threshold mounts - only triggers twice structurally
      const shouldBeMounted = newProgress >= 0.41 && newProgress <= 0.88;
      setIsMounted(prev => {
        if (prev !== shouldBeMounted) return shouldBeMounted;
        return prev;
      });

      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(lerp);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Init

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // We only structurally return null when far off threshold to flush heavy WebGL
  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[4] pointer-events-none overflow-hidden will-change-[opacity]"
      style={{ opacity: 0 }}
    >
      {/* ── 1. VOLUMETRIC RADIANT CHROMATIC LIGHT BACKDROP ── */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: isMobile
            ? "radial-gradient(ellipse at 100% 50%, rgba(0, 245, 212, 0.3) 0%, rgba(123, 44, 191, 0.2) 25%, rgba(255, 126, 95, 0.1) 45%, #000000 75%, #000000 100%)"
            : "radial-gradient(ellipse at 100% 50%, rgba(0, 245, 212, 0.4) 0%, rgba(123, 44, 191, 0.25) 20%, rgba(255, 126, 95, 0.12) 35%, #000000 50%, #000000 100%)",
        }}
      />





      {/* ── 4. PYTHAGORAS COMPLEMENTARY TRIANGLE SHADOW MASK ── */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: isMobile
            ? "linear-gradient(180deg, #000000 0%, #000000 40%, rgba(0,0,0,0.7) 65%, transparent 95%)"
            : "linear-gradient(125deg, #000000 0%, #000000 38%, rgba(0,0,0,0.85) 54%, rgba(0,0,0,0.2) 75%, transparent 95%)",
        }}
      />
    </div>
  );
}
