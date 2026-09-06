import { solutions } from "../../content/octagramContent";
import JourneySection from "../ui/JourneySection";
import LazyMount from "../ui/LazyMount";
import KineticGrid from "../ui/KineticGrid";

const accentMap: Record<string, { color: string; badgeBg: string; border: string; metric: string; features: string[] }> = {
  coral: {
    color: "#f97316",
    badgeBg: "bg-orange-50 text-orange-600 border-orange-200",
    border: "hover:border-orange-400",
    metric: "99.9% Agent Precision",
    features: ["Autonomous AI multi-agent orchestration", "Custom LLM fine-tuning & RAG pipelines", "Real-time inference & decision engines"],
  },
  aqua: {
    color: "#0ea5e9",
    badgeBg: "bg-sky-50 text-sky-600 border-sky-200",
    border: "hover:border-sky-400",
    metric: "< 50ms Edge Latency",
    features: ["High-throughput microservices architecture", "Multi-region cloud failover & telemetry", "Zero-trust IAM & data encryption"],
  },
  mint: {
    color: "#0d9488",
    badgeBg: "bg-teal-50 text-teal-600 border-teal-200",
    border: "hover:border-teal-400",
    metric: "60 FPS Fluid Motion",
    features: ["Fluid WebGL & Canvas visual systems", "Cross-platform iOS & Android engineering", "Enterprise design system architecture"],
  },
  amber: {
    color: "#d97706",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
    border: "hover:border-amber-400",
    metric: "10x Velocity Gain",
    features: ["Product roadmap & technical feasibility", "Scalable data schema & API definition", "Continuous integration & deployment pipelines"],
  },
};

export default function SolutionsSection() {
  return (
    <JourneySection
      id="solutions"
      center={0}
      minHeight="min-h-[140vh] pb-[40vh]"
      contentPosition="top"
      fullBleedBg={
        <div className="absolute inset-x-0 inset-y-0 z-0 bg-gradient-to-b from-white via-white to-[#e0f2fe] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 z-0 opacity-60 pointer-events-auto">
            <LazyMount rootMargin="800px 0px">
              <KineticGrid
                spacing={42}
                dotColor="#0ea5e9"
                lineColor="rgba(14, 165, 233, 0.2)"
                trailColor="#38bdf8"
                radius={260}
                strength={5}
                background="transparent"
              />
            </LazyMount>
          </div>
        </div>
      }
    >
      <div className="w-full mx-auto flex flex-col gap-10 text-slate-900 relative z-10 antialiased px-2 lg:px-4 mt-[-6vh]">

        {/* Executive Header (Pinned to Top) */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-sky-200 bg-sky-50 font-mono text-xs font-bold text-sky-600 uppercase tracking-[0.2em] shadow-sm">
            <span className="size-2 rounded-full bg-sky-400 animate-pulse" />
            SOLUTIONS &amp; SERVICES
          </div>
          <h2 className="mt-4 font-serif text-[clamp(2rem,3.5vw,3rem)] font-bold text-slate-900 leading-[1.1] tracking-tight">
            Six core engineering disciplines. <span className="font-serif italic font-normal text-sky-600">One unified platform.</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed font-normal">
            We combine artificial intelligence, cloud infrastructure, and product strategy to build transformative software for industry leaders.
          </p>
        </div>

        {/* Row of Executive Discipline Cards (Expandable) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 w-full items-start min-h-[450px]">
          {solutions.map((solution) => {
            const meta = accentMap[solution.accent] || accentMap.mint;
            return (
              <article
                key={solution.title}
                tabIndex={0}
                className={`p-6 md:p-8 rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-md ${meta.border} shadow-sm hover:shadow-xl transition-all duration-[600ms] flex flex-col group relative overflow-hidden h-max cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400`}
              >
                {/* Header Info */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black tracking-tight" style={{ color: meta.color }}>
                      {solution.number}
                    </span>
                    <span className={`px-2.5 py-1 rounded-md font-mono text-xs font-bold uppercase tracking-wider ${meta.badgeBg}`}>
                      Core Discipline
                    </span>
                  </div>

                  <span className="inline-flex max-w-max px-3 py-1 rounded-full border border-slate-200 bg-white font-mono text-xs font-bold text-slate-700 shadow-sm">
                    {meta.metric}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mt-3 transition-all duration-300 transform group-hover:-translate-y-1">
                  <h3 className="font-serif text-lg md:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                    {solution.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 font-normal line-clamp-3">
                    {solution.description}
                  </p>
                </div>

                {/* Expandable Key Deliverable Features List */}
                <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                  <div className="overflow-hidden">
                    <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2.5">
                      {meta.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2 text-xs text-slate-700 font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                          <svg className="size-3 mt-0.5 shrink-0" style={{ color: meta.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action (Pushes Down) */}
                <div className="mt-auto pt-6 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="tracking-widest font-bold text-slate-400 uppercase hidden sm:block">DISCIPLINE</span>
                  <span className="flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform ml-auto" style={{ color: meta.color }}>
                    Explore Details
                    <svg className="size-2.5 transition-transform group-hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </JourneySection>
  );
}
