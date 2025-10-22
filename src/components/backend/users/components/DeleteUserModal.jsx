import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import styles from '../../users/components/usertable.module.css';

const DeleteUserModal = ({
  showDeleteConfirmation,
  setShowDeleteConfirmation,
  confirmDeleteUser,
}) => {
  if (!showDeleteConfirmation) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalPanel}>
        <div className={styles.modalHeader}>
          <FaExclamationTriangle className={styles.iconRed} />
          <h2>Confirmar Eliminación</h2>
        </div>

        <div className={styles.modalBody}>
          <p>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se
            puede deshacer.
          </p>
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.btnCancel}
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancelar
          </button>
          <button className={`${styles.btnConfirm} ${styles.btnDanger}`} onClick={confirmDeleteUser}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
