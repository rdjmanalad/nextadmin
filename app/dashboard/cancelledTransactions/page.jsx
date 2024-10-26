"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";
import CancelledTransactions from "@/app/ui/dashboard/transaction/cancelledTransactions/cancelledTransactions";
// import CancelledTransactions from "@/app/ui/dashboard/transaction/cancelledTransactions/CancelledTransactions";
// import CancelledTransactions from "@/app/ui/dashboard/transaction/ca"

const Cancelled = () => {
  const module = "Cancelled Transactions";
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

  return <div>{allowed && <CancelledTransactions />}</div>;
};
export default Cancelled;
