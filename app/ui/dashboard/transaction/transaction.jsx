"use client";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./transaction.module.css";
import { useRouter } from "next/navigation";
import ModalLayAway from "../modal/modalLayAway";
import MessageModal from "../modal/messageModal";
import { isTokenExpired } from "@/app/auth";

const Transaction = ({ emptyObj }) => {
  const [trans, setTrans] = useState({});
  const [pt, setPt] = useState([]);
  const [pm, setPm] = useState([]);
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [isCash, setIsCash] = useState(false);
  const [pTerm, setPTerm] = useState("TERM");
  const [pMode, setPMode] = useState("");
  const [isForfeited, setIsForfeited] = useState(false);
  const [allowForfeit, setAllowForfeit] = useState(false);
  const [formattedNumber, setFormattedNumber] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalLA, setOpenModalLA] = useState(false);
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [isfullyPaid, setIsfullyPaid] = useState(false);
  const [message, setMessage] = useState("");

  const [layAway, setLayAway] = useState({
    id: "",
    transactionId: "",
    paymentMode: "",
    paymentDate: "",
    amount: "",
    referenceNo: "",
    user: "",
    timeStamped: "",
  });

  const codeRef = useRef();
  const inventoryNoRef = useRef();
  const transactDateRef = useRef();
  const descriptionRef = useRef();
  const karatRef = useRef();
  const weightRef = useRef();
  const capitalRef = useRef();
  const discountedPriceRef = useRef();
  const customerNameRef = useRef();
  const receiverNameRef = useRef();
  const addressRef = useRef();
  const contactNoRef = useRef();
  const paymentTermRef = useRef();
  const paymentModeRef = useRef();
  const cashPaymentDateRef = useRef();
  const cashPaymentRef = useRef();
  const referenceNoRef = useRef();
  const totalPaymentRef = useRef();
  const balanceRef = useRef();
  const fullPaymentDateRef = useRef();
  const forfeitedAmtRef = useRef();
  const forfeitedDateRef = useRef();
  const senderNameRef = useRef();
  const senderAddressRef = useRef();
  const senderContactNoRef = useRef();

  const router = useRouter();

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
      getReference();
      initiate();
      if (window.sessionStorage.getItem("jwt") != null) {
        if (emptyObj.id != "") {
          setTrans(emptyObj);
          populate();
        }
      }
    }
  }, []);

  useEffect(() => {
    if (emptyObj.id != "") {
      populate();
    }
  }, [trans]);

  const initiate = () => {
    trans.codeNo = "";
    trans.inventoryNo = "";
    trans.transactDate = "";
    trans.description = "";
    trans.karat = "";
    trans.weight = "";
    trans.capital = "";
    trans.discountedPrice = "";
    trans.customerName = "";
    trans.receiverName = "";
    trans.address = "";
    trans.contactNo = "";
    trans.paymentTerm = "";
    trans.paymentMode = "";
    trans.cashPaymentDate = "";
    trans.cashPayment = "";
    trans.referenceNo = "";
  };

  useEffect(() => {
    // alert("all");
    forfeitedAmtRef.current.value = currencyFormat(trans.forfeitedAmt);
  }, [isForfeited]);

  const populate = () => {
    // alert("populate");
    codeRef.current.value = trans.codeNo;
    inventoryNoRef.current.value = trans.inventoryNo;
    transactDateRef.current.value = formatDate(trans.transactDate);
    descriptionRef.current.value = trans.description;
    karatRef.current.value = trans.karat;
    weightRef.current.value = trans.weight;
    capitalRef.current.value = currencyFormat(trans.capital);
    discountedPriceRef.current.value = currencyFormat(trans.discountedPrice);
    customerNameRef.current.value = trans.customerName;
    receiverNameRef.current.value = trans.receiverName;
    addressRef.current.value = trans.address;
    contactNoRef.current.value = trans.contactNo;
    paymentTermRef.current.value = trans.paymentTerm;
    paymentModeRef.current.value = trans.paymentMode;
    // trans.paymentMode === undefined ? "" : trans.paymentMode;
    cashPaymentDateRef.current.value = formatDate(trans.cashPaymentDate);
    cashPaymentRef.current.value = currencyFormat(trans.cashPayment);
    referenceNoRef.current.value = trans.referenceNo;
    totalPaymentRef.current.value = currencyFormat(trans.totalPayment);
    balanceRef.current.value = currencyFormat(
      isNaN(trans.balance) ? 0 : trans.balance
    );
    fullPaymentDateRef.current.value = formatDate(trans.fullPaymentDate);
    forfeitedDateRef.current.value = formatDate(trans.forfeitedDate);
    // forfeitedAmtRef.current.value = currencyFormat(trans.forfeitedAmt);
    setIsCash(trans.paymentTerm === "CASH" ? true : false);
    setPTerm(trans.paymentTerm);
    setIsForfeited(trans.forfeitedAmt > 0);
    setAllowForfeit(trans.totalPayment > 0);
    if (trans.forfeitedAmt > 0) {
      setIsForfeited(true);
    }
    if (trans.paymentTerm === "LAY-AWAY" && trans.balance === 0) {
      setIsfullyPaid(true);
      setAllowForfeit(false);
    }
  };

  const formatDate = (date) => {
    if (date != null && date != "") {
      return new Date(date).toLocaleDateString("en-CA");
    }
    return "";
  };

  function removeCommas(inputString) {
    // Use the replace() method with a regular expression to remove all commas
    return inputString.replace(/,/g, "");
  }

  const getReference = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    var pcode = "PT";
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/reference/byparent/" + pcode, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 403) {
          router.push("/login");
        }
        setPt(response.data);
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

  const saveTransaction = () => {
    // alert(trans.id);
    if (pTerm === "LAY-AWAY") {
      trans.totalPayment = removeCommas(cashPaymentRef.current.value);
      trans.balance =
        trans.balance - removeCommas(cashPaymentRef.current.value);
    }
    var jwt = window.sessionStorage.getItem("jwt");
    // alert(trans.totalPayment);
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
          // console.log(response.data);
          setTrans(response.data);
          // alert("success" + response.data.id);
          setMessage("Transaction saved.");
          setOpenModal(true);
          layAway.transactionId = response.data.id;
          layAway.user = user;
          if (pTerm === "LAY-AWAY") {
            saveLayAwayPay();
          }
          saveBalance();
          populate();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveForfeited = () => {
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
          // console.log(response.data);
          setTrans(response.data);
          setMessage("Transaction is now forfeited");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveDetailsOnly = () => {
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
          // console.log(response.data);
          setTrans(response.data);
          setMessage("Saved");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveLayAwayPay = () => {
    // alert("lay awayid:" + layAway.id);
    layAway.id = null;
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
          // console.log(response.data);
          setLayAway(response.data);
          // alert("success");
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveTransaction2 = () => {
    // alert(trans.id);

    var jwt = window.sessionStorage.getItem("jwt");
    // alert(trans.totalPayment);
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
          // console.log(response.data);
          setTrans(response.data);
          // alert("Saved");
          setMessage("Transaction saved.");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const save = (e) => {
    e.preventDefault();
    if (validate()) {
      if (trans.forfeitedAmt > 0) {
        saveForfeited();
      } else {
        if (trans.id === "" || trans.id === undefined) {
          saveTransaction();
        } else {
          saveDetailsOnly();
        }
      }
    } else {
      setMessage("Please fill all fields.");
      setOpenModal(true);
    }
  };

  const validate = () => {
    var isvalid = true;
    if (isCash) {
      if (
        trans.codeNo === "" ||
        trans.inventoryNo === "" ||
        trans.transactDate === "" ||
        trans.description === "" ||
        trans.karat === "" ||
        trans.weight === "" ||
        trans.capital === "" ||
        trans.discountedPrice === "" ||
        trans.customerName === "" ||
        trans.receiverName === "" ||
        trans.address === "" ||
        trans.contactNo === "" ||
        trans.paymentTerm === "" ||
        trans.paymentMode === "" ||
        trans.cashPaymentDate === "" ||
        trans.cashPayment === "" ||
        trans.referenceNo === ""
      ) {
        isvalid = false;
      }
    } else {
      if (trans.forfeitedAmt > 0) {
        trans.balance = balanceRef.current.value
          .replaceAll(",", "")
          .replaceAll("₱", "");
        trans.totalPayment = totalPaymentRef.current.value
          .replaceAll(",", "")
          .replaceAll("₱", "");
        if (
          trans.codeNo === "" ||
          trans.inventoryNo === "" ||
          trans.transactDate === "" ||
          trans.description === "" ||
          trans.karat === "" ||
          trans.weight === "" ||
          trans.capital === "" ||
          trans.discountedPrice === "" ||
          trans.customerName === "" ||
          trans.receiverName === "" ||
          trans.address === "" ||
          trans.contactNo === "" ||
          trans.paymentTerm === "" ||
          trans.forfeitedDate === ""
        ) {
          isvalid = false;
        }
      } else {
        if (trans.id === "") {
          if (
            trans.codeNo === "" ||
            trans.inventoryNo === "" ||
            trans.transactDate === "" ||
            trans.description === "" ||
            trans.karat === "" ||
            trans.weight === "" ||
            trans.capital === "" ||
            trans.discountedPrice === "" ||
            trans.customerName === "" ||
            trans.receiverName === "" ||
            trans.address === "" ||
            trans.contactNo === "" ||
            trans.paymentTerm === "" ||
            paymentModeRef.current.value === "" ||
            cashPaymentDateRef.current.value == "" ||
            cashPaymentRef.current.value === "" ||
            referenceNoRef.current.value === ""
          ) {
            isvalid = false;
          }
        } else {
          if (
            trans.codeNo === "" ||
            trans.inventoryNo === "" ||
            trans.transactDate === "" ||
            trans.description === "" ||
            trans.karat === "" ||
            trans.weight === "" ||
            trans.capital === "" ||
            trans.discountedPrice === "" ||
            trans.customerName === "" ||
            trans.receiverName === "" ||
            trans.address === "" ||
            trans.contactNo === "" ||
            trans.paymentTerm === ""
          ) {
            isvalid = false;
          }
        }
      }
    }
    return isvalid;
  };

  const test = (e) => {};

  const printLbc = () => {
    if (trans.id === undefined) {
      setMessage("Please save the transaction first.");
      setOpenModal(true);
    } else {
      printReport();
    }
  };

  const printReport = () => {
    var senderName = senderNameRef.current.value;
    var senderAddress = senderAddressRef.current.value;
    var senderContactNo = senderContactNoRef.current.value;
    var receiverName = receiverNameRef.current.value;
    var receiverAddress = addressRef.current.value;
    var receiverContactNo = contactNoRef.current.value;
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(
        baseUrl +
          "/api/reports/lbc/" +
          senderName +
          "/" +
          senderAddress +
          "/" +
          senderContactNo +
          "/" +
          receiverName +
          "/" +
          receiverAddress +
          "/" +
          receiverContactNo,
        {
          headers: {
            contentType: "application/json",
            accept: "application/pdf",
          },
          responseType: "blob",
        }
      )
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        var w = window.open(window.URL.createObjectURL(file));
        w.document.title = "sample";
      });
  };

  const printReceipt = () => {
    if (trans.id === undefined) {
      // alert("Please save the transaction first.");
      setMessage("Please save the transaction first.");
      setOpenModal(true);
    } else {
      var id = trans.id;
      var jwt = window.sessionStorage.getItem("jwt");
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
      axios
        .get(baseUrl + "/api/reports/receipt/" + id, {
          headers: {
            contentType: "application/json",
            accept: "application/pdf",
          },
          responseType: "blob",
        })
        .then((response) => {
          const file = new Blob([response.data], { type: "application/pdf" });
          var w = window.open(window.URL.createObjectURL(file));
          w.document.title = "sample";
        });
    }
  };

  const saveBalance = () => {
    const date = cashPaymentDateRef.current.value;
    var amount = removeCommas(cashPaymentRef.current.value);
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(
        baseUrl + "/api/dashboard/saveAdd/" + pMode + "/" + date + "/" + amount,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data);
          // setLayAway(response.data);
          // alert("success");
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const onPayTerm = (e) => {
    e.preventDefault();
    var term = e.target.value;
    setIsCash(term === pt[0].name ? true : false);
    setIsCash(term === pt[1].name ? false : true);
    trans.balance = isCash ? 0 : trans.discountedPrice;
    trans.totalPayment = isCash ? trans.discountedPrice : 0;
    balanceRef.current.value = currencyFormat(trans.balance);
    totalPaymentRef.current.value = currencyFormat(trans.totalPayment);

    setPTerm(term);
    setIsForfeited(false);

    trans.paymentTerm = e.target.value;
  };

  const onPayMode = (e) => {
    e.preventDefault();
    const mode = e.target.value;
    setPMode(mode);
    trans.paymentMode = mode;
    layAway.paymentMode = !isCash ? mode : "";
  };

  const addPayment = (e) => {
    e.preventDefault();
    if (trans.id === undefined) {
      setMessage("Please save the transaction first.");
      setOpenModal(true);
    } else {
      // alert("iscash:" + isCash);
      if (validPayDetails()) {
        if (!isCash) {
          if (trans.id === "" || trans.id === undefined) {
            saveTransaction();
          }
          layAway.transactionId = trans.id;
          layAway.user = user;
          saveLayAwayPay();
          saveTranPayment();
          saveBalance();
          populate();
        }
      } else {
        setMessage("Please fill all payment details");
        setOpenModal(true);
      }
    }
  };

  const validPayDetails = () => {
    if (
      paymentModeRef.current.value === "" ||
      cashPaymentDateRef.current.value === "" ||
      cashPaymentRef.current.value === "" ||
      referenceNoRef.current.value === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const saveTranPayment = () => {
    trans.totalPayment =
      parseFloat(trans.totalPayment) + parseFloat(layAway.amount);
    trans.balance = parseFloat(trans.balance) - parseFloat(layAway.amount);
    if (trans.balance <= 0) {
      trans.fullPaymentDate = layAway.paymentDate;
    }
    trans.paymentMode = "";
    saveTransaction2();
    // clearPayment();
  };

  const clearPayment = () => {
    paymentModeRef.current.value = "";
    cashPaymentDateRef.current.value = "";
    cashPaymentRef.current.value = "";
    referenceNoRef.current.value = "";
  };

  const forfeitItem = (e) => {
    e.preventDefault();
    setIsForfeited(true);
    var forfeitAmount = trans.totalPayment - trans.totalPayment * 0.5;
    forfeitedAmtRef.current.value = forfeitAmount;
    trans.forfeitedAmt = forfeitAmount;
  };

  const currencyFormat = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(value);

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

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.tranMain}>
          <div className={styles.row1}>
            <label>Code#</label>
            <input
              ref={codeRef}
              maxLength="15"
              // placeholder="Code#"
              onChange={(e) => {
                trans.codeNo = e.target.value.toUpperCase();
              }}
            ></input>
            <label>Inv#</label>
            <input
              ref={inventoryNoRef}
              // placeholder="Inventory No."
              maxLength="15"
              onChange={(e) => {
                trans.inventoryNo = e.target.value.toUpperCase();
              }}
            ></input>
            <label>Transaction Date</label>
            <input
              ref={transactDateRef}
              type="date"
              // placeholder="Transaction Date"
              onChange={(e) => {
                trans.transactDate = e.target.value;
              }}
            ></input>
            <label>Description</label>
            <input
              ref={descriptionRef}
              // placeholder="Description"
              maxLength="30"
              onChange={(e) => {
                trans.description = e.target.value.toUpperCase();
              }}
            ></input>
            <label>Karat</label>
            <input
              ref={karatRef}
              // placeholder="Karat"
              maxLength="15"
              onChange={(e) => {
                trans.karat = e.target.value.toUpperCase();
              }}
            ></input>
            <label>Weight</label>
            <input
              ref={weightRef}
              // placeholder="Weight"
              maxLength="15"
              onChange={(e) => {
                trans.weight = e.target.value;
              }}
            ></input>
            <label>Capital</label>
            <input
              ref={capitalRef}
              defaultValue="0.00"
              // placeholder="Capital"
              maxLength="12"
              style={{ textAlign: "right" }}
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                trans.capital = value.replaceAll(",", "").replaceAll("₱", "");
              }}
            ></input>
            <label>Discounted Price</label>
            <input
              ref={discountedPriceRef}
              // placeholder="Discounted Price"
              maxLength="12"
              style={{ textAlign: "right" }}
              defaultValue="0.00"
              onFocus={(event) => event.target.select()}
              onChange={(e) => {
                const { value } = e.target;
                e.target.value = normalizeCurrency(value);
                trans.discountedPrice = value
                  .replaceAll(",", "")
                  .replaceAll("₱", "");
              }}
            ></input>
            <label>Customer Name</label>
            <input
              ref={customerNameRef}
              // placeholder="Customer Name"
              maxLength="50"
              onChange={(e) => {
                trans.customerName = e.target.value.toUpperCase();
              }}
            ></input>
            <label>Receivers Name</label>
            <input
              ref={receiverNameRef}
              // placeholder="Receivers Name"
              maxLength="50"
              onChange={(e) => {
                trans.receiverName = e.target.value.toUpperCase();
              }}
            ></input>
            <label>Complete Address</label>
            <input
              ref={addressRef}
              // placeholder="Complete Address"
              maxLength="100"
              onChange={(e) => {
                trans.address = e.target.value.toUpperCase();
              }}
            ></input>
            <label>Contact No.</label>
            <input
              ref={contactNoRef}
              // placeholder="Contact No."
              maxLength="15"
              onChange={(e) => {
                trans.contactNo = e.target.value;
              }}
            ></input>
            <label>Senders Name</label>
            <input
              ref={senderNameRef}
              readOnly
              value={"Aurora Jewelry Collection"}
            ></input>
            <label>Complete Address</label>
            <input
              ref={senderAddressRef}
              readOnly
              value={"3286 Jervois St. Brgy. Pinagkaisahan, Makati City"}
            ></input>
            <label>Contact No.</label>
            <input
              ref={senderContactNoRef}
              readOnly
              value={"0999-993-1148"}
            ></input>
          </div>
          <div className={styles.row2}>
            <div className={styles.cardContainer}>
              <label>Payment Terms</label>
              <select
                ref={paymentTermRef}
                // placeholder="Payment Terms"
                value={trans.paymentTerm}
                onChange={(e) => {
                  onPayTerm(e);
                  trans.paymentTerm = e.target.value;
                }}
              >
                <option></option>
                {pt.map((o, i) => (
                  <option value={pt[i].name} key={pt[i].name}>
                    {pt[i].name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.layContainer}>
              <label>{pTerm}</label>
            </div>
            <div className={styles.cardContainer}>
              <label>Payment Mode</label>
              <select
                ref={paymentModeRef}
                value={trans.paymentMode}
                // placeholder="Payment Mode"
                onChange={(e) => {
                  onPayMode(e);
                  trans.paymentMode = e.target.value;
                }}
              >
                <option></option>
                {pm.map((o, i) => (
                  <option value={pm[i].name} key={pm[i].name}>
                    {pm[i].name}
                  </option>
                ))}
              </select>
              <label>Payment Date</label>
              <input
                ref={cashPaymentDateRef}
                type="date"
                placeholder="Payment Date"
                onChange={(e) => {
                  trans.cashPaymentDate = isCash ? e.target.value : "";
                  layAway.paymentDate = !isCash ? e.target.value : "";
                }}
              ></input>
              <label>Amount Received</label>
              <input
                ref={cashPaymentRef}
                defaultValue="0.00"
                // placeholder="Amount Received"
                maxLength="12"
                style={{ textAlign: "right" }}
                onFocus={(event) => event.target.select()}
                onChange={(e) => {
                  const { value } = e.target;
                  e.target.value = normalizeCurrency(value);
                  trans.cashPayment = isCash
                    ? value.replaceAll(",", "").replaceAll("₱", "")
                    : "";
                  layAway.amount = !isCash
                    ? value.replaceAll(",", "").replaceAll("₱", "")
                    : "";
                }}
              ></input>
              <label>Reference No.</label>
              <input
                ref={referenceNoRef}
                // placeholder="Reference ID"
                onChange={(e) => {
                  // trans.referenceNo = e.target.value;
                  trans.referenceNo = isCash ? e.target.value : "";
                  layAway.referenceNo = !isCash ? e.target.value : "";
                }}
              ></input>
            </div>
            {/* <div className={styles.layContainer}>
              <label>Lay-Away</label>
            </div> */}
            <div style={{ display: isCash ? "none" : "block" }}>
              <div className={styles.buttonContainer}>
                <button
                  className={styles.add}
                  disabled={isfullyPaid}
                  onClick={(e) => {
                    addPayment(e);
                  }}
                >
                  Add Payment
                </button>
                <button
                  className={styles.forfeit}
                  disabled={!allowForfeit}
                  onClick={(e) => {
                    forfeitItem(e);
                  }}
                >
                  Forfeit
                </button>
              </div>
              <div
                style={{ display: isCash ? "none" : "block" }}
                className={styles.buttonContainer}
              >
                <button
                  className={styles.buttonLAP}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenModalLA(true);
                  }}
                >
                  Show Lay-Away Payments
                </button>
              </div>
            </div>
            <div style={{ display: isCash ? "none" : "block" }}>
              <div className={styles.cardContainer2}>
                <label>Total Payment</label>
                <input
                  ref={totalPaymentRef}
                  defaultValue="0.00"
                  // placeholder="Total Payment"
                  disabled
                  maxLength="12"
                  style={{ textAlign: "right" }}
                  onFocus={(event) => event.target.select()}
                  onChange={(e) => {
                    const { value } = e.target;
                    e.target.value = normalizeCurrency(value);
                    trans.totalPayment = value
                      .replaceAll(",", "")
                      .replaceAll("₱", "");
                  }}
                />
                <label>Total Balance</label>
                <input
                  ref={balanceRef}
                  // placeholder="Total Balance"
                  // disabled={isCash}
                  disabled
                  defaultValue="0.00"
                  maxLength="12"
                  style={{ textAlign: "right" }}
                  onFocus={(event) => event.target.select()}
                  onChange={(e) => {
                    const { value } = e.target;
                    e.target.value = normalizeCurrency(value);
                    trans.balance = value
                      .replaceAll(",", "")
                      .replaceAll("₱", "");
                  }}
                ></input>
                <label>Date Fully Paid</label>
                <input
                  ref={fullPaymentDateRef}
                  type="date"
                  disabled
                  onChange={(e) => {
                    trans.fullPaymentDate = e.target.value;
                  }}
                ></input>
              </div>
            </div>
            <div style={{ display: isForfeited ? "block" : "none" }}>
              <div className={styles.cardContainer2}>
                {/* <label>Amount Paid</label>
              <input placeholder="Total Payment" disabled={isCash}></input> */}
                {/* <label>Less 50%</label>
                <input placeholder="Total Balance" disabled={isCash}></input> */}
                <label>Total Refund(50%)</label>
                <input
                  ref={forfeitedAmtRef}
                  disabled={isCash}
                  maxLength="12"
                  style={{ textAlign: "right" }}
                  onChange={(e) => {
                    const { value } = e.target;
                    e.target.value = normalizeCurrency(value);
                    trans.forfeitedAmt = value
                      .replaceAll(",", "")
                      .replaceAll("₱", "");
                  }}
                ></input>
                <label>Forfeited Date</label>
                <input
                  ref={forfeitedDateRef}
                  type="date"
                  // placeholder="Forfeited Date"
                  onChange={(e) => {
                    trans.forfeitedDate = e.target.value;
                  }}
                ></input>
              </div>
            </div>
            <div className={styles.buttonContainer3}>
              <button className={styles.save} onClick={(e) => save(e)}>
                Save Details
              </button>
              <button
                className={styles.printForfeited}
                disabled={isfullyPaid || isCash || !isForfeited}
                onClick={(e) => {
                  e.preventDefault();
                  printReceipt();
                }}
              >
                Print Forfeited
              </button>
            </div>
            <div className={styles.buttonContainer2}>
              <button
                className={styles.lbc}
                onClick={(e) => {
                  e.preventDefault();
                  printLbc();
                }}
              >
                Print LBC form
              </button>
              <button
                className={styles.receipt}
                onClick={(e) => {
                  e.preventDefault();
                  printReceipt();
                }}
              >
                Print Receipt
              </button>
            </div>

            <div className={styles.buttonContainer2}>
              <button
                onClick={(e) => {
                  test(e);
                }}
              >
                Clear/Refresh
              </button>
            </div>
          </div>
        </div>
      </form>
      {openModalLA && (
        <ModalLayAway
          openModalLA={openModalLA}
          setOpenModalLA={setOpenModalLA}
          transactionId={trans.id != undefined ? trans.id : "0"}
        />
      )}
      {openModal && (
        <MessageModal setOpenModal={setOpenModal} message={message} />
      )}
    </div>
  );
};
export default Transaction;
