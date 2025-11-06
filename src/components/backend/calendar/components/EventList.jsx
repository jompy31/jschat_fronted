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
      id: event.id,
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
    <div>
      <h1>Eventos</h1>
      {isLoggedIn ? (
        <>
          {currentUser && currentUser.staff_status && (
            <button onClick={handleAddEvent} className="btn btn-primary mb-4">
              Agregar Evento
            </button>
          )}
          {eventos.length === 0 ? (
            <p className="text-muted">No hay eventos programados.</p>
          ) : (
            eventos.map((evento, index) => {
              const isCompleted = moment(evento.created).isBefore(moment());
              return (
                <div
                  key={evento.id}
                  className={`event-card ${hoveredEvent === index ? 'scale-105' : ''}`}
                  onMouseEnter={() => setHoveredEvent(index)}
                  onMouseLeave={() => setHoveredEvent(null)}
                  onClick={() => handleEditEvent(evento)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2>{evento.title}</h2>
                      <p>{evento.memo}</p>
                      <p className="date">
                        Creado: {moment(evento.created).format('YYYY-MM-DD HH:mm')}
                      </p>
                      <p className="date">
                        Completado: {isCompleted ? 'Sí' : 'No'}
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadEvent(evento);
                        }}
                        className="btn btn-outline"
                      >
                        Descargar
                      </button>
                      {currentUser && currentUser.staff_status === 'administrator' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(evento.id);
                          }}
                          className="btn btn-danger"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </>
      ) : (
        <Alert variant="warning" className="alert-warning">
          No has iniciado sesión. Por favor{' '}
          <Link to="/login" className="underline">
            inicia sesión
          </Link>{' '}
          para ver nuestro calendario de seminarios web.
        </Alert>
      )}
    </div>
  );
};

export default EventList;