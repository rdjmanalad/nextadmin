"use client";
import { AgGridReact } from "ag-grid-react";
import { useState, useCallback, useRef } from "react";
import styles from "./layAwayTable.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import MessageModal from "./messageModal";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";

const LayAwayTable = ({ transactionId }) => {
  const isClient = typeof window !== "undefined";
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [rowSelected, setRowSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [pm, setPm] = useState([]);
  const [balDate, setBalDate] = isClient
    ? useLocalState("balDate", "")
    : ["", () => {}];
  const [message, setMessage] = useState("");
  const amountRef = useRef();
  const refNoRef = useRef();
  const pmRef = useRef();

  const onGridReady = useCallback((params) => {
    getLayAway();
    getReference();
    pmRef.current.disabled = true;
    refNoRef.current.disabled = true;
    amountRef.current.disabled = true;
    // alert(balDate);
  }, []);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setRowSelected(selectedRows);
    amountRef.current.value = selectedRows[0].amount;
    refNoRef.current.value = selectedRows[0].referenceNo;
    pmRef.current.value = selectedRows[0].paymentMode;

    if (
      new Date(selectedRows[0].paymentDate).toLocaleDateString("en-US") ===
      balDate
    ) {
      amountRef.current.disabled = false;
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
      // .then((response) => response.data)
      // .then((data) => {
      //   console.log(data);
      //   setRowData(data);
      // });
      .then((response) => {
        if (response.status === 200) {
          setRowData(response.data);
        }
      })
      .catch((message) => {
        alert(message);
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

  const save = (e) => {
    if (
      balDate ===
      new Date(rowSelected[0].paymentDate).toLocaleDateString("en-US")
    ) {
      saveLayAwayPay();
    } else {
      setMessage("Payment date must be equal to current balance date");
      setOpenModal(true);
    }
    // saveLayAwayPay();
  };

  const saveLayAwayPay = () => {
    let layAway = rowSelected[0];
    layAway.amount = amountRef.current.value
      .replaceAll(",", "")
      .replaceAll("₱", "");
    layAway.referenceNo = refNoRef.current.value;
    layAway.paymentMode = pmRef.current.value;
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/layAwayPay/save", layAway, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Edit Saved.");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

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

  const autoSizeStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 150,
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
      width: "130",
    },
    { headerName: "Payment Mode", field: "paymentMode", width: "180" },
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
      width: "150",
    },
  ];

  return (
    <div style={{ width: "700px" }}>
      <div className={`ag-theme-quartz ${styles.aggrid}`}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          autoSizeStrategy={autoSizeStrategy}
          rowSelection={"single"}
          onSelectionChanged={onSelectionChanged}
          ref={gridRef}
          onGridReady={onGridReady}
          alwaysShowHorizontalScroll={true}
        />
      </div>

      <div className={styles.inputs}>
        <label>Pay Mode</label>
        <select
          placeholder="Payment Mode"
          ref={pmRef}
          // onChange={(e) => {
          //   setPayMode(e.target.value);
          //   filters.payMode = e.target.value;
          // }}
        >
          <option></option>
          {pm.map((o, i) => (
            <option value={pm[i].name} key={pm[i].id}>
              {pm[i].name}
            </option>
          ))}
        </select>
        <label>Amount</label>
        <input
          ref={amountRef}
          maxLength="12"
          style={{ textAlign: "right" }}
          defaultValue="0.00"
          onFocus={(event) => event.target.select()}
          onChange={(e) => {
            const { value } = e.target;
            e.target.value = normalizeCurrency(value);
            // trans.discountedPrice = value
          }}
        ></input>
        <label>Ref. No.</label>
        <input ref={refNoRef} maxLength="20"></input>
      </div>
      <div className={styles.buttonDiv}>
        <button
          className={styles.modalButtonSave}
          onClick={(e) => {
            save(e);
          }}
        >
          Save
        </button>
      </div>
      {openModal && (
        <MessageModal setOpenModal={setOpenModal} message={message} />
      )}
    </div>
  );
};

export default LayAwayTable;
