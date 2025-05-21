import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DataTable from './DataTable';
import { getUserList, getAllSkills, getAllWorkExperiences } from '../utils/api';
import { mergeUserSkills, convertToCSV, sanitizeInput } from '../utils/dataHandlers';
import { downloadPDF } from '../utils/pdfUtils';
import CurrentUserContext from '../CurrentUserContext';
import UserDetailsModal from './UserDetailsModal';

const UserSearch = () => {
  const token = useSelector((state) => state.authentication.token);
  const user = useSelector((state) => state.authentication.user);
  const [userList, setUserList] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem('currentPage');
    return storedPage ? parseInt(storedPage, 10) : 1;
  });
  const [usersPerPage, setUsersPerPage] = useState(4);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [showCurrentUserModal, setShowCurrentUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const componentRef = useRef();

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
      loadUsers();
    }
  }, [token]);

  const loadUsers = async () => {
    try {
      const userResponse = await getUserList(token);
      const skillsResponse = await getAllSkills(token);
      const experiencesResponse = await getAllWorkExperiences(token);
      const users = Array.isArray(userResponse.data) ? userResponse.data : [];
      const skillsData = Array.isArray(skillsResponse.data) ? skillsResponse.data : [];
      const experiencesData = Array.isArray(experiencesResponse.data) ? experiencesResponse.data : [];
      const updatedUserList = mergeUserSkills(users, skillsData);
      const finalUserList = updatedUserList.map((user) => {
        const userExperiences = experiencesData.filter((exp) => exp.user === user.id);
        return { ...user, experiences: userExperiences };
      });
      const filteredUserList = finalUserList.filter((user) => user.openwork === true);
      setUserList(filteredUserList);
      console.log("probando", skillsResponse.data )
      setSkills(skillsData);
    } catch (error) {
      console.error('Error fetching users, skills, or experiences:', error);
      setUserList([]);
      setSkills([]);
    }
  };

  useEffect(() => {
    const filteredData = userList.filter((user) => {
      const matchesUserInfo =
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.staff_status &&
          user.staff_status.trim() !== '' &&
          user.staff_status.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSkills =
        user.skills &&
        user.skills.some((skill) =>
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesUserInfo || matchesSkills;
    });
    setStoredData(filteredData);
  }, [userList, searchTerm]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (sortConfig.key) {
      return [...storedData].sort((a, b) => {
        const aValue = a[sortConfig.key]
          ? a[sortConfig.key].toString().toLowerCase()
          : '';
        const bValue = b[sortConfig.key]
          ? b[sortConfig.key].toString().toLowerCase()
          : '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return storedData;
  };

  const columns = [
    {
      key: 'first_name',
      label: 'Nombre Completo',
      render: (user) => (
        <span
          className="underline cursor-pointer text-blue-600 hover:text-blue-800"
          onClick={() => handleShowUserDetails(user)}
        >
          {user.first_name} {user.last_name}
        </span>
      ),
      onSort: handleSort,
    },
    { key: 'email', label: 'Correo Electrónico', onSort: handleSort },
    {
      key: 'openwork',
      label: 'Buscando Trabajo',
      render: (user) => (
        <span className={user.openwork ? 'text-green-600' : 'text-red-600'}>
          {user.openwork ? 'Sí' : 'No'}
        </span>
      ),
      onSort: handleSort,
    },
    { key: 'bio', label: 'Presentación', onSort: handleSort },
    { key: 'phone_number', label: 'Número de Teléfono' },
    {
      key: 'skills',
      label: 'Profesiones',
      render: (user) =>
        user.skills && user.skills.length > 0
          ? user.skills.map((skill) => skill.name).join(', ')
          : 'No tiene habilidades registradas',
    },
  ];

  const currentUsers = sortedData().slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleDownloadCSV = () => {
    const csvData = convertToCSV(userList, sanitizeInput, moment);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'userList.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShowUserDetails = (user) => {
    setSelectedUser(user);
    setShowCurrentUserModal(true);
  };

  const handleCloseUserDetailsModal = () => {
    setShowCurrentUserModal(false);
    setSelectedUser(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    localStorage.setItem('currentPage', pageNumber);
  };

  return (
    <CurrentUserContext.Consumer>
      {(contextUser) => (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Candidatos</h1>
            {(contextUser || currentUser) && (contextUser?.staff_status === 'administrator' || currentUser?.staff_status === 'administrator') && (
              <Button
                onClick={handleDownloadCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Descargar CSV
              </Button>
            )}
          </div>
          {(contextUser || currentUser) &&
            ((contextUser?.staff_status === 'administrator' || contextUser?.staff_status === 'human_resources') ||
             (currentUser?.staff_status === 'administrator' || currentUser?.staff_status === 'human_resources')) && (
              <div className="space-y-4">
                <Form.Group controlId="searchTerm">
                  <Form.Control
                    type="text"
                    placeholder="Buscar por nombre, correo o profesión"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3"
                  />
                </Form.Group>
                <Form.Control
                  as="select"
                  value={selectedSkill}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3"
                >
                  <option value="">Seleccionar Profesión</option>
                  {skills.map((skill) => (
                    <option key={skill.id} value={skill.name}>
                      {skill.name}
                    </option>
                  ))}
                </Form.Control>
                <Form.Group controlId="usersPerPage" className="flex items-center space-x-2">
                  <Form.Label className="text-sm font-medium text-gray-700">Candidatos por página:</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    step="1"
                    value={usersPerPage}
                    onChange={(e) => setUsersPerPage(parseInt(e.target.value, 10))}
                    className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-16 text-center"
                  />
                </Form.Group>
              </div>
            )}
          <DataTable columns={columns} data={currentUsers} />
          {(contextUser || currentUser) && (contextUser?.staff_status === 'administrator' || currentUser?.staff_status === 'administrator') && (
            <div className="flex justify-center items-center space-x-4">
              <Button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Anterior
              </Button>
              <span className="text-gray-600">Página {currentPage}</span>
              <Button
                disabled={currentPage === Math.ceil(storedData.length / usersPerPage)}
                onClick={() => handlePageChange(currentPage + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Siguiente
              </Button>
            </div>
          )}
          {showCurrentUserModal && selectedUser && (
            <UserDetailsModal
              user={selectedUser}
              onClose={handleCloseUserDetailsModal}
              onDownloadPDF={() => downloadPDF(selectedUser, moment)}
            />
          )}
        </div>
      )}
    </CurrentUserContext.Consumer>
  );
};

export default UserSearch;