"use client";
import Link from "next/link";
import Search from "@/app/ui/dashboard/search/search";
import styles from "./users.module.css";
import UserEdit from "./userEdit/userEdit";

const Users = () => {
  return (
    <div className={styles.container}>
      {/* <div className={styles.top}>
        <Search placeholder="Search User..." />
        <Link href="/dashborad/users/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div> */}
      <UserEdit />
      <table className={styles.table}></table>
    </div>
  );
};
export default Users;
