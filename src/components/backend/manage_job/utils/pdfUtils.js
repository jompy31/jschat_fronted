import html2pdf from 'html2pdf.js';

export const downloadPDF = (user, moment) => {
  const content = `
    <div style="font-family: Arial, sans-serif;">
      <h4 style="text-align: center; color: #007bff;">Detalles de ${user.first_name} ${user.last_name}</h4>
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${user.profile_picture}" alt="Profile" style="width: 150px; border-radius: 75px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);" />
        <p style="font-style: italic; color: #555;">${user.email}</p>
      </div>
      <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Información del Usuario</h4>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tbody>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Teléfono</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.phone_number}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Biografía</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.bio}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Ubicación</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${user.address}, ${user.country}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Fecha de Nacimiento</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">${moment(user.date_of_birth).format('DD/MM/YYYY')}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;"><strong>Estado de Empleo</strong></td>
            <td style="border: 1px solid #ddd; padding: 8px;">
              <strong style="color: ${user.openwork ? 'green' : 'red'};">${user.openwork ? 'Disponible' : 'No disponible'}</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Experiencia Laboral</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background-color: #007bff; color: white;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; color: black;">Rol</th>
            <th style="border: 1px solid #ddd; padding: 8px; color: black;">Compañía</th>
            <th style="border: 1px solid #ddd; padding: 8px; color: black;">Desde</th>
            <th style="border: 1px solid #ddd; padding: 8px; color: black;">Hasta</th>
          </tr>
        </thead>
        <tbody>
          ${user.experiences && user.experiences.length > 0
            ? user.experiences
                .map(
                  (exp) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${exp.job_title}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${exp.company_name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${moment(exp.start_date).format('MMMM YYYY')}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${exp.end_date ? moment(exp.end_date).format('MMMM YYYY') : 'Actualidad'}</td>
                </tr>
              `
                )
                .join('')
            : '<tr><td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: center;">No tiene experiencia laboral registrada</td></tr>'}
        </tbody>
      </table>
      <h4 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px;">Profesiones</h4>
      <table style="width: 100%; border-collapse: collapse;">
        <thead style="background-color: #007bff; color: white;">
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; color: black;">Profesiones de candidato</th>
          </tr>
        </thead>
        <tbody>
          ${user.skills && user.skills.length > 0
            ? user.skills
                .map(
                  (skill) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${skill.name}</td>
                </tr>
              `
                )
                .join('')
            : '<tr><td style="border: 1px solid #ddd; padding: 8px; text-align: center;">No tiene habilidades registradas</td></tr>'}
        </tbody>
      </table>
    </div>
  `;

  const pdfElement = document.createElement('div');
  pdfElement.innerHTML = content;
  document.body.appendChild(pdfElement);

  const options = {
    margin: [0.5, 1, 1, 1],
    filename: 'Usuario_Detalles.pdf',
    html2canvas: { scale: 2, logging: true, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };

  html2pdf()
    .from(pdfElement)
    .set(options)
    .save()
    .then(() => {
      document.body.removeChild(pdfElement);
    });
};