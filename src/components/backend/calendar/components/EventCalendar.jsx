import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const EventCalendar = ({ eventos, setSelectedEvent, setShowAddModal, setIsEditMode, setNewEvent }) => {
  const localizer = momentLocalizer(moment);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEditMode(true);
    setShowAddModal(true);
    setNewEvent({
      id: event.id, // Añadir el id
      title: event.title,
      memo: event.memo || '',
      created: moment(event.start).toDate(),
      complete: event.complete || false,
    });
  };

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <BigCalendar
        localizer={localizer}
        events={eventos.map((evento) => ({
          id: evento.id,
          title: evento.title,
          start: moment(evento.created).toDate(),
          end: moment(evento.created).add(1, 'hours').toDate(),
          memo: evento.memo,
          complete: evento.complete,
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
        onSelectSlot={() => {
          setSelectedEvent(null);
          setShowAddModal(true); // Open modal for adding new event
          setIsEditMode(false); // Ensure it's not in edit mode
          setNewEvent({
            title: '',
            memo: '',
            created: new Date(),
            complete: false,
          });
        }}
        popup={true}
        tooltipAccessor="memo"
      />
    </div>
  );
};

export default EventCalendar;