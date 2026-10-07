import styles from "./SubmitButton.module.scss";

interface ISubmitButton {
  disabled: boolean;
  isLoading: boolean;
}

const SubmitButton = ({ disabled, isLoading }: ISubmitButton) => {
  return (
    <button type="submit" className={`${styles.submit} ${isLoading ? styles.loading : ""}`} disabled={disabled || isLoading}>
      {isLoading ? "SWAPPING…" : "CONFIRM SWAP"}
    </button>
  );
};

export default SubmitButton;
