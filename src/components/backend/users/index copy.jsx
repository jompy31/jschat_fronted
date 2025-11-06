// Reemplaza todo el contenido de UserList.jsx

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CurrentUserContext from './CurrentUserContext';
import UserTable from './components/UserTable';
import UserSearch from './components/UserSearch';
import PaginationControls from './components/PaginationControls';
import UsersPerPage from './components/UsersPerPage';
import EditUserModal from './components/EditUserModal'; // Reutilizado
import DeleteUserModal from './components/DeleteUserModal';
import CurrentUserModal from './components/CurrentUserModal';
import HeaderButtons from './components/HeaderButtons';
import { fetchUserList } from './utils/fetchUserList';
import { filterUsers } from './utils/filterUsers';
import TodoDataService from '../../../services/todos';
import { toast } from 'react-toastify';

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem('currentPage');
    return storedPage ? parseInt(storedPage, 10) : 1;
  });
  const [usersPerPage, setUsersPerPage] = useState(4);

  // Modal de edición/creación
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    userprofile: { staff_status: 'customer', phone_number: '', address: '' }
  });

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showCurrentUserModal, setShowCurrentUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const token = useSelector((state) => state.authentication.token);
  const location = useLocation();

  useEffect(() => {
    const currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
      try {
        const parsedData = JSON.parse(currentUserData);
        setCurrentUser({
          ...parsedData,
          staff_status: parsedData.userprofile?.staff_status || 'customer'
        });
      } catch (error) {
        toast.error('Error al cargar usuario actual');
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserList(token, setUserList, setStoredData);
    }
  }, [token]);

  useEffect(() => {
    setStoredData(filterUsers(userList, searchTerm));
  }, [userList, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [usersPerPage]);

  // === ABRIR MODAL PARA EDITAR ===
  const handleEditUser = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: '',
      userprofile: {
        staff_status: user.staff_status || 'customer',
        phone_number: user.phone_number || '',
        address: user.address || ''
      }
    });
    setShowEditModal(true);
  };

  // === ABRIR MODAL PARA CREAR ===
  const handleAddUser = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      userprofile: { staff_status: 'customer', phone_number: '', address: '' }
    });
    setShowEditModal(true);
  };

  // === GUARDAR (CREAR O EDITAR) ===
  const handleSaveUser = () => {
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      ...(isEditMode ? {} : { password: formData.password }), // solo en creación
      staff_status: formData.userprofile.staff_status,
      phone_number: formData.userprofile.phone_number,
      address: formData.userprofile.address
    };

    const request = isEditMode
      ? TodoDataService.updateUser(selectedUser.id, payload, token)
      : TodoDataService.signup(payload);

    request
      .then(() => {
        setShowEditModal(false);
        fetchUserList(token, setUserList, setStoredData);
        toast.success(isEditMode ? 'Usuario actualizado' : 'Usuario creado');
      })
      .catch((e) => {
        console.error(e);
        toast.error(isEditMode ? 'Error al actualizar' : 'Error al crear usuario');
      });
  };

  const handleDeleteUser = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUser = () => {
    TodoDataService.deleteUser(deleteUserId, token)
      .then(() => {
        setShowDeleteConfirmation(false);
        fetchUserList(token, setUserList, setStoredData);
        toast.success('Usuario eliminado');
      })
      .catch(() => toast.error('Error al eliminar'));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('currentPage', pageNumber);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', marginTop: '8%' }}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {location.pathname !== '/register' && (
          <CurrentUserContext.Provider value={currentUser}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h1 className="text-3xl md:text-4xl font-extrabold">Usuarios</h1>
              {currentUser?.staff_status === 'administrator' && (
                <HeaderButtons handleAddUser={handleAddUser} userList={userList} />
              )}
            </div>
          </CurrentUserContext.Provider>
        )}

        {currentUser?.staff_status === 'administrator' ? (
          <>
            <div className="mb-6 space-y-4">
              <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              <UsersPerPage usersPerPage={usersPerPage} setUsersPerPage={setUsersPerPage} />
            </div>
            <UserTable
              storedData={storedData}
              currentPage={currentPage}
              usersPerPage={usersPerPage}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
              selectedUser={selectedUser}
              isModalOpen={showEditModal || showDeleteConfirmation}
            />
            <PaginationControls
              currentPage={currentPage}
              storedData={storedData}
              usersPerPage={usersPerPage}
              handlePageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12 text-lg text-gray-500">
            No tienes permisos para ver la lista de usuarios.
          </div>
        )}

        {/* MODAL UNIFICADO */}
        <EditUserModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          isEditMode={isEditMode}
          formData={formData}
          setFormData={setFormData}
          handleSaveUser={handleSaveUser}
        />

        <DeleteUserModal
          showDeleteConfirmation={showDeleteConfirmation}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          confirmDeleteUser={confirmDeleteUser}
        />

        <CurrentUserModal
          showCurrentUserModal={showCurrentUserModal}
          setShowCurrentUserModal={setShowCurrentUserModal}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
};

export default UserList;