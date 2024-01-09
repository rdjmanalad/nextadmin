"use client";
import styles from "./subMenulink.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SubMenuLink = ({ item }) => {
  const pathname = usePathname();
  return (
    <Link
      href={item.path}
      className={`${styles.container} 
        ${pathname === item.path && styles.active}`}
    >
      {item.icon}
      {item.title}
    </Link>
  );
};
export default SubMenuLink;
