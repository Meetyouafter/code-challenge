# Problem 3: Messy React

The refactored component is in [`WalletPage.tsx`](./WalletPage.tsx). Below are the issues found in the original
code, grouped by impact, each with how to fix it.

## 1. Bugs (wrong output or does not compile)

### 1.1 `lhsPriority` is not defined

```ts
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {
```

`lhsPriority` doesn't exist in this scope. TypeScript rejects it, and in plain JS the filter throws a
`ReferenceError` on the first balance, so the page crashes. The intended variable is `balancePriority`.

### 1.2 The filter keeps the wrong balances

```ts
if (balance.amount <= 0) {
  return true;
}
```

This keeps only **empty or negative** balances and drops every balance the user actually holds. A wallet page
should show positive balances, so the condition must be `balance.amount > 0`.

### 1.3 `blockchain` is not part of `WalletBalance`

`balance.blockchain` is read everywhere, but `WalletBalance` only declares `currency` and `amount`, so this is a
type error. `getPriority(blockchain: any)` hides the problem instead of fixing it. Add `blockchain` to the interface
and type the parameter.

### 1.4 `rows` uses the unformatted list

`formattedBalances` is computed and then never used. `rows` maps over `sortedBalances` and annotates each item as
`FormattedWalletBalance`, but those items have no `formatted` field. `formattedAmount={balance.formatted}` is
therefore always `undefined`. With `strictFunctionTypes` this is also a compile error. The wrong annotation hides
the bug instead of catching it.

### 1.5 The sort comparator has no return for equal priorities

When `leftPriority === rightPriority`, the function falls through and returns `undefined`. The engine treats this
as `0`, so it happens to work, but only by accident. It also fails `noImplicitReturns`. The whole comparator can
be `(a, b) => b.priority - a.priority`, which returns a negative, positive or zero number in every case.

### 1.6 Missing prices give `NaN`

`prices[balance.currency] * balance.amount` returns `NaN` when there is no price for a currency, and the API
doesn't price every token. `NaN` then reaches `WalletRow` and is likely displayed as "NaN". Fall back explicitly
when the price is missing.

### 1.7 `toFixed()` drops all decimals

`toFixed()` with no argument means zero fraction digits, so `0.25 ETH` is shown as `"0"`. Crypto amounts are
often below 1, so the displayed amount is wrong for many balances. Pass the number of digits to keep, or use
`toLocaleString` with `maximumFractionDigits`.

## 2. Computational inefficiencies

### 2.1 `prices` is a dependency of `useMemo` but is not used inside it

```ts
const sortedBalances = useMemo(() => { /* only uses balances */ }, [balances, prices]);
```

Prices usually update much more often than balances. Each price tick re-filters and re-sorts the whole list for
nothing. The dependency array should be `[balances]`.

### 2.2 `getPriority` runs O(n log n) times inside `sort`

The comparator calls `getPriority` twice per comparison, so for `n` balances it runs about `2·n·log n` times,
plus `n` more times in `filter`. Compute the priority **once per balance** (map → filter → sort → map) and
compare the stored numbers.

### 2.3 Derived data is rebuilt on every render

`formattedBalances` and `rows` are recalculated on every render of `WalletPage`, even when neither balances nor
prices changed, for example when a parent re-renders. Formatting and row creation should be memoized on what they
actually depend on: `sortedBalances` and `prices`.

### 2.4 Two passes where one is enough

The original maps the list once for `formattedBalances` (unused) and again for `rows`. Formatting and the USD
value can be computed in the same pass that builds the rows.

## 3. Anti-patterns and code quality

### 3.1 `key={index}` on a sorted, filtered list

The order and length of the list change when balances change. With index keys, React matches rows by position.
It then reuses the wrong `WalletRow` instances, keeps their internal state on the wrong item and re-renders more
than needed. Use a stable unique key such as `` `${blockchain}-${currency}` ``.

### 3.2 `getPriority` is declared inside the component

It is a pure function with no dependency on props or state, but it is re-created on every render. It is also used
inside `useMemo` without being listed as a dependency, which the `react-hooks/exhaustive-deps` lint rule flags.
Move it to module scope.

### 3.3 A `switch` used as a lookup table, with magic numbers

The `switch` maps a string to a number. A `Record` lookup is shorter, easier to extend and cannot fall through by
mistake. `Zilliqa` and `Neo` duplicate the same branch. The `-99` sentinel appears in two places. Give it a name
(`UNKNOWN_PRIORITY`) so the filter and `getPriority` cannot drift apart.

### 3.4 BoxProps spread onto a `<div>`

`Props extends BoxProps`, but `...rest` is spread onto a plain `<div>`. Box-specific props such as `sx`, `p` or
`display` are not valid DOM attributes. React warns about them, and the styling the caller passed is silently
lost. The props type must match the element that receives them: either render `<Box {...rest}>`, or keep the
`<div>` and type the props as `HTMLAttributes<HTMLDivElement>`. The refactor does the latter.

### 3.5 `children` is destructured and then ignored

`children` is pulled out of props but never rendered, so anything passed between the tags disappears without a
warning. Either render it or make it explicit that the component does not accept children.

### 3.6 Weak or redundant typing

- `interface Props extends BoxProps {}` is an empty interface, flagged by `no-empty-interface`. Use
  `type WalletPageProps = BoxProps` instead.
- `React.FC<Props>` together with `(props: Props)` declares the type twice. Typing the props parameter is enough.
- `FormattedWalletBalance` copies the fields of `WalletBalance` instead of extending it, so the two can drift
  apart.
- `blockchain: any` turns off type checking where a typo, for example `'Etherium'`, would silently get priority
  `-99`.

### 3.7 Things that are not defined in the snippet

`classes`, `useWalletBalances`, `usePrices`, `WalletRow`, `BoxProps` and `useMemo` are used without imports or
declarations. I assume they come from the surrounding codebase: `classes` from a `makeStyles` hook and `Box` from
MUI. To make the refactor compile on its own, `WalletPage.tsx` replaces them with small typed stubs.

## Summary of the refactor

- Fixed the filter (`balancePriority`, `amount > 0`) and added `blockchain` to the type.
- Priorities moved to a module-level `Record` with a named `UNKNOWN_PRIORITY`.
- The priority is computed once per balance, and the sort uses a numeric comparator that always returns a value.
- `useMemo` depends only on what it uses: sorting depends on `balances`, rows on `sortedBalances` and `prices`.
- Formatting happens once, in the same pass that builds the rows, and keeps fractional digits.
- Missing prices are handled explicitly.
- Stable keys, props typed for the `<div>` they are spread onto, and no ignored `children`.

Type-check the refactor with `npx tsc -p src/problem3` from the repository root.
