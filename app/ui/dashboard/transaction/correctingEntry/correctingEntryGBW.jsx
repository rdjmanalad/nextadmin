"use client";
import styles from "./correcting.module.css";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import { useState, useEffect, useCallback, useRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/auth";
import TransactionModalGBW from "../../modal/transactionModalGBW";
import MessageModal from "../../modal/messageModal";

const CorrectingEntryGBW = () => {
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [rowData, setRowData] = useState([]);
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const gridRef = useRef();
  const [openModalTran, setOpenModalTran] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [rowSelected, setRowSelected] = useState([]);
  const [tranId, setTranId] = useState("");
  const [reload, setReload] = useState(false);
  const [balDate, setBalDate] = useLocalState("balDate", "");

  const [corrEntry, setCorrEntry] = useState({
    id: "",
    transactionId: "",
    code: "",
    selling: "",
    mode: "",
    paymentDate: "",
    referenceNo: "",
    paymentAmt: "",
    correctingAmt: "",
    userId: "",
    timeStamped: "",
  });

  const codeRef = useRef();
  const sellingRef = useRef();
  const modeRef = useRef();
  const paymentDateRef = useRef();
  const referenceNoRef = useRef();
  const paymentAmtRef = useRef();
  const correctingAmtRef = useRef();
  const corrDateRef = useRef();
  const correctedAmtRef = useRef();

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
      getAll();
      //   getReference();
    }
  }, []);

  useEffect(() => {
    if (!openModal) {
      if (reload) {
        window.location.reload();
      }
    }
  }, [openModal]);

  useEffect(() => {
    // console.log(rowSelected[0]);
    if (rowSelected.length > 0) {
      setTranId(rowSelected[0].id);
      corrEntry.transactionId = rowSelected[0].id;
      corrEntry.code = rowSelected[0].codeNo;

      codeRef.current.value = rowSelected[0].codeNo;
      sellingRef.current.value = currencyFormat(rowSelected[0].sellingPrice);

      corrEntry.selling = rowSelected[0].sellingPrice;
      corrEntry.mode = rowSelected[0].paymentMode;
      corrEntry.paymentDate = rowSelected[0].cashPaymentDate;
      corrEntry.referenceNo = rowSelected[0].referenceNo;
      corrEntry.paymentAmt = rowSelected[0].cashPayment;
      corrEntry.userId = user;

      modeRef.current.value = rowSelected[0].paymentMode;
      paymentDateRef.current.value = formatDate(rowSelected[0].cashPaymentDate);
      referenceNoRef.current.value = rowSelected[0].referenceNo;
      paymentAmtRef.current.value = currencyFormat(rowSelected[0].cashPayment);
    }
  }, [rowSelected]);

  const getAll = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/correcting/gbw/getAll/", {
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

  const handleSave = (e) => {
    // console.log(corrEntry);
    if (
      corrEntry.correctingAmt === "" ||
      corrEntry.correctingAmt === undefined
    ) {
      setMessage("Adjustment amount is empty.");
      setOpenModal(true);
    } else {
      saveCorrection();
    }

    // saveTransaction();
  };

  const saveCorrection = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/correcting/gbw/save", corrEntry, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // saveTransaction();
          setMessage("Correction saved.");
          setOpenModal(true);
          getAll();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveTransaction = () => {
    // console.log(rowSelected[0]);
    const trans = rowSelected[0];
    if (isNaN(trans.correctingAmt)) {
      trans.correctingAmt = corrEntry.correctingAmt;
    } else {
      trans.correctingAmt =
        Number(trans.correctingAmt) + Number(corrEntry.correctingAmt);
    }

    trans.correctingDate = new Date();
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/transactions/save", trans, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setReload(true);
          setMessage("Transaction saved.");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const onGridReady = useCallback((params) => {
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (jwtToken && !isTokenExpired(jwtToken)) {
      getAll();
    }
  }, []);

  const formatDate = (date) => {
    if (date != null && date != "") {
      return new Date(date).toLocaleDateString("en-CA");
    }
    return "";
  };

  const timestampFormatter = (params) => {
    const timestamp = params.data.timestamped;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return formatedDate;
  };

  const payAmtFormatter = (params) => {
    const amount = currencyFormat(params.data.paymentAmt);
    return amount;
  };

  const corrAmtFormatter = (params) => {
    const amount = currencyFormat(params.data.correctingAmt);
    return amount;
  };

  const payDateFormatter = (params) => {
    const timestamp = params.data.paymentDate;
    const formatedDate = new Date(timestamp).toLocaleDateString("us-CA");
    return formatedDate;
  };

  const sellingFormatter = (params) => {
    const amount = currencyFormat(params.data.selling);
    return amount;
  };

  const normalizeCurrency = (value) => {
    if (value !== undefined) {
      // Allow digits, decimal point, and negative sign
      return value
        .replace(/[^\d.-]/g, "")
        .replace(/(\..*)\./g, "$1") // Remove extra decimal points
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") // Add commas for thousands separator
        .replace(/(?<=\.\d*),(?=\d+)/g, "") // Remove comma before decimal digits
        .replace(/(\.\d{2})\d*/g, "$1"); // Limit to two decimal places
    }
  };

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(value);

  const computeCorrected = (amt) => {
    // alert("j" + corrEntry.paymentAmt);
    correctedAmtRef.current.value = Number(corrEntry.paymentAmt) + Number(amt);
  };

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
      field: "code",
      filter: "agTextColumnFilter",
      width: "120",
    },

    {
      headerName: "Selling",
      field: "selling",
      width: "120",
      valueFormatter: sellingFormatter,
      cellStyle: { textAlign: "right" },
    },
    { headerName: "Mode", field: "mode", width: "120" },
    { headerName: "Reference No.", field: "referenceNo", width: "120" },
    {
      headerName: "Payment Date",
      field: "paymentDate",
      width: "120",
      valueFormatter: payDateFormatter,
    },
    {
      headerName: "Payment Amount",
      field: "paymentAmt",
      width: "120",
      valueFormatter: payAmtFormatter,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "Correcting Amount",
      field: "correctingAmt",
      width: "120",
      valueFormatter: corrAmtFormatter,
      cellStyle: { textAlign: "right" },
    },
    { headerName: "User", field: "userId", width: "120" },
    {
      headerName: "Timestamped",
      field: "timestamped",
      width: "120",
      valueFormatter: timestampFormatter,
    },
  ];
  return (
    <div>
      <div className={styles.container}>
        <h3>Correcting Entry</h3>
        <br></br>
        <div className={`ag-theme-quartz ${styles.aggrid}`}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            autoSizeStrategy={autoSizeStrategy}
            rowSelection={"single"}
            // onRowDoubleClicked={() => editRowSelect()}
            // onSelectionChanged={onSelectionChanged}
            ref={gridRef}
            onGridReady={onGridReady}
            alwaysShowHorizontalScroll={true}
          />
        </div>
        <br></br>
        <div>
          <div className={styles.details}>
            <button
              onClick={(e) => {
                setOpenModalTran(true);
              }}
            >
              Select Transaction to Correct
            </button>
          </div>
          <br></br>
          <div className={styles.inputs}>
            <label>Code</label>
            <input ref={codeRef} disabled></input>
            <label>Selling Price</label>
            <input
              ref={sellingRef}
              disabled
              style={{ textAlign: "right" }}
            ></input>
            <label>Payment Mode</label>
            <input ref={modeRef} disabled></input>
            <label>Ref. No.</label>
            <input ref={referenceNoRef} disabled></input>
            <label>Payment Amt</label>
            <input
              ref={paymentAmtRef}
              style={{ textAlign: "right" }}
              disabled
            ></input>
            <label>Payment Date</label>
            <input ref={paymentDateRef} disabled></input>

            <label>Adjustment Amt</label>
            <input
              ref={correctingAmtRef}
              style={{ textAlign: "right" }}
              maxLength="12"
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                computeCorrected(value);
                corrEntry.correctingAmt = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
            ></input>
            <label>Corrected Amt</label>
            <input ref={correctedAmtRef} disabled></input>
            <label>Correction Date</label>
            <input
              ref={corrDateRef}
              type="Date"
              disabled
              // defaultValue={new Date().toLocaleDateString("en-CA")}
              value={new Date(balDate).toLocaleDateString("en-CA")}
            ></input>
          </div>
          <br></br>
          <div className={styles.buttons}>
            <button
              onClick={(e) => {
                handleSave(e);
              }}
            >
              Save
            </button>
          </div>
          <br></br>
        </div>
        <div>
          {openModalTran && (
            <TransactionModalGBW
              openModalTran={openModalTran}
              setOpenModalTran={setOpenModalTran}
              setTrans={setRowSelected}
            />
          )}
        </div>

        {openModal && (
          <MessageModal setOpenModal={setOpenModal} message={message} />
        )}
      </div>
    </div>
  );
};
export default CorrectingEntryGBW;
