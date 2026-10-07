import styles from "./Spinner.module.scss";

const Spinner = () => {
  return <div className={styles.spinner} role="status" aria-label="Loading" />;
};

export default Spinner;
