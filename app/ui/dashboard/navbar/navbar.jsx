"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import useLocalState from "@/app/hooks/useLocalState";
import { MdSearch } from "react-icons/md";
import { useEffect, useState } from "react";

const Navbar = () => {
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [userRole, setUserRole] = isClient
    ? useLocalState("userRole", "")
    : ["", () => {}];
  const pathname = usePathname();

  const [userr, setUserr] = useState("");
  const [userrRole, setUserrRole] = useState("");

  useEffect(() => {
    setUserr(user);
    setUserrRole(userRole);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title}>{pathname.split("/").pop()}</div>
      <div className={styles.menu}>
        <div className={styles.search}>
          <MdSearch />
          <input type="text" placeholder="Search..." className={styles.input} />
        </div>
        <div className={styles.icon}>
          <div className={styles.user}>
            <Image
              className={styles.userImage}
              src="/noavatar.png"
              alt=""
              width="35"
              height="35"
            />
            <div className={styles.userDetails}>
              <span className={styles.username}>{userr}</span>
              <span className={styles.userTitle}>{userrRole.substring(5)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
