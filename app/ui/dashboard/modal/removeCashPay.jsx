"use client";
import { AgGridReact } from "ag-grid-react";
import { useState, useCallback, useRef } from "react";
import styles from "./removeCashPay.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import MessageModal from "./messageModal";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";
import ConfirmmModal from "./confirmModal";

const RemoveCashPay = ({ setOpenRemoveCashPay }) => {
  const isClient = typeof window !== "undefined";
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [openModal, setOpenModal] = useState(false);
  const [openModalDel, setOpenModalDel] = useState(false);
  const [invNo, setInvNo] = useState(0);
  const [message, setMessage] = useState("");

  const getTransaction = async () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    try {
      const response = await axios.get(
        baseUrl + "/api/transactions/getByInvNo/" + invNo,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setRowData([response.data]);
      console.log(response.data);
    } catch (err) {
      setError(err);
      console.error("Error fetching data:", err);
    }
  };

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  const handleSearch = (e) => {
    e.preventDefault();
    getTransaction();
  };

  const handleRemove = () => {
    setMessage("Remove Payment?");
    setOpenModalDel(true);
    console.log(rowData);
    console.log(rowData[0].paymentTerm);
    rowData[0].paymentTerm = "";
    rowData[0].paymentMode = "";
    rowData[0].cashPayment = 0;
    rowData[0].referenceNo = "";
    rowData[0].cashPaymentDate = null;
  };

  const confirmOkDel = () => {
    const data = rowData[0];
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/transactions/save", data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Payment Removed!");
          setOpenModal(true);
          getTransaction();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const autoSizeStrategy = {
    type: "fitGridWidth",
    defaultMinWidth: 150,
  };

  const amountFormatter = (params) => {
    const amount = currencyFormat(params.data.discountedPrice);
    return amount;
  };

  const amountFormatter2 = (params) => {
    const amount = currencyFormat(params.data.cashPayment);
    return amount;
  };

  const dateFormatter = (params) => {
    const timestamp = params.data.cashPaymentDate;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return formatedDate;
  };

  const columnDefs = [
    {
      headerName: "Inventory No",
      field: "inventoryNo",
      filter: "agTextColumnFilter",
      width: "130",
    },
    {
      headerName: "Disconuted ",
      field: "discountedPrice",
      width: "120",
      valueFormatter: amountFormatter,
    },
    {
      headerName: "Payment Amount",
      field: "cashPayment",
      width: "120",
      valueFormatter: amountFormatter2,
    },
    {
      headerName: "Reference",
      field: "referenceNo",
      width: "120",
    },
    {
      headerName: "Payment Date",
      field: "cashPaymentDate",
      width: "120",
      valueFormatter: dateFormatter,
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.modalContainer}>
        <h2>Remove Cash Payment</h2>
        <div>
          <label>Inventory No.</label>
          <input
            type="text"
            className={styles.modalInputs}
            onChange={(e) => {
              setInvNo(e.target.value);
            }}
          ></input>
          <button
            className={styles.modalButton}
            onClick={(e) => {
              handleSearch(e);
            }}
          >
            Search
          </button>
        </div>
        <div className={`ag-theme-quartz ${styles.aggrid}`}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            autoSizeStrategy={autoSizeStrategy}
            rowSelection={"single"}
            // onSelectionChanged={onSelectionChanged}
            ref={gridRef}
            // onGridReady={onGridReady}
            alwaysShowHorizontalScroll={true}
          />
        </div>
        <div className={styles.buttonDiv}>
          <button
            className={styles.modalButtonDelete}
            onClick={(e) => {
              handleRemove(e);
            }}
          >
            Remove Payment
          </button>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.modalButtonCancel}
            onClick={(e) => {
              e.preventDefault();
              setOpenRemoveCashPay(false);
            }}
          >
            Close
          </button>
        </div>
        <br></br>
        {openModal && (
          <MessageModal setOpenModal={setOpenModal} message={message} />
        )}
        {openModalDel && (
          <ConfirmmModal
            setOpenModalConf={setOpenModalDel}
            message={message}
            confirmOk={confirmOkDel}
          />
        )}
      </div>
    </div>
  );
};

export default RemoveCashPay;
