"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./cashCountModal.module.css";
import axios from "axios";
import MessageModal from "./messageModal";
import useLocalState from "@/app/hooks/useLocalState";

const CashCountModal = ({ setOpenCashCount }) => {
  const isClient = typeof window !== "undefined";
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [total, setTotal] = useState(0);
  const [b1000, setB1000] = useState(0);
  const [b500, setB500] = useState(0);
  const [b200, setB200] = useState(0);
  const [b100, setB100] = useState(0);
  const [b50, setB50] = useState(0);
  const [b20, setB20] = useState(0);
  const [b10, setB10] = useState(0);
  const [b5, setB5] = useState(0);
  const [b1, setB1] = useState(0);
  const [bDeci, setBDeci] = useState(0);
  const [ccdate, setCcDate] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [disableAll, setDisableAll] = useState(false);
  const [balDate, setBalDate] = isClient
    ? useLocalState("balDate", "")
    : ["", () => {}];
  const [cashCount, setCashCount] = useState({
    id: "",
    cashCountDate: "",
    b1000: "",
    b500: "",
    b200: "",
    b100: "",
    b50: "",
    b20: "",
    b10: "",
    b5: "",
    b1: "",
    bdecimal: "",
    totalAmt: "",
  });

  const b1000ref = useRef();
  const b500ref = useRef();
  const b200ref = useRef();
  const b100ref = useRef();
  const b50ref = useRef();
  const b20ref = useRef();
  const b10ref = useRef();
  const b5ref = useRef();
  const b1ref = useRef();
  const bdeciref = useRef();

  let emptyArr = {
    id: "",
    cashCountDate: "",
    b1000: "",
    b500: "",
    b200: "",
    b100: "",
    b50: "",
    b20: "",
    b10: "",
    b5: "",
    b1: "",
    bdecimal: "",
    totalAmt: "",
  };

  useEffect(() => {
    recomputed();
  }, [b1000, b500, b200, b100, b50, b20, b10, b5, b1, bDeci]);

  useEffect(() => {
    if (!cashCount) {
      setCashCount(emptyArr);
    }
    if (cashCount.cashCountDate != "") {
      //   alert(new Date(cashCount.cashCountDate).toLocaleDateString("en-CA"));
      //   alert(new Date(balDate).toLocaleDateString("en-CA"));
      populate();
      if (
        new Date(cashCount.cashCountDate).toLocaleDateString("en-CA") !=
        new Date(balDate).toLocaleDateString("en-CA")
      ) {
        // alert("ss");
        setDisableAll(true);
      }
    }
  }, [cashCount]);

  const save = () => {
    cashCount.cashCountDate = ccdate;
    cashCount.totalAmt = total;
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/cashCount/saveCashCount", cashCount, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setCashCount(response.data);
          console.log(response.date);
          setMessage("Cash Count Saved.");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const validate = () => {
    if (ccdate === undefined) {
      setMessage("Please Select a Date");
      setOpenModal(true);
    } else {
      if (
        new Date(ccdate).toLocaleDateString("en-CA") ===
        new Date(balDate).toLocaleDateString("en-CA")
      ) {
        save();
      } else {
        setMessage("Cash count date is not equal to balance date");
        setOpenModal(true);
      }
    }
  };

  const search = (e) => {
    setCashCount(emptyArr);
    cashCount.cashCountDate = ccdate;
    setDisableAll(false);
    var jwt = window.sessionStorage.getItem("jwt");
    var inDate = ccdate;
    // var inDate = e.target.value;
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/cashCount/getByDate/" + inDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 403) {
          router.push("/login");
        }
        setCashCount(response.data);
      });
  };

  const normalizeNumber = (value) => {
    if (value != undefined) {
      return value.replace(/[^0-9]/g, "");
    }
  };

  const recomputed = (bill, count) => {
    let totalBill = 0;
    if (cashCount.b1000 != "") {
      b1000ref.current.value = 1000 * cashCount.b1000;
      totalBill = totalBill + 1000 * cashCount.b1000;
    }
    if (cashCount.b500 != "") {
      b500ref.current.value = 500 * cashCount.b500;
      totalBill = totalBill + 500 * cashCount.b500;
    }
    if (cashCount.b200 != "") {
      b200ref.current.value = 200 * cashCount.b200;
      totalBill = totalBill + 200 * cashCount.b200;
    }
    if (cashCount.b100 != "") {
      b100ref.current.value = 100 * cashCount.b100;
      totalBill = totalBill + 100 * cashCount.b100;
    }
    if (cashCount.b50 != "") {
      b50ref.current.value = 50 * cashCount.b50;
      totalBill = totalBill + 50 * cashCount.b50;
    }
    if (cashCount.b20 != "") {
      b20ref.current.value = 20 * cashCount.b20;
      totalBill = totalBill + 20 * cashCount.b20;
    }
    if (cashCount.b10 != "") {
      b10ref.current.value = 10 * cashCount.b10;
      totalBill = totalBill + 10 * cashCount.b10;
    }
    if (cashCount.b5 != "") {
      b5ref.current.value = 5 * cashCount.b5;
      totalBill = totalBill + 5 * cashCount.b5;
    }
    if (cashCount.b1 != "") {
      b1ref.current.value = 1 * cashCount.b1;
      totalBill = totalBill + 1 * cashCount.b1;
    }
    if (cashCount.bdecimal != "") {
      bdeciref.current.value = cashCount.bdecimal;
      totalBill = totalBill + Number(cashCount.bdecimal);
    }
    setTotal(totalBill);
    cashCount.totalAmt = totalBill;
  };

  const populate = () => {
    b1000ref.current.value = 1000 * cashCount.b1000;
    b500ref.current.value = 500 * cashCount.b500;
    b200ref.current.value = 200 * cashCount.b200;
    b100ref.current.value = 100 * cashCount.b100;
    b50ref.current.value = 50 * cashCount.b50;
    b20ref.current.value = 20 * cashCount.b20;
    b10ref.current.value = 10 * cashCount.b10;
    b5ref.current.value = 5 * cashCount.b5;
    b1ref.current.value = 1 * cashCount.b1;
    bdeciref.current.value = cashCount.bdecimal;
  };

  const print = () => {
    alert("ongoing development");
  };

  const normalizeDecimal = (value) => {
    if (value != undefined) {
      if (value === NaN) {
        return "";
      } else {
        if (value >= 1) {
          return "";
        } else {
          return value
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1")
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
            .replace(/(?<=\.\d*),(?=\d+)/g, "")
            .replace(/(\.\d{2})\d*/g, "$1");
        }
      }
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.modalContainer}>
        <div className={styles.search}>
          <h3>CASH COUNT</h3>
          <br></br>
          <label>Cash count date</label>
          <input
            type={"date"}
            onChange={(e) => {
              //   cashCount.cashCountDate = e.target.value;
              setCcDate(e.target.value);
              //   search(e);
            }}
          ></input>
          <button
            onClick={(e) => {
              search(e);
            }}
          >
            Search
          </button>
        </div>
        <div className={styles.form}>
          <div className={styles.details}>
            <label>Denomination</label>
            <label>No. of piece</label>
            <label>Total</label>
            <label>1000 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b1000}
              disabled={disableAll}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeNumber(value);
                setB1000(e.target.value);
                cashCount.b1000 = e.target.value;
              }}
            ></input>
            <input disabled ref={b1000ref}></input>
            <label>500 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b500}
              disabled={disableAll}
              onChange={(e) => {
                setB500(e.target.value);
                cashCount.b500 = e.target.value;
              }}
            ></input>
            <input disabled ref={b500ref}></input>
            <label>200 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b200}
              disabled={disableAll}
              onChange={(e) => {
                setB200(e.target.value);
                cashCount.b200 = e.target.value;
              }}
            ></input>
            <input disabled ref={b200ref}></input>
            <label>100 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b100}
              disabled={disableAll}
              onChange={(e) => {
                setB100(e.target.value);
                cashCount.b100 = e.target.value;
              }}
            ></input>
            <input disabled ref={b100ref}></input>
            <label>50 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b50}
              disabled={disableAll}
              onChange={(e) => {
                setB50(e.target.value);
                cashCount.b50 = e.target.value;
              }}
            ></input>
            <input disabled ref={b50ref}></input>
            <label>20 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b20}
              disabled={disableAll}
              onChange={(e) => {
                setB20(e.target.value);
                cashCount.b20 = e.target.value;
              }}
            ></input>
            <input disabled ref={b20ref}></input>
            <label>10 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b10}
              disabled={disableAll}
              onChange={(e) => {
                setB10(e.target.value);
                cashCount.b10 = e.target.value;
              }}
            ></input>
            <input disabled ref={b10ref}></input>
            <label>5 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b5}
              disabled={disableAll}
              onChange={(e) => {
                setB5(e.target.value);
                cashCount.b5 = e.target.value;
              }}
            ></input>
            <input disabled ref={b5ref}></input>
            <label>1 </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.b1}
              disabled={disableAll}
              onChange={(e) => {
                setB1(e.target.value);
                cashCount.b1 = e.target.value;
              }}
            ></input>
            <input disabled ref={b1ref}></input>
            <label>Decimal </label>
            <input
              maxLength={10}
              onFocus={(event) => event.target.select()}
              value={cashCount.bdecimal}
              disabled={disableAll}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeDecimal(value);
                setBDeci(e.target.value);
                cashCount.bdecimal = e.target.value;
              }}
            ></input>
            <input disabled ref={bdeciref}></input>
          </div>
          <hr className={styles.line}></hr>
        </div>

        <div className={styles.form}>
          <div className={styles.divTotal}>
            <a></a>
            <label>Total Amount</label>
            <input
              className={styles.total}
              maxLength={10}
              disabled={disableAll}
              value={cashCount.totalAmt}
            ></input>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.modalButtonCancel}
            style={{ marginRight: "5px" }}
            disabled={disableAll}
            onClick={(e) => {
              e.preventDefault();
              print();
            }}
          >
            Print
          </button>
          <button
            className={styles.modalButtonSave}
            disabled={disableAll}
            onClick={(e) => {
              e.preventDefault();
              validate();
            }}
          >
            Save
          </button>
          <button
            className={styles.modalButtonCancel}
            onClick={(e) => {
              e.preventDefault();
              setOpenCashCount(false);
            }}
          >
            Close
          </button>
        </div>
        {openModal && (
          <MessageModal setOpenModal={setOpenModal} message={message} />
        )}
      </div>
    </div>
  );
};

export default CashCountModal;
