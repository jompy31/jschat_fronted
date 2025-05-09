import { saveAs } from 'file-saver';
import axios from 'axios';
import moment from 'moment';

export const downloadEvent = (selectedEvent) => {
  if (!selectedEvent) return;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Calendar Event//EN
BEGIN:VEVENT
UID:${selectedEvent.id}
SUMMARY:${selectedEvent.title}
DESCRIPTION:${selectedEvent.memo}
DTSTART:${moment(selectedEvent.created).format('YYYYMMDDTHHmmss')}
DTEND:${moment(selectedEvent.created).add(1, 'hours').format('YYYYMMDDTHHmmss')}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  saveAs(blob, 'event.ics');
};

export const sendEmail = (selectedEvent, email, emailMessage) => {
  if (!selectedEvent) return;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Calendar Event//EN
BEGIN:VEVENT
UID:${selectedEvent.id}
SUMMARY:${selectedEvent.title}
DESCRIPTION:${selectedEvent.memo}
DTSTART:${moment(selectedEvent.created).format('YYYYMMDDTHHmmss')}
DTEND:${moment(selectedEvent.created).add(1, 'hours').format('YYYYMMDDTHHmmss')}
END:VEVENT
END:VCALENDAR`;

  const icsBlob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const formData = new FormData();
  formData.append('subject', 'Detalles del evento ABCupon');
  formData.append(
    'message',
    `Event Title: ${selectedEvent.title}\n` +
      `Description: ${selectedEvent.memo}\n` +
      `Date: ${moment(selectedEvent.created).format('YYYY-MM-DD HH:mm')}\n` +
      `Message: ${emailMessage}`
  );
  formData.append('from_email', 'consultas@iriquiqui.com');
  formData.append('recipient_list', email.split(',').map((recipient) => recipient.trim()));
  formData.append('attachments', icsBlob, 'event.ics');

  axios
    .post('http://localhost:8000/send-email/', formData)
    .then((response) => {
      console.log('¡Correo electrónico enviado exitosamente!', response.data);
    })
    .catch((error) => {
      console.error('No se pudo enviar el correo electrónico:', error);
    });
};