import { useContext } from "react";
import { ToastContext } from "@/components/Toast/toastContext";

export function useToast() {
  const show = useContext(ToastContext);
  if (!show) throw new Error("useToast must be used within ToastProvider");
  return show;
}
