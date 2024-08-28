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

const Roles = () => {
  const [role, setRole] = useState("");
  const [baseUrl, setBaseUrl] = useLocalState("baseURL", "");
  const [rowData, setRowData] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [permAlias, setPermAlias] = useState([]);
  const [permId, setPermId] = useState(0);
  const [filteredPerm, setFilteredPerm] = useState([]);
  const [rolePerm, setRolePerm] = useState({
    id: "",
    roleId: "",
    permissionId: "",
  });

  const gridRef = useRef();
  const gridRef2 = useRef();
  const onGridReady = useCallback((params) => {
    getRoles();
  }, []);

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
        console.log(data);
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
        console.log(data);
      });
  };

  const filterDropdown = () => {
    const excludeIds = new Set(rowData2.map((item) => item.id));
    const filteredArray = permAlias.filter((item) => !excludeIds.has(item.id));
    setFilteredPerm(filteredArray);

    // console.log(filteredArray);
  };

  const onSelectionChanged = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length > 0) {
      //   setEdUName(selectedRows[0].username);
      setRole(selectedRows[0].roleName);
    }
  }, []);

  const onSelectionChanged2 = useCallback(() => {
    alert("dd");
  }, []);

  const saveRolePermission = (e) => {
    e.preventDefault();
    rolePerm.permissionId = permId;
    // rolePerm.roleId
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
  ];

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
            <input></input>
          </div>
          <div>
            <button>Save</button>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.form}>
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
            />
          </div>
          <div>
            <label>Permission</label>
            <select
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
            <button
              onClick={(e) => {
                saveRolePermission(e);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Roles;
