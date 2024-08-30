"use client";
import styles from "./reference.module.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useState, useCallback, useRef, useEffect } from "react";
import useLocalState from "@/app/hooks/useLocalState";
import MessageModal from "../modal/messageModal";
import { useRouter } from "next/navigation";

const Reference = () => {
  const module = "Settings";
  const [references, setReferences] = useState([]);
  const isClient = typeof window !== "undefined";
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [userId, setUserId] = isClient
    ? useLocalState("userId", "")
    : ["", () => {}];
  //   const [reference, setReference] = useState({});
  const [reference, setReference] = useState({
    id: "",
    parent: "",
    code: "",
    name: "",
    active: "",
    userId: "",
  });
  const [parent, setParent] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState(null);
  const [permissions, setPermissions] = useLocalState([]);
  const router = useRouter();

  const gridRef = useRef();

  useEffect(() => {
    if (permissions) {
      if (permissions.includes(module)) {
        // setHasAccess(true);
      } else {
        router.push("/dashboard");
      }
    }
  }, []);

  const onGridReady = useCallback((params) => {
    getReference();
  }, []);

  const getReference = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/reference/getall", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        // console.log(data);
        setReferences(data);
      });
  };

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setReference(selectedRows[0]);
    if (selectedRows.length > 0) {
      setCode(selectedRows[0].code);
      setParent(selectedRows[0].parent);
      setName(selectedRows[0].name);
      // console.log(selectedRows);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    name === "parent" && setParent(event.target.value);
    name === "code" && setCode(event.target.value);
    name === "name" && setName(event.target.value);
    // console.log(reference);
    setReference((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const columnDefs = [
    {
      headerName: "Parent",
      field: "parent",

      width: "110",
    },
    { headerName: "Code", field: "code", width: "120" },
    {
      headerName: "Name",
      field: "name",
      filter: "agTextColumnFilter",
      width: "400",
    },
  ];

  const handleClear = (e) => {
    e.preventDefault();
    setName("");
    setCode("");
    setParent("");
    const clearRef = {
      id: "",
      parent: "",
      code: "",
      name: "",
      active: "",
      userId: "",
    };
    setReference(clearRef);
  };

  const handleSave = () => {
    // e.preventDefault();
    reference.active = "Y";
    reference.userId = userId;
    var refId = reference.id;
    var jwt = window.sessionStorage.getItem("jwt");
    // console.log(reference);

    axios
      .post(baseUrl + "/api/reference/save", reference, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // console.log(response.data);
          setReference(response.data);
          if (refId === "") {
            setReferences([...references, response.data]);
          } else {
            getReference();
          }

          setMessage("Reference Saved!");
          setOpenModal(true);
          //   alert("Saved");
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const deleteReference = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .delete(baseUrl + "/api/reference/delete/" + reference.id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Reference deleted.");
          setOpenModal(true);
          getReference();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const checkSave = (e) => {
    e.preventDefault();
    if (
      reference.parent === "" ||
      reference.code === "" ||
      reference.name === ""
    ) {
      setMessage("Please fill all fields.");
      setOpenModal(true);
    } else {
      handleSave();
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (reference.id === "" || reference.id === undefined) {
      setMessage("Please choose a reference.");
      setOpenModal(true);
    } else {
      deleteReference();
      // alert("cont");
    }
  };

  useEffect(() => {
    if (data) {
      alert(data.message);
    }
  }, [data]);

  const updateJewelry = (e) => {
    e.preventDefault();
    fetch("/api/updateMasJewelry")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className={styles.container}>
      <div className={styles.container2}>
        <h2>Reference</h2>
        <div
          className={`ag-theme-quartz ${styles.aggrid}`}
          style={{
            "--ag-header-background-color": "rgb(202, 202, 202)",
            "--ag-odd-row-background-color": "rgb(241, 241, 241)",
          }}
        >
          <AgGridReact
            rowData={references}
            columnDefs={columnDefs}
            rowSelection={"single"}
            onSelectionChanged={onSelectionChanged}
            onGridReady={onGridReady}
            alwaysShowHorizontalScroll={true}
            ref={gridRef}
          />
        </div>
        <div className={styles.refForms}>
          <label>Parent :</label>
          <input
            type="text"
            maxLength={10}
            value={parent}
            name="parent"
            onChange={(e) => {
              handleChange(e);
            }}
          ></input>
        </div>
        <div className={styles.refForms}>
          <label>Code :</label>
          <input
            maxLength={10}
            value={code}
            name="code"
            onChange={(e) => {
              handleChange(e);
            }}
          ></input>
        </div>
        <div className={styles.refForms}>
          <label>Name :</label>
          <input
            maxLength={99}
            value={name}
            name="name"
            onChange={(e) => {
              handleChange(e);
            }}
          ></input>
        </div>
        <div className={styles.divButtons}>
          <div></div>
          <div></div>
          <button
            className={styles.buttonSave}
            onClick={(e) => {
              checkSave(e);
            }}
          >
            Save
          </button>
          <button
            className={styles.buttons}
            onClick={(e) => {
              handleClear(e);
            }}
          >
            Clear
          </button>
          <button
            className={styles.deleteButton}
            onClick={(e) => handleDelete(e)}
          >
            Delete
          </button>
        </div>
        {/* <br> </br> */}
      </div>
      {/* <div className={styles.container2}>
        <button onClick={(e) => updateJewelry(e)}>Update jewelry list</button>
      </div> */}
      {openModal && (
        <MessageModal setOpenModal={setOpenModal} message={message} />
      )}
    </div>
  );
};
export default Reference;
