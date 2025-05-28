import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import TodoDataService from '../../../../services/todos';
import JobDataService from '../../../../services/employee';

const JobApplicationModal = ({
  show,
  handleClose,
  jobApplication,
  jobPostings = [],
  handleSave,
  token,
}) => {
  const [userList, setUserList] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applicantId, setApplicantId] = useState('');
  const [jobId, setJobId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [resume, setResume] = useState(null);
  const [currentResumeUrl, setCurrentResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Pending');

  // Fetch users and companies
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users with openwork: true
        const userResponse = await TodoDataService.getUserList(token);
        const users = Array.isArray(userResponse.data.results) 
          ? userResponse.data.results.filter(user => user.openwork === true)
          : Array.isArray(userResponse.data) 
            ? userResponse.data.filter(user => user.openwork === true)
            : [];
        setUserList(users);

        // Fetch companies
        const companyResponse = await JobDataService.getAllCompanies(token);
        const companies = Array.isArray(companyResponse.data.results)
          ? companyResponse.data.results
          : Array.isArray(companyResponse.data)
            ? companyResponse.data
            : [];
        setCompanies(companies);
      } catch (error) {
        console.error('Error fetching data:', error);
        setUserList([]);
        setCompanies([]);
      }
    };

    if (token && show) {
      fetchData();
    }
  }, [token, show]);

  // Populate form fields when editing an application
  useEffect(() => {
    if (jobApplication) {
      setJobId(jobApplication.job?.id || '');
      setApplicantId(jobApplication.applicant?.id || '');
      setCompanyId(jobApplication.job?.company?.id || '');
      setCoverLetter(jobApplication.cover_letter || '');
      setNotes(jobApplication.notes || '');
      setStatus(jobApplication.status || 'Pending');
      setCurrentResumeUrl(jobApplication.resume || '');
      setResume(null); // Reset resume file input for editing
    } else {
      // Reset form for creating a new application
      setJobId('');
      setApplicantId('');
      setCompanyId('');
      setCoverLetter('');
      setNotes('');
      setStatus('Pending');
      setCurrentResumeUrl('');
      setResume(null);
    }
  }, [jobApplication]);

  // Sync company selection when job changes
  useEffect(() => {
    if (jobId) {
      const selectedJob = jobPostings.find(job => job.id === parseInt(jobId));
      if (selectedJob?.company?.id) {
        setCompanyId(selectedJob.company.id);
      } else {
        setCompanyId('');
      }
    }
  }, [jobId, jobPostings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('job', jobId);
    formData.append('applicant', applicantId);
    if (jobApplication?.id) {
      formData.append('id', jobApplication.id);
    }
    if (resume) {
      formData.append('resume', resume);
    }
    formData.append('cover_letter', coverLetter);
    formData.append('notes', notes);
    formData.append('status', status);

    handleSave({ id: jobApplication?.id, formData });
    handleClose();
  };

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
          <Form.Group controlId="formJobApplicationCompany">
            <Form.Label className="text-sm font-medium text-gray-700">
              Seleccionar Empresa
            </Form.Label>
            <Form.Control
              as="select"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar una empresa...</option>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))
              ) : (
                <option value="">No hay empresas disponibles</option>
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobApplicationJobId">
            <Form.Label className="text-sm font-medium text-gray-700">
              Seleccionar Publicación de Trabajo
            </Form.Label>
            <Form.Control
              as="select"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar un trabajo...</option>
              {jobPostings.length > 0 ? (
                jobPostings
                  .filter((job) => !companyId || job.company?.id === parseInt(companyId))
                  .map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))
              ) : (
                <option value="">No hay trabajos disponibles</option>
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobApplicationApplicant">
            <Form.Label className="text-sm font-medium text-gray-700">
              Seleccionar Solicitante
            </Form.Label>
            <Form.Control
              as="select"
              value={applicantId}
              onChange={(e) => setApplicantId(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar un solicitante...</option>
              {userList.length > 0 ? (
                userList.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name || ''} ({user.email})
                  </option>
                ))
              ) : (
                <option value="">No hay solicitantes disponibles</option>
              )}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobApplicationResume">
            <Form.Label className="text-sm font-medium text-gray-700">Currículum</Form.Label>
            {currentResumeUrl && (
              <div className="mb-2">
                <p className="text-sm text-gray-600">Currículum actual:</p>
                <a
                  href={currentResumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ver currículum actual
                </a>
              </div>
            )}
            <Form.Control
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required={!jobApplication} // Required only for new applications
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