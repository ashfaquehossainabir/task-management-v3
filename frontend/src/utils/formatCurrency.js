// Formats a numeric project value as a compact USD string.
// Examples: 1200 -> "$1.2K", 3400000 -> "$3.4M", 50000000000000 -> "$50T"
const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

export function formatCurrency(amount) {
  const num = Number(amount);

  if (!Number.isFinite(num) || num === 0) return null;

  const sign = num < 0 ? "-" : "";
  return `${sign}$${compactFormatter.format(Math.abs(num))}`;
}

// Full, uncompacted value for tooltips (e.g. "$50,000,000,000,000")
export function formatCurrencyFull(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num)) return null;
  return `$${num.toLocaleString("en-US")}`;
}
