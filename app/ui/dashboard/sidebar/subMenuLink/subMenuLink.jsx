"use client";
import styles from "./subMenulink.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import useLocalState from "@/app/hooks/useLocalState";

const SubMenuLink = ({ item }) => {
  const isClient = typeof window !== "undefined";
  const pathname = usePathname();
  const [userRole, setUserRole] = isClient
    ? useLocalState("userRole", "")
    : ["", () => {}];
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    if (
      userRole !== "ROLE_ADMIN" &&
      item.title.toString() === "Add/Edit Users"
    ) {
      setIsAdmin(false);
    }
  }, []);

  return (
    <div>
      {isAdmin && (
        <Link
          href={item.path}
          className={`${styles.container} 
        ${pathname === item.path && styles.active}`}
        >
          {item.icon}
          {item.title}
        </Link>
      )}
    </div>
  );
};
export default SubMenuLink;
