import RetryIcon from "@/assets/icons/retry.svg?react";
import WarningIcon from "@/assets/icons/warning.svg?react";
import styles from "./LoadError.module.scss";

interface ILoadError {
  onRetry: () => void;
}

const LoadError = ({ onRetry }: ILoadError) => {
  return (
    <div className={styles.loadError} role="alert">
      <div className={styles.icon} aria-hidden="true">
        <WarningIcon />
      </div>
      <h2 className={styles.title}>Couldn't load prices</h2>
      <p className={styles.text}>Check your connection and try again.</p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        <RetryIcon aria-hidden="true" />
        Try again
      </button>
    </div>
  );
};

export default LoadError;
