import { companyAssets } from "../../lib/companyAssets";
import JourneySection from "../ui/JourneySection";

const partners = [
  {
    id: "six-senses",
    name: "sixSenses Clinic",
    category: "Healthcare & Wellness",
    description:
      "Colon & Cleansing specialized care partner — delivering holistic patient experiences powered by integrated clinical technology.",
    accent: "#FF7E5F",
    logo: companyAssets.sixSensesLogo,
    fallback: "6S",
  },
  {
    id: "medical-club",
    name: "Medical Club",
    category: "Healthcare Platform",
    description:
      "Healthcare community & platform ecosystem — connecting patients, practitioners, and wellness providers through intelligent data systems.",
    accent: "#00F5D4",
    logo: companyAssets.medicalClubLogo,
    fallback: "MC",
  },
];

export default function PartnersSection() {
  return (
    <JourneySection id="partners" center={0.91} minHeight="min-h-[100vh]">
      <div className="w-full max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* ── LEFT COLUMN: Organic partner display ── */}
        <div className="lg:col-span-6 flex flex-col gap-6 max-w-[560px]">
          <header>
            <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-rose-400/20 bg-rose-400/5 font-mono text-xs font-bold text-[#FF7E5F] uppercase tracking-[0.25em]">
              <span className="size-1.5 rounded-full bg-[#FF7E5F] shadow-[0_0_8px_#FF7E5F]" />
              Ecosystem
            </div>
            <h2 className="mt-5 font-serif text-[clamp(2.3rem,4.2vw,4.5rem)] font-bold leading-[0.94] tracking-tight bg-gradient-to-r from-white via-rose-100 to-amber-200 bg-clip-text text-transparent">
              Built alongside visionaries.
            </h2>
            <p className="mt-4 text-sm md:text-base text-white/60 leading-relaxed font-light max-w-md">
              We partner with industry-defining healthcare and enterprise organizations committed to engineering excellence.
            </p>
          </header>

          {/* ── Partner entries — organic flow with accent left line ── */}
          <div className="flex flex-col gap-0 pt-2">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="group relative flex items-start gap-5 py-7 transition-all duration-500"
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Accent left line */}
                <div
                  className="absolute left-0 top-7 bottom-7 w-px opacity-30 group-hover:opacity-80 transition-opacity duration-500"
                  style={{ backgroundColor: partner.accent, boxShadow: `0 0 6px ${partner.accent}` }}
                />

                {/* Logo */}
                <div
                  className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] ml-4 group-hover:border-white/20 transition-all duration-300"
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="size-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <span className="font-mono text-sm font-bold text-white/60">
                      {partner.fallback}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-bold text-white/90 group-hover:text-white transition-colors">
                      {partner.name}
                    </h3>
                    <span
                      className="font-mono text-xs font-bold uppercase tracking-widest opacity-60"
                      style={{ color: partner.accent }}
                    >
                      {partner.category}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/45 font-light leading-relaxed group-hover:text-white/65 transition-colors">
                    {partner.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-6 pointer-events-none" />
      </div>
    </JourneySection>
  );
}
