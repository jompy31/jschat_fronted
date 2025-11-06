// frontend_github\jschat_fronted\src\components\backend\users\utils\convertToCSV.js

export const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';

  // === Mapeo de columnas en español ===
  const columnMapping = {
    id: 'ID',
    first_name: 'Nombre',
    last_name: 'Apellido',
    email: 'Correo',
    staff_status: 'Rol',
    created_at: 'Fecha de Creacion',
    phone_number: 'Telefono',
    address: 'Direccion',
    profile_picture: 'Foto de Perfil',
  };

  // === Orden deseado de columnas (opcional, pero recomendado) ===
  const orderedColumns = [
    'id',
    'first_name',
    'last_name',
    'email',
    'staff_status',
    'phone_number',
    'address',
    'created_at',
    'profile_picture',
  ];

  // === Cabecera en español ===
  const header = orderedColumns.map(col => columnMapping[col]).join(';');

  // === Filas con datos en orden ===
  const rows = data.map((user) =>
    orderedColumns
      .map((col) => {
        let value = user[col] || '';

        // Formatear fecha
        if (col === 'created_at' && value) {
          try {
            value = new Date(value).toLocaleDateString('es-CR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
          } catch (e) {
            value = '';
          }
        }

        // Escapar comillas dobles y punto y coma
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""'); // Escapar comillas
          if (value.includes(';') || value.includes('"') || value.includes('\n')) {
            value = `"${value}"`;
          }
        }

        return value;
      })
      .join(';')
  );

  return header + '\n' + rows.join('\n');
};