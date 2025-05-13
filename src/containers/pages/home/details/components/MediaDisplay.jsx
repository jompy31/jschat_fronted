import React from "react";

const MediaDisplay = ({ subproductData, isMobile }) => {
  if (!subproductData.file && !subproductData.addressmap) return null;

  return (
    <div className="card">
      <h2 className="section-header">Multimedia y Ubicación</h2>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        {subproductData.file && (
          <div
            style={{
              flex: isMobile ? "none" : "1",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {subproductData.file.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={`https://docs.google.com/viewer?url=${subproductData.file}&embedded=true`}
                width="100%"
                height={isMobile ? "300px" : "400px"}
                title={`PDF de ${subproductData.name}`}
                style={{ border: "none" }}
              ></iframe>
            ) : subproductData.file.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) ? (
              <img
                src={subproductData.file}
                alt={`Archivo de imagen de ${subproductData.name}`}
                style={{
                  width: "100%",
                  height: isMobile ? "300px" : "400px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : subproductData.file.toLowerCase().match(/\.(mp4|avi|mkv)$/) ? (
              <video
                width="100%"
                height={isMobile ? "300px" : "400px"}
                controls
                style={{ borderRadius: "8px" }}
              >
                <source src={subproductData.file} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            ) : subproductData.file.toLowerCase().match(/\.(doc|docx|xls|xlsx)$/) ? (
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${subproductData.file}`}
                width="100%"
                height={isMobile ? "300px" : "400px"}
                title={`Documento de ${subproductData.name}`}
                style={{ border: "none" }}
              ></iframe>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#666",
                }}
              >
                No se puede mostrar el archivo
              </p>
            )}
          </div>
        )}
        {subproductData.addressmap && (
          <div
            style={{
              flex: isMobile ? "none" : "1",
              backgroundColor: "#ffffff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <iframe
              src={subproductData.addressmap}
              width="100%"
              height={isMobile ? "300px" : "400px"}
              title={`Ubicación de ${subproductData.name} en el mapa`}
              style={{ border: "none" }}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaDisplay;