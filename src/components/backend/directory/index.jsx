import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaFileCsv } from "react-icons/fa";
import CreateSubproduct from "./modal_subproduct/Create_subproduct";
import CreateServicesModal from "./modal_subproduct/Create_services";
import SubproductTable from "./components/SubproductTable";
import PaginationControls from "./components/PaginationControls";
import CsvUpload from "./components/CsvUpload";
import SearchBar from "./components/SearchBar";
import { fetchProducts, fetchSubproducts, fetchCombos, fetchServices } from "./utils/apiUtils";
import { handleCsvUpload } from "./utils/csvUtils";
import ProductDataService from "../../../services/products";

const Directory = () => {
  const [products, setProducts] = useState([]);
  const [subproducts, setSubproducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSubproductsPage, setCurrentSubproductsPage] = useState(1);
  const [totalSubproducts, setTotalSubproducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateView, setShowCreateView] = useState(false);
  const [editingSubproduct, setEditingSubproduct] = useState(null);
  const [subproductName, setSubproductName] = useState("");
  const [subproductPhone, setSubproductPhone] = useState("");
  const [subproductEmail, setSubproductEmail] = useState("");
  const [subproductAddress, setSubproductAddress] = useState("");
  const [subproductAddressmap, setSubproductAddressmap] = useState("");
  const [subproductUrl, setSubproductUrl] = useState("");
  const [subproductDescription, setSubproductDescription] = useState("");
  const [subproductCountry, setSubproductCountry] = useState("");
  const [subproductProvince, setSubproductProvince] = useState("");
  const [subproductCanton, setSubproductCanton] = useState("");
  const [subproductDistrito, setSubproductDistrito] = useState("");
  const [subproductContactName, setSubproductContactName] = useState("");
  const [subproductPhoneNumber, setSubproductPhoneNumber] = useState("");
  const [subproductComercialActivity, setSubproductComercialActivity] = useState("");
  const [subproductConstitucion, setSubproductConstitucion] = useState("");
  const [subproductPayMethod, setSubproductPayMethod] = useState("");
  const [subproductSubcategory, setSubproductSubcategory] = useState("");
  const [subproductSubsubcategory, setSubproductSubsubcategory] = useState("");
  const [subproductCertified, setSubproductCertified] = useState(false);
  const [subproductPointOfSale, setSubproductPointOfSale] = useState(false);
  const [subproductProductNames, setSubproductProductNames] = useState("");
  const [subproductLogo, setSubproductLogo] = useState(null);
  const [subproductFile, setSubproductFile] = useState(null);
  const [businessHours, setBusinessHours] = useState([]);
  const [totalCombos, setTotalCombos] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [teamMembers, setTeamMembers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedSubproduct, setSelectedSubproduct] = useState(null);
  const [combos, setCombos] = useState([]);
  const [services, setServices] = useState([]);
  const token = useSelector((state) => state.authentication.token);
  const subproductsPerPage = 10;

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchProducts(setProducts, setSubproducts, token),
      fetchCombos(setCombos, setTotalCombos, null, token),
      fetchServices(setServices, setTotalServices, null, token),
    ]).finally(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    setIsLoading(true);
    fetchSubproducts(setSubproducts, setTotalSubproducts, token, currentSubproductsPage, subproductsPerPage, "")
      .finally(() => setIsLoading(false));
  }, [token, currentSubproductsPage]);

  const handleSearch = () => {
    setIsLoading(true);
    setCurrentSubproductsPage(1); // Reset to page 1 on new search
    fetchSubproducts(setSubproducts, setTotalSubproducts, token, 1, subproductsPerPage, searchTerm)
      .finally(() => setIsLoading(false));
  };

  const handleCreate = () => {
    setEditingSubproduct(null);
    setShowCreateView(true);
  };

  const handleCloseCreateView = () => {
    setShowCreateView(false);
    setEditingSubproduct(null);
    setSubproductName("");
    setSubproductPhone("");
    setSubproductEmail("");
    setSubproductAddress("");
    setSubproductAddressmap("");
    setSubproductUrl("");
    setSubproductDescription("");
    setSubproductCountry("");
    setSubproductProvince("");
    setSubproductCanton("");
    setSubproductDistrito("");
    setSubproductContactName("");
    setSubproductPhoneNumber("");
    setSubproductComercialActivity("");
    setSubproductConstitucion("");
    setSubproductPayMethod("");
    setSubproductSubcategory("");
    setSubproductSubsubcategory("");
    setSubproductCertified(false);
    setSubproductPointOfSale(false);
    setSubproductProductNames("");
    setSubproductLogo(null);
    setSubproductFile(null);
    setBusinessHours([]);
    setTeamMembers([]);
    setCoupons([]);
    setSelectedProducts([]);
  };

  const handleEditSubproducts = async (subproductId) => {
    const editedSubProduct = new FormData();
    try {
      setIsLoading(true);
      const response = await ProductDataService.updateSubProduct(subproductId, editedSubProduct, token);
      await fetchSubproducts(setSubproducts, setTotalSubproducts, token, currentSubproductsPage, subproductsPerPage, searchTerm);
      handleCloseCreateView();
      alert("Subproducto actualizado exitosamente.");
    } catch (error) {
      console.error("Error al actualizar subproducto:", error.response?.data);
      alert("Error al actualizar el subproducto: " + (error.response?.data?.error || JSON.stringify(error.response?.data) || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSubproducts = async (subproductData) => {
    const newSubProduct = new FormData();
    try {
      setIsLoading(true);
      const response = await ProductDataService.createSubProduct(newSubProduct, token);
      await fetchSubproducts(setSubproducts, setTotalSubproducts, token, currentSubproductsPage, subproductsPerPage, searchTerm);
      handleCloseCreateView();
      alert("Subproducto creado exitosamente.");
    } catch (error) {
      console.error("Error al crear subproducto:", error.response?.data);
      alert(
        "Error al crear el subproducto: " +
          (error.response?.data?.error || JSON.stringify(error.response?.data) || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductsSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      JSON.parse(option.value)
    );
    setSelectedProducts(selectedOptions);
  };

  const handleProductsDoubleClick = () => setSelectedProducts([]);

  return (
    <div className="flex min-h-screen bg-gray-100" style={{ marginTop: "6%" }}>
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Directorio</h2>
        <ul>
          <li className="mb-2">
            <button className="w-full text-left p-2 hover:bg-blue-100 rounded">Directorio</button>
          </li>
          <li className="mb-2">
            <button className="w-full text-left p-2 hover:bg-blue-100 rounded">Servicios</button>
          </li>
          <li className="mb-2">
            <button className="w-full text-left p-2 hover:bg-blue-100 rounded">Combos</button>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">
        {showCreateView ? (
          <CreateSubproduct
            show={showCreateView}
            handleClose={handleCloseCreateView}
            subproductName={subproductName}
            setSubproductName={setSubproductName}
            subproductPhone={subproductPhone}
            setSubproductPhone={setSubproductPhone}
            subproductEmail={subproductEmail}
            setSubproductEmail={setSubproductEmail}
            subproductAddress={subproductAddress}
            setSubproductAddress={setSubproductAddress}
            subproductUrl={subproductUrl}
            setSubproductUrl={setSubproductUrl}
            subproductAddressmap={subproductAddressmap}
            setSubproductAddressmap={setSubproductAddressmap}
            selectedProducts={selectedProducts}
            handleProductsSelection={handleProductsSelection}
            handleProductsDoubleClick={handleProductsDoubleClick}
            products={products}
            subproductDescription={subproductDescription}
            setSubproductDescription={setSubproductDescription}
            subproductCountry={subproductCountry}
            setSubproductCountry={setSubproductCountry}
            subproductProvince={subproductProvince}
            setSubproductProvince={setSubproductProvince}
            subproductCanton={subproductCanton}
            setSubproductCanton={setSubproductCanton}
            subproductDistrito={subproductDistrito}
            setSubproductDistrito={setSubproductDistrito}
            subproductContactName={subproductContactName}
            setSubproductContactName={setSubproductContactName}
            subproductPhoneNumber={subproductPhoneNumber}
            setSubproductPhoneNumber={setSubproductPhoneNumber}
            subproductComercialActivity={subproductComercialActivity}
            setSubproductComercialActivity={setSubproductComercialActivity}
            subproductConstitucion={subproductConstitucion}
            setSubproductConstitucion={setSubproductConstitucion}
            subproductPayMethod={subproductPayMethod}
            setSubproductPayMethod={setSubproductPayMethod}
            subproductSubcategory={subproductSubcategory}
            setSubproductSubcategory={setSubproductSubcategory}
            subproductSubsubcategory={subproductSubsubcategory}
            setSubproductSubsubcategory={setSubproductSubsubcategory}
            subproductCertified={subproductCertified}
            setSubproductCertified={setSubproductCertified}
            subproductPointOfSale={subproductPointOfSale}
            setSubproductPointOfSale={setSubproductPointOfSale}
            subproductProductNames={subproductProductNames}
            setSubproductProductNames={setSubproductProductNames}
            setSubproductLogo={setSubproductLogo}
            setSubproductFile={setSubproductFile}
            businessHours={businessHours}
            setBusinessHours={setBusinessHours}
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            coupons={coupons}
            setCoupons={setCoupons}
            editingSubproduct={editingSubproduct}
            handleEditSubproducts={() => handleEditSubproducts(editingSubproduct?.id)}
            handleSaveSubproducts={handleSaveSubproducts}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">Gestión del Directorio</h1>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                disabled={isLoading}
              >
                <FaPlus className="mr-2" /> Crear Comercio del Directorio
              </button>
            </div>

            <div className="mb-4 flex justify-between items-center">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isSearching={isLoading} onSearch={handleSearch} />
              <CsvUpload
                csvFile={csvFile}
                setCsvFile={setCsvFile}
                handleCsvUpload={() => handleCsvUpload(csvFile, token, setSubproducts)}
              />
            </div>

            {isLoading && (
              <div className="text-center py-4">
                <p className="text-gray-600">Cargando datos...</p>
              </div>
            )}

            <SubproductTable
              filteredSubproducts={subproducts}
              handleShowServicesModal={(subproduct) => {
                setSelectedSubproduct(subproduct);
                setShowServicesModal(true);
              }}
              handleEditSubproduct={(subproduct) => {
                setEditingSubproduct(subproduct);
                setSubproductName(subproduct.name || "");
                setSubproductPhone(subproduct.phone || "");
                setSubproductEmail(subproduct.email || "");
                setSubproductAddress(subproduct.address || "");
                setSubproductAddressmap(subproduct.addressmap || "");
                setSubproductUrl(subproduct.url || "");
                setSubproductDescription(subproduct.description || "");
                setSubproductCountry(subproduct.country || "");
                setSubproductProvince(subproduct.province || "");
                setSubproductCanton(subproduct.canton || "");
                setSubproductDistrito(subproduct.distrito || "");
                setSubproductContactName(subproduct.contact_name || "");
                setSubproductPhoneNumber(subproduct.phone_number || "");
                setSubproductComercialActivity(subproduct.comercial_activity || "");
                setSubproductConstitucion(subproduct.constitucion || "");
                setSubproductPayMethod(subproduct.pay_method || "");
                setSubproductSubcategory(subproduct.subcategory || "");
                setSubproductSubsubcategory(subproduct.subsubcategory || "");
                setSubproductCertified(subproduct.certified || false);
                setSubproductPointOfSale(subproduct.point_of_sale || false);
                setSubproductProductNames(subproduct.product_names || "");
                setBusinessHours(subproduct.business_hours || []);
                setTeamMembers(subproduct.team_members || []);
                setCoupons(subproduct.coupons || []);
                setSelectedProducts(
                  subproduct.products?.map((product) => ({
                    id: product.id,
                    name: product.name,
                  })) || []
                );
                setShowCreateView(true);
              }}
              handleDeleteS={(id) => {
                if (window.confirm("¿Estás seguro de eliminar este subproducto?")) {
                  setIsLoading(true);
                  ProductDataService.deleteSubProduct(id, token).then(() => {
                    fetchSubproducts(setSubproducts, setTotalSubproducts, token, currentSubproductsPage, subproductsPerPage, searchTerm)
                      .finally(() => setIsLoading(false));
                    alert("Subproducto eliminado exitosamente.");
                  });
                }
              }}
            />

            <PaginationControls
              currentPage={currentSubproductsPage}
              totalItems={totalSubproducts}
              itemsPerPage={subproductsPerPage}
              setCurrentPage={setCurrentSubproductsPage}
            />
          </>
        )}

        <CreateServicesModal
          show={showServicesModal}
          onHide={() => setShowServicesModal(false)}
          selectedSubproduct={selectedSubproduct}
          services={services}
          combos={combos}
        />
      </div>
    </div>
  );
};

export default Directory;