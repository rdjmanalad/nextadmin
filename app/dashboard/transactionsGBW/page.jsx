"use client";
import TransactionGBW from "@/app/ui/dashboard/transaction/transactionGBW";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const Transactions = () => {
  const module = "Transactions";
  const app = "GBW";
  const [permissions, setPermissions] = useLocalState([]);
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [appType, setAppType] = useLocalState("appType", "");

  useEffect(() => {
    if (permissions) {
      if (permissions.includes(module)) {
        if (appType === app) {
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
    sellingPrice: "0",
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
    user: "",
    timeStamped: "",
  };

  return <div>{allowed && <TransactionGBW emptyObj={emptyObj} />}</div>;
};
export default Transactions;
