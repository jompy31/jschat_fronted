import EmployeeDataService from "../../../../services/employee";

export const fetchAllData = async (token) => {
  try {
    const [
      jobResponse,
      companyResponse,
      categoryResponse,
      experienceResponse,
      skillsResponse,
      benefitsResponse,
      tagsResponse,
    ] = await Promise.all([
      EmployeeDataService.getAllJobPostings(token),
      EmployeeDataService.getAllCompanies(token),
      EmployeeDataService.getAllJobCategories(token),
      EmployeeDataService.getAllExperienceLevels(token),
      EmployeeDataService.getAllSkills(token),
      EmployeeDataService.getAllBenefits(token),
      EmployeeDataService.getAllJobTags(token),
    ]);

    return {
      jobPostings: jobResponse.data,
      companies: companyResponse.data,
      jobCategories: categoryResponse.data,
      experienceLevels: experienceResponse.data,
      skills: skillsResponse.data,
      benefits: benefitsResponse.data,
      jobTags: tagsResponse.data,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const createJobApplication = async (formData, token, id) => {
  try {
    await EmployeeDataService.createJobApplication(formData, token, id);
    alert("Su aplicación fue enviada con éxito.");
  } catch (error) {
    console.error("Error al crear aplicación:", error);
    alert(
      "Hubo un error al enviar su aplicación. Por favor, ingrese con su usuario e intente de nuevo."
    );
    throw error;
  }
};

export const deleteJobApplication = async (applicationjob, token, applicationid) => {
  try {
    await EmployeeDataService.deleteJobApplication(applicationjob, token, applicationid);
  } catch (error) {
    console.error("Error deleting job application:", error);
    throw error;
  }
};