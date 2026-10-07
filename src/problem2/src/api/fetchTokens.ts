import { PRICES_URL } from "../constants";
import type { Token } from "../types";

export async function fetchTokens(): Promise<Token[]> {
  const res = await fetch(PRICES_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: Token[] = await res.json();

  // the feed has duplicate currencies — keep one entry per currency
  const unique = new Map(data.filter((t) => t.price > 0).map((t) => [t.currency, t]));
  return [...unique.values()].sort((a, b) => a.currency.localeCompare(b.currency));
}
