import { Typewriter } from "react-simple-typewriter";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import { Container, Form, Pagination } from "react-bootstrap";
import React, { useState, useEffect, useRef } from "react";
import DistributorDataService from "../../services/products";
import "./Table.css";
// import directions from "./direction.json";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";

function Table1(tablacategory) {
  // console.log("datos de tabla autos", tablacategory)
  // const token = useSelector(state => state.authentication.token);
  const [expandedImage, setExpandedImage] = useState(null);
  const [distributors, setDistributors] = useState([]);
  const [showMap, setShowMap] = useState([]);
  const [showDetails, setShowDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedDirectory, setSelectedDirectory] = useState("");
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });
  const isSmallDesktop = useMediaQuery({ query: '(min-width: 769px) and (max-width: 1024px)' });
  const [vibrateButton, setVibrateButton] = useState(false);
  const [vibrate, setVibrate] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const mapContainerRef = useRef(null);
  const [selectedComercialActivity, setSelectedComercialActivity] =
    useState("");
  const [selectedService, setSelectedService] = useState("");
  const [isMapVisible, setIsMapVisible] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const isFirstMapActive = useRef(false);
  const handleNavbarItemClick = (comercialActivity) => {
    setSelectedComercialActivity(comercialActivity);
  };

  useEffect(() => {
    fetchDistributors();
  }, [tablacategory]);
  useEffect(() => {
    fetchDistributors();
  }, []);


  const fetchDistributors = () => {
    const storedProducts = localStorage.getItem("products1");
    const storedProducts1 = storedProducts ? JSON.parse(storedProducts) : [];

    // console.log("stored", storedProducts1)
    if (Array.isArray(storedProducts1)) {
      const filteredDistributors = storedProducts1.filter((product) => {
        const normalize = (str) => {
          return (
            str
              ?.toLowerCase()
              ?.normalize("NFD")
              ?.replace(/[\u0300-\u036f]/g, "") || ""
          );
        };

        return (
          product.name === tablacategory.tablacategory &&
          (!selectedComercialActivity ||
            normalize(product.comercial_activity) ===
            normalize(selectedComercialActivity))
        );
      });

      const subproducts = filteredDistributors.flatMap(
        (distributor) => distributor.subproducts
      );
      // console.log("subproducts", subproducts )
      setDistributors(subproducts);
    } else {
      console.error("storedProducts no es un array:", storedProducts);
    }
  };

  const handleButtonClick = (directory) => {
    setSelectedDirectory(directory);
    fetchDistributors();
    setVibrateButton(true);
    setVibrate(true);
    setTimeout(() => {
      setVibrateButton(false);
    }, 4000);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVibrateButton(null);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [vibrateButton]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVibrate(true);

      setTimeout(() => {
        setVibrate(false);
      }, 200);
    }, 4000);

    return () => {
      clearInterval(intervalId);
      setVibrate(false);
    };
  }, []);

  const [buttonVibration, setButtonVibration] = useState({
    allProducts: false,
    clasificados: false,
    products: false,
    bolsaEmpleo: false,
  });
  const handleToggleMap = (index) => {
    // Crear un nuevo array con todos los elementos establecidos en false
    const updatedShowMap = Array(showMap.length).fill(false);

    // Si el mapa actual está abierto, ciérralo; de lo contrario, ábrelo
    updatedShowMap[index] = showMap[index] ? false : true;

    setShowMap(updatedShowMap);
    setIsMapOpen(updatedShowMap.some((value) => value));

    // Desplazar la pantalla al final del componente después de un breve tiempo
    setTimeout(() => {
      const iframeId = `mapIframe${index}`;
      const iframeElement = document.getElementById(iframeId);
      if (iframeElement && updatedShowMap[index]) {
        iframeElement.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }, 100); // Ajusta el tiempo según sea necesario
  };

  const handleToggleDetails = async (index) => {
    // console.log("index", index);
    // Fetch services for the selected distributor
    setSelectedComercialActivity(
      showDetails === index ? null : distributors[index].comercial_activity
    );
    try {
      const servicesResponse = await DistributorDataService.getAllSubProduct(
        distributors[index].id
      );
      // console.log("servicesResponse", servicesResponse);
      // console.log("Services Data:", servicesResponse.data);
      const updatedDistributors = [...distributors];
      updatedDistributors[index].services = servicesResponse.data;
      // console.log("updatedDistributors", servicesResponse.data);
      setDistributors(updatedDistributors);
      setSelectedDistributor(
        showDetails === index ? null : distributors[index]
      );
    } catch (error) {
      console.error(error);
    }

    setShowDetails(showDetails === index ? null : index);
  };

  const delayedSearch = useRef(
    debounce((value) => {
      setSearchTerm(value);
    }, 500)
  ).current;

  const normalize = (str) => {
    return (
      str
        ?.toLowerCase()
        ?.normalize("NFD")
        ?.replace(/[\u0300-\u036f]/g, "")
        .trim() || ""
    );
  };

  const filteredDistributors = distributors.filter((distributor) => {
    const normalizedComercialActivity = normalize(
      distributor.comercial_activity
    );
    const normalizedSearchTerm = normalize(searchTerm);

    return (
      normalizedComercialActivity.includes(normalizedSearchTerm) ||
      (distributor.email &&
        normalize(distributor.email).includes(normalizedSearchTerm)) ||
      (distributor.name &&
        normalize(distributor.name).includes(normalizedSearchTerm)) ||
      (distributor.country &&
        normalize(distributor.country).includes(normalizedSearchTerm)) ||
      (distributor.province &&
        normalize(distributor.province).includes(normalizedSearchTerm)) ||
      (distributor.description &&
        normalize(distributor.description).includes(normalizedSearchTerm))
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const distributorsPerPage = 6;

  // Calculate the index of the last distributor on the current page
  const indexOfLastDistributor = currentPage * distributorsPerPage;
  // Calculate the index of the first distributor on the current page
  const indexOfFirstDistributor = indexOfLastDistributor - distributorsPerPage;
  // Get the distributors for the current page
  const currentDistributors = filteredDistributors.slice(
    indexOfFirstDistributor,
    indexOfLastDistributor
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 >= 1 ? prevPage - 1 : prevPage));
  };

  return (
    <main style={{ width: "100%" }}>
      <main style={{ display: "flex", flexWrap: "wrap", fontSize: isMini ? "1.2em" : "0.9em", zoom: isMini ? "40%" : "100%" }}>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            marginLeft: "5.3%",

          }}
        >
          <input
            type="text"
            placeholder="Buscar por Actividad Comercial o nombre"
            onChange={(e) => delayedSearch(e.target.value)}
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              width: "50vh",
              border: "2px solid red", // Contorno rojo
              boxShadow: "0 0 5px green", // Sombreado verde
              padding: "10px", // Espaciado interno para mejor apariencia
              outline: "none", // Eliminar el contorno por defecto
              borderRadius: "4px", // Esquinas redondeadas (opcional)
            }}
          />
        </div>

        <div style={{ display: "flex", width: "100%", overflow: "auto" }}>
          {currentDistributors.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                onClick={() =>
                (window.location.href =
                  "https://abcupon.com/#/directorio_comercial")
                }
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
                style={{ lineHeight: "1.5" }}
              >
                ¿No encuentras el directorio buscado? por favor visita nuestro
                Directorio General de Comercios
              </button>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  margin: "0 auto", // Centra la tabla
                  width: isSmallDesktop ? "80%" : isMobile ? "90%" : "90%", // Ajusta el ancho de la tabla según el dispositivo
                  // border: "2px solid black", // Borde negro
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "white",
                  display: "block", // Permite el desplazamiento horizontal
                  overflowX: "auto",
                  boxShadow: "0 0 10px rgba(255, 0, 0, 0.3)", // Sombreado rojo
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "black", color: "white" }}>
                    <th
                      style={{
                        padding: "10px",
                        // backgroundColor: "black",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: isSmallDesktop ? "1.6em" : isMobile ? "1.0em" : "2.0em",
                      }}
                    >
                      Actividad Comercial
                    </th>

                    <th
                      style={{
                        padding: "10px",
                        // backgroundColor: "black",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: isSmallDesktop ? "1.6em" : isMobile ? "1.0em" : "2.0em",
                      }}
                    >
                      Nombre de empresa
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        // backgroundColor: "black",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: isSmallDesktop ? "1.6em" : isMobile ? "1.0em" : "2.0em",
                      }}
                    >
                      Pais
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        // backgroundColor: "black",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: isSmallDesktop ? "1.6em" : isMobile ? "1.0em" : "2.0em",
                      }}
                    >
                      Provincia
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        // backgroundColor: "black",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: isSmallDesktop ? "1.6em" : isMobile ? "1.0em" : "2.0em",
                      }}
                    >
                      Descripcion
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        // backgroundColor: "black",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: isSmallDesktop ? "1.6em" : isMobile ? "1.2em" : "2.0em",
                      }}
                    >
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentDistributors.map((distributor, index) => (
                    <tr
                      key={index}
                      style={{ borderRadius: "10px", border: "1px solid gray" }}
                    >
                      <td
                        style={{
                          padding: "10px",
                          fontSize: isSmallDesktop ? "1" : isMobile ? "1em" : "1em",
                        }}
                      >
                        <h2
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: isSmallDesktop ? "1.5em" : isMobile ? "1.5em" : "2em", // Ajusta el tamaño según el modo
                            textTransform: "none",
                            overflow: "hidden",
                            whiteSpace: isSmallDesktop ? "normal" : isMobile ? "normal" : "nowrap", // Permitir salto de línea en móvil
                            lineHeight: isSmallDesktop ? "1.2" : isMobile ? "1.2" : "normal", // Ajustar la altura de línea para mejor legibilidad
                          }}
                        >
                          {distributor.comercial_activity}
                        </h2>
                      </td>

                      <td
                        style={{
                          padding: "10px",
                          fontSize: isSmallDesktop ? "0.7em" : isMobile ? "0.7em" : "1em",
                        }}
                      >
                        <h2
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            fontSize: "2em",
                            // textShadow: "2px 2px 4px #000",
                            textTransform: "none",
                            overflow: "hidden",
                            whiteSpace: "normal",
                            lineClamp: 1,
                          }}
                        >
                          <Link
                            to={`/servicios/${distributor.email}`}
                            state={{
                              subproductName: distributor.name,
                              subproductEmail: distributor.email,
                            }}
                            style={{ color: "black" }}
                          >
                            {distributor.name}
                          </Link>
                        </h2>
                      </td>
                      <td
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: isSmallDesktop ? "1.2em" : isMobile ? "1.2em" : "2em",
                          // textShadow: "2px 2px 4px #000",
                          textTransform: "none",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <p className="mb-4">{distributor.country}</p>
                      </td>
                      <td
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: isSmallDesktop ? "1.2em" : isMobile ? "1.2em" : "2em",
                          // textShadow: "2px 2px 4px #000",
                          textTransform: "none",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {distributor.canton ? (
                          <p className="mb-4"> {distributor.province}</p>
                        ) : (
                          <p>No hay dirección adicional.</p>
                        )}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          fontSize: isSmallDesktop ? "1.2em" : isMobile ? "0.8em" : "1.4em",
                        }}
                      >
                        <p className="mb-4">
                          {distributor.description && isMobile
                            ? distributor.description.length > 110
                              ? `${distributor.description.substring(0, 110)}...`
                              : distributor.description
                            : distributor.description && distributor.description.length > 220
                              ? `${distributor.description.substring(0, 220)}...`
                              : distributor.description}
                        </p>
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          fontSize: isSmallDesktop ? "0.7em" : isMobile ? "0.7em" : "1em",
                        }}
                      >
                        <div>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mb-2"
                            onClick={() => {
                              handleToggleDetails(index);
                              setIsModalOpen(true);
                            }}
                            style={{
                              backgroundColor: "white",
                              color: "black",
                              fontWeight: "bold",
                              border: "1px solid black",
                              padding: "10px 20px",
                              cursor: "pointer",
                              // width: '50vh',
                              transition: "background-color 0.3s, color 0.3s",
                              borderRadius: "10px",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "green";
                              e.target.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "transparent";
                              e.target.style.color = "black";
                            }}
                          >
                            <Link
                              to={`/servicios/${distributor.email}`}
                              state={{
                                subproductName: distributor.name,
                                subproductEmail: distributor.email,
                              }}
                              style={{ color: "black" }}
                            >
                              Ver Menu
                            </Link>
                          </button>
                          <button
                            onClick={() => handleToggleMap(index)}
                            style={{
                              backgroundColor: "black",
                              color: "white",
                              fontWeight: "bold",
                              border: "1px solid black",
                              padding: "10px 20px",
                              cursor: "pointer",
                              // width: '50vh',
                              transition: "background-color 0.3s, color 0.3s",
                              borderRadius: "10px",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "green";
                              e.target.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "black";
                              e.target.style.color = "white";
                            }}
                          >
                            {isMapOpen ? "Cerrar" : "Dirección"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showMap.map(
          (value, index) =>
            value && (
              <div
                key={index}
                style={{ position: "relative", textAlign: "center" }}
              >
                {isFirstMapActive.current && (
                  <div
                    style={{
                      marginLeft: isSmallDesktop ? "10%" : isMobile ? "10%" : "50%",
                      width: isSmallDesktop ? "90%" : isMobile ? "90%" : "200%",
                    }}
                  >
                    {currentDistributors[index].addressmap ? (
                      <>
                        <iframe
                          title="Google Maps"
                          id={`mapIframe${index}`}
                          src={currentDistributors[index].addressmap}
                          width="100%"
                          height="400"
                          frameBorder="0"
                          style={{
                            border: "2px solid red",
                            boxShadow: "0 0 10px black",
                            width: "100%",
                          }}
                          allowFullScreen=""
                          aria-hidden="false"
                          tabIndex="0"
                        ></iframe>
                        <span
                          style={{
                            display: "inline-block",
                            background: "white",
                            padding: "10px",
                            borderRadius: "10px",
                            border: "2px solid red",
                            boxShadow: "0 0 10px black",
                            marginTop: "10px",
                            fontWeight: "bold",
                            fontSize: "1.5em",
                          }}
                        >
                          {currentDistributors[index].address}
                        </span>
                      </>
                    ) : (
                      <p>No hay datos disponibles</p>
                    )}
                  </div>
                )}
                {/* Botón Cerrar */}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mt-2"
                  onClick={() => handleToggleMap(index)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: isSmallDesktop ? "80%" : isMobile ? "80%" : "220%",
                  }}
                >
                  {isFirstMapActive.current ? "Cerrar" : "Ver Dirección"}
                </button>
                {isFirstMapActive.current || (isFirstMapActive.current = true)}
              </div>
            )
        )}
      </main>

      <br />
      <br />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination.Prev
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            backgroundColor: "white",
            color: "black",
            fontWeight: "bold",
            border: "1px solid black",
            padding: "10px 10px",
            cursor: "pointer",
            // width: '50vh',
            transition: "background-color 0.3s, color 0.3s",
            borderRadius: "10px",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "green";
            e.target.style.color = "black";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "black";
            e.target.style.color = "white";
          }}
        />

        {Array.from(
          {
            length: Math.min(
              5,
              Math.ceil(filteredDistributors.length / distributorsPerPage)
            ),
          },
          (_, i) => {
            const totalPages = Math.ceil(
              filteredDistributors.length / distributorsPerPage
            );
            const midPoint = Math.floor(5 / 2);
            let startPage = Math.max(1, currentPage - midPoint);
            let endPage = Math.min(startPage + 4, totalPages);

            if (endPage - startPage < 4) {
              startPage = Math.max(1, endPage - 4);
            }

            const pageNumber = startPage + i;

            return (
              <Pagination.Item
                key={i}
                onClick={() => setCurrentPage(pageNumber)}
                active={pageNumber === currentPage}
                style={{
                  backgroundColor: "#28a745", // Verde
                  color: "white", // Texto blanco para contraste
                  fontWeight: "bold",
                  border: "1px solid #218838", // Bordes más oscuros
                  padding: "10px 10px",
                  cursor: "pointer",
                  transition: "background-color 0.3s, color 0.3s",
                  borderRadius: "10px",
                  display:
                    pageNumber >= startPage && pageNumber <= endPage
                      ? "block"
                      : "none",
                }}
              >
                {pageNumber}
              </Pagination.Item>
            );
          }
        )}

        <Pagination.Next
          onClick={handleNextPage}
          disabled={indexOfLastDistributor >= filteredDistributors.length}
          style={{
            backgroundColor: "black",
            color: "white",
            fontWeight: "bold",
            border: "1px solid black",
            padding: "10px 10px",
            cursor: "pointer",
            // width: '50vh',
            transition: "background-color 0.3s, color 0.3s",
            borderRadius: "10px",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "green";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "black";
            e.target.style.color = "white";
          }}
        />
      </div>
    </main>
  );
}

export default Table1;
