import React from "react";
import { Button } from "react-bootstrap";

const PaginationControls = ({ totalJobs, jobsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalJobs / jobsPerPage);

  // Limit the number of page buttons displayed (e.g., show 5 pages at a time)
  const maxPageButtons = 5;
  const halfMaxButtons = Math.floor(maxPageButtons / 2);
  let startPage = Math.max(1, currentPage - halfMaxButtons);
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  // Adjust startPage if endPage is at the maximum
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20%" }}>
      {/* Previous Button */}
      <Button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          margin: "5px",
          backgroundColor: currentPage === 1 ? "gray" : "blue",
          color: "white",
          padding: "10px 20px",
        }}
      >
        Anterior
      </Button>

      {/* Page Number Buttons */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          onClick={() => setCurrentPage(page)}
          style={{
            margin: "5px",
            backgroundColor: currentPage === page ? "blue" : "gray",
            color: "white",
            padding: "10px 20px",
          }}
        >
          {page}
        </Button>
      ))}

      {/* Next Button */}
      <Button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          margin: "5px",
          backgroundColor: currentPage === totalPages ? "gray" : "blue",
          color: "white",
          padding: "10px 20px",
        }}
      >
        Siguiente
      </Button>
    </div>
  );
};

export default PaginationControls;