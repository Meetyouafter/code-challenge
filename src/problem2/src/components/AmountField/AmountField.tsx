import { AMOUNT_PATTERN } from "@/constants";
import type { Token } from "@/types";
import TokenSelect from "@/components/TokenSelect/TokenSelect";
import styles from "./AmountField.module.scss";

interface IAmountField {
  label: string;
  inputId: string;
  value: string;
  token: Token;
  tokens: Token[];
  usd: string;
  error: string;
  onValueChange: (v: string) => void;
  onTokenChange: (t: Token) => void;
}

const AmountField = ({ label, inputId, value, token, tokens, usd, error, onValueChange, onTokenChange }: IAmountField) => {
  return (
    <div className={`${styles.field} ${error ? styles.invalid : ""}`}>
      <label htmlFor={inputId}>{label}</label>
      <div className={styles.row}>
        <input
          id={inputId}
          className={styles.input}
          value={value}
          placeholder="0.0"
          inputMode="decimal"
          aria-describedby={`${inputId}-error`}
          onChange={(e) => AMOUNT_PATTERN.test(e.target.value) && onValueChange(e.target.value)}
        />
        <TokenSelect tokens={tokens} value={token} onChange={onTokenChange} />
      </div>
      <div className={styles.hint}>{usd}</div>
      <div className={styles.error} id={`${inputId}-error`} role="alert">
        {error}
      </div>
    </div>
  );
};

export default AmountField;
