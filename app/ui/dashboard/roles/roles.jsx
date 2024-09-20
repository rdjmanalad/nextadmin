"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/app/auth";
import axios from "axios";
import useLocalState from "@/app/hooks/useLocalState";
import styles from "./roles.module.css";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import MessageModal from "../modal/messageModal";
import ConfirmmModal from "../modal/confirmModal";

const Roles = () => {
  const module = "Roles";
  const [role, setRole] = useState("");
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [rowData, setRowData] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [permAlias, setPermAlias] = useState([]);
  const [permId, setPermId] = useState(0);
  const [filteredPerm, setFilteredPerm] = useState([]);
  const [roleId, setRoleId] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");
  const [deleteRolePermId, setDeleteRolePermId] = useState(0);
  const [openModalConf, setOpenModalConf] = useState(false);
  const [permissions, setPermissions] = useLocalState([]);
  const router = useRouter();
  const [rolePerm, setRolePerm] = useState({
    id: "",
    roleId: "",
    permissionId: "",
  });

  const [roleSave, setRoleSave] = useState({
    roleId: "",
    roleName: "",
  });

  const gridRef = useRef();
  const gridRef2 = useRef();
  const permissionRef = useRef();

  useEffect(() => {
    if (permissions) {
      if (permissions.includes(module)) {
        // setHasAccess(true);
      } else {
        router.push("/dashboard");
      }
    }
  }, []);

  const ButtonRenderer = (props) => {
    const handleClick = () => {
      //   alert("Button clicked in row with ID: " + props.data.rpId);
      setDeleteRolePermId(props.data.rpId);
      setMessage("Confirm removal of permission.");
      setOpenModalConf(true);
    };

    return <button onClick={handleClick}>Delete</button>;
  };

  const onGridReady = useCallback((params) => {
    getRoles();
  }, []);

  const confirmOk = () => {
    // alert(deleteRolePermId);
    deleteRolePermissions();
  };

  const deleteRolePermissions = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .delete(baseUrl + "/api/users/deleteRolePermission/" + deleteRolePermId, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Role Permission removed.");
          setOpenModal(true);
          getPermissions();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  useEffect(() => {
    const jwtToken = window.sessionStorage.getItem("jwt");
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
    if (jwtToken && isTokenExpired(jwtToken)) {
      router.push("/login");
      window.sessionStorage.clear();
    }
    if (jwtToken && !isTokenExpired(jwtToken)) {
      getPermissionsAlias();
      //   getRoles();
    }
  }, []);

  useEffect(() => {
    if (role) {
      getPermissions();
    }
  }, [role]);

  useEffect(() => {
    if (rowData2) {
      filterDropdown();
    }
  }, [rowData2]);

  const getRoles = () => {
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
          setRowData(response.data);
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const getPermissions = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users/getRolePermissionAll/" + role, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setRowData2(data);
      });
  };

  const getPermissionsAlias = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios.defaults.headers.common["Authorization"] =
      "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1");
    axios
      .get(baseUrl + "/api/users/getPermissionAlias", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .then((data) => {
        setPermAlias(data);
      });
  };

  const saveRolePermissions = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/users/saveRolePermission", rolePerm, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Role permission saved.");
          setOpenModal(true);
          getPermissions();
          //   getUsers();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const saveRole = () => {
    if (roleSave.roleName === "" || roleSave.roleName === undefined) {
      setMessage("Role name is empty.");
      setOpenModal(true);
    } else {
      saveRoleConfirm();
    }
  };

  const saveRoleConfirm = () => {
    var jwt = window.sessionStorage.getItem("jwt");
    axios
      .post(baseUrl + "/api/users/saveRole", roleSave, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt.replace(/^"(.+(?="$))"$/, "$1"),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setMessage("Role saved.");
          setOpenModal(true);
          getRoles();
          //   getUsers();
        }
      })
      .catch((message) => {
        alert(message);
      });
  };

  const filterDropdown = () => {
    const excludeIds = new Set(rowData2.map((item) => item.id));
    const filteredArray = permAlias.filter((item) => !excludeIds.has(item.id));
    setFilteredPerm(filteredArray);
  };

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length > 0) {
      setRole(selectedRows[0].roleName);
      setRoleId(selectedRows[0].roleId);
    }
  }, []);

  const onSelectionChanged2 = useCallback(() => {
    // alert("dd");
  }, []);

  const saveRolePermission = (e) => {
    e.preventDefault();
    if (
      permissionRef.current.value === "" ||
      permissionRef.current.value === undefined ||
      permissionRef.current.value === null
    ) {
      setMessage("Please select a permission.");
      setOpenModal(true);
    } else {
      rolePerm.permissionId = permId;
      rolePerm.roleId = roleId;
      saveRolePermissions();
    }
  };

  const columnDefs = [
    {
      headerName: "Role Name",
      field: "roleName",
      width: "300",
    },
  ];

  const columnDefs2 = [
    {
      headerName: "Description",
      field: "alias",
      width: "300",
    },
    { headerName: "Actions", cellRenderer: "buttonRenderer" },
  ];

  const gridOptions = {
    components: {
      buttonRenderer: ButtonRenderer,
    },
  };

  return (
    <div className={styles.container1}>
      <div className={styles.container}>
        <div className={styles.form}>
          <h2>Roles</h2>
          <div className={`ag-theme-quartz ${styles.aggrid}`}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              rowSelection={"single"}
              onSelectionChanged={onSelectionChanged}
              ref={gridRef}
              onGridReady={onGridReady}
              alwaysShowHorizontalScroll={true}
            />
          </div>
          <div>
            <label>Role Name</label>
            <input
              onChange={(e) => {
                roleSave.roleName = e.target.value.toUpperCase();
              }}
            ></input>
          </div>
          <div className={styles.buttonContainer}>
            <button
              onClick={(e) => {
                saveRole(e);
              }}
            >
              Add Role
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.form2}>
          <h2>Permissions</h2>
          <div className={`ag-theme-quartz ${styles.aggrid}`}>
            <AgGridReact
              rowData={rowData2}
              columnDefs={columnDefs2}
              rowSelection={"single"}
              onSelectionChanged={onSelectionChanged2}
              ref={gridRef2}
              onGridReady={onGridReady}
              alwaysShowHorizontalScroll={true}
              gridOptions={gridOptions}
            />
          </div>
          <div>
            <label>Permission</label>
            <div>
              <select
                ref={permissionRef}
                onChange={(e) => {
                  setPermId(e.target.value);
                }}
              >
                <option></option>
                {filteredPerm.map((o, i) => (
                  <option value={filteredPerm[i].id} key={filteredPerm[i].id}>
                    {filteredPerm[i].alias}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={styles.save}
                onClick={(e) => {
                  saveRolePermission(e);
                }}
              >
                Add Permission
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
    </div>
  );
};
export default Roles;
