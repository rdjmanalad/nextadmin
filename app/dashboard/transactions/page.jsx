"use client";
import Transaction from "@/app/ui/dashboard/transaction/transaction";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const Transactions = () => {
  const module = "Transactions";
  const app = ["AJC", "ALL"];
  const [permissions, setPermissions] = useLocalState([]);
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [appType, setAppType] = useLocalState("appType", "");

  useEffect(() => {
    if (permissions) {
      if (permissions.includes(module)) {
        if (app.includes(appType)) {
          setAllowed(true);
        } else {
          router.push("/dashboard");
          setAllowed(false);
        }
      } else {
        router.push("/dashboard");
        setAllowed(false);
      }
    }
  }, []);

  const emptyObj = {
    id: "",
    codeNo: "",
    inventoryNo: "",
    transactDate: "",
    description: "",
    karat: "",
    weight: "",
    capital: "0",
    discountedPrice: "0",
    customerName: "",
    receiverName: "",
    address: "",
    contactNo: "",
    paymentTerm: "",
    paymentMode: "",
    cashPaymentDate: "",
    cashPayment: "0",
    referenceNo: "",
    totalPayment: "0",
    balance: "0",
    fullPaymentDate: "",
    forfeitedAmt: "0",
    forfeitedDate: "",
    user: "",
    timeStamped: "",
  };

  return <div>{allowed && <Transaction emptyObj={emptyObj} />}</div>;
};
export default Transactions;
