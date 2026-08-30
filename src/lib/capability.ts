export type AnimationQuality = "high" | "medium" | "low";

export type CapabilityProfile = {
    quality: AnimationQuality;
    reducedMotion: boolean;
    coarsePointer: boolean;
    precisePointer: boolean;
    saveData: boolean;
    dprCap: number;
    particleCount: number;
    bubbleCount: number;
    fiberCount: number;
    preloadRadius: number;
    nextChapterFrames: number;
    maxCachedFrames: number;
    parallaxDistance: number;
};

export function detectCapability(): CapabilityProfile {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const precisePointer = window.matchMedia(
        "(hover: hover) and (pointer: fine)",
    ).matches;
    const memory =
        (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;
    const dpr = window.devicePixelRatio || 1;
    const saveData = Boolean(
        (
            navigator as Navigator & {
                connection?: { saveData?: boolean };
            }
        ).connection?.saveData,
    );

    let quality: AnimationQuality = "high";

    if (
        reducedMotion ||
        memory <= 3 ||
        cores <= 4 ||
        (coarsePointer && dpr > 3.25 && memory <= 4)
    ) {
        quality = "low";
    } else if (
        memory <= 6 ||
        cores <= 6 ||
        coarsePointer ||
        dpr > 2.75 ||
        saveData
    ) {
        quality = "medium";
    }

    if (quality === "low") {
        return {
            quality,
            reducedMotion,
            coarsePointer,
            precisePointer,
            saveData,
            dprCap: 1.15,
            particleCount: 12,
            bubbleCount: 3,
            fiberCount: 0,
            preloadRadius: 8,
            nextChapterFrames: 12,
            maxCachedFrames: 60,
            parallaxDistance: 0,
        };
    }

    if (quality === "medium") {
        return {
            quality,
            reducedMotion,
            coarsePointer,
            precisePointer,
            saveData,
            dprCap: 1.4,
            particleCount: 28,
            bubbleCount: 6,
            fiberCount: 4,
            preloadRadius: 16,
            nextChapterFrames: 24,
            maxCachedFrames: 150,
            parallaxDistance: 32,
        };
    }

    return {
        quality,
        reducedMotion,
        coarsePointer,
        precisePointer,
        saveData,
        dprCap: 1.75,
        particleCount: 52,
        bubbleCount: 10,
        fiberCount: 7,
        preloadRadius: 28,
        nextChapterFrames: 40,
        maxCachedFrames: 300,
        parallaxDistance: 58,
    };
}
