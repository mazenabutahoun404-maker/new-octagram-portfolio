import { useEffect, useRef } from "react";
import octagramLogo from "../../assets/OctagramLogo.png";

type DiveLoaderProps = {
  progress: number;
  visible: boolean;
};

const WORDMARK = "OCTAGRAM".split("");

export default function DiveLoader({
  progress,
  visible,
}: DiveLoaderProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(clamped * 100);

  const stageRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const wasVisible = useRef(visible);

  // Fires the top-to-bottom vanish wipe exactly once, the moment the
  // parent flips `visible` to false. Runs imperatively so the mask
  // animates smoothly without re-rendering React every frame.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    if (wasVisible.current && !visible) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const duration = 1500;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const edge = eased * 116 - 8;
        const feather = 12;
        const top = Math.max(-20, edge - feather);
        const bottom = Math.min(120, edge + feather);
        const mask = `linear-gradient(to bottom, transparent 0%, transparent ${top}%, black ${bottom}%, black 100%)`;
        el.style.webkitMaskImage = mask;
        (el.style as any).maskImage = mask;
        el.style.filter = `blur(${eased * 6}px)`;

        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    if (!wasVisible.current && visible) {
      // Reset for a fresh intro if the loader is shown again.
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      el.style.webkitMaskImage = "none";
      (el.style as any).maskImage = "none";
      el.style.filter = "none";
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
    }

    wasVisible.current = visible;
  }, [visible]);

  return (
    <div
      ref={stageRef}
      className="octagram-stage"
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
      aria-label={`Loading Octagram, ${percentage}% complete`}
    >
      <style>{`
        .octagram-stage {
          position: fixed;
          inset: 0;
          z-index: 110;
          overflow: hidden;
          background: #fbf7ef;
          font-family: 'Space Grotesk', sans-serif;
        }

        .octagram-grain {
          position: absolute; inset: 0;
          filter: url(#octagram-grain);
          mix-blend-mode: multiply;
          opacity: .35;
          pointer-events: none;
          z-index: 5;
        }

        .octagram-card {
          position: absolute; left: 50%; top: 50%; z-index: 10; transform: translate(-50%, -50%);
          display: flex; flex-direction: column; align-items: center;
          width: min(84%, 380px);
          padding: 34px 30px 26px;
          border-radius: 24px;
          background: rgba(255,255,255,.4);
          border: 1px solid rgba(255,255,255,.7);
          box-shadow: 0 20px 60px rgba(20,60,58,.18), inset 0 1px 0 rgba(255,255,255,.9);
          backdrop-filter: blur(22px) saturate(160%);
          -webkit-backdrop-filter: blur(22px) saturate(160%);
        }

        .octagram-mark {
          width: 52px; height: 52px; object-fit: contain;
          filter: drop-shadow(0 6px 10px rgba(20,90,86,.18));
        }

        .octagram-wordmark {
          margin-top: 16px; display: flex; justify-content: center; gap: .02em;
          font-family: 'Fraunces', serif; font-weight: 500;
          font-size: clamp(1.7rem, 6vw, 2.6rem);
          letter-spacing: .06em; text-transform: uppercase; color: #123f3d;
        }
        .octagram-wordmark span {
          display: inline-block;
          animation: octagram-rise 900ms cubic-bezier(.19,1,.22,1) both;
        }
        @keyframes octagram-rise {
          from { transform: translateY(.5em); opacity: 0; filter: blur(4px); }
          to   { transform: translateY(0);    opacity: 1; filter: blur(0); }
        }

        .octagram-tagline {
          margin-top: 8px; font-size: 10px; font-weight: 500;
          text-transform: uppercase; letter-spacing: .36em;
          color: rgba(18,63,61,.55);
        }

        .octagram-readout { margin-top: 20px; width: 100%; display: flex; align-items: center; gap: 10px; }
        .octagram-readout-line {
          position: relative; flex: 1; height: 3px; border-radius: 999px;
          background: rgba(18,63,61,.12); overflow: hidden;
        }
        .octagram-readout-fill {
          position: absolute; inset-block: 0; left: 0; border-radius: 999px;
          background: linear-gradient(90deg, #0e8f86, #57bdb0, #e3bd7f);
          transition: width 450ms cubic-bezier(.33,.8,.4,1);
        }
        .octagram-readout-pct {
          font-size: 12px; font-weight: 700; color: #0e6b64;
          font-variant-numeric: tabular-nums; min-width: 34px; text-align: right;
        }

        @media (prefers-reduced-motion: reduce) {
          .octagram-wordmark span {
            animation: none !important;
          }
        }
      `}</style>

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="octagram-grain">
          <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.1  0 0 0 0 0.15  0 0 0 0 0.14  0 0 0 0.05 0" />
        </filter>
        <filter id="octagram-caustic" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={2} seed={4} result="n">
            <animate attributeName="baseFrequency" dur="20s" values="0.012 0.02;0.02 0.012;0.012 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale={40} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div aria-hidden="true" className="octagram-grain" />

      <main className="octagram-card">
        <img src={octagramLogo} alt="Octagram" draggable={false} className="octagram-mark" />

        <h1 className="octagram-wordmark">
          {WORDMARK.map((letter, i) => (
            <span key={i} style={{ animationDelay: `${120 + i * 60}ms` }}>
              {letter}
            </span>
          ))}
        </h1>

        <p className="octagram-tagline">Architecting digital futures</p>

        <div className="octagram-readout">
          <span className="octagram-readout-line">
            <span className="octagram-readout-fill" style={{ width: `${percentage}%` }} />
          </span>
          <span className="octagram-readout-pct">{percentage}%</span>
        </div>
      </main>
    </div>
  );
}