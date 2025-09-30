export const formatUserData = (editedUser, profile_picture) => {
  if (profile_picture) {
    const formData = new FormData();
    formData.append("first_name", editedUser.first_name || "");
    formData.append("last_name", editedUser.last_name || "");
    formData.append("email", editedUser.email || "");
    formData.append("userprofile.staff_status", editedUser.userprofile?.staff_status || "customer");
    formData.append("userprofile.phone_number", editedUser.userprofile?.phone_number || "");
    formData.append("userprofile.address", editedUser.userprofile?.address || "");
    formData.append("userprofile.profile_picture", profile_picture);
    return formData;
  } else {
    return {
      first_name: editedUser.first_name || "",
      last_name: editedUser.last_name || "",
      email: editedUser.email || "",
      userprofile: {
        staff_status: editedUser.userprofile?.staff_status || "customer",
        phone_number: editedUser.userprofile?.phone_number || "",
        address: editedUser.userprofile?.address || "",
      },
    };
  }
};