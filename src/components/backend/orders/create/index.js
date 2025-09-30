import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaPlus, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ApiService from '../../../../services/products';

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
        newItems[index].product_type = '';
        newItems[index].unit_price = product ? parseFloat((product.product_type.base_price + product.additional_price).toFixed(2)) : 0.01;
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
      if (item.product && item.product_type) {
        setError(`El ítem ${i + 1} no puede especificar tanto un producto como un tipo de producto.`);
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
      
      // Append top-level fields
      formDataToSend.append('customer_id', formData.customer_id);
      formDataToSend.append('order_type', formData.order_type);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('order_date', formData.order_date || '');
      formDataToSend.append('payment_50_date', formData.payment_50_date || '');
      formDataToSend.append('design_confirmation_date', formData.design_confirmation_date || '');
      if (formData.delivery_date) {
        formDataToSend.append('delivery_date', formData.delivery_date);
      }
      formDataToSend.append('use_points', formData.use_points);

      // Append items as a JSON string
      const items = formData.items.map((item, index) => {
        const itemData = {
          product: item.product ? parseInt(item.product) : null,
          product_type: item.product_type ? parseInt(item.product_type) : null,
          quantity: parseInt(item.quantity, 10) || 1,
          unit_price: parseFloat(item.unit_price) || 0.01,
        };
        if (item.design_file) {
          formDataToSend.append(`items[${index}].design_file`, item.design_file);
        }
        return itemData;
      });
      formDataToSend.append('items', JSON.stringify(items));

      // Append uniform_detail if present
      if (showUniformDetails) {
        const uniformDetail = {
          shirt_quantity: parseInt(formData.uniform_detail.shirt_quantity) || 0,
          shirt_fabric: formData.uniform_detail.shirt_fabric,
          pants_quantity: parseInt(formData.uniform_detail.pants_quantity) || 0,
          pants_fabric: formData.uniform_detail.pants_fabric,
          polo_quantity: parseInt(formData.uniform_detail.polo_quantity) || 0,
          polo_fabric: formData.uniform_detail.polo_fabric,
          bag_quantity: parseInt(formData.uniform_detail.bag_quantity) || 0,
          bag_fabric: formData.uniform_detail.bag_fabric,
          sponsorships: formData.uniform_detail.sponsorships,
          players: formData.uniform_detail.players.map(player => ({
            ...player,
            number: parseInt(player.number) || 0,
          })),
        };
        ['player_uniform_photo', 'goalkeeper_uniform_photo', 'neck_photo', 'pants_photo'].forEach(field => {
          if (formData.uniform_detail[field]) {
            formDataToSend.append(`uniform_detail.${field}`, formData.uniform_detail[field]);
          }
        });
        formDataToSend.append('uniform_detail', JSON.stringify(uniformDetail));
      }

      console.log('Datos enviados al backend (FormData keys):', Array.from(formDataToSend.keys()));
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData entry: ${key} = ${value instanceof File ? value.name : value}`);
      }

      const response = await ApiService.createOrder(formDataToSend, token);
      console.log('Respuesta del servidor:', response.data);

      onCreate();
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      const errorDetail = error.response?.data?.details || error.response?.data || 'Error al crear el pedido. Por favor, verifica los datos e intenta de nuevo.';
      setError(JSON.stringify(errorDetail));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl border border-blue-500/50 neon-glow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-400 animate-pulse">
            {showCustomerForm ? 'Crear Nuevo Cliente' : 'Crear Nuevo Pedido'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <FaTimes size={24} />
          </button>
        </div>
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 animate-shake">
            {error}
          </div>
        )}
        {showCustomerForm ? (
          <form onSubmit={handleCreateCustomer} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label} {required && <span className="text-red-400">*</span>}
                  </label>
                  {type === 'select' ? (
                    <select
                      name={name}
                      value={formData.new_customer[name]}
                      onChange={handleCustomerChange}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                      required={required}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={() => setShowCustomerForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center neon-button"
              >
                <FaSave className="mr-2" /> Crear Cliente
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {(userRole === 'administrator' || userRole === 'sales') && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isNewCustomer}
                    onChange={(e) => {
                      setIsNewCustomer(e.target.checked);
                      if (e.target.checked) setFormData({ ...formData, customer_id: '' });
                    }}
                    className="mr-2 h-5 w-5 text-blue-500 rounded border-gray-600 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-300">Crear nuevo cliente</label>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cliente <span className="text-red-400">*</span></label>
                  <div className="flex items-center space-x-2">
                    <select
                      name="customer_id"
                      value={formData.customer_id}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
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
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center whitespace-nowrap duration-300 transform hover:scale-105 neon-button"
                    >
                      <FaPlus className="mr-2" /> Nuevo Cliente
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Pedido</label>
                <select
                  name="order_type"
                  value={formData.order_type}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="design_pending">Diseño Pendiente</option>
                  <option value="design_confirmed">Diseño Confirmado</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Pedido</label>
                <input
                  type="date"
                  name="order_date"
                  value={formData.order_date}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Pago 50%</label>
                <input
                  type="date"
                  name="payment_50_date"
                  value={formData.payment_50_date}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Confirmación de Diseño</label>
                <input
                  type="date"
                  name="design_confirmation_date"
                  value={formData.design_confirmation_date}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Entrega</label>
                <input
                  type="date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                  disabled={userRole !== 'administrator'}
                />
                <p className="text-sm text-gray-400 mt-1">
                  {formData.delivery_date ? 'La fecha de entrega será validada por el sistema.' : 'Dejar en blanco para que el sistema asigne automáticamente.'}
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="use_points"
                  checked={formData.use_points}
                  onChange={(e) => setFormData({ ...formData, use_points: e.target.checked })}
                  className="mr-2 h-5 w-5 text-blue-500 rounded border-gray-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-300">Usar puntos del cliente</label>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-blue-400">Ítems del Pedido</h3>
            {formData.items.map((item, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg mb-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Producto</label>
                    <select
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
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
                        className="mt-2 h-24 w-24 object-cover rounded-lg shadow"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Producto</label>
                    <select
                      value={item.product_type}
                      onChange={(e) => handleItemChange(index, 'product_type', e.target.value)}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                      disabled={item.product}
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Cantidad <span className="text-red-400">*</span></label>
                    <input
                      type="number"
                      value={item.quantity || 1}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Precio Unitario <span className="text-red-400">*</span></label>
                    <input
                      type="number"
                      value={item.unit_price || '0.01'}
                      onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                      min="0.01"
                      step="0.01"
                      required
                      readOnly={item.product || item.product_type}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Subtotal</label>
                    <input
                      type="text"
                      value={`₡${calculateSubtotal(item).toFixed(2)}`}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Archivo de Diseño {item.product_type && <span className="text-red-400">*</span>}</label>
                    <input
                      type="file"
                      onChange={(e) => handleItemChange(index, 'design_file', e.target.files[0])}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600"
                      accept="image/jpeg,image/png,application/pdf"
                      required={item.product_type}
                    />
                    {item.previewUrl && (
                      <img
                        src={item.previewUrl}
                        alt="Vista previa del diseño"
                        className="mt-2 h-24 w-24 object-cover rounded-lg shadow"
                      />
                    )}
                  </div>
                </div>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all flex items-center duration-300 transform hover:scale-105 neon-button"
            >
              <FaPlus className="mr-2" /> Agregar Ítem
            </button>
            <div className="mt-4 text-right">
              <span className="text-xl font-bold text-green-400">Total: ₡{calculateTotal()}</span>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowUniformDetails(!showUniformDetails)}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                {showUniformDetails ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
                Detalles de Uniformes
              </button>
              {showUniformDetails && (
                <div className="bg-gray-800 p-6 rounded-lg mt-4 shadow-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                        <input
                          type={type}
                          value={formData.uniform_detail[name]}
                          onChange={(e) => handleUniformDetailChange(name, e.target.value)}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                        <input
                          type="file"
                          onChange={(e) => handleUniformImageChange(name, e.target.files[0])}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600"
                          accept="image/jpeg,image/png"
                        />
                        {formData.uniform_detail[`${name}_preview`] && (
                          <img
                            src={formData.uniform_detail[`${name}_preview`]}
                            alt={`Vista previa de ${label}`}
                            className="mt-2 h-32 w-32 object-cover rounded-lg shadow"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <h4 className="text-lg font-semibold mt-6 text-blue-400">Jugadores</h4>
                  {formData.uniform_detail.players.map((player, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={player.first_name}
                          onChange={(e) => handlePlayerChange(index, 'first_name', e.target.value)}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Apellido <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          value={player.last_name}
                          onChange={(e) => handlePlayerChange(index, 'last_name', e.target.value)}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Número <span className="text-red-400">*</span></label>
                        <input
                          type="number"
                          value={player.number}
                          onChange={(e) => handlePlayerChange(index, 'number', e.target.value)}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Talla <span className="text-red-400">*</span></label>
                        <select
                          value={player.size}
                          onChange={(e) => handlePlayerChange(index, 'size', e.target.value)}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                          required
                        >
                          <option value="">Seleccione</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Género <span className="text-red-400">*</span></label>
                        <select
                          value={player.gender}
                          onChange={(e) => handlePlayerChange(index, 'gender', e.target.value)}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                          required
                        >
                          <option value="">Seleccione</option>
                          <option value="H">Hombre</option>
                          <option value="M">Mujer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Observaciones</label>
                        <input
                          type="text"
                          value={player.observaciones}
                          onChange={(e) => handlePlayerChange(index, 'observaciones', e.target.value)}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Variaciones</label>
                        <input
                          type="text"
                          value={player.variaciones}
                          onChange={(e) => handlePlayerChange(index, 'variaciones', e.target.value)}
                          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      {formData.uniform_detail.players.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlayer(index)}
                          className="text-red-400 hover:text-red-300 transition-colors self-center"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPlayer}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg mt-4 flex items-center duration-300 transform hover:scale-105 neon-button"
                  >
                    <FaPlus className="mr-2" /> Agregar Jugador
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center neon-button"
              >
                <FaSave className="mr-2" /> Crear Pedido
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateOrder;