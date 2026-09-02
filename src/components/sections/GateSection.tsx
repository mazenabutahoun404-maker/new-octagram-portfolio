import { useEffect, useRef, useState } from "react";
import LazyMount from "../ui/LazyMount";
import GridRise from "../ocean/GridRise";

function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

export default function GateSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const glowWrapperRef = useRef<HTMLDivElement>(null);
  const gridRiseRef = useRef<HTMLDivElement>(null);

  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  useEffect(() => {
    let animationFrameId: number;
    let isRunning = false;
    let isVisible = false;

    const lerp = () => {
      const progress = targetProgress.current;
      const diff = progress - currentProgress.current;

      if (!isVisible && !isRunning) {
        isRunning = false;
        return;
      }

      if (Math.abs(diff) < 0.0005) {
        currentProgress.current = progress;
        isRunning = false;
        // Do one last DOM update to settle perfectly
      } else {
        currentProgress.current += diff * 0.15; // actually lerp for smoothness
      }

      const current = currentProgress.current;

      // Dynamically calculate ideal base scale for responsive phones (700px is the structural width + paddings)
      const gateOptimalWidth = 740;
      const baseScale = Math.min(1, window.innerWidth / gateOptimalWidth);

      // Enforce a strict delay! Wait for 15% of the scroll before the Gate begins zooming.
      const zoomRaw = Math.min(1, Math.max(0, (current - 0.15) / 0.85));
      const zoomEased = zoomRaw * zoomRaw * (3 - 2 * zoomRaw);
      // Mobile zoom travels exactly the same massive cinematic distance relative to its base!
      const cameraScale = baseScale + zoomEased * (35 / baseScale);

      // ── DIRECT DOM MUTATIONS (ZERO REACT RE-RENDERS!) ──
      // 1. Cinematic Zoom (Cap scaling to 35x to protect compositor memory)
      if (zoomContainerRef.current) {
        zoomContainerRef.current.style.transform = `scale(${cameraScale})`;
      }

      // 2. Shell Fade Out Transition
      if (shellRef.current) {
        const exitRaw = Math.min(1, Math.max(0, (current - 0.82) / 0.18));
        shellRef.current.style.opacity = Math.max(0, 1 - exitRaw).toString();
      }

      // 3. Glow Intensity Transitions
      if (glowWrapperRef.current) {
        // Prevent drop-blur texture crash securely by hiding it exactly as it clears the screen viewport
        const scaleFadeTarget = Math.max(0, 1 - Math.max(0, (cameraScale - 4.5) / 1.0));
        const isOversized = cameraScale > 5.5; 
        glowWrapperRef.current.style.display = isOversized ? "none" : "flex";

        if (!isOversized) {
          const glowIntensity = Math.min(1, current * 4);
          const baseOpacity = scaleFadeTarget;
          
          const outerGlow = glowWrapperRef.current.children[0] as HTMLElement;
          const gateStruct = glowWrapperRef.current.children[1] as HTMLElement;
          const floorLight = glowWrapperRef.current.children[2] as HTMLElement;

          if (outerGlow) outerGlow.style.opacity = (glowIntensity * 0.6 * baseOpacity).toString();
          if (gateStruct) {
            gateStruct.style.opacity = baseOpacity.toString();
            gateStruct.style.boxShadow = `0 0 ${60 + (glowIntensity * 40)}px rgba(14,165,233,${0.2 + (glowIntensity * 0.2)}), inset 0 0 ${40 + (glowIntensity * 40)}px rgba(14,165,233,${0.1 + (glowIntensity * 0.2)})`;
          }
          if (floorLight) floorLight.style.opacity = (glowIntensity * 0.5 * baseOpacity).toString();
        }
      }

      // 4. Vector Mask & WebGL Texture Crash Protection
      if (maskRef.current) {
        maskRef.current.style.opacity = "1";
        maskRef.current.style.display = cameraScale > 5.5 ? "none" : "flex"; 
      }
      
      if (gridRiseRef.current) {
        // Cancel out parent 2D zoom perfectly using exact screen center (16.666% of 60vh container)
        gridRiseRef.current.style.transformOrigin = "50% 16.666%";
        gridRiseRef.current.style.transform = `scale(${1 / cameraScale})`;

        // Boolean fade detached exclusively from active scroll percentage
        const shouldShowGrid = current >= 0.05 && current <= 0.25;
        gridRiseRef.current.style.opacity = shouldShowGrid ? "1" : "0";
      }

      if (isRunning || isVisible) {
        if (isRunning && Math.abs(diff) < 0.0005) {
          // let it run once more to finish setting properties
        } else {
          animationFrameId = requestAnimationFrame(lerp);
        }
      }
    };

    let containerTopCache = 0;
    let scrollableCache = 1000;

    const updateGeometry = () => {
      if (!containerRef.current) return;
      // Cache absolute document position
      const rect = containerRef.current.getBoundingClientRect();
      containerTopCache = rect.top + window.scrollY;
      scrollableCache = Math.max(1, rect.height - window.innerHeight);
    };

    const onScroll = () => {
      const scrollPos = window.scrollY;
      const relativeTop = containerTopCache - scrollPos;

      targetProgress.current = Math.min(1, Math.max(0, -relativeTop / scrollableCache));

      if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(lerp);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateGeometry, { passive: true });
    updateGeometry();
    onScroll();

    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(lerp);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateGeometry);
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} id="gate" className="relative h-[200vh] w-full z-10">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* MAIN SHELL CONTAINER (FADES TO BLACK AT END) */}
        <div
          ref={shellRef}
          className="absolute inset-0 will-change-[opacity] overflow-hidden pointer-events-none"
          style={{ opacity: 1 }}
        >
          {/* THE ZOOM CONTAINER */}
          <div
            ref={zoomContainerRef}
            className="absolute inset-0 will-change-transform flex items-center justify-center transform-gpu origin-center"
            style={{ transform: "scale(1)" }}
          >
            {/* ── THE FLAWLESS VECTOR HOLE PUNCH ── */}
            {/* Abandoning box-shadow entirely to aggressively protect Safari/iOS WebGL compositor limits. 
                Using a massive Vector SVG `<rect>` with a `<mask />` is mathematically flawless and uses 0 VRAM! */}
            <div ref={maskRef} className="absolute z-[0] pointer-events-none -mt-[5vh] flex items-center justify-center">
              <svg
                className="w-[2500px] h-[2500px]"
                viewBox="0 0 2500 2500"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <mask id="gate-hole-mask">
                    <rect width="2500" height="2500" fill="white" />
                    <rect x="910" y="1060" width="680" height="380" rx="30" fill="black" />
                  </mask>
                </defs>
                <rect width="2500" height="2500" fill="#f0f9ff" mask="url(#gate-hole-mask)" />
              </svg>
            </div>

            {/* ── THE WATER GRIDRISE ── */}
            {/* Standard Desktop layout. Precision U-shaped clip-path meticulously positioned to trim 
                the gate bounds visually on desktop monitors. Disabled entirely on mobile 
                to avoid iOS coordinate masking bugs and save performance. */}
            <div
              ref={gridRiseRef}
              className="absolute bottom-0 h-[60vh] w-[300%] -left-[100%] z-10 pointer-events-none transition-opacity duration-1000 will-change-transform"
              style={{
                opacity: 0,
                maskImage: 'radial-gradient(ellipse at bottom center, black 40%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(ellipse at bottom center, black 40%, transparent 80%)',
                clipPath: `polygon(
                  0% 0%, 
                  calc(50% - 348px) 0%, 
                  calc(50% - 348px) calc(5vh + 198px), 
                  calc(50% + 348px) calc(5vh + 198px), 
                  calc(50% + 348px) 0%, 
                  100% 0%, 
                  100% 100%, 
                  0% 100%
                )`
              }}
            >
              {!isMobile && (
                <LazyMount rootMargin="800px 0px">
                  <GridRise
                    ambientColor="#f0f9ff"
                    boxColor="#0ea5e9"
                    baseHeight={1.2}
                    waveStrength={3.0}
                    waveSpeed={1.0}
                    gridSize={80}
                    cameraPos={[32, 16, 32]}
                  />
                </LazyMount>
              )}
            </div>
            {/* ── THE HORIZONTAL RECTANGLE GATE ── */}
            <div ref={glowWrapperRef} className="relative w-[700px] h-[400px] z-20 flex items-center justify-center -mt-[5vh]">
              {/* Outer Glow Ring */}
              <div
                className="absolute inset-0 rounded-[2rem] border border-sky-400 blur-xl scale-110 pointer-events-none"
                style={{ opacity: 0 }}
              />

              {/* The Horizontal Gate Portal Structure */}
              <div
                className="relative w-[700px] h-[400px] rounded-[2rem] border-4 border-white bg-transparent shadow-[0_0_80px_rgba(14,165,233,0.3),inset_0_0_60px_rgba(14,165,233,0.2)] flex items-center justify-center backdrop-blur-[2px]"
              >
              </div>

              {/* Floor projection light under the gate */}
              <div
                className="absolute inset-x-0 -bottom-32 h-64 bg-sky-400/40 blur-[60px] rounded-[100%] scale-x-150 pointer-events-none"
                style={{ opacity: 0 }}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
