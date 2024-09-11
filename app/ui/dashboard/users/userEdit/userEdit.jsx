"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";
import styles from "./userEdit.module.css";
import MessageModal from "../../modal/messageModal";

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
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showHide, setShowHide] = useState("Show");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showHide1, setShowHide1] = useState("Show");
  const [passType, setPassType] = useState("password");
  const [passType1, setPassType1] = useState("password");

  const testPassword = (valid) => {
    if (valid) {
      if (!validateString(newPassword)) {
        setMessage(
          "Password must have at least 8 characters, with a combination of lower and upper case letters, special characters, and numbers."
        );
        setOpenModal(true);
        // setErrorMessage("Password must not be empty");
      } else {
        if (newPassword === confirmPassword) {
          saveNewPass();
        } else {
          // setErrorMessage("New password and confirmation do not match.");
          setMessage("New password and confirmation do not match.");
          setOpenModal(true);
        }
      }
    } else {
      // setErrorMessage("Invalid current password. Please try again.");
      setMessage("Invalid current password. Please try again.");
      setOpenModal(true);
    }
  };

  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
    if (showPassword) {
      setShowHide("Show");
      setPassType("password");
    } else {
      setShowHide("Hide");
      setPassType("text");
    }
  };

  const togglePasswordVisibility1 = (e) => {
    e.preventDefault();
    setShowPassword1(!showPassword1);
    if (showPassword1) {
      setShowHide1("Show");
      setPassType1("password");
    } else {
      setShowHide1("Hide");
      setPassType1("text");
    }
  };

  function validateString(str) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(str);
  }

  const handlePasswordChange = () => {
    validatePassword();
  };

  const validatePassword = () => {
    const jwt = window.sessionStorage.getItem("jwt");
    // alert(user + " / " + currentPassword);
    setValidPass(false);
    if (currentPassword) {
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
          testPassword(response.data);
          // setValidPass(response.data);
        });
    }
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
          // setSuccessMessage("Password updated successfully!");
          setMessage("Password updated successfully!");
          setOpenModal(true);
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
        <div className={styles.row1}>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type={passType}
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={(e) => togglePasswordVisibility(e)}>
            {showHide}
          </button>
        </div>
        <div className={styles.row1}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type={passType1}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={(e) => togglePasswordVisibility1(e)}>
            {showHide1}
          </button>
        </div>
        <div className={styles.buttonDiv}>
          <button onClick={handlePasswordChange}>Change Password</button>
        </div>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
        {successMessage && (
          <div style={{ color: "green" }}>{successMessage}</div>
        )}
      </div>
      {openModal && (
        <MessageModal setOpenModal={setOpenModal} message={message} />
      )}
    </div>
  );
};

export default UserEdit;
