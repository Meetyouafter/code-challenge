import { useMemo, type HTMLAttributes } from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

// Not every currency has a price, so a lookup can return undefined.
type Prices = Partial<Record<string, number>>;

interface WalletRowProps {
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
}

// The component renders a <div>, so it accepts the props of a <div>.
type WalletPageProps = HTMLAttributes<HTMLDivElement>;

// --- Stubs for what the original snippet takes from the surrounding codebase ---

const useWalletBalances = (): WalletBalance[] => [
  { currency: "OSMO", amount: 12.5, blockchain: "Osmosis" },
  { currency: "ETH", amount: 0.25, blockchain: "Ethereum" },
  { currency: "ZIL", amount: 0, blockchain: "Zilliqa" },
];

const usePrices = (): Prices => ({ OSMO: 0.38, ETH: 1645.93 });

const classes = { row: "wallet-row" };

const WalletRow = ({ className, formattedAmount, usdValue }: WalletRowProps) => (
  <div className={className}>
    {formattedAmount} (${usdValue.toFixed(2)})
  </div>
);

// --- Component ---

const UNKNOWN_PRIORITY = -99;

// Module scope: a pure lookup, no need to re-create it on every render.
const BLOCKCHAIN_PRIORITY: Partial<Record<string, number>> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => BLOCKCHAIN_PRIORITY[blockchain] ?? UNKNOWN_PRIORITY;

const formatAmount = (amount: number): string => amount.toLocaleString("en-US", { maximumFractionDigits: 6 });

const WalletPage = (props: WalletPageProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Depends only on balances, so price updates don't re-sort the list.
  // Priority is computed once per balance instead of on every comparison.
  const sortedBalances = useMemo(
    () =>
      balances
        .map((balance) => ({ balance, priority: getPriority(balance.blockchain) }))
        .filter(({ balance, priority }) => priority > UNKNOWN_PRIORITY && balance.amount > 0)
        .sort((a, b) => b.priority - a.priority)
        .map(({ balance }) => balance),
    [balances],
  );

  // Formatting and the USD value are computed in the same single pass that builds the rows.
  const rows = useMemo(
    () =>
      sortedBalances.map((balance) => {
        const price = prices[balance.currency];
        return (
          <WalletRow
            key={`${balance.blockchain}-${balance.currency}`}
            className={classes.row}
            amount={balance.amount}
            usdValue={price === undefined ? 0 : price * balance.amount}
            formattedAmount={formatAmount(balance.amount)}
          />
        );
      }),
    [sortedBalances, prices],
  );

  // Explicit JSX children take precedence over `props.children`, so the rows always render.
  return <div {...props}>{rows}</div>;
};

export default WalletPage;
