import {
  journeyNavigation,
  OCTAGRAM_EMAIL,
  OCTAGRAM_LOCATION,
} from "../../content/octagramContent";
import type { JumpToSection } from "../../types/journey";
import BrandMark from "../ui/BrandMark";

type ContactFooterProps = {
  jumpTo: JumpToSection;
};

export default function ContactFooter({ jumpTo }: ContactFooterProps) {
  return (
    <footer 
      id="contact" 
      className="relative w-full mt-[50vh] flex flex-col justify-end pointer-events-none group/footer"
      style={{ zIndex: 100 }}
    >
      {/* ── GRADUAL BLUR WATERED GLASS BACKGROUND ── */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-slate-950/80 backdrop-blur-3xl pointer-events-none transition-all duration-1000"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 40%)",
        }}
      />
      
      {/* ── CONTENT CONTAINER (2 LINES) ── */}
      <div className="relative z-10 w-full mx-auto px-6 pt-24 pb-8 md:px-10 lg:px-14 flex flex-col gap-5 pointer-events-auto mt-12">
        
        {/* Sleek Subdued Top Edge Reflection */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-40" />

        {/* LINE 1: Brand, Navigation, Email */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-white/5 relative">
          <BrandMark />
          
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 flex-1 lg:px-8">
            {journeyNavigation.slice(1, 8).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => jumpTo(item.id)}
                className="relative font-mono text-sm font-bold text-slate-400/80 hover:text-white transition-colors duration-500 overflow-hidden group/link px-2 py-1"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cyan-400 scale-x-0 group-hover/link:scale-x-100 transition-transform duration-500 origin-left opacity-50" />
              </button>
            ))}
          </div>

          <a
            href={`mailto:${OCTAGRAM_EMAIL}`}
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-slate-300 hover:text-[#00F5D4] transition-all duration-500 group/email"
          >
            <span>{OCTAGRAM_EMAIL}</span>
            <span className="opacity-40 group-hover/email:opacity-100 group-hover/email:translate-x-1 transition-all duration-500">→</span>
          </a>
        </div>

        {/* LINE 2: Location, Credits, Dive Again */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mt-2">
          <span className="font-mono text-xs text-slate-500 tracking-wide">
            {OCTAGRAM_LOCATION}
          </span>
          
          <span className="font-mono text-xs text-slate-500/60">
            © {new Date().getFullYear()} Octagram. Surface · 0000 M
          </span>

          <button
            type="button"
            onClick={() => jumpTo("hero")}
            className="font-mono text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors duration-500 flex items-center gap-2 group/btn"
          >
            <span>DIVE AGAIN</span>
            <span className="opacity-40 group-hover/btn:opacity-100 group-hover/btn:-translate-y-1 transition-all duration-500">↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
