/**
 * Tracker utility functions
 */

// Calculate ability modifier from score
export function getModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

// Format modifier as string (+2, -1, etc.)
export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Format HP as fraction
export function formatHP(current: number, max: number): string {
  return `${current}/${max}`;
}

// Get HP percentage for health bar
export function getHPPercentage(current: number, max: number): number {
  return Math.max(0, Math.min(100, (current / max) * 100));
}

// Get HP color based on percentage
export function getHPColor(current: number, max: number): string {
  const pct = getHPPercentage(current, max);
  if (pct <= 25) return "#ef4444"; // red-500
  if (pct <= 50) return "#f59e0b"; // amber-500
  return "#22c55e"; // green-500
}
