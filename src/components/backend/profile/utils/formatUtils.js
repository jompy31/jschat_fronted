import moment from "moment";

export const formatUserData = (editedUser, profile_picture) => {
  const formattedDateOfBirth = moment(editedUser.date_of_birth).format("YYYY-MM-DD");
  const formattedPhoneNumber = editedUser.phone_number.replace(/\D/g, "");
  const formattedCompany = editedUser.company.trim();
  const formattedUserSummary = editedUser.user_summary ? editedUser.user_summary.trim() : "";

  const updatedUser = {
    first_name: editedUser.first_name,
    last_name: editedUser.last_name,
    email: editedUser.email,
    staff_status: editedUser.staff_status,
    address: editedUser.address,
    phone_number: formattedPhoneNumber,
    company: formattedCompany,
    openwork: editedUser.openwork,
    bio: formattedUserSummary,
    date_of_birth: formattedDateOfBirth,
  };

  const formData = new FormData();
  for (const key in updatedUser) {
    if (updatedUser.hasOwnProperty(key)) {
      formData.append(key, updatedUser[key]);
    }
  }
  if (profile_picture) {
    formData.append("profile_picture", profile_picture);
  }

  return formData;
};