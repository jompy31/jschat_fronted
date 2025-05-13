import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import TodoDataService from '../../../services/todos';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import moment from 'moment';
import Register from './register';
import { useSelector } from 'react-redux';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from 'html2pdf.js';
import CurrentUserContext from './CurrentUserContext';

const Usuarios_search_job = () => {
  const [userList, setUserList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    staff_status: '',
    password: ''
  });
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    staff_status: '',
    password: ''
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [showCurrentUserModal, setShowCurrentUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const storedPage = localStorage.getItem('currentPage');
    return storedPage ? parseInt(storedPage, 10) : 1;
  });
  const [usersPerPage, setUsersPerPage] = useState(4);
  const [customUsersPerPage, setCustomUsersPerPage] = useState(4);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [storedData, setStoredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const token = useSelector(state => state.authentication.token);
  const user = useSelector(state => state.authentication.user);
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState('');
  const componentRef = useRef();

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

  const mergeUserSkills = (users, skills) => {
    return users.map(user => {
      // Filtrar las habilidades que pertenecen a este usuario por su id
      const userSkills = skills.filter(skill => skill.user === user.id);

      // Retornar el usuario con las habilidades añadidas
      return { ...user, skills: userSkills };
    });
  };

  const getUserList = async () => {
    try {
      const userResponse = await TodoDataService.getUserList(token);
      const skillsResponse = await TodoDataService.getAllSkills(token);
      const experiencesResponse = await TodoDataService.getAllWorkExperiences(token); // Obtén las experiencias laborales

      // Fusionar habilidades con los usuarios
      const updatedUserList = mergeUserSkills(userResponse.data, skillsResponse.data);

      // Agregar las experiencias laborales a cada usuario
      const finalUserList = updatedUserList.map(user => {
        const userExperiences = experiencesResponse.data.filter(exp => exp.user === user.id);
        return {
          ...user,
          experiences: userExperiences // Añadir las experiencias al objeto del usuario
        };
      });

      // Filtrar usuarios que tienen .openwork en true
      const filteredUserList = finalUserList.filter(user => user.openwork === true);
      // console.log("usuarios con todos los datos", experiencesResponse.data)
      // Actualizar el estado de userList con los datos filtrados
      setUserList(filteredUserList);
      setSkills(skillsResponse.data);
      // console.log("userList con habilidades y experiencias filtradas", filteredUserList);

    } catch (e) {
      console.error("Error fetching users, skills or experiences:", e);
    }
  };




  useEffect(() => {
    if (token) {
      getUserList();
    }
  }, [token]);

  useEffect(() => {
    const filteredData = userList.filter((user) => {
      // Filtrar por el nombre, apellido, email, y estado del usuario
      const matchesUserInfo =
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.staff_status && user.staff_status.trim() !== '' &&
          user.staff_status.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtrar por las habilidades del usuario
      const matchesSkills = user.skills && user.skills.some(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // El usuario debe coincidir con la información del usuario o sus habilidades
      return matchesUserInfo || matchesSkills;
    });

    setStoredData(filteredData);
  }, [userList, searchTerm]);


  useEffect(() => {
    setCurrentPage(1);
  }, [usersPerPage]);

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

  const handlePerPageChange = (e) => {
    setCustomUsersPerPage(parseInt(e.target.value, 10));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (sortConfig !== null && sortConfig.key !== null) {
      return [...storedData].sort((a, b) => {
        const key = sortConfig.key;
        const aValue = a[key] ? a[key].toString().toLowerCase() : '';
        const bValue = b[key] ? b[key].toString().toLowerCase() : '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
      return storedData;
    }
  };

  const renderUserList = () => {
    const currentUsers = sortedData().slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );

    return currentUsers.map((user) => (
      <tr key={user.id}>
        <td style={{ padding: '0.5rem', cursor: 'pointer' }} onClick={() => handleShowUserDetails(user)}>
          {user.first_name + " " + user.last_name}
        </td>
        <td style={{ padding: '0.5rem' }}>{user.email}</td>
        <td style={{ padding: '0.5rem' }}>{user.openwork ? 'Sí' : 'No'}</td>
        <td style={{ padding: '0.5rem' }}>{user.bio}</td>
        <td style={{ padding: '0.5rem' }}>{user.phone_number}</td>
        {/* Nueva columna para las habilidades */}
        <td style={{ padding: '0.5rem' }}>
          {user.skills && user.skills.length > 0
            ? user.skills.map(skill => skill.name).join(", ")
            : "No tiene habilidades registradas"}
        </td>
      </tr>
    ));
  };


  const handleDownloadCSV = () => {
    const csvData = convertToCSV(userList);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'userList.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const sanitizeInput = (input) => {
    if (!input) return ''; // Retornar vacío si el input es nulo o indefinido

    // Reemplazar caracteres acentuados
    return input
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/Ñ/g, 'N')
      .replace(/[^a-zA-Z0-9\s.,;:@]/g, '');
  };

  const convertToCSV = (userList) => {
    // Sanitizar encabezados
    const header = [
      sanitizeInput('Nombre'),
      sanitizeInput('Apellido'),
      sanitizeInput('Email'),
      sanitizeInput('Teléfono'),
      sanitizeInput('Biografía'),
      sanitizeInput('Ubicación'),
      sanitizeInput('Fecha de Nacimiento'),
      sanitizeInput('Estado de Empleo'),
      sanitizeInput('Experiencia Laboral'),
      sanitizeInput('Habilidades')
    ].join(';') + '\n';

    const rows = userList.map(user => {
      const experiences = user.experiences && user.experiences.length > 0
        ? user.experiences.map(exp => {
          return `"${sanitizeInput(exp.job_title)} en ${sanitizeInput(exp.company_name)} (${moment(exp.start_date).format("MMMM YYYY")} - ${exp.end_date ? moment(exp.end_date).format("MMMM YYYY") : 'Actualidad'})"`;
        }).join(';')
        : 'No tiene experiencia laboral registrada';

      const skills = user.skills && user.skills.length > 0
        ? user.skills.map(skill => `"${sanitizeInput(skill.name)}"`).join(';')
        : 'No tiene habilidades registradas';

      return [
        `"${sanitizeInput(user.first_name)}"`,
        `"${sanitizeInput(user.last_name)}"`,
        `"${sanitizeInput(user.email)}"`,
        `"${sanitizeInput(user.phone_number)}"`,
        `"${sanitizeInput(user.bio.replace(/"/g, '""'))}"`, // Escapar comillas dobles en la biografía
        `"${sanitizeInput(user.address)}, ${sanitizeInput(user.country)}"`,
        `"${moment(user.date_of_birth).format("DD/MM/YYYY")}"`,
        `"${user.openwork ? 'Disponible' : 'No disponible'}"`,
        experiences,
        skills
      ].join(';');
    }).join('\n');

    return header + rows;
  };





  const handleCloseModal = () => {
    setShowModal(false);
  };

  const downloadPDF = () => {
    const content = `
      <div style="font-family: Arial, sans-serif;">
        <h4 style="text-align: center; color: #007bff;">Detalles de ${selectedUser.first_name} ${selectedUser.last_name}</h4>
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${selectedUser.profile_picture}" alt="Profile" style="width: 150px; border-radius: 75px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" />
          <p style="font-style: italic; color: #555;">${selectedUser.email}</p>
        </div>
        
        <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Información del Usuario</h4>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tbody>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Teléfono</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">${selectedUser.phone_number}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Biografía</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">${selectedUser.bio}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Ubicación</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">${selectedUser.address}, ${selectedUser.country}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Fecha de Nacimiento</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">${moment(selectedUser.date_of_birth).format("DD/MM/YYYY")}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;"><strong>Estado de Empleo</strong></td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                <strong style="color: ${selectedUser.openwork ? 'green' : 'red'};">${selectedUser.openwork ? 'Disponible' : 'No disponible'}</strong>
              </td>
            </tr>
          </tbody>
        </table>
  
        <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Experiencia Laboral</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: #007bff; color: white;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; color: black;">Rol</th>
              <th style="border: 1px solid #ddd; padding: 8px; color: black;">Compañía</th>
              <th style="border: 1px solid #ddd; padding: 8px; color: black;">Desde</th>
              <th style="border: 1px solid #ddd; padding: 8px; color: black;">Hasta</th>
            </tr>
          </thead>
          <tbody>
            ${selectedUser.experiences && selectedUser.experiences.length > 0 ? (
        selectedUser.experiences.map(exp => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${exp.job_title}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${exp.company_name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${moment(exp.start_date).format("MMMM YYYY")}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${exp.end_date ? moment(exp.end_date).format("MMMM YYYY") : 'Actualidad'}</td>
                </tr>
              `).join('')
      ) : (
        '<tr><td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: center;">No tiene experiencia laboral registrada</td></tr>'
      )}
          </tbody>
        </table>
  
        <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Profesiones</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead style="background-color: #007bff; color: white;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; color: black;">Profesiones de candidato</th>
            </tr>
          </thead>
          <tbody>
            ${selectedUser.skills && selectedUser.skills.length > 0 ? (
        selectedUser.skills.map(skill => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${skill.name}</td>
                </tr>
              `).join('')
      ) : (
        '<tr><td style="border: 1px solid #ddd; padding: 8px; text-align: center;">No tiene habilidades registradas</td></tr>'
      )}
          </tbody>
        </table>
      </div>
    `;

    const pdfElement = document.createElement('div');
    pdfElement.innerHTML = content;
    document.body.appendChild(pdfElement);

    const options = {
      margin: [0.5, 1, 1, 1], // Cambia el margen superior a 0.5 in (5% más arriba)
      filename: 'Usuario_Detalles.pdf',
      html2canvas: { scale: 2, logging: true, useCORS: true }, // Enable CORS to load images
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(pdfElement).set(options).save().then(() => {
      document.body.removeChild(pdfElement); // Limpiar el DOM después de generar el PDF
    });
  };




  return (
    <>
      <br /><br /><br />

      {location.pathname !== '/register' && (
        <CurrentUserContext.Provider value={currentUser}>
          <div style={{ display: 'flex', width: '100%' }}>
            <h1>Candidatos</h1>
            {currentUser && currentUser.staff_status === 'administrator' && (


              <div
                className="header-buttons"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '50%',
                  marginLeft: '45%',
                }}
              >
                <Button
                  variant="outline-primary"
                  onClick={handleDownloadCSV}
                  style={{
                    color: 'blue',
                    backgroundColor: 'white',
                    border: '2px solid black',
                    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    transition: 'background-color 0.3s, border-color 0.3s',
                  }}
                >
                  Descargar lista de Candidatos en CSV
                </Button>
              </div>
            )}
          </div>
        </CurrentUserContext.Provider>
      )}
      {currentUser && (currentUser.staff_status === 'administrator' || currentUser.staff_status === 'human_resources') && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Form.Group controlId="searchTerm" style={{ display: 'flex', alignItems: 'center' }}>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, correo electrónico o profesión laboral"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderRadius: '5px',
                boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                transition: 'box-shadow 0.3s',
                outline: 'none',
                padding: '6px',
                width: '30%',
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 6px rgba(0, 0, 255, 0.5)';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
              }}
            />
          </Form.Group>
          <select
            value={selectedSkill}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: '5px',
              boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              transition: 'box-shadow 0.3s',
              outline: 'none',
              padding: '6px',
              width: '30%',
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 0 6px rgba(0, 0, 255, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
            }}
          >
            <option value="">Seleccionar Profesion para busqueda</option>
            {skills.map(skill => (
              <option key={skill.id} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
          <Form onSubmit={handlePerPageChange} style={{ marginBottom: '10px' }}>
            <Form.Group controlId="usersPerPage">
              <Form.Label style={{ display: 'flex', alignItems: 'center' }}>Candidatos por pagina:</Form.Label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Control
                  type="number"
                  min="1"
                  step="1"
                  value={usersPerPage}
                  onChange={(e) => setUsersPerPage(parseInt(e.target.value, 10))}
                  style={{
                    borderRadius: '5px',
                    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    transition: 'box-shadow 0.3s',
                    outline: 'none',
                    padding: '6px',
                    marginLeft: '5px',
                    marginRight: '5px',
                    width: '50px',
                    textAlign: 'center',
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 6px rgba(0, 0, 255, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
                  }}
                />
                {/* <Button type="submit" variant="primary" style={{ marginLeft: '0%' }}>
                Apply
              </Button> */}
              </div>
            </Form.Group>
          </Form>
        </div>
      )}
      {currentUser && (currentUser.staff_status === 'administrator' || currentUser.staff_status === 'human_resources') && (
        <div style={{ width: '100%', overflowX: 'auto', maxWidth: '100vw' }}>

          <Table
            striped
            bordered
            hover
            style={{ boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', backgroundColor: 'white' }}
          >
            <thead>
              <tr>
                <th onClick={() => handleSort('first_name')} style={{ color: 'blue' }}>
                  Nombre Completo
                </th>
                <th onClick={() => handleSort('email')} style={{ color: 'blue' }}>
                  Correo electronico
                </th>
                <th onClick={() => handleSort('openwork')} style={{ color: 'blue' }}>
                  Buscando Trabajo
                </th>
                <th onClick={() => handleSort('bio')} style={{ color: 'blue' }}>
                  Presentación
                </th>
                <th style={{ color: 'blue' }}>Numero de teléfono</th>
                <th style={{ color: 'blue' }}>Profesiones</th>
              </tr>
            </thead>
            <tbody>{renderUserList()}</tbody>
          </Table>
        </div>

      )}
      {currentUser && currentUser.staff_status === 'administrator' && (
        <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>
            <Button variant="primary" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              Anterior
            </Button>
            <div className="page-info" style={{ margin: '0 5px', marginTop: '5%' }}>
              Pagina {currentPage}
            </div>
            <Button
              variant="primary"
              disabled={currentPage === Math.ceil(storedData.length / usersPerPage)}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              siguiente
            </Button>
          </div>
          {/* <div className="page-info">Page {currentPage}</div> */}

        </div>
      )}

      {/* Modal para mostrar detalles del usuario */}
      {showCurrentUserModal ? (
        <div
          ref={componentRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo oscuro con opacidad
            zIndex: 999, // Asegura que el fondo esté detrás del modal
          }}
        >
          <div
            style={{
              position: "absolute", // Cambiado a absolute para centrar dentro del fondo
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#ffffff",
              width: '80%',
              maxWidth: "600px",
              borderRadius: "8px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              maxHeight: "90%", // Máxima altura del modal
              overflowY: "auto", // Permitir desplazamiento vertical
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontWeight: "bold", fontSize: "1.5rem", color: "#333", margin: 0 }}>
                Detalles de {selectedUser ? selectedUser.first_name : ""}
              </h2>
              <button
                onClick={handleCloseUserDetailsModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "#aaa"
                }}
              >
                &times; {/* Este es el símbolo de cerrar (X) */}
              </button>
            </div>

            {selectedUser && (
              <div>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <img
                    src={selectedUser.profile_picture} // Cambia esto según el campo correspondiente
                    alt="Profile"
                    style={{ width: "150px", borderRadius: "75px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
                  />
                  <h2 style={{ margin: "10px 0", color: "#007bff" }}>
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h2>
                  <p style={{ fontStyle: "italic", color: "#555" }}>{selectedUser.email}</p>
                </div>

                <h4 style={{ marginBottom: "15px", color: "#333", borderBottom: "2px solid #007bff", paddingBottom: "5px" }}>
                  Información del Usuario
                </h4>
                <Table striped bordered hover responsive style={{ marginBottom: "20px", width: "100%" }}>
                  <tbody>
                    <tr>
                      <td><strong>Teléfono</strong></td>
                      <td>{selectedUser.phone_number}</td>
                    </tr>
                    <tr>
                      <td><strong>Biografía</strong></td>
                      <td>{selectedUser.bio}</td>
                    </tr>
                    <tr>
                      <td><strong>Ubicación</strong></td>
                      <td>{selectedUser.address}, {selectedUser.country}</td>
                    </tr>
                    <tr>
                      <td><strong>Fecha de Nacimiento</strong></td>
                      <td>{moment(selectedUser.date_of_birth).format("DD/MM/YYYY")}</td>
                    </tr>
                    <tr>
                      <td><strong>Estado de Empleo</strong></td>
                      <td>
                        <strong style={{ color: selectedUser.openwork ? "green" : "red" }}>
                          {selectedUser.openwork ? "Disponible" : "No disponible"}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <h4 style={{ marginBottom: "15px", color: "#333", borderBottom: "2px solid #007bff", paddingBottom: "5px" }}>
                  Experiencia Laboral
                </h4>
                <Table striped bordered hover responsive style={{ width: "100%" }}>
                  <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
                    <tr>
                      <th style={{ color: "black" }}>Rol</th>
                      <th style={{ color: "black" }}>Compañía</th>
                      <th style={{ color: "black" }}>Desde</th>
                      <th style={{ color: "black" }}>Hasta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.experiences && selectedUser.experiences.length > 0 ? (
                      selectedUser.experiences.map((exp, index) => (
                        <tr key={index}>
                          <td>{exp.job_title}</td>
                          <td>{exp.company_name}</td>
                          <td>{moment(exp.start_date).format("MMMM YYYY")}</td>
                          <td>{exp.end_date ? moment(exp.end_date).format("MMMM YYYY") : "Actualidad"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center" }}>No tiene experiencia laboral registrada</td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <h4 style={{ marginBottom: "15px", color: "#333", borderBottom: "2px solid #007bff", paddingBottom: "5px" }}>
                  Profesiones
                </h4>
                <Table striped bordered hover responsive style={{ width: "100%" }}>
                  <thead style={{ backgroundColor: "#007bff", color: "#fff" }}>
                    <tr>
                      <th style={{ color: "black" }}>Profesiones de candidato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.skills && selectedUser.skills.length > 0 ? (
                      selectedUser.skills.map((skill, index) => (
                        <tr key={index}>
                          <td>{skill.name}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: "center" }}>No tiene habilidades registradas</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                <button style={{ marginTop: "10px", padding: "10px 15px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={downloadPDF}>
                  Descargar componente como PDF
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}





    </>
  );
};

export default Usuarios_search_job;
