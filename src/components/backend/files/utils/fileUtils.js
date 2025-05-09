import moment from 'moment';

export const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

export const getFileExtension = (url) => {
  return url.split('.').pop().toLowerCase();
};

export const downloadFile = (url, fileName) => {
  window.open(url, '_blank');
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const blobURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobURL;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(blobURL);
      link.remove();
    })
    .catch(error => {
      console.error('Error al descargar el archivo:', error);
    });
};