"use client";
import styles from "./menulink.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import SubMenuLink from "../subMenuLink/subMenuLink";
import { MdKeyboardArrowUp } from "react-icons/md";

const MenuLink = ({ item }) => {
  const pathname = usePathname();
  const [subM, setSubM] = useState(item.subMenu ? item.subMenu : {});
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (item.subMenu) {
      console.log(subM);
    }
  }, []);

  const toggleActive = (e) => {
    e.preventDefault();
    setActive(!active);
  };

  return (
    <div>
      {item.subMenu ? (
        <div
          className={`${styles.container} `}
          onClick={(e) => {
            toggleActive(e);
          }}
        >
          {item.icon}
          {item.title}
          {item.subMenu && (
            <MdKeyboardArrowUp
              className={`${styles.expand} ${active && styles.drop}`}
            />
          )}
        </div>
      ) : (
        <Link
          href={item.path}
          className={`${styles.container} 
            ${pathname === item.path && styles.active}`}
        >
          {item.icon}
          {item.title}
          {item.subMenu && <MdKeyboardArrowDown />}
        </Link>
      )}

      {item.subMenu && (
        <ul className={`${styles.list} ${active && styles.hide}`}>
          {subM.map((cat) => (
            <li key={cat.title}>
              <SubMenuLink item={cat} key={cat.title} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default MenuLink;
