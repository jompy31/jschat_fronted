import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Typography, Switch, Modal, Card, CardContent } from "@mui/material";
import { Add, Download } from "@mui/icons-material";
import { DragDropContext } from "react-beautiful-dnd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeadTable from "./components/LeadTable";
import LeadModal from "./components/LeadModal";
import CommentsModal from "./components/CommentsModal";
import DeleteConfirmationToast from "./components/DeleteConfirmationToast";
import ErrorToast from "./components/ErrorToast";
import PipelineView from "./components/PipelineView";
import { validateLead, initialLeadState, convertToCSV } from "./utils/leadUtils";
import { downloadPDF, downloadLeadPDF } from "./utils/pdfUtils";
import { loadLeads, createLead, updateLead, deleteLead, createComment, getLeadComments, deleteComment } from "./utils/apiUtils";
import "./ContactsInfo.css";

const ContactsInfo = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newLead, setNewLead] = useState(initialLeadState);
  const [editedLead, setEditedLead] = useState(initialLeadState);
  const [activeTab, setActiveTab] = useState("client");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [selectedLeadComments, setSelectedLeadComments] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [deleteToastMessage, setDeleteToastMessage] = useState("");
  const [errorToast, setErrorToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal1, setShowModal1] = useState(false);
  const [modalLead, setModalLead] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [darkMode, setDarkMode] = useState(false);
  const token = useSelector((state) => state.authentication.token);

  useEffect(() => {
    const currentUserData = localStorage.getItem("currentUser");
    if (currentUserData) {
      try {
        setCurrentUser(JSON.parse(currentUserData));
      } catch (error) {
        console.error("Error parsing currentUser data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      loadLeads(token).then(setLeads).catch(() => setErrorToast("Error al cargar leads"));
    }
  }, [token]);

  const handleLeadClick = (lead) => {
    setModalLead(lead);
    setShowModal1(true);
  };

  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setEditedLead({ ...initialLeadState, ...lead });
    setImagePreview(lead.company_logo || null);
    setShowEditModal(true);
    setIsEditMode(true);
  };

  const handleInputChange = (event, setLead) => {
    const { name, value, files } = event.target;
    setLead((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (name === "company_logo" && files) {
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSaveNewLead = async () => {
    if (!validateLead(newLead)) return;
    try {
      await createLead(newLead, token);
      setShowCreateModal(false);
      setNewLead(initialLeadState);
      setLeads(await loadLeads(token));
    } catch (error) {
      setErrorToast(error.response?.data?.error || "Error al crear lead");
    }
  };

  const handleSaveEditedLead = async () => {
    if (!validateLead(editedLead)) return;
    try {
      await updateLead(selectedLead.id, editedLead, token);
      if (editedLead.comment) {
        await createComment(selectedLead.id, editedLead.comment, token);
      }
      setShowEditModal(false);
      setLeads(await loadLeads(token));
    } catch (error) {
      setErrorToast(error.response?.data?.error || "Error al actualizar lead");
    }
  };

  const handleCreateComment = async (lead) => {
    const comment = prompt("Escribe tu comentario:");
    if (comment && comment.trim()) {
      try {
        await createComment(lead.id, comment, token);
        setLeads(await loadLeads(token));
      } catch (error) {
        setErrorToast("Error al crear comentario");
      }
    } else {
      setErrorToast("El comentario no puede estar vacío");
    }
  };

  const handleLastCommentClick = async (lead) => {
    try {
      const response = await getLeadComments(lead.id, token);
      setSelectedLeadComments(response.data);
      setSelectedLeadId(lead.id);
      setShowCommentsModal(true);
    } catch (error) {
      setErrorToast("Error al cargar comentarios");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(selectedLeadId, commentId, token);
      setSelectedLeadComments((comments) => comments.filter((c) => c.id !== commentId));
    } catch (error) {
      setErrorToast("Error al eliminar comentario");
    }
  };

  const handleDeleteConfirmation = (lead) => {
    setSelectedLead(lead);
    setDeleteToastMessage(`¿Estás seguro de que quieres eliminar ${lead.name}?`);
    setShowDeleteToast(true);
  };

  const handleDelete = async () => {
    try {
      await deleteLead(selectedLead.id, token);
      setShowDeleteToast(false);
      setSelectedLead(null);
      setLeads(await loadLeads(token));
    } catch (error) {
      setErrorToast("Error al eliminar lead");
    }
  };

  const handleDownloadCSV = async () => {
    try {
      const csvData = await convertToCSV(leads, Object.keys(leads[0] || {}), token);
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clientes.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrorToast("Error al descargar CSV");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newLeads = [...leads];
    const [movedLead] = newLeads.splice(result.source.index, 1);
    movedLead.status = result.destination.droppableId;
    newLeads.splice(result.destination.index, 0, movedLead);
    setLeads(newLeads);
    updateLead(movedLead.id, movedLead, token).catch(() =>
      setErrorToast("Error al actualizar estado")
    );
  };

  return (
    <Box className={`container ${darkMode ? "dark" : "light"}`} sx={{ p: 4 }}>
      <ToastContainer />
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Gestión de Clientes</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            label="Modo Oscuro"
          />
          <Button
            variant="outlined"
            onClick={() => setViewMode(viewMode === "table" ? "pipeline" : "table")}
          >
            {viewMode === "table" ? "Vista Pipeline" : "Vista Tabla"}
          </Button>
          {(currentUser?.staff_status === "administrator" ||
            currentUser?.staff_status === "sales") && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateModal(true)}
            >
              Nuevo Cliente
            </Button>
          )}
          {currentUser?.staff_status === "administrator" && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownloadCSV}
            >
              Descargar CSV
            </Button>
          )}
        </Box>
      </Box>

      {viewMode === "table" ? (
        <LeadTable
          leads={leads}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentPage={currentPage}
          handlePageChange={setCurrentPage}
          handleLeadClick={handleLeadClick}
          handleDeleteConfirmation={handleDeleteConfirmation}
          handleEdit={handleEdit}
          handleLastCommentClick={handleLastCommentClick}
          handleCreateComment={handleCreateComment}
          currentUser={currentUser}
          handleDownloadlead={downloadLeadPDF}
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <PipelineView leads={leads} />
        </DragDropContext>
      )}

      {showModal1 && modalLead && (
        <Modal open={showModal1} onClose={() => setShowModal1(false)}>
          <Box
            className="modal"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 800,
              bgcolor: "#ffffff", // Solid white background
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
              p: 4,
              borderRadius: 12,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: "#1a202c" }}>
              Detalles del Cliente
            </Typography>
            <Card sx={{ bgcolor: "#f7fafc" }}>
              <CardContent id="modal-content">
                <Box display="flex" alignItems="center" mb={2}>
                  {modalLead.company_logo && (
                    <img
                      src={modalLead.company_logo}
                      alt="Logo"
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "contain",
                        mr: 2,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                  )}
                  <Typography variant="h6" sx={{ color: "#1a202c" }}>
                    {modalLead.company_name}
                  </Typography>
                </Box>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Contacto:</strong> {modalLead.contact_person_name || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Email:</strong> {modalLead.email || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Teléfono:</strong> {modalLead.contact_person_phone || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Actividad:</strong> {modalLead.commercial_activity || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Descripción:</strong> {modalLead.description || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Prioridad:</strong> {modalLead.priority || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Estado:</strong> {modalLead.status || "No disponible"}
                </Typography>
                <Typography variant="h6" mt={2} sx={{ color: "#1a202c" }}>
                  Información de Marca
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Categoría:</strong> {modalLead.brand_category || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Descripción:</strong> {modalLead.brand_description || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Diferenciación:</strong> {modalLead.brand_differentiation || "No disponible"}
                </Typography>
              </CardContent>
            </Card>
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                onClick={() => downloadPDF(modalLead)}
                sx={{ bgcolor: "#3182ce", "&:hover": { bgcolor: "#2b6cb0" } }}
              >
                Descargar PDF
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowModal1(false)}
                sx={{ color: "#718096", borderColor: "#e2e8f0" }}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      <LeadModal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setNewLead(initialLeadState);
          setImagePreview(null);
        }}
        isEditMode={false}
        leadData={newLead}
        handleInputChange={(e) => handleInputChange(e, setNewLead)}
        handleSave={handleSaveNewLead}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        imagePreview={imagePreview}
      />

      <LeadModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditedLead(initialLeadState);
          setIsEditMode(false);
          setImagePreview(null);
        }}
        isEditMode={true}
        leadData={editedLead}
        handleInputChange={(e) => handleInputChange(e, setEditedLead)}
        handleSave={handleSaveEditedLead}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        imagePreview={imagePreview}
      />

      <CommentsModal
        show={showCommentsModal}
        onHide={() => setShowCommentsModal(false)}
        comments={selectedLeadComments}
        handleDeleteComment={handleDeleteComment}
      />

      <DeleteConfirmationToast
        show={showDeleteToast}
        onClose={() => setShowDeleteToast(false)}
        message={deleteToastMessage}
        onConfirm={handleDelete}
      />

      <ErrorToast
        show={!!errorToast}
        onClose={() => setErrorToast(null)}
        message={errorToast}
      />
    </Box>
  );
};

export default ContactsInfo;