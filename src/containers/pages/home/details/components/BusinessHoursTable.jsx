import React from "react";
import { convertTo12HourFormat, capitalizeFirstLetter } from "../utils/formatUtils";

const BusinessHoursTable = ({ businessHours }) => {
  if (!businessHours?.length) return null;

  return (
    <div className="card">
      <h2 className="section-header">Horarios de Negocio</h2>
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <table className="custom-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Horario</th>
            </tr>
          </thead>
          <tbody>
            {businessHours.map((hours) => {
              const startTime = convertTo12HourFormat(hours.start_time);
              const endTime = convertTo12HourFormat(hours.end_time);
              return (
                <tr key={hours.id}>
                  <td style={{ textAlign: "center", fontWeight: 600 }}>
                    {capitalizeFirstLetter(hours.day)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {startTime} - {endTime}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BusinessHoursTable;