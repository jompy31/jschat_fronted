import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";
import Distributors from "./directorio_comercial/directorio_comercial";
import Megabuscador from "./abcupon/Megabuscador";
import Botonera from "./abcupon/Botonera";
import Faq from "./abcupon/Faq";
import visibilidadImage from "../../../assets/visibilidad.png";
import Carousel from "./abcupon/Carousel";

function Home({ products, clasificados, subproducts, services }) {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSubsubcategory, setSelectedSubsubcategory] = useState(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedSubsubcategory(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const lastModalShown = localStorage.getItem("lastModalShown");
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (!lastModalShown || now - parseInt(lastModalShown) > oneDayInMs) {
      setIsModalOpen(true);
      localStorage.setItem("lastModalShown", now.toString());
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className.includes("modal-overlay")) {
      closeModal();
    }
  };

  const ScrollToTopButton = () => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return (
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <span style={{ fontSize: "40px", lineHeight: "0" }}>↑</span>
      </button>
    );
  };

  const toggleFaqModal = () => {
    setIsFaqOpen(!isFaqOpen);
  };

  useEffect(() => {
    console.log("Categoría seleccionada:", selectedCategory);
    console.log("Subcategoría seleccionada:", selectedSubcategory);
    console.log("Subsubcategoría seleccionada:", selectedSubsubcategory);
  }, [selectedCategory, selectedSubcategory, selectedSubsubcategory]);

  return (
    <div>
      <Helmet>
        <title>Directorio Comercial de ABCupon</title>
        <meta
          name="description"
          content="Somos una plataforma virtual que reúne a numerosos proveedores cuidadosamente seleccionados, ofreciendo servicios con altos estándares de excelencia. En ABcupon.com, nos esforzamos por hacer que su experiencia de compra sea cómoda, segura y satisfactoria."
        />
      </Helmet>

      {isModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={handleOutsideClick}
        >
          <div
            style={{
              position: "relative",
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "20px",
              maxWidth: isMobile ? "90%" : "500px",
              width: "100%",
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "1.5em",
                cursor: "pointer",
                zIndex: 10000,
              }}
            >
              X
            </button>
            <img
              src={visibilidadImage}
              alt="Visibilidad Promotion"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      )}

      <div style={{ marginTop: isMini ? "15%" : isMobile ? "15%" : "7%" }}>
        <Megabuscador
          products={products}
          clasificados={clasificados}
          subproducts={subproducts}
          services={services}
        />
      </div>
      <div>
        <Carousel />
      </div>
      <div
        onClick={toggleFaqModal}
        style={{
          borderTop: "2px solid red",
          borderBottom: "2px solid red",
          padding: "10px",
          textAlign: isMobile ? "left" : "center",
          cursor: "pointer",
          fontWeight: "bold",
          color: "black",
          fontSize: isMini ? "10px" : isMobile ? "12px" : "18px",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "green";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white";
          e.target.style.color = "black";
        }}
      >
        PRESIONA AQUÍ PARA VER PREGUNTAS FRECUENTES
      </div>
      {isFaqOpen && (
        <div className="faq-modal" style={{ zIndex: 999999 }}>
          <div
            className="faq-content"
            style={{ position: "relative", zIndex: 1000 }}
          >
            <Faq />
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: "2%",
          borderTop: "2px solid red",
          borderBottom: "2px solid red",
          padding: "10px",
          textAlign: isMobile ? "left" : "center",
          color: "black",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: isMini ? "10px" : isMobile ? "12px" : "18px",
          marginBottom: "-20vh",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "green";
          e.target.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white";
          e.target.style.color = "black";
        }}
      >
        ENCUENTRELO DESDE LA BOTONERA
      </div>
      <div>
        <Botonera
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedSubsubcategory={selectedSubsubcategory}
          setSelectedSubsubcategory={setSelectedSubsubcategory}
        />
      </div>
      <div style={{ marginTop: "8%" }}>
        <h1
          className="text-4xl sm:text-6xl lg:text-6xl xl:text-6xl text-black font-bold tracking-tight pb-0 text-center"
          style={{ textShadow: "0 0 2px white", color: "black" }}
        ></h1>
        <Distributors
          products={products}
          subproducts={subproducts}
          services={services}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubcategory={selectedSubcategory}
          setSelectedSubcategory={setSelectedSubcategory}
          selectedSubsubcategory={selectedSubsubcategory}
          setSelectedSubsubcategory={setSelectedSubsubcategory}
          clearFilters={clearFilters}
        />
      </div>

      <ScrollToTopButton />
    </div>
  );
}

export default Home;