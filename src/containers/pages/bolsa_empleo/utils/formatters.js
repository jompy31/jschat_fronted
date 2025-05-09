export const getCompanyNameById = (id, companies) => {
  const company = companies.find((company) => company.id === id);
  return company ? company.name : "Desconocida";
};

export const getCategoryNameById = (id, jobCategories) => {
  const category = jobCategories.find((category) => category.id === id);
  return category ? category.name : "Desconocida";
};

export const getExperienceLevelNameById = (id, experienceLevels) => {
  const level = experienceLevels.find((level) => level.id === id);
  if (level) {
    switch (level.level) {
      case "Entry-level":
        return "Junior";
      case "Mid-level":
        return "Intermedio";
      case "Senior-level":
        return "Senior";
      case "Director":
        return "Director";
      case "Executive":
        return "Ejecutivo";
      default:
        return "Desconocido";
    }
  }
  return "Desconocido";
};

export const getSkillsByIds = (ids, skills) => {
  if (!Array.isArray(ids)) return "Ninguna";
  return (
    skills
      .filter((skill) => ids.includes(skill.id))
      .map((skill) => skill.name)
      .join(", ") || "Ninguna"
  );
};

export const getBenefitsByIds = (ids, benefits) => {
  if (!Array.isArray(ids)) return "Ninguno";
  return (
    benefits
      .filter((benefit) => ids.includes(benefit.id))
      .map((benefit) => benefit.name)
      .join(", ") || "Ninguno"
  );
};

export const getTagsByIds = (ids, jobTags) => {
  return (
    jobTags
      .filter((tag) => ids.includes(tag.id))
      .map((tag) => tag.name)
      .join(", ") || "Ninguna"
  );
};

export const getEmploymentType = (type) => {
  switch (type) {
    case "Full-time":
      return "Tiempo completo";
    case "Part-time":
      return "Medio tiempo";
    case "Contract":
      return "Contrato";
    case "Temporary":
      return "Temporal";
    case "Freelance":
      return "Freelance";
    default:
      return "Desconocido";
  }
};