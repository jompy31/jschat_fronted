import React, { useState, useEffect } from "react";
import * as math from "mathjs";
import "./Cotizador.css";
import { useMediaQuery } from "react-responsive";

const Cotizador = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState(12);
  const [interes, setInteres] = useState(0);
  const [cuotaMensual, setCuotaMensual] = useState(0);
  const [mostrarTabla, setMostrarTabla] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tasaInteres, setTasaInteres] = useState(0);
  const [tipoInmueble, setTipoInmueble] = useState("Inmueble tipo #1");
  const [garantia, setGarantia] = useState("Hipoteca");
  const [interesSeleccionado, setInteresSeleccionado] = useState("");
  const [datosPrestamo, setDatosPrestamo] = useState([]);
  const [interesPersonalizado, setInteresPersonalizado] = useState("");
  const [usarInteresesPropios, setUsarInteresesPropios] = useState(false);
  const [tablaHtml, setTablaHtml] = useState("");
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isMini = useMediaQuery({ query: "(max-width: 340px)" });
  const tablaIntereses = [
    {
      tipo: "Privado solo intereses",
      monto: 1000000,
      interes: 2.959,
      plazo: "1 a 3 años",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #1",
    },
    {
      tipo: "Privado solo intereses",
      monto: 3000000,
      interes: 2.959,
      plazo: "1 a 3 años",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #1",
    },
    {
      tipo: "Privado solo intereses",
      monto: 5000000,
      interes: 2.959,
      plazo: "1 a 3 años",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #1",
    },
    {
      tipo: "Privado solo intereses",
      monto: 10000000,
      interes: 2.959,
      plazo: "1 a 3 años",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #1",
    },
    {
      tipo: "Privado cuota amortizable",
      monto: 1000000,
      interes: 2.959,
      plazo: "7 años",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #1",
    },
    {
      tipo: "Privado cuota amortizable",
      monto: 5000000,
      interes: 2.959,
      plazo: "7 años",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #1",
    },
    {
      tipo: "Privado solo intereses",
      monto: 10000000,
      interes: 2.0,
      plazo: "1 año",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #2",
    },
    {
      tipo: "Privado solo intereses",
      monto: 15000000,
      interes: 2.0,
      plazo: "1 año",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #2",
    },
    {
      tipo: "Privado solo intereses",
      monto: 20000000,
      interes: 2.0,
      plazo: "1 año",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #2",
    },
    {
      tipo: "Privado cuota amortizable",
      monto: 1000000,
      interes: 2.5,
      plazo: "7 años",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #2",
    },
    {
      tipo: "Privado cuota amortizable",
      monto: 5000000,
      interes: 2.5,
      plazo: "7 años",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #2",
    },
    {
      tipo: "Privado solo intereses",
      monto: 50000000,
      interes: 1.5,
      plazo: "1 año",
      garantia: "Hipoteca",
      inmuebleTipo: "Inmueble tipo #3",
    },
    {
      tipo: "Privado solo intereses",
      monto: 50000000,
      interes: 1.25,
      plazo: "1 año",
      garantia: "Fideicomiso",
      inmuebleTipo: "Inmueble tipo #3",
    },
  ];
  const mostrarAlerta = (mensaje) => {
    alert(mensaje);
  };
  const calcularCuota = () => {
    // Verifica que todos los campos estén llenos
    // if (!nombre) {
    //   mostrarAlerta("Ingrese el nombre por favor");
    //   return;
    // }

    if (!monto) {
      mostrarAlerta("Ingrese correctamente el monto por favor");
      return;
    }

    if (!plazo) {
      mostrarAlerta("Ingrese correctamente el plazo por favor");
      return;
    }

    // Convierte los valores de monto y plazo a números
    let tipoInmueble = "";
    let garantia = "";
    // Convierte el interés seleccionado a número
    // Convierte el interés seleccionado a número
    let tasaInteresValue = 0;

    if (usarInteresesPropios) {
      // Utilizar interés personalizado si se selecciona
      if (!interesPersonalizado) {
        mostrarAlerta("Ingrese el interés personalizado por favor");
        return;
      }
      tasaInteresValue = parseFloat(interesPersonalizado);
    } else {
      // Utilizar interés predefinido si no se selecciona el personalizado
      if (!interesSeleccionado) {
        mostrarAlerta("Seleccione el interés por favor");
        return;
      }
      tasaInteresValue = parseFloat(interesSeleccionado);
    }

    // Set tasaInteres en state
    setTasaInteres(tasaInteresValue);

    // Calcular la cuota mensual
    const tasaInteresMensual = tasaInteresValue / 100 / 12; //Anual
    // const tasaInteresMensual = (tasaInteresValue / 100); //Mensual
    const cuota =
      (monto * (tasaInteresMensual * Math.pow(1 + tasaInteresMensual, plazo))) /
      (Math.pow(1 + tasaInteresMensual, plazo) - 1);

    // Calcular intereses y capital pagados en cada período
    let interesesPagados = 0;
    let capitalPagado = 0;
    let saldoPendiente = monto;
    const datosPrestamo = [];

    for (let periodo = 1; periodo <= plazo; periodo++) {
      const interesPrestamo = saldoPendiente * tasaInteresMensual;
      const capitalPrestamo = cuota - interesPrestamo;
      saldoPendiente -= capitalPrestamo;

      datosPrestamo.push({
        periodo,
        cuota: Math.round(cuota / 100) * 100,
        interes: Math.round(interesPrestamo / 100) * 100,
        capital: Math.round(capitalPrestamo / 100) * 100,
        saldo: Math.round(saldoPendiente / 100) * 100,
      });
    }

    // Actualizar el estado de cuota mensual y mostrar la tabla
    setCuotaMensual(Math.round(cuota / 100) * 100);
    setMostrarTabla(true);
    setDatosPrestamo(datosPrestamo); // Agregado para guardar los datos en el estado
  };
  const mostrarListaIntereses = () => {
    setMostrarModal(true);
    setInteresSeleccionado("");
  };
  useEffect(() => {
    mostrarListaIntereses();
  }, []); 

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const handleInteresCheckboxChange = () => {
    setUsarInteresesPropios(!usarInteresesPropios);
  };

  const generarContenidoTabla = () => {
    let contenido = `
      <table>
        <thead>
          <tr>
            <th>Mensualidad</th>
            <th>Cuota Mensual</th>
            <th>Interés Pagado</th>
            <th>Capital Pagado</th>
            <th>Saldo Pendiente</th>
          </tr>
        </thead>
        <tbody>
          ${datosPrestamo
        .map(
          (item) => `
              <tr key=${item.periodo}>
                <td>${item.periodo}</td>
                <td>${item.cuota}</td>
                <td>${item.interes}</td>
                <td>${item.capital}</td>
                <td>${item.saldo}</td>
              </tr>`
        )
        .join("")}
          <tr style="background: red; color: white; font-weight: bold;">
            <td>Total:</td>
            <td>${datosPrestamo.reduce(
          (total, item) => total + item.cuota,
          0
        )}</td>
            <td>${datosPrestamo.reduce(
          (total, item) => total + item.interes,
          0
        )}</td>
            <td>${datosPrestamo.reduce(
          (total, item) => total + item.capital,
          0
        )}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    `;
    return contenido;
  };


  useEffect(() => {
    // Actualizar el estado de la tabla HTML cada vez que se recalcula la tabla
    setTablaHtml(generarContenidoTabla());
  }, [datosPrestamo]);

  const formatNumber = (value) => {
    // Formatear el número solo para la visualización
    return parseFloat(value).toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleInputChange = (e) => {
    const input = e.target.value.replace(/[^\d]/g, ""); // Eliminar no dígitos
    setMonto(input);
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "4%",
        border: "2px solid red",
        boxShadow: "0 0 10px black",
      }}
    >
      <h2
        style={{
          color: "red",
          fontWeight: "bold",
          textShadow: "2px 2px 4px #000", // Sombra roja
        }}
      >
        Calculadora abierta de Creditos
      </h2>
      {/* <div>
        <label>
          <strong>Nombre:</strong>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              padding: "5px",
              margin: "5px",
            }}
          />
        </label>
      </div> */}

      <div>
        <label>
          <strong>Monto a requerir:</strong>
          <input
            type="text"
            value={parseInt(monto).toLocaleString("en-US")}
            onChange={handleInputChange}
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              padding: "5px",
              margin: "5px",
            }}
          />
        </label>
      </div>

      <div>
        <label>
          <strong>Plazo:</strong>
          <select
            value={plazo}
            onChange={(e) => setPlazo(e.target.value)}
            style={{
              border: "1px solid black",
              borderRadius: "5px",
              padding: "5px",
              margin: "5px",
            }}
          >
            {/* Opciones de plazo */}
            <option value="12">12 meses</option>
            <option value="18">18 meses</option>
            <option value="24">2 años</option>
            <option value="36">3 años</option>
            <option value="48">4 años</option>
            <option value="60">5 años</option>
            <option value="72">6 años</option>
            <option value="84">7 años</option>
            <option value="96">8 años</option>
            <option value="108">9 años</option>
            <option value="120">10 años</option>
            <option value="180">15 años</option>
            <option value="240">20 años</option>
            <option value="300">25 años</option>
            <option value="360">30 años</option>
          </select>
        </label>
      </div>
      <label>
        <strong>Interes Anual</strong>
        <div>
          <input
            type="checkbox"
            id="usarInteresesPropios"
            checked={usarInteresesPropios}
            onChange={handleInteresCheckboxChange}
          />
          <label htmlFor="usarInteresesPropios">Interes Personalizado</label>

          {usarInteresesPropios ? (
            <input
              type="text"
              placeholder="Ingrese el interés deseado"
              value={interesPersonalizado}
              onChange={(e) => setInteresPersonalizado(e.target.value)}
              style={{
                border: "1px solid black",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
              }}
            />
          ) : (
            <select
              value={interesSeleccionado}
              onChange={(e) => setInteresSeleccionado(e.target.value)}
              style={{
                border: "1px solid black",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
              }}
            >
              <option value="">Seleccione...</option>
              {tablaIntereses.map((item, index) => (
                <option key={index} value={item.interes}>
                  {item.interes}%
                </option>
              ))}
            </select>
          )}
        </div>
      </label>

      {/* {interesSeleccionado && (
        <p style={{ marginTop: "10px" }}>
          Interés seleccionado: {interesSeleccionado}%
        </p>
      )} */}
      <div>
        <button
          onClick={calcularCuota}
          style={{
            backgroundColor: "red",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #ff4444",
            borderRadius: "5px",
            padding: "10px",
            margin: "10px",
            fontSize: isMobile ? "0.6rem" : "1.2rem",
          }}
        >
          Calcular
        </button>
        <button
          onClick={mostrarListaIntereses}
          style={{
            backgroundColor: "green",
            color: "white",
            fontWeight: "bold",
            textShadow: "2px 2px 4px #ff4444",
            borderRadius: "5px",
            padding: "10px",
            margin: "10px",
            fontSize: isMobile ? "0.6rem" : "1.2rem",
          }}
        >
          Mostrar Lista de Intereses
        </button>
      </div>

      {mostrarTabla && (
        <div>
          <h2
            style={{
              color: "black",
              fontWeight: "bold",
              textShadow: "2px 2px 4px #000", // Sombra roja
            }}
          >
            Datos del Préstamo amortizable
          </h2>

          <table style={{
            backgroundColor: "white",
          }}>
            <thead>
              <tr>
                <th>Mensualidad</th>
                <th>Cuota Mensual</th>
                <th>Interés Pagado</th>
                <th>Capital Pagado</th>
                <th>Saldo Pendiente</th>
              </tr>
            </thead>
            <tbody>
              {datosPrestamo.map((item) => (
                <tr key={item.periodo}>
                  <td>{item.periodo}</td>
                  <td>{item.cuota.toLocaleString("en-US")}</td>
                  <td>{item.interes.toLocaleString("en-US")}</td>
                  <td>{item.capital.toLocaleString("en-US")}</td>
                  <td>{item.saldo.toLocaleString("en-US")}</td>
                </tr>
              ))}
              <tr
                style={{
                  background: "red",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                <td>Total:</td>
                <td>
                  {datosPrestamo
                    .reduce((total, item) => total + item.cuota, 0)
                    .toLocaleString("en-US")}
                </td>
                <td>
                  {datosPrestamo
                    .reduce((total, item) => total + item.interes, 0)
                    .toLocaleString("en-US")}
                </td>
                <td>
                  {datosPrestamo
                    .reduce((total, item) => total + item.capital, 0)
                    .toLocaleString("en-US")}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="modal1">
          <div
            className="modal1-content rounded-shadow"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <span className="close1" onClick={cerrarModal}>
              &times;
            </span>
            <h2>Tabla de Intereses y Cuotas Mensuales</h2>
            <table style={{ fontSize: "14px" }}>
              <thead>
                <tr>
                  <th>Tipo de Inmueble</th>
                  <th>Monto</th>
                  <th>Interés</th>
                  <th>Plazo</th>
                  <th>Garantía</th>
                  <th>Inmueble Tipo</th>
                </tr>
              </thead>
              <tbody>
                {tablaIntereses.map((item, index) => (
                  <tr key={index}>
                    <td>{item.tipo}</td>
                    <td>{item.monto}</td>
                    <td>{item.interes}%</td>
                    <td>{item.plazo}</td>
                    <td>{item.garantia}</td>
                    <td>
                      {item.inmuebleTipo === "Inmueble tipo #1" &&
                        "Propiedades de valores de 10 a 34 millones"}
                      {item.inmuebleTipo === "Inmueble tipo #2" &&
                        "Propiedades de valores de 35 a 49 millones"}
                      {item.inmuebleTipo === "Inmueble tipo #3" &&
                        "Propiedades de valores mayores a 50 millones"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cotizador;
