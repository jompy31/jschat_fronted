import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Box, Tooltip } from "@mui/material";
import { Download, Edit, Delete } from "@mui/icons-material";

const CustomerTable = ({
  customers,
  totalCount,
  searchTerm,
  setSearchTerm,
  currentPage,
  handlePageChange,
  handleCustomerClick,
  handleDeleteConfirmation,
  handleEdit,
  currentUser,
  handleDownloadCustomer,
}) => {
  const columns = [
    {
      field: "name",
      headerName: "Nombre",
      width: 200,
      renderCell: (params) => (
        <Tooltip title="Ver detalles">
          <span
            onClick={() => handleCustomerClick(params.row)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    { field: "id_type", headerName: "Tipo de ID", width: 120 },
    { field: "id_number", headerName: "Número de ID", width: 150 },
    { field: "email", headerName: "Correo", width: 200 },
    { field: "phone_number", headerName: "Teléfono", width: 150 },
    { field: "tipo_contacto", headerName: "Tipo de Contacto", width: 150 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {(currentUser?.userprofile?.staff_status === "administrator" ||
            currentUser?.userprofile?.staff_status === "sales") && (
            <>
              <Tooltip title="Editar">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(params.row)}
                >
                  
                </Button>
              </Tooltip>
              <Tooltip title="Eliminar">
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteConfirmation(params.row)}
                >
                 
                </Button>
              </Tooltip>
            </>
          )}
          {/* <Tooltip title="Descargar">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<Download />}
              onClick={() => handleDownloadCustomer(params.row)}
            >
           
            </Button>
          </Tooltip> */}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <TextField
        label="Buscar por nombre o correo"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={customers}
          columns={columns}
          rowCount={totalCount}
          paginationMode="server"
          pageSizeOptions={[10, 25, 50]}
          paginationModel={{ page: currentPage - 1, pageSize: 10 }}
          onPaginationModelChange={({ page, pageSize }) => handlePageChange(page + 1)}
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#1976d2",
              color: "black",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#e3f2fd",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomerTable;