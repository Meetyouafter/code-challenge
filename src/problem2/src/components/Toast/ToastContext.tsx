import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import Toast from "./Toast";

const ToastContext = createContext<((message: string) => void) | null>(null);

interface IToastProvider {
  children: ReactNode;
}

const ToastProvider = ({ children }: IToastProvider) => {
  const [message, setMessage] = useState<string | null>(null);
  const hide = useCallback(() => setMessage(null), []);

  return (
    <ToastContext.Provider value={setMessage}>
      {children}
      <Toast message={message} onHide={hide} />
    </ToastContext.Provider>
  );
};

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used within ToastProvider");
  return show;
}

export default ToastProvider;
