import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Avisos.css";
import FileDataService from "../../../../services/files";
import ClasificadoDetail from "./ClasificadoDetail";
import logo from "../../../../assets/categorias/25.webp";
import image1 from "../../../../assets/categorias/1.jpg";
import image2 from "../../../../assets/categorias/2.jpg";
import image3 from "../../../../assets/categorias/3.jpg";
import image4 from "../../../../assets/categorias/4.jpg";
import image5 from "../../../../assets/categorias/5.jpg";
import image6 from "../../../../assets/categorias/6.jpg";
import image7 from "../../../../assets/categorias/7.jpg";
import image8 from "../../../../assets/categorias/8.jpg";
import image9 from "../../../../assets/categorias/9.jpg";
import image10 from "../../../../assets/categorias/10.jpg";
import image11 from "../../../../assets/categorias/11.jpg";
import image12 from "../../../../assets/categorias/12.jpg";
import image13 from "../../../../assets/categorias/13.jpg";
import image14 from "../../../../assets/categorias/14.jpg";
import image15 from "../../../../assets/categorias/15.jpg";
import image16 from "../../../../assets/categorias/16.jpg";
import image17 from "../../../../assets/categorias/17.jpg";
import image18 from "../../../../assets/categorias/18.jpg";
import image19 from "../../../../assets/categorias/19.jpg";
import image20 from "../../../../assets/categorias/20.jpg";
import image21 from "../../../../assets/categorias/21.jpg";
import image22 from "../../../../assets/categorias/22.jpg";
import image23 from "../../../../assets/categorias/23.jpg";
import image24 from "../../../../assets/categorias/24.jpg";
import { useMediaQuery } from "react-responsive"
import {FaArrowUp,} from "react-icons/fa";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export { useInterval };

const ClasificadosComponent = ({ email, name }) => {
  const [newsPosts, setNewsPosts] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [clasificadosPorPagina, setClasificadosPorPagina] = useState();
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
  const [mostrarTodasSubcategorias, setMostrarTodasSubcategorias] =
    useState(true);
  const [mostrarTodasSubsubcategorias, setMostrarTodasSubsubcategorias] =
    useState(true);
  const [sortedSubsubcategorias, setSortedSubsubcategorias] = useState([]);
  const [clasificadosFiltrados, setClasificadosFiltrados] = useState([]);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });

  const images = [
    { src: image1, category: "1. Autos y Accesorios AB" },
    { src: image2, category: "2. Bolsa de Empleo AB" },
    { src: image3, category: "3. Casas, Lotes y Boncre" },
    { src: image4, category: "4. Clinica Salud y Estetica" },
    { src: image5, category: "5. Comunicación, Tecnología y Energía" },
    { src: image6, category: "6. Construcción, Diseño y Supervisión" },
    {
      src: image7,
      category: "7. Cupones de Descuento de Inversión e Intercambio",
    },
    { src: image8, category: "8. Centros de Educación y Universidades" },
    { src: image9, category: "9. Entretenimiento, Diversión y Restaurantes" },
    { src: image10, category: "10. Ferretería y Depósito" },
    {
      src: image11,
      category: "11. Hogar, Tienda, Electrónica y Supermercados",
    },
    {
      src: image12,
      category: "12. Planes de Inversión, Portafolio Inmobiliario",
    },
    { src: image13, category: "13. Legal y Notariado" },
    { src: image14, category: "14. Librería AB" },
    { src: image15, category: "15. Catálogo, Ofertas y Subastas" },
    { src: image16, category: "16. Noticias AB" },
    { src: image17, category: "17. Póliza y Seguros AB" },
    { src: image18, category: "18. Préstamos Privados Sobre Propiedades" },
    { src: image19, category: "19. Productos y Servicios Cooperativos" },
    { src: image20, category: "20. Combos de Publicidad y Páginas Web" },
    { src: image21, category: "21. Fundación Eslabonescr.com" },
    { src: image22, category: "22. Esencial Costa Rica: Hoteles y Turismo" },
    { src: image23, category: "23. Transporte y Mensajería" },
    { src: image24, category: "24. Directorio Comercial C.R" },
  ];

  useEffect(() => {
    fetchNewsPosts();
  }, []);

  useEffect(() => {
    const storedCountry = localStorage.getItem("selectedCountry");
    // console.log("pais del navbar", storedCountry);
    if (storedCountry) {
      setSelectedCountry(storedCountry);
    }
  }, []);

  const updateSelectedCountryFromLocalStorage = () => {
    const storedCountry = localStorage.getItem("selectedCountry");
    if (storedCountry) {
      setSelectedCountry(storedCountry);
    }
  };
  // Actualiza el estado inicial desde el localStorage
  useEffect(() => {
    updateSelectedCountryFromLocalStorage();
  }, []);

  const fetchNewsPosts = () => {
    FileDataService.getAllPost()
      .then((response) => {
        // console.log("datos servidor", response.data)
        const postsConEmail = response.data.filter(post => post.url.includes(email));
        // console.log("postsConso", postsConEmail)
        // Ordenar los posts filtrados por la categoría
        const sortedPosts = postsConEmail.sort((a, b) => {
          const numA = parseInt(a.category.split(".")[0]);
          const numB = parseInt(b.category.split(".")[0]);

          if (numA === numB) {
            // Si los números son iguales, comparar por subcategoría
            return a.category.localeCompare(b.category);
          }

          return numA - numB;
        });
        // console.log("clasificados", sortedPosts);

        // Filtrar clasificados por país
        const filteredPosts = sortedPosts;

        setNewsPosts(filteredPosts);
        setPaginaActual(1);
        setClasificados(filteredPosts.slice(0, clasificadosPorPagina));
        const clasificadosConImagen = filteredPosts.filter(
          (post) => post.content && post.content_type === "clasificado"
        );
        const clasificadosSinImagen = filteredPosts.filter(
          (post) => !post.content || post.content_type !== "clasificado"
        );
        const clasificadosSinContenido = filteredPosts.filter(
          (post) => !post.content
        );

        setClasificadosConImagen(clasificadosConImagen);
        setClasificadosSinImagen(clasificadosSinImagen);
        setClasificadosSinContenido(clasificadosSinContenido);

        // Obtener categorías únicas y ordenarlas
        const uniqueCategories = [
          ...new Set(filteredPosts.map((post) => post.category)),
        ];
        const sortedCategories = uniqueCategories.sort((a, b) => {
          const numA = parseInt(a.split(".")[0]);
          const numB = parseInt(b.split(".")[0]);
          return numA - numB;
        });
        const categoriaImagesObj = {};
        sortedCategories.forEach((categoria, index) => {
          categoriaImagesObj[categoria] = images[index].src;
        });

        // Actualizar el estado de las imágenes por categoría
        setCategoriaImages(categoriaImagesObj);
        setCategorias(sortedCategories);
        setTotalClasificados(sortedPosts.length);
        // Actualizar el estado de las imágenes por categoría
        setImagenesPorCategoria(
          sortedCategories.reduce((acc, categoria, index) => {
            acc[categoria] = images[index].src;
            return acc;
          }, {})
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (id) {
      const selected = newsPosts.find((post) => post.id.toString() === id);
      if (selected) {
        setSelectedClasificado(selected);
        setModalVisible(true);
      }
    }
  }, [id, newsPosts]);

  const handleClasificadoClick = (clasificado) => {
    setSelectedClasificado(clasificado);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const openWebPage = (url) => {
    window.open(url, "_blank");
  };

  const handleCategoriaClick = (categoria) => {
    setSelectedCategoria(categoria);
    setSelectedSubcategoria(null);
    setMostrarSubcategorias(true);
    setMostrarSubsubcategorias(true);

    const filteredClasificados = newsPosts.filter(
      (post) => post.category === categoria
    );
    setPaginaActual(1);
    setClasificados(filteredClasificados.slice(0, clasificadosPorPagina));

    // Obtener subcategorías únicas y ordenarlas
    const uniqueSubcategorias = [
      ...new Set(filteredClasificados.map((post) => post.subcategory)),
    ];
    const sortedSubcategorias = uniqueSubcategorias.sort();
    setSubcategorias(sortedSubcategorias);

    // console.log("Subcategorías:", sortedSubcategorias); // Verifica las subcategorías en la consola
  };

  const handleSubcategoriaClick = (subcategoria) => {
    setFilteredClasificados([]);
    // console.log("Subcategoría seleccionada:", subcategoria);
    setSelectedSubcategoria(subcategoria);
    setSelectedSubsubcategoria(null);
    setMostrarSubsubcategorias(true);

    const filteredClasificados = newsPosts.filter((post) => {
      return (
        post.category === selectedCategoria &&
        (subcategoria ? post.subcategory === subcategoria : true)
      );
    });
    // console.log("filteredClasificadossubcategorias:", filteredClasificados);
    setPaginaActual(1);
    setFilteredClasificados(filteredClasificados);
    // console.log("clasificados filtrados", clasificados)
    // Obtener subsubcategorías únicas y ordenarlas solo para la subcategoría seleccionada
    const uniqueSubsubcategorias = [
      ...new Set(
        filteredClasificados
          .filter((post) => post.subcategory === subcategoria)
          .map((post) => post.subsubcategory)
      ),
    ];
    const sortedSubsubcategorias = uniqueSubsubcategorias.sort();

    // Setear las subsubcategorías y seleccionar la primera (o null si no hay)
    setSubsubcategorias(sortedSubsubcategorias);
    setSelectedSubsubcategoria(sortedSubsubcategorias[0] || null);
    setMostrarTodasSubsubcategorias(true);
    setSortedSubsubcategorias(sortedSubsubcategorias);
    // console.log("Subsubcategorías:", sortedSubsubcategorias);
  };

  // console.log("subcategorias guardadas", sortedSubsubcategorias);

  const handleMostrarTodasClick = () => {
    setPaginaActual(1);
    setClasificados(newsPosts.slice(0, clasificadosPorPagina));

    // Borrar subcategorías y subsubcategorías seleccionadas
    setSubcategorias([]);
    setSubsubcategorias([]);
    setSelectedCategoria(null);
    setSelectedSubcategoria(null);
    setSelectedSubsubcategoria(null);
    setFilteredClasificados([]);
    // Resetear el estado de subsubcategorías
    setSortedSubsubcategorias([]);
    setMostrarTodasSubcategorias(false);
    setMostrarTodasSubsubcategorias(false);
  };
  const categoriasUsadas = {};
  const clasificadosToUse = filteredClasificados.length > 0 ? filteredClasificados : clasificados;
  const handleScrollToTop = () => {
    setFilteredClasificados([]);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Puedes ajustar el comportamiento del scroll
    });
  };

  return (
    <div style={{ marginTop: isMini ? "40%" : "8%", zoom: isMini ? "30%" : "100%" }}>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          width: "auto",

        }}
      >
        <div
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: isMobile ? "8px" : "10px",
            borderRadius: "50%",
            cursor: "pointer",
            width: isMobile ? "45px" : "50px",
            height: isMobile ? "45px" : "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={handleScrollToTop}
        >
          <FaArrowUp size={isMobile ? 20 : 30} />
        </div>
      </div>

      <div
        style={{
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
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            marginTop: "10%",
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
            border: "2px solid black",
            borderRadius: "15px",
            padding: "10px",
            width: "90vw",
            margin: "auto",
            minWidth: "max-content", // Esto asegura que el contenedor se expanda según el contenido
          }}
        >
          <img
            src={logo}
            alt="Logo Izquierdo"
            style={{
              maxWidth: "25%",
              maxHeight: "100%",
              objectFit: "cover",
              flexShrink: 0, // Esto asegura que la imagen no se reduzca demasiado
            }}
          />

          <div
            style={{
              textAlign: "center",
              flex: 1,
              minWidth: "max-content", // Asegura que el contenedor de texto no se recorte
            }}
          >
            <h2
              style={{
                color: "black",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "5.2vw",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "8.0vw" }}>Avisos</span>
              <span style={{ fontSize: "8.0vw", marginLeft: "1.6vw" }}>Económicos</span>
            </h2>

            {/* Contenedor para Clasificados */}
            <h2
              style={{
                color: "black",
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "5.2vw",
                margin: "0",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: "8.0vw" }}>Clasificados</span>
            </h2>
          </div>
        </div>



        <div style={{
          textAlign: "center", padding: "20px", backgroundColor: '#f6f0d9', // Gris claro
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
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: `'Times New Roman', Times, serif`,
          color: '#333',
        }}
        >
          <h1 style={{ fontSize: isMobile ? "7.2vw" : "2.5vw", color: "black", fontWeight: "bold", fontFamily: "Arial, sans-serif", lineHeight: "1.5" }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'}  >
            <box-icon type='solid' name='megaphone'></box-icon>
            ¡Anúnciate con Nosotros!
          </h1>
          <p style={{
            fontSize: "1.2vw", marginBottom: "15px", lineHeight: "1.6", color: "#555", display: "block",
            backgroundColor: "#f1f1f1",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#333",
            maxWidth: "100%",
            transition: "transform 0.2s ease",
          }}>
            Escribanos al Whatsapp: <span style={{ color: "#007bff", fontWeight: "bold" }}>☎️(506) 8788-6767</span>,
            Sinpe al <span style={{ color: "#007bff", fontWeight: "bold" }}>8974-1577</span>, Coopered R.L. Ofic. Uruca
            <span style={{ color: "#007bff", fontWeight: "bold" }}>☎️2220-2290</span>.
            Al transferir, pasa la captura del pago realizado para enviarte el formulario con los requisitos para facturación.
            Recuerda incluir en tu argumento de venta un diferenciador como propuesta de valor.
            ¡Anúnciate aquí! Cada 10 palabras por 7 días por solo <span style={{ color: "#dc3545" }}>₡10,000</span>, pautadas en redes sociales y promocionadas en Facebook.
            Imagen adicional por <span style={{ color: "#dc3545" }}>₡3,000</span>. Cada 3 sílabas cuentan como una palabra. No cuenta título, teléfono del proveedor, ubicación de zona (no es dirección), ni enlace de WhatsApp.
            Landín Page solo para proveedores y usuarios de Publicombo en el directorio telefónico comercial ABcupon.com.
          </p>
        </div>

        <div className="clasificados-container" >
          {[...Array(5)].map((_, columnIndex) => {
            let clasificadosEnColumna = 0;
            const clasificadosPorColumna =
              columnIndex === 0 ? 0 : columnIndex === 0 ? 0 : 4;
            const maxClasificadosConImagen = 2;
            const maxClasificadosSinImagen = 4;

            return (
              <div key={columnIndex} className="columna">
                {/* Mostrar botones de filtrar solo en la primera columna */}

                {columnIndex === 0 && (
                  <div className="table-container" >
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th
                            colSpan="3"
                            style={{
                              backgroundColor: "#b6b6b6",
                              padding: isMobile ? "5px" : "10px",
                              textAlign: "left",
                              fontSize: isMobile ? "1.0em" : "1.4em",

                            }}
                          >
                            <li onClick={handleMostrarTodasClick}>
                              INDICE POR CATEGORÍAS & ENLACES
                            </li>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {categorias.map((categoria, categoriaIndex) => (
                          <React.Fragment key={categoriaIndex}>
                            <tr style={{ backgroundColor: categoriaIndex % 2 === 0 ? "#f9f9f9" : "#b6b6b6" }}>
                              <td
                                colSpan="3"
                                onClick={() => handleCategoriaClick(categoria)}
                                style={{
                                  cursor: "pointer",
                                  fontWeight: "bold",
                                  textTransform: "uppercase",
                                  padding: isMobile ? "5px" : "10px",
                                  textAlign: "left",
                                  fontSize: isMobile ? "1.0em" : "1.4em",
                                }}
                                className={selectedCategoria === categoria ? "selected" : ""}
                              >
                                {categoria}
                              </td>
                            </tr>
                            {selectedCategoria === categoria &&
                              mostrarSubcategorias &&
                              subcategorias.map((subcategoria, subcategoriaIndex) => (
                                <React.Fragment key={subcategoriaIndex}>
                                  <tr>
                                    <td
                                      style={{
                                        padding: "10px 20px",
                                        backgroundColor: subcategoriaIndex % 2 === 0 ? "#f0f0f0" : "#dcdcdc",
                                      }}
                                      onClick={() => handleSubcategoriaClick(subcategoria)}
                                      className={
                                        selectedSubcategoria === subcategoria ? "selected" : ""
                                      }
                                    >
                                      {subcategoria}
                                    </td>
                                    <td colSpan="2"></td>
                                  </tr>
                                  {selectedSubcategoria === subcategoria &&
                                    sortedSubsubcategorias.map((subsubcategoria, subsubcategoriaIndex) => (
                                      <tr key={subsubcategoriaIndex}>
                                        <td></td>
                                        <td
                                          style={{
                                            padding: "10px 40px",
                                            backgroundColor: subsubcategoriaIndex % 2 === 0 ? "#e0e0e0" : "#c0c0c0",
                                          }}
                                        >
                                          {subsubcategoria}
                                        </td>
                                        <td></td>
                                      </tr>
                                    ))}
                                </React.Fragment>
                              ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                      <span style={{ color: "red", fontSize: "1.2em", fontWeight: "bold" }}>El click le lleva a ver en Landing Page Menú, precios, imágenes, horarios, forma de entrega, formas de pago en el DIRECTORIO ABcupon.com  </span>

                    </table>
                  </div>
                )}

                {columnIndex !== 0 && (
                  <div>
                    {clasificadosToUse
                      .filter((_, index) => index >= 0 && index <= 15)
                      .slice(
                        (columnIndex - 1) * clasificadosPorColumna,
                        (columnIndex - 1) * clasificadosPorColumna + clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const clasificadoConImagen = tieneImagen ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;

                          // Aplicar tamaño triple solo al primer clasificado de cada categoría
                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  margin: "auto",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear",
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0,
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left",
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0,
                                    paddingLeft: "5px",
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto",
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px"
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px"
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null;
                      })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <hr
          style={{
            width: "100%",
            borderTop: "1px solid #000",
            margin: "10px 0",
          }}
        />
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}>
          <span style={{
            display: "block",
            backgroundColor: "#f1f1f1",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#333",
            maxWidth: "100%",
            transition: "transform 0.2s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
            <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
            San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
            WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
            Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
          </span>
        </div>


        <p style={{ textAlign: "center" }}>Página 1</p>
        {clasificadosToUse.filter((_, index) => index >= 16 && index < 31).length > 0 && (
          <div>
            <div className="clasificados-container">
              {[...Array(5)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna">

                    {clasificadosToUse
                      .filter((_, index) => index >= 16 && index < 31)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;


                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear",
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0,
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left",
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0,
                                    paddingLeft: "5px",
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto",
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px"
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px"
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null;
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                color: "#333",
                lineHeight: "1.5",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 2</p>
          </div>
        )}
        {clasificadosToUse.filter((_, index) => index >= 31 && index < 48).length > 0 && (
          <div>
            <div className="clasificados-container">
              {[...Array(5)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna">


                    {clasificadosToUse
                      .filter((_, index) => index >= 31 && index < 48)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;


                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear",
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0,
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left",
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0,
                                    paddingLeft: "5px",
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto",
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px"
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px"
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 3</p>
          </div>
        )}
        {clasificadosToUse.filter((_, index) => index >= 46 && index < 64).length > 0 && (
          <div>
            <div className="clasificados-container1">
              {[...Array(4)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna1">
                    {/* Mostrar botones de filtrar solo en la primera columna */}

                    {clasificadosToUse
                      .filter((_, index) => index >= 46 && index < 64)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;

                          // Aplicar tamaño triple solo al primer clasificado de cada categoría
                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear",
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0,
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left",
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0,
                                    paddingLeft: "5px",
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto",
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px"
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px"
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null;
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 4</p>
          </div>
        )}
        {clasificadosToUse.filter((_, index) => index >= 62 && index < 80).length > 0 && (
          <div>
            <div className="clasificados-container1">
              {[...Array(4)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna1">
                    {/* Mostrar botones de filtrar solo en la primera columna */}

                    {clasificadosToUse
                      .filter((_, index) => index >= 62 && index < 80)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;

                          // Aplicar tamaño triple solo al primer clasificado de cada categoría
                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear",
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0,
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left",
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0,
                                    paddingLeft: "5px",
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto",
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px"
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px"
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null; // No renderizar más clasificados en esta columna
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 5</p>
          </div>
        )}
        {clasificadosToUse.filter((_, index) => index >= 78 && index < 96).length > 0 && (
          <div>
            <div className="clasificados-container1">
              {[...Array(4)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna1">
                    {/* Mostrar botones de filtrar solo en la primera columna */}

                    {clasificadosToUse
                      .filter((_, index) => index >= 78 && index < 96)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;

                          // Aplicar tamaño triple solo al primer clasificado de cada categoría
                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear", // Duración de 1 segundo
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0, // Elimina márgenes
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left", // Alinea el texto a la izquierda
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0, // Elimina márgenes
                                    paddingLeft: "5px", // Espacio entre el título y el texto
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto", // Permite dividir palabras con guion
                                  wordBreak: "break-word", // Maneja palabras largas
                                  overflowWrap: "break-word", // Compatibilidad adicional
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null; // No renderizar más clasificados en esta columna
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 6</p>
          </div>
        )}
        {clasificadosToUse.filter((_, index) => index >= 94 && index < 112).length > 0 && (
          <div>
            <div className="clasificados-container1">
              {[...Array(4)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna1">
                    {/* Mostrar botones de filtrar solo en la primera columna */}

                    {clasificadosToUse
                      .filter((_, index) => index >= 94 && index < 112)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;

                          // Aplicar tamaño triple solo al primer clasificado de cada categoría
                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear", // Duración de 1 segundo
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0, // Elimina márgenes
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left", // Alinea el texto a la izquierda
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0, // Elimina márgenes
                                    paddingLeft: "5px", // Espacio entre el título y el texto
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto", // Permite dividir palabras con guion
                                  wordBreak: "break-word", // Maneja palabras largas
                                  overflowWrap: "break-word", // Compatibilidad adicional
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null; // No renderizar más clasificados en esta columna
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 7</p>
          </div>
        )}
        {clasificadosToUse.filter((_, index) => index >= 110 && index < 128).length > 0 && (
          <div>
            <div className="clasificados-container1">
              {[...Array(4)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna1">
                    {/* Mostrar botones de filtrar solo en la primera columna */}

                    {clasificadosToUse
                      .filter((_, index) => index >= 110 && index < 128)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;

                          // Aplicar tamaño triple solo al primer clasificado de cada categoría
                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear", // Duración de 1 segundo
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0, // Elimina márgenes
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left", // Alinea el texto a la izquierda
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0, // Elimina márgenes
                                    paddingLeft: "5px", // Espacio entre el título y el texto
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto", // Permite dividir palabras con guion
                                  wordBreak: "break-word", // Maneja palabras largas
                                  overflowWrap: "break-word", // Compatibilidad adicional
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null; // No renderizar más clasificados en esta columna
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 8</p>
          </div>
        )}
        {clasificadosToUse.filter((_, index) => index >= 126 && index < 144).length > 0 && (
          <div>
            <div className="clasificados-container1">
              {[...Array(4)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna1">
                    {/* Mostrar botones de filtrar solo en la primera columna */}

                    {clasificadosToUse
                      .filter((_, index) => index >= 126 && index < 144)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;

                          // Aplicar tamaño triple solo al primer clasificado de cada categoría
                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear", // Duración de 1 segundo
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0, // Elimina márgenes
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left", // Alinea el texto a la izquierda
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0, // Elimina márgenes
                                    paddingLeft: "5px", // Espacio entre el título y el texto
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto", // Permite dividir palabras con guion
                                  wordBreak: "break-word", // Maneja palabras largas
                                  overflowWrap: "break-word", // Compatibilidad adicional
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null; // No renderizar más clasificados en esta columna
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 9</p>
          </div>
        )}
        {clasificadosToUse.filter((_, index) => index >= 142 && index < 160).length > 0 && (
          <div>
            <div className="clasificados-container1">
              {[...Array(4)].map((_, columnIndex) => {
                let clasificadosEnColumna = 0;
                const clasificadosPorColumna =
                  columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
                const maxClasificadosConImagen = 2;
                const maxClasificadosSinImagen = 3;

                return (
                  <div key={columnIndex} className="columna1">
                    {/* Mostrar botones de filtrar solo en la primera columna */}

                    {clasificadosToUse
                      .filter((_, index) => index >= 142 && index < 160)
                      .slice(
                        columnIndex * clasificadosPorColumna,
                        columnIndex * clasificadosPorColumna +
                        clasificadosPorColumna
                      )
                      .map((clasificado, index) => {
                        const tieneImagen =
                          clasificado.content &&
                          clasificado.content_type === "clasificado_imagen";
                        const imagenCategoria = images.find(
                          (img) => img.category === clasificado.category
                        )?.src;
                        const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                        const isSinContenido = !clasificado.content;

                        if (
                          clasificadosEnColumna <
                          maxClasificadosConImagen + maxClasificadosSinImagen &&
                          (clasificadoConImagen === 0 ||
                            clasificadosEnColumna < maxClasificadosConImagen)
                        ) {
                          clasificadosEnColumna += clasificadoConImagen || 1;

                          const imagenCategoria = images.find(
                            (img) => img.category === clasificado.category
                          )?.src;

                          // Aplicar tamaño triple solo al primer clasificado de cada categoría
                          const escala =
                            categoriasUsadas[clasificado.category] === undefined
                              ? 2
                              : 1;
                          categoriasUsadas[clasificado.category] = 1;

                          return (
                            <div
                              key={index}
                              className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                                }`}
                              onClick={() => handleClasificadoClick(clasificado)}
                            >
                              {imagenCategoria && escala !== 1 && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    src={imagenCategoria}
                                    alt={clasificado.category}
                                    style={{
                                      width: isMobile ? "80px" : "100px",
                                      height: isMobile ? "25px" : "auto",
                                      marginTop: index === 0 ? "30px" : "20px",
                                      marginBottom: index === 0 ? "30px" : "30px",
                                      transform: `scale(${escala})`,
                                    }}

                                  />
                                </div>
                              )}
                              {clasificado.content && (
                                <img
                                  src={clasificado.content}
                                  alt={clasificado.title}
                                  style={{
                                    maxWidth: "auto",
                                    height: "15vh",
                                    display: "block",
                                    margin: "auto",
                                    marginBottom: index === 0 ? "30px" : "30px",
                                  }}
                                />
                              )}
                              <p
                                className="categoria-identificativo11"
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  color: "white",
                                  backgroundColor: "#767676",
                                  borderRadius: "10px",
                                  border: "1px solid black",
                                  paddingTop: "2px",
                                  paddingLeft: "6px",
                                  paddingRight: "6px",
                                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                                  transition: "all 0.3s ease",
                                  animation: "vibrar 1s linear", // Duración de 1 segundo
                                  marginBottom: "4%",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.animation = "vibrar 1s linear";
                                  setTimeout(() => {
                                    e.target.style.animation = "none";
                                  }, 1000);
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.animation = "none";
                                }}
                              >
                                {clasificado.subsubcategory}
                              </p>
                              <style>
                                {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                              </style>
                              <div style={{ textAlign: "left", }}>
                                <h2
                                  style={{
                                    display: "inline",
                                    color: "black",
                                    fontSize: "1.2em",
                                    fontWeight: "bold",
                                    textShadow: "2px 2px 4px #828282",
                                    margin: 0, // Elimina márgenes
                                  }}
                                >
                                  {clasificado.title}
                                </h2>
                                <p
                                  className="descripcion1"
                                  style={{
                                    display: "inline",
                                    textAlign: "left", // Alinea el texto a la izquierda
                                    fontSize: "1.0em",
                                    fontFamily: "Arial, sans-serif",
                                    color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                    textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                    hyphens: "auto",
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    margin: 0, // Elimina márgenes
                                    paddingLeft: "5px", // Espacio entre el título y el texto
                                  }}
                                >
                                  {clasificado.description.length > 150
                                    ? `${clasificado.description.substring(0, 150)}...`
                                    : clasificado.description}
                                </p>
                              </div>
                              <p
                                style={{
                                  textAlign: "justify",
                                  fontSize: "1.0em",
                                  fontFamily: "Arial",
                                  color: "black",
                                  hyphens: "auto", // Permite dividir palabras con guion
                                  wordBreak: "break-word", // Maneja palabras largas
                                  overflowWrap: "break-word", // Compatibilidad adicional
                                  fontFamily: "Arial, sans-serif",
                                  lineHeight: "1.0",
                                  marginTop: "5px",
                                  marginBottom: "2px",
                                }}
                              >
                                <strong>Ubicación: </strong>{clasificado.province}.
                              </p>

                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                ☎️{clasificado.phone_number}
                              </p>
                              <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  WS:
                                  <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                  }}>
                                    {`https://${clasificado.whatsapp}`}
                                  </a>
                                </div>
                              </p>
                              <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                                <div style={{ display: "inline-flex", alignItems: "center" }}>
                                  Web:
                                  {clasificado.url && (
                                    <a
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        openWebPage(clasificado.url);
                                      }}
                                      style={{
                                        color: "blue",
                                        textDecoration: "underline",
                                        marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                      }}
                                    >
                                      {clasificado.url}
                                    </a>
                                  )}
                                </div>
                              </p>

                              <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                                Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                              </span>
                            </div>
                          );
                        }

                        return null; // No renderizar más clasificados en esta columna
                      })}
                  </div>
                );
              })}
            </div>


            <hr
              style={{
                width: "100%",
                borderTop: "1px solid #000",
                margin: "10px 0",
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}>
              <span style={{
                display: "block",
                backgroundColor: "#f1f1f1",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: "1.5",
                color: "#333",
                maxWidth: "100%",
                transition: "transform 0.2s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(2px) translateY(2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0) translateY(0)'} >
                <strong>DIRECTORIO TELEFÓNICO COMERCIAL ABcupon.com DE PROVEEDORES CERTIFICADOS</strong><br />
                San José, La Uruca, Costa Rica, Centroamérica| Teléfono: <a href="tel:+50622202290" style={{ color: "#007bff" }}>(506) 2220-2290</a><br />
                WhatsApp para compras y pedidos: <a href="https://wa.me/50687886767" style={{ color: "#007bff" }}>(506) 8788-6767</a><br />
                Pague en línea SINPE móvil BNCR: <span style={{ color: "#007bff" }}>(506) 8974-1577</span> Coopered.
              </span>
            </div>
            <p style={{ textAlign: "center" }}>Página 10</p>
          </div>
        )}
        <div className="clasificados-container1">
          {[...Array(5)].map((_, columnIndex) => {
            let clasificadosEnColumna = 0;
            const clasificadosPorColumna =
              columnIndex === 0 ? 3 : columnIndex === 3 ? 3 : 3;
            const maxClasificadosConImagen = 2;
            const maxClasificadosSinImagen = 3;

            return (
              <div key={columnIndex} className="columna1">
                {/* Mostrar botones de filtrar solo en la primera columna */}

                {clasificadosToUse
                  .filter((_, index) => index >= 79 && index < 96)
                  .slice(
                    columnIndex * clasificadosPorColumna,
                    columnIndex * clasificadosPorColumna +
                    clasificadosPorColumna
                  )
                  .map((clasificado, index) => {
                    const tieneImagen =
                      clasificado.content &&
                      clasificado.content_type === "clasificado_imagen";
                    const imagenCategoria = images.find(
                      (img) => img.category === clasificado.category
                    )?.src;
                    const clasificadoConImagen = tieneImagen || imagenCategoria ? 0.5 : 0;

                    const isSinContenido = !clasificado.content;

                    if (
                      clasificadosEnColumna <
                      maxClasificadosConImagen + maxClasificadosSinImagen &&
                      (clasificadoConImagen === 0 ||
                        clasificadosEnColumna < maxClasificadosConImagen)
                    ) {
                      clasificadosEnColumna += clasificadoConImagen || 1;

                      const imagenCategoria = images.find(
                        (img) => img.category === clasificado.category
                      )?.src;

                      // Aplicar tamaño triple solo al primer clasificado de cada categoría
                      const escala =
                        categoriasUsadas[clasificado.category] === undefined
                          ? 2
                          : 1;
                      categoriasUsadas[clasificado.category] = 1;

                      return (
                        <div
                          key={index}
                          className={`clasificado ${isSinContenido ? "sin-contenido" : ""
                            }`}
                          onClick={() => handleClasificadoClick(clasificado)}
                        >
                          {imagenCategoria && escala !== 1 && (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={imagenCategoria}
                                alt={clasificado.category}
                                style={{
                                  width: isMobile ? "80px" : "100px",
                                  height: isMobile ? "25px" : "auto",
                                  marginTop: index === 0 ? "30px" : "20px",
                                  marginBottom: index === 0 ? "30px" : "30px",
                                  transform: `scale(${escala})`,
                                }}

                              />
                            </div>
                          )}
                          {clasificado.content && (
                            <img
                              src={clasificado.content}
                              alt={clasificado.title}
                              style={{
                                maxWidth: "auto",
                                height: "15vh",
                                display: "block",
                                margin: "auto",
                                marginBottom: index === 0 ? "30px" : "30px",
                              }}
                            />
                          )}
                          <p
                            className="categoria-identificativo11"
                            style={{
                              textAlign: "justify",
                              fontSize: "1.0em",
                              color: "white",
                              backgroundColor: "#767676",
                              borderRadius: "10px",
                              border: "1px solid black",
                              paddingTop: "2px",
                              paddingLeft: "6px",
                              paddingRight: "6px",
                              boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
                              transition: "all 0.3s ease",
                              animation: "vibrar 1s linear", // Duración de 1 segundo
                              marginBottom: "4%",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.animation = "vibrar 1s linear";
                              setTimeout(() => {
                                e.target.style.animation = "none";
                              }, 1000);
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.animation = "none";
                            }}
                          >
                            {clasificado.subsubcategory}
                          </p>
                          <style>
                            {`
                          @keyframes vibrar {
                            0% { transform: translateX(0); }
                            25% { transform: translateX(-5px); }
                            50% { transform: translateX(5px); }
                            75% { transform: translateX(-5px); }
                            100% { transform: translateX(0); }
                          }
                        `}
                          </style>
                          <div style={{ textAlign: "left", }}>
                            <h2
                              style={{
                                display: "inline",
                                color: "black",
                                fontSize: "1.2em",
                                fontWeight: "bold",
                                textShadow: "2px 2px 4px #828282",
                                margin: 0, // Elimina márgenes
                              }}
                            >
                              {clasificado.title}
                            </h2>
                            <p
                              className="descripcion1"
                              style={{
                                display: "inline",
                                textAlign: "left", // Alinea el texto a la izquierda
                                fontSize: "1.0em",
                                fontFamily: "Arial, sans-serif",
                                color: clasificado.description === "Tu publicidad podría estar aquí." ? "blue" : "black",
                                textDecoration: clasificado.description === "Tu publicidad podría estar aquí." ? "underline" : "none",
                                hyphens: "auto",
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                margin: 0, // Elimina márgenes
                                paddingLeft: "5px", // Espacio entre el título y el texto
                              }}
                            >
                              {clasificado.description.length > 150
                                ? `${clasificado.description.substring(0, 150)}...`
                                : clasificado.description}
                            </p>
                          </div>
                          <p
                            style={{
                              textAlign: "justify",
                              fontSize: "1.0em",
                              fontFamily: "Arial",
                              color: "black",
                              hyphens: "auto", // Permite dividir palabras con guion
                              wordBreak: "break-word", // Maneja palabras largas
                              overflowWrap: "break-word", // Compatibilidad adicional
                              fontFamily: "Arial, sans-serif",
                              lineHeight: "1.5",
                              marginTop: "5px",
                              marginBottom: "2px",
                            }}
                          >
                            <strong>Ubicación: </strong>{clasificado.province}.
                          </p>

                          <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                            ☎️{clasificado.phone_number}
                          </p>
                          <p style={{ textAlign: "justify", color: "black", display: "inline", fontFamily: "Arial, sans-serif" }}>
                            <div style={{ display: "inline-flex", alignItems: "center" }}>
                              WS:
                              <a href={`https://${clasificado.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{
                                color: "blue",
                                textDecoration: "underline",
                                marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                              }}>
                                {`https://${clasificado.whatsapp}`}
                              </a>
                            </div>
                          </p>
                          <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", margin: 0 }}>
                            <div style={{ display: "inline-flex", alignItems: "center" }}>
                              Web:
                              {clasificado.url && (
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openWebPage(clasificado.url);
                                  }}
                                  style={{
                                    color: "blue",
                                    textDecoration: "underline",
                                    marginLeft: "5px" // Añade un pequeño espacio entre el texto y el enlace
                                  }}
                                >
                                  {clasificado.url}
                                </a>
                              )}
                            </div>
                          </p>

                          <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif" }}>
                            Código: {`${new Date(clasificado.datetime).getFullYear().toString().substring(2, 4)}/${(new Date(clasificado.datetime).getMonth() + 1).toString().padStart(2, '0')}/${new Date(clasificado.datetime).getDate().toString().padStart(2, '0')}/id:${clasificado.id}`}
                          </span>
                        </div>
                      );
                    }

                    return null; // No renderizar más clasificados en esta columna
                  })}
              </div>
            );
          })}
        </div>
        {modalVisible && selectedClasificado && (
          <ClasificadoDetail
            clasificado={selectedClasificado}
            onCloseModal={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default ClasificadosComponent;
