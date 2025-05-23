import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import JobCard from "./components/JobCard";
import JobFilter from "./components/JobFilter";
import JobModal from "./components/JobModal";
import CategorySidebar from "./components/CategorySidebar";
import PaginationControls from "./components/PaginationControls";
import JobApplicationModal from "./components/JobApplicationModal";
import { fetchAllData, createJobApplication } from "./utils/api";
import EmployeeDataService from "../../../services/employee";
import { JOBS_PER_PAGE } from "./utils/constants";
import image2 from "../../../assets/categorias/2.webp";
import image1 from "../../../assets/categorias/25.webp";

const BolsaEmpleo = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({ count: 0, next: null, previous: null });
  const [companies, setCompanies] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [skills, setSkills] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [jobTags, setJobTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobApplicationModal, setShowJobApplicationModal] = useState(false);
  const [currentJobApplication, setCurrentJobApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const token = useSelector((state) => state.authentication.token);
  const user = useSelector((state) => state.authentication.user);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });
  const navigate = useNavigate();

  const handleSaveJobApplication = async (jobApplication) => {
    if (!user || user.trim() === "") {
      alert("Por favor, ingrese con su usuario e intente de nuevo.");
      setTimeout(() => navigate("/login"), 3000);
      return;
    }
    jobApplication.formData.append("applicant", user);
    const id = jobApplication.formData.get("id");
    try {
      await createJobApplication(jobApplication.formData, token, id);
    } catch (error) {
      console.error("Error al enviar aplicación:", error);
    }
  };

  const handleCloseAllModals = () => {
    setShowModal(false);
    setShowJobApplicationModal(false);
    setSelectedJob(null);
    setSelectedCompany(null);
    setCurrentJobApplication(null);
  };

  const fetchJobsByPage = async (page) => {
    setLoading(true);
    try {
      const response = await EmployeeDataService.getAllJobPostings(token, { params: { page } });
      setJobPostings(response.data.results || response.data);
      setFilteredJobs(response.data.results || response.data);
      setPaginationData({
        count: response.data.count || response.data.length,
        next: response.data.next || null,
        previous: response.data.previous || null,
      });
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchAllData(token);
        setJobPostings(data.jobPostings);
        setFilteredJobs(data.jobPostings);
        setPaginationData(data.jobPagination);
        setCompanies(data.companies);
        setJobCategories(data.jobCategories);
        setExperienceLevels(data.experienceLevels);
        setSkills(data.skills);
        setBenefits(data.benefits);
        setJobTags(data.jobTags);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchJobsByPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    let filtered = jobPostings;
    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter((job) => job.category === selectedCategory);
    }
    setFilteredJobs(filtered);
  }, [searchTerm, jobPostings, selectedCategory]);

  const handleShowModal = (job) => {
    const company = companies.find((company) => company.id === job.company);
    setSelectedCompany(company);
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setCurrentPage(1);
  };

  return (
    <div
      className="job-listing-container"
      style={{ marginTop: isMobile ? "30%" : "8%", zoom: isMobile ? "40%": isMini ? "10%" : "100%", marginBottom: isMobile ? "40%": isMini ? "10%" : "0%"}}
    >
      
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          marginLeft: "5.3%",
          gap: isMobile ? "2vh" : "5vh",
        }}
      >
        <img
          src={image1}
          alt="Imagen 1"
          style={{
            maxWidth: isMobile ? "25%" : "50%",
            maxHeight: "10vh",
            objectFit: "cover",
          }}
        />
        <img
          src={image2}
          alt="Imagen 2"
          style={{
            maxWidth: isMobile ? "25%" : "50%",
            maxHeight: "10vh",
            objectFit: "cover",
          }}
        />
        <JobFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div style={{ display: "flex", width: "100%", height: "70vh", lineHeight: "1.5" }}>
        <CategorySidebar
          jobCategories={jobCategories}
          selectedCategory={selectedCategory}
          handleCategorySelect={handleCategorySelect}
          isMobile={isMobile}
        />
        <div
          style={{
            width: "70%",
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            rowGap: "10px",
            columnGap: "20px",
            gap: "20px",
            alignItems: "start",
          }}
        >
          {loading ? (
            <div
              style={{
                gridColumn: "span 2",
                textAlign: "center",
                fontSize: "1.0em",
                color: "#777",
              }}
            >
              Cargando empleos...
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                companies={companies}
                experienceLevels={experienceLevels}
                skills={skills}
                handleShowModal={handleShowModal}
              />
            ))
          ) : (
            <div
              style={{
                gridColumn: "span 2",
                textAlign: "center",
                fontSize: "1.0em",
                color: "#777",
              }}
            >
              Actualmente no hay empleos disponibles
            </div>
          )}
        </div>
      </div>

      <PaginationControls
        totalJobs={paginationData.count}
        jobsPerPage={JOBS_PER_PAGE}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      
      />

      <JobModal
        show={showModal}
        handleClose={handleCloseAllModals}
        selectedJob={selectedJob}
        selectedCompany={selectedCompany}
        isMobile={isMobile}
        isMini={isMini}
        skills={skills}
        benefits={benefits}
        jobTags={jobTags}
        setShowJobApplicationModal={setShowJobApplicationModal}
      />

      <JobApplicationModal
        show={showJobApplicationModal}
        handleClose={handleCloseAllModals}
        jobApplication={currentJobApplication}
        jobPostings={jobPostings}
        selectedJob={selectedJob}
        handleSave={handleSaveJobApplication}
      />
    </div>
  );
};

export default BolsaEmpleo;