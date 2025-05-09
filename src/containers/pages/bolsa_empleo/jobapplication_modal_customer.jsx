import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const JobApplicationModal = ({
  show,
  handleClose,
  jobApplication,
  jobPostings = [],
  handleSave,
  selectedJob
}) => {
  // console.log("trabajo actual", selectedJob);

  const [applicantName, setApplicantName] = useState(
    jobApplication ? jobApplication.applicantName : ""
  );
  const [jobPostingId, setJobPostingId] = useState(
    selectedJob ? selectedJob.id : (jobApplication ? jobApplication.jobPostingId : "")
  );
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(
    jobApplication ? jobApplication.coverLetter : ""
  );
  const [notes, setNotes] = useState(
    jobApplication ? jobApplication.notes : ""
  );
  const [status, setStatus] = useState(
    jobApplication ? jobApplication.status : "Pending"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("id de job", selectedJob.id)
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

  return (
    <Modal show={show} onHide={handleClose} style={{ overflowY: "auto" }} backdrop="true" keyboard={true}>
      <Modal.Title
        style={{
          color: "red",
          fontWeight: "bold",
          fontSize: "2.0em",
          lineHeight: "1.2em",
          textShadow: "2px 2px 4px #000",
          textTransform: "none",
          overflow: "hidden",
          whiteSpace: "nowrap",
          marginBottom: "4%",
        }}
      >
        {jobApplication ? "Editar Aplicación de Trabajo" : "Crear Aplicación de Trabajo"}
      </Modal.Title>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Si selectedJob existe, muestra solo el trabajo seleccionado */}
          <Form.Group controlId="formJobApplicationJobPostingId" style={{ marginBottom: "20px" }}>
            <Form.Label style={{ fontSize: "1.6em", fontWeight: "bold" }}>
              Publicación de Trabajo Seleccionada
            </Form.Label>
            <Form.Control
              as="select"
              value={jobPostingId}
              onChange={(e) => setJobPostingId(e.target.value)}
              required
            >
              {selectedJob ? (
                <option value={selectedJob.id} style={{ fontSize: "1.6em" }}>
                  {selectedJob.title}
                </option>
              ) : (
                <option value="" style={{ fontSize: "1.6em" }}>
                  No hay trabajos disponibles
                </option>
              )}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formJobApplicationResume" style={{ marginBottom: "20px" }}>
            <Form.Label style={{ fontSize: "1.6em", fontWeight: "bold" }}>
              Currículum
            </Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              required
              style={{
                fontSize: "1.0em",
                padding: "0.5em",
              }}
            />
          </Form.Group>

          <Form.Group controlId="formJobApplicationCoverLetter" style={{ marginBottom: "20px" }}>
            <Form.Label style={{ fontSize: "1.6em", fontWeight: "bold" }}>
              Carta de Presentación
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              style={{
                fontSize: "0.8em",
                width: "100%", // Aseguramos que ocupe todo el ancho disponible
              }}
            />
          </Form.Group>

          <Form.Group controlId="formJobApplicationNotes" style={{ marginBottom: "20px" }}>
            <Form.Label style={{ fontSize: "1.6em", fontWeight: "bold" }}>
              Notas para Reclutador
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                fontSize: "0.8em",
                width: "100%", // Aseguramos que ocupe todo el ancho disponible
              }}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default JobApplicationModal;
