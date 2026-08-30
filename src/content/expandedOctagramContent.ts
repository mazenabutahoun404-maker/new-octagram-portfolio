import type { JourneyDestination, SolutionItem } from "../types/journey";

export const OCTAGRAM_EMAIL = "hello@octagram.com";
export const OCTAGRAM_LOCATION = "Amman, Jordan";

export const journeyNavigation: JourneyDestination[] = [
  // ── Gate 1: Chapter 1 Image Sequence (Hero + 3 Sections) ──
  { id: "hero", label: "Overview", progress: 0 },
  { id: "about", label: "About Us", progress: 0.32 },
  { id: "solutions", label: "Solutions", progress: 0.38 },
  { id: "founders", label: "Leadership", progress: 0.44 },
  // ── Gate 2: Dark Experience (Abyss - Unified Particle Sphere) ──
  { id: "projects", label: "Portfolio", progress: 0.52 },
  { id: "vision", label: "Philosophy", progress: 0.76 },
  { id: "impact", label: "Impact", progress: 0.84 },
  { id: "partners", label: "Ecosystem", progress: 0.91 },
  // ── Gate 3: Chapter 2 Image Sequence (Future + Footer) ──
  { id: "future", label: "Future", progress: 0.97 },
  { id: "contact", label: "Get In Touch", progress: 0.99 },
];

export const solutions: SolutionItem[] = [
  {
    number: "01",
    title: "AI & Autonomous Systems Engineering",
    description:
      "Custom multi-agent orchestration engines, fine-tuned LLM pipelines, and real-time intelligent decision systems.",
    accent: "coral",
  },
  {
    number: "02",
    title: "Cloud Infrastructure & Enterprise Systems",
    description:
      "High-throughput microservices architecture, global edge data distribution, and zero-trust cloud security.",
    accent: "aqua",
  },
  {
    number: "03",
    title: "High-Performance Web & Mobile Apps",
    description:
      "Fluid, ultra-responsive digital applications built on modern web technologies, WebGL, and native mobile stacks.",
    accent: "mint",
  },
  {
    number: "04",
    title: "AI Strategy & Product Architecture",
    description:
      "Comprehensive technology roadmaps, scalable data schema design, and high-velocity product engineering.",
    accent: "amber",
  },
];
