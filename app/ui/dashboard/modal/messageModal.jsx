"use client";
import styles from "./messageModal.module.css";

const MessageModal = ({ setOpenModal, message }) => {
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.modalContainer}>
          <h3 className="">Message</h3>
          <div>
            <div>
              <h2>{message}</h2>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              className={styles.modalButtonCancel}
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default MessageModal;
