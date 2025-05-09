import React from "react";
import { Modal, Button } from "react-bootstrap";
import {
  getEmploymentType,
  getExperienceLevelNameById,
  getSkillsByIds,
  getBenefitsByIds,
  getTagsByIds,
} from "../utils/formatters";
import "./JobModal.css";

const JobModal = ({
  show,
  handleClose,
  selectedJob,
  selectedCompany,
  isMobile,
  isMini,
  skills,
  benefits,
  jobTags,
  setShowJobApplicationModal,
}) => {
  const handleBackdropClick = (e) => {
    if (e.target.className.includes("modal fade")) {
      handleClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      className="custom-modal"
      dialogClassName="modal-dialog"
      backdropClassName="custom-backdrop"
      style={{ zIndex: 1050 }}
      onClick={handleBackdropClick}
      backdrop="static"
      keyboard={false}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Aplicar a {selectedJob?.title}</h2>
          <button className="close-icon" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <Modal.Body>
          <div className="modal-grid">
            <div>
              <h5 className="section-title">
                <i className="fas fa-building"></i> Detalles de la Empresa
              </h5>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td>Logo</td>
                    <td>
                      {selectedCompany && selectedCompany.logo ? (
                        <img
                          src={selectedCompany.logo}
                          alt="Company Logo"
                          className="company-logo"
                        />
                      ) : (
                        <p>No logo disponible</p>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Nombre</td>
                    <td>{selectedCompany?.name}</td>
                  </tr>
                  <tr>
                    <td>Correo Electrónico</td>
                    <td>{selectedCompany?.contact_email}</td>
                  </tr>
                  <tr>
                    <td>Descripción</td>
                    <td>{selectedCompany?.description}</td>
                  </tr>
                  <tr>
                    <td>Dirección</td>
                    <td>{selectedCompany?.address}</td>
                  </tr>
                  <tr>
                    <td>Teléfono</td>
                    <td>{selectedCompany?.phone_number}</td>
                  </tr>
                  <tr>
                    <td>Página Web</td>
                    <td>
                      {selectedCompany?.website ? (
                        <a
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          {selectedCompany.website}
                        </a>
                      ) : (
                        "No disponible"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h5 className="section-title">
                <i className="fas fa-briefcase"></i> Detalles de la Publicación de Trabajo
              </h5>
              <table className="detail-table">
                <tbody>
                  <tr>
                    <td>Título</td>
                    <td>{selectedJob?.title}</td>
                  </tr>
                  <tr>
                    <td>Ubicación</td>
                    <td>{`${selectedJob?.city}, ${selectedJob?.country}`}</td>
                  </tr>
                  <tr>
                    <td>Rango Salario</td>
                    <td>₡{selectedJob?.salary_range}</td>
                  </tr>
                  <tr>
                    <td>Modalidad</td>
                    <td>{selectedJob?.modality}</td>
                  </tr>
                  <tr>
                    <td>Tipo de empleo</td>
                    <td>{getEmploymentType(selectedJob?.employment_type)}</td>
                  </tr>
                  <tr>
                    <td>Nivel de experiencia</td>
                    <td>
                      {getExperienceLevelNameById(selectedJob?.experience_level, skills)}
                    </td>
                  </tr>
                  <tr>
                    <td>Descripción</td>
                    <td>{selectedJob?.description}</td>
                  </tr>
                  <tr>
                    <td>Habilidades</td>
                    <td>
                      {selectedJob?.skills_required && selectedJob.skills_required.length > 0 ? (
                        <ul className="badge-list">
                          {getSkillsByIds(selectedJob.skills_required, skills)
                            .split(", ")
                            .map((skill, index) => (
                              <li key={index}>{skill}</li>
                            ))}
                        </ul>
                      ) : (
                        "No hay habilidades requeridas"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Beneficios</td>
                    <td>
                      {selectedJob?.benefits && selectedJob.benefits.length > 0 ? (
                        <ul className="badge-list">
                          {getBenefitsByIds(selectedJob.benefits, benefits)
                            .split(", ")
                            .map((benefit, index) => (
                              <li key={index}>{benefit}</li>
                            ))}
                        </ul>
                      ) : (
                        "No hay beneficios mencionados"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Etiquetas</td>
                    <td>
                      {selectedJob?.tags && selectedJob.tags.length > 0 ? (
                        <ul className="badge-list">
                          {getTagsByIds(selectedJob.tags, jobTags)
                            .split(", ")
                            .map((tag, index) => (
                              <li key={index}>{tag}</li>
                            ))}
                        </ul>
                      ) : (
                        "No hay etiquetas disponibles"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="action-buttons">
            <Button
              className="action-button apply-button"
              onClick={() => setShowJobApplicationModal(true)}
            >
              Crear Aplicación
            </Button>
            <Button
              className="action-button close-button"
              onClick={handleClose}
            >
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default JobModal;