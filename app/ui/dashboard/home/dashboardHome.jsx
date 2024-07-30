"use client";
import Card from "../card/card";
import Chart from "../chart/chart";
import styles from "./dashboard.module.css";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/auth";
import Rightbar from "../rightbar/rightbar";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const DashboardHome = () => {
  const isClient = typeof window !== "undefined";
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [balance, setBalance] = useState();
  const [userId, setUserId] = isClient
    ? useLocalState("userId", "")
    : ["", () => {}];

  const [begBal, setBegBal] = useState("0");
  const [endBal, setEndBal] = useState("");
  const [addBal, setAddBal] = useState("");
  const [lesBal, setLesBal] = useState("");
  const [bal, setBal] = useState([]);
  const [isCash, setIsCash] = useState(false);
  const [toDisplay, setToDisplay] = useState(false);
  const [toDisplayTable, setToDisplayTable] = useState(false);
  const [balances, setBalances] = useState([]);
  const [cashPalawan, setCashPalawan] = useState("");
  const [displayRight, setDisplayRight] = useState(false);
  const [balDate, setBalDate] = isClient
    ? useLocalState("balDate", "")
    : ["", () => {}];

  const onGridReady = useCallback((params) => {
    getAllBalances();
  }, []);

  var balvar = {};

  const startingBal = {
    title: "Starting Balance",
    amount: begBal,
  };

  const addBalance = {
    title: "Add Balance",
    amount: addBal,
  };

  const lessBalance = {
    title: "Less Balance",
    amount: lesBal,
  };

  const endingBal = {
    title: "Ending Balance",
    amount: endBal,
  };

  useEffect(() => {
    // setJwt(window.sessionStorage.getItem("jwt"));
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (jwtToken && isTokenExpired(jwtToken)) {
      router.push("/login");
      window.sessionStorage.clear();
    }
    if (jwtToken && !isTokenExpired(jwtToken)) {
      // getBalances();
      getAllBalances();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    }
  }, []);

  useEffect(() => {
    if (begBal !== "0") {
      setToDisplay(true);
    }
  }, [begBal, addBal, lesBal, endBal]);

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const convertDateString = (dateStr) => {
    const parts = dateStr.split("/");
    let month = parts[0];
    let day = parts[1];
    const year = parts[2];
    if (month.length === 1) {
      month = "0" + month;
    }
    if (day.length === 1) {
      day = "0" + day;
    }
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const getBalances = () => {
    setToDisplay(false);
    const date = getTodayDate();
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/dashboard/balance/" + userId + "/" + date, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        startingBal.amount = data.beginningBal;
        setAddBal(data.addBal);
        setLesBal(data.lessBal);
        setEndBal(data.endingBal);
        setBegBal(data.beginningBal);

        // console.log("begBal" + begBal);
        // console.log(startingBal);
      });
  };

  const getAllBalances = async () => {
    // const date = getTodayDate();
    const date = convertDateString(balDate);
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/dashboard/balance/all/" + date, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setBalances(data);
        // console.log(data);
      });
  };

  const begBalFormatter = (params) => {
    const amount = currencyFormat(params.data.beginningBal);
    return amount;
  };

  const addBalFormatter = (params) => {
    const amount = currencyFormat(params.data.addBal);
    return amount;
  };

  const lessBalFormatter = (params) => {
    const amount = currencyFormat(params.data.lessBal);
    return amount;
  };

  const endBalFormatter = (params) => {
    const amount = currencyFormat(params.data.endingBal);
    return amount;
  };

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  const columnDefs = [
    {
      headerName: "Account Name",
      field: "accountName",
      width: "200",
    },
    {
      headerName: "Beginning Balance",
      field: "beginningBal",
      width: "180",
      valueFormatter: begBalFormatter,
    },
    {
      headerName: "Add",
      field: "addBal",
      width: "150",
      valueFormatter: addBalFormatter,
    },
    {
      headerName: "Less",
      field: "lessBal",
      width: "150",
      valueFormatter: lessBalFormatter,
    },
    {
      headerName: "Ending Balance",
      field: "endingBal",
      width: "180",
      valueFormatter: endBalFormatter,
    },
  ];

  const tiles = (bal) => {
    // alert(bal.id);
    let cashout =
      Number(bal.lbcFees) +
      Number(bal.gamePrize) +
      Number(bal.forfeited) +
      Number(bal.bankTransfer) +
      Number(bal.transPo);

    let cashin = Number(bal.addBal) + Number(bal.lbcClaimed);

    let det = {
      amount: bal.beginningBal,
      title: bal.accountName,
      currentTransaction: bal.addBal,
      cashOut: cashout,
      corrAmt: bal.correctingEntry,
      cashIn: cashin,
      runningBal: bal.endingBal,
    };
    return <Card details={det} />;
  };

  return (
    <div>
      <div className={styles.title}>
        <h2>Balance</h2>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          {balances.length > 0 && (
            <div className={styles.cards}>
              {balances.map((balance) => tiles(balance))}

              {/* <Card details={startingBal} />
            <Card details={addBalance} />
            <Card details={lessBalance} />
            <Card details={endingBal} /> */}
              {/* {tiles()} */}
            </div>
          )}
          {toDisplayTable && (
            <div className={styles.container2}>
              <h2 className={styles.header}>Balances</h2>
              <div className={styles.balTable}>
                <div
                  className={`ag-theme-quartz ${styles.aggrid}`}
                  style={{
                    "--ag-header-background-color": "rgb(202, 202, 202)",
                    "--ag-odd-row-background-color": "rgb(241, 241, 241)",
                  }}
                >
                  <AgGridReact
                    rowData={balances}
                    columnDefs={columnDefs}
                    rowSelection={"single"}
                    // ref={gridRef}
                    onGridReady={onGridReady}
                    alwaysShowHorizontalScroll={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {displayRight && (
          <div className={styles.side}>
            <Rightbar />
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardHome;
