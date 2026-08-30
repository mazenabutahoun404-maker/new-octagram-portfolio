/// <reference types="vite/client" />

export type FrameVariants = {
  base: string[];
  mobile: string[];
  tablet: string[];
  desktop: string[];
};

export type SequenceChapter = {
  id: string;
  label: string;
  start: number;
  end: number;
  variants: FrameVariants;
};

export type SelectedFrames = {
  variant: keyof FrameVariants;
  sources: string[];
};

export type SequenceLandmark = {
  chapterId: SequenceChapter["id"];
  frameRatio: number;
};

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

// Eager URL imports put only lightweight URL strings in the JS bundle.
// The browser does not download image bytes until OceanJourneyCanvas assigns a URL to Image.src.
const chapter1First = import.meta.glob<string>(
  "/src/assets/chapter1First/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

const chapter1Second = import.meta.glob<string>(
  "/src/assets/chapter1Second/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

const chapter1Third = import.meta.glob<string>(
  "/src/assets/chapter1Third/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

// "Forth" intentionally matches the existing folder name.
const chapter1Forth = import.meta.glob<string>(
  "/src/assets/chapter1Forth/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

const chapter2FirstHalf = import.meta.glob<string>(
  "/src/assets/chapter2FirstHalf/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

const chapter2SecondHalf = import.meta.glob<string>(
  "/src/assets/chapter2SecondHalf/**/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

const heroVideos = import.meta.glob<string>(
  "/src/assets/heroVideo1.{mp4,webm,mov}",
  { eager: true, query: "?url", import: "default" },
);

const heroMobileVideos = import.meta.glob<string>(
  "/src/assets/{heroVideo1-mobile,heroVideo1Mobile}.{mp4,webm,mov}",
  { eager: true, query: "?url", import: "default" },
);

const heroPosters = import.meta.glob<string>(
  "/src/assets/{heroPoster,heroVideo1Poster}.{png,jpg,jpeg,webp,avif}",
  { eager: true, query: "?url", import: "default" },
);

export const heroVideoUrl = Object.values(heroVideos)[0] ?? "";
export const heroMobileVideoUrl = Object.values(heroMobileVideos)[0] ?? "";
export const heroPosterUrl = Object.values(heroPosters)[0] ?? "";

function groupVariants(modules: Record<string, string>): FrameVariants {
  const grouped: FrameVariants = {
    base: [],
    mobile: [],
    tablet: [],
    desktop: [],
  };

  Object.entries(modules)
    .sort(([left], [right]) => collator.compare(left, right))
    .forEach(([path, source]) => {
      if (path.includes("/mobile/")) grouped.mobile.push(source);
      else if (path.includes("/tablet/")) grouped.tablet.push(source);
      else if (path.includes("/desktop/")) grouped.desktop.push(source);
      else grouped.base.push(source);
    });

  return grouped;
}

export const sequences: SequenceChapter[] = [
  {
    id: "chapter1First",
    label: "Entering the water",
    start: 0.00,
    end: 0.06,
    variants: groupVariants(chapter1First),
  },
  {
    id: "chapter1Second",
    label: "Shallow descent",
    start: 0.06,
    end: 0.24,
    variants: groupVariants(chapter1Second),
  },
  {
    id: "chapter1Third",
    label: "Deep water",
    start: 0.40,
    end: 0.47,
    variants: groupVariants(chapter1Third),
  },
  {
    id: "chapter1Forth",
    label: "Seabed approach",
    start: 0.47,
    end: 0.54,
    variants: groupVariants(chapter1Forth),
  },
  {
    id: "chapter2FirstHalf",
    label: "Beginning the ascent",
    start: 0.94,
    end: 0.97,
    variants: groupVariants(chapter2FirstHalf),
  },
  {
    id: "chapter2SecondHalf",
    label: "Breaching the surface",
    start: 0.97,
    end: 1.00,
    variants: groupVariants(chapter2SecondHalf),
  },
];

export const sequenceLandmarks: SequenceLandmark[] = [
  { chapterId: "chapter1First", frameRatio: 0.1 },
  { chapterId: "chapter1Second", frameRatio: 0.5 },
  { chapterId: "chapter1Third", frameRatio: 0.5 },
  { chapterId: "chapter1Forth", frameRatio: 0.85 },
  { chapterId: "chapter2FirstHalf", frameRatio: 0.3 },
  { chapterId: "chapter2SecondHalf", frameRatio: 0.9 },
];

export function selectFrames(
  chapter: SequenceChapter,
  viewportWidth: number,
): SelectedFrames {
  if (viewportWidth < 640 && chapter.variants.mobile.length > 0) {
    return { variant: "mobile", sources: chapter.variants.mobile };
  }
  if (viewportWidth < 1024 && chapter.variants.tablet.length > 0) {
    return { variant: "tablet", sources: chapter.variants.tablet };
  }
  if (chapter.variants.desktop.length > 0) {
    return { variant: "desktop", sources: chapter.variants.desktop };
  }
  return { variant: "base", sources: chapter.variants.base };
}

export function landmarkProgress(chapterId: SequenceChapter["id"]) {
  const landmark = sequenceLandmarks.find((item) => item.chapterId === chapterId);
  const chapter = sequences.find((item) => item.id === chapterId);
  if (!landmark || !chapter) return 0;
  return chapter.start + (chapter.end - chapter.start) * landmark.frameRatio;
}
