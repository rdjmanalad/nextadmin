"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./printReports.module.css";
import { isTokenExpired } from "@/app/auth";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { useRouter } from "next/navigation";

const PrintReports = () => {
  const [pm, setPm] = useState([]);
  const [mode, setMode] = useState("");
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [isCashPal, setIsCashPal] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const router = useRouter();

  const startDateRef = useRef();
  const endDateRef = useRef();

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
      getReference();
    }
  }, []);

  const getReference = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    let pcode = "PM";
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
  };

  const showForm = (e) => {
    if (e.target.value === "CASH/PALAWAN") {
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

  return (
    <div className={styles.container1}>
      <div className={styles.container}>
        <div className={styles.form}>
          <h3>Daily Transaction</h3>
          <div className={styles.row}>
            <label>Payment Mode:</label>
            <select
              placeholder="Payment Mode"
              onChange={(e) => {
                setMode(e.target.value);
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
        </div>
        <div className={styles.form}>
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
            Print Reports
          </button>
        </div>
        <div className={styles.form}>
          <h3>Existing Lay-away</h3>
          <button
            className={styles.buttons}
            onClick={(e) => {
              e.preventDefault();
              printLayaway(e);
            }}
          >
            Print Reports
          </button>
        </div>
      </div>
      <div className={styles.container}>
        {/* for cash palawan transactions */}
        <div
          className={styles.form}
          style={{ display: isCashPal ? "block" : "none" }}
        >
          <div className={styles.dailyForms}>
            <label>Date:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Beggining Bal:</label>
            <input />
          </div>
          <label className={styles.devider}>Add</label>
          <div className={styles.dailyForms}>
            <label>Payment Received:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>LBC Claimed:</label>
            <input />
          </div>
          <label className={styles.devider}>Less</label>
          <div className={styles.dailyForms}>
            <label>LBC Fees:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Game Price:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Refund/Forfeited:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Bank Transfer:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Trans Po:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Ending Bal:</label>
            <input />
          </div>
          <div>
            <br></br>
            <button className={styles.buttons}>Print Report</button>
          </div>
        </div>
        {/* for gcash transactions */}
        <div
          className={styles.form}
          style={{ display: isOther ? "block" : "none" }}
        >
          <div className={styles.dailyForms}>
            <label>Date:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Beggining Bal:</label>
            <input />
          </div>
          <label className={styles.devider}>Add</label>
          <div className={styles.dailyForms}>
            <label>Payment Received:</label>
            <input />
          </div>

          <label className={styles.devider}>Less</label>

          <div className={styles.dailyForms}>
            <label>Game Price:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Refund/Forfeited:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Bank Transfer:</label>
            <input />
          </div>
          <div className={styles.dailyForms}>
            <label>Ending Bal:</label>
            <input />
          </div>
          <div>
            <br></br>
            <button className={styles.buttons}>Print Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrintReports;
