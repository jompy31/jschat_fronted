import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EventList from './components/EventList';
import EventCalendar from './components/EventCalendar';
import AddEventModal from './components/AddEventModal';
import { fetchEvents } from './utils/eventUtils';
import "./Calendar.css";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    memo: '',
    created: new Date(),
    complete: false,
  });
  const token = useSelector((state) => state.authentication.token);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
      try {
        const parsedData = JSON.parse(currentUserData);
        setCurrentUser(parsedData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing currentUser data:', error);
      }
    }
  }, []);

  // useEffect(() => {
  //   if (token && isLoggedIn) {
  //     fetchEvents(token, setEventos);
  //   }
  // }, [token, isLoggedIn]);

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowAddModal(false);
    setIsEditMode(false);
    setNewEvent({
      title: '',
      memo: '',
      created: new Date(),
      complete: false,
    });
  };

  return (
    <div className="calendar-container">
      <div className="calendar-layout">
        <div className="calendar-list">
          <EventList
            eventos={eventos}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            hoveredEvent={hoveredEvent}
            setHoveredEvent={setHoveredEvent}
            setSelectedEvent={setSelectedEvent}
            setShowAddModal={setShowAddModal}
            setNewEvent={setNewEvent}
            setIsEditMode={setIsEditMode}
            setEventos={setEventos}
            token={token}
          />
        </div>
        <div className="calendar-view">
          <EventCalendar
            eventos={eventos}
            setSelectedEvent={setSelectedEvent}
            setShowAddModal={setShowAddModal}
            setIsEditMode={setIsEditMode}
            setNewEvent={setNewEvent}
          />
        </div>
      </div>

      <AddEventModal
        show={showAddModal}
        handleClose={handleCloseModal}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        setEventos={setEventos}
        token={token}
        isEditMode={isEditMode}
        selectedEvent={selectedEvent}
      />
    </div>
  );
};

export default Eventos;