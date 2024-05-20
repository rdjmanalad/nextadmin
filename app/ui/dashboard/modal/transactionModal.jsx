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

  return (
    <div className={styles.mainContainer}>
      <div className={styles.modalContainer}>
        <div style={{ width: "620px" }}>
          <div className={`ag-theme-quartz ${styles.aggrid}`}>
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
