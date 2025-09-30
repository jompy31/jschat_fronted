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
          maxHeight: "100vh",
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
              label="Nombre Completo de la Empresa"
              name="company_name"
              value={leadData.company_name || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
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
              label="Sitio Web o Redes Sociales"
              name="company_website_or_social_media"
              value={leadData.company_website_or_social_media || ""}
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
              label="Tipo de Negocio"
              name="business_type"
              value={leadData.business_type || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Años de Experiencia"
              name="business_experience_duration"
              value={leadData.business_experience_duration || ""}
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
            <Select
              label="Prioridad"
              name="priority"
              value={leadData.priority || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              displayEmpty
              inputProps={{ 'aria-label': 'Prioridad' }}
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            >
              <MenuItem value="">Seleccionar Prioridad</MenuItem>
              <MenuItem value="bajo">Baja</MenuItem>
              <MenuItem value="medio">Media</MenuItem>
              <MenuItem value="alto">Alta</MenuItem>
            </Select>
            {isEditMode && (
              <Select
                label="Estado"
                name="status"
                value={leadData.status || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
                displayEmpty
                inputProps={{ 'aria-label': 'Estado' }}
                InputLabelProps={{ style: { color: "#4a5568" } }}
                sx={{ bgcolor: "#f7fafc" }}
              >
                <MenuItem value="">Seleccionar Estado</MenuItem>
                <MenuItem value="nuevo">Nuevo</MenuItem>
                <MenuItem value="contactado">Contactado</MenuItem>
                <MenuItem value="ganado">Ganado</MenuItem>
              </Select>
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
            <TextField
              label="Detalles Comerciales"
              name="commercial_information_details"
              multiline
              rows={4}
              value={leadData.commercial_information_details || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Horarios y Ubicación"
              name="opening_hours_location_maps"
              value={leadData.opening_hours_location_maps || ""}
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
              label="Puesto del Contacto"
              name="contact_person_position"
              value={leadData.contact_person_position || ""}
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
              multiline
              rows={4}
              value={leadData.contact_reason || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Información de Pago"
              name="payment_information"
              multiline
              rows={4}
              value={leadData.payment_information || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Método de Pago"
              name="payment_method"
              value={leadData.payment_method || ""}
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
            <Select
              label="Categoría de Marca"
              name="brand_category"
              value={leadData.brand_category || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              displayEmpty
              inputProps={{ 'aria-label': 'Categoría de Marca' }}
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            >
              <MenuItem value="">Seleccionar Categoría de Marca</MenuItem>
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
            <TextField
              label="Necesidad de la Marca"
              name="brand_necessity"
              multiline
              rows={4}
              value={leadData.brand_necessity || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Palabras Clave de Percepción"
              name="brand_perception_keywords"
              value={leadData.brand_perception_keywords || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Personalidad de la Marca"
              name="brand_personality"
              value={leadData.brand_personality || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Eslogan o Lema"
              name="brand_slogan_or_motto"
              value={leadData.brand_slogan_or_motto || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Preferencia de Estilo Visual"
              name="brand_style_preference"
              value={leadData.brand_style_preference || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Valores de la Marca"
              name="brand_values"
              multiline
              rows={4}
              value={leadData.brand_values || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Virtudes de la Marca"
              name="brand_virtues"
              multiline
              rows={4}
              value={leadData.brand_virtues || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Colores de la Marca"
              name="colors"
              value={leadData.colors || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
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
              label="Competidores Principales"
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
            <TextField
              label="Rango de Edad Objetivo"
              name="target_age_range"
              value={leadData.target_age_range || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Género Objetivo"
              name="target_gender"
              value={leadData.target_gender || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Intereses del Público Objetivo"
              name="target_interests"
              multiline
              rows={4}
              value={leadData.target_interests || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Etapa del Ciclo de Vida"
              name="target_lifecycle_stage"
              value={leadData.target_lifecycle_stage || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: "#4a5568" } }}
              sx={{ bgcolor: "#f7fafc" }}
            />
            <TextField
              label="Nivel Socioeconómico Objetivo"
              name="target_socioeconomic_level"
              value={leadData.target_socioeconomic_level || ""}
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