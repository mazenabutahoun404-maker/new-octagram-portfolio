import React, { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { sequences, selectFrames, type SequenceChapter, type SelectedFrames } from "../../lib/oceanSequences";

export default function SmoothImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Storage for loaded Image objects
  const cacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const pendingRef = useRef<Map<string, Promise<HTMLImageElement>>>(new Map());
  const preloadTimerRef = useRef<number | ReturnType<typeof setTimeout> | null>(null);

  const renderRequestedRef = useRef(false);
  const currentDrawKeyRef = useRef<string | null>(null);
  const rectRef = useRef<{ w: number, h: number, iw: number, ih: number, x: number, y: number, dw: number, dh: number } | null>(null);

  // Smooth momentum system: lerp the progress so frames keep sliding after scroll stops
  const smoothProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const momentumRafRef = useRef<number | null>(null);

  const prefersReducedMotion = useReducedMotion();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getChapterAtProgress = (progress: number) => {
    const exact = sequences.find((chapter) => progress >= chapter.start && progress <= chapter.end);
    if (exact) return exact;
    if (progress < sequences[0].start) return sequences[0];

    for (let i = 0; i < sequences.length - 1; i++) {
      if (progress > sequences[i].end && progress < sequences[i + 1].start) {
        if (sequences[i].id === "chapter1Forth") return sequences[i];
        const midpoint = (sequences[i].end + sequences[i + 1].start) / 2;
        return progress < midpoint ? sequences[i] : sequences[i + 1];
      }
    }
    return sequences[sequences.length - 1];
  };

  const getFrameIndex = (chapter: SequenceChapter, selected: SelectedFrames, progress: number) => {
    const localProgress = Math.min(1, Math.max(0, (progress - chapter.start) / (chapter.end - chapter.start)));
    const totalFrames = Math.max(0, selected.sources.length - 1);

    if (prefersReducedMotion) {
      const step = Math.max(1, Math.floor(totalFrames / 3));
      return Math.min(totalFrames, Math.round((localProgress * totalFrames) / step) * step);
    }
    return Math.round(localProgress * totalFrames);
  };

  const MAX_CACHE_SIZE = 40;

  const loadFrame = async (chapter: SequenceChapter, selected: SelectedFrames, index: number): Promise<HTMLImageElement> => {
    const key = `${chapter.id}:${selected.variant}:${index}`;
    
    // LRU Cache mechanism: if it exists, delete and re-insert so it becomes the newest
    if (cacheRef.current.has(key)) {
      const img = cacheRef.current.get(key)!;
      cacheRef.current.delete(key);
      cacheRef.current.set(key, img);
      return img;
    }
    
    if (pendingRef.current.has(key)) return pendingRef.current.get(key)!;

    const promise = new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        cacheRef.current.set(key, img);
        
        // Enforce max cache size by deleting the oldest item (first item in Map)
        if (cacheRef.current.size > MAX_CACHE_SIZE) {
          const oldestKey = cacheRef.current.keys().next().value;
          if (oldestKey) cacheRef.current.delete(oldestKey);
        }
        
        pendingRef.current.delete(key);
        resolve(img);
      };
      img.onerror = () => {
        pendingRef.current.delete(key);
        resolve(img);
      };
      img.src = selected.sources[index];
    });

    pendingRef.current.set(key, promise);
    return promise;
  };

  const drawToCanvas = (img: HTMLImageElement, key: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2
    const rect = canvas.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;

    if (canvas.width !== Math.round(cw * dpr) || canvas.height !== Math.round(ch * dpr)) {
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      ctx.scale(dpr, dpr);
      rectRef.current = null; // force recalculation of object-fit cover
    }

    if (!rectRef.current || rectRef.current.w !== cw || rectRef.current.h !== ch || rectRef.current.iw !== img.naturalWidth) {
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      rectRef.current = {
        w: cw, h: ch, iw: img.naturalWidth, ih: img.naturalHeight,
        x: (cw - dw) / 2, y: (ch - dh) / 2, dw, dh
      };
    }

    const { x, y, dw, dh } = rectRef.current;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, dw, dh);
    currentDrawKeyRef.current = key;
  };

  const requestDraw = (img: HTMLImageElement, key: string) => {
    if (currentDrawKeyRef.current === key) return;
    if (!renderRequestedRef.current) {
      renderRequestedRef.current = true;
      requestAnimationFrame(() => {
        drawToCanvas(img, key);
        renderRequestedRef.current = false;
      });
    }
  };

  // Preload batching optimization
  const preloadRadius = 8;
  const preloadSurrounding = (chapter: SequenceChapter, selected: SelectedFrames, currentIndex: number) => {
    const max = selected.sources.length - 1;
    for (let offset = 1; offset <= preloadRadius; offset++) {
      if (currentIndex + offset <= max) loadFrame(chapter, selected, currentIndex + offset);
      if (currentIndex - offset >= 0) loadFrame(chapter, selected, currentIndex - offset);
    }
  };

  const { scrollYProgress } = useScroll();
  const lastRequestedKeyRef = useRef<string | null>(null);

  useMotionValueEvent(scrollYProgress, "change", async (progress) => {
    const chapter = getChapterAtProgress(progress);
    if (!chapter) return;

    const selected = selectFrames(chapter, viewportWidth);
    if (!selected.sources.length) return;

    const frameIndex = getFrameIndex(chapter, selected, progress);
    const key = `${chapter.id}:${selected.variant}:${frameIndex}`;

    // Crucial fix: track the absolute latest frame intended by user scroll
    // and ignore any async promises that resolve out of order.
    lastRequestedKeyRef.current = key;

    // Store scroll target for momentum loop
    targetProgressRef.current = progress;

    // Start momentum loop if not already running
    if (momentumRafRef.current === null) {
      const momentumLoop = () => {
        const target = targetProgressRef.current;
        const current = smoothProgressRef.current;
        const diff = target - current;

        // Lerp toward target — 0.16 factor creates the "keeps sliding" feel
        smoothProgressRef.current = current + diff * 0.16;

        const smoothed = smoothProgressRef.current;

        // -- STRICT SYNC: Opacity exactly matches the rendered momentum frame --
        const smoothstep = (value: number) => {
          const x = Math.min(1, Math.max(0, value));
          return x * x * (3 - 2 * x);
        };
        const heroFadeOut = smoothstep((smoothed - 0.005) / 0.045);

        let sequenceAlpha = 1;
        if (smoothed < 0.05) {
          sequenceAlpha = heroFadeOut;
        } else if (smoothed >= 0.40) {
          // Wide, smooth fade zone — completely hidden during dark experience
          if (smoothed < 0.46) {
            sequenceAlpha = 1 - smoothstep((smoothed - 0.40) / 0.06); // Fade out during Gate
          } else if (smoothed > 0.75 && smoothed < 0.94) {
            sequenceAlpha = smoothstep((smoothed - 0.75) / 0.05); // Canvas fully visible by 0.80 BEFORE Ch2 begins
          } else if (smoothed >= 0.94) {
            sequenceAlpha = 1 - smoothstep((smoothed - 0.94) / 0.04); // Smoothly fade out when image sequence finishes to reveal looping video
          } else {
            sequenceAlpha = 0; // Completely hidden during dark experience
          }
        }

        if (canvasRef.current) {
          canvasRef.current.style.opacity = sequenceAlpha.toFixed(4);
        }
        const ch = getChapterAtProgress(smoothed);
        if (!ch) { momentumRafRef.current = null; return; }
        const sel = selectFrames(ch, viewportWidth);
        if (!sel.sources.length) { momentumRafRef.current = null; return; }

        const fi = getFrameIndex(ch, sel, smoothed);
        const k = `${ch.id}:${sel.variant}:${fi}`;
        lastRequestedKeyRef.current = k;

        if (cacheRef.current.has(k)) {
          requestDraw(cacheRef.current.get(k)!, k);
        } else {
          loadFrame(ch, sel, fi).then((img) => {
            if (lastRequestedKeyRef.current === k) requestDraw(img, k);
          });
        }

        // Keep running until settled
        if (Math.abs(diff) > 0.00003) {
          momentumRafRef.current = requestAnimationFrame(momentumLoop);
        } else {
          smoothProgressRef.current = target;
          momentumRafRef.current = null;
        }
      };
      momentumRafRef.current = requestAnimationFrame(momentumLoop);
    }

    // Preload surrounding frames based on raw scroll progress with throttling
    const schedulePreload = () => {
      if (preloadTimerRef.current !== null) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(preloadTimerRef.current as number);
        } else {
          clearTimeout(preloadTimerRef.current as ReturnType<typeof setTimeout>);
        }
      }

      if (typeof window.requestIdleCallback === "function") {
        preloadTimerRef.current = window.requestIdleCallback(() => {
          preloadSurrounding(chapter, selected, frameIndex);
          preloadTimerRef.current = null;
        }, { timeout: 150 });
      } else {
        preloadTimerRef.current = setTimeout(() => {
          preloadSurrounding(chapter, selected, frameIndex);
          preloadTimerRef.current = null;
        }, 150);
      }
    };
    schedulePreload();
  });

  return (
    <div className="fixed inset-0 z-[2] pointer-events-none">
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-cover transition-opacity duration-75"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
