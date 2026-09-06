import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "framer-motion";
import octagramLogo from "../../assets/OctagramLogo.png";
import type { JumpToSection } from "../../types/journey";

type RefImageNavBarProps = {
  jumpTo: JumpToSection;
};

type DockItemData = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
};

type DockItemProps = {
  children: React.ReactNode;
  onClick: () => void;
  mouseX: MotionValue<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  label: string;
  isActive?: boolean;
  isLightSection?: boolean;
};

function useBubbleStretch() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scaleX = useMotionValue(1);
  const scaleY = useMotionValue(1);

  const springConfig = { mass: 0.1, stiffness: 220, damping: 13 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);
  const sScaleX = useSpring(scaleX, springConfig);
  const sScaleY = useSpring(scaleY, springConfig);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);

    x.set(relX * 0.28);
    y.set(relY * 0.28);

    const dist = Math.hypot(relX, relY);
    const maxDist = Math.max(rect.width, rect.height) / 2 || 1;
    const stretch = Math.min(dist / maxDist, 1) * 0.28;

    const angle = Math.atan2(relY, relX);
    const cos2 = Math.cos(angle) ** 2;
    const sin2 = Math.sin(angle) ** 2;

    scaleX.set(1 + cos2 * stretch - sin2 * stretch * 0.45);
    scaleY.set(1 + sin2 * stretch - cos2 * stretch * 0.45);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
    scaleX.set(1);
    scaleY.set(1);
  };

  return {
    style: {
      x: sx,
      y: sy,
      scaleX: sScaleX,
      scaleY: sScaleY,
    },
    onMouseMove,
    onMouseLeave,
  };
}

function DockItem({
  children,
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  isActive = false,
  isLightSection = false,
}: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const bubble = useBubbleStretch();

  const mouseDistance = useTransform(mouseX, (value) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return distance;
    return value - (rect.left + rect.width / 2);
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <div className="relative flex shrink-0 items-center justify-center">
      <AnimatePresence>
        {tooltipVisible ? (
          <motion.span
            initial={{ opacity: 0, y: -3, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -2, scale: 0.96 }}
            transition={{ duration: 0.14 }}
            className="pointer-events-none absolute top-[calc(100%+11px)] left-1/2 z-[90] hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-white/20 bg-[#020b18]/88 px-3 py-1.5 font-mono text-xs font-bold tracking-[.12em] text-white uppercase shadow-[0_10px_28px_rgba(0,0,0,.34)] backdrop-blur-xl md:block"
            role="tooltip"
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>

      <motion.button
        ref={ref}
        type="button"
        style={{
          width: size,
          height: size,
          x: bubble.style.x,
          y: bubble.style.y,
          scaleX: bubble.style.scaleX,
          scaleY: bubble.style.scaleY,
        }}
        onMouseMove={bubble.onMouseMove}
        onMouseLeave={() => {
          bubble.onMouseLeave();
          setTooltipVisible(false);
        }}
        onHoverStart={() => setTooltipVisible(true)}
        onHoverEnd={() => setTooltipVisible(false)}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
        onClick={onClick}
        className={`relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border backdrop-blur-2xl transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isLightSection
            ? "focus-visible:outline-white text-white " + (isActive
              ? "border-slate-600 bg-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              : "border-slate-800 bg-slate-900/70 hover:border-slate-500 hover:bg-slate-700")
            : "focus-visible:outline-white text-white " + (isActive
              ? "border-white/75 bg-white/25 shadow-[inset_0_1.5px_2px_rgba(255,255,255,.8),inset_0_-1px_2px_rgba(0,0,0,.3),0_0_20px_rgba(255,255,255,.35)]"
              : "border-white/25 bg-[radial-gradient(circle_at_32%_20%,rgba(255,255,255,.22),rgba(255,255,255,.06))] text-white/85 shadow-[inset_0_1px_1px_rgba(255,255,255,.35),inset_0_-1px_1px_rgba(0,0,0,.25),0_8px_18px_rgba(0,8,15,.2)] hover:border-white/60 hover:bg-white/[.2] hover:text-white")
        }`}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
      >
        {!isLightSection && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.4),transparent_60%)] opacity-70"
          />
        )}
        {children}
      </motion.button>
    </div>
  );
}

export default function RefImageNavBar({ jumpTo }: RefImageNavBarProps) {
  const [activeTab, setActiveTab] = useState("hero");
  const [isGateZooming, setIsGateZooming] = useState(false);
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleZoomEvent = (e: any) => setIsGateZooming(e.detail);
    window.addEventListener('gate-zoom-state', handleZoomEvent);
    return () => window.removeEventListener('gate-zoom-state', handleZoomEvent);
  }, []);

  const logoBubble = useBubbleStretch();
  const contactBubble = useBubbleStretch();

  const spring: SpringOptions = useMemo(
    () => ({ mass: 0.12, stiffness: 190, damping: 15 }),
    []
  );
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const distance = isMobile ? 120 : 150;
  const baseItemSize = isMobile ? 36 : 40;
  const magnification = prefersReducedMotion ? baseItemSize : (isMobile ? 48 : 58);

  const isLightSection = ["about", "solutions", "founders", "gate"].includes(activeTab) && !(activeTab === "gate" && isGateZooming);

  const handleNavClick = useCallback(
    (id: string) => {
      setActiveTab(id);
      jumpTo(id);
    },
    [jumpTo]
  );

  const allNavItems: DockItemData[] = useMemo(
    () => [
      {
        id: "about",
        label: "About",
        onClick: () => handleNavClick("about"),
        icon: (
          <svg className="size-4 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" d="M12 11v5m0-8h.01" />
          </svg>
        ),
      },
      {
        id: "solutions",
        label: "Services",
        onClick: () => handleNavClick("solutions"),
        icon: (
          <svg className="size-4 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4 8 8-4 8 4-8 4-8-4Zm0 4 8 4 8-4M4 16l8 4 8-4" />
          </svg>
        ),
      },
      {
        id: "founders",
        label: "Founders",
        onClick: () => handleNavClick("founders"),
        icon: (
          <svg className="size-4 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3" />
            <path strokeLinecap="round" d="M6.5 20v-2.5A5.5 5.5 0 0 1 12 12a5.5 5.5 0 0 1 5.5 5.5V20" />
          </svg>
        ),
      },
      {
        id: "projects",
        label: "Projects",
        onClick: () => handleNavClick("projects"),
        icon: (
          <svg className="size-4 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinejoin="round" d="M3.5 7h6l1.8 2h9.2v9.2a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8V7Z" />
          </svg>
        ),
      },
      {
        id: "impact",
        label: "How It Works",
        onClick: () => handleNavClick("impact"),
        icon: (
          <svg className="size-4 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 18H7.5m6-6h6.75m-6.75 0a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 12h6.75" />
          </svg>
        ),
      },
      {
        id: "partners",
        label: "Partners",
        onClick: () => handleNavClick("partners"),
        icon: (
          <svg className="size-4 fill-none stroke-current stroke-[1.8]" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" d="M9 4.5H6.8a2.3 2.3 0 0 0-2.3 2.3V9m10.5 10.5h2.2a2.3 2.3 0 0 0 2.3-2.3V15m0-6V6.8a2.3 2.3 0 0 0-2.3-2.3H15M4.5 15v2.2a2.3 2.3 0 0 0 2.3 2.3H9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12 2.2 2.2 4.8-4.8" />
          </svg>
        ),
      },
    ],
    [handleNavClick]
  );

  const navItems = isMobile ? allNavItems.slice(0, 5) : allNavItems;

  useEffect(() => {
    const allIds = [
      "hero",
      "about",
      "solutions",
      "founders",
      "gate",
      "projects",
      "vision",
      "impact",
      "partners",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the visible entry with the highest intersection ratio
        let bestMatch = null;
        let highestRatio = 0;
        
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
            highestRatio = entry.intersectionRatio;
            bestMatch = entry.target.id;
          }
        });
        
        if (bestMatch) {
          setActiveTab(bestMatch);
        }
      },
      { 
        root: null, 
        rootMargin: "-10% 0px -40% 0px",
        threshold: [0, 0.1, 0.2, 0.5] 
      }
    );

    allIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[92px]">
      {/* Home / Octagram logo */}
      <motion.button
        type="button"
        onClick={() => handleNavClick("hero")}
        style={{
          x: logoBubble.style.x,
          y: logoBubble.style.y,
          scaleX: logoBubble.style.scaleX,
          scaleY: logoBubble.style.scaleY,
        }}
        onMouseMove={logoBubble.onMouseMove}
        onMouseLeave={logoBubble.onMouseLeave}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        aria-label="Return to the Octagram homepage"
        aria-current={activeTab === "hero" ? "page" : undefined}
        className={`group pointer-events-auto absolute top-4 left-3 z-[71] hidden sm:grid size-[46px] sm:size-[58px] place-items-center rounded-full border backdrop-blur-[28px] shadow-sm sm:left-5 lg:left-8 ${
          isLightSection
            ? activeTab === "hero"
              ? "border-slate-600 bg-slate-800 shadow-md"
              : "border-slate-800 bg-slate-900/80 hover:border-slate-500"
            : `bg-[radial-gradient(circle_at_32%_20%,rgba(255,255,255,.32),rgba(255,255,255,.08))] backdrop-saturate-[1.55] shadow-[inset_0_1.5px_2px_rgba(255,255,255,.65),inset_0_-1px_2px_rgba(0,0,0,.35),0_14px_36px_rgba(0,8,15,.32)] ${
                activeTab === "hero"
                  ? "border-white/70 shadow-[inset_0_1.5px_2px_rgba(255,255,255,.8),0_0_22px_rgba(255,255,255,.3)]"
                  : "border-white/35 hover:border-white/60"
              }`
        }`}
      >
        {!isLightSection && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.45),transparent_60%)] opacity-80"
          />
        )}
        <img
          src={octagramLogo}
          alt=""
          className="size-8 sm:size-10 object-contain drop-shadow-[0_4px_10px_rgba(0,8,13,.35)] transition-all duration-300"
        />
        <span className="pointer-events-none absolute top-[calc(100%+9px)] left-0 hidden whitespace-nowrap rounded-full border border-white/20 bg-[#020b18]/88 px-3 py-1.5 font-mono text-xs font-bold tracking-[.12em] text-white uppercase opacity-0 shadow-xl backdrop-blur-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
          Home
        </span>
      </motion.button>

      {/* Section dock — DESKTOP: top centered pill · MOBILE: full-width bottom sheet */}
      
        <motion.nav
          initial={{ opacity: 0, y: isMobile ? 20 : -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isMobile ? 20 : -20, scale: 0.95 }}
          aria-label="Primary navigation"
          className={`pointer-events-auto z-[80] ${
            isMobile
              ? "fixed bottom-6 left-1/2 -translate-x-1/2 flex h-[58px] w-max max-w-[calc(100vw-32px)] items-center rounded-full border px-1.5 backdrop-blur-[28px] transition-colors duration-300"
              : "absolute top-4 left-1/2 -translate-x-1/2 flex h-[58px] w-max max-w-[calc(100vw-190px)] items-center rounded-full border px-2 backdrop-blur-[28px] transition-colors duration-300"
          } ${
            isLightSection
              ? "border-slate-700 bg-[rgba(10,13,20,0.85)] shadow-xl"
              : "border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,.17),rgba(255,255,255,.085))] backdrop-saturate-[1.55] shadow-[inset_0_1.5px_2px_rgba(255,255,255,.55),inset_0_-1px_2px_rgba(0,0,0,.25),0_16px_40px_rgba(0,8,15,.28)]"
          }`}
          onMouseMove={(event: React.MouseEvent<HTMLElement>) =>
            mouseX.set(event.clientX)
          }
          onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
        >
          <div className={`flex items-center gap-1 py-1.5 sm:gap-1.5 sm:py-2 ${
            isMobile ? "w-full justify-around" : "w-auto overflow-visible"
          } [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}>
            {navItems.map((item) => (
              <DockItem
                key={item.id}
                onClick={item.onClick}
                mouseX={mouseX}
                spring={spring}
                distance={distance}
                magnification={magnification}
                baseItemSize={baseItemSize}
                label={item.label}
                isActive={activeTab === item.id}
                isLightSection={isLightSection}
              >
                {item.icon}
              </DockItem>
            ))}
            {/* Removed expand/collapse button for 5-tap mobile behavior */}
          </div>
        </motion.nav>

      {/* Top-Right Quick Contact Action Button */}
      <motion.button
        type="button"
        onClick={() => handleNavClick("contact")}
        style={{
          x: contactBubble.style.x,
          y: contactBubble.style.y,
          scaleX: contactBubble.style.scaleX,
          scaleY: contactBubble.style.scaleY,
        }}
        onMouseMove={contactBubble.onMouseMove}
        onMouseLeave={contactBubble.onMouseLeave}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
        aria-label="Get in touch with Octagram"
        className={`group pointer-events-auto absolute top-4 right-3 z-[71] hidden sm:grid size-[46px] sm:size-[58px] place-items-center rounded-full border backdrop-blur-[28px] shadow-sm sm:right-5 lg:right-8 transition-colors duration-300 ${
          isLightSection
            ? "border-slate-800 bg-slate-900/80 hover:border-slate-500 text-white"
            : "border-cyan-400/40 bg-[radial-gradient(circle_at_32%_20%,rgba(0,245,212,.32),rgba(255,255,255,.08))] text-cyan-300 backdrop-saturate-[1.55] shadow-[inset_0_1.5px_2px_rgba(255,255,255,.65),inset_0_-1px_2px_rgba(0,0,0,.35),0_14px_36px_rgba(0,245,212,.2)] hover:border-cyan-300"
        }`}
      >
        {!isLightSection && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_25%,rgba(0,245,212,0.35),transparent_60%)] opacity-80"
          />
        )}
        <svg className="size-5 stroke-current stroke-[1.8] relative z-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7 7 6 7-6" />
        </svg>
        <span className="pointer-events-none absolute top-[calc(100%+9px)] right-0 hidden whitespace-nowrap rounded-full border border-cyan-400/30 bg-[#020b18]/90 px-3 py-1.5 font-mono text-xs font-bold tracking-[.12em] text-cyan-300 uppercase opacity-0 shadow-xl backdrop-blur-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
          Contact Us
        </span>
      </motion.button>
    </header>
  );
}