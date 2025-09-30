import TodoDataService from "../../../../services/todos";

export const loadCustomers = async (token, page = 1, search = "") => {
  try {
    const response = await TodoDataService.getAllCustomers(token, page, 10, search);
    const { results, count } = response.data;
    // Filtrar clientes inválidos
    const validResults = results.filter(customer => customer && customer.id && customer.name);
    return {
      customers: validResults,
      totalCount: count,
    };
  } catch (error) {
    console.error("Error loading customers:", error);
    throw error;
  }
};

export const createCustomer = async (customerData, token) => {
  return TodoDataService.createCustomer(customerData, token);
};

export const updateCustomer = async (id, customerData, token) => {
  return TodoDataService.updateCustomer(id, customerData, token);
};

export const deleteCustomer = async (id, token) => {
  return TodoDataService.deleteCustomer(id, token);
};

export const loadCustomerOrders = async (customerId, token) => {
  try {
    const response = await TodoDataService.getCustomerOrders(customerId, token);
    return response.data.results || [];
  } catch (error) {
    console.error("Error loading customer orders:", error);
    throw error;
  }
};

export const loadCustomerInvoices = async (customerId, token) => {
  try {
    const response = await TodoDataService.getCustomerInvoices(customerId, token);
    return response.data.results || [];
  } catch (error) {
    console.error("Error loading customer invoices:", error);
    throw error;
  }
};