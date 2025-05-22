import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FaPlus, FaSearch, FaFileCsv } from "react-icons/fa";
import CreateSubproduct from "./modal_subproduct/Create_subproduct";
import CreateServicesModal from "./modal_subproduct/Create_services";
import SubproductTable from "./components/SubproductTable";
import PaginationControls from "./components/PaginationControls";
import CsvUpload from "./components/CsvUpload";
import SearchBar from "./components/SearchBar";
import { fetchProducts, fetchSubproducts, fetchCombos, fetchServices } from "./utils/apiUtils";
import { handleCsvUpload } from "./utils/csvUtils";
import ProductDataService from "../../../services/products";
import debounce from "lodash/debounce";

const Directory = () => {
  const [products, setProducts] = useState([]);
  const [subproducts, setSubproducts] = useState([]);
  const [filteredSubproducts, setFilteredSubproducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSubproductsPage, setCurrentSubproductsPage] = useState(1);
  const [totalSubproducts, setTotalSubproducts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateView, setShowCreateView] = useState(false); // Changed from showCreateModal
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

  const debouncedFetchSubproducts = useCallback(
    debounce((token, page, pageSize, search) => {
      setIsLoading(true);
      fetchSubproducts(setSubproducts, setTotalSubproducts, token, page, pageSize, search)
        .finally(() => setIsLoading(false));
    }, 500),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchProducts(setProducts, setSubproducts, token).finally(() => setIsLoading(false)),
      fetchCombos(setCombos, setTotalCombos, null, token), // Pass setTotalCombos and null for subproductId
      fetchServices(setServices, setTotalServices, null, token),
    ]);
  }, [token]);

  useEffect(() => {
    debouncedFetchSubproducts(token, currentSubproductsPage, subproductsPerPage, searchTerm);
  }, [token, currentSubproductsPage, searchTerm, debouncedFetchSubproducts]);

  useEffect(() => {
    setFilteredSubproducts(subproducts);
  }, [subproducts]);

  const handleCreate = () => {
    setEditingSubproduct(null);
    setShowCreateView(true); // Show the create view
  };

  const handleCloseCreateView = () => {
    setShowCreateView(false); // Return to the main view
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
    // ... (rest of the handleEditSubproducts function remains unchanged)
    try {
      setIsLoading(true);
      const response = await ProductDataService.updateSubProduct(subproductId, editedSubProduct, token);
      await fetchSubproducts(setSubproducts, setTotalSubproducts, token, currentSubproductsPage, subproductsPerPage, searchTerm);
      handleCloseCreateView(); // Updated to use handleCloseCreateView
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
  
    // Append basic fields
    newSubProduct.append("name", subproductData.name);
    newSubProduct.append("phone", subproductData.phone);
    if (subproductData.email) newSubProduct.append("email", subproductData.email);
    if (subproductData.address) newSubProduct.append("address", subproductData.address);
    if (subproductData.url) newSubProduct.append("url", subproductData.url);
    if (subproductData.addressmap) newSubProduct.append("addressmap", subproductData.addressmap);
    if (subproductData.description) newSubProduct.append("description", subproductData.description);
    if (subproductData.country) newSubProduct.append("country", subproductData.country);
    if (subproductData.province) newSubProduct.append("province", subproductData.province);
    if (subproductData.canton) newSubProduct.append("canton", subproductData.canton);
    if (subproductData.distrito) newSubProduct.append("distrito", subproductData.distrito);
    if (subproductData.contact_name) newSubProduct.append("contact_name", subproductData.contact_name);
    if (subproductData.phone_number) newSubProduct.append("phone_number", subproductData.phone_number);
    if (subproductData.comercial_activity) newSubProduct.append("comercial_activity", subproductData.comercial_activity);
    if (subproductData.constitucion) newSubProduct.append("constitucion", subproductData.constitucion);
    if (subproductData.pay_method) newSubProduct.append("pay_method", subproductData.pay_method);
    if (subproductData.subcategory) newSubProduct.append("subcategory", subproductData.subcategory);
    if (subproductData.subsubcategory) newSubProduct.append("subsubcategory", subproductData.subsubcategory);
    newSubProduct.append("certified", subproductData.certified.toString());
    newSubProduct.append("point_of_sale", subproductData.point_of_sale.toString());
    if (subproductData.product_names) newSubProduct.append("product_names", subproductData.product_names);
  
    // Append products
    subproductData.products.forEach((productId, index) => {
      newSubProduct.append(`products[${index}]`, productId);
    });
  
    // Append business hours
    subproductData.business_hours.forEach((bh, index) => {
      newSubProduct.append(`business_hours[${index}][day]`, bh.day);
      newSubProduct.append(`business_hours[${index}][start_time]`, bh.start_time);
      newSubProduct.append(`business_hours[${index}][end_time]`, bh.end_time);
    });
  
    // Append team members
    subproductData.team_members.forEach((tm, index) => {
      newSubProduct.append(`team_members[${index}][name]`, tm.name);
      newSubProduct.append(`team_members[${index}][position]`, tm.position);
      if (tm.photo && tm.photo instanceof File) {
        newSubProduct.append(`team_members[${index}][photo]`, tm.photo);
      }
    });
  
    // Append coupons
    subproductData.coupons.forEach((coupon, index) => {
      newSubProduct.append(`coupons[${index}][name]`, coupon.name);
      newSubProduct.append(`coupons[${index}][code]`, coupon.code);
      newSubProduct.append(`coupons[${index}][description]`, coupon.description);
      if (coupon.price) newSubProduct.append(`coupons[${index}][price]`, coupon.price);
      if (coupon.discount) newSubProduct.append(`coupons[${index}][discount]`, coupon.discount);
      if (coupon.image && coupon.image instanceof File) {
        newSubProduct.append(`coupons[${index}][image]`, coupon.image);
      }
    });
  
    // Append logo and file
    if (subproductData.logo && subproductData.logo instanceof File) {
      console.log("Appending logo to FormData:", subproductData.logo.name, subproductData.logo); // Enhanced debug log
      newSubProduct.append("logo", subproductData.logo);
    } else {
      console.warn("Logo not appended: Invalid or missing logo", subproductData.logo);
    }
  
    if (subproductData.file && subproductData.file instanceof File) {
      console.log("Appending file to FormData:", subproductData.file.name, subproductData.file); // Enhanced debug log
      newSubProduct.append("file", subproductData.file);
    } else {
      console.warn("File not appended: Invalid or missing file", subproductData.file);
    }
  
    // Debug FormData contents
    console.log("FormData contents:");
    for (let [key, value] of newSubProduct.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`);
    }
  
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
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 p-6">
        {showCreateView ? (
          <CreateSubproduct
            show={showCreateView}
            handleClose={handleCloseCreateView} // Updated to use handleCloseCreateView
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
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
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
              filteredSubproducts={filteredSubproducts}
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
                setShowCreateView(true); // Show the create view for editing
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