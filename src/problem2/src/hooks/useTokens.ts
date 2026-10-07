import { useCallback, useEffect, useState } from "react";
import { fetchTokens } from "../api/fetchTokens";
import type { Token } from "../types";

export function useTokens() {
  const [tokens, setTokens] = useState<Token[] | null>(null);
  const [isFailed, setIsFailed] = useState(false);

  const load = useCallback(() => {
    setIsFailed(false);
    fetchTokens()
      .then((t) => {
        if (t.length < 2) throw new Error("Not enough tokens");
        setTokens(t);
      })
      .catch(() => setIsFailed(true));
  }, []);

  useEffect(load, [load]);

  return { tokens, isLoading: !tokens && !isFailed, isFailed, retry: load };
}
