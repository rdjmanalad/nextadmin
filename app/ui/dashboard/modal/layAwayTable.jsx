"use client";
import { AgGridReact } from "ag-grid-react";
import { useState, useCallback, useRef } from "react";
import styles from "./layAwayTable.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";

const LayAwayTable = ({ transactionId }) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");

  const onGridReady = useCallback((params) => {
    getLayAway();
  }, []);

  const getLayAway = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/layAwayPay/search/" + transactionId, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setRowData(data);
      });
  };

  const dateFormatter = (params) => {
    const timestamp = params.data.paymentDate;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return formatedDate;
  };

  const amountFormatter = (params) => {
    const amount = currencyFormat(params.data.amount);
    return amount;
  };

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  const columnDefs = [
    {
      headerName: "Transact Id",
      field: "transactionId",
      filter: "agTextColumnFilter",
      width: "110",
    },
    { headerName: "Payment Mode", field: "paymentMode", width: "120" },
    {
      headerName: "Payment Date",
      field: "paymentDate",
      width: "120",
      valueFormatter: dateFormatter,
    },
    {
      headerName: "Amount",
      field: "amount",
      width: "120",
      valueFormatter: amountFormatter,
    },
    {
      headerName: "Reference No.",
      field: "referenceNo",
      width: "120",
    },
  ];

  return (
    <div style={{ width: "620px" }}>
      <div className={`ag-theme-quartz ${styles.aggrid}`}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          //   autoSizeStrategy={autoSizeStrategy}
          rowSelection={"single"}
          //   onSelectionChanged={onSelectionChanged}
          ref={gridRef}
          onGridReady={onGridReady}
          alwaysShowHorizontalScroll={true}
        />
      </div>
    </div>
  );
};

export default LayAwayTable;
