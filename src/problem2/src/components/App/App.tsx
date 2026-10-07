import { useTokens } from "@/hooks/useTokens";
import Spinner from "@/components/Spinner/Spinner";
import LoadError from "@/components/LoadError/LoadError";
import ToastProvider from "@/components/Toast/ToastContext";
import styles from "./App.module.scss";

const App = () => {
  const { tokens, isLoading, retry } = useTokens();

  return (
    isLoading
      ? <Spinner />
      : (
        <ToastProvider>
          <main className={styles.card}>
            <LoadError onRetry={retry} />
          </main>
        </ToastProvider>
      )
  )
};

export default App;
