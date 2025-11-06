import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDownload, FaTable, FaColumns, FaTrash } from 'react-icons/fa';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import OrderDetailModal from './detail';
import CreateOrder from './create';
import ApiService from '../../../services/products';
import './orders.css';

// Sortable Order Card Component
const SortableOrderCard = ({ order, onClick, onDownloadPDF, onDeleteOrder, userRole }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: order.id 
  });

  const style = {
    transform: CSS.Transform.toString(transform ? { ...transform, scaleX: 1.05, scaleY: 1.05 } : null),
    transition: transition || 'transform 0.2s ease',
    opacity: isDragging ? 0.7 : 1,
    transformOrigin: 'top left',
    boxShadow: isDragging ? '0 8px 24px var(--shadow), 0 0 10px var(--accent-blue)' : 'none',
    border: isDragging ? '2px solid var(--accent-blue)' : '1px solid var(--border)',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="pipeline-card"
      onClick={onClick}
    >
      <p className="font-semibold">{order.order_number}</p>
      <p>{order.customer?.name || 'N/A'}</p>
      <p>{order.order_type}</p>
      <p>{order.delivery_date || 'N/A'}</p>
      <div className="pipeline-card-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadPDF(order.id);
          }}
          className="btn-icon btn-info"
          title="Descargar PDF"
        >
          <FaDownload />
        </button>
        {userRole === 'administrator' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteOrder(order.id);
            }}
            className="btn-icon btn-danger"
            title="Eliminar"
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortField, setSortField] = useState('order_number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('table');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole1 = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userRole = userRole1?.userprofile?.staff_status;

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      const response = await ApiService.getAllOrders(token);
      const data = Array.isArray(response.data) ? response.data : [];
      console.log('Fetched orders:', data);
      setOrders(data);
      setFilteredOrders(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('No se pudieron cargar los pedidos. Por favor, intenta de nuevo.');
      setOrders([]);
      setFilteredOrders([]);
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      if (field === 'customer') {
        const nameA = a.customer?.name || '';
        const nameB = b.customer?.name || '';
        return isAsc ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
      }
      return isAsc ? bValue.localeCompare(aValue) : aValue.localeCompare(aValue);
    });
    setFilteredOrders(sortedOrders);
  };

  const handleDownloadPDF = async (orderId) => {
    try {
      const response = await ApiService.downloadInvoicePDF(orderId, token);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Error al descargar el PDF.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) return;
    try {
      const order = orders.find((o) => o.id === orderId);
      if (userRole === 'design' && !['design_pending', 'design_confirmed'].includes(order.status)) {
        setError('Usuarios con rol de diseño solo pueden eliminar pedidos en estado "design_pending" o "design_confirmed".');
        return;
      }
      if (userRole === 'customer' && order.customer_id !== userRole1?.id) {
        setError('Los clientes solo pueden eliminar sus propios pedidos.');
        return;
      }
      await ApiService.deleteOrder(orderId, token);
      fetchOrders();
      setError(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      const errorDetail = error.response?.data?.detail || 'Error al eliminar el pedido.';
      setError(errorDetail);
    }
  };

  const handleDeleteEvent = async (orderId, eventId) => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;
    try {
      await ApiService.deleteOrderEvent(orderId, eventId, token);
      fetchOrders();
      setError(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      const errorDetail = error.response?.data?.error || error.response?.data?.detail || 'Error al eliminar el evento.';
      setError(errorDetail);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!window.confirm('¿Estás seguro de eliminar este pago?')) return;
    try {
      await ApiService.deletePayment(paymentId, token);
      fetchOrders();
      setError(null);
    } catch (error) {
      console.error('Error deleting payment:', error);
      const errorDetail = error.response?.data?.error || error.response?.data?.detail || 'Error al eliminar el pago.';
      setError(errorDetail);
    }
  };

  // === handleDragEnd CORREGIDO AL 100% ===
const handleDragEnd = async (event) => {
  const { active, over } = event;

  console.log('Drag event:', { active, over });

  if (!over) {
    console.warn('Dropped outside any column');
    return;
  }

  const orderId = active.id; // ID del pedido que se mueve

  // CLAVE: Usar containerId de la columna destino
  const targetStatus = over.data?.current?.sortable?.containerId;

  if (!targetStatus) {
    console.error('No se pudo determinar el estado destino (containerId no encontrado)');
    setError('Error: No se pudo detectar la columna destino.');
    return;
  }

  console.log('Drag ended:', {
    orderId,
    targetStatus,
    activeId: active.id,
    overId: over.id,
    containerId: targetStatus,
  });

  // Validar estado
  const validStatuses = [
    'pending',
    'design_pending',
    'design_confirmed',
    'in_progress',
    'completed',
  ];

  if (!validStatuses.includes(targetStatus)) {
    console.error('Invalid target status:', targetStatus);
    setError(`Estado inválido: ${targetStatus}`);
    return;
  }

  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    console.error('Order not found:', orderId);
    setError('Pedido no encontrado.');
    return;
  }

  if (order.status === targetStatus) {
    console.log('No change in status');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('status', targetStatus);

    console.log('Enviando actualización:', { orderId, status: targetStatus });
    for (const [k, v] of formData.entries()) {
      console.log(`FormData → ${k}: ${v}`);
    }

    await ApiService.updateOrder(orderId, formData, token);
    console.log('Estado actualizado en el servidor');

    // Refrescar lista
    await fetchOrders();
    setError(null);
  } catch (error) {
    console.error('Error al actualizar estado:', error.response?.data || error);
    const msg = error.response?.data?.detail || 'Error al guardar el estado.';
    setError(msg);
  }
};

  // === ESTADOS VÁLIDOS PARA COLUMNAS ===
  const pipelineStatuses = [
    'pending',
    'design_pending',
    'design_confirmed',
    'in_progress',
    'completed',
  ];

  return (
    <div className="orders-container">
      <div className="orders-content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="page-title">Gestión de Pedidos</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <FaPlus /> Crear Pedido
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'pipeline' : 'table')}
              className="btn btn-secondary"
            >
              {viewMode === 'table' ? <FaColumns /> : <FaTable />}
              {viewMode === 'table' ? 'Vista Pipeline' : 'Vista Tabla'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {viewMode === 'table' ? (
          <div className="card">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    {['order_number', 'customer', 'status', 'order_type', 'delivery_date', 'Acciones'].map((header) => (
                      <th
                        key={header}
                        onClick={() => header !== 'Acciones' && handleSort(header === 'customer' ? 'customer' : header)}
                        style={{ cursor: header !== 'Acciones' ? 'pointer' : 'default' }}
                      >
                        {header === 'customer' ? 'Cliente' :
                         header === 'order_number' ? 'Nº Orden' :
                         header === 'status' ? 'Estado' :
                         header === 'order_type' ? 'Tipo' :
                         header === 'delivery_date' ? 'Fecha Entrega' : header}
                        {sortField === (header === 'customer' ? 'customer' : header) && (
                          <span className="ml-1">{sortOrder === 'asc' ? 'Up' : 'Down'}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="table-row"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td>{order.order_number}</td>
                        <td>{order.customer?.name || 'N/A'}</td>
                        <td>{order.status}</td>
                        <td>{order.order_type}</td>
                        <td>{order.delivery_date || 'N/A'}</td>
                        <td className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPDF(order.id);
                            }}
                            className="btn-icon btn-info"
                            title="Descargar PDF"
                          >
                            <FaDownload />
                          </button>
                          {userRole === 'administrator' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order.id);
                              }}
                              className="btn-icon btn-danger"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4" style={{ color: 'var(--text-muted)' }}>
                        No hay pedidos disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {pipelineStatuses.map((status) => (
                <div
                  key={status}
                  id={status} // ID de la columna = estado
                  className="pipeline-column card"
                >
                  <h3 className="text-lg font-semibold mb-3 capitalize" style={{ color: 'var(--accent-blue)' }}>
                    {status.replace('_', ' ')}
                  </h3>
                  <SortableContext
                    id={status}
                    items={filteredOrders.filter((o) => o.status === status).map((o) => o.id)}
                    strategy={rectSortingStrategy}
                  >
                    {filteredOrders.filter((o) => o.status === status).length > 0 ? (
                      filteredOrders
                        .filter((o) => o.status === status)
                        .map((order) => (
                          <SortableOrderCard
                            key={order.id}
                            order={order}
                            onClick={() => setSelectedOrder(order)}
                            onDownloadPDF={handleDownloadPDF}
                            onDeleteOrder={handleDeleteOrder}
                            userRole={userRole}
                          />
                        ))
                    ) : (
                      <p style={{ color: 'var(--text-muted)' }}>No hay pedidos en este estado.</p>
                    )}
                  </SortableContext>
                </div>
              ))}
            </div>
          </DndContext>
        )}

        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdate={fetchOrders}
            onDeleteEvent={(eventId) => handleDeleteEvent(selectedOrder.id, eventId)}
            onDeletePayment={(paymentId) => handleDeletePayment(paymentId)}
          />
        )}
        {showCreateModal && (
          <CreateOrder
            onClose={() => setShowCreateModal(false)}
            onCreate={fetchOrders}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;