import React, { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { sequences, selectFrames, landmarkProgress, type SequenceChapter, type SelectedFrames } from "../../lib/oceanSequences";

export default function SmoothImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Storage for loaded Image objects
  const cacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const pendingRef = useRef<Map<string, Promise<HTMLImageElement>>>(new Map());
  
  const renderRequestedRef = useRef(false);
  const currentDrawKeyRef = useRef<string | null>(null);
  const rectRef = useRef<{w: number, h: number, iw: number, ih: number, x: number, y: number, dw: number, dh: number} | null>(null);

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

  const loadFrame = async (chapter: SequenceChapter, selected: SelectedFrames, index: number): Promise<HTMLImageElement> => {
    const key = `${chapter.id}:${selected.variant}:${index}`;
    if (cacheRef.current.has(key)) return cacheRef.current.get(key)!;
    if (pendingRef.current.has(key)) return pendingRef.current.get(key)!;
    
    const promise = new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        cacheRef.current.set(key, img);
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

    // Calculate canvas sequence alpha dynamically for crossfades
    const surfaceApproachProgress = landmarkProgress("chapter2SecondHalf");
    
    // Smoothstep port
    const smoothstep = (value: number) => {
      const x = Math.min(1, Math.max(0, value));
      return x * x * (3 - 2 * x);
    };

    const heroFadeOut = smoothstep((progress - 0.005) / 0.045);
    
    let sequenceAlpha = 1;
    if (progress < 0.05) {
      sequenceAlpha = heroFadeOut;
    } else if (progress >= 0.44 && progress <= 0.89) {
      // Synchronous DOM-level fade to completely prevent 16ms canvas lag buffering glitches 
      // when rapidly jumping backwards from Chapter 2 into the abyss section.
      if (progress < 0.52) {
        sequenceAlpha = 1 - smoothstep((progress - 0.44) / 0.08); // fade out
      } else if (progress > 0.87) {
        sequenceAlpha = smoothstep((progress - 0.87) / 0.02); // fade back in
      } else {
        sequenceAlpha = 0;
      }
    }

    if (canvasRef.current) {
      canvasRef.current.style.opacity = sequenceAlpha.toFixed(4);
    }

    const schedulePreload = () => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => preloadSurrounding(chapter, selected, frameIndex), { timeout: 100 });
      } else {
        setTimeout(() => preloadSurrounding(chapter, selected, frameIndex), 50);
      }
    };

    if (cacheRef.current.has(key)) {
      requestDraw(cacheRef.current.get(key)!, key);
      schedulePreload();
    } else {
      const img = await loadFrame(chapter, selected, frameIndex);
      // ONLY draw if the user hasn't scrolled past this frame while it was loading!
      if (lastRequestedKeyRef.current === key) {
        requestDraw(img, key);
      }
      schedulePreload();
    }
  });

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full object-cover transition-opacity duration-75"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
