import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaDownload, FaTable, FaColumns, FaEdit, FaTrash } from 'react-icons/fa';
import OrderDetailModal from './detail';
import CreateOrder from './create';
import EventModal from './add_event'; // Updated import
import ApiService from '../../../services/products';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortField, setSortField] = useState('order_number');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('table');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole1 = JSON.parse(localStorage.getItem('currentUser')); 
  const userRole = userRole1.userprofile.staff_status;

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
        return isAsc
          ? b.customer?.name?.localeCompare(a.customer?.name || '') || 0
          : a.customer?.name?.localeCompare(b.customer?.name || '') || 0;
      }
      return isAsc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
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
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        const order = orders.find(o => o.id === orderId);
        if (userRole === 'design' && !['design_pending', 'design_confirmed'].includes(order.status)) {
          setError('Usuarios con rol de diseño solo pueden eliminar pedidos en estado "design_pending" o "design_confirmed".');
          return;
        }
        if (userRole === 'customer' && order.customer_id !== JSON.parse(localStorage.getItem('currentUser'))?.id) {
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
    }
  };

  const handleDeleteEvent = async (orderId, eventId) => {
    if (window.confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        await axios.delete(`http://localhost:8000/api/orders/${orderId}/events/${eventId}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        fetchOrders();
        setError(null);
      } catch (error) {
        console.error('Error deleting event:', error);
        const errorDetail = error.response?.data?.detail || 'Error al eliminar el evento.';
        setError(errorDetail);
      }
    }
  };

  const pipelineStatuses = [
    'pending',
    'in_progress',
    'design_pending',
    'design_confirmed',
    'completed',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-400 animate-pulse">Gestión de Pedidos</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <FaPlus className="mr-2" /> Crear Pedido
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'pipeline' : 'table')}
              className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {viewMode === 'table' ? <FaColumns className="mr-2" /> : <FaTable className="mr-2" />}
              {viewMode === 'table' ? 'Vista Pipeline' : 'Vista Tabla'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4 animate-shake">
            {error}
          </div>
        )}

        {viewMode === 'table' ? (
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                <tr>
                  {['order_number', 'customer', 'status', 'order_type', 'delivery_date', 'Acciones'].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left cursor-pointer hover:bg-gray-600 transition-all duration-200"
                      onClick={() => header !== 'Acciones' && handleSort(header === 'customer' ? 'customer' : header)}
                    >
                      {header === 'customer' ? 'Cliente' : header === 'order_number' ? 'Nº Orden' : header === 'status' ? 'Estado' : header === 'order_type' ? 'Tipo' : header === 'delivery_date' ? 'Fecha Entrega' : header}
                      {sortField === (header === 'customer' ? 'customer' : header) && (
                        <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-700 hover:bg-gray-600 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-4 py-3">{order.order_number}</td>
                      <td className="px-4 py-3">{order.customer?.name || 'N/A'}</td>
                      <td className="px-4 py-3">{order.status}</td>
                      <td className="px-4 py-3">{order.order_type}</td>
                      <td className="px-4 py-3">{order.delivery_date || 'N/A'}</td>
                      <td className="px-4 py-3 flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadPDF(order.id);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <FaDownload />
                        </button>
                        {userRole === 'administrator' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-3 text-center">
                      No hay pedidos disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {pipelineStatuses.map((status) => (
              <div key={status} className="bg-gray-800 rounded-lg p-4 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 capitalize text-blue-400">{status.replace('_', ' ')}</h2>
                {Array.isArray(filteredOrders) && filteredOrders.filter((order) => order.status === status).length > 0 ? (
                  filteredOrders
                    .filter((order) => order.status === status)
                    .map((order) => (
                      <div
                        key={order.id}
                        className="bg-gray-700 p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-200 shadow-md"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <p className="font-semibold">{order.order_number}</p>
                        <p>{order.customer?.name || 'N/A'}</p>
                        <p>{order.order_type}</p>
                        <p>{order.delivery_date || 'N/A'}</p>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-400">No hay pedidos en este estado.</p>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdate={fetchOrders}
            onEditEvent={(event) => {
              setEditingEvent(event);
              setShowEventModal(true);
            }}
            onDeleteEvent={(eventId) => handleDeleteEvent(selectedOrder.id, eventId)}
          />
        )}
        {showCreateModal && (
          <CreateOrder
            onClose={() => setShowCreateModal(false)}
            onCreate={fetchOrders}
          />
        )}
        {showEventModal && (
          <EventModal
            orderId={selectedOrder?.id}
            event={editingEvent}
            isEdit={!!editingEvent}
            onClose={() => {
              setShowEventModal(false);
              setEditingEvent(null);
            }}
            onEventAdded={fetchOrders}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;