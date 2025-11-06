import TodoDataService from '../../../../services/todos';
import moment from 'moment';

export const fetchEvents = (token, setEventos) => {
  TodoDataService.getAll(token)
    .then((response) => {
      setEventos(response.data.results || []); // Use results, fallback to empty array
    })
    .catch((error) => {
      console.error('Error fetching events:', error);
    });
};

export const saveEvent = (newEvent, editedEvent, token, setEventos, callback) => {
  const isNewEvent = !editedEvent;
  const serviceMethod = isNewEvent ? TodoDataService.createTodo : TodoDataService.updateTodo;
  const updatedEvent = {
    ...newEvent,
    created: moment(newEvent.created).format('YYYY-MM-DD HH:mm:ss'),
  };

  if (isNewEvent) {
    serviceMethod(updatedEvent, token)
      .then((response) => {
        setEventos((prevEventos) => [...prevEventos, response.data]);
        callback();
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    serviceMethod(newEvent.id, updatedEvent, token)
      .then((response) => {
        setEventos((prevEventos) =>
          prevEventos.map((e) => (e.id === response.data.id ? response.data : e))
        );
        callback();
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

export const deleteEvent = (eventId, token, setEventos, callback) => {
  TodoDataService.deleteTodo(eventId, token)
    .then(() => {
      setEventos((prevEventos) => prevEventos.filter((event) => event.id !== eventId));
      callback();
    })
    .catch((error) => {
      console.error(error);
    });
};