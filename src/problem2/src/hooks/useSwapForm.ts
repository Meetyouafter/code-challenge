import { useState, type FormEvent } from "react";
import { DEFAULT_FROM_TOKEN, DEFAULT_TO_TOKEN, SWAP_DELAY_MS } from "@/constants";
import { useToast } from "@/components/Toast/ToastContext";
import type { Token } from "@/types";
import { convert, formatNumber, formatUsd, parseAmount } from "@/utils";

type Side = "from" | "to";

const findToken = (tokens: Token[], symbol: string, fallback: number) =>
  tokens.find((t) => t.currency === symbol) ?? tokens[fallback];

export function useSwapForm(tokens: Token[]) {
  const showToast = useToast();
  const [fromToken, setFromToken] = useState(() => findToken(tokens, DEFAULT_FROM_TOKEN, 0));
  const [toToken, setToToken] = useState(() => findToken(tokens, DEFAULT_TO_TOKEN, 1));
  const [edited, setEdited] = useState<Side>("from");
  const [typed, setTyped] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [srcToken, dstToken] = edited === "from" ? [fromToken, toToken] : [toToken, fromToken];
  const amount = parseAmount(typed);
  const isSameToken = fromToken.currency === toToken.currency;
  const isValid = amount > 0 && !isSameToken;

  const amountError = typed && !(amount > 0) ? "Enter an amount greater than 0" : "";
  const converted = isValid ? formatNumber(convert(amount, srcToken, dstToken)) : "";

  const editFrom = (v: string) => {
    setEdited("from");
    setTyped(v);
  };

  const editTo = (v: string) => {
    setEdited("to");
    setTyped(v);
  };

  const flip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setEdited(edited === "from" ? "to" : "from");
  };

  const fromValue = edited === "from" ? typed : converted;
  const toValue = edited === "to" ? typed : converted;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || isLoading) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, SWAP_DELAY_MS)); // mocked backend call
    setIsLoading(false);
    setTyped("");
    setEdited("from");
    showToast(`Swapped ${fromValue} ${fromToken.currency} → ${toValue} ${toToken.currency}`);
  };

  return {
    from: {
      value: fromValue,
      token: fromToken,
      error: edited === "from" ? amountError : "",
      onValueChange: editFrom,
      onTokenChange: setFromToken,
    },
    to: {
      value: toValue,
      token: toToken,
      error: (edited === "to" && amountError) || (isSameToken ? "Choose different tokens" : ""),
      onValueChange: editTo,
      onTokenChange: setToToken,
    },
    usd: isValid ? formatUsd(amount * srcToken.price) : "",
    rate: isSameToken ? "" : `1 ${fromToken.currency} ≈ ${formatNumber(convert(1, fromToken, toToken))} ${toToken.currency}`,
    isValid,
    isLoading,
    flip,
    submit,
  };
}
