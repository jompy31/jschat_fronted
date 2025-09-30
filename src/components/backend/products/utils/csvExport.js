export const exportProductsToCSV = (products) => {
  const headers = ['ID,Nombre,Tipo,Precio Adicional,Características'];
  const rows = products.map(product => [
    product.id,
    product.name,
    product.product_type?.name || 'N/A',
    product.additional_price,
    product.characteristics.map(c => c.name).join(';'),
  ].map(item => `"${item}"`).join(','));

  const csvContent = [
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'products.csv';
  link.click();
};