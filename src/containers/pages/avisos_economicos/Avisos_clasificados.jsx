// frontend_abcupon/src/containers/pages/avisos_economicos/Avisos_clasificados.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Avisos.css";
import { useMediaQuery } from "react-responsive";
import Header from "./components/Header";
import AdvertiseSection from "./components/AdvertiseSection";
import CategoryIndex from "./components/CategoryIndex";
import ClassifiedList from "./components/ClassifiedList";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import ClassifiedModal from "./components/ClassifiedModal";
import ClasificadosAdditional from "./Avisos_clasificados_additional"; // Importa el componente
import { fetchNewsPosts } from "./utils/fetchNewsPosts";
import { handleCategoriaClick, handleSubcategoriaClick, handleMostrarTodasClick, handleClasificadoClick, closeModal, openWebPage } from "./utils/handleClicks";


const ClasificadosComponent = () => {
  const email = "avisos_economicos@abcupon.com";
  const [newsPosts, setNewsPosts] = useState([]);
  const [clasificadosPorPagina] = useState(20); // 20 clasificados por bloque
  const [totalClasificados, setTotalClasificados] = useState(0);
  const [clasificados, setClasificados] = useState([]);
  const [selectedClasificado, setSelectedClasificado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [subsubcategorias, setSubsubcategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [selectedSubsubcategoria, setSelectedSubsubcategoria] = useState(null);
  const [mostrarSubcategorias, setMostrarSubcategorias] = useState(true);
  const [mostrarSubsubcategorias, setMostrarSubsubcategorias] = useState(true);
  const [clasificadosConImagen, setClasificadosConImagen] = useState([]);
  const [clasificadosSinImagen, setClasificadosSinImagen] = useState([]);
  const [clasificadosSinContenido, setClasificadosSinContenido] = useState([]);
  const [filteredClasificados, setFilteredClasificados] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const { id } = useParams();
  const [categoriaImages, setCategoriaImages] = useState({});
  const [imagenesPorCategoria, setImagenesPorCategoria] = useState({});
  const [mostrarTodasSubcategorias, setMostrarTodasSubcategorias] = useState(true);
  const [mostrarTodasSubsubcategorias, setMostrarTodasSubsubcategorias] = useState(true);
  const [sortedSubsubcategorias, setSortedSubsubcategorias] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  

  useEffect(() => {
    fetchNewsPosts(
      email,
      setNewsPosts,
      setClasificados,
      setClasificadosConImagen,
      setClasificadosSinImagen,
      setClasificadosSinContenido,
      setCategorias,
      setTotalClasificados,
      setCategoriaImages,
      setImagenesPorCategoria,
      clasificadosPorPagina
    );
  }, []);

  useEffect(() => {
    const storedCountry = localStorage.getItem("selectedCountry");
    if (storedCountry) setSelectedCountry(storedCountry);
  }, []);

  useEffect(() => {
    if (id) {
      const selected = newsPosts.find((post) => post.id.toString() === id);
      if (selected) {
        setSelectedClasificado(selected);
        setModalVisible(true);
      }
    }
  }, [id, newsPosts]);

  // Calcular el número total de bloques (páginas)
  const totalPaginas = Math.ceil(totalClasificados / clasificadosPorPagina);
  const clasificadosToUse = filteredClasificados.length > 0 ? filteredClasificados : clasificados;

  return (
    <div style={{ marginTop: isMobile ? "30%": isMini ? "40%" : "8%", zoom: isMobile ? "40%": isMini ? "30%" : "100%" }}>
      <ScrollToTopButton isMobile={isMobile} setFilteredClasificados={setFilteredClasificados} />
      <div style={{
        backgroundColor: '#f6f0d9',
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
        border: '1px solid #dcdcdc',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        fontFamily: `'Times New Roman', Times, serif`,
        color: '#333',
      }}>
        <Header isMobile={isMobile} />
        <AdvertiseSection isMobile={isMobile} />
        <div className="clasificados-container">
        {console.log("Clasificados on First Page:", clasificadosToUse.slice(0, clasificadosPorPagina))}
          {[...Array(5)].map((_, columnIndex) => (
            <div key={columnIndex} className="columna">
              {columnIndex === 0 ? (
                <CategoryIndex
                  categorias={categorias}
                  selectedCategoria={selectedCategoria}
                  handleCategoriaClick={(cat) => handleCategoriaClick(cat, newsPosts, setSelectedCategoria, setSelectedSubcategoria, setMostrarSubcategorias, setMostrarSubsubcategorias, setClasificados, clasificadosPorPagina, setSubcategorias)}
                  mostrarSubcategorias={mostrarSubcategorias}
                  subcategorias={subcategorias}
                  selectedSubcategoria={selectedSubcategoria}
                  handleSubcategoriaClick={(subcat) => handleSubcategoriaClick(subcat, newsPosts, selectedCategoria, setSelectedSubcategoria, setSelectedSubsubcategoria, setMostrarSubsubcategorias, setFilteredClasificados, setSubsubcategorias, setSortedSubsubcategorias, setMostrarTodasSubsubcategorias)}
                  sortedSubsubcategorias={sortedSubsubcategorias}
                  handleMostrarTodasClick={() => handleMostrarTodasClick(newsPosts, setClasificados, clasificadosPorPagina, setSubcategorias, setSubsubcategorias, setSelectedCategoria, setSelectedSubcategoria, setSelectedSubsubcategoria, setFilteredClasificados, setSortedSubsubcategorias, setMostrarTodasSubcategorias, setMostrarTodasSubsubcategorias)}
                  isMobile={isMobile}
                />
              ) : (
                <ClassifiedList
                  clasificadosToUse={clasificadosToUse.slice(0, clasificadosPorPagina)}
                  startIndex={(columnIndex - 1) * 5}
                  endIndex={(columnIndex - 1) * 5 + 5}
                  categoriaImages={categoriaImages}
                  categoriasUsadas={{}}
                  handleClasificadoClick={(clasificado) => handleClasificadoClick(clasificado, setSelectedClasificado, setModalVisible)}
                  openWebPage={openWebPage}
                  isMobile={isMobile}
                />
              )}
            </div>
          ))}
        </div>
        <hr style={{ width: "100%", borderTop: "1px solid #000", margin: "10px 0" }} />
        <Footer />
        <p style={{ textAlign: "center" }}>Página 1</p>
      </div>

      {/* Renderizar bloques adicionales para clasificados excedentes */}
      {Array.from({ length: totalPaginas - 1 }, (_, i) => i + 2).map((pageNumber) => (
      <ClasificadosAdditional
        key={pageNumber}
        pageNumber={pageNumber}
        startIndex={(pageNumber - 1) * clasificadosPorPagina}
        endIndex={pageNumber * clasificadosPorPagina}
        clasificadosToUse={filteredClasificados.length > 0 ? filteredClasificados : clasificados} // Use clasificados if no filtering
        categoriaImages={categoriaImages}
        isMobile={isMobile}
        isMini={isMini}
        handleClasificadoClick={handleClasificadoClick}
        openWebPage={openWebPage}
        setSelectedClasificado={setSelectedClasificado}
        setModalVisible={setModalVisible}
      />
    ))}

      {modalVisible && selectedClasificado && (
        <ClassifiedModal
          clasificado={selectedClasificado}
          onCloseModal={() => closeModal(setModalVisible)}
        />
      )}
    </div>
  );
};

export default ClasificadosComponent;