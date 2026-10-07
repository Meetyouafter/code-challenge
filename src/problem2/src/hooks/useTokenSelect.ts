import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { MOBILE_QUERY } from "@/constants";
import type { Token } from "@/types";

interface IUseTokenSelect {
  tokens: Token[];
  value: Token;
  onChange: (t: Token) => void;
}

export function useTokenSelect({ tokens, value, onChange }: IUseTokenSelect) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    const rank = (t: Token) => {
      const c = t.currency.toLowerCase();
      return c === q ? 0 : c.startsWith(q) ? 1 : 2;
    };
    return tokens.filter((t) => t.currency.toLowerCase().includes(q)).sort((a, b) => rank(a) - rank(b));
  }, [tokens, query]);

  useEffect(() => {
    if (isOpen) listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, activeIndex, filtered]);

  useEffect(() => {
    if (!isOpen || !window.matchMedia(MOBILE_QUERY).matches) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const open = () => {
    setQuery("");
    setActiveIndex(
      Math.max(
        0,
        tokens.findIndex((t) => t.currency === value.currency),
      ),
    );
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const toggle = () => (isOpen ? close() : open());

  const highlight = (i: number) => i !== activeIndex && setActiveIndex(i);

  const choose = (t: Token) => {
    onChange(t);
    close();
  };

  const search = (q: string) => {
    setQuery(q);
    setActiveIndex(0);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Tab":
        return setIsOpen(false);
      case "Enter":
        e.preventDefault();
        if (filtered[activeIndex]) choose(filtered[activeIndex]);
        return;
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        const step = e.key === "ArrowDown" ? 1 : -1;
        if (filtered.length) setActiveIndex((i) => (i + step + filtered.length) % filtered.length);
      }
    }
  };

  const optionId = (i: number) => `${listId}-${i}`;

  return {
    isOpen,
    query,
    filtered,
    activeIndex,
    highlight,
    buttonRef,
    listRef,
    listId,
    optionId,
    toggle,
    close,
    choose,
    search,
    onKeyDown,
  };
}
