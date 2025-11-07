import React, { useState } from 'react';
import { createCharacteristic, updateCharacteristic, deleteCharacteristic } from '../utils/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";

const CreateCharacteristicForm = ({ onClose, token, setCharacteristics, editingCharacteristic }) => {
  const [formData, setFormData] = useState({
    name: editingCharacteristic?.name || '',
    description: editingCharacteristic?.description || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCharacteristic) {
        const response = await updateCharacteristic(editingCharacteristic.id, formData, token);
        setCharacteristics(prev => prev.map(c => (c.id === editingCharacteristic.id ? response.data : c)));
      } else {
        const response = await createCharacteristic(formData, token);
        setCharacteristics(prev => [...prev, response.data]);
      }
      onClose();
    } catch (err) {
      alert('Error al guardar característica: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!editingCharacteristic) return;
    if (!window.confirm('¿Confirmar eliminación de la característica?')) return;
    try {
      await deleteCharacteristic(editingCharacteristic.id, token);
      setCharacteristics(prev => prev.filter(c => c.id !== editingCharacteristic.id));
      onClose();
    } catch (err) {
      alert('Error al eliminar característica: ' + err.message);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0, 0, 0, 0.7)",
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
          width: { xs: "95%", sm: "90%", md: "500px" },
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "var(--bg-primary)",
          background: "linear-gradient(180deg, var(--bg-primary), var(--bg-secondary))",
          border: "1px solid var(--border-primary)",
          borderRadius: 4,
          boxShadow: "var(--shadow-light), var(--glow-neon)",
          p: { xs: 3, sm: 4 },
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
              {editingCharacteristic ? "Editar Característica" : "Crear Característica"}
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
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              </Grid>

              <Grid item xs={12}>
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
              </Grid>
            </Grid>

            <Divider sx={{ borderColor: "var(--border-primary)", opacity: 0.3, my: 3 }} />

            {/* Botones */}
            <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Box>
                {editingCharacteristic && (
                  <Button
                    variant="outlined"
                    onClick={handleDelete}
                    size="large"
                    sx={{
                      minWidth: 120,
                      color: "#ff4444",
                      borderColor: "#ff4444",
                      fontWeight: 600,
                      "&:hover": {
                        background: "#ff4444",
                        color: "#FFFFFF",
                        borderColor: "#ff4444",
                        boxShadow: "0 0 20px rgba(255, 68, 68, 0.6)",
                      },
                    }}
                  >
                    Eliminar
                  </Button>
                )}
              </Box>

              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  onClick={onClose}
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
                  type="submit"
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
                  Guardar
                </Button>
              </Box>
            </Box>
          </form>
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

export default CreateCharacteristicForm;