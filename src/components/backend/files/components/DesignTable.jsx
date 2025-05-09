import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import moment from 'moment';
import Pagination from './Pagination';
import { formatDate, downloadFile } from '../utils/fileUtils';
import FileDataService from '../../../../services/files';
import { motion } from 'framer-motion';
import './DesignTable.css';

const DesignTable = ({
  designs,
  selectedDesigns,
  setSelectedDesigns,
  previewDesignUrls,
  designNameSearch,
  creatorSearch,
  customerSearch,
  contextSearch,
  startDate,
  endDate,
  designsPerPage,
  currentDesignsPage,
  setCurrentDesignsPage,
  token,
  fetchDesigns,
  currentUser,
  NotallowedFileNames,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const modalRef = useRef(null);

  const handleCheckboxChange = (event, designId) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedDesigns(prev => [...prev, designId]);
    } else {
      setSelectedDesigns(prev => prev.filter(design => design !== designId));
    }
  };

  const handleDelete = (id) => {
    FileDataService.deleteDesign(id, token)
      .then(response => {
        console.log('Diseño eliminado exitosamente:', response.data);
        fetchDesigns();
      })
      .catch(error => {
        console.error('Error al eliminar el diseño:', error);
      });
  };

  const handleDownloadSelected = () => {
    selectedDesigns.forEach(designId => {
      const design = designs.find(design => design.id === designId);
      if (design) {
        downloadFile(design.file, design.name);
      }
    });
  };

  const handleDeleteSelected = () => {
    selectedDesigns.forEach(designId => handleDelete(designId));
    setSelectedDesigns([]);
  };

  const handleShowModal = (design) => {
    setSelectedDesign(design);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDesign(null);
    setIsFullScreenImage(false);
    setZoomLevel(1);
  };

  const handleImageClick = () => {
    setIsFullScreenImage(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreenImage(false);
    setZoomLevel(1);
  };

  const handleZoomChange = (event) => {
    setZoomLevel(parseFloat(event.target.value));
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  const filteredDesigns = designs.filter(design =>
    design.name.toLowerCase().includes(designNameSearch.toLowerCase()) &&
    design.created_by.toLowerCase().includes(creatorSearch.toLowerCase()) &&
    design.customer.toLowerCase().includes(customerSearch.toLowerCase()) &&
    design.context.toLowerCase().includes(contextSearch.toLowerCase()) &&
    (!startDate || moment(design.created_at).isSameOrAfter(startDate)) &&
    (!endDate || moment(design.created_at).isSameOrBefore(endDate)) &&
    !NotallowedFileNames.includes(design.name)
  );

  const indexOfLastDesign = currentDesignsPage * designsPerPage;
  const indexOfFirstDesign = indexOfLastDesign - designsPerPage;
  const currentDesigns = filteredDesigns.slice(indexOfFirstDesign, indexOfLastDesign);
  const totalDesignPages = Math.ceil(filteredDesigns.length / designsPerPage);

  return (
    <>
      {filteredDesigns.length > 0 ? (
        <>
          <div className="button-container">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleDownloadSelected}
                className="download-button"
              >
                Descargar diseños
              </Button>
            </motion.div>
            {currentUser && currentUser.staff_status === 'administrator' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleDeleteSelected}
                  className="delete-button"
                >
                  Eliminar diseño seleccionado
                </Button>
              </motion.div>
            )}
          </div>
          <div className="table-container">
            <Table striped bordered hover className="design-table">
              <thead>
                <tr>
                  <th>Seleccionar</th>
                  <th>Nombre del cliente</th>
                  <th>Nombre del diseño</th>
                  <th>Contexto</th>
                  <th>URL</th>
                  <th>Creado por:</th>
                  <th>Fecha de creación</th>
                  <th>Descargar</th>
                  <th className="preview-column">Previsualización</th>
                </tr>
              </thead>
              <tbody>
                {currentDesigns.map(design => (
                  <motion.tr
                    key={design.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedDesigns.includes(design.id)}
                        onChange={event => handleCheckboxChange(event, design.id)}
                        className="checkbox"
                      />
                    </td>
                    <td>{design.customer}</td>
                    <td>
                      <a href={design.file} target="_blank" rel="noopener noreferrer" className="design-link">
                        {design.name}
                      </a>
                    </td>
                    <td>
                      <div className="context-container">
                        <ul>
                          {design.context && design.context.length > 50 ? (
                            <>
                              <li>{design.context.slice(0, 50)}...</li>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleShowModal(design)}
                                className="view-more-button"
                              >
                                Ver más
                              </motion.button>
                            </>
                          ) : (
                            <li>{design.context || 'Sin contexto'}</li>
                          )}
                        </ul>
                      </div>
                    </td>
                    <td className="url-column">
                      <a
                        href={design.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-full-url={design.url}
                      >
                        {design.url}
                      </a>
                    </td>
                    <td>{design.created_by}</td>
                    <td>{formatDate(design.created_at)}</td>
                    <td>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadFile(design.file, design.name)}
                        className="download-button"
                      >
                        Descargar
                      </motion.button>
                    </td>
                    <td className="preview-column">
                      {design.image ? (
                        <div className="design-preview">
                          <img src={design.image} alt="Preview" className="preview-image" />
                        </div>
                      ) : (
                        <div className="design-preview">Sin imagen</div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Pagination
            currentPage={currentDesignsPage}
            totalPages={totalDesignPages}
            onPageChange={setCurrentDesignsPage}
          />
          {selectedDesign && (
            <Modal
              show={showModal}
              onHide={handleCloseModal}
              centered
              className="custom-modal"
              backdropClassName="custom-modal-backdrop"
              style={{ zIndex: 9999 }}
            >
              <div className="modal-content" ref={modalRef}>
                {isFullScreenImage ? (
                  <>
                    <div className="fullscreen-image-container">
                      <button className="close-button" onClick={handleCloseFullScreen}>
                        ×
                      </button>
                      <div className="zoom-slider-container">
                        <label htmlFor="zoomSlider">Zoom: </label>
                        <input
                          type="range"
                          id="zoomSlider"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={zoomLevel}
                          onChange={handleZoomChange}
                          className="zoom-slider"
                        />
                      </div>
                      <img
                        src={selectedDesign.image}
                        alt="Full Screen Design"
                        className="fullscreen-image"
                        style={{ transform: `scale(${zoomLevel})` }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Modal.Header className="modal-header">
                      <Modal.Title>Detalles del Diseño</Modal.Title>
                      <button className="close-button" onClick={handleCloseModal}>
                        ×
                      </button>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                      <table className="modal-table">
                        <tbody>
                          <tr>
                            <td className="label">Nombre del diseño</td>
                            <td className="value">{selectedDesign.name}</td>
                          </tr>
                          <tr>
                            <td className="label">Nombre del cliente</td>
                            <td className="value">{selectedDesign.customer || 'Sin cliente'}</td>
                          </tr>
                          <tr>
                            <td className="label">Contexto</td>
                            <td className="value">{selectedDesign.context || 'Sin contexto'}</td>
                          </tr>
                          <tr>
                            <td className="label">Creado por</td>
                            <td className="value">{selectedDesign.created_by}</td>
                          </tr>
                          <tr>
                            <td className="label">Fecha de creación</td>
                            <td className="value">{formatDate(selectedDesign.created_at)}</td>
                          </tr>
                          <tr>
                            <td className="label">URL</td>
                            <td className="value">
                              {selectedDesign.url ? (
                                <a href={selectedDesign.url} target="_blank" rel="noopener noreferrer">
                                  {selectedDesign.url}
                                </a>
                              ) : (
                                'Sin URL'
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td className="label">Imagen</td>
                            <td className="value">
                              {selectedDesign.image ? (
                                <img
                                  src={selectedDesign.image}
                                  alt="Design"
                                  className="modal-preview-image"
                                  onClick={handleImageClick}
                                  style={{ cursor: 'pointer' }}
                                />
                              ) : (
                                'Sin imagen'
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Modal.Body>
                    <Modal.Footer className="modal-footer">
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                      </Button>
                    </Modal.Footer>
                  </>
                )}
              </div>
            </Modal>
          )}
        </>
      ) : (
        <p className="no-designs">No hay diseños disponibles.</p>
      )}
    </>
  );
};

export default DesignTable;