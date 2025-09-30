// frontend/src/components/backend/users/utils/fetchUserList.js
import TodoDataService from '../../../../services/todos';
import { toast } from 'react-toastify';

export const fetchUserList = async (token, setUserList, setStoredData) => {
  try {
    const response = await TodoDataService.getUserList(token);
    console.log("usuarios", response.data.results)
    // Aplanar los datos para que UserTable pueda usarlos directamente
    const transformedData = response.data.results.map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      staff_status: user.userprofile?.staff_status || 'customer', // Acceder a userprofile
      created_at: user.created_at || new Date().toISOString(), // Valor por defecto si no existe
      phone_number: user.userprofile?.phone_number || '',
      address: user.userprofile?.address || '',
      profile_picture: user.userprofile?.profile_picture || null
    }));
    setUserList(transformedData);
    setStoredData(transformedData);
    if (transformedData.length === 0) {
      toast.info('No se encontraron usuarios.');
    }
  } catch (error) {
    console.error('Error al obtener la lista de usuarios:', error);
    toast.error('Error al cargar la lista de usuarios');
    setUserList([]);
    setStoredData([]);
  }
};