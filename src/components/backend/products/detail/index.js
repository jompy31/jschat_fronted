import React, { useState, useEffect } from "react";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import DeleteConfirmationToast from "../../../backend/products/components/DeleteconfirmationToast";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchProducts, deleteProduct } from "../utils/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const isAuthorized =
    user?.userprofile?.staff_status &&
    ["administrator", "sales", "design"].includes(user.userprofile.staff_status);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else {
      toast.error("⚠️ No se encontró usuario autenticado");
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchProducts(token)
        .then((response) => setProducts(response.data))
        .catch(() => toast.error("Error al cargar productos"));
    }
  }, [token]);

  const handleSelect = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteConfirmation = (product) => {
    setSelectedProduct(product);
    setDeleteMessage(`¿Eliminar el producto "${product.name}"?`);
    setShowDeleteToast(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProduct.id, token);
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
      setShowDeleteToast(false);
      toast.success("✅ Producto eliminado correctamente");
    } catch {
      toast.error("❌ Error al eliminar el producto");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <ProductTable
        products={products}
        setProducts={setProducts}
        token={token}
        isAuthorized={isAuthorized}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirmation}
      />
      {showModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          token={token}
          setProducts={setProducts}
          characteristics={[]}
          productTypes={[]}
          isAuthorized={isAuthorized}
        />
      )}
      <DeleteConfirmationToast
        show={showDeleteToast}
        onClose={() => setShowDeleteToast(false)}
        message={deleteMessage}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProductsPage;
