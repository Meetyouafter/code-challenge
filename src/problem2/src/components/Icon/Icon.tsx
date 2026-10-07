import { useState } from "react";
import { iconUrl } from "@/utils";
import styles from "./Icon.module.scss";

interface IIcon {
  symbol: string;
}

const Icon = ({ symbol }: IIcon) => {
  const [failedSymbol, setFailedSymbol] = useState<string | null>(null);
  const isFailed = failedSymbol === symbol;

  return (
    <span className={styles.icon}>
      {isFailed ? (
        symbol[0]
      ) : (
        <img key={symbol} src={iconUrl(symbol)} alt="" loading="lazy" onError={() => setFailedSymbol(symbol)} />
      )}
    </span>
  );
};

export default Icon;
