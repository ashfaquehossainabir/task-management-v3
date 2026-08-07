// Deterministically maps a name to one of a curated set of avatar colors,
// so the same person always gets the same color and different people are
// easy to tell apart at a glance.
const AVATAR_PALETTE = [
  "#6366f1", // indigo (brand)
  "#8b5cf6", // violet (brand)
  "#0ea5e9", // sky
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#ec4899", // pink
  "#22c55e", // green
  "#f97316", // orange
  "#3b82f6", // blue
  "#a855f7", // purple
];

export function getAvatarColor(name) {
  if (!name) return AVATAR_PALETTE[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}
