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
  });
  const [rowData, setRowData] = useState([]);
  const [roleId, setRoleId] = useState("");
  const gridRef = useRef();
  const [rowSelected, setRowSelected] = useState({});
  const [edUName, setEdUName] = useState("");
  const [edRole, setEdRole] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  const onGridReady = useCallback((params) => {
    getUsers();
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
      // getUsers();
    }
  }, []);

  useEffect(() => {
    if (count > 0) {
      if (
        userNameRef.current.value !== "" ||
        userNameRef.current.value !== null
      ) {
        if (!validUser) {
          // setErrorMessage("Username already exist.");
          setMessage("Username already exist.");
          setOpenModal(true);
        }
        // setMessage("");
        if (validUser) {
          // setErrorMessage("");
          setMessage("");
          if (newPassword === "" || newPassword === null) {
            // setErrorMessage("Password must not be empty");
            setMessage("Password must not be empty");
            setOpenModal(true);
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
        }
        // else {
        //   // setErrorMessage("Username already exist.");
        //   setMessage("Username already exist.");
        //   setOpenModal(true);
        // }
      } else {
        // setErrorMessage("Please fill in Username..");
        setMessage("Please fill in Username.");
        setOpenModal(true);
      }
    }
    setCount(count + 1);
  }, [validUser]);

  const getUsers = () => {
    const jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("jwt").replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users")
      .then((response) => response.data)
      .then((data) => {
        setRowData(data);
        // setAppUsers(data);
      })
      .catch((message) => {
        alert(message);
      });
  };

  const handleSaveUser = () => {
    setMessage("");
    if (
      userNameRef.current.value === "" ||
      userNameRef.current.value === null
    ) {
      // setErrorMessage("Please fill in Username.");
      setMessage("Please fill in Username.");
      setOpenModal(true);
    } else {
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

  const columnDefs = [
    {
      headerName: "User Id",
      field: "userId",
      width: "80",
    },
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
  ];

  // useEffect(() => {
  //   editNameRef.current.value = appUserEdit.username;
  //   // editRoleRef.current.value = appUserEdit.roles[0].roleName;
  // }, [appUserEdit]);

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
                //   autoSizeStrategy={autoSizeStrategy}
                rowSelection={"single"}
                onSelectionChanged={onSelectionChanged}
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
          </div>
        </div>
      </div>
      {openModal && (
        <MessageModal setOpenModal={setOpenModal} message={message} />
      )}
    </div>
  );
};

export default UserAdd;
