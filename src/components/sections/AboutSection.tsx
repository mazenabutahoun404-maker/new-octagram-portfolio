import { useState, useEffect } from "react";
import JourneySection from "../ui/JourneySection";
import OctagramParticleLogo from "../ocean/OctagramParticleLogo";
interface Pillar {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  bgGlow: string;
  borderHover: string;
}

const PILLARS: Pillar[] = [
  {
    id: "engineering",
    name: "ENGINEERING",
    tagline: "High-Performance Systems & Cloud",
    description:
      "Engineered software infrastructure connecting distributed microservices, real-time data pipelines, and mission-critical cloud backends.",
    color: "#FF7E5F",
    bgGlow: "rgba(255, 126, 95, 0.2)",
    borderHover: "rgba(255, 126, 95, 0.5)",
  },
  {
    id: "ai",
    name: "AI SYSTEMS",
    tagline: "Intelligent Agents & Models",
    description:
      "Autonomous AI multi-agent workflows, custom LLM fine-tuning, and neural interfaces designed to automate complex operations.",
    color: "#00F5D4",
    bgGlow: "rgba(0, 245, 212, 0.2)",
    borderHover: "rgba(0, 245, 212, 0.5)",
  },
  {
    id: "trust",
    name: "SECURITY",
    tagline: "Enterprise Governance & Trust",
    description:
      "Rigorous zero-trust cybersecurity, multi-cloud redundancy, and enterprise governance embedded into every line of code.",
    color: "#00BBF9",
    bgGlow: "rgba(0, 187, 249, 0.2)",
    borderHover: "rgba(0, 187, 249, 0.5)",
  },
  {
    id: "technology",
    name: "PRODUCT",
    tagline: "Scalable Application Platforms",
    description:
      "Modular, ultra-responsive web and mobile application platforms built for rapid global scaling and millions of active users.",
    color: "#FFC857",
    bgGlow: "rgba(255, 200, 87, 0.2)",
    borderHover: "rgba(255, 200, 87, 0.5)",
  },
];

export default function AboutSection() {
  const [activePillarId, setActivePillarId] = useState<string>("ai");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const floatProgress = Math.min(1, Math.max(0, (scrollY - 660) / 400));
  const cardTranslateY = (1 - floatProgress) * 70;
  const cardOpacity = Math.min(1, floatProgress * 1.5);

  const activePillar = PILLARS.find((p) => p.id === activePillarId) || PILLARS[1];

  return (
    <JourneySection
      id="about"
      center={0}
      minHeight="min-h-[100vh]"
      fullBleedBg={
        <div className="absolute inset-x-0 -top-[90vh] bottom-0 z-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0.6)_50%,rgba(255,255,255,0.95)_80%,#FFFFFF_100%)] pointer-events-none" />
      }
    >
      <div
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardTranslateY}px)`,
          transition: "transform 100ms ease-out, opacity 100ms ease-out",
        }}
        className="w-full max-w-[1320px] mx-auto flex flex-col gap-8 text-slate-900 relative z-10 antialiased pt-[10vh] pb-10"
      >

        {/* Top Split Layout: Narrative & Interactive Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Column: Hero Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-6 justify-between">

            {/* Pure Light Solid Card */}
            <div className="p-8 md:p-10 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden flex-1 flex flex-col justify-between text-slate-900">

              <div className="relative z-10">
                {/* Chapter Tag */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-teal-500/20 bg-teal-50 font-mono text-xs font-bold text-teal-600 uppercase tracking-[0.2em] shadow-sm">
                  <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
                  ABOUT OCTAGRAM
                </div>

                {/* Headline with Dark Text */}
                <h2 className="mt-6 font-serif text-[clamp(2.4rem,4.2vw,4.2rem)] font-bold leading-[1.06] text-slate-900 tracking-tight">
                  Software systems require architecture before they need features.
                </h2>

                {/* Body Paragraph */}
                <p className="mt-6 text-base md:text-xl leading-relaxed text-slate-600 font-medium max-w-[620px]">
                  Octagram is an elite software engineering and AI development agency. <span className="text-slate-800 font-bold">We connect system architecture, artificial intelligence, and high-performance frontend engineering</span> to build products that redefine industries.
                </p>
              </div>

              {/* 3 Core Disciplines Sub-row */}
              <div className="relative z-10 mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-sm font-mono font-bold text-orange-500">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>PRODUCT THINKING</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-snug">Designed around clinical accuracy &amp; patient ease.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-sm font-mono font-bold text-blue-500">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>OPERATIONAL DEPTH</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-snug">Streamlining daily clinic workflows &amp; staff performance.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-sm font-mono font-bold text-teal-500">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>TECH INTEGRATION</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium leading-snug">Scalable architecture connecting systems seamlessly.</p>
                </div>
              </div>

            </div>

            {/* 3 Light Theme Telemetry Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Metric 1 */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white/90 flex flex-col justify-between hover:border-teal-400 transition-all duration-300 group shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-extrabold text-teal-500 tracking-tight group-hover:scale-105 transition-transform origin-left">
                    05
                  </span>
                  <div className="p-2 rounded-lg bg-teal-50 border border-teal-100 text-teal-500">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-widest block">Ventures Developed</span>
                  <span className="text-sm text-slate-600 font-medium block mt-0.5">Clinical &amp; digital platforms</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white/90 flex flex-col justify-between hover:border-blue-400 transition-all duration-300 group shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-extrabold text-blue-500 tracking-tight group-hover:scale-105 transition-transform origin-left">
                    02
                  </span>
                  <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-500">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-widest block">Strategic Partners</span>
                  <span className="text-sm text-slate-600 font-medium block mt-0.5">Health systems &amp; leaders</span>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white/90 flex flex-col justify-between hover:border-orange-400 transition-all duration-300 group shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-extrabold text-orange-500 tracking-tight group-hover:scale-105 transition-transform origin-left">
                    01
                  </span>
                  <div className="p-2 rounded-lg bg-orange-50 border border-orange-100 text-orange-500">
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-mono text-xs font-bold text-slate-900 uppercase tracking-widest block">Unified Direction</span>
                  <span className="text-sm text-slate-600 font-medium block mt-0.5">Clarity in care execution</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Constellation Core */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-between p-8 rounded-3xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden min-h-[500px]">

            {/* Ambient visual background glow (Lighter) */}
            <div
              className="absolute inset-0 transition-opacity duration-700 opacity-[0.06] pointer-events-none"
              style={{ background: `radial-gradient(circle at center, ${activePillar.color} 0%, transparent 70%)` }}
            />

            {/* Header section */}
            <div className="w-full flex items-center justify-between z-10 px-2">
              <span className="font-mono text-xs font-bold text-teal-600 uppercase tracking-widest flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-teal-400 animate-ping" />
                OCTAGRAM CORE MATRIX
              </span>
              <span className="font-mono text-xs text-slate-600 font-bold uppercase tracking-wider hidden sm:inline-block">
                Interactive Hub
              </span>
            </div>

            {/* Central Particle Logo Visual with Interactive Orbit Nodes */}
            <div className="relative my-4 flex items-center justify-center h-[260px] md:size-[340px] w-full z-10">
              <div className="relative flex items-center justify-center size-[340px] scale-[0.75] md:scale-100 origin-center shrink-0">

                <OctagramParticleLogo width={320} height={320} repulsionRadius={70} repulsionForce={10} />

                <div className="absolute inset-0 rounded-full border border-slate-200 animate-[spin_45s_linear_infinite] pointer-events-none" />
                <div className="absolute inset-4 rounded-full border border-slate-100 border-dashed animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />

                {/* Node 1: SYSTEMS */}
                <button
                  type="button"
                  onClick={() => setActivePillarId("systems")}
                  onMouseEnter={() => setActivePillarId("systems")}
                  className={`absolute top-[6%] left-[4%] px-4 py-2 rounded-full border font-mono text-xs font-bold tracking-widest backdrop-blur-xl transition-all duration-300 z-20 shadow-sm bg-white ${activePillarId === "systems"
                    ? "border-[#FF7E5F] text-[#FF7E5F] shadow-[#FF7E5F]/20 scale-105"
                    : "border-slate-200 text-slate-500 hover:border-[#FF7E5F]/50 hover:text-slate-800"
                    }`}
                >
                  SYSTEMS
                </button>

                {/* Node 2: CARE */}
                <button
                  type="button"
                  onClick={() => setActivePillarId("care")}
                  onMouseEnter={() => setActivePillarId("care")}
                  className={`absolute top-[18%] right-[2%] px-4 py-2 rounded-full border font-mono text-xs font-bold tracking-widest backdrop-blur-xl transition-all duration-300 z-20 shadow-sm bg-white ${activePillarId === "care"
                    ? "border-[#00F5D4] text-teal-600 shadow-[#00F5D4]/20 scale-105"
                    : "border-slate-200 text-slate-500 hover:border-[#00F5D4]/50 hover:text-slate-800"
                    }`}
                >
                  CARE
                </button>

                {/* Node 3: TRUST */}
                <button
                  type="button"
                  onClick={() => setActivePillarId("trust")}
                  onMouseEnter={() => setActivePillarId("trust")}
                  className={`absolute bottom-[18%] left-[2%] px-4 py-2 rounded-full border font-mono text-xs font-bold tracking-widest backdrop-blur-xl transition-all duration-300 z-20 shadow-sm bg-white ${activePillarId === "trust"
                    ? "border-blue-400 text-blue-600 shadow-blue-400/20 scale-105"
                    : "border-slate-200 text-slate-500 hover:border-blue-400/50 hover:text-slate-800"
                    }`}
                >
                  TRUST
                </button>

                {/* Node 4: TECHNOLOGY */}
                <button
                  type="button"
                  onClick={() => setActivePillarId("technology")}
                  onMouseEnter={() => setActivePillarId("technology")}
                  className={`absolute bottom-[6%] right-[4%] px-4 py-2 rounded-full border font-mono text-xs font-bold tracking-widest backdrop-blur-xl transition-all duration-300 z-20 shadow-sm bg-white ${activePillarId === "technology"
                    ? "border-orange-400 text-orange-600 shadow-orange-400/20 scale-105"
                    : "border-slate-200 text-slate-500 hover:border-orange-400/50 hover:text-slate-800"
                    }`}
                >
                  TECHNOLOGY
                </button>

              </div>
            </div>

            {/* Dynamic Active Pillar Info Card */}
            <div
              className="w-full p-4 rounded-xl border border-slate-200 bg-white/90 shadow-sm z-10 flex flex-col gap-1.5 text-slate-900"
              style={{
                borderColor: activePillar.borderHover.replace('0.5', '0.2'),
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider" style={{ color: activePillar.color }}>
                  {activePillar.name} · {activePillar.tagline}
                </span>
                <span className="text-xs font-mono text-slate-500 font-medium">Active</span>
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {activePillar.description}
              </p>
            </div>

            {/* Assembly Hint footer */}
            <div className="w-full pt-3 flex items-center justify-between text-xs font-mono text-slate-500 font-semibold z-10 border-t border-slate-200 mt-4">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-teal-400" />
                Hover nodes or emblem to interact
              </span>
              <span className="text-slate-400">OCTAGRAM INNOVATION</span>
            </div>

          </div>

        </div>

      </div>
    </JourneySection>
  );
}

