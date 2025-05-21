import React, { useState, useEffect } from "react";
import ProductDataService from "../../../../services/products";
import { useSelector } from "react-redux";
import moment from "moment";
import categoriesData from "../../../json/category.json";

const CreateSubproduct = ({
  show,
  handleClose,
  subproductName,
  setSubproductName,
  subproductPhone,
  setSubproductPhone,
  subproductEmail,
  setSubproductEmail,
  subproductAddress,
  setSubproductAddress,
  subproductUrl,
  setSubproductUrl,
  subproductAddressmap,
  setSubproductAddressmap,
  selectedProducts,
  handleProductsSelection,
  handleProductsDoubleClick,
  products,
  subproductDescription,
  setSubproductDescription,
  subproductCountry,
  setSubproductCountry,
  subproductProvince,
  setSubproductProvince,
  subproductCanton,
  setSubproductCanton,
  subproductDistrito,
  setSubproductDistrito,
  subproductContactName,
  setSubproductContactName,
  subproductPhoneNumber,
  setSubproductPhoneNumber,
  subproductComercialActivity,
  setSubproductComercialActivity,
  subproductConstitucion,
  setSubproductConstitucion,
  subproductPayMethod,
  setSubproductPayMethod,
  subproductSubcategory,
  setSubproductSubcategory,
  subproductSubsubcategory,
  setSubproductSubsubcategory,
  subproductCertified,
  setSubproductCertified,
  subproductPointOfSale,
  setSubproductPointOfSale,
  subproductProductNames,
  setSubproductProductNames,
  subproductLogo: parentSubproductLogo,
  setSubproductLogo,
  subproductFile: parentSubproductFile,
  setSubproductFile,
  businessHours,
  setBusinessHours,
  teamMembers,
  setTeamMembers,
  coupons,
  setCoupons,
  editingSubproduct,
  handleEditSubproducts,
  handleSaveSubproducts,
}) => {
  const token = useSelector((state) => state.authentication.token);
  const [newTeamMember, setNewTeamMember] = useState({ name: "", position: "", photo: null });
  const [newCoupon, setNewCoupon] = useState({ name: "", code: "", description: "", image: null, price: "", discount: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [subproductLogo, setLocalSubproductLogo] = useState(null);
  const [subproductFile, setLocalSubproductFile] = useState(null);

  const categories = categoriesData.categorias;
  const subcategories = categories.flatMap((cat) => cat.subcategorias.map((sub) => sub.nombre));

  const getSubsubcategories = () => {
    if (!subproductSubcategory.length) return [];
    const selectedSubcategories = categories
      .flatMap((cat) => cat.subcategorias)
      .filter((sub) => subproductSubcategory.includes(sub.nombre));
    return [...new Set(selectedSubcategories.flatMap((sub) => sub.subsubcategorias))];
  };

  useEffect(() => {
    setSubproductSubsubcategory([]);
  }, [subproductSubcategory, setSubproductSubsubcategory]);

  useEffect(() => {
    if (editingSubproduct) {
      setLogoPreview(editingSubproduct.logo || null);
      setFilePreview(editingSubproduct.file || null);
      setSubproductName(editingSubproduct.name || "");
      setSubproductPhone(editingSubproduct.phone || "");
      setSubproductEmail(editingSubproduct.email || "");
      setSubproductAddress(editingSubproduct.address || "");
      setSubproductUrl(editingSubproduct.url || "");
      setSubproductAddressmap(editingSubproduct.addressmap || "");
      setSubproductDescription(editingSubproduct.description || "");
      setSubproductCountry(editingSubproduct.country || "");
      setSubproductProvince(editingSubproduct.province || "");
      setSubproductCanton(editingSubproduct.canton || "");
      setSubproductDistrito(editingSubproduct.distrito || "");
      setSubproductContactName(editingSubproduct.contact_name || "");
      setSubproductPhoneNumber(editingSubproduct.phone_number || "");
      setSubproductComercialActivity(editingSubproduct.comercial_activity || "");
      setSubproductConstitucion(editingSubproduct.constitucion || "");
      setSubproductPayMethod(editingSubproduct.pay_method || "");
      setSubproductSubcategory(editingSubproduct.subcategory?.split(",") || []);
      setSubproductSubsubcategory(editingSubproduct.subsubcategory?.split(",") || []);
      setSubproductCertified(editingSubproduct.certified || false);
      setSubproductPointOfSale(editingSubproduct.point_of_sale || false);
      setSubproductProductNames(editingSubproduct.product_names || "");
      setBusinessHours(editingSubproduct.business_hours || []);
      setTeamMembers(editingSubproduct.team_members || []);
      setCoupons(editingSubproduct.coupons || []);
      // Do not reset subproductLogo or subproductFile here
    }
  }, [
    show,
    editingSubproduct,
    setSubproductName,
    setSubproductPhone,
    setSubproductEmail,
    setSubproductAddress,
    setSubproductUrl,
    setSubproductAddressmap,
    setSubproductDescription,
    setSubproductCountry,
    setSubproductProvince,
    setSubproductCanton,
    setSubproductDistrito,
    setSubproductContactName,
    setSubproductPhoneNumber,
    setSubproductComercialActivity,
    setSubproductConstitucion,
    setSubproductPayMethod,
    setSubproductSubcategory,
    setSubproductSubsubcategory,
    setSubproductCertified,
    setSubproductPointOfSale,
    setSubproductProductNames,
    setBusinessHours,
    setTeamMembers,
    setCoupons,
  ]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected logo:", file);
    setLocalSubproductLogo(file);
    if (file && file.type.startsWith("image/")) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setLocalSubproductFile(file);
    if (file && file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [logoPreview, filePreview]);

  const isImageFile = (url) => {
    if (!url) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const handleTeamMemberChange = (field, value) => {
    setNewTeamMember({ ...newTeamMember, [field]: value });
  };

  const handleAddTeamMember = () => {
    if (!newTeamMember.name || !newTeamMember.position) {
      setError("Nombre y posición son obligatorios para el miembro del equipo.");
      return;
    }
    if (!newTeamMember.photo) {
      setError("La foto del miembro del equipo es obligatoria.");
      return;
    }
    setTeamMembers([...teamMembers, newTeamMember]);
    setNewTeamMember({ name: "", position: "", photo: null });
    setError("");
  };

  const handleRemoveTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleCouponChange = (field, value) => {
    setNewCoupon({ ...newCoupon, [field]: value });
  };

  const handleAddCoupon = () => {
    if (!newCoupon.name || !newCoupon.code || !newCoupon.description) {
      setError("Nombre, código y descripción son obligatorios para el cupón.");
      return;
    }
    if (!newCoupon.image) {
      setError("La imagen del cupón es obligatoria.");
      return;
    }
    setCoupons([...coupons, newCoupon]);
    setNewCoupon({ name: "", code: "", description: "", image: null, price: "", discount: "" });
    setError("");
  };

  const handleRemoveCoupon = (index) => {
    setCoupons(coupons.filter((_, i) => i !== index));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setBusinessHours((prev) => {
      const existing = prev.find((bh) => bh.day === day);
      if (existing) {
        return prev.map((bh) =>
          bh.day === day ? { ...bh, [field]: value } : bh
        );
      }
      return [...prev, { day, start_time: field === "start_time" ? value : "", end_time: field === "end_time" ? value : "" }];
    });
  };

  const handleSubcategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSubproductSubcategory(selectedOptions);
  };

  const handleSubsubcategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSubproductSubsubcategory(selectedOptions);
  };

  const validateForm = () => {
    if (!subproductName || !subproductPhone) {
      setError("Nombre y teléfono son obligatorios.");
      return false;
    }
    if (subproductEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subproductEmail)) {
      setError("Email inválido.");
      return false;
    }
    if (subproductConstitucion && !moment(subproductConstitucion, "YYYY-MM-DD", true).isValid()) {
      setError("Fecha de constitución debe estar en formato YYYY-MM-DD.");
      return false;
    }
    if (subproductSubcategory.length > 0 && !subproductSubcategory.every((sub) => subcategories.includes(sub))) {
      setError("Una o más subcategorías seleccionadas no son válidas.");
      return false;
    }
    const validSubsubcategories = getSubsubcategories();
    if (subproductSubsubcategory.length > 0 && !subproductSubsubcategory.every((subsub) => validSubsubcategories.includes(subsub))) {
      setError("Una o más sub-subcategorías seleccionadas no son válidas.");
      return false;
    }
    if (businessHours.length > 0) {
      const validHours = businessHours.every(
        (bh) => bh.day && bh.start_time && bh.end_time && /^\d{2}:\d{2}(:\d{2})?$/.test(bh.start_time) && /^\d{2}:\d{2}(:\d{2})?$/.test(bh.end_time)
      );
      if (!validHours) {
        setError("Todos los horarios deben tener un día, hora de inicio y hora de fin válidos.");
        return false;
      }
    }
    if (teamMembers.length > 0) {
      const validMembers = teamMembers.every(
        (member) => member.name && member.position && member.photo
      );
      if (!validMembers) {
        setError("Todos los miembros del equipo deben tener nombre, posición y foto.");
        return false;
      }
    }
    if (coupons.length > 0) {
      const validCoupons = coupons.every(
        (coupon) => coupon.name && coupon.code && coupon.description && coupon.image
      );
      if (!validCoupons) {
        setError("Todos los cupones deben tener nombre, código, descripción e imagen.");
        return false;
      }
    }
    if (!selectedProducts || selectedProducts.length === 0) {
      setError("Debe seleccionar al menos un producto.");
      return false;
    }
    // Optional: Warn if logo or file is not selected
    console.log("validateForm - subproductLogo:", subproductLogo);
  console.log("validateForm - subproductFile:", subproductFile);
    if (!subproductLogo) {
      console.warn("No selecciono el logo");
    }
    if (!subproductFile) {
      console.warn("No selecciono archivo ");
    }
    return true;
  };

  const handleSubmit = async () => {
    console.log("handleSubmit - Before validateForm - subproductLogo:", subproductLogo);
    console.log("handleSubmit - Before validateForm - subproductFile:", subproductFile);
    if (!validateForm()) return;
    setLoading(true);
    setError("");
    try {
      console.log("handleSubmit - After validateForm - subproductLogo:", subproductLogo);
      console.log("handleSubmit - After validateForm - subproductFile:", subproductFile);
      const subproductData = {
        ...editingSubproduct,
        name: subproductName,
        phone: subproductPhone,
        email: subproductEmail,
        address: subproductAddress,
        url: subproductUrl,
        addressmap: subproductAddressmap,
        description: subproductDescription,
        country: subproductCountry,
        province: subproductProvince,
        canton: subproductCanton,
        distrito: subproductDistrito,
        contact_name: subproductContactName,
        phone_number: subproductPhoneNumber,
        comercial_activity: subproductComercialActivity,
        constitucion: subproductConstitucion,
        pay_method: subproductPayMethod,
        subcategory: subproductSubcategory.join(","),
        subsubcategory: subproductSubsubcategory.join(","),
        certified: subproductCertified,
        point_of_sale: subproductPointOfSale,
        product_names: subproductProductNames,
        business_hours: businessHours,
        team_members: teamMembers,
        coupons: coupons,
        products: selectedProducts.map((product) => product.id),
        logo: subproductLogo,
        file: subproductFile,
      };
      console.log("handleSubmit - subproductData:", subproductData);
      editingSubproduct
        ? await handleEditSubproducts(subproductData)
        : await handleSaveSubproducts(subproductData);
    } catch (err) {
      setError("Error al guardar el subproducto: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingSubproduct ? "Editar Cliente en Directorio" : "Crear Cliente en Directorio"}
        </h3>
      </div>
      <div className="p-6">
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-blue-600 text-sm mb-4">Guardando...</p>}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductName}
              onChange={(e) => setSubproductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductPhone}
              onChange={(e) => setSubproductPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductEmail}
              onChange={(e) => setSubproductEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductAddress}
              onChange={(e) => setSubproductAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Página Web</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductUrl}
              onChange={(e) => setSubproductUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección Maps</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductAddressmap}
              onChange={(e) => setSubproductAddressmap(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              rows={4}
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductDescription}
              onChange={(e) => setSubproductDescription(e.target.value)}
            />
          </div>

          {/* Location Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700">País</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductCountry}
              onChange={(e) => setSubproductCountry(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Provincia</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductProvince}
              onChange={(e) => setSubproductProvince(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cantón</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductCanton}
              onChange={(e) => setSubproductCanton(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Distrito</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductDistrito}
              onChange={(e) => setSubproductDistrito(e.target.value)}
            />
          </div>

          {/* Contact and Business Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de Contacto</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductContactName}
              onChange={(e) => setSubproductContactName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductPhoneNumber}
              onChange={(e) => setSubproductPhoneNumber(e.target.value)}
            />
Creators
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Actividad Comercial</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductComercialActivity}
              onChange={(e) => setSubproductComercialActivity(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Constitución</label>
            <input
              type="date"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductConstitucion}
              onChange={(e) => setSubproductConstitucion(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductPayMethod}
              onChange={(e) => setSubproductPayMethod(e.target.value)}
            />
          </div>

          {/* Certification and Point of Sale */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Certificado</label>
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={subproductCertified}
              onChange={(e) => setSubproductCertified(e.target.checked)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Punto de Venta</label>
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={subproductPointOfSale}
              onChange={(e) => setSubproductPointOfSale(e.target.checked)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Nombres de Productos</label>
            <input
              type="text"
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={subproductProductNames}
              onChange={(e) => setSubproductProductNames(e.target.value)}
              placeholder="Ejemplo: Producto1,Producto2"
            />
          </div>

          {/* File Uploads */}
          <div>
  <label className="block text-sm font-medium text-gray-700">Logo</label>
  <input
    type="file"
    accept="image/*"
    className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full"
    onChange={handleLogoChange}
    key={`logo-input-${show ? 'open' : 'closed'}`}
  />
  {logoPreview && (
    <div className="mt-2">
      <img
        src={logoPreview}
        alt="Previsualización del logo"
        className="w-20 h-20 rounded"
      />
    </div>
  )}
</div>
<div>
  <label className="block text-sm font-medium text-gray-700">Archivo</label>
  <input
    type="file"
    accept=".pdf, .jpg, .jpeg, .png, .gif, .mp4, .avi, .mkv, .doc, .docx, .xls, .xlsx"
    className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full"
    onChange={handleFileChange}
    key={`file-input-${show ? 'open' : 'closed'}`}
  />
  {filePreview && (
    <div className="mt-2">
      {(filePreview.startsWith("blob:") || isImageFile(filePreview)) ? (
        <img
          src={filePreview}
          alt="Previsualización del archivo"
          className="w-20 h-20 rounded"
        />
      ) : (
        <p className="text-sm text-gray-500">
          Archivo seleccionado: {subproductFile?.name || "Nuevo archivo"}
        </p>
      )}
    </div>
  )}
</div>

          {/* Product Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Seleccionar Categorias</label>
            <select
              multiple
              value={selectedProducts.map((product) => JSON.stringify(product))}
              onChange={handleProductsSelection}
              onDoubleClick={handleProductsDoubleClick}
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {products.map((product) => (
                <option key={product.id} value={JSON.stringify(product)}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory and Subsubcategory Dropdowns */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategoría</label>
            <select
              multiple
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              value={subproductSubcategory}
              onChange={handleSubcategoryChange}
            >
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sub-subcategoría</label>
            <select
              multiple
              className="mt-1 border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              value={subproductSubsubcategory}
              onChange={handleSubsubcategoryChange}
              disabled={!subproductSubcategory.length}
            >
              {getSubsubcategories().map((subsubcategory) => (
                <option key={subsubcategory} value={subsubcategory}>
                  {subsubcategory}
                </option>
              ))}
            </select>
          </div>

          {/* Business Hours */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Horario de Negocio</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"].map((day) => (
                <div key={day}>
                  <label className="block text-sm font-medium text-gray-700">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      value={businessHours.find((bh) => bh.day === day)?.start_time || ""}
                      onChange={(e) => handleBusinessHoursChange(day, "start_time", e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="time"
                      value={businessHours.find((bh) => bh.day === day)?.end_time || ""}
                      onChange={(e) => handleBusinessHoursChange(day, "end_time", e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="md:col-span-2">
            <h4 className="text-md font-semibold text-gray-900">Miembros del Equipo</h4>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del miembro"
                value={newTeamMember.name}
                onChange={(e) => handleTeamMemberChange("name", e.target.value)}
              />
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Posición"
                value={newTeamMember.position}
                onChange={(e) => handleTeamMemberChange("position", e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-md px-3 py-2"
                onChange={(e) => handleTeamMemberChange("photo", e.target.files[0])}
              />
              <button
                type="button"
                onClick={handleAddTeamMember}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Agregar Miembro
              </button>
            </div>
            {teamMembers.length > 0 && (
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posición</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-500">{member.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{member.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {member.photo ? (
                          <img
                            src={typeof member.photo === "string" ? member.photo : URL.createObjectURL(member.photo)}
                            alt="Miembro"
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          "Sin foto"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleRemoveTeamMember(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Coupons */}
          <div className="md:col-span-2">
            <h4 className="text-md font-semibold text-gray-900">Cupones</h4>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del cupón"
                value={newCoupon.name}
                onChange={(e) => handleCouponChange("name", e.target.value)}
              />
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Código del cupón"
                value={newCoupon.code}
                onChange={(e) => handleCouponChange("code", e.target.value)}
              />
              <input
                type="text"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción"
                value={newCoupon.description}
                onChange={(e) => handleCouponChange("description", e.target.value)}
              />
              <input
                type="number"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Precio"
                value={newCoupon.price}
                onChange={(e) => handleCouponChange("price", e.target.value)}
              />
              <input
                type="number"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descuento"
                value={newCoupon.discount}
                onChange={(e) => handleCouponChange("discount", e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                className="border border-gray-300 rounded-md px-3 py-2"
                onChange={(e) => handleCouponChange("image", e.target.files[0])}
              />
              <button
                type="button"
                onClick={handleAddCoupon}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Agregar Cupón
              </button>
            </div>
            {coupons.length > 0 && (
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coupons.map((coupon, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-500">{coupon.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{coupon.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{coupon.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{coupon.price || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{coupon.discount || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {coupon.image ? (
                          <img
                            src={typeof coupon.image === "string" ? coupon.image : URL.createObjectURL(coupon.image)}
                            alt="Cupón"
                            className="w-10 h-10 rounded"
                          />
                        ) : (
                          "Sin imagen"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleRemoveCoupon(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </form>
      </div>
      <div className="px-6 py-4 border-t flex justify-end space-x-2">
        <button
          onClick={handleClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {editingSubproduct ? "Guardar Cambios" : "Crear"}
        </button>
      </div>
    </div>
  );
};

export default CreateSubproduct;