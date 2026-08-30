import { useEffect, useMemo, useRef, useState } from "react";
import { companyAssets } from "../../lib/companyAssets";
import { motion, useScroll, useTransform } from "framer-motion";
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
  url?: string;
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
    id: "thaaer-coaching",
    category: "Web & Coaching",
    status: "Active Platform",
    title: "Thaaer Online Coaching",
    description:
      "A holistic online fitness and wellness coaching platform featuring dynamic user programs, tracking, and seamless guidance.",
    meta: "Coaching Platform",
    accent: "#00F5D4",
    palette: ["#00F5D4", "#00BBF9", "#D7FFF9"],
    image: companyAssets.projects.onlineCoaching,
    url: "https://thaaerfit.com/"
  },
  {
    id: "octagram-portfolio",
    category: "Digital Experience",
    status: "Web ecosystem",
    title: "The Octagram Portfolio",
    description:
      "An immersive cinematic diving experience leveraging pure code to build 3D physics, spatial web design, and interactive performance.",
    meta: "Immersive WebGL",
    accent: "#00BBF9",
    palette: ["#00BBF9", "#5A4AE0", "#B8F2FF"],
    image: companyAssets.projects.portfolio,
    url: "https://mazenabutahoun404-maker.github.io/mazen-portofolio/"
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

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement | HTMLElement>(null);
  
  // Track this specific card's position relative to the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 0"], // Starts when element enters bottom, ends when leaves top
  });

  // Calculate 3D wheel transformations
  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.85, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.45, 0.55, 0.9], [0.3, 1, 1, 0.3]);
  const rotateX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [-15, 0, 15]);

  const Tag = project.url ? motion.a : motion.article;

  return (
    <Tag
      // @ts-ignore dynamic tag issues with Framer Motion typing
      ref={ref}
      href={project.url}
      target={project.url ? "_blank" : undefined}
      rel={project.url ? "noopener noreferrer" : undefined}
      style={{
        scale,
        opacity,
        rotateX,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={`group relative w-full overflow-hidden rounded-md border border-white/10 bg-black p-6 sm:p-8 transition-colors duration-500 hover:border-white/25 block ${project.url ? "cursor-pointer" : ""}`}
    >
      {/* Cinematic Background Image Area */}
      {project.image && (
        <div className="absolute inset-y-0 right-0 w-full md:w-[85%] group-hover:w-full z-0 overflow-hidden opacity-100 pointer-events-none transition-all duration-700">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-center scale-[1.02] origin-center"
          />
          {/* Gradient Mask for seamless blending into left text area */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-700" />
          {/* Very subtle bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:opacity-0 transition-opacity duration-700" />
        </div>
      )}

      {/* Foreground Content */}
      <div className="relative z-10 w-full pt-48 md:pt-0 md:w-[55%] flex flex-col h-full group-hover:opacity-10 group-hover:blur-sm transition-all duration-700">
        <div className="flex items-center gap-4 mb-4">
          <span
            className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-current/20 bg-current/10 backdrop-blur-sm"
            style={{ color: project.accent }}
          >
            {project.category}
          </span>
        </div>

        <h3 className="font-serif text-[clamp(1.8rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-white mb-4 drop-shadow-lg">
          {project.title}
        </h3>
        <p className="text-sm sm:text-base leading-relaxed text-gray-300 font-light max-w-lg mb-10 drop-shadow-md">
          {project.description}
        </p>

        <div className="flex items-center gap-6 mt-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-gray-500">{project.meta}</span>
          <span className="font-mono text-xs uppercase tracking-widest drop-shadow-md" style={{ color: project.accent }}>
            {project.status}
          </span>
        </div>
      </div>
    </Tag>
  );
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

          <div className="col-span-1 lg:col-span-7 flex flex-col gap-10 lg:gap-24" style={{ perspective: "1500px" }}>
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
