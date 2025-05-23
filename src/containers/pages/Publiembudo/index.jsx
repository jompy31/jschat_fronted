import React, { useState } from "react";
import "./Publiembudo.css";
import data from "../../../components/json/publiembudoData.json";
import Publicidad from "../../../components/cotizadores/publicidad";

const Publiembudo = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleCotizarClick = (comboName) => {
        const phoneNumber = "+50687886767";
        const message = `¡Hola! Me gustaría obtener más información sobre el publiembudo combo ${comboName}.`;
        const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, "_blank");
    };

    return (
        <div className="publiembudo-wrapper">
            <div className="publiembudo-container">
                <h1 className="publiembudo-title">Descubre el Combo Ideal para Ti</h1>
                <div className="combo-grid">
                    {data.map((combo, index) => (
                        <div
                            className={`combo-card ${index === 1 ? "center-focus" : ""} ${
                                hoveredIndex === index ? "hovered" : ""
                            }`}
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <h2 className="combo-name">{combo.name}</h2>
                            <ul className="combo-description">
                                {combo.description.map((item, i) => (
                                    <li key={i} className="combo-bullet">
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="combo-price">Precio: {combo.price}</p>
                            <p className="combo-savings">{combo.savings}</p>
                            <button
                                className="quote-button"
                                onClick={() => handleCotizarClick(combo.name)}
                            >
                                Cotizar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Publicidad />
        </div>
    );
};

export default Publiembudo;