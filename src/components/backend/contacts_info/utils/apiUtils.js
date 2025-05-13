import TodoDataService from "../../../../services/todos";

export const loadLeads = async (token) => {
  try {
    const response = await TodoDataService.getAllLeads(token);
    return response.data.map((lead) => ({
      ...lead,
      lastComment: lead.comments?.length > 0 ? lead.comments[lead.comments.length - 1] : null,
    }));
  } catch (error) {
    console.error("Error loading leads:", error);
    throw error;
  }
};

export const createLead = async (leadData, token) => {
  const formData = new FormData();
  for (const key in leadData) {
    if (leadData.hasOwnProperty(key)) formData.append(key, leadData[key]);
  }
  if (leadData.company_logo) formData.append("company_logo", leadData.company_logo);
  return TodoDataService.createLead(formData, token);
};

export const updateLead = async (id, leadData, token) => {
  const formData = new FormData();
  for (const key in leadData) {
    if (leadData.hasOwnProperty(key)) formData.append(key, leadData[key]);
  }
  if (leadData.company_logo && typeof leadData.company_logo === "string" && leadData.company_logo.startsWith("http")) {
    const logoFile = await urlToFile(leadData.company_logo, "logo.jpg");
    formData.append("company_logo", logoFile);
  } else if (leadData.company_logo && leadData.company_logo instanceof File) {
    formData.append("company_logo", leadData.company_logo);
  }
  return TodoDataService.updateLead(id, formData, token);
};

const urlToFile = async (url, filename) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

export const deleteLead = async (id, token) => {
  return TodoDataService.deleteLead(id, token);
};

export const createComment = async (leadId, comment, token) => {
  const commentData = { lead: leadId, comment };
  return TodoDataService.createCommentlead(commentData, token);
};

export const getLeadComments = async (leadId, token) => {
  return TodoDataService.getLeadComments(leadId, token);
};

export const deleteComment = async (leadId, commentId, token) => {
  return TodoDataService.deleteCommentContact(leadId, commentId, token);
};