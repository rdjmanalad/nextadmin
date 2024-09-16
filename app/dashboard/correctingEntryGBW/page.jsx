"use client";
import CorrectingEntryGBW from "@/app/ui/dashboard/transaction/correctingEntry/correctingEntryGBW";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const Correcting = () => {
  const module = "Correcting Entry";
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
  return <div>{allowed && <CorrectingEntryGBW />}</div>;
};
export default Correcting;
