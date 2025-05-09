import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./JobApplicationModal.css";

const JobApplicationModal = ({
  show,
  handleClose,
  jobApplication,
  jobPostings = [],
  handleSave,
  selectedJob,
}) => {
  const [jobPostingId, setJobPostingId] = useState(
    selectedJob ? selectedJob.id : jobApplication ? jobApplication.jobPostingId : ""
  );
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(
    jobApplication ? jobApplication.coverLetter : ""
  );
  const [notes, setNotes] = useState(jobApplication ? jobApplication.notes : "");
  const [status, setStatus] = useState(jobApplication ? jobApplication.status : "Pending");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("job", selectedJob.id);
    formData.append("id", selectedJob.id);
    formData.append("resume", resume);
    formData.append("cover_letter", coverLetter);
    formData.append("notes", notes);
    formData.append("status", status);
    handleSave({ id: jobApplication ? jobApplication.id : null, formData });
    handleClose();
  };

  useEffect(() => {
    if (jobApplication) {
      setJobPostingId(jobApplication.jobPostingId);
      setCoverLetter(jobApplication.coverLetter);
      setNotes(jobApplication.notes);
      setStatus(jobApplication.status);
    }
  }, [jobApplication]);

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
      style={{ zIndex: 1052 }}
      onClick={handleBackdropClick}
      backdrop="static"
      keyboard={false}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {jobApplication ? "Editar Aplicación de Trabajo" : "Crear Aplicación de Trabajo"}
          </h2>
          <button className="close-icon" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formJobApplicationJobPostingId" className="form-group">
              <Form.Label className="form-label">Publicación de Trabajo Seleccionada</Form.Label>
              <Form.Control
                as="select"
                value={jobPostingId}
                onChange={(e) => setJobPostingId(e.target.value)}
                required
                className="form-control"
              >
                {selectedJob ? (
                  <option value={selectedJob.id}>{selectedJob.title}</option>
                ) : (
                  <option value="">No hay trabajos disponibles</option>
                )}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formJobApplicationResume" className="form-group">
              <Form.Label className="form-label">Currículum</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                required
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formJobApplicationCoverLetter" className="form-group">
              <Form.Label className="form-label">Carta de Presentación</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="form-control"
              />
            </Form.Group>

            <Form.Group controlId="formJobApplicationNotes" className="form-group">
              <Form.Label className="form-label">Notas para Reclutador</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
              />
            </Form.Group>

            <div className="action-buttons">
              <Button className="action-button save-button" type="submit">
                Guardar
              </Button>
              <Button className="action-button close-button" onClick={handleClose}>
                Cerrar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default JobApplicationModal;