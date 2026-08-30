import type { ReactNode } from "react";

type JourneySectionProps = {
  id: string;
  index?: string;
  center: number;
  children: ReactNode;
  ascent?: boolean;
  minHeight?: string;
  fullBleedBg?: ReactNode;
  className?: string;
  /** Controls where content sits vertically — useful when a background animation occupies the other half */
  contentPosition?: "top" | "center" | "bottom";
};

export default function JourneySection({
  id,
  center,
  children,
  ascent = false,
  minHeight = "min-h-[100vh]",
  fullBleedBg,
  className = "",
  contentPosition = "center",
}: JourneySectionProps) {
  const positionClass =
    contentPosition === "top"
      ? "justify-start pt-[14vh]"
      : contentPosition === "bottom"
      ? "justify-end pb-[10vh]"
      : "justify-center";

  return (
    <section
      id={id}
      className={`journey-panel editorial-section relative z-10 ${minHeight} scroll-mt-24 px-5 py-20 sm:px-10 lg:px-[7vw] flex flex-col ${positionClass} ${className}`}
    >
      {fullBleedBg}
      <div
        className="parallax-object section-stage mx-auto w-full max-w-[1320px] relative z-10"
        data-depth-object
        data-water-body
        data-center={center}
        data-ascent={ascent}
      >
        {children}
      </div>
    </section>
  );
}
