"use client";

import { useState, useEffect } from "react";
import styles from "./transactionList.module.css";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const TransactionList = () => {
  const [pt, setPt] = useState([]);
  const [pm, setPm] = useState([]);
  const [payTerm, setPayTerm] = useState("");
  const [payMode, setPayMode] = useState("");
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");

  useEffect(() => {
    // setJwt(window.sessionStorage.getItem("jwt"));
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (window.sessionStorage.getItem("jwt") != null) {
      getReference();
    }
  }, []);

  const getReference = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    var pcode = "PT";
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
        setPt(data);
      });

    pcode = "PM";
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

  const rowData = [
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ];

  // Column definitions
  const columnDefs = [
    { headerName: "Make", field: "make" },
    { headerName: "Model", field: "model" },
    { headerName: "Price", field: "price" },
  ];

  return (
    <div className={styles.container}>
      {/* <h3>Filters</h3> */}
      <div className={styles.filters}>
        <label>Start Date</label>
        <input type="date" />
        <label>End Date</label>
        <input type="date" />
        <label>Payment Term</label>
        <select
          placeholder="Payment Terms"
          onChange={(e) => {
            setPayTerm(e.target.value);
          }}
        >
          <option></option>
          {pt.map((o, i) => (
            <option value={pt[i].name} key={pt[i].id}>
              {pt[i].name}
            </option>
          ))}
        </select>
        <label>Payment Mode</label>
        <select
          placeholder="Payment Mode"
          onChange={(e) => {
            setPayMode(e.target.value);
          }}
        >
          <option></option>
          {pm.map((o, i) => (
            <option value={pm[i].name} key={pm[i].id}>
              {pm[i].name}
            </option>
          ))}
        </select>
        <button className={styles.search}>Search</button>
      </div>
      <br></br>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};
export default TransactionList;
