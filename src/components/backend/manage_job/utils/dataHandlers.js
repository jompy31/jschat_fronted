export const handleSearch = (data, searchQuery, searchFields, setFilteredData) => {
    const filtered = data.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };
  
  export const paginate = (data, currentPage, itemsPerPage) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return { currentItems, totalPages };
  };
  
  export const mergeUserSkills = (users, skills) => {
    return users.map((user) => {
      const userSkills = skills.filter((skill) => skill.user === user.id);
      return { ...user, skills: userSkills };
    });
  };
  
  export const convertToCSV = (userList, sanitizeInput, moment) => {
    const header = [
      'Nombre',
      'Apellido',
      'Email',
      'Teléfono',
      'Biografía',
      'Ubicación',
      'Fecha de Nacimiento',
      'Estado de Empleo',
      'Experiencia Laboral',
      'Habilidades',
    ]
      .map(sanitizeInput)
      .join(';') + '\n';
  
    const rows = userList.map((user) => {
      const experiences =
        user.experiences && user.experiences.length > 0
          ? user.experiences
              .map(
                (exp) =>
                  `"${sanitizeInput(exp.job_title)} en ${sanitizeInput(exp.company_name)} (${
                    moment(exp.start_date).format('MMMM YYYY')
                  } - ${exp.end_date ? moment(exp.end_date).format('MMMM YYYY') : 'Actualidad'})"`
              )
              .join(';')
          : 'No tiene experiencia laboral registrada';
  
      const skills =
        user.skills && user.skills.length > 0
          ? user.skills.map((skill) => `"${sanitizeInput(skill.name)}"`).join(';')
          : 'No tiene habilidades registradas';
  
      return [
        `"${sanitizeInput(user.first_name)}"`,
        `"${sanitizeInput(user.last_name)}"`,
        `"${sanitizeInput(user.email)}"`,
        `"${sanitizeInput(user.phone_number)}"`,
        `"${sanitizeInput(user.bio?.replace(/"/g, '""') || '')}"`,
        `"${sanitizeInput(user.address)}, ${sanitizeInput(user.country)}"`,
        `"${moment(user.date_of_birth).format('DD/MM/YYYY')}"`,
        `"${user.openwork ? 'Disponible' : 'No disponible'}"`,
        experiences,
        skills,
      ].join(';');
    }).join('\n');
  
    return header + rows;
  };
  
  export const sanitizeInput = (input) => {
    if (!input) return '';
    return input
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/Ñ/g, 'N')
      .replace(/[^a-zA-Z0-9\s.,;:@]/g, '');
  };