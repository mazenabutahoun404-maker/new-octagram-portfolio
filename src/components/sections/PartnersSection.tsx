import { useEffect, useRef, useState } from "react";
import { companyAssets } from "../../lib/companyAssets";
import JourneySection from "../ui/JourneySection";

const partners = [
  {
    id: "six-senses",
    name: "sixSenses Clinic",
    category: "Healthcare & Wellness",
    description:
      "Colon & Cleansing specialized care partner — delivering holistic patient experiences powered by integrated clinical technology.",
    accent: "#FF7E5F",
    accentGlow: "rgba(255, 126, 95, 0.15)",
    logo: companyAssets.sixSensesLogo,
    fallback: "6S",
  },
  {
    id: "medical-club",
    name: "Medical Club",
    category: "Healthcare Platform",
    description:
      "Healthcare community & platform ecosystem — connecting patients, practitioners, and wellness providers through intelligent data systems.",
    accent: "#00F5D4",
    accentGlow: "rgba(0, 245, 212, 0.15)",
    logo: companyAssets.medicalClubLogo,
    fallback: "MC",
  },
];

function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.2) {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return isInView;
}

function AnimatedCounter({ value, suffix = "", duration = 2000 }: { value: string; suffix?: string; duration?: number }) {
  const numericMatch = value.match(/^[\d.]+/);
  const prefix = value.replace(/[\d.]+.*/, "");
  const numericPart = numericMatch ? parseFloat(numericMatch[0]) : 0;
  const textSuffix = value.replace(/^[<> ]*[\d.]+/, "") + suffix;
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(numericPart * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, numericPart, duration]);

  const formatted = numericPart % 1 === 0
    ? Math.round(display).toLocaleString()
    : display.toFixed(numericPart.toString().split(".")[1]?.length || 2);

  return <span ref={ref}>{prefix}{formatted}{textSuffix}</span>;
}

export default function PartnersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef as React.RefObject<HTMLElement>, 0.15);

  return (
    <JourneySection id="partners" center={0.91} minHeight="min-h-[100vh]">
      {/* ── BACKGROUND: EXACT NEON REVEAL FROM FOUNDERS, BUT BOTTOM ── */}
      <style>{`
        @keyframes neonStartup {
          0% { opacity: 0; transform: scaleX(0.01) scaleY(0.4); filter: brightness(0.2); }
          15% { opacity: 1; transform: scaleX(0.05) scaleY(0.7); filter: brightness(3.0); }
          30% { opacity: 1; transform: scaleX(1) scaleY(0.9); filter: brightness(1.2); }
          55% { opacity: 0.6; transform: scaleX(0.8); filter: brightness(0.8); }
          100% { opacity: 1; transform: scaleX(1) scaleY(1); filter: brightness(1); }
        }

        .animate-neon {
          animation: neonStartup 3s cubic-bezier(0.2, 0, 0.4, 1) forwards;
          transform-origin: bottom center;
        }
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          mix-blend-mode: screen;
          opacity: 0.15;
        }
      `}</style>
      
      <div className="absolute inset-x-0 bottom-0 h-[100vh] z-0 pointer-events-none overflow-hidden">
        <div className={`relative w-full h-full ${isInView ? 'animate-neon' : 'opacity-0'}`}>
          {/* Core Bulb / Bulb line */}
          <div className="absolute bottom-0 inset-x-[15%] h-[4px] bg-white shadow-[0_0_140px_50px_rgba(14,165,233,1)] z-10 blur-[3px] rounded-full" />

          {/* Diffused Glow Cone */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: 'radial-gradient(ellipse at bottom center, rgba(14,165,233,0.85) 0%, rgba(56,189,248,0.4) 35%, transparent 75%)',
              filter: 'blur(50px)'
            }}
            aria-hidden="true"
          />

          {/* Static Film / Glitch Texture overlaid perfectly on the light cone */}
          <div
            className="absolute inset-0 z-20 bg-noise"
            style={{
              maskImage: 'radial-gradient(ellipse at bottom center, black 0%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at bottom center, black 0%, transparent 75%)'
            }}
          />
        </div>
      </div>

      <section ref={sectionRef} className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10 px-4 md:px-8">

        {/* ── Premium Header ── */}
        <header
          className="text-center mb-20 flex flex-col items-center transition-all duration-1000"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(40px)",
          }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 font-mono text-xs font-bold text-amber-300/90 uppercase tracking-[0.3em] mb-8 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.6)]" />
            Trusted Partners
          </div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight max-w-4xl">
            <span className="bg-gradient-to-r from-white via-amber-50 to-amber-200/80 bg-clip-text text-transparent">
              We are honored to build
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-200/80 via-white to-cyan-200/70 bg-clip-text text-transparent">
              alongside visionaries.
            </span>
          </h2>

          <p className="mt-6 text-sm md:text-base text-white/50 leading-relaxed font-light max-w-xl text-center">
            Our partners represent the finest in healthcare innovation — organizations that demand
            architectural perfection and enterprise-grade reliability.
          </p>

          {/* Decorative gold separator */}
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400/40" />
            <div className="size-1.5 rounded-full bg-amber-400/60 shadow-[0_0_8px_rgba(252,211,77,0.4)]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400/40" />
          </div>
        </header>

        {/* ── Luxury Partner Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className="group relative rounded-2xl overflow-hidden transition-all duration-700"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(60px)",
                transitionDelay: `${300 + index * 200}ms`,
              }}
            >
              {/* Glass card body */}
              <div className="relative flex flex-col p-8 md:p-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-white/[0.12] hover:bg-white/[0.04]">

                {/* Ambient hover glow */}
                <div
                  className="absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 30% 20%, ${partner.accentGlow}, transparent 70%)`,
                  }}
                />

                {/* Luxury corner accent line */}
                <div
                  className="absolute top-0 left-0 w-24 h-px transition-all duration-700 group-hover:w-40"
                  style={{ background: `linear-gradient(to right, ${partner.accent}, transparent)` }}
                />
                <div
                  className="absolute top-0 left-0 h-24 w-px transition-all duration-700 group-hover:h-40"
                  style={{ background: `linear-gradient(to bottom, ${partner.accent}, transparent)` }}
                />

                {/* Logo + Category Row */}
                <div className="flex items-start justify-between gap-4 mb-8 relative z-10">
                  <div className="size-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center p-2.5 group-hover:border-white/[0.12] group-hover:bg-white/[0.06] transition-all duration-500 group-hover:shadow-lg">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    ) : (
                      <span className="text-lg font-bold text-white/50 group-hover:text-white/80 transition-colors">
                        {partner.fallback}
                      </span>
                    )}
                  </div>
                  <span
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border transition-all duration-500 group-hover:shadow-[0_0_16px_rgba(255,255,255,0.05)]"
                    style={{
                      color: partner.accent,
                      borderColor: `${partner.accent}22`,
                      backgroundColor: `${partner.accent}08`,
                    }}
                  >
                    {partner.category}
                  </span>
                </div>

                {/* Partner Name */}
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-white/90 mb-4 group-hover:text-white transition-colors relative z-10">
                  {partner.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/40 font-light leading-relaxed group-hover:text-white/60 transition-colors relative z-10 mb-8">
                  {partner.description}
                </p>

                {/* Bottom accent bar */}
                <div className="mt-auto pt-6 border-t border-white/[0.04] flex items-center gap-3 relative z-10">
                  <div
                    className="h-0.5 w-8 rounded-full transition-all duration-700 group-hover:w-16 group-hover:shadow-[0_0_12px_currentColor]"
                    style={{ backgroundColor: partner.accent }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/25 font-mono group-hover:text-white/45 transition-colors">
                    Strategic Partner
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Trust Metrics Bar ── */}
        <div
          className="mt-20 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "800ms",
          }}
        >
          {[
            { value: "2", suffix: "+", label: "Enterprise Partners" },
            { value: "3", suffix: "+", label: "Years of Trust" },
            { value: "99.9", suffix: "%", label: "System Uptime" },
            { value: "24", suffix: "/7", label: "Support Coverage" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center group cursor-default">
              <span className="font-mono text-2xl md:text-3xl font-black bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent tracking-tight">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="mt-2 text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em] font-mono group-hover:text-white/50 transition-colors">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </section>
    </JourneySection>
  );
}
