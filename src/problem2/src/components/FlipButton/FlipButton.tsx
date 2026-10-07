import styles from "./FlipButton.module.scss";

interface IFlipButton {
  onClick: () => void;
}

const FlipButton = ({ onClick }: IFlipButton) => {
  return (
    <button type="button" className={styles.flip} aria-label="Swap tokens" onClick={onClick}>
      ⇅
    </button>
  );
};

export default FlipButton;
