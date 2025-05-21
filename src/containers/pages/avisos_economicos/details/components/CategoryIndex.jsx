// frontend_abcupon/src/containers/pages/avisos_economicos/components/CategoryIndex.jsx
import React from "react";

const CategoryIndex = ({
  categorias,
  selectedCategoria,
  handleCategoriaClick,
  mostrarSubcategorias,
  subcategorias,
  selectedSubcategoria,
  handleSubcategoriaClick,
  sortedSubsubcategorias,
  handleMostrarTodasClick,
  isMobile,
}) => (
  <div className="table-container">
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th
            colSpan="3"
            style={{
              backgroundColor: "#b6b6b6",
              padding: isMobile ? "5px" : "10px",
              textAlign: "left",
              fontSize: isMobile ? "0.8em" : "1.0em",
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
                  fontSize: isMobile ? "0.8em" : "1.0em",
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
                      className={selectedSubcategoria === subcategoria ? "selected" : ""}
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
    </table>
    <span style={{ color: "red", fontSize: "1.0em", fontWeight: "bold" }}>
      El click le lleva a ver en Landing Page Menú, precios, imágenes, horarios, forma de entrega, formas de pago en el DIRECTORIO ABcupon.com
    </span>
  </div>
);

export default CategoryIndex;