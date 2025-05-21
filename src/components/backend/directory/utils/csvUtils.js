import Papa from "papaparse";
import ProductDataService from "../../../../services/products";
import moment from "moment";

// Function to replace accented characters and corrupted symbols
const replaceAccents = (str) => {
  if (!str) return "";
  const accentMap = {
    'á': 'a', 'Á': 'A',
    'é': 'e', 'É': 'E',
    'í': 'i', 'Í': 'I',
    'ó': 'o', 'Ó': 'O',
    'ú': 'u', 'Ú': 'U',
    'ñ': 'n', 'Ñ': 'N',
    'à': 'a', 'À': 'A',
    'è': 'e', 'È': 'E',
    'ì': 'i', 'Ì': 'I',
    'ò': 'o', 'Ò': 'O',
    'ù': 'u', 'Ù': 'U',
    'ä': 'a', 'Ä': 'A',
    'ë': 'e', 'Ë': 'E',
    'ï': 'i', 'Ï': 'I',
    'ö': 'o', 'Ö': 'O',
    'ü': 'u', 'Ü': 'U',
    '�': '', // Replace corrupted symbol with empty string
  };
  return str
    .replace(/[\u00C0-\u00FF\u0100-\u017F\u0180-\u024F�]/g, (match) => accentMap[match] || '')
    .trim();
};

// Function to validate string for corrupted characters
const isValidString = (str) => {
  if (!str) return true;
  return !str.includes('�');
};

export const handleCsvUpload = async (csvFile, token, setSubproducts) => {
  if (!csvFile) {
    console.error("No se ha seleccionado ningún archivo CSV.");
    return;
  }

  try {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      // Try UTF-8 decoding first
      let csvText;
      const utf8Decoder = new TextDecoder("utf-8");
      csvText = utf8Decoder.decode(arrayBuffer);

      // Check for corrupted characters
      if (csvText.includes('�')) {
        console.warn("Detected corrupted characters in UTF-8 decoding, trying Latin1 fallback...");
        const latin1Decoder = new TextDecoder("iso-8859-1");
        csvText = latin1Decoder.decode(arrayBuffer);
      }

      Papa.parse(csvText, {
        header: true,
        delimiter: ";",
        encoding: "UTF-8",
        skipEmptyLines: true,
        complete: async function (result) {
          const subproductsData = result.data;

          for (const subproduct of subproductsData) {
            // Validate critical fields
            if (!isValidString(subproduct.name) || !isValidString(subproduct.address) || !isValidString(subproduct.description)) {
              console.warn(`Skipping subproduct ${subproduct.name || 'unknown'} due to corrupted characters.`);
              continue;
            }

            const constitucion = subproduct.Constitucion
              ? moment(subproduct.Constitucion, "DD/MM/YYYY").format("YYYY-MM-DD")
              : "";

            // Construct business hours as a list of objects
            const businessHoursArray = [];
            const days = [
              "lunes",
              "martes",
              "miercoles",
              "jueves",
              "viernes",
              "sabado",
              "domingo",
            ];
            days.forEach((day) => {
              const start = subproduct[`${day}_start`];
              const end = subproduct[`${day}_end`];
              if (start && end) {
                businessHoursArray.push({
                  day,
                  start_time: start.length === 5 ? `${start}:00` : start,
                  end_time: end.length === 5 ? `${end}:00` : end,
                });
              }
            });

            const uniqueProducts = new Set(
              subproduct.products
                ? subproduct.products
                    .split(",")
                    .map((p) => Number(p.trim()))
                    .filter((p) => !isNaN(p))
                : []
            );

            const newSubProduct = new FormData(); // Use FormData to match backend expectations
            newSubProduct.append("name", replaceAccents(subproduct.name) || "");
            newSubProduct.append("phone", replaceAccents(subproduct.phone) || "");
            newSubProduct.append("email", replaceAccents(subproduct.email) || "");
            newSubProduct.append("address", replaceAccents(subproduct.address) || "");
            newSubProduct.append("addressmap", replaceAccents(subproduct.addressmap) || "");
            newSubProduct.append("url", replaceAccents(subproduct.url) || "");
            newSubProduct.append("description", replaceAccents(subproduct.description) || "");
            newSubProduct.append("country", replaceAccents(subproduct.country) || "");
            newSubProduct.append("province", replaceAccents(subproduct.province) || "");
            newSubProduct.append("canton", replaceAccents(subproduct.canton) || "");
            newSubProduct.append("distrito", replaceAccents(subproduct.distrito) || "");
            newSubProduct.append("contact_name", replaceAccents(subproduct.contact_name) || "");
            newSubProduct.append("phone_number", replaceAccents(subproduct.phone_number) || "");
            newSubProduct.append("comercial_activity", replaceAccents(subproduct.comercial_activity) || "");
            newSubProduct.append("pay_method", replaceAccents(subproduct.pay_method) || "");
            newSubProduct.append("constitucion", constitucion);
            newSubProduct.append("subcategory", replaceAccents(subproduct.subcategory) || "");
            newSubProduct.append("subsubcategory", replaceAccents(subproduct.subsubcategory) || "");

            // Add business hours
            businessHoursArray.forEach((bh, index) => {
              newSubProduct.append(`business_hours[${index}][day]`, bh.day);
              newSubProduct.append(`business_hours[${index}][start_time]`, bh.start_time);
              newSubProduct.append(`business_hours[${index}][end_time]`, bh.end_time);
            });

            // Add team members
            const teamMembers = [
              {
                name: replaceAccents(subproduct.team_members_name_1),
                position: replaceAccents(subproduct.team_members_position_1),
                photo: replaceAccents(subproduct.team_members_photo_1),
              },
              {
                name: replaceAccents(subproduct.team_members_name_2),
                position: replaceAccents(subproduct.team_members_position_2),
                photo: replaceAccents(subproduct.team_members_photo_2),
              },
            ].filter((member) => member.name && member.position);

            teamMembers.forEach((member, index) => {
              newSubProduct.append(`team_members[${index}][name]`, member.name);
              newSubProduct.append(`team_members[${index}][position]`, member.position);
              if (member.photo) {
                newSubProduct.append(`team_members[${index}][photo_url]`, member.photo);
              }
            });

            // Add coupons
            if (subproduct.coupons_code_1) {
              newSubProduct.append("coupons[0][code]", replaceAccents(subproduct.coupons_code_1) || "");
              newSubProduct.append("coupons[0][name]", "Default Coupon");
              newSubProduct.append("coupons[0][description]", "Default coupon description");
            }

            // Add products
            [...uniqueProducts].forEach((id, index) => {
              newSubProduct.append(`products[${index}]`, id);
            });

            // Add logo and file as URLs
            if (subproduct.logo) {
              newSubProduct.append("logo_url", replaceAccents(subproduct.logo) || "");
            }
            if (subproduct.file) {
              newSubProduct.append("file_url", replaceAccents(subproduct.file) || "");
            }

            // Validate products
            const allProductsResponse = await ProductDataService.getAll();
            const allProducts = allProductsResponse.data;
            const productIds = [...uniqueProducts];
            if (Array.isArray(allProducts)) {
              const validProductIds = allProducts.map((p) => Number(p.id));
              const invalidIds = productIds.filter((id) => !validProductIds.includes(id));
              if (invalidIds.length > 0) {
                console.warn(`Productos con IDs ${invalidIds.join(",")} no existen, omitiendo.`);
                continue;
              }
            }

            // Log FormData for debugging
            console.log(`FormData for subproduct ${subproduct.name}:`);
            for (let pair of newSubProduct.entries()) {
              console.log(`${pair[0]}: ${pair[1]}`);
            }

            // Send the request
            try {
              const response = await ProductDataService.createSubProduct(newSubProduct, token);
              console.log(`Subproducto ${subproduct.name} creado:`, response.data);
            } catch (error) {
              console.error(`Error al crear subproducto ${subproduct.name}:`, error.response?.data || error.message);
            }
          }

          // Refresh subproducts list
          const response = await ProductDataService.getAllSubProduct();
          setSubproducts(response.data);
        },
      });
    };
    reader.readAsArrayBuffer(csvFile);
  } catch (error) {
    console.error("Error al cargar el archivo CSV:", error);
  }
};