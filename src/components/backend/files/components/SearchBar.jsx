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
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
    if (setCurrentDesignsPage) setCurrentDesignsPage(1);
  };

  const handleCreatorSearch = (event) => {
    setCreatorSearch(event.target.value);
    setCurrentDesignsPage(1);
  };

  const handleCustomerSearch = (event) => {
    setCustomerSearch(event.target.value);
    setCurrentDesignsPage(1);
  };

  const handleContextSearch = (event) => {
    setContextSearch(event.target.value);
    setCurrentDesignsPage(1);
  };

  const handleFilesPerPageChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setFilesPerPage(value);
    setCurrentPage(1);
    if (setCurrentDesignsPage) setCurrentDesignsPage(1);
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!isDesignSearch ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Form.Group controlId="searchTerm">
              <Form.Control
                type="text"
                placeholder="Buscar por nombre de archivo"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
              />
            </Form.Group>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Form.Group controlId="designNameSearch">
                <Form.Control
                  type="text"
                  placeholder="Buscar por nombre del diseño"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                />
              </Form.Group>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Form.Group controlId="creatorSearch">
                <Form.Control
                  type="text"
                  placeholder="Buscar por creador del diseño"
                  value={creatorSearch}
                  onChange={handleCreatorSearch}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                />
              </Form.Group>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Form.Group controlId="customerSearch">
                <Form.Control
                  type="text"
                  placeholder="Buscar cliente..."
                  value={customerSearch}
                  onChange={handleCustomerSearch}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                />
              </Form.Group>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Form.Group controlId="contextSearch">
                <Form.Control
                  type="text"
                  placeholder="Buscar contexto..."
                  value={contextSearch}
                  onChange={handleContextSearch}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
                />
              </Form.Group>
            </motion.div>
          </>
        )}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Form.Group controlId="startDate">
            <Form.Label className="block text-sm font-medium text-gray-700">Fecha desde:</Form.Label>
            <DatePicker
              selected={startDate}
              onChange={date => {
                setStartDate(date);
                setCurrentPage(1);
                if (setCurrentDesignsPage) setCurrentDesignsPage(1);
              }}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            />
          </Form.Group>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <Form.Group controlId="endDate">
            <Form.Label className="block text-sm font-medium text-gray-700">Fecha hasta:</Form.Label>
            <DatePicker
              selected={endDate}
              onChange={date => {
                setEndDate(date);
                setCurrentPage(1);
                if (setCurrentDesignsPage) setCurrentDesignsPage(1);
              }}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            />
          </Form.Group>
        </motion.div>
      </div>
      <div className="flex items-center space-x-4">
        <Form.Group controlId={isDesignSearch ? 'designsPerPage' : 'filesPerPage'}>
          <Form.Label className="block text-sm font-medium text-gray-700">
            {isDesignSearch ? 'Diseños por página:' : 'Archivos por página:'}
          </Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={filesPerPage}
            onChange={handleFilesPerPageChange}
            className="w-16 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
          />
        </Form.Group>
        {!isDesignSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="flex items-center"
          >
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Seleccionar todo</label>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;