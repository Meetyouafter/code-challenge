import { useEffect } from "react";
import { TOAST_DURATION_MS } from "@/constants";
import styles from "./Toast.module.scss";

interface IToast {
  message: string | null;
  onHide: () => void;
}

const Toast = ({ message, onHide }: IToast) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [message, onHide]);

  return (
    <div className={`${styles.toast} ${message ? styles.show : ""}`} role="status" aria-live="polite">
      {message && `✓ ${message}`}
    </div>
  );
};

export default Toast;
