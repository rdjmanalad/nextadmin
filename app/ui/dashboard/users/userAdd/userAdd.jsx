"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";
import styles from "./userAdd.module.css";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/auth";

const UserAdd = () => {
  const [userName, setUserName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validUser, setValidUser] = useState();
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [count, setCount] = useState(0);
  const [rolesdp, setRoledp] = useState([]);
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  //   useEffect(() => {
  //     alert("fdfdf");
  //   }, [rolesdp]);

  useEffect(() => {
    // setJwt(window.sessionStorage.getItem("jwt"));
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (jwtToken && isTokenExpired(jwtToken)) {
      router.push("/login");
      window.sessionStorage.clear();
    }
    if (jwtToken && !isTokenExpired(jwtToken)) {
      getDropdown();
    }
  }, []);

  useEffect(() => {
    if (count > 0) {
      //   setErrorMessage("");
      alert(userName);
      if (userName === "" || userName === null) {
        if (validUser) {
          setErrorMessage("");
          // Check if the new password and confirmation match
          if (newPassword === "" || newPassword === null) {
            setErrorMessage("Password must not be empty");
          } else {
            if (newPassword === confirmPassword) {
              setSuccessMessage("saving success");
              // saveNewPass();
            } else {
              setErrorMessage("New password and confirmation do not match.");
            }
          }
        } else {
          // Password is invalid, show an error message
          setErrorMessage("Username already exist.");
        }
      } else {
        setErrorMessage("Please fill in Username.");
      }
    }
    setCount(count + 1);
  }, [validUser]);

  const handleSaveUser = () => {
    if (userName === "" || userName === null) {
      setErrorMessage("Please fill in Username.");
    } else {
      alert("sss");
      validateUser();
    }
  };

  const validateUser = () => {
    const jwt = window.sessionStorage.getItem("jwt");
    setValidUser(false);
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users/validateUser/" + userName, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setValidUser(response.data);
      });
  };

  const saveNewPass = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/users/savePass/" + user + "/" + newPassword, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          //   setValidPass(false);
          setErrorMessage("");
          setSuccessMessage("Password updated successfully!");

          // alert("success");
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const getDropdown = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users/getRoles", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setRoledp(response.data);
          console.log("roles: " + response.data);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  return (
    <div className={styles.container1}>
      <div className={styles.container}>
        <div className={styles.form}>
          <h2>Add Users</h2>
          <div className={styles.row} style={{ marginTop: "20px" }}>
            <label>User Name:</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <label>Password:</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <label>Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <label>User Role:</label>
            <select onChange={(e) => setUserRole(e.target.value)}>
              <option></option>
              {rolesdp.map((o, i) => (
                <option value={rolesdp[i].roleName} key={rolesdp[i].roleId}>
                  {rolesdp[i].roleName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.buttonDiv}>
            <button onClick={handleSaveUser}>Save User</button>
          </div>
          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          {successMessage && (
            <div style={{ color: "green" }}>{successMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAdd;
