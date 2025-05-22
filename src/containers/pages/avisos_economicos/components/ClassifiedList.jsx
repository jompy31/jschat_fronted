import React from "react";

const ClassifiedList = ({
  clasificadosToUse,
  startIndex,
  endIndex,
  categoriaImages,
  categoriasUsadas,
  handleClasificadoClick,
  openWebPage,
  isMobile,
}) => {
  let clasificadosEnColumna = 0;
  const maxClasificadosConImagen = 2.2;
  const maxClasificadosSinImagen = 5;

  // Group classifieds by category
  const groupedClasificados = clasificadosToUse
    .slice(startIndex, endIndex)
    .reduce((acc, clasificado) => {
      const category = clasificado.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(clasificado);
      return acc;
    }, {});

  // Get categories that have classifieds
  const categoriesToRender = Object.keys(groupedClasificados).sort((a, b) => {
    const numA = parseInt(a.split(".")[0]);
    const numB = parseInt(b.split(".")[0]);
    return numA - numB;
  });

  return (
    <div>
      {categoriesToRender.map((category, catIndex) => {
        const clasificadosInCategory = groupedClasificados[category];
        const imagenCategoria = categoriaImages[category];
        const escala = categoriasUsadas[category] === undefined ? 2 : 1;
        categoriasUsadas[category] = 1;

        return (
          <div key={catIndex}>
            {/* Render category image */}
            {imagenCategoria && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img
                  src={imagenCategoria}
                  alt={category}
                  style={{
                    width: isMobile ? "50%" : "60%",
                    height: "auto", // Use auto for both mobile and desktop
                    marginTop: catIndex === 0 ? "30px" : "20px",
                    marginBottom: "30px",
                    transform: `scale(${escala})`,
                  }}
                />
              </div>
            )}
            {/* Render classifieds for this category */}
            {clasificadosInCategory.map((clasificado, index) => {
              const tieneImagen = clasificado.content && clasificado.content_type === "clasificado_imagen";
              const clasificadoConImagen = tieneImagen ? 0.5 : 0;
              const isSinContenido = !clasificado.content;

              if (
                clasificadosEnColumna < maxClasificadosConImagen + maxClasificadosSinImagen &&
                (clasificadoConImagen === 0 || clasificadosEnColumna < maxClasificadosConImagen)
              ) {
                clasificadosEnColumna += clasificadoConImagen || 1;

                return (
                  <div
                    key={index}
                    className={`clasificado ${isSinContenido ? "sin-contenido" : ""}`}
                    onClick={() => handleClasificadoClick(clasificado)}
                  >
                    {clasificado.content && (
                      <img
                        src={clasificado.content}
                        alt={clasificado.title}
                        style={{
                          maxWidth: "auto",
                          height: "15vh",
                          display: "block",
                          margin: "auto",
                          marginBottom: "30px",
                        }}
                      />
                    )}
                    <p
                      className="categoria-identificativo11"
                      style={{
                        textAlign: "justify",
                        margin: "auto",
                        fontSize: "0.8em",
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
                        setTimeout(() => (e.target.style.animation = "none"), 1000);
                      }}
                      onMouseLeave={(e) => (e.target.style.animation = "none")}
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
                    <div style={{ textAlign: "left" }}>
                      <h2
                        style={{
                          display: "inline",
                          color: "black",
                          fontSize: "0.8em",
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
                          fontSize: "0.8em",
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
                        fontSize: "0.8em",
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
                    <p style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", fontSize: "0.8em" }}>
                      ☎️{clasificado.phone_number}
                    </p>
                    <div style={{ fontSize: "0.8em", fontFamily: "Arial, sans-serif", color: "black" }}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                        <span>WS:</span>
                        <a
                          href={`https://${clasificado.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "blue", textDecoration: "underline", marginLeft: "5px" }}
                        >
                          {`https://${clasificado.whatsapp}`}
                        </a>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span>Web:</span>
                        {clasificado.url && (
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              openWebPage(clasificado.url);
                            }}
                            style={{ color: "blue", textDecoration: "underline", marginLeft: "5px" }}
                          >
                            {clasificado.url}
                          </a>
                        )}
                      </div>
                    </div>

                    <span style={{ textAlign: "justify", color: "black", fontFamily: "Arial, sans-serif", fontSize: "0.8em" }}>
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
  );
};

export default ClassifiedList;