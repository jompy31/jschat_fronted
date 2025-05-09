import React from 'react';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    totalPages > 1 && (
      <div className="flex justify-center items-center space-x-4 mt-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="primary"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            Anterior
          </Button>
        </motion.div>
        <span className="text-gray-700">Página {currentPage} de {totalPages}</span>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="primary"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            Siguiente
          </Button>
        </motion.div>
      </div>
    )
  );
};

export default Pagination;