import type { JourneyDestination, SolutionItem } from "../types/journey";

export const OCTAGRAM_EMAIL = "hello@octagram.com";
export const OCTAGRAM_LOCATION = "Amman, Jordan";

export const journeyNavigation: JourneyDestination[] = [
  // ── Gate 1: Chapter 1 Image Sequence (Hero + 3 Sections) ──
  { id: "hero", label: "Overview", progress: 0 },
  { id: "about", label: "01 About Us", progress: 0.32 },
  { id: "solutions", label: "02 Solutions", progress: 0.38 },
  { id: "founders", label: "03 Leadership", progress: 0.44 },
  // ── Gate 2: Dark Experience (Abyss - Unified Particle Sphere, Sections 04-07) ──
  { id: "projects", label: "04 Portfolio", progress: 0.52 },
  { id: "vision", label: "05 Philosophy", progress: 0.76 },
  { id: "impact", label: "06 Impact", progress: 0.84 },
  { id: "partners", label: "07 Ecosystem", progress: 0.91 },
  // ── Gate 3: Chapter 2 Image Sequence (Sections 08 + Footer) ──
  { id: "future", label: "08 Future", progress: 0.97 },
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
    title: "Enterprise UX & Technical Interface Design",
    description:
      "Data-dense dashboards, accessible clinical toolings, and premium cinematic marketing experiences.",
    accent: "mint",
  },
  {
    number: "05",
    title: "Advanced Data Analytics & Intelligence",
    description:
      "Real-time processing architectures, predictive modeling, and highly secure cloud data lakes.",
    accent: "aqua",
  },
  {
    number: "06",
    title: "DevSecOps & Embedded Cybersecurity",
    description:
      "Continuous integration, automated deployment pipelines, and zero-trust security auditing.",
    accent: "coral",
  },
];
