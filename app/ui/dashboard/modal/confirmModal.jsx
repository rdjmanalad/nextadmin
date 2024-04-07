"use client";
import styles from "./confirmModal.module.css";

const ConfirmmModal = ({ setOpenModalConf, message, confirmOk }) => {
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.modalContainer}>
          <h3>Message</h3>
          <div>
            <div className={styles.message}>
              <h2>{message}</h2>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              className={styles.modalButtonCancel}
              onClick={() => {
                setOpenModalConf(false);
              }}
            >
              Close
            </button>
            <div></div>
            <button
              className={styles.modalButtonOk}
              onClick={() => {
                confirmOk();
                setOpenModalConf(false);
              }}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfirmmModal;
