import JourneySection from "../ui/JourneySection";

export default function ImpactSection() {
  const stats = [
    {
      value: "50M+",
      label: "API Requests Daily",
      sub: "Processed across global cloud nodes",
      color: "#00F5D4",
    },
    {
      value: "99.99%",
      label: "System Availability",
      sub: "Continuous high-throughput uptime",
      color: "#00BBF9",
    },
    {
      value: "< 50ms",
      label: "Global Edge Latency",
      sub: "Distributed edge execution speed",
      color: "#FFC857",
    },
    {
      value: "100%",
      label: "Zero-Trust Architecture",
      sub: "Enterprise end-to-end encryption",
      color: "#FF7E5F",
    },
  ];

  return (
    <JourneySection id="impact" center={0.84} minHeight="min-h-[100vh]">
      <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* ── LEFT COLUMN: Floating Metrics ── */}
        <div className="lg:col-span-6 flex flex-col gap-6 max-w-[560px]">
          <header>
            <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-blue-400/20 bg-blue-400/5 font-mono text-xs font-bold text-[#00BBF9] uppercase tracking-[0.25em]">
              <span className="size-1.5 rounded-full bg-[#00BBF9] shadow-[0_0_8px_#00BBF9]" />
              By the Numbers
            </div>
            <h2 className="mt-5 font-serif text-[clamp(2.3rem,4.2vw,4.5rem)] font-bold leading-[0.94] tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
              Telemetry built for scale.
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/60 leading-relaxed font-light max-w-md">
              Real-time benchmarks measuring execution velocity, zero-trust security, and operational availability.
            </p>
          </header>

          {/* ── Staggered floating metrics — no card boxes ── */}
          <div className="flex flex-col gap-1 pt-2">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="group flex items-baseline gap-5 py-5 transition-all duration-500"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  paddingLeft: `${i * 8}px`,
                }}
              >
                {/* Large metric value */}
                <span
                  className="font-mono text-[clamp(2rem,3vw,2.8rem)] font-black tracking-tight leading-none shrink-0 transition-all duration-500 group-hover:drop-shadow-[0_0_20px_currentColor]"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>

                {/* Label and sub */}
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="font-serif text-base font-bold text-white/80 group-hover:text-white transition-colors truncate">
                    {s.label}
                  </span>
                  <span className="text-xs text-white/40 font-light group-hover:text-white/55 transition-colors">
                    {s.sub}
                  </span>
                </div>

                {/* Accent line that grows on hover */}
                <div
                  className="hidden sm:block ml-auto h-px w-0 group-hover:w-12 transition-all duration-700 shrink-0"
                  style={{ backgroundColor: s.color, boxShadow: `0 0 8px ${s.color}` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-6 pointer-events-none" />
      </div>
    </JourneySection>
  );
}
