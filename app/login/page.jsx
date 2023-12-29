'use client';

import styles from "@/app/ui/login/login.module.css"
import { useState, useEffect } from "react";
import useLocalState from "../hooks/useLocalState";

const LoginPage =()=>{
    

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [jwt, setJwt] = useLocalState("jwt", "jwt");
    const [user, setUser] = useLocalState("user", "");
    const [userId, setUserId] = useLocalState("userId", "");
    const [userRole, setUserRole] = useLocalState("userRole", "");
    const baseURL = localStorage.getItem("baseURL");

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
              return Promise.all([
                response.json(),
                response.data,
              ]);
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
            window.location.reload();
          })
          .catch((message) => {
            alert(message);
          });
      }


    return(
        <div className={styles.container}>
            
            <form action="" className={styles.form}>
                <h3>Tambunting Live Selling</h3>
                <h2>Login</h2>
                <input type="text" placeholder="username"/>
                <input type="password" placeholder="password"/>
                <button className={styles.button}>Login</button>
            </form>
        </div>
    )
}
export default LoginPage