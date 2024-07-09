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
  const [baseURL, setBaseURL] = useLocalState("baseURL", "");
  const [logi, setLogi] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const router = useRouter();
  // const baseURL = localStorage.getItem("baseURL");

  useEffect(() => {
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
        if (response.status === 200) {
          return Promise.all([response.json(), response.data]);
        } else {
          return Promise.reject("Invalid Login Credentials");
        }
      })

      .then(([data, headers, json]) => {
        // console.log(data);
        setInvalid(false);
        setLogi(true);
        setJwt(data["accessToken"]);
        window.sessionStorage.setItem("jwt", data["accessToken"]);
        setUserId(0);
        getId();
        setUser(username);
        jw = data["accessToken"].split(".")[1];
        setUserRole(JSON.parse(window.atob(jw)).roles);
        // console.log(localStorage.getItem("user"));
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);

        // window.location.reload();
      })
      .catch((message) => {
        // alert("mensahe " + message);
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

  return (
    <div className={styles.container}>
      <form action="" className={styles.form}>
        <h4>AURORA JEWELRY COLLECTION</h4>
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
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className={styles.button}
          onClick={(e) => {
            e.preventDefault();
            senLoginRequest();
          }}
        >
          Login
        </button>
        <label style={{ display: invalid ? "block" : "none" }}>
          Invalid Login Credentials
        </label>
        <label style={{ display: logi ? "block" : "none" }}>Loging In...</label>
        <br></br>
      </form>
    </div>
  );
};
export default LoginPage;
