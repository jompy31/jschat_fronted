import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaRegClock } from 'react-icons/fa';

const JobPostingDetails = ({ show, handleClose, jobPosting, experienceLevels, benefits, skills, jobTags, companies }) => {
  const [companyName, setCompanyName] = useState('');
  const [experienceLevelName, setExperienceLevelName] = useState('');

  useEffect(() => {
    if (jobPosting) {
      const company = companies.find(c => c.id === jobPosting.company);
      setCompanyName(company ? company.name : 'Desconocido');
      const experienceLevel = experienceLevels.find(level => level.id === jobPosting.experience_level);
      setExperienceLevelName(experienceLevel ? experienceLevel.level : 'Desconocido');
    }
  }, [jobPosting, experienceLevels, companies]);

  if (!jobPosting) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${show ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-600">{jobPosting.title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Descripción</h3>
            <p className="text-gray-600">{jobPosting.description}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <FaBriefcase className="text-blue-600 mr-2" />
              <span><strong>Empresa:</strong> {companyName}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="text-blue-600 mr-2" />
              <span><strong>Ciudad:</strong> {jobPosting.city}, {jobPosting.country}</span>
            </div>
            <div>
              <strong>Tipo de empleo:</strong> {jobPosting.employment_type}
            </div>
            <div>
              <strong>Nivel de experiencia:</strong> {experienceLevelName}
            </div>
            <div className="flex items-center">
              <FaDollarSign className="text-blue-600 mr-2" />
              <span><strong>Rango salarial:</strong> {jobPosting.salary_range}</span>
            </div>
            <div>
              <strong>Modalidad:</strong> {jobPosting.modality}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="text-blue-600 mr-2" />
              <span><strong>Fecha de publicación:</strong> {jobPosting.posted_date}</span>
            </div>
            <div className="flex items-center">
              <FaRegClock className="text-blue-600 mr-2" />
              <span><strong>Fecha límite de aplicación:</strong> {jobPosting.application_deadline}</span>
            </div>
            <div>
              <strong>Cómo aplicar:</strong> {jobPosting.how_to_apply}
            </div>
            <div>
              <strong>Beneficios:</strong> {jobPosting.benefits.map(benefitId => benefits.find(benefit => benefit.id === benefitId)?.name).join(', ')}
            </div>
            <div>
              <strong>Habilidades requeridas:</strong> {jobPosting.skills_required.map(skillId => skills.find(skill => skill.id === skillId)?.name).join(', ')}
            </div>
            <div>
              <strong>Etiquetas:</strong> {jobPosting.tags.map(tagId => jobTags.find(tag => tag.id === tagId)?.name).join(', ')}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetails;