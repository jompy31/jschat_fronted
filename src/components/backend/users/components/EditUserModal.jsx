import React from 'react';
import { FaUserEdit } from 'react-icons/fa';
import styles from '../../users/components/usertable.module.css';

const EditUserModal = ({
  showModal,
  setShowModal,
  updatedUser,
  setUpdatedUser,
  handleSaveUser,
}) => {
  if (!showModal) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalPanel}>
        <div className={styles.modalHeader}>
          <FaUserEdit className={styles.iconBlue} />
          <h2>Editar Usuario</h2>
        </div>

        <div className={styles.modalBody}>
          {[
            { label: 'Nombre', name: 'first_name', type: 'text' },
            { label: 'Apellido', name: 'last_name', type: 'text' },
            { label: 'Correo', name: 'email', type: 'email' },
          ].map((field) => (
            <div key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type}
                value={updatedUser[field.name]}
                onChange={(e) =>
                  setUpdatedUser({ ...updatedUser, [field.name]: e.target.value })
                }
                className={styles.modalInput}
              />
            </div>
          ))}

          <div>
            <label>Rol</label>
            <select
              value={updatedUser.userprofile.staff_status}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  userprofile: {
                    ...updatedUser.userprofile,
                    staff_status: e.target.value,
                  },
                })
              }
              className={styles.modalSelect}
            >
              <option value="customer">Customer</option>
              <option value="administrator">Administrator</option>
              <option value="sales">Sales</option>
              <option value="design">Design</option>
            </select>
          </div>

          <div>
            <label>Teléfono</label>
            <input
              type="text"
              value={updatedUser.userprofile.phone_number}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  userprofile: {
                    ...updatedUser.userprofile,
                    phone_number: e.target.value,
                  },
                })
              }
              className={styles.modalInput}
            />
          </div>

          <div>
            <label>Dirección</label>
            <input
              type="text"
              value={updatedUser.userprofile.address}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  userprofile: {
                    ...updatedUser.userprofile,
                    address: e.target.value,
                  },
                })
              }
              className={styles.modalInput}
            />
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button className={styles.btnConfirm} onClick={handleSaveUser}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
