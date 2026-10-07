import { useTokens } from "@/hooks/useTokens";
import Spinner from "@/components/Spinner/Spinner";
import LoadError from "@/components/LoadError/LoadError";
import SwapForm from "@/components/SwapForm/SwapForm";
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
            {tokens ? (
              <>
                <h1 className={styles.title}>Swap</h1>
                <SwapForm tokens={tokens} />
              </>
            ) : (
              <LoadError onRetry={retry} />
            )}
          </main>
        </ToastProvider>
      )
  )
};

export default App;
