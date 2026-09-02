import JourneySection from "../ui/JourneySection";

export const visionValues = [
  {
    title: "Precision Architecture",
    tagline: "Ultra-low latency, clean schema design, zero bloat.",
    description:
      "Digital transformation centers on speed, security, and human intuition rather than unnecessary complexity.",
    color: "#00F5D4",
  },
  {
    title: "Zero-Trust Reliability",
    tagline: "Encryption at rest, in transit, and during execution.",
    description:
      "Every API call, database record, and autonomous workflow is structurally bulletproof and enterprise trusted.",
    color: "#00BBF9",
  },
  {
    title: "Intelligent Scale",
    tagline: "Elastic compute scaling across edge data nodes.",
    description:
      "Architectures designed to maximize throughput, eliminate technical debt, and set new benchmarks for intelligent systems.",
    color: "#FF7E5F",
  },
];

export default function VisionSection() {
  return (
    <JourneySection id="vision" center={0.76} minHeight="min-h-[100vh]">
      <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* ── RIGHT COLUMN: Editorial Ambient Typography ── */}
        <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-8 max-w-[560px]">
          <header>
            <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 font-mono text-xs font-bold text-[#00F5D4] uppercase tracking-[0.25em]">
              <span className="size-1.5 rounded-full bg-[#00F5D4] shadow-[0_0_8px_#00F5D4]" />
              Our Code
            </div>
            <h2 className="mt-5 font-serif text-[clamp(2.3rem,4.2vw,4.5rem)] font-bold leading-[0.94] tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
              Engineering with absolute clarity.
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/60 leading-relaxed font-light max-w-md">
              Our architectural framework eliminates technical entropy, creating digital systems engineered for high velocity and resilience.
            </p>
          </header>

          {/* ── Principles — Ambient flowing list, no card boxes ── */}
          <div className="flex flex-col gap-0">
            {visionValues.map((val, i) => (
              <div
                key={val.title}
                className="group py-6 transition-all duration-500"
                style={{
                  borderTop: i === 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Title row with accent dot */}
                <div className="flex items-center gap-3">
                  <span
                    className="size-2 rounded-full shrink-0 transition-all duration-500 group-hover:scale-150 group-hover:shadow-[0_0_12px_currentColor]"
                    style={{ backgroundColor: val.color, color: val.color }}
                  />
                  <h3
                    className="font-serif text-lg md:text-xl font-bold text-white/90 group-hover:text-white transition-colors tracking-wide"
                  >
                    {val.title}
                  </h3>
                </div>

                {/* Tagline */}
                <p className="mt-2 pl-5 font-mono text-sm text-white/40 italic group-hover:text-white/55 transition-colors">
                  {val.tagline}
                </p>

                {/* Description — reveals on hover via height transition */}
                <p className="mt-2 pl-5 text-sm text-white/50 leading-relaxed font-light group-hover:text-white/70 transition-colors">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Connected Globe Animation (Handled globally in App.tsx) ── */}
        <div className="hidden lg:flex lg:col-span-6 h-full min-h-[500px] xl:min-h-[700px] w-full items-center justify-center pointer-events-none" />
      </div>
    </JourneySection>
  );
}
