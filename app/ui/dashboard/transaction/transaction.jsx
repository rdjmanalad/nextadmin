"use client";
import useLocalState from "@/app/hooks/useLocalState";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import styles from "./transaction.module.css";
import { useRouter } from "next/navigation";

const Transaction = () => {
  const codeRef = useRef();
  const [trans, setTrans] = useState({});
  const [pt, setPt] = useState([]);
  const [pm, setPm] = useState([]);
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [isCash, setIsCash] = useState(false);
  // const [jwt, setJwt] = useState("");

  const emptyObj = {
    id: "",
    codeNo: "",
    inventoryNo: "",
    description: "",
    karat: "",
    weight: "",
    capital: "",
    discountedPrice: "",
    customerName: "",
    receiverName: "",
    address: "",
    contactNo: "",
    paymentTerm: "",
    paymentMode: "",
    cashPaymentDate: "",
    cashPayment: "",
    referenceNo: "",
    totalPayment: "",
    balance: "",
    fullPaymentDate: "",
    forfeitedAmt: "",
    forfeitedDate: "",
    user: "",
    timeStamped: "",
  };

  const router = useRouter();

  useEffect(() => {
    // setJwt(window.sessionStorage.getItem("jwt"));
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (window.sessionStorage.getItem("jwt") != null) {
      setTrans(emptyObj);
      getReference();
    }
  }, []);

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

  const saveTransaction = () => {
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
          alert("success");
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const save = (e) => {
    e.preventDefault();
    console.log("transcode" + trans);
    saveTransaction();
  };

  const onPayTerm = (e) => {
    e.preventDefault();
    if (e.target.value === pt[0].name) {
      setIsCash(true);
    }
    if (e.target.value === pt[1].name) {
      setIsCash(false);
    }
    trans.paymentTerm = e.target.value;
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
              placeholder="Code#"
              onChange={(e) => {
                trans.codeNo = e.target.value;
              }}
            ></input>
            <label>Inv#</label>
            <input
              placeholder="Inv#"
              maxLength="15"
              onChange={(e) => {
                trans.inventoryNo = e.target.value;
              }}
            ></input>
            <label>Description</label>
            <input
              placeholder="Description"
              maxLength="30"
              onChange={(e) => {
                trans.description = e.target.value;
              }}
            ></input>
            <label>Karat</label>
            <input
              placeholder="Karat"
              maxLength="15"
              onChange={(e) => {
                trans.karat = e.target.value;
              }}
            ></input>
            <label>Weight</label>
            <input
              placeholder="Weight"
              maxLength="15"
              onChange={(e) => {
                trans.weight = e.target.value;
              }}
            ></input>
            <label>Capital</label>
            <input
              placeholder="Capital"
              maxLength="12"
              onChange={(e) => {
                trans.capital = e.target.value;
              }}
            ></input>
            <label>Discounted Price</label>
            <input
              placeholder="Discounted Price"
              maxLength="12"
              onChange={(e) => {
                trans.discountedPrice = e.target.value;
              }}
            ></input>
            <label>Customer Name</label>
            <input
              placeholder="Customer Name"
              maxLength="50"
              onChange={(e) => {
                trans.customerName = e.target.value;
              }}
            ></input>
            <label>Receivers Name</label>
            <input
              placeholder="Receivers Name"
              maxLength="50"
              onChange={(e) => {
                trans.receiverName = e.target.value;
              }}
            ></input>
            <label>Complete Address</label>
            <input
              placeholder="Complete Address"
              maxLength="100"
              onChange={(e) => {
                trans.address = e.target.value;
              }}
            ></input>
            <label>Contact No.</label>
            <input
              placeholder="Contact No."
              maxLength="15"
              onChange={(e) => {
                trans.contactNo = e.target.value;
              }}
            ></input>
            <label>Senders Name</label>
            <input readOnly value={"Aurora Jewelry Collection"}></input>
            <label>Complete Address</label>
            <input
              readOnly
              value={"# 3286 Jervois St. Brgy. Pinagkaisahan, Makati City"}
            ></input>
            <label>Contact No.</label>
            <input readOnly value={"0999-993-1148"}></input>
            <br></br>
            <br></br>
          </div>
          <div className={styles.row2}>
            <div className={styles.cardContainer}>
              <label>Payment Terms</label>
              <select
                placeholder="Payment Terms"
                onChange={(e) => {
                  onPayTerm(e);
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
                  trans.paymentMode = e.target.value;
                }}
              >
                <option></option>
                {pm.map((o, i) => (
                  <option value={pm[i].name} key={pm[i].id}>
                    {pm[i].name}
                  </option>
                ))}
              </select>
              <label>Payment Date</label>
              <input
                type="date"
                placeholder="Payment Date"
                onChange={(e) => {
                  trans.cashPaymentDate = e.target.value;
                }}
              ></input>
              <label>Amount Received</label>
              <input
                placeholder="Amount Received"
                onChange={(e) => {
                  trans.cashPayment = e.target.value;
                }}
              ></input>
              <label>Reference No.</label>
              <input
                placeholder="Reference ID"
                onChange={(e) => {
                  trans.referenceNo = e.target.value;
                }}
              ></input>
            </div>
            <div className={styles.layContainer}>
              <label>Lay-Away</label>
            </div>
            <div className={styles.cardContainer2}>
              <label>Total Payment</label>
              <input
                placeholder="Total Payment"
                disabled={isCash}
                onChange={(e) => {
                  trans.totalPayment = e.target.value;
                }}
              />
              <label>Total Balance</label>
              <input
                placeholder="Total Balance"
                disabled={isCash}
                onChange={(e) => {
                  trans.balance = e.target.value;
                }}
              ></input>
              <label>Date Fully Paid</label>
              <input
                type="date"
                disabled={isCash}
                onChange={(e) => {
                  trans.fullPaymentDate = e.target.value;
                }}
              ></input>
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.add} disabled={isCash}>
                Add Payment
              </button>
              <button className={styles.forfeit} disabled={isCash}>
                Forfeit
              </button>
            </div>
            <div className={styles.cardContainer2}>
              <label>Amount Paid</label>
              <input placeholder="Total Payment" disabled={isCash}></input>
              <label>Less 50%</label>
              <input placeholder="Total Balance" disabled={isCash}></input>
              <label>Total Refund</label>
              <input disabled={isCash}></input>
            </div>
            <div className={styles.buttonContainer2}>
              <button className={styles.lbc}>Print LBC form</button>
              <button className={styles.receipt}>Print Receipt</button>
            </div>
            <div className={styles.buttonContainer3}>
              <button className={styles.save} onClick={(e) => save(e)}>
                Save Details
              </button>
              <button className={styles.printForfeited} disabled={isCash}>
                Print Forfeited
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Transaction;
