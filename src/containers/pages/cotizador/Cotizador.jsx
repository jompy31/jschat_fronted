import React, { useState } from "react";
import Prestamos from "./cotizadores/Cotizador_prestamo";
import Traspasos_autos from "./cotizadores/Traspasos_autos";
import Traspasos_bienes from "./cotizadores/Traspaso_bienes";
import Levantamiento_prendas from "./cotizadores/levantamiento_prendas";
import Levantamiento_hipoteca from "./cotizadores/levantamiento_hipoteca";
import Servicios_Notariales from "./cotizadores/servicios_notariales";
import Inscripcion_prenda from "./cotizadores/inscripcion_prendas";
import Inscripcion_hipoteca from "./cotizadores/inscripcion_hipoteca";
import ExamenesSalud from "./cotizadores/examenes_medicos";
import Publicidad from "./cotizadores/publicidad"; // Importamos Publicidad
import Asuntos from "./cotizadores/asuntos";
import logo from "../../../assets/categorias/25.webp";
import logo1 from "../../../assets/catalogo/webp/fondo.webp";
import { useMediaQuery } from "react-responsive";
import Colegio_abogados from './cotizadores/colegios_profesionales/Colegio_abogados';
import Colegio_agronomos from './cotizadores/colegios_profesionales/Colegio_agronomos';
import Colegio_biibliotecarios from './cotizadores/colegios_profesionales/Colegio_biibliotecarios';
import Colegio_biologos from './cotizadores/colegios_profesionales/Colegio_biologos';
import Colegio_cienciaseconomicas from './cotizadores/colegios_profesionales/Colegio_cienciaseconomicas';
import Colegio_cirujanosdentistas from './cotizadores/colegios_profesionales/Colegio_cirujanosdentistas';
import Colegio_contadoresprivados from './cotizadores/colegios_profesionales/Colegio_contadoresprivados';
import Colegio_contadorespublicos from './cotizadores/colegios_profesionales/Colegio_contadorespublicos';
import Colegio_enfermeras from './cotizadores/colegios_profesionales/Colegio_enfermeras';
import Colegio_farmaceuticos from './cotizadores/colegios_profesionales/Colegio_farmaceuticos';
import Colegio_ingenierosarquitectos from './cotizadores/colegios_profesionales/Colegio_ingenierosarquitectos';
import Colegio_ingenierosmecanicos from './cotizadores/colegios_profesionales/Colegio_ingenierosmecanicos';
import Colegio_ingenierosquimicos from './cotizadores/colegios_profesionales/Colegio_ingenierosquimicos';
import Colegio_medicos from './cotizadores/colegios_profesionales/Colegio_medicos';
import Colegio_microbiologos from './cotizadores/colegios_profesionales/Colegio_microbiologos';
import Colegio_nutricionistas from './cotizadores/colegios_profesionales/Colegio_nutricionistas';
import Colegio_orientacion from './cotizadores/colegios_profesionales/Colegio_orientacion';
import Colegio_periodistas from './cotizadores/colegios_profesionales/Colegio_periodistas';
import Colegio_profesores from './cotizadores/colegios_profesionales/Colegio_profesores';
import Colegio_psicologia from './cotizadores/colegios_profesionales/Colegio_psicologia';
import Colegio_veterinarios from './cotizadores/colegios_profesionales/Colegio_veterinarios';
import { Height } from "@mui/icons-material";

const Cotizador = () => {
  const [prestamosOpen, setPrestamosOpen] = useState(false);
  const [traspasosAutosOpen, setTraspasosAutosOpen] = useState(false);
  const [traspasosBienesOpen, setTraspasosBienesOpen] = useState(false);
  const [levantamientoPrendasOpen, setLevantamientoPrendasOpen] = useState(false);
  const [levantamientoHipotecaOpen, setLevantamientoHipotecaOpen] = useState(false);
  const [serviciosNotarialesOpen, setServiciosNotarialesOpen] = useState(false);
  const [inscripcionPrendaOpen, setInscripcionPrendaOpen] = useState(false);
  const [inscripcionHipotecaOpen, setInscripcionHipotecaOpen] = useState(false);
  const [colegiosOpen, setColegiosOpen] = useState(false);
  const [asuntoOpen, setAsuntoOpen] = useState(false);
  const [examenesSaludOpen, setExamenesSaludOpen] = useState(false);
  const [publicidadOpen, setPublicidadOpen] = useState(false); // Nuevo estado para Publicidad
  const [colegioAbogadosOpen, setColegioAbogadosOpen] = useState(false);
  const [colegioAgronomosOpen, setColegioAgronomosOpen] = useState(false);
  const [colegioBibliotecariosOpen, setColegioBibliotecariosOpen] = useState(false);
  const [colegioBiologosOpen, setColegioBiologosOpen] = useState(false);
  const [colegioCienciasEconomicasOpen, setColegioCienciasEconomicasOpen] = useState(false);
  const [colegioCirujanosDentistasOpen, setColegioCirujanosDentistasOpen] = useState(false);
  const [colegioContadoresPrivadosOpen, setColegioContadoresPrivadosOpen] = useState(false);
  const [colegioContadoresPublicosOpen, setColegioContadoresPublicosOpen] = useState(false);
  const [colegioEnfermerasOpen, setColegioEnfermerasOpen] = useState(false);
  const [colegioFarmaceuticosOpen, setColegioFarmaceuticosOpen] = useState(false);
  const [colegioIngenierosArquitectosOpen, setColegioIngenierosArquitectosOpen] = useState(false);
  const [colegioIngenierosMecanicosOpen, setColegioIngenierosMecanicosOpen] = useState(false);
  const [colegioIngenierosQuimicosOpen, setColegioIngenierosQuimicosOpen] = useState(false);
  const [colegioMedicosOpen, setColegioMedicosOpen] = useState(false);
  const [colegioMicrobiologosOpen, setColegioMicrobiologosOpen] = useState(false);
  const [colegioNutricionistasOpen, setColegioNutricionistasOpen] = useState(false);
  const [colegioOrientacionOpen, setColegioOrientacionOpen] = useState(false);
  const [colegioPeriodistasOpen, setColegioPeriodistasOpen] = useState(false);
  const [colegioProfesoresOpen, setColegioProfesoresOpen] = useState(false);
  const [colegioPsicologiaOpen, setColegioPsicologiaOpen] = useState(false);
  const [colegioVeterinariosOpen, setColegioVeterinariosOpen] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });


  const closeAllSections = () => {
    setPrestamosOpen(false);
    setTraspasosAutosOpen(false);
    setTraspasosBienesOpen(false);
    setLevantamientoPrendasOpen(false);
    setLevantamientoHipotecaOpen(false);
    setServiciosNotarialesOpen(false);
    setInscripcionPrendaOpen(false);
    setInscripcionHipotecaOpen(false);
    setAsuntoOpen(false);
    setExamenesSaludOpen(false);
    setPublicidadOpen(false); // Cerramos Publicidad
    // Cerrar todos los colegios
    setColegioAbogadosOpen(false);
    setColegioAgronomosOpen(false);
    setColegioBibliotecariosOpen(false);
    setColegioBiologosOpen(false);
    setColegioCienciasEconomicasOpen(false);
    setColegioCirujanosDentistasOpen(false);
    setColegioContadoresPrivadosOpen(false);
    setColegioContadoresPublicosOpen(false);
    setColegioEnfermerasOpen(false);
    setColegioFarmaceuticosOpen(false);
    setColegioIngenierosArquitectosOpen(false);
    setColegioIngenierosMecanicosOpen(false);
    setColegioIngenierosQuimicosOpen(false);
    setColegioMedicosOpen(false);
    setColegioMicrobiologosOpen(false);
    setColegioNutricionistasOpen(false);
    setColegioOrientacionOpen(false);
    setColegioPeriodistasOpen(false);
    setColegioProfesoresOpen(false);
    setColegioPsicologiaOpen(false);
    setColegioVeterinariosOpen(false);
  };

  const toggleSection = (section) => {
    closeAllSections(); // Cerrar todas las secciones antes de abrir la seleccionada

    switch (section) {
      case "prestamos":
        setPrestamosOpen(!prestamosOpen);
        break;
      case "traspasosAutos":
        setTraspasosAutosOpen(!traspasosAutosOpen);
        break;
      case "traspasosBienes":
        setTraspasosBienesOpen(!traspasosBienesOpen);
        break;
      case "levantamientoPrendas":
        setLevantamientoPrendasOpen(!levantamientoPrendasOpen);
        break;
      case "levantamientoHipoteca":
        setLevantamientoHipotecaOpen(!levantamientoHipotecaOpen);
        break;
      case "serviciosNotariales":
        setServiciosNotarialesOpen(!serviciosNotarialesOpen);
        break;
      case "inscripcionPrenda":
        setInscripcionPrendaOpen(!inscripcionPrendaOpen);
        break;
      case "inscripcionHipoteca":
        setInscripcionHipotecaOpen(!inscripcionHipotecaOpen);
        break;
      case "asunto":
        setAsuntoOpen(!asuntoOpen);
        break;
      case "examenesSalud":
        setExamenesSaludOpen(!examenesSaludOpen);
        break;
      case "publicidad":
        setPublicidadOpen(!publicidadOpen);
        break;

      // Manejo de los colegios
      case "colegioAbogados":
        setColegioAbogadosOpen(!colegioAbogadosOpen);
        break;
      case "colegioAgronomos":
        setColegioAgronomosOpen(!colegioAgronomosOpen);
        break;
      case "colegioBibliotecarios":
        setColegioBibliotecariosOpen(!colegioBibliotecariosOpen);
        break;
      case "colegioBiologos":
        setColegioBiologosOpen(!colegioBiologosOpen);
        break;
      case "colegioCienciasEconomicas":
        setColegioCienciasEconomicasOpen(!colegioCienciasEconomicasOpen);
        break;
      case "colegioCirujanosDentistas":
        setColegioCirujanosDentistasOpen(!colegioCirujanosDentistasOpen);
        break;
      case "colegioContadoresPrivados":
        setColegioContadoresPrivadosOpen(!colegioContadoresPrivadosOpen);
        break;
      case "colegioContadoresPublicos":
        setColegioContadoresPublicosOpen(!colegioContadoresPublicosOpen);
        break;
      case "colegioEnfermeras":
        setColegioEnfermerasOpen(!colegioEnfermerasOpen);
        break;
      case "colegioFarmaceuticos":
        setColegioFarmaceuticosOpen(!colegioFarmaceuticosOpen);
        break;
      case "colegioIngenierosArquitectos":
        setColegioIngenierosArquitectosOpen(!colegioIngenierosArquitectosOpen);
        break;
      case "colegioIngenierosMecanicos":
        setColegioIngenierosMecanicosOpen(!colegioIngenierosMecanicosOpen);
        break;
      case "colegioIngenierosQuimicos":
        setColegioIngenierosQuimicosOpen(!colegioIngenierosQuimicosOpen);
        break;
      case "colegioMedicos":
        setColegioMedicosOpen(!colegioMedicosOpen);
        break;
      case "colegioMicrobiologos":
        setColegioMicrobiologosOpen(!colegioMicrobiologosOpen);
        break;
      case "colegioNutricionistas":
        setColegioNutricionistasOpen(!colegioNutricionistasOpen);
        break;
      case "colegioOrientacion":
        setColegioOrientacionOpen(!colegioOrientacionOpen);
        break;
      case "colegioPeriodistas":
        setColegioPeriodistasOpen(!colegioPeriodistasOpen);
        break;
      case "colegioProfesores":
        setColegioProfesoresOpen(!colegioProfesoresOpen);
        break;
      case "colegioPsicologia":
        setColegioPsicologiaOpen(!colegioPsicologiaOpen);
        break;
      case "colegioVeterinarios":
        setColegioVeterinariosOpen(!colegioVeterinariosOpen);
        break;
      default:
        break;
    }
  };


  const renderButton = (section, label) => {
    const isOpen = {
      prestamos: prestamosOpen,
      traspasosAutos: traspasosAutosOpen,
      traspasosBienes: traspasosBienesOpen,
      levantamientoPrendas: levantamientoPrendasOpen,
      levantamientoHipoteca: levantamientoHipotecaOpen,
      serviciosNotariales: serviciosNotarialesOpen,
      inscripcionPrenda: inscripcionPrendaOpen,
      inscripcionHipoteca: inscripcionHipotecaOpen,
      asunto: asuntoOpen,
      examenesSalud: examenesSaludOpen,
      publicidad: publicidadOpen,
      colegioAbogados: colegioAbogadosOpen,
      colegioAgronomos: colegioAgronomosOpen,
      colegioBibliotecarios: colegioBibliotecariosOpen,
      colegioBiologos: colegioBiologosOpen,
      colegioCienciasEconomicas: colegioCienciasEconomicasOpen,
      colegioCirujanosDentistas: colegioCirujanosDentistasOpen,
      colegioContadoresPrivados: colegioContadoresPrivadosOpen,
      colegioContadoresPublicos: colegioContadoresPublicosOpen,
      colegioEnfermeras: colegioEnfermerasOpen,
      colegioFarmaceuticos: colegioFarmaceuticosOpen,
      colegioIngenierosArquitectos: colegioIngenierosArquitectosOpen,
      colegioIngenierosMecanicos: colegioIngenierosMecanicosOpen,
      colegioIngenierosQuimicos: colegioIngenierosQuimicosOpen,
      colegioMedicos: colegioMedicosOpen,
      colegioMicrobiologos: colegioMicrobiologosOpen,
      colegioNutricionistas: colegioNutricionistasOpen,
      colegioOrientacion: colegioOrientacionOpen,
      colegioPeriodistas: colegioPeriodistasOpen,
      colegioProfesores: colegioProfesoresOpen,
      colegioPsicologia: colegioPsicologiaOpen,
      colegioVeterinarios: colegioVeterinariosOpen
    };

    const buttonStyle = {
      backgroundColor: isOpen[section] ? 'black' : 'red',
      color: 'white',
      border: '1px solid black',
      padding: '10px',
      margin: '5px',
      cursor: 'pointer',
      width: isMobile ? '20vh' : "30vh",
      fontSize: isMobile ? "0.4rem" : "0.8rem",
      lineHeight: 1.2
    };

    return (
      <button
        style={buttonStyle}
        onClick={() => toggleSection(section)}
      >
        {isOpen[section] ? 'Cerrar' : label}
      </button>
    );
  };



  const isAnySectionOpen =
    prestamosOpen ||
    traspasosAutosOpen ||
    traspasosBienesOpen ||
    levantamientoPrendasOpen ||
    levantamientoHipotecaOpen ||
    serviciosNotarialesOpen ||
    inscripcionPrendaOpen ||
    inscripcionHipotecaOpen ||
    asuntoOpen ||
    examenesSaludOpen ||
    publicidadOpen || // Verificamos si Publicidad está abierto
    colegiosOpen; // Verificamos si Colegios está abierto


  return (
    <div style={{ marginTop: isMini ? "42%" : isMobile ? "10%" : "3%", zoom: isMini ? "15%" : isMobile ? "60%" : "100%" }}>

      <br />
      <br />
      <br />
      <br />
      <br />
      <img src={logo} alt="Logo" style={{ maxWidth: '50vh', height: 'auto' }} />

      <h2
        style={{
          color: "red",
          fontWeight: "bold",
          textShadow: "2px 2px 4px #000", // Sombra roja
          textTransform: "none",
          lineHeight: 1.5,
        }}
      >
        Calculadora por modelos
      </h2>
      <p
        style={{
          fontWeight: "bold",
          textTransform: "none",
          fontSize: "1.5rem",
          lineHeight: 1.5,
        }}
      >
        Advertencia:
      </p>
      <p
        style={{
          textTransform: "none",
          fontSize: isMobile ? "0.8rem" : "1.2rem",
          lineHeight: 1.5,
        }}
      >
        Los valores mostrados son aproximados, para un cálculo personalizado escríbanos a nuestro whatsapp 87886767 y con gusto le atenderemos.
      </p>
      <div style={{ marginTop: "4%" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", marginTop: "4%", position: "relative"
        }}>
          {/* Primera mitad - 3 columnas */}
          <div style={{ flex: 1, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px", }}>
            <div style={{ flex: "1 0 30%", display: "flex", flexDirection: "column", gap: "10px" }}>
              {renderButton("prestamos", prestamosOpen ? "Cerrar Prestamos" : "Abrir Prestamos")}
              {renderButton("traspasosAutos", traspasosAutosOpen ? "Cerrar Traspasos Autos" : "Abrir Traspasos Autos")}
              {renderButton("traspasosBienes", traspasosBienesOpen ? "Cerrar Traspasos Bienes" : "Abrir Traspasos Bienes")}
            </div>
            <div style={{ flex: "1 0 30%", display: "flex", flexDirection: "column", gap: "10px" }}>
              {renderButton("levantamientoPrendas", levantamientoPrendasOpen ? "Cerrar Levantamiento Prendas" : "Abrir Levantamiento Prendas")}
              {renderButton("levantamientoHipoteca", levantamientoHipotecaOpen ? "Cerrar Levantamiento Hipotecas" : "Abrir Levantamiento Hipotecas")}
              {renderButton("serviciosNotariales", serviciosNotarialesOpen ? "Cerrar Servicios Notariales" : "Abrir Servicios Notariales")}
            </div>
            <div style={{ flex: "1 0 30%", display: "flex", flexDirection: "column", gap: "10px" }}>
              {renderButton("inscripcionPrenda", inscripcionPrendaOpen ? "Cerrar Inscripción Prenda" : "Abrir Inscripción Prenda")}
              {renderButton("inscripcionHipoteca", inscripcionHipotecaOpen ? "Cerrar Inscripción Hipoteca" : "Abrir Inscripción Hipoteca")}
              {renderButton("asunto", asuntoOpen ? "Cerrar Asuntos" : "Abrir Asuntos")}
            </div>
          </div>

          {/* Texto "Servicios Legal y Notariado" */}
          <div style={{
            position: "absolute", transform: isMobile ? "translateY(-110%)" : "translateY(-100%)", fontSize: isMobile ? "0.5rem" : "1.2rem",
            lineHeight: 1.5, fontWeight: "bold", marginLeft: "4%"
          }}>

            Servicios Legal y Notariado
          </div>

          {/* Línea divisoria vertical */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: "50%", width: "2px", backgroundColor: "#000"
          }}></div>

          {/* Segunda mitad - 3 columnas */}
          <div style={{ flex: 1, display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ flex: "1 0 30%", display: "flex", flexDirection: "column", gap: "10px" }}>
              {renderButton("colegioAbogados", colegioAbogadosOpen ? "Cerrar Colegio Abogados" : "Abrir Colegio Abogados")}
              {renderButton("colegioAgronomos", colegioAgronomosOpen ? "Cerrar Colegio Agrónomos" : "Abrir Colegio Agrónomos")}
              {renderButton("colegioBibliotecarios", colegioBibliotecariosOpen ? "Cerrar Colegio Bibliotecarios" : "Abrir Colegio Bibliotecarios")}
            </div>
            <div style={{ flex: "1 0 30%", display: "flex", flexDirection: "column", gap: "10px" }}>
              {renderButton("colegioBiologos", colegioBiologosOpen ? "Cerrar Colegio Biólogos" : "Abrir Colegio Biólogos")}
              {renderButton("colegioCienciasEconomicas", colegioCienciasEconomicasOpen ? "Cerrar Colegio Ciencias Económicas" : "Abrir Colegio Ciencias Económicas")}
              {renderButton("colegioCirujanosDentistas", colegioCirujanosDentistasOpen ? "Cerrar Colegio Cirujanos Dentistas" : "Abrir Colegio Cirujanos Dentistas")}
            </div>
            <div style={{ flex: "1 0 30%", display: "flex", flexDirection: "column", gap: "10px" }}>
              {renderButton("colegioContadoresPrivados", colegioContadoresPrivadosOpen ? "Cerrar Colegio Contadores Privados" : "Abrir Colegio Contadores Privados")}
              {renderButton("colegioContadoresPublicos", colegioContadoresPublicosOpen ? "Cerrar Colegio Contadores Públicos" : "Abrir Colegio Contadores Públicos")}
              {renderButton("colegioEnfermeras", colegioEnfermerasOpen ? "Cerrar Colegio Enfermeras" : "Abrir Colegio Enfermeras")}
            </div>
          </div>

          {/* Texto "Precios Mínimos por Colegios Profesionales" */}
          <div style={{
            position: "absolute", right: isMobile ? "2%" : "25%", transform: "translateY(-100%)", fontSize: isMobile ? "0.5rem" : "1.2rem",
            lineHeight: 1.5, fontWeight: "bold"
          }}>
            Precios Mínimos por Colegios Profesionales
          </div>
        </div>

        {/* {renderButton("Publicidad ABCupon", publicidadOpen ? "Cerrar Publicidad" : "Abrir Precios Publicitarios")} */}
        <button onClick={() => toggleSection('publicidad')} style={{
          backgroundColor: publicidadOpen ? 'black' : 'red',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          width: isMobile ? '20vh' : "",
          fontSize: isMobile ? "0.4rem" : "1.2rem",

        }}>
          {publicidadOpen ? 'Cerrar Publicidad' : 'Publicidad ABCupon'}
        </button>



        {prestamosOpen && <Prestamos />}
        {traspasosBienesOpen && <Traspasos_bienes />}
        {traspasosAutosOpen && <Traspasos_autos />}
        {levantamientoPrendasOpen && <Levantamiento_prendas />}
        {levantamientoHipotecaOpen && <Levantamiento_hipoteca />}
        {serviciosNotarialesOpen && <Servicios_Notariales />}
        {inscripcionPrendaOpen && <Inscripcion_prenda />}
        {inscripcionHipotecaOpen && <Inscripcion_hipoteca />}
        {asuntoOpen && <Asuntos />}
        {examenesSaludOpen && <ExamenesSalud />}
        {publicidadOpen && <Publicidad />}
        {colegioAbogadosOpen && <Colegio_abogados />}
        {colegioAgronomosOpen && <Colegio_agronomos />}
        {colegioBibliotecariosOpen && <Colegio_biibliotecarios />}
        {colegioBiologosOpen && <Colegio_biologos />}
        {colegioCienciasEconomicasOpen && <Colegio_cienciaseconomicas />}
        {colegioCirujanosDentistasOpen && <Colegio_cirujanosdentistas />}
        {colegioContadoresPrivadosOpen && <Colegio_contadoresprivados />}
        {colegioContadoresPublicosOpen && <Colegio_contadorespublicos />}
        {colegioEnfermerasOpen && <Colegio_enfermeras />}
        {colegioFarmaceuticosOpen && <Colegio_farmaceuticos />}
        {colegioIngenierosArquitectosOpen && <Colegio_ingenierosarquitectos />}
        {colegioIngenierosMecanicosOpen && <Colegio_ingenierosmecanicos />}
        {colegioIngenierosQuimicosOpen && <Colegio_ingenierosquimicos />}
        {colegioMedicosOpen && <Colegio_medicos />}
        {colegioMicrobiologosOpen && <Colegio_microbiologos />}
        {colegioNutricionistasOpen && <Colegio_nutricionistas />}
        {colegioOrientacionOpen && <Colegio_orientacion />}
        {colegioPeriodistasOpen && <Colegio_periodistas />}
        {colegioProfesoresOpen && <Colegio_profesores />}
        {colegioPsicologiaOpen && <Colegio_psicologia />}
        {colegioVeterinariosOpen && <Colegio_veterinarios />}

        <div
          style={{
            textAlign: "center",
            margin: "auto",
            width: "50%",
            position: "relative",
          }}
        >
          {isAnySectionOpen ? null : (
            <img
              src={logo1}
              alt="Logo"
              style={{
                border: "2px solid red",
                borderRadius: "10px",
                boxShadow: "2px 2px 4px #000",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Cotizador;
