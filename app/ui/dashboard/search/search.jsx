import { MdSearch } from "react-icons/md";
import styles from "./search.module.css";

const Search = ({ placeholder }) => {
  return (
    <div className={styles.container}>
      <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        className={styles.input}
      ></input>
    </div>
  );
};
export default Search;
