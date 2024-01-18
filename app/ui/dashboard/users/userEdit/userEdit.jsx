"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";
import styles from "./userEdit.module.css";

const UserEdit = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validPass, setValidPass] = useState();
  //   const [validPasss, setValidPasss] = useState(false);
  const isClient = typeof window !== "undefined";
  const [user, setUser] = isClient ? useLocalState("user", "") : ["", () => {}];
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count > 0) {
      if (validPass) {
        // Check if the new password and confirmation match
        if (newPassword === "" || newPassword === null) {
          setErrorMessage("Password must not be empty");
        } else {
          if (newPassword === confirmPassword) {
            saveNewPass();
          } else {
            setErrorMessage("New password and confirmation do not match.");
          }
        }
      } else {
        // Password is invalid, show an error message
        setErrorMessage("Invalid current password. Please try again.");
      }
    }
    setCount(count + 1);
  }, [validPass]);

  const handlePasswordChange = () => {
    validatePassword();
  };

  const validatePassword = () => {
    const jwt = window.sessionStorage.getItem("jwt");
    // alert(user + " / " + currentPassword);
    setValidPass(false);
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(
        baseUrl + "/api/users/validatePass/" + user + "/" + currentPassword,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setValidPass(response.data);
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

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Change Password</h2>
        <div className={styles.row} style={{ marginTop: "20px" }}>
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.buttonDiv}>
          <button onClick={handlePasswordChange}>Change Password</button>
        </div>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default UserEdit;
