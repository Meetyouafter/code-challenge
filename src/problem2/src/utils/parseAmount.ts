export function parseAmount(s: string): number {
  const n = Number(s.replace(",", "."));
  return s !== "" && Number.isFinite(n) ? n : NaN;
}
