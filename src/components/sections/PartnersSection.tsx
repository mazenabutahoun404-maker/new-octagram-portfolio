import { companyAssets } from "../../lib/companyAssets";
import JourneySection from "../ui/JourneySection";
import partnersBg from "../../assets/partners-bg.png";

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
      {/* ── Immersive Image Background Wrapper ── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 mix-blend-screen overflow-hidden">
        <img
          src={partnersBg}
          alt="Partners background aesthetic"
          className="w-full h-full object-cover origin-center scale-[1.02] filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent" />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10 px-4 md:px-8">
        <header className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-sky-400/20 bg-sky-400/5 font-sans text-xs font-bold text-sky-300 uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_#38bdf8]" />
            Ecosystem
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.1] tracking-tight text-white max-w-3xl drop-shadow-2xl">
            Built alongside visionaries.
          </h2>
          <p className="mt-6 text-sm md:text-base text-sky-100/80 leading-relaxed font-light max-w-xl text-center drop-shadow-lg">
            We partner with industry-defining healthcare and enterprise organizations committed to engineering excellence.
          </p>
        </header>

        {/* ── Wall of Honor Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group relative flex flex-col p-8 rounded-xl border border-sky-200/10 bg-[#0B1525]/80 backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-[#0f1f38]/90 hover:border-sky-300/30 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]"
            >
              {/* Aquatic ambient glow */}
              <div
                className="absolute -inset-24 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${partner.accent}, transparent 60%)`,
                }}
              />

              <div className="flex items-start justify-between gap-4 mb-10 relative z-10">
                <div className="size-14 rounded-[10px] bg-black/40 border border-sky-100/5 flex items-center justify-center p-2 shadow-inner group-hover:bg-black/60 transition-colors">
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <span className="font-sans py-2 text-sm font-bold text-sky-100/70">
                      {partner.fallback}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex justify-end">
                  <span
                    className="font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-current/20 bg-current/5"
                    style={{ color: partner.accent }}
                  >
                    {partner.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-3">
                  {partner.name}
                </h3>
                <p className="text-sm text-sky-100/50 font-light leading-relaxed group-hover:text-sky-50/80 transition-colors">
                  {partner.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </JourneySection>
  );
}
