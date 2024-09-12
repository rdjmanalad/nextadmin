"use client";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./transaction.module.css";
import { useRouter } from "next/navigation";
import ModalLayAway from "../modal/modalLayAway";
import MessageModal from "../modal/messageModal";
import JewelryModal from "../modal/jewelryModal";
import { isTokenExpired } from "@/app/auth";
import { MdSearch } from "react-icons/md";
import ConfirmmModal from "../modal/confirmModal";

const TransactionGBW = ({ emptyObj }) => {
  const [trans, setTrans] = useState({});
  const [transOrg, setTransOrg] = useState({});
  const [pt, setPt] = useState([]);
  const [pm, setPm] = useState([]);
  const [sd, setSd] = useState([]);
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [role, setRole] = useLocalState("userRole", "");
  const [isCash, setIsCash] = useState(false);
  const [pTerm, setPTerm] = useState("TERM");
  const [pMode, setPMode] = useState("");
  const [isForfeited, setIsForfeited] = useState(false);
  const [allowForfeit, setAllowForfeit] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalLA, setOpenModalLA] = useState(false);
  const [openModalJewel, setOpenModalJewel] = useState(false);
  const [openModalConf, setOpenModalConf] = useState(false);
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [isfullyPaid, setIsfullyPaid] = useState(false);
  const [message, setMessage] = useState("");
  const [latestBalDate, setLatestBalDate] = useState("");
  const [jewelry, setJewelry] = useState({});
  const [disableSavePay, setDisableSavePay] = useState(true);
  const [disableCancel, setDisableCancel] = useState(true);
  const [cancelLabel, setCancelLabel] = useState("Cancel Date");
  // const [permissions, setPermissions] = useState([]);
  const [disableDuedate, setDisableDuedate] = useState(true);
  const [disablePaymentUI, setDisablePaymentUI] = useState(true);
  const [permissions, setPermissions] = useLocalState([]);
  const [balDate, setBalDate] = isClient
    ? useLocalState("balDate", "")
    : ["", () => {}];

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
  const sellingRef = useRef();
  const volumeRef = useRef();
  const savePayMentRef = useRef();
  const forfeitRef = useRef();
  const divRef = useRef();
  const cancelDateRef = useRef();
  const dueDateRef = useRef();

  const router = useRouter();

  useEffect(() => {
    allowPermission();
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (jwtToken && isTokenExpired(jwtToken)) {
      router.push("/login");
      window.sessionStorage.clear();
    }
    if (jwtToken && !isTokenExpired(jwtToken)) {
      checkPermission();
      getReference();
      initiate();
      if (window.sessionStorage.getItem("jwt") != null) {
        if (emptyObj.id != "") {
          setTrans(emptyObj);
          setTransOrg({
            referenceNo: emptyObj.referenceNo,
            cashPaymentDate: emptyObj.cashPaymentDate,
            cashPayment: emptyObj.cashPayment,
            cashPaymentDate: emptyObj.cashPaymentDate,
          });
          populate();
        }
      }
    }
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      moveToNextFocusableElement(event.target);
    }
  };

  const moveToNextFocusableElement = (currentElement) => {
    const focusableElements = divRef.current.querySelectorAll(
      'input, button, a, select, [tabindex]:not([tabindex="-1"])'
    );
    const focusableArray = Array.prototype.slice.call(focusableElements);
    const currentIndex = focusableArray.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % focusableArray.length;
    focusableArray[nextIndex].focus();
  };

  useEffect(() => {
    if (trans) {
      populate();
      disablePayment();
      enableCancel();
      // alert(trans.correctingAmt);
      if (trans.canceledDate != undefined) {
        setTimeout(() => {
          disableCashSet();
          setDisableCancel(true);
          setCancelLabel("Date Cancelled");
        }, 300);
      }
    }
    if (emptyObj.id != "") {
      populate();
      disablePayment();
    }
  }, [trans]);

  const allowPermission = () => {
    if (permissions) {
      if (permissions.includes("transactions.due")) {
        setDisableDuedate(false);
      } else {
        setDisableDuedate(true);
      }

      if (permissions.includes("transaction.payment")) {
        setDisablePaymentUI(true);
      } else {
        setDisablePaymentUI(false);
      }
    }
  };

  useEffect(() => {
    if (jewelry.length > 0) {
      inventoryNoRef.current.value = jewelry[0].inventoryNo;
      descriptionRef.current.value = jewelry[0].description;
      karatRef.current.value = jewelry[0].karat;
      weightRef.current.value = jewelry[0].weight;
      sellingRef.current.value = currencyFormat(jewelry[0].sellingPrice);
      capitalRef.current.value = currencyFormat(jewelry[0].capital);
      volumeRef.current.value = jewelry[0].volumeNo;

      trans.inventoryNo = jewelry[0].inventoryNo;
      trans.description = jewelry[0].description;
      trans.karat = jewelry[0].karat;
      trans.weight = jewelry[0].weight;
      trans.capital = jewelry[0].capital;
      trans.sellingPrice = jewelry[0].sellingPrice;
      trans.volumeNo = jewelry[0].volumeNo;
    }
  }, [jewelry]);

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
    trans.sellingPrice = "";
    trans.volumeNo = "";
  };

  const populate = () => {
    codeRef.current.value = trans.codeNo;
    transactDateRef.current.value = formatDate(trans.transactDate);
    descriptionRef.current.value = trans.description;
    karatRef.current.value = trans.karat;
    weightRef.current.value = trans.weight;
    sellingRef.current.value = currencyFormat(trans.sellingPrice);
    capitalRef.current.value = currencyFormat(trans.capital);
    customerNameRef.current.value = trans.customerName;
    receiverNameRef.current.value = trans.receiverName;
    addressRef.current.value = trans.address;
    contactNoRef.current.value = trans.contactNo;
    paymentTermRef.current.value = trans.paymentTerm;
    paymentModeRef.current.value = trans.paymentMode;
    cashPaymentDateRef.current.value = formatDate(trans.cashPaymentDate);
    cashPaymentRef.current.value = currencyFormat(trans.cashPayment);
    referenceNoRef.current.value = trans.referenceNo;
    sellingRef.current.value = currencyFormat(trans.sellingPrice);
    // cancelDateRef.current.value = formatDate(trans.canceledDate);
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

  const clearTrans = () => {
    for (let key in trans) {
      if (trans.hasOwnProperty(key)) {
        trans[key] = "";
      }
    }
  };

  const formatDate = (date) => {
    if (date != null && date != "") {
      return new Date(date).toLocaleDateString("en-CA");
    }
    return "";
  };

  function removeCommaAndPesoSign(str) {
    const regex = /[₱,]/g; // g flag for global search and replace
    return str.replace(regex, "");
  }

  function removeCommas(inputString) {
    // Use the replace() method with a regular expression to remove all commas
    return inputString.replace(/,/g, "");
  }

  const getReference = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    var pcode = "";

    pcode = "PM-GBW";
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

    pcode = "SD-GBW";
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
        setSd(data);
        senderNameRef.current.value = data[0].name;
        senderAddressRef.current.value = data[1].name;
        senderContactNoRef.current.value = data[2].name;
      });
  };

  const checkPermission = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users/getRolePermission/" + role, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setPermissions(data);
      });
  };

  const saveTransaction = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    console.log(trans);
    axios
      .post(baseUrl + "/api/transactions/gbw/save", trans, {
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
          setMessage("Transaction saved.");
          setOpenModal(true);
          populate();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveDetailsOnly = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/transactions/gbw/save", trans, {
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
          setMessage("Details Saved");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveTransaction2 = () => {
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
          // alert("Saved");
          setMessage("Transaction saved.");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
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

  const validateDetails = () => {
    if (
      trans.codeNo === "" ||
      trans.transactDate === "" ||
      trans.description === "" ||
      trans.karat === "" ||
      trans.weight === "" ||
      trans.capital === "" ||
      trans.sellingPrice === "" ||
      trans.customerName === "" ||
      trans.receiverName === "" ||
      trans.address === "" ||
      trans.contactNo === ""
    ) {
      return false;
    } else {
      return true;
    }
  };

  const saveDetails = (e) => {
    e.preventDefault();
    if (validateDetails()) {
      if (trans.id === "" || trans.id === undefined) {
        trans.cashPayment = 0;
      }
      saveDetailsOnly();
    } else {
      setMessage("Please fill all fields.");
      setOpenModal(true);
    }
  };

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
        .get(baseUrl + "/api/reports/gbw/receipt/" + id, {
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

  const onPayMode = (e) => {
    e.preventDefault();
    const mode = e.target.value;
    setPMode(mode);
    trans.paymentMode = mode;
    layAway.paymentMode = !isCash ? mode : "";
  };

  const getLastBaldate = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/dashboard/balance/getMaxBalDate", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setLatestBalDate(new Date(data).toLocaleDateString("en-US"));
      });
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

  const addPayment = (e) => {
    e.preventDefault();
    if (trans.id === undefined) {
      setMessage("Please save the transaction first.");
      setOpenModal(true);
    } else {
      if (validPayDetails()) {
        if (
          balDate ===
          new Date(trans.cashPaymentDate).toLocaleDateString("en-US")
        ) {
          if (trans.cashPayment < trans.sellingPrice) {
            setMessage("Payment amount is less than selling price");
            setOpenModal(true);
          } else {
            saveTransaction();
          }
        } else {
          setMessage("Payment date and balance date is not equal.");
          setOpenModal(true);
        }
      } else {
        setMessage("Please fill all payment details.");
        setOpenModal(true);
      }
    }
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

  const disablePayment = () => {
    if (trans.id === "" || trans.id === undefined) {
      paymentTermRef.current.disabled = true;
      disableCashSet();
    } else {
      let cashTerm = trans.paymentTerm === "CASH" ? true : false;
      if (
        cashTerm &&
        new Date(cashPaymentDateRef.current.value).toLocaleDateString(
          "en-US"
        ) === balDate
      ) {
        enableCashSet();
      } else {
        disableCashSet();
      }
      if (!cashTerm) {
        if (isForfeited) {
          disableCashSet();
          forfeitedDateRef.current.disabled = true;
        } else {
          enableCashSet();
        }
        if (trans.fullPaymentDate) {
          disableCashSet();
        }
      }
    }
  };

  const save = (e) => {
    e.preventDefault();
    console.log(trans);
    if (validate()) {
      if (
        balDate ===
        new Date(cashPaymentDateRef.current.value).toLocaleDateString("en-US")
        // new Date(trans.cashPaymentDate).toLocaleDateString("en-US")
      ) {
        if (trans.cashPayment < trans.sellingPrice) {
          setMessage("Payment amount is less than discounted price");
          setOpenModal(true);
        } else {
          saveTransaction();
        }
      } else {
        setMessage("Payment date and balance date is not equal.");
        setOpenModal(true);
      }
    } else {
      setMessage("Please fill all fields.");
      setOpenModal(true);
    }
  };

  const enableCancel = () => {
    if (trans.id != "" || trans.id != undefined) {
      let hasPaymentCash = false;
      let hasPaymentLay = false;
      console.log("trans.cashPayment:" + trans.cashPayment);
      if (
        trans.cashPayment === 0 ||
        trans.cashPayment === "" ||
        trans.cashPayment === undefined ||
        trans.cashPayment === null
      ) {
        hasPaymentCash = false;
      } else {
        hasPaymentCash = true;
      }
      if (
        trans.totalPayment === 0 ||
        trans.totalPayment === "" ||
        trans.totalPayment === undefined ||
        trans.totalPayment === null
      ) {
        hasPaymentLay = false;
      } else {
        hasPaymentLay = true;
      }
      if (hasPaymentCash || hasPaymentLay) {
        setDisableCancel(true);
      } else {
        setDisableCancel(false);
      }
    }
  };

  const disableCashSet = () => {
    paymentTermRef.current.disabled = true;
    paymentModeRef.current.disabled = true;
    cashPaymentRef.current.disabled = true;
    cashPaymentDateRef.current.disabled = true;
    referenceNoRef.current.disabled = true;
    savePayMentRef.current.disabled = true;
    setDisableSavePay(true);
  };

  const enableCashSet = () => {
    paymentTermRef.current.disabled = false;
    paymentModeRef.current.disabled = false;
    cashPaymentRef.current.disabled = false;
    cashPaymentDateRef.current.disabled = false;
    referenceNoRef.current.disabled = false;
    savePayMentRef.current.disabled = false;
    setDisableSavePay(false);
  };

  const cancelTrans = (e) => {
    e.preventDefault();
    if (cancelDateRef.current.value === "") {
      setMessage("Please enter cancelation date.");
      setOpenModal(true);
    } else {
      setMessage("Confirm cancelation of transaction.");
      setOpenModalConf(true);
    }
  };

  const confirmOk = () => {
    trans.canceledDate = cancelDateRef.current.value;
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/transactions/gbw/save", trans, {
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
          setMessage("Transaction canceled.");
          setOpenModal(true);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  return (
    <div
      className={styles.container}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={divRef}
    >
      <form>
        <div className={styles.tranMain}>
          <div>
            <div className={styles.row1}>
              <label>Code No.</label>
              <input
                ref={codeRef}
                maxLength="15"
                onChange={(e) => {
                  trans.codeNo = e.target.value.toUpperCase();
                }}
              ></input>
            </div>

            <div className={styles.row1}>
              <label>Transaction Date</label>
              <input
                ref={transactDateRef}
                type="date"
                onChange={(e) => {
                  trans.transactDate = e.target.value;
                }}
              ></input>
              <label>Description</label>
              <input
                ref={descriptionRef}
                maxLength="30"
                onChange={(e) => {
                  trans.description = e.target.value.toUpperCase();
                }}
              ></input>
            </div>
            <div className={styles.row3}>
              <label>Karat</label>
              <input
                ref={karatRef}
                maxLength="15"
                onChange={(e) => {
                  trans.karat = e.target.value.toUpperCase();
                }}
              ></input>
              <label style={{ marginLeft: "15px" }}>Weight</label>
              <input
                ref={weightRef}
                maxLength="15"
                onChange={(e) => {
                  trans.weight = e.target.value;
                }}
              ></input>
            </div>
            <div className={styles.row3}>
              <label>Capital</label>
              <input
                ref={capitalRef}
                defaultValue="0.00"
                maxLength="12"
                style={{ textAlign: "right" }}
                onFocus={(event) => event.target.select()}
                onChange={(e) => {
                  const { value } = e.target;
                  e.target.value = normalizeCurrency(value);
                  trans.capital = value.replaceAll(",", "").replaceAll("₱", "");
                }}
              ></input>
              <label style={{ marginLeft: "15px" }}>Selling</label>
              <input
                ref={sellingRef}
                defaultValue="0.00"
                maxLength="12"
                style={{ textAlign: "right" }}
                onFocus={(event) => event.target.select()}
                onChange={(e) => {
                  const { value } = e.target;
                  e.target.value = normalizeCurrency(value);
                  trans.sellingPrice = value
                    .replaceAll(",", "")
                    .replaceAll("₱", "");
                }}
              ></input>
            </div>
            <div className={styles.row1}>
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
              <input ref={senderNameRef} readOnly></input>
              <label>Complete Address</label>
              <input ref={senderAddressRef} readOnly></input>
              <label>Contact No.</label>
              <input ref={senderContactNoRef} readOnly></input>
              {/* <label>{cancelLabel}</label>
              <input type="date" ref={cancelDateRef}></input> */}
            </div>
            <div className={styles.buttonContainer4}>
              {/* <button
                className={styles.cancel}
                disabled={disableCancel}
                onClick={(e) => cancelTrans(e)}
              >
                Cancel Transaction
              </button> */}
              <button className={styles.save} onClick={(e) => saveDetails(e)}>
                Save Details
              </button>
            </div>
          </div>
          <div className={!disablePaymentUI ? styles.disabled : ""}>
            <div className={styles.row2}>
              <div className={styles.cardContainer}>
                <label>Payment Terms</label>
                <input ref={paymentTermRef} value={"CASH"} disabled></input>
              </div>
              <div className={styles.cardContainer}>
                <label>Payment Mode</label>
                <select
                  ref={paymentModeRef}
                  value={trans.paymentMode}
                  // placeholder="Payment Mode"
                  onChange={(e) => {
                    trans.paymentMode = e.target.value;
                    onPayMode(e);
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
                    trans.cashPaymentDate = e.target.value;
                    // getLastBaldate();
                  }}
                ></input>
                <label>Amount Received</label>
                <input
                  ref={cashPaymentRef}
                  defaultValue="0.00"
                  maxLength="12"
                  style={{ textAlign: "right" }}
                  onFocus={(event) => event.target.select()}
                  onChange={(e) => {
                    const { value } = e.target;
                    e.target.value = normalizeCurrency(value);
                    trans.cashPayment = value
                      .replaceAll(",", "")
                      .replaceAll("₱", "");
                  }}
                ></input>
                <label>Reference No.</label>
                <input
                  ref={referenceNoRef}
                  // placeholder="Reference ID"
                  onChange={(e) => {
                    // trans.referenceNo = e.target.value;
                    trans.referenceNo = e.target.value;
                  }}
                ></input>
              </div>
              {trans.correctingAmt != null && isCash && (
                <div className={styles.cardContainer2}>
                  <label>Adjustment</label>
                  <input
                    disabled
                    value={currencyFormat(trans.correctingAmt)}
                    style={{ textAlign: "right" }}
                  />
                </div>
              )}
              <div style={{ display: isCash ? "none" : "block" }}>
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.addGbw}
                    // disabled={isfullyPaid}
                    ref={savePayMentRef}
                    onClick={(e) => {
                      addPayment(e);
                    }}
                  >
                    Save Payment
                  </button>
                </div>

                <div className={styles.buttonContainer}>
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

                <div className={styles.buttonContainer}>
                  <button
                    className={styles.clearButton}
                    onClick={(e) => {
                      test(e);
                    }}
                  >
                    Clear/Refresh
                  </button>
                </div>
              </div>
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
      {openModalJewel && (
        <JewelryModal
          setOpenModalJewel={setOpenModalJewel}
          jewelry={setJewelry}
        />
      )}
      {openModalConf && (
        <ConfirmmModal
          setOpenModalConf={setOpenModalConf}
          message={message}
          confirmOk={confirmOk}
        />
      )}
    </div>
  );
};
export default TransactionGBW;
