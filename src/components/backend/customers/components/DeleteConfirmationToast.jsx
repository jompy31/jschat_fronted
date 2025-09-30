import React, { useEffect } from "react";
import { toast } from "react-toastify";

const DeleteConfirmationToast = ({ show, onClose, message, onConfirm }) => {
  useEffect(() => {
    if (show) {
      toast.dismiss();
      toast(
        <div className="flex flex-col gap-2">
          <p className="text-gray-800">{message}</p>
          <div className="flex justify-end gap-2">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              Eliminar
            </button>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          onClose: () => onClose(),
          toastId: "delete-confirmation",
        }
      );
    }
    return () => toast.dismiss();
  }, [show, message, onClose, onConfirm]);

  return null;
};

export default DeleteConfirmationToast;