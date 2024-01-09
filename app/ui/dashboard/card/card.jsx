import { GiMoneyStack } from "react-icons/gi";
import styles from "./card.module.css";

const Card = ({ details }) => {
  return (
    <div className={styles.container}>
      <GiMoneyStack size={30} />
      <div className={styles.text}>
        <span className={styles.title}>{details.title}</span>
        <span className={styles.number}>{details.amount}</span>
        {/* <span className={styles.detail}>
          <span className={styles.positive}>12%</span>Compare
        </span> */}
        <br></br>
      </div>
    </div>
  );
};
export default Card;
