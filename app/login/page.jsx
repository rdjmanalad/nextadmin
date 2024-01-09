"use client";

import styles from "@/app/ui/login/login.module.css";
import { useState, useEffect } from "react";
import useLocalState from "../hooks/useLocalState";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [jwt, setJwt] = useLocalState("jwt", "");
  const [user, setUser] = useLocalState("user", "");
  const [userId, setUserId] = useLocalState("userId", "");
  const [userRole, setUserRole] = useLocalState("userRole", "");
  const [baseURL, setBaseURL] = useLocalState("baseURL", "");
  const router = useRouter();
  // const baseURL = localStorage.getItem("baseURL");

  useEffect(() => {
    if (window.sessionStorage.getItem("jwt") != null) {
      router.push("/dashboard");
    }
    setBaseURL("http://localhost:8080");
  }, []);

  useEffect(() => {
    const keyDownHandler = (event) => {
      console.log("User pressed: ", event.key);
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
    const reqBody = {
      username: username,
      password: password,
    };
    var jw = "";
    setUser(username);

    fetch(baseURL + "/api/login", {
      headers: {
        "Content-Type": "application-json",
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
        console.log(data);
        setJwt(data["accessToken"]);
        window.sessionStorage.setItem("jwt", data["accessToken"]);
        setUser(username);
        jw = data["accessToken"].split(".")[1];
        setUserRole(JSON.parse(window.atob(jw)).roles);
        console.log(localStorage.getItem("user"));
        router.push("/dashboard");
        // window.location.reload();
      })
      .catch((message) => {
        alert("mensahe " + message);
      });
  }

  return (
    <div className={styles.container}>
      <form action="" className={styles.form}>
        <h3>Tambunting Live Selling</h3>
        <h2>Login</h2>
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
      </form>
    </div>
  );
};
export default LoginPage;
