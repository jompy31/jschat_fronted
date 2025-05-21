import React from 'react';
import { Table, Button } from 'react-bootstrap';
import moment from 'moment';
import Pagination from './Pagination';
import { formatDate, getFileExtension, downloadFile } from '../utils/fileUtils';
import FileDataService from '../../../../services/files';
import { motion } from 'framer-motion';

const FileTable = ({
  files,
  fileMeta,
  selectedFiles,
  setSelectedFiles,
  previewFileUrls,
  searchTerm,
  startDate,
  endDate,
  filesPerPage,
  currentPage,
  setCurrentPage,
  token,
  fetchFiles,
  currentUser,
  NotallowedFileNames = [],
}) => {
  const handleCheckboxChange = (event, fileId) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(file => file !== fileId));
    }
  };

  const handleDelete = (id) => {
    FileDataService.deleteFile(id, token)
      .then(response => {
        console.log('Archivo eliminado exitosamente:', response.data);
        fetchFiles(currentPage);
      })
      .catch(error => {
        console.error('Error al eliminar el archivo:', error);
      });
  };

  const handleDownloadSelected = () => {
    selectedFiles.forEach(fileId => {
      const file = files.find(file => file.id === fileId);
      if (file) {
        downloadFile(file.file, file.name);
      }
    });
  };

  const handleDeleteSelected = () => {
    selectedFiles.forEach(fileId => handleDelete(fileId));
    setSelectedFiles([]);
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!startDate || moment(file.created_at).isSameOrAfter(startDate)) &&
    (!endDate || moment(file.created_at).isSameOrBefore(endDate)) &&
    !NotallowedFileNames.includes(file.name)
  );

  const totalPages = Math.ceil(fileMeta.count / filesPerPage);

  const getPreviewComponent = (fileUrl) => {
    const fileExtension = getFileExtension(fileUrl);
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      return <img src={fileUrl} alt="Preview" className="preview-image" />;
    } else if (fileExtension === 'pdf') {
      return (
        <p className="preview-text">
          PDF: {' '}
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Abrir
          </a>
        </p>
      );
    } else if (fileExtension === 'mp4') {
      return (
        <video controls className="preview-video">
          <source src={fileUrl} type="video/mp4" />
        </video>
      );
    } else {
      return <p className="preview-text">Sin previsualización</p>;
    }
  };

  return (
    <>
      <style>
        {`
          .preview-image {
            max-width: 100px;
            max-height: 100px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
          }
          .preview-video {
            max-width: 100px;
            max-height: 100px;
            display: block;
            margin: 0 auto;
          }
          .preview-text {
            font-size: 0.85rem;
            text-align: center;
            margin: 0;
            max-height: 100px;
            overflow: hidden;
          }
          .file-preview {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100px;
            max-height: 120px;
            overflow: hidden;
          }
          .table-container {
            max-width: 100%;
            overflow-x: auto;
          }
          .table th, .table td {
            vertical-align: middle;
            padding: 8px;
          }
          .table .preview-column {
            width: 150px;
            text-align: center;
          }
        `}
      </style>
      {filteredFiles.length > 0 ? (
        <>
          <div className="flex justify-end space-x-4 mb-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleDownloadSelected}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Descargar seleccionado
              </Button>
            </motion.div>
            {currentUser && currentUser.staff_status === 'administrator' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleDeleteSelected}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                >
                  Eliminar seleccionado
                </Button>
              </motion.div>
            )}
          </div>
          <div className="table-container">
            <Table striped bordered hover className="w-full">
              <thead>
                <tr>
                  <th className="text-blue-600">Seleccionar</th>
                  <th className="text-blue-600">Nombre del archivo</th>
                  <th className="text-blue-600">Creado por:</th>
                  <th className="text-blue-600">Fecha de creación</th>
                  <th className="text-blue-600">Descargar</th>
                  <th className="text-blue-600 preview-column">Previsualización</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map(file => (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={event => handleCheckboxChange(event, file.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td>
                      <a href={file.file} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-blue-600">
                        {file.name}
                      </a>
                    </td>
                    <td>{file.user}</td>
                    <td>{formatDate(file.created_at)}</td>
                    <td>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadFile(file.file, file.name)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                      >
                        Descargar
                      </motion.button>
                    </td>
                    <td className="preview-column">
                      {previewFileUrls[file.id] && (
                        <div className="file-preview">
                          {getPreviewComponent(previewFileUrls[file.id])}
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <p className="text-gray-600">No hay archivos disponibles.</p>
      )}
    </>
  );
};

export default FileTable;