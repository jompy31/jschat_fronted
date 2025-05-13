import React from 'react';
import { Table, Button } from 'react-bootstrap';
import moment from 'moment';
import PropTypes from 'prop-types';

const UserDetailsModal = ({ user, onClose, onDownloadPDF }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalles de {user.first_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="text-center mb-6">
          <img
            src={user.profile_picture}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto shadow-md"
          />
          <h3 className="text-xl font-semibold text-blue-600 mt-4">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-gray-600 italic">{user.email}</p>
        </div>
        <h4 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
          Información del Usuario
        </h4>
        <Table striped bordered hover responsive className="mb-6">
          <tbody>
            <tr>
              <td className="font-medium">Teléfono</td>
              <td>{user.phone_number}</td>
            </tr>
            <tr>
              <td className="font-medium">Biografía</td>
              <td>{user.bio}</td>
            </tr>
            <tr>
              <td className="font-medium">Ubicación</td>
              <td>{user.address}, {user.country}</td>
            </tr>
            <tr>
              <td className="font-medium">Fecha de Nacimiento</td>
              <td>{moment(user.date_of_birth).format('DD/MM/YYYY')}</td>
            </tr>
            <tr>
              <td className="font-medium">Estado de Empleo</td>
              <td>
                <span className={`font-semibold ${user.openwork ? 'text-green-600' : 'text-red-600'}`}>
                  {user.openwork ? 'Disponible' : 'No disponible'}
                </span>
              </td>
            </tr>
          </tbody>
        </Table>
        <h4 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
          Experiencia Laboral
        </h4>
        <Table striped bordered hover responsive>
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-black">Rol</th>
              <th className="text-black">Compañía</th>
              <th className="text-black">Desde</th>
              <th className="text-black">Hasta</th>
            </tr>
          </thead>
          <tbody>
            {user.experiences && user.experiences.length > 0 ? (
              user.experiences.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.job_title}</td>
                  <td>{exp.company_name}</td>
                  <td>{moment(exp.start_date).format('MMMM YYYY')}</td>
                  <td>{exp.end_date ? moment(exp.end_date).format('MMMM YYYY') : 'Actualidad'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No tiene experiencia laboral registrada
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <h4 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-600 pb-2 mb-4">
          Profesiones
        </h4>
        <Table striped bordered hover responsive>
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-black">Profesiones de candidato</th>
            </tr>
          </thead>
          <tbody>
            {user.skills && user.skills.length > 0 ? (
              user.skills.map((skill, index) => (
                <tr key={index}>
                  <td>{skill.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center">No tiene habilidades registradas</td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button
            onClick={onDownloadPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Descargar como PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

UserDetailsModal.propTypes = {
  user: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onDownloadPDF: PropTypes.func.isRequired,
};

export default UserDetailsModal;