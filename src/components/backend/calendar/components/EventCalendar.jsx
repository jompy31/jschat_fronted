import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const EventCalendar = ({ eventos, setSelectedEvent, setShowEditDeleteModal }) => {
  const localizer = momentLocalizer(moment);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEditDeleteModal(true);
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
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
        onSelectSlot={() => {
          setSelectedEvent(null);
          setShowEditDeleteModal(false);
        }}
        popup={true}
        tooltipAccessor="memo"
      />
    </div>
  );
};

export default EventCalendar;