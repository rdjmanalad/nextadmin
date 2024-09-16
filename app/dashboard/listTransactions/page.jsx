"use client";
import TransactionList from "@/app/ui/dashboard/transaction/transactionList/transactionList";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const ListTransactions = () => {
  const module = "All Transactions";
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
  return <div>{allowed && <TransactionList />}</div>;
};
export default ListTransactions;
