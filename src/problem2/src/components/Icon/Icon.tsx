import { useState } from "react";
import { iconUrl } from "@/utils";
import styles from "./Icon.module.scss";

interface IIcon {
  symbol: string;
}

const Icon = ({ symbol }: IIcon) => {
  const [isFailed, setIsFailed] = useState(false);

  return (
    <span className={styles.icon}>
      {isFailed ? symbol[0] : <img src={iconUrl(symbol)} alt="" onError={() => setIsFailed(true)} />}
    </span>
  );
};

export default Icon;
