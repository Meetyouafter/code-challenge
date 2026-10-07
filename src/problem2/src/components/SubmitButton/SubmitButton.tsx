import styles from "./SubmitButton.module.scss";

interface ISubmitButton {
  disabled: boolean;
  isLoading: boolean;
}

const label = (disabled: boolean, isLoading: boolean) => {
  if (isLoading) return "SWAPPING…";
  return disabled ? "ENTER AN AMOUNT" : "CONFIRM SWAP";
};

const SubmitButton = ({ disabled, isLoading }: ISubmitButton) => {
  return (
    <button
      type="submit"
      className={`${styles.submit} ${isLoading ? styles.loading : ""}`}
      disabled={disabled || isLoading}
    >
      {label(disabled, isLoading)}
    </button>
  );
};

export default SubmitButton;
