import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Avisos.css";
import { useMediaQuery } from "react-responsive";
import Header from "./components/Header";
import AdvertiseSection from "./components/AdvertiseSection";
import ClassifiedList from "./components/ClassifiedList";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ClassifiedModal from "./components/ClassifiedModal";
import { closeModal } from "./utils/handleClicks";

const ClasificadosAdditional = ({
  pageNumber,
  startIndex,
  endIndex,
  clasificadosToUse,
  categoriaImages,
  isMobile,
  isMini,
  handleClasificadoClick,
  openWebPage,
  setSelectedClasificado,
  setModalVisible,
}) => {
  const { id } = useParams();
  const [selectedClasificado, setSelectedClasificadoLocal] = useState(null);
  const [modalVisible, setModalVisibleLocal] = useState(false);

  useEffect(() => {
    if (id) {
      const selected = clasificadosToUse.find((post) => post.id.toString() === id);
      if (selected) {
        setSelectedClasificadoLocal(selected);
        setModalVisibleLocal(true);
        setSelectedClasificado(selected);
        setModalVisible(true);
      }
    }
  }, [id, clasificadosToUse, setSelectedClasificado, setModalVisible]);

  const categoriasUsadas = {};
  const pageClasificados = clasificadosToUse.slice(startIndex, endIndex); // Clasificados para esta página
  console.log(`Clasificados on Page ${pageNumber}:`, pageClasificados);

  // Definir 5 columnas fijas, cada una con hasta 5 clasificados
  const clasificadosPerColumn = 5;

  return (
    <div style={{ marginTop: "20px", zoom: isMini ? "30%" : "100%" }}>
      <ScrollToTopButton isMobile={isMobile} setFilteredClasificados={() => {}} />
      <div
        style={{
          backgroundColor: "#f6f0d9",
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(0, 0, 0, 0.05) 0px,
              rgba(0, 0, 0, 0.05) 2px,
              transparent 2px,
              transparent 4px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(0, 0, 0, 0.05) 0px,
              rgba(0, 0, 0, 0.05) 2px,
              transparent 2px,
              transparent 4px
            )
          `,
          border: "1px solid #dcdcdc",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          fontFamily: `'Times New Roman', Times, serif`,
          color: "#333",
        }}
      >
        <Header isMobile={isMobile} />
        <AdvertiseSection isMobile={isMobile} />
        <div className="clasificados-container">
          {[...Array(5)].map((_, columnIndex) => {
            // Calcular los índices para los clasificados de esta columna
            const columnStart = columnIndex * clasificadosPerColumn;
            const columnEnd = columnStart + clasificadosPerColumn;
            const columnClasificados = pageClasificados.slice(columnStart, columnEnd);

            return (
              <div key={columnIndex} className="columna">
                {columnClasificados.length > 0 ? (
                  <ClassifiedList
                    clasificadosToUse={columnClasificados} // Pasar solo los clasificados de esta columna
                    startIndex={0} // No se necesita corte adicional
                    endIndex={columnClasificados.length}
                    categoriaImages={categoriaImages}
                    categoriasUsadas={categoriasUsadas}
                    handleClasificadoClick={(clasificado) =>
                      handleClasificadoClick(clasificado, setSelectedClasificado, setModalVisible)
                    }
                    openWebPage={openWebPage}
                    isMobile={isMobile}
                  />
                ) : (
                  <div style={{ minHeight: "100px" }}></div> // Espacio vacío para columnas sin clasificados
                )}
              </div>
            );
          })}
        </div>
        <hr style={{ width: "100%", borderTop: "1px solid #000", margin: "10px 0" }} />
        <Footer />
        <p style={{ textAlign: "center" }}>Página {pageNumber}</p>
        {modalVisible && selectedClasificado && (
          <ClassifiedModal
            clasificado={selectedClasificado}
            onCloseModal={() => closeModal(setModalVisible)}
          />
        )}
      </div>
    </div>
  );
};

export default ClasificadosAdditional;