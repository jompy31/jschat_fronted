import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Files.css';

const Files = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleButtonHover = (buttonIndex) => {
    setHoveredButton(buttonIndex);
  };

  const handleButtonLeave = () => {
    setHoveredButton(null);
  };

  const renderButton = (index, label, to) => {
    const isHovered = hoveredButton === index;
    return (
      <Link
        key={index}
        to={to}
        className="block w-full"
        onMouseEnter={() => handleButtonHover(index)}
        onMouseLeave={handleButtonLeave}
      >
        <button
          className={`w-full py-3 px-4 text-lg font-medium rounded-lg border-2 border-gray-300 shadow-md transition-all duration-300 ${
            isHovered
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-blue-600 hover:bg-blue-50'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          {label}
        </button>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Páginas a Modificar
        </h1>
        <div className="space-y-4">
          {renderButton(0, 'Servicios', '/files_products')}
          {renderButton(1, 'Directorio de Comercios', '/directory')}
          {renderButton(2, 'Clasificados', '/files_news')}
          {/* {renderButton(3, 'Ecommerce', '/files_ecommerce')} */}
        </div>
      </div>
    </div>
  );
};

export default Files;