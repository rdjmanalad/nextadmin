"use client";
import { AgGridReact } from "ag-grid-react";
import { useState, useCallback, useRef } from "react";
// import styles from "./layAwayTable.module.css";
import styles from "./editBalance.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import MessageModal from "./messageModal";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";
import ConfirmmModal from "./confirmModal";

const EditBalance = ({ setOpenEditBal }) => {
  const isClient = typeof window !== "undefined";
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef();
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  //   const [appType, setAppType] = useLocalState("appType", "");
  const [rowSelected, setRowSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [pm, setPm] = useState([]);
  const [openModalDel, setOpenModalDel] = useState(false);
  const [id, setId] = useState();
  const [balDate, setBalDate] = isClient
    ? useLocalState("balDate", "")
    : ["", () => {}];
  const [message, setMessage] = useState("");

  const beginningRef = useRef();
  const addRef = useRef();
  const lessRef = useRef();
  const endingRef = useRef();
  const [btnName, setBtnName] = useState("Switch to GBW");
  const [isGbw, setIsGbw] = useState(false);
  const [gbwDate, setGbwDate] = useState("");

  const onGridReady = useCallback((params) => {
    getGBWLatestDate();
    getAllBalances();

    // alert(balDate);
  }, []);

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setRowSelected(selectedRows);
    if (selectedRows[0]) {
      beginningRef.current.value = selectedRows[0].beginningBal;
      addRef.current.value = selectedRows[0].addBal;
      lessRef.current.value = selectedRows[0].lessBal;
      endingRef.current.value = selectedRows[0].endingBal;
    }
  }, []);

  const getAllBalances = async () => {
    const date = convertDateString(balDate);
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    try {
      const response = await axios.get(
        baseUrl + "/api/dashboard/balance/all/" + date,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setRowData(response.data);
      //   console.table(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getGBWBalances = async () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    try {
      const response = await axios.get(
        baseUrl + "/api/dashboard/balance/gbw/all/" + gbwDate,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setRowData(response.data);
      //   console.table(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const getGBWLatestDate = async () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    try {
      const response = await axios.get(
        baseUrl + "/api/dashboard/balance/gbw/getMaxBalDate",
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      let gbwd = new Date(response.data).toISOString().split("T")[0];
      setGbwDate(gbwd);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleSave = () => {
    if (!isGbw) {
      saveJARV();
    } else {
      saveGBW();
    }
  };

  const saveJARV = () => {
    const bal = rowSelected[0];
    console.table(bal);
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/dashboard/save", bal, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Balance Saved!");
          setOpenModal(true);
          getAllBalances();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveGBW = () => {
    const bal = rowSelected[0];
    console.table(bal);
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/dashboard/balance/gbw/save", bal, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("GBW Balance Saved!");
          setOpenModal(true);
          getGBWBalances();
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
    const amount = currencyFormat(params.data.beginningBal);
    return amount;
  };

  const amountFormatter2 = (params) => {
    const amount = currencyFormat(params.data.addBal);
    return amount;
  };

  const amountFormatter3 = (params) => {
    const amount = currencyFormat(params.data.lessBal);
    return amount;
  };

  const amountFormatter4 = (params) => {
    const amount = currencyFormat(params.data.endingBal);
    return amount;
  };

  const save = (e) => {
    e.preventDefault();
    handleSave();
  };

  const switched = (e) => {
    e.preventDefault();
    clear();
    var isGBW = !isGbw;
    if (isGBW) {
      setBtnName("Switch to JARV");
      getGBWBalances();
    } else {
      setBtnName("Switch to GBW");
      getAllBalances();
    }
    setIsGbw(!isGbw);
  };

  const clear = () => {
    addRef.current.value = "";
    beginningRef.current.value = "";
    lessRef.current.value = "";
    endingRef.current.value = "";
  };

  const convertDateString = (dateStr) => {
    const parts = dateStr.split("/");
    let month = parts[0];
    let day = parts[1];
    const year = parts[2];
    if (month.length === 1) {
      month = "0" + month;
    }
    if (day.length === 1) {
      day = "0" + day;
    }
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
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
      headerName: "Account Name",
      field: "accountName",
      filter: "agTextColumnFilter",
      width: "130",
    },
    {
      headerName: "Beginning Bal",
      field: "addBal",
      width: "120",
      valueFormatter: amountFormatter,
    },
    {
      headerName: "Cash In",
      field: "addBal",
      width: "120",
      valueFormatter: amountFormatter2,
    },
    {
      headerName: "Cash Out",
      field: "lessBal",
      width: "120",
      valueFormatter: amountFormatter3,
    },
    {
      headerName: "Running Bal",
      field: "endingBal",
      width: "120",
      valueFormatter: amountFormatter4,
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.modalContainer}>
        <h2>Edit Balances</h2>
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

        <div className={styles.inputDiv}>
          <label className={styles.modalInputLabel}>Starting</label>
          <input
            maxLength="12"
            className={styles.modalInputs}
            ref={beginningRef}
            style={{ textAlign: "right" }}
            defaultValue="0.00"
            onFocus={(event) => event.target.select()}
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = normalizeCurrency(value);
              rowSelected[0].beginningBal = value;
            }}
          ></input>
          <label className={styles.modalInputLabel}>Add Bal</label>
          <input
            maxLength="12"
            className={styles.modalInputs}
            ref={addRef}
            style={{ textAlign: "right" }}
            defaultValue="0.00"
            onFocus={(event) => event.target.select()}
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = normalizeCurrency(value);
              rowSelected[0].addBal = value;
            }}
          ></input>
        </div>
        <div className={styles.inputDiv}>
          <label className={styles.modalInputLabel}>Less Bal</label>
          <input
            maxLength="12"
            className={styles.modalInputs}
            ref={lessRef}
            style={{ textAlign: "right" }}
            defaultValue="0.00"
            onFocus={(event) => event.target.select()}
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = normalizeCurrency(value);
              rowSelected[0].lessBal = value;
            }}
          ></input>
          <label className={styles.modalInputLabel}>Running Bal</label>
          <input
            maxLength="12"
            className={styles.modalInputs}
            ref={endingRef}
            style={{ textAlign: "right" }}
            defaultValue="0.00"
            onFocus={(event) => event.target.select()}
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = normalizeCurrency(value);
              rowSelected[0].endingBal = value;
            }}
          ></input>
        </div>
        <div className={styles.buttonDiv}>
          <button
            className={styles.modalButtonSave}
            onClick={(e) => {
              switched(e);
            }}
          >
            {btnName}
          </button>
          <button
            className={styles.modalButtonSave}
            onClick={(e) => {
              save(e);
            }}
          >
            Save
          </button>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.modalButtonCancel}
            onClick={(e) => {
              e.preventDefault();
              setOpenEditBal(false);
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

export default EditBalance;
