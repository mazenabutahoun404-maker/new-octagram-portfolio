/// <reference types="vite/client" />

const sixSensesLogos = import.meta.glob<string>(
    "/src/assets/{clinicLogo,clinic-logo,sixSensesLogo,sixsensesLogo}.{png,jpg,jpeg,webp,avif,svg}",
    { eager: true, query: "?url", import: "default" },
);

const medicalClubLogos = import.meta.glob<string>(
    "/src/assets/{midicalClub,medicalClub,midicalClubLogo,medicalClubLogo}.{png,jpg,jpeg,webp,avif,svg}",
    { eager: true, query: "?url", import: "default" },
);

const octagramLogos = import.meta.glob<string>(
    "/src/assets/{OctagramLogo,octagramLogo,octagram-logo,Octagram-Logo,Octagram}.{png,jpg,jpeg,webp,avif,svg}",
    { eager: true, query: "?url", import: "default" },
);

const projectImages = import.meta.glob<string>(
    "/src/assets/projects/*.{png,jpg,jpeg,webp,avif,svg}",
    { eager: true, query: "?url", import: "default" },
);

export const companyAssets = {
    octagramLogo: Object.values(octagramLogos)[0] ?? "",
    sixSensesLogo: Object.values(sixSensesLogos)[0] ?? "",
    medicalClubLogo: Object.values(medicalClubLogos)[0] ?? "",
    projects: {
        octaClinic: Object.entries(projectImages).find(([path]) => path.includes("octa_clinic"))?.[1] ?? "",
        onlineCoaching: Object.entries(projectImages).find(([path]) => path.includes("online_coaching"))?.[1] ?? "",
        portfolio: Object.entries(projectImages).find(([path]) => path.toLowerCase().includes("mazenportfolioimages"))?.[1] ?? "",
    },
};
