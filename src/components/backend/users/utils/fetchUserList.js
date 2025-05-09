import TodoDataService from '../../../../services/todos';

export const fetchUserList = async (token, setUserList, setStoredData) => {
  try {
    const response = await TodoDataService.getUserList(token);
    setUserList(response.data);
    setStoredData(response.data);
  } catch (e) {
    console.log(e);
  }
};