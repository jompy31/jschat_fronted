import React, { useEffect } from "react";
import { toast } from "react-toastify";

const DeleteConfirmationToast = ({ show, onClose, message, onConfirm }) => {
  useEffect(() => {
    if (show) {
      toast.dismiss(); // Cierra cualquier toast anterior
      toast(
        <div className="flex flex-col gap-2">
          <p className="text-gray-800 dark:text-gray-200 font-medium">{message}</p>
          <div className="flex justify-end gap-2 mt-2">
            <button
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white rounded-md transition"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition"
              onClick={onConfirm}
            >
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
          theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
        }
      );
    }
    return () => toast.dismiss();
  }, [show, message, onClose, onConfirm]);

  return null;
};

export default DeleteConfirmationToast;
