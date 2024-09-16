"use client";
import ExistingLayaway from "@/app/ui/dashboard/transaction/existingLayaway/existingLayaway";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const ExistingLayAway = () => {
  const module = "Existing Layaway";
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
  return <div>{allowed && <ExistingLayaway />}</div>;
};
export default ExistingLayAway;
