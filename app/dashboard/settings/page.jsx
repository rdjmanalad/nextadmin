"use client";
import Reference from "@/app/ui/dashboard/settings/reference";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const Settings = () => {
  const module = "Settings";
  const [permissions, setPermissions] = useLocalState([]);
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (permissions) {
      if (permissions.includes(module)) {
        // setHasAccess(true);
        setAllowed(true);
      } else {
        router.push("/dashboard");
        setAllowed(false);
      }
    }
  }, []);

  return <div>{allowed && <Reference />}</div>;
};
export default Settings;
