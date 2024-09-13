"use client";
import UserAdd from "@/app/ui/dashboard/users/userAdd/userAdd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLocalState from "@/app/hooks/useLocalState";

const UsersAdd = () => {
  const module = "UserAdd";
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

  return <div>{allowed && <UserAdd />}</div>;
};
export default UsersAdd;
