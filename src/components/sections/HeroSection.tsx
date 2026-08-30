import { useEffect, useState } from "react";
import type { JumpToSection } from "../../types/journey";

type HeroSectionProps = {
  jumpTo: JumpToSection;
};

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[17px] fill-none stroke-current stroke-[1.6]" aria-hidden="true">
      <path d="M12 2.8 19 6v5.2c0 4.5-2.8 8.1-7 10-4.2-1.9-7-5.5-7-10V6l7-3.2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m8.8 12 2 2 4.6-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] fill-cyan-950/10 stroke-current stroke-[1.6]" aria-hidden="true">
      <path d="M12 2.5c2.4 3.5 6.3 7.3 6.3 12a6.3 6.3 0 1 1-12.6 0c0-4.7 3.9-8.5 6.3-12Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.2 15.2c.5 1.4 1.5 2.2 3.1 2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function HeroSection({ jumpTo }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const contentOpacity = Math.max(0, 1 - scrollY / 260);
  const contentTranslateY = -Math.min(120, scrollY * 0.4);
  // Smoke starts after image sequences reach the logo-diving midpoint (~1400px into scroll)
  // and fully covers the screen by the end of the sticky section (~2600px)
  const smokeOpacity = Math.min(1, Math.max(0, (scrollY - 1400) / 1200));

  return (
    <section
      id="hero"
      data-hero-section
      aria-labelledby="hero-title"
      className="relative z-10 isolate h-screen w-full overflow-hidden"
    >

      <div
        style={{ opacity: contentOpacity, transform: `translateY(${contentTranslateY}px)` }}
        className="pointer-events-none absolute top-[96px] left-[4vw] z-[3] hidden items-center gap-3 font-mono text-xs font-semibold tracking-[.21em] text-white/70 uppercase [text-shadow:0_2px_8px_rgba(0,0,0,.45)] lg:flex"
        aria-hidden="true"
      >
        <span>OCTAGRAM / SURFACE</span>
        <i className="size-[3px] rounded-full bg-emerald-100 shadow-[0_0_10px_rgba(185,244,228,.8)]" />
        <span>31.9539° N</span>
      </div>

      <div
        style={{ opacity: contentOpacity, transform: `translateY(${contentTranslateY}px)` }}
        className="pointer-events-none absolute top-[96px] right-[4vw] z-[3] hidden items-center gap-3 font-mono text-xs font-semibold tracking-[.21em] text-white/70 uppercase [text-shadow:0_2px_8px_rgba(0,0,0,.45)] lg:flex"
        aria-hidden="true"
      >
        <span>SOFTWARE &amp; AI SYSTEMS</span>
        <i className="size-[3px] rounded-full bg-emerald-100 shadow-[0_0_10px_rgba(185,244,228,.8)]" />
        <span>0000 M</span>
      </div>

      {/* One horizontal composition: copy left, three separated cards right. */}
      <div
        data-water-body
        data-center="0.055"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${contentTranslateY}px)`,
          pointerEvents: contentOpacity > 0.05 ? "auto" : "none",
        }}
        className="absolute inset-x-5 bottom-[clamp(28px,6vh,58px)] z-[5] mx-auto grid max-w-[1340px] grid-cols-1 items-end gap-10 transition-opacity duration-100 sm:inset-x-8 lg:inset-x-[4vw] lg:grid-cols-[minmax(300px,.72fr)_minmax(0,1.45fr)] lg:gap-[clamp(30px,4vw,68px)]"
      >
        <div className="relative min-w-0 lg:pb-1">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-100/40 bg-cyan-950/30 px-3.5 py-2 font-mono text-xs font-bold tracking-[.18em] text-emerald-200 uppercase backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,.3),0_10px_28px_rgba(0,8,14,.25)]">
            <span className="h-px w-5 bg-gradient-to-r from-teal-200 to-emerald-100" />
            ENTERPRISE TECHNOLOGY &amp; PRODUCT STUDIO
          </p>

          <h1 id="hero-title" className="mt-4 max-w-[540px] text-[clamp(2.6rem,12vw,4.7rem)] leading-[.85] font-semibold tracking-[-.075em] text-white [text-shadow:0_5px_30px_rgba(0,4,10,.7)] sm:text-[clamp(3.8rem,9vw,5.1rem)] lg:text-[clamp(3.15rem,4.25vw,4.65rem)]">
            Architecting
            <br />
            digital <em className="font-serif font-normal text-transparent [-webkit-text-stroke:1px_rgba(226,255,249,.98)] sm:[-webkit-text-stroke:1.2px_rgba(226,255,249,.98)]">futures.</em>
          </h1>

          <p className="mt-4 max-w-[460px] text-sm leading-5 font-medium text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-base sm:leading-7">
            Octagram engineers enterprise platforms, intelligent cloud architectures, and scalable technology ecosystems for market-leading organizations.
          </p>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => jumpTo("about")}
              className="inline-flex min-h-[40px] sm:min-h-11 items-center justify-between gap-4 sm:gap-5 rounded-full border border-emerald-100/60 bg-[linear-gradient(115deg,rgba(119,225,209,.30),rgba(45,212,191,.22))] px-4 sm:px-5 font-mono text-xs sm:text-xs font-bold tracking-[.16em] text-white uppercase backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_12px_30px_rgba(0,10,17,.3)] transition duration-300 hover:-translate-y-1 hover:border-emerald-100/90 hover:bg-emerald-200/30"
            >
              Explore Solutions
              <span className="grid size-5 sm:size-6 place-items-center rounded-full border border-white/35 text-xs sm:text-xs" aria-hidden="true">↘</span>
            </button>
            <button
              type="button"
              onClick={() => jumpTo("contact")}
              className="inline-flex min-h-[40px] sm:min-h-11 items-center justify-between gap-4 sm:gap-5 rounded-full border border-white/35 bg-white/10 px-4 sm:px-5 font-mono text-xs sm:text-xs font-bold tracking-[.16em] text-white uppercase backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-emerald-100/70 hover:bg-white/20"
            >
              Contact Executive Team
              <span className="grid size-5 sm:size-6 place-items-center rounded-full border border-white/35 text-xs sm:text-xs" aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex w-[calc(100%+20px)] snap-x snap-mandatory items-end gap-5 overflow-x-auto pr-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:w-full lg:grid-cols-[1fr_.72fr_1.08fr] lg:gap-[clamp(14px,1.5vw,24px)] lg:overflow-visible lg:pr-0 lg:pb-0">
          {/* Empty left column placeholder to keep 2 cards positioned on the right */}
          <div className="hidden lg:block" aria-hidden="true" />

          {/* Card 1: Pure Colorless Liquid Glass (Enterprise Platform) */}
          <article
            data-network-reactor
            className="group relative flex min-h-[195px] min-w-[195px] snap-start flex-col justify-between overflow-hidden rounded-2xl border border-white/35 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.32),rgba(255,255,255,0)_45%),linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.05))] p-5 text-white backdrop-blur-[52px] backdrop-saturate-[1.8] shadow-[0_20px_50px_rgba(0,0,0,.45)] transition duration-500 hover:-translate-y-2 lg:min-w-0"
          >
            {/* Subtle Specular Sheen Layer */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_60%_80%,rgba(255,255,255,0.15),transparent_50%)]" />

            {/* Specular Highlight Border Overlay */}
            <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
              <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" vectorEffect="non-scaling-stroke" fill="none" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.75" />
            </svg>

            <div className="relative z-[2] flex items-center justify-between gap-2">
              <span className="grid size-8 place-items-center rounded-full border border-white/30 bg-white/20 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,.6)]"><DropIcon /></span>
              <span className="flex items-center gap-1 rounded-full border border-white/30 bg-white/20 px-2.5 py-0.5 font-mono text-xs font-bold tracking-[.14em] text-white backdrop-blur-md shadow-sm"><i className="size-[5px] animate-pulse rounded-full bg-white" /> ACTIVE CORE</span>
            </div>
            <div className="relative z-[2] pt-2">
              <p className="mb-1 font-mono text-xs font-bold tracking-[.15em] text-white/90 uppercase">ENTERPRISE PLATFORM</p>
              <h2 className="font-serif text-[1.3rem] leading-none font-semibold text-white drop-shadow-sm">Scalable Systems</h2>
              <p className="mt-2 text-xs leading-[1.4] font-medium text-white drop-shadow-sm">Cloud-native architecture &amp; high-performance infrastructure.</p>
            </div>
          </article>

          {/* Card 2: Soft Turquoise Liquid Glass (Global Scale) */}
          <article
            data-network-reactor
            className="group relative flex min-h-[195px] min-w-[240px] snap-start flex-col justify-between overflow-hidden rounded-2xl border border-teal-300/40 bg-[radial-gradient(circle_at_75%_25%,rgba(94,234,212,.28),transparent_55%),linear-gradient(145deg,rgba(15,45,48,.75),rgba(6,25,28,.88))] p-5 backdrop-blur-[52px] backdrop-saturate-[1.8] shadow-[0_20px_50px_rgba(0,18,22,.55)] transition duration-500 hover:-translate-y-2 lg:min-w-0"
          >
            {/* Soft Turquoise Ambient Orb */}
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-8 -right-8 size-40 bg-[radial-gradient(circle,rgba(45,212,191,0.30)_0%,transparent_70%)] blur-lg" />

            {/* Specular Highlight Border Overlay */}
            <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
              <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" vectorEffect="non-scaling-stroke" fill="none" stroke="rgba(153, 246, 228, 0.75)" strokeWidth="1.75" />
            </svg>

            <div className="relative z-[2] flex justify-end -space-x-1.5" aria-hidden="true">
              {['AI', 'CLOUD', '+12'].map((label, index) => (
                <span key={label} className={`grid size-[22px] place-items-center rounded-full border border-teal-200/35 font-mono text-xs font-bold text-white backdrop-blur-md ${index === 1 ? 'bg-teal-400/30' : index === 2 ? 'bg-white/20' : 'bg-teal-300/25'}`}>{label}</span>
              ))}
            </div>
            <div className="relative z-[2] flex items-center gap-2">
              <strong className="font-mono text-[2.75rem] leading-[.8] font-semibold tracking-[-.08em] text-teal-100 drop-shadow-sm">99.9%</strong>
              <i className="size-[7px] rounded-full bg-teal-300 shadow-[0_0_12px_rgba(45,212,191,.9)]" />
            </div>
            <div className="relative z-[2]">
              <p className="mb-1 font-mono text-xs font-bold tracking-[.15em] text-teal-200 uppercase">GLOBAL SCALE</p>
              <h2 className="font-serif text-[1.3rem] leading-none font-semibold text-white drop-shadow-sm">Enterprise Impact</h2>
              <p className="mt-2 text-xs leading-[1.4] font-medium text-teal-50 drop-shadow-sm">Powering mission-critical products &amp; digital transformation.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}