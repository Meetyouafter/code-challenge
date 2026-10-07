export function parseAmount(s: string): number {
  const value = s.trim().replace(",", ".");
  if (!/^\d*\.?\d+$|^\d+\.$/.test(value)) return NaN;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}
