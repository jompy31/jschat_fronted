import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ApiService from '../../../../services/products';
import "./create.css"

const CreateOrder = ({ onClose, onCreate }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [error, setError] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showUniformDetails, setShowUniformDetails] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    order_type: 'normal',
    status: 'pending',
    order_date: '',
    payment_50_date: '',
    design_confirmation_date: '',
    delivery_date: '',
    use_points: false,
    items: [{ product: '', product_type: '', quantity: 1, unit_price: 0.0, design_file: null, previewUrl: null }],
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
    new_customer: {
      name: '',
      id_type: '',
      id_number: '',
      email: '',
      phone_number: '',
      address: '',
      company: '',
      tipo_contacto: 'Cliente',
    },
  });

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userRole = currentUser?.userprofile?.staff_status || null;

  useEffect(() => {
    if (!token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      return;
    }
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
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('No se pudieron cargar los datos necesarios. Por favor, intenta de nuevo.');
        setCustomers([]);
        setProducts([]);
        setProductTypes([]);
      }
    };
    fetchData();
    return () => {
      formData.items.forEach(item => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
      Object.values(formData.uniform_detail).forEach(value => {
        if (typeof value === 'string' && value.startsWith('blob:')) URL.revokeObjectURL(value);
      });
    };
  }, [token]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      uniform_detail: {
        ...prev.uniform_detail,
        shirt_quantity: prev.uniform_detail.players.filter(p => p.size).length,
      },
    }));
  }, [formData.uniform_detail.players]);

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

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      new_customer: { ...formData.new_customer, [name]: value },
    });
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
    // Asignar automáticamente el product_type del producto
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
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    const previewField = `${field}_preview`;
    const previewUrl = file && file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
    setFormData({
      ...formData,
      uniform_detail: {
        ...formData.uniform_detail,
        [field]: file,
        [previewField]: previewUrl,
      },
    });
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

  const validateCustomerForm = () => {
    const { name, id_number } = formData.new_customer;
    if (!name || !id_number) {
      setError('El nombre y el número de identificación son obligatorios para un nuevo cliente.');
      return false;
    }
    if (customers.some(c => c.id_number === id_number)) {
      setError('El número de identificación ya está registrado.');
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!formData.customer_id && !isNewCustomer) {
      setError('Debes seleccionar un cliente existente o crear uno nuevo.');
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
      if (item.product_type && !item.design_file) {
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
    if (showUniformDetails) {
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

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    if (!validateCustomerForm()) return;

    try {
      const customerData = new FormData();
      Object.entries(formData.new_customer).forEach(([key, value]) => {
        if (value) customerData.append(key, value);
      });
      const customerResponse = await ApiService.createCustomer(customerData, token);
      const newCustomer = customerResponse.data;
      setCustomers([...customers, newCustomer]);
      setFormData({
        ...formData,
        customer_id: newCustomer.id,
        new_customer: {
          name: '',
          id_type: '',
          id_number: '',
          email: '',
          phone_number: '',
          address: '',
          company: '',
          tipo_contacto: 'Cliente',
        },
      });
      setShowCustomerForm(false);
      setIsNewCustomer(false);
      setError(null);
    } catch (error) {
      console.error('Error creating customer:', error);
      setError(error.response?.data?.detail || 'Error al crear el cliente. Por favor, verifica los datos e intenta de nuevo.');
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!validateForm()) return;

  try {
    const formDataToSend = new FormData();

    // === CAMPOS PRINCIPALES (solo una vez, como string) ===
    if (!formData.customer_id) {
      setError('Debe seleccionar un cliente.');
      return;
    }
    formDataToSend.append('customer_id', formData.customer_id); // ← STRING
    formDataToSend.append('order_type', formData.order_type);
    formDataToSend.append('status', formData.status);
    if (formData.order_date) formDataToSend.append('order_date', formData.order_date);
    if (formData.payment_50_date) formDataToSend.append('payment_50_date', formData.payment_50_date);
    if (formData.design_confirmation_date) formDataToSend.append('design_confirmation_date', formData.design_confirmation_date);
    if (formData.delivery_date) formDataToSend.append('delivery_date', formData.delivery_date);
    formDataToSend.append('use_points', formData.use_points ? 'true' : 'false');

    // === ITEMS: Usar sintaxis Django (items[0].quantity) ===
    formData.items.forEach((item, index) => {
      const prefix = `items[${index}]`;

      // Campos básicos
      if (item.product) {
        formDataToSend.append(`${prefix}.product`, item.product);
      } else if (item.product_type) {
        formDataToSend.append(`${prefix}.product_type`, item.product_type);
      }

      formDataToSend.append(`${prefix}.quantity`, item.quantity);
      // formDataToSend.append(`${prefix}.unit_price`, item.unit_price);

      // Archivo de diseño
      if (item.design_file instanceof File) {
        formDataToSend.append(`${prefix}.design_file`, item.design_file);
      }
    });

    // === UNIFORM DETAIL (solo si está activo) ===
    if (showUniformDetails && formData.uniform_detail) {
      const ud = formData.uniform_detail;
      const udPrefix = 'uniform_detail';

      formDataToSend.append(`${udPrefix}.shirt_quantity`, ud.shirt_quantity || '0');
      formDataToSend.append(`${udPrefix}.shirt_fabric`, ud.shirt_fabric || '');
      formDataToSend.append(`${udPrefix}.pants_quantity`, ud.pants_quantity || '0');
      formDataToSend.append(`${udPrefix}.pants_fabric`, ud.pants_fabric || '');
      formDataToSend.append(`${udPrefix}.polo_quantity`, ud.polo_quantity || '0');
      formDataToSend.append(`${udPrefix}.polo_fabric`, ud.polo_fabric || '');
      formDataToSend.append(`${udPrefix}.bag_quantity`, ud.bag_quantity || '0');
      formDataToSend.append(`${udPrefix}.bag_fabric`, ud.bag_fabric || '');
      formDataToSend.append(`${udPrefix}.sponsorships`, ud.sponsorships || '');

      // Fotos
      ['player_uniform_photo', 'goalkeeper_uniform_photo', 'neck_photo', 'pants_photo'].forEach(field => {
        if (ud[field] instanceof File) {
          formDataToSend.append(`${udPrefix}.${field}`, ud[field]);
        }
      });

      // Jugadores
      ud.players.forEach((player, i) => {
        const pPrefix = `${udPrefix}.players[${i}]`;
        formDataToSend.append(`${pPrefix}.first_name`, player.first_name || '');
        formDataToSend.append(`${pPrefix}.last_name`, player.last_name || '');
        formDataToSend.append(`${pPrefix}.number`, player.number || '');
        formDataToSend.append(`${pPrefix}.size`, player.size || '');
        formDataToSend.append(`${pPrefix}.gender`, player.gender || '');
        formDataToSend.append(`${pPrefix}.observaciones`, player.observaciones || '');
        formDataToSend.append(`${pPrefix}.variaciones`, player.variaciones || '');
      });
    }

    // === DEBUG: Ver exactamente qué se envía ===
    console.log('ENVIANDO FormData:');
    for (let [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(`${key}: <File: ${value.name}, ${value.size} bytes>`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const response = await ApiService.createOrder(formDataToSend, token);
    console.log('Pedido creado:', response.data);
    onCreate();
    onClose();
  } catch (error) {
    console.error('Error al crear pedido:', error);
    const errMsg = error.response?.data;
    let msg = 'Error al crear el pedido.';

    if (errMsg) {
      if (typeof errMsg === 'string') msg = errMsg;
      else if (errMsg.customer_id) msg = `Cliente: ${errMsg.customer_id.join(', ')}`;
      else if (errMsg.items) msg = `Ítems: ${JSON.stringify(errMsg.items)}`;
      else if (errMsg.non_field_errors) msg = errMsg.non_field_errors.join(', ');
    }

    setError(msg);
  }
};

  return (
  <div className="create-order-overlay">
    <div className="create-order-modal">
      <div className="create-order-header">
        <h2 className="create-order-title">
          {showCustomerForm ? 'Crear Nuevo Cliente' : 'Crear Nuevo Pedido'}
        </h2>
        <button onClick={onClose} className="create-order-close">
          <FaTimes size={24} />
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showCustomerForm ? (
        <form onSubmit={handleCreateCustomer} className="form-section">
          <div className="form-grid">
            {[
              { label: 'Nombre', name: 'name', type: 'text', required: true },
              { label: 'Tipo de Identificación', name: 'id_type', type: 'text' },
              { label: 'Número de Identificación', name: 'id_number', type: 'text', required: true },
              { label: 'Correo Electrónico', name: 'email', type: 'email' },
              { label: 'Teléfono', name: 'phone_number', type: 'text' },
              { label: 'Dirección', name: 'address', type: 'text' },
              { label: 'Compañía', name: 'company', type: 'text' },
              {
                label: 'Tipo de Contacto',
                name: 'tipo_contacto',
                type: 'select',
                options: [
                  { value: 'Cliente', label: 'Cliente' },
                  { value: 'Proveedor', label: 'Proveedor' },
                ],
              },
            ].map(({ label, name, type, required, options }) => (
              <div key={name}>
                <label className="input-label">
                  {label} {required && <span className="input-required">*</span>}
                </label>
                {type === 'select' ? (
                  <select
                    name={name}
                    value={formData.new_customer[name]}
                    onChange={handleCustomerChange}
                    className="select-field"
                    required={required}
                  >
                    <option value="">Seleccione</option>
                    {options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={formData.new_customer[name]}
                    onChange={handleCustomerChange}
                    className="input-field"
                    required={required}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setShowCustomerForm(false)}
              className="btn btn-cancel"
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-neon">
              <FaSave /> Crear Cliente
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="form-section">
          {(userRole === 'administrator' || userRole === 'sales') && (
            <div className="form-section">
              <div className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={isNewCustomer}
                  onChange={(e) => {
                    setIsNewCustomer(e.target.checked);
                    if (e.target.checked) setFormData({ ...formData, customer_id: '' });
                  }}
                  className="checkbox-input"
                />
                <label className="input-label">Crear nuevo cliente</label>
              </div>

              <div>
                <label className="input-label">Cliente <span className="input-required">*</span></label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                    className="select-field"
                    required
                    disabled={isNewCustomer}
                  >
                    <option value="">Seleccione un cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name || 'N/A'} ({customer.id_number})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCustomerForm(true)}
                    className="btn btn-neon"
                  >
                    <FaPlus /> Nuevo Cliente
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="form-grid">
            <div>
              <label className="input-label">Tipo de Pedido</label>
              <select name="order_type" value={formData.order_type} onChange={handleInputChange} className="select-field">
                <option value="normal">Normal</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div>
              <label className="input-label">Estado</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="select-field">
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
              <input type="date" name="payment_50_date" value={formData.payment_50_date} onChange={handleInputChange} className="input-field" />
            </div>
            <div>
              <label className="input-label">Fecha de Confirmación de Diseño</label>
              <input type="date" name="design_confirmation_date" value={formData.design_confirmation_date} onChange={handleInputChange} className="input-field" />
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
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                {formData.delivery_date ? 'La fecha de entrega será validada por el sistema.' : 'Dejar en blanco para que el sistema asigne automáticamente.'}
              </p>
            </div>
            {/* <div className="checkbox-wrapper">
              <input
                type="checkbox"
                name="use_points"
                checked={formData.use_points}
                onChange={(e) => setFormData({ ...formData, use_points: e.target.checked })}
                className="checkbox-input"
              />
              <label className="input-label">Usar puntos del cliente</label>
            </div> */}
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
                    required={!!item.product_type}
                  />
                  {item.previewUrl && (
                    <img src={item.previewUrl} alt="Vista previa del diseño" className="item-preview" />
                  )}
                </div>
              </div>
              {formData.items.length > 1 && (
                <button type="button" onClick={() => removeItem(index)} className="btn-remove" style={{ marginTop: '0.5rem' }}>
                  <FaTrash />
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addItem} className="btn btn-neon">
            <FaPlus /> Agregar Ítem
          </button>

          <div className="total-display">
            Total: ₡{calculateTotal()}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowUniformDetails(!showUniformDetails)}
              className="uniform-toggle"
            >
              {showUniformDetails ? <FaChevronUp /> : <FaChevronDown />}
              Detalles de Uniformes
            </button>

            {showUniformDetails && (
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
                        value={formData.uniform_detail[name]}
                        onChange={(e) => handleUniformDetailChange(name, e.target.value)}
                        className="input-field"
                        min={type === 'number' ? 0 : undefined}
                      />
                    </div>
                  ))}
                  {[
                    { label: 'Foto de Uniforme de Jugador', name: 'player_uniform_photo' },
                    { label: 'Foto de Uniforme de Portero', name: 'goalkeeper_uniform_photo' },
                    { label: 'Foto de Cuello', name: 'neck_photo' },
                    { label: 'Foto de Pantalones', name: 'pants_photo' },
                  ].map(({ label, name }) => (
                    <div key={name}>
                      <label className="input-label">{label}</label>
                      <input
                        type="file"
                        onChange={(e) => handleUniformImageChange(name, e.target.files[0])}
                        className="file-input"
                        accept="image/jpeg,image/png"
                      />
                      {formData.uniform_detail[`${name}_preview`] && (
                        <img
                          src={formData.uniform_detail[`${name}_preview`]}
                          alt={`Vista previa de ${label}`}
                          style={{ marginTop: '0.5rem', height: '8rem', width: '8rem', objectFit: 'cover', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        />
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
                      <input type="text" value={player.first_name} onChange={(e) => handlePlayerChange(index, 'first_name', e.target.value)} className="input-field" required />
                    </div>
                    <div>
                      <label className="input-label">Apellido <span className="input-required">*</span></label>
                      <input type="text" value={player.last_name} onChange={(e) => handlePlayerChange(index, 'last_name', e.target.value)} className="input-field" required />
                    </div>
                    <div>
                      <label className="input-label">Número <span className="input-required">*</span></label>
                      <input type="number" value={player.number} onChange={(e) => handlePlayerChange(index, 'number', e.target.value)} className="input-field" min="0" required />
                    </div>
                    <div>
                      <label className="input-label">Talla <span className="input-required">*</span></label>
                      <select value={player.size} onChange={(e) => handlePlayerChange(index, 'size', e.target.value)} className="select-field" required>
                        <option value="">Seleccione</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Género <span className="input-required">*</span></label>
                      <select value={player.gender} onChange={(e) => handlePlayerChange(index, 'gender', e.target.value)} className="select-field" required>
                        <option value="">Seleccione</option>
                        <option value="H">Hombre</option>
                        <option value="M">Mujer</option>
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Observaciones</label>
                      <input type="text" value={player.observaciones} onChange={(e) => handlePlayerChange(index, 'observaciones', e.target.value)} className="input-field" />
                    </div>
                    <div>
                      <label className="input-label">Variaciones</label>
                      <input type="text" value={player.variaciones} onChange={(e) => handlePlayerChange(index, 'variaciones', e.target.value)} className="input-field" />
                    </div>
                    {formData.uniform_detail.players.length > 1 && (
                      <button type="button" onClick={() => removePlayer(index)} className="btn-remove" style={{ alignSelf: 'center' }}>
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

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn btn-neon">
              <FaSave /> Crear Pedido
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);
};

export default CreateOrder;