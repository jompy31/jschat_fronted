import React, { useState } from 'react';
import { createProductType, updateProductType } from '../utils/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";

const CreateProductTypeForm = ({ onClose, token, setProductTypes, editingProductType }) => {
  const [formData, setFormData] = useState({
    name: editingProductType?.name || '',
    description: editingProductType?.description || '',
    base_price: editingProductType?.base_price || 0,
    delivery_time_days: editingProductType?.delivery_time_days || 1,
    daily_production_capacity: editingProductType?.daily_production_capacity || 100,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, created_by_id: 1 };
    try {
      if (editingProductType) {
        const response = await updateProductType(editingProductType.id, data, token);
        setProductTypes(prev => prev.map(t => (t.id === editingProductType.id ? response.data : t)));
      } else {
        const response = await createProductType(data, token);
        setProductTypes(prev => [...prev, response.data]);
      }
      onClose();
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "95%", sm: "90%", md: "600px" },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "var(--bg-primary)",
          background: "linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))",
          border: "1px solid var(--border-primary)",
          borderRadius: 4,
          boxShadow: "var(--shadow-light), var(--glow-neon)",
          p: { xs: 3, sm: 4 },
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            background: "var(--bg-secondary)",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--accent-primary)",
            borderRadius: 4,
          },
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={700} sx={{ color: "var(--text-primary)" }}>
              {editingProductType ? "Editar Tipo de Producto" : "Crear Tipo de Producto"}
            </Typography>
            <IconButton
              onClick={onClose}
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
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Nombre *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              variant="outlined"
              InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
              sx={textFieldStyle}
            />

            <TextField
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
              sx={textFieldStyle}
            />

            <TextField
              label="Precio Base *"
              name="base_price"
              type="number"
              value={formData.base_price}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{ step: "0.01" }}
              variant="outlined"
              InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
              sx={textFieldStyle}
            />

            <TextField
              label="Tiempo de Entrega (días) *"
              name="delivery_time_days"
              type="number"
              value={formData.delivery_time_days}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{ inputProps: { min: 1 } }}
              variant="outlined"
              InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
              sx={textFieldStyle}
            />

            <TextField
              label="Capacidad Diaria de Producción *"
              name="daily_production_capacity"
              type="number"
              value={formData.daily_production_capacity}
              onChange={handleInputChange}
              fullWidth
              required
              InputProps={{ inputProps: { min: 1 } }}
              variant="outlined"
              InputLabelProps={{ style: { color: "var(--text-secondary)" } }}
              sx={textFieldStyle}
            />

            <Divider sx={{ borderColor: "var(--border-primary)", opacity: 0.3, my: 2 }} />

            {/* Botones */}
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={onClose}
                size="large"
                sx={{
                  minWidth: 140,
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
                type="submit"
                size="large"
                sx={{
                  minWidth: 140,
                  background: "var(--accent-hover)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  "&:hover": {
                    background: "var(--accent-primary)",
                    boxShadow: "var(--glow-neon)",
                  },
                }}
              >
                {editingProductType ? "Guardar Cambios" : "Crear Tipo"}
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
};

// Estilos reutilizables (igual que en CustomerModal)
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

export default CreateProductTypeForm;