// frontend_github\jschat_fronted\src\components\backend\customers\index.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Typography, Modal, Card, CardContent, Tabs, Tab } from "@mui/material";
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-primary)', color: 'var(--text-primary)', p: 4 }}>
      <ToastContainer />
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" mb={4} gap={2}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: 'var(--text-primary)' }}>
          Gestión de Clientes
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
          <Button
            variant="outlined"
            onClick={() => setViewMode(viewMode === "table" ? "pipeline" : "table")}
            sx={{
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
              '&:hover': { background: 'var(--accent-primary)', color: '#fff', borderColor: 'var(--accent-primary)' }
            }}
          >
            {viewMode === "table" ? "Vista Pipeline" : "Vista Tabla"}
          </Button>
          {(currentUser?.userprofile?.staff_status === "administrator" ||
            currentUser?.userprofile?.staff_status === "sales") && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCreateModal(true)}
              sx={{
                background: 'var(--accent-hover)',
                color: '#fff',
                '&:hover': { background: 'var(--accent-primary)', boxShadow: 'var(--glow-neon)' }
              }}
            >
              Nuevo Cliente
            </Button>
          )}
          {currentUser?.userprofile?.staff_status === "administrator" && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownloadCSV}
              sx={{
                background: 'var(--accent-hover)',
                color: '#fff',
                '&:hover': { background: 'var(--accent-primary)', boxShadow: 'var(--glow-neon)' }
              }}
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

      {/* === MODAL DETALLES === */}
      {showDetailsModal && modalCustomer && (
        <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: '95%', sm: '80%', md: '70%' },
              maxWidth: 900,
              bgcolor: 'var(--bg-primary)',
              border: '1px solid var(--border-primary)',
              boxShadow: 'var(--shadow-light), var(--glow-neon)',
              p: 4,
              borderRadius: 3,
              maxHeight: '90vh',
              overflowY: 'auto',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              Detalles del Cliente
            </Typography>
            <Tabs value={0} sx={{ mb: 2, borderBottom: `1px solid var(--border-primary)` }}>
              <Tab label="Información" sx={{ color: 'var(--text-primary)' }} />
            </Tabs>
            <Card sx={{ bgcolor: 'var(--bg-secondary)', mb: 2, border: `1px solid var(--border-primary)` }}>
              <CardContent>
                {[
                  { label: 'Nombre', value: modalCustomer.name },
                  { label: 'Tipo de ID', value: modalCustomer.id_type },
                  { label: 'Número de ID', value: modalCustomer.id_number },
                  { label: 'Email', value: modalCustomer.email },
                  { label: 'Teléfono', value: modalCustomer.phone_number },
                  { label: 'Dirección', value: modalCustomer.address },
                  { label: 'Empresa', value: modalCustomer.company },
                  { label: 'Tipo de Contacto', value: modalCustomer.tipo_contacto },
                ].map((item) => (
                  <Typography key={item.label} sx={{ color: 'var(--text-secondary)', mb: 1 }}>
                    <strong>{item.label}:</strong> {item.value || "No disponible"}
                  </Typography>
                ))}
              </CardContent>
            </Card>

            {/* PEDIDOS */}
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>Pedidos</Typography>
            {customerOrders.length > 0 ? (
              customerOrders.map((order) => (
                <Card key={order.id} sx={{ bgcolor: 'var(--bg-secondary)', mb: 2, border: `1px solid var(--border-primary)` }}>
                  <CardContent>
                    {[
                      { label: 'Número de Orden', value: order.order_number },
                      { label: 'Número de Pedido', value: order.pedido_number },
                      { label: 'Tipo', value: order.order_type },
                      { label: 'Estado', value: order.status },
                      { label: 'Fecha de Entrega', value: order.delivery_date },
                    ].map((item) => (
                      <Typography key={item.label} sx={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <strong>{item.label}:</strong> {item.value || "No disponible"}
                      </Typography>
                    ))}
                    <Typography sx={{ color: 'var(--text-secondary)', mt: 1 }}>
                      <strong>Ítems:</strong>
                      <ul className="pl-5">
                        {order.order_items?.map((item) => (
                          <li key={item.id}>
                            {item.product?.name || item.product_type?.name || "Producto"} - Cant: {item.quantity} - Precio: {item.unit_price}
                          </li>
                        ))}
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography sx={{ color: 'var(--text-secondary)' }}>No hay pedidos disponibles.</Typography>
            )}

            {/* FACTURAS */}
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', mb: 2 }}>Facturas</Typography>
            {customerInvoices.length > 0 ? (
              customerInvoices.map((invoice) => (
                <Card key={invoice.id} sx={{ bgcolor: 'var(--bg-secondary)', mb: 2, border: `1px solid var(--border-primary)` }}>
                  <CardContent>
                    {[
                      { label: 'Número de Factura', value: invoice.invoice_number },
                      { label: 'Monto Total', value: invoice.total_amount },
                      { label: 'Impuestos', value: invoice.tax },
                      { label: 'Fecha de Emisión', value: invoice.issued_date },
                      { label: 'Urgente', value: invoice.is_urgent ? "Sí" : "No" },
                    ].map((item) => (
                      <Typography key={item.label} sx={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <strong>{item.label}:</strong> {item.value || "No disponible"}
                      </Typography>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography sx={{ color: 'var(--text-secondary)' }}>No hay facturas disponibles.</Typography>
            )}

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                onClick={() => downloadPDF(modalCustomer)}
                sx={{
                  background: 'var(--accent-hover)',
                  color: '#fff',
                  '&:hover': { background: 'var(--accent-primary)', boxShadow: 'var(--glow-neon)' }
                }}
              >
                Descargar PDF
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowDetailsModal(false)}
                sx={{
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                  '&:hover': { background: 'var(--bg-secondary)', borderColor: 'var(--accent-primary)' }
                }}
              >
                Cerrar
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      <CustomerModal
        show={showCreateModal}
        onHide={() => { setShowCreateModal(false); setNewCustomer(initialCustomerState); }}
        isEditMode={false}
        customerData={newCustomer}
        handleInputChange={(e) => handleInputChange(e, setNewCustomer)}
        handleSave={handleSaveNewCustomer}
      />

      <CustomerModal
        show={showEditModal}
        onHide={() => { setShowEditModal(false); setEditedCustomer(initialCustomerState); setIsEditMode(false); }}
        isEditMode={true}
        customerData={editedCustomer}
        handleInputChange={(e) => handleInputChange(e, setEditedCustomer)}
        handleSave={handleSaveEditedCustomer}
      />

      <DeleteConfirmationToast show={showDeleteToast} onClose={() => setShowDeleteToast(false)} message={deleteToastMessage} onConfirm={handleDelete} />
      <ErrorToast show={!!errorToast} onClose={() => setErrorToast(null)} message={errorToast} />
    </Box>
  );
};

export default ContactsInfo;