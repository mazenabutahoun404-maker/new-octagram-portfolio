import { useState } from "react";
import { companyAssets } from "../../lib/companyAssets";
import JourneySection from "../ui/JourneySection";

const PARTNERS = [
  {
    id: "six-senses",
    name: "sixSenses Clinic",
    category: "Healthcare & Wellness",
    description: "A specialist clinic focused on patient care, clinical operational excellence, and personalized wellness experiences.",
    logo: companyAssets.sixSensesLogo,
    fallback: "6S",
    accent: "#00F5D4",
    accentGlow: "rgba(0, 245, 212, 0.2)",
  },
  {
    id: "medical-club",
    name: "Medical Club",
    category: "Medical Education Platform",
    description: "A comprehensive digital platform for Hashemite University medical students, unifying academic medical resources, course lectures, clinical learning pathways, and exam summaries.",
    logo: companyAssets.medicalClubLogo,
    fallback: "MC",
    accent: "#00BBF9",
    accentGlow: "rgba(0, 187, 249, 0.2)",
  },
] as const;

function PartnerLogo({ partner }: { partner: (typeof PARTNERS)[number] }) {
  const [failedSource, setFailedSource] = useState<string | undefined>();

  return (
    <div className="size-24 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3.5 flex items-center justify-center shadow-inner shrink-0 group-hover:border-cyan-400/40 transition-colors duration-500">
      {partner.logo && failedSource !== partner.logo ? (
        <img
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={88}
          height={88}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSource(partner.logo)}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
        />
      ) : (
        <span className="font-mono text-2xl font-black text-cyan-300 tracking-tight">
          {partner.fallback}
        </span>
      )}
    </div>
  );
}

export default function PartnersSection() {
  return (
    <JourneySection id="partners" center={0.91} minHeight="min-h-[100vh]">
      <section
        id="partners"
        aria-labelledby="partners-title"
        className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-20 relative z-10 text-white"
      >
        {/* ── Section Header ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-xs font-bold text-cyan-300 uppercase tracking-[0.25em] w-fit backdrop-blur-md shadow-[0_0_15px_rgba(0,245,212,0.15)]">
              <span className="size-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#00F5D4]" />
              Strategic Alliances
            </div>

            <h2
              id="partners-title"
              className="font-serif text-[clamp(2.5rem,4.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent"
            >
              Built through<br />collaboration.
            </h2>
          </div>

          <p className="text-base md:text-lg text-slate-200 leading-relaxed font-normal max-w-md">
            Healthcare organizations bring domain experience. We bring technical architecture and high-velocity engineering. Exceptional products emerge from that union.
          </p>
        </header>

        {/* ── Liquid Glass Partners Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {PARTNERS.map((partner) => (
            <article
              key={partner.id}
              className="group relative rounded-2xl border border-white/15 bg-slate-950/70 backdrop-blur-xl p-8 flex flex-col justify-between transition-all duration-500 hover:border-cyan-400/50 hover:bg-slate-900/80 hover:shadow-[0_0_35px_rgba(0,245,212,0.15)] shadow-2xl overflow-hidden"
              aria-labelledby={`${partner.id}-name`}
            >
              {/* Ambient radial glow on hover */}
              <div
                className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at top left, ${partner.accentGlow}, transparent 70%)`,
                }}
              />

              {/* Top Specular Border Highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

              <div className="flex flex-col gap-6 relative z-10">
                {/* Header Row: Illuminated Logo + Category Badge */}
                <div className="flex items-center justify-between gap-4">
                  <PartnerLogo partner={partner} />

                  <span
                    className="font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border shadow-sm"
                    style={{
                      color: partner.accent,
                      borderColor: `${partner.accent}44`,
                      backgroundColor: `${partner.accent}15`,
                    }}
                  >
                    {partner.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <h3 id={`${partner.id}-name`} className="font-serif text-2xl md:text-3xl font-extrabold text-white group-hover:text-cyan-200 transition-colors">
                    {partner.name}
                  </h3>

                  <p className="text-sm md:text-base text-slate-200 font-normal leading-relaxed">
                    {partner.description}
                  </p>
                </div>
              </div>

              {/* Relationship Tag */}
              <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between relative z-10">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300/90 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00F5D4]" />
                  Partner Organization
                </span>

                <span className="font-mono text-xs text-slate-300 font-semibold">
                  Active Collaboration
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* ── Glass Footer Callout ── */}
        <footer className="p-8 rounded-2xl border border-white/15 bg-slate-950/80 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <p className="text-base text-slate-200 font-normal m-0">
            Explore the specialized products and spatial experiences behind our work.
          </p>

          <a
            href="#projects"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-950/80 to-slate-900 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider hover:bg-cyan-400/20 hover:border-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(0,245,212,0.2)] shrink-0"
          >
            <span>Explore Projects</span>
            <svg className="size-4 stroke-current stroke-[2.5]" viewBox="0 0 24 24" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </footer>
      </section>
    </JourneySection>
  );
}
