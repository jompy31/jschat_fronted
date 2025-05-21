import React from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { deleteEvent } from '../utils/eventUtils';
import { downloadEvent } from '../utils/icsUtils';

const EventList = ({
  eventos,
  isLoggedIn,
  currentUser,
  hoveredEvent,
  setHoveredEvent,
  setSelectedEvent,
  setShowAddModal,
  setNewEvent,
  setIsEditMode,
  setEventos,
  token,
}) => {
  const handleAddEvent = () => {
    setShowAddModal(true);
    setIsEditMode(false);
    setNewEvent({
      title: '',
      memo: '',
      created: new Date(),
      complete: false,
    });
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowAddModal(true);
    setIsEditMode(true);
    setNewEvent({
      id: event.id, // Añadir el id
      title: event.title,
      memo: event.memo,
      created: moment(event.created).toDate(),
      complete: event.complete,
    });
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      deleteEvent(eventId, token, setEventos, () => {});
    }
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
                className={`bg-white rounded-lg shadow-md p-4 mb-4 transition-transform duration-300 ${
                  hoveredEvent === index ? 'transform scale-105' : ''
                }`}
                onMouseOver={() => setHoveredEvent(index)}
                onMouseOut={() => setHoveredEvent(null)}
              >
                <div className="flex justify-between items-center">
                  <div onClick={() => handleEditEvent(evento)} className="cursor-pointer flex-1">
                    <h2 className="text-lg font-semibold text-blue-600">{evento.title}</h2>
                    <p className="text-gray-600">{evento.memo}</p>
                    <p className="text-sm text-gray-500">
                      Creado: {moment(evento.created).format('YYYY-MM-DD HH:mm')}
                    </p>
                    <p className="text-sm text-gray-500">Completado: {isCompleted ? 'Sí' : 'No'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="primary"
                      onClick={() => downloadEvent(evento)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded"
                    >
                      Descargar
                    </Button>
                    {currentUser && currentUser.staff_status === 'administrator' && (
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteEvent(evento.id)}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
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