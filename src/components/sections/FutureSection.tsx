import { OCTAGRAM_EMAIL } from "../../content/expandedOctagramContent";
import JourneySection from "../ui/JourneySection";

export default function FutureSection() {
  return (
    <JourneySection id="future" center={0.92} ascent minHeight="min-h-[250vh]">
      <div className="w-full max-w-[1320px] mx-auto flex flex-col gap-10 sticky top-[10vh]">

        {/* Header */}
        <div className="p-8 md:p-10 rounded-2xl border border-white/12 bg-white/[0.04] max-w-[860px]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] font-mono text-xs font-bold text-[#FFC857] uppercase tracking-[0.2em]">
            Coming Soon
          </div>
          <h2 className="mt-4 font-serif text-[clamp(2.4rem,4.5vw,4.5rem)] font-bold text-white leading-tight tracking-tight">
            Two ventures rising toward the surface.
          </h2>
          <p className="mt-4 text-base text-white/70 leading-relaxed font-normal">
            Octagram is developing two larger care concepts around connected access, specialized wellness, and operational trust.
          </p>
        </div>

        {/* Venture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Octa Care */}
          <div className="p-8 rounded-2xl border border-white/12 bg-white/[0.04] flex flex-col justify-between min-h-[260px] hover:border-[#FFC857]/30 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#FFC857] uppercase tracking-widest">
                  Connected Care
                </span>
                <span className="px-3 py-0.5 rounded-full border border-white/15 bg-white/[0.06] font-mono text-xs font-bold text-[#FFC857] uppercase">
                  In Development
                </span>
              </div>
              <h3 className="mt-6 font-serif text-3xl font-bold text-white group-hover:text-[#FFC857] transition-colors">
                Octa Care
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                A future care platform connecting people with clearer pathways, professional services, and ongoing support.
              </p>
            </div>
          </div>

          {/* Octa Drip */}
          <div className="p-8 rounded-2xl border border-white/12 bg-white/[0.04] flex flex-col justify-between min-h-[260px] hover:border-[#00BBF9]/30 transition-all duration-300 group">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#00BBF9] uppercase tracking-widest">
                  Specialized Wellness
                </span>
                <span className="px-3 py-0.5 rounded-full border border-white/15 bg-white/[0.06] font-mono text-xs font-bold text-[#00BBF9] uppercase">
                  In Development
                </span>
              </div>
              <h3 className="mt-6 font-serif text-3xl font-bold text-white group-hover:text-[#00BBF9] transition-colors">
                Octa Drip
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed">
                A trusted, professional, and digitally connected specialized wellness experience.
              </p>
            </div>
          </div>

        </div>

        {/* Collaboration CTA Banner */}
        <div className="p-8 rounded-2xl border border-white/12 bg-white/[0.04] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs font-bold text-[#00F5D4] uppercase tracking-widest">
              Collaboration
            </span>
            <h3 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-white">
              Build the next care experience with Octagram.
            </h3>
          </div>
          <a
            href={`mailto:${OCTAGRAM_EMAIL}`}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-[#00F5D4] bg-[#00F5D4]/15 text-white font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(0,245,212,0.3)] hover:scale-105 transition-all duration-300 shrink-0"
          >
            START A CONVERSATION <span className="text-base">↗</span>
          </a>
        </div>

      </div>
    </JourneySection>
  );
}
