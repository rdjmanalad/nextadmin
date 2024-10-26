"use client";
import styles from "./cancelled.module.css";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { useState, useEffect, useCallback, useRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/auth";

const CancelledTransactions = () => {
  const [rowData, setRowData] = useState([]);
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [quickFilterText, setQuickFilterText] = useState("");
  const gridRef = useRef();

  // const eGridDiv = document.querySelector("#myGrid");
  // new agGrid.Grid(eGridDiv, gridOptions);

  useEffect(() => {
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (jwtToken && isTokenExpired(jwtToken)) {
      router.push("/login");
      window.sessionStorage.clear();
    }
    if (jwtToken && !isTokenExpired(jwtToken)) {
      getAll();
    }
  }, []);

  const onGridReady = useCallback((params) => {
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (jwtToken && !isTokenExpired(jwtToken)) {
      getAll();
    }
  }, []);

  const getAll = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/masjewelry/getCancelled", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        // console.log(data);
        setRowData(data);
      });
  };

  const onQuickFilterChange = (event) => {
    setQuickFilterText(event.target.value);
    gridRef.current.api.setQuickFilter(event.target.value);
  };

  const onSelectionChanged = useCallback(() => {
    // alert("hhdjddk");

    // const selectedRows = gridRef.current.api.getSelectedRows();
    // jewelry(selectedRows);

    const selectedRows = gridRef.current.api.getSelectedRows();
    console.log(selectedRows);
  }, []);

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
    let amount = 0;
    if (params.data === !null) {
      amount = 0;
    } else {
      amount = currencyFormat(params.data.sellingPrice);
    }
    return amount;
  };

  const deliverDateFormatter = (params) => {
    const timestamp = params.data.deliverDate;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return formatedDate;
  };

  const pulloutDateFormatter = (params) => {
    const timestamp = params.data.pulloutDate;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return params.data.pulloutDate === null ? "" : formatedDate;
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
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 50,
    },
    {
      headerName: "Inventory No",
      field: "inventoryNo",
      width: "120",
      enableFilter: true,
    },
    { headerName: "Volume No.", field: "volumeNo", width: "120" },
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
    { headerName: "Deliver Branch", field: "deliverBranch", width: "120" },
    {
      headerName: "Deliver Date",
      field: "deliverDate",
      width: "120",
      valueFormatter: deliverDateFormatter,
    },
    {
      headerName: "Pullout Date",
      field: "pulloutDate",
      width: "120",
      valueFormatter: pulloutDateFormatter,
    },
  ];

  return (
    <div>
      {/* <h2>Cancelled Transactions</h2> */}
      <div className={styles.container}>
        <h3>Cancelled Transactions</h3>
        <br></br>
        <div className={styles.quickSearch}>
          <label>Quick Filter: </label>
          <input
            type="text"
            value={quickFilterText}
            onChange={onQuickFilterChange}
            placeholder="Type Here to filter..."
          />
        </div>
        <div className={`ag-theme-quartz ${styles.aggrid}`}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            autoSizeStrategy={autoSizeStrategy}
            rowSelection={"multiple"}
            onRowDoubleClicked={() => editRowSelect()}
            onSelectionChanged={onSelectionChanged}
            ref={gridRef}
            onGridReady={onGridReady}
            alwaysShowHorizontalScroll={true}
            quickFilterText={quickFilterText}
          />
        </div>
        <br></br>
        <div className={styles.inputs}>
          <label>Pullout Date</label>
          <input type="date"></input>
          <div className={styles.buttons}>
            <button
              onClick={(e) => {
                handleSave(e);
              }}
            >
              Pullout
            </button>
          </div>
        </div>
        <br></br>

        <br></br>
      </div>
    </div>
  );
};
export default CancelledTransactions;
