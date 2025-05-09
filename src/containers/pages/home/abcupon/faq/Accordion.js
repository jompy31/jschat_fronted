import React, { useState } from "react";
import AccordionItem from "./AccordionItem";

const Accordion = ({ questionsAnswers }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false); // Estado para manejar la búsqueda

  // Filtrar preguntas solo si isSearching es true
  const filteredQuestionsAnswers = isSearching
    ? questionsAnswers.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : questionsAnswers;

  const renderedQuestionsAnswers = filteredQuestionsAnswers.map((item, index) => {
    const showDescription = index === activeIndex ? "show-description" : "";
    const fontWeightBold = index === activeIndex ? "font-weight-bold" : "";
    const ariaExpanded = index === activeIndex ? "true" : "false";
    return (
      <AccordionItem
        key={item.question} // Asegúrate de añadir una clave única aquí
        showDescription={showDescription}
        fontWeightBold={fontWeightBold}
        ariaExpanded={ariaExpanded}
        item={item}
        index={index}
        onClick={() => {
          setActiveIndex(index);
        }}
      />
    );
  });

  // Función para manejar el clic en el botón de búsqueda
  const handleSearch = () => {
    setIsSearching(true);
  };

  return (
    <div className="faq1" style={{lineHeight:"1.5"}}>
      <h1 className="faq__title">Preguntas Frecuentes</h1>

      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar pregunta..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="faq__search"
      />
      <button onClick={handleSearch} className="faq__search-button">Buscar</button>

      <dl className="faq__list">{renderedQuestionsAnswers}</dl>
    </div>
  );
};

export default Accordion;
