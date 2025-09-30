import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Typography, Switch, Modal, Card, CardContent, Tabs, Tab } from "@mui/material";
import { Add, Download } from "@mui/icons-material";
import { DragDropContext } from "react-beautiful-dnd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerTable from "./components/CustomerTable";
import CustomerModal from "./components/CustomerModal";
import DeleteConfirmationToast from "./components/DeleteConfirmationToast";
import ErrorToast from "./components/ErrorToast";
import CustomerPipelineView from "./components/CustomerPipelineView";
import { validateCustomer, initialCustomerState, convertToCSV } from "./utils/customerUtils";
import { downloadPDF, downloadCustomerPDF } from "./utils/pdfUtils";
import { loadCustomers, createCustomer, updateCustomer, deleteCustomer, loadCustomerOrders, loadCustomerInvoices } from "./utils/apiUtils";
import "./ContactsInfo.css";

const ContactsInfo = () => {
  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newCustomer, setNewCustomer] = useState(initialCustomerState);
  const [editedCustomer, setEditedCustomer] = useState(initialCustomerState);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [deleteToastMessage, setDeleteToastMessage] = useState("");
  const [errorToast, setErrorToast] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalCustomer, setModalCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [customerInvoices, setCustomerInvoices] = useState([]);
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
    if (token) {
      const fetchCustomers = async () => {
        try {
          const { customers, totalCount } = await loadCustomers(token, currentPage, searchTerm);
          // Filtrar clientes válidos
          const validCustomers = customers.filter(customer => customer && customer.id && customer.name);
          setCustomers(validCustomers);
          setTotalCount(totalCount);
        } catch (error) {
          setErrorToast("Error al cargar clientes");
        }
      };
      fetchCustomers();
    }
  }, [token, currentPage, searchTerm]);

  const handleCustomerClick = async (customer) => {
    setModalCustomer(customer);
    setShowDetailsModal(true);
    try {
      const orders = await loadCustomerOrders(customer.id, token);
      const invoices = await loadCustomerInvoices(customer.id, token);
      setCustomerOrders(orders);
      setCustomerInvoices(invoices);
    } catch (error) {
      setErrorToast("Error al cargar datos del cliente");
    }
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setEditedCustomer({ ...initialCustomerState, ...customer });
    setShowEditModal(true);
    setIsEditMode(true);
  };

  const handleInputChange = (event, setCustomer) => {
    const { name, value } = event.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveNewCustomer = async () => {
    if (!validateCustomer(newCustomer)) return;
    try {
      await createCustomer(newCustomer, token);
      setShowCreateModal(false);
      setNewCustomer(initialCustomerState);
      const { customers, totalCount } = await loadCustomers(token, currentPage, searchTerm);
      const validCustomers = customers.filter(customer => customer && customer.id && customer.name);
      setCustomers(validCustomers);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorToast(error.response?.data?.id_number?.[0] || error.response?.data?.error || "Error al crear cliente");
    }
  };

  const handleSaveEditedCustomer = async () => {
    if (!validateCustomer(editedCustomer)) return;
    try {
      await updateCustomer(selectedCustomer.id, editedCustomer, token);
      setShowEditModal(false);
      const { customers, totalCount } = await loadCustomers(token, currentPage, searchTerm);
      const validCustomers = customers.filter(customer => customer && customer.id && customer.name);
      setCustomers(validCustomers);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorToast(error.response?.data?.id_number?.[0] || error.response?.data?.error || "Error al actualizar cliente");
    }
  };

  const handleDeleteConfirmation = (customer) => {
    setSelectedCustomer(customer);
    setDeleteToastMessage(`¿Estás seguro de que quieres eliminar a ${customer.name}?`);
    setShowDeleteToast(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(selectedCustomer.id, token);
      setShowDeleteToast(false);
      setSelectedCustomer(null);
      const { customers, totalCount } = await loadCustomers(token, currentPage, searchTerm);
      const validCustomers = customers.filter(customer => customer && customer.id && customer.name);
      setCustomers(validCustomers);
      setTotalCount(totalCount);
    } catch (error) {
      setErrorToast("Error al eliminar cliente");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDownloadCSV = async () => {
    try {
      const csvData = await convertToCSV(customers, [
        "name", "id_type", "id_number", "email", "phone_number", "address", "company", "tipo_contacto"
      ], token);
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
    const newCustomers = [...customers];
    const [movedCustomer] = newCustomers.splice(result.source.index, 1);
    if (movedCustomer && movedCustomer.id && movedCustomer.name) {
      newCustomers.splice(result.destination.index, 0, movedCustomer);
      setCustomers(newCustomers);
    }
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
          {(currentUser?.userprofile?.staff_status === "administrator" ||
            currentUser?.userprofile?.staff_status === "sales") && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateModal(true)}
            >
              Nuevo Cliente
            </Button>
          )}
          {currentUser?.userprofile?.staff_status === "administrator" && (
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
        <CustomerTable
          customers={customers}
          totalCount={totalCount}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          handleCustomerClick={handleCustomerClick}
          handleDeleteConfirmation={handleDeleteConfirmation}
          handleEdit={handleEdit}
          currentUser={currentUser}
          handleDownloadCustomer={downloadCustomerPDF}
        />
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <CustomerPipelineView customers={customers} />
        </DragDropContext>
      )}

      {showDetailsModal && modalCustomer && (
        <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
          <Box
            className="modal"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 800,
              bgcolor: "#ffffff",
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
            <Tabs value={0} sx={{ mb: 2, borderBottom: "1px solid #e2e8f0" }}>
              <Tab label="Información" sx={{ color: "#1a202c" }} />
            </Tabs>
            <Card sx={{ bgcolor: "#f7fafc", mb: 2 }}>
              <CardContent>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Nombre:</strong> {modalCustomer.name || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Tipo de ID:</strong> {modalCustomer.id_type || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Número de ID:</strong> {modalCustomer.id_number || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Email:</strong> {modalCustomer.email || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Teléfono:</strong> {modalCustomer.phone_number || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Dirección:</strong> {modalCustomer.address || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Empresa:</strong> {modalCustomer.company || "No disponible"}
                </Typography>
                <Typography sx={{ color: "#4a5568" }}>
                  <strong>Tipo de Contacto:</strong> {modalCustomer.tipo_contacto || "No disponible"}
                </Typography>
              </CardContent>
            </Card>
            <Typography variant="h6" sx={{ color: "#1a202c", mb: 2 }}>
              Pedidos
            </Typography>
            {customerOrders.length > 0 ? (
              customerOrders.map((order) => (
                <Card key={order.id} sx={{ bgcolor: "#f7fafc", mb: 2 }}>
                  <CardContent>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Número de Orden:</strong> {order.order_number || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Número de Pedido:</strong> {order.pedido_number || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Tipo:</strong> {order.order_type || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Estado:</strong> {order.status || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Fecha de Entrega:</strong> {order.delivery_date || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Ítems:</strong>
                      <ul>
                        {order.order_items?.map((item) => (
                          <li key={item.id}>
                            {item.product?.name || item.product_type?.name || "Producto personalizado"} - Cantidad: {item.quantity} - Precio Unitario: {item.unit_price}
                          </li>
                        ))}
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography sx={{ color: "#4a5568" }}>No hay pedidos disponibles.</Typography>
            )}
            <Typography variant="h6" sx={{ color: "#1a202c", mb: 2 }}>
              Facturas
            </Typography>
            {customerInvoices.length > 0 ? (
              customerInvoices.map((invoice) => (
                <Card key={invoice.id} sx={{ bgcolor: "#f7fafc", mb: 2 }}>
                  <CardContent>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Número de Factura:</strong> {invoice.invoice_number || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Monto Total:</strong> {invoice.total_amount || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Impuestos:</strong> {invoice.tax || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Fecha de Emisión:</strong> {invoice.issued_date || "No disponible"}
                    </Typography>
                    <Typography sx={{ color: "#4a5568" }}>
                      <strong>Urgente:</strong> {invoice.is_urgent ? "Sí" : "No"}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography sx={{ color: "#4a5568" }}>No hay facturas disponibles.</Typography>
            )}
            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                onClick={() => downloadPDF(modalCustomer)}
                sx={{ bgcolor: "#3182ce", "&:hover": { bgcolor: "#2b6cb0" } }}
              >
                Descargar PDF
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowDetailsModal(false)}
                sx={{ color: "#718096", borderColor: "#e2e8f0" }}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      <CustomerModal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setNewCustomer(initialCustomerState);
        }}
        isEditMode={false}
        customerData={newCustomer}
        handleInputChange={(e) => handleInputChange(e, setNewCustomer)}
        handleSave={handleSaveNewCustomer}
      />

      <CustomerModal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditedCustomer(initialCustomerState);
          setIsEditMode(false);
        }}
        isEditMode={true}
        customerData={editedCustomer}
        handleInputChange={(e) => handleInputChange(e, setEditedCustomer)}
        handleSave={handleSaveEditedCustomer}
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