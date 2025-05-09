import React from "react";
import { Button } from "react-bootstrap";

const PaginationControls = ({ totalJobs, jobsPerPage, currentPage, setCurrentPage }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
      {Array.from({ length: Math.ceil(totalJobs / jobsPerPage) }).map((_, index) => (
        <Button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          style={{
            margin: "5px",
            backgroundColor: currentPage === index + 1 ? "blue" : "gray",
            color: "white",
            padding: "10px 20px",
          }}
        >
          {index + 1}
        </Button>
      ))}
    </div>
  );
};

export default PaginationControls;