// frontend_github\jschat_fronted\src\components\backend\customers\components\CustomerTable.jsx
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Box, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

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
}) => {
  const columns = [
    {
      field: "name",
      headerName: "Nombre",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Tooltip title="Ver detalles">
          <span
            onClick={() => handleCustomerClick(params.row)}
            style={{ cursor: 'pointer', color: 'var(--accent-primary)', textDecoration: 'underline' }}
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    { field: "id_type", headerName: "Tipo ID", flex: 0.8, minWidth: 100 },
    { field: "id_number", headerName: "Número ID", flex: 1, minWidth: 130 },
    { field: "email", headerName: "Correo", flex: 1.2, minWidth: 180 },
    { field: "phone_number", headerName: "Teléfono", flex: 1, minWidth: 130 },
    { field: "tipo_contacto", headerName: "Tipo", flex: 0.9, minWidth: 110 },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1.2,
      minWidth: 180,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {(currentUser?.userprofile?.staff_status === "administrator" ||
            currentUser?.userprofile?.staff_status === "sales") && (
            <>
              <Tooltip title="Editar">
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(params.row)}
                  sx={{
                    color: 'black',
                    border: `1px solid var(--border-primary)`,
                    '&:hover': { background: 'var(--accent-primary)', color: '#fff', boxShadow: 'var(--glow-neon)' }
                  }}
                />
              </Tooltip>
              <Tooltip title="Eliminar">
                <Button
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteConfirmation(params.row)}
                  sx={{
                    color: '#ff3333',
                    border: `1px solid #ff3333`,
                    '&:hover': { background: '#ff3333', color: '#fff', boxShadow: '0 0 15px rgba(255,51,51,0.5)' }
                  }}
                />
              </Tooltip>
            </>
          )}
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
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            '& fieldset': { borderColor: 'var(--border-primary)' },
            '&:hover fieldset': { borderColor: 'var(--accent-primary)' },
            '&.Mui-focused fieldset': { borderColor: 'var(--accent-primary)', boxShadow: 'var(--glow-neon)' },
          },
          '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
        }}
      />
      <Box sx={{ height: 560, width: "100%" }}>
        <DataGrid
          rows={customers}
          columns={columns}
          rowCount={totalCount}
          paginationMode="server"
          pageSizeOptions={[10, 25, 50]}
          paginationModel={{ page: currentPage - 1, pageSize: 10 }}
          onPaginationModelChange={({ page }) => handlePageChange(page + 1)}
          disableSelectionOnClick
          sx={{
            width: '100%',
            '& .MuiDataGrid-columnHeaders': {
              background: 'var(--accent-hover)',
              color: '#000',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            },
            '& .MuiDataGrid-row': {
              transition: 'all 0.3s ease',
              '&:hover': { background: 'rgba(217, 4, 4, 0.08)', transform: 'translateY(-1px)' },
            },
            '& .MuiDataGrid-cell': {
              color: 'black',
              borderBottom: `1px solid var(--border-primary)`,
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid var(--border-primary)`,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomerTable;