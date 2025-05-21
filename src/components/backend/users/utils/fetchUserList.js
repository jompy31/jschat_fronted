import TodoDataService from '../../../../services/todos';

export const fetchUserList = (token, setUserList, setStoredData) => {
  TodoDataService.getUserList(token)
    .then((response) => {
      // Extract the 'results' array from the paginated response
      const users = response.data.results || response.data;
      setUserList(users);
      setStoredData(users);
    })
    .catch((e) => {
      console.error('Error fetching user list:', e);
    });
};