// frontend_github\jschat_fronted\src\components\backend\customers\components\CustomerModal.jsx
import React from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
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
    <Modal
      open={show}
      onClose={onHide}
      aria-labelledby="customer-modal-title"
      aria-describedby="customer-modal-description"
      closeAfterTransition
      BackdropProps={{
        sx: { backgroundColor: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(8px)" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: "90%", md: "80%" },
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "var(--bg-primary)",
          background: "linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))",
          border: "1px solid var(--border-primary)",
          borderRadius: 4,
          boxShadow: "var(--shadow-light), var(--glow-neon)",
          p: { xs: 2, sm: 3 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" fontWeight={700} sx={{ color: "var(--text-primary)" }}>
              {isEditMode ? "Editar Cliente" : "Crear Nuevo Cliente"}
            </Typography>
            <IconButton
              onClick={onHide}
              sx={{
                color: "var(--text-secondary)",
                "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ borderColor: "var(--border-primary)", opacity: 0.3, mb: 3 }} />

          {/* Formulario */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre *"
                name="name"
                value={customerData.name || ""}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Select
                name="id_type"
                value={customerData.id_type || ""}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
                variant="outlined"
                sx={selectStyle}
              >
                <MenuItem value="" disabled>Seleccionar Tipo</MenuItem>
                <MenuItem value="Cédula Física">Cédula Física</MenuItem>
                <MenuItem value="Cédula Jurídica">Cédula Jurídica</MenuItem>
                <MenuItem value="Pasaporte">Pasaporte</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Número de Identificación *"
                name="id_number"
                value={customerData.id_number || ""}
                onChange={handleInputChange}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Correo Electrónico"
                name="email"
                type="email"
                value={customerData.email || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                name="phone_number"
                value={customerData.phone_number || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Dirección"
                name="address"
                value={customerData.address || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                label="Empresa"
                name="company"
                value={customerData.company || ""}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
                sx={textFieldStyle}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Select
                name="tipo_contacto"
                value={customerData.tipo_contacto || ""}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
                variant="outlined"
                sx={selectStyle}
              >
                <MenuItem value="" disabled>Tipo de Contacto</MenuItem>
                <MenuItem value="Cliente">Cliente</MenuItem>
                <MenuItem value="Proveedor">Proveedor</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: "var(--border-primary)", opacity: 0.3, my: 3 }} />

          {/* Botones */}
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button
              variant="outlined"
              onClick={onHide}
              size="large"
              sx={{
                minWidth: 120,
                color: "var(--text-secondary)",
                borderColor: "var(--border-primary)",
                fontWeight: 600,
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
              size="large"
              sx={{
                minWidth: 120,
                background: "var(--accent-hover)",
                color: "#FFFFFF",
                fontWeight: 600,
                "&:hover": {
                  background: "var(--accent-primary)",
                  boxShadow: "var(--glow-neon)",
                },
              }}
            >
              {isEditMode ? "Guardar" : "Crear"}
            </Button>
          </Box>
        </motion.div>
      </Box>
    </Modal>
  );
};

// Estilos reutilizables (sin cambios)
const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "var(--border-primary)" },
    "&:hover fieldset": { borderColor: "var(--accent-primary)" },
    "&.Mui-focused fieldset": {
      borderColor: "var(--accent-primary)",
      boxShadow: "var(--glow-neon)",
    },
    bgcolor: "var(--bg-secondary)",
    color: "var(--text-primary)",
  },
  "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent-primary)" },
};

const selectStyle = {
  ...textFieldStyle,
  "& .MuiSelect-select": {
    color: "var(--text-primary)",
  },
};

export default CustomerModal;