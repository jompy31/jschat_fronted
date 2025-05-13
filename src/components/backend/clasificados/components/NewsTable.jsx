import React, { useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const NewsTable = ({
  newsPosts,
  selectedNews,
  toggleSelectNews,
  toggleModal,
  handleDeleteSelected,
  searchTerm,
  categoryFilter,
  subcategoryFilter,
  subsubcategoryFilter,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) => {
  const [pageInput, setPageInput] = useState('');

  const filteredNewsPosts = newsPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || post.category === categoryFilter;
    const matchesSubcategory = !subcategoryFilter || post.subcategory === subcategoryFilter;
    const matchesSubsubcategory = !subsubcategoryFilter || post.subsubcategory === subsubcategoryFilter;
    return matchesSearch && matchesCategory && matchesSubcategory && matchesSubsubcategory;
  });

  const totalPages = Math.ceil(filteredNewsPosts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPosts = filteredNewsPosts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInput('');
    }
  };

  const handlePageInput = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= totalPages)) {
      setPageInput(value);
    }
  };

  const handlePageInputSubmit = (e) => {
    if (e.key === 'Enter' && pageInput) {
      handlePageChange(parseInt(pageInput));
    }
  };

  const renderPreview = (contentType, content) => {
    if (contentType === 'clasificado_logo' || contentType === 'clasificado_imagen') {
      return (
        <img
          src={content}
          alt="Vista previa"
          className="max-w-[100px] max-h-[100px] object-cover rounded"
        />
      );
    }
    return <span className="text-gray-500">Sin vista previa</span>;
  };

  const handleDownload = async (fileUrl, title) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
    }
  };

  return (
    <div className="mt-6">
        {selectedNews.length > 0 && (
        <div className="mt-4">
          <Button
            variant="danger"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
            onClick={() => {
              if (window.confirm('¿Estás seguro de eliminar los clasificados seleccionados?')) {
                handleDeleteSelected();
              }
            }}
          >
            <FaTrash size={16} />
            Eliminar Seleccionados ({selectedNews.length})
          </Button>
        </div>
      )}
      {filteredNewsPosts.length > 0 ? (
        <>
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <Table striped hover className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Seleccionar</th>
                  <th className="p-3 text-left">Título</th>
                  <th className="p-3 text-left">Categoría</th>
                  <th className="p-3 text-left">Descripción</th>
                  <th className="p-3 text-left">Descargar</th>
                  <th className="p-3 text-left">Previsualización</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPosts.map((post) => (
                  <tr key={post.id} className="border-b">
                    <td className="p-3">
                      <Form.Check
                        type="checkbox"
                        checked={selectedNews.includes(post.id)}
                        onChange={() => toggleSelectNews(post.id)}
                        aria-label={`Seleccionar ${post.title}`}
                      />
                    </td>
                    <td className="p-3">
                      <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => toggleModal(true, post.id)}
                      >
                        {post.title}
                      </span>
                    </td>
                    <td className="p-3">{post.category}</td>
                    <td className="p-3">{post.description}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDownload(post.content, post.title)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Descargar
                      </button>
                    </td>
                    <td className="p-3">{renderPreview(post.content_type, post.content)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
            <div className="mb-2 sm:mb-0">
              <span className="text-gray-600">
                Mostrando {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredNewsPosts.length)} de{' '}
                {filteredNewsPosts.length} resultados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline-primary"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Anterior
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'primary' : 'outline-primary'}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
              </div>
              <Button
                variant="outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Siguiente
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Ir a página:</span>
                <input
                  type="text"
                  value={pageInput}
                  onChange={handlePageInput}
                  onKeyPress={handlePageInputSubmit}
                  className="w-16 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={currentPage}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center mt-4">No hay publicaciones de noticias disponibles.</p>
      )}
      
    </div>
  );
};

NewsTable.propTypes = {
  newsPosts: PropTypes.array.isRequired,
  selectedNews: PropTypes.array.isRequired,
  toggleSelectNews: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  handleDeleteSelected: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  categoryFilter: PropTypes.string.isRequired,
  subcategoryFilter: PropTypes.string.isRequired,
  subsubcategoryFilter: PropTypes.string.isRequired,
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
};

export default NewsTable;