"use client";
import { AgGridReact } from "ag-grid-react";
import { useState, useCallback, useRef } from "react";
// import styles from "./transactionModal.module.css";
import styles from "./cashCountModal.module.css";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";

const CashCountModal = ({ setOpenCashCount }) => {
  const [total, setTotal] = useState(0);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.modalContainer}>
        <div className={styles.search}>
          <h3>CASH COUNT</h3>
          <br></br>
          <label>Cash count date</label>
          <input type={"date"}></input>
          <button>Search</button>
        </div>
        <div className={styles.form}>
          <div className={styles.details}>
            <label>1000 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 1000);
              }}
            ></input>
            <label>500 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 500);
              }}
            ></input>
            <label>200 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 200);
              }}
            ></input>
            <label>100 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 100);
              }}
            ></input>
            <label>50 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 50);
              }}
            ></input>
            <label>20 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 20);
              }}
            ></input>
            <label>10 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 10);
              }}
            ></input>
            <label>5 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 5);
              }}
            ></input>
            <label>1 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value) * 1);
              }}
            ></input>
            <label>Decimal </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                setTotal(total + Number(e.target.value));
              }}
            ></input>
            <label>Total Amount</label>
            <input
              className={styles.total}
              maxLength={10}
              value={total}
            ></input>
          </div>
          <div></div>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.modalButtonCancel}
            onClick={(e) => {
              e.preventDefault();
              setOpenCashCount(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashCountModal;
