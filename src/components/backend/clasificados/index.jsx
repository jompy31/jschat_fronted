import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import NewsTable from './components/NewsTable';
import NewsModal from './components/NewsModal';
import SearchBar from './components/SearchBar';
import useNewsManagement from './utils/useNewsManagement';
import Category from '../../json/category.json';

const FilesNews = () => {
  const token = useSelector((state) => state.authentication.token);
  const {
    newsPosts,
    totalNewsPosts,
    selectedNews,
    searchTerm,
    showModal,
    editMode,
    editNewsId,
    formData,
    setSearchTerm,
    toggleModal,
    handleCreateNews,
    handleEditNews,
    handleDeleteSelected,
    toggleSelectNews,
    fetchNewsPosts,
    setFormData,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    categoryFilter,
    setCategoryFilter,
    subcategoryFilter,
    setSubcategoryFilter,
    subsubcategoryFilter,
    setSubsubcategoryFilter,
  } = useNewsManagement(token);

  useEffect(() => {
    fetchNewsPosts();
  }, [fetchNewsPosts, currentPage, searchTerm, categoryFilter, subcategoryFilter, subsubcategoryFilter]);

  return (
    <Container className="mt-20 py-6 max-w-7xl mx-auto" style={{ marginTop: "8%" }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Clasificados</h1>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-200"
          onClick={() => toggleModal(false, null)}
        >
          <FaPlus size={16} />
          Crear Clasificado
        </Button>
      </div>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={Category.categorias}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        subcategoryFilter={subcategoryFilter}
        setSubcategoryFilter={setSubcategoryFilter}
        subsubcategoryFilter={subsubcategoryFilter}
        setSubsubcategoryFilter={setSubsubcategoryFilter}
      />
      <NewsModal
        show={showModal}
        onHide={() => toggleModal(false, null)}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        categories={Category.categorias}
        handleSubmit={editMode ? handleEditNews : handleCreateNews}
      />
      <NewsTable
        newsPosts={newsPosts}
        totalNewsPosts={totalNewsPosts}
        selectedNews={selectedNews}
        toggleSelectNews={toggleSelectNews}
        toggleModal={toggleModal}
        handleDeleteSelected={handleDeleteSelected}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />
    </Container>
  );
};

export default FilesNews;