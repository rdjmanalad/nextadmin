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
      <GiMoneyStack size={30} />
      <div className={styles.text}>
        <span className={styles.title}>{details.title}</span>
        {/* <input ref={amountRef}></input> */}
        <span className={styles.number}>{currencyFormat(details.amount)}</span>
        {/* <span className={styles.detail}>
          <span className={styles.positive}>12%</span>Compare
        </span> */}
        <br></br>
      </div>
    </div>
  );
};
export default Card;
