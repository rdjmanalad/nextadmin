import { MdSupervisedUserCircle } from "react-icons/md";
import styles from "./card.module.css";

const Card = () => {
  return (
    <div className={styles.container}>
      <MdSupervisedUserCircle size={24} />
      <div className={styles.text}>
        <span className={styles.title}>Total Transaction</span>
        <span className={styles.number}>500.00</span>
        <span className={styles.detail}>
          <span className={styles.positive}>12%</span>Compare
        </span>
      </div>
    </div>
  );
};
export default Card;
