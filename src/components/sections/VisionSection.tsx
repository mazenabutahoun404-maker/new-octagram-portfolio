import JourneySection from "../ui/JourneySection";

const visionValues = [
  {
    title: "Clarity by design",
    tagline: "Simple workflows. Deliberate architecture.",
    description:
      "Start with the people using the product. Keep interfaces focused and the underlying system completely understandable.",
    color: "#00F5D4",
    accentGlow: "rgba(0, 245, 212, 0.2)",
  },
  {
    title: "Reliability as a discipline",
    tagline: "Access control. Testing. Observability.",
    description:
      "Treat security and resilience as continuous engineering work, with explicit controls and systems that can be inspected and maintained.",
    color: "#00BBF9",
    accentGlow: "rgba(0, 187, 249, 0.2)",
  },
  {
    title: "Room to evolve",
    tagline: "Modular foundations. Measured growth.",
    description:
      "Build for today's immediate needs while keeping a clear path to scale. Let real usage guide performance and architectural decisions.",
    color: "#FF7E5F",
    accentGlow: "rgba(255, 126, 95, 0.2)",
  },
];

export default function VisionSection() {
  return (
    <JourneySection id="vision" center={0.76} minHeight="min-h-[100vh]">
      <section
        id="vision"
        className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 px-4 md:px-8 py-20 text-white"
      >
        {/* ── LEFT COLUMN: Vision Content (Liquid Glassmorphism) ── */}
        <div className="lg:col-span-7 lg:col-start-1 flex flex-col gap-10">
          <header className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-xs font-bold text-cyan-300 uppercase tracking-[0.25em] w-fit backdrop-blur-md shadow-[0_0_15px_rgba(0,245,212,0.15)]">
              <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00F5D4]" />
              Engineering Philosophy
            </div>

            <h2 className="font-serif text-[clamp(2.5rem,4.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              Clear thinking.<br />Lasting foundations.
            </h2>

            <p className="text-base md:text-lg text-slate-200 leading-relaxed font-normal max-w-xl">
              Useful software starts with sound decisions. These are the core principles that guide our product architecture and engineering discipline.
            </p>
          </header>

          <ol className="flex flex-col gap-6">
            {visionValues.map((value, index) => (
              <li
                key={value.title}
                className="group relative rounded-2xl border border-white/15 bg-slate-950/70 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 hover:border-cyan-400/50 hover:bg-slate-900/80 hover:shadow-[0_0_35px_rgba(0,245,212,0.15)] shadow-2xl overflow-hidden"
              >
                {/* Ambient hover glow */}
                <div
                  className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 10% 20%, ${value.accentGlow}, transparent 75%)`,
                  }}
                />

                {/* Specular top border highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

                {/* Left accent line */}
                <div
                  className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all duration-500 group-hover:w-1.5"
                  style={{ backgroundColor: value.color }}
                />

                <div className="flex items-start gap-5 relative z-10 pl-2">
                  <span
                    className="font-mono text-xl font-black shrink-0 px-3 py-1 rounded-lg border transition-all duration-500 shadow-md"
                    style={{
                      color: value.color,
                      borderColor: `${value.color}44`,
                      backgroundColor: `${value.color}15`,
                    }}
                  >
                    0{index + 1}
                  </span>

                  <div className="flex flex-col gap-1.5 min-w-0">
                    <h3 className="font-serif text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {value.title}
                    </h3>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300/90">
                      {value.tagline}
                    </p>
                    <p className="text-sm md:text-base text-slate-200 font-normal leading-relaxed mt-1">
                      {value.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ── RIGHT SPACER for the persistent 3D globe overlay (lg breakpoint) ── */}
        <div className="hidden lg:block lg:col-span-5 lg:col-start-8 pointer-events-none" />
      </section>
    </JourneySection>
  );
}