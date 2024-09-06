"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./printReports.module.css";
import { isTokenExpired } from "@/app/auth";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageModal from "../modal/messageModal";
import ConfirmmModal from "../modal/confirmModal";
import { getRequestMeta } from "next/dist/server/request-meta";
import CashCountModal from "../modal/cashCountModal";

const PrintReportsGBW = () => {
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [userId, setUserId] = isClient
    ? useLocalState("userId", "")
    : ["", () => {}];
  const router = useRouter();
  const [pm, setPm] = useState([]);
  const [pr, setPr] = useState([]);
  const [ob, setOb] = useState([]);
  const [mode, setMode] = useState("");
  const [isCashPal, setIsCashPal] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const [balances, setBalances] = useState({});
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalConf, setOpenModalConf] = useState(false);
  const [openCashCount, setOpenCashCount] = useState(false);
  const [transDate, setTransDate] = useState("");
  const [sumTrans, setSumTrans] = useState(0);
  const [balDate, setBalDate] = useState(0);
  const [report, setReport] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [needCName, setNeedCName] = useState(false);

  const startDateRef = useRef();
  const endDateRef = useRef();
  const begBalRef1 = useRef();
  const begBalRef2 = useRef();
  const payRecRef1 = useRef();
  const payRecRef2 = useRef();
  const lbcClaimedRef1 = useRef();
  const lbcFeesRef1 = useRef();
  const gamePriceRef1 = useRef();
  const gamePriceRef2 = useRef();
  const forfeitedRef1 = useRef();
  const forfeitedRef2 = useRef();
  const endBalRef1 = useRef();
  const endBalRef2 = useRef();
  const bankTransferRef1 = useRef();
  const bankTransferRef2 = useRef();
  const transPoRef1 = useRef();
  const repDateRef = useRef();
  const ceRef1 = useRef();
  const ceRef2 = useRef();

  useEffect(() => {
    const jwtToken = window.sessionStorage.getItem("jwt");
    setBalDate(window.sessionStorage.getItem("balDate"));
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (jwtToken && isTokenExpired(jwtToken)) {
      router.push("/login");
      window.sessionStorage.clear();
    }
    if (jwtToken && !isTokenExpired(jwtToken)) {
      getReference();
      repDateRef.current.value = getTodayDate();
    }
  }, []);

  useEffect(() => {
    if (mode !== "") {
      getBalances();
    }
  }, [mode]);

  useEffect(() => {
    if (transDate !== "") {
      if (mode !== "") {
        getBalances();
      }
    }
  }, [transDate]);

  useEffect(() => {
    if (report === "layaway_existing_customer.jrxml") {
      setNeedCName(true);
    } else {
      setNeedCName(false);
    }
  }, [report]);

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const getReference = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    let pcode = "PM-GBW";
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/reference/byparent/" + pcode, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setPm(data);
      });

    pcode = "PR-GBW";
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/reference/byparent/" + pcode, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setPr(data);
        console.log(data);
      });

    pcode = "OB";
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/reference/byparent/" + pcode, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setOb(data);
        console.log(data);
      });
  };

  const showForm = (e) => {
    if (e.target.value === "CASH PALAWAN") {
      setIsCashPal(true);
      setIsOther(false);
    } else {
      setIsCashPal(false);
      setIsOther(true);
    }
    if (e.target.value === "") {
      setIsCashPal(false);
      setIsOther(false);
    }
  };

  const showFormCal = (e) => {
    e.preventDefault();
    if (mode === "") {
    } else {
      if (mode === "CASH PALAWAN") {
        setIsCashPal(true);
        setIsOther(false);
      } else {
        setIsCashPal(false);
        setIsOther(true);
      }
      if (mode === "") {
        setIsCashPal(false);
        setIsOther(false);
      }
    }
  };

  const printLayaway = (e) => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/reports/layaway", {
        headers: {
          contentType: "application/json",
          accept: "application/pdf",
        },
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var w = window.open(window.URL.createObjectURL(file));
      });
  };

  const printForfeited = (e) => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/reports/forfeited", {
        headers: {
          contentType: "application/json",
          accept: "application/pdf",
        },
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var w = window.open(window.URL.createObjectURL(file));
      });
  };

  const printAvailable = (e) => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/reports/availableOnHand", {
        headers: {
          contentType: "application/json",
          accept: "application/pdf",
        },
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var w = window.open(window.URL.createObjectURL(file));
      });
  };

  const printReport = (e) => {
    if (startDateRef.current.value === "" || endDateRef.current.value === "") {
      setMessage("Please select starting and end date");
      setOpenModal(true);
    } else if (report === "") {
      setMessage("Please select a report to print");
      setOpenModal(true);
    } else if (orderBy === "") {
      setMessage("Order by is empty");
      setOpenModal(true);
    } else if (needCName && customerName === "") {
      setMessage("Customer name is empty");
      setOpenModal(true);
      setCustomerName(customerName.toLocaleUpperCase());
    } else {
      if (!needCName) {
        setCustomerName("noName");
      }
      var dateFrom = startDateRef.current.value;
      var dateTo = endDateRef.current.value;
      axios
        .get(
          baseUrl +
            "/api/reports/print/" +
            dateFrom +
            "/" +
            dateTo +
            "/" +
            report +
            "/" +
            orderBy +
            "/" +
            customerName,
          {
            headers: {
              contentType: "application/json",
              accept: "application/pdf",
            },
            responseType: "blob",
          }
        )
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          var w = window.open(window.URL.createObjectURL(file));
        });
    }
  };

  const printSold = (e) => {
    var dateFrom = startDateRef.current.value;
    var dateTo = endDateRef.current.value;
    axios
      .get(baseUrl + "/api/reports/sold/" + dateTo + "/" + dateFrom, {
        headers: {
          contentType: "application/json",
          accept: "application/pdf",
        },
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var w = window.open(window.URL.createObjectURL(file));
      });
  };

  const printDailySummary = (e) => {
    const date = repDateRef.current.value;
    axios
      .get(baseUrl + "/api/reports/daily/summary/" + date, {
        headers: {
          contentType: "application/json",
          accept: "application/pdf",
        },
        responseType: "blob",
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var w = window.open(window.URL.createObjectURL(file));
      });
  };

  const printDaily1 = (e) => {
    const date = repDateRef.current.value;
    const begBal = begBalRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const payRec = payRecRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const lbcClaimed = lbcClaimedRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const lbcFees = lbcFeesRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const gamePrice = gamePriceRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const forfeited = forfeitedRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const bankTransfer = bankTransferRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const transPo = transPoRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const endBal = endBalRef1.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    axios
      .get(
        baseUrl +
          "/api/reports/daily1/" +
          date +
          "/" +
          begBal +
          "/" +
          payRec +
          "/" +
          lbcClaimed +
          "/" +
          lbcFees +
          "/" +
          gamePrice +
          "/" +
          forfeited +
          "/" +
          bankTransfer +
          "/" +
          transPo +
          "/" +
          endBal +
          "/" +
          mode,
        {
          headers: {
            contentType: "application/json",
            accept: "application/pdf",
          },
          responseType: "blob",
        }
      )
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var w = window.open(window.URL.createObjectURL(file));
      });
  };

  const printDaily2 = (e) => {
    const date = repDateRef.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const begBal = begBalRef2.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const payRec = payRecRef2.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const gamePrice = gamePriceRef2.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const forfeited = forfeitedRef2.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const bankTransfer = bankTransferRef2.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    const endBal = endBalRef2.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    axios
      .get(
        baseUrl +
          "/api/reports/daily2/" +
          date +
          "/" +
          begBal +
          "/" +
          payRec +
          "/" +
          gamePrice +
          "/" +
          forfeited +
          "/" +
          bankTransfer +
          "/" +
          endBal +
          "/" +
          mode,
        {
          headers: {
            contentType: "application/json",
            accept: "application/pdf",
          },
          responseType: "blob",
        }
      )
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var w = window.open(window.URL.createObjectURL(file));
      });
  };

  const getBalances = () => {
    var date = repDateRef.current.value;
    var jwt = window.sessionStorage.getItem("jwt");
    const modes = addEscapeCharacter(mode, "\\");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/dashboard/getBal/" + modes + "/" + date, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setBalances(data);
        if (mode === "CASH PALAWAN") {
          begBalRef1.current.value = currencyFormat(data.beginningBal);
          endBalRef1.current.value = currencyFormat(data.endingBal);
          payRecRef1.current.value = currencyFormat(data.addBal);
          forfeitedRef1.current.value = currencyFormat(data.lessBal);
          lbcClaimedRef1.current.value = currencyFormat(data.lbcClaimed);
          lbcFeesRef1.current.value = currencyFormat(data.lbcFees);
          gamePriceRef1.current.value = currencyFormat(data.gamePrize);
          forfeitedRef1.current.value = currencyFormat(data.forfeited);
          bankTransferRef1.current.value = currencyFormat(data.bankTransfer);
          transPoRef1.current.value = currencyFormat(data.transPo);
          ceRef1.current.value = currencyFormat(data.correctingEntry);
        } else {
          begBalRef2.current.value = currencyFormat(data.beginningBal);
          endBalRef2.current.value = currencyFormat(data.endingBal);
          payRecRef2.current.value = currencyFormat(data.addBal);
          forfeitedRef2.current.value = currencyFormat(data.lessBal);
          gamePriceRef2.current.value = currencyFormat(data.gamePrize);
          forfeitedRef2.current.value = currencyFormat(data.forfeited);
          bankTransferRef2.current.value = currencyFormat(data.bankTransfer);
          ceRef2.current.value = currencyFormat(data.correctingEntry);
        }
        // console.log(data);
      });
    getSum();
  };

  const getSum = () => {
    const date = repDateRef.current.value;
    let sumCash = 0;
    let sumLay = 0;
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/transactions/getSum/" + date + "/" + mode, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        // alert(data);
        sumCash = data;
      });

    axios
      .get(baseUrl + "/api/layAwayPay/getSum/" + date + "/" + mode, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        // alert(data);
        sumLay = data;
      });
    setSumTrans(sumCash + sumLay);
    // alert(sumCash);
    // alert(sumLay);
  };

  const saveBalance = () => {
    if (isCashPal) {
      balances.endingBal = endBalRef1.current.value
        .replaceAll(",", "")
        .replaceAll("₱", "");
    } else {
      balances.endingBal = endBalRef2.current.value
        .replaceAll(",", "")
        .replaceAll("₱", "");
    }
    balances;

    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/dashboard/save", balances, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data);
          setMessage("Saved");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const generateBalance = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/dashboard/balance/createNewBal", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage(response.data);
          setOpenModal(true);
          location.reload();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  function addEscapeCharacter(inputString, character) {
    // Use a regular expression to match all occurrences of the character
    const regex = new RegExp(`\\${character}`, "g");

    // Replace each occurrence of the character with the character preceded by an escape character
    return inputString.replace(regex, `\\${character}`);
  }

  const normalizeCurrency = (value) => {
    if (value != undefined) {
      return value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1")
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        .replace(/(?<=\.\d*),(?=\d+)/g, "")
        .replace(/(\.\d{2})\d*/g, "$1");
    }
  };

  const normalizeCurrency2 = (value) => {
    if (value !== undefined) {
      // Allow digits, decimal point, and negative sign
      return value
        .replace(/[^\d.-]/g, "")
        .replace(/(\..*)\./g, "$1") // Remove extra decimal points
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") // Add commas for thousands separator
        .replace(/(?<=\.\d*),(?=\d+)/g, "") // Remove comma before decimal digits
        .replace(/(\.\d{2})\d*/g, "$1"); // Limit to two decimal places
    }
  };

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  const balanceLess1 = () => {
    const add = Number(balances.lbcClaimed) + Number(balances.correctingEntry);
    const less =
      Number(balances.lbcFees) +
      Number(balances.gamePrize) +
      Number(balances.forfeited) +
      Number(balances.bankTransfer) +
      Number(balances.transPo);
    const base = Number(balances.endingBal);
    endBalRef1.current.value = currencyFormat(
      Number(base) - Number(less) + Number(add)
    );
    balances.lessBal = less;
  };

  const balanceLess2 = () => {
    const less =
      Number(balances.gamePrize) +
      Number(balances.forfeited) +
      Number(balances.bankTransfer);
    const base = Number(balances.endingBal);
    endBalRef2.current.value = currencyFormat(
      Number(base) - Number(less) + Number(balances.correctingEntry)
    );
    balances.lessBal = less;
  };

  const confirmOk = () => {
    // alert("sss");
    generateBalance();
  };

  const showCashCount = () => {
    // alert("cashcount");
    setOpenCashCount(true);
  };

  return (
    <div className={styles.container1}>
      <div className={styles.container}>
        <div className={styles.form}>
          <h3>Daily Transaction GBW</h3>
          <div className={styles.inputDate}>
            <label>Date</label>
            <input
              type="Date"
              ref={repDateRef}
              onChange={(e) => {
                setTransDate(e.target.value);
                showFormCal(e);
              }}
            ></input>
          </div>
          <div className={styles.row}>
            <label>Payment Mode:</label>
            <select
              placeholder="Payment Mode"
              onChange={(e) => {
                setMode(e.target.value);
                // getBalances();
                showForm(e);
              }}
            >
              <option></option>
              {pm.map((o, i) => (
                <option value={pm[i].name} key={pm[i].id}>
                  {pm[i].name}
                </option>
              ))}
            </select>
          </div>
          <hr></hr>
          <button
            className={styles.buttons}
            onClick={(e) => {
              e.preventDefault();
              printDailySummary(e);
            }}
          >
            Print Summary
          </button>
          <button
            className={styles.buttonsOra}
            onClick={(e) => {
              e.preventDefault();
              setMessage("Posting Balance for " + balDate + "?");
              setOpenModalConf(true);

              // generateBalance(e);
            }}
          >
            Post Balance
          </button>
        </div>
        <div className={styles.form}>
          <h3>Choose a Report</h3>
          <select
            onChange={(e) => {
              setReport(e.target.value);
            }}
          >
            <option></option>
            {pr.map((o, i) => (
              <option value={pr[i].description} key={pr[i].id}>
                {pr[i].name}
              </option>
            ))}
          </select>
          {needCName && (
            <div className={styles.inputDate}>
              <label>Customer Name</label>
              <input
                className={styles.inputName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                }}
              ></input>
            </div>
          )}
          <div className={styles.inputDate}>
            <label>Order By</label>
            <select
              onChange={(e) => {
                setOrderBy(e.target.value);
              }}
            >
              <option></option>
              {ob.map((o, i) => (
                <option value={ob[i].description} key={ob[i].id}>
                  {ob[i].name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputDate}>
            <label>Starting Date</label>
            <input type="Date" ref={startDateRef}></input>
          </div>
          <div className={styles.inputDate}>
            <label>End Date</label>
            <input type="Date" ref={endDateRef}></input>
          </div>
          <button
            className={styles.buttons}
            onClick={(e) => {
              e.preventDefault();
              printReport(e);
            }}
          >
            Print Report
          </button>
        </div>
        {/* <div className={styles.form}>
          <h3>Sold Monthly Reports</h3>
          <div className={styles.inputDate}>
            <label>Starting Date</label>
            <input type="Date" ref={startDateRef}></input>
          </div>
          <div className={styles.inputDate}>
            <label>End Date</label>
            <input type="Date" ref={endDateRef}></input>
          </div>
          <button
            className={styles.buttons}
            onClick={(e) => {
              e.preventDefault();
              printSold(e);
            }}
          >
            Print Report
          </button>
        </div> */}
        {/* <div className={styles.form}>
          <h3>Existing Lay-away</h3>
          <button
            className={styles.buttons}
            onClick={(e) => {
              e.preventDefault();
              printLayaway(e);
            }}
          >
            Print Report
          </button>
          <br></br>
          <h3>Forfeited Lay-away</h3>
          <button
            className={styles.buttons}
            onClick={(e) => {
              e.preventDefault();
              printForfeited(e);
            }}
          >
            Print Report
          </button>
        </div>
        <div className={styles.form}>
          <h3>Available on Hand Items</h3>
          <button
            className={styles.buttons}
            onClick={(e) => {
              e.preventDefault();
              printAvailable(e);
            }}
          >
            Print Report
          </button>
        </div> */}
      </div>
      <div className={styles.container}>
        {/* for cash palawan transactions */}

        <div
          className={styles.form}
          style={{ display: isCashPal ? "block" : "none" }}
        >
          {/* <div className={styles.dailyForms}>
            <label>Date:</label>
            <input ref={dateRef1} type="Date" />
          </div> */}
          <div>
            <button
              className={styles.buttonsOra}
              onClick={(e) => {
                e.preventDefault();
                showCashCount(e);
              }}
            >
              Show Cash Count
            </button>
          </div>
          <br></br>
          <div className={styles.dailyForms}>
            <label>Beginning Bal:</label>
            <input
              ref={begBalRef1}
              style={{ textAlign: "right" }}
              disabled
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
              }}
            />
          </div>
          <label className={styles.devider}>Add</label>
          <div className={styles.dailyForms}>
            <label>Payment Received:</label>
            <input
              ref={payRecRef1}
              disabled
              style={{ textAlign: "right" }}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
              }}
            />
          </div>
          <div className={styles.dailyForms}>
            <label>LBC Claimed:</label>
            <input
              ref={lbcClaimedRef1}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                const { nvalue } = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");

                balances.lbcClaimed = value;
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess1(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <label className={styles.devider}>Less</label>
          <div className={styles.dailyForms}>
            <label>LBC Fees:</label>
            <input
              ref={lbcFeesRef1}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                balances.lbcFees = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess1(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <div className={styles.dailyForms}>
            <label>Game Prize:</label>
            <input
              ref={gamePriceRef1}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                balances.gamePrize = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess1(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <div className={styles.dailyForms}>
            <label>Refund/Forfeited:</label>
            <input
              ref={forfeitedRef1}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                balances.forfeited = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess1(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <div className={styles.dailyForms}>
            <label>Bank Transfer:</label>
            <input
              ref={bankTransferRef1}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                balances.bankTransfer = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess1(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <div className={styles.dailyForms}>
            <label>Trans Po:</label>
            <input
              ref={transPoRef1}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                balances.transPo = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess1(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <hr style={{ marginBottom: "5px" }}></hr>
          <div className={styles.dailyForms}>
            <label>Correcting Entry(CE):</label>
            <input
              ref={ceRef1}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency2(value);
                balances.correctingEntry = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess1(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>

          <br></br>
          <div className={styles.dailyForms}>
            <label>Ending Bal:</label>
            <input
              disabled
              ref={endBalRef1}
              style={{ textAlign: "right", backgroundColor: "yellow" }}
              defaultValue="0.00"
            />
          </div>
          <br></br>
          <div className={styles.dailyForms}>
            <button
              className={styles.buttonSave}
              onClick={(e) => {
                e.preventDefault();
                saveBalance(e);
              }}
            >
              Save
            </button>
            <button
              className={styles.buttons}
              onClick={(e) => {
                e.preventDefault();
                printDaily1(e);
              }}
            >
              Print Report
            </button>
          </div>
        </div>
        {/* for gcash transactions */}
        <div
          className={styles.form}
          style={{ display: isOther ? "block" : "none" }}
        >
          {/* <div className={styles.dailyForms}>
            <label>Date:</label>
            <input type="Date" ref={dateRef2} />
          </div> */}
          <div className={styles.dailyForms}>
            <label>Beginning Bal:</label>
            <input
              disabled
              ref={begBalRef2}
              style={{ textAlign: "right" }}
              defaultValue="0.00"
            />
          </div>
          <label className={styles.devider}>Add</label>
          <div className={styles.dailyForms}>
            <label>Payment Received:</label>
            <input
              disabled
              ref={payRecRef2}
              style={{ textAlign: "right" }}
              defaultValue="0.00"
            />
          </div>

          <label className={styles.devider}>Less</label>

          <div className={styles.dailyForms}>
            <label>Game Price:</label>
            <input
              ref={gamePriceRef2}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                balances.gamePrize = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess2(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <div className={styles.dailyForms}>
            <label>Refund/Forfeited:</label>
            <input
              ref={forfeitedRef2}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                balances.forfeited = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess2(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <div className={styles.dailyForms}>
            <label>Bank Transfer:</label>
            <input
              ref={bankTransferRef2}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                balances.bankTransfer = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess2(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>
          <hr style={{ marginBottom: "5px" }}></hr>
          <div className={styles.dailyForms}>
            <label>Correcting Entry(CE):</label>
            <input
              ref={ceRef2}
              style={{ textAlign: "right" }}
              maxLength="10"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency2(value);
                balances.correctingEntry = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
              onBlur={(e) => {
                const { value } = e.target;
                balanceLess2(value.replaceAll(",", "").replaceAll("₱", ""));
                if (!isNaN(value)) {
                  e.target.value = currencyFormat(value);
                }
              }}
            />
          </div>

          <br></br>
          <div className={styles.dailyForms}>
            <label>Ending Bal:</label>
            <input
              disabled
              ref={endBalRef2}
              style={{ textAlign: "right", backgroundColor: "yellow" }}
              defaultValue="0.00"
            />
          </div>
          <div className={styles.dailyForms}>
            <button
              className={styles.buttonSave}
              onClick={(e) => {
                e.preventDefault();
                saveBalance();
              }}
            >
              Save
            </button>
            <button
              className={styles.buttons}
              onClick={(e) => {
                e.preventDefault();
                printDaily2(e);
              }}
            >
              Print Report
            </button>
          </div>
        </div>

        {openModal && (
          <MessageModal setOpenModal={setOpenModal} message={message} />
        )}
        {openModalConf && (
          <ConfirmmModal
            setOpenModalConf={setOpenModalConf}
            message={message}
            confirmOk={confirmOk}
          />
        )}
        {openCashCount && (
          <CashCountModal setOpenCashCount={setOpenCashCount} />
        )}
      </div>
      <br></br>
    </div>
  );
};
export default PrintReportsGBW;
