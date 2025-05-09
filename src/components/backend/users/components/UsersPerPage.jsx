import React from 'react';

const UsersPerPage = ({ usersPerPage, setUsersPerPage }) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="usersPerPage" className="text-gray-700 font-medium">
        Usuarios por página:
      </label>
      <input
        type="number"
        id="usersPerPage"
        min="1"
        step="1"
        value={usersPerPage}
        onChange={(e) => setUsersPerPage(parseInt(e.target.value, 10))}
        className="w-16 px-2 py-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-center"
      />
    </div>
  );
};

export default UsersPerPage;