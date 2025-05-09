import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import EventList from './components/EventList';
import EventCalendar from './components/EventCalendar';
import AddEventModal from './components/AddEventModal';
import EditDeleteModal from './components/EditDeleteModal';
import { fetchEvents } from './utils/eventUtils';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditDeleteModal, setShowEditDeleteModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    memo: '',
    created: new Date(),
    complete: false,
  });
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const token = useSelector(state => state.authentication.token);
  const [currentUser, setCurrentUser] = useState(null);

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
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchEvents(token, setEventos);
    }
  }, []);

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowAddModal(false);
    setShowEditDeleteModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100 p-6" style={{marginTop:"6%"}}>
      <EventList
        eventos={eventos}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        hoveredEvent={hoveredEvent}
        setHoveredEvent={setHoveredEvent}
        setSelectedEvent={setSelectedEvent}
        setShowAddModal={setShowAddModal}
        setNewEvent={setNewEvent}
        setShowEditDeleteModal={setShowEditDeleteModal}
      />
      <EventCalendar
        eventos={eventos}
        setSelectedEvent={setSelectedEvent}
        setShowEditDeleteModal={setShowEditDeleteModal}
      />
      <AddEventModal
        show={showAddModal}
        handleClose={handleCloseModal}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        setEventos={setEventos}
        token={token}
      />
      <EditDeleteModal
        show={showEditDeleteModal}
        handleClose={handleCloseModal}
        selectedEvent={selectedEvent}
        setEventos={setEventos}
        token={token}
        currentUser={currentUser}
        email={email}
        setEmail={setEmail}
        emailMessage={emailMessage}
        setEmailMessage={setEmailMessage}
      />
    </div>
  );
};

export default Eventos;