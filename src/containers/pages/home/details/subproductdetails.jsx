import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Modal from "react-modal";
import BusinessInfo from "./components/BusinessInfo";
import CouponCarousel from "./components/CouponCarousel";
import ServiceTable from "./components/ServiceTable";
import ComboTable from "./components/ComboTable";
import MediaDisplay from "./components/MediaDisplay";
import WhatsAppModal from "./components/WhatsAppModal";
import BusinessHoursTable from "./components/BusinessHoursTable";
import TeamMembersTable from "./components/TeamMembersTable";
import SearchBar from "./components/SearchBar";
import Avisoseconomicos from "../../avisos_economicos/details/Avisos_clasificados_individual";
import useSubproductData from "./hooks/useSubproductData";
import useQuantities from "./hooks/useQuantities";
import { generatePDF } from "./utils/pdfUtils";
import "./SubproductDetails.css";
import Publicidad from "../../../../assets/catalogo/webp/visibilidad.webp";
import Catalogo from '../../Catalogo'

Modal.setAppElement("#root");

const SubproductDetails = () => {
  const { subproductId } = useParams();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });
  const componentRef = useRef();
  const componentRef1 = useRef();

  const {
    subproductData,
    services,
    subCombos,
    teamMembers,
    coupons,
    businessHours,
    isLoading,
  } = useSubproductData(subproductId);

  const {
    quantities,
    setQuantities,
    comboQuantities,
    setComboQuantities,
    calculateSubtotal,
    calculateTotal,
    calculateComboSubtotal,
    calculateTotalCombos,
  } = useQuantities(services, subCombos);

  const metaDescription = subproductData?.description
    ? subproductData.description.length > 160
      ? `${subproductData.description.substring(0, 157)}...`
      : subproductData.description
    : `Descubre ${subproductData?.name} en ABCupon, tu directorio de comercios.`;

  // Check if there's no meaningful content to display
  const hasNoContent =
    !subproductData?.logo &&
    services.length === 0 &&
    subCombos.length === 0 &&
    coupons.length === 0 &&
    businessHours.length === 0 &&
    teamMembers.length === 0 &&
    !subproductData?.file;

  if (isLoading) {
    return (
      <div className="landing-page">
        <div className="card" style={{ textAlign: "center", padding: "40px" }}>
          <h2>Cargando página de presentación...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {subproductData?.name
            ? `${subproductData.name} | ABCupon Directorio de Comercios`
            : "Directorio de Comercios ABCupon"}
        </title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content={`${subproductData?.name}, ABCupon, directorio de comercios, ${subproductData?.comercial_activity}, servicios locales`}
        />
        <meta
          property="og:title"
          content={
            subproductData?.name
              ? `${subproductData.name} | ABCupon`
              : "Directorio de Comercios ABCupon"
          }
        />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:image"
          content={subproductData?.logo || Publicidad}
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="landing-page" style={{ marginTop: "5%", position: "relative" }}>
        {subproductData && (
          <>
            {hasNoContent && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) rotate(15deg)",
                  backgroundColor: "white",
                  border: "2px solid black",
                  borderRadius: "10px",
                  padding: "20px 40px",
 Saunders: "0.8",
                  zIndex: 10,
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  pointerEvents: "none",
                }}
              >
                <p
                  style={{
                    color: "red",
                    fontSize: "1.5em",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  Esta es una muestra de prueba sin valor comercial
                </p>
              </div>
            )}
            <div className="card">
              <BusinessInfo
                subproductData={subproductData}
                isMobile={isMobile}
                isMini={isMini}
              />
            </div>
            {coupons.length > 0 && (
              <div className="card">
                <h2 className="section-header">Promociones</h2>
                <CouponCarousel coupons={coupons} subproductData={subproductData} />
              </div>
            )}
            {(businessHours.length > 0 || teamMembers.length > 0) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  gap: "20px",
                  width: "100%",
                  maxWidth: "1200px",
                  marginBottom: "20px",
                }}
              >
                {businessHours.length > 0 && (
                  <div
                    style={{
                      flex: isMobile ? "none" : "1",
                      width: isMobile ? "100%" : "50%",
                    }}
                  >
                    <BusinessHoursTable businessHours={businessHours} />
                  </div>
                )}
                {teamMembers.length > 0 && (
                  <div
                    style={{
                      flex: isMobile ? "none" : "1",
                      width: isMobile ? "100%" : "50%",
                    }}
                  >
                    <TeamMembersTable teamMembers={teamMembers} isMobile={isMobile} />
                  </div>
                )}
              </div>
            )}
            <div className="card">
              <h2 className="section-header">Buscar Servicios</h2>
              <SearchBar />
            </div>
            {services.length > 0 && (
              <div className="card">
                <ServiceTable
                  services={services}
                  quantities={quantities}
                  setQuantities={setQuantities}
                  calculateSubtotal={calculateSubtotal}
                  calculateTotal={calculateTotal}
                  isMini={isMini}
                  onGeneratePDF={() => generatePDF(subproductData, services, quantities)}
                />
              </div>
            )}
            {subCombos.length > 0 && (
              <div className="card">
                <ComboTable
                  subCombos={subCombos}
                  comboQuantities={comboQuantities}
                  setComboQuantities={setComboQuantities}
                  calculateComboSubtotal={calculateComboSubtotal}
                  calculateTotalCombos={calculateTotalCombos}
                  isMini={isMini}
                />
              </div>
            )}
            {subproductData.file && (
              <div className="card">
                <MediaDisplay subproductData={subproductData} isMobile={isMobile} />
              </div>
            )}
            <WhatsAppModal
              subproductData={subproductData}
              services={services}
              subCombos={subCombos}
              quantities={quantities}
              comboQuantities={comboQuantities}
              calculateSubtotal={calculateSubtotal}
              calculateComboSubtotal={calculateComboSubtotal}
              calculateTotal={calculateTotal}
              calculateTotalCombos={calculateTotalCombos}
            />
            <div ref={componentRef1} className="card">
              {subproductData.point_of_sale && (
                <div
                  style={{
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    padding: "20px",
                    boxShadow: "5px 5px 10px #888888",
                    backgroundColor: "white",
                    margin: "20px 10px",
                    boxSizing: "border-box",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "2em",
                      color: "red",
                      textShadow: "2px 2px 4px #000",
                      fontWeight: "bold",
                      marginBottom: "20px",
                      textAlign: "center",
                    }}
                  >
                    Catálogo de Productos
                  </h2>
                  <Catalogo />
                </div>
              )}
            </div>
            {!hasNoContent && (
              <div ref={componentRef} className="card">
                <Avisoseconomicos
                  email={subproductData.point_of_sale ? "avisos_economicos@abcupon.com" : subproductData.email}
                  name={subproductData.name}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SubproductDetails;