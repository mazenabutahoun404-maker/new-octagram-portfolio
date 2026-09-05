import { useState } from "react";
import { companyAssets } from "../../lib/companyAssets";

type Project = {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  tags: readonly string[];
  image?: string;
  url?: string;
  accent: string;
  accentGlow: string;
};

const PROJECTS: readonly Project[] = [
  {
    id: "octa-clinic",
    category: "Healthcare Platform",
    title: "Octa Clinic System",
    subtitle: "Clinical Operations & Telemetry",
    description:
      "An integrated clinical management ecosystem streamlining patient appointments, multi-doctor scheduling, medical records, and live telemetry workflows.",
    tags: ["Clinic Operations", "Patient Workflows", "Telemetry Data"],
    image: companyAssets.projects.octaClinic,
    accent: "#FF7E5F",
    accentGlow: "rgba(255, 126, 95, 0.25)",
  },
  {
    id: "thaaer-coaching",
    category: "Coaching Platform",
    title: "Thaaer Online Coaching",
    subtitle: "Digital Coaching & Analytics",
    description:
      "A high-performance digital coaching environment uniting custom training programs, real-time client analytics, and interactive progress tracking.",
    tags: ["Web Platform", "Coaching Analytics", "Live Workflows"],
    image: companyAssets.projects.onlineCoaching,
    url: "https://thaaerfit.com/",
    accent: "#00F5D4",
    accentGlow: "rgba(0, 245, 212, 0.25)",
  },
  {
    id: "octagram-portfolio",
    category: "Interactive Flagship",
    title: "The Octagram Portfolio",
    subtitle: "Spatial Design & WebGL 3D",
    description:
      "An immersive digital flagship exploring real-time 3D rendering, spatial UI design, dynamic ocean depth canvas, and reactive particle networks.",
    tags: ["Spatial Design", "WebGL", "Interactive Motion"],
    image: companyAssets.projects.portfolio,
    url: "https://mazenabutahoun404-maker.github.io/mazen-portofolio/",
    accent: "#00BBF9",
    accentGlow: "rgba(0, 187, 249, 0.25)",
  },
];

const UPCOMING = [
  {
    id: "octa-care",
    title: "Octa Care",
    category: "Connected Remote Healthcare",
    status: "Active R&D",
  },
  {
    id: "octa-drip",
    title: "Octa Drip",
    category: "Specialized Wellness Tech",
    status: "Private Beta",
  },
] as const;

export default function ProjectsSection() {
  const [activeId, setActiveId] = useState<string>(PROJECTS[0].id);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const activeProject = PROJECTS.find((p) => p.id === activeId) || PROJECTS[0];

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="relative z-10 w-full max-w-[1360px] mx-auto px-4 md:px-8 py-20 scroll-mt-24 text-white"
    >
      {/* ── Section Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-xs font-bold text-cyan-300 uppercase tracking-[0.25em] w-fit backdrop-blur-md shadow-[0_0_15px_rgba(0,245,212,0.15)]">
            <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00F5D4]" />
            Selected Portfolio Showcase
          </div>

          <h2
            id="projects-title"
            className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent"
          >
            Ideas put to work.
          </h2>
        </div>

        <p className="text-base md:text-lg text-slate-200 leading-relaxed font-normal max-w-md">
          From clinical management systems to high-performance spatial WebGL platforms — explore our flagship engineering builds.
        </p>
      </header>

      {/* ── Liquid Glass Project Switcher Tabs ── */}
      <div className="flex flex-wrap items-center gap-3 mb-10 p-2 rounded-2xl border border-white/15 bg-slate-950/70 backdrop-blur-xl shadow-2xl w-fit">
        {PROJECTS.map((project, index) => {
          const isActive = project.id === activeProject.id;
          return (
            <button
              key={project.id}
              onClick={() => setActiveId(project.id)}
              className={`relative inline-flex items-center gap-3 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                isActive
                  ? "bg-slate-900 text-white border border-cyan-400/40 shadow-[0_0_20px_rgba(0,245,212,0.2)]"
                  : "text-slate-300 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span
                className="size-2 rounded-full transition-colors"
                style={{ backgroundColor: isActive ? project.accent : "#475569" }}
              />
              <span>0{index + 1}. {project.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── FEATURE STAGE: BIG IMAGE SHOWCASE ── */}
      <div className="relative rounded-3xl border border-white/15 bg-slate-950/80 backdrop-blur-2xl p-6 md:p-10 shadow-2xl overflow-hidden mb-16">
        {/* Background Ambient Radial Glow matching active project accent - positioned at left screen (20% 35%) */}
        <div
          className="absolute -inset-20 opacity-45 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 20% 35%, ${activeProject.accentGlow}, transparent 65%)`,
          }}
        />

        {/* Top Accent Line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
          style={{ backgroundColor: activeProject.accent }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* ── BIG IMAGE DISPLAY CONTAINER (7 columns on desktop) ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Window Frame Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-t-xl bg-slate-900/90 border border-white/15 border-b-0 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-rose-500/80" />
                <span className="size-3 rounded-full bg-amber-500/80" />
                <span className="size-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-[11px] text-cyan-300/80 font-semibold tracking-wide">
                {activeProject.category} — Live Preview
              </span>
            </div>

            {/* BIG IMAGE FRAME */}
            <div className="relative w-full rounded-b-xl border border-white/15 bg-slate-900/90 p-4 md:p-6 overflow-hidden flex items-center justify-center shadow-2xl min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[560px]">
              {activeProject.image && !failedImages[activeProject.id] ? (
                <img
                  key={activeProject.id}
                  src={activeProject.image}
                  alt={`${activeProject.title} Interface Preview`}
                  width={1920}
                  height={1080}
                  loading="eager"
                  decoding="async"
                  onError={() => handleImageError(activeProject.id)}
                  className="w-full h-full max-h-[560px] object-contain rounded-lg shadow-2xl transition-all duration-700 animate-fadeIn"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <span className="font-serif text-3xl font-bold text-white mb-2">
                    {activeProject.title}
                  </span>
                  <span className="font-mono text-sm text-cyan-300">
                    {activeProject.subtitle}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── GLASS DETAILS DRAWER (5 columns on desktop) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6 p-6 md:p-8 rounded-2xl border border-white/15 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-xs font-bold uppercase tracking-[0.2em] px-3.5 py-1 rounded-full border shadow-sm"
                  style={{
                    color: activeProject.accent,
                    borderColor: `${activeProject.accent}44`,
                    backgroundColor: `${activeProject.accent}15`,
                  }}
                >
                  {activeProject.category}
                </span>

                <span className="font-mono text-xs text-slate-300 font-bold">
                  Flagship Build
                </span>
              </div>

              <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-white">
                {activeProject.title}
              </h3>

              <p className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300/90">
                {activeProject.subtitle}
              </p>

              <p className="text-base text-slate-200 font-normal leading-relaxed">
                {activeProject.description}
              </p>
            </div>

            {/* Deliverables / Tags */}
            <div className="flex flex-col gap-4 pt-4 border-t border-white/15">
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs font-semibold px-3 py-1 rounded-md border border-white/15 bg-white/[0.05] text-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {activeProject.url ? (
                <a
                  href={activeProject.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-950/80 to-slate-900 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-400/20 hover:border-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(0,245,212,0.2)] mt-2"
                >
                  <span>Visit Live Platform</span>
                  <svg className="size-4 stroke-current stroke-[2.5]" viewBox="0 0 24 24" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              ) : (
                <div className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-slate-300 font-mono text-xs font-semibold uppercase tracking-wider mt-2">
                  <span>Enterprise Deployment</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECONDARY GALLERY GRID (Large Thumbnail Cards) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {PROJECTS.map((project, index) => {
          const isSelected = project.id === activeProject.id;
          return (
            <div
              key={project.id}
              onClick={() => setActiveId(project.id)}
              className={`group relative rounded-2xl border backdrop-blur-xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-500 shadow-xl overflow-hidden ${
                isSelected
                  ? "border-cyan-400/50 bg-slate-900/90 ring-1 ring-cyan-400/30"
                  : "border-white/15 bg-slate-950/80 hover:border-white/30 hover:bg-slate-900/80"
              }`}
            >
              {/* Media Thumbnail Container */}
              <div className="relative w-full h-44 rounded-xl border border-white/15 bg-slate-900 overflow-hidden mb-4 p-2 flex items-center justify-center">
                {project.image && !failedImages[project.id] ? (
                  <img
                    src={project.image}
                    alt={`${project.title} thumbnail`}
                    width={640}
                    height={400}
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(project.id)}
                    className="w-full h-full object-contain rounded-md transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="font-serif text-lg font-bold text-white/80">{project.title}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border"
                    style={{
                      color: project.accent,
                      borderColor: `${project.accent}44`,
                      backgroundColor: `${project.accent}15`,
                    }}
                  >
                    0{index + 1}. {project.category}
                  </span>

                  <span className="font-mono text-xs text-slate-300 font-bold">
                    {isSelected ? "Active" : "View"}
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                  {project.title}
                </h4>
                <p className="text-xs text-slate-200 line-clamp-2 font-normal leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── R&D DEVELOPMENT PIPELINE FOOTER ── */}
      <aside className="p-8 rounded-2xl border border-white/15 bg-slate-950/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-2xl">
        <div className="flex flex-col gap-1.5 max-w-sm">
          <h3 className="font-serif text-xl font-extrabold text-white">In Development Pipeline</h3>
          <p className="text-sm text-slate-200 font-normal leading-relaxed">
            Early-stage software products currently in stealth engineering and active client trial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 max-w-xl">
          {UPCOMING.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-white/15 bg-slate-900/80 flex flex-col gap-2 shadow-md"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-white">{item.title}</h4>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 font-mono text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  <span className="size-1.5 rounded-full bg-amber-300 animate-pulse" />
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-normal">{item.category}</p>
            </div>
          ))}
        </div>
      </aside>
    </section>
  );
}
