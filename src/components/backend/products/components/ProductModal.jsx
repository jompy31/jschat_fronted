import React, { useState } from "react";
import { updateProduct, deleteProduct } from "../utils/api";
import "../../../backend/products/components/products.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationToast from "../../../backend/products/components/DeleteconfirmationToast"; // 👈 Importamos el componente

const ProductModal = ({
  product,
  onClose,
  token,
  setProducts,
  characteristics,
  productTypes,
  isAuthorized,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    additional_price: product.additional_price,
    product_type_id: product.product_type?.id,
    characteristics: product.characteristics.map((c) => c.id),
    design_file: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, design_file: e.target.files[0] });
  };

  const handleCharacteristicChange = (charId) => {
    const updated = formData.characteristics.includes(charId)
      ? formData.characteristics.filter((id) => id !== charId)
      : [...formData.characteristics, charId];
    setFormData({ ...formData, characteristics: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("additional_price", formData.additional_price);
    data.append("product_type_id", formData.product_type_id);
    data.append(
      "created_by_id",
      JSON.parse(localStorage.getItem("currentUser") || "{}").id || 1
    );
    formData.characteristics.forEach((id) => data.append("characteristic_ids", id));
    if (formData.design_file) data.append("design_file", formData.design_file);

    try {
      const response = await updateProduct(product.id, data, token);
      setProducts((prev) => prev.map((p) => (p.id === product.id ? response.data : p)));
      toast.success("✅ Producto actualizado correctamente");
      setIsEditing(false);
      onClose();
    } catch (err) {
      toast.error("❌ Error al actualizar el producto");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteProduct(product.id, token);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.dismiss();
      toast.success("✅ Producto eliminado correctamente");
      setShowDeleteToast(false);
      onClose();
    } catch (error) {
      toast.error("❌ Error al eliminar el producto");
    }
  };

  const handleDelete = () => {
    setDeleteMessage(`¿Eliminar el producto "${product.name}"?`);
    setShowDeleteToast(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          {isEditing ? "Editar Producto" : "Detalles del Producto"}
        </h2>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white rounded p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1">Tipo de Producto</label>
              <select
                name="product_type_id"
                value={formData.product_type_id}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white rounded p-2"
                required
              >
                <option value="">Seleccionar tipo</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1">Precio Adicional</label>
              <input
                type="number"
                name="additional_price"
                value={formData.additional_price}
                onChange={handleInputChange}
                className="w-full bg-gray-800 text-white rounded p-2"
                step="0.01"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1">Archivo de Diseño</label>
              <input
                type="file"
                name="design_file"
                onChange={handleFileChange}
                className="w-full bg-gray-800 text-white rounded p-2"
                accept="image/jpeg,image/png,application/pdf"
              />
              {product.design_file && !formData.design_file && (
                <p className="text-gray-400 text-sm mt-1">
                  Archivo actual: {product.design_file.split("/").pop()}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1">Características</label>
              {characteristics.map((char) => (
                <div key={char.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.characteristics.includes(char.id)}
                    onChange={() => handleCharacteristicChange(char.id)}
                    className="mr-2"
                  />
                  <span>{char.name}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>Nombre:</strong> {product.name}</p>
            <p><strong>Tipo:</strong> {product.product_type?.name || "N/A"}</p>
            <p><strong>Descripción:</strong> {product.description || "N/A"}</p>
            <p><strong>Precio Adicional:</strong> ₡{product.additional_price}</p>
            <p>
              <strong>Características:</strong>{" "}
              {product.characteristics.map((c) => c.name).join(", ") || "N/A"}
            </p>
            {product.design_file && (
              <div className="mt-4">
                <p><strong>Diseño:</strong></p>
                {product.design_file.endsWith(".pdf") ? (
                  <a
                    href={product.design_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400"
                  >
                    Ver PDF
                  </a>
                ) : (
                  <img
                    src={product.design_file}
                    alt={`Diseño de ${product.name}`}
                    className="max-w-full h-auto rounded mt-2"
                    style={{ maxHeight: "300px" }}
                  />
                )}
              </div>
            )}
            {isAuthorized && (
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* 🔥 Confirmación con toast */}
      <DeleteConfirmationToast
        show={showDeleteToast}
        onClose={() => setShowDeleteToast(false)}
        message={deleteMessage}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProductModal;
