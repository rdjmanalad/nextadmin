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

const Transaction = ({ emptyObj }) => {
  const [trans, setTrans] = useState({});
  const [transOrg, setTransOrg] = useState({});
  const [pt, setPt] = useState([]);
  const [pm, setPm] = useState([]);
  const [sd, setSd] = useState([]);
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [isCash, setIsCash] = useState(false);
  const [pTerm, setPTerm] = useState("TERM");
  const [pMode, setPMode] = useState("");
  const [isForfeited, setIsForfeited] = useState(false);
  const [allowForfeit, setAllowForfeit] = useState(false);
  const [formattedNumber, setFormattedNumber] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openModalLA, setOpenModalLA] = useState(false);
  const [openModalJewel, setOpenModalJewel] = useState(false);
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [isfullyPaid, setIsfullyPaid] = useState(false);
  const [message, setMessage] = useState("");
  const [latestBalDate, setLatestBalDate] = useState("");
  const [jewelry, setJewelry] = useState({});
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

  useEffect(() => {
    if (emptyObj.id != "") {
      populate();
    }
  }, [trans]);

  useEffect(() => {
    // alert("ss");
    if (jewelry.length > 0) {
      inventoryNoRef.current.value = jewelry[0].inventoryNo;
      descriptionRef.current.value = jewelry[0].description;
      karatRef.current.value = jewelry[0].karat;
      weightRef.current.value = jewelry[0].weight;
      sellingRef.current.value = currencyFormat(jewelry[0].sellingPrice);
      capitalRef.current.value = currencyFormat(jewelry[0].capital);

      trans.inventoryNo = jewelry[0].inventoryNo;
      trans.description = jewelry[0].description;
      trans.karat = jewelry[0].karat;
      trans.weight = jewelry[0].weight;
      trans.capital = jewelry[0].capital;
      trans.selling = jewelry[0].sellingPrice;
    }

    console.log(jewelry);
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
  };

  useEffect(() => {
    // alert("all");
    forfeitedAmtRef.current.value = currencyFormat(trans.forfeitedAmt);
  }, [isForfeited]);

  const populate = () => {
    codeRef.current.value = trans.codeNo;
    inventoryNoRef.current.value = trans.inventoryNo;
    transactDateRef.current.value = formatDate(trans.transactDate);
    descriptionRef.current.value = trans.description;
    karatRef.current.value = trans.karat;
    weightRef.current.value = trans.weight;
    sellingRef.current.value = currencyFormat(trans.selling);
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
    sellingRef.current.value = currencyFormat(trans.sellingPrice);
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

    pcode = "SD";
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
      if (
        balDate ===
        new Date(cashPaymentDateRef.current.value).toLocaleDateString("en-US")
        // new Date(trans.cashPaymentDate).toLocaleDateString("en-US")
      ) {
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
        setMessage("Payment date and balance date is not equal.");
        setOpenModal(true);
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

  const validateDetails = () => {
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
      trans.cashPayment = transOrg.cashPayment;
      trans.paymentMode = transOrg.paymentMode;
      trans.cashPaymentDate = transOrg.cashPaymentDate;
      trans.referenceNo = transOrg.referenceNo;
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
    cashPaymentRef.current.value = isCash
      ? 0
      : discountedPriceRef.current.value;
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
      if (validPayDetails()) {
        if (!isCash) {
          if (
            latestBalDate ===
            new Date(layAway.paymentDate).toLocaleDateString("en-US")
          ) {
            if (trans.id === "" || trans.id === undefined) {
              saveTransaction();
            }
            layAway.transactionId = trans.id;
            layAway.user = user;
            saveLayAwayPay();
            saveTranPayment();
            saveBalance();
            populate();
          } else {
            setMessage("Payment date and balance date is not equal.");
            setOpenModal(true);
          }
        }
      } else {
        setMessage("Please fill all payment details");
        setOpenModal(true);
      }
    }
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

  const searchJewelry = (e) => {
    e.preventDefault();
    setOpenModalJewel(true);
  };

  const none = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.tranMain}>
          <div>
            <div className={styles.inv}>
              <label>Inventory No</label>
              <input
                ref={inventoryNoRef}
                // placeholder="Inventory No."
                maxLength="15"
                onChange={(e) => {
                  trans.inventoryNo = e.target.value.toUpperCase();
                }}
              ></input>
              <button
                className={styles.search}
                onClick={(e) => {
                  searchJewelry(e);
                }}
              >
                Search <MdSearch />
              </button>
            </div>

            <div className={styles.row1}>
              <label>Code No.</label>
              <input
                ref={codeRef}
                maxLength="15"
                // placeholder="Code#"
                onChange={(e) => {
                  trans.codeNo = e.target.value.toUpperCase();
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
            </div>
            <div className={styles.row3}>
              <label>Karat</label>
              <input
                ref={karatRef}
                // placeholder="Karat"
                maxLength="15"
                onChange={(e) => {
                  trans.karat = e.target.value.toUpperCase();
                }}
              ></input>
              <label style={{ marginLeft: "15px" }}>Weight</label>
              <input
                ref={weightRef}
                // placeholder="Weight"
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
              {/* <label>Karat</label>
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
              ></input> */}
              {/* <label>Capital</label>
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
              <label>Selling</label>
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
              ></input> */}
              <label>Discounted Price</label>
              <input
                ref={discountedPriceRef}
                maxLength="12"
                style={{ textAlign: "right" }}
                defaultValue="0.00"
                onFocus={(event) => event.target.select()}
                onChange={(e) => {
                  const { value } = e.target;
                  e.target.value = normalizeCurrency(value);
                  trans.cashPayment = value
                    .replaceAll(",", "")
                    .replaceAll("₱", "");
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
              <input ref={senderNameRef} readOnly></input>
              <label>Complete Address</label>
              <input ref={senderAddressRef} readOnly></input>
              <label>Contact No.</label>
              <input ref={senderContactNoRef} readOnly></input>
            </div>
            <div className={styles.buttonContainer4}>
              <button className={styles.save} onClick={(e) => saveDetails(e)}>
                Save Details
              </button>
            </div>
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
                  getLastBaldate();
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
              {isCash && (
                <button className={styles.save} onClick={(e) => save(e)}>
                  Save Payment
                </button>
              )}
              {!isCash && (
                <button
                  disabled
                  className={styles.save}
                  onClick={(e) => none(e)}
                ></button>
              )}
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
      {openModalJewel && (
        <JewelryModal
          setOpenModalJewel={setOpenModalJewel}
          jewelry={setJewelry}
        />
      )}
    </div>
  );
};
export default Transaction;
