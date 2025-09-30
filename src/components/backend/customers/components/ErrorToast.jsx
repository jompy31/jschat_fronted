import React, { useEffect } from "react";
import { toast } from "react-toastify";

const ErrorToast = ({ show, onClose, message }) => {
  useEffect(() => {
    if (show && message) {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        onClose,
      });
    }
  }, [show, message, onClose]);

  return null;
};

export default ErrorToast;