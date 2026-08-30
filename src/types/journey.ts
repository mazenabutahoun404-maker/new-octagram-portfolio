export type Accent = "coral" | "amber" | "mint" | "aqua";

export type JourneyDestination = {
  id: string;
  label: string;
  progress: number;
};

export type JumpToSection = (id: string) => void;

export type SolutionItem = {
  number: string;
  title: string;
  description: string;
  accent: Accent;
};
