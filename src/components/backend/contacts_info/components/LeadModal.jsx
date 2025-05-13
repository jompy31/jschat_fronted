import React from "react";
import { Modal, Box, Button, TextField, Select, MenuItem, Tabs, Tab, Typography, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { Close } from "@mui/icons-material";
import Categories from "../../../json/category.json";

const LeadModal = ({
  show,
  onHide,
  isEditMode,
  leadData,
  handleInputChange,
  handleSave,
  activeTab,
  setActiveTab,
  imagePreview,
}) => {
  return (
    <Modal open={show} onClose={onHide}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3 }}
        className="modal lead-modal"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 800,
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
          padding: 24,
          borderRadius: 12,
          maxHeight: "85vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
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
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2, borderBottom: "1px solid #e2e8f0" }}
        >
          <Tab label="Cliente" value="client" sx={{ color: "#1a202c" }} />
          <Tab label="Vendedor" value="vendor" sx={{ color: "#1a202c" }} />
          <Tab label="Marketing" value="marketing_designer" sx={{ color: "#1a202c" }} />
        </Tabs>
        {activeTab === "client" && (
          <Box>
            <TextField
              label="Nombre de la Empresa"
              name="name"
              value={leadData.name || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <Box mt={2}>
              <Typography variant="body2" sx={{ color: "#4a5568" }}>Logo de la Empresa</Typography>
              <input
                type="file"
                name="company_logo"
                accept="image/*"
                onChange={handleInputChange}
                className="mt-2"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Vista previa del logo"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    marginTop: 8,
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                  }}
                />
              )}
            </Box>
            <TextField
              label="Correo Electrónico"
              name="email"
              type="email"
              value={leadData.email || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Actividad Comercial"
              name="commercial_activity"
              value={leadData.commercial_activity || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Descripción"
              name="description"
              multiline
              rows={4}
              value={leadData.description || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Número de Contacto"
              name="number"
              value={leadData.number || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            {isEditMode && (
              <>
                <Select
                  label="Prioridad"
                  name="priority"
                  value={leadData.priority || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={{ bgcolor: "#f7fafc" }}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  <MenuItem value="bajo">Baja</MenuItem>
                  <MenuItem value="medio">Media</MenuItem>
                  <MenuItem value="alto">Alta</MenuItem>
                </Select>
                <Select
                  label="Estado"
                  name="status"
                  value={leadData.status || ""}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={{ bgcolor: "#f7fafc" }}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  <MenuItem value="nuevo">Nuevo</MenuItem>
                  <MenuItem value="contactado">Contactado</MenuItem>
                  <MenuItem value="ganado">Ganado</MenuItem>
                </Select>
              </>
            )}
            <TextField
              label="Dirección"
              name="company_address"
              multiline
              rows={2}
              value={leadData.company_address || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <Select
              label="Categoría de Marca"
              name="brand_category"
              value={leadData.brand_category || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              sx={{ bgcolor: "#f7fafc" }}
            >
              <MenuItem value="">Seleccionar</MenuItem>
              {Categories.categorias.map((cat) => (
                <MenuItem key={cat.nombre} value={cat.nombre}>
                  {cat.nombre}
                </MenuItem>
              ))}
            </Select>
            <TextField
              label="Descripción de Marca"
              name="brand_description"
              multiline
              rows={4}
              value={leadData.brand_description || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Diferenciación de Marca"
              name="brand_differentiation"
              multiline
              rows={4}
              value={leadData.brand_differentiation || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
          </Box>
        )}
        {activeTab === "vendor" && (
          <Box>
            <TextField
              label="Nombre del Contacto"
              name="contact_person_name"
              value={leadData.contact_person_name || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Teléfono del Contacto"
              name="contact_person_phone"
              value={leadData.contact_person_phone || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Motivo de Contacto"
              name="contact_reason"
              value={leadData.contact_reason || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Rol del Vendedor"
              name="contact_person_position"
              value={leadData.contact_person_position || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
          </Box>
        )}
        {activeTab === "marketing_designer" && (
          <Box>
            <TextField
              label="Metas del Negocio"
              name="current_business_goals"
              multiline
              rows={4}
              value={leadData.current_business_goals || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Competidores"
              name="main_competitors"
              multiline
              rows={4}
              value={leadData.main_competitors || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
          </Box>
        )}
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

export default LeadModal;