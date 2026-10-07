import { memo } from "react";
import type { Token } from "@/types";
import { useTokenSelect } from "@/hooks/useTokenSelect";
import CloseIcon from "@/assets/icons/close.svg?react";
import Icon from "@/components/Icon/Icon";
import styles from "./TokenSelect.module.scss";

interface ITokenSelect {
  tokens: Token[];
  value: Token;
  onChange: (t: Token) => void;
}

const TokenSelect = ({ tokens, value, onChange }: ITokenSelect) => {
  const {
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
  } = useTokenSelect({ tokens, value, onChange });

  return (
    <div className={styles.select}>
      <button
        type="button"
        ref={buttonRef}
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <Icon symbol={value.currency} />
        <span>{value.currency}</span>
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={close} aria-hidden="true" />
          <div className={styles.panel}>
            <div className={styles.header}>
              <span className={styles.heading}>Select token</span>
              <button type="button" className={styles.close} aria-label="Close" onClick={close}>
                <CloseIcon aria-hidden="true" />
              </button>
            </div>
            <div className={styles.searchWrap}>
              <input
                autoFocus
                className={styles.search}
                placeholder="Search token"
                aria-label="Search token"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={filtered.length ? optionId(activeIndex) : undefined}
                value={query}
                onChange={(e) => search(e.target.value)}
                onKeyDown={onKeyDown}
              />
              {query && (
                <button
                  type="button"
                  className={styles.clear}
                  aria-label="Clear search"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => search("")}
                >
                  <CloseIcon aria-hidden="true" />
                </button>
              )}
            </div>
            {filtered.length ? (
              <ul className={styles.list} role="listbox" id={listId} ref={listRef}>
                {filtered.map((t, i) => (
                  <li
                    key={t.currency}
                    id={optionId(i)}
                    role="option"
                    aria-selected={t.currency === value.currency}
                    className={`${styles.option} ${i === activeIndex ? styles.active : ""}`}
                    onMouseMove={() => highlight(i)}
                    onClick={() => choose(t)}
                  >
                    <Icon symbol={t.currency} />
                    <span>{t.currency}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>No tokens found</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(TokenSelect);
