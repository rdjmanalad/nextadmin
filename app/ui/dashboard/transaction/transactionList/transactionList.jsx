"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./transactionList.module.css";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Transaction from "../transaction";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/auth";

const TransactionList = () => {
  const [pt, setPt] = useState([]);
  const [pm, setPm] = useState([]);
  const [payTerm, setPayTerm] = useState("");
  const [payMode, setPayMode] = useState("");
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [rowData, setRowData] = useState([]);
  const [rowSelected, setRowSelected] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [buttonDis, setButtonDis] = useState(true);
  const [filters, setFilters] = useState({});
  const gridRef = useRef();
  const router = useRouter();
  const filtersInit = {
    startDate: "",
    endDate: "",
    payTerm: "",
    payMode: "",
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
      setEditMode(false);
      setFilters(filtersInit);
      getReference();
    }
  }, []);

  const getReference = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    let pcode = "PT";
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

  const searchFiltered = (e) => {
    e.preventDefault();
    filters.payTerm = filters.payTerm === "" ? "-" : filters.payTerm;
    filters.payMode = filters.payMode === "" ? "-" : filters.payMode;
    if (filters.startDare === "" || filters.endDate === "") {
      alert("Please choose inclusive dates");
    } else {
      search();
    }
  };

  const search = (e) => {
    var jwt = window.sessionStorage.getItem("jwt");

    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(
        baseUrl +
          "/api/transactions/search/" +
          filters.startDate +
          "/" +
          filters.endDate +
          "/" +
          filters.payTerm +
          "/" +
          filters.payMode,
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

  const editSelect = (e) => {
    e.preventDefault();
    setEditMode(true);
  };

  const editRowSelect = () => {
    setEditMode(true);
  };

  const onGridReady = useCallback((params) => {
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (jwtToken && !isTokenExpired(jwtToken)) {
      getAll();
    }
  }, []);

  const onSelectionChanged = useCallback(() => {
    setButtonDis(false);
    const selectedRows = gridRef.current.api.getSelectedRows();
    setRowSelected(selectedRows);
  }, []);

  useEffect(() => {
    // console.log("rowSelected updated:", rowSelected);
  }, [rowSelected]);

  const dateFormatter = (params) => {
    const timestamp = params.data.transactDate;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return formatedDate;
  };

  const capitalFormatter = (params) => {
    const amount = currencyFormat(params.data.capital);
    return amount;
  };

  const balanceFormatter = (params) => {
    const amount = currencyFormat(params.data.balance);
    return amount;
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

  // Column definitions
  const columnDefs = [
    {
      headerName: "Code No.",
      field: "codeNo",
      filter: "agTextColumnFilter",
      width: "110",
    },
    { headerName: "Inventory No", field: "inventoryNo", width: "120" },
    {
      headerName: "Transact Date",
      field: "transactDate",
      width: "120",
      valueFormatter: dateFormatter,
    },
    { headerName: "Description", field: "description", width: "150" },
    { headerName: "Karat", field: "karat", width: "80" },
    { headerName: "Weight", field: "weight", width: "80" },
    {
      headerName: "Capital",
      field: "capital",
      width: "120",
      valueFormatter: capitalFormatter,
    },
    {
      headerName: "Discounted",
      field: "discountedPrice",
      width: "120",
      valueFormatter: discountedFormatter,
    },
    { headerName: "Customer Name", field: "customerName", width: "120" },
    // { headerName: "Receivers Name", field: "receiverName" },
    // { headerName: "Address", field: "address" },
    // { headerName: "Contact No", field: "contactNo" },
    { headerName: "Payment Term", field: "paymentTerm", width: "120" },
    { headerName: "Payment Mode", field: "paymentMode", width: "120" },
  ];

  return (
    <div>
      <div
        className={styles.container}
        style={{ display: editMode ? "none" : "block" }}
      >
        <div className={styles.filters}>
          <label>Start Date</label>
          <input
            type="date"
            onChange={(e) => {
              filters.startDate = e.target.value;
            }}
          />
          <label>End Date</label>
          <input
            type="date"
            onChange={(e) => {
              filters.endDate = e.target.value;
            }}
          />
          <label>Payment Term</label>
          <select
            placeholder="Payment Terms"
            onChange={(e) => {
              setPayTerm(e.target.value);
              filters.payTerm = e.target.value;
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
              filters.payMode = e.target.value;
            }}
          >
            <option></option>
            {pm.map((o, i) => (
              <option value={pm[i].name} key={pm[i].id}>
                {pm[i].name}
              </option>
            ))}
          </select>
          <button
            className={styles.search}
            onClick={(e) => {
              searchFiltered(e);
            }}
          >
            Search
          </button>
        </div>
        <br></br>
        {/* <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}> */}
        <div className={`ag-theme-quartz ${styles.aggrid}`}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            // domLayout="autoHeight"
            autoSizeStrategy={autoSizeStrategy}
            rowSelection={"single"}
            onRowDoubleClicked={() => editRowSelect()}
            onSelectionChanged={onSelectionChanged}
            ref={gridRef}
            onGridReady={onGridReady}
            alwaysShowHorizontalScroll={true}
          />
        </div>
        <div className={styles.viewEdit}>
          <button
            disabled={buttonDis}
            onClick={(e) => {
              editSelect(e);
            }}
          >
            View/Edit
          </button>
        </div>
      </div>
      {editMode && (
        <div>
          <div style={{ display: editMode ? "block" : "none" }}>
            <Transaction emptyObj={rowSelected[0]} />
          </div>
          <div className={styles.backToList}>
            <button
              onClick={() => {
                setEditMode(false);
              }}
            >
              Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TransactionList;
