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
      id: event.id,
      title: event.title,
      memo: event.memo || '',
      created: moment(event.start).toDate(),
      complete: event.complete || false,
    });
  };

  const handleSelectSlot = () => {
    setSelectedEvent(null);
    setShowAddModal(true);
    setIsEditMode(false);
    setNewEvent({
      title: '',
      memo: '',
      created: new Date(),
      complete: false,
    });
  };

  return (
    <div className="rbc-calendar">
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
        style={{ height: 600 }}
        onSelectEvent={handleEventClick}
        onSelectSlot={handleSelectSlot}
        selectable
        popup
        tooltipAccessor="memo"
      />
    </div>
  );
};

export default EventCalendar;