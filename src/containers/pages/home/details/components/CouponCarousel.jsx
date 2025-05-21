import React from "react";
import Publicidad from "../../../../../assets/catalogo/webp/visibilidad.webp";

const CouponGrid = ({ coupons, subproductData }) => {
  if (!coupons?.length) return null;

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          maxWidth: "1200px", // Limita el ancho máximo para mejor legibilidad
          margin: "0 auto", // Centra la cuadrícula
        }}
      >
        {coupons.map((coupon) => {
          const discountedPrice = (
            coupon.price * (1 - coupon.discount / 100)
          ).toFixed(2);

          return (
            <div
              key={coupon.id}
              className="card"
              style={{
                padding: "15px",
                textAlign: "left",
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
              }}
            >
              <div
                style={{
                  height: "200px",
                  overflow: "hidden",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={coupon.image || Publicidad}
                  alt={`Cupón ${coupon.name} de ${subproductData.name}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "1.4em",
                  fontWeight: 600,
                  color: "#333",
                  marginBottom: "10px",
                }}
              >
                {coupon.name}
              </h3>
              <p
                style={{
                  fontSize: "0.9em",
                  color: "#666",
                  marginBottom: "10px",
                  lineHeight: "1.4",
                }}
              >
                {coupon.description.split(" ").length > 40
                  ? `${coupon.description.split(" ").slice(0, 40).join(" ")}...`
                  : coupon.description}
              </p>
              <div>
                <p
                  style={{
                    fontSize: "1em",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  Ahorra hasta <span style={{ color: "#e74c3c" }}>{coupon.discount}%</span>
                </p>
                <p style={{ fontSize: "1.1em" }}>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#e74c3c",
                      marginRight: "8px",
                    }}
                  >
                    ₡{coupon.price}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#4CAF50",
                    }}
                  >
                    ₡{discountedPrice}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouponGrid;