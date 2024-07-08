"use client";
import { AgGridReact } from "ag-grid-react";
import { useState, useCallback, useRef } from "react";
import styles from "./transactionModal.module.css";
import styles2 from "./jewelryModal.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";

const JewelryModal = ({ setOpenModalJewel, jewelry }) => {
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
      .get(baseUrl + "/api/masjewelry/getall", {
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

  const searchFiltered = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(
        baseUrl + "/api/masjewelry/getByDates/" + startDate + "/" + endDate,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setRowData(data);
      });
  };

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    jewelry(selectedRows);
  }, []);

  const dateFormatter = (params) => {
    const timestamp = params.data.transactDate;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return formatedDate;
  };

  const capitalFormatter = (params) => {
    let amount = 0;
    if (params.data === !null) {
      amount = 0;
    } else {
      amount = currencyFormat(params.data.capital);
    }

    return amount;
  };

  const sellingFormatter = (params) => {
    // const amount = params;
    // const amount = currencyFormat(params.data.sellingPrice);
    let amount = 0;
    if (params.data === !null) {
      amount = 0;
    } else {
      amount = currencyFormat(params.data.sellingPrice);
    }
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
      headerName: "Inventory No",
      field: "inventoryNo",
      width: "120",
      enableFilter: true,
    },
    { headerName: "Description", field: "description", width: "120" },
    {
      headerName: "Capital",
      field: "capital",
      width: "120",
      valueFormatter: capitalFormatter,
    },
    {
      headerName: "Selling Price",
      field: "sellingPrice",
      width: "120",
      valueFormatter: sellingFormatter,
    },
    { headerName: "Karat", field: "karat", width: "120" },
    { headerName: "Weight", field: "weight", width: "120" },
  ];

  const onQuickFilterChange = (event) => {
    setQuickFilterText(event.target.value);
    gridRef.current.api.setQuickFilter(event.target.value);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.modalContainer}>
        <div style={{ width: "620px" }}>
          <h3>Jewelry Inventory</h3>
          <br></br>
          <div className={styles2.search}>
            <label>Delivery Date from</label>
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
              setOpenModalJewel(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JewelryModal;
