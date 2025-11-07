// frontend_github/jschat_frontend/src/components/backend/orders/detail/index.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaCalendarAlt, FaFileAlt, FaEdit } from 'react-icons/fa';
import ApiService from '../../../../services/products';
import EventPaymentModal from '../event_payment';
import './detail.css';

const OrderDetailModal = ({ order, onClose, onUpdate, onEditEvent, onEditPayment, onDeleteEvent, onDeletePayment }) => {
  const [formData, setFormData] = useState({
    customer_id: order.customer?.id || '',
    order_type: order.order_type || 'normal',
    status: order.status || 'pending',
    order_date: order.order_date || '',
    payment_50_date: order.payment_50_date || '',
    design_confirmation_date: order.design_confirmation_date || '',
    delivery_date: order.delivery_date || '',
    use_points: order.use_points || false,
    items: order.items?.map(item => ({
      id: item.id,
      product: item.product ? String(item.product) : '',
      product_type: item.product_type ? String(item.product_type) : '',
      quantity: item.quantity || 1,
      unit_price: parseFloat(item.unit_price) || 0.01,
      design_file: null,
      previewUrl: item.design_file || null,
    })) || [{ product: '', product_type: '', quantity: 1, unit_price: 0.01, design_file: null, previewUrl: null }],
    uniform_detail: order.uniform_detail ? {
      shirt_quantity: order.uniform_detail.shirt_quantity || 0,
      shirt_fabric: order.uniform_detail.shirt_fabric || '',
      pants_quantity: order.uniform_detail.pants_quantity || 0,
      pants_fabric: order.uniform_detail.pants_fabric || '',
      polo_quantity: order.uniform_detail.polo_quantity || 0,
      polo_fabric: order.uniform_detail.polo_fabric || '',
      bag_quantity: order.uniform_detail.bag_quantity || 0,
      bag_fabric: order.uniform_detail.bag_fabric || '',
      sponsorships: order.uniform_detail.sponsorships || '',
      player_uniform_photo: null,
      goalkeeper_uniform_photo: null,
      neck_photo: null,
      pants_photo: null,
      player_uniform_preview: order.uniform_detail.player_uniform_photo || null,
      goalkeeper_uniform_preview: order.uniform_detail.goalkeeper_uniform_photo || null,
      neck_preview: order.uniform_detail.neck_photo || null,
      pants_preview: order.uniform_detail.pants_photo || null,
      players: order.uniform_detail.players?.map(player => ({
        id: player.id,
        first_name: player.first_name || '',
        last_name: player.last_name || '',
        number: player.number || '',
        size: player.size || '',
        gender: player.gender || '',
        observaciones: player.observaciones || '',
        variaciones: player.variaciones || '',
      })) || [{ first_name: '', last_name: '', number: '', size: '', gender: '', observaciones: '', variaciones: '' }],
    } : null,
    payments: order.payments?.map(payment => ({
      id: payment.id,
      amount: parseFloat(payment.amount) || 0,
      payment_date: payment.payment_date || '',
      payment_type: payment.payment_type || 'partial',
      reference_document: payment.reference_document || null,
      previewUrl: payment.reference_document || null,
    })) || [],
  });
  const [events, setEvents] = useState(order.events || []); // New state for events
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [error, setError] = useState(null);
  const [showUniformDetails, setShowUniformDetails] = useState(!!order.uniform_detail);
  const [showEvents, setShowEvents] = useState(true);
  const [showPayments, setShowPayments] = useState(true);
  const [showProductionQueue, setShowProductionQueue] = useState(true);
  const [showEventPaymentModal, setShowEventPaymentModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userRole = currentUser?.userprofile?.staff_status || null;

  useEffect(() => {
    console.log('Order data received:', order);
    console.log('Initial formData.items:', formData.items);
    console.log('Datos de uniforme:', formData.uniform_detail);
    console.log('Datos de pagos:', formData.payments);
    console.log('Datos de eventos:', events);
    console.log('Datos de cola de producción:', order.production_queue);
    const fetchData = async () => {
      try {
        const [customersRes, productsRes, productTypesRes] = await Promise.all([
          ApiService.getAllCustomers(token),
          ApiService.getAllProducts(token),
          ApiService.getAllProductTypes(token),
        ]);
        const customersData = Array.isArray(customersRes.data.results) ? customersRes.data.results : Array.isArray(customersRes.data) ? customersRes.data : [];
        const productsData = Array.isArray(productsRes.data.results) ? productsRes.data.results : Array.isArray(productsRes.data) ? productsRes.data : [];
        const productTypesData = Array.isArray(productTypesRes.data.results) ? productTypesRes.data.results : Array.isArray(productTypesRes.data) ? productTypesRes.data : [];

        const transformedProducts = productsData.map(product => ({
          ...product,
          product_type: {
            ...product.product_type,
            base_price: parseFloat(product.product_type.base_price) || 0,
          },
          additional_price: parseFloat(product.additional_price) || 0,
        }));

        const transformedProductTypes = productTypesData.map(type => ({
          ...type,
          base_price: parseFloat(type.base_price) || 0,
        }));

        setCustomers(customersData);
        setProducts(transformedProducts);
        setProductTypes(transformedProductTypes);

        const updatedItems = formData.items.map(item => {
          const productExists = item.product && transformedProducts.some(p => p.id === parseInt(item.product));
          const productTypeExists = item.product_type && transformedProductTypes.some(pt => pt.id === parseInt(item.product_type));
          return {
            ...item,
            product: productExists ? item.product : '',
            product_type: productTypeExists ? item.product_type : '',
          };
        });
        setFormData(prev => ({ ...prev, items: updatedItems }));

        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('No se pudieron cargar los datos necesarios. Por favor, intenta de nuevo.');
      }
    };
    fetchData();
    return () => {
      formData.items.forEach(item => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
      formData.payments.forEach(payment => payment.previewUrl && URL.revokeObjectURL(payment.previewUrl));
      if (formData.uniform_detail) {
        ['player_uniform_preview', 'goalkeeper_uniform_preview', 'neck_preview', 'pants_preview'].forEach(field => {
          if (formData.uniform_detail[field] && formData.uniform_detail[field].startsWith('blob:')) {
            URL.revokeObjectURL(formData.uniform_detail[field]);
          }
        });
      }
    };
  }, [token, order]);

  useEffect(() => {
    if (formData.uniform_detail) {
      setFormData(prev => ({
        ...prev,
        uniform_detail: {
          ...prev.uniform_detail,
          shirt_quantity: prev.uniform_detail.players.filter(p => p.size).length,
        },
      }));
    }
  }, [formData.uniform_detail?.players]);

  const calculateSubtotal = (item) => {
    return (parseFloat(item.unit_price) || 0) * (parseInt(item.quantity, 10) || 0);
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + calculateSubtotal(item), 0).toFixed(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    if (field === 'design_file') {
      const file = value;
      if (file) {
        const validation = validateFile(file);
        if (!validation.valid) {
          setError(validation.error);
          return;
        }
        newItems[index].previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      } else {
        newItems[index].previewUrl && URL.revokeObjectURL(newItems[index].previewUrl);
        newItems[index].previewUrl = null;
      }
      newItems[index][field] = file;
    } else if (field === 'quantity') {
      const parsedValue = parseInt(value, 10);
      newItems[index][field] = isNaN(parsedValue) || parsedValue < 1 ? 1 : parsedValue;
    } else if (field === 'unit_price') {
      const parsedValue = parseFloat(value);
      newItems[index][field] = isNaN(parsedValue) || parsedValue <= 0 ? 0.01 : parseFloat(parsedValue.toFixed(2));
    } else {
      newItems[index][field] = value;
      if (field === 'product' && value) {
        const product = products.find(p => p.id === parseInt(value));
        if (product) {
          newItems[index].product_type = String(product.product_type.id);
          newItems[index].unit_price = parseFloat((product.product_type.base_price + product.additional_price).toFixed(2));
        } else {
          newItems[index].product_type = '';
          newItems[index].unit_price = 0.01;
        }
        newItems[index].design_file = null;
        newItems[index].previewUrl && URL.revokeObjectURL(newItems[index].previewUrl);
        newItems[index].previewUrl = null;
      } else if (field === 'product_type' && value) {
        const productType = productTypes.find(pt => pt.id === parseInt(value));
        newItems[index].product = '';
        newItems[index].unit_price = productType ? parseFloat(productType.base_price.toFixed(2)) : 0.01;
      }
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleUniformDetailChange = (field, value) => {
    setFormData({
      ...formData,
      uniform_detail: { ...formData.uniform_detail, [field]: value },
    });
  };

  const handleUniformImageChange = (field, file) => {
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error);
        return;
      }
      const previewField = `${field}_preview`;
      const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;

      if (formData.uniform_detail[previewField] && formData.uniform_detail[previewField].startsWith('blob:')) {
        URL.revokeObjectURL(formData.uniform_detail[previewField]);
      }

      setFormData({
        ...formData,
        uniform_detail: {
          ...formData.uniform_detail,
          [field]: file,
          [previewField]: previewUrl || formData.uniform_detail[previewField],
        },
      });
    }
  };

  const handlePlayerChange = (index, field, value) => {
    const newPlayers = [...formData.uniform_detail.players];
    newPlayers[index][field] = value;
    setFormData({
      ...formData,
      uniform_detail: {
        ...formData.uniform_detail,
        players: newPlayers,
      },
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', product_type: '', quantity: 1, unit_price: 0.01, design_file: null, previewUrl: null }],
    });
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems[index].previewUrl && URL.revokeObjectURL(newItems[index].previewUrl);
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const addPlayer = () => {
    setFormData({
      ...formData,
      uniform_detail: {
        ...formData.uniform_detail,
        players: [
          ...formData.uniform_detail.players,
          { first_name: '', last_name: '', number: '', size: '', gender: '', observaciones: '', variaciones: '' },
        ],
      },
    });
  };

  const removePlayer = (index) => {
    const newPlayers = [...formData.uniform_detail.players];
    newPlayers.splice(index, 1);
    setFormData({
      ...formData,
      uniform_detail: {
        ...formData.uniform_detail,
        players: newPlayers,
      },
    });
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!file) return { valid: true };
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `Tipo de archivo no permitido. Permitidos: ${allowedTypes.join(', ')}` };
    }
    if (file.size > maxSize) {
      return { valid: false, error: `El archivo excede el límite de ${maxSize / (1024 * 1024)}MB` };
    }
    return { valid: true };
  };

  const validateForm = () => {
    if (!formData.customer_id) {
      setError('Debes seleccionar un cliente.');
      return false;
    }
    if (formData.items.length === 0) {
      setError('Debes agregar al menos un ítem al pedido.');
      return false;
    }
    for (let i = 0; i < formData.items.length; i++) {
      const item = formData.items[i];
      if (!item.product && !item.product_type) {
        setError(`El ítem ${i + 1} debe especificar un producto o tipo de producto.`);
        return false;
      }
      if (item.product_type && !item.design_file && !item.previewUrl) {
        setError(`El ítem ${i + 1} requiere un archivo de diseño para productos personalizados.`);
        return false;
      }
      const quantity = parseInt(item.quantity, 10);
      if (!quantity || isNaN(quantity) || quantity < 1) {
        setError(`El ítem ${i + 1} debe tener una cantidad válida mayor o igual a 1.`);
        return false;
      }
      const unit_price = parseFloat(item.unit_price);
      if (!unit_price || isNaN(unit_price) || unit_price <= 0) {
        setError(`El ítem ${i + 1} debe tener un precio unitario válido mayor a 0.`);
        return false;
      }
    }
    if (showUniformDetails && formData.uniform_detail) {
      const players = formData.uniform_detail.players;
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player.first_name || !player.last_name || !player.number || !player.size || !player.gender) {
          setError(`El jugador ${i + 1} debe tener nombre, apellido, número, talla y género completos.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('customer_id', formData.customer_id);
      formDataToSend.append('order_type', formData.order_type);
      formDataToSend.append('status', formData.status);
      if (formData.order_date) formDataToSend.append('order_date', formData.order_date);
      if (formData.payment_50_date) formDataToSend.append('payment_50_date', formData.payment_50_date);
      if (formData.design_confirmation_date) formDataToSend.append('design_confirmation_date', formData.design_confirmation_date);
      if (formData.delivery_date) formDataToSend.append('delivery_date', formData.delivery_date);
      formDataToSend.append('use_points', formData.use_points);

      formData.items.forEach((item, index) => {
        if (item.id) formDataToSend.append(`items.${index}.id`, item.id);
        if (item.product) formDataToSend.append(`items.${index}.product`, item.product);
        if (item.product_type) formDataToSend.append(`items.${index}.product_type`, item.product_type);
        formDataToSend.append(`items.${index}.quantity`, item.quantity);
        formDataToSend.append(`items.${index}.unit_price`, item.unit_price);
        if (item.design_file instanceof File) {
          formDataToSend.append(`items.${index}.design_file`, item.design_file);
        }
      });

      if (showUniformDetails && formData.uniform_detail) {
        const ud = formData.uniform_detail;
        formDataToSend.append('uniform_detail.shirt_quantity', ud.shirt_quantity || 0);
        formDataToSend.append('uniform_detail.shirt_fabric', ud.shirt_fabric || '');
        formDataToSend.append('uniform_detail.pants_quantity', ud.pants_quantity || 0);
        formDataToSend.append('uniform_detail.pants_fabric', ud.pants_fabric || '');
        formDataToSend.append('uniform_detail.polo_quantity', ud.polo_quantity || 0);
        formDataToSend.append('uniform_detail.polo_fabric', ud.polo_fabric || '');
        formDataToSend.append('uniform_detail.bag_quantity', ud.bag_quantity || 0);
        formDataToSend.append('uniform_detail.bag_fabric', ud.bag_fabric || '');
        formDataToSend.append('uniform_detail.sponsorships', ud.sponsorships || '');
        if (ud.player_uniform_photo instanceof File) {
          formDataToSend.append('uniform_detail.player_uniform_photo', ud.player_uniform_photo);
        }
        if (ud.goalkeeper_uniform_photo instanceof File) {
          formDataToSend.append('uniform_detail.goalkeeper_uniform_photo', ud.goalkeeper_uniform_photo);
        }
        if (ud.neck_photo instanceof File) {
          formDataToSend.append('uniform_detail.neck_photo', ud.neck_photo);
        }
        if (ud.pants_photo instanceof File) {
          formDataToSend.append('uniform_detail.pants_photo', ud.pants_photo);
        }
        ud.players.forEach((player, index) => {
          if (player.id) formDataToSend.append(`uniform_detail.players.${index}.id`, player.id);
          formDataToSend.append(`uniform_detail.players.${index}.first_name`, player.first_name || '');
          formDataToSend.append(`uniform_detail.players.${index}.last_name`, player.last_name || '');
          formDataToSend.append(`uniform_detail.players.${index}.number`, player.number || '');
          formDataToSend.append(`uniform_detail.players.${index}.size`, player.size || '');
          formDataToSend.append(`uniform_detail.players.${index}.gender`, player.gender || '');
          formDataToSend.append(`uniform_detail.players.${index}.observaciones`, player.observaciones || '');
          formDataToSend.append(`uniform_detail.players.${index}.variaciones`, player.variaciones || '');
        });
      }

      formDataToSend.append('replace_items', true);
      formDataToSend.append('replace_players', true);

      await ApiService.updateOrder(order.id, formDataToSend, token);
      if (typeof onUpdate === 'function') {
        onUpdate();
      } else {
        console.warn('onUpdate is not a function. Parent component must provide a valid onUpdate callback.');
      }
      onClose();
    } catch (error) {
      setError(error.response?.data?.detail || 'Error al actualizar.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar este pedido?')) {
      try {
        if (userRole === 'design' && !['design_pending', 'design_confirmed'].includes(formData.status)) {
          setError('Usuarios con rol de diseño solo pueden eliminar pedidos en estado "design_pending" o "design_confirmed".');
          return;
        }
        if (userRole === 'customer' && formData.customer_id !== currentUser?.id) {
          setError('Los clientes solo pueden eliminar sus propios pedidos.');
          return;
        }
        await ApiService.deleteOrder(order.id, token);
        if (typeof onUpdate === 'function') {
          onUpdate();
        } else {
          console.warn('onUpdate is not a function. Parent component must provide a valid onUpdate callback.');
        }
        onClose();
      } catch (error) {
        console.error('Error deleting order:', error);
        const errorDetail = error.response?.data?.detail || 'Error al eliminar el pedido.';
        setError(errorDetail);
      }
    }
  };

  const handleEditEvent = (event, e) => {
    if (e) e.stopPropagation();
    setEditingEvent(event);
    setEditingPayment(null);
    setShowEventPaymentModal(true);
    if (typeof onEditEvent === 'function') {
      onEditEvent(event);
    }
  };

  const handleEditPayment = (payment, e) => {
    if (e) e.stopPropagation();
    setEditingPayment(payment);
    setEditingEvent(null);
    setShowEventPaymentModal(true);
    if (typeof onEditPayment === 'function') {
      onEditPayment(payment);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      if (typeof onDeleteEvent === 'function') {
        await onDeleteEvent(eventId);
      }
      const updatedOrder = await ApiService.getOrderById(order.id, token);
      setFormData(prev => ({
        ...prev,
        status: updatedOrder.data.status || prev.status,
        payment_50_date: updatedOrder.data.payment_50_date || prev.payment_50_date,
        design_confirmation_date: updatedOrder.data.design_confirmation_date || prev.design_confirmation_date,
        delivery_date: updatedOrder.data.delivery_date || prev.delivery_date,
        payments: updatedOrder.data.payments?.map(payment => ({
          id: payment.id,
          amount: parseFloat(payment.amount) || 0,
          payment_date: payment.payment_date || '',
          payment_type: payment.payment_type || 'partial',
          reference_document: payment.reference_document || null,
          previewUrl: payment.reference_document || null,
        })) || [],
      }));
      setEvents(updatedOrder.data.events || []);
      if (typeof onUpdate === 'function') {
        onUpdate();
      } else {
        console.warn('onUpdate is not a function. Parent component must provide a valid onUpdate callback.');
      }
      setError(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      const errorDetail = error.response?.data?.detail || 'Error al eliminar el evento.';
      setError(errorDetail);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      if (typeof onDeletePayment === 'function') {
        await onDeletePayment(paymentId);
      }
      const updatedOrder = await ApiService.getOrderById(order.id, token);
      setFormData(prev => ({
        ...prev,
        status: updatedOrder.data.status || prev.status,
        payment_50_date: updatedOrder.data.payment_50_date || prev.payment_50_date,
        design_confirmation_date: updatedOrder.data.design_confirmation_date || prev.design_confirmation_date,
        delivery_date: updatedOrder.data.delivery_date || prev.delivery_date,
        payments: updatedOrder.data.payments?.map(payment => ({
          id: payment.id,
          amount: parseFloat(payment.amount) || 0,
          payment_date: payment.payment_date || '',
          payment_type: payment.payment_type || 'partial',
          reference_document: payment.reference_document || null,
          previewUrl: payment.reference_document || null,
        })) || [],
      }));
      setEvents(updatedOrder.data.events || []);
      if (typeof onUpdate === 'function') {
        onUpdate();
      } else {
        console.warn('onUpdate is not a function. Parent component must provide a valid onUpdate callback.');
      }
      setError(null);
    } catch (error) {
      console.error('Error deleting payment:', error);
      const errorDetail = error.response?.data?.detail || 'Error al eliminar el pago.';
      setError(errorDetail);
    }
  };

  const handleEventPaymentUpdate = async () => {
    try {
      const updatedOrder = await ApiService.getOrderById(order.id, token);
      setFormData(prev => ({
        ...prev,
        status: updatedOrder.data.status || prev.status,
        payment_50_date: updatedOrder.data.payment_50_date || prev.payment_50_date,
        design_confirmation_date: updatedOrder.data.design_confirmation_date || prev.design_confirmation_date,
        delivery_date: updatedOrder.data.delivery_date || prev.delivery_date,
        payments: updatedOrder.data.payments?.map(payment => ({
          id: payment.id,
          amount: parseFloat(payment.amount) || 0,
          payment_date: payment.payment_date || '',
          payment_type: payment.payment_type || 'partial',
          reference_document: payment.reference_document || null,
          previewUrl: payment.reference_document || null,
        })) || [],
      }));
      setEvents(updatedOrder.data.events || []);
      if (typeof onUpdate === 'function') {
        onUpdate();
      } else {
        console.warn('onUpdate is not a function. Parent component must provide a valid onUpdate callback.');
      }
      setError(null);
    } catch (error) {
      console.error('Error refreshing order after payment/event update:', error);
      setError(error.response?.data?.detail || 'Error al actualizar los datos del pedido.');
    }
  };

  return (
    <div className="order-detail-overlay">
      <div className="order-detail-modal">
        <div className="order-detail-header">
          <h2 className="order-detail-title">Editar Pedido {order.order_number}</h2>
          <button onClick={onClose} className="order-detail-close">
            <FaTimes size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-section">
          {(userRole === 'administrator' || userRole === 'sales') && (
            <div>
              <label className="input-label">Cliente <span className="input-required">*</span></label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleInputChange}
                className="select-field"
                required
              >
                <option value="">Seleccione un cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name || 'N/A'} ({customer.id_number})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-grid">
            <div>
              <label className="input-label">Tipo de Pedido</label>
              <select
                name="order_type"
                value={formData.order_type}
                onChange={handleInputChange}
                className="select-field"
                disabled={userRole !== 'administrator' && userRole !== 'sales'}
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgente</option>
                <option value="express">Express</option>
                <option value="personalizado">Personalizado</option>
              </select>
            </div>
            <div>
              <label className="input-label">Estado</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="select-field"
                disabled={userRole !== 'administrator' && userRole !== 'sales'}
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="design_pending">Diseño Pendiente</option>
                <option value="design_confirmed">Diseño Confirmado</option>
                <option value="completed">Completado</option>
              </select>
            </div>
            <div>
              <label className="input-label">Fecha de Pedido</label>
              <input type="date" name="order_date" value={formData.order_date} onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Fecha de Pago 50%</label>
              <input
                type="date"
                name="payment_50_date"
                value={formData.payment_50_date}
                onChange={handleInputChange}
                className="input-field"
                disabled={formData.status !== 'in_progress'}
              />
            </div>
            <div>
              <label className="input-label">Fecha de Confirmación de Diseño</label>
              <input
                type="date"
                name="design_confirmation_date"
                value={formData.design_confirmation_date}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="input-label">Fecha de Entrega</label>
              <input
                type="date"
                name="delivery_date"
                value={formData.delivery_date}
                onChange={handleInputChange}
                className="input-field"
                disabled={userRole !== 'administrator'}
              />
            </div>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                name="use_points"
                checked={formData.use_points}
                onChange={(e) => setFormData({ ...formData, use_points: e.target.checked })}
                className="checkbox-input"
              />
              <label className="input-label">Usar puntos del cliente</label>
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#60a5fa', margin: '1.5rem 0 1rem' }}>
            Ítems del Pedido
          </h3>

          {formData.items.map((item, index) => (
            <div key={index} className="item-card">
              <div className="item-grid">
                <div>
                  <label className="input-label">Producto</label>
                  <select
                    value={item.product}
                    onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                    className="select-field"
                  >
                    <option value="">Seleccione un producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name || 'N/A'} (₡{(product.product_type.base_price + product.additional_price).toFixed(2)})
                      </option>
                    ))}
                  </select>
                  {item.product && products.find(p => p.id === parseInt(item.product))?.design_file && (
                    <img
                      src={products.find(p => p.id === parseInt(item.product))?.design_file}
                      alt="Vista previa del producto"
                      className="item-preview"
                    />
                  )}
                </div>
                <div>
                  <label className="input-label">Tipo de Producto</label>
                  <select
                    value={item.product_type}
                    onChange={(e) => handleItemChange(index, 'product_type', e.target.value)}
                    className="select-field"
                    disabled={!!item.product}
                  >
                    <option value="">Seleccione un tipo</option>
                    {productTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name || 'N/A'} (₡{type.base_price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Cantidad <span className="input-required">*</span></label>
                  <input
                    type="number"
                    value={item.quantity || 1}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="input-field"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="input-label">Precio Unitario <span className="input-required">*</span></label>
                  <input
                    type="number"
                    value={item.unit_price || '0.01'}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    className="input-field"
                    min="0.01"
                    step="0.01"
                    required
                    readOnly={!!item.product || !!item.product_type}
                  />
                </div>
                <div>
                  <label className="input-label">Subtotal</label>
                  <input
                    type="text"
                    value={`₡${calculateSubtotal(item).toFixed(2)}`}
                    className="input-field"
                    style={{ backgroundColor: '#374151' }}
                    readOnly
                  />
                </div>
                <div>
                  <label className="input-label">
                    Archivo de Diseño {item.product_type && <span className="input-required">*</span>}
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleItemChange(index, 'design_file', e.target.files[0])}
                    className="file-input"
                    accept="image/jpeg,image/png,application/pdf"
                    required={item.product_type && !item.previewUrl}
                  />
                  {item.previewUrl && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {item.previewUrl.endsWith('.pdf') ? (
                        <a href={item.previewUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                          <FaFileAlt /> Ver Diseño PDF
                        </a>
                      ) : (
                        <img src={item.previewUrl} alt="Vista previa del diseño" className="item-preview" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {formData.items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} className="btn btn-red" style={{ marginTop: '0.5rem' }}>
                  <FaTrash />
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addItem} className="btn btn-neon">
            <FaPlus /> Agregar Ítem
          </button>

          <div className="total-display">Total: ₡{calculateTotal()}</div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => {
                if (!showUniformDetails && !formData.uniform_detail) {
                  setFormData({
                    ...formData,
                    uniform_detail: {
                      shirt_quantity: 0,
                      shirt_fabric: '',
                      pants_quantity: 0,
                      pants_fabric: '',
                      polo_quantity: 0,
                      polo_fabric: '',
                      bag_quantity: 0,
                      bag_fabric: '',
                      sponsorships: '',
                      player_uniform_photo: null,
                      goalkeeper_uniform_photo: null,
                      neck_photo: null,
                      pants_photo: null,
                      player_uniform_preview: null,
                      goalkeeper_uniform_preview: null,
                      neck_preview: null,
                      pants_preview: null,
                      players: [{ first_name: '', last_name: '', number: '', size: '', gender: '', observaciones: '', variaciones: '' }],
                    },
                  });
                }
                setShowUniformDetails(!showUniformDetails);
              }}
              className="uniform-toggle"
            >
              {showUniformDetails ? <FaChevronUp /> : <FaChevronDown />}
              Detalles de Uniformes
            </button>

            {showUniformDetails && formData.uniform_detail && (
              <div className="uniform-section">
                <div className="form-grid">
                  {[
                    { label: 'Cantidad de Camisetas', name: 'shirt_quantity', type: 'number' },
                    { label: 'Tela de Camisetas', name: 'shirt_fabric', type: 'text' },
                    { label: 'Cantidad de Pantalones', name: 'pants_quantity', type: 'number' },
                    { label: 'Tela de Pantalones', name: 'pants_fabric', type: 'text' },
                    { label: 'Cantidad de Polos', name: 'polo_quantity', type: 'number' },
                    { label: 'Tela de Polos', name: 'polo_fabric', type: 'text' },
                    { label: 'Cantidad de Bolsos', name: 'bag_quantity', type: 'number' },
                    { label: 'Tela de Bolsos', name: 'bag_fabric', type: 'text' },
                    { label: 'Patrocinios', name: 'sponsorships', type: 'text' },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="input-label">{label}</label>
                      <input
                        type={type}
                        value={formData.uniform_detail[name] || ''}
                        onChange={(e) => handleUniformDetailChange(name, e.target.value)}
                        className="input-field"
                        min={type === 'number' ? 0 : undefined}
                      />
                    </div>
                  ))}
                  {[
                    { label: 'Foto de Uniforme de Jugador', name: 'player_uniform_photo', preview: 'player_uniform_preview' },
                    { label: 'Foto de Uniforme de Portero', name: 'goalkeeper_uniform_photo', preview: 'goalkeeper_uniform_preview' },
                    { label: 'Foto de Cuello', name: 'neck_photo', preview: 'neck_preview' },
                    { label: 'Foto de Pantalones', name: 'pants_photo', preview: 'pants_preview' },
                  ].map(({ label, name, preview }) => (
                    <div key={name}>
                      <label className="input-label">{label}</label>
                      <input
                        type="file"
                        onChange={(e) => handleUniformImageChange(name, e.target.files[0])}
                        className="file-input"
                        accept="image/jpeg,image/png"
                      />
                      {formData.uniform_detail[preview] && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <img
                            src={formData.uniform_detail[preview]}
                            alt={`Vista previa de ${label}`}
                            style={{ height: '8rem', width: '8rem', objectFit: 'cover', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                            onError={(e) => {
                              console.error(`Error loading image for ${label}:`, formData.uniform_detail[preview]);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#60a5fa', margin: '1.5rem 0 1rem' }}>
                  Jugadores
                </h4>

                {formData.uniform_detail.players.map((player, index) => (
                  <div key={index} className="player-card">
                    <div>
                      <label className="input-label">Nombre <span className="input-required">*</span></label>
                      <input type="text" value={player.first_name || ''} onChange={(e) => handlePlayerChange(index, 'first_name', e.target.value)} className="input-field" required />
                    </div>
                    <div>
                      <label className="input-label">Apellido <span className="input-required">*</span></label>
                      <input type="text" value={player.last_name || ''} onChange={(e) => handlePlayerChange(index, 'last_name', e.target.value)} className="input-field" required />
                    </div>
                    <div>
                      <label className="input-label">Número <span className="input-required">*</span></label>
                      <input type="number" value={player.number || ''} onChange={(e) => handlePlayerChange(index, 'number', e.target.value)} className="input-field" min="0" required />
                    </div>
                    <div>
                      <label className="input-label">Talla <span className="input-required">*</span></label>
                      <select value={player.size || ''} onChange={(e) => handlePlayerChange(index, 'size', e.target.value)} className="select-field" required>
                        <option value="">Seleccione</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Género <span className="input-required">*</span></label>
                      <select value={player.gender || ''} onChange={(e) => handlePlayerChange(index, 'gender', e.target.value)} className="select-field" required>
                        <option value="">Seleccione</option>
                        <option value="H">Hombre</option>
                        <option value="M">Mujer</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Observaciones</label>
                      <input type="text" value={player.observaciones || ''} onChange={(e) => handlePlayerChange(index, 'observaciones', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="input-label">Variaciones</label>
                      <input type="text" value={player.variaciones || ''} onChange={(e) => handlePlayerChange(index, 'variaciones', e.target.value)} className="input-field" />
                    </div>
                    {formData.uniform_detail.players.length > 1 && (
                      <button type="button" onClick={() => removePlayer(index)} className="btn btn-red" style={{ alignSelf: 'center' }}>
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" onClick={addPlayer} className="btn btn-neon" style={{ marginTop: '1rem' }}>
                  <FaPlus /> Agregar Jugador
                </button>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowEvents(!showEvents)} className="events-toggle">
              {showEvents ? <FaChevronUp /> : <FaChevronDown />}
              Eventos del Pedido
            </button>

            {showEvents && events && events.length > 0 ? (
              <div className="events-section">
                {events.map((event) => (
                  <div key={event.id} className="event-item">
                    <div className="event-header">
                      <div className="event-date">
                        <FaCalendarAlt /> {new Date(event.timestamp).toLocaleString()}
                      </div>
                      {['administrator', 'sales', 'design'].includes(userRole) && (
                        <div className="event-actions">
                          <button
                            type="button"
                            onClick={(e) => handleEditEvent(event, e)}
                            className="event-edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="event-delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="event-type">{event.event_type.replace('_', ' ').toUpperCase()}</p>
                    {event.amount && (
                      <p className="event-amount">Monto: ₡{parseFloat(event.amount).toFixed(2)}</p>
                    )}
                    {event.document && (
                      <div style={{ marginTop: '0.5rem' }}>
                        {event.document.endsWith('.pdf') ? (
                          <a href={event.document} target="_blank" rel="noopener noreferrer" className="file-link">
                            <FaFileAlt /> Ver Documento PDF
                          </a>
                        ) : (
                          <img src={event.document} alt="Documento adjunto" className="item-preview" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : showEvents && (
              <p style={{ color: '#9ca3af', marginTop: '1rem' }}>No hay eventos registrados para este pedido.</p>
            )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowPayments(!showPayments)} className="payments-toggle">
              {showPayments ? <FaChevronUp /> : <FaChevronDown />}
              Pagos del Pedido
            </button>

            {showPayments && formData.payments && formData.payments.length > 0 ? (
              <div className="payments-section">
                {formData.payments.map((payment) => (
                  <div key={payment.id} className="payment-item">
                    <div className="payment-header">
                      <div className="payment-date">
                        <FaCalendarAlt /> {new Date(payment.payment_date).toLocaleString()}
                      </div>
                      {['administrator', 'sales', 'design'].includes(userRole) && (
                        <div className="payment-actions">
                          <button
                            type="button"
                            onClick={(e) => handleEditPayment(payment, e)}
                            className="payment-edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePayment(payment.id)}
                            className="payment-delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="payment-type">{payment.payment_type.replace('_', ' ').toUpperCase()}</p>
                    <p className="payment-amount">Monto: ₡{parseFloat(payment.amount).toFixed(2)}</p>
                    {payment.previewUrl && (
                      <div style={{ marginTop: '0.5rem' }}>
                        {payment.previewUrl.endsWith('.pdf') ? (
                          <a href={payment.previewUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                            <FaFileAlt /> Ver Documento PDF
                          </a>
                        ) : (
                          <img src={payment.previewUrl} alt="Documento de pago" className="item-preview" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : showPayments && (
              <p style={{ color: '#9ca3af', marginTop: '1rem' }}>No hay pagos registrados para este pedido.</p>
            )}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setShowProductionQueue(!showProductionQueue)} className="production-queue-toggle">
              {showProductionQueue ? <FaChevronUp /> : <FaChevronDown />}
              Cola de Producción
            </button>

            {showProductionQueue && order.production_queue ? (
              <div className="production-queue-section">
                <div className="production-queue-item">
                  <div className="production-queue-header">
                    <div className="production-queue-date">
                      <FaCalendarAlt /> Creado: {new Date(order.production_queue.created_at).toLocaleString()}
                    </div>
                  </div>
                  <p className="production-queue-type">Tipo de Cola: {order.production_queue.queue_type.replace('_', ' ').toUpperCase()}</p>
                  <p className="production-queue-status">Estado: {order.production_queue.status.replace('_', ' ').toUpperCase()}</p>
                  <p className="production-queue-customer">Cliente: {order.production_queue.customer_name}</p>
                  <p className="production-queue-delivery">
                    <FaCalendarAlt /> Fecha de Entrega: {new Date(order.production_queue.delivery_date).toLocaleDateString()}
                  </p>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#60a5fa', margin: '1rem 0 0.5rem' }}>
                    Ítems en Cola
                  </h4>
                  {order.production_queue.items && order.production_queue.items.length > 0 ? (
                    <div className="production-queue-items">
                      {order.production_queue.items.map((item, index) => (
                        <div key={index} className="production-queue-item-detail">
                          <p><strong>Producto:</strong> {item.product_name}</p>
                          <p><strong>Cantidad:</strong> {item.quantity}</p>
                          <p><strong>Precio Unitario:</strong> ₡{parseFloat(item.unit_price).toFixed(2)}</p>
                          <p><strong>Subtotal:</strong> ₡{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>No hay ítems en la cola de producción.</p>
                  )}
                </div>
              </div>
            ) : showProductionQueue && (
              <p style={{ color: '#9ca3af', marginTop: '1rem' }}>No hay información de cola de producción para este pedido.</p>
            )}
          </div>

          <div className="form-actions">
            {(userRole === 'administrator' || (userRole === 'sales' && formData.customer_id === order.customer?.id)) && (
              <button type="submit" className="btn btn-neon">
                <FaSave /> Guardar
              </button>
            )}
            {(userRole === 'administrator' || (userRole === 'design' && ['design_pending', 'design_confirmed'].includes(formData.status)) || (userRole === 'customer' && formData.customer_id === currentUser?.id)) && (
              <button type="button" onClick={handleDelete} className="btn btn-red">
                <FaTrash /> Eliminar
              </button>
            )}
            {(userRole === 'administrator' || userRole === 'sales' || userRole === 'design') && (
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setEditingPayment(null);
                  setShowEventPaymentModal(true);
                }}
                className="btn btn-green"
              >
                <FaPlus /> Agregar Evento o Pago
              </button>
            )}
            <button type="button" onClick={onClose} className="btn btn-gray">
              Cancelar
            </button>
          </div>
        </form>

        {showEventPaymentModal && (
          <EventPaymentModal
            orderId={order.id}
            event={editingEvent}
            payment={editingPayment}
            onClose={() => {
              setShowEventPaymentModal(false);
              setEditingEvent(null);
              setEditingPayment(null);
            }}
            onEventAdded={handleEventPaymentUpdate}
            onPaymentAdded={handleEventPaymentUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetailModal;