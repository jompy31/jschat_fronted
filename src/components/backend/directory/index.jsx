import React, { useState, useEffect } from "react";
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

const Directory = () => {
  const [products, setProducts] = useState([]);
  const [subproducts, setSubproducts] = useState([]);
  const [filteredSubproducts, setFilteredSubproducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSubproductsPage, setCurrentSubproductsPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
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
  const [subproductProductNames, setSubproductProductNames] = useState("");
  const [subproductLogo, setSubproductLogo] = useState(null);
  const [subproductFile, setSubproductFile] = useState(null);
  const [businessHours, setBusinessHours] = useState([]);
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
    fetchProducts(setProducts, setSubproducts, token);
    fetchSubproducts(setSubproducts, token);
    fetchCombos(setCombos, token);
    fetchServices(setServices, token);
  }, [token]);

  useEffect(() => {
    const results = subproducts.filter((subproduct) =>
      subproduct.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubproducts(results);
    setCurrentSubproductsPage(1);
  }, [searchTerm, subproducts]);

  const indexOfLastSubproduct = currentSubproductsPage * subproductsPerPage;
  const indexOfFirstSubproduct = indexOfLastSubproduct - subproductsPerPage;
  const currentSubproducts = filteredSubproducts.slice(indexOfFirstSubproduct, indexOfLastSubproduct);

  const handleCreate = () => {
    setEditingSubproduct(null);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
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

    // Añadir campos básicos del subproducto
    editedSubProduct.append("name", subproductName || "");
    editedSubProduct.append("phone", subproductPhone || "");
    editedSubProduct.append("email", subproductEmail || "");
    editedSubProduct.append("address", subproductAddress || "");
    editedSubProduct.append("addressmap", subproductAddressmap || "");
    editedSubProduct.append("url", subproductUrl || "");
    editedSubProduct.append("description", subproductDescription || "");
    editedSubProduct.append("country", subproductCountry || "");
    editedSubProduct.append("province", subproductProvince || "");
    editedSubProduct.append("canton", subproductCanton || "");
    editedSubProduct.append("distrito", subproductDistrito || "");
    editedSubProduct.append("contact_name", subproductContactName || "");
    editedSubProduct.append("phone_number", subproductPhoneNumber || "");
    editedSubProduct.append("comercial_activity", subproductComercialActivity || "");
    editedSubProduct.append("pay_method", subproductPayMethod || "");
    editedSubProduct.append("subcategory", subproductSubcategory || "");
    editedSubProduct.append("subsubcategory", subproductSubsubcategory || "");
    editedSubProduct.append("certified", subproductCertified.toString());
    editedSubProduct.append("product_names", subproductProductNames || "");
    editedSubProduct.append(
      "constitucion",
      subproductConstitucion ? moment(subproductConstitucion).format("YYYY-MM-DD") : ""
    );

    // Añadir business_hours
    if (businessHours.length > 0) {
      const validBusinessHours = businessHours
        .filter((bh) => bh.day && bh.start_time && bh.end_time)
        .map((bh) => ({
          day: bh.day,
          start_time: bh.start_time.length === 5 ? `${bh.start_time}:00` : bh.start_time,
          end_time: bh.end_time.length === 5 ? `${bh.end_time}:00` : bh.end_time,
        }));
      if (validBusinessHours.length > 0) {
        validBusinessHours.forEach((bh, index) => {
          editedSubProduct.append(`business_hours[${index}][day]`, bh.day);
          editedSubProduct.append(`business_hours[${index}][start_time]`, bh.start_time);
          editedSubProduct.append(`business_hours[${index}][end_time]`, bh.end_time);
        });
      }
    }

    // Añadir team_members
    if (teamMembers.length > 0) {
      const validTeamMembers = teamMembers.filter(
        (member) => member.name && member.position
      );
      if (validTeamMembers.length > 0) {
        validTeamMembers.forEach((member, index) => {
          editedSubProduct.append(`team_members[${index}][name]`, member.name);
          editedSubProduct.append(`team_members[${index}][position]`, member.position);
          if (member.photo && typeof member.photo !== "string") {
            // Nueva imagen subida
            editedSubProduct.append(`team_members[${index}][photo]`, member.photo);
          } else if (member.photo && typeof member.photo === "string") {
            // Conservar imagen existente
            editedSubProduct.append(`team_members[${index}][photo_url]`, member.photo);
          } else if (!member.photo && editingSubproduct?.team_members?.[index]?.photo) {
            // Si no hay nueva imagen, usar la existente del subproducto
            editedSubProduct.append(`team_members[${index}][photo_url]`, editingSubproduct.team_members[index].photo);
          }
        });
      }
    } else if (editingSubproduct?.team_members?.length > 0) {
      // Conservar miembros del equipo existentes si no se envían nuevos
      editingSubproduct.team_members.forEach((member, index) => {
        editedSubProduct.append(`team_members[${index}][name]`, member.name);
        editedSubProduct.append(`team_members[${index}][position]`, member.position);
        if (member.photo) {
          editedSubProduct.append(`team_members[${index}][photo_url]`, member.photo);
        }
      });
    }

    // Añadir coupons
    if (coupons.length > 0) {
      const validCoupons = coupons.filter(
        (coupon) => coupon.name && coupon.code && coupon.description
      );
      if (validCoupons.length > 0) {
        validCoupons.forEach((coupon, index) => {
          editedSubProduct.append(`coupons[${index}][name]`, coupon.name);
          editedSubProduct.append(`coupons[${index}][code]`, coupon.code);
          editedSubProduct.append(`coupons[${index}][description]`, coupon.description);
          if (coupon.price) {
            editedSubProduct.append(`coupons[${index}][price]`, coupon.price);
          }
          if (coupon.discount) {
            editedSubProduct.append(`coupons[${index}][discount]`, coupon.discount);
          }
          if (coupon.image && typeof coupon.image !== "string") {
            // Nueva imagen subida
            editedSubProduct.append(`coupons[${index}][image]`, coupon.image);
          } else if (coupon.image && typeof coupon.image === "string") {
            // Conservar imagen existente
            editedSubProduct.append(`coupons[${index}][image_url]`, coupon.image);
          } else if (!coupon.image && editingSubproduct?.coupons?.[index]?.image) {
            // Si no hay nueva imagen, usar la existente del subproducto
            editedSubProduct.append(`coupons[${index}][image_url]`, editingSubproduct.coupons[index].image);
          }
        });
      }
    } else if (editingSubproduct?.coupons?.length > 0) {
      // Conservar cupones existentes si no se envían nuevos
      editingSubproduct.coupons.forEach((coupon, index) => {
        editedSubProduct.append(`coupons[${index}][name]`, coupon.name);
        editedSubProduct.append(`coupons[${index}][code]`, coupon.code);
        editedSubProduct.append(`coupons[${index}][description]`, coupon.description);
        if (coupon.price) {
          editedSubProduct.append(`coupons[${index}][price]`, coupon.price);
        }
        if (coupon.discount) {
          editedSubProduct.append(`coupons[${index}][discount]`, coupon.discount);
        }
        if (coupon.image) {
          editedSubProduct.append(`coupons[${index}][image_url]`, coupon.image);
        }
      });
    }

    // Añadir logo y file
    if (subproductLogo && typeof subproductLogo !== "string") {
      editedSubProduct.append("logo", subproductLogo);
    } else if (!subproductLogo && editingSubproduct?.logo) {
      editedSubProduct.append("logo_url", editingSubproduct.logo);
    }
    if (subproductFile && typeof subproductFile !== "string") {
      editedSubProduct.append("file", subproductFile);
    } else if (!subproductFile && editingSubproduct?.file) {
      editedSubProduct.append("file_url", editingSubproduct.file);
    }

    // Añadir productos seleccionados
    let productIds = [];
    if (selectedProducts.length > 0) {
      // Usar los nuevos productos seleccionados
      productIds = selectedProducts.map((product) => product.id);
    } else if (editingSubproduct?.products?.length > 0) {
      // Conservar los productos existentes si no se seleccionaron nuevos
      productIds = editingSubproduct.products.map((product) => product.id);
    }
    productIds.forEach((id, index) => {
      editedSubProduct.append(`products[${index}]`, id);
    });

    // Inspeccionar FormData
    console.log("Datos enviados para actualizar subproducto:");
    for (let pair of editedSubProduct.entries()) {
      console.log(`${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`);
    }

    try {
      const response = await ProductDataService.updateSubProduct(subproductId, editedSubProduct, token);
      console.log("Respuesta del servidor (actualización):", response.data);
      await fetchSubproducts(setSubproducts, token);
      handleCloseCreateModal();
      alert("Subproducto actualizado exitosamente.");
    } catch (error) {
      console.error("Error al actualizar subproducto:", error.response?.data);
      alert("Error al actualizar el subproducto: " + (error.response?.data?.error || JSON.stringify(error.response?.data) || error.message));
    }
  };

  const handleSaveSubproducts = async () => {
    const newSubProduct = new FormData();

    // Añadir campos básicos del subproducto
    newSubProduct.append("name", subproductName || "");
    newSubProduct.append("phone", subproductPhone || "");
    newSubProduct.append("email", subproductEmail || "");
    newSubProduct.append("address", subproductAddress || "");
    newSubProduct.append("addressmap", subproductAddressmap || "");
    newSubProduct.append("url", subproductUrl || "");
    newSubProduct.append("description", subproductDescription || "");
    newSubProduct.append("country", subproductCountry || "");
    newSubProduct.append("province", subproductProvince || "");
    newSubProduct.append("canton", subproductCanton || "");
    newSubProduct.append("distrito", subproductDistrito || "");
    newSubProduct.append("contact_name", subproductContactName || "");
    newSubProduct.append("phone_number", subproductPhoneNumber || "");
    newSubProduct.append("comercial_activity", subproductComercialActivity || "");
    newSubProduct.append("pay_method", subproductPayMethod || "");
    newSubProduct.append("subcategory", subproductSubcategory || "");
    newSubProduct.append("subsubcategory", subproductSubsubcategory || "");
    newSubProduct.append("certified", subproductCertified.toString());
    newSubProduct.append("product_names", subproductProductNames || "");
    newSubProduct.append(
      "constitucion",
      subproductConstitucion ? moment(subproductConstitucion).format("YYYY-MM-DD") : ""
    );

    // Añadir business_hours
    if (businessHours.length > 0) {
      const validBusinessHours = businessHours
        .filter((bh) => bh.day && bh.start_time && bh.end_time)
        .map((bh) => ({
          day: bh.day,
          start_time: bh.start_time.length === 5 ? `${bh.start_time}:00` : bh.start_time,
          end_time: bh.end_time.length === 5 ? `${bh.end_time}:00` : bh.end_time,
        }));
      if (validBusinessHours.length > 0) {
        validBusinessHours.forEach((bh, index) => {
          newSubProduct.append(`business_hours[${index}][day]`, bh.day);
          newSubProduct.append(`business_hours[${index}][start_time]`, bh.start_time);
          newSubProduct.append(`business_hours[${index}][end_time]`, bh.end_time);
        });
      }
    }

    // Añadir team_members
    if (teamMembers.length > 0) {
      const validTeamMembers = teamMembers.filter(
        (member) => member.name && member.position
      );
      if (validTeamMembers.length > 0) {
        validTeamMembers.forEach((member, index) => {
          newSubProduct.append(`team_members[${index}][name]`, member.name);
          newSubProduct.append(`team_members[${index}][position]`, member.position);
          if (member.photo && typeof member.photo !== "string") {
            newSubProduct.append(`team_members[${index}][photo]`, member.photo);
          }
        });
      }
    }

    // Añadir coupons
    if (coupons.length > 0) {
      const validCoupons = coupons.filter(
        (coupon) => coupon.name && coupon.code && coupon.description
      );
      if (validCoupons.length > 0) {
        validCoupons.forEach((coupon, index) => {
          newSubProduct.append(`coupons[${index}][name]`, coupon.name);
          newSubProduct.append(`coupons[${index}][code]`, coupon.code);
          newSubProduct.append(`coupons[${index}][description]`, coupon.description);
          if (coupon.price) {
            newSubProduct.append(`coupons[${index}][price]`, coupon.price);
          }
          if (coupon.discount) {
            newSubProduct.append(`coupons[${index}][discount]`, coupon.discount);
          }
          if (coupon.image && typeof coupon.image !== "string") {
            newSubProduct.append(`coupons[${index}][image]`, coupon.image);
          }
        });
      }
    }

    // Añadir logo y file
    if (subproductLogo && typeof subproductLogo !== "string") {
      newSubProduct.append("logo", subproductLogo);
    }
    if (subproductFile && typeof subproductFile !== "string") {
      newSubProduct.append("file", subproductFile);
    }

    // Añadir productos seleccionados
    if (selectedProducts.length > 0) {
      const productIds = selectedProducts.map((product) => product.id);
      productIds.forEach((id, index) => {
        newSubProduct.append(`products[${index}]`, id);
      });
    }

    // Inspeccionar FormData
    console.log("Datos enviados para crear subproducto:");
    for (let pair of newSubProduct.entries()) {
      console.log(`${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`);
    }

    try {
      const response = await ProductDataService.createSubProduct(newSubProduct, token);
      console.log("Respuesta del servidor:", response.data);
      await fetchSubproducts(setSubproducts, token);
      handleCloseCreateModal();
      alert("Subproducto creado exitosamente.");
    } catch (error) {
      console.error("Error al crear subproducto:", error.response?.data);
      alert(
        "Error al crear el subproducto: " +
          (error.response?.data?.error || JSON.stringify(error.response?.data) || error.message)
      );
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Gestión del Directorio</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
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

        <SubproductTable
          filteredSubproducts={currentSubproducts}
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
            setSubproductProductNames(subproduct.product_names || "");
            setBusinessHours(subproduct.business_hours || []);
            setTeamMembers(subproduct.team_members || []);
            setCoupons(subproduct.coupons || []);
            // Automatically set the subproduct's existing products for editing
            setSelectedProducts(
              subproduct.products?.map((product) => ({
                id: product.id,
                name: product.name,
              })) || []
            );
            setShowCreateModal(true);
          }}
          handleDeleteS={(id) => {
            if (window.confirm("¿Estás seguro de eliminar este subproducto?")) {
              ProductDataService.deleteSubProduct(id, token).then(() => {
                fetchSubproducts(setSubproducts, token);
                alert("Subproducto eliminado exitosamente.");
              });
            }
          }}
        />

        <PaginationControls
          currentPage={currentSubproductsPage}
          totalItems={filteredSubproducts.length}
          itemsPerPage={subproductsPerPage}
          setCurrentPage={setCurrentSubproductsPage}
        />

        <CreateServicesModal
          show={showServicesModal}
          onHide={() => setShowServicesModal(false)}
          selectedSubproduct={selectedSubproduct}
          services={services}
          combos={combos}
        />
        <CreateSubproduct
          show={showCreateModal}
          handleClose={handleCloseCreateModal}
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
      </div>
    </div>
  );
};

export default Directory;