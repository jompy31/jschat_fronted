import React from "react";
import { Modal, Box, Button, TextField, Select, MenuItem, Typography, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";

const CustomerModal = ({
  show,
  onHide,
  isEditMode,
  customerData,
  handleInputChange,
  handleSave,
}) => {
  return (
    <Modal open={show} onClose={onHide}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="modal customer-modal"
        style={{
          position: "absolute",
          // top: "0%",
          left: "25%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          padding: 24,
          borderRadius: 12,
          maxHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ color: "#1a202c" }}>
            {isEditMode ? "Editar Cliente" : "Crear Nuevo Cliente"}
          </Typography>
          <IconButton onClick={onHide} sx={{ color: "#718096" }}>
            <Close />
          </IconButton>
        </Box>
        <Box>
          <TextField
            label="Nombre"
            name="name"
            value={customerData.name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            InputLabelProps={{ style: { color: "#4a5568" } }}
            sx={{ bgcolor: "#f7fafc" }}
          />
          <Select
            label="Tipo de Identificación"
            name="id_type"
            value={customerData.id_type || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            displayEmpty
            InputLabelProps={{ style: { color: "#4a5568" } }}
            sx={{ bgcolor: "#f7fafc" }}
          >
            <MenuItem value="">Seleccionar Tipo</MenuItem>
            <MenuItem value="Cédula Física">Cédula Física</MenuItem>
            <MenuItem value="Cédula Jurídica">Cédula Jurídica</MenuItem>
            <MenuItem value="Pasaporte">Pasaporte</MenuItem>
          </Select>
          <TextField
            label="Número de Identificación"
            name="id_number"
            value={customerData.id_number || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            required
            InputLabelProps={{ style: { color: "#4a5568" } }}
            sx={{ bgcolor: "#f7fafc" }}
          />
          <TextField
            label="Correo Electrónico"
            name="email"
            type="email"
            value={customerData.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#4a5568" } }}
            sx={{ bgcolor: "#f7fafc" }}
          />
          <TextField
            label="Teléfono"
            name="phone_number"
            value={customerData.phone_number || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#4a5568" } }}
            sx={{ bgcolor: "#f7fafc" }}
          />
          <TextField
            label="Dirección"
            name="address"
            value={customerData.address || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#4a5568" } }}
            sx={{ bgcolor: "#f7fafc" }}
          />
          <TextField
            label="Empresa"
            name="company"
            value={customerData.company || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "#4a5568" } }}
            sx={{ bgcolor: "#f7fafc" }}
          />
          <Select
            label="Tipo de Contacto"
            name="tipo_contacto"
            value={customerData.tipo_contacto || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            displayEmpty
            InputLabelProps={{ style: { color: "#4a5568" } }}
            sx={{ bgcolor: "#f7fafc" }}
          >
            <MenuItem value="Cliente">Cliente</MenuItem>
            <MenuItem value="Proveedor">Proveedor</MenuItem>
          </Select>
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={onHide}
            sx={{ color: "#718096", borderColor: "#e2e8f0" }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ bgcolor: "#3182ce", "&:hover": { bgcolor: "#2b6cb0" } }}
          >
            {isEditMode ? "Guardar" : "Crear"}
          </Button>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default CustomerModal;