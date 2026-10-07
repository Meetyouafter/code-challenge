import { useTokens } from "../../hooks/useTokens";
import Spinner from "../Spinner/Spinner";
import LoadError from "../LoadError/LoadError";
import ToastProvider from "../Toast/ToastContext";
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
