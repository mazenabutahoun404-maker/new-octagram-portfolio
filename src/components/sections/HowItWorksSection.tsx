import { useRef } from "react";
import JourneySection from "../ui/JourneySection";

type ProcessStep = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  benefit: string;
  deliverables: readonly string[];
  accent: string;
  accentGlow: string;
};

const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: "01",
    title: "Strategic Audit & System Blueprint",
    subtitle: "Eliminate risk before writing code",
    description:
      "We translate your complex product requirements into an airtight technical architecture, scalable data schemas, and a defined milestone roadmap.",
    benefit: "Zero guesswork, predictable timelines, and transparent scope alignment from day one.",
    deliverables: ["Architecture Blueprint", "Data Schema & APIs", "Fixed Timeline Roadmap"],
    accent: "#00F5D4",
    accentGlow: "rgba(0, 245, 212, 0.2)",
  },
  {
    number: "02",
    title: "Agile Engineering & Intelligent Core",
    subtitle: "High-velocity builds with real-time visibility",
    description:
      "We construct your custom AI agent orchestrations, microservices, and web/mobile interfaces in rapid 1-week sprint cycles.",
    benefit: "Live staging access from week one so you test, provide feedback, and see progress continuously.",
    deliverables: ["Weekly Staging Builds", "AI & Workflows Core", "Enterprise Microservices"],
    accent: "#FF7E5F",
    accentGlow: "rgba(255, 126, 95, 0.2)",
  },
  {
    number: "03",
    title: "Enterprise Security & Performance",
    subtitle: "Sub-50ms latency & zero-trust protection",
    description:
      "Your infrastructure is stress-tested under high concurrent load, hardened with end-to-end encryption, and deployed across edge nodes.",
    benefit: "Institutional-grade stability, ironclad compliance, and ultra-fast global responsiveness.",
    deliverables: ["Zero-Trust Encryption", "Load Stress Certification", "Global Edge CDN Setup"],
    accent: "#FFC857",
    accentGlow: "rgba(255, 200, 87, 0.2)",
  },
  {
    number: "04",
    title: "Turnkey Deployment & Scaled Growth",
    subtitle: "Zero-downtime launch & active telemetry",
    description:
      "We handle production release, onboard your internal operations, and activate 24/7 automated telemetry monitoring for seamless long-term stability.",
    benefit: "Effortless handoff with ongoing technical monitoring so your system scales without friction.",
    deliverables: ["Turnkey Production Launch", "24/7 Telemetry Monitoring", "Maintenance & SLA Support"],
    accent: "#00BBF9",
    accentGlow: "rgba(0, 187, 249, 0.2)",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const handleScrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactEl = document.getElementById("contact");
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <JourneySection id="impact" center={0.84} minHeight="min-h-[100vh]">
      <section
        ref={sectionRef}
        className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 px-4 md:px-8 py-16 text-white"
      >
        {/* ── LEFT COLUMN: Process Workflow Content (Liquid Glassmorphism) ── */}
        <div className="lg:col-span-7 lg:col-start-1 flex flex-col gap-10">
          {/* Header */}
          <header className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-xs font-bold text-cyan-300 uppercase tracking-[0.25em] w-fit backdrop-blur-md shadow-[0_0_15px_rgba(0,245,212,0.15)]">
              <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00F5D4]" />
              Engineering Methodology
            </div>

            <h2 className="font-serif text-[clamp(2.5rem,4.2vw,4.2rem)] font-extrabold leading-[1.05] tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent">
              From vision to enterprise execution.
            </h2>

            <p className="text-base md:text-lg text-slate-200 leading-relaxed font-normal max-w-xl">
              We eliminate friction in software engineering with a transparent, 4-stage process built for speed, predictability, and long-term scalability.
            </p>
          </header>

          {/* 4 Liquid Glass Process Cards */}
          <div className="flex flex-col gap-6">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-white/15 bg-slate-950/70 backdrop-blur-xl p-6 md:p-8 transition-all duration-500 hover:border-cyan-400/50 hover:bg-slate-900/80 hover:shadow-[0_0_35px_rgba(0,245,212,0.15)] shadow-2xl overflow-hidden"
              >
                {/* Ambient glow on hover */}
                <div
                  className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at 10% 20%, ${step.accentGlow}, transparent 75%)`,
                  }}
                />

                {/* Specular top border highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full transition-all duration-500 group-hover:w-1.5"
                  style={{ backgroundColor: step.accent }}
                />

                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 relative z-10 pl-2">
                  {/* Number Badge */}
                  <span
                    className="font-mono text-2xl font-black shrink-0 px-3.5 py-1.5 rounded-xl border transition-all duration-500 w-fit shadow-md"
                    style={{
                      color: step.accent,
                      borderColor: `${step.accent}44`,
                      backgroundColor: `${step.accent}15`,
                    }}
                  >
                    {step.number}
                  </span>

                  {/* Body Content */}
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                        {step.title}
                      </h3>
                      <span className="font-mono text-xs uppercase tracking-wider text-cyan-300/90 font-bold">
                        {step.subtitle}
                      </span>
                    </div>

                    <p className="text-sm md:text-base text-slate-200 font-normal leading-relaxed">
                      {step.description}
                    </p>

                    {/* Client Value Highlight */}
                    <div className="mt-2.5 flex items-start gap-3 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 shadow-sm">
                      <svg
                        className="size-4 shrink-0 mt-0.5"
                        style={{ color: step.accent }}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 5 5L20 7" />
                      </svg>
                      <span className="text-xs md:text-sm text-slate-100 font-medium leading-snug">
                        <strong className="text-white font-bold">Why clients choose this:</strong> {step.benefit}
                      </span>
                    </div>

                    {/* Deliverables tags */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {step.deliverables.map((item) => (
                        <span
                          key={item}
                          className="font-mono text-xs font-semibold px-3 py-1 rounded-md border border-white/15 bg-white/[0.05] text-slate-100 shadow-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Glass Banner */}
          <div className="mt-4 p-7 rounded-2xl border border-cyan-400/30 bg-slate-950/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <h4 className="font-serif text-xl font-bold text-white">Ready to start your technical build?</h4>
              <p className="text-sm text-slate-200 font-normal mt-1">Direct access to our engineering leads from day one.</p>
            </div>

            <a
              href="#contact"
              onClick={handleScrollToContact}
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all duration-300 shadow-[0_0_24px_rgba(0,245,212,0.4)] shrink-0"
            >
              <span>Schedule Strategy Call</span>
              <svg className="size-4 stroke-current stroke-[2.5]" viewBox="0 0 24 24" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* ── RIGHT SPACER for the persistent 3D globe overlay (lg breakpoint) ── */}
        <div className="hidden lg:block lg:col-span-5 lg:col-start-8 pointer-events-none" />
      </section>
    </JourneySection>
  );
}
