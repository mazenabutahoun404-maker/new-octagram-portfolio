import { useCallback, useEffect, useRef, useState } from "react";
import RefImageNavBar from "./components/chrome/RefImageNavBar";
import DiveLoader from "./components/ocean/DiveLoader";
import OceanJourneyCanvas from "./components/ocean/OceanJourneyCanvas";
import DarkExperienceCanvas from "./components/ocean/DarkExperienceCanvas";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import SolutionsSection from "./components/sections/SolutionsSection";
import FoundersSection from "./components/sections/FoundersSection";
import GateSection from "./components/sections/GateSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import VisionSection from "./components/sections/VisionSection";
import PartnersSection from "./components/sections/PartnersSection";
import FutureSection from "./components/sections/FutureSection";
import ImpactSection from "./components/sections/ImpactSection";
import ContactFooter from "./components/sections/ContactFooter";
import { useAmbientSound } from "./hooks/useAmbientSound";
import {
  heroMobileVideoUrl,
  heroPosterUrl,
  heroVideoUrl,
} from "./lib/oceanSequences";
import { journeyNavigation } from "./content/expandedOctagramContent";
import type { JumpToSection } from "./types/journey";
import "./index.css";

export default function App() {
  const hasHeroVideo = Boolean(heroVideoUrl || heroMobileVideoUrl);
  const depthOutputRef = useRef<HTMLSpanElement>(null);
  const [videoReady, setVideoReady] = useState(!hasHeroVideo);
  const [posterReady, setPosterReady] = useState(!heroPosterUrl);
  const [sequenceProgress, setSequenceProgress] = useState(0);
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [loaderMounted, setLoaderMounted] = useState(true);
  const { enabled: soundEnabled, toggle: toggleSound, graphRef } =
    useAmbientSound();

  const loadingProgress =
    ((videoReady ? 1 : 0) + (posterReady ? 1 : 0) + sequenceProgress) / 3;

  const handleSequenceBuffer = useCallback((progress: number) => {
    setSequenceProgress(progress);
  }, []);

  useEffect(() => {
    if (!heroPosterUrl) return;
    const poster = new Image();
    poster.onload = () => setPosterReady(true);
    poster.onerror = () => setPosterReady(true);
    poster.src = heroPosterUrl;
    return () => {
      poster.onload = null;
      poster.onerror = null;
    };
  }, []);

  useEffect(() => {
    if (loadingProgress < 1) {
      const showTimer = window.setTimeout(() => setLoaderVisible(true), 180);
      return () => window.clearTimeout(showTimer);
    }

    setLoaderVisible(false);
    const unmountTimer = window.setTimeout(() => setLoaderMounted(false), 520);
    return () => window.clearTimeout(unmountTimer);
  }, [loadingProgress]);

  // Massively optimize CPU/GPU rendering resources by explicitly pausing the Hero video 
  // when it securely scrolls off-screen.
  useEffect(() => {
    const handleScroll = () => {
      const heroVideo = document.querySelector('[data-hero-video]') as HTMLVideoElement;
      if (!heroVideo) return;
      if (window.scrollY > window.innerHeight * 1.5) {
        if (!heroVideo.paused) heroVideo.pause();
      } else {
        if (heroVideo.paused) heroVideo.play().catch(e => {});
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpTo: JumpToSection = (target: string) => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const el = document.getElementById(target);
    if (el) {
      const targetY = window.scrollY + el.getBoundingClientRect().top;
      window.scrollTo({
        top: targetY,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    } else {
      const dest = journeyNavigation.find((item) => item.id === target);
      if (dest) {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({
          top: maxScroll * dest.progress,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
    }
  };

  return (
    <>
      <a className="skip-link" href="#about">
        Skip to company information
      </a>
      {loaderMounted ? (
        <DiveLoader progress={loadingProgress} visible={loaderVisible} />
      ) : null}

      <main
        id="journey-content"
        className="ocean-experience relative isolate overflow-x-clip bg-[#010711] text-white min-h-[1400vh]"
      >
        <div className="ocean-base fixed inset-0 z-0" />

        {hasHeroVideo ? (
          <video
            className="surface-video fixed inset-0 z-[1] h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPosterUrl || undefined}
            aria-hidden="true"
            data-hero-video
            onLoadedMetadata={() => setVideoReady(true)}
            onError={() => setVideoReady(true)}
          >
            {heroMobileVideoUrl && heroVideoUrl ? (
              <source src={heroMobileVideoUrl} media="(max-width: 760px)" />
            ) : null}
            <source src={heroVideoUrl || heroMobileVideoUrl} />
          </video>
        ) : null}

        <OceanJourneyCanvas
          depthOutputRef={depthOutputRef}
          audioGraphRef={graphRef}
          onInitialBufferProgress={handleSequenceBuffer}
        />

        <DarkExperienceCanvas />

        <div className="ocean-grade fixed inset-0 z-[3] pointer-events-none" />
        <div className="noise fixed inset-0 z-40 pointer-events-none" />

        {/* Exact Glass Pill Navigation */}
        <RefImageNavBar
          jumpTo={jumpTo}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />

        {/* ═══ GATE 1: HERO SCROLL PIN WITH IMAGE SEQUENCES ═══ */}
        <div className="relative h-[420vh] z-10">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <HeroSection jumpTo={jumpTo} />
          </div>
        </div>

        <AboutSection />
        <SolutionsSection />
        <FoundersSection />
        <GateSection />

        {/* ═══ GAP 1: Seamless transition into dark experience ═══ */}
        <div className="h-[20vh] pointer-events-none" aria-hidden="true" />

        {/* ═══ GATE 2: UNIFIED DARK EXPERIENCE — Continuous 3D Signature Sphere (Sections 04-07) ═══ */}
        <ProjectsSection />
        <VisionSection />
        <ImpactSection />
        <PartnersSection />

        {/* ═══ GAP 2: Chapter 2 ascent transition ═══ */}
        <div className="h-[35vh] pointer-events-none" aria-hidden="true" />

        {/* ═══ GATE 3: CHAPTER 2 IMAGE SEQUENCES (SECTION 08 + FOOTER) ═══ */}
        <FutureSection />

        {/* ═══ FOOTER AT END OF CHAPTER 2 IMAGES ═══ */}
        <ContactFooter jumpTo={jumpTo} />
      </main>
    </>
  );
}
