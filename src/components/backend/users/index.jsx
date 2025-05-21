import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CurrentUserContext from './CurrentUserContext';
import UserTable from './components/UserTable';
import UserSearch from './components/UserSearch';
import PaginationControls from './components/PaginationControls';
import UsersPerPage from './components/UsersPerPage';
import EditUserModal from './components/EditUserModal';
import DeleteUserModal from './components/DeleteUserModal';
import AddUserModal from './components/AddUserModal';
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
  const [showModal, setShowModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCurrentUserModal, setShowCurrentUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    staff_status: '',
    password: '',
  });
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    staff_status: '',
    password: '',
  });
  const [currentUser, setCurrentUser] = useState(null);
  const token = useSelector((state) => state.authentication.token);
  const location = useLocation();

  useEffect(() => {
    const currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
      try {
        const parsedData = JSON.parse(currentUserData);
        setCurrentUser(parsedData);
      } catch (error) {
        console.error('Error parsing currentUser data:', error);
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

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUpdatedUser({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      staff_status: user.staff_status,
      password: user.password,
    });
    setShowModal(true);
  };

  const handleSaveUser = () => {
    TodoDataService.updateUser(selectedUser.id, updatedUser, token)
      .then(() => {
        setShowModal(false);
        fetchUserList(token, setUserList, setStoredData);
        toast.success('Usuario actualizado correctamente');
      })
      .catch((e) => {
        console.log(e);
        toast.error('Error al actualizar el usuario');
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
        toast.success('Usuario eliminado correctamente');
      })
      .catch((e) => {
        console.log(e);
        toast.error('Error al eliminar el usuario');
      });
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleSaveNewUser = () => {
    TodoDataService.addUser(newUser, token)
      .then(() => {
        setShowAddUserModal(false);
        fetchUserList(token, setUserList, setStoredData);
        toast.success('Usuario agregado correctamente');
      })
      .catch((e) => {
        console.log(e);
        toast.error('Error al agregar el usuario');
      });
  };

  const handleShowCurrentUser = (user) => {
    setCurrentUser(user);
    setShowCurrentUserModal(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('currentPage', pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100" style={{marginTop:"8%"}}>
      <div className="container mx-auto px-4 py-8">
        {location.pathname !== '/register' && (
          <CurrentUserContext.Provider value={currentUser}>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
              {currentUser && currentUser.staff_status === 'administrator' && (
                <HeaderButtons handleAddUser={handleAddUser} userList={userList} />
              )}
            </div>
          </CurrentUserContext.Provider>
        )}
        {currentUser && currentUser.staff_status === 'administrator' && (
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
            />
            <PaginationControls
              currentPage={currentPage}
              storedData={storedData}
              usersPerPage={usersPerPage}
              handlePageChange={handlePageChange}
            />
          </>
        )}
        <EditUserModal
          showModal={showModal}
          setShowModal={setShowModal}
          updatedUser={updatedUser}
          setUpdatedUser={setUpdatedUser}
          handleSaveUser={handleSaveUser}
        />
        <DeleteUserModal
          showDeleteConfirmation={showDeleteConfirmation}
          setShowDeleteConfirmation={setShowDeleteConfirmation}
          confirmDeleteUser={confirmDeleteUser}
        />
        <AddUserModal
          showAddUserModal={showAddUserModal}
          setShowAddUserModal={setShowAddUserModal}
          newUser={newUser}
          setNewUser={setNewUser}
          handleSaveNewUser={handleSaveNewUser}
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