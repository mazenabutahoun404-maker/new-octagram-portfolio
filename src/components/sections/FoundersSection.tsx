import { useEffect, useRef, useState } from "react";

export default function FoundersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.6 } // Wait until deeply inside the section
    );
    if (sectionRef.current) ob.observe(sectionRef.current);
    return () => ob.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="founders" className="relative min-h-screen w-full z-10 bg-[#f0f9ff] flex flex-col items-center pt-28 pb-32 overflow-hidden px-4">
      {/* ── BACKGROUND: MASSIVE NEON REVEAL (TOP CENTER GLOW) WITH NOISE & GLITCH ── */}
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
          transform-origin: top center;
        }
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          mix-blend-mode: multiply;
          opacity: 0.15;
        }
      `}</style>

      <div className="absolute inset-x-0 top-0 h-[100vh] z-0 pointer-events-none overflow-hidden">
        <div className={`relative w-full h-full ${inView ? 'animate-neon' : 'opacity-0'}`}>
          {/* Core Bulb / Bulb line */}
          <div className="absolute top-0 inset-x-[15%] h-[4px] bg-white shadow-[0_0_140px_50px_rgba(14,165,233,1)] z-10 blur-[3px] rounded-full" />

          {/* Diffused Glow Cone */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: 'radial-gradient(ellipse at top center, rgba(14,165,233,0.85) 0%, rgba(56,189,248,0.4) 35%, transparent 75%)',
              filter: 'blur(50px)'
            }}
            aria-hidden="true"
          />

          {/* Static Film / Glitch Texture overlaid perfectly on the light cone */}
          <div
            className="absolute inset-0 z-20 bg-noise"
            style={{
              maskImage: 'radial-gradient(ellipse at top center, black 0%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at top center, black 0%, transparent 75%)'
            }}
          />
        </div>
      </div>

      {/* ═══ SECTION HEADER ═══ */}
      <div className="relative z-40 text-center max-w-[850px] mb-20 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sky-200 bg-sky-50 font-mono text-xs sm:text-xs font-bold text-sky-600 uppercase tracking-[0.24em] shadow-sm backdrop-blur-md mb-2">
          <span className="size-2 rounded-full bg-sky-500 animate-pulse" />
          GATE 01 · EXECUTIVE LEADERSHIP
        </div>
        <div className="flex justify-center items-baseline gap-2.5 flex-wrap">
          <span className="font-serif text-[clamp(1.5rem,2.8vw,2.8rem)] font-bold text-slate-900 leading-[1.08] tracking-tight whitespace-nowrap drop-shadow-md">
            Two founders.
          </span>
          <span className="font-serif text-[clamp(1.5rem,2.8vw,2.8rem)] italic font-normal text-sky-600 leading-[1.08] tracking-tight whitespace-nowrap drop-shadow-md">
            One singular direction.
          </span>
        </div>
      </div>

      {/* ═══ EXECUTIVE CO-FOUNDER CARDS ═══ */}
      <div className="relative z-40 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20 w-full max-w-[1000px] mx-auto pointer-events-auto">

        {/* ── MAZEN (LEFT CARD) ── */}
        <div className="w-[310px] sm:w-[360px] lg:w-[415px] shrink-0">
          {/* Outer Recessed Mounting Bay Socket */}
          <div className="relative p-2 rounded-[32px] bg-white/80 border border-sky-200 shadow-inner">
            {/* Socket Mounting Screws */}
            <div className="absolute top-2.5 left-3 size-2 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
            <div className="absolute top-2.5 right-3 size-2 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
            <div className="absolute bottom-2.5 left-3 size-2 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
            <div className="absolute bottom-2.5 right-3 size-2 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />

            {/* 3D Popped-Out Extruded Module Container */}
            <div className="group/card relative flex flex-col justify-between h-[445px] p-5 sm:p-6 rounded-3xl overflow-hidden border-2 border-slate-200 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.06),0_0_40px_rgba(249,115,22,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:border-orange-400 hover:-translate-y-2 hover:shadow-[0_35px_85px_rgba(0,0,0,0.12),0_0_65px_rgba(249,115,22,0.2)] transition-all duration-300">

              {/* Top Plug-In Hardware Connector Bar */}
              <div className="absolute top-0 inset-x-8 h-2.5 bg-gradient-to-b from-[#FF7E5F]/80 to-transparent rounded-b-md border-x border-b border-[#FF7E5F]/50 flex items-center justify-between px-3 pointer-events-none">
                <span className="size-1 rounded-full bg-[#FF7E5F] animate-ping" />
                <span className="font-mono text-xs text-[#FF7E5F] font-bold tracking-widest uppercase">MOD-01 // DOCKED</span>
                <span className="size-1 rounded-full bg-[#FF7E5F]" />
              </div>

              {/* Metallic Frame Corners */}
              <div className="absolute top-3 left-3 size-2.5 border-t-2 border-l-2 border-[#FF7E5F] pointer-events-none" />
              <div className="absolute top-3 right-3 size-2.5 border-t-2 border-r-2 border-[#FF7E5F] pointer-events-none" />
              <div className="absolute bottom-3 left-3 size-2.5 border-b-2 border-l-2 border-[#FF7E5F] pointer-events-none" />
              <div className="absolute bottom-3 right-3 size-2.5 border-b-2 border-r-2 border-[#FF7E5F] pointer-events-none" />

              <div className="pt-2">
                {/* Header Row: Avatar Initials + Founder Title + Dept */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#FF7E5F]/10 border border-[#FF7E5F]/40 font-mono font-black text-sm text-[#FF7E5F] shadow-[0_0_15px_rgba(255,126,95,0.15)] shrink-0 group-hover/card:scale-105 transition-transform duration-300">
                      MA
                    </span>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-[1.08] tracking-tight group-hover/card:text-[#FF7E5F] transition-colors">
                        Mazen Abutahoun
                      </h3>
                      <span className="font-mono text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                        PRODUCT &amp; STRATEGY
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full border border-[#FF7E5F]/30 bg-[#FF7E5F]/10 font-mono text-xs font-bold text-[#FF7E5F] uppercase tracking-wider shrink-0">
                    FOUNDER &amp; CTO
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-sans min-h-[40px]">
                  Directing technical architecture, design engineering standards, and AI innovation across enterprise software platforms.
                </p>

                {/* Specs / Highlights Grid */}
                <div className="mt-3 py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-between font-mono text-[8.5px] text-slate-600">
                  <div><span className="text-[#FF7E5F] font-bold">10+ YRS</span> EXP</div>
                  <div className="h-3 w-px bg-slate-200" />
                  <div><span className="text-slate-900 font-bold">40+</span> PRODUCTS</div>
                  <div className="h-3 w-px bg-slate-200" />
                  <div><span className="text-slate-600 font-bold">AI &amp; SOFTWARE</span></div>
                </div>

                {/* Embedded Portfolio Preview Box */}
                <div className="mt-3 p-2.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-between gap-3 group/port">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="size-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                      <img
                        src="/mazen-portfolio.png"
                        alt="Mazen Portfolio"
                        className="h-full w-full object-cover group-hover/port:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          OFFICIAL PORTFOLIO
                        </span>
                      </div>
                      <span className="font-serif text-xs font-bold text-slate-900 truncate block group-hover/port:text-[#FF7E5F] transition-colors">
                        Mazen Abutahoun Portfolio
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://mazenabutahoun404-maker.github.io/mazen-portofolio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FF7E5F] border border-transparent text-white font-mono text-xs font-bold shadow-[0_4px_12px_rgba(255,126,95,0.4)] hover:bg-slate-900 transition-all duration-300 group/btn shrink-0"
                  >
                    <span>Visit</span>
                    <span className="group-hover/btn:translate-x-0.5 transition-transform">↗</span>
                  </a>
                </div>
              </div>

              {/* Tag Pills Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex gap-1.5">
                  {["PRODUCT", "AI UX", "STRATEGY"].map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold shadow-inner">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-[#FF7E5F] font-bold uppercase tracking-wider text-xs">MODULAR HARDWARE</span>
              </div>

            </div>
          </div>
        </div>

        {/* ── TAREQ (RIGHT CARD) ── */}
        <div className="w-[310px] sm:w-[360px] lg:w-[415px] shrink-0">
          {/* Outer Recessed Mounting Bay Socket */}
          <div className="relative p-2 rounded-[32px] bg-white/80 border border-sky-200 shadow-inner">
            {/* Socket Mounting Screws */}
            <div className="absolute top-2.5 left-3 size-2 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
            <div className="absolute top-2.5 right-3 size-2 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
            <div className="absolute bottom-2.5 left-3 size-2 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />
            <div className="absolute bottom-2.5 right-3 size-2 rounded-full bg-slate-200 border border-slate-300 shadow-inner" />

            {/* 3D Popped-Out Extruded Module Container */}
            <div className="group/card relative flex flex-col justify-between h-[445px] p-5 sm:p-6 rounded-3xl overflow-hidden border-2 border-slate-200 bg-white shadow-[0_25px_60px_rgba(0,0,0,0.06),0_0_40px_rgba(14,165,233,0.1),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:border-sky-400 hover:-translate-y-2 transition-all duration-300">

              {/* Top Plug-In Hardware Connector Bar */}
              <div className="absolute top-0 inset-x-8 h-2.5 bg-gradient-to-b from-[#00BBF9]/80 to-transparent rounded-b-md border-x border-b border-[#00BBF9]/50 flex items-center justify-between px-3 pointer-events-none">
                <span className="size-1 rounded-full bg-[#00BBF9] animate-ping" />
                <span className="font-mono text-xs text-[#00BBF9] font-bold tracking-widest uppercase">MOD-02 // DOCKED</span>
                <span className="size-1 rounded-full bg-[#00BBF9]" />
              </div>

              {/* Metallic Frame Corners */}
              <div className="absolute top-3 left-3 size-2.5 border-t-2 border-l-2 border-[#00BBF9] pointer-events-none" />
              <div className="absolute top-3 right-3 size-2.5 border-t-2 border-r-2 border-[#00BBF9] pointer-events-none" />
              <div className="absolute bottom-3 left-3 size-2.5 border-b-2 border-l-2 border-[#00BBF9] pointer-events-none" />
              <div className="absolute bottom-3 right-3 size-2.5 border-b-2 border-r-2 border-[#00BBF9] pointer-events-none" />

              <div className="pt-2">
                {/* Header Row: Avatar Initials + Founder Title + Dept */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#00BBF9]/10 border border-[#00BBF9]/40 font-mono font-black text-sm text-[#00BBF9] shadow-[0_0_15px_rgba(0,187,249,0.15)] shrink-0 group-hover/card:scale-105 transition-transform duration-300">
                      TO
                    </span>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-[1.08] tracking-tight group-hover/card:text-[#00BBF9] transition-colors">
                        Tareq Orabi
                      </h3>
                      <span className="font-mono text-[8.5px] font-bold text-slate-500 uppercase tracking-widest block mt-0.5">
                        SYSTEMS &amp; OPERATIONS
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full border border-[#00BBF9]/30 bg-[#00BBF9]/10 font-mono text-xs font-bold text-[#00BBF9] uppercase tracking-wider shrink-0">
                    FOUNDER &amp; CEO
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 font-sans min-h-[40px]">
                  Leading cloud systems engineering, operational discipline, scalable architecture, and enterprise partnerships.
                </p>

                {/* Specs / Highlights Grid */}
                <div className="mt-3 py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-between font-mono text-[8.5px] text-slate-600">
                  <div><span className="text-[#00BBF9] font-bold">10+ YRS</span> ENG</div>
                  <div className="h-3 w-px bg-slate-200" />
                  <div><span className="text-slate-900 font-bold">99.9%</span> RELIABILITY</div>
                  <div className="h-3 w-px bg-slate-200" />
                  <div><span className="text-slate-600 font-bold">CLOUD INFRA</span></div>
                </div>

                {/* Embedded Portfolio Preview Box */}
                <div className="mt-3 p-2.5 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center justify-between gap-3 group/port">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="size-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                      <img
                        src="/tareq-portfolio.png"
                        alt="Tareq Portfolio"
                        className="h-full w-full object-cover group-hover/port:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          OFFICIAL PORTFOLIO
                        </span>
                      </div>
                      <span className="font-serif text-xs font-bold text-slate-900 truncate block group-hover/port:text-[#00BBF9] transition-colors">
                        Tareq Orabi Portfolio
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://tareqorabi.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#00BBF9] border border-transparent text-white font-mono text-xs font-bold shadow-[0_4px_12px_rgba(0,187,249,0.4)] hover:bg-slate-900 transition-all duration-300 group/btn shrink-0"
                  >
                    <span>Visit</span>
                    <span className="group-hover/btn:translate-x-0.5 transition-transform">↗</span>
                  </a>
                </div>
              </div>

              {/* Tag Pills Footer */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex gap-1.5">
                  {["SYSTEMS", "CLOUD", "OPS"].map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-bold shadow-inner">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="text-[#00BBF9] font-bold uppercase tracking-wider text-xs">MODULAR HARDWARE</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
