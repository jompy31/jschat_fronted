import React, { useEffect, useState } from "react";
import {
  FaBath,
  FaBed,
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import "./22modal.css";
import apiService from "../../../services/Tourism";
import { useSelector } from "react-redux";
import TodoDataService from "../../../services/todos";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PropertyModal = ({ property, onClose }) => {
  const token = useSelector((state) => state.authentication.token);
  const user = useSelector((state) => state.authentication.user);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentImage, setCurrentImage] = useState(property.images[0].image);
  const [userList, setUserList] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showMap, setShowMap] = useState(false); // Estado para manejar la visualización del mapa

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const pricePerNight = property.price_per_night;
  const totalAmount = numberOfDays * pricePerNight;

  useEffect(() => {
    fetchReviews();
    fetchUserList();
    fetchBookings();
  }, [property]);

  const fetchBookings = async () => {
    try {
      const response = await apiService.getAllBookings(token);

      // Filtrar las reservas para incluir solo las que coinciden con el id de la propiedad actual
      const filteredBookings = response.data.filter(
        (booking) => booking.property === property.id
      );

      setBookings(filteredBookings);
      // console.log("Filtered bookings", filteredBookings);
      // console.log("Current property", property);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await apiService.getAllReviews(token);
      const filteredReviews = response.data.filter(
        (review) => review.property === property.id
      );
      setReviews(filteredReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchUserList = () => {
    TodoDataService.getUserList(token)
      .then((response) => {
        setUserList(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getUserDetails = (userId) => {
    return userList.find((user) => user.id === userId);
  };

  const ownerDetails = getUserDetails(property.owner);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    console.log("currentUSer", currentUser);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      console.log("usuario seteado", user)
    }
  }, []);

  const handleReserve = async () => {
    // Verificar si el usuario está autenticado
    if (!token) {
      alert("Necesitas autenticarse para poder reservar una habitación.");
      return; // Detener la ejecución si no hay token
    }

    // Verificar si se han proporcionado las fechas de check-in y check-out
    if (!checkInDate || !checkOutDate) {
      alert("Debes ingresar las fechas de check-in y check-out.");
      return; // Detener la ejecución si falta alguna fecha
    }
    console.log("turismo", property)
    // Verificar si las fechas seleccionadas ya están reservadas
    const isOverlap = bookings.some((booking) => {
      const bookingStart = new Date(booking.check_in);
      const bookingEnd = new Date(booking.check_out);
      return (checkInDate >= bookingStart && checkInDate <= bookingEnd) ||
        (checkOutDate >= bookingStart && checkOutDate <= bookingEnd) ||
        (checkInDate <= bookingStart && checkOutDate >= bookingEnd);
    });

    if (isOverlap) {
      alert(`Las fechas deseadas (${checkInDate.toLocaleDateString()} - ${checkOutDate.toLocaleDateString()}) ya tienen una reserva dentro de las fechas, valide el mapa de reservas y vuelva a reservar.`);
      return; // Detener la ejecución si hay un conflicto de fechas
    }

    // Formatear las fechas para enviarlas al servidor
    const formattedCheckInDate = checkInDate.toISOString().split("T")[0];
    const formattedCheckOutDate = checkOutDate.toISOString().split("T")[0];

    // Construir el mensaje para WhatsApp
    const message = `
      ¡Reserva confirmada!
      Propiedad: ${property.id} - ${property.title}
      Usuario: ${currentUser.email}
      Fechas: ${formattedCheckInDate} - ${formattedCheckOutDate}
      Monto total: ₡${totalAmount}
    `;

    // Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);

    // Enviar el mensaje a WhatsApp (al número 87886767)
    const whatsappUrl = `https://wa.me/50687886767?text=${encodedMessage}`;

    // Redirigir al usuario a la URL de WhatsApp
    window.open(whatsappUrl, "_blank");
  };


  const isDateReserved = (date) => {
    return bookings.some((booking) => {
      const bookingStart = new Date(booking.check_in);
      const bookingEnd = new Date(booking.check_out);
      return date >= bookingStart && date <= bookingEnd;
    });
  };
  const handleShowMap = () => {
    if (!token) {
      alert("Para ver la ubicación, tienes que iniciar sesión.");
      return;
    }
    setShowMap(!showMap);
  };

  if (!property) return null;

  return (
    <div className="modal">
      <div className="modal-content" style={{ overflowY: "auto" }}>
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="property-title1">{property.title}</h2>
        <div className="image-gallery">
          <img
            className="main-image"
            src={currentImage}
            alt={`Imagen de ${property.title}`}
          />
          <div className="thumbnails">
            {property.images?.length > 0 && property.images.map((img, index) => (
              <img
                key={index}
                src={img.image}
                alt={`Imagen ${index + 1} de ${property.title}`}
                onClick={() => setCurrentImage(img.image)}
                className="thumbnail"
              />
            ))}

          </div>
        </div>
        <h3 className="property-type">{property.property_type}</h3>
        <h3 className="description-title">Descripción:</h3>
        <p className="description">{property.description}</p>
        <p className="price">
          <strong>Precio por noche:</strong> ₡{property.price_per_night}{" "}
          <span style={{ color: "green", fontSize: "0.8em" }}>
            (${(property.price_per_night * 540).toLocaleString()})
          </span>
        </p>

        <div className="property-details-container">
          <div className="property-details">
            <p className="detail">
              <FaBath /> {property.bathrooms} Baños
            </p>
            <p className="detail">
              <FaBed /> {property.bedrooms} Habitaciones
            </p>
            <p className="detail">
              <FaMapMarkerAlt />
              Ubicación:
              <button
                className="reserve-button"
                onClick={() => handleShowMap()}
              >
                Ver en mapa
              </button>
            </p>

            <p className="detail">
              <FaStar className="star-icon" /> Valoración: {property.rating} / 5
            </p>
          </div>

          <h3 className="property-title">Lo que este lugar ofrece:</h3>
          <ul className="amenities-list">
            {property.amenities?.length > 0 && property.amenities.map((amenity, index) => (
              <li key={index} className="amenity-item">
                <FaCheckCircle /> {amenity.name}
              </li>
            ))}

          </ul>
        </div>
        {showMap && (
          <div className="map-container">
            <h3>Mapa de Ubicación</h3>
            <iframe
              title="Mapa"
              src={property.location}
              style={{
                width: "100%",
                height: "300px",
                border: "none",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setShowMap(false)}
              className="reserve-button"
            >
              Cerrar Mapa
            </button>
          </div>
        )}

        <div className="reservation-section">
          <h3 className="reservation-title">Reservar ahora</h3>
          <div className="reservation-fields">
            <div className="calendar">
              <label>Check-in:</label>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => {
                  setCheckInDate(date);

                  // Verifica que la fecha no sea nula
                  if (date && checkOutDate) {
                    const days = Math.ceil(
                      (checkOutDate - date) / (1000 * 60 * 60 * 24)
                    );
                    setNumberOfDays(days > 0 ? days : 1);
                  } else {
                    setNumberOfDays(0); // O establecer a 1 o un valor por defecto si es necesario
                  }
                }}
                dateFormat="dd/MM/yyyy"
                inline
                filterDate={(date) => !isDateReserved(date)}
                dayClassName={(date) =>
                  isDateReserved(date) ? "reserved-date" : undefined
                }
              />
            </div>
            <div className="calendar">
              <label>Check-out:</label>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => {
                  setCheckOutDate(date);

                  // Verifica que la fecha no sea nula
                  if (date && checkInDate) {
                    const days = Math.ceil(
                      (date - checkInDate) / (1000 * 60 * 60 * 24)
                    );
                    setNumberOfDays(days > 0 ? days : 1);
                  } else {
                    setNumberOfDays(0); // O establecer a 1 o un valor por defecto si es necesario
                  }
                }}
                dateFormat="dd/MM/yyyy"
                inline
                filterDate={(date) => !isDateReserved(date)}
                dayClassName={(date) =>
                  isDateReserved(date) ? "reserved-date" : undefined
                }
              />
            </div>

            <div>
              <label style={{ color: "black", fontSize: "1.2em" }}>
                Fecha de entrada:
              </label>
              <input
                type="date"
                value={
                  checkInDate ? checkInDate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => {
                  const value = e.target.value; // Obtiene el valor del input
                  const date = value ? new Date(value) : null; // Verifica si hay un valor antes de crear el objeto Date
                  setCheckInDate(date); // Establece la fecha de entrada
                  if (date && checkOutDate) {
                    const days = Math.ceil(
                      (checkOutDate - date) / (1000 * 60 * 60 * 24)
                    );
                    setNumberOfDays(days > 0 ? days : 1);
                  } else {
                    setNumberOfDays(0); // O establecer a 1 o un valor por defecto si es necesario
                  }
                }}
              />
              <label style={{ color: "black", fontSize: "1.2em" }}>
                Fecha de salida:
              </label>
              <input
                type="date"
                value={
                  checkOutDate ? checkOutDate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => {
                  const value = e.target.value; // Obtiene el valor del input
                  const date = value ? new Date(value) : null; // Verifica si hay un valor antes de crear el objeto Date
                  setCheckOutDate(date); // Establece la fecha de salida
                  if (date && checkInDate) {
                    const days = Math.ceil(
                      (date - checkInDate) / (1000 * 60 * 60 * 24)
                    );
                    setNumberOfDays(days > 0 ? days : 1);
                  } else {
                    setNumberOfDays(0); // O establecer a 1 o un valor por defecto si es necesario
                  }
                }}
              />

              <div className="days-input">
                <label style={{ color: "black", fontSize: "1.2em" }}>
                  Cantidad de días:
                </label>
                <input
                  type="number"
                  value={numberOfDays}
                  onChange={(e) => setNumberOfDays(Number(e.target.value))}
                  min="1"
                />
                <p className="total-amount">
                  <strong>Monto Total:</strong> ₡{totalAmount}
                </p>
                <button className="reserve-button" onClick={handleReserve}>
                  Reservar
                </button>
              </div>
            </div>
          </div>
        </div>

        <h3 className="reviews-title">Reseñas:</h3>
        {reviews.length > 0 ? (
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th style={{ color: "black" }}>Nombre</th>
                <th style={{ color: "black" }}>Reseña</th>
                <th style={{ color: "black" }}>Calificación</th>
                <th style={{ color: "black" }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {(showAllReviews ? reviews : reviews.slice(0, 4)).map(
                (review, index) => {
                  const user = userList.find((u) => u.id === review.user);
                  return (
                    <tr key={index}>
                      <td>
                        {user && (
                          <img
                            src={user.profile_picture}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="user-profile-picture"
                          />
                        )}
                      </td>
                      <td>
                        {user
                          ? `${user.first_name} ${user.last_name}`
                          : "Usuario desconocido"}
                      </td>
                      <td className="review-comment">{review.comment}</td>
                      <td>{review.rating} / 5</td>
                      <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        ) : (
          <p>No hay reseñas para esta propiedad.</p>
        )}

        {reviews.length > 4 && !showAllReviews && (
          <button
            className="see-all-reviews"
            onClick={() => setShowAllReviews(true)}
          >
            Ver todas las {reviews.length} reseñas
          </button>
        )}
        {showAllReviews && (
          <button
            className="hide-reviews"
            onClick={() => setShowAllReviews(false)}
          >
            Ocultar reseñas
          </button>
        )}

        {ownerDetails && (
          <div className="owner-info">
            <h3>Información del Anfitrión:</h3>
            <div className="owner-info-card">
              <table className="owner-info-table">
                <tbody>
                  <tr>
                    <td colSpan="2" className="owner-profile-cell">
                      {ownerDetails.profile_picture && (
                        <img
                          src={ownerDetails.profile_picture}
                          alt={`Foto de ${ownerDetails.first_name}`}
                          className="owner-profile-picture"
                        />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="owner-name">{`${ownerDetails.first_name} ${ownerDetails.last_name}`}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="owner-response-time">
                      Responde en menos de {property.owner_response_time} horas
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyModal;
