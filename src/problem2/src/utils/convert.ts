import type { Token } from "@/types";

export const convert = (amount: number, from: Token, to: Token) => (amount * from.price) / to.price;
