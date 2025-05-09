export const filterUsers = (userList, searchTerm) => {
    return userList.filter((user) =>
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.staff_status &&
        user.staff_status.trim() !== '' &&
        user.staff_status.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };