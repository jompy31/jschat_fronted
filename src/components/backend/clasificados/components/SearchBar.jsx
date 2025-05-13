import React from 'react';
import { Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import PropTypes from 'prop-types';

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  categories,
  categoryFilter,
  setCategoryFilter,
  subcategoryFilter,
  setSubcategoryFilter,
  subsubcategoryFilter,
  setSubsubcategoryFilter,
}) => {
  const generateOptions = (items) => {
    return items.map((item) => (
      <option key={item.nombre || item} value={item.nombre || item}>
        {item.nombre || item}
      </option>
    ));
  };

  return (
    <div className="flex flex-col gap-4 mb-6 w-full max-w-4xl">
      <div className="flex items-center w-full">
        <input
          type="text"
          placeholder="Buscar por título o categoría"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          aria-label="Buscar clasificados"
        />
        <div className="bg-blue-600 p-3 rounded-r-lg">
          <FaSearch size={20} className="text-white" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Form.Group className="flex-1" controlId="categoryFilter">
          <Form.Label className="font-medium text-gray-700">Categoría</Form.Label>
          <Form.Control
            as="select"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubcategoryFilter('');
              setSubsubcategoryFilter('');
            }}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las Categorías</option>
            {generateOptions(categories)}
          </Form.Control>
        </Form.Group>
        {categoryFilter && (
          <Form.Group className="flex-1" controlId="subcategoryFilter">
            <Form.Label className="font-medium text-gray-700">Subcategoría</Form.Label>
            <Form.Control
              as="select"
              value={subcategoryFilter}
              onChange={(e) => {
                setSubcategoryFilter(e.target.value);
                setSubsubcategoryFilter('');
              }}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las Subcategorías</option>
              {categories
                .find((cat) => cat.nombre === categoryFilter)
                ?.subcategorias.map((subcat) => (
                  <option key={subcat.nombre} value={subcat.nombre}>
                    {subcat.nombre}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        )}
        {subcategoryFilter && (
          <Form.Group className="flex-1" controlId="subsubcategoryFilter">
            <Form.Label className="font-medium text-gray-700">Subsubcategoría</Form.Label>
            <Form.Control
              as="select"
              value={subsubcategoryFilter}
              onChange={(e) => setSubsubcategoryFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las Subsubcategorías</option>
              {categories
                .find((cat) => cat.nombre === categoryFilter)
                ?.subcategorias.find((subcat) => subcat.nombre === subcategoryFilter)
                ?.subsubcategorias.map((subsubcat) => (
                  <option key={subsubcat} value={subsubcat}>
                    {subsubcat}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
        )}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  categoryFilter: PropTypes.string.isRequired,
  setCategoryFilter: PropTypes.func.isRequired,
  subcategoryFilter: PropTypes.string.isRequired,
  setSubcategoryFilter: PropTypes.func.isRequired,
  subsubcategoryFilter: PropTypes.string.isRequired,
  setSubsubcategoryFilter: PropTypes.func.isRequired,
};

export default SearchBar;