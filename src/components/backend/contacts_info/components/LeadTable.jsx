import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Box, Tooltip } from "@mui/material";
import { Download, Edit, Delete, Comment, Visibility } from "@mui/icons-material";

const LeadTable = ({
  leads,
  searchTerm,
  setSearchTerm,
  currentPage,
  handlePageChange,
  handleLeadClick,
  handleDeleteConfirmation,
  handleEdit,
  handleLastCommentClick,
  handleCreateComment,
  currentUser,
  handleDownloadlead,
}) => {
  const columns = [
    {
      field: "contact_person_name",
      headerName: "Vendedor",
      width: 150,
      renderCell: (params) => (
        <Tooltip title="Ver detalles">
          <span
            onClick={() => handleLeadClick(params.row)}
            className="cursor-pointer text-blue-600 hover:underline"
          >
            {params.value}
          </span>
        </Tooltip>
      ),
    },
    { field: "name", headerName: "Empresa", width: 200 },
    { field: "email", headerName: "Correo", width: 200 },
    { field: "number", headerName: "Número", width: 120 },
    { field: "description", headerName: "Descripción", width: 200 },
    { field: "priority", headerName: "Prioridad", width: 100 },
    { field: "status", headerName: "Estado", width: 120 },
    {
      field: "lastComment",
      headerName: "Comentarios",
      width: 150,
      renderCell: (params) => (
        <Box>
          {params.row.lastComment ? (
            <>
              <Tooltip title="Ver comentarios">
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => handleLastCommentClick(params.row)}
                >
                  Ver
                </Button>
              </Tooltip>
              <Tooltip title="Añadir comentario">
                <Button
                  size="small"
                  startIcon={<Comment />}
                  onClick={() => handleCreateComment(params.row)}
                >
                  Añadir
                </Button>
              </Tooltip>
            </>
          ) : (
            <Tooltip title="Añadir comentario">
              <Button
                size="small"
                startIcon={<Comment />}
                onClick={() => handleCreateComment(params.row)}
              >
                Añadir
              </Button>
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {currentUser?.staff_status === "administrator" && (
            <>
              <Tooltip title="Eliminar">
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteConfirmation(params.row)}
                >
                  Eliminar
                </Button>
              </Tooltip>
              <Tooltip title="Editar">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(params.row)}
                >
                  Editar
                </Button>
              </Tooltip>
            </>
          )}
          {currentUser?.staff_status === "sales" && (
            <>
              <Tooltip title="Editar">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(params.row)}
                >
                  Editar
                </Button>
              </Tooltip>
              <Tooltip title="Descargar">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<Download />}
                  onClick={() => handleDownloadlead(params.row)}
                >
                  Descargar
                </Button>
              </Tooltip>
            </>
          )}
          {currentUser?.staff_status === "design" && (
            <Tooltip title="Descargar">
              <Button
                variant="outlined"
                color="primary"
                size="small"
                startIcon={<Download />}
                onClick={() => handleDownloadlead(params.row)}
              >
                Descargar
              </Button>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          rows={filteredLeads}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(newPage) => handlePageChange(newPage + 1)}
          page={currentPage - 1}
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

export default LeadTable;