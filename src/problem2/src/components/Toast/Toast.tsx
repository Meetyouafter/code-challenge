import { useEffect } from "react";
import { TOAST_DURATION_MS } from "@/constants";
import styles from "./Toast.module.scss";

interface IToast {
  id?: number;
  text?: string;
  isVisible: boolean;
  onHide: () => void;
}

const Toast = ({ id, text, isVisible, onHide }: IToast) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onHide, TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [id, isVisible, onHide]);

  return (
    <div className={`${styles.toast} ${isVisible ? styles.show : ""}`} role="status">
      {text && (
        <>
          <span aria-hidden="true">✓ </span>
          {text}
        </>
      )}
    </div>
  );
};

export default Toast;
