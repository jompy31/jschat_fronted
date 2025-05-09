import TodoDataService from '../../../../services/todos';
import moment from 'moment';

export const fetchEvents = (token, setEventos) => {
  TodoDataService.getAll(token)
    .then((response) => {
      setEventos(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const saveEvent = (newEvent, editedEvent, token, setEventos, callback) => {
  const isNewEvent = !editedEvent;
  const serviceMethod = isNewEvent ? TodoDataService.createTodo : TodoDataService.updateTodo;
  const updatedEvent = isNewEvent
    ? { ...newEvent, created: moment(newEvent.created).format('YYYY-MM-DD HH:mm:ss') }
    : { ...newEvent, id: editedEvent.id, created: moment(newEvent.created).format('YYYY-MM-DD HH:mm:ss') };

  serviceMethod(updatedEvent, token)
    .then((response) => {
      if (isNewEvent) {
        setEventos((prevEventos) => [...prevEventos, response.data]);
      } else {
        setEventos((prevEventos) =>
          prevEventos.map((e) => (e.id === response.data.id ? response.data : e))
        );
      }
      callback();
    })
    .catch((error) => {
      console.error(error);
    });
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