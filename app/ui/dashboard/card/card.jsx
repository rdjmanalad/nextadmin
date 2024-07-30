import { GiMoneyStack } from "react-icons/gi";
import styles from "./card.module.css";
import { useEffect, useRef } from "react";

const Card = ({ details }) => {
  const titleRef = useRef();
  const amountRef = useRef();

  // useEffect(() => {
  //   amountRef.current.value = currencyFormat(details.amount);
  // }, [details]);

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        <span className={styles.title}>
          {/* <GiMoneyStack size={20} /> */}
          {details.title}
        </span>
        <span className={styles.number}>{currencyFormat(details.amount)}</span>
      </div>
      <div className={styles.text}>
        <span className={styles.sub}>
          <span>Cash In</span>
          <span className={styles.detail}>
            <span className={styles.positive}>
              {currencyFormat(details.cashIn)}
            </span>
          </span>
        </span>
        <span className={styles.sub}>
          <label>Cash Out</label>
          <span className={styles.detail}>
            <span className={styles.negative}>
              {currencyFormat(details.cashOut)}
            </span>
          </span>
        </span>
        <span className={styles.sub}>
          <label>Running Bal.</label>
          <span className={styles.detail}>
            <span className={styles.neutral}>
              {currencyFormat(details.runningBal)}
            </span>
          </span>
        </span>
      </div>
      <div></div>
    </div>
  );
};
export default Card;
