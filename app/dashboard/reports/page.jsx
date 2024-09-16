"use client";
import PrintReports from "@/app/ui/dashboard/reports/printReports";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const Reports = () => {
  const module = "Reports";
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
  return <div>{allowed && <PrintReports />}</div>;
};
export default Reports;
