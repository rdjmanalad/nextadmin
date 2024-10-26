"use client";

import { useEffect, useState } from "react";
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
  MdOutlineCancelPresentation,
} from "react-icons/md";
import { LuUserCog, LuUserPlus } from "react-icons/lu";
import { GiMoneyStack } from "react-icons/gi";
import { LiaUserLockSolid } from "react-icons/lia";
import SubMenuLink from "./subMenuLink/subMenuLink";

const menuItems = [
  {
    title: "Pages",
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
            path: "/dashboard/listTransactions",
            icon: <MdList />,
          },
          {
            title: "Add Transactions",
            path: "/dashboard/transactions",
            icon: <MdPostAdd />,
          },
          {
            title: "Correcting Entry",
            path: "/dashboard/correctingEntry",
            icon: <MdPlaylistAddCheck />,
          },
          {
            title: "Existing Layaway",
            path: "/dashboard/existingLayaway",
            icon: <MdEditNote />,
          },
          // {
          //   title: "Cancelled Transactions",
          //   path: "/dashboard/cancelledTransactions",
          //   icon: <MdOutlineCancelPresentation />,
          // },
          // Add more sub-menu items as needed
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
          {
            title: "Add/Edit Users",
            path: "/dashboard/userAdd",
            icon: <LuUserPlus />,
          },
          {
            title: "Roles",
            path: "/dashboard/roles",
            icon: <LiaUserLockSolid />,
          },
          // Add more sub-menu items as needed
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
  {
    title: "Maintenance",
    list: [
      {
        title: "Settings",
        path: "/dashboard/settings",
        icon: <MdOutlineSettings />,
      },
    ],
  },
];

const Sidebar = () => {
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
export default Sidebar;
