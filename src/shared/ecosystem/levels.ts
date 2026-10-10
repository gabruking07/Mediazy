export type MediazyLevel =
  | "Explorer"
  | "Creator"
  | "Professional"
  | "Expert"
  | "Master"
  | "Legend"
  | "Mediazy Elite"
  | "Infinity";

export type LevelDefinition = {
  name: MediazyLevel;
  minXp: number;
  reward: string;
};

export const levelDefinitions: LevelDefinition[] = [
  { name: "Explorer", minXp: 0, reward: "Starter dashboard" },
  { name: "Creator", minXp: 500, reward: "Profile badge" },
  { name: "Professional", minXp: 1500, reward: "Advanced collections" },
  { name: "Expert", minXp: 3500, reward: "Premium theme" },
  { name: "Master", minXp: 7500, reward: "Priority rewards" },
  { name: "Legend", minXp: 15000, reward: "Legend badge" },
  { name: "Mediazy Elite", minXp: 30000, reward: "Elite identity" },
  { name: "Infinity", minXp: 60000, reward: "Infinity status" }
];

export function calculateLevel(totalXp: number) {
  const currentIndex = levelDefinitions.findLastIndex((level) => totalXp >= level.minXp);
  const current = levelDefinitions[Math.max(currentIndex, 0)];
  const next = levelDefinitions[currentIndex + 1] ?? null;
  const progress = next
    ? Math.min(100, Math.round(((totalXp - current.minXp) / (next.minXp - current.minXp)) * 100))
    : 100;

  return {
    current,
    next,
    progress,
    xpToNextLevel: next ? Math.max(0, next.minXp - totalXp) : 0
  };
}
