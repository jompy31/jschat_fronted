import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DataTable from './components/DataTable';
import UserSearch from './components/UserSearch';
import Skills from './components/Skills';
import {
  getAllCompanies,
  createCompany,
  deleteCompany,
  updateCompany,
  getAllJobCategories,
  createJobCategory,
  deleteJobCategory,
  updateJobCategory,
  getAllJobPostings,
  createJobPosting,
  deleteJobPosting,
  updateJobPosting,
  getAllJobApplications,
  createJobApplication,
  deleteJobApplication,
  updateJobApplication,
  getAllExperienceLevels,
  createExperienceLevel,
  deleteExperienceLevel,
  updateExperienceLevel,
  getAllBenefits,
  createBenefit,
  deleteBenefit,
  updateBenefit,
  getAllJobTags,
  createJobTag,
  deleteJobTag,
  updateJobTag,
  getAllSkills,
} from './utils/api';
import BenefitModal from "./job_modal/benefit_modal";
import CompanyModal from "./job_modal/company_modal";
import ExperienceLevelModal from "./job_modal/experiencelevel_modal";
import JobAlertModal from "./job_modal/jobalert_modal";
import JobApplicationModal from "./job_modal/jobapplication_modal";
import JobCategoryModal from "./job_modal/jobcategory_modal";
import JobPostingModal from "./job_modal/jobposting_modal";
import JobTagModal from "./job_modal/jobtag_modal";
import SkillModal from "./job_modal/skill_model";
import CompanydetailModal from "./job_modal/company_detail";

const ManageJobs = () => {
  const token = useSelector((state) => state.authentication.token);
  const user = useSelector((state) => state.authentication.user);
  const [companies, setCompanies] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [jobTags, setJobTags] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showExperienceLevelModal, setShowExperienceLevelModal] = useState(false);
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [showJobTagModal, setShowJobTagModal] = useState(false);
  const [showJobPostingModal, setShowJobPostingModal] = useState(false);
  const [showJobApplicationModal, setShowJobApplicationModal] = useState(false);
  const [showCompanyModal1, setShowCompanyModal1] = useState(false);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [currentBenefit, setCurrentBenefit] = useState(null);
  const [currentJobTag, setCurrentJobTag] = useState(null);
  const [currentExperienceLevel, setCurrentExperienceLevel] = useState(null);
  const [currentJobPosting, setCurrentJobPosting] = useState(null);
  const [currentJobApplication, setCurrentJobApplication] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: '',
    logo: null,
    website: '',
    description: '',
    contact_email: '',
    phone_number: '',
    address: '',
    industry: '',
    established_date: null,
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
  });
  const [newExperienceLevel, setNewExperienceLevel] = useState({ name: '' });
  const [newBenefit, setNewBenefit] = useState({ name: '' });
  const [newJobTag, setNewJobTag] = useState({ name: '' });
  const [newJobPosting, setNewJobPosting] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    employment_type: '',
    experience_level: '',
    salary_range: '',
    how_to_apply: '',
    application_deadline: '',
  });
  const [newJobApplication, setNewJobApplication] = useState({
    jobId: '',
    applicantId: '',
    status: '',
  });
  const [activeSection, setActiveSection] = useState('candidates');

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const loadAllData = async () => {
  try {
    const [
      companiesRes,
      categoriesRes,
      postingsRes,
      applicationsRes,
      experienceLevelsRes,
      benefitsRes,
      tagsRes,
      skillsRes,
    ] = await Promise.all([
      getAllCompanies(token),
      getAllJobCategories(token),
      getAllJobPostings(token),
      getAllJobApplications(token), // Usa la función modificada
      getAllExperienceLevels(token),
      getAllBenefits(token),
      getAllJobTags(token),
      getAllSkills(token),
    ]);
    setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
    setJobCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    setJobPostings(Array.isArray(postingsRes.data) ? postingsRes.data : []);
    setJobApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : []);
    setExperienceLevels(Array.isArray(experienceLevelsRes.data) ? experienceLevelsRes.data : []);
    setBenefits(Array.isArray(benefitsRes.data) ? benefitsRes.data : []);
    setJobTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
    setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
  } catch (error) {
    console.error('Error loading data:', error);
    setCompanies([]);
    setJobCategories([]);
    setJobPostings([]);
    setJobApplications([]);
    setExperienceLevels([]);
    setBenefits([]);
    setJobTags([]);
    setSkills([]);
  }
};

  const handleSaveCompany = async (companyData) => {
    try {
      const formData = new FormData();
      Object.entries(companyData).forEach(([key, value]) => {
        if (key === 'established_date' && value) {
          formData.append(key, moment(value).format('YYYY-MM-DD'));
        } else if (value) {
          formData.append(key, value);
        }
      });
      if (companyData.id) {
        await updateCompany(companyData.id, formData, token);
      } else {
        await createCompany(formData, token);
      }
      setShowCompanyModal(false);
      setNewCompany({
        name: '',
        logo: null,
        website: '',
        description: '',
        contact_email: '',
        phone_number: '',
        address: '',
        industry: '',
        established_date: null,
      });
      await loadAllData();
    } catch (error) {
      console.error('Error saving company:', error);
    }
  };

  const handleSaveJobCategory = async (categoryData) => {
    try {
      if (categoryData.id) {
        await updateJobCategory(categoryData.id, categoryData, token);
      } else {
        await createJobCategory(categoryData, token);
      }
      setShowCategoryModal(false);
      setNewCategory({ name: '', description: '' });
      await loadAllData();
    } catch (error) {
      console.error('Error saving job category:', error);
    }
  };

  const handleSaveExperienceLevel = async (experienceLevel) => {
    try {
      const formData = new FormData();
      formData.append('level', experienceLevel.level);
      await createExperienceLevel(formData, token);
      setShowExperienceLevelModal(false);
      await loadAllData();
    } catch (error) {
      console.error('Error saving experience level:', error);
    }
  };

  const handleSaveBenefit = async (benefit) => {
    try {
      const formData = new FormData();
      formData.append('name', benefit.name);
      formData.append('description', benefit.description);
      await createBenefit(formData, token);
      setShowBenefitModal(false);
      await loadAllData();
    } catch (error) {
      console.error('Error saving benefit:', error);
    }
  };

  const handleSaveJobTag = async (jobTag) => {
    try {
      const formData = new FormData();
      formData.append('name', jobTag.name);
      await createJobTag(formData, token);
      setShowJobTagModal(false);
      await loadAllData();
    } catch (error) {
      console.error('Error saving job tag:', error);
    }
  };

  const handleSaveJobPosting = async (jobPosting) => {
    try {
      const formData = new FormData();
      Object.entries(jobPosting).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((val) => formData.append(key, val));
        } else if (value) {
          formData.append(key, value);
        }
      });
      await createJobPosting(formData, token);
      setShowJobPostingModal(false);
      await loadAllData();
    } catch (error) {
      console.error('Error saving job posting:', error);
    }
  };

  const handleSaveJobApplication = async (jobApplication) => {
    try {
      const id = jobApplication.formData.get('id');
      await createJobApplication(jobApplication.formData, token, id);
      setShowJobApplicationModal(false);
      await loadAllData();
    } catch (error) {
      console.error('Error saving job application:', error);
    }
  };

  const handleShowCompanyDetails = (company) => {
    setCurrentCompany(company);
    setShowCompanyModal1(true);
  };

  const companyColumns = [
    { key: 'id', label: 'ID' },
    {
      key: 'name',
      label: 'Nombre',
      render: (company) => (
        <span
          onClick={() => handleShowCompanyDetails(company)}
          className="underline cursor-pointer text-blue-600 hover:text-blue-800"
        >
          {company.name}
        </span>
      ),
    },
    { key: 'description', label: 'Descripción' },
  ];

  const categoryColumns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripción' },
  ];

  const experienceLevelColumns = [
    { key: 'level', label: 'Nivel Profesional' },
  ];

  const benefitColumns = [
    { key: 'name', label: 'Nombre' },
  ];

  const jobTagColumns = [
    { key: 'name', label: 'Nombre' },
  ];

  const jobPostingColumns = [
    { 
      key: 'company', 
      label: 'Empresa',
      render: (posting) => posting.company?.name || 'N/A'
    },
    { key: 'title', label: 'Título' },
    { key: 'description', label: 'Descripción' },
  ];

 const jobApplicationColumns = [
  {
    key: 'job',
    label: 'Puesto',
    render: (application) => application.job?.title || 'N/A'
  },
  {
    key: 'applicant',
    label: 'Nombre del Candidato',
    render: (application) =>
      application.applicant
        ? `${application.applicant.first_name} ${application.applicant.last_name || ''}`
        : 'N/A'
  },
  { key: 'cover_letter', label: 'Presentación' },
  { key: 'status', label: 'Estado de Aplicación' },
];

  const sections = [
    { id: 'candidates', label: 'Candidatos' },
    { id: 'companies', label: 'Empresas' },
    { id: 'categories', label: 'Categorías de Trabajo' },
    { id: 'experience', label: 'Niveles de Experiencia' },
    { id: 'skills', label: 'Habilidades' },
    { id: 'benefits', label: 'Beneficios' },
    { id: 'tags', label: 'Etiquetas de Trabajo' },
    { id: 'postings', label: 'Publicaciones de Trabajo' },
    { id: 'applications', label: 'Aplicaciones de Trabajo' },
  ];

  return (
    <div className="min-h-screen bg-gray-100" style={{marginTop:"6%"}}>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md h-screen fixed">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-blue-600">Gestión de RRHH</h1>
          </div>
          <nav className="mt-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 ${
                  activeSection === section.id ? 'bg-blue-100 text-blue-600' : ''
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Main Content */}
        <div className="ml-64 p-6 w-full">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeSection === 'candidates' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidatos</h2>
                <UserSearch />
              </>
            )}
            {activeSection === 'companies' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Empresas</h2>
                  <Button
                    onClick={() => setShowCompanyModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Agregar Empresa
                  </Button>
                </div>
                <DataTable
                  columns={companyColumns}
                  data={companies}
                  actionButtons={[
                    {
                      label: 'Eliminar',
                      variant: 'danger',
                      onClick: (company) => deleteCompany(company.id, token).then(loadAllData),
                    },
                  ]}
                />
              </>
            )}
            {activeSection === 'categories' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Categorías de Trabajo</h2>
                  <Button
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Agregar Categoría
                  </Button>
                </div>
                <DataTable
                  columns={categoryColumns}
                  data={jobCategories}
                  actionButtons={[
                    {
                      label: 'Eliminar',
                      variant: 'danger',
                      onClick: (category) => deleteJobCategory(category.id, token).then(loadAllData),
                    },
                  ]}
                />
              </>
            )}
            {activeSection === 'experience' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Niveles de Experiencia</h2>
                  <Button
                    onClick={() => setShowExperienceLevelModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Crear Nivel
                  </Button>
                </div>
                <DataTable
                  columns={experienceLevelColumns}
                  data={experienceLevels}
                  actionButtons={[
                    {
                      label: 'Eliminar',
                      variant: 'danger',
                      onClick: (level) => deleteExperienceLevel(level.id, token).then(loadAllData),
                    },
                  ]}
                />
              </>
            )}
            {activeSection === 'skills' && (
              <>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Habilidades</h2>
                <Skills token={token} />
              </>
            )}
            {activeSection === 'benefits' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Beneficios</h2>
                  <Button
                    onClick={() => setShowBenefitModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Crear Beneficio
                  </Button>
                </div>
                <DataTable
                  columns={benefitColumns}
                  data={benefits}
                  actionButtons={[
                    {
                      label: 'Eliminar',
                      variant: 'danger',
                      onClick: (benefit) => deleteBenefit(benefit.id, token).then(loadAllData),
                    },
                  ]}
                />
              </>
            )}
            {activeSection === 'tags' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Etiquetas de Trabajo</h2>
                  <Button
                    onClick={() => setShowJobTagModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Crear Etiqueta
                  </Button>
                </div>
                <DataTable
                  columns={jobTagColumns}
                  data={jobTags}
                  actionButtons={[
                    {
                      label: 'Eliminar',
                      variant: 'danger',
                      onClick: (tag) => deleteJobTag(tag.id, token).then(loadAllData),
                    },
                  ]}
                />
              </>
            )}
            {activeSection === 'postings' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Publicaciones de Trabajo</h2>
                  <Button
                    onClick={() => setShowJobPostingModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Crear Publicación
                  </Button>
                </div>
                <DataTable
                  columns={jobPostingColumns}
                  data={jobPostings}
                  actionButtons={[
                    {
                      label: 'Eliminar',
                      variant: 'danger',
                      onClick: (posting) => deleteJobPosting(posting.id, token).then(loadAllData),
                    },
                  ]}
                />
              </>
            )}
            {activeSection === 'applications' && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Aplicaciones de Trabajo</h2>
                  <Button
                    onClick={() => setShowJobApplicationModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Crear Aplicación
                  </Button>
                </div>
                <DataTable
                  columns={jobApplicationColumns}
                  data={jobApplications}
                  actionButtons={[
                    {
                      label: 'Editar',
                      variant: 'warning',
                      onClick: (application) => {
                        setCurrentJobApplication(application);
                        setShowJobApplicationModal(true);
                      },
                    },
                    {
                      label: 'Eliminar',
                      variant: 'danger',
                      onClick: (application) =>
                        deleteJobApplication(application.job, token, application.id).then(loadAllData),
                    },
                  ]}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <CompanyModal
        show={showCompanyModal}
        handleClose={() => setShowCompanyModal(false)}
        company={currentCompany}
        handleSave={handleSaveCompany}
      />
      <CompanydetailModal
        show={showCompanyModal1}
        handleClose={() => setShowCompanyModal1(false)}
        company={currentCompany}
        handleSave={() => {}}
      />
      <JobCategoryModal
        show={showCategoryModal}
        handleClose={() => setShowCategoryModal(false)}
        jobCategory={newCategory}
        handleSave={handleSaveJobCategory}
      />
      <ExperienceLevelModal
        show={showExperienceLevelModal}
        handleClose={() => setShowExperienceLevelModal(false)}
        experienceLevel={currentExperienceLevel}
        handleSave={handleSaveExperienceLevel}
      />
      <BenefitModal
        show={showBenefitModal}
        handleClose={() => setShowBenefitModal(false)}
        benefit={currentBenefit}
        handleSave={handleSaveBenefit}
      />
      <JobTagModal
        show={showJobTagModal}
        handleClose={() => setShowJobTagModal(false)}
        jobTag={currentJobTag}
        handleSave={handleSaveJobTag}
      />
      <JobPostingModal
        show={showJobPostingModal}
        handleClose={() => setShowJobPostingModal(false)}
        jobPosting={currentJobPosting}
        handleSave={handleSaveJobPosting}
        jobCategories={Array.isArray(jobCategories) ? jobCategories : []}
        experienceLevels={Array.isArray(experienceLevels) ? experienceLevels : []}
        tags={Array.isArray(jobTags) ? jobTags : []}
        benefits={Array.isArray(benefits) ? benefits : []}
        skills={Array.isArray(skills) ? skills : []}
        companies={Array.isArray(companies) ? companies : []}
      />
      <JobApplicationModal
  show={showJobApplicationModal}
  handleClose={() => setShowJobApplicationModal(false)}
  jobApplication={currentJobApplication}
  jobPostings={Array.isArray(jobPostings) ? jobPostings : []}
  handleSave={handleSaveJobApplication}
  token={token} // Ensure token is passed
/>
    </div>
  );
};

export default ManageJobs;