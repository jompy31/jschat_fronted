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
          background: "linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))",
          boxShadow: "var(--shadow-light), var(--glow-neon)",
          padding: 24,
          borderRadius: 12,
          maxHeight: "100vh",
          overflowY: "auto",
          border: "1px solid var(--border-primary)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" sx={{ color: "var(--text-primary)" }}>
            {isEditMode ? "Editar Cliente" : "Crear Nuevo Cliente"}
          </Typography>
          <IconButton onClick={onHide} sx={{ color: "var(--text-secondary)" }}>
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
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={{
              bgcolor: "var(--bg-secondary)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-primary)" },
                "&:hover fieldset": { borderColor: "var(--accent-primary)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-primary)", boxShadow: "var(--glow-neon)" },
              },
              color: "var(--text-primary)",
            }}
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
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={{
              bgcolor: "var(--bg-secondary)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-primary)" },
                "&:hover fieldset": { borderColor: "var(--accent-primary)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-primary)", boxShadow: "var(--glow-neon)" },
              },
              color: "var(--text-primary)",
            }}
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
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={{
              bgcolor: "var(--bg-secondary)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-primary)" },
                "&:hover fieldset": { borderColor: "var(--accent-primary)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-primary)", boxShadow: "var(--glow-neon)" },
              },
              color: "var(--text-primary)",
            }}
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
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={{
              bgcolor: "var(--bg-secondary)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-primary)" },
                "&:hover fieldset": { borderColor: "var(--accent-primary)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-primary)", boxShadow: "var(--glow-neon)" },
              },
              color: "var(--text-primary)",
            }}
          />
          <TextField
            label="Teléfono"
            name="phone_number"
            value={customerData.phone_number || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={{
              bgcolor: "var(--bg-secondary)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-primary)" },
                "&:hover fieldset": { borderColor: "var(--accent-primary)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-primary)", boxShadow: "var(--glow-neon)" },
              },
              color: "var(--text-primary)",
            }}
          />
          <TextField
            label="Dirección"
            name="address"
            value={customerData.address || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={{
              bgcolor: "var(--bg-secondary)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-primary)" },
                "&:hover fieldset": { borderColor: "var(--accent-primary)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-primary)", boxShadow: "var(--glow-neon)" },
              },
              color: "var(--text-primary)",
            }}
          />
          <TextField
            label="Empresa"
            name="company"
            value={customerData.company || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={{
              bgcolor: "var(--bg-secondary)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-primary)" },
                "&:hover fieldset": { borderColor: "var(--accent-primary)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-primary)", boxShadow: "var(--glow-neon)" },
              },
              color: "var(--text-primary)",
            }}
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
            InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
            sx={{
              bgcolor: "var(--bg-secondary)",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "var(--border-primary)" },
                "&:hover fieldset": { borderColor: "var(--accent-primary)" },
                "&.Mui-focused fieldset": { borderColor: "var(--accent-primary)", boxShadow: "var(--glow-neon)" },
              },
              color: "var(--text-primary)",
            }}
          >
            <MenuItem value="Cliente">Cliente</MenuItem>
            <MenuItem value="Proveedor">Proveedor</MenuItem>
          </Select>
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={onHide}
            sx={{
              color: "var(--text-secondary)",
              borderColor: "var(--border-primary)",
              "&:hover": {
                background: "var(--accent-primary)",
                color: "#FFFFFF",
                borderColor: "var(--accent-primary)",
                boxShadow: "var(--glow-neon)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              background: "var(--accent-hover)",
              color: "#FFFFFF",
              border: "2px solid var(--border-primary)",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                background: "var(--border-primary)",
                borderColor: "var(--accent-primary)",
                boxShadow: "var(--glow-neon)",
              },
            }}
          >
            {isEditMode ? "Guardar" : "Crear"}
          </Button>
        </Box>
      </motion.div>
    </Modal>
  );
};

export default CustomerModal;