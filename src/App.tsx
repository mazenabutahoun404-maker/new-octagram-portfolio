import { useCallback, useEffect, useRef, useState } from "react";
import RefImageNavBar from "./components/chrome/RefImageNavBar";
import DiveLoader from "./components/ocean/DiveLoader";
import OceanJourneyCanvas from "./components/ocean/OceanJourneyCanvas";
import SmoothImageSequence from "./components/ocean/SmoothImageSequence";
import DarkExperienceCanvas from "./components/ocean/DarkExperienceCanvas";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import SolutionsSection from "./components/sections/SolutionsSection";
import FoundersSection from "./components/sections/FoundersSection";
import GateSection from "./components/sections/GateSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import VisionSection from "./components/sections/VisionSection";
import HowItWorksSection from "./components/sections/HowItWorksSection";
import ConnectedGlobe from "./components/ui/ConnectedGlobe";
import PartnersSection from "./components/sections/PartnersSection";
import ContactFooter from "./components/sections/ContactFooter";
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
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderMounted, setLoaderMounted] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);


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
    const minTimer = window.setTimeout(() => setMinTimeElapsed(true), 1500);
    return () => window.clearTimeout(minTimer);
  }, []);

  useEffect(() => {
    if (loadingProgress < 1 || !minTimeElapsed) {
      // Keep it visible until loaded AND the minimum duration has elapsed
      if (!loaderVisible) setLoaderVisible(true);
      return;
    }

    setLoaderVisible(false);
    // Unmount after the premium 1.4s opening gate zoom transition
    const unmountTimer = window.setTimeout(() => setLoaderMounted(false), 1400);
    return () => window.clearTimeout(unmountTimer);
  }, [loadingProgress, minTimeElapsed]);

  // Massively optimize CPU/GPU rendering resources by explicitly pausing the Hero video 
  // when it securely scrolls off-screen.
  useEffect(() => {
    let ticking = false;
    let heroVideo: HTMLVideoElement | null = null;
    
    const checkVideoState = () => {
      if (!heroVideo) heroVideo = document.querySelector('[data-hero-video]') as HTMLVideoElement;
      if (!heroVideo) {
        ticking = false;
        return;
      }
      if (window.scrollY > window.innerHeight * 1.5) {
        if (!heroVideo.paused) heroVideo.pause();
      } else {
        if (heroVideo.paused) heroVideo.play().catch(e => { });
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkVideoState);
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpTo: JumpToSection = (target: string) => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (target === "hero") {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      return;
    }

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
            webkit-playsinline=""
            x5-playsinline=""
            x5-video-player-type="h5"
            disableRemotePlayback
            preload="auto"
            poster={heroPosterUrl || undefined}
            aria-hidden="true"
            data-hero-video
            onCanPlay={() => setVideoReady(true)}
            onError={() => setVideoReady(true)}
          >
            {heroMobileVideoUrl && heroVideoUrl ? (
              <source src={heroMobileVideoUrl} media="(max-width: 760px)" />
            ) : null}
            <source src={heroVideoUrl || heroMobileVideoUrl} />
          </video>
        ) : null}

        <SmoothImageSequence />

        <OceanJourneyCanvas
          depthOutputRef={depthOutputRef}
          onInitialBufferProgress={handleSequenceBuffer}
        />

        <DarkExperienceCanvas />

        <div className="ocean-grade fixed inset-0 z-[3] pointer-events-none" />
        <div className="noise fixed inset-0 z-40 pointer-events-none" />

        {/* Exact Glass Pill Navigation */}
        <RefImageNavBar jumpTo={jumpTo} />

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

        {/* ═══ GATE 2: UNIFIED DARK EXPERIENCE — Continuous 3D Signature Sphere (Sections 04-07) ═══ */}
        <ProjectsSection />

        {/* Persistent Globe spanning across Vision and HowItWorks Sections (Right Aligned) */}
        <div className="relative w-full bg-black">
          <div className="hidden lg:block absolute top-0 bottom-0 right-[2vw] w-[40%] max-w-[520px] z-30 pointer-events-none">
            <div className="sticky top-[10vh] h-[80vh] w-full flex items-center justify-center pointer-events-auto">
              <ConnectedGlobe />
            </div>
          </div>
          <VisionSection />
          <HowItWorksSection />
        </div>

        <div className="relative w-full bg-black z-10 flex flex-col">
          <PartnersSection />
        </div>

        {/* ═══ CHAPTER 2: Full ocean ascent scroll runway ═══ */}
        <div className="relative z-10 h-[300vh]">
          {/* Gradient entrance at top: smooth black-to-transparent, scrolls away naturally */}
          <div className="absolute top-0 left-0 right-0 h-[100vh] pointer-events-none bg-gradient-to-b from-black via-black/50 to-transparent" />
        </div>

        {/* ═══ FOOTER AT END OF CHAPTER 2 IMAGES ═══ */}
        <ContactFooter jumpTo={jumpTo} />
      </main>
    </>
  );
}
