"use client";
import { useState } from "react";
import LayAwayTable from "./layAwayTable";
import styles from "./modal.module.css";

const ModalLayAway = ({ openModal, setOpenModal, transactionId }) => {
  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.modalContainer}>
          <h3 className="">Lay Away Payment</h3>
          <div>
            <div>
              <LayAwayTable transactionId={transactionId} />
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
export default ModalLayAway;
