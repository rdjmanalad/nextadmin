"use client";
import { AgGridReact } from "ag-grid-react";
import { useState, useCallback, useRef } from "react";
import styles from "./transactionModal.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";

const TransactionModal = ({ setOpenModalTran, setTrans }) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [rowSelected, setRowSelected] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const onGridReady = useCallback((params) => {
    getAll();
  }, []);

  const getAll = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/transactions/all/", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setRowData(data);
      });
  };

  const searchFiltered = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(
        baseUrl +
          "/api/transactions/search/" +
          startDate +
          "/" +
          endDate +
          "/" +
          "-" +
          "/" +
          "-",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        // console.log(data);
        setRowData(data);
      });
  };

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setTrans(selectedRows);
  }, []);

  const dateFormatter = (params) => {
    const timestamp = params.data.transactDate;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return formatedDate;
  };

  const discountedFormatter = (params) => {
    const amount = currencyFormat(params.data.discountedPrice);
    return amount;
  };

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  const autoSizeStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 50,
    columnLimits: [
      {
        colId: "description",
        minWidth: 100,
      },
      {
        colId: "paymentTerm",
        minWidth: 100,
      },
      {
        colId: "paymentMode",
        minWidth: 100,
      },
    ],
  };

  const columnDefs = [
    {
      headerName: "Code No.",
      field: "codeNo",
      filter: "agTextColumnFilter",
      width: "180",
    },
    { headerName: "Inventory No", field: "inventoryNo", width: "120" },
    {
      headerName: "Discounted",
      field: "discountedPrice",
      width: "120",
      valueFormatter: discountedFormatter,
    },
    { headerName: "Payment Term", field: "paymentTerm", width: "120" },
    { headerName: "Payment Mode", field: "paymentMode", width: "120" },
  ];

  const onQuickFilterChange = (event) => {
    setQuickFilterText(event.target.value);
    gridRef.current.api.setQuickFilter(event.target.value);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.modalContainer}>
        <div style={{ width: "620px" }}>
          <h3>Transaction List</h3>
          <br></br>
          <div className={styles.search}>
            <label>Transaction Date from</label>
            <input
              type="date"
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            ></input>
            <label>&nbsp;&nbsp;&nbsp;&nbsp;to</label>
            <input
              type="date"
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            ></input>
            <button
              onClick={(e) => {
                searchFiltered(e);
              }}
            >
              Search
            </button>
          </div>
          <hr></hr>
          <div className={styles.quickSearch}>
            <label>Quick Filter: </label>
            <input
              type="text"
              value={quickFilterText}
              onChange={onQuickFilterChange}
              placeholder="Type Here to filter..."
            />
          </div>
          <div
            className={`ag-theme-quartz ${styles.aggrid}`}
            style={{
              "--ag-header-background-color": "rgb(202, 202, 202)",
              "--ag-odd-row-background-color": "rgb(241, 241, 241)",
            }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              // domLayout="autoHeight"
              autoSizeStrategy={autoSizeStrategy}
              rowSelection={"single"}
              //   onRowDoubleClicked={() => editRowSelect()}
              onSelectionChanged={onSelectionChanged}
              ref={gridRef}
              onGridReady={onGridReady}
              alwaysShowHorizontalScroll={true}
              quickFilterText={quickFilterText}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.modalButtonCancel}
            onClick={(e) => {
              e.preventDefault();
              setOpenModalTran(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
