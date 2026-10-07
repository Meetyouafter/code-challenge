# 99Tech Code Challenge #1

My solutions to the three problems. Each one lives in its own folder under `src/`.

## Problem 1: Three ways to sum to n

[`src/problem1/index.ts`](src/problem1/index.ts) has three implementations of `sum_to_n`:

The task doesn't say what to return for `n <= 0`, so all three return `0` in that case.

```bash
npm install
npm run typecheck
```

## Problem 2: Fancy Form

[`src/problem2`](src/problem2) is a currency swap form built with Vite, React, TypeScript and SCSS modules. It has
its own `package.json`.

- Live prices from `prices.json`. Tokens without a price are hidden.
- Token icons from the Switcheo token-icons repo, with a fallback letter when an icon is missing.
- Two-way conversion with the USD value and the exchange rate.
- Input validation, a searchable token picker with keyboard navigation, and a mocked swap request with a loading
  state and a toast.
- Responsive from 280px. On mobile the token picker opens as a bottom sheet.

```bash
cd src/problem2
npm install
npm run dev       
npm run build
npm run lint      
npm run format    
```

## Problem 3: Messy React

- [`src/problem3/README.md`](src/problem3/README.md) lists the bugs, inefficiencies and anti-patterns in the
  original code and explains how to fix each one.
- [`src/problem3/WalletPage.tsx`](src/problem3/WalletPage.tsx) is the refactored component.
- [`src/problem3/index.tsx`](src/problem3/index.tsx) is the original code, kept unchanged for reference.

Type-check the refactor from the repository root:

```bash
npx tsc -p src/problem3
```
