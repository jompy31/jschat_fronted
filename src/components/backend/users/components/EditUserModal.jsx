// frontend_github\jschat_fronted\src\components\backend\users\components\EditUserModal.jsx

import React from 'react';
import { FaUserEdit, FaUserPlus } from 'react-icons/fa';
import styles from './usertable.module.css';

const EditUserModal = ({
  showModal,
  setShowModal,
  isEditMode,
  formData,
  setFormData,
  handleSaveUser,
}) => {
  if (!showModal) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalPanel}>
        <div className={styles.modalHeader}>
          {isEditMode ? (
            <FaUserEdit className={styles.iconBlue} />
          ) : (
            <FaUserPlus className={styles.iconGreen} />
          )}
          <h2>{isEditMode ? 'Editar Usuario' : 'Crear Usuario'}</h2>
        </div>

        <div className={styles.modalBody}>
          {[
            { label: 'Nombre', name: 'first_name', type: 'text' },
            { label: 'Apellido', name: 'last_name', type: 'text' },
            { label: 'Correo', name: 'email', type: 'email' },
          ].map((field) => (
            <div key={field.name} className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData({ ...formData, [field.name]: e.target.value })
                }
                className={styles.modalInput}
                required
              />
            </div>
          ))}

          {/* CONTRASEÑA: Obligatoria al crear, opcional al editar */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {isEditMode ? '(opcional)' : ''}
            </label>
            <input
              type="password"
              value={formData.password || ''}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={isEditMode ? 'Dejar vacío para no cambiar' : 'Requerida'}
              className={styles.modalInput}
              {...(!isEditMode && { required: true })}
            />
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">
                Deja vacío si no deseas cambiar la contraseña
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={formData.userprofile.staff_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userprofile: {
                    ...formData.userprofile,
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

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              value={formData.userprofile.phone_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userprofile: {
                    ...formData.userprofile,
                    phone_number: e.target.value,
                  },
                })
              }
              className={styles.modalInput}
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={formData.userprofile.address}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  userprofile: {
                    ...formData.userprofile,
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
            {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;