import TodoDataService from "../../../../services/todos";

export const validateLead = (lead) => {
  const requiredFields = ["name", "email", "description", "priority", "status", "number"];
  for (const field of requiredFields) {
    if (!lead[field]) {
      alert(`Por favor ingrese el ${field}.`);
      return false;
    }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(lead.email)) {
    alert("Formato de correo inválido.");
    return false;
  }
  return true;
};

export const convertToCSV = async (data, fields, token) => {
  const columns = fields.filter((key) => key !== "lastComment").concat("comments");
  const header = columns.join(";");

  const rows = [];
  for (const lead of data) {
    const commentsResponse = await TodoDataService.getLeadComments(lead.id, token);
    const row = columns.map((column) => {
      if (column === "comments") {
        return commentsResponse.data.map((commentObj) => commentObj.comment).join(", ");
      } else if (typeof lead[column] === "object" && lead[column] !== null) {
        return JSON.stringify(lead[column]);
      } else {
        return lead[column] || "";
      }
    });
    rows.push(row.join(";"));
  }

  return header + "\n" + rows.join("\n");
};

export const initialLeadState = {
  name: "",
  email: "",
  description: "",
  number: "",
  priority: "",
  status: "nuevo",
  company_address: "",
  brand_category: "",
  brand_description: "",
  brand_differentiation: "",
  brand_necessity: "",
  brand_perception_keywords: "",
  brand_personality: "",
  brand_slogan_or_motto: "",
  brand_style_preference: "",
  brand_values: "",
  brand_virtues: "",
  business_experience_duration: "",
  business_type: "",
  colors: "",
  commercial_information_details: "",
  company_logo: null,
  company_name: "",
  company_website_or_social_media: "",
  contact_person_name: "",
  contact_person_phone: "",
  contact_person_position: "",
  contact_reason: "",
  current_business_goals: "",
  main_competitors: "",
  opening_hours_location_maps: "",
  payment_information: "",
  payment_method: "",
  target_age_range: "",
  target_gender: "",
  target_interests: "",
  target_lifecycle_stage: "",
  target_socioeconomic_level: "",
  commercial_activity: "",
};