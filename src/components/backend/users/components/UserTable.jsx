import React, { useState } from 'react';
import { FaSort, FaEdit, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import { sortData } from '../utils/sortData';

const UserTable = ({ storedData, currentPage, usersPerPage, handleEditUser, handleDeleteUser }) => {
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
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <tr>
            {['first_name', 'last_name', 'email', 'staff_status', 'created_at'].map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-blue-700 transition"
              >
                <div className="flex items-center space-x-1">
                  <span>
                    {key === 'first_name' && 'Nombre'}
                    {key === 'last_name' && 'Apellido'}
                    {key === 'email' && 'Correo electrónico'}
                    {key === 'staff_status' && 'Rol de página'}
                    {key === 'created_at' && 'Creado por'}
                  </span>
                  <FaSort className="text-white/70" />
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.first_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.last_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.staff_status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {moment(user.created_at).format('YYYY-MM-DD')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleEditUser(user)}
                  className="text-blue-600 hover:text-blue-800 mr-4 transition"
                  title="Editar usuario"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Eliminar usuario"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;