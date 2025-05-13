import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Select from 'react-select';

const JobPostingModal = ({
  show,
  handleClose,
  jobPosting,
  handleSave,
  jobCategories,
  experienceLevels,
  skills,
  benefits,
  companies,
  tags,
}) => {
  const [title, setTitle] = useState(jobPosting ? jobPosting.title : '');
  const [description, setDescription] = useState(jobPosting ? jobPosting.description : '');
  const [category, setCategory] = useState(jobPosting ? jobPosting.category : '');
  const [city, setCity] = useState(jobPosting ? jobPosting.city : '');
  const [country, setCountry] = useState(jobPosting ? jobPosting.country : '');
  const [region, setRegion] = useState(jobPosting ? jobPosting.region : '');
  const [modality, setModality] = useState(jobPosting ? jobPosting.modality : 'Presencial');
  const [employmentType, setEmploymentType] = useState(jobPosting ? jobPosting.employment_type : 'Full-time');
  const [experienceLevel, setExperienceLevel] = useState(jobPosting ? jobPosting.experienceLevel : '');
  const [salaryRange, setSalaryRange] = useState(jobPosting ? jobPosting.salary_range : '');
  const [selectedSkills, setSelectedSkills] = useState(jobPosting ? jobPosting.skills_required : []);
  const [selectedBenefits, setSelectedBenefits] = useState(jobPosting ? jobPosting.benefits : []);
  const [selectedCompany, setSelectedCompany] = useState(jobPosting ? jobPosting.companies : []);
  const [selectedTags, setSelectedTags] = useState(jobPosting ? jobPosting.tags : []);
  const [applicationDeadline, setApplicationDeadline] = useState(jobPosting ? jobPosting.application_deadline : '');
  const [howToApply, setHowToApply] = useState(jobPosting ? jobPosting.how_to_apply : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    let formattedApplicationDeadline = null;
    if (applicationDeadline) {
      formattedApplicationDeadline = moment(applicationDeadline).format('YYYY-MM-DD');
    }
    handleSave({
      id: jobPosting ? jobPosting.id : null,
      title,
      description,
      category,
      city,
      country,
      region,
      modality,
      employment_type: employmentType,
      experience_level: experienceLevel,
      salary_range: salaryRange,
      skills_required: selectedSkills,
      benefits: selectedBenefits,
      tags: selectedTags,
      application_deadline: formattedApplicationDeadline,
      how_to_apply: howToApply,
      company: selectedCompany,
    });
    handleClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {jobPosting ? 'Editar Publicación de Trabajo' : 'Crear Publicación de Trabajo'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <Form.Group controlId="formJobCompany">
            <Form.Label className="text-sm font-medium text-gray-700">Empresa</Form.Label>
            <Form.Control
              as="select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar Empresa...</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobTitle">
            <Form.Label className="text-sm font-medium text-gray-700">Título</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobDescription">
            <Form.Label className="text-sm font-medium text-gray-700">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobCategory">
            <Form.Label className="text-sm font-medium text-gray-700">Categoría</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar...</option>
              {jobCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobCity">
            <Form.Label className="text-sm font-medium text-gray-700">Ciudad</Form.Label>
            <Form.Control
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobCountry">
            <Form.Label className="text-sm font-medium text-gray-700">País</Form.Label>
            <Form.Control
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobRegion">
            <Form.Label className="text-sm font-medium text-gray-700">Región</Form.Label>
            <Form.Control
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobModality">
            <Form.Label className="text-sm font-medium text-gray-700">Modalidad</Form.Label>
            <Form.Control
              as="select"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Presencial">Presencial</option>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobEmploymentType">
            <Form.Label className="text-sm font-medium text-gray-700">Tipo de Empleo</Form.Label>
            <Form.Control
              as="select"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Full-time">Tiempo Completo</option>
              <option value="Part-time">Medio tiempo</option>
              <option value="Contract">Contratista</option>
              <option value="Temporary">Temporal</option>
              <option value="Freelance">Freelance</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobExperienceLevel">
            <Form.Label className="text-sm font-medium text-gray-700">Nivel de Experiencia</Form.Label>
            <Form.Control
              as="select"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              required
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar...</option>
              {experienceLevels.map((level) => {
                let translatedLevel;
                switch (level.level) {
                  case 'Entry-level':
                    translatedLevel = 'Principiante (menos de 1 año)';
                    break;
                  case 'Mid-level':
                    translatedLevel = 'Nivel medio (menos de 5 años)';
                    break;
                  case 'Senior-level':
                    translatedLevel = 'Nivel senior (más de 5 años)';
                    break;
                  case 'Director':
                    translatedLevel = 'Director';
                    break;
                  case 'Executive':
                    translatedLevel = 'Ejecutivo';
                    break;
                  default:
                    translatedLevel = level.level;
                    break;
                }
                return (
                  <option key={level.id} value={level.id}>{translatedLevel}</option>
                );
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formJobSalaryRange">
            <Form.Label className="text-sm font-medium text-gray-700">Rango Salarial</Form.Label>
            <Form.Control
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Group>
          <Form.Group controlId="formJobSkills">
            <Form.Label className="text-sm font-medium text-gray-700">Habilidades Requeridas</Form.Label>
            <Select
              isMulti
              options={skills.map((skill) => ({
                value: skill.id,
                label: skill.name,
              }))}
              value={selectedSkills.map((id) => ({
                value: id,
                label: skills.find((s) => s.id === id)?.name || '',
              }))}
              onChange={(selected) => setSelectedSkills(selected.map((item) => item.value))}
            />
          </Form.Group>
          <Form.Group controlId="formJobBenefits">
            <Form.Label className="text-sm font-medium text-gray-700">Beneficios</Form.Label>
            <Select
              isMulti
              options={benefits.map((benefit) => ({
                value: benefit.id,
                label: benefit.name,
              }))}
              value={selectedBenefits.map((id) => ({
                value: id,
                label: benefits.find((b) => b.id === id)?.name || '',
              }))}
              onChange={(selected) => setSelectedBenefits(selected.map((item) => item.value))}
            />
          </Form.Group>
          <Form.Group controlId="formJobTags">
            <Form.Label className="text-sm font-medium text-gray-700">Etiquetas</Form.Label>
            <Select
              isMulti
              options={tags.map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
              value={selectedTags.map((id) => ({
                value: id,
                label: tags.find((t) => t.id === id)?.name || '',
              }))}
              onChange={(selected) => setSelectedTags(selected.map((item) => item.value))}
            />
          </Form.Group>
          <Form.Group controlId="formJobApplicationDeadline">
            <Form.Label className="text-sm font-medium text-gray-700">Fecha Límite de Aplicación</Form.Label>
            <DatePicker
              selected={applicationDeadline}
              onChange={(date) => setApplicationDeadline(date)}
              dateFormat="yyyy-MM-dd"
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholderText="Selecciona una fecha"
            />
          </Form.Group>
          <Form.Group controlId="formJobHowToApply">
            <Form.Label className="text-sm font-medium text-gray-700">Cómo aplicar</Form.Label>
            <Form.Control
              as="textarea"
              value={howToApply}
              onChange={(e) => setHowToApply(e.target.value)}
              required
              rows={4}
              className="border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
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
              {jobPosting ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default JobPostingModal;