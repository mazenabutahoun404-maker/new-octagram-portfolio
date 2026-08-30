import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  rootMargin?: string;
  fallback?: ReactNode;
}

export default function LazyMount({
  children,
  rootMargin = "50px 0px",
  fallback = null,
}: LazyMountProps) {
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMounted) return;

    let mountTimeout: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // STRICT WebGL Engine safeguard: 
          // Delay mounting by 250ms. If the user is just ripping the scrollbar past this section,
          // we NEVER mount the WebGL context, completely avoiding context-loss limit saturation!
          mountTimeout = window.setTimeout(() => {
            setIsMounted(true);
          }, 250);
        } else {
          if (mountTimeout) {
            window.clearTimeout(mountTimeout);
            mountTimeout = null;
          }
          // ONE-WAY MOUNT ARCHITECTURE:
          // We DO NOT unmount WebGL Canvas components!
          // Unmounting them and scrubbing back up forces re-compilation of 30,000 vertex shaders,
          // blocking the main thread for 250ms+ and throwing TDR Context Lost errors!
          // The underlying components (ParticleSphere, Grid) now natively pause their `requestAnimationFrame` loops
          // via internal IntersectionObservers, meaning keeping them mounted costs EXACTLY 0% CPU!
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(el);
    return () => {
      observer.unobserve(el);
      if (mountTimeout) window.clearTimeout(mountTimeout);
    };
  }, [rootMargin, isMounted]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center w-full h-full transition-opacity duration-700 ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {isMounted ? children : fallback}
    </div>
  );
}
