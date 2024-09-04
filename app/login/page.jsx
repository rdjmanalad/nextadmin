"use client";
import axios from "axios";
import styles from "@/app/ui/login/login.module.css";
import { useState, useEffect } from "react";
import useLocalState from "../hooks/useLocalState";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [jwt, setJwt] = useLocalState("jwt", "");
  const [user, setUser] = useLocalState("user", "");
  const [userId, setUserId] = useLocalState("userId", "");
  const [userRole, setUserRole] = useLocalState("userRole", "");
  const [permissions, setPermissions] = useLocalState([]);
  const [baseURL, setBaseURL] = useLocalState("baseURL", "");
  const [logi, setLogi] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [initial, setInitial] = useLocalState("initial", 0);
  const [showPassword, setShowPassword] = useState(false);
  const [showHide, setShowHide] = useState("Show");
  const [passType, setPassType] = useState("password");
  const [appType, setAppType] = useLocalState("appType", "");
  const [refreshKey, setRefreshKey] = useLocalState("dashRefresh", 0);
  const [selectedValue, setSelectedValue] = useState("AJC");

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

  useEffect(() => {
    // setPermissions([]);
    if (window.sessionStorage.getItem("jwt") != null) {
      router.push("/dashboard");
    }
    setBaseURL("http://localhost:8080");
    // setBaseURL("http://52.74.232.36:85");
  }, []);

  useEffect(() => {
    const keyDownHandler = (event) => {
      // console.log("User pressed: ", event.key);
      if (event.key === "Enter") {
        event.preventDefault();
        senLoginRequest();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [username, password, senLoginRequest]);

  function senLoginRequest() {
    // alert(baseURL);
    const reqBody = {
      username: username,
      password: password,
    };
    var jw = "";
    setUser(username);
    fetch(baseURL + "/api/login", {
      headers: {
        "Content-Type": "application-json",
        // "Access-Control-Allow-Origin": "*",
      },
      method: "post",
      body: JSON.stringify(reqBody),
    })
      .then((response) => {
        // alert(response.status);
        if (response.status === 200) {
          return Promise.all([response.json(), response.data]);
        } else if (response.status === 401) {
          return Promise.reject("Invalid Login Credentials");
        } else if (response.status === 403) {
          return Promise.reject("Locked Account");
        } else {
          return Promise.reject("Unknown Error");
        }
      })

      .then(([data, headers, json]) => {
        setRefreshKey(0);
        setInvalid(false);
        setLogi(true);
        setJwt(data["accessToken"]);
        window.sessionStorage.setItem("jwt", data["accessToken"]);
        setUserId(0);
        // getId();
        getUserDetails();
        setUser(username);
        window.sessionStorage.setItem("initial", 1);
        jw = data["accessToken"].split(".")[1];
        setUserRole(JSON.parse(window.atob(jw)).roles);
        checkPermission(JSON.parse(window.atob(jw)).roles);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      })
      .catch((message) => {
        setMessage(message);
        setInvalid(true);
      });
  }

  const getId = () => {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseURL + "/api/users/getId/" + username, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setUserId(data);
      });
  };

  const getUserDetails = () => {
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseURL + "/api/users/getbyusername/" + username, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setUserId(data.userId);
        setAppType(data.appType);
        if (data.appType === "ALL") {
          if (selectedValue === "GBW") {
            setAppType("GBW");
          }
        }
      });
  };

  const checkPermission = (role) => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseURL + "/api/users/getRolePermission/" + role, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setPermissions(data);
      });
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className={styles.container}>
      <form action="" className={styles.form}>
        {/* <h4>AURORA JEWELRY COLLECTION</h4> */}
        <div className={styles.banner}>
          <Image
            className={styles.banner}
            src="/TambuntingLogo.png"
            width="300"
            height="85"
            alt=""
          />
        </div>
        {/* <h2>Login</h2> */}
        <div className={styles.toggleButtonGroup}>
          <div className={styles.toggleButton}>
            <input
              type="radio"
              id="option1"
              name="toggle"
              value="AJC"
              checked={selectedValue === "AJC"}
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="option1">AJC</label>
          </div>
          <div className={styles.toggleButton}>
            <input
              type="radio"
              id="option2"
              name="toggle"
              value="GBW"
              checked={selectedValue === "GBW"}
              onChange={(e) => handleChange(e)}
            />
            <label htmlFor="option2">GBW</label>
          </div>
        </div>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className={styles.pass}>
          <input
            type={passType}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={(e) => togglePasswordVisibility(e)}>
            {showHide}
          </button>
        </div>
        <button
          className={styles.button}
          onClick={(e) => {
            e.preventDefault();
            senLoginRequest();
          }}
        >
          Login
        </button>
        <label style={{ display: invalid ? "block" : "none" }}>{message}</label>
        <label style={{ display: logi ? "block" : "none" }}>
          Logging In...
        </label>
        <br></br>
      </form>
    </div>
  );
};
export default LoginPage;
