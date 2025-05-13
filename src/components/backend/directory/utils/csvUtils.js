import Papa from "papaparse";
import ProductDataService from "../../../../services/products";
import moment from "moment";

export const sanitizeString = (str) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/Ñ/g, "N")
    .trim();
};

export const handleCsvUpload = async (csvFile, token, setSubproducts) => {
  if (!csvFile) {
    console.error("No se ha seleccionado ningún archivo CSV.");
    return;
  }

  try {
    Papa.parse(csvFile, {
      header: true,
      delimiter: ";",
      encoding: "UTF-8",
      skipEmptyLines: true,
      complete: async function (result) {
        const subproductsData = result.data;

        for (const subproduct of subproductsData) {
          const constitucion = subproduct.Constitucion
            ? moment(subproduct.Constitucion, "DD/MM/YYYY").format("YYYY-MM-DD")
            : "";

          const businessHours = {
            lunes: { start: subproduct.lunes_start || "", end: subproduct.lunes_end || "" },
            martes: { start: subproduct.martes_start || "", end: subproduct.martes_end || "" },
            miercoles: { start: subproduct.miercoles_start || "", end: subproduct.miercoles_end || "" },
            jueves: { start: subproduct.jueves_start || "", end: subproduct.jueves_end || "" },
            viernes: { start: subproduct.viernes_start || "", end: subproduct.viernes_end || "" },
            sabado: { start: subproduct.sabado_start || "", end: subproduct.sabado_end || "" },
            domingo: { start: subproduct.domingo_start || "", end: subproduct.domingo_end || "" },
          };

          const businessHoursJson = JSON.stringify(businessHours);
          const uniqueProducts = new Set(
            Array.isArray(subproduct.products)
              ? subproduct.products.map((p) => Number(p)).filter((p) => !isNaN(p))
              : [Number(subproduct.products)].filter((p) => !isNaN(p))
          );

          const newSubProduct = {
            name: sanitizeString(subproduct.name),
            phone: sanitizeString(subproduct.phone),
            email: sanitizeString(subproduct.email),
            address: sanitizeString(subproduct.address),
            addressmap: sanitizeString(subproduct.addressmap),
            url: sanitizeString(subproduct.url),
            description: sanitizeString(subproduct.description),
            country: sanitizeString(subproduct.country),
            province: sanitizeString(subproduct.province),
            canton: sanitizeString(subproduct.canton),
            distrito: sanitizeString(subproduct.distrito),
            contact_name: sanitizeString(subproduct.contact_name),
            phone_number: sanitizeString(subproduct.phone_number),
            constitucion: constitucion,
            comercial_activity: sanitizeString(subproduct.comercial_activity),
            pay_method: sanitizeString(subproduct.pay_method),
            business_hours: businessHoursJson,
            products: [...uniqueProducts],
            coupons: subproduct.coupons_code_1 ? [sanitizeString(subproduct.coupons_code_1)] : [],
            team_members: [
              {
                name: sanitizeString(subproduct.team_members_name_1),
                position: sanitizeString(subproduct.team_members_position_1),
                photo: sanitizeString(subproduct.team_members_photo_1),
              },
              {
                name: sanitizeString(subproduct.team_members_name_2),
                position: sanitizeString(subproduct.team_members_position_2),
                photo: sanitizeString(subproduct.team_members_photo_2),
              },
            ],
            logo: sanitizeString(subproduct.logo),
            file: sanitizeString(subproduct.file),
          };

          const allProductsResponse = await ProductDataService.getAll();
          const allProducts = allProductsResponse.data;

          if (Array.isArray(allProducts)) {
            const existingProduct = allProducts.find((product) =>
              [...uniqueProducts].some((productId) => productId === Number(product.id))
            );

            if (existingProduct && !uniqueProducts.has(Number(existingProduct.id))) {
              uniqueProducts.add(Number(existingProduct.id));
            }
          }

          newSubProduct.products = [...uniqueProducts];
          await ProductDataService.createSubProduct(newSubProduct, token);
        }

        const response = await ProductDataService.getAllSubProduct();
        setSubproducts(response.data);
      },
    });
  } catch (error) {
    console.error("Error al cargar el archivo CSV:", error);
  }
};