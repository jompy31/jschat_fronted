import React from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import moment from 'moment';

const EventList = ({
  eventos,
  isLoggedIn,
  currentUser,
  hoveredEvent,
  setHoveredEvent,
  setSelectedEvent,
  setShowAddModal,
  setNewEvent,
  setShowEditDeleteModal,
}) => {
  const handleAddEvent = () => {
    setShowAddModal(true);
    setNewEvent({
      title: '',
      memo: '',
      created: new Date(),
      complete: false,
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEditDeleteModal(true);
  };

  return (
    <div className="w-full md:w-1/2 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Eventos</h1>
      {isLoggedIn ? (
        <>
          {currentUser && currentUser.staff_status === 'administrator' && (
            <Button
              variant="primary"
              onClick={handleAddEvent}
              className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Agregar Evento
            </Button>
          )}
          {eventos.map((evento, index) => {
            const isCompleted = moment(evento.created).isBefore(moment());
            return (
              <div
                key={evento.id}
                className={`bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer transition-transform duration-300 ${
                  hoveredEvent === index ? 'transform scale-105' : ''
                }`}
                onMouseOver={() => setHoveredEvent(index)}
                onMouseOut={() => setHoveredEvent(null)}
                onClick={() => handleEventClick(evento)}
              >
                <h2 className="text-lg font-semibold text-blue-600">{evento.title}</h2>
                <p className="text-gray-600">{evento.memo}</p>
                <p className="text-sm text-gray-500">
                  Creado: {moment(evento.created).format('YYYY-MM-DD HH:mm')}
                </p>
                <p className="text-sm text-gray-500">Completado: {isCompleted ? 'Sí' : 'No'}</p>
              </div>
            );
          })}
        </>
      ) : (
        <Alert variant="warning" className="rounded-lg">
          No has iniciado sesión. Por favor{' '}
          <Link to={'/login'} className="text-blue-600 hover:underline">
            inicia sesión
          </Link>{' '}
          para ver nuestro calendario de seminarios web.
        </Alert>
      )}
    </div>
  );
};

export default EventList;