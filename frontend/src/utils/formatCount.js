/**
 * Formats a number into a compact, human-readable string for stat cards.
 * e.g. 950 -> "950", 1200 -> "1.2K", 1000000 -> "1M", 2500000 -> "2.5M"
 *
 * @param {number} value - The raw count to format.
 * @returns {string} Compact formatted string.
 */
export function formatCount(value) {
  const num = Number(value) || 0;

  if (num < 1000) {
    return String(num);
  }

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(num);
}
