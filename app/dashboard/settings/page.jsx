"use client";
import Reference from "@/app/ui/dashboard/settings/reference";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const Settings = () => {
  const module = "Settings";
  const [permissions, setPermissions] = useLocalState([]);
  const router = useRouter();

  useEffect(() => {
    if (permissions) {
      if (permissions.includes(module)) {
        // setHasAccess(true);
      } else {
        router.push("/dashboard");
      }
    }
  }, []);
  return (
    <div>
      <Reference />
    </div>
  );
};
export default Settings;
