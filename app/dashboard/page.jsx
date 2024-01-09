import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
// import Transaction from "../ui/dashboard/transaction";
import styles from "../ui/dashboard/dashboard.module.css";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import Transaction from "../ui/dashboard/transaction/transaction";

const Dashboard = () => {
  const totalBal = {
    title: "Transaction Today",
    amount: "28,000.00",
  };

  const startingBal = {
    title: "Starting Balance",
    amount: "12,000.00",
  };

  const runningBal = {
    title: "Running Balance",
    amount: "30,000.00",
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          <Card details={startingBal} />
          <Card details={totalBal} />
          <Card details={runningBal} />
        </div>
        {/* <Transaction /> */}
        <Chart />
      </div>
      {/* <div className={styles.side}>
        <Rightbar />
      </div> */}
    </div>
  );
};
export default Dashboard;
