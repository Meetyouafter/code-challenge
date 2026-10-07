import type { Token } from "@/types";
import { useSwapForm } from "@/hooks/useSwapForm";
import AmountField from "@/components/AmountField/AmountField";
import FlipButton from "@/components/FlipButton/FlipButton";
import SubmitButton from "@/components/SubmitButton/SubmitButton";
import styles from "./SwapForm.module.scss";

interface ISwapForm {
  tokens: Token[];
}

const SwapForm = ({ tokens }: ISwapForm) => {
  const { from, to, usd, rate, isValid, isLoading, flip, submit } = useSwapForm(tokens);

  return (
    <form className={styles.form} onSubmit={submit} autoComplete="off">
      <fieldset className={styles.fields} disabled={isLoading}>
        <AmountField label="Amount to send" inputId="input-amount" tokens={tokens} usd={usd} {...from} />
        <FlipButton onClick={flip} />
        <AmountField label="Amount to receive" inputId="output-amount" tokens={tokens} usd={usd} {...to} />
      </fieldset>
      <div className={styles.rate} aria-live="polite">
        {rate}
      </div>
      <SubmitButton disabled={!isValid} isLoading={isLoading} />
    </form>
  );
};

export default SwapForm;
