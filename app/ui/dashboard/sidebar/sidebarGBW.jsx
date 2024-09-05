"use client";

import { useEffect } from "react";
import Image from "next/image";
import MenuLink from "./menuLink/menuLink";
import styles from "./sidebar.module.css";
import { useRouter } from "next/navigation";
import {
  MdDashboard,
  MdSupervisedUserCircle,
  MdWork,
  MdAnalytics,
  MdOutlineSettings,
  MdLogout,
  MdPostAdd,
  MdList,
  MdKeyboardArrowDown,
  MdPlaylistAddCheck,
  MdEditNote,
} from "react-icons/md";
import { LuUserCog, LuUserPlus } from "react-icons/lu";
import { GiMoneyStack } from "react-icons/gi";
import { LiaUserLockSolid } from "react-icons/lia";
import SubMenuLink from "./subMenuLink/subMenuLink";

const menuItems = [
  {
    title: "Pages GBW",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Transactions",
        path: "/dashboard/transactions",
        icon: <GiMoneyStack />,
        expand: <MdKeyboardArrowDown />,
        subMenu: [
          {
            title: "All Transactions",
            path: "/dashboard/listTransactionsGBW",
            icon: <MdList />,
          },
          {
            title: "Add Transactions",
            path: "/dashboard/transactionsGBW",
            icon: <MdPostAdd />,
          },
          {
            title: "Correcting Entry",
            path: "/dashboard/correctingEntry",
            icon: <MdPlaylistAddCheck />,
          },
        ],
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
        expand: <MdKeyboardArrowDown />,
        subMenu: [
          {
            title: "Change Password",
            path: "/dashboard/users",
            icon: <LuUserCog />,
          },
        ],
      },
    ],
  },
  {
    title: "Analytics",
    list: [
      {
        title: "Reports",
        path: "/dashboard/reports",
        icon: <MdAnalytics />,
      },
    ],
  },
];

const SidebarGBW = () => {
  const router = useRouter();

  useEffect(() => {
    if (window.sessionStorage.getItem("jwt")?.length === 0) {
      router.push("/login");
    }
    if (window.sessionStorage.getItem("jwt") === null) {
      router.push("/login");
    }
  }, []);

  const handleLogout = () => {
    window.sessionStorage.clear();
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <Image
          // className={styles.banner}
          src="/TambuntingLogo.png"
          width="200"
          height="75"
          alt=""
        />
      </div>
      <div className={styles.divList}>
        <ul className={styles.list}>
          {menuItems.map((cat) => (
            <li key={cat.title}>
              <span className={styles.cat}>{cat.title}</span>
              {cat.list.map((item) => (
                <MenuLink item={item} key={item.title} />
              ))}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.logoutDiv}>
        <button className={styles.logout} onClick={(e) => handleLogout()}>
          <MdLogout />
          Logout
        </button>
      </div>
    </div>
  );
};
export default SidebarGBW;
