import React from "react";
import { Button } from "react-bootstrap";

const CategorySidebar = ({ jobCategories, selectedCategory, handleCategorySelect, isMobile }) => {
  return (
    <div
      style={{
        width: "30%",
        backgroundColor: "#f0f0f0",
        padding: "20px",
        boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <h4
        style={{
          color: "black",
          fontWeight: "bold",
          fontSize: isMobile ? "1.0em" : "1.2em",
          marginBottom: "20px",
          textAlign: "left",
        }}
      >
        Seleccione la categoría deseada:
      </h4>
      <div style={{ width: "100%", fontSize: isMobile ? "0.6em" : "0.9em" }}>
        <Button
          variant="outline-secondary"
          onClick={() => handleCategorySelect(null)}
          style={{
            display: "block",
            textAlign: "left",
            width: "100%",
            backgroundColor: selectedCategory === null ? "rgb(0, 255, 0)" : "white",
            color: "black",
            borderColor: "black",
            borderWidth: "0.4px",
            borderStyle: "solid",
            borderRadius: "10px",
            padding: "5px",
            marginBottom: "10px",
          }}
        >
          2.0 Ver Todos
        </Button>
        {jobCategories.map((category) => (
          <Button
            key={category.id}
            variant="outline-primary"
            onClick={() => handleCategorySelect(category.id)}
            style={{
              display: "block",
              textAlign: "left",
              width: "100%",
              backgroundColor:
                selectedCategory === category.id ? "rgb(0, 255, 0)" : "white",
              lineHeight: "1.5",
              color: "black",
              borderColor: "black",
              borderWidth: "0.4px",
              borderStyle: "solid",
              borderRadius: "10px",
              padding: "5px",
              marginBottom: "10px",
            }}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;