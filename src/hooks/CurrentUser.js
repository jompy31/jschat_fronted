import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TodoDataService from '../services/todos';
import Gif from '../assets/imagenes/abcupon.jpeg';

const UserList1 = (props) => {
  const [userList, setUserList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getUserList = () => {
    if (props.token) {
      TodoDataService.getUserList(props.token)
        .then((response) => {
          setUserList(response.data);
          // console.log("usuarios", response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  useEffect(() => {
    getUserList();
  }, [props.token]);

  useEffect(() => {
    if (userList.length > 0 && props.user) {
      const foundUser = userList.find((user) => user.email === props.user);
      setCurrentUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    }
  }, [userList, props.user]);

    useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 4000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const containerStyle = {
    background: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    borderRadius: '10px',
    height: '80vh',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '46%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'black',
  };

  const titleStyle = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    marginTop: "4%",
    textAlign: 'center',
  };

  const profileImageStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    border: '3px solid red',
    boxShadow: '0 0 10px black',
    marginBottom: '20px',
  };

  return (
    <div id="loading-bg">
      <div className="loading-logo">
        <img src={require('../assets/imagenes/abcupon.jpeg')} height="50" alt="Logo" />
        
        <div style={containerStyle}>
          <h1 style={titleStyle}>Bienvenido a ABCupon.com</h1>
          {currentUser && currentUser.profile_picture && (
            <img 
              src={currentUser.profile_picture} 
              alt="Perfil" 
              style={profileImageStyle} 
            />
          )}
          {currentUser ? (
            <table>
              <tbody>
                <tr>
                  <td><strong>Nombre:</strong></td>
                  <td>{currentUser.first_name || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Apellidos:</strong></td>
                  <td>{currentUser.last_name || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Correo Electrónico:</strong></td>
                  <td>{currentUser.email || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Rol de Usuario:</strong></td>
                  <td>{currentUser.staff_status || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Teléfono:</strong></td>
                  <td>{currentUser.phone_number || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Compañía:</strong></td>
                  <td>{currentUser.company || 'N/A'}</td>
                </tr>
                
                <tr>
                  <td><strong>Fecha de Nacimiento:</strong></td>
                  <td>{currentUser.date_of_birth || 'N/A'}</td>
                </tr>
                {/* <tr>
                  <td><strong>País:</strong></td>
                  <td>{currentUser.country || 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Dirección:</strong></td>
                  <td>{currentUser.address || 'N/A'}</td>
                </tr> */}
                {/* <tr>
                  <td><strong>Biografía:</strong></td>
                  <td>{currentUser.bio || 'N/A'}</td>
                </tr> */}
              </tbody>
            </table>
          ) : (
            <p>Usuario no encontrado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList1;
