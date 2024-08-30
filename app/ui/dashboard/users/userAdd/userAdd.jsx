"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";
import styles from "./userAdd.module.css";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/auth";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Instrument_Sans } from "next/font/google";
import MessageModal from "../../modal/messageModal";
import ConfirmmModal from "../../modal/confirmModal";
import UserEdit from "../userEdit/userEdit";

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
  const userNameRef = useRef();
  const passRef = useRef();
  const editNameRef = useRef();
  const editRoleRef = useRef();
  const [openModalConf, setOpenModalConf] = useState(false);
  const [openModalConf2, setOpenModalConf2] = useState(false);
  const [appUsers, setAppUsers] = useState({});
  const [appUser, setAppUser] = useState({
    userId: "",
    username: "",
    password: "",
    roles: [{ roleId: "", roleName: "" }],
  });
  const [appUserEdit, setAppUserEdit] = useState({
    userId: "",
    username: "",
    password: "",
    roles: [{ roleId: "", roleName: "" }],
    accountLocked: "",
  });
  const [rowData, setRowData] = useState([]);
  const [roleId, setRoleId] = useState("");
  const gridRef = useRef();
  const gridRef2 = useRef();
  const [rowSelected, setRowSelected] = useState({});
  const [edUName, setEdUName] = useState("");
  const [edRole, setEdRole] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [lockedUsers, setLockedUsers] = useState([]);

  const onGridReady = useCallback((params) => {
    getUsers();
    getLockedUsers();
  }, []);

  //   useEffect(() => {
  //     alert("fdfdf");
  //   }, [rolesdp]);

  useEffect(() => {
    // setJwt(window.sessionStorage.getItem("jwt"));
    userNameRef.current.value = "";
    passRef.current.value = "";
    setUserName("");
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
      // getLockedUsers();
      // getUsers();
    }
  }, []);

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
          if (userRole === "") {
            setMessage("Choose a Role.");
            setOpenModal(true);
          } else {
            saveNewUser();
          }
        } else {
          // setErrorMessage("New password and confirmation do not match.");
          setMessage("New password and confirmation do not match.");
          setOpenModal(true);
        }
      }
    } else {
      // setErrorMessage("Invalid current password. Please try again.");
      setMessage("User already exist!");
      setOpenModal(true);
    }
  };

  function validateString(str) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(str);
  }

  const getUsers = () => {
    const jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("jwt").replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users")
      .then((response) => response.data)
      .then((data) => {
        setRowData(data);
        console.log(data);
      })
      .catch((message) => {
        alert(message);
      });
  };

  const getLockedUsers = () => {
    const jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("jwt").replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users/getLockedUsers")
      .then((response) => response.data)
      .then((data) => {
        setLockedUsers(data);
        // console.log(data);
      })
      .catch((message) => {
        alert(message);
      });
  };

  const handleSaveUser = () => {
    validateUser();
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
        testPassword(response.data);
        // setValidUser(response.data);
      });
  };

  const saveNewUser = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    appUser.username = userName;
    appUser.password = newPassword;
    appUser.roles[0].roleId = userRole;
    axios
      .post(baseUrl + "/api/users/saveUser", appUser, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data);
          setAppUser(response.data);
          // setErrorMessage("");
          // setSuccessMessage("New User successfully created!");
          setMessage("New User successfully created!");
          setOpenModal(true);
          getUsers();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveEdit = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/users/saveUser", appUserEdit, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data);
          setAppUser(response.data);
          // setErrorMessage("");
          // setSuccessMessage("Changes Saved!");
          setMessage("Changes Saved!");
          setOpenModal(true);
          getUsers();
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
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const deleteUser = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .delete(baseUrl + "/api/users/delete/" + appUserEdit.userId, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("User deleted.");
          setOpenModal(true);
          getUsers();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const lockUnlock = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/users/unlockUser/" + appUserEdit.userId, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          let msg = appUserEdit.accountLocked
            ? "User is now unlocked."
            : "User is now locked.";
          setMessage(msg);
          setOpenModal(true);
          getUsers();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const resetPassword = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/users/resetPassword/" + appUserEdit.userId, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage(
            "The new password for " +
              appUserEdit.username +
              " is " +
              response.data
          );
          setOpenModal(true);
          getUsers();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const columnDefs = [
    {
      headerName: "Username",
      field: "username",
      width: "180",
    },
    {
      headerName: "Role",
      valueGetter: function (params) {
        // Check if roles array is not empty
        if (params.data.roles.length > 0) {
          return params.data.roles[0].roleName;
        }
        return "";
      },
      width: "160",
    },
    {
      headerName: "Locked",
      field: "accountLocked",
      width: "80",
      // editable: true,
    },
  ];

  const columnDefs2 = [
    {
      headerName: "Username",
      field: "username",
      width: "180",
    },
    {
      headerName: "Locked",
      field: "accountLocked",
      width: "65",
      editable: true,
    },
  ];

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length > 0) {
      setEdUName(selectedRows[0].username);
      setEdRole(selectedRows[0].roles[0].roleId);
      setAppUserEdit(selectedRows[0]);
    }
  }, []);

  const handleChange = (e) => {
    setEdUName(e.target.value);
    appUserEdit.username = e.target.value;
  };

  const handleChangeRole = (e) => {
    setEdRole(e.target.value);
    for (const item of rolesdp) {
      var id1 = item.roleId.toString();
      var id2 = e.target.value.toString();
      if (id1 === id2) {
        appUserEdit.roles[0].roleName = item.roleName;
      }
    }
    appUserEdit.roles[0].roleId = e.target.value;
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (edUName === "" || edRole === "") {
      setMessage("Please fill Username and Role.");
      setOpenModal(true);
    } else {
      saveEdit();
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (appUserEdit.userId === "" || appUserEdit.userId === undefined) {
      setMessage("Please choose a user.");
      setOpenModal(true);
    } else {
      deleteUser();
      // alert("cont");
    }
  };

  const onCellValueChanged = (event) => {
    console.log("Cell value changed", event.data);
    setMessage("Unlock User?");
    setOpenModalConf(true);
  };

  const confirmOk = () => {
    lockUnlock();
  };

  const confirmOk2 = () => {
    resetPassword();
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    console.log(appUserEdit);
    let msg = appUserEdit.accountLocked ? "Unlock user?" : "Lock user?";
    setMessage(msg);
    setOpenModalConf(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    setMessage("Reset Password for " + appUserEdit.username + "?");
    setOpenModalConf2(true);
  };

  return (
    <div className={styles.container1}>
      <div className={styles.container}>
        <div className={styles.form}>
          <h2>Add Users</h2>
          <div className={styles.row} style={{ marginTop: "20px" }}>
            <label>User Name:</label>
            <input
              ref={userNameRef}
              autoComplete="off"
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className={styles.row}>
            <label>Password:</label>
            <input
              ref={passRef}
              autoComplete="new-password"
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
                <option
                  value={rolesdp[i].roleId}
                  key={rolesdp[i].roleId}
                  // onChange={(e) => setRoleId(rolesdp[i].roleId)}
                >
                  {rolesdp[i].roleName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button className={styles.saveButton} onClick={handleSaveUser}>
              Save User
            </button>
          </div>
          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          {successMessage && (
            <div style={{ color: "green" }}>{successMessage}</div>
          )}
        </div>
      </div>
      <div>
        <div className={styles.container}>
          <div className={styles.form}>
            <h2>Edit Users</h2>
            <div className={`ag-theme-quartz ${styles.aggrid}`}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                rowSelection={"single"}
                onSelectionChanged={onSelectionChanged}
                onCellValueChanged={onCellValueChanged}
                ref={gridRef}
                onGridReady={onGridReady}
                alwaysShowHorizontalScroll={true}
              />
            </div>
            <div className={styles.row} style={{ marginTop: "20px" }}>
              <label>User Name:</label>
              <input
                ref={editNameRef}
                autoComplete="off"
                maxLength={30}
                type="text"
                id="userNameE"
                value={edUName}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className={styles.row}>
              <label>User Role:</label>
              <select
                onChange={(e) => handleChangeRole(e)}
                ref={editRoleRef}
                value={edRole}
              >
                <option></option>
                {rolesdp.map((o, i) => (
                  <option
                    value={rolesdp[i].roleId}
                    key={rolesdp[i].roleId}
                    // onChange={(e) => setRoleId(rolesdp[i].roleId)}
                  >
                    {rolesdp[i].roleName}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttonDiv}>
              <button
                className={styles.saveButton}
                onClick={(e) => handleSaveEdit(e)}
              >
                Save Changes
              </button>
              <button
                className={styles.deleteButton}
                onClick={(e) => handleDelete(e)}
              >
                Delete
              </button>
            </div>
            <div className={styles.buttonDiv}>
              <button
                className={styles.saveButton}
                onClick={(e) => handleResetPassword(e)}
              >
                Reset Password
              </button>
              <button
                className={styles.saveButton}
                onClick={(e) => handleUnlock(e)}
              >
                Lock\Unlock User
              </button>
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <MessageModal setOpenModal={setOpenModal} message={message} />
      )}
      {openModalConf && (
        <ConfirmmModal
          setOpenModalConf={setOpenModalConf}
          message={message}
          confirmOk={confirmOk}
        />
      )}
      {openModalConf2 && (
        <ConfirmmModal
          setOpenModalConf={setOpenModalConf2}
          message={message}
          confirmOk={confirmOk2}
        />
      )}
    </div>
  );
};

export default UserAdd;
