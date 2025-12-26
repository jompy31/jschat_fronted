// frontend_github\jschat_fronted\src\components\backend\customers\index.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import ApiService from "../../../services/products"; 
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
  const [allOrders, setAllOrders] = useState([]); // ← NUEVO: todos los pedidos (como en Orders)
  const navigate = useNavigate();
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
      const fetchAllOrders = async () => {
        try {
          const response = await ApiService.getAllOrders(token);
          const data = Array.isArray(response.data) ? response.data : response.data.results || [];
          console.log("🔥 Todos los pedidos cargados (para clientes):", data);
          setAllOrders(data);
        } catch (error) {
          console.error("Error cargando todos los pedidos:", error);
        }
      };
      fetchAllOrders();
    }
  }, [token]);
  

  useEffect(() => {
    if (token) {
      const fetchCustomers = async () => {
        try {
          const { customers, totalCount } = await loadCustomers(token, currentPage, searchTerm);
          const validCustomers = customers.filter(customer => customer && customer.id && customer.name);
          console.log("👥 Clientes cargados:", validCustomers);
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

    // Filtrar pedidos del cliente actual desde todos los pedidos
    const ordersForThisCustomer = allOrders.filter(order => 
      order.customer && order.customer.id === customer.id
    );

    console.log(`🛒 Pedidos del cliente ${customer.name} (ID: ${customer.id}):`, ordersForThisCustomer);

    setCustomerOrders(ordersForThisCustomer);

    // Opcional: cargar facturas si aún las necesitas (puedes mantener tu función)
    try {
      const invoices = await loadCustomerInvoices(customer.id, token);
      setCustomerInvoices(invoices);
    } catch (error) {
      console.error("Error cargando facturas:", error);
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

  const handleOrderClick = (orderId) => {
    setShowDetailsModal(false);
    navigate("/orders"); // va a la página de pedidos
    // Opcional: podrías pasar state para destacar el pedido
    // navigate("/backend/orders", { state: { highlightOrderId: orderId } });
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
              Detalles de {modalCustomer.name}
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
    <Card
      key={order.id}
      sx={{
        bgcolor: 'var(--bg-secondary)',
        mb: 3,
        border: `1px solid var(--border-primary)`,
        cursor: "pointer",
        transition: "all 0.3s ease",
        '&:hover': {
          boxShadow: 'var(--glow-neon)',
          transform: 'translateY(-4px)',
          borderColor: 'var(--accent-blue)'
        }
      }}
      onClick={() => handleOrderClick(order.id)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--accent-blue)' }}>
            {order.order_number} ({order.pedido_number})
          </Typography>
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              backgroundColor:
                order.status === 'completed' ? '#4caf50' :
                order.status === 'in_progress' ? '#2196f3' :
                order.status.includes('design') ? '#ff9800' :
                order.status === 'pending' ? '#ff5722' : '#9e9e9e',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {order.status.replace('_', ' ').toUpperCase()}
          </Box>
        </Box>

        <Typography><strong>Tipo:</strong> {order.order_type}</Typography>
        <Typography><strong>Fecha de entrega:</strong> {order.delivery_date || "No definida"}</Typography>

        {/* ÍTEMS DEL PEDIDO */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Ítems ({order.items?.length || 0})
        </Typography>

        {order.items && order.items.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {order.items.map((item, index) => (
              <Card
                key={item.id}
                sx={{
                  bgcolor: 'var(--bg-primary)',
                  border: '1px dashed var(--border-primary)',
                  p: 2
                }}
              >
                <Box display="flex" gap={3} alignItems="flex-start">
                  {/* IMAGEN DEL DISEÑO */}
                  {item.design_file ? (
                    <Box
                      component="img"
                      src={item.design_file}
                      alt={`Diseño del ítem ${index + 1}`}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'contain',
                        borderRadius: 2,
                        border: '1px solid var(--border-primary)',
                        bgcolor: 'white'
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: '#333',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        border: '1px dashed var(--border-primary)'
                      }}
                    >
                      Sin imagen
                    </Box>
                  )}

                  {/* DETALLES DEL ÍTEM */}
                  <Box flex={1}>
                    <Typography><strong>Cantidad:</strong> {item.quantity}</Typography>
                    <Typography><strong>Precio unitario:</strong> ₡{parseFloat(item.unit_price).toLocaleString()}</Typography>
                    <Typography><strong>Total ítem:</strong> ₡{(item.quantity * parseFloat(item.unit_price)).toLocaleString()}</Typography>
                    <Typography color="text.secondary" fontSize="0.9rem">
                      Producto ID: {item.product || 'N/A'} {item.product_type ? `(Tipo: ${item.product_type})` : ''}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        ) : (
          <Typography color="text.secondary">No hay ítems registrados.</Typography>
        )}
      </CardContent>
    </Card>
  ))
) : (
  <Card sx={{ bgcolor: 'var(--bg-secondary)', p: 3, textAlign: 'center' }}>
    <Typography sx={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
      Este cliente no tiene pedidos aún.
    </Typography>
  </Card>
)}
{/* PAGOS DEL CLIENTE (agrupados por pedido) */}
<Typography variant="h6" sx={{ mb: 2, mt: 4, color: 'var(--text-primary)' }}>
  Pagos Realizados
</Typography>

{customerOrders.some(order => order.payments && order.payments.length > 0) ? (
  customerOrders.map((order) => (
    order.payments && order.payments.length > 0 && (
      <Card
        key={`payments-${order.id}`}
        sx={{
          bgcolor: 'var(--bg-secondary)',
          mb: 3,
          border: `1px solid var(--border-primary)`,
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--accent-blue)', mb: 1 }}>
            Pagos del pedido: {order.order_number}
          </Typography>

          {order.payments.map((payment) => (
            <Card
              key={payment.id}
              sx={{
                bgcolor: 'var(--bg-primary)',
                mb: 2,
                p: 2,
                border: '1px dashed var(--border-primary)',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography><strong>Fecha:</strong> {new Date(payment.payment_date).toLocaleDateString()}</Typography>
                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    backgroundColor: payment.payment_type === 'full' ? '#4caf50' : '#2196f3',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  {payment.payment_type.replace('_', ' ').toUpperCase()}
                </Box>
              </Box>

              <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#4ade80', mb: 1 }}>
                Monto: ₡{parseFloat(payment.amount).toLocaleString('es-CR')}
              </Typography>

              {/* Documento adjunto (imagen o PDF) */}
              {payment.reference_document && (
                <Box mt={1}>
                  {payment.reference_document.endsWith('.pdf') ? (
                    <a
                      href={payment.reference_document}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: 'var(--accent-blue)',
                        textDecoration: 'none',
                        fontWeight: 500
                      }}
                    >
                      {/* <FaFileAlt size={20} /> */}
                      Ver Comprobante PDF
                    </a>
                  ) : (
                    <Box
                      component="img"
                      src={payment.reference_document}
                      alt="Comprobante de pago"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 300,
                        borderRadius: 2,
                        border: '1px solid var(--border-primary)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}
                    />
                  )}
                </Box>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>
    )
  ))
) : (
  <Card sx={{ bgcolor: 'var(--bg-secondary)', p: 3, textAlign: 'center' }}>
    <Typography sx={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
      Este cliente aún no tiene pagos registrados.
    </Typography>
  </Card>
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