export const formatNumber = (n: number) =>
  n >= 1
    ? n.toLocaleString("en-US", { maximumFractionDigits: 4, useGrouping: false })
    : n.toLocaleString("en-US", { maximumSignificantDigits: 6, useGrouping: false });

export const formatUsd = (n: number) =>
  n > 0 && n < 0.01
    ? "< $0.01"
    : "≈ " + n.toLocaleString("en-US", { style: "currency", currency: "USD" });
