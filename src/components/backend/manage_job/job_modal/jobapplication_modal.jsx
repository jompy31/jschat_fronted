import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import TodoDataService from '../../../../services/todos';

const JobApplicationModal = ({
  show,
  handleClose,
  jobApplication,
  jobPostings = [],
  handleSave,
  selectedJob,
}) => {
  const [userList, setUserList] = useState([]);
  const [applicantEmail, setApplicantEmail] = useState('');
  const [jobPostingId, setJobPostingId] = useState(
    selectedJob ? selectedJob.id : (jobApplication ? jobApplication.jobPostingId : '')
  );
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(jobApplication ? jobApplication.coverLetter : '');
  const [notes, setNotes] = useState(jobApplication ? jobApplication.notes : '');
  const [status, setStatus] = useState(jobApplication ? jobApplication.status : 'Pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('job', jobPostingId);
    formData.append('id', jobPostingId);
    formData.append('resume', resume);
    formData.append('cover_letter', coverLetter);
    formData.append('notes', notes);
    formData.append('status', status);
    formData.append('applicant', applicantEmail);
    handleSave({ id: jobPostingId, formData });
    handleClose();
  };

  useEffect(() => {
    if (jobApplication) {
      setJobPostingId(jobApplication.jobPostingId);
      setCoverLetter(jobApplication.coverLetter);
      setNotes(jobApplication.notes);
      setStatus(jobApplication.status);
      setApplicantEmail(jobApplication.applicantEmail || '');
    }
  }, [jobApplication]);

  const getUserList = () => {
    TodoDataService.getUserList()
      .then((response) => {
        setUserList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {jobApplication ? 'Editar Aplicación de Trabajo' : 'Crear Aplicación de Trabajo'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Form.Group controlId="formJobApplicationJobPostingId">
            <Form.Label className="text-sm font-medium text-gray-700">
              Seleccionar Publicación de Trabajo
            </Form.Label>
            <Form.Control
              as="select"
              value={jobPostingId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setJobPostingId(selectedId);
              }}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar un trabajo...</option>
              {jobPostings.length > 0 ? (
                jobPostings.map((job) => (
                  <option key={job.id} value={job.id}>{job.title}</option>
                ))
              ) : (
                <option value="">No hay trabajos disponibles</option>
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobApplicationApplicant">
            <Form.Label className="text-sm font-medium text-gray-700">
              Seleccionar Correo Electrónico del Solicitante
            </Form.Label>
            <Form.Control
              as="select"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar un correo...</option>
              {userList.length > 0 ? (
                userList.map((user) => (
                  <option key={user.id} value={user.email}>{user.email}</option>
                ))
              ) : (
                <option value="">No hay usuarios disponibles</option>
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobApplicationResume">
            <Form.Label className="text-sm font-medium text-gray-700">Currículum</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobApplicationCoverLetter">
            <Form.Label className="text-sm font-medium text-gray-700">
              Carta de Presentación
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobApplicationNotes">
            <Form.Label className="text-sm font-medium text-gray-700">Notas</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobApplicationStatus">
            <Form.Label className="text-sm font-medium text-gray-700">Estado</Form.Label>
            <Form.Control
              as="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Pending">Pendiente</option>
              <option value="Reviewed">Revisado</option>
              <option value="Interview">Entrevista</option>
              <option value="Offer">Oferta</option>
              <option value="Hired">Contratado</option>
              <option value="Rejected">Rechazado</option>
            </Form.Control>
          </Form.Group>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cerrar
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Guardar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default JobApplicationModal;