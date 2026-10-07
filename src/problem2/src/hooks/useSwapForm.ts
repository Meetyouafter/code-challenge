import { useCallback, useState, type FormEvent } from "react";
import { DEFAULT_FROM_TOKEN, DEFAULT_TO_TOKEN, SWAP_DELAY_MS } from "@/constants";
import { useToast } from "@/hooks/useToast";
import type { Token } from "@/types";
import { convert, formatNumber, formatUsd, parseAmount } from "@/utils";

type Side = "from" | "to";

interface IPair {
  from: Token;
  to: Token;
}

const initialPair = (tokens: Token[]): IPair => {
  const from = tokens.find((t) => t.currency === DEFAULT_FROM_TOKEN) ?? tokens[0];
  const to = tokens.find((t) => t.currency === DEFAULT_TO_TOKEN && t !== from) ?? tokens.find((t) => t !== from)!;
  return { from, to };
};

export function useSwapForm(tokens: Token[]) {
  const showToast = useToast();
  const [pair, setPair] = useState(() => initialPair(tokens));
  const [edited, setEdited] = useState<Side>("from");
  const [typed, setTyped] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [srcToken, dstToken] = edited === "from" ? [pair.from, pair.to] : [pair.to, pair.from];
  const amount = parseAmount(typed);
  const isValid = amount > 0;
  const amountError = typed && !isValid ? "Enter an amount greater than 0" : "";
  const converted = isValid ? formatNumber(convert(amount, srcToken, dstToken)) : "";

  const fromValue = edited === "from" ? typed : converted;
  const toValue = edited === "to" ? typed : converted;

  const selectFrom = useCallback(
    (t: Token) => setPair((p) => (t.currency === p.to.currency ? { from: t, to: p.from } : { ...p, from: t })),
    [],
  );
  const selectTo = useCallback(
    (t: Token) => setPair((p) => (t.currency === p.from.currency ? { from: p.to, to: t } : { ...p, to: t })),
    [],
  );

  const edit = (side: Side) => (v: string) => {
    setEdited(side);
    setTyped(v);
  };

  const flip = () => {
    setPair((p) => ({ from: p.to, to: p.from }));
    setEdited(edited === "from" ? "to" : "from");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    setIsLoading(true);
    try {
      await new Promise((r) => setTimeout(r, SWAP_DELAY_MS)); // mocked backend call
      setTyped("");
      setEdited("from");
      showToast(`Swapped ${fromValue} ${pair.from.currency} → ${toValue} ${pair.to.currency}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    from: {
      value: fromValue,
      token: pair.from,
      error: edited === "from" ? amountError : "",
      onValueChange: edit("from"),
      onTokenChange: selectFrom,
    },
    to: {
      value: toValue,
      token: pair.to,
      error: edited === "to" ? amountError : "",
      onValueChange: edit("to"),
      onTokenChange: selectTo,
    },
    // conversion keeps the USD value, so both sides share it
    usd: isValid ? formatUsd(amount * srcToken.price) : "",
    rate: `1 ${pair.from.currency} ≈ ${formatNumber(convert(1, pair.from, pair.to))} ${pair.to.currency}`,
    isValid,
    isLoading,
    flip,
    submit,
  };
}
