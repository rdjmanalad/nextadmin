// hooks/useCheckGrant.js
"use client";
import { useState, useEffect } from "react";
import useLocalState from "./useLocalState";

export function useCheckGrant(module, app) {
  // Retrieve and manage local state for permissions and appType
  const [permissions, setPermissions] = useLocalState([], "permissions");
  const [allowed, setAllowed] = useState(false);
  const [appType, setAppType] = useLocalState("appType", "");

  useEffect(() => {
    // Update the allowed state whenever permissions, appType, or module change
    if (permissions.includes(module) && appType === app) {
      setAllowed(true);
    } else {
      setAllowed(false);
    }
  }, []);

  // Function to update the permissions or appType
  // function updateState(newPermissions, newAppType) {
  //   setPermissions(newPermissions);
  //   setAppType(newAppType);
  // }

  return { allowed };
}
