import React from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion } from 'framer-motion';

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  creatorSearch,
  setCreatorSearch,
  customerSearch,
  setCustomerSearch,
  contextSearch,
  setContextSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filesPerPage,
  setFilesPerPage,
  selectAll,
  setSelectAll,
  setCurrentPage,
  setCurrentDesignsPage,
  isDesignSearch = false,
}) => {
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    if (setCurrentDesignsPage) setCurrentDesignsPage(1);
  };

  const handleCreatorSearch = (e) => {
    setCreatorSearch(e.target.value);
    setCurrentDesignsPage(1);
  };

  const handleCustomerSearch = (e) => {
    setCustomerSearch(e.target.value);
    setCurrentDesignsPage(1);
  };

  const handleContextSearch = (e) => {
    setContextSearch(e.target.value);
    setCurrentDesignsPage(1);
  };

  const handleFilesPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setFilesPerPage(value);
    setCurrentPage(1);
    if (setCurrentDesignsPage) setCurrentDesignsPage(1);
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
  };

  return (
    <div className="space-y-4">
      <div className="search-grid">
        {!isDesignSearch ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Form.Group>
              <Form.Label className="search-label">Buscar archivo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre del archivo"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </Form.Group>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <Form.Group>
                <Form.Label className="search-label">Nombre del diseño</Form.Label>
                <Form.Control type="text" placeholder="Buscar diseño" value={searchTerm} onChange={handleSearch} className="search-input" />
              </Form.Group>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3 }}>
              <Form.Group>
                <Form.Label className="search-label">Creador</Form.Label>
                <Form.Control type="text" placeholder="Creador" value={creatorSearch} onChange={handleCreatorSearch} className="search-input" />
              </Form.Group>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
              <Form.Group>
                <Form.Label className="search-label">Cliente</Form.Label>
                <Form.Control type="text" placeholder="Cliente" value={customerSearch} onChange={handleCustomerSearch} className="search-input" />
              </Form.Group>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
              <Form.Group>
                <Form.Label className="search-label">Contexto</Form.Label>
                <Form.Control type="text" placeholder="Contexto" value={contextSearch} onChange={handleContextSearch} className="search-input" />
              </Form.Group>
            </motion.div>
          </>
        )}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.3 }}>
          <Form.Group>
            <Form.Label className="search-label">Desde</Form.Label>
            <DatePicker selected={startDate} onChange={(d) => { setStartDate(d); setCurrentPage(1); if (setCurrentDesignsPage) setCurrentDesignsPage(1); }} dateFormat="yyyy-MM-dd" className="search-datepicker w-full" />
          </Form.Group>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.3 }}>
          <Form.Group>
            <Form.Label className="search-label">Hasta</Form.Label>
            <DatePicker selected={endDate} onChange={(d) => { setEndDate(d); setCurrentPage(1); if (setCurrentDesignsPage) setCurrentDesignsPage(1); }} dateFormat="yyyy-MM-dd" className="search-datepicker w-full" />
          </Form.Group>
        </motion.div>
      </div>
      <div className="search-actions">
        <Form.Group>
          <Form.Label className="search-label">{isDesignSearch ? 'Diseños por página:' : 'Archivos por página:'}</Form.Label>
          <Form.Control type="number" min="1" value={filesPerPage} onChange={handleFilesPerPageChange} className="search-number w-20" />
        </Form.Group>
        {!isDesignSearch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.3 }} className="flex items-center">
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label className="ml-2 text-sm">Seleccionar todo</label>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;