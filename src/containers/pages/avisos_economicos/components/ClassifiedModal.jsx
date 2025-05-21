// frontend_abcupon/src/containers/pages/avisos_economicos/components/ClassifiedModal.jsx
import React from "react";
import ClasificadoDetail from "../details/ClasificadoDetail";

const ClassifiedModal = ({ clasificado, onCloseModal }) => (
  <ClasificadoDetail clasificado={clasificado} onCloseModal={onCloseModal} />
);

export default ClassifiedModal;