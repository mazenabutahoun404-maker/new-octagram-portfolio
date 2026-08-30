import { useEffect, useMemo, useRef, useState } from "react";
import { companyAssets } from "../../lib/companyAssets";
// No imports needed from ScrollWaveField
type Project = {
  id: string;
  category: string;
  status: string;
  title: string;
  description: string;
  meta: string;
  accent: string;
  palette: [string, string, string];
  image?: string;
};

const PROJECTS: Project[] = [
  {
    id: "octa-clinic",
    category: "Healthcare product",
    status: "Featured product",
    title: "Octa Clinic System",
    description:
      "A clinical management product engineered for streamlined medical appointments, team operations, and patient workflows.",
    meta: "Product platform",
    accent: "#FF7E5F",
    palette: ["#FF7E5F", "#00F5D4", "#BFFCF2"],
    image: companyAssets.projects.octaClinic,
  },
  {
    id: "autonomous-ai",
    category: "AI & automation",
    status: "Enterprise AI",
    title: "Autonomous AI Workflows",
    description:
      "Intelligent multi-agent orchestration, custom LLM fine-tuning, and real-time operational decision pipelines.",
    meta: "AI engine infrastructure",
    accent: "#00F5D4",
    palette: ["#00F5D4", "#00BBF9", "#D7FFF9"],
    image: companyAssets.projects.onlineCoaching,
  },
  {
    id: "cloud-ecosystem",
    category: "Cloud & web platform",
    status: "High-throughput",
    title: "Enterprise Cloud Ecosystem",
    description:
      "Scalable microservices, global edge networking, and zero-trust security infrastructure built as one operational ecosystem.",
    meta: "Cloud infrastructure",
    accent: "#00BBF9",
    palette: ["#00BBF9", "#5A4AE0", "#B8F2FF"],
    image: companyAssets.projects.medicalClub,
  },
];

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

function smoothstep(start: number, end: number, value: number) {
  const t = clamp((value - start) / Math.max(0.0001, end - start));
  return t * t * (3 - 2 * t);
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
        .split("")
        .map((character) => character + character)
        .join("")
      : normalized;

  return [
    Number.parseInt(full.slice(0, 2), 16),
    Number.parseInt(full.slice(2, 4), 16),
    Number.parseInt(full.slice(4, 6), 16),
  ];
}

function mixHex(from: string, to: string, amount: number) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const t = clamp(amount);
  const channel = (index: number) =>
    Math.round(a[index] + (b[index] - a[index]) * t)
      .toString(16)
      .padStart(2, "0");

  return `#${channel(0)}${channel(1)}${channel(2)}`;
}

function paletteAt(position: number): string[] {
  const fromIndex = Math.floor(clamp(position, 0, PROJECTS.length - 1));
  const toIndex = Math.min(PROJECTS.length - 1, fromIndex + 1);
  const mix = position - fromIndex;

  return PROJECTS[fromIndex].palette.map((color, index) =>
    mixHex(color, PROJECTS[toIndex].palette[index], mix),
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}
export default function ProjectsSection() {
  // Removed scroll sync since we are moving away from scroll-jacking

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative z-10 w-full min-h-screen py-32 bg-transparent flex items-center"
    >
      <div className="w-full h-full relative flex items-center px-5 sm:px-10 lg:px-[5vw]">

        {/* ── 2. EDITORIAL CONTENT STAGE ── */}
        <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start relative z-20">
          
          <div className="col-span-1 lg:col-span-5 flex flex-col justify-center gap-6 lg:sticky lg:top-40">
            <header>
              <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-cyan-400/25 bg-cyan-400/5 font-mono text-xs font-bold text-[#00F5D4] uppercase tracking-[0.25em]">
                <span className="size-1.5 rounded-full bg-[#00F5D4] animate-pulse shadow-[0_0_8px_#00F5D4]" />
                Portfolio
              </div>
              <h2
                id="projects-title"
                className="mt-4 font-serif text-[clamp(2.5rem,5vw,5.5rem)] font-bold leading-[0.96] tracking-tight text-white mix-blend-screen"
              >
                VENTURES.
              </h2>
              <p className="mt-4 text-base md:text-lg text-white/50 font-light max-w-md">
                Engineered digital products built as scalable operational ecosystems. We transform bold ideas into uncompromising reality.
              </p>
            </header>
          </div>

          <div className="col-span-1 lg:col-span-7 flex flex-col gap-10 lg:gap-24">
            {PROJECTS.map((project) => {
              return (
                <article
                  key={project.id}
                  className="group relative w-full overflow-hidden rounded-3xl border border-white/5 bg-black/40 p-1 shadow-2xl backdrop-blur-md transition-all duration-700 hover:border-white/10 hover:bg-black/60"
                  style={{
                    boxShadow: `0 24px 80px rgba(0,0,0,0.5), 0 0 40px ${project.accent}00`,
                  }}
                >
                  <div className="absolute inset-0 z-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100" 
                    style={{ background: `radial-gradient(120% 120% at 50% 0%, ${project.accent}15 0%, transparent 70%)` }} 
                  />

                  {project.image && (
                    <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-2xl z-10 border border-white/5">
                      <img
                        src={project.image}
                        alt=""
                        className="h-full w-full object-cover origin-center transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-100 mix-blend-lighten"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="relative z-10 p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span
                        className="font-mono text-xs font-bold uppercase tracking-[0.2em]"
                        style={{ color: project.accent }}
                      >
                        {project.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-[clamp(1.7rem,2.8vw,2.6rem)] font-bold leading-[0.98] tracking-tight text-white group-hover:text-[rgba(255,255,255,0.95)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-base leading-relaxed text-white/50 font-light mix-blend-screen">
                      {project.description}
                    </p>

                    <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5 font-mono text-xs font-bold uppercase tracking-[0.16em]">
                      <span className="text-white/36">{project.meta}</span>
                      <span style={{ color: project.accent }}>{project.status}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
