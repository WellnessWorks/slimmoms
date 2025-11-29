import React, { useEffect } from "react";
import css from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      {/* Modal içeriği kapsayıcısı */}
      <div className={css.modalContent}>
        {/* Modalın içine yerleştirilecek içerik (DailyCalorieIntake) */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
