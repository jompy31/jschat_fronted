import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import moment from 'moment';
import { motion } from 'framer-motion';
import FileDataService from '../../../../services/files';
import { formatDate, downloadFile } from '../utils/fileUtils';
import './DesignTable.css';

const DesignTable = ({
  designs,
  designMeta,
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
  NotallowedFileNames = [], // Default to empty array
  showFullContext,
  setShowFullContext,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const modalRef = useRef(null);

  // Handle checkbox selection
  const handleCheckboxChange = (event, designId) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedDesigns((prev) => [...prev, designId]);
    } else {
      setSelectedDesigns((prev) => prev.filter((id) => id !== designId));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedDesigns.length === designs.length) {
      setSelectedDesigns([]);
    } else {
      setSelectedDesigns(designs.map((design) => design.id));
    }
  };

  // Handle single design deletion
  const handleDelete = (id) => {
    FileDataService.deleteDesign(id, token)
      .then(() => {
        fetchDesigns(currentDesignsPage);
        setSelectedDesigns((prev) => prev.filter((designId) => designId !== id));
      })
      .catch((error) => {
        console.error('Error al eliminar el diseño:', error);
      });
  };

  // Handle bulk download
  const handleDownloadSelected = () => {
    selectedDesigns.forEach((designId) => {
      const design = designs.find((d) => d.id === designId);
      if (design && design.image) {
        downloadFile(design.image, design.name);
      }
    });
  };

  // Handle bulk deletion
  const handleDeleteSelected = () => {
    Promise.all(selectedDesigns.map((id) => FileDataService.deleteDesign(id, token)))
      .then(() => {
        fetchDesigns(currentDesignsPage);
        setSelectedDesigns([]);
      })
      .catch((error) => {
        console.error('Error al eliminar diseños seleccionados:', error);
      });
  };

  // Modal controls
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

  // Handle click outside modal
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

  // Filter designs client-side
  const filteredDesigns = designs.filter(
    (design) =>
      design.name.toLowerCase().includes(designNameSearch.toLowerCase()) &&
      design.created_by.toLowerCase().includes(creatorSearch.toLowerCase()) &&
      (design.customer || '').toLowerCase().includes(customerSearch.toLowerCase()) &&
      (design.context || '').toLowerCase().includes(contextSearch.toLowerCase()) &&
      (!startDate || moment(design.created_at).isSameOrAfter(startDate)) &&
      (!endDate || moment(design.created_at).isSameOrBefore(endDate)) &&
      !NotallowedFileNames.includes(design.name),
  );

  // Pagination controls
  const totalPages = Math.ceil(designMeta.count / designsPerPage);
  const handlePreviousPage = () => {
    if (designMeta.previous) {
      setCurrentDesignsPage(currentDesignsPage - 1);
    }
  };
  const handleNextPage = () => {
    if (designMeta.next) {
      setCurrentDesignsPage(currentDesignsPage + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex justify-between items-center">
        <div className="button-container">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleSelectAll}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              {selectedDesigns.length === designs.length && designs.length > 0
                ? 'Deseleccionar Todo'
                : 'Seleccionar Todo'}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleDownloadSelected}
              disabled={selectedDesigns.length === 0}
              className="download-button bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              Descargar Seleccionados ({selectedDesigns.length})
            </Button>
          </motion.div>
          {currentUser?.staff_status === 'administrator' && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleDeleteSelected}
                disabled={selectedDesigns.length === 0}
                className="delete-button bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Eliminar Seleccionados ({selectedDesigns.length})
              </Button>
            </motion.div>
          )}
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowFullContext(!showFullContext)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            {showFullContext ? 'Ocultar Contexto Completo' : 'Mostrar Contexto Completo'}
          </Button>
        </motion.div>
      </div>

      {/* Designs Table */}
      <div className="table-container overflow-x-auto">
        <Table striped bordered hover className="design-table">
          <thead>
            <tr className="bg-gray-100">
              <th>Seleccionar</th>
              <th>Cliente</th>
              <th>Nombre</th>
              <th>Contexto</th>
              <th>URL</th>
              <th>Creador</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
              <th>Previsualización</th>
            </tr>
          </thead>
          <tbody>
            {filteredDesigns.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No hay diseños disponibles.
                </td>
              </tr>
            ) : (
              filteredDesigns.map((design) => (
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
                      onChange={(event) => handleCheckboxChange(event, design.id)}
                      className="checkbox"
                    />
                  </td>
                  <td>{design.customer || 'Sin cliente'}</td>
                  <td>
                    <a
                      href={design.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="design-link text-blue-500 hover:underline"
                    >
                      {design.name}
                    </a>
                  </td>
                  <td>
                    <div className="context-container">
                      {showFullContext ? (
                        design.context || 'Sin contexto'
                      ) : design.context && design.context.length > 50 ? (
                        <>
                          {design.context.slice(0, 50)}...
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleShowModal(design)}
                            className="view-more-button text-blue-500 hover:underline ml-2"
                          >
                            Ver más
                          </motion.button>
                        </>
                      ) : (
                        design.context || 'Sin contexto'
                      )}
                    </div>
                  </td>
                  <td className="url-column">
                    {design.url ? (
                      <a
                        href={design.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        data-full-url={design.url}
                      >
                        {design.url.length > 30 ? `${design.url.slice(0, 30)}...` : design.url}
                      </a>
                    ) : (
                      'Sin URL'
                                       )}
                  </td>
                  <td>{design.created_by}</td>
                  <td>{formatDate(design.created_at)}</td>
                  <td>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadFile(design.image, design.name)}
                      className="download-button bg-green-500 text-white px-2 py-1 rounded mr-2"
                      disabled={!design.image}
                    >
                      Descargar
                    </motion.button>
                    {(currentUser?.staff_status === 'administrator' ||
                      currentUser?.username === design.created_by) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(design.id)}
                        className="delete-button bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Eliminar
                      </motion.button>
                    )}
                  </td>
                  <td className="preview-column">
                    {design.image ? (
                      <div className="design-preview">
                        <img
                          src={previewDesignUrls[design.id] || design.image}
                          alt="Preview"
                          className="preview-image h-12 w-12 object-cover rounded"
                          onClick={() => handleShowModal(design)}
                          style={{ cursor: 'pointer' }}
                          onError={(e) => (e.target.src = 'https://via.placeholder.com/48')}
                        />
                      </div>
                    ) : (
                      <div className="design-preview">Sin imagen</div>
                    )}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-600">
          Mostrando {filteredDesigns.length} de {designMeta.count} diseños
        </p>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousPage}
            disabled={!designMeta.previous}
            className={`px-4 py-2 rounded-lg ${
              designMeta.previous
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Anterior
          </motion.button>
          <span className="px-4 py-2 text-gray-600">
            Página {currentDesignsPage} de {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextPage}
            disabled={!designMeta.next}
            className={`px-4 py-2 rounded-lg ${
              designMeta.next
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Siguiente
          </motion.button>
        </div>
      </div>

      {/* Modal for Design Details */}
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
            ) : (
              <>
                <Modal.Header className="modal-header">
                  <Modal.Title>Detalles del Diseño</Modal.Title>
                  <button className="close-button" onClick={handleCloseModal}>
                    ×
                  </button>
                </Modal.Header>
                <Modal.Body className="modal-body">
                  <table className="modal-table w-full">
                    <tbody>
                      <tr>
                        <td className="label font-bold pr-4">Nombre del diseño</td>
                        <td className="value">{selectedDesign.name}</td>
                      </tr>
                      <tr>
                        <td className="label font-bold pr-4">Nombre del cliente</td>
                        <td className="value">{selectedDesign.customer || 'Sin cliente'}</td>
                      </tr>
                      <tr>
                        <td className="label font-bold pr-4">Contexto</td>
                        <td className="value">{selectedDesign.context || 'Sin contexto'}</td>
                      </tr>
                      <tr>
                        <td className="label font-bold pr-4">Creado por</td>
                        <td className="value">{selectedDesign.created_by}</td>
                      </tr>
                      <tr>
                        <td className="label font-bold pr-4">Fecha de creación</td>
                        <td className="value">{formatDate(selectedDesign.created_at)}</td>
                      </tr>
                      <tr>
                        <td className="label font-bold pr-4">URL</td>
                        <td className="value">
                          {selectedDesign.url ? (
                            <a
                              href={selectedDesign.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {selectedDesign.url}
                            </a>
                          ) : (
                            'Sin URL'
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="label font-bold pr-4">Imagen</td>
                        <td className="value">
                          {selectedDesign.image ? (
                            <img
                              src={selectedDesign.image}
                              alt="Design"
                              className="modal-preview-image max-w-full h-auto"
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
    </div>
  );
};

export default DesignTable;