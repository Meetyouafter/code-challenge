import { useCallback, useState, type ReactNode } from "react";
import Toast from "./Toast";
import { ToastContext } from "./toastContext";

interface IToastProvider {
  children: ReactNode;
}

interface IToastMessage {
  id: number;
  text: string;
}

const ToastProvider = ({ children }: IToastProvider) => {
  const [message, setMessage] = useState<IToastMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback((text: string) => {
    setMessage({ id: Date.now(), text });
    setIsVisible(true);
  }, []);
  const hide = useCallback(() => setIsVisible(false), []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <Toast id={message?.id} text={message?.text} isVisible={isVisible} onHide={hide} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
