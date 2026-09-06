import { useEffect, useId, useRef, useState } from "react";
import LazyMount from "../ui/LazyMount";
import GridRise from "../ocean/GridRise";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
function easeBetween(start: number, end: number, value: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

const styles = `
  .octa-gate { position:relative; z-index:10; width:100%; height:200vh; height:200svh; }
  .octa-gate *, .octa-gate *::before, .octa-gate *::after { box-sizing:border-box; }
  .octa-gate__stage { position:sticky; top:0; height:100vh; height:100svh; width:100%; overflow:hidden; }
  .octa-gate__shell { position:absolute; inset:0; pointer-events:none; }
  .octa-gate__mask { position:absolute; inset:0; display:block; width:100%; height:100%; }
  .octa-gate__grid { position:absolute; inset:45% -20% 0; opacity:0; pointer-events:none; mask-image:linear-gradient(transparent,#000 75%); -webkit-mask-image:linear-gradient(transparent,#000 75%); }
  .octa-gate__frame { position:absolute; left:50%; top:55%; width:min(700px,84vw); height:min(392px,47vw,40svh); transform:translate(-50%,-50%); border:2px solid #fff; border-radius:24px; box-shadow:0 0 0 1px #73b9d455,0 0 32px #0ea5e933,inset 0 0 20px #0ea5e91a; }
  .octa-gate__copy { position:absolute; top:9%; inset-inline:24px; text-align:center; color:#173348; }
  .octa-gate__eyebrow { margin:0 0 15px; color:#32647e; font-size:12px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; }
  .octa-gate__title { margin:0; font-family:var(--font-display, Georgia, serif); font-size:clamp(38px,4.5vw,64px); font-weight:400; letter-spacing:-0.045em; line-height:1.06; }
  .octa-gate__caption { position:absolute; bottom:8%; inset-inline:24px; display:flex; flex-direction:column; align-items:center; gap:14px; color:#32647e; font-size:12px; letter-spacing:0.07em; }
  .octa-gate__caption::after { content:""; width:1px; height:28px; background:#6494ac; }
  .octa-gate__static-caption { display:none; }
  @media (max-height:550px) { .octa-gate__copy { top:5%; } .octa-gate__title { font-size:34px; } .octa-gate__eyebrow { margin-bottom:8px; } .octa-gate__caption { bottom:5%; } .octa-gate__caption::after { height:14px; } }
  @media (prefers-reduced-motion:reduce) {
    .octa-gate { height:100vh; height:100svh; }
    .octa-gate__stage { position:relative; }
    .octa-gate__grid, .octa-gate__scroll-caption { display:none; }
    .octa-gate__static-caption { display:inline; }
  }
`;

export default function GateSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const holeRef = useRef<SVGRectElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [showGrid, setShowGrid] = useState(false);
  const instanceId = useId().replace(/:/g, "");
  const maskId = `octa-gate-mask-${instanceId}`;

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let frame = 0;
    let previousTime = 0;
    let current = 0;
    let initialized = false;
    let disposed = false;

    const updateGrid = () => {
      if (!motionQuery.matches) {
        setShowGrid(true);
      }
    };

    const draw = (time: number) => {
      frame = 0;
      if (disposed) return;

      // Read geometry first. Re-measure document position so upstream layout shifts
      // cannot leave the scroll target stale.
      const rect = container.getBoundingClientRect();
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      const target = motionQuery.matches ? 0 : clamp(-rect.top / Math.max(1, rect.height - height));
      const dt = previousTime ? Math.min(64, time - previousTime) : 16;
      previousTime = time;
      if (!initialized || motionQuery.matches) {
        current = target;
        initialized = true;
      } else {
        current += (target - current) * (1 - Math.exp(-dt / 85));
      }
      const moving = Math.abs(target - current) > 0.0005;
      if (!moving) current = target;

      const baseWidth = Math.min(700, width * 0.84);
      const baseHeight = Math.min(400, baseWidth * 0.56, height * 0.4);
      // Enlarge only as far as required to cover this viewport. The SVG itself
      // remains viewport-sized; no 2500px texture is scaled dozens of times.
      const coverScale = Math.max((width + 80) / baseWidth, (height * 1.1 + 80) / baseHeight);
      const scale = 1 + easeBetween(0.12, 0.94, current) * (coverScale - 1);
      const holeWidth = baseWidth * scale;
      const holeHeight = baseHeight * scale;
      const centerY = height * 0.55;
      const textOpacity = 1 - easeBetween(0.02, 0.22, current);
      const borderOpacity = 1 - easeBetween(0.64, 0.92, current);

      svgRef.current?.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const hole = holeRef.current;
      if (hole) {
        hole.setAttribute("x", String((width - holeWidth) / 2));
        hole.setAttribute("y", String(centerY - holeHeight / 2));
        hole.setAttribute("width", String(holeWidth));
        hole.setAttribute("height", String(holeHeight));
        hole.setAttribute("rx", String(24 * scale));
      }

      const holeBottom = centerY + holeHeight / 2;

      if (frameRef.current) {
        Object.assign(frameRef.current.style, {
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: String(borderOpacity),
          visibility: borderOpacity === 0 ? "hidden" : "visible",
        });
      }
      if (shellRef.current) shellRef.current.style.opacity = "1";
      if (copyRef.current) copyRef.current.style.opacity = String(textOpacity);
      if (captionRef.current) captionRef.current.style.opacity = String(textOpacity);
      if (gridRef.current) {
        gridRef.current.style.opacity = "0.85";
        // Cut out the actual portal opening without inheriting the frame's scale.
        const gridWidth = width * 1.4;
        const x1 = (gridWidth - holeWidth) / 2;
        const x2 = (gridWidth + holeWidth) / 2;
        const bottom = height * 0.1 + holeHeight / 2;
        gridRef.current.style.clipPath = `polygon(0 0,${x1}px 0,${x1}px ${bottom}px,${x2}px ${bottom}px,${x2}px 0,100% 0,100% 100%,0 100%)`;
      }
      if (moving) frame = requestAnimationFrame(draw);
    };

    const schedule = () => {
      if (!frame && visible && !disposed) frame = requestAnimationFrame(draw);
    };
    const onPreferenceChange = () => {
      initialized = false;
      updateGrid();
      schedule();
    };
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        previousTime = 0;
        initialized = false;
        updateGrid();
        if (visible) schedule();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      }, { rootMargin: "800px 0px" })
      : null;
    observer?.observe(container);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    resizeObserver?.observe(stage);
    resizeObserver?.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    motionQuery.addEventListener("change", onPreferenceChange);

    updateGrid();
    schedule();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motionQuery.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <div ref={containerRef} id="gate" className="octa-gate">
      <style>{styles}</style>
      <div ref={stageRef} className="octa-gate__stage">
        <div ref={shellRef} className="octa-gate__shell">
          <svg ref={svgRef} className="octa-gate__mask" aria-hidden="true" focusable="false">
            <defs>
              <mask id={maskId} x="0" y="0" width="100%" height="100%" maskUnits="userSpaceOnUse">
                <rect width="100%" height="100%" fill="white" />
                <rect ref={holeRef} x="8%" y="35%" width="84%" height="40%" rx="24" fill="black" />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="#f0f9ff" mask={`url(#${maskId})`} />
          </svg>
          <div ref={gridRef} className="octa-gate__grid" aria-hidden="true">
            {showGrid && (
              <LazyMount rootMargin="800px 0px">
                <GridRise
                  ambientColor="#e0f2fe"
                  boxColor="#38bdf8"
                  baseHeight={1.8}
                  waveStrength={2}
                  waveSpeed={0.65}
                  gridSize={85}
                  cameraPos={[32, 16, 32]}
                />
              </LazyMount>
            )}
          </div>
          <div ref={frameRef} className="octa-gate__frame" aria-hidden="true" />
          <div ref={copyRef} className="octa-gate__copy">
            <p className="octa-gate__eyebrow">The next chapter</p>
            <h2 className="octa-gate__title">Step into what comes next.</h2>
          </div>
          <div ref={captionRef} className="octa-gate__caption" aria-hidden="true">
            <span className="octa-gate__scroll-caption">Scroll to explore</span>
            <span className="octa-gate__static-caption">Explore what comes next</span>
          </div>
        </div>
      </div>
    </div>
  );
}