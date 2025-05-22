import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductDataService from "../../../../services/products";
import { fetchServices, fetchCombos } from "../utils/apiUtils";
import PaginationControls from "../components/PaginationControls";

const CreateServicesModal = ({ show, onHide, selectedSubproduct }) => {
  const token = useSelector((state) => state.authentication.token);
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [combos, setCombos] = useState([]);
  const [totalCombos, setTotalCombos] = useState(0);
  const [currentServicesPage, setCurrentServicesPage] = useState(1);
  const [currentCombosPage, setCurrentCombosPage] = useState(1);
  const [serviceSearchTerm, setServiceSearchTerm] = useState("");
  const [newService, setNewService] = useState({ id: null, name: "", description: "", price: "", duration: "" });
  const [newCombo, setNewCombo] = useState({ id: null, name: "", description: "", price: "", selectedServiceIds: [], subproduct: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (selectedSubproduct) {
      setNewCombo((prev) => ({ ...prev, subproduct: selectedSubproduct.id }));
      fetchServicesAndCombos(selectedSubproduct.id);
    }
  }, [selectedSubproduct, currentServicesPage, currentCombosPage, serviceSearchTerm]);
  
  const fetchServicesAndCombos = async (subproductId) => {
    setLoading(true);
    try {
      await Promise.all([
        fetchServices(setServices, setTotalServices, subproductId, token, currentServicesPage, itemsPerPage, serviceSearchTerm),
        fetchCombos(setCombos, setTotalCombos, subproductId, token, currentCombosPage, itemsPerPage),
      ]);
      console.log("Combos loaded:", combos); // Añade esto para depurar
    } catch (error) {
      setError("Error al cargar servicios o combos: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (field, value) => {
    setNewService({ ...newService, [field]: value });
  };

  const handleComboChange = (field, value) => {
    setNewCombo({ ...newCombo, [field]: value });
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      setError("Nombre y precio son obligatorios para el servicio.");
      return;
    }
    setLoading(true);
    try {
      await ProductDataService.createServiceForSubProduct(selectedSubproduct.id, newService, token);
      setNewService({ id: null, name: "", description: "", price: "", duration: "" });
      setError("");
      await fetchServicesAndCombos(selectedSubproduct.id);
      alert("Servicio agregado exitosamente.");
    } catch (error) {
      setError("Error al agregar el servicio: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (serviceId) => {
    if (!newService.name || !newService.price) {
      setError("Nombre y precio son obligatorios para actualizar el servicio.");
      return;
    }
    setLoading(true);
    try {
      await ProductDataService.updateServiceForSubProduct(selectedSubproduct.id, serviceId, newService, token);
      setNewService({ id: null, name: "", description: "", price: "", duration: "" });
      setError("");
      await fetchServicesAndCombos(selectedSubproduct.id);
      alert("Servicio actualizado exitosamente.");
    } catch (error) {
      setError("Error al actualizar el servicio: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("¿Estás seguro de eliminar este servicio?")) return;
    setLoading(true);
    try {
      await ProductDataService.deleteServiceForSubProduct(selectedSubproduct.id, serviceId, token);
      await fetchServicesAndCombos(selectedSubproduct.id);
      alert("Servicio eliminado exitosamente.");
    } catch (error) {
      setError("Error al eliminar el servicio: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAddCombo = async () => {
    if (!newCombo.name || !newCombo.selectedServiceIds.length || !newCombo.subproduct) {
      setError("Nombre, al menos un servicio y subproducto son obligatorios para el combo.");
      return;
    }
    setLoading(true);
    try {
      const comboData = {
        name: newCombo.name,
        description: newCombo.description,
        price: newCombo.price,
        services: newCombo.selectedServiceIds, // Changed to match backend expectation
        subproduct: newCombo.subproduct,
      };
      if (newCombo.id) {
        await ProductDataService.updateCombo(newCombo.id, comboData, token);
        alert("Combo actualizado exitosamente.");
      } else {
        await ProductDataService.createCombo(comboData, token);
        alert("Combo agregado exitosamente.");
      }
      setNewCombo({ id: null, name: "", description: "", price: "", selectedServiceIds: [], subproduct: selectedSubproduct.id });
      setError("");
      await fetchServicesAndCombos(selectedSubproduct.id);
    } catch (error) {
      setError("Error al agregar o actualizar el combo: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditCombo = (combo) => {
    setNewCombo({
      id: combo.id,
      name: combo.name,
      description: combo.description,
      price: combo.price,
      selectedServiceIds: combo.services.map((s) => s.id),
      subproduct: selectedSubproduct.id,
    });
  };

  const handleDeleteCombo = async (comboId) => {
    if (!window.confirm("¿Estás seguro de eliminar este combo?")) return;
    setLoading(true);
    try {
      await ProductDataService.deleteCombo(comboId, token);
      await fetchServicesAndCombos(selectedSubproduct.id);
      alert("Combo eliminado exitosamente.");
    } catch (error) {
      setError("Error al eliminar el combo: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelection = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions).map((option) => parseInt(option.value));
    setNewCombo({ ...newCombo, selectedServiceIds: selectedIds });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Servicios y Combos de {selectedSubproduct?.name || ""}
          </h3>
        </div>
        <div className="p-6">
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {loading && <p className="text-blue-600 text-sm mb-4">Cargando...</p>}

          {/* Service Search */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar servicios..."
              value={serviceSearchTerm}
              onChange={(e) => {
                setServiceSearchTerm(e.target.value);
                setCurrentServicesPage(1);
              }}
            />
          </div>

          {/* Services Table */}
          <h4 className="text-md font-semibold text-gray-900">Servicios</h4>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className=" sattelite bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duración</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">{service.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{service.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{service.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{`$${Number(service.price).toFixed(2)}`}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{service.duration || "N/A"}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          setNewService({ ...service, id: service.id });
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={currentServicesPage}
            totalItems={totalServices}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentServicesPage}
          />

          {/* Add/Update Service Form */}
          <h4 className="mt-6 text-md font-semibold text-gray-900">{newService.id ? "Editar Servicio" : "Agregar Nuevo Servicio"}</h4>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del servicio"
              value={newService.name}
              onChange={(e) => handleServiceChange("name", e.target.value)}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción"
              value={newService.description}
              onChange={(e) => handleServiceChange("description", e.target.value)}
            />
            <input
              type="number"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Precio"
              value={newService.price}
              onChange={(e) => handleServiceChange("price", e.target.value)}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Duración (ej. 30 min)"
              value={newService.duration}
              onChange={(e) => handleServiceChange("duration", e.target.value)}
            />
            <button
              onClick={() => (newService.id ? handleUpdateService(newService.id) : handleAddService())}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {newService.id ? "Actualizar Servicio" : "Agregar Servicio"}
            </button>
          </div>

          {/* Combos Table */}
          <h4 className="mt-6 text-md font-semibold text-gray-900">Combos</h4>
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicios</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {combos.map((combo) => (
                  <tr key={combo.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">{combo.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{combo.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{combo.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{`$${Number(combo.price).toFixed(2)}`}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {combo.services.map((s) => s.name).join(", ")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleEditCombo(combo)}
                        className="text-blue-600 hover:text-blue-800 transition-colors mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCombo(combo.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PaginationControls
            currentPage={currentCombosPage}
            totalItems={totalCombos}
            itemsPerPage={itemsPerPage}
            setCurrentPage={setCurrentCombosPage}
          />

          {/* Add/Update Combo Form */}
          <h4 className="mt-6 text-md font-semibold text-gray-900">{newCombo.id ? "Editar Combo" : "Agregar Nuevo Combo"}</h4>
          <div className="grid grid-cols-1 gap-4 mt-2">
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del combo"
              value={newCombo.name}
              onChange={(e) => handleComboChange("name", e.target.value)}
            />
            <input
              type="text"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción"
              value={newCombo.description}
              onChange={(e) => handleComboChange("description", e.target.value)}
            />
            <input
              type="number"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Precio"
              value={newCombo.price}
              onChange={(e) => handleComboChange("price", e.target.value)}
            />
            <select
              multiple
              value={newCombo.selectedServiceIds}
              onChange={handleServiceSelection}
              className="border border-gray-300 rounded-md px-3 py-2 w-full h-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddCombo}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {newCombo.id ? "Actualizar Combo" : "Agregar Combo"}
            </button>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end space-x-2">
          <button
            onClick={onHide}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateServicesModal;