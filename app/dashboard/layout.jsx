"use client";
import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
import styles from "../ui/dashboard/dashboard.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isTokenExpired } from "../auth";
import useLocalState from "../hooks/useLocalState";
import SidebarGBW from "../ui/dashboard/sidebar/sidebarGBW";

const Layout = ({ children }) => {
  const [appType, setAppType] = useLocalState("appType", "");
  const [isGBW, setIsGBW] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (jwtToken && isTokenExpired(jwtToken)) {
      router.push("/login");
      window.sessionStorage.clear();
    }
    setIsGBW(appType === "GBW" ? true : false);
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.menu}>{isGBW ? <SidebarGBW /> : <Sidebar />}</div>
      <div className={styles.content}>
        <Navbar />
        {children}
      </div>
    </div>
  );
};
export default Layout;
