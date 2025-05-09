export const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
  
    const columns = Object.keys(data[0]);
    const header = columns.join(';');
    const rows = data.map((user) => columns.map((column) => user[column]).join(';'));
    return header + '\n' + rows.join('\n');
  };