// frontend_github\jschat_fronted\src\components\backend\users\components\UserTable.jsx
import React, { useState } from 'react';
import { FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import { sortData } from '../utils/sortData';
import styles from './usertable.module.css';

const UserTable = ({
  storedData,
  currentPage,
  usersPerPage,
  handleEditUser,
  handleDeleteUser,
  selectedUser,
  isModalOpen,
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = sortData(storedData, sortConfig);
  const currentUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className={`${styles.tableWrapper} ${isModalOpen ? 'opacity-50' : ''}`}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            {['first_name', 'last_name', 'email', 'staff_status', 'created_at'].map((key) => (
              <th key={key} onClick={() => handleSort(key)} className={styles.tableHeadCell}>
                <div className={styles.sortContainer}>
                  <span>
                    {key === 'first_name' && 'Nombre'}
                    {key === 'last_name' && 'Apellido'}
                    {key === 'email' && 'Correo'}
                    {key === 'staff_status' && 'Rol'}
                    {key === 'created_at' && 'Creado'}
                  </span>
                  <FaSort className={styles.sortIcon} />
                </div>
              </th>
            ))}
            <th className={styles.tableHeadCell}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.emptyRow}>
                No se encontraron usuarios.
              </td>
            </tr>
          ) : (
            currentUsers.map((user) => (
              <tr
                key={user.id}
                className={`${styles.tableRow} ${
                  selectedUser && selectedUser.id === user.id ? styles.rowSelected : ''
                }`}
              >
                <td className={styles.tableCell}>{user.first_name}</td>
                <td className={styles.tableCell}>{user.last_name}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{user.staff_status}</td>
                <td className={styles.tableCell}>
                  {moment(user.created_at).format('YYYY-MM-DD')}
                </td>
                <td className={styles.tableCell}>
                  <button onClick={() => handleEditUser(user)} className={`${styles.actionButton} ${styles.edit}`} title="Editar">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className={`${styles.actionButton} ${styles.delete}`} title="Eliminar">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;