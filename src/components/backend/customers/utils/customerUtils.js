export const validateCustomer = (customer) => {
  const requiredFields = ["name", "id_number"];
  for (const field of requiredFields) {
    if (!customer[field]) {
      alert(`Por favor ingrese el ${field === "name" ? "nombre" : "número de identificación"}.`);
      return false;
    }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (customer.email && !emailRegex.test(customer.email)) {
    alert("Formato de correo inválido.");
    return false;
  }
  return true;
};

export const convertToCSV = async (data, fields, token) => {
  const header = fields.join(";");
  const rows = data.map((customer) =>
    fields
      .map((column) => {
        const value = customer[column] || "";
        return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
      })
      .join(";")
  );
  return header + "\n" + rows.join("\n");
};

export const initialCustomerState = {
  name: "",
  id_type: "",
  id_number: "",
  email: "",
  phone_number: "",
  address: "",
  company: "",
  tipo_contacto: "Cliente",
};