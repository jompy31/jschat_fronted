import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

const ClasificadoDetail = ({ clasificado, onCloseModal }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Estado para manejar el zoom
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const img = e.currentTarget;
    const { left, top, width, height } = img.getBoundingClientRect();

    const x = e.clientX - left;
    const y = e.clientY - top;

    const zoomFactor = isMobile ? 3 : 2;
    const zoomWidth = width * zoomFactor;
    const zoomHeight = height * zoomFactor;

    setZoomStyle({
      backgroundImage: `url(${clasificado.content})`,
      backgroundSize: `${zoomWidth}px ${zoomHeight}px`,
      backgroundPosition: `${-x * zoomFactor}px ${-y * zoomFactor}px`,
      backgroundRepeat: "no-repeat",
      display: "block",
      position: "absolute",
      width: isMobile ? "200px" : "300px",
      height: isMobile ? "200px" : "300px",
      border: "2px solid #ef4444",
      borderRadius: "8px",
      zIndex: 50,
      pointerEvents: "none",
      right: isMobile ? "10px" : "-320px",
      top: "10px",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onCloseModal}>
      <div
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 md:mx-0 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onCloseModal}
        >
          &times;
        </button>

        <div className="p-6">
          {clasificado.content && clasificado.content_type === "clasificado_imagen" ? (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Section */}
              <div className="flex-1 relative">
                <img
                  src={clasificado.content}
                  alt={clasificado.title}
                  className="w-full h-auto rounded-lg object-contain max-h-[60vh]"
                  onMouseEnter={() => !isMobile && setIsZoomed(true)}
                  onMouseLeave={() => {
                    setIsZoomed(false);
                    setZoomStyle({});
                  }}
                  onMouseMove={handleMouseMove}
                />
                {isZoomed && <div style={zoomStyle} />}
              </div>

              {/* Details Section */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-red-500 mb-2">ID - {clasificado.id}</h2>
                <h2 className="text-2xl font-bold text-red-500 mb-4">{clasificado.title}</h2>
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Descripción:</td>
                      <td className="py-2">{clasificado.description}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Teléfono:</td>
                      <td className="py-2">{clasificado.phone_number}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Whatsapp:</td>
                      <td className="py-2">
                        <a
                          href={`https://${clasificado.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {clasificado.whatsapp}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Página Web:</td>
                      <td className="py-2">
                        {clasificado.url && (
                          <a
                            href={clasificado.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {clasificado.url}
                          </a>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  onClick={onCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <h2 className="text-3xl font-bold text-red-500 text-center mb-6">{clasificado.title}</h2>
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="font-semibold pr-4 py-2">Descripción:</td>
                    <td className="py-2">{clasificado.description}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4 py-2">Teléfono:</td>
                    <td className="py-2">{clasificado.phone_number}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4 py-2">Whatsapp:</td>
                    <td className="py-2">
                      <a
                        href={`https://${clasificado.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {clasificado.whatsapp}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-4 py-2">Página Web:</td>
                    <td className="py-2">
                      {clasificado.url && (
                        <a
                          href={clasificado.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {clasificado.url}
                        </a>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                onClick={onCloseModal}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClasificadoDetail;