"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";
import useLocalState from "@/app/hooks/useLocalState";
import { MdSearch } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import MessageModal from "../modal/messageModal";

const Navbar = () => {
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [balDate, setBalDate] = useLocalState("balDate", "");
  const [userRole, setUserRole] = isClient
    ? useLocalState("userRole", "")
    : ["", () => {}];
  const pathname = usePathname();

  const [userr, setUserr] = useState("");
  const [userrRole, setUserrRole] = useState("");
  const [latestDate, setLatestDate] = useState("");
  const [balStatus, setBalStatus] = useState("");
  const [isUpdated, setIsUpdated] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUserr(user);
    setUserrRole(userRole);
    getMaxBalanceDate();
    passwordCheckDate();
  }, []);

  useEffect(() => {
    const now = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (now === latestDate) {
      setBalStatus("Balance is updated (" + latestDate + ")");
      setIsUpdated(true);
    } else {
      setIsUpdated(false);
      setBalStatus("Balance is outdated (" + latestDate + ")");
    }
    // setBalDate(latestDate);
  }, [latestDate]);

  const getMaxBalanceDate = () => {
    var balCurDate = "";
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/dashboard/balance/getMaxBalDate", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        // alert(data);
        window.sessionStorage.setItem(
          "balDate",
          new Date(data).toLocaleDateString("en-US")
        );
        setBalDate(new Date(data).toLocaleDateString("en-US"));
        setLatestDate(
          new Date(data).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );
      });
  };

  const passwordCheckDate = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    let passDate = "";
    let today = new Date().toLocaleDateString("en-CA");
    let timeDiff = 0;
    let differenceInDays = 0;
    let ninetyDayDiff = 0;
    let initial = window.sessionStorage.getItem("initial");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users/getbyusername/" + user, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        passDate = new Date(data.passChangeDate).toLocaleDateString("en-CA");
        timeDiff = Math.abs(new Date(passDate) - new Date(today));
        differenceInDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        ninetyDayDiff = 90 - differenceInDays;
        if (ninetyDayDiff < 11) {
          if (initial === 1) {
            setMessage(
              "Your password will expire in " + ninetyDayDiff + " day/s."
            );
            setOpenModal(true);
            window.sessionStorage.setItem("initial", 0);
          }
        }
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>{pathname.split("/").pop()}</div>
      <div className={styles.menu}>
        <div>
          {isUpdated && <label className={styles.labeltxt}>{balStatus}</label>}
          {!isUpdated && (
            <label className={styles.blinkingText}>{balStatus}</label>
          )}
        </div>
        <div className={styles.search}>
          {/* <MdSearch />
          <input type="text" placeholder="Search..." className={styles.input} /> */}
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
      {openModal && (
        <MessageModal setOpenModal={setOpenModal} message={message} />
      )}
    </div>
  );
};
export default Navbar;
