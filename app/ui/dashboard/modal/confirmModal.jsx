"use client";
import styles from "./confirmModal.module.css";

const ConfirmmModal = ({ setOpenModalConf, message, confirmOk }) => {
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.modalContainer}>
          {/* Add X Button */}
          <button
            className={styles.closeButton}
            onClick={() => setOpenModalConf(false)}
          >
            &times;
          </button>
          <h3>Message</h3>
          <div>
            <div className={styles.message}>
              <h2>{message}</h2>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              className={styles.modalButtonOk}
              onClick={() => {
                confirmOk();
                setOpenModalConf(false);
              }}
            >
              Yes
            </button>
            <button
              className={styles.modalButtonCancel}
              onClick={() => {
                setOpenModalConf(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmmModal;
